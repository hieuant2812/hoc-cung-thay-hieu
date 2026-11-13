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
  function findMarkers(S) {
    const { g, w, h } = S; const N = w * h;
    // ngưỡng thích nghi bằng ảnh tích phân
    const I = new Float64Array((w + 1) * (h + 1));
    for (let y = 0; y < h; y++) { let r = 0; for (let x = 0; x < w; x++) { r += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + r; } }
    const rad = Math.max(8, Math.round(Math.min(w, h) / 14));
    const bin = new Uint8Array(N);
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - rad), y1 = Math.min(h, y + rad + 1);
      for (let x = 0; x < w; x++) {
        const x0 = Math.max(0, x - rad), x1 = Math.min(w, x + rad + 1);
        const s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0];
        const mean = s / ((x1 - x0) * (y1 - y0));
        bin[y * w + x] = g[y * w + x] < mean * .72 && g[y * w + x] < 150 ? 1 : 0;
      }
    }
    // thành phần liên thông
    const lab = new Int32Array(N); const comps = []; const stack = new Int32Array(N);
    for (let p = 0; p < N; p++) {
      if (!bin[p] || lab[p]) continue;
      const id = comps.length + 1; let sp = 0; stack[sp++] = p; lab[p] = id;
      let area = 0, sx = 0, sy = 0, minx = w, maxx = 0, miny = h, maxy = 0, edge = false;
      while (sp) {
        const q = stack[--sp]; const x = q % w, y = (q - x) / w;
        area++; sx += x; sy += y; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
        if (x > 0 && bin[q - 1] && !lab[q - 1]) { lab[q - 1] = id; stack[sp++] = q - 1; }
        if (x < w - 1 && bin[q + 1] && !lab[q + 1]) { lab[q + 1] = id; stack[sp++] = q + 1; }
        if (y > 0 && bin[q - w] && !lab[q - w]) { lab[q - w] = id; stack[sp++] = q - w; }
        if (y < h - 1 && bin[q + w] && !lab[q + w]) { lab[q + w] = id; stack[sp++] = q + w; }
      }
      comps.push({ area, cx: sx / area, cy: sy / area, bw: maxx - minx + 1, bh: maxy - miny + 1, edge });
    }
    const minA = Math.pow(Math.min(w, h) * .012, 2), maxA = N * .02;
    const cand = comps.filter(c => !c.edge && c.area >= minA && c.area <= maxA && c.bw / c.bh > .5 && c.bw / c.bh < 2 && c.area / (c.bw * c.bh) > .6);
    if (cand.length < 4) return null;
    // mỗi góc ảnh chọn một ứng viên: to, đặc, nằm xa tâm
    const cxm = w / 2, cym = h / 2; const quad = [[], [], [], []];
    cand.forEach(c => { const k = (c.cx < cxm ? 0 : 1) + (c.cy < cym ? 0 : 2); quad[k].push(c); });
    if (quad.some(q => !q.length)) return null;
    const pick = quad.map(q => q.map(c => ({ c, s: c.area * Math.hypot(c.cx - cxm, c.cy - cym) * (c.area / (c.bw * c.bh)) })).sort((a, b) => b.s - a.s)[0].c);
    const areas = pick.map(c => c.area); if (Math.max(...areas) > 4 * Math.min(...areas)) return null;
    return { pts: pick.map(c => [c.cx, c.cy]), sizes: pick.map(c => Math.sqrt(c.area)), size: Math.sqrt(areas.reduce((a, b) => a + b) / 4), comps: cand.length };
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
  function read(imageData, L, opt = {}) {
    const t0 = Date.now();
    const G0 = toGray(imageData);
    const S = downscale(G0, opt.detectSize || 900);
    const mk = findMarkers(S); if (!mk) return { ok: false, why: "Không thấy đủ 4 ô vuông đen ở góc phiếu" };
    let pts = mk.pts.map(p => [p[0] * S.f, p[1] * S.f]);
    pts = pts.map(p => refine(G0, p, mk.size * S.f * .75));
    // pts theo thứ tự góc ảnh: 0 trên-trái, 1 trên-phải, 2 dưới-trái, 3 dưới-phải → xếp theo chiều kim đồng hồ
    const cw = [pts[0], pts[1], pts[3], pts[2]];
    const M = L.markers; const lay = [[M[0].x, M[0].y], [M[1].x, M[1].y], [M[3].x, M[3].y], [M[2].x, M[2].y]];
    // thử 4 cách xoay, chọn cách có vạch định hướng đen và tỉ lệ hợp lí
    let best = null;
    for (let r = 0; r < 4; r++) {
      const img = [0, 1, 2, 3].map(k => cw[(k + r) % 4]);
      const Hm = homography(lay, img); if (!Hm) continue;
      const oc = L.orient; let s = 0, n = 0;
      for (let y = oc.y + .6; y <= oc.y + oc.h - .6; y += .6) for (let x = oc.x + .8; x <= oc.x + oc.w - .8; x += .8) { const [u, v] = apply(Hm, x, y); s += bil(G0, u, v); n++; }
      const [u1, v1] = apply(Hm, oc.x + oc.w + 6, oc.y + oc.h / 2); const [u2, v2] = apply(Hm, oc.x + oc.w / 2, oc.y + oc.h + 4); const paper = (bil(G0, u1, v1) + bil(G0, u2, v2)) / 2;
      const dark = (paper - s / n) / Math.max(30, paper);
      const sideTop = Math.hypot(img[1][0] - img[0][0], img[1][1] - img[0][1]), sideL = Math.hypot(img[3][0] - img[0][0], img[3][1] - img[0][1]);
      const ratio = (sideL / sideTop) / ((lay[3][1] - lay[0][1]) / (lay[1][0] - lay[0][0]));
      const sc = dark - Math.abs(Math.log(ratio)) * .8;
      if (!best || sc > best.sc) best = { sc, Hm, dark, ratio, img };
    }
    if (!best || best.dark < .25) return { ok: false, why: "Không xác định được chiều phiếu (vạch đen cạnh góc trên-trái)" };
    // kiểm tra: kích thước 4 dấu góc phải khớp với kích thước dự đoán, trong dấu phải đen, quanh dấu phải trắng
    {
      const cwS = [mk.sizes[0], mk.sizes[1], mk.sizes[3], mk.sizes[2]].map(v => v * S.f);
      for (let k = 0; k < 4; k++) {
        const m = lay[k]; const a = apply(best.Hm, m[0] - L.markers[0].s / 2, m[1]), b = apply(best.Hm, m[0] + L.markers[0].s / 2, m[1]);
        const exp = Math.hypot(a[0] - b[0], a[1] - b[1]); const got = cwS[(k + 4) % 4];
        const inside = (() => { let s2 = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const p = apply(best.Hm, m[0] + dx * .9, m[1] + dy * .9); s2 += bil(G0, p[0], p[1]); n++; } return s2 / n; })();
        const ring = (() => { let s2 = 0, n = 0; for (let t = 0; t < 16; t++) { const an = t / 16 * 6.283; const p = apply(best.Hm, m[0] + Math.cos(an) * 6.3, m[1] + Math.sin(an) * 6.3); s2 += bil(G0, p[0], p[1]); n++; } return s2 / n; })();
        if (!(inside < ring * .62) || ring < 60) return { ok: false, why: "Chưa thấy rõ cả 4 góc phiếu — đưa trọn tờ phiếu vào khung" };
        if (got && (got / exp < .55 || got / exp > 1.8)) return { ok: false, why: "Chưa thấy rõ cả 4 góc phiếu — đưa trọn tờ phiếu vào khung" };
      }
    }
    if (Math.abs(Math.log(best.ratio)) > .35) return { ok: false, why: "Phiếu bị nghiêng quá nhiều hoặc không đúng mẫu đã chọn" };
    // kiểm tra khung in: viền các ô khung phải tối hơn giấy ngay cạnh (nếu nắn sai, tỉ lệ này thấp)
    {
      let hit = 0, n = 0; const P = (x, y) => { const p = apply(best.Hm, x, y); return bil(G0, p[0], p[1]); };
      L.rects.filter(r => r.w > 15 && r.h > 15).forEach(r => {
        for (let t = .1; t < .9; t += .1) {
          [[r.x + r.w * t, r.y, 0, 1], [r.x + r.w * t, r.y + r.h, 0, -1], [r.x, r.y + r.h * t, 1, 0], [r.x + r.w, r.y + r.h * t, -1, 0]].forEach(([x, y, dx, dy]) => {
            const on = Math.min(P(x, y), P(x - dx * .25, y - dy * .25), P(x + dx * .25, y + dy * .25)); const off = (P(x + dx * 1.2, y + dy * 1.2) + P(x - dx * 1.2, y - dy * 1.2)) / 2;
            n++; if (off - on > 12) hit++;
          });
        }
      });
      var FIT = n ? hit / n : 0;
      if (n && hit / n < .8) return { ok: false, why: "Không khớp mẫu phiếu đã chọn, hoặc chưa thấy trọn tờ phiếu", fit: hit / n };
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
    res.warped = Wp; res.ms = Date.now() - t0; res.corners = best.img; res.fit = FIT;
    return res;
  }
  /* chỉ dò dấu góc (dùng cho khung hình camera, nhanh) */
  function detect(imageData, size) { const S = downscale(toGray(imageData), size || 480); const m = findMarkers(S); return m ? { pts: m.pts.map(p => [p[0] * S.f, p[1] * S.f]) } : null; }

  /* thử nhiều mẫu phiếu, lấy mẫu khớp nhất (khung in trùng nhiều nhất) */
  function readAuto(imageData, ids, opt) {
    let best = null, lastFail = null;
    for (const id of ids) { const r = read(imageData, OMR.build(id), opt); if (r.ok) { r.preset = id; if (!best || r.fit > best.fit) best = r; } else lastFail = r; }
    return best || lastFail || { ok: false, why: "Không đọc được phiếu" };
  }
  Object.assign(OMR, { read, readAuto, detect, PPM, homography, apply });
})(typeof window !== "undefined" ? window : globalThis);
