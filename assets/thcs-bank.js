/* thcs-bank.js — đọc file ngân hàng bài tập Toán 6–9 (NH_<khối>H<kì>_C<chương>_B<bài>_D<dạng>.tex, môi trường cauhoi).
   ThcsBank.docTep(ten, tex) → { ma, khoi, hk, chuong, bai, dang, tenChuong, tenBai, tenDang, cau:[{ma, loai:"TL"|"TN", muc, de, lg?, pa?, da?}] }
   ThcsBank.banHS(dang) → bỏ lời giải, đáp án.   Cần DeCuongTeX (assets/decuong-tex.js) để đổi TeX → HTML. */
(function (G) {
  "use strict";
  const T = () => G.DeCuongTeX;
  function nhom(s, i) { let d = 0, j = i; while (j < s.length) { const c = s[j]; if (c === "\\") { j += 2; continue; } if (c === "{") d++; else if (c === "}") { d--; if (!d) return [s.slice(i + 1, j), j + 1]; } j++; } return [s.slice(i + 1), s.length]; }
  const sach = s => s.replace(/(^|[^\\])%[^\n]*/g, "$1");
  function lay(s, re) { const m = re.exec(s); return m ? nhom(s, m.index + m[0].length - 1)[0] : ""; }
  function docTep(ten, tex) {
    const s = sach(tex);
    const mm = /(\d)H(\d)[-_]C(\d+)[-_]B(\d+)[-_]D(\d+)/.exec(ten) || /(\d)H(\d)-C(\d+)-B(\d+)-D(\d+)/.exec(s);
    if (!mm || !/\\begin\{cauhoi\}/.test(s)) return null;
    const [, khoi, hk, chuong, bai, dang] = mm;
    const ds = [...s.matchAll(/\\textbf\{((?:Chương|Bài|Dạng)[^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)].map(x => x[1]);
    const tenChuong = (ds.find(x => /^Chương/.test(x)) || "").replace(/^Chương\s*\d+\.\s*/, "");
    const tenBai = (ds.find(x => /^Bài/.test(x)) || "").replace(/^Bài\s*\d+\.\s*/, "");
    let tenDang = (ds.find(x => /^Dạng/.test(x)) || ""); const nc = /^Dạng\s*D?\d+\s*\(([^)]*)\)/.exec(tenDang);
    tenDang = tenDang.replace(/^Dạng\s*D?\d+\s*(\([^)]*\))?\s*:\s*/, "").replace(/^Dạng\s*D?\d+\s*(\([^)]*\))?\s*[-–—]+\s*/, "") + (nc ? ` (${nc[1]})` : "");
    const cau = [];
    const re = /\\begin\{cauhoi\}\{([^}]*)\}\{([^}]*)\}/g; let m;
    while ((m = re.exec(s))) {
      const ma = (/^\d+H\d-C/.test(m[1].trim()) ? m[1] : m[2]).trim(), e = s.indexOf("\\end{cauhoi}", re.lastIndex);
      let body = s.slice(re.lastIndex, e < 0 ? s.length : e);
      const k = /-(TL|TN)-(NB|TH|VD|VDC)-(\d+)$/.exec(ma); if (!k) continue;
      const q = { ma, loai: k[1], muc: k[2], tex: {} };
      const li = body.search(/\\loigiai\{/);
      if (li >= 0) { const [g, j] = nhom(body, body.indexOf("{", li)); q.lg = T().html(g); q.tex.lg = g.trim(); body = body.slice(0, li) + body.slice(j); }
      const da = body.search(/\\dapan\{/);
      if (da >= 0) { const [g, j] = nhom(body, body.indexOf("{", da)); q.da = "ABCD".indexOf(g.trim()[0]); body = body.slice(0, da) + body.slice(j); }
      if (q.loai === "TN") {
        const a = body.indexOf("\\begin{tasks}"), b = body.indexOf("\\end{tasks}");
        if (a >= 0 && b > a) {
          const inner = body.slice(a, b).replace(/^\\begin\{tasks\}(\(\d+\))?/, "");
          const raw = inner.split(/\\task(?![A-Za-z])/).slice(1).map(x => x.trim());
          q.pa = raw.map(x => T().html(x).replace(/\.$/, "")); q.tex.pa = raw;
          body = body.slice(0, a) + body.slice(b + 11);
        }
        if (!q.pa || q.pa.length !== 4 || !(q.da >= 0)) continue;
      }
      q.de = T().html(body.trim()); q.tex.de = body.trim();
      cau.push(q);
    }
    const sach2 = x => x.replace(/---?/g, "–").replace(/\\([%&#])/g, "$1").replace(/\\[a-zA-Z]+\s*/g, "").replace(/[{}]/g, "").trim();
    tenDang = sach2(tenDang);
    return { ma: `${khoi}H${hk}-C${chuong}-B${bai}-D${dang.padStart(2, "0")}`, khoi, hk, chuong, bai, dang: "D" + dang.padStart(2, "0"), tenChuong: sach2(tenChuong), tenBai: sach2(tenBai), tenDang, cau };
  }
  /* ---- kho ngân hàng trên máy giáo viên (IndexedDB) ---- */
  const DBN = "hcth-thcs";
  const moDB = () => new Promise((ok, loi) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => r.result.createObjectStore("dang"); r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error); });
  async function luu(ds) { const db = await moDB(); return new Promise((ok, loi) => { const tx = db.transaction("dang", "readwrite"); const s = tx.objectStore("dang"); ds.forEach(d => s.put(d, d.ma)); tx.oncomplete = () => ok(ds.length); tx.onerror = () => loi(tx.error); }); }
  async function tatCa(khoi) { const db = await moDB(); return new Promise(ok => { const out = {}; db.transaction("dang").objectStore("dang").openCursor().onsuccess = e => { const c = e.target.result; if (c) { if (!khoi || c.value.khoi === String(khoi)) out[c.key] = c.value; c.continue(); } else ok(out); }; }); }
  async function demKho() { const db = await moDB(); return new Promise(ok => { const r = db.transaction("dang").objectStore("dang").count(); r.onsuccess = () => ok(r.result); r.onerror = () => ok(0); }); }
  async function xoaKho() { const db = await moDB(); return new Promise(ok => { const tx = db.transaction("dang", "readwrite"); tx.objectStore("dang").clear(); tx.oncomplete = ok; }); }
  /* nạp file: .tex lẻ, .zip (đọc mọi NH_*.tex), hoặc .json (đã tách) */
  async function napFile(files, onTien) {
    const ds = []; let n = 0;
    const them = (ten, tex) => { const d = docTep(ten, tex); if (d && d.cau.length) ds.push(d); };
    for (const f of files) {
      if (/\.zip$/i.test(f.name)) {
        const z = await JSZip.loadAsync(f); const ps = Object.keys(z.files).filter(p => /\.tex$/i.test(p) && !/__MACOSX/.test(p) && /\dH\d[_-]C\d+[_-]B\d+[_-]D\d+/.test(p));
        for (const p of ps) { them(p.split("/").pop(), await z.files[p].async("string")); if (onTien && ++n % 10 === 0) onTien(n, ps.length); }
      } else if (/\.tex$/i.test(f.name)) them(f.name, await f.text());
    }
    await luu(ds); return ds;
  }
  const banHS = d => Object.assign({}, d, { cau: d.cau.map(q => q.loai === "TN" ? { ma: q.ma, loai: q.loai, muc: q.muc, de: q.de, pa: q.pa } : { ma: q.ma, loai: q.loai, muc: q.muc, de: q.de }) });
  G.ThcsBank = { docTep, banHS, luu, tatCa, demKho, xoaKho, napFile };
})(typeof window !== "undefined" ? window : globalThis);
