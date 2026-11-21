/* phieucuoigio.js — Phiếu cuối giờ (exit ticket): 3 câu trắc nghiệm nhanh, học sinh trả lời bằng điện thoại qua phòng thi Internet.
   PhieuCuoiGio.mo({ cau:[câu TN của ngân hàng], ds:{tenLop:[họ tên…]}, lop:"11A1", giay:60, ten:"Bài 18. Luỹ thừa" })
   - Máy thầy mở phòng (PhongMang), chiếu mã phòng + QR; học sinh vào hs.html, nhập mã, chọn tên.
   - Mỗi câu: đếm số em đã trả lời theo thời gian thực; hết giờ hoặc đủ lớp → khoá, hiện biểu đồ A–D và tỉ lệ đúng.
   - Xong: lưu thành một "bài chấm" (đáp án + phương án từng em + mã dạng) → trang Phân tích đọc ngay (tỉ lệ đúng từng câu, dạng yếu). */
(function (G) {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const T = s => (G.NHD && NHD.texToHtml) ? NHD.texToHtml(s) : esc(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let cssXong = false;
  function css() {
    if (cssXong) return; cssXong = true;
    const s = document.createElement("style");
    s.textContent = `
.pc-man{position:fixed;inset:0;z-index:9500;background:#0f1a2e;color:#fff;overflow:auto;font-family:var(--font,system-ui)}
.pc-in{max-width:1180px;margin:0 auto;padding:22px 26px 40px}
.pc-dau{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px}
.pc-dau h2{margin:0;font:800 26px var(--font-h,system-ui)}
.pc-man button{border:0;border-radius:12px;padding:11px 18px;font:700 16px var(--font,system-ui);cursor:pointer;background:#2c3a60;color:#fff}
.pc-man button.chinh{background:#ff7a59}.pc-man button.xanh{background:#10b3a3}
.pc-man button:disabled{opacity:.45;cursor:default}
.pc-the{background:#18284a;border:1px solid #2b4068;border-radius:18px;padding:18px 20px}
.pc-ma{font:800 84px/1 var(--font-h,system-ui);letter-spacing:8px;color:#ffd66b;text-align:center}
.pc-vao{display:grid;grid-template-columns:1fr 260px;gap:20px;align-items:center}
@media (max-width:760px){.pc-vao{grid-template-columns:1fr}}
.pc-qr{background:#fff;border-radius:14px;padding:10px}
.pc-ten{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.pc-ten span{background:#22365e;border-radius:999px;padding:4px 11px;font-size:14px}
.pc-cau{background:#fff;color:#1a2430;border-radius:18px;padding:20px 24px;font-size:24px;line-height:1.5}
.pc-cau .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.pc-cau .op{border:2px solid #e3e8f2;border-radius:12px;padding:8px 12px}.pc-cau .op b{color:#3b7bff;margin-right:6px}
.pc-cau .op.dung{border-color:#14a35a;background:#e9fbf1}
.pc-tt{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:14px 0;font-size:20px}
.pc-dong{font:800 44px var(--font-h,system-ui);color:#ffd66b;min-width:90px;text-align:center}
.pc-cot{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:end;height:200px;margin-top:10px}
.pc-cot div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.pc-cot i{display:block;width:70%;border-radius:10px 10px 0 0;background:#4a5a85;min-height:4px;transition:height .4s}
.pc-cot .dung i{background:#2fbf78}.pc-cot b{font-size:22px;margin-top:6px}.pc-cot em{font-style:normal;font-size:16px;opacity:.85}
.pc-kq{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.pc-kq .o{background:#18284a;border-radius:14px;padding:14px;text-align:center}.pc-kq .o b{display:block;font:800 40px var(--font-h,system-ui)}
.pc-bang{width:100%;border-collapse:collapse;margin-top:12px;font-size:15px}.pc-bang td,.pc-bang th{border-bottom:1px solid #2b4068;padding:6px 8px;text-align:left}
.pc-man select{font:inherit;font-size:16px;padding:8px;border-radius:10px;border:0}`;
    document.head.appendChild(s);
  }

  function mo(o) {
    css();
    if (!G.PhongMang) { alert("Trang này chưa nạp được phòng thi Internet (assets/phongmang.js)."); return; }
    const L = PhongMang.lop;
    const cau = (o.cau || []).filter(q => q.loai === "TN" && (q.pa || []).length === 4);
    if (!cau.length) { alert("Chưa có câu trắc nghiệm nào — thầy chọn dạng/mức ở mục 1 rồi bấm lại."); return; }
    const man = document.createElement("div"); man.className = "pc-man";
    man.innerHTML = `<div class="pc-in"><div class="pc-dau"><h2>🎫 Phiếu cuối giờ</h2><div><button data-x>✕ Đóng</button></div></div><div class="pc-than"></div></div>`;
    document.body.appendChild(man);
    const than = man.querySelector(".pc-than"); let dung = false, hen = null;
    const dong = async () => { dung = true; clearInterval(hen); try { await L.dong(); } catch (e) {} man.remove(); document.body.style.overflow = ""; };
    man.querySelector("[data-x]").onclick = () => { if (dung || confirm("Đóng phiếu cuối giờ? Phòng thi sẽ đóng.")) dong(); };
    document.body.style.overflow = "hidden";

    /* 1. chọn lớp */
    const lops = Object.keys(o.ds || {}).filter(k => (o.ds[k] || []).length);
    than.innerHTML = `<div class="pc-the"><p style="margin-top:0;font-size:18px"><b>${cau.length} câu</b> ${esc(o.ten || "")} — mỗi câu <select data-g>${[30, 45, 60, 90, 120].map(g => `<option value="${g}"${g === (o.giay || 60) ? " selected" : ""}>${g} giây</option>`).join("")}</select></p>
      ${lops.length ? `<p>Lớp: <select data-l>${lops.map(k => `<option${k === o.lop ? " selected" : ""}>${esc(k)}</option>`).join("")}</select> <span class="small" style="opacity:.8">(danh sách lớp ở tab Gọi tên)</span></p>`
        : `<p style="color:#ffb3a0">Chưa có danh sách lớp — thầy mở tab <b>🎯 Gọi tên</b>, dán họ tên học sinh rồi bấm <b>Lưu danh sách</b>.</p>`}
      <button class="chinh" data-mo${lops.length ? "" : " disabled"}>📡 Mở phòng cho học sinh vào</button></div>`;
    than.querySelector("[data-mo]").onclick = async e => {
      e.target.disabled = true; e.target.textContent = "Đang mở phòng…";
      const lop = than.querySelector("[data-l]").value, giay = +than.querySelector("[data-g]").value;
      const ds = o.ds[lop].map(t => ({ ten: t, to: "" }));
      try { await L.moPhong(ds, "Phiếu cuối giờ"); } catch (err) { alert("Không mở được phòng: " + err.message); e.target.disabled = false; e.target.textContent = "📡 Mở phòng cho học sinh vào"; return; }
      phongCho(lop, giay, ds);
    };

    /* 2. phòng chờ */
    function phongCho(lop, giay, ds) {
      than.innerHTML = `<div class="pc-the pc-vao"><div><p style="margin:0 0 6px;font-size:20px">Em mở <b>${esc(L.urlNgan ? L.urlNgan() : "hs.html")}</b>, nhập mã phòng:</p><div class="pc-ma">${esc(L.ma)}</div>
        <p style="font-size:18px;margin:14px 0 6px">Đã vào: <b data-n>0</b> / ${ds.length} em</p><div class="pc-ten" data-ds></div>
        <div style="margin-top:16px"><button class="chinh" data-bd>▶ Bắt đầu (${cau.length} câu)</button></div></div><div class="pc-qr" data-qr></div></div>`;
      try { const q = qrcode(0, "M"); q.addData(L.url()); q.make(); than.querySelector("[data-qr]").innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) {}
      hen = setInterval(async () => { const t = await L.gv().catch(() => null); if (!t || dung) return; than.querySelector("[data-n]").textContent = t.sohs; than.querySelector("[data-ds]").innerHTML = (t.hs || []).map(h => `<span>${esc(h.ten)}</span>`).join(""); }, 1000);
      than.querySelector("[data-bd]").onclick = () => { clearInterval(hen); hoi(lop, giay, ds); };
    }

    /* 3. hỏi lần lượt */
    async function hoi(lop, giay, ds) {
      const R = NHD.rng(NHD.hash("pc|" + Date.now()));
      const bo = cau.map(q => { const ord = NHD.shuffle([0, 1, 2, 3], R); return { q, ord, dapan: ord.indexOf(0) }; });   // ord[vị trí hiển thị] = phương án gốc
      const tl = {};   // ten → [chọn câu 1, câu 2, …]
      for (let k = 0; k < bo.length && !dung; k++) {
        const c = bo[k];
        await L.raCau({ de: c.q.de, pa: c.ord.map(j => c.q.pa[j]), dapan: c.dapan, giay, diem: 10, loai: "TN", guiDe: true });
        than.innerHTML = `<div class="pc-tt"><b style="font-size:22px">Câu ${k + 1}/${bo.length}</b><span class="pc-dong" data-gio>${giay}</span><span>Đã trả lời: <b data-da>0</b> em</span><span style="flex:1"></span><button class="xanh" data-khoa>🔒 Khoá & xem kết quả</button></div>
          <div class="pc-cau"><div>${T(c.q.de)}</div><div class="opts">${c.ord.map((j, i) => `<div class="op" data-o="${i}"><b>${"ABCD"[i]}.</b>${T(c.q.pa[j])}</div>`).join("")}</div></div><div data-kq></div>`;
        const bd = Date.now(); let xong = false;
        await new Promise(ok => {
          const khoa = () => { if (xong) return; xong = true; clearInterval(hen); ok(); };
          than.querySelector("[data-khoa]").onclick = khoa;
          hen = setInterval(async () => {
            if (dung) return khoa();
            const con = Math.max(0, giay - Math.floor((Date.now() - bd) / 1000)); const g = than.querySelector("[data-gio]"); if (g) g.textContent = con;
            const t = await L.gv().catch(() => null); if (t && than.querySelector("[data-da]")) than.querySelector("[data-da]").textContent = (t.datl || 0) + "/" + t.sohs;
            if (con <= 0 || (t && t.sohs && t.datl >= t.sohs)) khoa();
          }, 700);
        });
        const t = await L.khoa().catch(() => null);
        (t && t.hs || []).forEach(h => { (tl[h.ten] = tl[h.ten] || [])[k] = h.chon; });
        const dem = [0, 1, 2, 3].map(i => (t && t.dem && t.dem[i]) || 0), tong = Math.max(1, (t && t.datl) || 0), max = Math.max(1, ...dem);
        c.dung = dem[c.dapan]; c.tong = (t && t.datl) || 0;
        than.querySelector(`.op[data-o="${c.dapan}"]`).classList.add("dung");
        than.querySelector("[data-khoa]").remove();
        than.querySelector("[data-kq]").innerHTML = `<div class="pc-the" style="margin-top:14px"><div style="font-size:22px"><b>${Math.round(100 * c.dung / tong)}%</b> trả lời đúng (${c.dung}/${c.tong} em) · đáp án <b>${"ABCD"[c.dapan]}</b></div>
          <div class="pc-cot">${dem.map((n, i) => `<div class="${i === c.dapan ? "dung" : ""}"><em>${n} em</em><i style="height:${Math.round(150 * n / max)}px"></i><b>${"ABCD"[i]}</b></div>`).join("")}</div>
          ${c.q.loigiai ? `<details style="margin-top:10px"><summary style="cursor:pointer">Xem lời giải</summary><div class="pc-cau" style="font-size:19px;margin-top:8px">${T(c.q.loigiai)}</div></details>` : ""}
          <div style="text-align:right;margin-top:12px"><button class="chinh" data-tiep>${k + 1 < bo.length ? "Câu tiếp →" : "Xem tổng kết →"}</button></div></div>`;
        await new Promise(ok => { than.querySelector("[data-tiep]").onclick = ok; });
      }
      if (!dung) tongKet(lop, bo, tl, ds);
    }

    /* 4. tổng kết + lưu sang Phân tích */
    function tongKet(lop, bo, tl, ds) {
      const ngay = new Date(); const nhan = ngay.toLocaleDateString("vi-VN");
      const keys = { "001": { TN: bo.map(c => "ABCD"[c.dapan]), DS: [], TLN: [] } };
      const dang = {}; bo.forEach(c => { if (c.q.dkey) dang[c.q.dkey] = (o.dang || {})[c.q.lop + "|" + c.q.dkey] || (o.dang || {})[c.q.dkey] || dang[c.q.dkey] || c.q.dkey; });
      const meta = { lop: (bo[0] && bo[0].q.lop) || "", dang, ma: { "001": { TN: bo.map((c, p) => ({ id: c.q.id, dkey: c.q.dkey, muc: c.q.muc, slot: p + 1, ord: c.ord })) } } };
      const bai = { ten: `Phiếu cuối giờ ${nhan}${o.ten ? " — " + o.ten : ""}`, mon: "Toán", lopHoc: lop, lop: (bo[0] && bo[0].q.lop) || "", preset: "", keys, meta, nguon: "phieu-cuoi-gio", t: ngay.toISOString() };
      const kq = [], ten = {};
      ds.forEach((h, i) => {
        const chon = tl[h.ten]; if (!chon) return;
        const sbd = String(i + 1).padStart(2, "0"); ten[sbd] = h.ten;
        const TN = bo.map((c, k) => chon[k] == null ? "" : "ABCD"[chon[k]]);
        const raw = TN.filter((a, k) => a === keys["001"].TN[k]).length;
        kq.push({ sbd, ma: "001", diem: Math.round(raw / bo.length * 100) / 10, raw, max: bo.length, TN, DS: [], TLN: [], t: Date.now() });
      });
      let id = "";
      try {
        if (G.OMR && OMR.Kho) { const b = OMR.Kho.save(bai); id = b.id; OMR.Kho.setResults(b.id, kq); localStorage.setItem("cham-ds-" + b.id, JSON.stringify(ten)); }
      } catch (e) { console.warn(e); }
      try { L.dong(); } catch (e) {}
      const tile = bo.map(c => c.tong ? Math.round(100 * c.dung / c.tong) : 0);
      than.innerHTML = `<div class="pc-kq">${bo.map((c, k) => `<div class="o" style="border:2px solid ${tile[k] >= 70 ? "#2fbf78" : tile[k] >= 40 ? "#ffb020" : "#e2566f"}"><span>Câu ${k + 1}</span><b>${tile[k]}%</b><span style="opacity:.85">đúng · ${c.dung}/${c.tong} em</span></div>`).join("")}
        <div class="o"><span>Cả lớp</span><b>${kq.length ? (kq.reduce((s, r) => s + r.diem, 0) / kq.length).toFixed(1) : "–"}</b><span style="opacity:.85">điểm TB / 10 · ${kq.length} em làm</span></div></div>
        <div class="pc-the" style="margin-top:14px">${id ? `✅ Đã lưu sang <b>Phân tích</b> (lớp ${esc(lop)}). <button class="xanh" data-pt style="margin-left:10px">📈 Mở trang Phân tích</button>` : "Chưa lưu được kết quả trên máy này."}
        ${tile.some(x => x < 50) ? `<p style="margin:10px 0 0">⚠️ Câu ${tile.map((x, k) => x < 50 ? k + 1 : 0).filter(Boolean).join(", ")} dưới 50% — nên chữa lại đầu tiết sau.</p>` : ""}
        <table class="pc-bang"><tr><th>Học sinh</th>${bo.map((c, k) => `<th>Câu ${k + 1}</th>`).join("")}<th>Điểm</th></tr>${kq.map(r => `<tr><td>${esc(ten[r.sbd])}</td>${r.TN.map((a, k) => `<td style="color:${a === keys["001"].TN[k] ? "#5fe0a0" : "#ff93a6"}">${a || "–"}</td>`).join("")}<td><b>${r.diem}</b></td></tr>`).join("")}</table></div>`;
      dung = true;
      const pt = than.querySelector("[data-pt]"); if (pt) pt.onclick = () => { try { localStorage.setItem("pt-cur", id); } catch (e) {} location.href = "phantich.html#" + id; };
    }
  }
  G.PhieuCuoiGio = { mo };
})(window);
