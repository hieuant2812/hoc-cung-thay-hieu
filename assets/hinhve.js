/* hinhve.js — vẽ hình minh hoạ cho bài giảng từ một mô tả ngắn.
   Cùng một mô tả cho ra 2 bản: TikZ (đưa vào file Beamer) và SVG (xem trước trên web).
   Mô tả: { w: bề rộng (cm) trong slide, kg: true nếu là hình không gian, khung: [xmin,xmax,ymin,ymax], el: [...] }
   Phần tử:
     ["truc", {x:[a,b], y:[c,d], O:true}]                     hai trục toạ độ
     ["ham", "x*x-2", a, b, {mau, ten, tenx}]                đồ thị y = f(x) (biểu thức JavaScript theo x)
     ["tham", "fx(t)", "fy(t)", t0, t1, {mau}]               đường tham số
     ["diem", "A", x, y, (z), {vt:"above right", cham:true, nhan:"A"}]
     ["doan", P, Q, {mau, net:"dut"}]   ["vec", P, Q, {mau, ten, vt}]   ["thang", P, Q, {keo:[t0,t1]}]
     ["dagiac", [P,Q,R], {to, do, vien}]   ["mien", [P,Q,R], {to, do}]
     ["tron", T, r, {mau, to}]   ["cung", T, r, goc1, goc2, {mau}]
     ["goc", B, A, C, {ten, r, mau}]   ["vuong", B, A, C, {r}]   ["chu", x, y, "nội dung", {mau, vt}]
   P, Q... là tên điểm đã khai báo hoặc toạ độ [x,y] / [x,y,z]. Màu: vang, ngoc, cam, tim, luc, trang. */
(function (G) {
  "use strict";
  const MAU_TIKZ = { vang: "phanvang", ngoc: "phanngoc", cam: "phancam", tim: "phantim", luc: "phanluc", trang: "chuphan" };
  const MAU_SVG = { vang: "var(--vang)", ngoc: "var(--xanh)", cam: "var(--hong)", tim: "var(--tim)", luc: "var(--luc)", trang: "var(--chu)" };
  const r2 = v => (Math.round(v * 100) / 100).toString();
  const KX = -0.38, KY = -0.32;            // phép chiếu xiên cho hình không gian

  function chuanBi(spec) {
    const P = {};
    const chieu = p => spec.kg ? [p[1] + KX * p[0], p[2] + KY * p[0]] : [p[0], p[1]];
    const toaDo = q => {
      if (typeof q === "string") { if (!P[q]) throw new Error("Chưa khai báo điểm " + q); return P[q]; }
      return chieu(q);
    };
    (spec.el || []).forEach(e => { if (e[0] === "diem") P[e[1]] = chieu(spec.kg ? [e[2], e[3], e[4]] : [e[2], e[3]]); });
    // khung nhìn
    let k = spec.khung;
    if (!k) {
      let xs = [], ys = [];
      Object.values(P).forEach(p => { xs.push(p[0]); ys.push(p[1]); });
      (spec.el || []).forEach(e => {
        if (e[0] === "truc") { const o = e[1] || {}; if (o.x) xs.push(...o.x); if (o.y) ys.push(...o.y); }
        if (e[0] === "tron") { const c = toaDo(e[1]); xs.push(c[0] - e[2], c[0] + e[2]); ys.push(c[1] - e[2], c[1] + e[2]); }
      });
      if (!xs.length) { xs = [0, 1]; ys = [0, 1]; }
      const pad = 0.6;
      k = [Math.min(...xs) - pad, Math.max(...xs) + pad, Math.min(...ys) - pad, Math.max(...ys) + pad];
    }
    return { P, toaDo, k };
  }

  function mauT(m) { return MAU_TIKZ[m] || m || "chuphan"; }
  function mauS(m) { return MAU_SVG[m] || m || "var(--chu)"; }
  function ham(expr, v) { try { return Function("x", "t", "with(Math){return (" + expr + ");}")(v, v); } catch (e) { return NaN; } }

  function mau_mau(k) {   // các đoạn của đồ thị nằm trong khung
    return k;
  }

  /* ---------------------------------------------------------------- TikZ */
  function tikz(spec) {
    const { P, toaDo, k } = chuanBi(spec);
    const w = spec.w || 5.5; const s = Math.min(w / (k[1] - k[0]), (spec.hmax || 99) / (k[3] - k[2]));
    const C = p => `(${r2(p[0])},${r2(p[1])})`;
    const out = [`\\begin{tikzpicture}[x=${r2(s)}cm,y=${r2(s)}cm,line cap=round,line join=round,>=Stealth,font=\\small]`];
    out.push(`\\clip (${r2(k[0])},${r2(k[2])}) rectangle (${r2(k[1])},${r2(k[3])});`);
    const net = o => (o && o.net === "dut" ? ",dashed" : "") + (o && o.net === "day" ? ",line width=1.2pt" : ",line width=0.8pt");
    (spec.el || []).forEach(e => {
      const o = (typeof e[e.length - 1] === "object" && !Array.isArray(e[e.length - 1])) ? e[e.length - 1] : {};
      switch (e[0]) {
        case "truc": {
          const x = o.x || [k[0] + .2, k[1] - .2], y = o.y || [k[2] + .2, k[3] - .2];
          out.push(`\\draw[->,chuphan!75,line width=0.6pt] (${r2(x[0])},0) -- (${r2(x[1])},0) node[below left] {$x$};`);
          out.push(`\\draw[->,chuphan!75,line width=0.6pt] (0,${r2(y[0])}) -- (0,${r2(y[1])}) node[below left] {$y$};`);
          if (o.O !== false) out.push(`\\node[below left,chuphan!80] at (0,0) {$O$};`);
          (o.so || []).forEach(t => out.push(`\\draw[chuphan!75] (${t},-0.06) -- (${t},0.06) node[below=2pt,font=\\scriptsize] {$${t}$};`));
          (o.soy || []).forEach(t => out.push(`\\draw[chuphan!75] (-0.06,${t}) -- (0.06,${t}) node[left=2pt,font=\\scriptsize] {$${t}$};`));
          break;
        }
        case "ham": case "tham": {
          const n = o.n || 120; let seg = [], segs = [];
          const a = e[0] === "ham" ? e[2] : e[3], b = e[0] === "ham" ? e[3] : e[4];
          for (let i = 0; i <= n; i++) {
            const t = a + (b - a) * i / n;
            const p = e[0] === "ham" ? [t, ham(e[1], t)] : [ham(e[1], t), ham(e[2], t)];
            if (isFinite(p[1]) && p[1] > k[2] - 2 && p[1] < k[3] + 2) seg.push(p); else { if (seg.length > 1) segs.push(seg); seg = []; }
          }
          if (seg.length > 1) segs.push(seg);
          segs.forEach(sg => out.push(`\\draw[${mauT(o.mau || "vang")}${net(o)}] plot[smooth] coordinates {${sg.map(C).join(" ")}};`));
          if (o.ten) { const p = o.tenx != null ? [o.tenx, ham(e[1], o.tenx)] : segs.length && segs[segs.length - 1][segs[segs.length - 1].length - 1]; if (p) out.push(`\\node[${o.vt || "right"},${mauT(o.mau || "vang")}] at ${C(p)} {${o.ten}};`); }
          break;
        }
        case "diem": {
          const p = P[e[1]];
          if (o.cham !== false) out.push(`\\fill[${mauT(o.mau || "trang")}] ${C(p)} circle (1.6pt);`);
          if (o.nhan !== "") out.push(`\\node[${o.vt || "above right"},inner sep=1.5pt] at ${C(p)} {${((n) => /[À-ỹĐđ]/.test(n) ? n : "$" + n + "$")(o.nhan || e[1])}};`);   // nhãn có chữ Việt (CĐ, CT…) in chữ thường
          break;
        }
        case "doan": out.push(`\\draw[${mauT(o.mau || "trang")}${net(o)}] ${C(toaDo(e[1]))} -- ${C(toaDo(e[2]))};`); break;
        case "thang": {
          const A = toaDo(e[1]), B = toaDo(e[2]); const [t0, t1] = o.keo || [-0.3, 1.3];
          const Q = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
          out.push(`\\draw[${mauT(o.mau || "ngoc")}${net(o)}] ${C(Q(t0))} -- ${C(Q(t1))};`);
          if (o.ten) out.push(`\\node[${o.vt || "right"},${mauT(o.mau || "ngoc")}] at ${C(Q(t1))} {${o.ten}};`);
          break;
        }
        case "vec": {
          const A = toaDo(e[1]), B = toaDo(e[2]);
          out.push(`\\draw[->,${mauT(o.mau || "vang")},line width=1.1pt] ${C(A)} -- ${C(B)};`);
          if (o.ten) out.push(`\\node[${o.vt || "above"},${mauT(o.mau || "vang")}] at (${r2((A[0] + B[0]) / 2)},${r2((A[1] + B[1]) / 2)}) {${o.ten}};`);
          break;
        }
        case "vung": {
          const n = 60, a = e[3], b = e[4], ps = [];
          for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; ps.push([x, ham(e[1], x)]); }
          for (let i = n; i >= 0; i--) { const x = a + (b - a) * i / n; ps.push([x, ham(e[2], x)]); }
          out.push(`\\fill[${mauT(o.to || "ngoc")},opacity=${o.do || 0.3}] ${ps.map(C).join(" -- ")} -- cycle;`);
          break;
        }
        case "dagiac": case "mien": {
          const ps = e[1].map(toaDo).map(C).join(" -- ");
          if (o.to || e[0] === "mien") out.push(`\\fill[${mauT(o.to || o.mau || "ngoc")},opacity=${o.do || 0.25}] ${ps} -- cycle;`);
          if (e[0] === "dagiac" && o.vien !== false) out.push(`\\draw[${mauT(o.mau || "trang")}${net(o)}] ${ps} -- cycle;`);
          break;
        }
        case "tron": {
          const c = toaDo(e[1]);
          if (o.to) out.push(`\\fill[${mauT(o.to)},opacity=${o.do || 0.18}] ${C(c)} circle (${r2(e[2])});`);
          out.push(`\\draw[${mauT(o.mau || "ngoc")}${net(o)}] ${C(c)} circle (${r2(e[2])});`);
          break;
        }
        case "elip": {
          const c = toaDo(e[1]);
          out.push(`\\draw[${mauT(o.mau || "ngoc")}${net(o)}] ${C(c)} ellipse (${r2(e[2])} and ${r2(e[3])});`);
          break;
        }
        case "cung": {
          const c = toaDo(e[1]);
          out.push(`\\draw[${mauT(o.mau || "ngoc")}${net(o)}] (${r2(c[0] + e[2] * Math.cos(e[3] * Math.PI / 180))},${r2(c[1] + e[2] * Math.sin(e[3] * Math.PI / 180))}) arc[start angle=${e[3]},end angle=${e[4]},radius=${r2(e[2])}];`);
          break;
        }
        case "goc": case "vuong": {
          const B = toaDo(e[1]), A = toaDo(e[2]), Cc = toaDo(e[3]);
          const a1 = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI, a2 = Math.atan2(Cc[1] - A[1], Cc[0] - A[0]) * 180 / Math.PI;
          let d = a2 - a1; while (d > 180) d -= 360; while (d < -180) d += 360;
          const rr = o.r || 0.45;
          if (e[0] === "goc") {
            out.push(`\\draw[${mauT(o.mau || "cam")},line width=0.8pt] (${r2(A[0] + rr * Math.cos(a1 * Math.PI / 180))},${r2(A[1] + rr * Math.sin(a1 * Math.PI / 180))}) arc[start angle=${r2(a1)},end angle=${r2(a1 + d)},radius=${r2(rr)}];`);
            if (o.ten) { const am = (a1 + d / 2) * Math.PI / 180; out.push(`\\node[${mauT(o.mau || "cam")}] at (${r2(A[0] + (rr + 0.32) * Math.cos(am))},${r2(A[1] + (rr + 0.32) * Math.sin(am))}) {${o.ten}};`); }
          } else {
            const u = [Math.cos(a1 * Math.PI / 180) * rr * .6, Math.sin(a1 * Math.PI / 180) * rr * .6], v = [Math.cos((a1 + d) * Math.PI / 180) * rr * .6, Math.sin((a1 + d) * Math.PI / 180) * rr * .6];
            out.push(`\\draw[${mauT(o.mau || "cam")},line width=0.7pt] (${r2(A[0] + u[0])},${r2(A[1] + u[1])}) -- (${r2(A[0] + u[0] + v[0])},${r2(A[1] + u[1] + v[1])}) -- (${r2(A[0] + v[0])},${r2(A[1] + v[1])});`);
          }
          break;
        }
        case "chu": out.push(`\\node[${mauT(o.mau || "trang")}${o.vt && o.vt !== "center" ? "," + o.vt : ""}] at (${r2(e[1])},${r2(e[2])}) {${e[3]}};`); break;
      }
    });
    out.push("\\end{tikzpicture}");
    return out.join("\n");
  }

  /* ---------------------------------------------------------------- SVG (xem trước) */
  const UNI = { alpha: "α", beta: "β", gamma: "γ", Delta: "Δ", delta: "δ", pi: "π", varphi: "φ", theta: "θ", omega: "ω", infty: "∞", cdot: "·", circ: "°", perp: "⊥", parallel: "∥", le: "≤", ge: "≥", ne: "≠" };
  function txt(s) {
    return String(s || "").replace(/\$/g, "")
      .replace(/\\(?:overrightarrow|vec)\{([^}]*)\}/g, "$1⃗").replace(/\\(?:dfrac|frac)\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
      .replace(/\\sqrt\{([^}]*)\}/g, "√$1").replace(/\\([A-Za-z]+)/g, (m, c) => UNI[c] || "")
      .replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/_\{?0\}?/g, "₀").replace(/_\{?1\}?/g, "₁").replace(/_\{?2\}?/g, "₂")
      .replace(/[{}]/g, "").replace(/</g, "&lt;");
  }
  const VT = { "above": [0, -1], "below": [0, 1], "left": [-1, 0], "right": [1, 0], "above right": [1, -1], "above left": [-1, -1], "below right": [1, 1], "below left": [-1, 1], "center": [0, 0] };
  function svg(spec) {
    const { P, toaDo, k } = chuanBi(spec);
    const S = 46, W = (k[1] - k[0]) * S, H = (k[3] - k[2]) * S;
    const X = p => r2((p[0] - k[0]) * S), Y = p => r2((k[3] - p[1]) * S);
    const pt = p => `${X(p)},${Y(p)}`;
    const o_ = [];
    const ten = (p, s, vt, mau, co) => {
      const d = VT[vt || "above right"] || [1, -1];
      const anchor = d[0] > 0 ? "start" : d[0] < 0 ? "end" : "middle";
      o_.push(`<text x="${r2(+X(p) + d[0] * 6)}" y="${r2(+Y(p) + d[1] * 6 + (d[1] > 0 ? 10 : d[1] < 0 ? -2 : 5))}" fill="${mauS(mau)}" font-size="${co || 15}" font-style="italic" text-anchor="${anchor}" font-family="Times New Roman,serif">${txt(s)}</text>`);
    };
    const dash = o => (o && o.net === "dut" ? ' stroke-dasharray="6 5"' : "");
    const sw = o => (o && o.net === "day" ? 3 : 2);
    o_.push(`<defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>`);
    (spec.el || []).forEach(e => {
      const o = (typeof e[e.length - 1] === "object" && !Array.isArray(e[e.length - 1])) ? e[e.length - 1] : {};
      switch (e[0]) {
        case "truc": {
          const x = o.x || [k[0] + .2, k[1] - .2], y = o.y || [k[2] + .2, k[3] - .2];
          o_.push(`<line x1="${X([x[0], 0])}" y1="${Y([0, 0])}" x2="${X([x[1], 0])}" y2="${Y([0, 0])}" stroke="var(--chu)" stroke-opacity=".7" stroke-width="1.4" marker-end="url(#mt)"/>`);
          o_.push(`<line x1="${X([0, 0])}" y1="${Y([0, y[0]])}" x2="${X([0, 0])}" y2="${Y([0, y[1]])}" stroke="var(--chu)" stroke-opacity=".7" stroke-width="1.4" marker-end="url(#mt)"/>`);
          ten([x[1], 0], "x", "below left"); ten([0, y[1]], "y", "below left"); if (o.O !== false) ten([0, 0], "O", "below left");
          (o.so || []).forEach(t => ten([t, 0], String(t), "below", "trang", 12));
          (o.soy || []).forEach(t => ten([0, t], String(t), "left", "trang", 12));
          break;
        }
        case "ham": case "tham": {
          const n = o.n || 120; let seg = [], segs = [];
          const a = e[0] === "ham" ? e[2] : e[3], b = e[0] === "ham" ? e[3] : e[4];
          for (let i = 0; i <= n; i++) {
            const t = a + (b - a) * i / n;
            const p = e[0] === "ham" ? [t, ham(e[1], t)] : [ham(e[1], t), ham(e[2], t)];
            if (isFinite(p[1]) && p[1] > k[2] - 2 && p[1] < k[3] + 2) seg.push(p); else { if (seg.length > 1) segs.push(seg); seg = []; }
          }
          if (seg.length > 1) segs.push(seg);
          segs.forEach(sg => o_.push(`<polyline points="${sg.map(pt).join(" ")}" fill="none" stroke="${mauS(o.mau || "vang")}" stroke-width="${sw(o) + .4}"${dash(o)}/>`));
          if (o.ten) { const p = o.tenx != null ? [o.tenx, ham(e[1], o.tenx)] : segs.length && segs[segs.length - 1][segs[segs.length - 1].length - 1]; if (p) ten(p, o.ten, o.vt || "right", o.mau || "vang"); }
          break;
        }
        case "diem": { const p = P[e[1]]; if (o.cham !== false) o_.push(`<circle cx="${X(p)}" cy="${Y(p)}" r="3.2" fill="${mauS(o.mau || "trang")}"/>`); if (o.nhan !== "") ten(p, o.nhan || e[1], o.vt); break; }
        case "doan": { const A = toaDo(e[1]), B = toaDo(e[2]); o_.push(`<line x1="${X(A)}" y1="${Y(A)}" x2="${X(B)}" y2="${Y(B)}" stroke="${mauS(o.mau || "trang")}" stroke-width="${sw(o)}"${dash(o)}/>`); break; }
        case "thang": {
          const A = toaDo(e[1]), B = toaDo(e[2]); const [t0, t1] = o.keo || [-0.3, 1.3];
          const Q = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
          o_.push(`<line x1="${X(Q(t0))}" y1="${Y(Q(t0))}" x2="${X(Q(t1))}" y2="${Y(Q(t1))}" stroke="${mauS(o.mau || "ngoc")}" stroke-width="${sw(o)}"${dash(o)}/>`);
          if (o.ten) ten(Q(t1), o.ten, o.vt || "right", o.mau || "ngoc");
          break;
        }
        case "vec": {
          const A = toaDo(e[1]), B = toaDo(e[2]);
          o_.push(`<line x1="${X(A)}" y1="${Y(A)}" x2="${X(B)}" y2="${Y(B)}" stroke="${mauS(o.mau || "vang")}" stroke-width="2.6" marker-end="url(#mt)"/>`);
          if (o.ten) ten([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], o.ten, o.vt || "above", o.mau || "vang");
          break;
        }
        case "vung": {
          const n = 60, a = e[3], b = e[4], ps = [];
          for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; ps.push([x, ham(e[1], x)]); }
          for (let i = n; i >= 0; i--) { const x = a + (b - a) * i / n; ps.push([x, ham(e[2], x)]); }
          o_.push(`<polygon points="${ps.map(pt).join(" ")}" fill="${mauS(o.to || "ngoc")}" fill-opacity="${o.do || 0.3}" stroke="none"/>`);
          break;
        }
        case "dagiac": case "mien": {
          const ps = e[1].map(toaDo).map(pt).join(" ");
          if (o.to || e[0] === "mien") o_.push(`<polygon points="${ps}" fill="${mauS(o.to || o.mau || "ngoc")}" fill-opacity="${o.do || 0.25}" stroke="none"/>`);
          if (e[0] === "dagiac" && o.vien !== false) o_.push(`<polygon points="${ps}" fill="none" stroke="${mauS(o.mau || "trang")}" stroke-width="${sw(o)}"${dash(o)}/>`);
          break;
        }
        case "tron": { const c = toaDo(e[1]); o_.push(`<circle cx="${X(c)}" cy="${Y(c)}" r="${r2(e[2] * S)}" fill="${o.to ? mauS(o.to) : "none"}" fill-opacity="${o.do || 0.18}" stroke="${mauS(o.mau || "ngoc")}" stroke-width="${sw(o)}"${dash(o)}/>`); break; }
        case "elip": { const c = toaDo(e[1]); o_.push(`<ellipse cx="${X(c)}" cy="${Y(c)}" rx="${r2(e[2] * S)}" ry="${r2(e[3] * S)}" fill="none" stroke="${mauS(o.mau || "ngoc")}" stroke-width="${sw(o)}"${dash(o)}/>`); break; }
        case "cung": {
          const c = toaDo(e[1]); const p1 = [c[0] + e[2] * Math.cos(e[3] * Math.PI / 180), c[1] + e[2] * Math.sin(e[3] * Math.PI / 180)], p2 = [c[0] + e[2] * Math.cos(e[4] * Math.PI / 180), c[1] + e[2] * Math.sin(e[4] * Math.PI / 180)];
          const big = Math.abs(e[4] - e[3]) > 180 ? 1 : 0, sweep = e[4] > e[3] ? 0 : 1;
          o_.push(`<path d="M${pt(p1)} A${r2(e[2] * S)},${r2(e[2] * S)} 0 ${big} ${sweep} ${pt(p2)}" fill="none" stroke="${mauS(o.mau || "ngoc")}" stroke-width="${sw(o)}"${dash(o)}/>`);
          break;
        }
        case "goc": case "vuong": {
          const B = toaDo(e[1]), A = toaDo(e[2]), Cc = toaDo(e[3]);
          const a1 = Math.atan2(B[1] - A[1], B[0] - A[0]), a2 = Math.atan2(Cc[1] - A[1], Cc[0] - A[0]);
          let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          const rr = o.r || 0.45;
          if (e[0] === "goc") {
            const p1 = [A[0] + rr * Math.cos(a1), A[1] + rr * Math.sin(a1)], p2 = [A[0] + rr * Math.cos(a1 + d), A[1] + rr * Math.sin(a1 + d)];
            o_.push(`<path d="M${pt(p1)} A${r2(rr * S)},${r2(rr * S)} 0 0 ${d > 0 ? 0 : 1} ${pt(p2)}" fill="none" stroke="${mauS(o.mau || "cam")}" stroke-width="2"/>`);
            if (o.ten) { const am = a1 + d / 2; ten([A[0] + (rr + .3) * Math.cos(am), A[1] + (rr + .3) * Math.sin(am)], o.ten, "center", o.mau || "cam"); }
          } else {
            const u = [Math.cos(a1) * rr * .6, Math.sin(a1) * rr * .6], v = [Math.cos(a1 + d) * rr * .6, Math.sin(a1 + d) * rr * .6];
            o_.push(`<polyline points="${pt([A[0] + u[0], A[1] + u[1]])} ${pt([A[0] + u[0] + v[0], A[1] + u[1] + v[1]])} ${pt([A[0] + v[0], A[1] + v[1]])}" fill="none" stroke="${mauS(o.mau || "cam")}" stroke-width="1.6"/>`);
          }
          break;
        }
        case "chu": ten([e[1], e[2]], e[3], o.vt || "center", o.mau || "trang"); break;
      }
    });
    return `<svg class="hv" viewBox="0 0 ${r2(W)} ${r2(H)}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">${o_.join("")}</svg>`;
  }

  G.HinhVe = { tikz, svg };
})(window);
