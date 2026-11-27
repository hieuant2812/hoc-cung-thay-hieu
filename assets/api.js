/* api.js — gọi máy chủ Apps Script. Gửi dạng text/plain để trình duyệt không phải hỏi trước (CORS),
   tự thử lại khi mạng chập chờn, lưu phiên đăng nhập trong máy. */
(function (G) {
  "use strict";
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { } }
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function url() { return String((G.SITE && SITE.mayChu) || LS.get("hs-may-chu") || "").trim(); }

  class LoiMayChu extends Error { constructor(msg, ma) { super(msg); this.ma = ma || ""; } }

  async function goi(action, data, opt) {
    opt = opt || {};
    const u = url();
    if (!u) throw new LoiMayChu("Web chưa được nối với máy chủ. Thầy cần dán địa chỉ /exec vào config.js (xem HUONG-DAN.md).", "chua-cai");
    const body = JSON.stringify(Object.assign({ action }, data || {}, opt.token ? { token: opt.token } : {}));
    const lan = opt.thuLai == null ? 3 : opt.thuLai;
    let loiCuoi;
    for (let i = 0; i <= lan; i++) {
      try {
        const ctl = typeof AbortController === "function" ? new AbortController() : null;
        const hen = ctl ? setTimeout(() => ctl.abort(), opt.choToiDa || 45000) : null;   // máy chủ không trả lời: báo lỗi thay vì chờ mãi
        let r;
        try { r = await fetch(u, { method: "POST", body, redirect: "follow", signal: ctl ? ctl.signal : undefined }); }
        finally { clearTimeout(hen); }
        if (!r.ok) throw new Error("HTTP " + r.status);
        const j = await r.json();
        if (!j.ok) throw new LoiMayChu(j.loi || "Có lỗi xảy ra.", j.ma);
        return j;
      } catch (e) {
        if (e instanceof LoiMayChu) throw e;      // máy chủ đã trả lời: không thử lại
        loiCuoi = e;
        if (i < lan) await sleep(800 * Math.pow(2, i));
      }
    }
    throw new LoiMayChu("Không kết nối được máy chủ. Em kiểm tra mạng rồi thử lại.", "mat-mang");
  }

  function phien(vaiTro) {
    const k = vaiTro + "-token";
    return {
      get token() { return LS.get(k); },
      set token(v) { LS.set(k, v); },
      goi(action, data, opt) { return goi(action, data, Object.assign({}, opt, { token: LS.get(k) })); }
    };
  }

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  G.API = { goi, url, phien, LoiMayChu, LS, esc, sleep };
})(window);
