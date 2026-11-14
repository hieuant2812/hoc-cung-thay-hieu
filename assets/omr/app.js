/* omr/app.js — ứng dụng chấm phiếu trên điện thoại */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const { Kho, PRESETS } = OMR;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toast = (m, ms) => { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.remove(), 400); }, ms || 2400); };
  let cur = localStorage.getItem("cham-cur") || "";
  const bai = () => Kho.get(cur);

  /* ---------------------------------------------------------------- điều hướng */
  function go(p) {
    document.querySelectorAll(".pg").forEach(x => x.classList.toggle("on", x.id === p));
    document.querySelectorAll(".nav3 button").forEach(b => b.setAttribute("aria-selected", b.dataset.p === p));
    if (p !== "pgCham") stopCam();
    if (p === "pgKq") drawKq();
    if (p === "pgBai") drawBai();
    if (p === "pgPt") drawPt();
    if (p === "pgCham") setTimeout(() => { try { stat(); } catch (e) {} }, 0);
    localStorage.setItem("cham-pg", p);
  }
  document.querySelectorAll(".nav3 button").forEach(b => b.onclick = () => go(b.dataset.p));
  function setCur(id) { cur = id; localStorage.setItem("cham-cur", id); const b = bai(); $("curName").textContent = b ? b.ten || "(chưa đặt tên)" : "Chưa chọn bài"; }

  /* ---------------------------------------------------------------- 1. bài kiểm tra */
  function drawBai() {
    const L = Kho.list();
    $("baiList").innerHTML = L.length ? L.map(b => {
      const n = Kho.results(b.id).length; const k0 = Object.values(b.keys)[0] || {};
      return `<div class="bai${b.id === cur ? " cur" : ""}" data-id="${b.id}"><div style="flex:1"><div class="t">${esc(b.ten || "(chưa đặt tên)")}</div><div class="m">${esc(b.mon)} · ${Object.keys(b.keys).length} mã đề (${Object.keys(b.keys).join(", ")}) · ${(k0.TN || []).length}–${(k0.DS || []).length}–${(k0.TLN || []).length} câu · phiếu ${esc((PRESETS[b.preset] || {}).ngan || "tự nhận")} · đã chấm ${n}</div></div>
        <button class="btn sm ${b.id === cur ? "coral" : "ghost"}" data-use="${b.id}">${b.id === cur ? "Đang chấm" : "Chọn"}</button><button class="btn ghost sm" data-del="${b.id}" title="Xoá">✕</button></div>`;
    }).join("") : `<div class="card empty"><b>Chưa có bài nào</b><p class="hint">Ở máy tính, trang Ra đề → bước 4 → mục "Chấm bằng điện thoại" có mã QR đáp án. Bấm "Quét QR đáp án" để nạp vào điện thoại.</p></div>`;
    $("baiList").querySelectorAll("[data-use]").forEach(b => b.onclick = () => { setCur(b.dataset.use); drawBai(); go("pgCham"); });
    $("baiList").querySelectorAll("[data-del]").forEach(b => b.onclick = () => { if (confirm("Xoá bài này và toàn bộ kết quả đã chấm?")) { Kho.del(b.dataset.del); if (cur === b.dataset.del) setCur(""); drawBai(); } });
  }
  function addBai(o) {
    if (!o || !o.keys || !Object.keys(o.keys).length) throw new Error("Không có đáp án");
    const k0 = Object.values(o.keys)[0]; o.preset = o.preset && PRESETS[o.preset] ? o.preset : OMR.pickPreset({ TN: k0.TN.length, DS: k0.DS.length, TLN: k0.TLN.length });
    o.mon = o.mon || "Toán"; const b = Kho.save(o); setCur(b.id); drawBai(); toast("Đã thêm: " + (b.ten || "bài kiểm tra"));
  }
  $("addFile").onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const txt = await f.text(); let o = null; try { o = JSON.parse(txt); } catch (x) {}
      if (o && o.type === "hcth-ketqua") { const r = OMR.importKQ(o); drawBai(); toast(`Đã nạp ${r.nb} bài, ${r.nr} phiếu`); }
      else addBai(OMR.unpack(txt));
    } catch (err) { alert("Không đọc được file: " + err.message); }
    e.target.value = "";
  };
  // quét QR
  let qrStream = null, qrTimer = null;
  function loadScript(src) { return new Promise((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  $("addQR").onclick = async () => {
    try {
      await loadScript("assets/lib/jsQR.js");
      qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } }, audio: false });
      const v = $("qrVideo"); v.srcObject = qrStream; await v.play(); $("qrBox").classList.remove("hidden");
      const c = document.createElement("canvas"), x = c.getContext("2d", { willReadFrequently: true });
      qrTimer = setInterval(() => {
        if (!v.videoWidth) return; const s = Math.min(1, 900 / Math.max(v.videoWidth, v.videoHeight)); c.width = v.videoWidth * s; c.height = v.videoHeight * s; x.drawImage(v, 0, 0, c.width, c.height);
        const code = jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
        if (code && code.data) { try { const o = OMR.unpack(code.data); stopQR(); addBai(o); navigator.vibrate && navigator.vibrate(120); } catch (e) { $("qrBox").querySelector(".msg").textContent = e.message; } }
      }, 250);
    } catch (e) { alert("Không mở được camera: " + (e.message || e) + "\nHãy cho phép trang dùng camera."); }
  };
  function stopQR() { clearInterval(qrTimer); if (qrStream) qrStream.getTracks().forEach(t => t.stop()); qrStream = null; $("qrBox").classList.add("hidden"); }
  $("qrStop").onclick = stopQR;
  // nhập tay
  $("addHand").onclick = () => {
    const box = $("handBox"); box.classList.toggle("hidden"); if (box.classList.contains("hidden")) return;
    box.innerHTML = `<div style="display:grid;gap:10px"><label class="f">Tên bài kiểm tra<input type="text" id="hTen" placeholder="Kiểm tra 15 phút – 12A1"></label>
      <div class="f2"><label class="f">Môn<select id="hMon"><option>Toán</option><option>Vật lí</option><option>Hoá học</option><option>KHTN</option><option>Khác</option></select></label>
      <label class="f">Mẫu phiếu<select id="hPre">${Object.entries(PRESETS).map(([k, p]) => `<option value="${k}">${esc(p.ngan)}</option>`).join("")}</select></label></div>
      <p class="hint">Mỗi mã đề một khung. Phần I: chuỗi chữ cái (VD <b>ABDCAB…</b>). Phần II: mỗi câu 4 kí tự Đ/S, cách nhau dấu cách (VD <b>ĐSĐS SSĐĐ</b>; gõ D thay Đ cũng được). Phần III: các đáp số cách nhau dấu chấm phẩy (VD <b>2,5; -3; 12</b>).</p>
      <div id="hKeys"></div><div class="row"><button class="btn ghost sm" id="hAdd">+ Thêm mã đề</button><span class="grow"></span><button class="btn coral" id="hSave">Lưu bài</button></div></div>`;
    const addKey = () => { const d = document.createElement("div"); d.className = "keyrow"; d.innerHTML = `<input type="text" placeholder="Mã đề (VD 101)" class="kMa"><input type="text" placeholder="Phần I: ABCD…" class="kTN" autocapitalize="characters"><input type="text" placeholder="Phần II: ĐSĐS ĐSSĐ …" class="kDS" autocapitalize="characters"><input type="text" placeholder="Phần III: 2,5; -3; …" class="kTLN">`; $("hKeys").appendChild(d); };
    addKey(); $("hAdd").onclick = addKey;
    $("hSave").onclick = () => {
      const keys = {};
      $("hKeys").querySelectorAll(".keyrow").forEach(r => {
        const ma = r.querySelector(".kMa").value.trim(); if (!ma) return;
        keys[ma] = { TN: r.querySelector(".kTN").value.toUpperCase().replace(/[^ABCD]/g, "").split(""), DS: r.querySelector(".kDS").value.toUpperCase().replace(/D/g, "Đ").split(/[\s,;]+/).filter(Boolean).map(x => x.replace(/[^ĐS]/g, "").slice(0, 4)), TLN: r.querySelector(".kTLN").value.split(";").map(x => x.trim()).filter(Boolean) };
      });
      if (!Object.keys(keys).length) return alert("Hãy nhập ít nhất một mã đề.");
      const o = { ten: $("hTen").value.trim() || "Bài kiểm tra", mon: $("hMon").value, preset: $("hPre").value, keys };
      try { addBai(o); box.classList.add("hidden"); } catch (e) { alert(e.message); }
    };
  };

  /* ---------------------------------------------------------------- 2. chấm bằng camera */
  let stream = null, timer = null, busy = false, stable = 0, lastPts = null, paused = false;
  const video = $("video"), ov = $("ov");
  const small = document.createElement("canvas"), sx = small.getContext("2d", { willReadFrequently: true });
  const full = document.createElement("canvas"), fx = full.getContext("2d", { willReadFrequently: true });
  function msg(t) { $("camMsg").textContent = t; }
  async function startCam() {
    if (!bai()) { alert("Hãy chọn hoặc thêm một bài kiểm tra trước."); go("pgBai"); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
      video.srcObject = stream; await video.play(); $("camStart").classList.add("hidden"); paused = false; msg("Đưa trọn phiếu vào khung vàng…"); stat();
      timer = setInterval(tick, 180);
    } catch (e) { msg("Không mở được camera: " + (e.message || e)); }
  }
  function stopCam() { clearInterval(timer); timer = null; if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; $("camStart").classList.remove("hidden"); }
  $("camStart").onclick = startCam;
  $("torch").onclick = async () => { try { const t = stream && stream.getVideoTracks()[0]; if (!t) return; const on = !t._torch; await t.applyConstraints({ advanced: [{ torch: on }] }); t._torch = on; } catch (e) { toast("Máy này không hỗ trợ bật đèn từ trình duyệt"); } };
  function drawOv(quads, ok, bad) {
    const r = ov.getBoundingClientRect(); ov.width = r.width; ov.height = r.height; const c = ov.getContext("2d"); c.clearRect(0, 0, ov.width, ov.height);
    if (!quads) return;
    const vw = video.videoWidth, vh = video.videoHeight; const sc = Math.max(r.width / vw, r.height / vh); const ox = (r.width - vw * sc) / 2, oy = (r.height - vh * sc) / 2;
    c.strokeStyle = bad ? "#ff5a5a" : ok ? "#3ddc84" : "#ffd54d"; c.lineWidth = 4; c.fillStyle = bad ? "rgba(255,90,90,.15)" : ok ? "rgba(61,220,132,.18)" : "rgba(255,213,77,.15)";
    quads.forEach(q => { const P = q.map(p => [p[0] * sc + ox, p[1] * sc + oy]); c.beginPath(); P.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); });
  }
  let holdUntil = 0, failN = 0; const fails = [];
  function tick() {
    if (busy || paused || !video.videoWidth || Date.now() < holdUntil) return;
    const vw = video.videoWidth, vh = video.videoHeight, s = 480 / Math.max(vw, vh);
    small.width = Math.round(vw * s); small.height = Math.round(vh * s); sx.drawImage(video, 0, 0, small.width, small.height);
    const d = OMR.detect(sx.getImageData(0, 0, small.width, small.height), 480);
    if (!d) { stable = 0; lastPts = null; drawOv(null); msg("Đưa trọn phiếu vào khung — thấy đủ 4 ô vuông đen là máy tự chấm"); return; }
    const pts = d.pts.map(p => [p[0] / s, p[1] / s]); const quads = d.quads.map(q => q.map(p => [p[0] / s, p[1] / s]));
    const mv = lastPts ? Math.max(...pts.map((p, i) => Math.hypot(p[0] - lastPts[i][0], p[1] - lastPts[i][1]))) / Math.max(vw, vh) : 1;
    stable = mv < .02 ? stable + 1 : 0; lastPts = pts; drawOv(quads, stable >= 1);
    msg(quads.length > 1 ? "Thấy 2 phiếu trên một tờ — giữ yên…" : stable >= 1 ? "Giữ yên…" : "Đã thấy phiếu — giữ máy cố định");
    if (stable >= 2) { stable = 0; capture(quads); }
  }
  /* chấm trong luồng nền (Web Worker); máy cũ không có thì chấm trực tiếp */
  let worker = null, wid = 0; const wwait = {};
  try { worker = new Worker("assets/omr/worker.js?v=6"); worker.onmessage = e => { const f = wwait[e.data.id]; if (f) { delete wwait[e.data.id]; f(e.data.out); } }; worker.onerror = () => { worker = null; }; } catch (e) { worker = null; }
  function readAsync(img, ids) {
    if (!worker) return new Promise(res => setTimeout(() => res(OMR.readAuto(img, ids)), 20));
    return new Promise(res => {
      const id = ++wid; let done = false;
      const t = setTimeout(() => { if (done) return; done = true; delete wwait[id]; res(OMR.readAuto(img, ids)); }, 20000);
      wwait[id] = out => { if (done) return; done = true; clearTimeout(t); res(out); };
      worker.postMessage({ id, img: { data: img.data, width: img.width, height: img.height }, ids });
    });
  }
  const CAP = 1600; // cạnh dài ảnh chấm: đủ nét cho ô tô, nhanh hơn nhiều so với ảnh gốc
  async function capture(quads) {
    busy = true; msg("⏳ Đang chấm…");
    const vw = video.videoWidth, vh = video.videoHeight, s = Math.min(1, CAP / Math.max(vw, vh));
    full.width = Math.round(vw * s); full.height = Math.round(vh * s); fx.drawImage(video, 0, 0, full.width, full.height);
    const img = fx.getImageData(0, 0, full.width, full.height);
    try { await process(img, quads); } finally { busy = false; }
  }
  let reviewDone = null; // chấm nhiều ảnh: chờ thầy cô xem xong phiếu cần kiểm tra
  const loadImg = f => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(f); });
  async function onPick(e) {
    const files = [...e.target.files]; e.target.value = ""; if (!files.length) return; if (!bai()) { alert("Hãy chọn bài kiểm tra trước."); return; }
    busy = true; let ok = 0, bad = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        msg(`⏳ Đang chấm ảnh ${i + 1}/${files.length}…`);
        let im; try { im = await loadImg(files[i]); } catch (x) { bad++; continue; }
        const s = Math.min(1, 2000 / Math.max(im.width, im.height)); full.width = Math.round(im.width * s); full.height = Math.round(im.height * s); fx.drawImage(im, 0, 0, full.width, full.height); URL.revokeObjectURL(im.src);
        await process(fx.getImageData(0, 0, full.width, full.height));
        if (failN) { bad++; if (files.length > 1) toast(`Ảnh ${i + 1}: chưa đọc được`); continue; } ok++;
        if (last && paused) await new Promise(r => { reviewDone = r; });
      }
    } finally { busy = false; holdUntil = 0; }
    if (files.length > 1) msg(`Xong ${files.length} ảnh: đọc được ${ok}, chưa đọc được ${bad}` + (bad ? " (tải ảnh lỗi bên dưới)" : ""));
  }
  if ($("autoSave")) { $("autoSave").checked = localStorage.getItem("cham-tuluu") !== "0"; $("autoSave").onchange = e => localStorage.setItem("cham-tuluu", e.target.checked ? "1" : "0"); }
  $("photo").onchange = onPick; if ($("snap")) $("snap").onchange = onPick;
  function beep(ok) {
    if (navigator.vibrate) navigator.vibrate(ok ? 90 : [60, 60, 60]);
    if (!$("beep").checked) return;
    try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(), g = a.createGain(); o.frequency.value = ok ? 1046 : 330; g.gain.value = .12; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + (ok ? .12 : .3)); } catch (e) {}
  }
  function keepFail(why, quads) { // giữ lại 4 ảnh lỗi gần nhất (thu nhỏ) để thầy cô gửi kiểm tra
    try { const c = document.createElement("canvas"), k = Math.min(1, 1400 / Math.max(full.width, full.height)); c.width = full.width * k; c.height = full.height * k; c.getContext("2d").drawImage(full, 0, 0, c.width, c.height); fails.push({ why, t: new Date(), url: c.toDataURL("image/jpeg", .85) }); if (fails.length > 4) fails.shift(); } catch (e) {}
    stat();
  }
  function stat() {
    const B = bai(); const n = B ? Kho.results(B.id).length : 0;
    $("camStat").innerHTML = `Đã lưu <b>${n}</b> phiếu cho bài này` + (fails.length ? ` · <a href="#" id="failDl">📤 Tải ${fails.length} ảnh chưa đọc được</a> (gửi để kiểm tra)` : "");
    if ($("failDl")) $("failDl").onclick = ev => { ev.preventDefault(); fails.forEach((f, i) => { const a = document.createElement("a"); a.href = f.url; a.download = `phieu-loi-${i + 1}.jpg`; document.body.appendChild(a); a.click(); a.remove(); }); const t = fails.map((f, i) => `phieu-loi-${i + 1}.jpg: ${f.why}`).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" })); a.download = "phieu-loi.txt"; a.click(); };
  }

  /* chấm một ảnh */
  let last = null, queue = [];
  async function process(img, quads) {
    const B = bai(); if (!B) return;
    const k0 = Object.values(B.keys)[0] || {};
    const fitIds = Object.keys(PRESETS).filter(id => PRESETS[id].TN >= (k0.TN || []).length && PRESETS[id].DS >= (k0.DS || []).length && PRESETS[id].TLN >= (k0.TLN || []).length);
    const ids = [...new Set([B.preset, ...fitIds, ...Object.keys(PRESETS)].filter(id => id && PRESETS[id]))];
    const r = await readAsync(img, ids);
    if (!r.ok) {
      failN++; beep(false); keepFail(r.why, quads);
      msg("✗ " + r.why + (failN >= 3 ? " · Mẹo: bấm 📸 Chụp ảnh nét" : ""));
      if (quads) drawOv(quads, false, true);
      holdUntil = Date.now() + 1500; return;
    }
    failN = 0;
    queue = (r.more || []).slice();
    openRes(r);
  }
  function openRes(r) {
    const B = bai(); paused = true;
    const mas = Object.keys(B.keys); let ma = r.ma;
    let warnMa = "";
    if (!B.keys[ma]) { if (mas.length === 1) { warnMa = `Mã đề tô “${r.ma}” không có trong đáp án — đã dùng mã ${mas[0]}.`; ma = mas[0]; } else warnMa = `Mã đề tô “${r.ma}” không có trong đáp án. Chọn mã đúng bên dưới.`; }
    last = { r, ma, warnMa };
    // tự lưu khi đọc rõ ràng: mã đề có trong đáp án, SBD đủ, không cảnh báo
    if ($("autoSave").checked && !warnMa && B.keys[ma] && !r.warn.length && /^\d+$/.test(r.sbd)) {
      save(true); beep(true); const sc = OMR.score(B.keys[ma], r, B.mon);
      msg(`✓ SBD ${r.sbd}: ${String(sc.diem).replace(".", ",")} điểm — đã lưu` + (queue.length ? " · phiếu thứ 2…" : ""));
      showResult(true);
      if (queue.length) { setTimeout(() => openRes(queue.shift()), 900); return; }
      last = null; paused = false; holdUntil = Date.now() + 1800; stable = 0; if (reviewDone) { const f = reviewDone; reviewDone = null; f(); } return;
    }
    msg("Đã chấm xong" + (r.twoUp ? ` (phiếu ${queue.length ? 1 : 2}/2 trên tờ)` : "") + " — xem kết quả bên dưới"); showResult(); beep(true);
  }
  function nextAfter() {
    if (queue.length) { openRes(queue.shift()); return; }
    if (reviewDone) { const f = reviewDone; reviewDone = null; last = null; $("result").innerHTML = ""; paused = false; f(); return; }
    last = null; $("result").innerHTML = ""; paused = false; stable = 0; holdUntil = Date.now() + 800; msg("Đưa phiếu tiếp theo vào khung…"); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function showResult(quick) {
    const B = bai(); const { r } = last; const key = B.keys[last.ma];
    const sc = key ? OMR.score(key, r, B.mon) : null;
    const ds = loadDS(); const ten = ds[r.sbd] || "";
    const chips = (arr, kind) => arr.map((ok, i) => {
      if (kind === "DS") return `<span class="${ok === 4 ? "y" : ok === 0 ? "n" : "b"}">II.${i + 1}: ${r.DS[i] || "-"} (${ok}/4)</span>`;
      const a = kind === "TN" ? r.TN[i] : r.TLN[i]; return `<span class="${ok ? "y" : a ? "n" : "b"}">${kind === "TN" ? "" : "III."}${i + 1}: ${a ? esc(a) : "∅"}${ok ? "" : " → " + esc(kind === "TN" ? key.TN[i] : key.TLN[i])}</span>`;
    }).join("");
    $("result").innerHTML = `${last.warnMa ? `<div class="note red">${esc(last.warnMa)} <select id="maSel">${Object.keys(B.keys).map(m => `<option${m === last.ma ? " selected" : ""}>${m}</option>`).join("")}</select></div>` : ""}
      ${r.warn.length ? `<div class="note">${r.warn.map(esc).join("<br>")}</div>` : ""}
      <div class="score"><div class="d">${sc ? String(sc.diem).replace(".", ",") : "?"}</div><div class="i"><b>SBD: <input type="text" id="sbdEdit" value="${esc(r.sbd)}" style="width:110px;padding:2px 6px"></b> ${ten ? "· " + esc(ten) : ""}<br>Mã đề: <b>${esc(last.ma)}</b> · Đúng ${sc ? sc.raw : 0}/${sc ? sc.max : 0} điểm thô · phiếu ${esc(PRESETS[r.preset].ngan)} · ${r.ms} ms</div></div>
      ${sc ? `<div class="qs">${chips(sc.detail.TN, "TN")}</div><div class="qs">${chips(sc.detail.DS, "DS")}</div><div class="qs">${chips(sc.detail.TLN, "TLN")}</div>` : ""}
      ${quick ? `<div class="hint">✓ Đã tự lưu. Sai thì sửa ở thẻ Kết quả, hoặc tắt “Tự lưu khi đọc rõ”.</div>` : `<div class="row" style="margin:10px 0"><button class="btn coral big-btn" id="nextBtn">✓ Lưu và chấm phiếu tiếp</button></div>
      <div class="row" style="margin-bottom:10px"><button class="btn ghost sm" id="skipBtn">Bỏ qua phiếu này</button></div>`}
      <canvas class="sheet" id="sheetCv"></canvas>`;
    drawSheet(r, key);
    if ($("maSel")) $("maSel").onchange = e => { last.ma = e.target.value; last.warnMa = ""; showResult(); };
    if (quick) return;
    $("nextBtn").onclick = () => { if (save()) nextAfter(); };
    $("skipBtn").onclick = () => nextAfter();
    $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function save(auto) {
    const B = bai(); const { r } = last; const key = B.keys[last.ma]; if (!key) { toast("Chưa có mã đề hợp lệ — chọn mã đề rồi bấm lưu"); return false; }
    const sbd = (!auto && $("sbdEdit") && $("sbdEdit").value.trim()) || r.sbd; const sc = OMR.score(key, r, B.mon);
    const L = Kho.results(B.id); const i = L.findIndex(x => x.sbd === sbd);
    const row = { sbd, ma: last.ma, diem: sc.diem, raw: sc.raw, max: sc.max, TN: r.TN, DS: r.DS, TLN: r.TLN, t: Date.now() };
    if (i >= 0) { L[i] = row; toast("Đã thay kết quả cũ của SBD " + sbd); } else { L.push(row); toast("Đã lưu SBD " + sbd + ": " + String(sc.diem).replace(".", ",") + " điểm"); }
    Kho.setResults(B.id, L); stat(); return true;
  }
  function drawSheet(r, key) {
    const W = r.warped, cv = $("sheetCv"); const s = .5; // 2 px/mm
    cv.width = W.w * s; cv.height = W.h * s; const c = cv.getContext("2d"); const id = c.createImageData(cv.width, cv.height);
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) { const v = W.g[Math.floor(y / s) * W.w + Math.floor(x / s)]; const k = (y * cv.width + x) * 4; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    c.putImageData(id, 0, 0);
    const L = OMR.build(r.preset); const P = OMR.PPM * s; const R = L.R * P;
    const ring = (p, col, w) => { c.beginPath(); c.arc(p.x * P, p.y * P, R + 1.5, 0, 6.283); c.strokeStyle = col; c.lineWidth = w || 2.2; c.stroke(); };
    r.marks.filter(m => m.on && m.kind === "id").forEach(m => ring(m, "#2f6bff"));
    if (!key) return;
    L.tn.forEach(g => { const a = r.TN[g.q], k = key.TN[g.q]; if (k == null) return; g.opts.forEach(p => { if (p.v === a) ring(p, a === k ? "#19a64a" : "#e0234e", 2.6); else if (p.v === k) ring(p, "#2f6bff", 1.6); }); });
    L.ds.forEach(g => { const a = r.DS[g.q] || "", k = key.DS[g.q]; if (!k) return; g.rows.forEach((row, i) => row.forEach(p => { if (p.v === a[i]) ring(p, a[i] === k[i] ? "#19a64a" : "#e0234e", 2.6); else if (p.v === k[i]) ring(p, "#2f6bff", 1.6); })); });
    L.tln.forEach(g => { const k = key.TLN[g.q]; if (k == null) return; const ok = OMR.normNum(r.TLN[g.q]) === OMR.normNum(k) && OMR.normNum(k) !== ""; r.marks.filter(m => m.on && m.kind === "tln").forEach(m => { if (g.cols.some(col => col.some(p => Math.abs(p.x - m.x) < .01 && Math.abs(p.y - m.y) < .01))) ring(m, ok ? "#19a64a" : "#e0234e", 2.6); }); });
  }

  /* ---------------------------------------------------------------- 3. kết quả */
  const loadDS = () => { try { return JSON.parse(localStorage.getItem("cham-ds-" + cur) || "{}"); } catch (e) { return {}; } };
  $("dsLop").onclick = () => { const ds = loadDS(); $("dsText").value = Object.entries(ds).map(([k, v]) => k + "\t" + v).join("\n"); $("dsBox").classList.toggle("hidden"); };
  $("dsSave").onclick = () => { const o = {}; $("dsText").value.split(/\n/).forEach(l => { const m = l.split(/\t|,|;/); if (m.length >= 2 && m[0].trim()) o[m[0].trim()] = m.slice(1).join(" ").trim(); }); localStorage.setItem("cham-ds-" + cur, JSON.stringify(o)); $("dsBox").classList.add("hidden"); drawKq(); toast("Đã lưu " + Object.keys(o).length + " học sinh"); };
  function rows() { const B = bai(); if (!B) return []; const ds = loadDS(); return Kho.results(B.id).slice().sort((a, b) => a.sbd.localeCompare(b.sbd)).map(r => Object.assign({ ten: ds[r.sbd] || "" }, r)); }
  function drawKq() {
    const B = bai(); $("kqTitle").textContent = B ? "Kết quả: " + (B.ten || "") : "Kết quả";
    if (!B) { $("kqTable").innerHTML = `<div class="card empty">Chưa chọn bài kiểm tra.</div>`; $("kqSum").innerHTML = ""; return; }
    const R = rows(); const ds = R.map(r => r.diem);
    const avg = ds.length ? ds.reduce((a, b) => a + b, 0) / ds.length : 0;
    const f = x => String(Math.round(x * 100) / 100).replace(".", ",");
    $("kqSum").innerHTML = `<div><b>${R.length}</b><span>phiếu đã chấm</span></div><div><b>${f(avg)}</b><span>điểm trung bình</span></div><div><b>${ds.length ? f(Math.max(...ds)) + " / " + f(Math.min(...ds)) : "–"}</b><span>cao nhất / thấp nhất</span></div><div><b>${ds.filter(d => d >= 5).length}/${R.length}</b><span>đạt từ 5 điểm</span></div>`;
    $("kqTable").innerHTML = R.length ? `<table class="kq"><tr><th>SBD</th><th>Họ tên</th><th>Mã</th><th>Điểm</th><th></th></tr>${R.map(r => `<tr><td>${esc(r.sbd)}</td><td>${esc(r.ten)}</td><td>${esc(r.ma)}</td><td><b>${f(r.diem)}</b></td><td><button class="btn ghost sm" data-x="${esc(r.sbd)}">✕</button></td></tr>`).join("")}</table>` : `<div class="card empty">Chưa chấm phiếu nào.</div>`;
    $("kqTable").querySelectorAll("[data-x]").forEach(b => b.onclick = () => { if (!confirm("Xoá kết quả SBD " + b.dataset.x + "?")) return; Kho.setResults(B.id, Kho.results(B.id).filter(r => r.sbd !== b.dataset.x)); drawKq(); });
  }
  function table() {
    const B = bai(); const R = rows(); const k0 = Object.values(B.keys)[0];
    const head = ["STT", "SBD", "Họ tên", "Mã đề", "Điểm (thang 10)", "Điểm thô", ...k0.TN.map((_, i) => "I." + (i + 1)), ...k0.DS.map((_, i) => "II." + (i + 1)), ...k0.TLN.map((_, i) => "III." + (i + 1))];
    return [head, ...R.map((r, i) => [i + 1, r.sbd, r.ten, r.ma, String(r.diem).replace(".", ","), String(r.raw).replace(".", ","), ...k0.TN.map((_, j) => r.TN[j] || ""), ...k0.DS.map((_, j) => r.DS[j] || ""), ...k0.TLN.map((_, j) => r.TLN[j] || "")])];
  }
  function dl(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  const fname = ext => (bai().ten || "KetQua").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "_") + "." + ext;
  $("xls").onclick = () => { if (!bai()) return; const T = table(); dl(new Blob(["\ufeff<html><head><meta charset='utf-8'></head><body><table border='1'>" + T.map((r, i) => "<tr>" + r.map(c => `<${i ? "td" : "th"} style="mso-number-format:'\\@'">${esc(c)}</${i ? "td" : "th"}>`).join("") + "</tr>").join("") + "</table></body></html>"], { type: "application/vnd.ms-excel" }), fname("xls")); };
  $("csv").onclick = () => { if (!bai()) return; dl(new Blob(["\ufeff" + table().map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" }), fname("csv")); };
  $("kqClear").onclick = () => { const B = bai(); if (B && confirm("Xoá toàn bộ kết quả của bài này?")) { Kho.setResults(B.id, []); drawKq(); } };

  /* ---------------------------------------------------------------- 4. phân tích */
  $("kqPt").onclick = () => go("pgPt");
  function drawPt() {
    const B = bai(); $("ptTitle").textContent = B ? "Phân tích: " + (B.ten || "") : "Phân tích kết quả";
    if (!B) { $("ptBox").innerHTML = `<div class="card empty">Chưa chọn bài kiểm tra.</div>`; $("ptCmp").innerHTML = ""; return; }
    $("ptLop").value = B.lopHoc || "";
    const sg = OMR.Stats.sig(B.keys); const same = Kho.list().filter(b => b.id !== B.id && OMR.Stats.sig(b.keys) === sg);
    const sel = JSON.parse(localStorage.getItem("cham-cmp-" + B.id) || "[]");
    $("ptCmp").innerHTML = same.length ? `<div class="hint">So sánh với các lớp làm cùng đề:</div>` + same.map(b => `<label class="chk"><input type="checkbox" value="${b.id}"${sel.includes(b.id) ? " checked" : ""}> ${esc(b.lopHoc || b.ten)} <span class="hint">(${Kho.results(b.id).length} phiếu)</span></label>`).join("") : `<div class="hint">Muốn so sánh nhiều lớp: mỗi lớp nạp đáp án thành một bài riêng (quét lại cùng mã QR), chấm, rồi đặt tên lớp.</div>`;
    $("ptCmp").querySelectorAll("input").forEach(i => i.onchange = () => { localStorage.setItem("cham-cmp-" + B.id, JSON.stringify([...$("ptCmp").querySelectorAll("input:checked")].map(x => x.value))); drawPt(); });
    const A = OMR.Stats.analyze(B, Kho.results(B.id));
    const cmp = same.filter(b => sel.includes(b.id)).map(b => OMR.Stats.analyze(b, Kho.results(b.id)));
    $("ptBox").innerHTML = OMR.Stats.render(A, { compare: cmp, names: [B.lopHoc || B.ten, ...same.filter(b => sel.includes(b.id)).map(b => b.lopHoc || b.ten)] });
    $("ptOntap").disabled = !A.meta || !A.n;
    $("ptOntap").title = A.meta ? "" : "Cần thông tin câu hỏi (dạng, mức độ)";
    drawPt.A = A;
  }
  $("ptLop").onchange = () => { const B = bai(); if (!B) return; B.lopHoc = $("ptLop").value.trim(); Kho.save(B); drawPt(); };
  $("ptMeta").onchange = async e => { const f = e.target.files[0]; e.target.value = ""; const B = bai(); if (!f || !B) return; try { OMR.Stats.attachMeta(B, JSON.parse(await f.text())); Kho.save(B); toast("Đã gắn thông tin câu hỏi"); drawPt(); } catch (err) { alert(err.message); } };
  $("ptSend").onclick = () => {
    const B = bai(); if (!B) return; const o = OMR.exportKQ([B.id]);
    const blob = new Blob([JSON.stringify(o)], { type: "application/json" }); const name = "KetQua_" + fname("json");
    const file = new File([blob], name, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: name }).catch(() => dl(blob, name)); else dl(blob, name);
  };
  $("ptOntap").onclick = () => {
    const A = drawPt.A; if (!A || !A.meta) return;
    const k0 = Object.values(A.bai.keys)[0] || {};
    location.href = OMR.Stats.ontapUrl(A, { soDang: 5, ct: { TN: (k0.TN || []).length || 12, DS: (k0.DS || []).length || 4, TLN: (k0.TLN || []).length || 6 }, soMa: 1 });
  };
  if (window.SaoLuu) SaoLuu.mount($("saoLuu"));

  /* ---------------------------------------------------------------- khởi động: mở link có sẵn đáp án (#k=...) */
  (function init() {
    const h = decodeURIComponent(location.hash.replace(/^#k=/, "")); if (/^HT1;/.test(h)) { try { addBai(OMR.unpack(h)); history.replaceState(null, "", location.pathname); } catch (e) {} }
    setCur(cur && Kho.get(cur) ? cur : (Kho.list()[0] || {}).id || "");
    go(Kho.list().length ? (localStorage.getItem("cham-pg") || "pgCham") : "pgBai");
  })();
})();
