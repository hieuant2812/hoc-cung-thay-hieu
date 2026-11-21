/* hinhtudong.js — Tự vẽ hình minh hoạ cho câu hình học chưa có hình (đọc đề, nhận dạng hình, tên đỉnh, điểm phụ).
   HinhTuDong.svg(de)  → chuỗi HTML <div class="hinh-td"><svg>…</svg></div>  hoặc "" nếu không nhận ra hình.
   HinhTuDong.tikz(de) → mã TikZ tương ứng (để chèn vào đề TeX) hoặc "".
   HinhTuDong.mau(de)  → mô hình {diem, canh, ...} (dùng để kiểm thử).
   Hình không gian: phép chiếu song song (trục sâu 40°, hệ số 0,55); cạnh khuất (nét đứt) tính theo mặt nhìn thấy.
   Chỉ đọc ĐỀ BÀI, không đọc phương án → không lộ đáp án. */
(function (G) {
  "use strict";
  const TOK = /[A-Z](?:_\{?\d+\}?|_\d)?'*/g;
  const toks = s => (String(s || "").match(TOK) || []).map(t => t.replace(/_\{?(\d+)\}?/, "_$1"));
  const CA = 0.55 * Math.cos(40 * Math.PI / 180), SA = 0.55 * Math.sin(40 * Math.PI / 180);
  const V = [-CA, 1, -SA]; // hướng nhìn (đi vào trong hình)
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = a => Math.hypot(a[0], a[1], a[2]);
  const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
  const tb = ps => mul(ps.reduce(add, [0, 0, 0]), 1 / ps.length);

  /* ---------------------------------------------------------------- làm phẳng đề: chữ thường ngoài $, giữ tên điểm trong $ */
  function phang(de) {
    let s = String(de || "");
    s = s.replace(/\\begin\{(center|minipage)\}[^]*?\\end\{\1\}/g, m => /tikzpicture/.test(m) ? " " : m);
    s = s.replace(/\\\(|\\\)/g, "$").replace(/\\\[|\\\]/g, "$");
    const parts = s.split("$");
    return parts.map((p, i) => {
      if (i % 2 === 0) return p.toLowerCase().replace(/\\[a-z]+/g, " ").replace(/[{}~]/g, " ");
      let m = p;
      m = m.replace(/\^\s*\{?\s*\\prime\s*\}?/g, "'").replace(/\^\s*\{?\s*\\circ\s*\}?/g, "°");
      m = m.replace(/\\(?:overrightarrow|vec|overline|mathrm|text|mathbf|boldsymbol)\s*\{([^{}]*)\}/g, " $1 ");
      m = m.replace(/\\(?:widehat|hat|angle)\s*\{?([A-Z'_0-9]+)\}?/g, " ∠$1 ");
      m = m.replace(/\\perp/g, " ⊥ ").replace(/\\(?:parallel|\|)|\/\//g, " ∥ ");
      m = m.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, " ($1)/($2) ");
      m = m.replace(/\\sqrt\s*\{([^{}]*)\}/g, "√($1)").replace(/\\(?:left|right|,|;|!|quad|qquad)/g, " ");
      m = m.replace(/\\cdot|\\times/g, "*").replace(/\\in\b/g, " ∈ ").replace(/\\cap\b/g, " ∩ ");
      m = m.replace(/\\[a-zA-Z]+/g, " ").replace(/[{}]/g, "");
      return " " + m.replace(/\s+/g, " ") + " ";
    }).join(" ").replace(/[ \t\n]+/g, " ");
  }
  const so = x => { x = String(x).replace(",", ".").replace(/[()]/g, ""); const f = /^([\d.]+)\/([\d.]+)$/.exec(x); return f ? +f[1] / +f[2] : parseFloat(x); };

  /* ---------------------------------------------------------------- mô hình */
  function moHinh(de) {
    if (!de || /tikzpicture|includegraphics|tkzTab|\\begin\{tabular/.test(de)) return null;
    const F = phang(de);
    const Fl = F.toLowerCase();
    if (/đồ thị|hàm số|mệnh đề (?:đảo|phủ định|kéo theo|tương đương|chứa biến)|mệnh đề ["“`']|\bđịnh lí|\bđịnh lý|phát biểu (?:định lí|lại)|phương trình đường|phương trình mặt/.test(Fl)) return null;
    const coToaDo = /[A-Z]'?\s*\(\s*-?[\d.,]+\s*;/.test(F) || /\boxyz?\b|toạ độ|tọa độ/.test(Fl);
    const M = { P: {}, ten: [], canh: [], mat: [], kg: false, vuong: [], tron: null, ghi: [] };
    const dat = (t, p) => { if (!t || M.P[t]) return; M.P[t] = p; M.ten.push(t); };
    const canh = (a, b, phu) => { if (!a || !b || a === b || !M.P[a] || !M.P[b]) return; if (M.canh.some(c => (c[0] === a && c[1] === b) || (c[0] === b && c[1] === a))) return; M.canh.push([a, b, phu ? 1 : 0]); };
    const mat = ds => { M.mat.push(ds); for (let i = 0; i < ds.length; i++) canh(ds[i], ds[(i + 1) % ds.length]); };
    const tai = re => { const m = re.exec(F); return m ? toks(m[1])[0] : null; };

    /* ---- đáy (đa giác phẳng z = 0, toạ độ [x, sâu, 0]) ---- */
    function day(loai, ten, opt) {
      const n = ten.length; opt = opt || {};
      let P;
      if (n === 3) {
        const vt = opt.vuong && ten.indexOf(opt.vuong), ct = opt.can && ten.indexOf(opt.can);
        const xoay = (arr, k) => arr.slice(k).concat(arr.slice(0, k)); // đưa đỉnh đặc biệt lên vị trí 1 (phía trước)
        if (opt.deu) P = [[-2.2, 1.27, 0], [0, -2.54, 0], [2.2, 1.27, 0]].map(p => [p[0], p[1] * .9, 0]);
        else if (vt >= 0 && vt !== false && opt.vuong) { const base = [[-2.6, 2.4, 0], [0, -.2, 0], [2.6, 2.4, 0]]; P = xoay(base, (3 - (vt - 1 + 3) % 3) % 3); P = ten.map((_, i) => base[(i - vt + 1 + 3) % 3]); }
        else if (opt.can) { const base = [[-2.4, 2.2, 0], [0, -1.4, 0], [2.4, 2.2, 0]]; P = ten.map((_, i) => base[(i - ct + 1 + 3) % 3]); }
        else P = [[-2.3, 1.9, 0], [-.4, -1.3, 0], [2.6, 1.4, 0]];
      } else if (n === 4) {
        const k = opt.ti || {};
        if (loai === "vuong") P = [[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0]];
        else if (loai === "cn") { const a = k.ab || 5, b = k.ad || 3.4; P = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0]]; }
        else if (loai === "thoi") P = [[0, 0, 0], [3.6, -1.2, 0], [5.2, 2.6, 0], [1.6, 3.8, 0]];
        else if (loai === "thang") {
          const d = opt.daySS || "AB";
          if (opt.thangVuong) P = d === "AD" ? [[0, 0, 0], [0, 3.6, 0], [3, 3.6, 0], [6, 0, 0]] : [[0, 0, 0], [6, 0, 0], [3, 3.6, 0], [0, 3.6, 0]];
          else P = d === "AD" ? [[0, 0, 0], [1.4, 3.4, 0], [4.6, 3.4, 0], [6.2, 0, 0]] : [[0, 0, 0], [6.2, 0, 0], [4.6, 3.4, 0], [1.4, 3.4, 0]];
        }
        else P = [[0, 0, 0], [4.4, 0, 0], [5.6, 3.6, 0], [1.2, 3.6, 0]]; // hình bình hành / tứ giác
        if (loai === "hbh" || loai === "thoi") { const pg = tuGiacGoc(loai, ten); if (pg) P = pg.map(q => [q[0], q[1], 0]); }
        if (loai === "tugiac") P = [[0, 0, 0], [4.6, -.4, 0], [5.4, 3.2, 0], [.8, 3.8, 0]];
      } else if (n === 6) P = ten.map((_, i) => { const a = Math.PI * (200 - 60 * i) / 180; return [2.6 * Math.cos(a), 2.6 * Math.sin(a) * 1.4, 0]; });
      else return null;
      ten.forEach((t, i) => dat(t, P[i]));
      return P;
    }
    function tuGiacGoc(loai, ten) { // hình bình hành / hình thoi có góc tại một đỉnh
      if (loai !== "hbh" && loai !== "thoi") return null;
      const [A, B, C, D] = ten;
      const re = new RegExp(`∠\\s*(?:${B}${A}${D}|${D}${A}${B}|${A})\\s*=\\s*([\\d.,]+)\\s*°`), re2 = new RegExp(`∠\\s*(?:${A}${B}${C}|${C}${B}${A}|${B})\\s*=\\s*([\\d.,]+)\\s*°`);
      let g = null, m1;
      if ((m1 = re.exec(F))) g = so(m1[1]); else if ((m1 = re2.exec(F))) g = 180 - so(m1[1]);
      if (!g || g <= 5 || g >= 175) return null;
      const t = g * Math.PI / 180;
      const dd = (x, y) => { const r = new RegExp(`(?:${x}${y}|${y}${x})\\s*=\\s*([\\d.,]+)\\s*\\*?\\s*a?\\b`).exec(F); return r ? so(r[1]) || 1 : null; };
      let ab = 4.4, ad = loai === "thoi" ? 4.4 : 3.2; const x1 = dd(A, B), x2 = dd(A, D) || dd(B, C);
      if (x1 && x2 && loai === "hbh") ad = 4.4 * Math.max(.35, Math.min(2.2, x2 / x1));
      const Bp = [ab, 0], Dp = [ad * Math.cos(t), ad * Math.sin(t)];
      return [[0, 0], Bp, [Bp[0] + Dp[0], Dp[1]], Dp];
    }
    function loaiDay(chu) {
      if (/hình vuông/.test(chu)) return "vuong";
      if (/chữ nhật/.test(chu)) return "cn";
      if (/hình thoi/.test(chu)) return "thoi";
      if (/hình thang/.test(chu)) return "thang";
      if (/bình hành/.test(chu)) return "hbh";
      return "tugiac";
    }
    function tiLe(ten) { // AB = a, AD = 2a ... (chỉ để chọn tỉ lệ đẹp)
      const o = {}; const g = (x, y) => { const re = new RegExp(`(?:${x}${y}|${y}${x})\\s*=\\s*([\\d.,]*)\\s*\\*?\\s*(?:√\\(?(\\d+)\\)?)?\\s*(a\\b)?`); const m = re.exec(F); if (!m || (!m[1] && !m[3] && !m[2])) return null; return (m[1] ? so(m[1]) : 1) * (m[2] ? Math.sqrt(+m[2]) : 1) || null; };
      const ab = g(ten[0], ten[1]), ad = g(ten[0], ten[3]) || g(ten[1], ten[2]);
      if (ab && ad) { const r = Math.max(.4, Math.min(2.5, ad / ab)); o.ab = 4.6; o.ad = 4.6 * r * (r > 1 ? .75 : 1); }
      return o;
    }
    const tamGiacOpt = (chu, ten) => {
      const o = {};
      const v = /vuông\s+(?:cân\s+)?tại\s+([A-Z]'?)/.exec(chu); if (v && ten.includes(toks(v[1])[0])) o.vuong = toks(v[1])[0];
      const c = /cân\s+tại\s+([A-Z]'?)/.exec(chu); if (c && ten.includes(toks(c[1])[0])) o.can = toks(c[1])[0];
      if (/tam giác đều|là tam giác đều|đáy đều|tam giác đều/.test(chu) && !o.vuong) o.deu = true;
      return o;
    };
    function thangOpt(ten) {
      const o = { daySS: "AB" };
      const [A, B, C, D] = ten;
      const ss = (x, y) => new RegExp(`(?:${x}|${x.split("").reverse().join("")})\\s*(?:∥|song song (?:với )?)\\s*(?:${y}|${y.split("").reverse().join("")})`).test(F);
      if (ss(A + D, B + C) || new RegExp(`đáy lớn (?:là )?\\s*(?:${A}${D}|${D}${A})|đáy (?:là )?\\s*(?:${A}${D}|${D}${A})\\s*(?:và|,)\\s*(?:${B}${C}|${C}${B})|đáy (?:là )?\\s*(?:${B}${C}|${C}${B})\\s*(?:và|,)\\s*(?:${A}${D}|${D}${A})`).test(F)) o.daySS = "AD";
      if (/thang vuông/.test(F)) o.thangVuong = true;
      return o;
    }

    /* ---- nhận dạng hình chính ---- */
    let m, khoi = null;
    const tenCham = /([A-Z](?:_\d)?'*(?:[A-Z](?:_\d)?'*){0,5})\s*\.\s*([A-Z](?:_\d)?'*(?:[A-Z](?:_\d)?'*){1,5})/;
    if ((m = new RegExp("(lập phương|hộp chữ nhật|hình hộp|lăng trụ|chóp)[^$]{0,60}?" + tenCham.source).exec(F))) {
      const tu = m[1], L = toks(m[2]), R = toks(m[3]);
      const sau = F.slice(m.index, m.index + 260);
      if (tu === "chóp" && L.length === 1 && (R.length === 3 || R.length === 4 || R.length === 6)) khoi = { k: "chop", S: L[0], day: R, sau };
      else if (tu !== "chóp" && L.length === R.length && (L.length === 3 || L.length === 4 || L.length === 6)) khoi = { k: tu === "lập phương" ? "lp" : tu === "hộp chữ nhật" ? "hcn" : tu === "hình hộp" ? (/hộp chữ nhật/.test(F) ? "hcn" : "hop") : "lt", d: L, t: R, sau };
    }
    if (!khoi && (m = /tứ diện\s*(?:đều\s*)?([A-Z](?:_\d)?'*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*)(?![A-Za-z'])/.exec(F))) khoi = { k: "td", d: toks(m[1]), deu: /tứ diện đều/.test(F) };
    if (!khoi && (m = /chóp\s*([A-Z](?:_\d)?'*)\s*\.?\s*([A-Z]{3,4})(?![A-Za-z'])/.exec(F))) khoi = { k: "chop", S: toks(m[1])[0], day: toks(m[2]), sau: F.slice(m.index, m.index + 260) };

    if (coToaDo && (!khoi || khoi.k === "td" || !/chọn hệ trục|chọn hệ toạ độ|chọn hệ tọa độ|gắn hệ/.test(Fl))) return null;
    let Hd = 4.6; // chiều cao
    if (khoi) {
      M.kg = true;
      if (khoi.k === "chop") {
        const ten = khoi.day; const n = ten.length;
        const sau = F;
        const deu = /chóp (?:tứ giác |tam giác |lục giác )?đều/.test(F);
        let opt = {}, loai = "hbh";
        const dayM = /đáy\s*(?:[A-Z']{3,6}\s*)?(?:là\s*)?(?:một\s*)?((?:hình [a-zà-ỹ ]{3,16}?|tam giác [a-zà-ỹ ]{0,14}?|tứ giác)(?:\s*(?:vuông|cân)?\s*tại\s*[A-Z]'?)?)(?=[,.;]|\s*(?:tâm|có|và|cạnh|với|,|biết|$|[A-Z]))/.exec(sau);
        const chu = dayM ? dayM[1] : (deu ? (n === 4 ? "hình vuông" : "tam giác đều") : "");
        if (n === 3) opt = tamGiacOpt(chu + (deu ? " tam giác đều" : ""), ten);
        else if (n === 4) { loai = deu ? "vuong" : loaiDay(chu); if (loai === "cn" || loai === "vuong") opt.ti = tiLe(ten); if (loai === "thang") Object.assign(opt, thangOpt(ten)); }
        if (!day(loai, ten, opt)) return null;
        diemPhu(true); // các điểm trên mặt đáy (trung điểm, tâm…) để đặt chân đường cao
        let chan = null, S = khoi.S;
        const vg = new RegExp(`${S}([A-Z]'?)\\s*(?:⊥|vuông góc (?:với )?)\\s*(?:mặt phẳng\\s*|mp\\s*)?(?:\\(\\s*${ten.join("")}\\s*\\)|\\(\\s*[A-Z]{3,4}\\s*\\)|(?:mặt\\s*)?(?:phẳng\\s*)?đáy)`).exec(F);
        if (vg && M.P[toks(vg[1])[0]]) chan = M.P[toks(vg[1])[0]];
        const hc = new RegExp(`hình chiếu (?:vuông góc )?(?:của (?:đỉnh )?${S} )?(?:lên|trên|xuống) (?:mặt phẳng |mặt )?(?:đáy|\\(\\s*[A-Z]{3,4}\\s*\\))\\s*(?:là|trùng với)\\s*(?:điểm\\s*)?([^,.;]{0,40})`).exec(F);
        if (!chan && hc) chan = viTri(hc[1]);
        const mb = /mặt bên\s*\(?\s*([A-Z]'?)([A-Z]'?)([A-Z]'?)\s*\)?[^.]{0,60}?(?:vuông góc với|⊥)\s*(?:mặt\s*)?(?:phẳng\s*)?(?:đáy|\(\s*[A-Z]{3,4}\s*\))/.exec(F);
        if (!chan && mb) { const ds = [mb[1], mb[2], mb[3]].filter(t => t !== S && M.P[t]); if (ds.length === 2) chan = lerp(M.P[ds[0]], M.P[ds[1]], .5); }
        if (!chan) { const fo = new RegExp(`${S}([A-Z])\\s*(?:⊥|vuông góc (?:với )?)\\s*(?:mặt phẳng\\s*)?(?:\\(\\s*[A-Z]{3,4}\\s*\\)|đáy)`).exec(F); if (fo) { const H = fo[1]; if (M.P[H]) chan = M.P[H]; else { diemPhu(true); if (M.P[H]) chan = M.P[H]; } } }
        const P0 = ten.map(t => M.P[t]);
        if (!chan) chan = tb(P0);
        const dai = Math.max(...P0.map(p => Math.hypot(p[0] - chan[0], p[1] - chan[1])));
        Hd = Math.max(4.2, dai * 1.15);
        dat(S, [chan[0], chan[1], Hd]);
        mat(ten.slice().reverse()); // đáy (pháp tuyến hướng xuống)
        for (let i = 0; i < n; i++) mat([S, ten[i], ten[(i + 1) % n]]);
        const chanTen = Object.keys(M.P).find(t => t !== S && M.P[t] === chan);
        if (chanTen && !ten.includes(chanTen)) canh(S, chanTen, true);
      } else if (khoi.k === "td") {
        const [A, B, C, D] = khoi.d;
        const dm = /đôi một vuông góc/.test(F);
        if (dm) { const g = /([A-Z])[A-Z]\s*,\s*\1[A-Z]\s*,\s*\1[A-Z]\s*đôi một vuông góc/.exec(F); const O = g && khoi.d.includes(g[1]) ? g[1] : A; const r = khoi.d.filter(x => x !== O); dat(O, [0, 0, 0]); dat(r[0], [0, 0, 4.2]); dat(r[1], [0, -4.2, 0]); dat(r[2], [4.4, 0, 0]); }
        else if (khoi.deu) { dat(B, [-2.3, 1.3, 0]); dat(C, [0, -2.6, 0]); dat(D, [2.3, 1.3, 0]); dat(A, [0, 0, 3.75]); }
        else { dat(B, [-2.4, 1.6, 0]); dat(C, [-.2, -1.8, 0]); dat(D, [2.8, 1.0, 0]); dat(A, [-.8, .4, 4.4]); }
        const sau = F.slice(0);
        const vg = new RegExp(`${A}([A-Z]'?)\\s*(?:⊥|vuông góc (?:với )?)\\s*(?:mặt phẳng\\s*)?\\(\\s*${B}${C}${D}\\s*\\)`).exec(sau);
        if (vg && !dm && M.P[vg[1]]) { const p = M.P[vg[1]]; M.P[A] = [p[0], p[1], 4.4]; }
        mat([B, C, D].reverse()); mat([A, B, C]); mat([A, C, D]); mat([A, D, B]);
        // hướng các mặt cho đúng (pháp tuyến ra ngoài)
        chinhHuongMat();
      } else {
        const L = khoi.d, R = khoi.t, n = L.length;
        let loai = khoi.k === "lp" ? "vuong" : khoi.k === "hcn" ? "cn" : khoi.k === "hop" ? "hbh" : "hbh";
        let opt = {};
        if (khoi.k === "lt") {
          const chu = (/đáy\s*(?:[A-Z']{3,4}\s*)?(?:là\s*)?((?:hình [a-zà-ỹ ]{3,16}?|tam giác [a-zà-ỹ ]{0,14}?)(?:\s*(?:vuông|cân)?\s*tại\s*[A-Z]'?)?)(?=[,.;]|\s*(?:tâm|có|và|cạnh|với|biết|$|[A-Z]))/.exec(F) || [])[1] || (/lăng trụ (?:tam giác |tứ giác )?đều/.test(F) ? (n === 4 ? "hình vuông" : "tam giác đều") : "");
          if (n === 3) opt = tamGiacOpt(chu, L); else if (n === 4) loai = loaiDay(chu || "hình bình hành");
          if (n === 4 && loai === "thang") Object.assign(opt, thangOpt(L));
        }
        if (n === 4 && (loai === "cn")) opt.ti = tiLe(L);
        if (!day(loai, L, opt)) return null;
        const P0 = L.map(t => M.P[t]);
        let h = khoi.k === "lp" ? 4 : khoi.k === "hcn" ? 3.4 : 4.2;
        if (khoi.k === "hcn") { const r = new RegExp(`(?:${L[0]}${R[0]}|${R[0]}${L[0]})\\s*=\\s*([\\d.,]+)?\\s*(?:a\\b)?`).exec(F), r2 = new RegExp(`(?:${L[0]}${L[1]}|${L[1]}${L[0]})\\s*=\\s*([\\d.,]+)?\\s*(?:a\\b)?`).exec(F); if (r && r2 && (r[1] || r2[1])) h = Math.max(1.6, Math.min(7, (opt.ti && opt.ti.ab || 4.6) * so(r[1] || 1) / so(r2[1] || 1))); }
        const dung = khoi.k !== "lt" || /lăng trụ (?:tam giác |tứ giác )?(?:đứng|đều)/.test(F);
        const lech = khoi.k === "hop" ? [.9, .5, 0] : dung ? [0, 0, 0] : [1.1, .6, 0];
        R.forEach((t, i) => dat(t, add(add(P0[i], [0, 0, h]), lech)));
        mat(L.slice().reverse()); mat(R.slice());
        for (let i = 0; i < n; i++) mat([L[i], L[(i + 1) % n], R[(i + 1) % n], R[i]]);
        chinhHuongMat();
      }
    } else {
      /* ---- hình phẳng ---- */
      let t;
      if ((t = /lục giác đều\s*([A-Z]{6})/.exec(F))) { phang6(toks(t[1])); }
      else if ((t = /(hình bình hành|hình vuông|hình chữ nhật|hình thoi|hình thang(?: vuông| cân)?|tứ giác(?: lồi)?)\s*([A-Z](?:_\d)?'*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*)(?![A-Za-z'])/.exec(F))) {
        const ten = toks(t[2]); const loai = loaiDay(t[1]);
        let P;
        if (loai === "vuong") P = [[0, 0], [4, 0], [4, 4], [0, 4]];
        else if (loai === "cn") { const o = tiLe(ten); P = [[0, 0], [o.ab || 5.2, 0], [o.ab || 5.2, o.ad ? o.ad * 1.2 : 3.2], [0, o.ad ? o.ad * 1.2 : 3.2]]; }
        else if (loai === "thoi") P = [[0, 0], [3.4, -1.9], [6.8, 0], [3.4, 1.9]].map(p => [p[0], p[1]]);
        else if (loai === "thang") { const o = thangOpt(ten); P = o.daySS === "AD" ? (o.thangVuong ? [[0, 0], [0, 3], [3, 3], [5.6, 0]] : [[0, 0], [1.4, 3], [4.2, 3], [5.8, 0]]) : (o.thangVuong ? [[0, 0], [5.6, 0], [3, 3], [0, 3]] : (/thang cân/.test(F) ? [[0, 0], [5.8, 0], [4.3, 3], [1.5, 3]] : [[0, 0], [5.8, 0], [4.2, 3], [1.1, 3]])); }
        else if (loai === "hbh") P = [[0, 0], [4.6, 0], [5.9, 3], [1.3, 3]];
        else P = [[0, 0], [5, -.3], [5.8, 3.1], [.7, 3.6]];
        if (loai === "thoi") P = [[0, 1.9], [3.4, 0], [6.8, 1.9], [3.4, 3.8]];
        const pg = tuGiacGoc(loai, ten); if (pg) P = pg;
        ten.forEach((x, i) => dat(x, [P[i][0], P[i][1], 0])); mat(ten);
        const tam = new RegExp(`(?:${t[1]}\\s*${ten.join("")}\\s*(?:có\\s*)?tâm\\s*|tâm\\s*(?:của\\s*)?(?:hình\\s*[a-zà-ỹ ]*?)?${ten.join("")}\\s*(?:là\\s*)?)([A-Z])`).exec(F);
        if (tam) { const O = tam[1]; dat(O, tb(ten.map(x => M.P[x]))); canh(ten[0], ten[2], 1); canh(ten[1], ten[3], 1); }
      } else if ((t = /tam giác\s*(?:[a-zà-ỹ]+\s*){0,3}?([A-Z](?:_\d)?'*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*)(?![A-Za-z'])/.exec(F))) {
        const ten = toks(t[1]);
        const chu = F.slice(t.index, t.index + 90);
        const o = tamGiacOpt(chu, ten);
        tamGiac2D(ten, o);
        if (new RegExp(`(?:nội tiếp|ngoại tiếp tam giác ${ten.join("")}|đường tròn ngoại tiếp)`).test(F)) M.tron = "ngoai";
        else if (/đường tròn nội tiếp|ngoại tiếp đường tròn/.test(F)) M.tron = "noi";
      } else return null;
    }
    if (!M.ten.length) return null;

    /* ---- điểm phụ: trung điểm, trọng tâm, tâm, chân đường vuông góc, điểm chia ---- */
    function viTri(cum) { // "trung điểm của AB" | "trọng tâm tam giác ABC" | "H" | "tâm O"...
      cum = String(cum || "");
      let r;
      if ((r = /trung điểm (?:của )?(?:cạnh |đoạn (?:thẳng )?)?([A-Z]'?)([A-Z]'?)/.exec(cum)) && M.P[r[1]] && M.P[r[2]]) return lerp(M.P[r[1]], M.P[r[2]], .5);
      if ((r = /trọng tâm (?:của )?(?:tam giác |mặt )?([A-Z]'?)([A-Z]'?)([A-Z]'?)/.exec(cum)) && M.P[r[1]] && M.P[r[2]] && M.P[r[3]]) return tb([M.P[r[1]], M.P[r[2]], M.P[r[3]]]);
      if (/tâm|giao điểm (?:của )?hai đường chéo/.test(cum)) { const d = M.mat[0] ? null : null; const ds = M.ten.filter(t => Math.abs(M.P[t][2]) < 1e-9); if (ds.length >= 3) return tb(ds.map(t => M.P[t])); }
      const t = toks(cum)[0]; if (t && M.P[t]) return M.P[t];
      return null;
    }
    function chanDT(p, a, b) { const d = sub(b, a), t = dot(sub(p, a), d) / dot(d, d); return lerp(a, b, t); }
    function chanMP(p, a, b, c) { const n = cross(sub(b, a), sub(c, a)); const k = dot(sub(p, a), n) / dot(n, n); return sub(p, mul(n, k)); }
    function diemPhu(chiDay) {
      for (let lap = 0; lap < 3; lap++) {
        let r;
        // M, N lần lượt là trung điểm của AB, CD
        const reTD = /((?:[A-Z](?:_\d)?'*\s*(?:,|và)\s*)*[A-Z](?:_\d)?'*)\s*(?:lần lượt\s*)?là\s*(?:các\s*)?trung điểm\s*(?:của\s*)?(?:các\s*)?(?:cạnh|đoạn(?: thẳng)?)?\s*((?:[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*\s*(?:,|và)\s*)*[A-Z](?:_\d)?'*[A-Z](?:_\d)?'*)(?![A-Z])/g;
        while ((r = reTD.exec(F))) {
          let ds = toks(r[1]); const segs = r[2].split(/\s*(?:,|và)\s*/).map(toks).filter(x => x.length === 2);
          if (ds.length > segs.length) ds = ds.slice(ds.length - segs.length);
          ds.forEach((d, i) => { const s = segs[i]; if (s && M.P[s[0]] && M.P[s[1]] && (!chiDay || (M.P[s[0]][2] === 0 && M.P[s[1]][2] === 0))) dat(d, lerp(M.P[s[0]], M.P[s[1]], .5)); });
        }
        const reTD2 = /trung điểm\s*([A-Z](?:_\d)?'*)\s*(?:của\s*)?(?:cạnh|đoạn(?: thẳng)?)?\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)(?![A-Z])/g;
        while ((r = reTD2.exec(F))) { const [d, a, b] = [toks(r[1])[0], toks(r[2])[0], toks(r[3])[0]]; if (M.P[a] && M.P[b] && (!chiDay || (M.P[a][2] === 0 && M.P[b][2] === 0))) dat(d, lerp(M.P[a], M.P[b], .5)); }
        // trọng tâm
        const reTT = /([A-Z](?:_\d)?'*)\s*là\s*trọng tâm\s*(?:của\s*)?(?:tam giác|mặt|△)?\s*\(?\s*([A-Z]'?)([A-Z]'?)([A-Z]'?)/g;
        while ((r = reTT.exec(F))) { const ps = [r[2], r[3], r[4]].map(x => M.P[x]); if (ps.every(Boolean) && (!chiDay || ps.every(p => p[2] === 0))) dat(toks(r[1])[0], tb(ps)); }
        const reTT2 = /trọng tâm\s*([A-Z](?:_\d)?'*)\s*(?:của\s*)?(?:tam giác|mặt)\s*([A-Z]'?)([A-Z]'?)([A-Z]'?)/g;
        while ((r = reTT2.exec(F))) { const ps = [r[2], r[3], r[4]].map(x => M.P[x]); if (ps.every(Boolean) && (!chiDay || ps.every(p => p[2] === 0))) dat(toks(r[1])[0], tb(ps)); }
        if ((r = /(?:có\s*|với\s*|gọi\s*)?trọng tâm\s*(?:là\s*)?([A-Z])(?![A-Za-z'])(?!\s*(?:của|là))/.exec(F))) { const tg = M.ten.slice(0, 3); if (tg.length === 3 && !M.P[r[1]] && (!chiDay || tg.every(t => M.P[t][2] === 0))) dat(r[1], tb(tg.map(t => M.P[t]))); }
        // tâm O của đáy / giao điểm hai đường chéo
        const quad = M.ten.filter(t => M.P[t][2] === 0).slice(0, 4);
        if (quad.length === 4 || quad.length === 6) {
          const [A, B, C, D] = quad;
          const reO = new RegExp(`(?:tâm\\s*([A-Z])(?![A-Za-z'])|([A-Z])\\s*là\\s*(?:tâm|giao điểm (?:của\\s*)?(?:hai đường chéo|${A}${C}\\s*và\\s*${B}${D}|${B}${D}\\s*và\\s*${A}${C}))|(?:${A}${C}|${C}${A})\\s*(?:và\\s*(?:${B}${D}|${D}${B})\\s*)?cắt\\s*(?:${B}${D}|${D}${B}|nhau)?\\s*tại\\s*([A-Z])|(?:hai đường chéo|${A}${C}\\s*và\\s*${B}${D})\\s*cắt nhau tại\\s*([A-Z]))`);
          if ((r = reO.exec(F))) { const O = r[1] || r[2] || r[3] || r[4]; if (!M.P[O]) { const p = quad.length === 4 ? giaoCheo(M.P[A], M.P[B], M.P[C], M.P[D]) : tb(quad.map(x => M.P[x])); dat(O, p); if (quad.length === 4) { canh(A, C, 1); canh(B, D, 1); } } }
        }
        // XY cắt ZW tại I / XY và ZW cắt nhau tại I
        const reG = /([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)\s*(?:và\s*(?:đường thẳng\s*)?([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)\s*)?cắt\s*(?:nhau\s*)?(?:(?:đường thẳng|cạnh|đoạn)?\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)\s*)?tại\s*(?:điểm\s*)?([A-Z](?:_\d)?'*)(?![A-Za-z])/g;
        while ((r = reG.exec(F))) {
          const a = toks(r[1])[0], b = toks(r[2])[0], c = toks(r[3] || r[5] || "")[0], d = toks(r[4] || r[6] || "")[0], I = toks(r[7])[0];
          if (!c || !d || M.P[I] || ![a, b, c, d].every(x => M.P[x])) continue;
          const p = giaoDT(M.P[a], M.P[b], M.P[c], M.P[d]); if (!p) continue;
          dat(I, p); canh(a, b, 1); canh(c, d, 1);
          [[a, b], [c, d]].forEach(([x, y]) => { const t = dot(sub(p, M.P[x]), sub(M.P[y], M.P[x])) / dot(sub(M.P[y], M.P[x]), sub(M.P[y], M.P[x])); if (t > 1.001) canh(y, I, 1); else if (t < -.001) canh(x, I, 1); });
        }
        if (chiDay) continue;
        // điểm chia trên cạnh: M thuộc cạnh SB sao cho SM = 2MB
        const reTh = /([A-Z](?:_\d)?'*)\s*(?:là\s*(?:một\s*)?điểm\s*(?:nằm\s*)?)?(?:thuộc|nằm trên|trên|di động trên)\s*(?:cạnh|đoạn(?: thẳng)?|đường thẳng|tia)?\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)(?![A-Z])/g;
        while ((r = reTh.exec(F))) { const [d, a, b] = [toks(r[1])[0], toks(r[2])[0], toks(r[3])[0]]; if (!M.P[d] && M.P[a] && M.P[b]) dat(d, lerp(M.P[a], M.P[b], tiSo(d, a, b))); }
        const reTh2 = /trên\s*(?:cạnh|đoạn(?: thẳng)?)\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)\s*lấy\s*(?:điểm\s*)?([A-Z](?:_\d)?'*)/g;
        while ((r = reTh2.exec(F))) { const [a, b, d] = [toks(r[1])[0], toks(r[2])[0], toks(r[3])[0]]; if (!M.P[d] && M.P[a] && M.P[b]) dat(d, lerp(M.P[a], M.P[b], tiSo(d, a, b))); }
        // H là hình chiếu (vuông góc) của A lên BC / (SBC)
        const reHC = /([A-Z](?:_\d)?'*)\s*là\s*hình chiếu\s*(?:vuông góc\s*)?(?:của\s*)?(?:điểm\s*)?([A-Z](?:_\d)?'*)\s*(?:lên|trên|xuống)\s*(?:đường thẳng|cạnh|mặt phẳng|mp)?\s*(\(?)\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)?\s*\)?/g;
        while ((r = reHC.exec(F))) {
          const H = toks(r[1])[0], A = toks(r[2])[0]; const ds = [r[4], r[5], r[6]].filter(Boolean).map(x => toks(x)[0]);
          if (M.P[H] || !M.P[A] || !ds.every(x => M.P[x])) continue;
          if (ds.length === 3 && r[3]) { dat(H, chanMP(M.P[A], M.P[ds[0]], M.P[ds[1]], M.P[ds[2]])); canh(A, H, 1); }
          else if (ds.length >= 2) { dat(H, chanDT(M.P[A], M.P[ds[0]], M.P[ds[1]])); canh(A, H, 1); M.vuong.push([ds[0], H, A]); }
        }
        // đường cao AH / kẻ AH ⊥ BC / trung tuyến AM / phân giác AD
        const reDC = /(đường cao|trung tuyến|kẻ|vẽ|hạ)\s*([A-Z](?:_\d)?'*)([A-Z](?:_\d)?'*)(?:\s*(?:⊥|vuông góc (?:với\s*)?)\s*(?:cạnh\s*)?([A-Z]'?)([A-Z]'?))?/g;
        while ((r = reDC.exec(F))) {
          const A = toks(r[2])[0], H = toks(r[3])[0]; if (!M.P[A] || M.P[H]) continue;
          let a = r[4] && toks(r[4])[0], b = r[5] && toks(r[5])[0];
          if (!a) { const tg = M.ten.filter(t => t !== A && M.P[t][2] === M.P[A][2]); if (M.kg || tg.length < 2) continue; [a, b] = tg; }
          if (!M.P[a] || !M.P[b]) continue;
          if (r[1] === "trung tuyến") dat(H, lerp(M.P[a], M.P[b], .5));
          else if (r[1] === "đường cao" || r[4]) { dat(H, chanDT(M.P[A], M.P[a], M.P[b])); M.vuong.push([a, H, A]); }
          else continue;
          canh(A, H);
        }
      }
    }
    function tiSo(d, a, b) {
      const cap = (x, y) => `(?:${x}${y}|${y}${x})`;
      const NUM = "([\\d.,]+|\\([\\d.,]+\\)/\\([\\d.,]+\\))";
      let r;
      if ((r = new RegExp(`${cap(a, d)}\\s*=\\s*${NUM}\\s*\\*?\\s*${cap(d, b)}`).exec(F))) { const k = so(r[1]); return k / (k + 1); }
      if ((r = new RegExp(`${cap(d, b)}\\s*=\\s*${NUM}\\s*\\*?\\s*${cap(a, d)}`).exec(F))) { const k = so(r[1]); return 1 / (k + 1); }
      if ((r = new RegExp(`${cap(a, d)}\\s*=\\s*${NUM}\\s*\\*?\\s*${cap(a, b)}`).exec(F))) return Math.min(.95, so(r[1]));
      if ((r = new RegExp(`${cap(d, b)}\\s*=\\s*${NUM}\\s*\\*?\\s*${cap(a, b)}`).exec(F))) return 1 - Math.min(.95, so(r[1]));
      if ((r = new RegExp(`${cap(a, d)}\\s*/\\s*${cap(d, b)}\\s*=\\s*${NUM}`).exec(F)) || (r = new RegExp(`\\(${cap(a, d)}\\)\\s*/\\s*\\(${cap(d, b)}\\)\\s*=\\s*${NUM}`).exec(F))) { const k = so(r[1]); return k / (k + 1); }
      return .4;
    }
    function giaoDT(A, B, C, D) { // giao hai đường thẳng AB, CD trong không gian (nếu cắt nhau)
      const u = sub(B, A), v = sub(D, C), w = sub(A, C); const a = dot(u, u), b = dot(u, v), c = dot(v, v), d = dot(u, w), e = dot(v, w); const den = a * c - b * b;
      if (Math.abs(den) < 1e-9) return null; const t = (b * e - c * d) / den, s2 = (a * e - b * d) / den;
      const P = add(A, mul(u, t)), Q = add(C, mul(v, s2)); if (len(sub(P, Q)) > 1e-4) return null; return P;
    }
    function giaoCheo(A, B, C, D) { // giao AC và BD (cùng mặt phẳng z)
      const x1 = A[0], y1 = A[1], x2 = C[0], y2 = C[1], x3 = B[0], y3 = B[1], x4 = D[0], y4 = D[1];
      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4); if (Math.abs(den) < 1e-9) return tb([A, B, C, D]);
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den; return lerp(A, C, t);
    }
    function chinhHuongMat() { // đảo thứ tự đỉnh để pháp tuyến hướng ra ngoài
      const c = tb(M.ten.map(t => M.P[t]));
      M.mat = M.mat.map(ds => { const p = ds.map(t => M.P[t]); const n = cross(sub(p[1], p[0]), sub(p[2], p[0])); return dot(n, sub(tb(p), c)) < 0 ? ds.slice().reverse() : ds; });
    }
    function phang6(ten) { ten.forEach((t, i) => { const a = Math.PI * (180 - 60 * i) / 180; dat(t, [3 * Math.cos(a), 3 * Math.sin(a), 0]); }); mat(ten); const tam = /tâm\s*([A-Z])(?![A-Za-z'])/.exec(F); if (tam) dat(tam[1], [0, 0, 0]); }
    function tamGiac2D(ten, o) {
      const [A, B, C] = ten;
      // dựng từ số liệu nếu đủ (3 cạnh, hoặc 2 cạnh + góc xen giữa)
      const canhSo = (x, y) => { const r = new RegExp(`(?:${x}${y}|${y}${x})\\s*=\\s*([\\d.,]+)(?!\\s*\\*?\\s*[a-z√(])`).exec(F); return r ? so(r[1]) : null; };
      const goc = x => { const r = new RegExp(`∠\\s*(?:[A-Z]'?${x}[A-Z]'?|${x})\\s*=\\s*([\\d.,]+)\\s*°`).exec(F); return r ? so(r[1]) * Math.PI / 180 : null; };
      const a = canhSo(B, C), b = canhSo(A, C), c = canhSo(A, B);
      let P = null;
      if (a && b && c && a < b + c && b < a + c && c < a + b) { const x = (c * c + a * a - b * b) / (2 * a); P = [[x, Math.sqrt(Math.max(0, c * c - x * x))], [0, 0], [a, 0]]; }
      if (!P) {
        const gA = goc(A), gB = goc(B), gC = goc(C);
        if (b && c && gA) P = [[0, 0], [c, 0], [b * Math.cos(gA), b * Math.sin(gA)]];
        else if (a && c && gB) P = [[c * Math.cos(gB), c * Math.sin(gB)], [0, 0], [a, 0]];
        else if (a && b && gC) P = [[a - b * Math.cos(gC), b * Math.sin(gC)], [0, 0], [a, 0]];
        if (P) { const ys = P.map(q => q[1]); if (Math.min(...ys) < -1e-9) P = P.map(q => [q[0], -q[1]]); }
      }
      if (!P) {
        if (o.vuong) { const k = ten.indexOf(o.vuong); const T = [[0, 3.2], [0, 0], [4.4, 0]]; P = ten.map((_, i) => T[(i - k + 1 + 3) % 3]); }
        else if (o.deu) P = [[2.2, 3.81], [0, 0], [4.4, 0]];
        else if (o.can) { const k = ten.indexOf(o.can); const T = [[2.3, 3.4], [0, 0], [4.6, 0]]; P = ten.map((_, i) => T[(i - k + 3) % 3]); }
        else P = [[1.5, 3.3], [0, 0], [5, 0]];
      }
      ten.forEach((t, i) => dat(t, [P[i][0], P[i][1], 0])); mat(ten);
      if (o.vuong) { const k = ten.indexOf(o.vuong); M.vuong.push([ten[(k + 1) % 3], ten[k], ten[(k + 2) % 3]]); }
    }
    if (!M.kg) diemPhu(false); else diemPhu(false);

    /* ---- đoạn thẳng, mặt phẳng được nhắc trong đề (chỉ phần đề, không đọc phương án) ---- */
    const daNoi = new Set();
    const cum = F.match(/[A-Z](?:_\d)?'*(?:[A-Z](?:_\d)?'*)+|\(\s*[A-Z](?:_\d)?'*(?:[A-Z](?:_\d)?'*){2,3}\s*\)/g) || [];
    let them = 0;
    cum.forEach(c => {
      if (them > 10) return;
      const ts = toks(c); const ngoac = c[0] === "(";
      if (ts.some(t => !M.P[t])) return;
      if (ts.length === 2) { if (!daNoi.has(ts.join())) { daNoi.add(ts.join()); const n0 = M.canh.length; canh(ts[0], ts[1], 1); if (M.canh.length > n0) them++; } }
      else if (ts.length === 3 && (ngoac || M.kg)) { const n0 = M.canh.length; canh(ts[0], ts[1], 1); canh(ts[1], ts[2], 1); canh(ts[0], ts[2], 1); them += M.canh.length - n0; }
    });
    if (M.ten.length < 3) return null;
    return M;
  }

  /* ---------------------------------------------------------------- chiếu & khuất */
  const chieu = (p, kg) => kg ? [p[0] + CA * p[1], p[2] + SA * p[1]] : [p[0], p[1]];
  function tinh(M) {
    const P2 = {}; M.ten.forEach(t => P2[t] = chieu(M.P[t], M.kg));
    const thay = M.mat.map(ds => {
      if (!M.kg) return true;
      const p = ds.map(t => M.P[t]); const n = cross(sub(p[1], p[0]), sub(p[2], p[0]));
      return dot(n, V) < -1e-9;
    });
    const trenMat = (t, ds) => { // điểm t nằm trên mặt ds (đồng phẳng & trong đa giác — xét đồng phẳng là đủ cho hình lồi)
      const p = ds.map(x => M.P[x]); const n = cross(sub(p[1], p[0]), sub(p[2], p[0])); const L = len(n) || 1;
      if (Math.abs(dot(sub(M.P[t], p[0]), n)) / L > 1e-6) return false;
      // trong đa giác: tổng hướng
      const q = M.P[t]; let dau = 0;
      for (let i = 0; i < p.length; i++) { const c = dot(cross(sub(p[(i + 1) % p.length], p[i]), sub(q, p[i])), n); if (Math.abs(c) < 1e-9) continue; const s = Math.sign(c); if (dau && s !== dau) return false; dau = s; }
      return true;
    };
    const canh = M.canh.map(([a, b, phu]) => {
      let khuat = false;
      if (M.kg) {
        const chung = M.mat.map((ds, i) => i).filter(i => trenMat(a, M.mat[i]) && trenMat(b, M.mat[i]));
        khuat = !chung.some(i => thay[i]);
        if (!chung.length) khuat = true; // đoạn đi xuyên trong khối
      }
      return { a, b, khuat, phu };
    });
    return { P2, canh };
  }

  /* ---------------------------------------------------------------- nhãn */
  function nhan(t) { const m = /^([A-Z])(?:_(\d+))?('*)$/.exec(t); if (!m) return { c: t, s: "", p: "" }; return { c: m[1], s: m[2] || "", p: m[3] || "" }; }
  function bo(M, R) {
    const pts = Object.values(R.P2); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let tron = null;
    if (M.tron && !M.kg) {
      const [A, B, C] = M.ten.slice(0, 3).map(t => R.P2[t]);
      if (M.tron === "ngoai") { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])); if (Math.abs(d) > 1e-9) { const ux = ((A[0] ** 2 + A[1] ** 2) * (B[1] - C[1]) + (B[0] ** 2 + B[1] ** 2) * (C[1] - A[1]) + (C[0] ** 2 + C[1] ** 2) * (A[1] - B[1])) / d, uy = ((A[0] ** 2 + A[1] ** 2) * (C[0] - B[0]) + (B[0] ** 2 + B[1] ** 2) * (A[0] - C[0]) + (C[0] ** 2 + C[1] ** 2) * (B[0] - A[0])) / d; tron = [ux, uy, Math.hypot(A[0] - ux, A[1] - uy)]; } }
      else { const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]), p = a + b + c; const ix = (a * A[0] + b * B[0] + c * C[0]) / p, iy = (a * A[1] + b * B[1] + c * C[1]) / p; const s = p / 2; tron = [ix, iy, Math.sqrt((s - a) * (s - b) * (s - c) / s)]; }
      if (tron) { x0 = Math.min(x0, tron[0] - tron[2]); x1 = Math.max(x1, tron[0] + tron[2]); y0 = Math.min(y0, tron[1] - tron[2]); y1 = Math.max(y1, tron[1] + tron[2]); }
    }
    return { x0, x1, y0, y1, tron };
  }
  function huongNhan(M, R, t) {
    const P = R.P2[t]; const c = (() => { const ps = M.ten.filter(x => !phuThuoc(M, x)).map(x => R.P2[x]); const n = ps.length || 1; return [ps.reduce((s, p) => s + p[0], 0) / n, ps.reduce((s, p) => s + p[1], 0) / n]; })();
    let d = [P[0] - c[0], P[1] - c[1]];
    // điểm nằm trên một cạnh: đẩy nhãn vuông góc với cạnh
    const tren = R.canh.find(e => e.a !== t && e.b !== t && !e.phu && giua(R.P2[e.a], R.P2[e.b], P));
    if (tren) { const A = R.P2[tren.a], B = R.P2[tren.b]; let n = [-(B[1] - A[1]), B[0] - A[0]]; if (n[0] * d[0] + n[1] * d[1] < 0) n = [-n[0], -n[1]]; d = n; }
    const L = Math.hypot(d[0], d[1]); if (L < 1e-6) return [0, 1];
    return [d[0] / L, d[1] / L];
  }
  const phuThuoc = (M, t) => false;
  function giua(A, B, P) { const ab = [B[0] - A[0], B[1] - A[1]], ap = [P[0] - A[0], P[1] - A[1]]; const cr = ab[0] * ap[1] - ab[1] * ap[0], L = Math.hypot(ab[0], ab[1]); if (Math.abs(cr) / L > 1e-3 * L + 1e-6) return false; const t = (ab[0] * ap[0] + ab[1] * ap[1]) / (L * L); return t > 1e-3 && t < 1 - 1e-3; }

  /* ---------------------------------------------------------------- SVG */
  function svg(de, o) {
    o = o || {};
    let M; try { M = moHinh(de); } catch (e) { return ""; }
    if (!M) return "";
    const R = tinh(M); const B = bo(M, R);
    const W = o.w || 230, H = o.h || 200, pad = 22;
    const bw = Math.max(B.x1 - B.x0, 1e-6), bh = Math.max(B.y1 - B.y0, 1e-6);
    const k = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh, 46);
    const w = Math.round(bw * k + 2 * pad), h = Math.round(bh * k + 2 * pad);
    const X = p => (p[0] - B.x0) * k + pad, Y = p => h - ((p[1] - B.y0) * k + pad);
    const mau = "#1d2742";
    let s = "";
    if (B.tron) s += `<circle cx="${X(B.tron).toFixed(1)}" cy="${Y(B.tron).toFixed(1)}" r="${(B.tron[2] * k).toFixed(1)}" fill="none" stroke="${mau}" stroke-width="1.3"/>`;
    // ô vuông góc
    M.vuong.forEach(([a, b, c]) => {
      if (!R.P2[a] || !R.P2[b] || !R.P2[c]) return;
      const P = [X(R.P2[b]), Y(R.P2[b])], u = [X(R.P2[a]) - P[0], Y(R.P2[a]) - P[1]], v = [X(R.P2[c]) - P[0], Y(R.P2[c]) - P[1]];
      const lu = Math.hypot(...u), lv = Math.hypot(...v); if (!lu || !lv) return; const e = 8;
      const p1 = [P[0] + u[0] / lu * e, P[1] + u[1] / lu * e], p3 = [P[0] + v[0] / lv * e, P[1] + v[1] / lv * e], p2 = [p1[0] + v[0] / lv * e, p1[1] + v[1] / lv * e];
      s += `<path d="M${p1.map(z => z.toFixed(1))} L${p2.map(z => z.toFixed(1))} L${p3.map(z => z.toFixed(1))}" fill="none" stroke="${mau}" stroke-width="1"/>`;
    });
    R.canh.slice().sort((p, q) => (q.khuat - p.khuat)).forEach(e => {
      const A = R.P2[e.a], C = R.P2[e.b];
      s += `<line x1="${X(A).toFixed(1)}" y1="${Y(A).toFixed(1)}" x2="${X(C).toFixed(1)}" y2="${Y(C).toFixed(1)}" stroke="${mau}" stroke-width="${e.khuat ? 1.1 : 1.5}"${e.khuat ? ' stroke-dasharray="5 3.5"' : ""} stroke-linecap="round"/>`;
    });
    M.ten.forEach(t => {
      const P = R.P2[t], d = huongNhan(M, R, t), n = nhan(t);
      const x = X(P) + d[0] * 11, y = Y(P) - d[1] * 11;
      s += `<circle cx="${X(P).toFixed(1)}" cy="${Y(P).toFixed(1)}" r="1.9" fill="${mau}"/>`;
      s += `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-family="KaTeX_Math,'Times New Roman',serif" font-style="italic" font-size="16" fill="${mau}">${n.c}${n.s ? `<tspan font-size="11" dy="3" font-style="normal">${n.s}</tspan>` : ""}${n.p ? `<tspan font-style="normal"${n.s ? ' dy="-3"' : ""}>${n.p.replace(/'/g, "′")}</tspan>` : ""}</text>`;
    });
    return `<div class="hinh-td" title="Hình minh hoạ do web tự vẽ từ đề bài"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="width:${(w / 16).toFixed(2)}em;height:auto" role="img" aria-label="Hình minh hoạ">${s}</svg></div>`;
  }

  /* ---------------------------------------------------------------- TikZ (để chèn vào đề TeX) */
  function tikz(de) {
    let M; try { M = moHinh(de); } catch (e) { return ""; }
    if (!M) return "";
    const R = tinh(M); const B = bo(M, R);
    const k = Math.min(5.2 / Math.max(B.x1 - B.x0, 1e-6), 4.2 / Math.max(B.y1 - B.y0, 1e-6), 1.1);
    const f = v => (+v.toFixed(2)).toString();
    const C = p => `(${f((p[0] - B.x0) * k)},${f((p[1] - B.y0) * k)})`;
    const tex = t => { const n = nhan(t); return n.c + (n.s ? `_${n.s}` : "") + n.p; };
    let s = "\\begin{tikzpicture}[line join=round,line cap=round,font=\\small]\n";
    const kh = R.canh.filter(e => e.khuat), th = R.canh.filter(e => !e.khuat);
    if (kh.length) s += "\\draw[dashed] " + kh.map(e => `${C(R.P2[e.a])}--${C(R.P2[e.b])}`).join(" ") + ";\n";
    if (th.length) s += "\\draw " + th.map(e => `${C(R.P2[e.a])}--${C(R.P2[e.b])}`).join(" ") + ";\n";
    if (B.tron) s += `\\draw ${C(B.tron)} circle (${f(B.tron[2] * k)});\n`;
    const AN = ["east", "north east", "north", "north west", "west", "south west", "south", "south east"];
    M.ten.forEach(t => {
      const d = huongNhan(M, R, t); const g = Math.atan2(d[1], d[0]); const i = ((Math.round(g / (Math.PI / 4)) % 8) + 8) % 8;
      const anchor = AN[(i + 4) % 8];
      s += `\\fill ${C(R.P2[t])} circle (1pt) node[anchor=${anchor},inner sep=1.5pt]{$${tex(t)}$};\n`;
    });
    return s + "\\end{tikzpicture}";
  }

  G.HinhTuDong = { svg, tikz, mau: moHinh, phang };
})(window);
