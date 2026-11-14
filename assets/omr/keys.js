/* omr/keys.js — đóng gói đáp án để chuyển sang điện thoại (mã QR / file .json) và lưu bài chấm */
(function (G) {
  "use strict";
  const OMR = G.OMR = G.OMR || {};
  const MONC = { "Toán": "T", "Vật lí": "L", "Hoá học": "H", "KHTN": "K", "Khác": "X" };
  const CMON = Object.fromEntries(Object.entries(MONC).map(([k, v]) => [v, k]));
  /* bai = {ten, mon, preset, keys:{ "101": {TN:["A",...], DS:["ĐSĐS",...], TLN:["2,5",...]} }} */
  function pack(bai) {
    const parts = ["HT1", MONC[bai.mon] || "X", encodeURIComponent(bai.ten || ""), bai.preset || ""];
    Object.entries(bai.keys).forEach(([ma, k]) => parts.push(ma + "=" + (k.TN || []).join("") + "/" + (k.DS || []).map(s => s.replace(/Đ/g, "D")).join(",") + "/" + (k.TLN || []).map(x => String(x).replace(/[_;=\/]/g, "")).join("_")));
    return parts.join(";");
  }
  function unpack(s) {
    s = String(s || "").trim();
    const hk = s.indexOf("#k="); if (hk >= 0) s = decodeURIComponent(s.slice(hk + 3));
    if (s.startsWith("{")) { const o = JSON.parse(s); if (!o.keys) throw new Error("File không có đáp án"); return o; }
    const p = s.split(";"); if (p[0] !== "HT1") throw new Error("Không phải mã đáp án của trang Học cùng Thầy Hiếu");
    const bai = { mon: CMON[p[1]] || "Khác", ten: decodeURIComponent(p[2] || ""), preset: p[3] || "", keys: {} };
    p.slice(4).forEach(x => { const [ma, v] = x.split("="); const [tn, ds, tln] = (v || "").split("/"); bai.keys[ma] = { TN: (tn || "").split(""), DS: ds ? ds.split(",").map(z => z.replace(/D/g, "Đ")) : [], TLN: tln ? tln.split("_") : [] }; });
    return bai;
  }
  /* kho trên máy */
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { alert("Bộ nhớ trình duyệt đầy — hãy xuất Excel rồi xoá bớt bài cũ."); } } };
  const Kho = {
    list: () => LS.get("cham-bai", []),
    save(bai) { const L = Kho.list(); if (!bai.id) bai.id = "b" + Date.now().toString(36); const i = L.findIndex(b => b.id === bai.id); if (i >= 0) L[i] = bai; else L.unshift(bai); LS.set("cham-bai", L); return bai; },
    del(id) { LS.set("cham-bai", Kho.list().filter(b => b.id !== id)); localStorage.removeItem("cham-kq-" + id); },
    results: id => LS.get("cham-kq-" + id, []),
    setResults: (id, r) => LS.set("cham-kq-" + id, r),
    get: id => Kho.list().find(b => b.id === id)
  };
  /* chuyển bài chấm + kết quả giữa điện thoại và máy tính */
  function exportKQ(ids) {
    const L = Kho.list().filter(b => !ids || ids.includes(b.id));
    return { type: "hcth-ketqua", v: 1, t: new Date().toISOString(), bai: L.map(b => Object.assign({}, b, { results: Kho.results(b.id), ds: LS.get("cham-ds-" + b.id, {}) })) };
  }
  function importKQ(o) {
    if (!o || o.type !== "hcth-ketqua" || !Array.isArray(o.bai)) throw new Error("Không phải file kết quả chấm của trang Học cùng Thầy Hiếu");
    let nb = 0, nr = 0;
    o.bai.forEach(x => {
      const { results, ds } = x; const b = Object.assign({}, x); delete b.results; delete b.ds;
      const old = Kho.get(b.id); if (old) { b.meta = old.meta || b.meta; b.lopHoc = old.lopHoc || b.lopHoc; }
      Kho.save(b); nb++;
      const by = new Map(Kho.results(b.id).map(r => [r.sbd, r]));
      (results || []).forEach(r => { const c = by.get(r.sbd); if (!c || (r.t || 0) >= (c.t || 0)) { by.set(r.sbd, r); nr++; } });
      Kho.setResults(b.id, [...by.values()]);
      if (ds && Object.keys(ds).length) LS.set("cham-ds-" + b.id, Object.assign({}, LS.get("cham-ds-" + b.id, {}), ds));
    });
    return { nb, nr };
  }
  Object.assign(OMR, { pack, unpack, Kho, exportKQ, importKQ });
})(typeof window !== "undefined" ? window : globalThis);
