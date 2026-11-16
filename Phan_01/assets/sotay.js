/* Sổ tay theo bài học: tóm tắt lí thuyết + 5 dạng bài tập có giải mẫu + sơ đồ tư duy cuối chương.
   Dữ liệu: CHUONG_TRINH (tên chương/bài), BAIHOC (lí thuyết theo mục), SOTAYBAI (dạng, ý chính – data/sotaybai-*.js).
   Xuất: SoTayBai.mount(el). Tải PDF bằng html2canvas + jsPDF, in bằng window.print() — chân trang ghi tên GV. */
(function (G) {
  "use strict";
  const CHAN = "GV: ThS Nguyễn Hoàng Minh Hiếu - GV Toán THPT An Nhơn Tây";
  const MAU = [
    ["#3b7bff", "#eef4ff"], ["#10b3a3", "#e6f8f5"], ["#ff6f4a", "#fff1ec"], ["#8a5cf6", "#f3eeff"], ["#2fb35a", "#eaf8ee"],
    ["#ff4f87", "#fff0f5"], ["#e09a12", "#fff7e6"], ["#0ea5e9", "#e8f6fd"], ["#c2557a", "#fbeef3"]
  ];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tex = s => String(s).split(/(\$\$[^$]+\$\$|\$[^$]+\$)/).map(p => {
    const m = p.match(/^\$\$([^$]+)\$\$$|^\$([^$]+)\$$/);
    if (m) { try { return katex.renderToString(m[1] || m[2], { throwOnError: false, displayMode: !!m[1] }); } catch (e) { return esc(p); } }
    return esc(p).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }).join("");
  const tron = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v * (1 - t) + y[i] * t).toString(16).padStart(2, "0")).join(""); };
  const bien = m => `--nm:${m[0]};--nt:${m[1]};--nd:${tron(m[0], "#1d2742", .48)}`;
  const LAMA = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  /* ---------- nạp dần thư viện, dữ liệu (chỉ khi cần) ---------- */
  const daNap = {};
  const nap = src => daNap[src] || (daNap[src] = new Promise((ok, loi) => {
    if ([...document.scripts].some(s => s.getAttribute("src") === src)) return ok();
    const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => { delete daNap[src]; loi(new Error("Không tải được " + src)); }; document.head.appendChild(s);
  }));
  const napLop = lop => Promise.all([`data/baihoc/t${lop}.js`, `data/sotaybai-${lop}.js`].map(nap));
  const napHinh = () => nap("assets/hinhve.js").then(() => Promise.all(["data/hinhve-bai.js", "data/hinhve-sotay.js"].map(nap)));
  const napPDF = () => Promise.all(["assets/lib/html2canvas.min.js", "assets/lib/jspdf.umd.min.js"].map(nap));
  /* hình vẽ: đổi màu phấn (nền bảng) sang màu in trên nền trắng */
  const MAUHV = { "--chu": "#1d2742", "--vang": "#d98a00", "--xanh": "#0f9e8f", "--hong": "#e8553a", "--tim": "#7c4ddb", "--luc": "#2a9d50" };
  function hinh(h, ten) {
    if (!G.HinhVe || !h) return "";
    let sv; try { sv = G.HinhVe.svg(h); } catch (e) { return ""; }
    sv = sv.replace(/var\((--[a-z]+)\)/g, (m, v) => MAUHV[v] || "#1d2742").replace('class="hv"', 'class="hv" width="100%"');
    return `<figure class="hvb"><div style="max-width:${Math.round((h.w || 5) * 62)}px;margin:auto">${sv}</div>${ten ? `<figcaption>${tex(ten)}</figcaption>` : ""}</figure>`;
  }

  /* ---------- đọc dữ liệu dạng văn bản ---------- */
  const cache = {};
  function docLop(lop) {
    if (cache[lop]) return cache[lop];
    const raw = (G.SOTAYBAI || {})[lop]; const out = {};
    if (!raw) return out;
    let bai = null, dang = null;
    raw.split(/\r?\n/).forEach(line => {
      const l = line.trim(); if (!l) return;
      let m;
      if ((m = l.match(/^@(\d+)/))) { bai = out[m[1]] = { m: [], dang: [] }; dang = null; return; }
      if (!bai) return;
      if ((m = l.match(/^m:\s*(.*)$/))) { bai.m = m[1].split(/\s*;;\s*/).filter(Boolean); return; }
      if ((m = l.match(/^#\s*(.*)$/))) { dang = { t: m[1], p: "", d: "", g: [] }; bai.dang.push(dang); return; }
      if (!dang) return;
      if ((m = l.match(/^p:\s*(.*)$/))) dang.p = m[1];
      else if ((m = l.match(/^d:\s*(.*)$/))) dang.d = m[1];
      else if ((m = l.match(/^g:\s*(.*)$/))) dang.g.push(m[1]);
    });
    return (cache[lop] = out);
  }
  const CT = lop => ((G.CHUONG_TRINH || {})["Toán"] || {})[lop] || {};
  const BH = (lop, bai) => (((G.BAIHOC || {})["Toán"] || {})[lop] || {})[bai];
  function dsChuong(lop) {
    const C = CT(lop);
    return Object.keys(C).map(Number).sort((a, b) => a - b).map((so, i) => ({
      so, ten: C[so][0], mau: MAU[i % MAU.length],
      bai: Object.keys(C[so][1]).map(Number).sort((a, b) => a - b).map(b => ({ so: b, ten: C[so][1][b] }))
    }));
  }

  /* ---------- CSS ---------- */
  const CSS = `
.stb{display:grid;grid-template-columns:290px 1fr;gap:18px;align-items:start}
@media (max-width:880px){.stb{grid-template-columns:1fr}.stb-nav{position:static!important;max-height:none!important}}
.stb-nav{position:sticky;top:84px;max-height:calc(100vh - 100px);overflow:auto;background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;box-shadow:var(--sh)}
.stb-lop{display:flex;gap:6px;margin-bottom:10px}
.stb-lop button{flex:1;border:2px solid var(--line);background:#fff;border-radius:12px;padding:7px 0;font:800 15px var(--font-h);cursor:pointer;color:#445}
.stb-lop button.on{border-color:var(--teal);background:linear-gradient(135deg,#10b3a3,#3b7bff);color:#fff}
.stb-q{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:8px 12px;font:inherit;margin-bottom:8px}
.stb-ch{margin:4px 0;border-radius:14px;overflow:hidden}
.stb-ch>button{width:100%;text-align:left;border:0;background:var(--nt);color:var(--nm);font:700 14px/1.35 var(--font);padding:9px 12px;cursor:pointer;display:flex;gap:8px;align-items:flex-start;border-radius:12px}
.stb-ch>button b{background:var(--nm);color:#fff;border-radius:8px;padding:1px 7px;font-size:12px;flex:none;margin-top:1px}
.stb-ch .ds{display:none;padding:4px 0 6px 10px}
.stb-ch.mo .ds{display:block}
.stb-ch .ds a{display:block;padding:6px 10px;border-radius:10px;color:#334;text-decoration:none;font-size:14px;line-height:1.35;border-left:3px solid transparent}
.stb-ch .ds a:hover{background:#f6f7fb}
.stb-ch .ds a.on{background:var(--nt);border-left-color:var(--nm);font-weight:700;color:var(--nm)}
.stb-ch .ds a.mm{font-weight:700;color:var(--nm)}
.stb-main{min-width:0}
.stb-bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-bottom:10px}
.stv{background:#fff;border-radius:22px;border:1px solid var(--line);box-shadow:var(--sh);overflow:hidden;color:#1d2742}
.stv .hd{padding:22px 26px 18px;color:#fff;background:linear-gradient(120deg,var(--nm),var(--nd))}
.stv .hd small{display:inline-block;background:rgba(255,255,255,.2);border-radius:999px;padding:3px 12px;font-weight:700;font-size:13px;letter-spacing:.2px}
.stv .hd h2{font:800 28px/1.15 var(--font-h);margin:10px 0 4px;color:#fff}
.stv .hd p{margin:0;opacity:.92;font-size:14.5px}
.stv .bd{padding:18px 26px 26px}
.stv h3.sec{display:flex;align-items:center;gap:10px;font:800 21px var(--font-h);margin:16px 0 10px;color:var(--nm)}
.stv h3.sec i{font-style:normal;width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:var(--nt);font-size:18px}
.stv .yc{background:#fffaf0;border:1px dashed #f0c56b;border-radius:14px;padding:10px 14px;margin:6px 0 4px;font-size:14.5px}
.stv .yc b{color:#a26a00}
.stv .yc ul{margin:4px 0 0;padding-left:20px}
.stv .lt{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.stv .lt .k{border:1px solid var(--line);border-top:4px solid var(--nm);border-radius:14px;padding:12px 14px;background:linear-gradient(180deg,var(--nt),#fff 60%)}
.stv .lt .k h4{margin:0 0 6px;font:700 16px var(--font);color:var(--nm)}
.stv .lt .k ul{margin:0;padding-left:18px;line-height:1.7;font-size:15px}
.stv .dg{border:1px solid var(--line);border-radius:16px;margin:12px 0;overflow:hidden;background:#fff}
.stv .dg .t{display:flex;gap:12px;align-items:center;padding:12px 16px;background:var(--nt)}
.stv .dg .t .so{flex:none;width:38px;height:38px;border-radius:12px;background:var(--nm);color:#fff;display:grid;place-items:center;font:800 17px var(--font-h)}
.stv .dg .t h4{margin:0;font:700 17px/1.3 var(--font)}
.stv .dg .t span{display:block;font-size:12.5px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.stv .dg .c{padding:12px 16px 14px;line-height:1.7;font-size:15.5px}
.stv .pp{background:#f2fbf7;border-left:4px solid #2fb35a;border-radius:10px;padding:8px 12px;margin-bottom:10px}
.stv .pp b{color:#16803c}
.stv .vd b.lb{color:var(--nm)}
.stv .lg{margin-top:10px;border-radius:12px;background:#f8f9fd;border:1px dashed #cfd6ea;padding:8px 12px}
.stv .lg ol{margin:4px 0 0;padding-left:22px}
.stv .lg li{margin:3px 0}
.stv .lg li::marker{color:var(--nm);font-weight:800}
.stv .lgbtn{margin-top:10px;border:1.5px solid var(--nm);background:#fff;color:var(--nm);border-radius:10px;padding:6px 12px;font:700 14px var(--font);cursor:pointer}
.stv .lgbtn:hover{background:var(--nt)}
.stv .nav2{display:flex;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap}
.stv .nav2 a{flex:1;min-width:200px;text-decoration:none;border:1.5px solid var(--line);border-radius:14px;padding:10px 14px;color:#334;font-size:14px}
.stv .nav2 a:hover{border-color:var(--nm)}
.stv .nav2 a b{display:block;color:var(--nm)}
.stv .nav2 a.r{text-align:right}
.stv .ft{display:none}
.stv.pdf .lgbtn,.stv.pdf .nav2{display:none!important}
.stv.pdf .lg{display:block!important}
.stv figure.hvb{margin:0;background:#fbfcff;border:1px solid #e6eaf4;border-radius:14px;padding:10px 10px 8px;text-align:center}
.stv figure.hvb figcaption{font-size:13.5px;color:#55607a;margin-top:4px;line-height:1.45}
.stv .hvs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:12px}
.stv .vdh{display:grid;grid-template-columns:1fr minmax(200px,300px);gap:14px;align-items:start}
@media (max-width:640px){.stv .vdh{grid-template-columns:1fr}}
.stv .hoc{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.stv .hoc button{border:1.5px solid rgba(255,255,255,.7);background:rgba(255,255,255,.14);color:#fff;border-radius:999px;padding:6px 14px;font:700 13.5px var(--font);cursor:pointer}
.stv .hoc button.on{background:#fff;color:var(--nm)}
.stb-ch em.tdo{font-style:normal;font-size:11.5px;background:#fff;border-radius:999px;padding:0 7px;margin-left:4px;color:var(--nm)}
.stv.pdf .hoc{display:none}
@media print{.stv .hoc{display:none!important}}
/* sơ đồ tư duy */
.mm{position:relative;padding:22px 18px 26px;background:radial-gradient(circle at 50% 45%,#fff 0,#fbfcff 55%,#f3f6fd 100%)}
.mm svg.ln{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.mm .row{position:relative;display:grid;grid-template-columns:1fr 240px 1fr;gap:26px 46px;align-items:center}
.mm .col{display:grid;gap:16px;align-content:center}
.mm .tam{grid-column:2;grid-row:1/span 1;align-self:center;text-align:center;padding:22px 16px;border-radius:28px;color:#fff;background:linear-gradient(140deg,var(--nm),var(--nd));box-shadow:0 14px 30px -14px var(--nm);font:800 19px/1.25 var(--font-h);position:relative;z-index:1}
.mm .tam small{display:block;font:700 12.5px var(--font);opacity:.85;margin-bottom:6px;letter-spacing:.6px;text-transform:uppercase}
.mm .nh{position:relative;z-index:1;background:#fff;border:2px solid var(--bm);border-radius:18px;overflow:hidden;box-shadow:0 8px 20px -14px rgba(29,39,66,.45)}
.mm .nh h5{margin:0;padding:8px 12px;background:var(--bm);color:#fff;font:700 14.5px/1.3 var(--font)}
.mm .nh ul{margin:0;padding:8px 12px 10px 12px;list-style:none;font-size:13.5px;line-height:1.55}
.mm .nh li{position:relative;padding-left:16px;margin:3px 0}
.mm .nh li::before{content:"";position:absolute;left:2px;top:.62em;width:7px;height:7px;border-radius:50%;background:var(--bm)}
.mm .nh .katex{font-size:1em}
@media (max-width:760px){.mm .row{grid-template-columns:1fr}.mm .tam{grid-column:1}.mm svg.ln{display:none}}
.stv.pdf .mm .row,.mm.ngang .row{grid-template-columns:1fr 240px 1fr!important}
.stv.pdf .mm .tam{grid-column:2!important}
.stv.pdf .mm svg.ln{display:block!important}
/* in */
#stbIn.inngang{width:1060px;max-width:none}
#stbIn.inngang .mm .row{grid-template-columns:1fr 190px 1fr!important;gap:14px 30px}
#stbIn.inngang .mm .tam{grid-column:2!important}
#stbIn.inngang .mm svg.ln{display:block!important}
#stbIn.inngang .stv .hd{padding:10px 20px}#stbIn.inngang .stv .hd h2{font-size:21px;margin:4px 0 0}#stbIn.inngang .stv .hd p{display:none}
#stbIn.inngang .mm{padding:10px 12px 12px}#stbIn.inngang .mm .col{gap:9px}#stbIn.inngang .mm .nh h5{font-size:12.5px;padding:5px 10px}#stbIn.inngang .mm .nh ul{font-size:11.5px;line-height:1.4;padding:5px 10px 6px}#stbIn.inngang .mm .nh li{margin:1px 0}#stbIn.inngang .bd{display:none}
@media print{
  body *{visibility:hidden}
  #stbIn,#stbIn *{visibility:visible}
  #stbIn{position:absolute;left:0;top:0;width:100%}
  #stbIn.inngang{width:1060px}
  #stbIn .stv{box-shadow:none;border:0;border-radius:0}
  #stbIn .lgbtn,#stbIn .nav2{display:none!important}
  #stbIn .lg{display:block!important}
  #stbIn .dg,#stbIn .lt .k,#stbIn .nh{break-inside:avoid}
  #stbIn .ft{display:block;position:fixed;bottom:0;left:0;right:0;text-align:center;font:600 11px var(--font);color:#55607a;border-top:1px solid #dfe3ee;padding:4px 0;background:#fff}
  #stbIn .stv .hd,#stbIn .mm .tam,#stbIn .mm .nh h5,#stbIn .dg .t .so{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  #stbIn *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{margin:12mm 10mm 16mm}
  #stbIn .mm .row{grid-template-columns:1fr 190px 1fr!important;gap:14px 30px}
  #stbIn .mm .tam{grid-column:2!important}
  #stbIn .mm svg.ln{display:block!important}
  header,.top,footer,.stb-nav,.stb-bar,.lt-tabs,.hero{display:none!important}
}`;

  /* ---------- giao diện ---------- */
  function mount(root) {
    if (!document.getElementById("stbCss")) { const st = document.createElement("style"); st.id = "stbCss"; st.textContent = CSS; document.head.appendChild(st); }
    const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
    const lops = ["10", "11", "12"].filter(l => Object.keys(CT(l)).length);
    let st = LS.get("stb-vt", { lop: lops[0], k: "b1" });
    const h = (location.hash.match(/^#st\/(\d+)\/(b\d+|c\d+)$/) || []);
    if (h[1]) st = { lop: h[1], k: h[2] };
    if (!lops.includes(String(st.lop))) st = { lop: lops[0], k: "b1" };
    let moChuong = null, q = "";

    root.innerHTML = `<div class="stb"><aside class="stb-nav"><div class="stb-lop">${lops.map(l => `<button data-l="${l}">Lớp ${l}</button>`).join("")}</div>
      <input class="stb-q" placeholder="🔎 Tìm bài, dạng bài…"><div class="stb-ds"></div></aside>
      <div class="stb-main"><div class="stb-bar"><button class="btn sm ghost" data-a="in">🖨 In</button><button class="btn sm green" data-a="pdf">⬇ Tải PDF phần đang xem</button><button class="btn sm violet hidden" data-a="png">🖼 Tải ảnh sơ đồ (PNG)</button></div><div id="stbIn"></div></div></div>`;
    const $ = s => root.querySelector(s);
    root.querySelectorAll(".stb-lop button").forEach(b => b.onclick = () => { st = { lop: b.dataset.l, k: "b" + dsChuong(b.dataset.l)[0].bai[0].so }; moChuong = null; ve(); });
    $(".stb-q").oninput = e => { q = e.target.value.trim().toLowerCase(); veNav(); };
    root.querySelector('[data-a="in"]').onclick = () => window.print();
    root.querySelector('[data-a="pdf"]').onclick = e => taiPDF(e.target);
    root.querySelector('[data-a="png"]').onclick = e => taiPNG(e.target);
    window.addEventListener("hashchange", () => { const m = location.hash.match(/^#st\/(\d+)\/(b\d+|c\d+)$/); if (m && (m[1] !== String(st.lop) || m[2] !== st.k)) { st = { lop: m[1], k: m[2] }; moChuong = null; ve(); } });
    let inSt = null;
    window.addEventListener("beforeprint", () => { if (st.k[0] === "c" && !inSt) { inSt = document.createElement("style"); inSt.textContent = "@page{size:A4 landscape;margin:8mm 8mm 14mm}"; document.head.appendChild(inSt); } const mm = $("#stbIn .mm"); if (mm) { $("#stbIn").classList.add("inngang"); noiDay(mm); } });
    window.addEventListener("afterprint", () => { if (inSt) { inSt.remove(); inSt = null; } $("#stbIn").classList.remove("inngang"); const mm = $("#stbIn .mm"); if (mm) noiDay(mm); });
    let rT; window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { const mm = $("#stbIn .mm"); if (mm) noiDay(mm); }, 150); });

    function chuongCua(lop, k) { const C = dsChuong(lop); if (k[0] === "c") return C.find(c => c.so === +k.slice(1)); return C.find(c => c.bai.some(b => b.so === +k.slice(1))); }

    function veNav() {
      const lop = st.lop, D = docLop(lop), C = dsChuong(lop), dh = G.LopHoc ? G.LopHoc.daHoc() : {};
      const cur = chuongCua(lop, st.k); if (moChuong == null && cur) moChuong = cur.so;
      const khop = (c, b) => !q || (c.ten + " " + b.ten + " " + ((D[b.so] || {}).dang || []).map(x => x.t).join(" ")).toLowerCase().includes(q);
      $(".stb-ds").innerHTML = C.map(c => {
        const bs = c.bai.filter(b => khop(c, b)); if (!bs.length) return "";
        const mo = q || c.so === moChuong;
        return `<div class="stb-ch${mo ? " mo" : ""}" style="${bien(c.mau)}"><button data-c="${c.so}"><b>${LAMA[c.so] || c.so}</b><span>${esc(c.ten)}${(() => { const n = c.bai.filter(b => (dh[lop + "/b" + b.so] || {}).s === "hoc").length; return n ? ` <em class="tdo">${n}/${c.bai.length}</em>` : ""; })()}</span></button><div class="ds">${bs.map(b => { const s = (dh[lop + "/b" + b.so] || {}).s; return `<a href="#st/${lop}/b${b.so}" data-k="b${b.so}" class="${st.k === "b" + b.so ? "on" : ""}">${s === "hoc" ? "✅ " : s === "on" ? "🔁 " : ""}Bài ${b.so}. ${esc(b.ten)}</a>`; }).join("")}<a href="#st/${lop}/c${c.so}" data-k="c${c.so}" class="mm${st.k === "c" + c.so ? " on" : ""}">🧠 Sơ đồ tư duy chương ${LAMA[c.so] || c.so}</a></div></div>`;
      }).join("") || `<div class="muted small" style="padding:8px">Không tìm thấy.</div>`;
      root.querySelectorAll(".stb-ch>button").forEach(b => b.onclick = () => { moChuong = moChuong === +b.dataset.c ? -1 : +b.dataset.c; veNav(); });
      root.querySelectorAll(".stb-ds a").forEach(a => a.onclick = ev => { ev.preventDefault(); st = { lop, k: a.dataset.k }; history.replaceState(null, "", a.getAttribute("href")); ve(); if (innerWidth < 880) $("#stbIn").scrollIntoView({ behavior: "smooth" }); });
      root.querySelectorAll(".stb-lop button").forEach(b => b.classList.toggle("on", b.dataset.l === String(lop)));
    }

    let luot = 0;
    function ve() {
      const l = ++luot;
      if (!G.SOTAYBAI || !G.SOTAYBAI[st.lop] || !G.HinhVe || !G.HINHST) {
        $("#stbIn").innerHTML = `<div class="card muted">⏳ Đang tải nội dung…</div>`;
        Promise.all([napLop(st.lop), napHinh()]).then(() => { if (l === luot) ve2(); }, e => { $("#stbIn").innerHTML = `<div class="card">⚠️ ${esc(e.message)}. Kiểm tra kết nối mạng rồi tải lại trang.</div>`; });
        return;
      }
      ve2();
    }
    function ve2() {
      LS.set("stb-vt", st); veNav();
      const lop = st.lop, c = chuongCua(lop, st.k);
      const out = $("#stbIn");
      if (!c) { out.innerHTML = `<div class="card">Chưa có dữ liệu.</div>`; return; }
      root.querySelector('[data-a="png"]').classList.toggle("hidden", st.k[0] !== "c");
      out.innerHTML = st.k[0] === "c" ? htmlSoDo(lop, c) : htmlBai(lop, c, +st.k.slice(1));
      out.querySelectorAll(".hoc button").forEach(bt => bt.onclick = () => {
        const ma = lop + "/" + st.k, cur = (G.LopHoc.daHoc()[ma] || {}).s, moi = cur === bt.dataset.h ? null : bt.dataset.h;
        const lam = () => { const b0 = c.bai.find(x => "b" + x.so === st.k); G.LopHoc.datDaHoc(ma, `Toán ${lop} – Bài ${b0.so}. ${b0.ten}`, moi); ve2(); G.dispatchEvent(new Event("lophoc-capnhat")); if (moi === "hoc") toastX("Tuyệt! Em đã hoàn thành bài này 🎉"); };
        if (moi && G.LopHoc.url() && !G.LopHoc.hs()) G.LopHoc.hoiTen(h => lam()); else lam();
      });
      out.querySelectorAll(".lgbtn").forEach(b => b.onclick = () => { const lg = b.nextElementSibling; const an = lg.classList.toggle("hidden"); b.textContent = an ? "👁 Xem lời giải mẫu" : "🙈 Ẩn lời giải"; });
      out.querySelectorAll(".nav2 a").forEach(a => a.onclick = ev => { ev.preventDefault(); st = { lop, k: a.dataset.k }; moChuong = null; history.replaceState(null, "", a.getAttribute("href")); ve(); out.scrollIntoView({ behavior: "smooth" }); });
      const mm = out.querySelector(".mm"); if (mm) requestAnimationFrame(() => noiDay(mm));
    }

    function nutHoc(lop, k) {
      if (!G.LopHoc) return "";
      const s = (G.LopHoc.daHoc()[lop + "/" + k] || {}).s;
      return `<div class="hoc"><button data-h="hoc" class="${s === "hoc" ? "on" : ""}">${s === "hoc" ? "✅ Em đã học bài này" : "☐ Đánh dấu đã học"}</button><button data-h="on" class="${s === "on" ? "on" : ""}">🔁 Cần ôn lại</button></div>`;
    }
    function lanCan(lop, k) {
      const ds = []; dsChuong(lop).forEach(c => { c.bai.forEach(b => ds.push({ k: "b" + b.so, ten: "Bài " + b.so + ". " + b.ten })); ds.push({ k: "c" + c.so, ten: "🧠 Sơ đồ tư duy chương " + (LAMA[c.so] || c.so) }); });
      const i = ds.findIndex(x => x.k === k); return [ds[i - 1], ds[i + 1]];
    }
    function nav2(lop, k) {
      const [a, b] = lanCan(lop, k);
      return `<div class="nav2">${a ? `<a href="#st/${lop}/${a.k}" data-k="${a.k}">← Trước<b>${esc(a.ten)}</b></a>` : "<span></span>"}${b ? `<a class="r" href="#st/${lop}/${b.k}" data-k="${b.k}">Tiếp theo →<b>${esc(b.ten)}</b></a>` : ""}</div>`;
    }

    function htmlBai(lop, c, so) {
      const b = c.bai.find(x => x.so === so) || c.bai[0];
      const d = docLop(lop)[b.so] || { dang: [], m: [] }; const bh = BH(lop, b.so) || {};
      const md = (bh.md || []).filter(m => m && (m.y || []).length);
      const lt = md.length ? md.map(m => `<div class="k"><h4>${tex(m.t)}</h4><ul>${m.y.map(y => `<li>${tex(y)}</li>`).join("")}</ul></div>`).join("")
        : (d.m.length ? `<div class="k"><h4>Kiến thức trọng tâm</h4><ul>${d.m.map(y => `<li>${tex(y)}</li>`).join("")}</ul></div>` : "");
      const hb = (((G.HINH || {})[lop] || {})[b.so] || []).map(x => hinh(x.h, x.ten)).filter(Boolean);
      const hinhBai = hb.length ? `<div class="hvs">${hb.join("")}</div>` : "";
      const hd = ((G.HINHST || {})[lop] || {})[b.so] || {};
      const yc = (bh.yc || []).length ? `<div class="yc"><b>🎯 Em cần đạt:</b><ul>${bh.yc.map(y => `<li>${tex(y)}</li>`).join("")}</ul></div>` : "";
      const dg = d.dang.map((x, i) => `<div class="dg"><div class="t"><div class="so">${i + 1}</div><div><span>Dạng ${i + 1}</span><h4>${tex(x.t)}</h4></div></div><div class="c">
        ${x.p ? `<div class="pp"><b>Phương pháp:</b> ${tex(x.p)}</div>` : ""}
        ${hd[i + 1] ? `<div class="vdh"><div class="vd"><b class="lb">Ví dụ.</b> ${tex(x.d)}</div>${hinh(hd[i + 1].h, hd[i + 1].ten)}</div>` : `<div class="vd"><b class="lb">Ví dụ.</b> ${tex(x.d)}</div>`}
        <button class="lgbtn">👁 Xem lời giải mẫu</button><div class="lg hidden"><b>Lời giải</b><ol>${x.g.map(g => `<li>${tex(g)}</li>`).join("")}</ol></div></div></div>`).join("");
      return `<article class="stv" style="${bien(c.mau)}"><div class="hd"><small>Toán ${lop} · Chương ${LAMA[c.so] || c.so}. ${esc(c.ten)}</small><h2>Bài ${b.so}. ${esc(b.ten)}</h2><p>Tóm tắt lí thuyết và ${d.dang.length} dạng bài tập tiêu biểu có lời giải mẫu · <a href="tailieu.html#${lop}/b${b.so}" style="color:#fff;font-weight:700">📄 Đề cương bài này</a></p>${nutHoc(lop, "b" + b.so)}</div>
        <div class="bd">${yc}<h3 class="sec"><i>📘</i>Tóm tắt lí thuyết</h3><div class="lt">${lt || '<div class="muted">Đang cập nhật.</div>'}</div>${hinhBai}
        <h3 class="sec"><i>✍️</i>Các dạng bài tập tiêu biểu</h3>${dg || '<div class="muted">Đang cập nhật.</div>'}${nav2(lop, "b" + b.so)}</div><div class="ft">${CHAN}</div></article>`;
    }

    function htmlSoDo(lop, c) {
      const D = docLop(lop);
      const nh = c.bai.map((b, i) => {
        const m = MAU[(i + 1 + c.so) % MAU.length][0];
        const y = (D[b.so] || {}).m || []; const ds = ((D[b.so] || {}).dang || []).map(x => x.t);
        return `<div class="nh" style="--bm:${m}"><h5>Bài ${b.so}. ${esc(b.ten)}</h5><ul>${(y.length ? y : ds.slice(0, 4)).map(t => `<li>${tex(t)}</li>`).join("")}</ul></div>`;
      });
      const nT = Math.ceil(nh.length / 2), trai = nh.filter((_, i) => i % 2 === 0), phai = nh.filter((_, i) => i % 2 === 1);
      void nT;
      return `<article class="stv" style="${bien(c.mau)}"><div class="hd"><small>Toán ${lop} · Sơ đồ tư duy</small><h2>Chương ${LAMA[c.so] || c.so}. ${esc(c.ten)}</h2><p>Tổng hợp kiến thức trọng tâm của ${c.bai.length} bài trong chương</p></div>
        <div class="mm"><svg class="ln"></svg><div class="row"><div class="col trai">${trai.join("")}</div><div class="tam"><small>Chương ${LAMA[c.so] || c.so}</small>${esc(c.ten)}</div><div class="col phai">${phai.join("")}</div></div></div>
        <div class="bd" style="padding-top:4px">${nav2(lop, "c" + c.so)}</div><div class="ft">${CHAN}</div></article>`;
    }

    /* nối nhánh: đường cong từ nút trung tâm tới từng nhánh */
    function noiDay(mm) {
      const svg = mm.querySelector("svg.ln"), tam = mm.querySelector(".tam"); if (!svg || !tam) return;
      const R = mm.getBoundingClientRect(), T = tam.getBoundingClientRect();
      if (getComputedStyle(svg).display === "none") return;
      svg.setAttribute("viewBox", `0 0 ${R.width} ${R.height}`);
      const cx = T.left - R.left + T.width / 2, cy = T.top - R.top + T.height / 2;
      let s = "";
      mm.querySelectorAll(".nh").forEach(n => {
        const B = n.getBoundingClientRect(), mau = getComputedStyle(n).getPropertyValue("--bm").trim();
        const trai = B.left + B.width / 2 < T.left + T.width / 2;
        const x2 = trai ? B.right - R.left : B.left - R.left, y2 = B.top - R.top + Math.min(22, B.height / 2);
        const x1 = trai ? T.left - R.left + 8 : T.right - R.left - 8, y1 = cy;
        const mx = (x1 + x2) / 2;
        s += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="${mau}" stroke-width="4" stroke-linecap="round" opacity=".85"/><circle cx="${x2}" cy="${y2}" r="5" fill="${mau}"/>`;
      });
      svg.innerHTML = s;
    }

    /* ---------- tải về ---------- */
    async function chupAnh(rongPx) {
      const goc = $("#stbIn .stv"); if (!goc) return null;
      const box = document.createElement("div");
      box.style.cssText = `position:fixed;left:-10000px;top:0;width:${rongPx}px;background:#fff;z-index:-1`;
      const bn = goc.cloneNode(true); bn.classList.add("pdf"); box.appendChild(bn); document.body.appendChild(box);
      bn.querySelectorAll(".lg").forEach(x => x.classList.remove("hidden"));
      const mm = bn.querySelector(".mm"); if (mm) { mm.classList.add("ngang"); noiDay(mm); }
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await new Promise(r => setTimeout(r, 60));
      const cat = []; const top0 = bn.getBoundingClientRect().top;
      bn.querySelectorAll(".hd,.yc,h3.sec,.lt .k,.dg,.mm").forEach(e => { const r = e.getBoundingClientRect(); cat.push(r.bottom - top0); });
      const canvas = await html2canvas(bn, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
      const H = bn.getBoundingClientRect().height; box.remove();
      return { canvas, cat: cat.sort((a, b) => a - b), H };
    }
    function chanTrang(ctx, W, H, trang, tong) {
      const s = W / 794;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, H - 34 * s, W, 34 * s);
      ctx.strokeStyle = "#dfe3ee"; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(30 * s, H - 30 * s); ctx.lineTo(W - 30 * s, H - 30 * s); ctx.stroke();
      ctx.fillStyle = "#55607a"; ctx.font = `600 ${11 * s}px "Be Vietnam Pro", Arial, sans-serif`; ctx.textBaseline = "middle";
      ctx.textAlign = "center"; ctx.fillText(CHAN, W / 2, H - 15 * s);
      if (tong > 1) { ctx.textAlign = "right"; ctx.fillText(trang + "/" + tong, W - 30 * s, H - 15 * s); }
    }
    function tenTep() {
      const c = chuongCua(st.lop, st.k);
      const b = st.k[0] === "b" ? c.bai.find(x => x.so === +st.k.slice(1)) : null;
      const s = (b ? `SoTay_Toan${st.lop}_Bai${b.so}_${b.ten}` : `SoDoTuDuy_Toan${st.lop}_Chuong${c.so}_${c.ten}`);
      return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 80);
    }
    async function taiPDF(btn) {
      const cu = btn.textContent; btn.textContent = "⏳ Đang tạo PDF…"; btn.disabled = true;
      try {
        await napPDF();
        const soDo = st.k[0] === "c";
        const rong = soDo ? 1180 : 794;
        const r = await chupAnh(rong); if (!r) return;
        const { jsPDF } = G.jspdf;
        const doc = new jsPDF({ orientation: soDo ? "landscape" : "portrait", unit: "mm", format: "a4", compress: true });
        const PW = doc.internal.pageSize.getWidth(), PH = doc.internal.pageSize.getHeight();
        const k = r.canvas.width / rong;                  // px canvas trên 1 px CSS
        const chanCss = 34 * rong / 794;                   // phần dành cho chân trang (px CSS)
        const trangCss = rong * PH / PW;                   // chiều cao 1 trang (px CSS)
        if (soDo) {
          // sơ đồ: thu vừa một trang ngang
          const W = r.canvas.width, Hpage = Math.round(W * PH / PW);
          const pg = document.createElement("canvas"); pg.width = W; pg.height = Hpage; const ctx = pg.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hpage);
          const vung = Hpage - chanCss * k - 10 * k, sc = Math.min(1, vung / r.canvas.height), w2 = W * sc, h2 = r.canvas.height * sc;
          ctx.drawImage(r.canvas, (W - w2) / 2, 6 * k, w2, h2);
          chanTrang(ctx, W, Hpage, 1, 1);
          doc.addImage(pg.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, PW, PH);
        } else {
          const vung = trangCss - chanCss - 14;          // chiều cao nội dung mỗi trang (px CSS)
          const ngat = []; let y = 0;
          while (y < r.H - 1) {
            let toi = y + vung;
            if (toi < r.H) { const cands = r.cat.filter(v => v > y + 80 && v <= toi); if (cands.length) toi = cands[cands.length - 1]; }
            else toi = r.H;
            ngat.push([y, toi]); y = toi;
          }
          ngat.forEach(([a, b], i) => {
            const W = r.canvas.width, Hp = Math.round(trangCss * k);
            const pg = document.createElement("canvas"); pg.width = W; pg.height = Hp; const ctx = pg.getContext("2d");
            ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hp);
            const sy = Math.round(a * k), sh = Math.round((b - a) * k), dy = i ? Math.round(10 * k) : 0;
            ctx.drawImage(r.canvas, 0, sy, W, sh, 0, dy, W, sh);
            chanTrang(ctx, W, Hp, i + 1, ngat.length);
            if (i) doc.addPage();
            doc.addImage(pg.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, PW, PH);
          });
        }
        doc.save(tenTep() + ".pdf");
      } catch (e) { console.error(e); alert("Không tạo được PDF (" + e.message + "). Hãy dùng nút 🖨 In → Lưu thành PDF."); }
      finally { btn.textContent = cu; btn.disabled = false; }
    }
    async function taiPNG(btn) {
      const cu = btn.textContent; btn.textContent = "⏳ Đang tạo ảnh…"; btn.disabled = true;
      try {
        await napPDF();
        const r = await chupAnh(1180); const W = r.canvas.width, s = W / 1180, Hc = r.canvas.height + Math.round(40 * s);
        const pg = document.createElement("canvas"); pg.width = W; pg.height = Hc; const ctx = pg.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hc); ctx.drawImage(r.canvas, 0, 0);
        ctx.fillStyle = "#55607a"; ctx.font = `600 ${14 * s}px "Be Vietnam Pro", Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(CHAN, W / 2, Hc - 20 * s);
        const a = document.createElement("a"); a.href = pg.toDataURL("image/png"); a.download = tenTep() + ".png"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1000);
      } finally { btn.textContent = cu; btn.disabled = false; }
    }

    ve();
  }

  const toastX = m => { if (G.toast) G.toast(m); };
  G.SoTayBai = { mount, docLop, dsChuong };
})(window);
