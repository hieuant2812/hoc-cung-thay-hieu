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
      <nav class="nav">${[["index", "Trang chủ"], ["mophong", "Mô phỏng"], ["tren-lop", "Trên lớp"], ["luyentap", "Tự học"], ["rade", "Ra đề"], ["phieu", "Phiếu & chấm"], ["phantich", "Phân tích"], ["khbd", "Soạn bài"], ["beamer", "Trình chiếu"], ["trochoi", "Trò chơi"]].map(([k, t]) => `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav></div>`;
  }
  function footer() {
    const f = document.getElementById("foot"); if (!f) return;
    f.className = "foot";
    f.innerHTML = `<div class="wrap"><div class="dots">${["blue", "teal", "green", "sun", "coral", "pink", "violet"].map(c => `<i style="background:var(--${c})"></i>`).join("")}</div>
      <div class="slogan">“${esc((S.khauHieu || "").replace(/\.$/, ""))}”</div>
      <div class="dev">${esc(S.chanTrang || "")}</div>
      <div class="small">© ${new Date().getFullYear()} ${esc(S.tenWeb || "")}</div></div>`;
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
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) navigator.serviceWorker.register("sw.js").catch(() => {});
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
