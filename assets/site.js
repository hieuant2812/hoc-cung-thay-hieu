/* site.js — đầu trang, chân trang dùng chung */
(function () {
  "use strict";
  const S = window.SITE || {};
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  window.esc = esc;
  function header() {
    const h = document.getElementById("top"); if (!h) return;
    const cur = document.body.dataset.page || "";
    const ten = S.tenWeb || "Học cùng Thầy Hiếu"; const m = ten.match(/^(.*?)(Thầy.*)$/);
    h.className = "top";
    h.innerHTML = `<div class="wrap in"><a class="logo" href="index.html"><span class="mk">H</span><span><b>${m ? esc(m[1]) + "<span>" + esc(m[2]) + "</span>" : esc(ten)}</b><small>${esc(S.truong || "")}</small></span></a>
      <nav class="nav">${[["index", "Trang chủ"], ["mophong", "Mô phỏng"], ["tren-lop", "Trên lớp"], ["luyentap", "Tự học"], ["tailieu", "Tài liệu"], ["rade", "Ra đề"], ["rade-thcs", "Ra đề THCS"], ["phieu", "Phiếu & chấm"], ["phantich", "Phân tích"], ["khbd", "Soạn bài"], ["beamer", "Trình chiếu"], ["trochoi", "Trò chơi"], ["lophoc", "Lớp học"]].map(([k, t]) => `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav></div>`;
  }
  function footer() {
    const f = document.getElementById("foot"); if (!f) return;
    f.className = "foot";
    f.innerHTML = `<div class="wrap"><div class="dots">${["blue", "teal", "green", "sun", "coral", "pink", "violet"].map(c => `<i style="background:var(--${c})"></i>`).join("")}</div>
      <div class="slogan">“${esc((S.khauHieu || "").replace(/\.$/, ""))}”</div>
      <div class="dev">${esc(S.chanTrang || "")}</div>
      <div class="small">© ${new Date().getFullYear()} ${esc(S.tenWeb || "")}${S.phienBan ? ` · Phiên bản ${esc(S.phienBan)}` : ""}</div></div>`;
  }
  window.toast = function (msg, ms) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.remove(), 400); }, ms || 2600);
  };
  /* cài được vào Màn hình chính (iPad/điện thoại) và chạy ngoại tuyến */
  function pwa() {
    const add = (tag, attrs) => { const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); document.head.appendChild(e); };
    if (!document.querySelector('link[rel="manifest"]')) add("link", { rel: "manifest", href: "manifest.webmanifest" });
    if (!document.querySelector('link[rel="apple-touch-icon"]')) add("link", { rel: "apple-touch-icon", href: "assets/icon-180.png" });
    add("meta", { name: "apple-mobile-web-app-capable", content: "yes" });
    add("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" });
    add("meta", { name: "apple-mobile-web-app-title", content: "Thầy Hiếu" });
    add("meta", { name: "theme-color", content: "#3b7bff" });
    add("meta", { name: "mobile-web-app-capable", content: "yes" });
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      const coCu = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(reg => {
        reg.update().catch(() => {});
        reg.addEventListener("updatefound", () => {
          const w = reg.installing; if (!w || !coCu) return;
          w.addEventListener("statechange", () => { if (w.state === "installed") baoCapNhat(); });
        });
      }).catch(() => {});
    }
  }
  /* có phiên bản mới của web: mời tải lại để dùng ngay */
  function baoCapNhat() {
    if (document.querySelector(".bao-moi")) return;
    const b = document.createElement("div"); b.className = "bao-moi";
    b.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:300;background:#1d2742;color:#fff;border-radius:14px;padding:10px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);font:600 14.5px var(--font,system-ui);max-width:calc(100% - 24px)";
    b.innerHTML = `<span>🔄 Web vừa có bản cập nhật mới.</span><button style="border:0;border-radius:10px;padding:6px 12px;font:700 14px inherit;background:#2fb35a;color:#fff;cursor:pointer">Tải lại</button><button aria-label="Đóng" style="border:0;background:none;color:#aab;font-size:18px;cursor:pointer">×</button>`;
    const [nut, dong] = b.querySelectorAll("button"); nut.onclick = () => location.reload(); dong.onclick = () => b.remove();
    document.body.appendChild(b);
  }
  /* trên iPad: nhắc cài vào Màn hình chính — Safari chỉ giữ ngân hàng lâu dài khi đã cài */
  function nhacCai() {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const daCai = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (!iOS || daCai || localStorage.getItem("hcth-an-nhac-cai") === "1") return;
    const b = document.createElement("div");
    b.className = "nhac-cai";
    b.innerHTML = `<span>📲 Thêm trang này vào <b>Màn hình chính</b> (nút Chia sẻ <b>↑</b> → <b>Thêm vào MH chính</b>) để dùng được khi không có mạng và để iPad <b>không tự xoá ngân hàng đề</b>.</span><button type="button" aria-label="Đóng">✕</button>`;
    b.querySelector("button").onclick = () => { localStorage.setItem("hcth-an-nhac-cai", "1"); b.remove(); };
    document.body.appendChild(b);
  }
  function init() { header(); footer(); pwa(); nhacCai(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
