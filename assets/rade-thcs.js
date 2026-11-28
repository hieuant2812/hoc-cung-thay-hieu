/* rade-thcs.js — Ra đề Toán THCS (6–9) từ ngân hàng bài tập của thầy (lưu trên máy, IndexedDB).
   Ma trận theo bài × mức độ (TN: NB/TH/VD · TL: NB/TH/VD/VDC), cấu trúc đề TP.HCM, nhiều mã đề, đổi câu,
   xuất Word (công thức Equation thật), TeX (XeLaTeX), in/PDF; kèm đáp án – hướng dẫn chấm, ma trận – bản đặc tả. */
(function (G) {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const KT = (src, disp) => { try { return katex.renderToString(src, { throwOnError: false, displayMode: disp, strict: false }); } catch (e) { return esc(src); } };
  let DSHINH = {};
  const ve = h => String(h || "").replace(/\[\[HINH:([0-9a-f]{8})\]\]/g, (m, x) => DSHINH[x] ? `<img class="hdc" src="data/decuong/hinh/${x}${DSHINH[x]}" alt="Hình">` : `<span class="hinhthieu">[hình ${x}]</span>`)
    .replace(/\$\$([\s\S]+?)\$\$|\$((?:\\\$|[^$])+?)\$/g, (m, a, b) => a !== undefined ? KT(a, true) : KT(b, false));
  const fmt = x => (Math.round(x * 100) / 100).toString().replace(".", ",");
  const MUC_TN = ["NB", "TH", "VD"], MUC_TL = ["NB", "TH", "VD", "VDC"];
  const TEN_MUC = { NB: "Nhận biết", TH: "Thông hiểu", VD: "Vận dụng", VDC: "Vận dụng cao" };
  const LUI = { NB: ["TH"], TH: ["NB", "VD"], VD: ["TH", "VDC"], VDC: ["VD"] };
  const MAU = {
    gk: { ten: "Kiểm tra giữa kì (TN 3 điểm + TL 7 điểm)", tn: { NB: 8, TH: 4, VD: 0 }, tl: { NB: 2, TH: 3, VD: 3, VDC: 1 }, diemTN: 0.25, phut: 90, ki: "KIỂM TRA GIỮA KÌ" },
    ck: { ten: "Kiểm tra cuối kì (TN 3 điểm + TL 7 điểm)", tn: { NB: 8, TH: 4, VD: 0 }, tl: { NB: 2, TH: 3, VD: 3, VDC: 1 }, diemTN: 0.25, phut: 90, ki: "KIỂM TRA CUỐI KÌ" },
    tl100: { ten: "Đề tự luận 100% (giữa kì / cuối kì)", tn: { NB: 0, TH: 0, VD: 0 }, tl: { NB: 3, TH: 4, VD: 3, VDC: 1 }, diemTN: 0, phut: 90, ki: "KIỂM TRA CUỐI KÌ" },
    tn15: { ten: "Kiểm tra 15 phút — trắc nghiệm", tn: { NB: 5, TH: 4, VD: 1 }, tl: { NB: 0, TH: 0, VD: 0, VDC: 0 }, diemTN: 1, phut: 15, ki: "KIỂM TRA 15 PHÚT" },
    tl15: { ten: "Kiểm tra 15 phút — tự luận", tn: { NB: 0, TH: 0, VD: 0 }, tl: { NB: 1, TH: 1, VD: 1, VDC: 0 }, diemTN: 0, phut: 15, ki: "KIỂM TRA 15 PHÚT" },
    ontap: { ten: "Đề ôn tập chương", tn: { NB: 6, TH: 4, VD: 2 }, tl: { NB: 2, TH: 3, VD: 2, VDC: 1 }, diemTN: 0.25, phut: 90, ki: "ĐỀ ÔN TẬP" },
    ts10: { ten: "Đề tuyển sinh 10 TP.HCM — khung 7 bài của Sở (bốc từ bộ 50 đề ôn)", tn: { NB: 0, TH: 0, VD: 0 }, tl: { NB: 4, TH: 5, VD: 4, VDC: 2 }, diemTN: 0, phut: 120, ki: "ĐỀ THAM KHẢO TUYỂN SINH VÀO LỚP 10" },
    phieu: { ten: "Phiếu bài tập (không tính điểm)", tn: { NB: 4, TH: 4, VD: 2 }, tl: { NB: 3, TH: 3, VD: 2, VDC: 0 }, diemTN: 0, phut: 0, ki: "PHIẾU BÀI TẬP", khongDiem: true }
  };

  let BANK = {}, ML = {}, KQ = null, TL103 = {}, KHO = {};
  /* thứ tự hàng: bài SGK (số) trước, rồi các dạng của ngân hàng 103 dạng (mã Đ8-05…) */
  const soBai = b => /^\d+$/.test(b);
  const cmpBai = (a, b) => (soBai(b) - soBai(a)) || (soBai(a) ? a - b : String(a).localeCompare(String(b), "vi", { numeric: true }));
  const nhanBai = (b, ten) => soBai(b) ? `Bài ${b}. ${ten}` : `${b}. ${ten}`;
  async function napBank() {
    KHO = await ThcsBank.tatCa(S.khoi); BANK = {};
    const n = S.nguon || {};
    if (n.kho !== false) Object.values(KHO).forEach(d => { if (d.nguon !== "tl103") BANK[d.ma] = d; });
    if (n.tl103 !== false) {
      Object.values(TL103).forEach(d => { if (d.khoi === String(S.khoi)) BANK[d.ma] = d; });
      Object.values(KHO).forEach(d => { if (d.nguon === "tl103") BANK[d.ma] = d; });   // bản nạp từ zip trên máy: có hướng dẫn giải
    }
  }
  const S = Object.assign({ khoi: "8", mau: "gk", truong: "TRƯỜNG THCS …", phong: "UBND …", nam: "2026 – 2027", soDe: 2, tronTN: true, tronPA: true, hinh: "auto", chon: {}, mt: {}, nguon: { kho: true, tl103: true }, soY: 3 }, LS.get("rdthcs", {}));
  const luuS = () => LS.set("rdthcs", { khoi: S.khoi, mau: S.mau, truong: S.truong, phong: S.phong, nam: S.nam, soDe: S.soDe, tronTN: S.tronTN, tronPA: S.tronPA, hinh: S.hinh, chon: S.chon, nguon: S.nguon, soY: S.soY, tsMuc: S.tsMuc });

  /* ---------------- ngân hàng ---------------- */
  async function capNhatKho() {
    await napBank();
    const ds = Object.values(await ThcsBank.tatCa()), nKho = ds.filter(d => d.nguon !== "tl103").length, nLg = ds.filter(d => d.nguon === "tl103").length;
    const n103 = Object.keys(TL103).length, b103 = Object.values(TL103).reduce((s, d) => s + d.cau.length, 0);
    $("nhTT").innerHTML = (nKho ? `✅ Ngân hàng trên máy này: <b>${nKho}</b> dạng. ` : `⚠️ Máy này chưa có ngân hàng TN + TL của thầy. Bấm <b>📂 Nạp ngân hàng</b> và chọn file zip ngân hàng Toán 6–9, hoặc <b>☁️ Tải từ web</b> nếu đã đăng gói mã hoá. `) +
      (n103 ? `<br>📚 Ngân hàng tự luận 103 dạng (Toán 8, 9, ôn thi vào 10): <b>${n103}</b> dạng, <b>${b103}</b> bài có sẵn trên web. ` + (nLg ? `Hướng dẫn giải: ✅ đã nạp trên máy này (${nLg} dạng).` : `Hướng dẫn giải: chưa có trên máy này, bấm <b>📂 Nạp ngân hàng</b> và chọn file <i>Toan_THCS_NganHang_Tu_Luan_103_dang.zip</i> (một lần mỗi máy) để có đáp án – hướng dẫn chấm.`) : "");
    veNguon(); veKhoi();
  }
  function veNguon() {
    const el = $("nguon"); if (!el) return; const n = S.nguon = S.nguon || { kho: true, tl103: true };
    el.innerHTML = `<b>Lấy câu từ:</b> <label><input type="checkbox" data-n="kho" ${n.kho !== false ? "checked" : ""}> Ngân hàng TN + TL trên máy (6–9)</label> <label><input type="checkbox" data-n="tl103" ${n.tl103 !== false ? "checked" : ""}> Ngân hàng tự luận 103 dạng (8, 9, vào 10)</label>`;
    el.querySelectorAll("input").forEach(x => x.onchange = async () => { n[x.dataset.n] = x.checked; luuS(); await napBank(); veKhoi(); });
  }
  async function napNH(files) {
    $("nhMsg").innerHTML = `<div class="note">⏳ Đang đọc ngân hàng…</div>`;
    try { const ds = await ThcsBank.napFile(files, (i, n) => $("nhMsg").innerHTML = `<div class="note">⏳ Đang đọc ${i}/${n} file…</div>`); $("nhMsg").innerHTML = `<div class="note green">Đã nạp ${ds.length} dạng (${ds.reduce((s, d) => s + d.cau.length, 0)} câu).</div>`; }
    catch (e) { $("nhMsg").innerHTML = `<div class="note red">Lỗi: ${esc(e.message)}</div>`; }
    capNhatKho();
  }
  async function taoGoi() {
    const all = await ThcsBank.tatCa(); if (!Object.keys(all).length) return alert("Chưa có ngân hàng để đóng gói.");
    const pass = prompt("Đặt mật khẩu cho gói ngân hàng THCS (để mở trên máy khác):"); if (!pass || pass.length < 6) return alert("Mật khẩu cần ít nhất 6 kí tự.");
    $("nhMsg").innerHTML = `<div class="note">⏳ Đang mã hoá…</div>`;
    const b = await DongBo.seal(new TextEncoder().encode(JSON.stringify(all)), pass);
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([b])); a.download = "nganhang-thcs.hcth"; a.click();
    $("nhMsg").innerHTML = `<div class="note green">Đã tạo <b>nganhang-thcs.hcth</b>. Tải file này lên GitHub vào thư mục <code>data/thcs/</code>; trên máy khác bấm ☁️ Tải từ web và nhập mật khẩu.</div>`;
  }
  async function taiWeb() {
    const pass = prompt("Mật khẩu gói ngân hàng THCS:"); if (!pass) return;
    $("nhMsg").innerHTML = `<div class="note">⏳ Đang tải…</div>`;
    try {
      const r = await fetch("data/thcs/nganhang-thcs.hcth", { cache: "no-store" }); if (!r.ok) throw new Error("Chưa có file data/thcs/nganhang-thcs.hcth trên web.");
      const all = JSON.parse(new TextDecoder().decode(await DongBo.unseal(new Uint8Array(await r.arrayBuffer()), pass)));
      await ThcsBank.luu(Object.values(all)); $("nhMsg").innerHTML = `<div class="note green">Đã tải ${Object.keys(all).length} dạng về máy.</div>`; capNhatKho();
    } catch (e) { $("nhMsg").innerHTML = `<div class="note red">${esc(e.message)}</div>`; }
  }

  /* ---------------- phạm vi ---------------- */
  const LAMA = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  function cayKhoi() {
    const C = {};
    Object.values(BANK).forEach(d => {
      const c = C[d.chuong] = C[d.chuong] || { ten: ((ML[S.khoi] || {})[d.chuong] || {}).ten || d.tenChuong || "", hk: d.hk, bai: {} };
      const b = c.bai[d.bai] = c.bai[d.bai] || { ten: d.tenBai, dang: [] }; b.dang.push(d);
    });
    return C;
  }
  function veKhoi() {
    document.querySelectorAll("#khoi button").forEach(b => b.classList.toggle("on", b.dataset.k === S.khoi));
    const C = cayKhoi(), ch = Object.keys(C).sort((a, b) => a - b);
    const chon = S.chon[S.khoi] = S.chon[S.khoi] || {};
    const xemTL = d => { const b = /^TS-/.test(d.ma) ? "xTS-" + d.ma.slice(3) : ((ThcsBank.BAI103 || {})[d.ma] || [])[0]; return b ? ` <a class="small" href="tailieu.html#${d.khoi}/${/^x/.test(b) ? b : "t" + b}" target="_blank" title="Xem toàn bộ bài tập của dạng ở trang Tài liệu">📖 xem</a>` : ""; };
    const demMuc = d => { const r = {}; d.cau.forEach(q => r[q.muc] = (r[q.muc] || 0) + 1); return MUC_TL.filter(m => r[m]).map(m => `<span class="mc mc-${m}">${m} ${r[m]}</span>`).join(""); };
    $("pv").innerHTML = ch.length ? ch.map(c => `<details class="pvc" ${Object.keys(C[c].bai).some(b => chon[b]) ? "open" : ""}><summary><label><input type="checkbox" data-c="${c}"> <b>${+c > 10 ? "" : `Chương ${c}. `}${esc(C[c].ten)}</b> <span class="muted small">(${C[c].hk ? "HK" + C[c].hk : "cả năm"})</span></label></summary>
      <div class="pvb">${Object.keys(C[c].bai).sort(cmpBai).map(b => { const ds = C[c].bai[b].dang, d = ds[0]; return `<label><input type="checkbox" data-b="${b}" data-cc="${c}" ${chon[b] ? "checked" : ""}> ${esc(nhanBai(b, C[c].bai[b].ten))} <span class="muted small">${d.nguon === "tl103" ? `(${d.cau.length} bài TL)` : `(${ds.length} dạng)`}</span>${d.nguon === "tl103" ? ` ${demMuc(d)}${xemTL(d)}` : ""}</label>`; }).join("")}</div></details>`).join("")
      : `<div class="muted">Chưa có dữ liệu khối ${S.khoi} trong ngân hàng trên máy.</div>`;
    const dongBo = () => $("pv").querySelectorAll("[data-c]").forEach(x => { const bs = [...$("pv").querySelectorAll(`[data-cc="${x.dataset.c}"]`)]; x.checked = bs.length && bs.every(y => y.checked); x.indeterminate = !x.checked && bs.some(y => y.checked); });
    $("pv").querySelectorAll("[data-b]").forEach(x => x.onchange = () => { chon[x.dataset.b] = x.checked; if (!x.checked) delete chon[x.dataset.b]; dongBo(); luuS(); phanBo(); });
    $("pv").querySelectorAll("[data-c]").forEach(x => x.onchange = () => { $("pv").querySelectorAll(`[data-cc="${x.dataset.c}"]`).forEach(y => { y.checked = x.checked; if (x.checked) chon[y.dataset.b] = true; else delete chon[y.dataset.b]; }); dongBo(); luuS(); phanBo(); });
    dongBo(); phanBo();
  }
  function chonHK(hk) {
    const C = cayKhoi(); const chon = S.chon[S.khoi] = {};
    Object.keys(C).forEach(c => { if (!hk || String(C[c].hk) === String(hk)) Object.keys(C[c].bai).forEach(b => chon[b] = true); });
    luuS(); veKhoi();
  }

  /* ---------------- bài hình học chứng minh ---------------- */
  const soY = q => { if (q.y && !q.de) return q.y.length; let n = 0; for (const c of "abcde") if (new RegExp("(^|\\s|<br>)" + c + "\\)\\s").test(q.de)) n++; return Math.max(1, n); };
  const laDangHinh = d => +d.khoi >= 7 && /chứng minh|tam giác bằng nhau|đồng dạng|nội tiếp|tiếp tuyến|tia phân giác|song song, vuông góc|thẳng hàng/i.test(d.tenDang) && !/biến|chia hết|bất đẳng thức đơn giản/i.test(d.tenDang) && d.cau.some(q => q.loai === "TL");
  function dangHinh() {
    const bais = Object.keys(S.chon[S.khoi] || {});
    return Object.values(BANK).filter(d => bais.includes(d.bai) && laDangHinh(d)).sort((a, b) => a.ma.localeCompare(b.ma, "vi", { numeric: true }));
  }
  function veHinh() {
    const ds = dangHinh(), el = $("hinh"); if (!el) return;
    const coAbc = d => d.cau.some(q => q.loai === "TL" && soY(q) >= 3);
    el.innerHTML = `<option value="auto">Tự động: có 1 bài hình chứng minh${ds.some(coAbc) ? " (ưu tiên bài có ý a, b, c)" : ""}</option><option value="khong">Không bắt buộc (bốc ngẫu nhiên theo ma trận)</option>` +
      (ds.length ? `<optgroup label="Chọn đúng dạng bài hình">${ds.map(d => `<option value="${d.ma}">Bài ${d.bai} · ${esc(d.tenDang)}${coAbc(d) ? " — có ý a, b, c" : ""}</option>`).join("")}</optgroup>` : "");
    el.value = [...el.options].some(o => o.value === S.hinh) ? S.hinh : "auto";
    $("hinhTT").textContent = +S.khoi < 7 ? "Toán 6 không có dạng chứng minh hình học trong ngân hàng." : ds.length ? `Phạm vi đã chọn có ${ds.length} dạng hình học chứng minh${ds.some(coAbc) ? `, trong đó ${ds.filter(coAbc).length} dạng có đủ ý a), b), c)` : " (các dạng này mỗi bài một ý)"}.` : "Phạm vi đã chọn chưa có dạng chứng minh hình học.";
  }

  /* ---------------- ma trận ---------------- */
  function cauCua(bai, loai, muc) { const out = []; Object.values(BANK).filter(d => d.bai === String(bai)).forEach(d => d.cau.forEach(q => { if (q.loai === loai && q.muc === muc) out.push([d, q]); })); return out; }
  function coSan(bai) { const r = {}; Object.values(BANK).filter(d => d.bai === String(bai)).forEach(d => d.cau.forEach(q => { const k = q.loai + q.muc; r[k] = (r[k] || 0) + 1; })); return r; }
  function phanBo() {
    const M = MAU[S.mau]; const bais = Object.keys(S.chon[S.khoi] || {}).filter(b => Object.values(BANK).some(d => d.bai === b)).sort(cmpBai);
    const mt = {}; bais.forEach(b => mt[b] = { TN: { NB: 0, TH: 0, VD: 0 }, TL: { NB: 0, TH: 0, VD: 0, VDC: 0 } });
    const rai = (loai, muc, n) => {
      const ok = bais.filter(b => (coSan(b)[loai + muc] || 0) > 0 || LUI[muc].some(m => (coSan(b)[loai + m] || 0) > 0));
      if (!ok.length) return;
      // ưu tiên bài ít câu đã phân để trải đều; xoay vòng có trộn
      const thu = ok.slice().sort(() => Math.random() - .5);
      for (let i = 0; i < n; i++) { thu.sort((a, b) => (tong(mt[a]) - tong(mt[b]))); mt[thu[0]][loai][muc]++; }
    };
    const tong = x => Object.values(x.TN).reduce((s, v) => s + v, 0) + Object.values(x.TL).reduce((s, v) => s + v, 0);
    MUC_TN.forEach(m => rai("TN", m, M.tn[m] || 0)); MUC_TL.forEach(m => rai("TL", m, M.tl[m] || 0));
    S.mt = mt; veMT(); veHinh();
  }
  function veMT() {
    const bais = Object.keys(S.mt).sort(cmpBai); const C = cayKhoi();
    const tenBai = b => { for (const c in C) if (C[c].bai[b]) return C[c].bai[b].ten; return ""; };
    if (!bais.length) { $("mt").innerHTML = `<div class="muted">Chọn bài trong phạm vi kiến thức để lập ma trận.</div>`; return; }
    const cot = [...MUC_TN.map(m => ["TN", m]), ...MUC_TL.map(m => ["TL", m])];
    const tongCot = cot.map(([l, m]) => bais.reduce((s, b) => s + S.mt[b][l][m], 0));
    $("mt").innerHTML = `<table class="mtb"><tr><th rowspan="2">Bài</th><th colspan="3">Trắc nghiệm (số câu)</th><th colspan="4">Tự luận (số ý)</th></tr><tr>${cot.map(([, m]) => `<th>${m}</th>`).join("")}</tr>
      ${bais.map(b => { const cs = coSan(b); return `<tr><td class="tb">${esc(nhanBai(b, tenBai(b)))}</td>${cot.map(([l, m]) => `<td><input type="number" min="0" max="20" value="${S.mt[b][l][m]}" data-b="${b}" data-l="${l}" data-m="${m}" title="Ngân hàng có ${cs[l + m] || 0} câu" class="${(cs[l + m] || 0) ? "" : "it"}"></td>`).join("")}</tr>`; }).join("")}
      <tr class="tong"><td>Tổng</td>${tongCot.map(v => `<td>${v}</td>`).join("")}</tr></table>
      <div class="small muted" style="margin-top:6px">Ô màu xám: bài không có câu ở mức đó, web sẽ lấy câu mức gần nhất. Hàng ngân hàng 103 dạng (mã Đ8-…, H9-…, TS-…): số ở ô là <b>số ý</b>, các ý cùng mức của một hàng được ghép thành một bài có ý a), b), c)… (tối đa theo ô “Số ý mỗi bài”). Tổng: <b>${tongCot.slice(0, 3).reduce((a, b) => a + b, 0)}</b> câu trắc nghiệm, <b>${tongCot.slice(3).reduce((a, b) => a + b, 0)}</b> ý tự luận.</div>`;
    $("mt").querySelectorAll("input").forEach(x => x.onchange = () => { S.mt[x.dataset.b][x.dataset.l][x.dataset.m] = Math.max(0, +x.value || 0); veMT(); });
  }

  /* ---------------- tạo đề ---------------- */
  const tron = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const soThuTu = q => +q.ma.slice(-3);
  function boc(bai, loai, muc, daDung, kMax) {
    const thu = [muc, ...LUI[muc]];
    for (const m of thu) {
      let ds = cauCua(bai, loai, m).filter(([d, q]) => !daDung.has(q.ma) && !daDung.has(d.ma + "#" + soThuTu(q)));
      if (!ds.length) continue;
      // ưu tiên dạng chưa xuất hiện trong đề (cả TN lẫn TL), rồi dạng chưa dùng cho loại câu này
      const moi = ds.filter(([d]) => !daDung.has("dang:" + d.ma)); const moi2 = ds.filter(([d]) => !daDung.has("dang:" + d.ma + ":" + loai));
      if (moi.length) ds = moi; else if (moi2.length) ds = moi2;
      const [d, q] = ds[Math.floor(Math.random() * ds.length)];
      daDung.add(q.ma); daDung.add(d.ma + "#" + soThuTu(q)); daDung.add("dang:" + d.ma); daDung.add("dang:" + d.ma + ":" + loai);
      return { d, q: q.y ? ThcsBank.cuThe(q, +S.soY ? Math.min(kMax || 1, +S.soY) : 0) : q, muc: m, lech: m !== muc };
    }
    return null;
  }
  /* ---------------- đề tuyển sinh 10: khung 7 bài, bốc từ bộ 50 đề ôn (assets/ts10.js) ---------------- */
  const MUC_TS = { 1: "TH", 2: "TH", 3: "NB", 4: "VD", 5: "VD", 6: "VDC", 7: "VDC" };
  const soDiem = x => +String(x).replace(",", ".");
  const muc10 = b => ({ d: { ma: b.dang, tenDang: TS10.tenDang(KQ10.dang, b.dang), bai: b.k, cau: [] }, q: { ma: b.ma, loai: "TL", de: b.de, lg: b.lg || "", tex: { de: b.tex, lg: b.texLg || "" } }, muc: MUC_TS[b.k], bai: b.k, diem: soDiem(b.diem), ts10: b });
  let KQ10 = null;
  async function taoDeTS10() {
    try { KQ10 = await TS10.nap(); } catch (e) { return alert("Chưa tải được bộ đề ôn tuyển sinh 10 (data/ts10/hs.json)."); }
    const bais = TS10.ghep(KQ10, S.tsMuc || "all");
    const TL = bais.map(muc10);
    KQ = { M: MAU.ts10, TN: [], TL, nhom: TL.map(x => ({ y: [x], rieng: true })), thieu: KQ10.coGV ? [] : [], hinhMsg: KQ10.coGV ? "" : "Máy này chưa nạp lời giải TS10 nên tab Đáp án – HDC còn trống. Nạp file TS10_GV_LoiGiai.json ở trang Tài liệu › Ôn thi vào 10 (chế độ giáo viên).", tg: new Date(), ts10: true };
    taoMa(); veKQ();
  }
  function doiTS10(i) {
    const cu = KQ.TL[i]; const dung = new Set(KQ.TL.map(x => x.q.ma));
    let ds = []; KQ10.de.forEach(d => { if (S.tsMuc && S.tsMuc !== "all" && d.muc !== S.tsMuc) return; d.bai.forEach(b => { if (b.k === cu.bai && !dung.has(b.ma)) ds.push(b); }); });
    if (!ds.length) return alert("Không còn bài khác cùng vị trí.");
    const moi = muc10(ds[Math.floor(Math.random() * ds.length)]);
    KQ.TL[i] = moi; KQ.nhom = KQ.TL.map(x => ({ y: [x], rieng: true })); taoMa(); veKQ();
  }
  function maTranTS10() {
    let s = `<h3 style="text-align:center">MA TRẬN – ĐẶC TẢ ĐỀ TUYỂN SINH 10 (KHUNG 7 BÀI)</h3><table class="mtd"><tr><th>Bài</th><th>Nội dung</th><th>Dạng bài</th><th>Mức độ</th><th>Điểm</th><th>Nguồn (mã bài)</th></tr>`;
    KQ.TL.forEach((x, i) => { s += `<tr><td>${i + 1}</td><td>${esc((KQ10.dang.bai["B" + x.bai] || "").replace(/^Bài \d+ – /, ""))}</td><td>${esc(x.d.ma)} – ${esc(x.d.tenDang.replace(/\$/g, ""))}</td><td>${TEN_MUC[x.muc] || x.muc}</td><td>${fmt(x.diem)}</td><td class="small">${esc(x.q.ma)}</td></tr>`; });
    return s + `<tr class="tong"><td colspan="4">Tổng</td><td>${fmt(KQ.TL.reduce((a, x) => a + x.diem, 0))}</td><td></td></tr></table>`;
  }
  function taoDe() {
    if (S.mau === "ts10" && G.TS10) return taoDeTS10();
    const M = MAU[S.mau]; const bais = Object.keys(S.mt).sort(cmpBai);
    if (!bais.length) return alert("Chưa chọn phạm vi kiến thức.");
    const daDung = new Set(), TN = [], TL = [], thieu = [];
    bais.forEach(b => {
      MUC_TN.forEach(m => { for (let i = 0; i < S.mt[b].TN[m]; i++) { const x = boc(b, "TN", m, daDung); x ? TN.push(Object.assign(x, { bai: b })) : thieu.push(`TN ${m} bài ${b}`); } });
      MUC_TL.forEach(m => { for (let i = 0; i < S.mt[b].TL[m];) { const x = boc(b, "TL", m, daDung, S.mt[b].TL[m] - i); if (x) { TL.push(Object.assign(x, { bai: b })); i += x.q.goc ? x.q.y.length : 1; } else { thieu.push(`TL ${m} ${soBai(b) ? "bài " : ""}${b}`); i++; } } });
    });
    const hinhMsg = chenBaiHinh(TL, daDung, M);
    const capMuc = { NB: 0, TH: 1, VD: 2, VDC: 3 };
    TN.sort((a, b) => capMuc[a.muc] - capMuc[b.muc] || cmpBai(a.bai, b.bai));
    // điểm tự luận
    const tongTN = M.khongDiem ? 0 : TN.length * M.diemTN, conLai = M.khongDiem ? 0 : Math.max(0, 10 - tongTN);
    const W = { NB: 0.5, TH: 0.75, VD: 1, VDC: 1 }; const hs = x => x.hinh ? Math.max(2.5, soY(x.q) * 0.9) : soY(x.q);
    const sw = TL.reduce((s, x) => s + W[x.muc] * hs(x), 0) || 1;
    TL.forEach(x => x.diem = Math.max(0.25, Math.round(conLai * W[x.muc] * hs(x) / sw * 4) / 4));
    if (TL.length && !M.khongDiem) { const lech = Math.round((conLai - TL.reduce((s, x) => s + x.diem, 0)) * 4) / 4; const k = TL.reduce((bi, x, i) => x.diem > TL[bi].diem ? i : bi, 0); TL[k].diem = Math.max(0.25, TL[k].diem + lech); }
    KQ = { M, TN, TL, nhom: nhomTL(TL), thieu, hinhMsg, tg: new Date() };
    taoMa(); veKQ();
  }
  const laNhieuY = q => /(^|\s|<br>)b\)\s/.test(q.de);
  function chenBaiHinh(TL, daDung, M) {
    if (S.hinh === "khong" || M.khongDiem && S.mau !== "phieu" || !TL.length && S.hinh === "auto") return "";
    if (["tn15", "tl15"].includes(S.mau) && S.hinh === "auto") return "";
    const ds = dangHinh(); if (!ds.length) return S.hinh === "auto" ? "" : "Dạng bài hình đã chọn không còn trong phạm vi.";
    // đã có câu hình chứng minh trong đề thì dùng luôn câu đó làm bài hình
    const co = TL.find(x => laDangHinh(x.d)); 
    let dang = S.hinh !== "auto" ? ds.find(d => d.ma === S.hinh) : null;
    if (!dang) { const abc = ds.filter(d => d.cau.some(q => q.loai === "TL" && soY(q) >= 3)); dang = co && S.hinh === "auto" && soY(co.q) >= 2 ? null : (abc.length ? abc : ds)[Math.floor(Math.random() * (abc.length ? abc : ds).length)]; }
    if (!dang) { co.hinh = true; return ""; }
    const ung = dang.cau.filter(q => q.loai === "TL" && !daDung.has(q.ma) && !daDung.has(dang.ma + "#" + soThuTu(q)));
    if (!ung.length) return "Dạng bài hình đã chọn hết câu chưa dùng.";
    const maxY = Math.max(...ung.map(soY)); const tot = ung.filter(q => soY(q) === maxY);
    const q0 = tot[Math.floor(Math.random() * tot.length)], q = q0.y ? ThcsBank.cuThe(q0, Math.max(3, +S.soY || 99)) : q0;
    daDung.add(q.ma); daDung.add(dang.ma + "#" + soThuTu(q)); daDung.add("dang:" + dang.ma);
    // bỏ bớt ý tự luận để giữ độ dài đề: ưu tiên bỏ câu cùng bài SGK, rồi câu mức VD/TH
    const bo = Math.min(TL.length, Math.max(1, soY(q) - 1));
    for (let i = 0; i < bo; i++) {
      let k = TL.findIndex(x => x.bai === dang.bai && !x.hinh); if (k < 0) k = TL.findIndex(x => x.muc === "VD" && !x.hinh); if (k < 0) k = TL.findIndex(x => x.muc === "TH" && !x.hinh); if (k < 0) k = TL.findIndex(x => !x.hinh);
      if (k >= 0) TL.splice(k, 1);
    }
    TL.push({ d: dang, q, muc: q.muc, lech: false, bai: dang.bai, hinh: true });
    return "";
  }
  function nhomTL(TL) {
    // gom theo chương thành "Bài": câu có sẵn ý a), b) đứng riêng một bài; mỗi bài tối đa 4 ý
    const C = cayKhoi(); const chuongCua = b => { for (const c in C) if (C[c].bai[b]) return c; return "0"; };
    const capMuc = { NB: 0, TH: 1, VD: 2, VDC: 3 };
    const ds = TL.slice().sort((a, b) => (+chuongCua(a.bai) - +chuongCua(b.bai)) || (laNhieuY(a.q) - laNhieuY(b.q)) || capMuc[a.muc] - capMuc[b.muc] || cmpBai(a.bai, b.bai));
    const out = []; let cur = null;
    ds.forEach(x => {
      const ch = chuongCua(x.bai);
      if (laNhieuY(x.q) || x.hinh) { out.push({ ch, y: [x], rieng: true, hinh: !!x.hinh }); cur = null; return; }
      if (!cur || cur.ch !== ch || cur.y.length >= 4) { cur = { ch, y: [] }; out.push(cur); }
      cur.y.push(x);
    });
    // đưa VDC xuống cuối đề
    const hang = g => g.hinh ? 2 : g.y.some(x => x.muc === "VDC") ? 1 : 0;
    return out.sort((a, b) => hang(a) - hang(b));
  }
  function taoMa() {
    const n = KQ.ts10 ? 1 : Math.max(1, Math.min(24, +S.soDe || 1)); const goc = Math.floor(100 + Math.random() * 800);
    KQ.ma = [];
    for (let i = 0; i < n; i++) {
      const thu = S.tronTN && i > 0 ? tron(KQ.TN.map((_, k) => k)) : KQ.TN.map((_, k) => k);
      const cau = thu.map(k => { const x = KQ.TN[k]; const p = S.tronPA && i > 0 ? tron([0, 1, 2, 3]) : [0, 1, 2, 3]; return { x, p, da: p.indexOf(x.q.da) }; });
      KQ.ma.push({ ma: String(goc + i * 7), cau });
    }
  }

  /* ---------------- hiển thị đề ---------------- */
  function dauDe(maDe) {
    const M = KQ.M;
    return `<table class="dau"><tr><td style="width:42%;text-align:center">${esc(S.phong)}<br><b>${esc(S.truong)}</b></td>
      <td style="text-align:center"><b>${esc(M.ki)}</b><br><b>NĂM HỌC ${esc(S.nam)}</b><br>Môn: <b>TOÁN – KHỐI ${esc(KQ.ts10 ? "9" : S.khoi)}</b>${M.phut ? `<br><i>Thời gian làm bài: ${M.phut} phút (không kể thời gian phát đề)</i>` : ""}</td></tr></table>
      ${maDe ? `<div class="made">Mã đề: <b>${maDe}</b></div>` : ""}<div class="hoten">Họ và tên: ………………………………………… Lớp: ………… Số báo danh: …………</div>`;
  }
  function deHTML(V, goc) {
    const M = KQ.M; let s = dauDe(goc ? "" : V.ma), k = 0;
    if (V.cau.length) {
      s += `<h4 class="ph">PHẦN I. TRẮC NGHIỆM${M.khongDiem ? "" : ` (${fmt(V.cau.length * M.diemTN)} điểm)`}</h4><p class="ghi"><i>Học sinh chọn một phương án đúng duy nhất trong mỗi câu.</i></p>`;
      s += V.cau.map((c, i) => `<div class="cau" data-loai="TN" data-i="${KQ.TN.indexOf(c.x)}"><b>Câu ${i + 1}.</b> ${ve(c.x.q.de)}${goc ? doiNut(c.x) : ""}<div class="pa">${c.p.map((j, t) => `<span><b>${"ABCD"[t]}.</b> ${ve(c.x.q.pa[j])}</span>`).join("")}</div></div>`).join("");
    }
    if (KQ.TL.length) {
      s += `<h4 class="ph">PHẦN ${V.cau.length ? "II. " : ""}TỰ LUẬN${M.khongDiem ? "" : ` (${fmt(KQ.TL.reduce((a, x) => a + x.diem, 0))} điểm)`}</h4>`;
      KQ.nhom.forEach(g => {
        k++;
        const diemBai = g.y.reduce((a, x) => a + (x.diem || 0), 0);
        if (g.rieng || g.y.length === 1) { const x = g.y[0]; s += `<div class="cau" data-loai="TL" data-i="${KQ.TL.indexOf(x)}"><b>Bài ${k}${M.khongDiem ? "" : ` (${fmt(x.diem)} điểm)`}.</b> ${ve(x.q.de)}${goc ? doiNut(x) : ""}</div>`; }
        else s += `<div class="cau"><b>Bài ${k}${M.khongDiem ? "" : ` (${fmt(diemBai)} điểm)`}.</b>` + g.y.map((x, i) => `<div class="y" data-loai="TL" data-i="${KQ.TL.indexOf(x)}"><b>${"abcdefgh"[i]})</b> ${ve(x.q.de)}${M.khongDiem ? "" : ` <span class="dy">(${fmt(x.diem)} đ)</span>`}${goc ? doiNut(x) : ""}</div>`).join("") + `</div>`;
      });
    }
    return s + `<p class="het">— HẾT —</p>`;
  }
  const doiNut = x => `<button class="doi" title="${x.ts10 ? "Đổi bài khác cùng vị trí trong khung 7 bài" : "Đổi câu khác cùng bài, cùng mức"}">🔄 đổi</button><span class="nguon">${esc(x.d.tenDang)} · ${x.muc}${x.lech ? " (thay mức)" : ""}</span>`;
  function dapAnHTML() {
    const M = KQ.M; let s = `<h3 style="text-align:center">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM — ${esc(M.ki)} — TOÁN ${esc(KQ.ts10 ? "9" : S.khoi)}</h3>`;
    if (KQ.TN.length) {
      s += `<h4 class="ph">PHẦN I. TRẮC NGHIỆM${M.khongDiem ? "" : ` (mỗi câu đúng ${fmt(M.diemTN)} điểm)`}</h4>`;
      KQ.ma.forEach(V => { s += `<table class="bda"><tr><td><b>Mã ${V.ma}</b></td>${V.cau.map((_, i) => `<td>${i + 1}</td>`).join("")}</tr><tr><td>Đáp án</td>${V.cau.map(c => `<td><b>${"ABCD"[c.da]}</b></td>`).join("")}</tr></table>`; });
    }
    if (KQ.TL.length) {
      s += `<h4 class="ph">PHẦN ${KQ.TN.length ? "II. " : ""}TỰ LUẬN</h4><table class="hdc"><tr><th style="width:12%">Bài</th><th>Lời giải</th>${M.khongDiem ? "" : `<th style="width:10%">Điểm</th>`}</tr>`;
      let k = 0; KQ.nhom.forEach(g => { k++; g.y.forEach((x, i) => { s += `<tr><td>Bài ${k}${g.y.length > 1 ? " " + "abcdefgh"[i] + ")" : ""}</td><td>${ve(x.q.lg || (x.d.nguon === "tl103" ? "<i>(chưa nạp hướng dẫn giải ngân hàng 103 dạng trên máy này: bấm 📂 Nạp ngân hàng, chọn file zip 103 dạng)</i>" : "<i>(ngân hàng chưa có lời giải)</i>"))}</td>${M.khongDiem ? "" : `<td style="text-align:center">${fmt(x.diem)}</td>`}</tr>`; }); });
      s += `</table><p class="small"><i>Học sinh giải cách khác đúng vẫn cho điểm tối đa phần đó.</i></p>`;
    }
    return s;
  }
  function maTranHTML() {
    if (KQ.ts10) return maTranTS10();
    const M = KQ.M, C = cayKhoi(); const bais = [...new Set([...KQ.TN, ...KQ.TL].map(x => x.bai))].sort(cmpBai);
    const tenBai = b => { for (const c in C) if (C[c].bai[b]) return [c, C[c].ten, C[c].bai[b].ten]; return ["", "", ""]; };
    const dem = (b, l, m) => (l === "TN" ? KQ.TN : KQ.TL).filter(x => x.bai === b && x.muc === m);
    const diem = (b, l, m) => dem(b, l, m).reduce((s, x) => s + (l === "TN" ? M.diemTN : x.diem), 0);
    let s = `<h3 style="text-align:center">MA TRẬN ĐỀ ${esc(M.ki)} — TOÁN ${esc(S.khoi)}</h3><table class="mtd"><tr><th rowspan="2">TT</th><th rowspan="2">Chương / Chủ đề</th><th rowspan="2">Nội dung (bài)</th>${MUC_TL.map(m => `<th colspan="2">${TEN_MUC[m]}</th>`).join("")}<th rowspan="2">Tổng điểm</th></tr><tr>${MUC_TL.map(() => `<th>TN</th><th>TL</th>`).join("")}</tr>`;
    let tong = 0;
    bais.forEach((b, i) => { const [c, tc, tb] = tenBai(b); let d = 0; s += `<tr><td>${i + 1}</td><td>${+c > 10 ? "" : `Chương ${c}. `}${esc(tc)}</td><td>${esc(nhanBai(b, tb))}</td>${MUC_TL.map(m => { const a = m === "VDC" ? [] : dem(b, "TN", m), t = dem(b, "TL", m); d += diem(b, "TN", m === "VDC" ? "x" : m) + diem(b, "TL", m); return `<td>${a.length || ""}</td><td>${t.length || ""}</td>`; }).join("")}<td>${M.khongDiem ? "" : fmt(d)}</td></tr>`; tong += d; });
    const tc = MUC_TL.map(m => [m === "VDC" ? 0 : KQ.TN.filter(x => x.muc === m).length, KQ.TL.filter(x => x.muc === m).length]);
    const pt = MUC_TL.map(m => (m === "VDC" ? 0 : KQ.TN.filter(x => x.muc === m).length * M.diemTN) + KQ.TL.filter(x => x.muc === m).reduce((s, x) => s + x.diem, 0));
    s += `<tr class="tong"><td colspan="3">Tổng số câu / ý</td>${tc.map(([a, b]) => `<td>${a || ""}</td><td>${b || ""}</td>`).join("")}<td>${M.khongDiem ? "" : fmt(tong)}</td></tr>`;
    if (!M.khongDiem) s += `<tr class="tong"><td colspan="3">Tỉ lệ điểm theo mức độ</td>${pt.map(p => `<td colspan="2">${fmt(p)} đ (${Math.round(p * 10)}%)</td>`).join("")}<td>10</td></tr>`;
    s += `</table><h3 style="text-align:center;margin-top:18px">BẢN ĐẶC TẢ</h3><table class="mtd"><tr><th>TT</th><th>Nội dung (bài)</th><th>Dạng bài được hỏi</th><th>Mức độ</th><th>Câu hỏi trong đề (mã gốc)</th></tr>`;
    let tt = 0; const k = {}; let ib = 0; KQ.nhom.forEach(g => { ib++; g.y.forEach((x, i) => k[x.q.ma] = `Bài ${ib}${g.y.length > 1 ? "abcdefgh"[i] : ""}`); });
    bais.forEach(b => { const [, , tb] = tenBai(b); [...KQ.TN, ...KQ.TL].filter(x => x.bai === b).forEach(x => { s += `<tr><td>${++tt}</td><td>${esc(nhanBai(b, tb))}</td><td>${esc(x.d.tenDang)}</td><td>${x.muc}</td><td>${x.q.loai === "TN" ? "Câu " + (KQ.TN.indexOf(x) + 1) : k[x.q.ma]} <span class="small muted">(${esc(x.q.ma)})</span></td></tr>`; }); });
    return s + "</table>";
  }
  let tab = "goc";
  function veKQ() {
    if (!KQ) return;
    $("kq").classList.remove("hidden");
    $("kqTabs").innerHTML = [["goc", "📝 Đề gốc (đổi câu)"], ...KQ.ma.map((V, i) => ["m" + i, "Mã " + V.ma]), ["da", "🔑 Đáp án – HDC"], ["mt", "📊 Ma trận – Đặc tả"]].map(([k, t]) => `<button data-t="${k}" class="${tab === k ? "on" : ""}">${t}</button>`).join("");
    $("kqTabs").querySelectorAll("button").forEach(b => b.onclick = () => { tab = b.dataset.t; veKQ(); });
    const V0 = { ma: "", cau: KQ.TN.map(x => ({ x, p: [0, 1, 2, 3], da: x.q.da })) };
    $("kqThieu").innerHTML = (KQ.thieu.length ? `<div class="note red">Ngân hàng không đủ câu cho: ${esc(KQ.thieu.join(", "))}.</div>` : "") + (KQ.hinhMsg ? `<div class="note red">${esc(KQ.hinhMsg)}</div>` : "");
    const h = tab === "goc" ? deHTML(V0, true) : tab === "da" ? dapAnHTML() : tab === "mt" ? maTranHTML() : deHTML(KQ.ma[+tab.slice(1)]);
    $("kqXem").innerHTML = `<div class="giay">${h}</div>`;
    $("kqXem").querySelectorAll(".doi").forEach(bt => bt.onclick = () => {
      const el = bt.closest("[data-loai]"); const loai = el.dataset.loai, i = +el.dataset.i;
      if (KQ.ts10) return doiTS10(i); const arr = loai === "TN" ? KQ.TN : KQ.TL; const cu = arr[i];
      const daDung = new Set([...KQ.TN, ...KQ.TL].filter(x => x !== cu).flatMap(x => [x.q.ma, x.d.ma + "#" + soThuTu(x.q), "dang:" + x.d.ma, "dang:" + x.d.ma + ":" + x.q.loai])); daDung.add(cu.q.ma);
      let moi;
      if (cu.hinh) { const ung = cu.d.cau.filter(q => q.loai === "TL" && !daDung.has(q.ma) && (q.y ? soY(q) >= soY(cu.q) : soY(q) === soY(cu.q))); const q = ung[Math.floor(Math.random() * ung.length)]; moi = q ? { d: cu.d, q: q.y ? ThcsBank.cuThe(q, soY(cu.q)) : q, muc: q.muc, hinh: true } : null; }
      else moi = boc(cu.bai, loai, cu.muc, daDung, cu.q.goc ? cu.q.y.length : 1);
      if (!moi) return alert("Không còn câu khác cùng bài, cùng mức.");
      Object.assign(moi, { bai: cu.bai, diem: cu.diem }); arr[i] = moi;
      if (loai === "TL") KQ.nhom.forEach(g => g.y = g.y.map(x => x === cu ? moi : x));
      taoMa(); veKQ();
    });
  }

  /* ---------------- xuất file ---------------- */
  const tenTep = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "_");
  async function xuatWord(btn) {
    if (!KQ) return; const cu = btn.textContent; btn.textContent = "⏳ Đang tạo Word…"; btn.disabled = true;
    try {
      await napThuVien("assets/lib/html2canvas.min.js");   // chỉ cần khi có hình TikZ trong đề
      const z = new JSZip(); const goc = KQ.ts10 ? "De_TS10_TPHCM" : `De_Toan${S.khoi}_${tenTep(KQ.M.ki)}`;
      const lam = async (html, ten, opt) => { const host = document.createElement("div"); host.className = "giay xuat"; host.style.cssText = "position:fixed;left:-10000px;top:0;width:760px"; host.innerHTML = html; document.body.appendChild(host); try { z.file(ten, await Docx.fromHtml(host, Object.assign({ size: 12, font: "Times New Roman", margins: { top: 1.5, bottom: 1.5, left: 2, right: 1.5 } }, opt || {}))); } finally { host.remove(); } };
      for (const V of KQ.ma) await lam(deHTML(V).replace(/<button[^>]*>.*?<\/button>|<span class="nguon">.*?<\/span>/g, ""), `${goc}_Ma${V.ma}.docx`);
      await lam(dapAnHTML(), `${goc}_DapAn_HDC.docx`);
      await lam(maTranHTML(), `${goc}_MaTran_DacTa.docx`, { orientation: "landscape", size: 11, margins: { top: 1.2, bottom: 1.2, left: 1.2, right: 1.2 } });
      const b = await z.generateAsync({ type: "blob" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = goc + "_Word.zip"; a.click();
    } catch (e) { alert("Lỗi tạo Word: " + e.message); } finally { btn.textContent = cu; btn.disabled = false; }
  }
  function xuatTeX() {
    if (!KQ) return; const M = KQ.M;
    if (KQ.ts10) { const t = TS10.tex("ĐỀ ÔN TẬP TUYỂN SINH VÀO LỚP 10 – NĂM HỌC " + S.nam, KQ.TL.map(x => x.ts10), true); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/x-tex" })); a.download = "De_TS10_TPHCM_khung7bai.tex"; a.click(); return; }
    const pre = `\\documentclass[12pt,a4paper]{article}\n\\usepackage[top=1.5cm,bottom=1.5cm,left=2cm,right=1.5cm]{geometry}\n\\usepackage{fontspec}\\setmainfont{TeX Gyre Termes}\n\\usepackage{amsmath,amssymb,tikz,tasks,enumitem}\n\\settasks{label=\\textbf{\\Alph*.},label-width=1.5em,item-indent=2em}\n\\setlength{\\parindent}{0pt}\\setlength{\\parskip}{3pt}\n\\pagestyle{empty}\n\\begin{document}\n`;
    const dau = ma => `\\begin{minipage}[t]{0.42\\textwidth}\\centering ${S.phong}\\\\\\textbf{${S.truong}}\\end{minipage}\\hfill\\begin{minipage}[t]{0.55\\textwidth}\\centering\\textbf{${M.ki}}\\\\\\textbf{NĂM HỌC ${S.nam}}\\\\Môn: \\textbf{TOÁN -- KHỐI ${S.khoi}}${M.phut ? `\\\\\\textit{Thời gian làm bài: ${M.phut} phút}` : ""}\\end{minipage}\\par\\medskip\n${ma ? `\\hfill\\fbox{Mã đề: ${ma}}\\par\n` : ""}Họ và tên: \\dotfill\\ Lớp: \\dots\\dots\\dots\\par\\medskip\n`;
    const de = V => {
      let s = dau(V.ma);
      if (V.cau.length) s += `\\textbf{PHẦN I. TRẮC NGHIỆM${M.khongDiem ? "" : ` (${fmt(V.cau.length * M.diemTN)} điểm)`}}\\par\n` + V.cau.map((c, i) => `\\textbf{Câu ${i + 1}.} ${c.x.q.tex.de}\n\\begin{tasks}(2)\n${c.p.map(j => `\\task ${c.x.q.tex.pa[j]}`).join("\n")}\n\\end{tasks}\n`).join("\n");
      if (KQ.TL.length) { s += `\\par\\medskip\\textbf{PHẦN ${V.cau.length ? "II. " : ""}TỰ LUẬN}\\par\n`; let k = 0; KQ.nhom.forEach(g => { k++; s += `\\textbf{Bài ${k}${M.khongDiem ? "" : ` (${fmt(g.y.reduce((a, x) => a + x.diem, 0))} điểm)`}.} ` + (g.y.length === 1 ? g.y[0].q.tex.de : g.y.map((x, i) => `\\par ${"abcdefgh"[i]}) ${x.q.tex.de}${M.khongDiem ? "" : ` \\hfill\\textit{(${fmt(x.diem)} đ)}`}`).join("\n")) + "\\par\\medskip\n"; }); }
      return s + "\\begin{center}--- HẾT ---\\end{center}\n";
    };
    let all = pre + KQ.ma.map(de).join("\\newpage\n") + "\\newpage\n\\begin{center}\\textbf{ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM}\\end{center}\n";
    KQ.ma.forEach(V => { if (V.cau.length) all += `\\textbf{Mã ${V.ma}:} ${V.cau.map((c, i) => `${i + 1}.${"ABCD"[c.da]}`).join("\\quad ")}\\par\n`; });
    let k = 0; KQ.nhom.forEach(g => { k++; g.y.forEach((x, i) => { all += `\\par\\textbf{Bài ${k}${g.y.length > 1 ? "abcdefgh"[i] + ")" : ""}${M.khongDiem ? "" : ` (${fmt(x.diem)} đ)`}.} ${x.q.tex.lg || ""}\n`; }); });
    all += "\\end{document}\n";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([all], { type: "text/x-tex" })); a.download = `De_Toan${S.khoi}_${tenTep(M.ki)}.tex`; a.click();
  }

  /* ---------------- khởi động ---------------- */
  async function mount() {
    try { ML = await (await fetch("data/thcs/mucluc.json")).json(); } catch (e) {}
    try { DSHINH = await (await fetch("data/decuong/hinh/ds.json")).json(); } catch (e) {}
    try { TL103 = await (await fetch("data/thcs/tl103.json")).json(); } catch (e) {}
    $("soY").value = String(S.soY == null ? 3 : S.soY); $("soY").onchange = () => { S.soY = +$("soY").value; luuS(); };
    $("mau").innerHTML = Object.entries(MAU).map(([k, v]) => `<option value="${k}">${v.ten}</option>`).join("");
    $("mau").value = S.mau; $("truong").value = S.truong; $("phong").value = S.phong; $("nam").value = S.nam; $("soDe").value = S.soDe; $("tronTN").checked = S.tronTN; $("tronPA").checked = S.tronPA;
    ["truong", "phong", "nam", "soDe"].forEach(k => $(k).onchange = () => { S[k] = $(k).value; luuS(); });
    ["tronTN", "tronPA"].forEach(k => $(k).onchange = () => { S[k] = $(k).checked; luuS(); });
    $("mau").insertAdjacentHTML("afterend", `<label class="f" id="tsMucL" style="margin-top:6px">Mức đề (bộ 50 đề ôn tuyển sinh 10)<select id="tsMuc"><option value="all">Trộn mọi mức</option><option value="lq">Làm quen (đề 1–10)</option><option value="sat">Sát đề Sở (đề 11–40)</option><option value="nc">Nâng cao (đề 41–50)</option></select></label>`);
    const hienTS = () => { $("tsMucL").style.display = S.mau === "ts10" ? "" : "none"; }; $("tsMuc").value = S.tsMuc || "all"; $("tsMuc").onchange = () => { S.tsMuc = $("tsMuc").value; luuS(); }; hienTS();
    $("mau").onchange = () => { S.mau = $("mau").value; luuS(); hienTS(); if (S.mau !== "ts10") phanBo(); };
    $("hinh").onchange = () => { S.hinh = $("hinh").value; luuS(); };
    document.querySelectorAll("#khoi button").forEach(b => b.onclick = async () => { S.khoi = b.dataset.k; luuS(); await napBank(); veKhoi(); });
    $("nhNap").onchange = e => { napNH([...e.target.files]); e.target.value = ""; };
    $("nhGoi").onclick = taoGoi; $("nhWeb").onclick = taiWeb;
    $("nhXoa").onclick = async () => { if (confirm("Xoá toàn bộ ngân hàng THCS trên máy này?")) { await ThcsBank.xoaKho(); capNhatKho(); } };
    $("hk1").onclick = () => chonHK(1); $("hk2").onclick = () => chonHK(2); $("hkAll").onclick = () => chonHK(0); $("hkNone").onclick = () => { S.chon[S.khoi] = {}; luuS(); veKhoi(); };
    $("pb").onclick = phanBo; $("go").onclick = taoDe;
    $("xWord").onclick = e => xuatWord(e.target); $("xTex").onclick = xuatTeX; $("xIn").onclick = () => window.print();
    $("xMoi").onclick = () => { taoMa(); veKQ(); };
    capNhatKho();
  }
  G.RaDeTHCS = { mount };
})(window);
