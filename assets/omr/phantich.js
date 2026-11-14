/* omr/phantich.js — phân tích kết quả sau khi chấm phiếu
   Dùng chung cho ứng dụng chấm trên điện thoại (cham.html) và trang Phân tích trên máy tính (phantich.html).
   bai = {id, ten, mon, lop?, lopHoc?, keys:{ma:{TN,DS,TLN}}, meta?:{lop, dang:{dkey:ten}, ma:{ma:{TN:[{id,dkey,muc,slot,ord}],DS:[…],TLN:[…]}}}}
   kết quả = [{sbd, ma, diem, raw, max, TN:[…], DS:[…], TLN:[…]}] */
(function (G) {
  "use strict";
  const OMR = G.OMR = G.OMR || {};
  const L3 = ["TN", "DS", "TLN"], ROMAN = { TN: "I", DS: "II", TLN: "III" };
  const MUCN = { NB: "Nhận biết", TH: "Thông hiểu", VD: "Vận dụng", VDC: "Vận dụng cao" };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const f1 = x => String(Math.round(x * 10) / 10).replace(".", ",");
  const f2 = x => String(Math.round(x * 100) / 100).replace(".", ",");
  const pc = x => Math.round(x * 100) + "%";
  const norm = s => (OMR.normNum ? OMR.normNum(s) : String(s || "").trim());

  /* chữ kí bộ đáp án — để ghép thông tin câu hỏi (lưu ở trang Ra đề) với bài đã chấm */
  function sig(keys) {
    const s = Object.keys(keys || {}).sort().map(m => m + ":" + (keys[m].TN || []).join("") + "/" + (keys[m].DS || []).join(",") + "/" + (keys[m].TLN || []).map(x => norm(x)).join("_")).join("|");
    let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36) + "-" + s.length;
  }
  /* tìm thông tin câu hỏi đã lưu khi xuất đề trên máy này */
  function findMeta(bai) {
    if (bai.meta) return bai.meta;
    try { const H = JSON.parse(localStorage.getItem("rd-de") || "[]"); const s = sig(bai.keys); const h = H.find(x => x.sig === s); return h ? h.meta : null; } catch (e) { return null; }
  }
  /* gắn thông tin câu hỏi từ một file đáp án .json vào bài (khớp theo đáp án) */
  function attachMeta(bai, o) {
    if (!o || !o.meta) throw new Error("File này không có thông tin câu hỏi (cần file DapAn_ChamDienThoai.json xuất từ trang Ra đề bản mới).");
    const ok = Object.keys(bai.keys).every(m => o.keys && o.keys[m] && JSON.stringify(o.keys[m].TN) === JSON.stringify(bai.keys[m].TN) && JSON.stringify(o.keys[m].DS) === JSON.stringify(bai.keys[m].DS));
    if (!ok) throw new Error("Đáp án trong file không khớp với bài đang chọn.");
    bai.meta = o.meta; if (o.lop && !bai.lop) bai.lop = o.lop; return bai;
  }

  /* ---------------------------------------------------------------- tính toán */
  function analyze(bai, results, opt) {
    opt = opt || {};
    const meta = opt.meta !== undefined ? opt.meta : findMeta(bai);
    const mas = Object.keys(bai.keys).sort();
    const R = (results || []).filter(r => bai.keys[r.ma]);
    const items = {}, order = [];
    const itemOf = (r, L, p) => {
      const M = meta && meta.ma && meta.ma[r.ma] && meta.ma[r.ma][L] && meta.ma[r.ma][L][p];
      const k = M ? (M.id || L + "#" + M.slot) : (mas.length > 1 ? r.ma + "|" : "") + L + "|" + p;
      let it = items[k];
      if (!it) {
        it = items[k] = { k, L, id: M ? M.id : "", dkey: M ? M.dkey : "", muc: M ? M.muc : "", pos: {}, n: 0, ok: 0, units: 0, okUnits: 0, blank: 0, full: 0, choice: {}, stm: [0, 0, 0, 0], stmN: 0, ans: {} };
        order.push(it);
      }
      if (it.pos[r.ma] == null) it.pos[r.ma] = { p, ord: M && M.ord };
      return { it, M };
    };
    R.forEach(r => {
      const key = bai.keys[r.ma];
      L3.forEach(L => (key[L] || []).forEach((k, p) => {
        const { it, M } = itemOf(r, L, p); it.n++;
        if (L === "TN") {
          const a = (r.TN || [])[p] || "";
          if (!a) it.blank++;
          const ok = a === k; if (ok) it.ok++; it.units++; it.okUnits += ok ? 1 : 0;
          if (a) { const ord = M && M.ord; const o = ord ? ord["ABCD".indexOf(a)] : "ABCD".indexOf(a); it.choice[o] = (it.choice[o] || 0) + 1; }
          if (it.right == null) it.right = M && M.ord ? M.ord["ABCD".indexOf(k)] : "ABCD".indexOf(k);
        } else if (L === "DS") {
          const a = (r.DS || [])[p] || ""; let c = 0; if (!a.replace(/[^ĐS]/g, "")) it.blank++;
          for (let j = 0; j < 4; j++) { const good = a[j] && a[j] === k[j]; if (good) c++; const oj = M && M.ord ? M.ord[j] : j; if (!good) it.stm[oj]++; }
          it.stmN++; it.units += 4; it.okUnits += c; if (c === 4) { it.ok++; it.full++; }
        } else {
          const a = (r.TLN || [])[p] || ""; if (!norm(a)) it.blank++;
          const ok = norm(a) !== "" && norm(a) === norm(k); if (ok) it.ok++; it.units++; it.okUnits += ok ? 1 : 0;
          if (!ok && norm(a)) it.ans[a] = (it.ans[a] || 0) + 1;
          it.da = k;
        }
      }));
    });
    order.forEach(it => { it.rate = it.units ? it.okUnits / it.units : 0; it.label = label(it, mas); });
    // sắp theo vị trí ở mã đầu tiên
    const pkey = it => { const m = mas.find(x => it.pos[x]) || ""; return L3.indexOf(it.L) * 1e4 + mas.indexOf(m) * 1e3 + (it.pos[m] ? it.pos[m].p : 0); };
    order.sort((a, b) => pkey(a) - pkey(b));

    // điểm
    const D = R.map(r => +r.diem || 0).sort((a, b) => a - b);
    const n = D.length, mean = n ? D.reduce((a, b) => a + b, 0) / n : 0;
    const med = n ? (n % 2 ? D[(n - 1) / 2] : (D[n / 2 - 1] + D[n / 2]) / 2) : 0;
    const sd = n > 1 ? Math.sqrt(D.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
    const hist = Array(10).fill(0); D.forEach(d => hist[Math.min(9, Math.floor(d + 1e-9))]++);
    // theo dạng và mức (đơn vị: 1 câu TN/TLN, 1 ý Đ/S)
    const byD = {}, byM = {}, byL = {};
    order.forEach(it => {
      const add = (o, k) => { if (!k) return; const x = o[k] = o[k] || { k, units: 0, ok: 0, items: 0 }; x.units += it.units; x.ok += it.okUnits; x.items++; };
      add(byD, it.dkey); add(byM, it.muc); add(byL, it.L);
    });
    [byD, byM, byL].forEach(o => Object.values(o).forEach(x => x.rate = x.units ? x.ok / x.units : 0));
    const dangs = Object.values(byD).sort((a, b) => a.rate - b.rate);
    // lỗi sai chung
    const errs = [];
    order.forEach(it => {
      if (!it.n) return;
      if (it.L === "TN") {
        const w = Object.entries(it.choice).filter(([o]) => +o !== it.right).sort((a, b) => b[1] - a[1])[0];
        if (w && w[1] >= Math.max(3, .25 * it.n)) errs.push({ it, kind: "TN", share: w[1] / it.n, cnt: w[1], opt: +w[0], txt: `${w[1]}/${it.n} em (${pc(w[1] / it.n)}) chọn ${optLetter(it, +w[0], mas)} thay vì ${optLetter(it, it.right, mas)}` });
      } else if (it.L === "DS") {
        it.stm.forEach((c, j) => { if (it.stmN && c >= Math.max(3, .5 * it.stmN)) errs.push({ it, kind: "DS", share: c / it.stmN, cnt: c, stm: j, txt: `${c}/${it.stmN} em (${pc(c / it.stmN)}) xác định sai ý ${"abcd"[j]}${meta ? " (theo thứ tự trong ngân hàng)" : ""}` }); });
      } else {
        const w = Object.entries(it.ans).sort((a, b) => b[1] - a[1])[0];
        if (w && w[1] >= Math.max(3, .2 * it.n)) errs.push({ it, kind: "TLN", share: w[1] / it.n, cnt: w[1], txt: `${w[1]}/${it.n} em (${pc(w[1] / it.n)}) cùng ghi “${esc(w[0])}”, đáp số đúng là ${esc(it.da)}` });
      }
    });
    errs.sort((a, b) => b.share - a.share);
    return { bai, meta, mas, n, mean, med, sd, min: n ? D[0] : 0, max: n ? D[n - 1] : 0, ge5: D.filter(d => d >= 5).length, ge8: D.filter(d => d >= 8).length, lt35: D.filter(d => d < 3.5).length, hist, items: order, dangs, byM, byL, errs, R };
  }
  function label(it, mas) {
    const ps = mas.filter(m => it.pos[m]).map(m => ({ m, s: ROMAN[it.L] + "." + (it.pos[m].p + 1) }));
    if (mas.length === 1) return "Câu " + ps[0].s;
    const same = ps.every(x => x.s === ps[0].s);
    return same && ps.length === mas.length ? "Câu " + ps[0].s : ps.map(x => x.m + ": " + x.s).join(" · ");
  }
  function optLetter(it, o, mas) { // phương án gốc o → chữ cái ở mã đầu tiên có câu này
    const m = mas.find(x => it.pos[x]); const ord = it.pos[m] && it.pos[m].ord;
    const l = ord ? "ABCD"[ord.indexOf(o)] : "ABCD"[o];
    return mas.length > 1 && ord ? `<b>${l}</b> (mã ${m})` : `<b>${l}</b>`;
  }

  /* dạng yếu → kế hoạch đề ôn tập */
  function weakPlan(A, k, minUnits) {
    const ds = A.dangs.filter(d => d.units >= (minUnits || 1));
    const weak = ds.filter(d => d.rate < .7).slice(0, k || 5);
    return (weak.length ? weak : ds.slice(0, Math.min(k || 5, ds.length))).map(d => d.k);
  }
  function ontapUrl(A, opt) {
    const dk = weakPlan(A, opt.soDang, 2);
    const lop = (A.meta && A.meta.lop) || A.bai.lop || "";
    const o = { mon: A.bai.mon || "Toán", lop, dang: dk, ct: opt.ct, ten: "ÔN TẬP – " + (A.bai.ten || "").replace(/^KIỂM TRA\s*/i, ""), soMa: opt.soMa || 1 };
    return "rade.html#ontap=" + encodeURIComponent(JSON.stringify(o));
  }

  /* ---------------------------------------------------------------- hiển thị */
  const CSS = `
  .pt{display:grid;gap:14px}
  .pt h3{margin:4px 0 6px;font-size:17px}
  .pt .box{background:#fff;border:1px solid var(--line,#e3e6ee);border-radius:16px;padding:12px 14px}
  .pt .kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
  .pt .kpi div{background:#f6f8fc;border-radius:12px;padding:8px 10px}
  .pt .kpi b{display:block;font:800 22px/1.1 var(--font-h,inherit);color:#1d2742}
  .pt .kpi span{font-size:12.5px;color:#667}
  .pt .hist{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;align-items:end;height:150px;margin-top:6px}
  .pt .hist .c{display:grid;align-content:end;justify-items:center;height:100%;font-size:11.5px;color:#556}
  .pt .hist .c i{display:block;width:100%;border-radius:6px 6px 0 0;background:linear-gradient(#ff8a65,#ff5d73);min-height:2px}
  .pt .hist .c.g i{background:linear-gradient(#5ad18b,#19a64a)}
  .pt .hist .c.m i{background:linear-gradient(#ffd166,#f3a712)}
  .pt .hx{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;font-size:11px;color:#778;text-align:center;border-top:1px solid #dde;padding-top:3px}
  .pt .bars{display:grid;gap:6px}
  .pt .br{display:grid;grid-template-columns:minmax(120px,38%) 1fr 48px;gap:8px;align-items:center;font-size:13.5px}
  .pt .br .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pt .br .tr{height:14px;background:#eef1f7;border-radius:8px;overflow:hidden}
  .pt .br .tr i{display:block;height:100%;border-radius:8px}
  .pt .br .v{text-align:right;font-weight:700}
  .pt .lo i{background:#e0234e}.pt .mi i{background:#f3a712}.pt .hi i{background:#19a64a}
  .pt table{width:100%;border-collapse:collapse;font-size:13px}
  .pt th,.pt td{padding:5px 6px;border-bottom:1px solid #eef0f5;text-align:left;vertical-align:top}
  .pt th{background:#fbf6ee;font-weight:700;position:sticky;top:0}
  .pt .tag{display:inline-block;padding:1px 6px;border-radius:6px;font-size:11.5px;font-weight:700;background:#eef1f7}
  .pt .tag.NB{background:#e3f2ff;color:#1b5fb3}.pt .tag.TH{background:#e4f7ec;color:#14632f}.pt .tag.VD{background:#fff2cc;color:#7a5a00}.pt .tag.VDC{background:#ffe1e7;color:#b0163d}
  .pt .rate{font-weight:800}.pt .rate.lo{color:#d11a45}.pt .rate.mi{color:#b37400}.pt .rate.hi{color:#14873e}
  .pt .err{border-left:4px solid #e0234e;background:#fff6f8;border-radius:10px;padding:8px 10px;margin-bottom:8px;font-size:14px}
  .pt .err .q{margin-top:6px;font-size:13.5px;background:#fff;border-radius:8px;padding:6px 8px;border:1px solid #f2d3da}
  .pt .muted{color:#778}.pt .small{font-size:12.5px}
  .pt .scroll{max-height:460px;overflow:auto}
  .pt .cmp td.b{font-weight:800}
  @media print{.pt .scroll{max-height:none;overflow:visible}.pt .box{break-inside:avoid}.noprint{display:none!important}}
  `;
  function css() { if (document.getElementById("pt-css")) return; const s = document.createElement("style"); s.id = "pt-css"; s.textContent = CSS; document.head.appendChild(s); }
  const cls = r => r < .5 ? "lo" : r < .7 ? "mi" : "hi";
  const bar = (nm, r, extra) => `<div class="br ${cls(r)}"><span class="nm" title="${esc(String(nm).replace(/<[^>]+>/g, ""))}">${nm}</span><span class="tr"><i style="width:${Math.max(1, Math.round(r * 100))}%"></i></span><span class="v">${pc(r)}</span>${extra || ""}</div>`;
  function dangName(A, dk, opt) { const t = A.meta && A.meta.dang && A.meta.dang[dk]; const h = t ? (opt.tex ? opt.tex(t) : esc(t)) : ""; return `<b>${esc(dk.replace(/^C(\d+)-B(\d+)-D/, "D"))}</b> ${h}`; }

  function histHTML(hist, n) {
    const mx = Math.max(1, ...hist);
    return `<div class="hist">${hist.map((c, i) => `<div class="c ${i >= 8 ? "g" : i >= 5 ? "m" : ""}" title="${c} em"><span>${c || ""}</span><i style="height:${Math.round(c / mx * 120)}px"></i></div>`).join("")}</div><div class="hx">${hist.map((_, i) => `<span>${i}–${i + 1}</span>`).join("")}</div>`;
  }

  /* opt: {tex(s)→html, question(id)→html | null, compare:[A2,A3…], names:[…]} */
  function render(A, opt) {
    css(); opt = opt || {};
    if (!A.n) return `<div class="pt"><div class="box muted">Bài này chưa có phiếu nào được chấm.</div></div>`;
    const hasMeta = !!A.meta;
    let h = `<div class="pt">`;
    // 1. tổng quan
    h += `<div class="box"><h3>1. Tổng quan</h3><div class="kpi">
      <div><b>${A.n}</b><span>phiếu đã chấm</span></div>
      <div><b>${f2(A.mean)}</b><span>điểm trung bình</span></div>
      <div><b>${f2(A.med)}</b><span>trung vị</span></div>
      <div><b>${f2(A.sd)}</b><span>độ lệch chuẩn</span></div>
      <div><b>${f2(A.max)} / ${f2(A.min)}</b><span>cao nhất / thấp nhất</span></div>
      <div><b>${pc(A.ge5 / A.n)}</b><span>từ 5 điểm (${A.ge5} em)</span></div>
      <div><b>${pc(A.ge8 / A.n)}</b><span>từ 8 điểm (${A.ge8} em)</span></div>
      <div><b>${A.lt35}</b><span>em dưới 3,5 điểm</span></div></div>
      <h3 style="margin-top:12px">Phổ điểm</h3>${histHTML(A.hist, A.n)}</div>`;
    // 2. so sánh lớp
    if (opt.compare && opt.compare.length) {
      const G = [A, ...opt.compare]; const nm = opt.names || G.map(x => x.bai.lopHoc || x.bai.ten);
      const best = (f, hi) => { const v = G.map(f); const b = hi ? Math.max(...v) : Math.min(...v); return v.map(x => x === b); };
      const rows = [["Số phiếu", g => g.n, null], ["Điểm trung bình", g => g.mean, 1], ["Trung vị", g => g.med, 1], ["Độ lệch chuẩn", g => g.sd, 0], ["Tỉ lệ từ 5 điểm", g => g.ge5 / (g.n || 1), 1], ["Tỉ lệ từ 8 điểm", g => g.ge8 / (g.n || 1), 1], ["Dưới 3,5 điểm", g => g.lt35, 0]];
      h += `<div class="box"><h3>2. So sánh giữa các lớp</h3><div class="scroll"><table class="cmp"><tr><th></th>${nm.map(x => `<th>${esc(x)}</th>`).join("")}</tr>` +
        rows.map(([t, f, hi]) => { const B = hi == null ? G.map(() => false) : best(f, hi); return `<tr><td>${t}</td>${G.map((g, i) => { const v = f(g); return `<td class="${B[i] ? "b" : ""}">${/Tỉ lệ/.test(t) ? pc(v) : Number.isInteger(v) ? v : f2(v)}</td>`; }).join("")}</tr>`; }).join("");
      const allD = [...new Set(G.flatMap(g => g.dangs.map(d => d.k)))].sort();
      if (allD.length && hasMeta) h += `<tr><th colspan="${G.length + 1}">Tỉ lệ đúng theo dạng</th></tr>` + allD.map(dk => `<tr><td>${dangName(A, dk, opt)}</td>${G.map(g => { const d = g.dangs.find(x => x.k === dk); return `<td>${d ? `<span class="rate ${cls(d.rate)}">${pc(d.rate)}</span>` : "–"}</td>`; }).join("")}</tr>`).join("");
      h += `</table></div><p class="small muted">Chữ đậm: lớp tốt nhất ở từng chỉ số.</p>
        <h3>Phổ điểm từng lớp</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">${G.map((g, i) => `<div><b>${esc(nm[i])}</b> <span class="small muted">(${g.n} em, TB ${f2(g.mean)})</span>${histHTML(g.hist, g.n)}</div>`).join("")}</div></div>`;
    }
    const sec = (opt.compare && opt.compare.length) ? 3 : 2;
    // 3. dạng & mức
    if (hasMeta) {
      h += `<div class="box"><h3>${sec}. Dạng toán và mức độ lớp còn yếu</h3>
        <p class="small muted">Tỉ lệ đúng tính trên từng câu trắc nghiệm, từng câu trả lời ngắn và từng ý đúng/sai. <span style="color:#d11a45">Đỏ</span> dưới 50% · <span style="color:#b37400">vàng</span> 50–70% · <span style="color:#14873e">xanh</span> từ 70%.</p>
        <div class="bars">${A.dangs.map(d => bar(dangName(A, d.k, opt), d.rate)).join("")}</div>
        <h3 style="margin-top:12px">Theo mức độ</h3><div class="bars">${["NB", "TH", "VD", "VDC"].filter(m => A.byM[m]).map(m => bar(MUCN[m], A.byM[m].rate)).join("")}</div>
        <h3 style="margin-top:12px">Theo phần</h3><div class="bars">${L3.filter(L => A.byL[L]).map(L => bar({ TN: "Phần I · Trắc nghiệm", DS: "Phần II · Đúng/Sai (theo từng ý)", TLN: "Phần III · Trả lời ngắn" }[L], A.byL[L].rate)).join("")}</div></div>`;
    } else {
      h += `<div class="box"><h3>${sec}. Dạng toán và mức độ</h3><div class="note">Bài này chưa có <b>thông tin câu hỏi</b> (dạng, mức độ) nên chưa phân tích được theo dạng. Bài được nạp bằng mã QR hoặc nhập tay sẽ thiếu thông tin này.
        Cách bổ sung: mở file <b>DapAn_ChamDienThoai.json</b> của đề này (trong gói đề tải từ trang Ra đề) bằng nút “Gắn thông tin câu hỏi”. Nếu phân tích trên chính máy tính đã ra đề thì web tự ghép.</div>
        <h3 style="margin-top:12px">Theo phần</h3><div class="bars">${L3.filter(L => A.byL[L]).map(L => bar({ TN: "Phần I · Trắc nghiệm", DS: "Phần II · Đúng/Sai (theo từng ý)", TLN: "Phần III · Trả lời ngắn" }[L], A.byL[L].rate)).join("")}</div></div>`;
    }
    // 4. lỗi sai chung
    h += `<div class="box"><h3>${sec + 1}. Lỗi hiểu sai chung cần chữa</h3>`;
    if (!A.errs.length) h += `<p class="muted">Không có câu nào mà nhiều em cùng chọn một phương án sai (ngưỡng: từ 3 em và từ 25% số em làm câu đó).</p>`;
    else h += `<p class="small muted">Những câu nhiều em cùng chọn <b>một</b> phương án sai — thường là một cách hiểu sai chung, nên chữa trước lớp.</p>` + A.errs.slice(0, 12).map(e => {
      const it = e.it; const q = opt.question && it.id ? opt.question(it.id, e) : "";
      return `<div class="err"><b>${esc(it.label)}</b>${it.dkey ? ` · ${dangName(A, it.dkey, opt)} <span class="tag ${it.muc}">${it.muc}</span>` : ""}<br>${e.txt} · tỉ lệ đúng câu này: <span class="rate ${cls(it.rate)}">${pc(it.rate)}</span>${q ? `<div class="q">${q}</div>` : ""}</div>`;
    }).join("");
    h += `</div>`;
    // 5. từng câu
    h += `<div class="box"><h3>${sec + 2}. Tỉ lệ đúng từng câu</h3><div class="scroll"><table><tr><th>Câu</th>${hasMeta ? "<th>Dạng</th><th>Mức</th>" : ""}<th>Số em</th><th>Đúng</th><th>Bỏ trống</th><th>Ghi chú</th></tr>` +
      A.items.map(it => {
        let note = "";
        if (it.L === "TN") { const tot = Object.values(it.choice).reduce((a, b) => a + b, 0) || 1; note = [0, 1, 2, 3].filter(o => it.choice[o]).map(o => `${optLetter(it, o, A.mas).replace(/ \(mã \d+\)/, "")}${o === it.right ? "✓" : ""}: ${Math.round(it.choice[o] / tot * 100)}%`).join(" · "); }
        else if (it.L === "DS") note = `đúng cả 4 ý: ${pc(it.full / (it.n || 1))} · sai nhiều nhất ý ${"abcd"[it.stm.indexOf(Math.max(...it.stm))]}`;
        else { const w = Object.entries(it.ans).sort((a, b) => b[1] - a[1])[0]; note = `đáp số ${esc(it.da)}` + (w ? ` · sai hay gặp “${esc(w[0])}” (${w[1]} em)` : ""); }
        return `<tr><td><b>${esc(it.label)}</b></td>${hasMeta ? `<td>${it.dkey ? esc(it.dkey.replace(/^C(\d+)-B(\d+)-D/, "D")) : ""}</td><td>${it.muc ? `<span class="tag ${it.muc}">${it.muc}</span>` : ""}</td>` : ""}<td>${it.n}</td><td><span class="rate ${cls(it.rate)}">${pc(it.rate)}</span></td><td>${it.blank || ""}</td><td class="small">${note}</td></tr>`;
      }).join("") + `</table></div><p class="small muted">Phần II tính tỉ lệ đúng theo từng ý. Thứ tự phương án/ý hiển thị theo ${A.mas.length > 1 ? "mã đề đầu tiên có câu đó" : "mã đề"}.</p></div>`;
    return h + `</div>`;
  }

  /* bảng phân tích để tải Excel */
  function excelRows(A) {
    const rows = [["Câu", "Mã câu", "Dạng", "Mức", "Số em", "Tỉ lệ đúng (%)", "Bỏ trống"]];
    A.items.forEach(it => rows.push([it.label, it.id || "", it.dkey || "", it.muc || "", it.n, Math.round(it.rate * 100), it.blank]));
    rows.push([]); rows.push(["Dạng", "Tên dạng", "Tỉ lệ đúng (%)", "Số đơn vị chấm"]);
    A.dangs.forEach(d => rows.push([d.k, (A.meta && A.meta.dang && A.meta.dang[d.k]) || "", Math.round(d.rate * 100), d.units]));
    return rows;
  }

  OMR.Stats = { sig, findMeta, attachMeta, analyze, render, weakPlan, ontapUrl, excelRows, css };
})(typeof window !== "undefined" ? window : globalThis);
