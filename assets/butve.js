/* butve.js — Bút vẽ ghi trực tiếp lên màn hình đang chiếu (chuột, ngón tay, bút cảm ứng / Apple Pencil).
   ButVe.gan({ root, goc, tile, khoa, cuon, viTri, chup }) → { ve(), bat(), tat(), huy(), dangBat() }
     root  : phần tử chứa lớp vẽ (với trình chiếu toàn màn hình phải là phần tử đang toàn màn hình)
     goc   : () => phần tử làm gốc toạ độ (nét vẽ đi theo nội dung khi cuộn, đổi cỡ chữ)
     tile  : () => hệ số phóng (VD cỡ chữ hiện tại / 30)
     khoa  : () => chuỗi khoá trang (mỗi câu / mỗi bài có nét vẽ riêng)
     tren  : () => số px chừa phía trên (thanh nút của trang)
     cuon  : () => phần tử cuộn (để cuộn bằng 2 ngón / con lăn khi đang vẽ); bỏ trống = cửa sổ
   Phím tắt khi lớp vẽ đang gắn: B bút · H dạ quang · K chỉ laser · E tẩy · W bảng trắng · X xoá trang · Ctrl/⌘+Z hoàn tác · Esc tắt bút.
   Khi bút đang bật: R thước thẳng · G thước đo độ · C compa · P đặt điểm.

   DỤNG CỤ (như phần cây viết của app Ghi chú): thước thẳng có vạch cm, thước đo độ, compa.
     - Dụng cụ nổi trên màn hình (toạ độ màn hình), kéo thân để dời, kéo núm để xoay.
     - Nét dụng cụ vẽ ra được lưu dạng hình học trong n.g (toạ độ nội dung, như nét bút):
         {loai:"diem", P, ten} · {loai:"th", A, B, kieu:"doan"|"tia"|"duong"} · {loai:"cung", O, r, t0, sw}
       → hít điểm, tìm giao điểm, và trang Bảng vẽ chấm được bài.
     - Compa luôn để lại TÂM (một điểm có tên O, O₁…) khi vẽ, trừ khi kim cắm đúng vào một điểm đã có. */
(function () {
  "use strict";
  const MAU = ["#111111", "#e0234e", "#1b5fd6", "#119a4a", "#ff7a00", "#8a2be2"];
  const CO = [2.5, 4.5, 8];
  const CM = 37.8;               // 1 cm = 37,8 đơn vị nội dung (96 dpi khi không phóng)
  const PI = Math.PI, DEG = PI / 180;
  const ICON = {
    thuoc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M5 8v3M8 8v2M11 8v3M14 8v2M17 8v3M20 8v2"/></svg>',
    dodo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 17h20M2 17a10 10 0 0 1 20 0"/><path d="M12 17l5-7"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/></svg>',
    compa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="4" r="1.8"/><path d="M12 6L6 21M12 6l6 15"/><path d="M16.6 17.5l1.4 3.5" stroke-width="3"/></svg>',
    diem: '<svg viewBox="0 0 24 24"><circle cx="9" cy="14" r="3" fill="currentColor"/><text x="13" y="11" font-size="10" font-weight="700" fill="currentColor" font-family="system-ui">A</text></svg>'
  };
  const SO_DUOI = "₀₁₂₃₄₅₆₇₈₉";
  const kc = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const chuan = a => { a %= 2 * PI; return a < 0 ? a + 2 * PI : a; };            // về [0, 2π)
  const lech = (a, b) => { let d = chuan(a - b); return d > PI ? d - 2 * PI : d; }; // a − b trong (−π, π]
  const so1 = x => (Math.round(x * 10) / 10).toString().replace(".", ",");
  let cssXong = false;
  function css() {
    if (cssXong) return; cssXong = true;
    const s = document.createElement("style");
    s.textContent = `
.bv-cv{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9990;pointer-events:none}
.bv-cv.on{pointer-events:auto;touch-action:none;cursor:crosshair}
.bv-cv.tay{cursor:cell}
.bv-bang{position:fixed;inset:0;z-index:9989;background:#fff;display:none}
.bv-bang.on{display:block}
.bv-bang.luoi{background-color:#fff;background-image:linear-gradient(#dfe6f3 1px,transparent 1px),linear-gradient(90deg,#dfe6f3 1px,transparent 1px);background-size:32px 32px}
.bv-tb{position:fixed;z-index:9992;left:12px;bottom:12px;display:flex;gap:5px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 24px);background:rgba(29,39,66,.95);padding:6px;border-radius:16px;box-shadow:0 6px 22px rgba(0,0,0,.28);font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none}
.bv-tb.phai{left:auto;right:12px}
.bv-tb button{min-width:40px;height:40px;border:0;border-radius:11px;background:#2c3a60;color:#fff;font:inherit;font-size:17px;cursor:pointer;padding:0 8px;touch-action:manipulation}
.bv-tb button:hover{background:#3c4c78}
.bv-tb button.on{background:#ff7a59}
.bv-tb .mo{font-size:15px;padding:0 12px}
.bv-tb .mo.on{background:#ff7a59}
.bv-tb .nhom{display:none;gap:5px;align-items:center;flex-wrap:wrap}
.bv-tb.mo-ra .nhom{display:flex}
.bv-tb .mau{min-width:30px;width:30px;height:30px;border-radius:50%;border:3px solid #fff;padding:0}
.bv-tb .mau.on{box-shadow:0 0 0 3px #ff7a59}
.bv-tb .co{min-width:34px;font-size:13px}
.bv-tb .gach{width:1px;height:28px;background:#4a5a85;margin:0 2px}
.bv-toast{position:fixed;z-index:9993;left:50%;top:18px;transform:translateX(-50%);background:#1d2742;color:#fff;padding:8px 14px;border-radius:10px;font:600 14px system-ui,sans-serif;pointer-events:none;opacity:0;transition:opacity .25s}
.bv-toast.on{opacity:.95}
.bv-tb button svg{width:24px;height:24px;display:block;margin:auto}
.bv-tb .nhom-dc{display:none;gap:5px;align-items:center;flex-wrap:wrap}
.bv-tb.mo-ra.co-dc .nhom-dc{display:flex}
.bv-tb .nhom-dc button{font-size:13px;min-width:34px}
.bv-ten{position:fixed;z-index:9994;width:64px;padding:4px 6px;border:2px solid #ff7a59;border-radius:8px;font:700 18px system-ui,sans-serif;text-align:center}
@media (max-width:640px){
  .bv-tb.mo-ra{left:6px;right:6px;bottom:6px;max-width:none;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .bv-tb.mo-ra .nhom,.bv-tb.mo-ra.co-dc .nhom-dc{flex-wrap:nowrap}
  .bv-tb.mo-ra button{flex:none;min-width:38px;height:38px}
}
@media print{.bv-cv,.bv-tb,.bv-bang,.bv-toast{display:none!important}}`;
    document.head.appendChild(s);
  }
  function napH2C() {
    if (window.html2canvas) return Promise.resolve();
    return new Promise((ok, loi) => { const sc = document.createElement("script"); const base = (document.querySelector('script[src*="butve.js"]') || {}).src || ""; sc.src = base.replace(/butve\.js.*$/, "lib/html2canvas.min.js"); sc.onload = ok; sc.onerror = loi; document.head.appendChild(sc); });
  }

  function gan(o) {
    css(); o = o || {};
    const root = o.root || document.body;
    const goc = () => (o.goc && o.goc()) || null;
    const tile = () => { const t = o.tile ? +o.tile() : 1; return t > 0 ? t : 1; };
    const khoaGoc = () => String(o.khoa ? o.khoa() : location.pathname + location.hash);
    const cuon = () => (o.cuon && o.cuon()) || null;
    const S = { bat: false, cu: "but", mau: MAU[1], co: 1, bang: false, luoi: false, an: false, coBut: false, trang: Object.create(null),
      dc: { thuoc: null, dodo: null, compa: null }, kieu: "doan", anVach: false, anSo: false, anTen: false, hit: true };
    const cv = document.createElement("canvas"); cv.className = "bv-cv";
    const bang = document.createElement("div"); bang.className = "bv-bang";
    const tb = document.createElement("div"); tb.className = "bv-tb" + (o.viTri === "phai" ? " phai" : "");
    const toastEl = document.createElement("div"); toastEl.className = "bv-toast";
    root.appendChild(bang); root.appendChild(cv); root.appendChild(tb); root.appendChild(toastEl);
    const ctx = cv.getContext("2d");
    let tt = null;
    function bao(t) { toastEl.textContent = t; toastEl.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 1400); }

    /* ---------------- thanh công cụ */
    tb.innerHTML = `<button class="mo" data-l="mo" title="Bật/tắt bút (B)">✏️ Ghi bảng</button>
<span class="nhom">
<button data-c="but" title="Bút (B)">🖊</button><button data-c="dq" title="Bút dạ quang (H)">🖍</button><button data-c="laser" title="Chỉ bằng laser, nét tự mờ (K)">🔴</button><button data-c="tay" title="Tẩy từng nét (E)">🧽</button>
<span class="gach"></span><button data-d="thuoc" title="Thước thẳng có vạch cm (R)">${ICON.thuoc}</button><button data-d="dodo" title="Thước đo độ (G)">${ICON.dodo}</button><button data-d="compa" title="Compa (C)">${ICON.compa}</button><button data-c="diem" title="Đặt điểm, chạm điểm để đặt tên (P)">${ICON.diem}</button>
<span class="nhom-dc"><span class="gach"></span>
<button data-o="doan" data-t="thuoc" title="Kẻ theo thước ra đoạn thẳng">Đoạn</button><button data-o="tia" data-t="thuoc" title="Kẻ theo thước ra tia">Tia</button><button data-o="duong" data-t="thuoc" title="Kẻ theo thước ra đường thẳng">Đường</button><button data-o="vach" data-t="thuoc" title="Ẩn/hiện vạch chia (thước thẳng không chia để dựng hình)">Vạch</button>
<button data-o="so" data-t="dodo" title="Ẩn/hiện số đo của kim">Số đo</button><button data-o="kekim" data-t="dodo" title="Kẻ tia từ tâm thước theo kim">⟶ Kẻ theo kim</button>
<button data-o="khoa" data-t="compa" title="Khoá khẩu độ compa">🔒 Khẩu độ</button><button data-o="tron" data-t="compa" title="Vẽ cả đường tròn">◯ Cả vòng</button>
<button data-o="ten" title="Ẩn/hiện tên điểm">Tên</button><button data-o="hit" title="Tự hít vào điểm và giao điểm">Hít</button>
</span>
<span class="gach"></span>${MAU.map(m => `<button class="mau" data-m="${m}" style="background:${m}" title="Màu"></button>`).join("")}
<span class="gach"></span>${CO.map((c, i) => `<button class="co" data-s="${i}" title="Độ dày nét">${["Mảnh", "Vừa", "Đậm"][i]}</button>`).join("")}
<span class="gach"></span><button data-l="undo" title="Hoàn tác (Ctrl/⌘+Z)">↶</button><button data-l="xoa" title="Xoá hết nét trang này (X)">🗑</button><button data-l="an" title="Ẩn/hiện nét vẽ">👁</button><button data-l="bang" title="Bảng trắng để nháp (W)">⬜</button><button data-l="luoi" title="Lưới ô vuông trên bảng trắng">▦</button><button data-l="luu" title="Lưu ảnh màn hình kèm nét vẽ">📷</button><button data-l="thu" title="Thu gọn thanh công cụ">✕</button>
</span>`;
    function veTb() {
      tb.classList.toggle("mo-ra", S.bat);
      tb.querySelector('[data-l="mo"]').classList.toggle("on", S.bat);
      tb.querySelector('[data-l="mo"]').textContent = S.bat ? "✏️ Đang ghi" : "✏️ Ghi bảng";
      tb.querySelectorAll("[data-c]").forEach(b => b.classList.toggle("on", b.dataset.c === S.cu));
      tb.querySelectorAll("[data-m]").forEach(b => b.classList.toggle("on", b.dataset.m === S.mau));
      tb.querySelectorAll("[data-s]").forEach(b => b.classList.toggle("on", +b.dataset.s === S.co));
      tb.querySelector('[data-l="bang"]').classList.toggle("on", S.bang);
      tb.querySelector('[data-l="luoi"]').classList.toggle("on", S.luoi);
      tb.querySelector('[data-l="an"]').classList.toggle("on", S.an);
      const D = S.dc, coDC = !!(D.thuoc || D.dodo || D.compa || S.cu === "diem");
      tb.classList.toggle("co-dc", coDC);
      tb.querySelectorAll("[data-d]").forEach(b => b.classList.toggle("on", !!D[b.dataset.d]));
      tb.querySelectorAll("[data-o]").forEach(b => {
        const t = b.dataset.t, k = b.dataset.o;
        b.style.display = t && !D[t] ? "none" : "";
        b.classList.toggle("on", k === S.kieu || (k === "vach" && !S.anVach) || (k === "so" && !S.anSo) || (k === "khoa" && D.compa && D.compa.khoa) || (k === "ten" && !S.anTen) || (k === "hit" && S.hit));
      });
      cv.classList.toggle("on", S.bat); cv.classList.toggle("tay", S.cu === "tay");
      bang.classList.toggle("on", S.bang); bang.classList.toggle("luoi", S.luoi);
    }
    tb.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return; e.stopPropagation();
      if (b.dataset.c) { S.cu = b.dataset.c; if (!S.bat) S.bat = true; }
      else if (b.dataset.d) dungCu(b.dataset.d);
      else if (b.dataset.o) tuyChon(b.dataset.o);
      else if (b.dataset.m) { S.mau = b.dataset.m; if (S.cu === "tay" || S.cu === "laser") S.cu = "but"; }
      else if (b.dataset.s) S.co = +b.dataset.s;
      else lenh(b.dataset.l);
      veTb(); ve();
    });
    function lenh(l) {
      if (l === "mo") { S.bat = !S.bat; if (!S.bat && S.bang) S.bang = false; }
      else if (l === "thu") { S.bat = false; S.bang = false; }
      else if (l === "undo") { const p = trang(); const u = p.lich.pop(); if (u) p.net = u; else bao("Không còn gì để hoàn tác"); }
      else if (l === "xoa") { const p = trang(); if (p.net.some(n => !n.coDinh)) { luuLich(p); p.net = p.net.filter(n => n.coDinh); bao("Đã xoá nét vẽ trang này (bấm ↶ để lấy lại)"); } }
      else if (l === "an") { S.an = !S.an; bao(S.an ? "Đang ẩn nét vẽ" : "Hiện lại nét vẽ"); }
      else if (l === "bang") { S.bang = !S.bang; if (S.bang) { S.bat = true; if (S.cu === "tay" || S.cu === "laser") S.cu = "but"; if (S.mau === "#ffffff") S.mau = MAU[0]; } }
      else if (l === "luoi") { S.luoi = !S.luoi; if (S.luoi && !S.bang) { S.bang = true; S.bat = true; } }
      else if (l === "luu") luuAnh();
    }

    /* ---------------- dữ liệu nét vẽ (toạ độ theo nội dung, chia cho hệ số phóng) */
    const khoa = () => (S.bang ? "bang|" : "") + khoaGoc();
    function trang() { const k = khoa(); return S.trang[k] || (S.trang[k] = { net: [], lich: [] }); }
    function luuLich(p) { p.lich.push(p.net.slice()); if (p.lich.length > 60) p.lich.shift(); }
    function heToa() { // gốc toạ độ (theo px màn hình) và hệ số
      if (S.bang) return { x: 0, y: 0, s: 1 };
      const g = goc(); if (!g) return { x: 0, y: 0, s: 1 };
      const r = g.getBoundingClientRect(); return { x: r.left, y: r.top, s: tile() };
    }
    const doiVao = (e, h) => [(e.clientX - h.x) / h.s, (e.clientY - h.y) / h.s];

    /* ---------------- vẽ */
    let dpr = 1;
    let T = 0; // chừa phần trên (thanh điều khiển của trang) để vẫn bấm được khi đang bật bút
    function coKhung() {
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      T = Math.max(0, Math.round(o.tren ? +o.tren() || 0 : 0));
      if (S.bang) T = 0;
      const B = S.bang ? 0 : Math.max(0, Math.round(o.duoi ? +o.duoi() || 0 : 0));
      cv.style.top = T + "px"; cv.style.height = (window.innerHeight - T - B) + "px";
      if (o.viTri === "tren") { tb.style.top = (T + 8) + "px"; tb.style.bottom = "auto"; }
      const w = Math.round(window.innerWidth * dpr), h = Math.round((window.innerHeight - T - B) * dpr);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    }
    function veNet(c, n, h) {
      const p = n.p; if (!p.length) return;
      if (n.g && n.g.loai === "diem") { // điểm: chấm tròn + tên
        const x = h.x + n.g.P[0] * h.s, y = h.y + n.g.P[1] * h.s, r = Math.max(3.2, 4 * h.s);
        c.save(); c.fillStyle = n.c; c.strokeStyle = "#fff"; c.lineWidth = 1.5;
        if (!n.g.an) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); }
        if (n.g.ten && !S.anTen) {
          c.font = `italic 700 ${Math.round(Math.max(14, 19 * h.s))}px "Times New Roman",Times,serif`;
          c.lineWidth = 4; c.strokeStyle = "rgba(255,255,255,.85)"; c.lineJoin = "round";
          const dx = (n.g.dx == null ? 7 : n.g.dx) * h.s, dy = (n.g.dy == null ? -8 : n.g.dy) * h.s;
          c.strokeText(n.g.ten, x + dx, y + dy); c.fillText(n.g.ten, x + dx, y + dy);
        }
        c.restore(); return;
      }
      c.save(); c.globalAlpha = n.a || 1; c.strokeStyle = n.c; c.fillStyle = n.c; c.lineCap = c.lineJoin = "round";
      c.lineWidth = Math.max(1, n.w * h.s);
      if (n.a && n.a < 1) c.globalCompositeOperation = "multiply";
      const X = q => h.x + q[0] * h.s, Y = q => h.y + q[1] * h.s;
      c.beginPath();
      if (p.length === 1) { c.arc(X(p[0]), Y(p[0]), c.lineWidth / 2, 0, 7); c.fill(); c.restore(); return; }
      c.moveTo(X(p[0]), Y(p[0]));
      if (p.length === 2) c.lineTo(X(p[1]), Y(p[1]));
      else { for (let i = 1; i < p.length - 1; i++) { const mx = (X(p[i]) + X(p[i + 1])) / 2, my = (Y(p[i]) + Y(p[i + 1])) / 2; c.quadraticCurveTo(X(p[i]), Y(p[i]), mx, my); } c.lineTo(X(p[p.length - 1]), Y(p[p.length - 1])); }
      c.stroke(); c.restore();
    }
    const laDiem = n => n.g && n.g.loai === "diem";
    function veHet(c, ds, h) { ds.forEach(n => { if (!laDiem(n)) veNet(c, n, h); }); ds.forEach(n => { if (laDiem(n)) veNet(c, n, h); }); }
    let hen = 0;
    function ve() { if (!hen) hen = requestAnimationFrame(veNgay); }
    function veNgay() {
      hen = 0; coKhung();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, -T * dpr);
      const h = heToa();
      if (!S.an) { veHet(ctx, trang().net, h); if (dang && dang.n) veNet(ctx, dang.n, h); }
      if (S.bat) veDungCu(ctx, h);
      // laser
      const now = performance.now(); laser = laser.filter(l => now - l.t < 900);
      if (laser.length) {
        ctx.save(); ctx.lineCap = ctx.lineJoin = "round"; ctx.shadowColor = "#ff2a2a"; ctx.shadowBlur = 12;
        for (let i = 1; i < laser.length; i++) { const a = laser[i - 1], b = laser[i]; if (b.moi) continue; const f = 1 - (now - b.t) / 900; ctx.globalAlpha = Math.max(0, f); ctx.strokeStyle = "#ff3030"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        ctx.restore(); ve();
      }
    }
    let laser = [];

    /* ---------------- con trỏ */
    let dang = null; const cham = new Map(); let pan = null;
    function batDau(e) {
      if (!S.bat) return;
      if (e.pointerType === "pen") S.coBut = true;
      if (e.pointerType === "touch") {
        cham.set(e.pointerId, [e.clientX, e.clientY]);
        if (S.coBut || cham.size >= 2) { // đã dùng bút thì ngón tay để cuộn; hoặc 2 ngón = cuộn
          if (dang) { dang = null; ve(); }
          pan = tamCham(); e.preventDefault(); return;
        }
      }
      if (e.button > 0 && e.pointerType === "mouse") return;
      e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      const h = heToa(), q = doiVao(e, h);
      if (S.cu === "diem") { datDiem([e.clientX, e.clientY], h); return; }
      if ((S.cu === "but" || S.cu === "dq") && S.dc.thuoc) { const k = keTheoThuoc([e.clientX, e.clientY], h, e.pointerId); if (k) { dang = k; ve(); return; } }
      if (S.cu === "laser") { laser.push({ x: e.clientX, y: e.clientY, t: performance.now(), moi: true }); dang = { id: e.pointerId, laser: true }; ve(); return; }
      if (S.cu === "tay") { dang = { id: e.pointerId, tay: true, xoa: false }; tay(q, h); return; }
      const dq = S.cu === "dq";
      dang = { id: e.pointerId, n: { c: dq ? "#ffd400" : S.mau, a: dq ? .38 : 1, w: (dq ? 20 : CO[S.co]) / h.s, p: [q] } };
      ve();
    }
    function batDauChung(e) { // chạm vào dụng cụ được xử lí trước mọi thứ (kể cả ngón tay khi đã dùng bút cảm ứng)
      if (!S.bat) return;
      const sp = [e.clientX, e.clientY];
      if (e.pointerType === "touch" && dang && dang.dc && !dang.hai && dang.id !== e.pointerId && (dang.dc === "thuoc" || dang.dc === "dodo") && dang.phan === "than") {
        e.preventDefault(); e.stopImmediatePropagation(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
        const t = S.dc[dang.dc], p1 = dang.sp;
        dang.hai = { id2: e.pointerId, p1, p2: sp, a0: Math.atan2(sp[1] - p1[1], sp[0] - p1[0]), m0: [(p1[0] + sp[0]) / 2, (p1[1] + sp[1]) / 2], x0: t.x, y0: t.y, g0: t.goc };
        return;
      }
      if (e.button > 0 && e.pointerType === "mouse") return;
      const ht = trungDungCu(sp); if (!ht) return;
      e.preventDefault(); e.stopImmediatePropagation(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      if (e.pointerType === "pen") S.coBut = true;
      const t = S.dc[ht.loai];
      dang = { id: e.pointerId, dc: ht.loai, phan: ht.phan, sp0: sp, sp, t0: JSON.parse(JSON.stringify(t)), di: 0 };
      if (ht.loai === "compa" && ht.phan === "num") batDauQuay(sp);
      ve();
    }
    function tamCham() { let x = 0, y = 0; cham.forEach(v => { x += v[0]; y += v[1]; }); return [x / cham.size, y / cham.size]; }
    function cuonBy(dx, dy) { const el = cuon(); if (el) el.scrollBy(dx, dy); else window.scrollBy(dx, dy); }
    function diChuyen(e) {
      if (e.pointerType === "touch" && cham.has(e.pointerId)) {
        cham.set(e.pointerId, [e.clientX, e.clientY]);
        if (pan) { const t = tamCham(); cuonBy(pan[0] - t[0], pan[1] - t[1]); pan = t; e.preventDefault(); return; }
      }
      if (dang && dang.hai && (e.pointerId === dang.id || e.pointerId === dang.hai.id2)) { e.preventDefault(); xoayHaiNgon(e); return; }
      if (!dang || dang.id !== e.pointerId) return;
      e.preventDefault();
      if (dang.dc) { keoDungCu([e.clientX, e.clientY]); return; }
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      const h = heToa();
      if (dang.thang) { theoThuoc([e.clientX, e.clientY], h); ve(); return; }
      if (dang.laser) { evs.forEach(v => laser.push({ x: v.clientX, y: v.clientY, t: performance.now() })); ve(); return; }
      if (dang.tay) { tay(doiVao(e, h), h); return; }
      const p = dang.n.p;
      evs.forEach(v => { const q = doiVao(v, h), l = p[p.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) * h.s >= 1.2) p.push(q); });
      ve();
    }
    function ketThuc(e) {
      if (e.pointerType === "touch") { cham.delete(e.pointerId); if (cham.size < 2 && !S.coBut) pan = null; if (!cham.size) pan = null; }
      if (dang && dang.hai && e.pointerId === dang.hai.id2) { dang.hai = null; dang.sp0 = dang.sp; dang.t0 = JSON.parse(JSON.stringify(S.dc[dang.dc])); ve(); return; }
      if (!dang || dang.id !== e.pointerId) return;
      if (dang.dc) { thaDungCu(); dang = null; veTb(); ve(); return; }
      if (dang.thang) { ketThucThuoc(); dang = null; ve(); return; }
      if (dang.n && dang.n.p.length) { const p = trang(); luuLich(p); p.net.push(dang.n); }
      dang = null; ve();
    }
    function tay(q, h) {
      const p = trang(), r = 14 / h.s;
      const con = p.net.filter(n => n.coDinh || !trungNet(n, q, r + n.w / 2));
      if (con.length !== p.net.length) { if (!dang.xoa) { luuLich(p); dang.xoa = true; } p.net = con; ve(); }
    }
    function trungNet(n, q, r) {
      const p = n.p; if (p.length === 1) return Math.hypot(p[0][0] - q[0], p[0][1] - q[1]) <= r;
      for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); if (Math.hypot(a[0] + t * dx - q[0], a[1] + t * dy - q[1]) <= r) return true; }
      return false;
    }
    /* ================================================================ DỤNG CỤ: thước thẳng, thước đo độ, compa */
    const TOL = () => (S.coBut ? 12 : 18);                        // bán kính hít (px màn hình)
    const toC = (s, h) => [(s[0] - h.x) / h.s, (s[1] - h.y) / h.s];
    const toS = (P, h) => [h.x + P[0] * h.s, h.y + P[1] * h.s];
    const cong = (a, b, k) => [a[0] + b[0] * (k == null ? 1 : k), a[1] + b[1] * (k == null ? 1 : k)];
    const tich = (a, b) => a[0] * b[0] + a[1] * b[1];
    const sao = x => JSON.parse(JSON.stringify(x));
    function giuaMan() { const T0 = Math.max(0, o.tren ? +o.tren() || 0 : 0); return [window.innerWidth / 2, T0 + (window.innerHeight - T0) / 2]; }

    function dungCu(l) {
      if (S.dc[l]) { S.dc[l] = null; veTb(); ve(); return; }
      S.bat = true; if (S.cu === "tay" || S.cu === "laser") S.cu = "but";
      const [cx, cy] = giuaMan(), vw = window.innerWidth, vh = window.innerHeight, h = heToa();
      if (l === "thuoc") { const R = thuocHinh({ x: 0, y: 0, goc: 0 }); S.dc.thuoc = { x: cx - R.L / 2, y: cy + 30, goc: 0 }; }
      else if (l === "dodo") { const R = Math.round(Math.max(110, Math.min(230, vw * 0.36, vh * 0.32))); S.dc.dodo = { x: cx, y: cy + R * 0.45, goc: 0, R, kim: 60 * DEG }; }
      else if (l === "compa") { const r = Math.min(3 * CM * h.s, vw * 0.25); S.dc.compa = { kim: [cx - r / 2, cy + 70], chi: [cx + r / 2, cy + 70], khoa: false }; }
      veTb(); ve();
    }
    function tuyChon(k) {
      const h = heToa();
      if (k === "doan" || k === "tia" || k === "duong") S.kieu = k;
      else if (k === "vach") S.anVach = !S.anVach;
      else if (k === "so") S.anSo = !S.anSo;
      else if (k === "ten") S.anTen = !S.anTen;
      else if (k === "hit") { S.hit = !S.hit; bao(S.hit ? "Bật tự hít vào điểm" : "Tắt tự hít"); }
      else if (k === "khoa" && S.dc.compa) { S.dc.compa.khoa = !S.dc.compa.khoa; bao(S.dc.compa.khoa ? "Đã khoá khẩu độ compa" : "Mở khoá khẩu độ"); }
      else if (k === "kekim" && S.dc.dodo) {
        const t = S.dc.dodo, C = [t.x, t.y], d = huongDoDo(t, t.kim);
        themHinh({ loai: "th", A: toC(C, h), B: toC(cong(C, d, t.R), h), kieu: "tia" }, h);
      }
      else if (k === "tron" && S.dc.compa) {
        const c = S.dc.compa, r = kc(c.kim, c.chi); if (r < 3) return;
        const p = trang(); luuLich(p); themTam(p, h);
        p.net.push(taoNet({ loai: "cung", O: toC(c.kim, h), r: r / h.s, t0: Math.atan2(c.chi[1] - c.kim[1], c.chi[0] - c.kim[0]), sw: 2 * PI }, S.mau, CO[S.co] / h.s));
      }
    }

    /* ---------- nét hình học */
    function taoNet(g, c, w) {
      g = sao(g); let p;
      if (g.loai === "diem") p = [g.P];
      else if (g.loai === "th") {
        const d = [g.B[0] - g.A[0], g.B[1] - g.A[1]], L = Math.hypot(d[0], d[1]) || 1, u = [d[0] / L, d[1] / L], X = 6000;
        p = g.kieu === "tia" ? [g.A, cong(g.A, u, X)] : g.kieu === "duong" ? [cong(g.A, u, -X), cong(g.A, u, X)] : [g.A, g.B];
      } else {
        const n = Math.max(6, Math.ceil(Math.abs(g.sw) / (2 * DEG))); p = [];
        for (let i = 0; i <= n; i++) { const a = g.t0 + g.sw * i / n; p.push([g.O[0] + g.r * Math.cos(a), g.O[1] + g.r * Math.sin(a)]); }
      }
      return { c, a: 1, w, p, g };
    }
    function themHinh(g, h) { const p = trang(); luuLich(p); p.net.push(taoNet(g, S.mau, CO[S.co] / h.s)); ve(); }
    const CHU = "ABCDEFGHIKLMNPQRSTUVXYZ";
    function tenDaDung() { const s = new Set(); trang().net.forEach(n => { if (n.g && n.g.ten) s.add(n.g.ten); }); return s; }
    function tenMoi() { const s = tenDaDung(); for (let k = 0; k < 9; k++) for (const ch of CHU) { const t = ch + (k ? SO_DUOI[k] : ""); if (!s.has(t)) return t; } return ""; }
    function tenTam() { const s = tenDaDung(); if (!s.has("O")) return "O"; for (let k = 1; k < 99; k++) { const t = "O" + String(k).split("").map(x => SO_DUOI[x]).join(""); if (!s.has(t)) return t; } return ""; }
    function themTam(p, h) { // compa luôn để lại tâm: thêm điểm tại kim nếu chỗ đó chưa có điểm
      const O = toC(S.dc.compa.kim, h);
      if (p.net.some(n => n.g && n.g.loai === "diem" && kc(n.g.P, O) * h.s < 2)) return null;
      const n = taoNet({ loai: "diem", P: O, ten: tenTam() }, S.mau, CO[S.co] / h.s); p.net.push(n); return n;
    }

    /* ---------- giao điểm và điểm hít (toạ độ nội dung) */
    const EPS = 1e-6;
    const trenTh = (g, t) => g.kieu === "duong" || (g.kieu === "tia" ? t >= -EPS : t >= -EPS && t <= 1 + EPS);
    function trenCung(g, P) {
      if (Math.abs(g.sw) >= 2 * PI - 1e-4) return true;
      const a = Math.atan2(P[1] - g.O[1], P[0] - g.O[0]);
      return (g.sw >= 0 ? chuan(a - g.t0) : chuan(g.t0 - a)) <= Math.abs(g.sw) + 1e-4;
    }
    const cheo = (a, b) => a[0] * b[1] - a[1] * b[0];
    function giaoTT(a, b) {
      const d1 = [a.B[0] - a.A[0], a.B[1] - a.A[1]], d2 = [b.B[0] - b.A[0], b.B[1] - b.A[1]], den = cheo(d1, d2);
      if (Math.abs(den) < 1e-9) return [];
      const w = [b.A[0] - a.A[0], b.A[1] - a.A[1]], t = cheo(w, d2) / den, s = cheo(w, d1) / den;
      return trenTh(a, t) && trenTh(b, s) ? [cong(a.A, d1, t)] : [];
    }
    function giaoTC(l, c) {
      const d = [l.B[0] - l.A[0], l.B[1] - l.A[1]], f = [l.A[0] - c.O[0], l.A[1] - c.O[1]];
      const A = tich(d, d), B = 2 * tich(f, d), C = tich(f, f) - c.r * c.r, D = B * B - 4 * A * C;
      if (D < 0 || A < EPS) return [];
      const ts = D < EPS ? [-B / (2 * A)] : [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)];
      return ts.filter(t => trenTh(l, t)).map(t => cong(l.A, d, t)).filter(P => trenCung(c, P));
    }
    function giaoCC(a, b) {
      const d = kc(a.O, b.O); if (d < EPS || d > a.r + b.r + EPS || d < Math.abs(a.r - b.r) - EPS) return [];
      const x = (d * d + a.r * a.r - b.r * b.r) / (2 * d), y2 = a.r * a.r - x * x, y = y2 > 0 ? Math.sqrt(y2) : 0;
      const e = [(b.O[0] - a.O[0]) / d, (b.O[1] - a.O[1]) / d], M = cong(a.O, e, x), n = [-e[1], e[0]];
      return (y < EPS ? [M] : [cong(M, n, y), cong(M, n, -y)]).filter(P => trenCung(a, P) && trenCung(b, P));
    }
    function giao(a, b) {
      if (a.loai === "th" && b.loai === "th") return giaoTT(a, b);
      if (a.loai === "th") return giaoTC(a, b);
      if (b.loai === "th") return giaoTC(b, a);
      return giaoCC(a, b);
    }
    let boNho = { net: null, n: -1, ds: [] };
    function diemHit() {
      const net = trang().net;
      if (boNho.net === net && boNho.n === net.length) return boNho.ds;
      const ds = [], them = (P, loai) => { if (!ds.some(d => kc(d.P, P) < .5)) ds.push({ P, loai }); };
      net.forEach(n => { if (n.g && n.g.loai === "diem") them(n.g.P, "diem"); });
      const hh = net.filter(n => n.g && n.g.loai !== "diem").map(n => n.g).slice(-120);
      hh.forEach(g => { if (g.loai === "th") { them(g.A, "mut"); if (g.kieu === "doan") them(g.B, "mut"); } });
      for (let i = 0; i < hh.length; i++) for (let j = i + 1; j < hh.length; j++) giao(hh[i], hh[j]).forEach(P => them(P, "giao"));
      boNho = { net, n: net.length, ds };
      return ds;
    }
    function hitDiem(sp, h, boQua) {
      if (!S.hit) return null;
      let best = null, bd = TOL();
      for (const d of diemHit()) { const s = toS(d.P, h), k = kc(s, sp); if (k < bd && !(boQua && kc(s, boQua) < 1)) { bd = k; best = { s, P: d.P, loai: d.loai }; } }
      return best;
    }
    // xoay về phía một điểm / một đường có sẵn, hoặc bội của 15°
    function hutGoc(C, a, h, haiChieu) {
      if (!S.hit) return a;
      let best = null, bd = Infinity;
      const thu = b => { const e = Math.abs(lech(a, b)); if (e < bd) { bd = e; best = b; } };
      diemHit().forEach(d => {
        const s = toS(d.P, h), r = kc(s, C); if (r < 25) return;
        const b = Math.atan2(s[1] - C[1], s[0] - C[0]); const e = TOL() / r;
        if (Math.abs(lech(a, b)) < e) thu(b); if (haiChieu && Math.abs(lech(a, b + PI)) < e) thu(b + PI);
      });
      if (best != null) return best;
      const Cc = toC(C, h);
      trang().net.forEach(n => {
        const g = n.g; if (!g || g.loai !== "th") return;
        const d = [g.B[0] - g.A[0], g.B[1] - g.A[1]], L = Math.hypot(d[0], d[1]); if (L < EPS) return;
        if (Math.abs(cheo(d, [Cc[0] - g.A[0], Cc[1] - g.A[1]]) / L) * h.s > 3) return; // đường không qua tâm
        const b = Math.atan2(d[1], d[0]);
        [b, b + PI].forEach(x => { if (Math.abs(lech(a, x)) < 2.5 * DEG) thu(x); });
      });
      if (best != null) return best;
      const b15 = Math.round(a / (15 * DEG)) * 15 * DEG;
      return Math.abs(lech(a, b15)) < 1.2 * DEG ? b15 : a;
    }

    /* ---------- hình dạng dụng cụ (toạ độ màn hình) */
    function thuocHinh(t) {
      t = t || S.dc.thuoc; const h = heToa(), sp = CM * h.s;
      let n = Math.floor(Math.min(window.innerWidth - 110, 15 * sp + .5) / sp); n = Math.max(2, Math.min(30, n));
      const u = [Math.cos(t.goc), Math.sin(t.goc)];
      return { O: [t.x, t.y], u, n: [-u[1], u[0]], L: n * sp, W: Math.max(46, Math.min(62, sp * 1.5)), sp, soCm: n };
    }
    const huongDoDo = (t, a) => [Math.cos(t.goc - a), Math.sin(t.goc - a)];   // a: góc trên thước (0 ở mút phải)
    function doDoHinh(t) {
      t = t || S.dc.dodo; const u = [Math.cos(t.goc), Math.sin(t.goc)], v = [Math.sin(t.goc), -Math.cos(t.goc)], C = [t.x, t.y];
      return { C, u, v, R: t.R, num: cong(C, u, t.R + 24), dong: cong(C, u, -t.R - 24), dau: cong(C, huongDoDo(t, t.kim), t.R + 36) };
    }
    function compaHinh(c) {
      c = c || S.dc.compa; const v = [c.chi[0] - c.kim[0], c.chi[1] - c.kim[1]], d = Math.hypot(v[0], v[1]);
      const e = d > EPS ? [v[0] / d, v[1] / d] : [1, 0];
      let w = [-e[1], e[0]]; if (w[1] > 0 || (Math.abs(w[1]) < EPS && w[0] > 0)) w = [-w[0], -w[1]];
      const Lg = Math.max(150, d / 2 + 50), M = [(c.kim[0] + c.chi[0]) / 2, (c.kim[1] + c.chi[1]) / 2];
      const H = cong(M, w, Math.sqrt(Math.max(0, Lg * Lg - d * d / 4))), K = cong(H, w, 36);
      return { d, e, w, M, H, K, X: cong(K, e, 32) };
    }
    function khoangDoan(P, A, B) { const d = [B[0] - A[0], B[1] - A[1]], L = tich(d, d); let t = L ? tich([P[0] - A[0], P[1] - A[1]], d) / L : 0; t = Math.max(0, Math.min(1, t)); return kc(P, cong(A, d, t)); }

    function trungDungCu(sp) {
      const D = S.dc;
      if (D.compa) {
        const c = D.compa, G = compaHinh(c);
        if (kc(sp, G.K) < 24) return { loai: "compa", phan: "num" };
        if (kc(sp, G.X) < 16) return { loai: "compa", phan: "dong" };
        if (kc(sp, c.chi) < 22) return { loai: "compa", phan: "chi" };
        if (kc(sp, c.kim) < 22) return { loai: "compa", phan: "kim" };
        if (khoangDoan(sp, G.H, c.kim) < 12 || khoangDoan(sp, G.H, c.chi) < 12 || kc(sp, G.H) < 14) return { loai: "compa", phan: "than" };
      }
      if (D.dodo) {
        const t = D.dodo, G = doDoHinh(t);
        if (kc(sp, G.dau) < 22) return { loai: "dodo", phan: "kimdo" };
        if (kc(sp, G.num) < 22) return { loai: "dodo", phan: "xoay" };
        if (kc(sp, G.dong) < 16) return { loai: "dodo", phan: "dong" };
        const r = [sp[0] - G.C[0], sp[1] - G.C[1]];
        if (Math.hypot(r[0], r[1]) <= G.R + 4 && tich(r, G.v) >= -16) return { loai: "dodo", phan: "than" };
      }
      if (D.thuoc) {
        const R = thuocHinh(), r = [sp[0] - R.O[0], sp[1] - R.O[1]], t = tich(r, R.u), d = tich(r, R.n);
        if (kc(sp, cong(cong(R.O, R.u, R.L + 26), R.n, R.W / 2)) < 22) return { loai: "thuoc", phan: "xoay" };
        if (kc(sp, cong(cong(R.O, R.u, -26), R.n, R.W / 2)) < 16) return { loai: "thuoc", phan: "dong" };
        if (t >= -12 && t <= R.L + 12 && d >= 14 && d <= R.W) return { loai: "thuoc", phan: "than" };
      }
      return null;
    }

    /* ---------- kẻ theo mép thước */
    function hitTrenThuoc(sp, R, h) {
      const k = hitDiem(sp, h); if (!k) return null;
      return Math.abs(tich([k.s[0] - R.O[0], k.s[1] - R.O[1]], R.n)) < 4 ? k : null;
    }
    function keTheoThuoc(sp, h, id) {
      const R = thuocHinh(), r = [sp[0] - R.O[0], sp[1] - R.O[1]], t = tich(r, R.u), d = tich(r, R.n);
      if (!(d >= -24 && d < 14 && t >= -14 && t <= R.L + 14)) return null;
      const k = hitTrenThuoc(sp, R, h), a = k ? k.s : cong(R.O, R.u, t);
      const dq = S.cu === "dq";
      return { id, thang: true, a, b: a, hut: k ? k.s : null, n: { c: dq ? "#ffd400" : S.mau, a: dq ? .38 : 1, w: (dq ? 20 : CO[S.co]) / h.s, p: [toC(a, h), toC(a, h)] } };
    }
    function theoThuoc(sp, h) {
      const R = thuocHinh(), t = tich([sp[0] - R.O[0], sp[1] - R.O[1]], R.u);
      const k = hitTrenThuoc(sp, R, h); dang.b = k ? k.s : cong(R.O, R.u, t); dang.hut = k ? k.s : null;
      dang.n.p = [toC(dang.a, h), toC(dang.b, h)];
    }
    function ketThucThuoc() {
      const h = heToa(); if (kc(dang.a, dang.b) < 4) return;
      const A = toC(dang.a, h), B = toC(dang.b, h), p = trang(); luuLich(p);
      if (S.cu === "dq") p.net.push(dang.n);
      else p.net.push(taoNet({ loai: "th", A, B, kieu: S.kieu }, S.mau, CO[S.co] / h.s));
    }

    /* ---------- đặt điểm, đặt tên */
    function datDiem(sp, h) {
      const p = trang();
      const cu = p.net.slice().reverse().find(n => n.g && n.g.loai === "diem" && kc(toS(n.g.P, h), sp) < TOL());
      if (cu) { moTen(cu, toS(cu.g.P, h)); return; }
      const k = hitDiem(sp, h), P = k ? k.P : toC(sp, h);
      luuLich(p); p.net.push(taoNet({ loai: "diem", P, ten: tenMoi() }, S.mau, CO[S.co] / h.s)); ve();
    }
    function moTen(n, s) {
      const ip = document.createElement("input"); ip.className = "bv-ten"; ip.value = n.g.ten || ""; ip.maxLength = 4;
      ip.style.left = Math.min(window.innerWidth - 80, s[0] + 10) + "px"; ip.style.top = Math.max(4, s[1] - 44) + "px";
      root.appendChild(ip); ip.focus(); ip.select();
      let xong = false; const dong = luu => { if (xong) return; xong = true; if (luu) { n.g.ten = ip.value.trim(); boNho.n = -1; } ip.remove(); ve(); };
      ip.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") dong(true); else if (e.key === "Escape") dong(false); });
      ip.addEventListener("blur", () => dong(true));
    }

    /* ---------- kéo, xoay dụng cụ */
    function batDauQuay(sp) {
      const c = S.dc.compa, h = heToa(), r = kc(c.kim, c.chi);
      if (r < 3) { dang.phan = "than"; return; }
      const p = trang(); luuLich(p); const tam = themTam(p, h);
      const a0 = Math.atan2(c.chi[1] - c.kim[1], c.chi[0] - c.kim[0]);
      dang.quay = { O: toC(c.kim, h), r: r / h.s, rS: r, a0, sw: 0, aTruoc: Math.atan2(sp[1] - c.kim[1], sp[0] - c.kim[0]), tam };
    }
    function keoDungCu(sp) {
      const l = dang.dc, t = S.dc[l], t0 = dang.t0, h = heToa();
      if (!t) return;
      dang.sp = sp; const dx = sp[0] - dang.sp0[0], dy = sp[1] - dang.sp0[1]; dang.di = Math.max(dang.di, Math.hypot(dx, dy));
      dang.hut = null;
      if (l === "thuoc" || l === "dodo") {
        if (dang.phan === "than") {
          t.x = t0.x + dx; t.y = t0.y + dy;
          const k = hitDiem([t.x, t.y], h); if (k) { t.x = k.s[0]; t.y = k.s[1]; dang.hut = k.s; }
        } else if (dang.phan === "xoay") {
          t.goc = hutGoc([t.x, t.y], Math.atan2(sp[1] - t.y, sp[0] - t.x), h, l === "dodo");
        } else if (dang.phan === "kimdo") {
          const W = hutGoc([t.x, t.y], Math.atan2(sp[1] - t.y, sp[0] - t.x), h);
          let a = lech(t.goc, W); if (a < 0) a = a < -PI / 2 ? PI : 0; t.kim = a;
        }
      } else if (l === "compa") {
        if (dang.phan === "than" || dang.phan === "kim") {
          let m = [dx, dy]; const kim = cong(t0.kim, m), k = hitDiem(kim, h);
          if (k) { m = [k.s[0] - t0.kim[0], k.s[1] - t0.kim[1]]; dang.hut = k.s; }
          t.kim = cong(t0.kim, m); t.chi = cong(t0.chi, m);
        } else if (dang.phan === "chi") {
          if (t.khoa) { const r = kc(t0.kim, t0.chi), a = Math.atan2(sp[1] - t.kim[1], sp[0] - t.kim[0]); t.chi = cong(t.kim, [Math.cos(a), Math.sin(a)], r); }
          else { let ch = cong(t0.chi, [dx, dy]); const k = hitDiem(ch, h, t.kim); if (k) { ch = k.s; dang.hut = k.s; } t.chi = ch; }
        } else if (dang.phan === "num" && dang.quay) {
          const q = dang.quay, a = Math.atan2(sp[1] - t.kim[1], sp[0] - t.kim[0]);
          q.sw = Math.max(-2 * PI, Math.min(2 * PI, q.sw + lech(a, q.aTruoc))); q.aTruoc = a;
          t.chi = cong(t.kim, [Math.cos(q.a0 + q.sw), Math.sin(q.a0 + q.sw)], q.rS);
          dang.n = Math.abs(q.sw) > .5 * DEG ? taoNet({ loai: "cung", O: q.O, r: q.r, t0: q.a0, sw: q.sw }, S.mau, CO[S.co] / h.s) : null;
        }
      }
      ve();
    }
    function xoayHaiNgon(e) {
      const H2 = dang.hai, sp = [e.clientX, e.clientY];
      if (e.pointerId === H2.id2) H2.p2 = sp; else H2.p1 = sp;
      const d = lech(Math.atan2(H2.p2[1] - H2.p1[1], H2.p2[0] - H2.p1[0]), H2.a0), m = [(H2.p1[0] + H2.p2[0]) / 2, (H2.p1[1] + H2.p2[1]) / 2];
      const t = S.dc[dang.dc], r = [H2.x0 - H2.m0[0], H2.y0 - H2.m0[1]], c = Math.cos(d), s = Math.sin(d);
      t.x = m[0] + r[0] * c - r[1] * s; t.y = m[1] + r[0] * s + r[1] * c; t.goc = H2.g0 + d;
      ve();
    }
    function thaDungCu() {
      const l = dang.dc, t = S.dc[l], h = heToa();
      if (dang.phan === "dong") { if (dang.di < 8) S.dc[l] = null; return; }
      if (l === "dodo" && dang.phan === "than" && dang.di < 5) { // chạm lên vạch chia → chấm một điểm tại vạch đó
        const r = [dang.sp0[0] - t.x, dang.sp0[1] - t.y], R = Math.hypot(r[0], r[1]);
        if (R > t.R - 34 && R <= t.R + 4) {
          let a = lech(t.goc, Math.atan2(r[1], r[0])); a = Math.round(Math.max(0, Math.min(PI, a)) / DEG) * DEG;
          const p = trang(); luuLich(p); p.net.push(taoNet({ loai: "diem", P: toC(cong([t.x, t.y], huongDoDo(t, a), t.R), h), ten: "" }, S.mau, CO[S.co] / h.s));
          bao("Đã chấm điểm tại vạch " + Math.round(a / DEG) + "°");
        }
      }
      if (l === "compa" && dang.phan === "num" && dang.quay) {
        const q = dang.quay, p = trang();
        if (Math.abs(q.sw) >= .8 * DEG) {
          const sw = Math.abs(q.sw) >= 2 * PI - 1.5 * DEG ? 2 * PI * Math.sign(q.sw) : q.sw;
          p.net.push(taoNet({ loai: "cung", O: q.O, r: q.r, t0: q.a0, sw }, S.mau, CO[S.co] / h.s));
        } else { const u = p.lich.pop(); if (u) p.net = u; }   // chưa quay: bỏ luôn tâm vừa thêm
        dang.n = null;
      }
    }

    /* ---------- vẽ dụng cụ */
    function chu(c, s, x, y, mau, co, dam) {
      c.font = `${dam ? "700 " : "600 "}${co}px system-ui,-apple-system,"Segoe UI",sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.lineWidth = 3; c.strokeStyle = "rgba(255,255,255,.9)"; c.strokeText(s, x, y); c.fillStyle = mau; c.fillText(s, x, y);
    }
    function nut(c, x, y, r, kyTu, nen) {
      c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = nen || "#1d2742"; c.fill(); c.lineWidth = 2; c.strokeStyle = "#fff"; c.stroke();
      c.fillStyle = "#fff"; c.font = `700 ${Math.round(r * 1.15)}px system-ui,sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(kyTu, x, y + 1);
    }
    function veThuoc(c) {
      const R = thuocHinh(), { O, L, W, sp } = R;
      c.save(); c.translate(O[0], O[1]); c.rotate(S.dc.thuoc.goc);
      c.fillStyle = "rgba(255,214,102,.62)"; c.strokeStyle = "#9a6a00"; c.lineWidth = 1.5;
      c.beginPath(); c.rect(-12, 0, L + 24, W); c.fill(); c.stroke();
      c.strokeStyle = "#3d2b00"; c.lineWidth = 2; c.beginPath(); c.moveTo(-12, 0); c.lineTo(L + 12, 0); c.stroke();
      if (!S.anVach) {
        c.strokeStyle = "#3d2b00"; c.lineWidth = 1;
        const mm = sp / 10 >= 3;
        for (let i = 0; i <= R.soCm * 10; i++) {
          if (!mm && i % 5) continue;
          const x = i * sp / 10, len = i % 10 === 0 ? 15 : i % 5 === 0 ? 10 : 6;
          c.beginPath(); c.moveTo(x, 0); c.lineTo(x, len); c.stroke();
          if (i % 10 === 0) { c.fillStyle = "#3d2b00"; c.font = "600 12px system-ui,sans-serif"; c.textAlign = "center"; c.textBaseline = "top"; c.fillText(String(i / 10), x, 18); }
        }
        c.font = "600 11px system-ui,sans-serif"; c.textAlign = "right"; c.fillText("cm", L + 8, W - 14);
      }
      c.restore();
      nut(c, ...cong(cong(O, R.u, L + 26), R.n, W / 2), 16, "↻");
      nut(c, ...cong(cong(O, R.u, -26), R.n, W / 2), 12, "×", "#7a8399");
      if (dang && dang.dc === "thuoc" && dang.phan !== "than") { const g = Math.round(chuan(-S.dc.thuoc.goc) / DEG) % 360; chu(c, g + "°", ...cong(cong(O, R.u, L + 26), R.n, W / 2 + 32), "#1d2742", 15, true); }
    }
    function veMatDoDo(c, t) {
      const R = t.R, fs = Math.round(Math.max(10, Math.min(15, R / 15)));
      c.save(); c.translate(t.x, t.y); c.rotate(t.goc);
      c.beginPath(); c.arc(0, 0, R, 0, -PI, true); c.lineTo(-R - 10, 0); c.lineTo(-R - 10, 14); c.lineTo(R + 10, 14); c.lineTo(R + 10, 0); c.closePath();
      c.fillStyle = "rgba(160,215,255,.42)"; c.fill(); c.strokeStyle = "#1b5fd6"; c.lineWidth = 1.5; c.stroke();
      c.beginPath(); c.arc(0, 0, R - 36, 0, -PI, true); c.strokeStyle = "rgba(27,95,214,.45)"; c.lineWidth = 1; c.stroke();
      c.strokeStyle = "#0f2e66";
      for (let d = 0; d <= 180; d++) {
        const a = d * DEG, cs = Math.cos(a), sn = -Math.sin(a), len = d % 10 === 0 ? 15 : d % 5 === 0 ? 10 : 6;
        c.lineWidth = d % 10 === 0 ? 1.3 : .8; c.beginPath(); c.moveTo(R * cs, R * sn); c.lineTo((R - len) * cs, (R - len) * sn); c.stroke();
        if (d % 10 === 0) {
          c.save(); c.translate((R - 24) * cs, (R - 24) * sn); c.rotate(-a + PI / 2); c.fillStyle = "#1b5fd6"; c.font = `700 ${fs}px system-ui,sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(180 - d), 0, 0); c.restore();
          c.save(); c.translate((R - 46) * cs, (R - 46) * sn); c.rotate(-a + PI / 2); c.fillStyle = "#c2263c"; c.font = `700 ${fs - 1}px system-ui,sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(d), 0, 0); c.restore();
        }
      }
      c.strokeStyle = "#0f2e66"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-R - 10, 0); c.lineTo(R + 10, 0); c.stroke();
      c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 10); c.stroke();
      c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.stroke();
      // kim đọc số
      const k = t.kim, kx = Math.cos(k), ky = -Math.sin(k);
      c.strokeStyle = "#e0234e"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo((R + 36) * kx, (R + 36) * ky); c.stroke();
      c.restore();
    }
    function veDoDo(c, h) {
      const t = S.dc.dodo, G = doDoHinh(t);
      veMatDoDo(c, t);
      c.beginPath(); c.arc(G.dau[0], G.dau[1], 12, 0, 7); c.fillStyle = "rgba(224,35,78,.85)"; c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 2; c.stroke();
      nut(c, G.num[0], G.num[1], 16, "↻"); nut(c, G.dong[0], G.dong[1], 12, "×", "#7a8399");
      if (!S.anSo) {
        const d = Math.round(t.kim / DEG), P = cong(G.dau, huongDoDo(t, t.kim), 30);
        c.save(); c.font = "700 15px system-ui,sans-serif"; const s1 = d + "°", s2 = (180 - d) + "°", w1 = c.measureText(s1).width, w2 = c.measureText(s2).width, W = w1 + w2 + 34;
        c.fillStyle = "rgba(255,255,255,.95)"; c.strokeStyle = "#1d2742"; c.lineWidth = 1;
        const x0 = Math.max(4, Math.min(window.innerWidth - W - 4, P[0] - W / 2)), y0 = Math.max(T + 4, Math.min(window.innerHeight - 30, P[1] - 13));
        c.beginPath(); c.rect(x0, y0, W, 26); c.fill(); c.stroke();
        c.textBaseline = "middle"; c.textAlign = "left"; c.fillStyle = "#c2263c"; c.fillText(s1, x0 + 8, y0 + 13);
        c.fillStyle = "#7a8399"; c.fillText("|", x0 + 13 + w1, y0 + 13); c.fillStyle = "#1b5fd6"; c.fillText(s2, x0 + 24 + w1, y0 + 13); c.restore();
      }
      if (dang && dang.dc === "dodo" && dang.phan === "kimdo") { // kính lúp tại chỗ kim cắt vạch chia
        const dir = huongDoDo(t, t.kim), F = cong(G.C, dir, t.R - 12), m = Math.min(54, t.R * .3), M = cong(G.C, dir, t.R * .42);
        c.save(); c.beginPath(); c.arc(M[0], M[1], m, 0, 7); c.fillStyle = S.bang ? "#fff" : "rgba(255,255,255,.96)"; c.fill(); c.clip();
        c.translate(M[0], M[1]); c.scale(3, 3); c.translate(-F[0], -F[1]);
        if (!S.an) veHet(c, trang().net, h); veMatDoDo(c, t); c.restore();
        c.beginPath(); c.arc(M[0], M[1], m, 0, 7); c.strokeStyle = "#1d2742"; c.lineWidth = 2.5; c.stroke();
      }
    }
    function veCompa(c, h) {
      const k = S.dc.compa, G = compaHinh(k), e1 = [k.chi[0] - G.H[0], k.chi[1] - G.H[1]], L1 = Math.hypot(e1[0], e1[1]) || 1, u1 = [e1[0] / L1, e1[1] / L1];
      const dangKeo = dang && dang.dc === "compa";
      if (dangKeo && dang.phan === "chi") { c.save(); c.setLineDash([6, 5]); c.strokeStyle = "rgba(29,39,66,.6)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(...k.kim); c.lineTo(...k.chi); c.stroke(); c.restore(); }
      c.save(); c.lineCap = "round";
      c.strokeStyle = "#7d8798"; c.lineWidth = 7; c.beginPath(); c.moveTo(...G.H); c.lineTo(...cong(k.kim, [G.H[0] - k.kim[0], G.H[1] - k.kim[1]], 12 / (kc(G.H, k.kim) || 1))); c.stroke();
      c.strokeStyle = "#2b2f38"; c.lineWidth = 2; c.beginPath(); c.moveTo(...cong(k.kim, [G.H[0] - k.kim[0], G.H[1] - k.kim[1]], 14 / (kc(G.H, k.kim) || 1))); c.lineTo(...k.kim); c.stroke();
      c.strokeStyle = "#7d8798"; c.lineWidth = 7; c.beginPath(); c.moveTo(...G.H); c.lineTo(...cong(k.chi, u1, -34)); c.stroke();
      c.strokeStyle = "#f2b632"; c.lineWidth = 9; c.lineCap = "butt"; c.beginPath(); c.moveTo(...cong(k.chi, u1, -34)); c.lineTo(...cong(k.chi, u1, -9)); c.stroke();
      c.strokeStyle = "#2b2f38"; c.lineWidth = 3.5; c.lineCap = "round"; c.beginPath(); c.moveTo(...cong(k.chi, u1, -10)); c.lineTo(...k.chi); c.stroke();
      c.strokeStyle = "#5b6475"; c.lineWidth = 5; c.beginPath(); c.moveTo(...G.H); c.lineTo(...G.K); c.stroke();
      c.beginPath(); c.arc(G.H[0], G.H[1], 8, 0, 7); c.fillStyle = "#5b6475"; c.fill();
      c.restore();
      nut(c, G.K[0], G.K[1], 15, "↻", dangKeo && dang.phan === "num" ? "#ff7a59" : "#1d2742");
      nut(c, G.X[0], G.X[1], 11, "×", "#7a8399");
      c.beginPath(); c.arc(k.kim[0], k.kim[1], 3, 0, 7); c.fillStyle = "#e0234e"; c.fill();
      const r = G.d / h.s / CM, nh = cong(G.M, G.w, -22);
      chu(c, "r = " + so1(r) + " cm" + (k.khoa ? " 🔒" : ""), nh[0], nh[1], "#1d2742", 14, true);
    }
    function veDungCu(c, h) {
      const D = S.dc;
      if (D.thuoc || D.dodo || D.compa || S.cu === "diem") { // gợi ý giao điểm chưa đặt tên
        c.save(); c.strokeStyle = "rgba(29,39,66,.55)"; c.lineWidth = 1.2;
        diemHit().forEach(d => { if (d.loai !== "giao") return; const s = toS(d.P, h); c.beginPath(); c.arc(s[0], s[1], 4, 0, 7); c.stroke(); });
        c.restore();
      }
      if (D.thuoc) veThuoc(c);
      if (D.dodo) veDoDo(c, h);
      if (D.compa) veCompa(c, h);
      if (dang && dang.hut) { c.save(); c.strokeStyle = "#ff7a00"; c.lineWidth = 2.5; c.beginPath(); c.arc(dang.hut[0], dang.hut[1], 10, 0, 7); c.stroke(); c.restore(); }
    }

    cv.addEventListener("pointerdown", batDauChung);
    cv.addEventListener("pointerdown", batDau);
    cv.addEventListener("pointermove", diChuyen);
    cv.addEventListener("pointerup", ketThuc);
    cv.addEventListener("pointercancel", ketThuc);
    cv.addEventListener("wheel", e => { if (!S.bang) { e.preventDefault(); cuonBy(e.deltaX, e.deltaY); } }, { passive: false });
    cv.addEventListener("contextmenu", e => e.preventDefault());

    /* ---------------- vẽ lại khi cuộn, đổi cỡ, đổi nội dung */
    const onScroll = () => ve();
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    let ro = null, gocCu = null;
    function theoDoi() { const g = goc(); if (g === gocCu) return; if (ro) ro.disconnect(); gocCu = g; if (g && window.ResizeObserver) { ro = new ResizeObserver(() => ve()); ro.observe(g); } }

    /* ---------------- phím tắt */
    function phim(e) {
      if (!root.isConnected || getComputedStyle(root).display === "none") return;
      if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || "") || (e.target && e.target.isContentEditable)) return;
      const k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") { if (S.bat || trang().net.length) { e.preventDefault(); e.stopImmediatePropagation(); lenh("undo"); veTb(); ve(); } return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (o.phim === false && k !== "escape") return; // trang có phím chữ riêng (trò chơi) → chỉ giữ Esc
      const map = { b: "but", h: "dq", k: "laser", e: "tay", p: "diem" }, mapDC = { r: "thuoc", g: "dodo", c: "compa" };
      if (k === "escape" && (S.bat || S.bang)) { e.preventDefault(); e.stopImmediatePropagation(); S.bat = false; S.bang = false; }
      else if (mapDC[k] && S.bat) dungCu(mapDC[k]);
      else if (k === "b" && S.bat && S.cu === "but") { S.bat = false; }
      else if (map[k] && (k === "b" || S.bat)) { S.cu = map[k]; S.bat = true; }
      else if (k === "w") lenh("bang");
      else if (k === "x" && S.bat) lenh("xoa");
      else return;
      e.preventDefault(); e.stopImmediatePropagation(); veTb(); ve();
    }
    window.addEventListener("keydown", phim, true);

    /* ---------------- lưu ảnh */
    async function luuAnh() {
      const h = heToa();
      let nen = null, x0 = 0, y0 = 0, W = window.innerWidth, H = window.innerHeight;
      bao("Đang chụp màn hình…");
      try {
        if (!S.bang) {
          await napH2C();
          const el = (o.chup && o.chup()) || goc() || document.body;
          const r = el.getBoundingClientRect(); x0 = r.left; y0 = r.top; W = r.width; H = r.height;
          // mở rộng để giữ nét vẽ nằm ngoài phần nội dung
          const ns = trang().net; ns.forEach(n => n.p.forEach(q => { const X = h.x + q[0] * h.s, Y = h.y + q[1] * h.s; if (X < x0) { W += x0 - X; x0 = X; } if (Y < y0) { H += y0 - Y; y0 = Y; } if (X > x0 + W) W = X - x0; if (Y > y0 + H) H = Y - y0; }));
          x0 -= 16; y0 -= 16; W += 32; H += 32;
          nen = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", logging: false, ignoreElements: e2 => e2 === cv || e2 === tb || e2 === bang || e2 === toastEl });
          var rx = r.left - x0, ry = r.top - y0;
        }
        const c = document.createElement("canvas"); c.width = Math.ceil(W * 2); c.height = Math.ceil(H * 2);
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.scale(2, 2);
        if (S.luoi && S.bang) { g.strokeStyle = "#dfe6f3"; g.lineWidth = 1; for (let x = 0; x < W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
        if (nen) g.drawImage(nen, rx, ry, nen.width / 2, nen.height / 2);
        const h2 = { x: h.x - x0, y: h.y - y0, s: h.s };
        veHet(g, trang().net, h2);
        const a = document.createElement("a"); a.download = "GhiBang_" + new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "") + ".png";
        a.href = c.toDataURL("image/png"); document.body.appendChild(a); a.click(); a.remove();
        bao("Đã lưu ảnh");
      } catch (err) { bao("Không chụp được: " + (err && err.message || err)); }
    }

    let mo = null;
    if (o.giuLai && window.MutationObserver) { // trang tự vẽ lại nội dung (innerHTML) → gắn lại lớp vẽ
      mo = new MutationObserver(() => { if (!cv.isConnected) { [bang, cv, tb, toastEl].forEach(x => root.appendChild(x)); theoDoi(); ve(); } });
      mo.observe(root, { childList: true });
    }
    veTb(); theoDoi(); ve();
    return {
      ve() { theoDoi(); ve(); },
      bat() { S.bat = true; veTb(); ve(); },
      tat() { S.bat = false; S.bang = false; dang = null; veTb(); ve(); },
      dangBat: () => S.bat,
      /* dụng cụ: moDungCu("thuoc"|"dodo"|"compa"), dongDungCu(loai) */
      moDungCu(l) { S.bat = true; if (!S.dc[l]) dungCu(l); veTb(); ve(); },
      dongDungCu(l) { S.dc[l] = null; veTb(); ve(); },
      chonCu(c) { S.cu = c; S.bat = true; veTb(); ve(); },
      /* tuỳ chọn: dat("anSo"|"anVach"|"anTen"|"hit", true/false) hoặc dat("kieu", "doan"|"tia"|"duong") */
      dat(k, v) { if (k in S && /^(anSo|anVach|anTen|hit|kieu)$/.test(k)) { S[k] = v; veTb(); ve(); } },
      /* hình học trên trang hiện tại (toạ độ nội dung) — để trang Bảng vẽ chấm bài */
      hinh: () => trang().net.filter(n => n.g).map(n => Object.assign({ coDinh: !!n.coDinh }, n.g)),
      /* đặt hình cố định (đề bài) cho trang hiện tại: [{loai:"diem",P,ten}|{loai:"th",A,B,kieu}|{loai:"cung",O,r,t0,sw}] */
      datDeBai(ds, mau) {
        const p = trang(); p.net = []; p.lich = [];
        const w = CO[1], c = mau || "#1d2742";
        (ds || []).forEach(g => { const n = taoNet(g, c, w); n.coDinh = true; p.net.unshift(n); });
        // điểm vẽ sau cùng để nằm trên nét
        p.net.sort((a, b) => (a.g && a.g.loai === "diem") - (b.g && b.g.loai === "diem"));
        ve();
      },
      xoaTrang() { const p = trang(); p.net = p.net.filter(n => n.coDinh); p.lich = []; ve(); },
      xoaHet() { S.trang = Object.create(null); ve(); },
      huy() { document.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onScroll); window.removeEventListener("keydown", phim, true); if (ro) ro.disconnect(); if (mo) mo.disconnect(); [cv, tb, bang, toastEl].forEach(x => x.remove()); }
    };
  }
  window.ButVe = { gan };
})();
