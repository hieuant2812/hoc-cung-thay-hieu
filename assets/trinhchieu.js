/* trinhchieu.js — chiếu slide ngay trên web (iPad, máy chiếu), không cần biên dịch XeLaTeX.
   TrinhChieu.mo({ slides: [phần tử .sl], bien: "chuỗi CSS biến màu", batDau: số, khoa: "tiền tố lưu nét vẽ", chuTo: true/false })
   - Mỗi slide phóng vừa màn hình; lời giải, danh sách hiện từng dòng như Beamer.
   - Chuyển: → ↓ Space PageDown / ← ↑ PageUp, Home/End, chạm nửa phải/trái màn hình, vuốt ngang. Số + Enter: nhảy tới slide.
   - Bút ghi bảng (ButVe): B bút · H dạ quang · K laser · E tẩy · R thước · W bảng trắng · X xoá · Ctrl+Z; nét vẽ lưu riêng từng slide.
   - F: toàn màn hình · Esc: tắt bút / thoát. */
(function (G) {
  "use strict";
  const W0 = 960;                      // bề rộng gốc của một slide (px) trước khi phóng
  let cssXong = false;
  function css() {
    if (cssXong) return; cssXong = true;
    const s = document.createElement("style");
    s.textContent = `
.tc-man{position:fixed;inset:0;z-index:9000;background:var(--nen,#1C3B32);display:flex;align-items:center;justify-content:center;overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.tc-khung{position:absolute;left:50%;top:50%;width:${W0}px;transform-origin:0 0}
.tc-khung .sl{box-shadow:none;border-radius:0;margin:0;width:${W0}px}
.tc-khung .sl .slno{display:none}
.tc-khung .sl ul{padding-left:24px}.tc-khung .sl ul.buoc{padding-left:0}
.tc-man.to .sl li,.tc-man.to .sl p{font-size:23px}.tc-man.to .sl .dau h3{font-size:27px}
.tc-an{visibility:hidden}
.tc-tb{position:fixed;z-index:9991;right:12px;top:10px;display:flex;gap:6px;align-items:center;opacity:.35;transition:opacity .2s}
.tc-tb:hover,.tc-man.cham .tc-tb{opacity:1}
.tc-tb button{min-width:42px;height:40px;border:0;border-radius:11px;background:rgba(29,39,66,.92);color:#fff;font:600 16px system-ui,sans-serif;cursor:pointer;padding:0 10px}
.tc-tb .so{color:#fff;font:600 14px system-ui,sans-serif;background:rgba(29,39,66,.92);padding:10px 12px;border-radius:11px;min-width:64px;text-align:center}
.tc-thanh{position:fixed;left:0;bottom:0;height:4px;background:var(--vang,#FFD66B);z-index:9991;transition:width .25s}
.tc-nhay{position:fixed;z-index:9993;left:50%;top:40%;transform:translate(-50%,-50%);background:rgba(29,39,66,.95);color:#fff;font:700 40px system-ui,sans-serif;padding:14px 28px;border-radius:16px;display:none}`;
    document.head.appendChild(s);
  }

  /* các phần hiện dần trong một slide (giống \\item<+-> và \\onslide của Beamer) */
  function buocHien(sl) {
    if (sl.matches(".tt,.tiet,.hdbia")) return [];
    const ds = [...sl.querySelectorAll("ul:not(.pa):not(.tatca)>li")].filter(li => !li.classList.contains("tm"));
    const dapAn = [...sl.querySelectorAll("p")].filter(p => /^\s*Đáp án/.test(p.textContent));
    return ds.length > 1 || dapAn.length ? ds.slice(ds.length > 1 ? 1 : ds.length).concat(dapAn) : [];
  }

  function mo(o) {
    css();
    const slides = o.slides.map(s => { const c = s.cloneNode(true); c.querySelectorAll(".slno").forEach(x => x.remove()); return c; });
    if (!slides.length) return;
    const man = document.createElement("div"); man.className = "tc-man" + (o.chuTo ? " to" : ""); man.style.cssText = o.bien || "";
    man.innerHTML = `<div class="tc-khung"></div><div class="tc-tb"><button data-a="truoc" title="Slide trước (←)">◀</button><span class="so"></span><button data-a="sau" title="Slide sau (→)">▶</button><button data-a="to" title="Toàn màn hình (F)">⛶</button><button data-a="thoat" title="Thoát (Esc)">✕</button></div><div class="tc-thanh"></div><div class="tc-nhay"></div>`;
    document.body.appendChild(man);
    const khung = man.querySelector(".tc-khung"), soEl = man.querySelector(".so"), thanh = man.querySelector(".tc-thanh"), nhayEl = man.querySelector(".tc-nhay");
    let i = Math.max(0, Math.min(slides.length - 1, o.batDau || 0)), buoc = [], b = 0, z = 1, BV = null, nhay = "";
    const cu = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";

    function vua() {
      const sl = khung.firstElementChild; if (!sl) return;
      const h = sl.offsetHeight || W0 * 9 / 16, W = innerWidth, H = innerHeight;
      z = Math.min(W / W0, H / h);
      khung.style.transform = `translate(${-W0 * z / 2}px,${-h * z / 2}px) scale(${z})`;
      if (BV) BV.ve();
    }
    function hien() {
      khung.innerHTML = ""; khung.appendChild(slides[i]);
      buoc = buocHien(slides[i]); buoc.forEach(x => x.classList.add("tc-an")); b = 0;
      if (hien.lui) { buoc.forEach(x => x.classList.remove("tc-an")); b = buoc.length; hien.lui = false; }
      soEl.textContent = (i + 1) + " / " + slides.length; thanh.style.width = ((i + 1) / slides.length * 100) + "%";
      vua(); try { localStorage.setItem((o.khoa || "tc") + "|vitri", i); } catch (e) {}
    }
    function sau() { if (b < buoc.length) { buoc[b++].classList.remove("tc-an"); return; } if (i < slides.length - 1) { i++; hien(); } }
    function truoc() { if (b > 0) { buoc[--b].classList.add("tc-an"); return; } if (i > 0) { i--; hien.lui = true; hien(); } }
    function den(n) { if (n >= 0 && n < slides.length) { i = n; hien(); } }
    function toanMan() {
      const d = document;
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (man.requestFullscreen || man.webkitRequestFullscreen || function () {}).call(man);
    }
    function thoat() {
      if (BV) BV.huy(); removeEventListener("keydown", phim, true); removeEventListener("resize", vua);
      const d = document; if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      man.remove(); document.documentElement.style.overflow = cu; if (o.khiThoat) o.khiThoat(i);
    }
    const butBat = () => BV && BV.dangBat && BV.dangBat();
    function phim(e) {
      const k = e.key;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[0-9]$/.test(k)) { nhay += k; nhayEl.textContent = nhay; nhayEl.style.display = "block"; e.preventDefault(); return; }
      if (k === "Enter" && nhay) { den(+nhay - 1); nhay = ""; nhayEl.style.display = "none"; e.preventDefault(); return; }
      if (nhay && k === "Backspace") { nhay = nhay.slice(0, -1); nhayEl.textContent = nhay; if (!nhay) nhayEl.style.display = "none"; e.preventDefault(); return; }
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(k)) { sau(); e.preventDefault(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(k)) { truoc(); e.preventDefault(); }
      else if (k === "Home") { den(0); e.preventDefault(); }
      else if (k === "End") { den(slides.length - 1); e.preventDefault(); }
      else if (k === "f" || k === "F") { toanMan(); e.preventDefault(); }
      else if (k === "Escape" && !butBat()) { thoat(); e.preventDefault(); }
    }
    addEventListener("keydown", phim, true); addEventListener("resize", vua);
    man.querySelector(".tc-tb").onclick = e => { const a = (e.target.closest("button") || {}).dataset; if (!a) return; e.stopPropagation();
      if (a.a === "sau") sau(); else if (a.a === "truoc") truoc(); else if (a.a === "to") toanMan(); else if (a.a === "thoat") thoat(); };
    /* chạm / bấm: nửa phải → tiếp, phần trái → lùi; vuốt ngang để chuyển slide (khi bút đang tắt) */
    let x0 = null, y0 = 0;
    man.addEventListener("pointerdown", e => { if (butBat() || e.target.closest(".tc-tb,.bv-tb")) return; x0 = e.clientX; y0 = e.clientY; man.classList.add("cham"); });
    man.addEventListener("pointerup", e => {
      if (x0 == null || butBat()) { x0 = null; return; }
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? sau() : truoc(); return; }
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { e.clientX > innerWidth * 0.33 ? sau() : truoc(); }
    });
    hien();
    if (G.ButVe) BV = ButVe.gan({ root: man, goc: () => khung.firstElementChild, tile: () => z, khoa: () => (o.khoa || "tc") + "|" + i, tren: () => 0, chup: () => man });
    if (o.toanMan !== false) toanMan();
    return { den, sau, truoc, thoat };
  }

  G.TrinhChieu = { mo };
})(window);
