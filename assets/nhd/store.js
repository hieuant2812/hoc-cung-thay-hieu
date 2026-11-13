/* nhd/store.js — lưu ngân hàng đề trong trình duyệt (IndexedDB), đọc file .tex / .zip / thư mục */
(function (G) {
  "use strict";
  const NHD = G.NHD = G.NHD || {};
  const DB = "hcth-nganhang", VER = 1;
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB, VER);
      r.onupgradeneeded = () => {
        const d = r.result;
        if (!d.objectStoreNames.contains("q")) { const s = d.createObjectStore("q", { keyPath: "k" }); s.createIndex("ml", "ml"); }
        if (!d.objectStoreNames.contains("dang")) { const s = d.createObjectStore("dang", { keyPath: "k" }); s.createIndex("ml", "ml"); }
      };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const tx = async (stores, mode, fn) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(stores, mode); let out; Promise.resolve(fn(t)).then(v => out = v); t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); };
  const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  const Store = {
    /* lưu câu hỏi: mỗi câu cần q.mon, q.lop, q.id. Trả số câu mới/ghi đè */
    async put(questions, dang) {
      await tx(["q", "dang"], "readwrite", t => {
        const s = t.objectStore("q");
        questions.forEach(q => { q.ml = q.mon + "|" + q.lop; q.k = q.ml + "|" + q.id; s.put(q); });
        const sd = t.objectStore("dang");
        Object.entries(dang || {}).forEach(([k, ten]) => { const [ml, dkey] = [k.slice(0, k.lastIndexOf("|")), k.slice(k.lastIndexOf("|") + 1)]; sd.put({ k, ml, dkey, ten }); });
      });
      return questions.length;
    },
    async load(mon, lop) {
      const ml = mon + "|" + lop;
      return tx(["q", "dang"], "readonly", async t => {
        const qs = await reqP(t.objectStore("q").index("ml").getAll(ml));
        const ds = await reqP(t.objectStore("dang").index("ml").getAll(ml));
        const dang = {}; ds.forEach(d => dang[d.dkey] = d.ten);
        return { questions: qs, dang };
      });
    },
    async clear(mon, lop) {
      const ml = mon + "|" + lop;
      return tx(["q", "dang"], "readwrite", t => {
        ["q", "dang"].forEach(n => { const ix = t.objectStore(n).index("ml"); const c = ix.openKeyCursor(IDBKeyRange.only(ml)); c.onsuccess = () => { const cur = c.result; if (cur) { t.objectStore(n).delete(cur.primaryKey); cur.continue(); } }; });
      });
    },
    async count() { return tx(["q"], "readonly", t => reqP(t.objectStore("q").count())); },
    async counts() { // {"Toán|12": n}
      const out = {};
      await tx(["q"], "readonly", t => new Promise(res => { const c = t.objectStore("q").index("ml").openKeyCursor(); c.onsuccess = () => { const cur = c.result; if (!cur) return res(); out[cur.key] = (out[cur.key] || 0) + 1; cur.continue(); }; }));
      return out;
    },

    /* gom các file .tex từ: FileList / mảng File / DataTransfer (kéo thả thư mục). Giải nén .zip (kể cả zip lồng nhau). */
    async collect(source, onFile) {
      const out = [];
      const okName = n => !/(^|\/)(__MACOSX|\._)/.test(n) && !/(^|\/)\./.test(n.split("/").pop());
      async function addZip(buf, prefix) {
        if (!G.JSZip) throw new Error("Thiếu thư viện giải nén");
        const z = await JSZip.loadAsync(buf);
        const ents = Object.values(z.files).filter(e => !e.dir && okName(e.name));
        for (const e of ents) {
          if (/\.tex$/i.test(e.name)) { out.push({ name: prefix + e.name, text: await e.async("string") }); onFile && onFile(prefix + e.name); }
          else if (/\.zip$/i.test(e.name)) await addZip(await e.async("arraybuffer"), prefix + e.name + "/");
        }
      }
      async function addFile(f, path) {
        const name = path || f.webkitRelativePath || f.name;
        if (!okName(name)) return;
        if (/\.tex$/i.test(name)) { out.push({ name, text: await f.text() }); onFile && onFile(name); }
        else if (/\.zip$/i.test(name)) await addZip(await f.arrayBuffer(), name + "/");
      }
      function readEntry(en, path) {
        return new Promise(res => {
          if (en.isFile) en.file(async f => { await addFile(f, path + en.name); res(); }, () => res());
          else if (en.isDirectory) {
            const rd = en.createReader(); const all = [];
            const step = () => rd.readEntries(async es => { if (!es.length) { for (const e of all) await readEntry(e, path + en.name + "/"); res(); } else { all.push(...es); step(); } }, () => res());
            step();
          } else res();
        });
      }
      if (source && source.items && source.items.length && source.items[0].webkitGetAsEntry) {
        const ens = [...source.items].map(it => it.webkitGetAsEntry && it.webkitGetAsEntry()).filter(Boolean);
        for (const en of ens) await readEntry(en, "");
      } else {
        const files = source && source.files ? source.files : source;
        for (const f of [...files]) await addFile(f);
      }
      return out;
    }
  };
  NHD.Store = Store;
})(window);
