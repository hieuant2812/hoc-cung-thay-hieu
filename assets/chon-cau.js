/* chon-cau.js — bộ chọn câu hỏi từ ngân hàng trên máy (dùng cho Trình chiếu, Phiếu học tập, Bộ luyện tập)
   ChonCau.mount(el, {key, multiDang:true, soCau:true, onReady(api)})
   api.state() → {mon, lop, dang:[dkey], muc:[...], loai:[...], n}; api.pool() → câu hỏi thoả điều kiện; api.pick(n, seed) */
(function (G) {
  "use strict";
  const ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const MON = { "Toán": [10, 11, 12], "Vật lí": [10, 11, 12], "Hoá học": [10, 11, 12] };
  const LVN = { NB: "Biết", TH: "Hiểu", VD: "Vận dụng", VDC: "VD cao" }, LN = { TN: "Trắc nghiệm", DS: "Đúng/Sai", TLN: "Trả lời ngắn" };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const tenChuong = (mon, lop, c) => { const T = ((G.CHUONG_TRINH || {})[mon] || {})[lop] || {}; return "Chương " + (ROM[c] || c) + (T[c] ? ". " + T[c][0] : ""); };

  function mount(el, opt) {
    opt = opt || {};
    const K = "cc-" + (opt.key || "x");
    const st = Object.assign({ mon: "Toán", lop: 12, dang: [], muc: ["NB", "TH", "VD", "VDC"], loai: ["TN", "DS", "TLN"], n: opt.n || 10 }, LS.get(K, {}), opt.preset || {});
    let bank = { questions: [], dang: {} }, dangs = [], counts = {};
    el.innerHTML = `<div class="cc" style="display:grid;gap:10px">
      <div class="row" style="gap:8px;flex-wrap:wrap;align-items:end">
        <label class="f">Môn<select data-k="mon">${Object.keys(MON).map(m => `<option>${m}</option>`).join("")}</select></label>
        <label class="f">Lớp<select data-k="lop"></select></label>
        ${opt.soCau === false ? "" : `<label class="f" style="width:96px">Số câu<input type="number" min="1" max="200" data-k="n"></label>`}
        <span class="small muted" data-i></span>
      </div>
      <div class="row" style="gap:14px;flex-wrap:wrap" data-ml></div>
      <div data-d style="max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:8px 10px;background:#fff"></div>
    </div>`;
    const $ = s => el.querySelector(s);
    const save = () => LS.set(K, { mon: st.mon, lop: st.lop, dang: st.dang, muc: st.muc, loai: st.loai, n: st.n });
    async function load() {
      try { counts = await NHD.Store.counts(); } catch (e) { counts = {}; }
      $("[data-k=mon]").value = st.mon;
      $("[data-k=lop]").innerHTML = MON[st.mon].map(l => `<option value="${l}"${l === +st.lop ? " selected" : ""}>Lớp ${l} (${(counts[st.mon + "|" + l] || 0).toLocaleString("vi-VN")} câu)</option>`).join("");
      if ($("[data-k=n]")) $("[data-k=n]").value = st.n;
      bank = await NHD.Store.load(st.mon, +st.lop);
      const by = {}; bank.questions.forEach(q => { const d = by[q.dkey] = by[q.dkey] || { dkey: q.dkey, chuong: q.chuong, bai: q.bai, so: q.dangSo, ten: bank.dang[q.dkey] || "", n: 0 }; d.n++; });
      dangs = Object.values(by).sort((a, b) => a.chuong - b.chuong || a.bai - b.bai || a.so - b.so);
      st.dang = st.dang.filter(k => by[k]);
      draw(); opt.onChange && opt.onChange(api);
    }
    function draw() {
      $("[data-ml]").innerHTML = `<span><b class="small">Mức độ:</b> ${["NB", "TH", "VD", "VDC"].map(m => `<label class="chk"><input type="checkbox" data-m="${m}"${st.muc.includes(m) ? " checked" : ""}> ${LVN[m]}</label>`).join("")}</span>
        <span><b class="small">Loại câu:</b> ${["TN", "DS", "TLN"].map(L => `<label class="chk"><input type="checkbox" data-l="${L}"${st.loai.includes(L) ? " checked" : ""}> ${LN[L]}</label>`).join("")}</span>`;
      if (!dangs.length) { $("[data-d]").innerHTML = `<div class="muted small">Máy này chưa có ngân hàng ${esc(st.mon)} lớp ${st.lop}. Thầy đăng ngân hàng ở trang <a href="rade.html">Ra đề</a> (bước 1).</div>`; info(); return; }
      const byC = {}; dangs.forEach(d => (byC[d.chuong] = byC[d.chuong] || []).push(d));
      $("[data-d]").innerHTML = `<div class="row small" style="gap:8px;margin-bottom:6px"><b>Dạng toán</b> <a href="#" data-all>chọn tất cả</a> · <a href="#" data-none>bỏ chọn</a> <span class="muted">(không chọn dạng nào = lấy mọi dạng)</span></div>` +
        Object.entries(byC).map(([c, ds]) => `<details${ds.some(d => st.dang.includes(d.dkey)) ? " open" : ""}><summary><label class="chk" onclick="event.stopPropagation()"><input type="checkbox" data-c="${c}"${ds.every(d => st.dang.includes(d.dkey)) ? " checked" : ""}> <b>${esc(tenChuong(st.mon, st.lop, +c))}</b></label> <span class="muted small">${ds.length} dạng</span></summary>
          <div style="padding-left:22px">${ds.map(d => `<label class="chk" style="display:flex"><input type="checkbox" data-dk="${d.dkey}"${st.dang.includes(d.dkey) ? " checked" : ""}> <span><span class="muted small">${d.dkey.replace(/^C\d+-B\d+-/, "")}</span> ${d.ten ? NHD.texToHtml(d.ten) : d.dkey} <span class="muted small">(${d.n})</span></span></label>`).join("")}</div></details>`).join("");
      el.querySelectorAll("[data-m]").forEach(i => i.onchange = () => { st.muc = [...el.querySelectorAll("[data-m]:checked")].map(x => x.dataset.m); save(); info(); fire(); });
      el.querySelectorAll("[data-l]").forEach(i => i.onchange = () => { st.loai = [...el.querySelectorAll("[data-l]:checked")].map(x => x.dataset.l); save(); info(); fire(); });
      el.querySelectorAll("[data-dk]").forEach(i => i.onchange = () => { st.dang = [...el.querySelectorAll("[data-dk]:checked")].map(x => x.dataset.dk); save(); draw(); fire(); });
      el.querySelectorAll("[data-c]").forEach(i => i.onchange = () => { const ks = byC[i.dataset.c].map(d => d.dkey); st.dang = i.checked ? [...new Set(st.dang.concat(ks))] : st.dang.filter(k => !ks.includes(k)); save(); draw(); fire(); });
      $("[data-all]").onclick = e => { e.preventDefault(); st.dang = dangs.map(d => d.dkey); save(); draw(); fire(); };
      $("[data-none]").onclick = e => { e.preventDefault(); st.dang = []; save(); draw(); fire(); };
      info();
    }
    const fire = () => opt.onChange && opt.onChange(api);
    const pool = () => bank.questions.filter(q => (!st.dang.length || st.dang.includes(q.dkey)) && st.muc.includes(q.muc) && st.loai.includes(q.loai));
    function info() { $("[data-i]").textContent = dangs.length ? `${pool().length.toLocaleString("vi-VN")} câu phù hợp` : ""; }
    $("[data-k=mon]").onchange = e => { st.mon = e.target.value; st.dang = []; save(); load(); };
    $("[data-k=lop]").onchange = e => { st.lop = +e.target.value; st.dang = []; save(); load(); };
    if ($("[data-k=n]")) $("[data-k=n]").oninput = e => { st.n = Math.max(1, +e.target.value || 1); save(); };
    /* chọn n câu, rải đều các dạng đã chọn, thứ tự TN → DS → TLN */
    function pick(n, seed) {
      const R = NHD.rng(NHD.hash("cc|" + (seed == null ? Date.now() : seed))); const P = pool();
      const by = {}; P.forEach(q => (by[q.dkey] = by[q.dkey] || []).push(q));
      const keys = NHD.shuffle(Object.keys(by), R); keys.forEach(k => by[k] = NHD.shuffle(by[k], R));
      const out = []; let i = 0; while (out.length < Math.min(n, P.length) && i < 99999) { const k = keys[i % keys.length]; const q = by[k].pop(); if (q) out.push(q); i++; if (keys.every(k => !by[k].length)) break; }
      const ord = { TN: 0, DS: 1, TLN: 2 }; return out.sort((a, b) => ord[a.loai] - ord[b.loai]);
    }
    const api = { state: () => Object.assign({}, st), pool, pick, bank: () => bank, dangs: () => dangs, setPreset: p => { Object.assign(st, p); save(); return load(); }, reload: load };
    load();
    return api;
  }
  G.ChonCau = { mount, tenChuong };
})(window);
