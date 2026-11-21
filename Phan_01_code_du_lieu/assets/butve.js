/* butve.js — Bút vẽ ghi trực tiếp lên màn hình đang chiếu (chuột, ngón tay, bút cảm ứng / Apple Pencil).
   ButVe.gan({ root, goc, tile, khoa, cuon, viTri, chup }) → { ve(), bat(), tat(), huy(), dangBat() }
     root  : phần tử chứa lớp vẽ (với trình chiếu toàn màn hình phải là phần tử đang toàn màn hình)
     goc   : () => phần tử làm gốc toạ độ (nét vẽ đi theo nội dung khi cuộn, đổi cỡ chữ)
     tile  : () => hệ số phóng (VD cỡ chữ hiện tại / 30)
     khoa  : () => chuỗi khoá trang (mỗi câu / mỗi bài có nét vẽ riêng)
     tren  : () => số px chừa phía trên (thanh nút của trang)
     cuon  : () => phần tử cuộn (để cuộn bằng 2 ngón / con lăn khi đang vẽ); bỏ trống = cửa sổ
   Phím tắt khi lớp vẽ đang gắn: B bút · H dạ quang · K chỉ laser · E tẩy · R thước · W bảng trắng · X xoá trang · Ctrl/⌘+Z hoàn tác · Esc tắt bút. */
(function () {
  "use strict";
  const MAU = ["#111111", "#e0234e", "#1b5fd6", "#119a4a", "#ff7a00", "#8a2be2"];
  const CO = [2.5, 4.5, 8];
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
    const S = { bat: false, cu: "but", mau: MAU[1], co: 1, bang: false, luoi: false, an: false, coBut: false, trang: Object.create(null) };
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
<button data-c="but" title="Bút (B)">🖊</button><button data-c="dq" title="Bút dạ quang (H)">🖍</button><button data-c="thuoc" title="Thước kẻ đoạn thẳng (R)">📏</button><button data-c="laser" title="Chỉ bằng laser, nét tự mờ (K)">🔴</button><button data-c="tay" title="Tẩy từng nét (E)">🧽</button>
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
      cv.classList.toggle("on", S.bat); cv.classList.toggle("tay", S.cu === "tay");
      bang.classList.toggle("on", S.bang); bang.classList.toggle("luoi", S.luoi);
    }
    tb.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return; e.stopPropagation();
      if (b.dataset.c) { S.cu = b.dataset.c; if (!S.bat) S.bat = true; }
      else if (b.dataset.m) { S.mau = b.dataset.m; if (S.cu === "tay" || S.cu === "laser") S.cu = "but"; }
      else if (b.dataset.s) S.co = +b.dataset.s;
      else lenh(b.dataset.l);
      veTb(); ve();
    });
    function lenh(l) {
      if (l === "mo") { S.bat = !S.bat; if (!S.bat && S.bang) S.bang = false; }
      else if (l === "thu") { S.bat = false; S.bang = false; }
      else if (l === "undo") { const p = trang(); const u = p.lich.pop(); if (u) p.net = u; else bao("Không còn gì để hoàn tác"); }
      else if (l === "xoa") { const p = trang(); if (p.net.length) { luuLich(p); p.net = []; bao("Đã xoá nét vẽ trang này (bấm ↶ để lấy lại)"); } }
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
    let hen = 0;
    function ve() { if (!hen) hen = requestAnimationFrame(veNgay); }
    function veNgay() {
      hen = 0; coKhung();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, -T * dpr);
      const h = heToa();
      if (!S.an) { trang().net.forEach(n => veNet(ctx, n, h)); if (dang && dang.n) veNet(ctx, dang.n, h); }
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
      if (S.cu === "laser") { laser.push({ x: e.clientX, y: e.clientY, t: performance.now(), moi: true }); dang = { id: e.pointerId, laser: true }; ve(); return; }
      if (S.cu === "tay") { dang = { id: e.pointerId, tay: true, xoa: false }; tay(q, h); return; }
      const dq = S.cu === "dq";
      dang = { id: e.pointerId, n: { c: dq ? "#ffd400" : S.mau, a: dq ? .38 : 1, w: (dq ? 20 : CO[S.co]) / h.s, p: [q] }, thuoc: S.cu === "thuoc" };
      ve();
    }
    function tamCham() { let x = 0, y = 0; cham.forEach(v => { x += v[0]; y += v[1]; }); return [x / cham.size, y / cham.size]; }
    function cuonBy(dx, dy) { const el = cuon(); if (el) el.scrollBy(dx, dy); else window.scrollBy(dx, dy); }
    function diChuyen(e) {
      if (e.pointerType === "touch" && cham.has(e.pointerId)) {
        cham.set(e.pointerId, [e.clientX, e.clientY]);
        if (pan) { const t = tamCham(); cuonBy(pan[0] - t[0], pan[1] - t[1]); pan = t; e.preventDefault(); return; }
      }
      if (!dang || dang.id !== e.pointerId) return;
      e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      const h = heToa();
      if (dang.laser) { evs.forEach(v => laser.push({ x: v.clientX, y: v.clientY, t: performance.now() })); ve(); return; }
      if (dang.tay) { tay(doiVao(e, h), h); return; }
      const p = dang.n.p;
      if (dang.thuoc) {
        let q = doiVao(e, h); const a = p[0], dx = q[0] - a[0], dy = q[1] - a[1];
        const goc = Math.atan2(dy, dx), buoc = Math.PI / 12, gan = Math.round(goc / buoc) * buoc; // hít 15°
        if (Math.abs(goc - gan) < .05) { const L = Math.hypot(dx, dy); q = [a[0] + L * Math.cos(gan), a[1] + L * Math.sin(gan)]; }
        dang.n.p = [a, q];
      } else evs.forEach(v => { const q = doiVao(v, h), l = p[p.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) * h.s >= 1.2) p.push(q); });
      ve();
    }
    function ketThuc(e) {
      if (e.pointerType === "touch") { cham.delete(e.pointerId); if (cham.size < 2 && !S.coBut) pan = null; if (!cham.size) pan = null; }
      if (!dang || dang.id !== e.pointerId) return;
      if (dang.n && dang.n.p.length) { const p = trang(); luuLich(p); p.net.push(dang.n); }
      dang = null; ve();
    }
    function tay(q, h) {
      const p = trang(), r = 14 / h.s;
      const con = p.net.filter(n => !trungNet(n, q, r + n.w / 2));
      if (con.length !== p.net.length) { if (!dang.xoa) { luuLich(p); dang.xoa = true; } p.net = con; ve(); }
    }
    function trungNet(n, q, r) {
      const p = n.p; if (p.length === 1) return Math.hypot(p[0][0] - q[0], p[0][1] - q[1]) <= r;
      for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); if (Math.hypot(a[0] + t * dx - q[0], a[1] + t * dy - q[1]) <= r) return true; }
      return false;
    }
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
      const map = { b: "but", h: "dq", k: "laser", e: "tay", r: "thuoc" };
      if (k === "escape" && (S.bat || S.bang)) { e.preventDefault(); e.stopImmediatePropagation(); S.bat = false; S.bang = false; }
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
        trang().net.forEach(n => veNet(g, n, h2));
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
      xoaHet() { S.trang = Object.create(null); ve(); },
      huy() { document.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onScroll); window.removeEventListener("keydown", phim, true); if (ro) ro.disconnect(); if (mo) mo.disconnect(); [cv, tb, bang, toastEl].forEach(x => x.remove()); }
    };
  }
  window.ButVe = { gan };
})();
