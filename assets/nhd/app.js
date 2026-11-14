/* nhd/app.js — điều khiển trang Ra đề */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const { Store, Gen, Out, esc } = NHD;
  const MON = [["Toán", [10, 11, 12], "m-toan", "∑", "TOÁN"], ["Vật lí", [10, 11, 12], "m-li", "⚡", "VẬT LÍ"], ["Hoá học", [10, 11, 12], "m-hoa", "⌬", "HOÁ HỌC"]];
  const LVN = { NB: "Biết", TH: "Hiểu", VD: "Vận dụng", VDC: "VD cao" };
  const LN = { TN: "Phần I · Trắc nghiệm", DS: "Phần II · Đúng/Sai", TLN: "Phần III · Trả lời ngắn" };
  const ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  const st = Object.assign({ mon: "Toán", lop: 12, step: 1 }, LS.get("rd-tab", {}));
  let bank = { questions: [], dang: {} }, idx = null, M = {}, scope = [], ex = null, view = 0, counts = {};

  /* ---------------------------------------------------------------- tên chương/bài */
  /* "TT" = ngân hàng ghép lớp 11 + 12 (đề thi thử tốt nghiệp): chương lớp 11 đánh số 101…, lớp 12 đánh số 201… */
  /* "TT" = đề thi tốt nghiệp: ghép ngân hàng nhiều khối lớp (tuỳ chọn 10, 11, 12); chương của lớp l được đánh số l·100 + chương */
  const TT = "TT"; const khoi = () => { const k = LS.get("rd-khoi|" + st.mon, [10, 11, 12]).filter(l => [10, 11, 12].includes(l)); return k.length ? k : [12]; };
  const lopLabel = l => l === TT ? khoi().join(" + ") : l;
  const splitC = c => st.lop === TT ? [Math.floor(c / 100), c % 100] : [st.lop, c];
  const names = {
    chuong: c0 => { const [l, c] = splitC(c0); const T = ((window.CHUONG_TRINH || {})[st.mon] || {})[l] || {}; return (st.lop === TT ? "Lớp " + l + " · " : "") + "Chương " + (ROM[c] || c) + (T[c] ? ". " + T[c][0] : ""); },
    bai: (c0, b) => { const [l, c] = splitC(c0); const T = ((window.CHUONG_TRINH || {})[st.mon] || {})[l] || {}; const n = T[c] && T[c][1][b]; return "Bài " + b + (n ? ". " + n : ""); }
  };
  const key = s => s + "|" + st.mon + "|" + st.lop;

  /* ---------------------------------------------------------------- tab */
  function tabs(box, items, cur, on) {
    box.innerHTML = "";
    items.forEach(it => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-selected", it.v === cur); if (it.cls) b.className = it.cls; b.innerHTML = it.html; b.onclick = () => on(it.v); box.appendChild(b); });
  }
  function drawTabs() {
    const m = MON.find(x => x[0] === st.mon) || MON[0];
    tabs($("tmon"), MON.map(x => { const n = x[1].reduce((a, l) => a + (counts[x[0] + "|" + l] || 0), 0); return { v: x[0], cls: x[2], html: `<span class="ic">${x[3]}</span>${x[0]}<span class="n">${n ? n.toLocaleString("vi-VN") + " câu" : "chưa có"}</span>` }; }), st.mon, v => { st.mon = v; switchBank(); });
    $("tlop").className = "tabs " + m[2];
    const lops = m[1].map(l => ({ v: l, html: `Lớp ${l}<span class="n">${(counts[st.mon + "|" + l] || 0).toLocaleString("vi-VN")}</span>` }));
    if (m[1].includes(12)) lops.push({ v: TT, html: `🎓 Thi tốt nghiệp (nhiều khối)<span class="n">${khoi().reduce((a, l) => a + (counts[st.mon + "|" + l] || 0), 0).toLocaleString("vi-VN")}</span>` });
    tabs($("tlop"), lops, st.lop, v => { st.lop = v; switchBank(); });
    const kb = $("khoiBox");
    if (kb) {
      kb.classList.toggle("hidden", st.lop !== TT);
      if (st.lop === TT) {
        kb.innerHTML = `<b>Khối lớp đưa vào đề:</b> ${[10, 11, 12].map(l => `<label class="chk"><input type="checkbox" value="${l}"${khoi().includes(l) ? " checked" : ""}> Lớp ${l} <span class="muted small">(${(counts[st.mon + "|" + l] || 0).toLocaleString("vi-VN")} câu)</span></label>`).join("")}<span class="muted small">— chọn dạng và mức độ mong muốn ở bước 2 (Ma trận). Đề tốt nghiệp theo cấu trúc Bộ: kiến thức chủ yếu lớp 12, có lớp 10, 11.</span>`;
        kb.querySelectorAll("input").forEach(i => i.onchange = () => { const v = [...kb.querySelectorAll("input:checked")].map(x => +x.value); if (!v.length) { i.checked = true; return toast("Chọn ít nhất một khối lớp"); } LS.set("rd-khoi|" + st.mon, v); switchBank(); });
      }
    }
    document.querySelectorAll("#steps button").forEach(b => b.setAttribute("aria-selected", +b.dataset.s === st.step));
    document.querySelectorAll(".pane").forEach(p => p.classList.toggle("on", p.id === "p" + st.step));
    document.body.classList.remove("m-toan", "m-li", "m-hoa"); document.body.classList.add(m[2]);
    LS.set("rd-tab", { mon: st.mon, lop: st.lop, step: st.step });
  }
  document.querySelectorAll("#steps button").forEach(b => b.onclick = () => { st.step = +b.dataset.s; drawTabs(); if (st.step === 2) drawMatrix(); });

  async function refreshCounts() { try { counts = await Store.counts(); } catch (e) { counts = {}; } }
  async function switchBank() {
    ex = null; $("genBox").classList.add("hidden"); $("genMsg").innerHTML = "";
    drawTabs();
    if (st.lop === TT) { // ghép ngân hàng các khối đã chọn
      const K = khoi(); const B = await Promise.all(K.map(l => Store.load(st.mon, l)));
      const qs = [], dn = {};
      B.forEach((b, i) => { const off = K[i] * 100;
        b.questions.forEach(q => { const c = q.chuong + off; qs.push(Object.assign({}, q, { chuong: c, dkey: `C${c}-B${q.bai}-D${String(q.dangSo).padStart(2, "0")}` })); });
        Object.entries(b.dang).forEach(([k, v]) => { const mm = k.match(/^C(\d+)-(.*)$/); if (mm) dn[`C${+mm[1] + off}-${mm[2]}`] = v; }); });
      bank = { questions: qs, dang: dn };
    } else bank = await Store.load(st.mon, st.lop);
    idx = Gen.buildIndex(bank.questions, bank.dang);
    M = LS.get(key("mt"), {}); scope = LS.get(key("sc"), null) || [...new Set(idx.list.map(d => d.chuong))];
    const ct = LS.get(key("ct"), null) || Gen.cauTrucChuan(st.mon);
    $("cTN").value = ct.TN; $("cDS").value = ct.DS; $("cTLN").value = ct.TLN;
    $("iMon").value = LS.get(key("imon"), (MON.find(x => x[0] === st.mon) || MON[0])[4]);
    drawBank(); drawScope(); drawPct(); drawTpl(); drawMatrix();
    $("s1i").textContent = bank.questions.length ? bank.questions.length.toLocaleString("vi-VN") + " câu" : "Đăng file .tex / .zip";
  }

  /* ---------------------------------------------------------------- BƯỚC 1: ngân hàng */
  async function ingest(source) {
    if (st.lop === TT) { $("loadMsg").innerHTML = `<div class="note red">Mục “Thi tốt nghiệp” tự ghép ngân hàng các khối lớp đã đăng. Hãy chọn tab Lớp 10, 11 hoặc 12 để đăng thêm câu hỏi.</div>`; return; }
    $("prog").classList.remove("hidden"); const bar = $("prog").firstElementChild; bar.style.width = "5%"; $("progT").textContent = "Đang đọc file…"; $("loadMsg").innerHTML = "";
    let nf = 0;
    try {
      const files = await Store.collect(source, n => { nf++; if (nf % 10 === 0) $("progT").textContent = "Đã đọc " + nf + " file…"; });
      if (!files.length) { $("loadMsg").innerHTML = `<div class="note red">Không tìm thấy file .tex nào.</div>`; $("prog").classList.add("hidden"); return; }
      const all = [], dang = {}, errs = []; const seen = new Set(); let dup = 0;
      for (let i = 0; i < files.length; i++) {
        const r = NHD.parseBank(files[i].text, files[i].name, st.lop);
        r.questions.forEach(q => { q.mon = st.mon; const k = q.lop + "|" + q.id; if (seen.has(k)) { dup++; return; } seen.add(k); all.push(q); });
        Object.entries(r.dang).forEach(([k, v]) => dang[st.mon + "|" + k] = v);
        errs.push(...r.errors);
        bar.style.width = (5 + 70 * (i + 1) / files.length).toFixed(0) + "%";
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 0));
      }
      $("progT").textContent = "Đang lưu " + all.length.toLocaleString("vi-VN") + " câu…";
      for (let i = 0; i < all.length; i += 2000) { await Store.put(all.slice(i, i + 2000), i === 0 ? dang : null); bar.style.width = (75 + 25 * Math.min(1, (i + 2000) / all.length)).toFixed(0) + "%"; }
      const byLop = {}; all.forEach(q => byLop[q.lop] = (byLop[q.lop] || 0) + 1);
      const other = Object.keys(byLop).filter(l => +l !== st.lop);
      $("loadMsg").innerHTML = `<div class="note green">Đã đọc <b>${files.length}</b> file, lưu <b>${all.length.toLocaleString("vi-VN")}</b> câu${dup ? ` (bỏ ${dup} câu trùng mã)` : ""}: ${Object.entries(byLop).map(([l, n]) => `lớp ${l}: ${n.toLocaleString("vi-VN")} câu`).join(", ")}.${other.length ? ` <br>Câu của lớp khác được tự xếp vào đúng lớp (nhận theo mã câu hoặc dòng đầu mỗi file).` : ""}</div>` +
        (errs.length ? `<details class="note red"><summary><b>${errs.length} câu lỗi định dạng</b> (bị bỏ qua) — bấm để xem</summary><div class="small" style="max-height:220px;overflow:auto">${errs.slice(0, 300).map(e => `${esc(e.file.split("/").pop())} · ${esc(e.id)}: ${esc(e.msg)}`).join("<br>")}</div></details>` : "");
      await refreshCounts(); await switchBank();
    } catch (e) { console.error(e); $("loadMsg").innerHTML = `<div class="note red">Lỗi khi đọc: ${esc(e.message || e)}</div>`; }
    setTimeout(() => $("prog").classList.add("hidden"), 600); $("progT").textContent = "";
  }
  const drop = $("drop");
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => ingest(e.dataTransfer));
  $("fFiles").onchange = e => { ingest([...e.target.files]); e.target.value = ""; };
  $("fDir").onchange = e => { ingest([...e.target.files]); e.target.value = ""; };
  $("btnClear").onclick = async () => { if (st.lop === TT) return toast("Chọn tab Lớp 10, 11 hoặc 12 để xoá ngân hàng"); if (!confirm(`Xoá toàn bộ ngân hàng ${st.mon} lớp ${st.lop} trên máy này?`)) return; await Store.clear(st.mon, st.lop); await refreshCounts(); switchBank(); };
  $("bankQ").oninput = drawBank;

  function drawBank() {
    const qs = bank.questions; const box = $("tree");
    $("treeTitle").textContent = `Ngân hàng ${st.mon} ${lopLabel(st.lop)}`;
    if (!qs.length) { $("bankSum").innerHTML = ""; box.innerHTML = `<div class="card empty"><h3>Chưa có câu hỏi nào cho ${esc(st.mon)} lớp ${lopLabel(st.lop)}</h3><p class="muted">Kéo thả file ngân hàng (.tex hoặc .zip) vào ô phía trên.</p></div>`; return; }
    const c = { TN: 0, DS: 0, TLN: 0 }; const lv = {}; qs.forEach(q => { c[q.loai]++; lv[q.muc] = (lv[q.muc] || 0) + 1; });
    $("bankSum").innerHTML = `<div><b>${qs.length.toLocaleString("vi-VN")}</b><span>câu hỏi</span></div><div><b>${idx.list.length}</b><span>dạng toán · ${new Set(idx.list.map(d => d.chuong)).size} chương</span></div><div><b>${c.TN.toLocaleString("vi-VN")} · ${c.DS.toLocaleString("vi-VN")} · ${c.TLN.toLocaleString("vi-VN")}</b><span>TN · Đúng/Sai · Trả lời ngắn</span></div><div><b>${idx.levels.map(m => Math.round((lv[m] || 0) / qs.length * 100) + "%").join(" · ")}</b><span>${idx.levels.map(m => LVN[m]).join(" · ")}</span></div>`;
    const k = ($("bankQ").value || "").toLowerCase().normalize("NFC");
    const byCh = {}; idx.list.forEach(d => { if (k && !(d.ten + " " + d.dkey).toLowerCase().includes(k)) return; (byCh[d.chuong] = byCh[d.chuong] || []).push(d); });
    box.innerHTML = Object.entries(byCh).map(([ch, ds]) => {
      const byB = {}; ds.forEach(d => (byB[d.bai] = byB[d.bai] || []).push(d));
      const [lp, cc] = splitC(+ch); const sims = (window.SIMS || []).filter(r => r.mon === st.mon && +r.lop === +lp && r.chuong === "Chương " + ROM[cc]);
      const simH = sims.length ? `<div class="small" style="margin:4px 0 8px">🔬 Mô phỏng liên quan: ${sims.map(r => `<a href="${r.file}" target="_blank" rel="noopener">${esc(r.ten)}</a>`).join(" · ")} · <a href="tren-lop.html">📽 Trình chiếu câu hỏi</a></div>` : "";
      return `<details${k ? " open" : ""}><summary>${esc(names.chuong(+ch))}<span class="n">${ds.length} dạng · ${ds.reduce((a, d) => a + d.n, 0).toLocaleString("vi-VN")} câu${sims.length ? " · " + sims.length + " mô phỏng" : ""}</span></summary><div class="bai">${simH}` +
        Object.entries(byB).map(([b, dd]) => `<h4>${esc(names.bai(+ch, +b))}</h4>` + dd.map(d => `<div class="dline"><span class="dk">${d.dkey}</span><span class="nm">${d.ten ? NHD.texToHtml(d.ten) : "(chưa có tên dạng)"}</span><span class="lv">${idx.levels.map(m => { const n = ["TN", "DS", "TLN"].reduce((a, L) => a + (d.c[L + "|" + m] || 0), 0); return n ? `<i class="${m}">${m} ${n}</i>` : ""; }).join("")}</span><button class="btn ghost sm" data-view="${d.dkey}">Xem câu</button></div>`).join("")).join("") + "</div></details>";
    }).join("");
    box.querySelectorAll("[data-view]").forEach(b => b.onclick = () => viewDang(b.dataset.view));
  }
  function viewDang(dkey, filt) {
    const d = idx.dang[dkey]; filt = filt || "";
    const list = bank.questions.filter(q => q.dkey === dkey && (!filt || q.loai === filt.split("|")[0] && (!filt.split("|")[1] || q.muc === filt.split("|")[1])));
    $("dlgT").innerHTML = dkey + " · " + NHD.texToHtml(d.ten || "");
    const opts = ["", ...["TN", "DS", "TLN"].flatMap(L => idx.levels.map(m => L + "|" + m))];
    $("dlgB").innerHTML = `<div class="row" style="margin-bottom:10px"><select id="vf">${opts.map(o => `<option value="${o}"${o === filt ? " selected" : ""}>${o ? o.replace("|", " · ") : "Tất cả"}</option>`).join("")}</select><span class="muted small">${list.length} câu (hiện tối đa 40)</span></div><div class="qview ex">` +
      list.slice(0, 40).map((q, i) => NHD.renderQuestion({ q, order: [0, 1, 2, 3] }, i + 1, "key", { meta: true, sol: true })).join("") + "</div>";
    $("vf").onchange = e => viewDang(dkey, e.target.value);
    if (!$("dlg").open) $("dlg").showModal();
  }

  /* ---------------------------------------------------------------- BƯỚC 2: ma trận */
  function saveM() { LS.set(key("mt"), M); LS.set(key("sc"), scope); LS.set(key("ct"), ct()); }
  const ct = () => ({ TN: +$("cTN").value || 0, DS: +$("cDS").value || 0, TLN: +$("cTLN").value || 0 });
  ["cTN", "cDS", "cTLN"].forEach(id => $(id).oninput = () => { saveM(); drawCtNote(); });
  function drawCtNote() {
    const c = ct(), w = Gen.diem(st.mon); const raw = c.TN * w.TN + c.DS * w.DS + c.TLN * w.TLN; const std = Gen.cauTrucChuan(st.mon);
    $("ctNote").innerHTML = `Thang điểm ${esc(st.mon)} (Bộ GD&ĐT, từ 2025): Phần I ${String(w.TN).replace(".", ",")} đ/câu · Phần II tối đa 1 đ/câu (đúng 1/2/3/4 ý: 0,1/0,25/0,5/1) · Phần III ${String(w.TLN).replace(".", ",")} đ/câu. Cấu trúc chuẩn ${std.TN}–${std.DS}–${std.TLN}. Hiện tại: <b>${String(+raw.toFixed(2)).replace(".", ",")} điểm</b>${Math.abs(raw - 10) > 1e-9 ? " → quy về thang 10" : ""}.`;
  }
  function drawScope() {
    const chs = [...new Set(idx.list.map(d => d.chuong))].sort((a, b) => a - b);
    $("scope").innerHTML = chs.length ? chs.map(c => `<label class="chk"><input type="checkbox" value="${c}"${scope.includes(c) ? " checked" : ""}> ${esc(names.chuong(c))} <span class="muted small">(${idx.list.filter(d => d.chuong === c).length} dạng)</span></label>`).join("") : `<span class="muted">Chưa có ngân hàng.</span>`;
    $("scope").querySelectorAll("input").forEach(i => i.onchange = () => { scope = [...$("scope").querySelectorAll("input:checked")].map(x => +x.value); saveM(); drawMatrix(); });
    drawCtNote();
  }
  $("scAll").onclick = () => { scope = [...new Set(idx.list.map(d => d.chuong))]; saveM(); drawScope(); drawMatrix(); };
  $("scNone").onclick = () => { scope = []; saveM(); drawScope(); drawMatrix(); };
  function drawPct() {
    const lv = idx.levels.length ? idx.levels : ["NB", "TH", "VD"];
    const def = lv.includes("VDC") ? { NB: 40, TH: 30, VD: 20, VDC: 10 } : { NB: 40, TH: 30, VD: 30 };
    const p = Object.assign({}, def, LS.get(key("pct"), {}));
    $("pctBox").innerHTML = `<span class="small" style="font-weight:600;color:var(--muted)">Tỉ lệ mức độ (%)</span>` + lv.map(m => `<label class="f" style="width:78px">${LVN[m]}<input type="number" min="0" max="100" data-p="${m}" value="${p[m] || 0}"></label>`).join("");
    $("pctBox").querySelectorAll("input").forEach(i => i.oninput = () => { const o = {}; $("pctBox").querySelectorAll("input").forEach(x => o[x.dataset.p] = +x.value || 0); LS.set(key("pct"), o); });
  }
  const pct = () => { const o = {}; $("pctBox").querySelectorAll("input").forEach(x => o[x.dataset.p] = +x.value || 0); return o; };
  $("btnSuggest").onclick = () => {
    const sc = idx.list.filter(d => scope.includes(d.chuong)).map(d => d.dkey);
    if (!sc.length) { toast("Hãy chọn ít nhất một chương"); return; }
    const r = Gen.suggest(idx, sc, ct(), pct(), Date.now());
    M = r.M; saveM(); drawMatrix();
    if (r.short.length) toast("Ngân hàng không đủ câu cho " + r.short.length + " vị trí — thầy kiểm tra lại số câu", 4000); else toast("Đã gợi ý ma trận. Thầy chỉnh lại số câu tuỳ ý.");
  };
  $("btnZero").onclick = () => { if (!confirm("Xoá hết số câu trong ma trận?")) return; M = {}; saveM(); drawMatrix(); };
  $("onlyUsed").onchange = drawMatrix;

  function drawMatrix() {
    const tb = $("mx"); const lv = idx.levels; const L3 = ["TN", "DS", "TLN"];
    if (!idx.list.length) { tb.innerHTML = `<tr><td style="padding:30px">Chưa có ngân hàng cho ${esc(st.mon)} lớp ${lopLabel(st.lop)}. Hãy đăng ngân hàng ở bước 1.</td></tr>`; $("mxSum").innerHTML = ""; return; }
    const only = $("onlyUsed").checked;
    const used = d => L3.some(L => Object.values((M[d.dkey] || {})[L] || {}).some(n => +n > 0));
    let h = `<thead><tr><th class="nm" rowspan="2">Chương / Bài / Dạng</th>${L3.map((L, i) => `<th class="p${i + 1}" colspan="${lv.length}">${LN[L]}</th>`).join("")}<th rowspan="2">Tổng</th></tr><tr>${L3.map((L, i) => lv.map(m => `<th class="p${i + 1}">${m}</th>`).join("")).join("")}</tr></thead><tbody>`;
    let lastC = 0, lastB = 0;
    idx.list.forEach(d => {
      if (!scope.includes(d.chuong)) return;
      if (only && !used(d)) return;
      if (d.chuong !== lastC) { h += `<tr class="ch"><td class="nm">${esc(names.chuong(d.chuong))}</td><td colspan="${lv.length * 3 + 1}"></td></tr>`; lastC = d.chuong; lastB = 0; }
      if (d.bai !== lastB) { h += `<tr class="bai"><td class="nm">${esc(names.bai(d.chuong, d.bai))}</td><td colspan="${lv.length * 3 + 1}"></td></tr>`; lastB = d.bai; }
      let tot = 0;
      h += `<tr class="dg${used(d) ? "" : " off"}" data-d="${d.dkey}"><td class="nm"><span class="muted small">${d.dkey.replace(/^C\d+-B\d+-/, "")}</span> ${d.ten ? NHD.texToHtml(d.ten) : d.dkey}</td>` + L3.map(L => lv.map(m => {
        const av = d.c[L + "|" + m] || 0, v = +(((M[d.dkey] || {})[L] || {})[m]) || 0; tot += v;
        return `<td><span class="cell${av ? "" : " na"}"><input type="number" min="0" max="${av}" value="${v || ""}" data-l="${L}" data-m="${m}" class="${v ? (v > av ? "bad" : "has") : ""}"${av ? "" : " disabled"}><small>/${av}</small></span></td>`;
      }).join("")).join("") + `<td><b data-tot>${tot || ""}</b></td></tr>`;
    });
    h += "</tbody>";
    const t = Gen.totals(M, st.mon); const colSum = (L, m) => idx.list.reduce((a, d) => a + (+(((M[d.dkey] || {})[L] || {})[m]) || 0), 0);
    h += `<tfoot><tr><td class="nm">Tổng</td>${L3.map(L => lv.map(m => `<td>${colSum(L, m) || ""}</td>`).join("")).join("")}<td>${t.n}</td></tr></tfoot>`;
    tb.innerHTML = h;
    tb.querySelectorAll("input").forEach(inp => inp.oninput = () => {
      const dk = inp.closest("tr").dataset.d, L = inp.dataset.l, m = inp.dataset.m; const v = Math.max(0, parseInt(inp.value) || 0);
      M[dk] = M[dk] || {}; M[dk][L] = M[dk][L] || {}; if (v) M[dk][L][m] = v; else delete M[dk][L][m];
      inp.className = v ? (v > +inp.max ? "bad" : "has") : ""; inp.closest("tr").classList.toggle("off", !used(idx.dang[dk]));
      saveM(); drawMxSum(); clearTimeout(drawMatrix.t); drawMatrix.t = setTimeout(() => { const y = $("mx").parentElement.scrollTop; const a = document.activeElement; const sel = a && a.closest && a.closest("tr") ? [a.closest("tr").dataset.d, a.dataset.l, a.dataset.m] : null; drawMatrix(); $("mx").parentElement.scrollTop = y; if (sel) { const n = $("mx").querySelector(`tr[data-d="${sel[0]}"] input[data-l="${sel[1]}"][data-m="${sel[2]}"]`); if (n) n.focus(); } }, 900);
    });
    drawMxSum();
  }
  function drawMxSum() {
    const t = Gen.totals(M, st.mon), c = ct(), w = Gen.diem(st.mon);
    const ok = L => t[L] === c[L];
    const sc10 = t.raw ? 10 / t.raw : 0;
    $("mxSum").innerHTML = ["TN", "DS", "TLN"].map((L, i) => `<div><b class="${ok(L) ? "ok" : "bad"}">${t[L]} / ${c[L]}</b><span>${LN[L]} · ${String(+(t[L] * w[L]).toFixed(2)).replace(".", ",")} đ</span></div>`).join("") +
      `<div><b>${String(+t.raw.toFixed(2)).replace(".", ",")} đ</b><span>${Math.abs(t.raw - 10) < 1e-9 ? "đúng thang 10" : t.raw ? "quy về thang 10 (× " + String(+sc10.toFixed(3)).replace(".", ",") + ")" : "chưa có câu"}</span></div>` +
      `<div><b>${idx.levels.map(m => (t.n ? Math.round((t.lv[m] || 0) / t.n * 100) : 0) + "%").join(" · ")}</b><span>${idx.levels.map(m => LVN[m]).join(" · ")}</span></div>`;
    $("s2i").textContent = t.n ? `${t.TN} – ${t.DS} – ${t.TLN} câu` : "Chọn dạng và mức độ";
  }
  // mẫu ma trận
  const tplAll = () => LS.get("mt-mau", []);
  function drawTpl() { const L = tplAll().filter(t => t.mon === st.mon && t.lop === st.lop); $("tplSel").innerHTML = `<option value="">— chọn mẫu (${L.length}) —</option>` + L.map(t => `<option>${esc(t.ten)}</option>`).join(""); }
  $("tplSave").onclick = () => { const ten = prompt("Đặt tên cho mẫu ma trận (ví dụ: Giữa kì I – lớp " + st.lop + "):"); if (!ten) return; const A = tplAll().filter(t => !(t.mon === st.mon && t.lop === st.lop && t.ten === ten)); A.push({ ten, mon: st.mon, lop: st.lop, M, scope, ct: ct(), pct: pct() }); LS.set("mt-mau", A); drawTpl(); toast("Đã lưu mẫu “" + ten + "”"); };
  $("tplLoad").onclick = () => { const t = tplAll().find(t => t.mon === st.mon && t.lop === st.lop && t.ten === $("tplSel").value); if (!t) return; M = JSON.parse(JSON.stringify(t.M)); scope = t.scope; $("cTN").value = t.ct.TN; $("cDS").value = t.ct.DS; $("cTLN").value = t.ct.TLN; LS.set(key("pct"), t.pct); saveM(); drawScope(); drawPct(); drawMatrix(); toast("Đã dùng mẫu “" + t.ten + "”"); };
  $("tplDel").onclick = () => { const v = $("tplSel").value; if (!v || !confirm("Xoá mẫu “" + v + "”?")) return; LS.set("mt-mau", tplAll().filter(t => !(t.mon === st.mon && t.lop === st.lop && t.ten === v))); drawTpl(); };
  const mxHtml = () => Out.matrixTables(M, idx, names, info(), st.mon);
  $("mxPrint").onclick = () => { const w = window.open("", "_blank"); if (!w) return alert("Hãy cho phép cửa sổ bật lên."); w.document.write(`<!doctype html><meta charset="utf-8"><title>Ma trận</title><style>body{margin:16px}table{width:100%}@page{size:A4 landscape;margin:12mm}</style>${mxHtml()}<script>setTimeout(()=>print(),300)<\/script>`); w.document.close(); };
  const xlsBlob = () => new Blob(["﻿<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'><head><meta charset='utf-8'></head><body>" + mxHtml() + "</body></html>"], { type: "application/vnd.ms-excel" });
  $("mxXls").onclick = () => download(xlsBlob(), `MaTran_${slug(st.mon)}${st.lop}.xls`);
  /* Word theo mẫu CV 7991: có số thứ tự câu nếu đã sinh đề */
  function posOfEx() {
    if (!ex) return null; const P = ex.mode === "goc" ? Gen.baseParts(ex) : Gen.partsOf(ex, 0); const pos = {};
    ["TN", "DS", "TLN"].forEach(L => P[L].forEach((x, i) => { const s = ex.slots[x.slot]; const k = s.dkey + "|" + L + "|" + s.muc; (pos[k] = pos[k] || []).push(i + 1); }));
    return pos;
  }
  const wordBlob = () => new Blob(["\ufeff" + Out.matrix7991(M, idx, names, info(), st.mon, posOfEx())], { type: "application/msword" });
  $("mxWord").onclick = () => { if (!Gen.totals(M, st.mon).n) return toast("Ma trận đang trống"); download(wordBlob(), `MaTran_DacTa_CV7991_${slug(st.mon)}${st.lop}.doc`); };

  /* ---------------------------------------------------------------- BƯỚC 3: thông tin */
  const S = window.SITE || {}; const D = S.de || {};
  const FIELDS = { iSo: D.so || "", iTruong: D.truong || "", iKy: "KIỂM TRA GIỮA KÌ I", iNam: D.namHoc || "", iPhut: 90, iLoai: "ĐỀ CHÍNH THỨC", oSoMa: 4, oMaDau: "101", oKieu: "tang", oSeed: 2026, oTrang: "4" };
  const saved = LS.get("rd-info", {});
  Object.entries(FIELDS).forEach(([id, d]) => { $(id).value = saved[id] != null ? saved[id] : d; $(id).addEventListener("input", saveInfo); $(id).addEventListener("change", saveInfo); });
  ["oTronCau", "oTronY", "oMoi"].forEach(id => { if (saved[id] != null) $(id).checked = saved[id]; $(id).onchange = saveInfo; });
  if (saved.mode) document.querySelector(`input[name=mode][value=${saved.mode}]`).checked = true;
  document.querySelectorAll("input[name=mode]").forEach(r => r.onchange = saveInfo);
  $("iMon").oninput = () => LS.set(key("imon"), $("iMon").value);
  function saveInfo() { const o = {}; Object.keys(FIELDS).forEach(id => o[id] = $(id).value); ["oTronCau", "oTronY", "oMoi"].forEach(id => o[id] = $(id).checked); o.mode = document.querySelector("input[name=mode]:checked").value; LS.set("rd-info", o); }
  const info = () => ({ so: $("iSo").value, truong: $("iTruong").value, ky: $("iKy").value, namHoc: $("iNam").value, monTen: $("iMon").value, lop: st.lop === TT ? 12 : st.lop, phut: $("iPhut").value, loaiDe: $("iLoai").value, chinhThuc: !!$("iLoai").value });
  $("go4").onclick = () => { st.step = 4; drawTabs(); };
  $("oTrang").addEventListener("change", () => { if (ex) { refit(); drawPreview(); } });
  $("btnHist").onclick = () => { if (confirm("Xoá lịch sử câu đã dùng của " + st.mon + " " + st.lop + "?")) { LS.set(key("used"), []); toast("Đã xoá lịch sử"); } };

  /* ---------------------------------------------------------------- BƯỚC 4: sinh đề */
  $("btnGen").onclick = () => {
    const t = Gen.totals(M, st.mon);
    if (!t.n) { $("genMsg").innerHTML = `<div class="note red">Ma trận đang trống. Hãy lập ma trận ở bước 2.</div>`; return; }
    const n = Math.max(1, Math.min(24, +$("oSoMa").value || 1));
    const seed = +$("oSeed").value || 2026;
    const mas = Gen.makeMas(n, $("oMaDau").value || "101", $("oKieu").value, seed);
    ex = Gen.generate(M, idx, { mode: document.querySelector("input[name=mode]:checked").value, mas, seed, tronCau: $("oTronCau").checked, tronY: $("oTronY").checked, uuTienMoi: $("oMoi").checked, used: new Set(LS.get(key("used"), [])) });
    const warn = [];
    const c = ct(); ["TN", "DS", "TLN"].forEach(L => { if (t[L] !== c[L]) warn.push(`${LN[L]}: ma trận có ${t[L]} câu (cấu trúc đặt ${c[L]})`); });
    if (ex.short.length) warn.push(`Ngân hàng thiếu câu cho ${ex.short.length} vị trí (đã bỏ qua) — giảm số câu ở ô báo đỏ.`);
    if (ex.mode === "khac") { const dupN = countDup(); if (dupN) warn.push(`Ngân hàng không đủ để mọi mã khác hẳn nhau: có ${dupN} câu lặp lại giữa các mã.`); }
    $("genMsg").innerHTML = warn.length ? `<div class="note">${warn.map(esc).join("<br>")}</div>` : `<div class="note green">Đã sinh ${mas.length} mã đề (${t.TN} – ${t.DS} – ${t.TLN} câu): ${mas.join(", ")}.</div>`;
    view = ex.mode === "goc" ? -1 : 0; $("genBox").classList.remove("hidden"); refit(); drawPreview();
  };
  function refit() {
    const target = +$("oTrang").value || 0; const I = info();
    const k = Out.fitLevel(v => Out.versionBlocks(Gen.partsOf(ex, v), I, ex.versions[v].ma), ex.versions.length, target);
    ex.lv = Out.LEVELS[k]; NHD.figScale = ex.lv.fig;
    const pages = Math.max(...ex.versions.map((V, v) => Out.paginate(Out.versionBlocks(Gen.partsOf(ex, v), I, V.ma), () => "", ex.lv).length));
    const txt = `Mỗi mã đề ${pages} trang · cỡ chữ ${String(ex.lv.fs).replace(".", ",")}pt · hình ${Math.round(ex.lv.fig * 100)}%.`;
    $("fitInfo") ? $("fitInfo").innerHTML = txt : $("genMsg").insertAdjacentHTML("beforeend", `<div class="note blue small" id="fitInfo">${txt}</div>`);
    if (target && pages > target) $("fitInfo").innerHTML = txt + ` <b>Vẫn vượt ${target} trang</b> — thầy giảm bớt câu có hình lớn hoặc chọn số trang lớn hơn.`;
  }
  /* đáp án cho ứng dụng chấm điện thoại */
  function baiCham() {
    const I = info(); const keys = {};
    ex.versions.forEach((V, i) => { const k = Gen.keys(ex, i); keys[V.ma] = { TN: k.TN, DS: k.DS, TLN: k.TLN.map(x => String(x).replace(/\$|\{|\}|\\,/g, "").trim()) }; });
    const t = Gen.totals(M, st.mon);
    // thông tin câu hỏi (mã câu, dạng, mức, thứ tự phương án) để phân tích kết quả sau khi chấm
    const meta = { lop: st.lop, dang: {}, ma: {} };
    ex.versions.forEach((V, i) => { const P = Gen.partsOf(ex, i); const o = {}; ["TN", "DS", "TLN"].forEach(L => o[L] = P[L].map(x => { if (x.q.dkey && !meta.dang[x.q.dkey]) meta.dang[x.q.dkey] = (idx.dang[x.q.dkey] || {}).ten || ""; const r = { id: x.q.id, dkey: x.q.dkey, muc: x.q.muc, slot: x.slot }; if (L !== "TLN") r.ord = x.order; return r; })); meta.ma[V.ma] = o; });
    return { ten: [I.ky, I.monTen + " " + lopLabel(st.lop)].filter(Boolean).join(" – "), mon: st.mon, lop: st.lop, preset: window.OMR ? OMR.pickPreset({ TN: t.TN, DS: t.DS, TLN: t.TLN }) : "", keys, meta };
  }
  /* lưu thông tin câu hỏi của đề đã ra trên máy này — trang Phân tích tự ghép với bài chấm từ điện thoại */
  function rememberDe() {
    if (!ex || !window.OMR || !OMR.Stats) return;
    try { const b = baiCham(); const sg = OMR.Stats.sig(b.keys); const H = LS.get("rd-de", []).filter(x => x.sig !== sg); H.unshift({ sig: sg, ten: b.ten, mon: b.mon, lop: b.lop, t: Date.now(), meta: b.meta }); LS.set("rd-de", H.slice(0, 60)); } catch (e) { console.warn(e); }
  }
  function drawKeyQR() {
    if (!window.OMR || !window.qrcode) return;
    const b = baiCham(); rememberDe(); const url = location.href.replace(/[^/]*$/, "") + "cham.html#k=" + encodeURIComponent(OMR.pack(b));
    try { const q = qrcode(0, "L"); q.addData(url); q.make(); $("keyQR").innerHTML = q.createSvgTag({ cellSize: 3, margin: 2 }); } catch (e) { $("keyQR").textContent = "Quá nhiều mã đề cho một mã QR — dùng file .json"; }
    const P = OMR.PRESETS[b.preset];
    $("keyInfo").innerHTML = `${Object.keys(b.keys).length} mã đề · dùng phiếu <b>${esc(P ? P.ten : "")}</b> (in ở trang “Phiếu & chấm”). Nếu đổi câu sau khi đã quét, hãy quét lại mã mới.`;
  }
  $("keyJson").onclick = () => { if (ex) download(new Blob([JSON.stringify(baiCham(), null, 1)], { type: "application/json" }), "DapAn_ChamDienThoai.json"); };
  function countDup() { const seen = new Map(); let d = 0; ex.versions.forEach(V => V.pick.forEach(q => { if (!q) return; if (seen.has(q.id)) d++; else seen.set(q.id, 1); })); return d; }
  const partsBase = () => Gen.baseParts(ex);
  function drawPreview() {
    const tabsV = [];
    if (ex.mode === "goc") tabsV.push([-1, "Đề gốc (có đáp án)"]);
    ex.versions.forEach((V, i) => tabsV.push([i, "Mã " + V.ma]));
    tabsV.push([-2, "Bảng đáp án"]);
    $("vtabs").innerHTML = tabsV.map(([v, t]) => `<button type="button" data-v="${v}" aria-selected="${v === view}">${t}</button>`).join("");
    $("vtabs").querySelectorAll("button").forEach(b => b.onclick = () => { view = +b.dataset.v; drawPreview(); });
    let pages;
    NHD.figScale = (ex.lv || Out.LEVELS[0]).fig; const LV = ex.lv;
    if (view === -1) pages = Out.paginate(Out.versionBlocks(partsBase(), info(), "GỐC", { dapan: true, swap: true }), (i, n) => `Trang ${i}/${n} – Đề gốc`, LV);
    else if (view === -2) pages = Out.paginate(Out.keysBlocks(allKeys(), st.mon), (i, n) => `Trang ${i}/${n} – Đáp án`, LV);
    else pages = Out.paginate(Out.versionBlocks(Gen.partsOf(ex, view), info(), ex.versions[view].ma, { swap: ex.mode === "khac" }), (i, n) => `Trang ${i}/${n} – Mã đề ${ex.versions[view].ma}`, LV);
    const pv = $("preview"); const y = pv.scrollTop; pv.innerHTML = ""; pages.forEach(p => pv.appendChild(p)); pv.scrollTop = y;
    drawKeyQR();
    pv.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { if (Gen.swap(ex, idx, Math.max(0, view), +b.dataset.swap, $("oSeed").value)) { refit(); drawPreview(); } else toast("Không còn câu nào khác cùng dạng, cùng mức độ"); });
  }
  const allKeys = () => ex.versions.map((V, i) => ({ ma: V.ma, keys: Gen.keys(ex, i) }));

  /* ---------------------------------------------------------------- xuất */
  const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "");
  function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  function loadScript(src) { return new Promise((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Không tải được " + src)); document.head.appendChild(s); }); }
  function markUsed() { const u = new Set(LS.get(key("used"), [])); ex.versions.forEach(V => V.pick.forEach(q => q && u.add(q.id))); LS.set(key("used"), [...u]); }
  function allPages(withSol) {
    const I = info(); const out = []; const LV = ex.lv; NHD.figScale = (LV || Out.LEVELS[0]).fig;
    ex.versions.forEach((V, i) => out.push({ name: "De_" + V.ma, pages: Out.paginate(Out.versionBlocks(Gen.partsOf(ex, i), I, V.ma), (p, n) => `Trang ${p}/${n} – Mã đề ${V.ma}`) }));
    out.push({ name: "DapAn", pages: Out.paginate(Out.keysBlocks(allKeys(), st.mon), (p, n) => `Trang ${p}/${n} – Đáp án`, LV) });
    if (withSol) ex.versions.forEach((V, i) => out.push({ name: "LoiGiai_" + V.ma, pages: Out.paginate(Out.versionBlocks(Gen.partsOf(ex, i), I, V.ma, { dapan: true, loigiai: true }), (p, n) => `Trang ${p}/${n} – Lời giải mã ${V.ma}`, LV) }));
    return out;
  }
  /* ---- xuất Word: dựng HTML từ các khối đã có rồi đổi sang .docx (assets/docx.js) */
  function blocksHtml(blocks, npages) { return `<div class="ex docx-ex">${blocks.map(b => b.html).join("")}</div>`.replace(/<span class="npages">[^<]*<\/span>/g, npages || "…"); }
  async function toDocx(html, opt) {
    const host = document.createElement("div"); host.className = "paper"; host.style.cssText = "position:fixed;left:-30000px;top:0;width:680px;background:#fff;padding:0"; host.innerHTML = html; document.body.appendChild(host);
    try { return await Docx.fromHtml(host, Object.assign({ size: 12, margins: { top: 1.5, bottom: 1.5, left: 2, right: 1.5 } }, opt || {})); } finally { host.remove(); }
  }
  async function zipDocx(z, I, withSol, fill) {
    await loadScript("assets/lib/html2canvas.min.js"); await Out.waitFonts();
    const folder = `De_${slug(st.mon)}${st.lop}_${slug(I.ky || "KiemTra")}_Word`; const F = z.folder(folder);
    const LV = ex.lv; NHD.figScale = (LV || Out.LEVELS[0]).fig; const n = ex.versions.length; let done = 0; const step = () => { done++; fill.style.width = (5 + 90 * done / (2 * n + 3)).toFixed(0) + "%"; };
    let all = "";
    for (let i = 0; i < n; i++) {
      const V = ex.versions[i]; const blocks = Out.versionBlocks(Gen.partsOf(ex, i), I, V.ma); const np = Out.paginate(blocks, () => "", LV).length;
      const h = blocksHtml(blocks, np); $("xprogT").textContent = `Đang tạo Word mã đề ${V.ma}…`;
      F.file(`De_${V.ma}.docx`, await toDocx(h, { title: `Đề ${V.ma}` })); step(); all += h + '<div class="pagebreak"></div>';
    }
    const kh = blocksHtml(Out.keysBlocks(allKeys(), st.mon)); $("xprogT").textContent = "Đang tạo bảng đáp án…";
    F.file("DapAn_TongHop.docx", await toDocx(kh, { title: "Đáp án" })); step(); all += kh;
    if (withSol) {
      let lg = "";
      for (let i = 0; i < n; i++) { const V = ex.versions[i]; $("xprogT").textContent = `Đang tạo lời giải mã ${V.ma}…`; lg += blocksHtml(Out.versionBlocks(Gen.partsOf(ex, i), I, V.ma, { dapan: true, loigiai: true })) + (i < n - 1 ? '<div class="pagebreak"></div>' : ""); step(); }
      F.file("LoiGiai_ChiTiet.docx", await toDocx(lg, { title: "Lời giải chi tiết" })); all += '<div class="pagebreak"></div>' + lg;
    }
    if (ex.mode === "goc") F.file("DeGoc_KemDapAn.docx", await toDocx(blocksHtml(Out.versionBlocks(partsBase(), I, "GỐC", { dapan: true, loigiai: withSol })), { title: "Đề gốc" }));
    if ($("xMT").checked && Gen.totals(M, st.mon).n) {
      $("xprogT").textContent = "Đang tạo ma trận, bản đặc tả…";
      const mh = `<div data-sect="landscape">${Out.matrix7991(M, idx, names, I, st.mon, posOfEx(), true)}</div>`;
      F.file("MaTran_DacTa_CV7991.docx", await toDocx(mh, { title: "Ma trận và bản đặc tả", orientation: "landscape", size: 11, margins: { top: 1.2, bottom: 1.2, left: 1.2, right: 1.2 } }));
      all += '<div class="pagebreak"></div>' + mh;
    }
    step(); $("xprogT").textContent = "Đang tạo file gộp…";
    F.file("TatCa_TrongMotFile.docx", await toDocx(all, { title: I.ky || "Đề kiểm tra" }));
    if (window.OMR) F.file("DapAn_ChamDienThoai.json", JSON.stringify(baiCham(), null, 1));
    F.file("HUONG_DAN.txt", ["GÓI ĐỀ KIỂM TRA (WORD) — tạo bởi trang Học cùng Thầy Hiếu", "", "De_<mã>.docx — từng mã đề; DapAn_TongHop.docx — bảng đáp án; LoiGiai_ChiTiet.docx — lời giải; MaTran_DacTa_CV7991.docx — ma trận + bản đặc tả (trang ngang); TatCa_TrongMotFile.docx — gộp tất cả.", "Công thức là Equation của Word (Cambria Math): bấm đúp để sửa, không cần MathType. Nếu Word hỏi chuyển đổi, chọn Giữ nguyên.", "Hình vẽ là ảnh PNG nét cao; muốn sửa hình, dùng file TeX trong gói LaTeX."].join("\n"));
  }
  $("btnPrint").onclick = async () => {
    if (!ex) return; await Out.waitFonts();
    const P = allPages(false); markUsed();
    Out.printPages(P.flatMap(x => x.pages), "De kiem tra");
  };
  $("btnZip").onclick = async () => {
    if (!ex) return;
    const btn = $("btnZip"); btn.disabled = true; const bar = $("xprog"); bar.classList.remove("hidden"); const fill = bar.firstElementChild; fill.style.width = "3%";
    try {
      const I = info(); const z = new JSZip(); const kind = document.querySelector("input[name=xuat]:checked").value; const withPdf = kind === "pdf"; const withSol = $("xLG").checked;
      if (kind === "docx") { await zipDocx(z, I, withSol, fill); const blob = await z.generateAsync({ type: "blob", compression: "DEFLATE" }); fill.style.width = "100%"; download(blob, `De_${slug(st.mon)}${st.lop}_${slug(I.ky || "KiemTra")}_Word.zip`); markUsed(); $("xprogT").textContent = "Xong! Gói Word đã được tải về."; btn.disabled = false; setTimeout(() => bar.classList.add("hidden"), 1500); return; }
      const folder = `De_${slug(st.mon)}${st.lop}_${slug(I.ky || "KiemTra")}`;
      const T = z.folder(folder + "/TeX");
      const opt = {};
      ex.versions.forEach((V, i) => T.file(`De_${V.ma}.tex`, Out.doc(I, Out.versionTex(Gen.partsOf(ex, i), I, V.ma, opt), ex.lv)));
      const keysT = Out.keysTex(allKeys(), st.mon);
      T.file("DapAn_TongHop.tex", Out.doc(I, keysT, ex.lv));
      T.file("TatCaMaDe_KemDapAn.tex", Out.doc(I, ex.versions.map((V, i) => Out.versionTex(Gen.partsOf(ex, i), I, V.ma, opt)).join("\n") + keysT, ex.lv));
      if (withSol) T.file("LoiGiai_ChiTiet.tex", Out.doc(I, ex.versions.map((V, i) => Out.versionTex(Gen.partsOf(ex, i), I, V.ma, { dapan: true, loigiai: true })).join("\n"), ex.lv));
      if (ex.mode === "goc") T.file("DeGoc_KemDapAn.tex", Out.doc(I, Out.versionTex(partsBase(), I, "GOC", { dapan: true, loigiai: withSol }), ex.lv));
      if ($("xMT").checked) { z.file(folder + `/MaTran_DacTa.xls`, xlsBlob()); z.file(folder + `/MaTran_DacTa_CV7991.doc`, wordBlob()); }
      if (window.OMR) z.file(folder + "/DapAn_ChamDienThoai.json", JSON.stringify(baiCham(), null, 1));
      z.file(folder + "/HUONG_DAN.txt", [
        "GÓI ĐỀ KIỂM TRA — tạo bởi trang Học cùng Thầy Hiếu", "",
        "Mã đề: " + ex.versions.map(V => V.ma).join(", "),
        "Cách sinh: " + (ex.mode === "goc" ? "một đề gốc trộn thành nhiều mã" : "mỗi mã một bộ câu khác (cùng dạng, cùng mức độ)"), "",
        "Thư mục TeX/:",
        "  De_<mã>.tex                 — từng mã đề để in cho học sinh",
        "  TatCaMaDe_KemDapAn.tex      — tất cả mã đề, bảng đáp án tổng hợp ở cuối",
        "  DapAn_TongHop.tex           — bảng đáp án tổng hợp các mã",
        withSol ? "  LoiGiai_ChiTiet.tex         — đáp án và lời giải từng mã" : "",
        ex.mode === "goc" ? "  DeGoc_KemDapAn.tex          — đề gốc (chưa trộn) có đáp án" : "", "",
        "Biên dịch: mở bằng VS Code (LaTeX Workshop) hoặc TeXstudio, chọn XeLaTeX, biên dịch 2 lần để số trang hiện đúng.",
        "Cần các gói: fontspec, amsmath, tikz, tkz-tab, fancyhdr (có sẵn trong TeX Live / MacTeX).",
        withPdf ? "\nThư mục PDF/: bản PDF tạo trực tiếp trên web (để in nhanh). Bản PDF biên dịch từ TeX sẽ nét hơn." : ""
      ].filter(x => x !== "").join("\n"));
      fill.style.width = "10%";
      if (withPdf) {
        $("xprogT").textContent = "Đang tải thư viện tạo PDF…";
        await loadScript("assets/lib/html2canvas.min.js"); await loadScript("assets/lib/jspdf.umd.min.js"); await Out.waitFonts();
        const P = allPages(withSol); const total = P.reduce((a, x) => a + x.pages.length, 0); let done = 0;
        const PDF = z.folder(folder + "/PDF");
        for (const x of P) {
          const blob = await Out.pagesToPdf(x.pages, () => { done++; fill.style.width = (10 + 85 * done / total).toFixed(0) + "%"; $("xprogT").textContent = `Đang tạo PDF: trang ${done}/${total}…`; });
          PDF.file(x.name + ".pdf", blob);
        }
      }
      $("xprogT").textContent = "Đang nén…";
      const blob = await z.generateAsync({ type: "blob", compression: "DEFLATE" });
      fill.style.width = "100%"; download(blob, folder + ".zip"); markUsed();
      $("xprogT").textContent = "Xong! File " + folder + ".zip đã được tải về.";
    } catch (e) { console.error(e); $("xprogT").textContent = "Lỗi: " + (e.message || e); }
    btn.disabled = false; setTimeout(() => bar.classList.add("hidden"), 1500);
  };

  /* ---------------------------------------------------------------- khởi động */
  /* đề ôn tập theo chỗ yếu: trang Phân tích mở rade.html#ontap={mon,lop,dang:[dkey…],ct,ten,soMa} */
  async function ontap(plan) {
    if (MON.some(x => x[0] === plan.mon)) st.mon = plan.mon;
    if (plan.lop) st.lop = plan.lop === TT ? TT : +plan.lop;
    await switchBank();
    const box = $("ontapNote");
    if (!bank.questions.length) { box.innerHTML = `<div class="note red"><b>Đề ôn tập theo chỗ yếu:</b> máy này chưa có ngân hàng ${esc(st.mon)} lớp ${lopLabel(st.lop)}. Thầy mở trang Phân tích trên máy tính đã đăng ngân hàng (hoặc đăng ngân hàng ở bước 1 rồi bấm lại nút “Sinh đề ôn tập”).</div>`; st.step = 1; drawTabs(); return; }
    const dk = (plan.dang || []).filter(k => idx.dang[k]);
    if (!dk.length) { box.innerHTML = `<div class="note red">Ngân hàng trên máy này không có các dạng cần ôn (${esc((plan.dang || []).join(", "))}).</div>`; return; }
    LS.set(key("mt-truoc"), { M, scope, ct: ct() });
    const c = Object.assign(Gen.cauTrucChuan(st.mon), plan.ct || {});
    $("cTN").value = c.TN; $("cDS").value = c.DS; $("cTLN").value = c.TLN;
    const lv = idx.levels; const P = { NB: 35, TH: 40, VD: 20, VDC: 5 }; const pp = {}; lv.forEach(m => pp[m] = P[m]);
    const r = Gen.suggest(idx, dk, c, pp, Date.now());
    M = r.M; scope = [...new Set(dk.map(k => idx.dang[k].chuong))]; saveM(); drawScope(); drawMatrix();
    $("iKy").value = plan.ten || "ĐỀ ÔN TẬP"; $("iLoai").value = "ĐỀ ÔN TẬP"; $("oSoMa").value = Math.max(1, +plan.soMa || 1); $("oMoi").checked = true; $("xLG").checked = true;
    document.querySelector("input[name=mode][value=khac]") && (document.querySelector("input[name=mode][value=khac]").checked = true);
    st.step = 4; drawTabs(); $("btnGen").click();
    box.innerHTML = `<div class="note blue"><b>Đề ôn tập theo chỗ yếu</b> — tập trung vào ${dk.length} dạng lớp làm chưa tốt: ${dk.map(k => `<b>${esc(k.replace(/^C\d+-B\d+-/, ""))}</b> ${idx.dang[k].ten ? NHD.texToHtml(idx.dang[k].ten) : ""}`).join("; ")}. Ma trận đã được lập tự động (xem bước 2), ưu tiên câu chưa dùng trong các đề trước. Thầy bấm <b>Tải gói .zip</b> để lấy đề, đáp án và lời giải.${r.short.length ? ` <span style="color:#b0163d">Ngân hàng thiếu câu cho ${r.short.length} vị trí.</span>` : ""}
      <div class="row" style="margin-top:6px"><button class="btn ghost sm" id="ontapUndo">↩ Trả lại ma trận trước đó</button></div></div>`;
    $("ontapUndo").onclick = () => { const o = LS.get(key("mt-truoc"), null); if (!o) return; M = o.M; scope = o.scope; $("cTN").value = o.ct.TN; $("cDS").value = o.ct.DS; $("cTLN").value = o.ct.TLN; saveM(); drawScope(); drawMatrix(); box.innerHTML = ""; toast("Đã trả lại ma trận trước đó"); };
  }
  (async () => {
    await refreshCounts(); if (!MON.some(x => x[0] === st.mon)) st.mon = "Toán";
    const m = location.hash.match(/^#ontap=(.+)$/);
    if (m) { let plan = null; try { plan = JSON.parse(decodeURIComponent(m[1])); } catch (e) {} history.replaceState(null, "", location.pathname); if (plan) return ontap(plan); }
    await switchBank();
  })();
})();
