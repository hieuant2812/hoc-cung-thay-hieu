/* dongbo.js — đồng bộ ngân hàng câu hỏi giữa các máy (máy tính ↔ iPad ↔ điện thoại)
   Cách làm: trên máy có ngân hàng, bấm "Tạo gói" → được file data/nganhang.hcth đã NÉN và MÃ HOÁ (AES-256-GCM,
   khoá tạo từ mật khẩu bằng PBKDF2 250 000 vòng). Thầy cô đăng file đó lên web một lần.
   Máy khác (iPad) chỉ cần mở trang, nhập mật khẩu một lần → tải về, giải mã, nạp vào IndexedDB của máy đó.
   Không ai xem được nội dung nếu không có mật khẩu, nên để trên GitHub công khai vẫn an toàn.
   Phụ thuộc: JSZip (assets/lib/jszip.min.js). */
(function (G) {
  "use strict";
  const MAGIC = "HCTH-NH1";
  const DB = "hcth-nganhang";
  const PART = 6 * 1024 * 1024;           // mỗi mảnh 6 MB cho dễ tải trên mạng yếu
  const ITER = 250000;
  const enc = new TextEncoder(), dec = new TextDecoder();
  const base = () => (G.SITE && G.SITE.duLieu) || "data/";

  /* ---------------------------------------------------------------- IndexedDB */
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains("q")) d.createObjectStore("q", { keyPath: "k" }).createIndex("ml", "ml"); if (!d.objectStoreNames.contains("dang")) d.createObjectStore("dang", { keyPath: "k" }).createIndex("ml", "ml"); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  const getAll = (d, s) => new Promise((res, rej) => { const r = d.transaction(s, "readonly").objectStore(s).getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error); });
  const putAll = (d, s, rows) => new Promise((res, rej) => { const t = d.transaction(s, "readwrite"), o = t.objectStore(s); rows.forEach(r => o.put(r)); t.oncomplete = res; t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); });

  /* ---------------------------------------------------------------- mã hoá */
  async function keyOf(pass, salt) {
    const k = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, k, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  async function seal(bytes, pass) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await keyOf(pass, salt);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes));
    const head = enc.encode(MAGIC);
    const out = new Uint8Array(head.length + 16 + 12 + ct.length);
    out.set(head, 0); out.set(salt, head.length); out.set(iv, head.length + 16); out.set(ct, head.length + 28);
    return out;
  }
  async function unseal(bytes, pass) {
    const head = enc.encode(MAGIC);
    if (bytes.length < head.length + 28 || dec.decode(bytes.slice(0, head.length)) !== MAGIC) throw new Error("File không đúng định dạng gói ngân hàng.");
    const salt = bytes.slice(head.length, head.length + 16), iv = bytes.slice(head.length + 16, head.length + 28);
    const key = await keyOf(pass, salt);
    let pt; try { pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, bytes.slice(head.length + 28)); } catch (e) { throw new Error("Sai mật khẩu."); }
    return new Uint8Array(pt);
  }

  /* ---------------------------------------------------------------- tạo gói */
  async function taoGoi(pass, onMsg) {
    if (!pass || pass.length < 6) throw new Error("Mật khẩu cần ít nhất 6 kí tự.");
    onMsg && onMsg("Đang đọc ngân hàng trong máy…");
    const d = await openDB(); const q = await getAll(d, "q"), dang = await getAll(d, "dang"); d.close();
    if (!q.length) throw new Error("Máy này chưa có ngân hàng câu hỏi để tạo gói.");
    const nhom = {}; q.forEach(x => (nhom[x.ml] = nhom[x.ml] || []).push(x));
    const ml = {}; Object.entries(nhom).forEach(([k, v]) => ml[k] = v.length);
    onMsg && onMsg(`Đang nén ${q.length.toLocaleString("vi-VN")} câu…`);
    const zip = new JSZip();
    // mỗi môn–lớp một tệp con để máy yếu nạp lần lượt, không phải mở cả ngân hàng một lúc
    const ds = Object.keys(nhom);
    zip.file("muc-luc.json", JSON.stringify({ v: 1, t: new Date().toISOString(), ml, tep: ds }));
    zip.file("dang.json", JSON.stringify(dang));
    ds.forEach(k => zip.file("q/" + encodeURIComponent(k) + ".json", JSON.stringify(nhom[k])));
    const raw = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
    onMsg && onMsg("Đang mã hoá…");
    const sealed = await seal(raw, pass);
    const parts = []; for (let i = 0; i < sealed.length; i += PART) parts.push(sealed.slice(i, i + PART));
    const manifest = { app: "hoc-cung-thay-hieu", kieu: "nganhang", v: Date.now(), t: new Date().toISOString(), nq: q.length, ml, phan: parts.length, co: sealed.length };
    return { manifest, parts, sealed };
  }

  /* ---------------------------------------------------------------- lấy gói từ web */
  async function tai(url, onTien) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("Không tải được " + url + " (" + r.status + ")");
    if (!r.body || !onTien) return new Uint8Array(await r.arrayBuffer());
    const total = +(r.headers.get("content-length") || 0); const rd = r.body.getReader(); const chunks = []; let got = 0;
    for (;;) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); got += value.length; onTien(got, total); }
    const out = new Uint8Array(got); let p = 0; chunks.forEach(c => { out.set(c, p); p += c.length; });
    return out;
  }
  async function docManifest() {
    try { const r = await fetch(base() + "nganhang.json?t=" + Date.now(), { cache: "no-store" }); if (!r.ok) return null; const m = await r.json(); return m && m.kieu === "nganhang" ? m : null; } catch (e) { return null; }
  }
  /* nạp gói (Uint8Array đã mã hoá) vào máy này; chon = mảng "Toán|12" để chỉ nạp vài lớp */
  async function napSealed(sealed, pass, onMsg, chon) {
    onMsg && onMsg("Đang giải mã…");
    const raw = await unseal(sealed, pass);
    onMsg && onMsg("Đang mở gói…");
    const zip = await JSZip.loadAsync(raw);
    const mlf = zip.file("muc-luc.json"); if (!mlf) throw new Error("Gói không đúng định dạng (thiếu mục lục).");
    const ml = JSON.parse(await mlf.async("string"));
    const tep = (ml.tep || []).filter(k => !chon || !chon.length || chon.indexOf(k) >= 0);
    const d = await openDB(); let tong = 0;
    const tongCau = tep.reduce((a, k) => a + (ml.ml[k] || 0), 0);
    for (const k of tep) {
      const f = zip.file("q/" + encodeURIComponent(k) + ".json"); if (!f) continue;
      const rows = JSON.parse(await f.async("string"));
      for (let i = 0; i < rows.length; i += 1500) {
        tong += Math.min(1500, rows.length - i);
        onMsg && onMsg(`Đang nạp ${k.replace("|", " lớp ")}: ${tong.toLocaleString("vi-VN")}/${tongCau.toLocaleString("vi-VN")} câu…`);
        await putAll(d, "q", rows.slice(i, i + 1500));
      }
    }
    const df = zip.file("dang.json");
    if (df) { const ds = JSON.parse(await df.async("string")).filter(x => !chon || !chon.length || chon.indexOf(x.ml) >= 0); await putAll(d, "dang", ds); }
    d.close();
    return { nq: tong, ml: ml.ml };
  }
  async function keoVe(pass, onMsg, onTien, chon) {
    const m = await docManifest();
    if (!m) throw new Error("Trên web chưa có gói ngân hàng. Hãy tạo gói trên máy tính rồi đăng lên thư mục data/.");
    const n = m.phan || 1; const buf = [];
    for (let i = 0; i < n; i++) {
      onMsg && onMsg(n > 1 ? `Đang tải phần ${i + 1}/${n}…` : "Đang tải gói ngân hàng…");
      buf.push(await tai(base() + "nganhang.hcth" + (n > 1 ? "." + (i + 1) : "") + "?v=" + m.v, (g, t) => onTien && onTien(i, n, g, t)));
    }
    let len = 0; buf.forEach(b => len += b.length); const sealed = new Uint8Array(len); let p = 0; buf.forEach(b => { sealed.set(b, p); p += b.length; });
    const res = await napSealed(sealed, pass, onMsg, chon);
    localStorage.setItem("nh-ver", String(m.v));
    localStorage.setItem("nh-ngay", m.t || "");
    return Object.assign(res, { v: m.v });
  }
  /* có bản mới trên web không? */
  async function coBanMoi() {
    const m = await docManifest(); if (!m) return null;
    const cur = +(localStorage.getItem("nh-ver") || 0);
    return m.v > cur ? m : null;
  }

  /* ---------------------------------------------------------------- lưu lâu dài (iPad hay xoá dữ liệu trang) */
  async function giuDuLieu() {
    try { if (navigator.storage && navigator.storage.persist) { if (await navigator.storage.persisted()) return true; return await navigator.storage.persist(); } } catch (e) {}
    return false;
  }
  const laiPad = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const daCai = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

  G.DongBo = { taoGoi, keoVe, napSealed, docManifest, coBanMoi, giuDuLieu, laiPad, daCai, seal, unseal, PART };
})(window);

/* ---------------------------------------------------------------- giao diện gắn sẵn */
(function (G) {
  "use strict";
  const D = G.DongBo; const esc = G.esc || (s => String(s == null ? "" : s));
  const KEY = "nh-matkhau";
  const mb = n => (n / 1048576).toFixed(1).replace(".", ",") + " MB";
  function mount(el, opt) {
    opt = opt || {};
    el.innerHTML = `<div class="db">
      <div data-tt class="small muted" style="margin-bottom:8px"></div>
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button class="btn blue" type="button" data-keo>📥 Lấy ngân hàng về máy này</button>
        <button class="btn ghost sm" type="button" data-tao>🔐 Tạo gói để đăng lên web</button>
        <label class="btn ghost sm">📂 Nạp từ file .hcth<input type="file" accept=".hcth,.hcth.1,application/octet-stream" hidden data-file></label>
      </div>
      <div data-m style="margin-top:8px"></div></div>`;
    const $ = s => el.querySelector(s), msg = h => $("[data-m]").innerHTML = h;
    const note = (k, h) => msg(`<div class="note ${k} small">${h}</div>`);
    const hoiMK = (nhac) => {
      const nho = localStorage.getItem(KEY);
      if (nho && !nhac) return nho;
      const p = prompt(nhac || "Nhập mật khẩu của gói ngân hàng:");
      return p || "";
    };
    async function info() {
      const m = await D.docManifest();
      const cur = +(localStorage.getItem("nh-ver") || 0);
      let n = 0; try { n = await NHD.Store.count(); } catch (e) {}
      const may = n ? `Máy này đang có <b>${n.toLocaleString("vi-VN")}</b> câu.` : `Máy này <b>chưa có</b> ngân hàng.`;
      if (!m) { $("[data-tt]").innerHTML = may + " Trên web chưa có gói ngân hàng — hãy tạo gói trên máy tính rồi đăng lên thư mục <code>data/</code>."; return; }
      const dsml = Object.entries(m.ml || {}).map(([k, v]) => k.replace("|", " ") + ": " + v.toLocaleString("vi-VN")).join(" · ");
      $("[data-tt]").innerHTML = `${may} Trên web có gói ngày <b>${new Date(m.t).toLocaleDateString("vi-VN")}</b> — ${m.nq.toLocaleString("vi-VN")} câu (${esc(dsml)})` +
        (m.v > cur ? ` <b style="color:#0a7">· có bản mới</b>` : ` · máy này đã cập nhật`) + ".";
    }
    $("[data-keo]").onclick = async () => {
      const b = $("[data-keo]"); const p = hoiMK(); if (!p) return;
      b.disabled = true;
      try {
        await D.giuDuLieu();
        const r = await D.keoVe(p, t => note("blue", esc(t)), (i, n, g, t) => note("blue", `Đang tải${n > 1 ? ` phần ${i + 1}/${n}` : ""}… ${mb(g)}${t ? " / " + mb(t) : ""}`));
        localStorage.setItem(KEY, p);
        note("green", `Xong! Đã nạp <b>${r.nq.toLocaleString("vi-VN")}</b> câu vào máy này. Lần sau mở trang là dùng được ngay, không cần tải lại.`);
        info(); if (opt.reload !== false) setTimeout(() => location.reload(), 1600);
      } catch (e) {
        if (/Sai mật khẩu/.test(e.message)) localStorage.removeItem(KEY);
        note("red", "Không lấy được: " + esc(e.message || e));
      }
      b.disabled = false;
    };
    $("[data-tao]").onclick = async () => {
      const p = prompt("Đặt mật khẩu cho gói ngân hàng (ít nhất 6 kí tự).\nMáy nào muốn dùng ngân hàng sẽ nhập mật khẩu này một lần:", localStorage.getItem(KEY) || "");
      if (!p) return;
      const b = $("[data-tao]"); b.disabled = true;
      try {
        const g = await D.taoGoi(p, t => note("blue", esc(t)));
        const dl = (blob, name) => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
        g.parts.forEach((p2, i) => dl(new Blob([p2], { type: "application/octet-stream" }), "nganhang.hcth" + (g.parts.length > 1 ? "." + (i + 1) : "")));
        dl(new Blob([JSON.stringify(g.manifest, null, 1)], { type: "application/json" }), "nganhang.json");
        localStorage.setItem(KEY, p); localStorage.setItem("nh-ver", String(g.manifest.v));
        note("green", `Đã tạo gói: <b>${g.manifest.nq.toLocaleString("vi-VN")}</b> câu, ${mb(g.manifest.co)}${g.parts.length > 1 ? ` chia ${g.parts.length} phần` : ""}.<br>Chép <b>nganhang.json</b> và <b>nganhang.hcth${g.parts.length > 1 ? ".1, .2…" : ""}</b> vào thư mục <b>data/</b> của trang web rồi đăng lên GitHub. Sau đó iPad chỉ cần bấm “Lấy ngân hàng về máy này”.`);
      } catch (e) { note("red", "Không tạo được gói: " + esc(e.message || e)); }
      b.disabled = false;
    };
    $("[data-file]").onchange = async e => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      const p = hoiMK("Nhập mật khẩu của gói ngân hàng:"); if (!p) return;
      try {
        await D.giuDuLieu();
        const r = await D.napSealed(new Uint8Array(await f.arrayBuffer()), p, t => note("blue", esc(t)));
        localStorage.setItem(KEY, p);
        note("green", `Đã nạp <b>${r.nq.toLocaleString("vi-VN")}</b> câu vào máy này.`); info();
        if (opt.reload !== false) setTimeout(() => location.reload(), 1600);
      } catch (err) { note("red", "Không nạp được: " + esc(err.message || err)); }
    };
    info();
  }
  /* nhắc có bản mới (gắn ở trang Ra đề) */
  async function nhacBanMoi(el) {
    try {
      const m = await D.coBanMoi(); if (!m || !el) return;
      el.innerHTML = `<div class="note green small">Trên web có gói ngân hàng mới (${m.nq.toLocaleString("vi-VN")} câu, ngày ${new Date(m.t).toLocaleDateString("vi-VN")}). <a href="#" data-x>Lấy về máy này</a>.</div>`;
      el.querySelector("[data-x]").onclick = ev => { ev.preventDefault(); const t = document.getElementById("dongBo"); if (t) { const d = t.closest("details"); if (d) d.open = true; t.scrollIntoView({ behavior: "smooth", block: "center" }); const b = t.querySelector("[data-keo]"); if (b) b.click(); } };
    } catch (e) {}
  }
  D.mount = mount; D.nhacBanMoi = nhacBanMoi;
})(window);
