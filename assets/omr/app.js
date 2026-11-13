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
  $("addFile").onchange = async e => { const f = e.target.files[0]; if (!f) return; try { addBai(OMR.unpack(await f.text())); } catch (err) { alert("Không đọc được file: " + err.message); } e.target.value = ""; };
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
      video.srcObject = stream; await video.play(); $("camStart").classList.add("hidden"); paused = false; msg("Đưa trọn phiếu vào khung vàng…");
      timer = setInterval(tick, 180);
    } catch (e) { msg("Không mở được camera: " + (e.message || e)); }
  }
  function stopCam() { clearInterval(timer); timer = null; if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; $("camStart").classList.remove("hidden"); }
  $("camStart").onclick = startCam;
  $("torch").onclick = async () => { try { const t = stream && stream.getVideoTracks()[0]; if (!t) return; const on = !t._torch; await t.applyConstraints({ advanced: [{ torch: on }] }); t._torch = on; } catch (e) { toast("Máy này không hỗ trợ bật đèn từ trình duyệt"); } };
  function drawOv(pts, ok) {
    const r = ov.getBoundingClientRect(); ov.width = r.width; ov.height = r.height; const c = ov.getContext("2d"); c.clearRect(0, 0, ov.width, ov.height);
    if (!pts) return;
    const vw = video.videoWidth, vh = video.videoHeight; const sc = Math.max(r.width / vw, r.height / vh); const ox = (r.width - vw * sc) / 2, oy = (r.height - vh * sc) / 2;
    c.strokeStyle = ok ? "#3ddc84" : "#ffd54d"; c.lineWidth = 4; c.fillStyle = ok ? "rgba(61,220,132,.18)" : "rgba(255,213,77,.15)";
    const P = pts.map(p => [p[0] * sc + ox, p[1] * sc + oy]); const o = [P[0], P[1], P[3], P[2]];
    c.beginPath(); o.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke();
  }
  function tick() {
    if (busy || paused || !video.videoWidth) return;
    const vw = video.videoWidth, vh = video.videoHeight, s = 480 / Math.max(vw, vh);
    small.width = Math.round(vw * s); small.height = Math.round(vh * s); sx.drawImage(video, 0, 0, small.width, small.height);
    const d = OMR.detect(sx.getImageData(0, 0, small.width, small.height), 480);
    if (!d) { stable = 0; lastPts = null; drawOv(null); msg("Đưa trọn phiếu vào khung vàng…"); return; }
    const pts = d.pts.map(p => [p[0] / s, p[1] / s]);
    const mv = lastPts ? Math.max(...pts.map((p, i) => Math.hypot(p[0] - lastPts[i][0], p[1] - lastPts[i][1]))) / Math.max(vw, vh) : 1;
    stable = mv < .012 ? stable + 1 : 0; lastPts = pts; drawOv(pts, stable >= 2);
    msg(stable >= 2 ? "Giữ yên…" : "Đã thấy phiếu — giữ máy cố định");
    if (stable >= 3) { stable = 0; capture(); }
  }
  async function capture() {
    busy = true; msg("Đang chấm…");
    full.width = video.videoWidth; full.height = video.videoHeight; fx.drawImage(video, 0, 0);
    await new Promise(r => setTimeout(r, 10));
    const img = fx.getImageData(0, 0, full.width, full.height);
    process(img);
    busy = false;
  }
  $("photo").onchange = e => {
    const f = e.target.files[0]; if (!f) return; if (!bai()) { alert("Hãy chọn bài kiểm tra trước."); return; }
    const im = new Image(); im.onload = () => { const s = Math.min(1, 2400 / Math.max(im.width, im.height)); full.width = im.width * s; full.height = im.height * s; fx.drawImage(im, 0, 0, full.width, full.height); process(fx.getImageData(0, 0, full.width, full.height)); URL.revokeObjectURL(im.src); };
    im.src = URL.createObjectURL(f); e.target.value = "";
  };
  function beep(ok) {
    if (navigator.vibrate) navigator.vibrate(ok ? 90 : [60, 60, 60]);
    if (!$("beep").checked) return;
    try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(), g = a.createGain(); o.frequency.value = ok ? 1046 : 330; g.gain.value = .12; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + (ok ? .12 : .3)); } catch (e) {}
  }

  /* chấm một ảnh */
  let last = null;
  function process(img) {
    const B = bai();
    const ids = B.preset && PRESETS[B.preset] ? [B.preset] : Object.keys(PRESETS);
    const r = OMR.readAuto(img, ids);
    if (!r.ok) { msg(r.why); beep(false); return; }
    paused = true;
    const mas = Object.keys(B.keys); let ma = r.ma;
    let warnMa = "";
    if (!B.keys[ma]) { if (mas.length === 1) { warnMa = `Mã đề tô “${r.ma}” không có trong đáp án — đã dùng mã ${mas[0]}.`; ma = mas[0]; } else warnMa = `Mã đề tô “${r.ma}” không có trong đáp án. Chọn mã đúng bên dưới.`; }
    last = { r, ma, warnMa }; msg("Đã chấm xong — xem kết quả bên dưới"); showResult(); beep(true);
  }
  function showResult() {
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
      <div class="row" style="margin:10px 0"><button class="btn coral big-btn" id="nextBtn">✓ Lưu và chấm phiếu tiếp</button></div>
      <div class="row" style="margin-bottom:10px"><button class="btn ghost sm" id="skipBtn">Bỏ qua phiếu này</button></div>
      <canvas class="sheet" id="sheetCv"></canvas>`;
    drawSheet(r, key);
    if ($("maSel")) $("maSel").onchange = e => { last.ma = e.target.value; last.warnMa = ""; showResult(); };
    $("nextBtn").onclick = () => { save(); last = null; $("result").innerHTML = ""; paused = false; stable = 0; msg("Đưa phiếu tiếp theo vào khung…"); window.scrollTo({ top: 0, behavior: "smooth" }); };
    $("skipBtn").onclick = () => { last = null; $("result").innerHTML = ""; paused = false; stable = 0; };
    $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function save() {
    const B = bai(); const { r } = last; const key = B.keys[last.ma]; if (!key) { toast("Chưa có mã đề hợp lệ — chưa lưu"); return; }
    const sbd = ($("sbdEdit") && $("sbdEdit").value.trim()) || r.sbd; const sc = OMR.score(key, r, B.mon);
    const L = Kho.results(B.id); const i = L.findIndex(x => x.sbd === sbd);
    const row = { sbd, ma: last.ma, diem: sc.diem, raw: sc.raw, max: sc.max, TN: r.TN, DS: r.DS, TLN: r.TLN, t: Date.now() };
    if (i >= 0) { L[i] = row; toast("Đã thay kết quả cũ của SBD " + sbd); } else { L.push(row); toast("Đã lưu SBD " + sbd + ": " + String(sc.diem).replace(".", ",") + " điểm"); }
    Kho.setResults(B.id, L);
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

  /* ---------------------------------------------------------------- khởi động: mở link có sẵn đáp án (#k=...) */
  (function init() {
    const h = decodeURIComponent(location.hash.replace(/^#k=/, "")); if (/^HT1;/.test(h)) { try { addBai(OMR.unpack(h)); history.replaceState(null, "", location.pathname); } catch (e) {} }
    setCur(cur && Kho.get(cur) ? cur : (Kho.list()[0] || {}).id || "");
    go(Kho.list().length ? (localStorage.getItem("cham-pg") || "pgCham") : "pgBai");
  })();
})();
