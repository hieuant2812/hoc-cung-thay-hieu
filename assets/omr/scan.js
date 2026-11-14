/* omr/scan.js — đọc phiếu trả lời từ ảnh (camera điện thoại).
   B1 tìm 4 ô vuông đen ở góc  →  B2 nắn phối cảnh về tờ phiếu chuẩn (4 điểm ảnh / mm)
   B3 ước lượng độ trắng của giấy từng vùng (chống bóng đổ)  →  B4 đo độ đậm từng ô tô, quyết định đáp án. */
(function (G) {
  "use strict";
  const OMR = G.OMR = G.OMR || {};
  const PPM = 4; // điểm ảnh / mm của ảnh nắn

  /* ---------------------------------------------------------------- ảnh xám */
  function toGray(img) { // ImageData-like {data,width,height}
    const { data, width: w, height: h } = img; const g = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (data[j] * 77 + data[j + 1] * 150 + data[j + 2] * 29) >> 8;
    return { g, w, h };
  }
  function downscale(G0, maxSide) {
    const { g, w, h } = G0; const f = Math.max(1, Math.max(w, h) / maxSide); if (f <= 1.01) return { g, w, h, f: 1 };
    const W = Math.round(w / f), H = Math.round(h / f); const o = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) { const sy = Math.min(h - 1, Math.floor(y * f)), ey = Math.min(h, Math.floor((y + 1) * f)); for (let x = 0; x < W; x++) { const sx = Math.min(w - 1, Math.floor(x * f)), ex = Math.min(w, Math.floor((x + 1) * f)); let s = 0, n = 0; for (let yy = sy; yy < ey; yy += 1) for (let xx = sx; xx < ex; xx += 1) { s += g[yy * w + xx]; n++; } o[y * W + x] = n ? s / n : g[sy * w + sx]; } }
    return { g: o, w: W, h: H, f };
  }

  /* ---------------------------------------------------------------- B1: dấu định vị */
  // tìm mọi đốm đen gần vuông, nằm trên nền sáng (ứng viên dấu góc)
  function candidates(S, cap) {
    const { g, w, h } = S; const N = w * h;
    const I = new Float64Array((w + 1) * (h + 1));
    for (let y = 0; y < h; y++) { let r = 0; for (let x = 0; x < w; x++) { r += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + r; } }
    const rad = Math.max(8, Math.round(Math.min(w, h) / 14));
    const bin = new Uint8Array(N);
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - rad), y1 = Math.min(h, y + rad + 1);
      for (let x = 0; x < w; x++) {
        const x0 = Math.max(0, x - rad), x1 = Math.min(w, x + rad + 1);
        const s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0];
        const v = g[y * w + x]; bin[y * w + x] = v < s / ((x1 - x0) * (y1 - y0)) * .72 && v < 160 ? 1 : 0;
      }
    }
    const lab = new Int32Array(N); const comps = [], bars = []; const stack = new Int32Array(N); let id = 0;
    for (let p = 0; p < N; p++) {
      if (!bin[p] || lab[p]) continue;
      id++; let sp = 0; stack[sp++] = p; lab[p] = id;
      let area = 0, sx = 0, sy = 0, minx = w, maxx = 0, miny = h, maxy = 0, edge = false, sv = 0;
      while (sp) {
        const q = stack[--sp]; const x = q % w, y = (q - x) / w;
        area++; sx += x; sy += y; sv += g[q]; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
        if (x > 0 && bin[q - 1] && !lab[q - 1]) { lab[q - 1] = id; stack[sp++] = q - 1; }
        if (x < w - 1 && bin[q + 1] && !lab[q + 1]) { lab[q + 1] = id; stack[sp++] = q + 1; }
        if (y > 0 && bin[q - w] && !lab[q - w]) { lab[q - w] = id; stack[sp++] = q - w; }
        if (y < h - 1 && bin[q + w] && !lab[q + w]) { lab[q + w] = id; stack[sp++] = q + w; }
      }
      const bw = maxx - minx + 1, bh = maxy - miny + 1;
      if (!edge && area >= 6) { const lo = Math.max(bw, bh), sh = Math.min(bw, bh); if (lo / sh > 2.3 && lo / sh < 7 && area / (bw * bh) > .5) bars.push({ cx: sx / area, cy: sy / area, lo }); }
      if (edge || bw / bh < .5 || bw / bh > 2 || area / (bw * bh) < .45) continue;
      comps.push({ area, cx: sx / area, cy: sy / area, bw, bh, v: sv / area, size: Math.sqrt(area) });
    }
    const minA = Math.pow(Math.min(w, h) * .009, 2), maxA = N * .02;
    let cand = comps.filter(c => c.area >= minA && c.area <= maxA);
    // độ sáng vòng quanh đốm (giấy trắng); lấy phần sáng của vòng để vạch định hướng không làm tối
    cand.forEach(c => {
      const r = c.size * 1.05; const vs = [];
      for (let t = 0; t < 20; t++) { const an = t / 20 * 6.2832; const x = Math.round(c.cx + Math.cos(an) * r), y = Math.round(c.cy + Math.sin(an) * r); vs.push(x >= 0 && y >= 0 && x < w && y < h ? g[y * w + x] : 0); }
      vs.sort((a, b) => a - b); c.ring = (vs[10] + vs[12] + vs[14] + vs[16]) / 4;
    });
    cand = cand.filter(c => c.ring - c.v > 45);
    // dấu góc trên-trái có vạch đen dài bên cạnh (cách tâm ~1,8 cạnh dấu, dài ~1,7 cạnh)
    cand.forEach(c => { c.bar = bars.some(b => { const d = Math.hypot(b.cx - c.cx, b.cy - c.cy) / c.size; return d > 1.2 && d < 2.7 && b.lo / c.size > .9 && b.lo / c.size < 2.9; }); });
    // hai danh sách: đốm to nhất và đốm tương phản mạnh nhất (giấy trong bóng râm có dấu góc kém tương phản)
    const lim = cap || 14, byA = cand.slice().sort((a, b) => b.area - a.area).slice(0, lim);
    const byC = cand.slice().sort((a, b) => a.v / a.ring - b.v / b.ring).slice(0, Math.round(lim * 1.3));
    return [...new Set([...byA, ...byC])];
  }
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  // 4 đốm → tứ giác hợp lí (lồi, tỉ lệ cạnh gần tờ giấy, các dấu cỡ tương đương)
  function quadOf(cs) {
    const sz = cs.map(c => c.size); if (Math.max(...sz) > 2.3 * Math.min(...sz)) return null;
    const mx = cs.reduce((a, c) => a + c.cx, 0) / 4, my = cs.reduce((a, c) => a + c.cy, 0) / 4;
    let o = cs.map(c => ({ c, a: Math.atan2(c.cy - my, c.cx - mx) })).sort((p, q) => p.a - q.a).map(p => p.c);
    let k0 = 0; o.forEach((c, i) => { if (c.cx + c.cy < o[k0].cx + o[k0].cy) k0 = i; }); o = [0, 1, 2, 3].map(i => o[(i + k0) % 4]);
    const P = o.map(c => [c.cx, c.cy]);
    for (let i = 0; i < 4; i++) if (cross(P[i], P[(i + 1) % 4], P[(i + 2) % 4]) <= 0) return null;
    const sd = [0, 1, 2, 3].map(i => Math.hypot(P[(i + 1) % 4][0] - P[i][0], P[(i + 1) % 4][1] - P[i][1]));
    if (sd[0] / sd[2] < .55 || sd[0] / sd[2] > 1.8 || sd[1] / sd[3] < .55 || sd[1] / sd[3] > 1.8) return null;
    let asp = (sd[0] + sd[2]) / (sd[1] + sd[3]); if (asp < 1) asp = 1 / asp; if (asp < 1.12 || asp > 2.1) return null;
    for (let i = 0; i < 4; i++) { const a = P[(i + 3) % 4], b = P[i], c = P[(i + 1) % 4]; const cosv = ((a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1])) / (Math.hypot(a[0] - b[0], a[1] - b[1]) * Math.hypot(c[0] - b[0], c[1] - b[1])); if (Math.abs(cosv) > .6) return null; }
    // các dấu phải nhỏ so với tứ giác (dấu 7 mm trên tờ ≥ 128 mm)
    const side = (sd[0] + sd[1] + sd[2] + sd[3]) / 4; const ms = sz.reduce((a, b) => a + b) / 4; if (ms > side * .12 || ms < side * .02) return null;
    const area = Math.abs(cross(P[0], P[1], P[2])) / 2 + Math.abs(cross(P[0], P[2], P[3])) / 2;
    const rg = o.map(c => c.ring); const even = Math.min(...rg) / Math.max(...rg);
    const rm = rg.reduce((a, b) => a + b) / 4;
    return { pts: P, sizes: o.map(c => c.size), size: ms, area, score: area * Math.sqrt(even) * rm * Math.min(...sz) / Math.max(...sz), cs: o, cx: mx, cy: my };
  }
  function barDark(S, P) { // độ đậm vạch định hướng tốt nhất trên 4 cách xoay, 2 khổ giấy
    let best = 0;
    for (const [W, H] of [[210, 297], [148, 210]]) {
      const lay = [[10, 10], [W - 10, 10], [W - 10, H - 10], [10, H - 10]];
      for (let r = 0; r < 4; r++) {
        const Hm = homography(lay, [0, 1, 2, 3].map(k => P[(k + r) % 4])); if (!Hm) continue;
        let s1 = 0, n = 0; for (let x = 18; x <= 28; x += 2) { const [u, v] = apply(Hm, x, 10); s1 += bil(S, u, v); n++; }
        const a = apply(Hm, 36, 10), b = apply(Hm, 22, 16); const paper = (bil(S, a[0], a[1]) + bil(S, b[0], b[1])) / 2;
        const d = (paper - s1 / n) / Math.max(30, paper); if (d > best) best = d;
      }
    }
    return best;
  }
  function inside(q, x, y) { const P = q.pts; for (let i = 0; i < 4; i++) if (cross(P[i], P[(i + 1) % 4], [x, y]) < 0) return false; return true; }
  function crossQ(A, B) { // hai tứ giác có cạnh cắt nhau?
    const seg = (p, q, r, t) => { const d1 = cross(r, t, p), d2 = cross(r, t, q), d3 = cross(p, q, r), d4 = cross(p, q, t); return d1 * d2 < 0 && d3 * d4 < 0; };
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (seg(A.pts[i], A.pts[(i + 1) % 4], B.pts[j], B.pts[(j + 1) % 4])) return true;
    return false;
  }
  // hai phiếu A5 trên cùng tờ A4: cỡ gần bằng nhau, nằm sát nhau (2 góc của phiếu này gần 2 góc phiếu kia)
  function twin(A, B) {
    const per = q => q.pts.reduce((a, p, i) => a + Math.hypot(q.pts[(i + 1) % 4][0] - p[0], q.pts[(i + 1) % 4][1] - p[1]), 0);
    const pr = per(A) / per(B); if (pr < .82 || pr > 1.22) return false;
    if (A.size / B.size < .7 || A.size / B.size > 1.43) return false;
    const sh = Math.min(...A.pts.map((p, i) => Math.hypot(A.pts[(i + 1) % 4][0] - p[0], A.pts[(i + 1) % 4][1] - p[1])));
    let near = 0; A.pts.forEach(p => { if (Math.min(...B.pts.map(q => Math.hypot(q[0] - p[0], q[1] - p[1]))) < sh * .35) near++; });
    return near === 2;
  }
  function overlap(A, B) { // tỉ lệ diện tích A nằm trong B (lấy mẫu)
    let n = 0, k = 0; const P = A.pts;
    for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) { const u = i / 8, v = j / 8;
      const x = (1 - v) * ((1 - u) * P[0][0] + u * P[1][0]) + v * ((1 - u) * P[3][0] + u * P[2][0]), y = (1 - v) * ((1 - u) * P[0][1] + u * P[1][1]) + v * ((1 - u) * P[3][1] + u * P[2][1]);
      n++; if (inside(B, x, y)) k++; }
    return k / n;
  }
  // các giả thuyết: một tờ phiếu, hoặc hai phiếu A5 chưa cắt nằm cạnh nhau
  function hypotheses(cand, S) {
    const n = cand.length; if (n < 4) return [];
    const Q = []; const nb = cand.filter(c => c.bar).length;
    const ok4 = (a, b, c, d) => !nb || cand[a].bar || cand[b].bar || cand[c].bar || cand[d].bar;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) for (let d = c + 1; d < n; d++) { const q = quadOf([cand[a], cand[b], cand[c], cand[d]]); if (q) { q.ix = [a, b, c, d]; if (nb && !ok4(a, b, c, d)) q.score *= .3; Q.push(q); } }
    if (!Q.length) return [];
    Q.sort((p, q) => q.score - p.score);
    // xếp lại theo dấu hiệu chắc chắn: có vạch đen định hướng cạnh một góc
    if (S) { Q.length = Math.min(Q.length, 120); Q.forEach(q => { q.bar = barDark(S, q.pts); q.score *= q.bar > .25 ? 1 : .12; }); Q.sort((p, q) => q.score - p.score); }
    const out = [];
    if (n >= 8) {
      const pairs = []; let M = 0; while (M < Q.length && M < 250 && Q[M].score > Q[0].score * .2) M++;
      for (let i = 0; i < M; i++) for (let j = i + 1; j < M; j++) {
        const A = Q[i], B = Q[j]; if (A.ix.some(k => B.ix.includes(k))) continue;
        if (Math.min(A.area, B.area) / Math.max(A.area, B.area) < .7 || !twin(A, B)) continue;
        if (crossQ(A, B) || overlap(A, B) > .02 || overlap(B, A) > .02) continue;
        const sc = Math.min(A.score, B.score) * Math.pow(Math.min(A.area, B.area) / Math.max(A.area, B.area), 2); pairs.push({ sc, A, B });
      }
      pairs.sort((p, q) => q.sc - p.sc).slice(0, 3).forEach(bp => out.push({ two: [bp.A, bp.B].sort((p, q) => (p.cx + p.cy * .3) - (q.cx + q.cy * .3)) }));
    }
    // vài tứ giác tốt nhất khác nhau (nền bàn có thể có đồ vật tối giống dấu góc)
    const singles = [];
    for (const q of Q) { if (singles.length >= 10) break; if (singles.some(o => o.ix.every((v, i) => v === q.ix[i]))) continue; singles.push(q); }
    singles.forEach(q => out.push({ one: q }));
    return out;
  }
  /* ---------------------------------------------------------------- phép biến đổi phối cảnh */
  function homography(src, dst) { // 4 cặp điểm: src → dst
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = src[i], [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    for (let c = 0; c < 8; c++) { // khử Gauss
      let piv = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      [A[c], A[piv]] = [A[piv], A[c]]; [b[c], b[piv]] = [b[piv], b[c]];
      if (Math.abs(A[c][c]) < 1e-12) return null;
      for (let r = 0; r < 8; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; }
    }
    const h = b.map((v, i) => v / A[i][i]); h.push(1); return h;
  }
  const apply = (H, x, y) => { const d = H[6] * x + H[7] * y + H[8]; return [(H[0] * x + H[1] * y + H[2]) / d, (H[3] * x + H[4] * y + H[5]) / d]; };
  function bil(G0, x, y) {
    const { g, w, h } = G0; if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) return 255;
    const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * w + x0;
    return (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + w] * (1 - fx) + g[i + w + 1] * fx) * fy;
  }
  /* tinh chỉnh tâm dấu định vị trên ảnh gốc */
  function refine(G0, p, half) {
    const x0 = Math.max(0, Math.round(p[0] - half)), x1 = Math.min(G0.w - 1, Math.round(p[0] + half));
    const y0 = Math.max(0, Math.round(p[1] - half)), y1 = Math.min(G0.h - 1, Math.round(p[1] + half));
    let mn = 255, mx = 0; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const v = G0.g[y * G0.w + x]; if (v < mn) mn = v; if (v > mx) mx = v; }
    const t = (mn + mx) / 2; let sx = 0, sy = 0, n = 0;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (G0.g[y * G0.w + x] < t) { sx += x; sy += y; n++; }
    return n ? [sx / n, sy / n] : p;
  }

  /* ---------------------------------------------------------------- B2: nắn ảnh */
  function warp(G0, L, Hm2px) {
    const W = Math.round(L.W * PPM), H = Math.round(L.H * PPM); const o = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [u, v] = apply(Hm2px, (x + .5) / PPM, (y + .5) / PPM); o[y * W + x] = bil(G0, u, v); }
    return { g: o, w: W, h: H };
  }
  /* B3: bản đồ độ trắng của giấy (lọc max cửa sổ ~9mm rồi làm mượt) */
  function whiteMap(Wp) {
    const s = PPM; const w = Math.ceil(Wp.w / s), h = Math.ceil(Wp.h / s); const m = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let mx = 0; for (let yy = y * s; yy < Math.min(Wp.h, y * s + s); yy++) for (let xx = x * s; xx < Math.min(Wp.w, x * s + s); xx++) { const v = Wp.g[yy * Wp.w + xx]; if (v > mx) mx = v; } m[y * w + x] = mx; }
    const r = 4; const t = new Float32Array(w * h), o = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let mx = 0; for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < w) mx = Math.max(mx, m[y * w + xx]); } t[y * w + x] = mx; }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let mx = 0; for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < h) mx = Math.max(mx, t[yy * w + x]); } o[y * w + x] = mx; }
    // làm mượt hộp 5×5
    const b = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s2 = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < w && yy < h) { s2 += o[yy * w + xx]; n++; } } b[y * w + x] = s2 / n; }
    return (xmm, ymm) => { const x = Math.min(w - 1, Math.max(0, Math.round(xmm))), y = Math.min(h - 1, Math.max(0, Math.round(ymm))); return b[y * w + x]; };
  }
  function diskMean(Wp, xmm, ymm, rmm) {
    const cx = xmm * PPM, cy = ymm * PPM, r = rmm * PPM; let s = 0, n = 0;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) { if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) continue; if (x < 0 || y < 0 || x >= Wp.w || y >= Wp.h) continue; s += Wp.g[y * Wp.w + x]; n++; }
    return n ? s / n : 255;
  }

  /* ---------------------------------------------------------------- toàn bộ quy trình */
  const T_FILL = .36, T_GAP = .17;
  function choose(ds, opts) { // ds: độ đậm các ô ; trả {i, st:"ok"|"blank"|"multi", conf}
    const idx = ds.map((d, i) => [d, i]).sort((a, b) => b[0] - a[0]);
    const top = idx[0], sec = idx[1] || [0, -1];
    if (top[0] < T_FILL) return { i: -1, st: "blank", conf: T_FILL - top[0] };
    if (sec[0] >= T_FILL && sec[0] > top[0] - T_GAP) return { i: -1, st: "multi", conf: 0, all: idx.filter(x => x[0] >= T_FILL).map(x => x[1]) };
    return { i: top[1], st: "ok", conf: Math.min(top[0] - T_FILL, top[0] - sec[0]) };
  }
  /* chuẩn bị một lần cho mỗi ảnh: ảnh xám, ảnh nhỏ, các giả thuyết vị trí phiếu */
  function prepare(imageData, opt = {}) {
    const G0 = toGray(imageData); const S = downscale(G0, opt.detectSize || 900);
    return { G0, S, hyps: hypotheses(candidates(S), S) };
  }
  const FAIL = {
    mk: "Không thấy đủ 4 ô vuông đen ở góc phiếu — đưa trọn tờ phiếu vào khung, tránh để ngón tay che góc",
    or: "Không xác định được chiều phiếu (vạch đen cạnh góc trên-trái)",
    cn: "Chưa thấy rõ cả 4 góc phiếu — đưa trọn tờ phiếu vào khung",
    tl: "Phiếu bị nghiêng quá nhiều hoặc không đúng mẫu đã chọn",
    fit: "Chưa khớp mẫu phiếu — đưa đủ 4 ô vuông đen vào khung; nếu vẫn báo, kiểm tra phiếu in có đúng mẫu của bài"
  };
  const STAGE = { mk: 0, or: 1, cn: 2, tl: 3, fit: 4 };
  const fail = (k, x) => Object.assign({ ok: false, why: FAIL[k], stage: STAGE[k] }, x || {});
  function readQuad(P, q, L) {
    const t0 = Date.now(); const { G0, S } = P;
    const pts = q.pts.map(p => refine(G0, [p[0] * S.f, p[1] * S.f], q.size * S.f * .75));
    const M = L.markers; const lay = [[M[0].x, M[0].y], [M[1].x, M[1].y], [M[3].x, M[3].y], [M[2].x, M[2].y]];
    let best = null;
    for (let r = 0; r < 4; r++) {
      const img = [0, 1, 2, 3].map(k => pts[(k + r) % 4]);
      const Hm = homography(lay, img); if (!Hm) continue;
      const oc = L.orient; let s = 0, n = 0;
      for (let y = oc.y + .6; y <= oc.y + oc.h - .6; y += .6) for (let x = oc.x + .8; x <= oc.x + oc.w - .8; x += .8) { const [u, v] = apply(Hm, x, y); s += bil(G0, u, v); n++; }
      const [u1, v1] = apply(Hm, oc.x + oc.w + 6, oc.y + oc.h / 2); const [u2, v2] = apply(Hm, oc.x + oc.w / 2, oc.y + oc.h + 4); const paper = (bil(G0, u1, v1) + bil(G0, u2, v2)) / 2;
      const dark = (paper - s / n) / Math.max(30, paper);
      const sideTop = Math.hypot(img[1][0] - img[0][0], img[1][1] - img[0][1]), sideL = Math.hypot(img[3][0] - img[0][0], img[3][1] - img[0][1]);
      const ratio = (sideL / sideTop) / ((lay[3][1] - lay[0][1]) / (lay[1][0] - lay[0][0]));
      const sc = dark - Math.abs(Math.log(ratio)) * .8;
      if (!best || sc > best.sc) best = { sc, Hm, dark, ratio, img, r };
    }
    if (!best || best.dark < .25) return fail("or");
    for (let k = 0; k < 4; k++) {
      const m = lay[k]; const a = apply(best.Hm, m[0] - M[0].s / 2, m[1]), b = apply(best.Hm, m[0] + M[0].s / 2, m[1]);
      const exp = Math.hypot(a[0] - b[0], a[1] - b[1]); const got = q.sizes[(k + best.r) % 4] * S.f;
      let s1 = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const p = apply(best.Hm, m[0] + dx * .9, m[1] + dy * .9); s1 += bil(G0, p[0], p[1]); }
      const ins = s1 / 25; const rv = [];
      for (let t = 0; t < 16; t++) { const an = t / 16 * 6.283; const p = apply(best.Hm, m[0] + Math.cos(an) * 6.3, m[1] + Math.sin(an) * 6.3); rv.push(bil(G0, p[0], p[1])); }
      rv.sort((x, y) => x - y); const ring = (rv[8] + rv[10] + rv[12] + rv[14]) / 4;
      if (!(ins < ring * .66) || ring < 50) return fail("cn");
      if (got && (got / exp < .5 || got / exp > 1.9)) return fail("cn");
    }
    if (Math.abs(Math.log(best.ratio)) > .35) return fail("tl");
    // khung in: viền các ô khung phải tối hơn giấy cạnh đó (nếu nắn sai hoặc sai mẫu, tỉ lệ này thấp)
    let FIT = 0;
    {
      let hit = 0, n = 0; const Pv = (x, y) => { const p = apply(best.Hm, x, y); return bil(G0, p[0], p[1]); };
      L.rects.filter(r => r.w > 15 && r.h > 15).forEach(r => {
        for (let t = .1; t < .9; t += .1) {
          [[r.x + r.w * t, r.y, 0, 1], [r.x + r.w * t, r.y + r.h, 0, -1], [r.x, r.y + r.h * t, 1, 0], [r.x + r.w, r.y + r.h * t, -1, 0]].forEach(([x, y, dx, dy]) => {
            const on = Math.min(Pv(x, y), Pv(x - dx * .3, y - dy * .3), Pv(x + dx * .3, y + dy * .3), Pv(x - dx * .6, y - dy * .6), Pv(x + dx * .6, y + dy * .6));
            const off = (Pv(x + dx * 1.4, y + dy * 1.4) + Pv(x - dx * 1.4, y - dy * 1.4)) / 2;
            n++; if (off - on > 10) hit++;
          });
        }
      });
      FIT = n ? hit / n : 0;
      if (n && FIT < .75) return fail("fit", { fit: FIT });
    }
    const Wp = warp(G0, L, best.Hm); const white = whiteMap(Wp);
    let blk = 0; L.markers.forEach(m => blk += diskMean(Wp, m.x, m.y, m.s * .3)); blk /= 4;
    const D = p => { const wv = white(p.x, p.y); const g = diskMean(Wp, p.x, p.y, L.R * .62); return Math.max(0, Math.min(1.2, (wv - g) / Math.max(40, wv - blk))); };
    const res = { ok: true, ms: 0, sbd: "", ma: "", TN: [], DS: [], TLN: [], marks: [], warn: [] };
    const mark = (p, d, on, kind) => res.marks.push({ x: p.x, y: p.y, d: +d.toFixed(2), on, kind });
    function single(arr, key) { const ds = arr.map(D); const c = choose(ds); arr.forEach((p, i) => mark(p, ds[i], c.i === i || (c.st === "multi" && c.all.includes(i)), key)); return c; }
    // số báo danh, mã đề
    const digits = cols => cols.map(col => { const c = single(col, "id"); return c.st === "ok" ? col[c.i].v : c.st === "multi" ? "*" : "_"; }).join("");
    res.sbd = digits(L.sbd); res.ma = digits(L.ma);
    // Phần I
    L.tn.forEach(gq => { const c = single(gq.opts, "tn"); res.TN[gq.q] = c.st === "ok" ? gq.opts[c.i].v : c.st === "multi" ? "*" : ""; });
    // Phần II: mỗi ý chọn Đúng hoặc Sai
    L.ds.forEach(gq => { res.DS[gq.q] = gq.rows.map(r => { const c = single(r, "ds"); return c.st === "ok" ? r[c.i].v : c.st === "multi" ? "*" : "_"; }).join(""); });
    // Phần III: mỗi cột một kí tự
    L.tln.forEach(gq => { res.TLN[gq.q] = gq.cols.map(col => { const c = single(col, "tln"); return c.st === "ok" ? col[c.i].v : c.st === "multi" ? "*" : ""; }).join(""); });
    if (/[_*]/.test(res.sbd)) res.warn.push("Số báo danh chưa tô đủ hoặc tô trùng");
    if (/[_*]/.test(res.ma)) res.warn.push("Mã đề chưa tô đủ hoặc tô trùng");
    res.warped = Wp; res.ms = Date.now() - t0; res.corners = best.img; res.fit = FIT; res.paper = L.paper;
    return res;
  }
  /* thử các mẫu phiếu theo thứ tự (mẫu của bài trước), dừng khi khớp chắc */
  function readHyp(P, q, ids) {
    let best = null, bad = null;
    for (const id of ids) {
      const r = readQuad(P, q, typeof id === "string" ? OMR.build(id) : id);
      if (r.ok) { r.preset = typeof id === "string" ? id : r.preset; if (!best || r.fit > best.fit) best = r; if (r.fit >= .9) break; }
      else if (!bad || r.stage > bad.stage) bad = r;
    }
    return best || bad;
  }
  function readAuto(imageData, ids, opt = {}) {
    const t0 = Date.now(); const P = prepare(imageData, opt);
    if (!P.hyps.length) return fail("mk", { ms: Date.now() - t0 });
    let bad = null;
    for (const h of P.hyps) {
      if (h.two) {
        const rs = h.two.map(q => readHyp(P, q, ids)); const ok = rs.filter(r => r.ok);
        if (ok.length) { ok.forEach(r => { r.ms = Date.now() - t0; }); const r0 = ok[0]; r0.more = ok.slice(1); r0.twoUp = true; if (ok.length < 2) r0.warn.push("Chỉ đọc được 1 trong 2 phiếu trên tờ — chụp lại phiếu còn lại"); return r0; }
        rs.forEach(r => { if (!bad || r.stage > bad.stage) bad = r; });
      } else {
        const r = readHyp(P, h.one, ids); if (r.ok) { r.ms = Date.now() - t0; r.more = []; return r; }
        if (!bad || r.stage > bad.stage) bad = r;
      }
    }
    return Object.assign(bad || fail("mk"), { ms: Date.now() - t0 });
  }
  function read(imageData, L, opt) { return readAuto(imageData, [L], opt); }
  /* chỉ dò dấu góc (dùng cho khung hình camera, nhanh) */
  function detect(imageData, size) {
    const S = downscale(toGray(imageData), size || 480); const H = hypotheses(candidates(S, 10), S); if (!H.length) return null;
    const qs = H[0].two || [H[0].one];
    return { pts: qs[0].pts.map(p => [p[0] * S.f, p[1] * S.f]), quads: qs.map(q => q.pts.map(p => [p[0] * S.f, p[1] * S.f])) };
  }
  Object.assign(OMR, { read, readAuto, detect, prepare, PPM, homography, apply });
})(typeof window !== "undefined" ? window : globalThis);
