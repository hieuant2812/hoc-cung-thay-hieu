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
      <nav class="nav">${[["index", "Trang chủ"], ["mophong", "Mô phỏng"], ["rade", "Ra đề kiểm tra"]].map(([k, t]) => `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav></div>`;
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
  function init() { header(); footer(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
