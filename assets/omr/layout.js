/* omr/layout.js — Mẫu phiếu trả lời trắc nghiệm: toạ độ (mm) dùng chung cho in phiếu và chấm bằng camera.
   Mọi vị trí tính từ góc trên-trái tờ giấy. 4 ô vuông đen ở 4 góc là dấu định vị khi chấm. */
(function (G) {
  "use strict";
  const OMR = G.OMR = G.OMR || {};

  const PRESETS = {
    p15: { ten: "Kiểm tra 15 phút", ngan: "15 phút", paper: "A5", TN: 10, DS: 2, TLN: 0, mota: "10 câu trắc nghiệm + 2 câu Đúng/Sai · khổ A5 (in 2 phiếu trên 1 tờ A4)" },
    p45: { ten: "Kiểm tra 45 phút", ngan: "45 phút", paper: "A4", TN: 12, DS: 2, TLN: 4, mota: "12 câu trắc nghiệm + 2 câu Đúng/Sai + 4 câu trả lời ngắn" },
    p60: { ten: "Kiểm tra 60 phút", ngan: "60 phút", paper: "A4", TN: 16, DS: 4, TLN: 4, mota: "16 câu trắc nghiệm + 4 câu Đúng/Sai + 4 câu trả lời ngắn" },
    p90: { ten: "Toán 90 phút (cấu trúc Bộ 2025)", ngan: "90 phút – Toán", paper: "A4", TN: 12, DS: 4, TLN: 6, mota: "12 – 4 – 6: đúng cấu trúc đề thi tốt nghiệp môn Toán" },
    bo: { ten: "Mẫu phiếu thi tốt nghiệp của Bộ", ngan: "mẫu Bộ 40–8–6", paper: "A4", TN: 40, DS: 8, TLN: 6, bo: true, mota: "Bố cục như phiếu thi tốt nghiệp THPT: 40 câu – 8 câu Đúng/Sai – 6 câu trả lời ngắn, dùng chung mọi môn; cho học sinh lớp 12 làm quen" },
    p50: { ten: "Lí – Hoá – KHTN 50 phút (cấu trúc Bộ 2025)", ngan: "50 phút – Lí/Hoá", paper: "A4", TN: 18, DS: 4, TLN: 6, mota: "18 – 4 – 6: đúng cấu trúc đề thi tốt nghiệp môn Vật lí, Hoá học" }
  };
  const PAPER = { A4: [210, 297], A5: [148, 210] };

  // kích thước (mm)
  let R, PX, PY, PYN;     // bán kính ô tô; khoảng cách ngang; dọc (Phần I, II); dọc (SBD, mã đề, Phần III)
  const SIZE = { A4: [2.2, 5.8, 5.3, 4.75], A5: [1.95, 5.2, 4.75, 4.35] };
  const MK = 7, MKC = 10;  // cạnh dấu định vị, tâm cách mép
  const NSBD = 6, NMA = 3;

  function build(presetId) {
    const P = PRESETS[presetId] || PRESETS.p90;
    const [W, H] = PAPER[P.paper];
    [R, PX, PY, PYN] = P.bo ? [1.95, 5.0, 4.6, 4.1] : SIZE[P.paper];
    const L = { id: presetId, preset: P, W, H, R, markers: [], orient: null, texts: [], rects: [], lines: [], sbd: [], ma: [], tn: [], ds: [], tln: [] };
    L.markers = [[MKC, MKC], [W - MKC, MKC], [MKC, H - MKC], [W - MKC, H - MKC]].map(([x, y]) => ({ x, y, s: MK }));
    L.orient = { x: MKC + MK / 2 + 3, y: MKC - 1.5, w: 12, h: 3 }; // vạch đen cạnh góc trên-trái: xác định chiều phiếu
    const x0 = 10, x1 = W - 10; const small = P.paper === "A5";

    /* ---- khối số báo danh + mã đề (góc phải trên) */
    const idTop = 18;
    const gridW = n => n * PX;
    const maX = x1 - gridW(NMA) - 1, sbdX = maX - 5 - gridW(NSBD);
    function idGrid(n, X, title, arr) {
      L.texts.push({ x: X + gridW(n) / 2, y: idTop + 3, t: title, s: 2.8, b: true, a: "middle" });
      for (let c = 0; c < n; c++) { // ô viết số
        L.rects.push({ x: X + c * PX + .2, y: idTop + 4.6, w: PX - .4, h: 5.4, sw: .25 });
        const col = [];
        for (let d = 0; d < 10; d++) { const p = { x: X + c * PX + PX / 2, y: idTop + 13.2 + d * PYN, v: String(d) }; col.push(p); }
        arr.push(col);
      }
      L.rects.push({ x: X - .8, y: idTop - .5, w: gridW(n) + 1.6, h: 13.2 + 10 * PYN, sw: .35, r: 1.2 });
    }
    idGrid(NSBD, sbdX, "SỐ BÁO DANH", L.sbd);
    idGrid(NMA, maX, P.bo ? "MÃ ĐỀ THI" : "MÃ ĐỀ", L.ma);
    const idBottom = idTop + 13 + 10 * PYN;

    /* ---- phần chữ bên trái */
    const tx = x0 + 1, tw = sbdX - 4 - tx; let ty = idTop + 2;
    if (P.bo) { // đầu phiếu theo bố cục phiếu thi tốt nghiệp THPT
      L.texts.push({ x: tx + tw * .25, y: ty, t: "BỘ GIÁO DỤC VÀ ĐÀO TẠO", s: 2.8, b: true, a: "middle" });
      L.texts.push({ x: tx + tw * .75, y: ty, t: "KỲ THI TỐT NGHIỆP THPT", s: 2.8, b: true, a: "middle" }); ty += 4;
      L.texts.push({ x: tx + tw * .75, y: ty, t: "", s: 2.6, k: "nam", a: "middle" });
      L.texts.push({ x: tx + tw * .25, y: ty, t: "", s: 2.6, k: "truong", a: "middle" }); ty += 6;
      L.texts.push({ x: tx + tw / 2, y: ty, t: "PHIẾU TRẢ LỜI TRẮC NGHIỆM", s: 4.2, b: true, a: "middle", k: "tieude" }); ty += 6.5;
      const F = (lbl, x, w, wl) => { L.texts.push({ x, y: ty, t: lbl, s: 2.7 }); L.lines.push({ x1: x + wl, x2: x + w, y: ty + .6, dot: true }); };
      F("1. Hội đồng thi:", tx, tw, 21); ty += 5.2;
      F("2. Điểm thi:", tx, tw * .55, 15); F("3. Phòng thi số:", tx + tw * .58, tw * .42, 20); ty += 5.2;
      F("4. Họ và tên thí sinh:", tx, tw, 28); ty += 5.2;
      F("5. Ngày sinh:", tx, tw * .55, 17); F("6. Môn thi:", tx + tw * .58, tw * .42, 14); ty += 5.2;
      F("7. Chữ ký CBCT 1:", tx, tw * .5, 24); F("CBCT 2:", tx + tw * .53, tw * .47, 11); ty += 5.2;
      L.texts.push({ x: tx, y: ty, t: "Tô đúng:", s: 2.4, c: "#333" }); L.sample = [{ x: tx + 14, y: ty - .8, fill: true }];
      L.texts.push({ x: tx + 21, y: ty, t: "Tô sai:", s: 2.4, c: "#333" }); L.sample.push({ x: tx + 33, y: ty - .8, kind: "x" }, { x: tx + 39, y: ty - .8, kind: "dot" }, { x: tx + 45, y: ty - .8, kind: "half" });
    } else {
    L.texts.push({ x: tx, y: ty + 2, t: "PHIẾU TRẢ LỜI TRẮC NGHIỆM", s: small ? 3.6 : 4.4, b: true, k: "tieude" }); ty += small ? 7 : 8;
    L.texts.push({ x: tx, y: ty, t: "", s: 3, k: "truong" }); ty += 4.6;
    L.texts.push({ x: tx, y: ty, t: "", s: 3, k: "ky" }); ty += 4.6;
    L.texts.push({ x: tx, y: ty, t: "Mẫu: " + P.ngan, s: 2.6, k: "mau", c: "#555" }); ty += 6.5;
    L.texts.push({ x: tx, y: ty, t: "Họ và tên:", s: 3 }); L.lines.push({ x1: tx + 15, x2: tx + tw, y: ty + .6, dot: true }); ty += 6.5;
    L.texts.push({ x: tx, y: ty, t: "Lớp:", s: 3 }); L.lines.push({ x1: tx + 8, x2: tx + tw * .45, y: ty + .6, dot: true });
    L.texts.push({ x: tx + tw * .5, y: ty, t: "Phòng:", s: 3 }); L.lines.push({ x1: tx + tw * .5 + 11, x2: tx + tw, y: ty + .6, dot: true }); ty += 6.5;
    L.texts.push({ x: tx, y: ty, t: "Chữ kí giám thị:", s: 3 }); L.lines.push({ x1: tx + 24, x2: tx + tw, y: ty + .6, dot: true }); ty += 6;
    // hướng dẫn tô
    L.texts.push({ x: tx, y: ty, t: "Dùng bút chì 2B hoặc bút mực đen tô kín ô tròn.", s: 2.4, c: "#333" }); ty += 4;
    L.texts.push({ x: tx, y: ty, t: "Tô đúng:", s: 2.4, c: "#333" }); L.sample = [{ x: tx + 14, y: ty - .8, fill: true }];
    L.texts.push({ x: tx + 21, y: ty, t: "Tô sai:", s: 2.4, c: "#333" }); L.sample.push({ x: tx + 33, y: ty - .8, kind: "x" }, { x: tx + 39, y: ty - .8, kind: "dot" }, { x: tx + 45, y: ty - .8, kind: "half" });
    if (!small) { ty += 4; L.texts.push({ x: tx, y: ty, t: "Viết số báo danh, mã đề vào ô rồi tô ô số tương ứng ở cột dưới.", s: 2.4, c: "#333" }); }
    }

    /* ---- các khối câu hỏi, xếp từ trái sang phải, hết chỗ thì xuống hàng */
    const blocks = [];
    const nTNb = Math.ceil(P.TN / 10), perTN = nTNb ? Math.ceil(P.TN / nTNb) : 0;
    for (let b = 0, q = 0; b < nTNb; b++) { const n = Math.min(perTN, P.TN - q); blocks.push({ k: "TN", q0: q, n, w: 9 + 4 * PX + 1, h: 6.5 + n * PY + 1.5 }); q += n; }
    for (let q = 0; q < P.DS; q++) blocks.push({ k: "DS", q0: q, w: 10 + 2 * PX * 1.45 + 2, h: 12.5 + 4 * PY + 1.5 });
    for (let q = 0; q < P.TLN; q++) blocks.push({ k: "TLN", q0: q, w: 4 * PX + 4.2, h: 15.5 + 12 * PYN + 1 });
    let cx = x0, cy = idBottom + 7, rowH = 0; const GAP = P.bo ? 2.4 : small ? 3 : 3.6;
    const partTitle = { TN: "PHẦN I", DS: "PHẦN II", TLN: "PHẦN III" }; const titled = {};
    blocks.forEach(B => {
      if (!titled[B.k] && cx > x0 && !P.bo) { // phần mới: nếu không vừa cả phần ở hàng hiện tại thì xuống hàng
        const partW = blocks.filter(b => b.k === B.k).reduce((a, b) => a + b.w + GAP, -GAP);
        if (cx + Math.min(partW, x1 - x0) > x1 + .01) { cx = x0; cy += rowH + GAP; rowH = 0; }
      }
      if (cx + B.w > x1 + .01) { cx = x0; cy += rowH + GAP; rowH = 0; }
      if (!titled[B.k]) {
        L.texts.push({ x: cx, y: cy + 3, t: partTitle[B.k], s: 3.1, b: true });
        titled[B.k] = true; B.th = 5.5;
      } else B.th = 0;
      B.x = cx; B.y = cy + 5.5; cx += B.w + GAP; rowH = Math.max(rowH, B.h + 5.5);
      L.rects.push({ x: B.x, y: B.y, w: B.w, h: B.h, sw: .3, r: 1.2 });
      if (B.k === "TN") {
        ["A", "B", "C", "D"].forEach((t, j) => L.texts.push({ x: B.x + 9 + j * PX + PX / 2, y: B.y + 4.2, t, s: 2.7, b: true, a: "middle" }));
        for (let i = 0; i < B.n; i++) {
          const y = B.y + 6.5 + i * PY + PY / 2; const q = B.q0 + i;
          L.texts.push({ x: B.x + 7.4, y: y + 1, t: String(q + 1), s: 2.8, b: true, a: "end" });
          L.tn.push({ q, opts: ["A", "B", "C", "D"].map((v, j) => ({ x: B.x + 9 + j * PX + PX / 2, y, v })) });
          if (i % 5 === 4 && i < B.n - 1) L.lines.push({ x1: B.x + 1, x2: B.x + B.w - 1, y: y + PY / 2, sw: .15 });
        }
      } else if (B.k === "DS") {
        L.texts.push({ x: B.x + B.w / 2, y: B.y + 3.8, t: "Câu " + (B.q0 + 1), s: 2.8, b: true, a: "middle" });
        const dX = B.x + 10 + PX * .725, sX = dX + PX * 1.45;
        L.texts.push({ x: dX, y: B.y + 9.6, t: "Đúng", s: 2.3, a: "middle" }); L.texts.push({ x: sX, y: B.y + 9.6, t: "Sai", s: 2.3, a: "middle" });
        const rows = [];
        for (let i = 0; i < 4; i++) {
          const y = B.y + 12.5 + i * PY + PY / 2;
          L.texts.push({ x: B.x + 4, y: y + 1, t: "abcd"[i] + ")", s: 2.7, b: true, a: "middle" });
          rows.push([{ x: dX, y, v: "Đ" }, { x: sX, y, v: "S" }]);
        }
        L.ds.push({ q: B.q0, rows });
      } else {
        L.texts.push({ x: B.x + B.w / 2, y: B.y + 3.8, t: "Câu " + (B.q0 + 1), s: 2.8, b: true, a: "middle" });
        const bx = B.x + 2.1; const cols = [[], [], [], []];
        for (let c = 0; c < 4; c++) L.rects.push({ x: bx + c * PX + .25, y: B.y + 5.2, w: PX - .5, h: 5.4, sw: .25 });
        const sym = ["−", ",", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        sym.forEach((v, r) => {
          const y = B.y + 15.5 + r * PYN - PYN / 2 + 1;
          for (let c = 0; c < 4; c++) {
            if (v === "−" && c > 0) continue;       // dấu trừ chỉ ở cột đầu
            if (v === "," && (c === 0 || c === 3)) continue; // dấu phẩy ở cột 2, 3
            cols[c].push({ x: bx + c * PX + PX / 2, y, v: v === "−" ? "-" : v, lbl: v });
          }
        });
        L.tln.push({ q: B.q0, cols });
      }
    });
    L.bottom = cy + rowH;
    L.fits = L.bottom < H - 15;
    return L;
  }

  /* ---------------------------------------------------------------- SVG để in */
  const escx = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function svg(L, info = {}) {
    const val = { truong: info.truong || "", ky: [info.ky, info.mon].filter(Boolean).join(" – "), tieude: "PHIẾU TRẢ LỜI TRẮC NGHIỆM", nam: info.ky || "" };
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${L.W}mm" height="${L.H}mm" viewBox="0 0 ${L.W} ${L.H}" font-family="'Times New Roman',Termes,serif">`;
    s += `<rect width="${L.W}" height="${L.H}" fill="#fff"/>`;
    L.markers.forEach(m => s += `<rect x="${m.x - m.s / 2}" y="${m.y - m.s / 2}" width="${m.s}" height="${m.s}" fill="#000"/>`);
    s += `<rect x="${L.orient.x}" y="${L.orient.y}" width="${L.orient.w}" height="${L.orient.h}" fill="#000"/>`;
    L.rects.forEach(r => s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${r.r || 0}" fill="none" stroke="#222" stroke-width="${r.sw}"/>`);
    L.lines.forEach(l => s += `<line x1="${l.x1}" y1="${l.y}" x2="${l.x2}" y2="${l.y}" stroke="#444" stroke-width="${l.sw || .25}"${l.dot ? ' stroke-dasharray=".4 .9" stroke-linecap="round"' : ""}/>`);
    L.texts.forEach(t => { const tt = t.k && val[t.k] != null && t.k !== "mau" ? val[t.k] : t.t; if (!tt) return; s += `<text x="${t.x}" y="${t.y}" font-size="${t.s}" ${t.b ? 'font-weight="bold"' : ""} ${t.a ? `text-anchor="${t.a}"` : ""} fill="${t.c || "#000"}">${escx(tt)}</text>`; });
    const bub = (p, lbl) => `<circle cx="${p.x}" cy="${p.y}" r="${L.R}" fill="#fff" stroke="#333" stroke-width=".22"/>` + (lbl != null ? `<text x="${p.x}" y="${p.y + L.R * .43}" font-size="${(L.R * 1.2).toFixed(2)}" text-anchor="middle" fill="#9a9a9a" font-family="Arial,sans-serif">${escx(lbl)}</text>` : "");
    L.sbd.concat(L.ma).forEach(col => col.forEach(p => s += bub(p, p.v)));
    L.tn.forEach(g => g.opts.forEach(p => s += bub(p, p.v)));
    L.ds.forEach(g => g.rows.forEach(r => r.forEach(p => s += bub(p, null))));
    L.tln.forEach(g => g.cols.forEach(col => col.forEach(p => s += bub(p, p.lbl))));
    (L.sample || []).forEach(p => {
      s += `<circle cx="${p.x}" cy="${p.y}" r="${L.R * .8}" fill="${p.fill ? "#000" : "#fff"}" stroke="#333" stroke-width=".22"/>`;
      if (p.kind === "x") s += `<path d="M${p.x - 1} ${p.y - 1}L${p.x + 1} ${p.y + 1}M${p.x + 1} ${p.y - 1}L${p.x - 1} ${p.y + 1}" stroke="#000" stroke-width=".45"/>`;
      if (p.kind === "dot") s += `<circle cx="${p.x}" cy="${p.y}" r=".5" fill="#000"/>`;
      if (p.kind === "half") s += `<path d="M${p.x - L.R * .8} ${p.y}A${L.R * .8} ${L.R * .8} 0 0 0 ${p.x + L.R * .8} ${p.y}Z" fill="#000"/>`;
    });
    if (info.tuLuan) s += `<text x="${L.W / 2}" y="${L.H - 5.2}" font-size="2.6" text-anchor="middle" font-weight="bold" fill="#333">Phần tự luận làm ở mặt sau ➜</text>`;
    return s + "</svg>";
  }
  /* mặt sau: phần tự luận kẻ dòng chấm (không có dấu định vị — không chấm bằng camera) */
  function svgBack(L, info = {}) {
    const W = L.W, H = L.H, a5 = W < 160, x0 = a5 ? 10 : 14, x1 = W - x0, fs = a5 ? 2.9 : 3.3, gap = a5 ? 7 : 8;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}" font-family="'Times New Roman',Termes,serif"><rect width="${W}" height="${H}" fill="#fff"/>`;
    const T = (x, y, t, o = {}) => s += `<text x="${x}" y="${y}" font-size="${o.s || fs}" ${o.b ? 'font-weight="bold"' : ""} ${o.a ? `text-anchor="${o.a}"` : ""} fill="${o.c || "#000"}">${escx(t)}</text>`;
    const dot = (xa, xb, y) => s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="#555" stroke-width=".28" stroke-dasharray=".35 1.1" stroke-linecap="round"/>`;
    let y = a5 ? 12 : 15;
    // ô điểm, chữ kí giám khảo (góc phải)
    const bw = a5 ? 46 : 58, bh = a5 ? 18 : 21, bx = x1 - bw;
    s += `<rect x="${bx}" y="${y - 4}" width="${bw}" height="${bh}" rx="1.2" fill="none" stroke="#222" stroke-width=".35"/><line x1="${bx + bw / 2}" y1="${y - 4}" x2="${bx + bw / 2}" y2="${y - 4 + bh}" stroke="#222" stroke-width=".3"/>`;
    T(bx + bw / 4, y, "Điểm tự luận", { s: fs * .78, b: true, a: "middle" }); T(bx + bw * .75, y, "Giám khảo", { s: fs * .78, b: true, a: "middle" });
    const lw = bx - 4 - x0;
    T(x0, y + 1, "PHẦN TỰ LUẬN", { s: a5 ? 4 : 4.8, b: true });
    y += a5 ? 7.5 : 9;
    if (info.ky || info.mon) { T(x0, y, [info.ky, info.mon].filter(Boolean).join(" – "), { s: fs * .9 }); y += a5 ? 5.5 : 6.5; }
    T(x0, y, "Họ và tên:"); dot(x0 + (a5 ? 14 : 16), x0 + lw, y + .6); y += a5 ? 6 : 7;
    T(x0, y, "Lớp:"); dot(x0 + 8, x0 + lw * .45, y + .6); T(x0 + lw * .5, y, "SBD:"); dot(x0 + lw * .5 + 9, x0 + lw, y + .6);
    y = Math.max(y + (a5 ? 5 : 6), (a5 ? 12 : 15) - 4 + bh + 4);
    s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#222" stroke-width=".4"/>`;
    y += gap + 1;
    for (; y < H - (a5 ? 9 : 11); y += gap) dot(x0, x1, y);
    return s + "</svg>";
  }

  /* đáp án/điểm theo thang Bộ — key: {TN:["A"...], DS:["ĐSĐS"...], TLN:["2,5"...]}, ans cùng dạng */
  function normNum(s) {
    s = String(s == null ? "" : s).trim().replace(/\$/g, "").replace(/\s+/g, "").replace(/\./g, ",").replace(/^\+/, "").replace(/{,}/g, ",");
    if (!s) return "";
    const n = Number(s.replace(",", "."));
    return isFinite(n) && /^-?\d*,?\d*$/.test(s) ? String(n) : s;
  }
  function score(key, ans, mon) {
    const toan = /^To[aá]n/i.test(mon || "Toán");
    const w = { TN: .25, TLN: toan ? .5 : .25 }; const DS = [0, .1, .25, .5, 1];
    let raw = 0, max = 0; const detail = { TN: [], DS: [], TLN: [] };
    (key.TN || []).forEach((k, i) => { const ok = (ans.TN || [])[i] === k; detail.TN.push(ok); raw += ok ? w.TN : 0; max += w.TN; });
    (key.DS || []).forEach((k, i) => { const a = (ans.DS || [])[i] || ""; let c = 0; for (let j = 0; j < 4; j++) if (a[j] && a[j] === k[j]) c++; detail.DS.push(c); raw += DS[c]; max += 1; });
    (key.TLN || []).forEach((k, i) => { const ok = normNum((ans.TLN || [])[i]) !== "" && normNum((ans.TLN || [])[i]) === normNum(k); detail.TLN.push(ok); raw += ok ? w.TLN : 0; max += w.TLN; });
    const d10 = max ? Math.round(raw / max * 10 * 100) / 100 : 0;
    return { raw: Math.round(raw * 100) / 100, max: Math.round(max * 100) / 100, diem: d10, detail };
  }
  /* chọn mẫu phiếu nhỏ nhất chứa được số câu */
  function pickPreset(n) {
    const order = ["p15", "p45", "p60", "p90", "p50"];
    return order.find(id => PRESETS[id].TN >= n.TN && PRESETS[id].DS >= n.DS && PRESETS[id].TLN >= n.TLN) || "p50";
  }

  Object.assign(OMR, { PRESETS, PAPER, build, svg, svgBack, score, normNum, pickPreset });
})(typeof window !== "undefined" ? window : globalThis);
