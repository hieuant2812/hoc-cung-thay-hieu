/* tailieu.js — Tài liệu học tập (đề cương theo bài).
   Học sinh: xem bản học sinh (chỗ điền để trống, không lời giải, không đáp án) — file data/decuong/hs-<lớp>.json.
   Giáo viên: mở bản giáo viên (file mã hoá gv-<lớp>.hcth, nhập mật khẩu) hoặc đề cương đang soạn trên máy;
              nạp file TeX/zip, sửa từng bài, xem trước, xuất bản (bản HS + bản GV mã hoá) để tải lên GitHub. */
(function (G) {
  "use strict";
  const CHAN = "GV: ThS Nguyễn Hoàng Minh Hiếu - GV Toán THPT An Nhơn Tây";
  const LAMA = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const MAU = [["#3b7bff", "#eef4ff"], ["#10b3a3", "#e6f8f5"], ["#ff6f4a", "#fff1ec"], ["#8a5cf6", "#f3eeff"], ["#2fb35a", "#eaf8ee"], ["#ff4f87", "#fff0f5"], ["#e09a12", "#fff7e6"], ["#0ea5e9", "#e8f6fd"], ["#c2557a", "#fbeef3"]];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const MACROS = { "\\vt": "\\overrightarrow{#1}", "\\vtk": "\\overrightarrow{0}", "\\dc": "^{\\circ}", "\\R": "\\mathbb{R}", "\\N": "\\mathbb{N}", "\\Z": "\\mathbb{Z}", "\\Q": "\\mathbb{Q}",
    "\\heva": "\\left\\{\\begin{array}{l}#1\\end{array}\\right.", "\\heval": "\\left\\{\\begin{array}{ll}#1\\end{array}\\right.", "\\hevab": "\\left\\{\\begin{array}{ll}#1\\end{array}\\right.",
    "\\hoac": "\\left[\\begin{array}{l}#1\\end{array}\\right.", "\\abs": "\\left|#1\\right|", "\\sd": "\\text{sđ}\\,", "\\kZ": "\\ (k\\in\\mathbb{Z})",
    "\\limx": "\\lim\\limits_{x\\to #1}", "\\limn": "\\lim\\limits_{n\\to+\\infty}", "\\ldot": "\\lim\\limits", "\\cotg": "\\cot", "\\Rightarrowx": "\\Rightarrow" };
  const KT = (src, disp) => { try { return katex.renderToString(src, { throwOnError: false, displayMode: disp, macros: Object.assign({}, MACROS), trust: c => c.command === "\\htmlClass", strict: false }); } catch (e) { return esc(src); } };
  let DSHINH = {}, HINHMOI = {};
  const anh = h => { if (HINHMOI[h]) return `<img class="hdc" src="${HINHMOI[h]}" alt="Hình">`; if (DSHINH[h]) return `<img class="hdc" src="data/decuong/hinh/${h}${DSHINH[h]}" loading="lazy" alt="Hình">`; return `<span class="hinhthieu" data-h="${h}">🖼 Hình TikZ chưa có ảnh (mã ${h})</span>`; };
  const ve = h => String(h || "").replace(/\[\[HINH:([0-9a-f]{8})\]\]/g, (m, x) => anh(x)).replace(/\$\$([\s\S]+?)\$\$|\$((?:\\\$|[^$])+?)\$/g, (m, a, b) => a !== undefined ? KT(a, true) : KT(b, false));

  /* ---------------- kho đề cương đang soạn (IndexedDB, chỉ trên máy GV) ---------------- */
  const DBN = "hcth-decuong";
  const moDB = () => new Promise((ok, loi) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => { r.result.createObjectStore("tep"); r.result.createObjectStore("hinh"); }; r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error); });
  async function kho(store, mode, fn) { const db = await moDB(); return new Promise((ok, loi) => { const tx = db.transaction(store, mode); const st = tx.objectStore(store); const r = fn(st); tx.oncomplete = () => ok(r && r.result !== undefined ? r.result : r); tx.onerror = () => loi(tx.error); }); }
  const ganTep = (ten, v) => kho("tep", "readwrite", s => s.put(v, ten));
  const xoaTep = ten => kho("tep", "readwrite", s => s.delete(ten));
  async function tatCaTep() { const db = await moDB(); return new Promise(ok => { const out = {}; const tx = db.transaction("tep"); tx.objectStore("tep").openCursor().onsuccess = e => { const c = e.target.result; if (c) { out[c.key] = c.value; c.continue(); } else ok(out); }; }); }
  async function tatCaHinh() { const db = await moDB(); return new Promise(ok => { const out = {}; const tx = db.transaction("hinh"); tx.objectStore("hinh").openCursor().onsuccess = e => { const c = e.target.result; if (c) { out[c.key] = c.value; c.continue(); } else ok(out); }; }); }
  const ganHinh = (h, v) => kho("hinh", "readwrite", s => s.put(v, h));

  /* gom các file TeX của một lớp thành dữ liệu bản GV */
  function gom(teps, lop) {
    const D = { lop, bai: {}, ontap: {}, hinh: {} };
    Object.entries(teps).filter(([, v]) => v.lop === lop).sort((a, b) => a[0].localeCompare(b[0], "vi", { numeric: true })).forEach(([ten, v]) => {
      const r = DeCuongTeX.docTep(ten, v.tex); Object.assign(D.hinh, r.hinh || {});
      if (r.loai === "bai") D.bai[r.bai.so] = Object.assign({ chuong: r.chuong || v.chuong || "" }, r.bai);
      else if (r.loai === "ontap") D.ontap[r.chuong] = (D.ontap[r.chuong] || []).concat(r.de);
    });
    return D;
  }
  function banHS(D) {
    const H = { lop: D.lop, nam: D.nam, bai: {}, ontap: {} };
    Object.entries(D.bai).forEach(([k, b]) => H.bai[k] = Object.assign({ chuong: b.chuong }, DeCuongTeX.banHS(b)));
    Object.entries(D.ontap).forEach(([k, ds]) => H.ontap[k] = ds.map(DeCuongTeX.deHS));
    return H;
  }

  /* ---------------- CSS ---------------- */
  const CSS = `
.tl{display:grid;grid-template-columns:290px 1fr;gap:18px;align-items:start}
@media (max-width:880px){.tl{grid-template-columns:1fr}.tl-nav{position:static!important;max-height:none!important}}
.tl-nav{position:sticky;top:84px;max-height:calc(100vh - 100px);overflow:auto;background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;box-shadow:var(--sh)}
.tl-lop{display:flex;gap:6px;margin-bottom:8px}.tl-lop button{flex:1;border:2px solid var(--line);background:#fff;border-radius:12px;padding:7px 0;font:800 15px var(--font-h);cursor:pointer;color:#445}
.tl-lop button.on{border-color:var(--teal);background:linear-gradient(135deg,#10b3a3,#3b7bff);color:#fff}
.tl-ch{margin:4px 0}.tl-ch>button{width:100%;text-align:left;border:0;background:var(--nt);color:var(--nm);font:700 14px/1.35 var(--font);padding:9px 12px;cursor:pointer;display:flex;gap:8px;border-radius:12px}
.tl-ch>button b{background:var(--nm);color:#fff;border-radius:8px;padding:1px 7px;font-size:12px;flex:none}
.tl-ch .ds{display:none;padding:4px 0 6px 10px}.tl-ch.mo .ds{display:block}
.tl-ch .ds a{display:block;padding:6px 10px;border-radius:10px;color:#334;text-decoration:none;font-size:14px;line-height:1.35;border-left:3px solid transparent}
.tl-ch .ds a:hover{background:#f6f7fb}.tl-ch .ds a.on{background:var(--nt);border-left-color:var(--nm);font-weight:700;color:var(--nm)}
.tl-ch .ds a.de{font-weight:700;color:var(--nm)}
.tl-gv{margin-top:10px;border-top:1px dashed var(--line);padding-top:10px;display:grid;gap:6px}
.tl-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end;margin-bottom:10px}
.tl-bar .ban{display:flex;background:#fff;border:1px solid var(--line);border-radius:12px;padding:3px;margin-right:auto}
.tl-bar .ban button{border:0;background:none;border-radius:9px;padding:6px 12px;font:700 13.5px var(--font);cursor:pointer;color:#556}
.tl-bar .ban button.on{background:#1d2742;color:#fff}
.tv{background:#fff;border-radius:22px;border:1px solid var(--line);box-shadow:var(--sh);overflow:hidden;color:#1d2742}
.tv .hd{padding:20px 26px 16px;color:#fff;background:linear-gradient(120deg,var(--nm),var(--nd))}
.tv .hd small{display:inline-block;background:rgba(255,255,255,.2);border-radius:999px;padding:3px 12px;font-weight:700;font-size:13px}
.tv .hd h2{font:800 27px/1.15 var(--font-h);margin:10px 0 2px;color:#fff}.tv .hd p{margin:0;opacity:.9;font-size:14px}
.tv .bd{padding:14px 26px 24px;line-height:1.7;font-size:15.5px}
.tv h3.sec{font:800 20px var(--font-h);margin:18px 0 8px;color:var(--nm);display:flex;gap:10px;align-items:center}
.tv h3.sec i{font-style:normal;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--nt);font-size:17px}
.tv .muc{margin:12px 0 4px;font:800 17px var(--font);color:var(--nm)}
.tv .hop{border:1px solid var(--line);border-left:4px solid var(--nm);border-radius:12px;margin:8px 0;overflow:hidden}
.tv .hop .ht{background:var(--nt);color:var(--nm);font-weight:800;font-size:14px;padding:5px 12px}.tv .hop .hb{padding:8px 12px}
.tv .hop.chuy,.tv .hop.nhanxet,.tv .hop.luuy{border-left-color:#e09a12}.tv .hop.chuy .ht{background:#fff6e0;color:#a26a00}
.tv .hop.phuongphap{border-left-color:#2fb35a}.tv .hop.phuongphap .ht{background:#eaf8ee;color:#16803c}
.tv .mp{display:inline-block;vertical-align:top;max-width:100%;margin:0 14px 6px 0}
.tv img.hdc{max-width:100%;height:auto;display:block;margin:6px auto}
.tv .hinhthieu{display:inline-block;border:1.5px dashed #c9cfe0;border-radius:10px;padding:10px 14px;color:#7a849c;font-size:13px;margin:6px 0}
.tv .cth{display:block;text-align:center;font-size:13px;color:#66708a;font-style:italic}
.tv ol.abc{list-style:lower-alpha;padding-left:1.7em;margin:4px 0}.tv ol.abc li::marker{content:counter(list-item, lower-alpha) ") ";font-weight:700;color:var(--nm)}
.tv ol.ABC{list-style:upper-alpha;padding-left:1.7em;margin:4px 0}.tv ul{padding-left:1.3em;margin:4px 0}
.tv table.bdc{border-collapse:collapse;margin:6px auto;font-size:14.5px}.tv table.bdc td{border:1px solid #cfd6ea;padding:4px 8px;text-align:center}
.tv .giua{text-align:center}
.tv .dien{color:#c0392b;font-weight:600}
.tv .trong{display:inline-block;border-bottom:1.6px dotted #6b7489;height:1.15em;vertical-align:baseline;margin:0 2px}
.tv .vdc{border:1px solid var(--line);border-radius:14px;margin:10px 0;overflow:hidden;break-inside:avoid}
.tv .vdc .vt{background:var(--nt);padding:5px 14px;font-weight:800;color:var(--nm);font-size:14px}
.tv .vdc .vb{padding:8px 14px}
.tv .lgv{margin-top:8px;background:#f6faf7;border-left:3px solid #2fb35a;border-radius:8px;padding:6px 12px}
.tv .lgv>b:first-child{color:#16803c}
.tv .dangdc{margin:16px 0 4px;font:800 16px var(--font);display:flex;gap:8px;align-items:center}.tv .dangdc::before{content:"";width:10px;height:10px;border-radius:3px;background:var(--nm)}
.tv .btl{list-style:none;padding:0;margin:0;counter-reset:bt}
.tv .btl>li{counter-increment:bt;border-bottom:1px dashed var(--line);padding:8px 0 8px 62px;position:relative;break-inside:avoid}
.tv .btl>li::before{content:"Bài " counter(bt) ".";position:absolute;left:0;top:8px;font-weight:800;color:var(--nm)}
.tv .nhomt{font:800 15px var(--font);color:#55607a;margin:12px 0 2px;text-transform:uppercase;letter-spacing:.3px}
.tv .cau{border-bottom:1px dashed var(--line);padding:8px 0;break-inside:avoid}
.tv .cau .pa{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:2px 14px;margin-top:4px}
.tv .cau .pa span.dung{color:#14873e;font-weight:700;background:#e9f8ee;border-radius:6px;padding:0 4px}
.tv .cau .yy{display:flex;justify-content:space-between;gap:10px}
.tv .dapan{color:#c0392b;font-weight:700;white-space:nowrap}
.tv .bangda{border-collapse:collapse;margin:8px 0;font-size:14px}.tv .bangda td{border:1px solid #cfd6ea;padding:3px 8px;text-align:center}
.tv .ft{display:none}
.tv .nav2{display:flex;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap}
.tv .nav2 a{flex:1;min-width:200px;text-decoration:none;border:1.5px solid var(--line);border-radius:14px;padding:10px 14px;color:#334;font-size:14px}
.tv .nav2 a b{display:block;color:var(--nm)}.tv .nav2 a.r{text-align:right}
.tv.pdf .nav2{display:none}
.tl-ed{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:1000px){.tl-ed{grid-template-columns:1fr}}
.tl-ed textarea{width:100%;min-height:560px;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;border:1px solid var(--line);border-radius:12px;padding:10px;resize:vertical}
.tl-ed .pv{max-height:640px;overflow:auto;border:1px solid var(--line);border-radius:12px}
.tl-tep{width:100%;border-collapse:collapse;font-size:14px}.tl-tep td,.tl-tep th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left}
.tl-tep tr.on td{background:#f3eeff}.tl-tep tr{cursor:pointer}
@media print{
  body *{visibility:hidden}#tlIn,#tlIn *{visibility:visible}#tlIn{position:absolute;left:0;top:0;width:100%}
  #tlIn .tv{border:0;box-shadow:none;border-radius:0}#tlIn .nav2{display:none!important}
  #tlIn .ft{display:block;position:fixed;bottom:0;left:0;right:0;text-align:center;font:600 11px var(--font);color:#55607a;border-top:1px solid #dfe3ee;padding:4px 0;background:#fff}
  #tlIn *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{margin:12mm 12mm 16mm}
  header,.top,footer,.tl-nav,.tl-bar,.hero{display:none!important}
}`;

  /* ---------------- hiển thị ---------------- */
  const tron = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v * (1 - t) + y[i] * t).toString(16).padStart(2, "0")).join(""); };
  const bien = m => `--nm:${m[0]};--nt:${m[1]};--nd:${tron(m[0], "#1d2742", .48)}`;
  const CT = lop => ((G.CHUONG_TRINH || {})["Toán"] || {})[lop] || {};
  function mauChuong(lop, ch) { const ks = Object.keys(CT(lop)).map(Number).sort((a, b) => a - b); const i = Math.max(0, ks.indexOf(+ch)); return MAU[i % MAU.length]; }
  function chuongCuaBai(lop, so, D) { const C = CT(lop); for (const k in C) if (C[k][1][so]) return k; return (D.bai[so] || {}).chuong || ""; }

  function htmlCau(q, i, gv) {
    let s = `<div class="cau"><b>Câu ${i}.</b> ${ve(q.de)}`;
    if (q.loai === "TN") s += `<div class="pa">${q.pa.map((p, j) => `<span class="${gv && q.da === j ? "dung" : ""}"><b>${"ABCD"[j]}.</b> ${ve(p)}</span>`).join("")}</div>`;
    if (q.loai === "DS") s += q.y.map((y, j) => `<div class="yy"><span><b>${"abcd"[j]})</b> ${ve(y.t)}</span>${gv ? `<span class="dapan">${y.d ? "Đúng" : "Sai"}</span>` : ""}</div>`).join("");
    if (q.loai === "TLN" && gv) s += `<div>Đáp số: <span class="dapan">${esc(q.da)}</span></div>`;
    if (gv && q.lg) s += `<div class="lgv"><b>Hướng dẫn.</b> ${ve(q.lg)}</div>`;
    return s + "</div>";
  }
  function htmlDe(qs, gv) {
    const ph = { TN: [], DS: [], TLN: [] }; qs.forEach(q => ph[q.loai] && ph[q.loai].push(q));
    const tieu = { TN: "Phần I. Câu trắc nghiệm nhiều phương án lựa chọn", DS: "Phần II. Câu trắc nghiệm đúng sai", TLN: "Phần III. Câu trắc nghiệm trả lời ngắn" };
    let s = Object.keys(ph).filter(k => ph[k].length).map(k => `<div class="nhomt">${tieu[k]}</div>` + ph[k].map((q, i) => htmlCau(q, i + 1, gv)).join("")).join("");
    if (gv) {
      const tn = ph.TN.map((q, i) => `<td><b>${i + 1}</b><br>${"ABCD"[q.da]}</td>`).join(""), ds = ph.DS.map((q, i) => `<td><b>${i + 1}</b><br>${q.y.map(y => y.d ? "Đ" : "S").join("")}</td>`).join(""), tl = ph.TLN.map((q, i) => `<td><b>${i + 1}</b><br>${esc(q.da)}</td>`).join("");
      s += `<h3 class="sec"><i>🔑</i>Bảng đáp án</h3>${tn ? `<table class="bangda"><tr><td>TN</td>${tn}</tr></table>` : ""}${ds ? `<table class="bangda"><tr><td>Đ/S</td>${ds}</tr></table>` : ""}${tl ? `<table class="bangda"><tr><td>TLN</td>${tl}</tr></table>` : ""}`;
    }
    return s;
  }
  function htmlBai(lop, B, D, gv, nav) {
    const ch = chuongCuaBai(lop, B.so, D), C = CT(lop)[ch];
    const lt = B.lt.map(m => (m.t ? `<div class="muc">${ve(m.t)}</div>` : "") + `<div>${ve(m.h)}</div>`).join("");
    let vd = "", dang = null, k = 0;
    B.vd.forEach(v => {
      if (v.dang && v.dang !== dang) { vd += `<div class="dangdc">${ve(v.dang)}</div>`; dang = v.dang; }
      vd += `<div class="vdc"><div class="vt">Ví dụ ${++k}</div><div class="vb">${ve(v.de)}${gv && v.lg ? `<div class="lgv"><b>Lời giải.</b> ${ve(v.lg)}</div>` : ""}</div></div>`;
    });
    let bt = "", nhom = null;
    const dsBT = B.bt.map(b => { let s = ""; if (b.nhom && b.nhom !== nhom) { s += `</ol><div class="nhomt">${esc(b.nhom)}</div><ol class="btl">`; nhom = b.nhom; } return s + `<li>${ve(b.de)}${gv && b.ds ? `<div class="lgv"><b>Đáp số.</b> ${ve(b.ds)}</div>` : ""}</li>`; }).join("");
    if (B.bt.length) bt = `<ol class="btl">${dsBT}</ol>`.replace(/<ol class="btl"><\/ol>/g, "");
    const tn = (B.tn || []).length ? htmlDe(B.tn, gv) : "";
    return `<article class="tv" style="${bien(mauChuong(lop, ch))}"><div class="hd"><small>Toán ${lop}${C ? ` · Chương ${LAMA[ch] || ch}. ${esc(C[0])}` : ""}${D.nam ? ` · Năm học ${esc(D.nam)}` : ""}</small><h2>Bài ${B.so}. ${ve(B.ten)}</h2><p>${gv ? "Bản giáo viên — có chỗ điền, lời giải, đáp án" : "Bản học sinh — em điền vào chỗ trống và tự giải các ví dụ, bài tập"}</p></div>
      <div class="bd"><h3 class="sec"><i>📘</i>Lí thuyết trọng tâm</h3>${lt}
      ${vd ? `<h3 class="sec"><i>✍️</i>Ví dụ minh hoạ</h3>${vd}` : ""}
      ${bt ? `<h3 class="sec"><i>📝</i>Bài tập luyện tập</h3>${bt}` : ""}
      ${tn ? `<h3 class="sec"><i>🎯</i>Câu hỏi trắc nghiệm luyện tập</h3>${tn}` : ""}${nav || ""}</div><div class="ft">${CHAN}</div></article>`;
  }
  function htmlOnTap(lop, ch, D, gv, iDe, nav) {
    const C = CT(lop)[ch], ds = D.ontap[ch] || [], de = ds[iDe] || ds[0];
    return `<article class="tv" style="${bien(mauChuong(lop, ch))}"><div class="hd"><small>Toán ${lop} · Ôn tập chương${D.nam ? ` · Năm học ${esc(D.nam)}` : ""}</small><h2>Chương ${LAMA[ch] || ch}${C ? ". " + esc(C[0]) : ""} — ${esc(de ? de.ten : "")}</h2><p>${gv ? "Bản giáo viên — có đáp án và bảng đáp án" : "Bản học sinh"}</p></div>
      <div class="bd">${de ? htmlDe(de.q, gv) : "Chưa có đề."}${nav || ""}</div><div class="ft">${CHAN}</div></article>`;
  }

  /* ---------------- trang ---------------- */
  function mount(root) {
    if (!document.getElementById("tlCss")) { const st = document.createElement("style"); st.id = "tlCss"; st.textContent = CSS; document.head.appendChild(st); }
    const S = { lop: LS.get("tl-lop", "12"), k: LS.get("tl-k", ""), iDe: 0, ban: "hs", nguon: "web", moCh: null };
    const mh = /^#(1[0-2])\/([bo]\d+)$/.exec(location.hash); if (mh) { S.lop = mh[1]; S.k = mh[2]; }
    const DATA = { web: {}, gv: {}, may: {} };   // web: bản HS đã đăng; gv: bản GV giải mã; may: đề cương đang soạn
    let INDEX = null, laGV = sessionStorage.getItem("tl-gv") === "1";
    root.innerHTML = `<div class="tl"><aside class="tl-nav"><div class="tl-lop">${["10", "11", "12"].map(l => `<button data-l="${l}">Lớp ${l}</button>`).join("")}</div><div class="small muted tl-nam"></div><div class="tl-ds"></div>
      <div class="tl-gv"><button class="btn sm ghost" data-a="gv">🔑 Giáo viên</button></div></aside>
      <div><div class="tl-bar"><div class="ban hidden"><button data-b="hs">Bản học sinh</button><button data-b="gv">Bản giáo viên</button></div><select class="nguon hidden" title="Nguồn dữ liệu"><option value="web">Đề cương đã đăng trên web</option><option value="may">Đề cương đang soạn trên máy này</option></select><button class="btn sm ghost" data-a="in">🖨 In</button><button class="btn sm green" data-a="pdf">⬇ Tải PDF</button></div><div id="tlIn"></div></div></div>`;
    const $ = s => root.querySelector(s);
    root.querySelectorAll(".tl-lop button").forEach(b => b.onclick = () => { S.lop = b.dataset.l; S.k = ""; S.moCh = null; LS.set("tl-lop", S.lop); hien(); });
    root.querySelectorAll(".tl-bar .ban button").forEach(b => b.onclick = () => { S.ban = b.dataset.b; if (S.k === "soan") S.k = ""; hien(); });
    $(".nguon").onchange = e => { S.nguon = e.target.value; if (S.k === "soan") S.k = ""; hien(); };
    $('[data-a="in"]').onclick = () => window.print();
    $('[data-a="pdf"]').onclick = e => taiPDF(e.target);
    $('[data-a="gv"]').onclick = () => moGV();

    async function docIndex() {
      if (INDEX) return INDEX;
      try { INDEX = await (await fetch("data/decuong/index.json", { cache: "no-store" })).json(); } catch (e) { INDEX = { lop: {} }; }
      try { DSHINH = await (await fetch("data/decuong/hinh/ds.json")).json(); } catch (e) { DSHINH = {}; }
      return INDEX;
    }
    async function layDuLieu() {
      const lop = S.lop;
      if (S.nguon === "may") {
        const teps = await tatCaTep(); HINHMOI = await tatCaHinh();
        const D = gom(teps, lop); D.nam = LS.get("tl-nam", INDEX && INDEX.nam || ""); DATA.may[lop] = D;
        return S.ban === "gv" ? D : banHS(D);
      }
      if (S.ban === "gv" && DATA.gv[lop]) return DATA.gv[lop];
      if (!DATA.web[lop]) {
        const it = (INDEX.lop || {})[lop];
        if (!it) return null;
        DATA.web[lop] = await (await fetch("data/decuong/" + it.hs + "?v=" + (it.capnhat || ""), { cache: "no-store" })).json();
      }
      return DATA.web[lop];
    }

    async function hien() {
      await docIndex();
      root.querySelectorAll(".tl-lop button").forEach(b => b.classList.toggle("on", b.dataset.l === S.lop));
      $(".ban").classList.toggle("hidden", !laGV); $(".nguon").classList.toggle("hidden", !laGV);
      root.querySelectorAll(".ban button").forEach(b => b.classList.toggle("on", b.dataset.b === S.ban));
      const out = $("#tlIn");
      if (S.k === "soan") return soan(out);
      let D; try { D = await layDuLieu(); } catch (e) { out.innerHTML = `<div class="card">Không tải được đề cương (${esc(e.message)}).</div>`; return; }
      if (S.ban === "gv" && S.nguon === "web" && !DATA.gv[S.lop] && laGV) { out.innerHTML = `<div class="card">Chưa mở bản giáo viên của lớp ${S.lop}. Bấm <b>🔑 Mở bản giáo viên</b> ở cột trái (nhập mật khẩu), hoặc chọn nguồn <b>Đề cương đang soạn trên máy này</b>.</div>`; veNav(null); return; }
      if (!D || !Object.keys(D.bai || {}).length) { out.innerHTML = `<div class="card">Chưa có đề cương Toán ${S.lop}${S.nguon === "may" ? " trên máy này — vào <b>✏️ Soạn & xuất bản</b> để nạp file TeX" : ""}.</div>`; veNav(D); return; }
      $(".tl-nam").textContent = D.nam ? "Năm học " + D.nam : "";
      const ds = dsMuc(D); if (!S.k || !ds.some(x => x.k === S.k)) S.k = ds[0].k;
      LS.set("tl-k", S.k); veNav(D);
      const i = ds.findIndex(x => x.k === S.k), a = ds[i - 1], b = ds[i + 1];
      const nav = `<div class="nav2">${a ? `<a href="#" data-k="${a.k}">← Trước<b>${esc(a.ten)}</b></a>` : "<span></span>"}${b ? `<a class="r" href="#" data-k="${b.k}">Tiếp theo →<b>${esc(b.ten)}</b></a>` : ""}</div>`;
      const gv = S.ban === "gv";
      out.innerHTML = S.k[0] === "b" ? htmlBai(S.lop, D.bai[S.k.slice(1)], D, gv, nav) : htmlOnTap(S.lop, S.k.slice(1), D, gv, S.iDe, nav);
      if (S.k[0] === "o" && (D.ontap[S.k.slice(1)] || []).length > 1) {
        const bd = out.querySelector(".bd"); const sw = document.createElement("div"); sw.className = "tl-bar"; sw.style.justifyContent = "flex-start";
        sw.innerHTML = D.ontap[S.k.slice(1)].map((d, j) => `<button class="btn sm ${j === S.iDe ? "violet" : "ghost"}" data-de="${j}">${esc(d.ten)}</button>`).join("");
        bd.prepend(sw); sw.querySelectorAll("button").forEach(x => x.onclick = () => { S.iDe = +x.dataset.de; hien(); });
      }
      out.querySelectorAll(".nav2 a").forEach(x => x.onclick = ev => { ev.preventDefault(); S.k = x.dataset.k; S.iDe = 0; hien(); out.scrollIntoView({ behavior: "smooth" }); });
    }
    function dsMuc(D) {
      const ds = [];
      Object.keys(CT(S.lop)).forEach(ch => {
        Object.keys(CT(S.lop)[ch][1]).forEach(so => { if (D.bai[so]) ds.push({ k: "b" + so, ch, ten: `Bài ${so}. ${CT(S.lop)[ch][1][so]}` }); });
        if ((D.ontap[ch] || []).length) ds.push({ k: "o" + ch, ch, ten: `📝 Đề ôn tập chương ${LAMA[ch] || ch}` });
      });
      Object.keys(D.bai).forEach(so => { if (!ds.some(x => x.k === "b" + so)) ds.push({ k: "b" + so, ch: D.bai[so].chuong, ten: `Bài ${so}. ${D.bai[so].ten}` }); });
      return ds;
    }
    function veNav(D) {
      const C = CT(S.lop), ds = D ? dsMuc(D) : [];
      const cur = ds.find(x => x.k === S.k); if (S.moCh == null && cur) S.moCh = cur.ch;
      $(".tl-ds").innerHTML = Object.keys(C).map((ch, i) => { const items = ds.filter(x => x.ch === ch); if (!items.length) return ""; const m = MAU[i % MAU.length];
        return `<div class="tl-ch${S.moCh === ch ? " mo" : ""}" style="--nm:${m[0]};--nt:${m[1]}"><button data-c="${ch}"><b>${LAMA[ch] || ch}</b><span>${esc(C[ch][0])}</span></button><div class="ds">${items.map(x => `<a href="#" data-k="${x.k}" class="${x.k === S.k ? "on" : ""} ${x.k[0] === "o" ? "de" : ""}">${esc(x.ten)}</a>`).join("")}</div></div>`; }).join("");
      root.querySelectorAll(".tl-ch>button").forEach(b => b.onclick = () => { S.moCh = S.moCh === b.dataset.c ? -1 : b.dataset.c; veNav(D); });
      root.querySelectorAll(".tl-ds a").forEach(a => a.onclick = ev => { ev.preventDefault(); S.k = a.dataset.k; S.iDe = 0; hien(); if (innerWidth < 880) $("#tlIn").scrollIntoView({ behavior: "smooth" }); });
      const g = $(".tl-gv");
      g.innerHTML = laGV ? `<b class="small">🧑‍🏫 Chế độ giáo viên</b><button class="btn sm violet" data-a="mo">🔑 Mở bản giáo viên đã đăng</button><button class="btn sm green" data-a="soan">✏️ Soạn & xuất bản đề cương</button><button class="btn sm ghost" data-a="thoat">Thoát chế độ GV</button>`
        : `<button class="btn sm ghost" data-a="gv">🔑 Giáo viên</button>`;
      g.querySelectorAll("button").forEach(b => b.onclick = () => ({ gv: moGV, mo: moBanGV, soan: () => { S.k = "soan"; hien(); }, thoat: () => { laGV = false; sessionStorage.removeItem("tl-gv"); S.ban = "hs"; S.nguon = "web"; $(".nguon").value = "web"; S.k = ""; hien(); } })[b.dataset.a]());
    }
    function moGV() { laGV = true; sessionStorage.setItem("tl-gv", "1"); S.ban = "gv"; hien(); }
    async function moBanGV() {
      const it = (INDEX.lop || {})[S.lop];
      if (!it || !it.gv) return alert("Chưa đăng bản giáo viên của lớp " + S.lop + ". Vào ✏️ Soạn & xuất bản để tạo.");
      const pass = prompt("Mật khẩu bản giáo viên (đặt khi xuất bản):"); if (!pass) return;
      try {
        const buf = new Uint8Array(await (await fetch("data/decuong/" + it.gv + "?v=" + (it.capnhat || ""), { cache: "no-store" })).arrayBuffer());
        const pt = await DongBo.unseal(buf, pass);
        DATA.gv[S.lop] = JSON.parse(new TextDecoder().decode(pt)); S.ban = "gv"; S.nguon = "web"; $(".nguon").value = "web"; hien();
      } catch (e) { alert(e.message || "Không mở được."); }
    }

    /* ---------------- soạn & xuất bản ---------------- */
    let tepChon = null;
    async function soan(out) {
      const teps = await tatCaTep(); HINHMOI = await tatCaHinh();
      const nam = LS.get("tl-nam", INDEX.nam || "2026–2027");
      const ds = Object.entries(teps).filter(([, v]) => v.lop === S.lop).sort((a, b) => a[0].localeCompare(b[0], "vi", { numeric: true }));
      veNav(null);
      out.innerHTML = `<div class="card"><h3 style="margin-top:0">✏️ Soạn & xuất bản đề cương — Toán ${S.lop}</h3>
        <div class="row" style="gap:10px;flex-wrap:wrap;align-items:end"><label class="f">Năm học<input id="tlNam" value="${esc(nam)}" style="width:140px"></label>
        <label class="btn ghost">📂 Nạp file TeX / zip<input type="file" id="tlNap" multiple accept=".tex,.zip" hidden></label>
        <button class="btn ghost" id="tlMoi">＋ Thêm bài mới</button><button class="btn ghost" id="tlTaiTex">⬇ Tải TeX (.zip)</button><button class="btn violet" id="tlXB">📤 Xuất bản lên web</button></div>
        <div class="small muted" style="margin-top:6px">Đề cương đang soạn lưu trong trình duyệt của máy này (không ai khác thấy). Sửa xong bấm <b>Xuất bản</b> → tải lên GitHub thư mục <code>data/decuong</code>. Học sinh chỉ nhận <b>bản học sinh</b>; bản giáo viên được mã hoá bằng mật khẩu của thầy.</div>
        <div id="tlMsg"></div>
        <div style="max-height:260px;overflow:auto;margin-top:10px;border:1px solid var(--line);border-radius:12px"><table class="tl-tep"><tr><th>File</th><th>Nội dung</th><th>Sửa lần cuối</th><th></th></tr>${ds.map(([ten, v]) => { const r = DeCuongTeX.docTep(ten, v.tex); const nd = r.loai === "bai" ? `Bài ${r.bai.so}. ${r.bai.ten}` : r.loai === "ontap" ? `Đề ôn chương ${r.chuong} (${r.de.length} đề)` : "(không nhận dạng được)"; return `<tr data-t="${esc(ten)}" class="${ten === tepChon ? "on" : ""}"><td>${esc(ten)}</td><td>${esc(nd)}</td><td class="small">${v.t ? new Date(v.t).toLocaleString("vi-VN") : ""}</td><td><button class="btn sm ghost" data-x="${esc(ten)}">Xoá</button></td></tr>`; }).join("") || `<tr><td colspan="4" class="muted">Chưa có file nào. Bấm <b>Nạp file TeX / zip</b> (nạp được cả file zip đề cương thầy đang có).</td></tr>`}</table></div>
        <div id="tlEd" style="margin-top:12px"></div></div>`;
      const msg = h => out.querySelector("#tlMsg").innerHTML = h;
      out.querySelector("#tlNam").onchange = e => LS.set("tl-nam", e.target.value.trim());
      out.querySelector("#tlNap").onchange = async e => { const n = await napTep([...e.target.files]); e.target.value = ""; msg(`<div class="note green">Đã nạp ${n.bai} bài, ${n.de} file đề ôn${n.bo ? ` (bỏ qua ${n.bo} file không phải bài/đề: bìa, file chính…)` : ""}.</div>`); soan(out); };
      out.querySelector("#tlMoi").onclick = async () => { const so = prompt("Số bài (theo SGK):"); if (!so) return; const ch = prompt("Thuộc chương số:"); const ten = `TOAN${S.lop}_C${ch}_BAI${so}.tex`; await ganTep(ten, { lop: S.lop, chuong: ch, tex: mau(S.lop, so), t: Date.now() }); tepChon = ten; soan(out); };
      out.querySelector("#tlTaiTex").onclick = () => taiTex(ds);
      out.querySelector("#tlXB").onclick = () => xuatBan(msg);
      out.querySelectorAll("tr[data-t]").forEach(tr => tr.onclick = e => { if (e.target.dataset.x) return; tepChon = tr.dataset.t; soan(out); });
      out.querySelectorAll("[data-x]").forEach(b => b.onclick = async () => { if (!confirm("Xoá file " + b.dataset.x + " khỏi đề cương đang soạn?")) return; await xoaTep(b.dataset.x); if (tepChon === b.dataset.x) tepChon = null; soan(out); });
      if (tepChon && teps[tepChon]) moTep(out.querySelector("#tlEd"), tepChon, teps[tepChon]);
    }
    function mau(lop, so) {
      if (lop === "10") return `\\bai{${so}}{Tên bài}\n\n\\phan{A}{LÍ THUYẾT TRỌNG TÂM}\n\\muc{1. Mục thứ nhất}\n\\begin{khung}[Định nghĩa]\nNội dung, chỗ điền: \\dien{nội dung cần điền}.\n\\end{khung}\n\n\\phan{B}{VÍ DỤ MINH HOẠ}\n\\begin{vd}\nĐề ví dụ.\n\\loigiai[6]{Lời giải.}\n\\end{vd}\n\n\\phan{C}{BÀI TẬP LUYỆN TẬP}\n\\begin{bt}\nĐề bài tập.\n\\end{bt}\n`;
      if (lop === "11") return `\\section{Tên bài}\n\\lythuyet\n\\muc{1. Mục thứ nhất}\n\\begin{dinhnghia}\nNội dung, chỗ điền: \\dien{nội dung cần điền}.\n\\end{dinhnghia}\n\n\\vidumuc\n\\begin{vidu}[6]\nĐề ví dụ.\n\\end{vidu}\n\n\\baitapmuc\n\\begin{baitap}\nĐề bài tập.\n\\end{baitap}\n`;
      return `\\baihoc{${so}}{Tên bài}\n\n\\lithuyet\n\\begin{dinhnghia}[Định nghĩa]\nNội dung.\n\\end{dinhnghia}\n\n\\viduminhhoa\n\\subsubsection{Dạng 1}\n\\begin{vidu}\nĐề ví dụ.\n\\begin{loigiai}\nLời giải.\n\\end{loigiai}\n\\end{vidu}\n\n\\luyentap\n\\phanbt{Trắc nghiệm nhiều phương án lựa chọn}\n\\begin{bai}Câu hỏi\n\\pa{A}{B}{C}{D}\\dapso{A. Giải thích.}\\end{bai}\n`;
    }
    function moTep(el, ten, v) {
      el.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><b>${esc(ten)}</b><span class="small muted" id="tlLuu"></span><span class="ban" style="display:flex;background:#fff;border:1px solid var(--line);border-radius:12px;padding:3px"><button class="btn sm ghost" data-p="gv">Xem bản GV</button><button class="btn sm ghost" data-p="hs">Xem bản HS</button></span></div>
        <div class="tl-ed"><textarea spellcheck="false">${esc(v.tex)}</textarea><div class="pv"></div></div>
        <div class="small muted" style="margin-top:6px">Hình TikZ mới chưa có ảnh: biên dịch trên máy rồi bấm vào ô hình trong bản xem trước để tải ảnh (PNG/SVG) lên.</div>`;
      const ta = el.querySelector("textarea"), pv = el.querySelector(".pv"); let che = "gv", hen;
      const xem = () => {
        const r = DeCuongTeX.docTep(ten, ta.value); const D = { lop: S.lop, nam: LS.get("tl-nam", ""), bai: {}, ontap: {} };
        if (r.loai === "bai") { D.bai[r.bai.so] = Object.assign({ chuong: r.chuong }, r.bai); const B = che === "gv" ? D.bai[r.bai.so] : banHS(D).bai[r.bai.so]; pv.innerHTML = htmlBai(S.lop, B, D, che === "gv", ""); }
        else if (r.loai === "ontap") { D.ontap[r.chuong] = r.de; const X = che === "gv" ? D : banHS(D); pv.innerHTML = r.de.map((d, j) => htmlOnTap(S.lop, r.chuong, X, che === "gv", j, "")).join(""); }
        else pv.innerHTML = `<div class="card">Chưa nhận dạng được: file cần có <code>\\bai{..}{..}</code> (Toán 10), <code>\\section{..}</code> + <code>\\lythuyet</code> (Toán 11), <code>\\baihoc{..}{..}</code> (Toán 12) hoặc đề ôn tập.</div>`;
        pv.querySelectorAll(".hinhthieu").forEach(x => x.onclick = () => taiHinh(x.dataset.h, xem));
      };
      el.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { che = b.dataset.p; xem(); });
      ta.oninput = () => { clearTimeout(hen); hen = setTimeout(async () => { xem(); await ganTep(ten, Object.assign({}, v, { tex: ta.value, t: Date.now() })); el.querySelector("#tlLuu").textContent = "Đã lưu lúc " + new Date().toLocaleTimeString("vi-VN"); }, 700); };
      xem();
    }
    function taiHinh(h, xong) {
      const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/png,image/svg+xml,image/jpeg";
      inp.onchange = () => { const f = inp.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = async () => { await ganHinh(h, rd.result); HINHMOI[h] = rd.result; xong(); }; rd.readAsDataURL(f); };
      inp.click();
    }
    async function napTep(files) {
      const n = { bai: 0, de: 0, bo: 0 };
      const them = async (ten, tex) => {
        ten = ten.split("/").pop();
        const r = DeCuongTeX.docTep(ten, tex);
        if (r.loai === "khac" || !r.lop) { n.bo++; return; }
        await ganTep(ten, { lop: r.lop, chuong: r.chuong, tex, t: Date.now() }); r.loai === "bai" ? n.bai++ : n.de++;
      };
      for (const f of files) {
        if (/\.zip$/i.test(f.name)) { const z = await JSZip.loadAsync(f); for (const p of Object.keys(z.files)) if (/\.tex$/i.test(p) && !z.files[p].dir && !/__MACOSX/.test(p)) await them(p, await z.files[p].async("string")); }
        else if (/\.tex$/i.test(f.name)) await them(f.name, await f.text());
      }
      return n;
    }
    async function taiTex(ds) {
      const z = new JSZip(); ds.forEach(([ten, v]) => z.file(ten, v.tex));
      const b = await z.generateAsync({ type: "blob" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `DeCuong_Toan${S.lop}_TeX.zip`; a.click();
    }
    async function xuatBan(msg) {
      const teps = await tatCaTep(); HINHMOI = await tatCaHinh();
      const lops = [...new Set(Object.values(teps).map(v => v.lop))].sort();
      if (!lops.length) return msg(`<div class="note red">Chưa có đề cương nào để xuất bản.</div>`);
      const thieu = lops.map(l => { const n = Object.keys(gom(teps, l).bai).length, cu = ((INDEX.lop || {})[l] || {}).bai || 0; return n < cu ? `Toán ${l}: trên máy có ${n} bài, bản đang đăng có ${cu} bài` : ""; }).filter(Boolean);
      if (thieu.length && !confirm("Chú ý — đề cương trên máy ít bài hơn bản đang đăng trên web:\n" + thieu.join("\n") + "\n\nNếu xuất bản, học sinh sẽ chỉ còn thấy số bài trên máy. Thầy nên nạp đủ cả học kì I và II. Vẫn tiếp tục?")) return;
      const pass = prompt("Đặt mật khẩu cho BẢN GIÁO VIÊN (cần nhớ để mở trên máy khác; học sinh không có mật khẩu này):"); if (!pass) return;
      if (pass.length < 6) return msg(`<div class="note red">Mật khẩu cần ít nhất 6 kí tự.</div>`);
      msg(`<div class="note">⏳ Đang tạo gói xuất bản…</div>`);
      const nam = LS.get("tl-nam", INDEX.nam || ""); const capnhat = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const z = new JSZip(), dc = z.folder("data").folder("decuong");
      const idx = JSON.parse(JSON.stringify(INDEX || { lop: {} })); idx.nam = nam; idx.lop = idx.lop || {};
      const dsH = Object.assign({}, DSHINH); let nHinh = 0;
      for (const lop of lops) {
        const D = gom(teps, lop); D.nam = nam;
        const hinh = D.hinh; delete D.hinh;
        Object.keys(hinh).forEach(h => { if (!DSHINH[h] && HINHMOI[h]) { const m = /^data:image\/(png|svg\+xml|jpeg);base64,(.*)$/.exec(HINHMOI[h]); if (m) { const ext = { png: ".png", "svg+xml": ".svg", jpeg: ".jpg" }[m[1]]; dc.folder("hinh").file(h + ext, m[2], { base64: true }); dsH[h] = ext; nHinh++; } } });
        dc.file(`hs-${lop}.json`, JSON.stringify(banHS(D)));
        dc.file(`gv-${lop}.hcth`, await DongBo.seal(new TextEncoder().encode(JSON.stringify(D)), pass));
        idx.lop[lop] = { hs: `hs-${lop}.json`, gv: `gv-${lop}.hcth`, capnhat, bai: Object.keys(D.bai).length };
      }
      dc.file("index.json", JSON.stringify(idx, null, 1));
      if (nHinh) dc.folder("hinh").file("ds.json", JSON.stringify(dsH));
      z.file("HUONG-DAN-DANG-LEN-GITHUB.txt", `Kéo NGUYÊN thư mục "data" trong gói này vào trang GitHub của web (Add file → Upload files) → Commit.\nCác file sẽ nằm trong data/decuong/. Học sinh chỉ đọc được hs-*.json (bản không đáp án).\nBản giáo viên gv-*.hcth đã được mã hoá bằng mật khẩu thầy vừa đặt.\nNăm học: ${nam}. Lớp: ${lops.join(", ")}.`);
      const b = await z.generateAsync({ type: "blob" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `XuatBan_DeCuong_${capnhat}.zip`; a.click();
      msg(`<div class="note green">Đã tạo <b>XuatBan_DeCuong_${capnhat}.zip</b> (Toán ${lops.join(", ")}${nHinh ? `, ${nHinh} hình mới` : ""}). Thầy kéo thư mục <code>data</code> trong gói lên GitHub là học sinh thấy bản mới.</div>`);
    }

    /* ---------------- tải PDF ---------------- */
    const nap = src => new Promise((ok, loi) => { if ([...document.scripts].some(s => s.getAttribute("src") === src)) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = loi; document.head.appendChild(s); });
    async function taiPDF(btn) {
      const goc = $("#tlIn .tv"); if (!goc) return;
      const cu = btn.textContent; btn.textContent = "⏳ Đang tạo PDF…"; btn.disabled = true;
      try {
        await Promise.all(["assets/lib/html2canvas.min.js", "assets/lib/jspdf.umd.min.js"].map(nap));
        const rong = 794, box = document.createElement("div"); box.style.cssText = `position:fixed;left:-10000px;top:0;width:${rong}px;background:#fff`;
        const bn = goc.cloneNode(true); bn.classList.add("pdf"); box.appendChild(bn); document.body.appendChild(box);
        await Promise.all([...bn.querySelectorAll("img")].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; im.loading = "eager"; })));
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const top0 = bn.getBoundingClientRect().top; const cat = [...bn.querySelectorAll(".hd,.muc,h3.sec,.hop,.vdc,.btl>li,.cau,.nhomt,.bangda,.bd>div>div")].map(e => e.getBoundingClientRect().bottom - top0).sort((a, b) => a - b);
        const canvas = await html2canvas(bn, { scale: 2, backgroundColor: "#fff", useCORS: true, logging: false }); const H = bn.getBoundingClientRect().height; box.remove();
        const { jsPDF } = window.jspdf; const doc = new jsPDF({ unit: "mm", format: "a4", compress: true }); const PW = 210, PH = 297;
        const k = canvas.width / rong, trang = rong * PH / PW, vung = trang - 48; const ngat = []; let y = 0;
        while (y < H - 1) { let toi = y + vung; if (toi < H) { const c = cat.filter(v => v > y + 80 && v <= toi); if (c.length) toi = c[c.length - 1]; } else toi = H; ngat.push([y, toi]); y = toi; }
        ngat.forEach(([a, b], i) => {
          const pg = document.createElement("canvas"); pg.width = canvas.width; pg.height = Math.round(trang * k); const ctx = pg.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, pg.width, pg.height);
          const dy = i ? Math.round(10 * k) : 0; ctx.drawImage(canvas, 0, Math.round(a * k), canvas.width, Math.round((b - a) * k), 0, dy, canvas.width, Math.round((b - a) * k));
          const s = k; ctx.strokeStyle = "#dfe3ee"; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(30 * s, pg.height - 30 * s); ctx.lineTo(pg.width - 30 * s, pg.height - 30 * s); ctx.stroke();
          ctx.fillStyle = "#55607a"; ctx.font = `600 ${11 * s}px "Be Vietnam Pro", Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(CHAN, pg.width / 2, pg.height - 15 * s);
          ctx.textAlign = "right"; ctx.fillText((i + 1) + "/" + ngat.length, pg.width - 30 * s, pg.height - 15 * s);
          if (i) doc.addPage(); doc.addImage(pg.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, PW, PH);
        });
        const ten = (goc.querySelector("h2").textContent + (S.ban === "gv" ? " GV" : " HS")).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "_").slice(0, 70);
        doc.save(`DeCuong_Toan${S.lop}_${ten}.pdf`);
      } catch (e) { alert("Không tạo được PDF: " + e.message + ". Dùng nút In → Lưu thành PDF."); }
      finally { btn.textContent = cu; btn.disabled = false; }
    }
    hien();
  }
  G.TaiLieu = { mount, gom, banHS };
})(window);
