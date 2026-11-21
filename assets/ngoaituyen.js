/* ngoaituyen.js — nút "📥 Tải sẵn để dùng khi không có mạng".
   Thầy bấm một lần ở nhà (có wifi) → các bài mô phỏng, đề cương, công cụ giáo viên được cất vào máy,
   lên lớp mất mạng vẫn mở được. Dữ liệu cất trong bộ đệm "hcth-nt" (sw.js giữ qua các lần cập nhật web).
   NgoaiTuyen.mount(el) · NgoaiTuyen.tai(nhom, {im:true}) · NgoaiTuyen.daTai(nhom) */
(function (G) {
  "use strict";
  const NT = "hcth-nt", KEY = "hcth-nt-meta";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const meta = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const ghiMeta = m => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} };
  const coBoDem = "caches" in G && "serviceWorker" in navigator;
  const MB = b => (b / 1048576).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " MB";
  const json = async u => (await fetch(u, { cache: "no-cache" })).json();
  const napScript = src => new Promise((ok, loi) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => loi(new Error("Không tải được " + src)); document.head.appendChild(s); });

  let DSHINH = null;
  async function hinhTrong(text) {
    if (!DSHINH) DSHINH = await json("data/decuong/hinh/ds.json");
    const ma = new Set((text.match(/\[\[HINH:([0-9a-f]{8})\]\]/g) || []).map(x => x.slice(7, 15)));
    return [...ma].filter(h => DSHINH[h]).map(h => `data/decuong/hinh/${h}${DSHINH[h]}`);
  }
  /* tải một file JSON dữ liệu kèm các hình nó dùng */
  async function duLieu(u) { const t = await (await fetch(u, { cache: "no-cache" })).text(); return [u, ...(await hinhTrong(t))]; }

  const NHOM = [
    { id: "mophong", ten: "🔬 Mô phỏng tương tác", ghi: "Toàn bộ bài mô phỏng Toán – KHTN – Lí – Hoá kèm ảnh xem trước",
      ds: async () => { if (!G.SIMS) await napScript("data/sims.js"); return ["mophong.html", "data/sims.js", ...G.SIMS.flatMap(s => [s.file, `thumbs/${s.code}.jpg`])]; } },
    ...["10", "11", "12"].map(l => ({ id: "dc" + l, ten: `📘 Đề cương Toán ${l}`, ghi: "Bản học sinh và các hình vẽ",
      ds: async () => { const ix = await json("data/decuong/index.json"); const it = (ix.lop || {})[l]; if (!it) return [];
        return ["tailieu.html", "data/decuong/index.json", "data/decuong/hinh/ds.json", ...(await duLieu("data/decuong/" + it.hs + "?v=" + (it.capnhat || "")))]; } })),
    { id: "thcs", ten: "📗 Toán THCS 6 – 9", ghi: "Bài tập theo dạng lớp 6, 7, 8, 9 (khá nặng)",
      ds: async () => { const r = ["data/thcs/mucluc.json", "data/decuong/hinh/ds.json"]; for (const k of [6, 7, 8, 9]) r.push(...(await duLieu(`data/thcs/hs-${k}.json`))); return r; } },
    { id: "ts10", ten: "🎯 Ôn thi vào 10", ghi: "50 đề TS10 TP.HCM (bản học sinh) và hình vẽ",
      ds: async () => ["data/decuong/hinh/ds.json", ...(await duLieu("data/ts10/hs.json"))] },
    { id: "gv", ten: "🧑‍🏫 Công cụ giáo viên", ghi: "Trên lớp, trò chơi, ra đề, chấm phiếu, soạn bài, xuất PDF/Word",
      ds: async () => (await json("data/ngoaituyen.json")).gv }
  ];

  const dangTai = {};
  /* tải cả nhóm vào bộ đệm; báo tiến độ qua tienDo(soXong, tong) */
  async function tai(id, o) {
    o = o || {};
    if (!coBoDem) throw new Error("Trình duyệt này không hỗ trợ lưu ngoại tuyến.");
    if (dangTai[id]) return dangTai[id];
    const n = NHOM.find(x => x.id === id); if (!n) throw new Error("Không có nhóm " + id);
    return (dangTai[id] = (async () => {
      try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
      const ds = [...new Set(await n.ds())];
      const c = await caches.open(NT);
      let xong = 0, loi = 0, bytes = 0, i = 0;
      const mot = async () => {
        while (i < ds.length) {
          const u = ds[i++];
          for (let lan = 0; lan < 2; lan++) {
            try {
              const r = await fetch(u, { cache: "no-cache", headers: { "x-hcth-tai": "1" } });
              if (!r.ok) throw new Error(r.status);
              const b = await r.clone().blob(); bytes += b.size;
              await c.put(new URL(u, location.href).href, r); break;
            } catch (e) { if (lan) loi++; }
          }
          xong++; o.tienDo && o.tienDo(xong, ds.length);
        }
      };
      await Promise.all(Array.from({ length: o.im ? 2 : 6 }, mot));
      const m = meta(); m[id] = { ngay: Date.now(), so: ds.length - loi, loi, bytes, files: ds }; ghiMeta(m);
      return m[id];
    })().finally(() => { delete dangTai[id]; }));
  }
  async function xoa(id) {
    const m = meta(); const c = await caches.open(NT);
    const conDung = new Set(Object.entries(m).filter(([k]) => k !== id).flatMap(([, v]) => v.files || []));   // file dùng chung với nhóm khác: giữ lại
    const ds = ((m[id] || {}).files || []).filter(u => !conDung.has(u));
    await Promise.all(ds.map(u => c.delete(new URL(u, location.href).href, { ignoreSearch: true })));
    delete m[id]; ghiMeta(m);
  }
  const daTai = id => !!meta()[id];

  function mount(el) {
    if (!el) return;
    if (!coBoDem) { el.innerHTML = `<div class="small muted">Trình duyệt này chưa hỗ trợ lưu ngoại tuyến. Thầy dùng Safari/Chrome bản mới và mở web qua địa chỉ https.</div>`; return; }
    const ve = async () => {
      const m = meta();
      let dl = ""; try { const e = await navigator.storage.estimate(); dl = `Web đang dùng khoảng <b>${MB(e.usage || 0)}</b> bộ nhớ trên máy này.`; } catch (e) {}
      el.innerHTML = `<div class="nt-ds">${NHOM.map(n => { const x = m[n.id]; return `<div class="nt-dong" data-n="${n.id}">
        <div class="nt-ten"><b>${esc(n.ten)}</b><span class="small muted">${esc(n.ghi)}${x ? ` · đã tải ${new Date(x.ngay).toLocaleDateString("vi-VN")}, ${x.so} file, ${MB(x.bytes)}${x.loi ? ` · <span style="color:#d11a45">${x.loi} file lỗi</span>` : ""}` : ""}</span>
        <span class="nt-thanh" hidden><i></i></span></div>
        <div class="nt-nut"><button type="button" class="btn sm ${x ? "ghost" : "green"}" data-a="tai">${x ? "🔄 Cập nhật" : "📥 Tải sẵn"}</button>${x ? `<button type="button" class="btn sm ghost" data-a="xoa" title="Xoá bản tải sẵn">✕</button>` : ""}</div></div>`; }).join("")}</div>
        <div class="small muted" style="margin-top:8px">${dl} Tải ở nhà khi có wifi; lên lớp mất mạng vẫn mở được. Web có bản mới thì bấm 🔄 để cập nhật.</div>`;
      el.querySelectorAll("button[data-a]").forEach(b => b.onclick = async () => {
        const d = b.closest(".nt-dong"), id = d.dataset.n;
        if (b.dataset.a === "xoa") { if (!confirm("Xoá bản tải sẵn của nhóm này khỏi máy?")) return; await xoa(id); return ve(); }
        el.querySelectorAll("button").forEach(x => x.disabled = true);
        const th = d.querySelector(".nt-thanh"), i = th.querySelector("i"); th.hidden = false;
        try {
          const kq = await tai(id, { tienDo: (a, t) => { i.style.width = (100 * a / t).toFixed(1) + "%"; b.textContent = `⏳ ${a}/${t}`; } });
          G.toast && G.toast(kq.loi ? `Đã tải ${kq.so} file, ${kq.loi} file lỗi — bấm Cập nhật để thử lại.` : `✅ Đã tải xong ${kq.so} file (${MB(kq.bytes)}).`);
        } catch (e) { alert("Không tải được: " + e.message); }
        ve();
      });
    };
    ve();
  }

  G.NgoaiTuyen = { mount, tai, xoa, daTai, NHOM };
})(window);
