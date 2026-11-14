/* saoluu.js — sao lưu / khôi phục một chạm: ngân hàng đề (IndexedDB), mẫu ma trận, cài đặt, đề đã ra, bài chấm và kết quả (localStorage)
   File sao lưu: .zip chứa saoluu.json (đọc được trên mọi máy có trang Học cùng Thầy Hiếu). */
(function (G) {
  "use strict";
  const DB = "hcth-nganhang";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // khoá localStorage của trang (bỏ qua khoá lạ của trang web khác cùng tên miền github.io)
  const MINE = /^(rd-|mp-|mt-mau|mt\||sc\||ct\||pct\||imon\||used\||mt-truoc\||cham-|phieu-|pt-|hcth-)/;
  function loadScript(src) { return new Promise((res, rej) => { if (G.JSZip) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Không tải được thư viện nén")); document.head.appendChild(s); }); }
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains("q")) d.createObjectStore("q", { keyPath: "k" }).createIndex("ml", "ml"); if (!d.objectStoreNames.contains("dang")) d.createObjectStore("dang", { keyPath: "k" }).createIndex("ml", "ml"); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  const getAll = (d, n) => new Promise((res, rej) => { const r = d.transaction(n, "readonly").objectStore(n).getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  function putAll(d, n, arr) { return new Promise((res, rej) => { const t = d.transaction(n, "readwrite"); const s = t.objectStore(n); arr.forEach(x => s.put(x)); t.oncomplete = res; t.onerror = () => rej(t.error); }); }

  async function collect() {
    const ls = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (MINE.test(k)) ls[k] = localStorage.getItem(k); }
    let q = [], dang = [];
    try { const d = await openDB(); q = await getAll(d, "q"); dang = await getAll(d, "dang"); d.close(); } catch (e) { console.warn(e); }
    return { app: "hoc-cung-thay-hieu", v: 1, t: new Date().toISOString(), may: navigator.userAgent, ls, q, dang };
  }
  function summary(o) {
    const ml = {}; (o.q || []).forEach(x => ml[x.ml] = (ml[x.ml] || 0) + 1);
    let bai = [], kq = 0; try { bai = JSON.parse(o.ls["cham-bai"] || "[]"); } catch (e) {}
    Object.keys(o.ls || {}).forEach(k => { if (/^cham-kq-/.test(k)) { try { kq += JSON.parse(o.ls[k]).length; } catch (e) {} } });
    let mau = 0; try { mau = JSON.parse(o.ls["mt-mau"] || "[]").length; } catch (e) {}
    let de = 0; try { de = JSON.parse(o.ls["rd-de"] || "[]").length; } catch (e) {}
    return { ml, nq: (o.q || []).length, bai: bai.length, kq, mau, de };
  }
  const sumText = s => [s.nq ? `${s.nq.toLocaleString("vi-VN")} câu hỏi (${Object.entries(s.ml).map(([k, n]) => k.replace("|", " lớp ") + ": " + n.toLocaleString("vi-VN")).join("; ")})` : "chưa có ngân hàng", `${s.mau} mẫu ma trận`, `${s.de} đề đã ra`, `${s.bai} bài chấm, ${s.kq} phiếu đã chấm`].join(" · ");

  async function xuat(onMsg) {
    onMsg && onMsg("Đang gom dữ liệu…");
    await loadScript("assets/lib/jszip.min.js");
    const o = await collect(); const s = summary(o);
    const z = new JSZip(); z.file("saoluu.json", JSON.stringify(o));
    z.file("DOC_TOI.txt", "File sao lưu của trang Học cùng Thầy Hiếu (" + o.t + ").\nNội dung: " + sumText(s) + "\n\nKhôi phục: mở trang chủ → mục Sao lưu dữ liệu → Khôi phục từ file → chọn chính file .zip này (không cần giải nén).");
    onMsg && onMsg("Đang nén…");
    const blob = await z.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const d = new Date(); const p = n => String(n).padStart(2, "0");
    const name = `SaoLuu_HocCungThayHieu_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.zip`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    try { localStorage.setItem("hcth-saoluu-cuoi", JSON.stringify({ t: Date.now(), name })); } catch (e) {}
    return { name, size: blob.size, s };
  }
  async function doc(file) {
    let o;
    if (/\.zip$/i.test(file.name) || (await file.slice(0, 2).text()) === "PK") {
      await loadScript("assets/lib/jszip.min.js"); const z = await JSZip.loadAsync(await file.arrayBuffer());
      const f = z.file("saoluu.json") || Object.values(z.files).find(e => /saoluu\.json$/i.test(e.name)); if (!f) throw new Error("File .zip này không phải file sao lưu của trang.");
      o = JSON.parse(await f.async("string"));
    } else o = JSON.parse(await file.text());
    if (!o || o.app !== "hoc-cung-thay-hieu") throw new Error("Không phải file sao lưu của trang Học cùng Thầy Hiếu.");
    return o;
  }
  /* khôi phục kiểu GỘP: câu hỏi trùng mã được ghi đè; bài chấm và kết quả được gộp (không mất dữ liệu đang có trên máy) */
  async function nap(o, onMsg) {
    const ls = o.ls || {};
    Object.entries(ls).forEach(([k, v]) => {
      try {
        if (k === "cham-bai") {
          const cur = JSON.parse(localStorage.getItem(k) || "[]"); const inc = JSON.parse(v); const ids = new Set(cur.map(b => b.id));
          inc.forEach(b => { if (ids.has(b.id)) { const i = cur.findIndex(x => x.id === b.id); cur[i] = Object.assign({}, b, cur[i], { meta: cur[i].meta || b.meta }); } else cur.push(b); });
          localStorage.setItem(k, JSON.stringify(cur));
        } else if (/^cham-kq-/.test(k)) {
          const cur = JSON.parse(localStorage.getItem(k) || "[]"); const inc = JSON.parse(v); const by = new Map(cur.map(r => [r.sbd, r]));
          inc.forEach(r => { const c = by.get(r.sbd); if (!c || (r.t || 0) > (c.t || 0)) by.set(r.sbd, r); });
          localStorage.setItem(k, JSON.stringify([...by.values()]));
        } else if (k === "mt-mau" || k === "rd-de") {
          const cur = JSON.parse(localStorage.getItem(k) || "[]"); const inc = JSON.parse(v); const id = x => k === "rd-de" ? x.sig : x.mon + "|" + x.lop + "|" + x.ten;
          const m = new Map(inc.map(x => [id(x), x])); cur.forEach(x => m.set(id(x), x)); localStorage.setItem(k, JSON.stringify([...m.values()]));
        } else if (k === "hcth-saoluu-cuoi") { /* bỏ qua */ }
        else localStorage.setItem(k, v);
      } catch (e) { console.warn(k, e); if (/quota/i.test(String(e && e.name))) throw new Error("Bộ nhớ trình duyệt đầy"); }
    });
    if ((o.q || []).length || (o.dang || []).length) {
      const d = await openDB();
      for (let i = 0; i < o.q.length; i += 3000) { onMsg && onMsg(`Đang nạp ngân hàng ${Math.min(o.q.length, i + 3000).toLocaleString("vi-VN")}/${o.q.length.toLocaleString("vi-VN")} câu…`); await putAll(d, "q", o.q.slice(i, i + 3000)); }
      await putAll(d, "dang", o.dang || []); d.close();
    }
    return summary(o);
  }

  /* giao diện gắn vào một phần tử */
  function mount(el, opt) {
    opt = opt || {};
    el.innerHTML = `<div class="sl">
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button class="btn green" type="button" data-x>💾 Sao lưu toàn bộ</button>
        <label class="btn ghost">📂 Khôi phục từ file<input type="file" accept=".zip,.json,application/zip,application/json" hidden data-n></label>
      </div>
      <div class="small muted" data-i style="margin-top:6px"></div>
      <div data-m></div></div>`;
    const $ = s => el.querySelector(s); const msg = h => $("[data-m]").innerHTML = h;
    const info = async () => {
      let last = null; try { last = JSON.parse(localStorage.getItem("hcth-saoluu-cuoi") || "null"); } catch (e) {}
      let txt = "";
      try { const o = await collect(); txt = "Trên máy này: " + sumText(summary(o)) + "."; } catch (e) {}
      $("[data-i]").innerHTML = esc(txt) + (last ? ` Lần sao lưu gần nhất: <b>${new Date(last.t).toLocaleString("vi-VN")}</b>.` : ` <b style="color:#b0163d">Chưa sao lưu lần nào.</b>`);
    };
    $("[data-x]").onclick = async () => {
      const b = $("[data-x]"); b.disabled = true;
      try { const r = await xuat(t => msg(`<div class="note blue small">${esc(t)}</div>`)); msg(`<div class="note green small">Đã tải về <b>${esc(r.name)}</b> (${(r.size / 1048576).toFixed(1).replace(".", ",")} MB). Thầy chép file này vào Google Drive hoặc USB. Khi đổi máy: mở trang chủ → Khôi phục từ file.</div>`); info(); }
      catch (e) { msg(`<div class="note red small">Lỗi: ${esc(e.message || e)}</div>`); }
      b.disabled = false;
    };
    $("[data-n]").onchange = async e => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      try {
        msg(`<div class="note blue small">Đang đọc file…</div>`);
        const o = await doc(f); const s = summary(o);
        if (!confirm(`Khôi phục dữ liệu sao lưu ngày ${new Date(o.t).toLocaleString("vi-VN")}?\n\n${sumText(s)}\n\nDữ liệu được GỘP vào máy này: câu hỏi trùng mã được ghi đè, bài chấm và kết quả được gộp lại, không xoá dữ liệu đang có.`)) { msg(""); return; }
        await nap(o, t => msg(`<div class="note blue small">${esc(t)}</div>`));
        msg(`<div class="note green small">Đã khôi phục xong: ${esc(sumText(s))}. ${opt.reload === false ? "" : "Trang sẽ tải lại…"}</div>`); info();
        if (opt.reload !== false) setTimeout(() => location.reload(), 1500);
      } catch (err) { msg(`<div class="note red small">Không khôi phục được: ${esc(err.message || err)}</div>`); }
    };
    info();
  }
  G.SaoLuu = { collect, summary, xuat, doc, nap, mount };
})(window);
