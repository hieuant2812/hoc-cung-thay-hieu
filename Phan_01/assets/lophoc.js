/* lophoc.js — kết nối học sinh với giáo viên qua Google Trang tính (Apps Script).
   - Học sinh nhập họ tên, lớp một lần; kết quả luyện tập, bài sổ tay đã học được gửi về Trang tính của thầy.
   - Mất mạng thì xếp hàng đợi, có mạng gửi lại. Chưa cài địa chỉ Apps Script thì chỉ lưu trên máy.
   - Đọc bài thầy giao cho lớp. Địa chỉ Apps Script khai trong config.js: SITE.lopHoc.url */
(function (G) {
  "use strict";
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const url = () => (((G.SITE || {}).lopHoc || {}).url || LS.get("lh-url", "") || "").trim();
  const hs = () => LS.get("lh-hs", null);
  const chuanLop = s => String(s || "").toUpperCase().replace(/\s+/g, "").replace(/^LỚP/, "");

  /* ---------- hồ sơ học sinh ---------- */
  function hoiTen(xong) {
    const cu = hs() || {};
    const m = document.createElement("div");
    m.style.cssText = "position:fixed;inset:0;z-index:200;background:rgba(20,28,48,.45);display:grid;place-items:center;padding:16px";
    m.innerHTML = `<div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:20px 22px;box-shadow:0 20px 50px -20px rgba(0,0,0,.5);font:15px/1.5 var(--font,system-ui)">
      <h3 style="margin:0 0 6px;font:800 21px var(--font-h,system-ui)">👋 Em là ai?</h3>
      <p style="margin:0 0 12px;color:#66708a;font-size:14px">Nhập một lần trên máy này để thầy theo dõi được tiến độ học của em.</p>
      <label style="display:block;font-weight:600;font-size:14px">Họ và tên<input id="lhTen" value="${esc(cu.ten || "")}" placeholder="VD: Nguyễn Văn An" style="width:100%;margin-top:4px;padding:10px 12px;border:1.5px solid #e2d8c6;border-radius:12px;font:inherit"></label>
      <label style="display:block;font-weight:600;font-size:14px;margin-top:10px">Lớp<input id="lhLop" value="${esc(cu.lop || "")}" placeholder="VD: 12A1" style="width:100%;margin-top:4px;padding:10px 12px;border:1.5px solid #e2d8c6;border-radius:12px;font:inherit;text-transform:uppercase"></label>
      <div id="lhLoi" style="color:#d11a45;font-size:13.5px;min-height:18px;margin-top:6px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end"><button id="lhHuy" class="btn ghost sm">Để sau</button><button id="lhOk" class="btn green">Lưu</button></div></div>`;
    document.body.appendChild(m);
    const $ = s => m.querySelector(s);
    $("#lhTen").focus();
    $("#lhHuy").onclick = () => { m.remove(); xong && xong(null); };
    $("#lhOk").onclick = () => {
      const ten = $("#lhTen").value.trim().replace(/\s+/g, " "), lop = chuanLop($("#lhLop").value);
      if (ten.split(" ").length < 2) return ($("#lhLoi").textContent = "Em nhập đủ họ và tên nhé.");
      if (!/^\d{1,2}[A-ZĐ0-9]{1,5}$/.test(lop)) return ($("#lhLoi").textContent = "Lớp ghi như 10A1, 11B2, 12C3…");
      const h = { ten, lop }; LS.set("lh-hs", h); m.remove(); xong && xong(h); G.dispatchEvent(new Event("lophoc-hs"));
    };
    m.querySelectorAll("input").forEach(i => i.onkeydown = e => { if (e.key === "Enter") $("#lhOk").click(); });
  }

  /* ---------- gửi kết quả (có hàng đợi) ---------- */
  let dangGui = false;
  function gui(su) {
    const h = hs(); if (!h) return false;
    const ev = Object.assign({ ma: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), tg: new Date().toISOString(), hoten: h.ten, lop: h.lop }, su);
    const q = LS.get("lh-q", []); q.push(ev); LS.set("lh-q", q.slice(-300));
    dayDi(); return true;
  }
  async function dayDi() {
    const u = url(); if (!u || dangGui || !navigator.onLine) return;
    const q = LS.get("lh-q", []); if (!q.length) return;
    dangGui = true;
    try {
      const lo = q.slice(0, 40);
      await fetch(u, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(lo) });
      const con = LS.get("lh-q", []).filter(x => !lo.some(y => y.ma === x.ma)); LS.set("lh-q", con);
      LS.set("lh-guilan", new Date().toISOString());
      if (con.length) setTimeout(dayDi, 500); else G.dispatchEvent(new Event("lophoc-capnhat"));
    } catch (e) { /* để lần sau */ } finally { dangGui = false; }
  }
  G.addEventListener("online", dayDi);
  setTimeout(dayDi, 2500);

  /* ---------- bài thầy giao ---------- */
  async function layGiaoBai(lop) {
    const u = url(); if (!u || !lop) return [];
    const k = "lh-gb-" + lop;
    try {
      const r = await fetch(u + (u.includes("?") ? "&" : "?") + "a=giaobai&lop=" + encodeURIComponent(lop), { cache: "no-store" });
      const d = await r.json(); if (Array.isArray(d.ds)) { LS.set(k, d.ds); return d.ds; }
    } catch (e) {}
    return LS.get(k, []);
  }

  /* ---------- tiến độ tự học trên máy ---------- */
  const daHoc = () => LS.get("lh-dahoc", {});
  function datDaHoc(ma, ten, trangThai) {    // trangThai: "hoc" | "on" | null
    const d = daHoc();
    if (!trangThai) delete d[ma]; else d[ma] = { t: Date.now(), s: trangThai };
    LS.set("lh-dahoc", d);
    if (trangThai) gui({ loai: "sotay", noidung: ten, ma_bai: ma, trangthai: trangThai === "hoc" ? "Đã học" : "Cần ôn lại" });
  }

  /* ---------- thanh học sinh (trang Tự học) ---------- */
  async function thanh(el) {
    const ve = async () => {
      const h = hs(), u = url();
      const q = LS.get("lh-q", []).length;
      el.innerHTML = `<div class="lh-bar">${h ? `<span>👤 <b>${esc(h.ten)}</b> · Lớp <b>${esc(h.lop)}</b></span><button class="btn sm ghost" data-a="doi">Đổi</button>`
        : `<span>👤 Em chưa nhập tên — thầy chưa theo dõi được tiến độ của em.</span><button class="btn sm green" data-a="doi">Nhập họ tên, lớp</button>`}
        ${u ? `<span class="small muted">${q ? `⏳ ${q} kết quả chờ gửi` : "☁️ Đã đồng bộ với thầy"}</span>` : ""}</div><div class="lh-giao"></div>`;
      el.querySelector('[data-a="doi"]').onclick = () => hoiTen(() => ve());
      if (h && u) {
        const ds = await layGiaoBai(h.lop); const dh = daHoc();
        const xong = g => { const m = String(g.link || "").match(/#st\/(\d+\/[bc]\d+)/); return m && dh[m[1]] && dh[m[1]].s === "hoc"; };
        if (ds.length) el.querySelector(".lh-giao").innerHTML = `<div class="lh-gb"><b>📌 Bài thầy giao cho lớp ${esc(h.lop)}</b>${ds.map(g => `<a href="${esc(g.link)}" class="${xong(g) ? "ok" : ""}"><span>${xong(g) ? "✅" : "📝"} ${esc(g.tieude)}</span>${g.han ? `<small>Hạn: ${esc(g.han)}</small>` : ""}${g.ghichu ? `<small>${esc(g.ghichu)}</small>` : ""}</a>`).join("")}</div>`;
        el.querySelectorAll(".lh-gb a").forEach(a => a.onclick = () => setTimeout(() => G.dispatchEvent(new HashChangeEvent("hashchange")), 30));
      }
    };
    if (!document.getElementById("lhCss")) {
      const st = document.createElement("style"); st.id = "lhCss";
      st.textContent = `.lh-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:14px;padding:8px 12px;margin:0 0 12px;font-size:14.5px}
.lh-bar .small{margin-left:auto}
.lh-gb{background:linear-gradient(120deg,#fff7e6,#fff);border:1.5px solid #f3c66b;border-radius:16px;padding:10px 14px;margin:0 0 14px;display:grid;gap:6px}
.lh-gb a{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;text-decoration:none;color:#1d2742;background:#fff;border:1px solid #f0e2c4;border-radius:12px;padding:8px 12px}
.lh-gb a.ok{opacity:.65}
.lh-gb a small{color:#8a6a1f}`;
      document.head.appendChild(st);
    }
    G.addEventListener("lophoc-hs", ve);
    G.addEventListener("lophoc-capnhat", ve);
    await ve();
  }

  G.LopHoc = { url, hs, hoiTen, gui, dayDi, layGiaoBai, daHoc, datDaHoc, thanh, chuanLop };
})(window);
