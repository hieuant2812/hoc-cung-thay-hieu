/* nhd/core.js — Ngân hàng đề: đọc file LaTeX (\cauTN, \cauDS, \cauTLN), chuyển LaTeX → HTML (KaTeX),
   vẽ TikZ (đường, đa giác, hình tròn, đồ thị hàm số, nhãn) và bảng biến thiên tkz-tab, trộn đề. */
(function (G) {
  "use strict";
  const NHD = G.NHD = G.NHD || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ================================================================ tiện ích chuỗi TeX */
  function stripComments(s) {
    return s.split("\n").map(line => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "\\") { i++; continue; }
        if (line[i] === "%") return line.slice(0, i);
      }
      return line;
    }).join("\n");
  }
  const skipWs = (s, i) => { while (i < s.length && /\s/.test(s[i])) i++; return i; };
  function readGroup(s, i, open = "{", close = "}") {
    if (s[i] !== open) return null;
    let d = 0;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (c === "\\") { j++; continue; }
      if (open === "[") {
        if (c === "{") d++; else if (c === "}") d--;
        else if (c === "]" && d === 0) return [s.slice(i + 1, j), j + 1];
      } else if (open === "(") {
        if (c === "(") d++; else if (c === ")") { d--; if (d === 0) return [s.slice(i + 1, j), j + 1]; }
      } else {
        if (c === "{") d++; else if (c === "}") { d--; if (d === 0) return [s.slice(i + 1, j), j + 1]; }
      }
    }
    return null;
  }
  function splitTop(s, sep = ",") {
    const out = []; let d = 0, cur = "", m = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "\\") { cur += c + (s[i + 1] || ""); i++; continue; }
      if (c === "{") d++; else if (c === "}") d--; else if (c === "$") m = !m;
      if (c === sep && d === 0 && !m) { out.push(cur); cur = ""; } else cur += c;
    }
    out.push(cur); return out;
  }
  function unbrace(v) { v = v.trim(); if (v[0] === "{") { const g = readGroup(v, 0); if (g && g[1] === v.length) return g[0].trim(); } return v; }
  function parseKeys(s) {
    const o = {};
    splitTop(s || "").forEach(p => { const k = p.indexOf("="); if (k < 0) { if (p.trim()) o[p.trim()] = true; return; } o[p.slice(0, k).trim()] = unbrace(p.slice(k + 1)); });
    return o;
  }
  const pad2 = n => String(n).padStart(2, "0");

  /* ================================================================ đọc ngân hàng */
  const NARG = { TN: 5, DS: 2, TLN: 2 };
  const MUC = ["NB", "TH", "VD", "VDC"];
  /* trả {questions, dang:{dkey: tên}, errors, lops:Set} — lopHint: lớp đang chọn (dùng khi mã câu không có tiền tố T10/T11/T12) */
  function parseBank(text, fileName, lopHint) {
    text = text.normalize("NFC").replace(/\r/g, "");
    const mD = text.match(/^%+\s*Dạng\s*:\s*(.+)$/m);
    const tenDang = mD ? mD[1].trim() : "";
    const s = stripComments(text);
    const qs = [], errs = [], dang = {};
    // đoán lớp: dòng đầu file ("Ngân hàng đề Toán 12"), rồi tên thư mục/file, cuối cùng là tab đang chọn
    let lopFile = 0;
    const mh = text.slice(0, 600).match(/(?:Toán|Vật lí|Vật lý|Hoá học|Hóa học|lớp|Lớp|khối)\s*(1[0-2]|[6-9])(?!\d)/);
    if (mh) lopFile = +mh[1];
    else { const mp = String(fileName || "").normalize("NFC").match(/(?:^|[^0-9A-Za-z])(?:T|toan|TOAN|TOÁN|ĐỀ|DE|lop|lớp|Lớp)[ _-]?(1[0-2]|[6-9])(?!\d)/i); if (mp) lopFile = +mp[1]; }
    const re = /\\cau(TN|DS|TLN)(?![A-Za-z])/g; let m;
    while ((m = re.exec(s))) {
      const loai = m[1], start = m.index; let i = skipWs(s, re.lastIndex), keys = {};
      try {
        if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); if (!g) throw "thiếu dấu ]"; keys = parseKeys(g[0]); i = g[1]; }
        const args = [];
        for (let k = 0; k < NARG[loai]; k++) { i = skipWs(s, i); const g = readGroup(s, i); if (!g) throw "thiếu nhóm {…} thứ " + (k + 1); args.push(g[0]); i = g[1]; }
        re.lastIndex = i;
        const id = (keys.id || "").trim();
        const q = { loai, id, muc: String(keys.muc || "").toUpperCase().trim(), loigiai: (keys.loigiai || "").trim(), de: args[0].trim() };
        if (loai === "TN") q.pa = args.slice(1).map(a => a.trim());
        else if (loai === "TLN") q.da = args[1].trim();
        else {
          q.y = []; const b = args[1]; const ry = /\\y(?![A-Za-z])/g; let my;
          while ((my = ry.exec(b))) { let j = skipWs(b, ry.lastIndex); const g1 = readGroup(b, j); if (!g1) break; j = skipWs(b, g1[1]); const g2 = readGroup(b, j); if (!g2) break; q.y.push({ t: g1[0].trim(), d: /^\s*[dđĐD]/.test(g2[0]) }); ry.lastIndex = g2[1]; }
          if (q.y.length !== 4) throw "câu Đúng/Sai cần đúng 4 ý \\y{…}{d|s}, đọc được " + q.y.length;
        }
        const mt = id.match(/^T(\d{1,2})-/); q.lop = mt ? +mt[1] : (lopFile || +lopHint || 0);
        const mi = id.match(/C(\d+)-B(\d+)-D(\d+)/i);
        if (!id) throw "thiếu id";
        if (!mi) throw "id không có dạng C?-B?-D??";
        if (!MUC.includes(q.muc)) throw "mức độ \"" + q.muc + "\" không hợp lệ (NB, TH, VD, VDC)";
        q.chuong = +mi[1]; q.bai = +mi[2]; q.dangSo = +mi[3];
        q.dkey = `C${q.chuong}-B${q.bai}-D${pad2(q.dangSo)}`;
        if (tenDang && !dang[q.lop + "|" + q.dkey]) dang[q.lop + "|" + q.dkey] = tenDang;
        q.file = fileName || "";
        qs.push(q);
      } catch (e) {
        errs.push({ file: fileName, id: keys.id || "(vị trí " + start + ")", msg: String(e) });
        re.lastIndex = start + 4;
      }
    }
    return { questions: qs, dang, errors: errs };
  }

  /* ================================================================ KaTeX */
  const MACROS = { "\\R": "\\mathbb{R}", "\\N": "\\mathbb{N}", "\\Z": "\\mathbb{Z}", "\\Q": "\\mathbb{Q}", "\\heva": "\\begin{cases}#1\\end{cases}", "\\hoac": "\\left[\\begin{matrix}#1\\end{matrix}\\right." };
  function math(src, display) {
    if (!G.katex) return esc(src);
    try { return katex.renderToString(src, { displayMode: !!display, throwOnError: false, strict: "ignore", trust: false, macros: MACROS }); }
    catch (e) { return "<code>" + esc(src) + "</code>"; }
  }

  /* ================================================================ LaTeX → HTML */
  const SIMPLE = { textbf: ["<b>", "</b>"], textit: ["<i>", "</i>"], emph: ["<i>", "</i>"], underline: ["<u>", "</u>"], text: ["", ""], mbox: ["", ""], textrm: ["", ""], textup: ["", ""], textsf: ["", ""], texttt: ["<code>", "</code>"], textnormal: ["", ""] };
  const SIZE = { tiny: .6, scriptsize: .7, footnotesize: .83, small: .91, normalsize: 1, large: 1.2, Large: 1.44 };
  const SKIP0 = /^(hfill|quad|qquad|noindent|centering|raggedright|raggedleft|medskip|smallskip|bigskip|hfil|vfill|indent|par|newline|linebreak|nobreak|allowbreak|displaystyle|relax|protect|null|hline|break)$/;
  function texToHtml(s) {
    let out = "", i = 0;
    s = String(s || "").replace(/\r/g, "");
    while (i < s.length) {
      const c = s[i];
      if (c === "$") {
        const dbl = s[i + 1] === "$"; let end = i + (dbl ? 2 : 1);
        for (; end < s.length; end++) { if (s[end] === "\\") { end++; continue; } if (s[end] === "$") break; }
        if (end >= s.length) { out += esc(s.slice(i)); break; }
        out += math(s.slice(i + (dbl ? 2 : 1), end), dbl); i = end + (dbl ? 2 : 1); continue;
      }
      if (c === "\\") {
        if (s.startsWith("\\(", i) || s.startsWith("\\[", i)) {
          const cl = s[i + 1] === "(" ? "\\)" : "\\]"; const end = s.indexOf(cl, i + 2);
          if (end > 0) { out += math(s.slice(i + 2, end), cl === "\\]"); i = end + 2; continue; }
        }
        if (s.startsWith("\\\\", i)) { out += "<br>"; i += 2; if (s[i] === "*") i++; i = skipWs(s, i); if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); if (g) i = g[1]; } continue; }
        const mm = /^\\([A-Za-z]+)\*?/.exec(s.slice(i));
        if (!mm) { const ch = s[i + 1] || ""; out += ch === "," ? "&thinsp;" : ch === " " ? " " : esc(ch); i += 2; continue; }
        const name = mm[1]; i += mm[0].length;
        if (name === "begin") {
          const g = readGroup(s, skipWs(s, i)); if (!g) continue; const env = g[0];
          const end = findEnd(s, env, g[1]); if (end < 0) { i = g[1]; continue; }
          let body = s.slice(g[1], end); i = end + ("\\end{" + env + "}").length;
          if (env === "center") out += '<div class="tex-center">' + texToHtml(body) + "</div>";
          else if (env === "tikzpicture") out += tikz(body);
          else if (env === "itemize" || env === "enumerate") {
            const b2 = body.trim(); if (b2.startsWith("[")) { const g2 = readGroup(b2, 0, "[", "]"); if (g2) body = b2.slice(g2[1]); }
            const items = body.split(/\\item(?![A-Za-z])/).slice(1);
            out += (env === "itemize" ? "<ul>" : "<ol>") + items.map(t => "<li>" + texToHtml(t) + "</li>").join("") + (env === "itemize" ? "</ul>" : "</ol>");
          }
          else if (/^(align|equation|gather|cases|array|aligned|matrix|pmatrix|bmatrix|vmatrix)\*?$/.test(env)) out += math("\\begin{" + env.replace("*", "") + "}" + body + "\\end{" + env.replace("*", "") + "}", true);
          else if (env === "tabular") out += tabular(body);
          else if (env === "minipage") { const b2 = body.replace(/^\s*(\[[^\]]*\])?\s*\{[^}]*\}/, ""); out += '<div style="display:inline-block;vertical-align:top">' + texToHtml(b2) + "</div>"; }
          else out += texToHtml(body);
          continue;
        }
        if (SIMPLE[name]) { const g = readGroup(s, skipWs(s, i)); if (g) { out += SIMPLE[name][0] + texToHtml(g[0]) + SIMPLE[name][1]; i = g[1]; } continue; }
        if (SIZE[name]) { continue; }
        if (name === "par" || name === "newline") { out += "<br>"; continue; }
        if (SKIP0.test(name)) { if (name === "quad" || name === "qquad" || name === "hfill") out += "&emsp;"; continue; }
        if (name === "vspace" || name === "hspace") { const g = readGroup(s, skipWs(s, i)); if (g) i = g[1]; if (name === "hspace") out += "&ensp;"; continue; }
        if (name === "renewcommand" || name === "setlength") { let g = readGroup(s, skipWs(s, i)); if (g) i = g[1]; else { const m2 = /^\\[A-Za-z]+/.exec(s.slice(skipWs(s, i))); if (m2) i = skipWs(s, i) + m2[0].length; } g = readGroup(s, skipWs(s, i)); if (g) i = g[1]; continue; }
        if (name === "includegraphics") { i = skipWs(s, i); if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); if (g) i = g[1]; } const g = readGroup(s, skipWs(s, i)); if (g) i = g[1]; out += '<span class="muted small">[hình ảnh]</span>'; continue; }
        if (name === "ldots" || name === "dots") { out += "…"; continue; }
        if (name === "LaTeX") { out += "LaTeX"; continue; }
        // lệnh lạ ngoài chế độ toán: giữ nội dung đối số đầu (nếu có)
        if (NHD.onUnknown) NHD.onUnknown(name);
        const g = readGroup(s, i); if (g) { out += texToHtml(g[0]); i = g[1]; }
        continue;
      }
      if (c === "~") { out += "&nbsp;"; i++; continue; }
      if (c === "{" || c === "}") { i++; continue; }
      if (c === "\n" && /^\n\s*\n/.test(s.slice(i))) { out += "<br>"; i = skipWs(s, i); continue; }
      if (c === "-" && s[i + 1] === "-") { out += s[i + 2] === "-" ? "—" : "–"; i += s[i + 2] === "-" ? 3 : 2; continue; }
      if (c === "`" && s[i + 1] === "`") { out += "“"; i += 2; continue; }
      if (c === "'" && s[i + 1] === "'") { out += "”"; i += 2; continue; }
      out += esc(c); i++;
    }
    return out;
  }
  function findEnd(s, env, from) { // \end khớp, có tính lồng
    const b = "\\begin{" + env + "}", e = "\\end{" + env + "}"; let d = 1, i = from;
    while (i < s.length) {
      const nb = s.indexOf(b, i), ne = s.indexOf(e, i);
      if (ne < 0) return -1;
      if (nb >= 0 && nb < ne) { d++; i = nb + b.length; } else { d--; if (d === 0) return ne; i = ne + e.length; }
    }
    return -1;
  }
  function tabular(body) {
    const g = readGroup(body.trimStart(), 0); let spec = "", rest = body;
    if (g) { spec = g[0]; rest = body.trimStart().slice(g[1]); }
    const al = (spec.match(/[lcrp]/g) || []).map(x => x === "l" ? "left" : x === "r" ? "right" : x === "p" ? "left" : "center");
    const vlines = /\|/.test(spec);
    const rows = splitRows(rest);
    let h = `<table class="t${vlines ? "" : " nov"}">`;
    rows.forEach(r => {
      const cells = splitTop(r.replace(/\\hline/g, "").replace(/\\cline\{[^}]*\}/g, ""), "&");
      if (cells.length === 1 && !cells[0].trim()) return;
      h += "<tr>" + cells.map((c, k) => {
        let t = c.trim(), span = 1, a = al[k] || "center";
        const mc = /^\\multicolumn\s*\{(\d+)\}\s*\{([^}]*)\}\s*/.exec(t);
        if (mc) { span = +mc[1]; a = /l/.test(mc[2]) ? "left" : /r/.test(mc[2]) ? "right" : "center"; const g2 = readGroup(t, mc[0].length); t = g2 ? g2[0] : t.slice(mc[0].length); }
        return `<td${span > 1 ? ` colspan="${span}"` : ""} style="text-align:${a}">${texToHtml(t)}</td>`;
      }).join("") + "</tr>";
    });
    return h + "</table>";
  }
  function splitRows(s) { // tách theo \\ ở mức ngoài cùng
    const out = []; let d = 0, cur = "";
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "\\" && s[i + 1] === "\\" && d === 0) { out.push(cur); cur = ""; i++; continue; }
      if (c === "\\") { cur += c + (s[i + 1] || ""); i++; continue; }
      if (c === "{") d++; else if (c === "}") d--;
      cur += c;
    }
    out.push(cur); return out.filter(r => r.replace(/\\hline/g, "").trim());
  }

  /* ================================================================ màu xcolor */
  const XC = { red: [1, 0, 0], green: [0, 1, 0], blue: [0, 0, 1], black: [0, 0, 0], white: [1, 1, 1], gray: [.5, .5, .5], darkgray: [.25, .25, .25], lightgray: [.75, .75, .75], orange: [1, .5, 0], cyan: [0, 1, 1], magenta: [1, 0, 1], yellow: [1, 1, 0], violet: [.5, 0, .5], purple: [.75, 0, .25], brown: [.75, .5, .25], teal: [0, .5, .5], olive: [.5, .5, 0], pink: [1, .75, .75], lime: [.75, 1, 0] };
  function xcolor(spec) {
    if (!spec) return null; spec = String(spec).trim();
    const parts = spec.split("!").map(x => x.trim());
    let cur = XC[parts[0]]; if (!cur) return null; cur = cur.slice();
    for (let k = 1; k < parts.length; k += 2) {
      const p = parseFloat(parts[k]) / 100; const other = XC[parts[k + 1]] || XC.white;
      if (!isFinite(p)) break;
      cur = cur.map((v, j) => v * p + other[j] * (1 - p));
    }
    return "#" + cur.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, "0")).join("");
  }

  /* ================================================================ biểu thức pgfmath (đồ thị) */
  function compileExpr(src) {
    const s = src.replace(/\\x/g, "x").replace(/\\y/g, "y").replace(/\s+/g, "");
    let p = 0;
    const peek = () => s[p];
    function num() { const m = /^(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/.exec(s.slice(p)); if (!m) return null; p += m[0].length; const v = parseFloat(m[0]); return () => v; }
    function primary() {
      const c = peek();
      if (c === "(") { p++; const e = expr(); if (s[p] !== ")") throw "thiếu )"; p++; return post(e); }
      if (c === "{") { p++; const e = expr(); if (s[p] !== "}") throw "thiếu }"; p++; return post(e); }
      const n = num(); if (n) return post(n);
      const m = /^[a-zA-Z]+/.exec(s.slice(p));
      if (m) {
        const id = m[0]; p += id.length;
        if (id === "x") return post(x => x);
        if (id === "pi") return post(() => Math.PI);
        if (id === "e") return post(() => Math.E);
        const F = { sin: 1, cos: 1, tan: 1, exp: 1, ln: 1, log10: 1, sqrt: 1, abs: 1, deg: 1, rad: 1, min: 2, max: 2, pow: 2, atan: 1, asin: 1, acos: 1, floor: 1, ceil: 1, round: 1 };
        if (!F[id]) throw "hàm lạ " + id;
        if (s[p] !== "(") throw "thiếu ( sau " + id;
        p++; const args = [expr()]; while (s[p] === ",") { p++; args.push(expr()); }
        let rad = false; if (s[p] === "r" && s[p + 1] === ")") { rad = true; p++; }
        if (s[p] !== ")") throw "thiếu )"; p++;
        const a = args[0], b = args[1], D = Math.PI / 180;
        const tr = f => rad ? (x => f(a(x))) : (x => f(a(x) * D));
        const fn = { sin: tr(Math.sin), cos: tr(Math.cos), tan: tr(Math.tan), exp: x => Math.exp(a(x)), ln: x => Math.log(a(x)), log10: x => Math.log10(a(x)), sqrt: x => Math.sqrt(a(x)), abs: x => Math.abs(a(x)), deg: x => a(x) / D, rad: x => a(x) * D, min: x => Math.min(a(x), b(x)), max: x => Math.max(a(x), b(x)), pow: x => Math.pow(a(x), b(x)), atan: x => Math.atan(a(x)) / D, asin: x => Math.asin(a(x)) / D, acos: x => Math.acos(a(x)) / D, floor: x => Math.floor(a(x)), ceil: x => Math.ceil(a(x)), round: x => Math.round(a(x)) }[id];
        return post(fn);
      }
      throw "ký tự lạ '" + c + "'";
    }
    function post(e) { return e; }
    function power() { let a = primary(); if (s[p] === "^") { p++; const b = unary(); const A = a; return x => Math.pow(A(x), b(x)); } return a; }
    function unary() { if (s[p] === "-") { p++; const a = unary(); return x => -a(x); } if (s[p] === "+") { p++; return unary(); } return power(); }
    function term() { let a = unary(); while (s[p] === "*" || s[p] === "/") { const op = s[p++]; const b = unary(), A = a; a = op === "*" ? (x => A(x) * b(x)) : (x => A(x) / b(x)); } return a; }
    function expr() { let a = term(); while (s[p] === "+" || s[p] === "-") { const op = s[p++]; const b = term(), A = a; a = op === "+" ? (x => A(x) + b(x)) : (x => A(x) - b(x)); } return a; }
    const f = expr(); if (p < s.length) throw "thừa ký tự: " + s.slice(p, p + 10);
    return f;
  }

  /* ================================================================ TikZ → SVG + nhãn HTML */
  const CM = 37.795; // px mỗi cm (96 dpi)
  const PT = 1.3333; // px mỗi pt
  let UID = 0;
  function lenToCm(v) { // "1.5pt" "2mm" "0.5" (cm)
    const m = /^\s*(-?[\d.]+)\s*(pt|cm|mm|em|ex)?\s*$/.exec(String(v)); if (!m) return null;
    const x = parseFloat(m[1]); return { v: x, u: m[2] || "" };
  }
  const ANCH = { center: [.5, .5], north: [.5, 0], south: [.5, 1], east: [1, .5], west: [0, .5], "north east": [1, 0], "north west": [0, 0], "south east": [1, 1], "south west": [0, 1], base: [.5, .8], mid: [.5, .5] };
  const REL = { above: "south", below: "north", left: "east", right: "west", "above left": "south east", "above right": "south west", "below left": "north east", "below right": "north west" };

  function tikzStyle(optStr, base) {
    const st = Object.assign({ w: null, dash: "", arrow: "", stroke: null, fill: null, fop: null, font: null, sx: 1, sy: 1 }, base || {});
    const o = splitTop(optStr || "").map(t => t.trim()).filter(Boolean);
    o.forEach(t => {
      const kv = t.indexOf("="); const k = kv < 0 ? t : t.slice(0, kv).trim(), v = kv < 0 ? "" : unbrace(t.slice(kv + 1));
      if (k === "thin") st.w = .4; else if (k === "very thin") st.w = .2; else if (k === "ultra thin") st.w = .1; else if (k === "semithick") st.w = .6;
      else if (k === "thick") st.w = .8; else if (k === "very thick") st.w = 1.2; else if (k === "ultra thick") st.w = 1.6;
      else if (k === "line width") { const L = lenToCm(v); if (L) st.w = L.u === "pt" || !L.u ? L.v : L.u === "mm" ? L.v * 2.845 : L.v * 28.45; }
      else if (k === "dashed") st.dash = "4 3"; else if (k === "densely dashed") st.dash = "3 2"; else if (k === "loosely dashed") st.dash = "5 5"; else if (k === "dotted") st.dash = "1 2"; else if (k === "densely dotted") st.dash = "1 1.4"; else if (k === "solid") st.dash = "";
      else if (/^(->|-stealth|-latex|-Stealth|-Latex|-to|->>)$/.test(k)) st.arrow = "end"; else if (/^(<-|stealth-|latex-)$/.test(k)) st.arrow = "start"; else if (/^(<->|stealth-stealth|latex-latex)$/.test(k)) st.arrow = "both";
      else if (k === "draw") st.stroke = v ? xcolor(v) || st.stroke : (st.stroke || "#000");
      else if (k === "fill") st.fill = xcolor(v) || "#000";
      else if (k === "color") { const c = xcolor(v); if (c) { st.stroke = c; st.color = c; } }
      else if (k === "text") st.text = xcolor(v);
      else if (k === "fill opacity" || k === "opacity") st.fop = parseFloat(v);
      else if (k === "font") st.font = v;
      else if (k === "scale") { st.sx *= parseFloat(v) || 1; st.sy *= parseFloat(v) || 1; }
      else if (k === "xscale") st.sx *= parseFloat(v) || 1; else if (k === "yscale") st.sy *= parseFloat(v) || 1;
      else if (k === "domain") st.domain = v; else if (k === "samples") st.samples = parseInt(v); else if (k === "smooth") st.smooth = true;
      else if (k === "anchor") st.anchor = v; else if (REL[k]) { st.anchor = REL[k]; st.shift = v; }
      else if (k === "inner sep") st.isep = v; else if (k === "midway") st.pos = .5; else if (k === "pos") st.pos = parseFloat(v); else if (k === "near end") st.pos = .75; else if (k === "near start") st.pos = .25;
      else if (k === "radius") st.radius = v;
      else if (kv < 0 && xcolor(k)) { st.stroke = xcolor(k); st.color = xcolor(k); }
    });
    return st;
  }
  function fontScale(f) { if (!f) return 1; const m = /\\(tiny|scriptsize|footnotesize|small|normalsize|large|Large)/.exec(f); return m ? SIZE[m[1]] : 1; }
  function plainLen(t) {
    let s = String(t).replace(/\\(?:dfrac|frac|tfrac)\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, (m, a, b) => a.length >= b.length ? a + "  " : b + "  ");
    s = s.replace(/\\(?:overrightarrow|vec|overline|widehat|mathrm|text|textbf|mathbb|left|right|displaystyle|limits)\b/g, "").replace(/\\(?:sqrt)\b/g, "v");
    s = s.replace(/\\[a-zA-Z]+/g, "xx").replace(/[{}$]/g, "").replace(/[\^_]./g, "");
    return s.length;
  }

  function tikz(body) {
    try {
      if (/\\tkzTabInit/.test(body)) return tkzTab(body);
      return tikzDraw(body);
    } catch (e) {
      if (NHD.onTikzError) NHD.onTikzError(e, body);
      return '<div class="tikz-raw" title="Hình chưa vẽ được trên web — bản TeX vẫn đầy đủ">[Hình TikZ]\n' + esc(body.trim().slice(0, 400)) + "</div>";
    }
  }

  function tikzDraw(raw) {
    let body = raw.trimStart(); let gopt = "";
    if (body[0] === "[") { const g = readGroup(body, 0, "[", "]"); gopt = g[0]; body = body.slice(g[1]); }
    const G0 = tikzStyle(gopt);
    const gk = parseKeys(gopt);
    const FS = NHD.figScale || 1; let ux = CM * G0.sx * FS, uy = CM * G0.sy * FS;
    if (gk.x) { const L = lenToCm(gk.x); if (L) ux = (L.u === "pt" ? L.v / 28.45 : L.u === "mm" ? L.v / 10 : L.v) * CM * G0.sx * FS; }
    if (gk.y) { const L = lenToCm(gk.y); if (L) uy = (L.u === "pt" ? L.v / 28.45 : L.u === "mm" ? L.v / 10 : L.v) * CM * G0.sy * FS; }
    const fsc0 = fontScale(G0.font);
    body = body.replace(/\\begin\{scope\}\s*(\[[^\]]*\])?/g, (m0, o) => "\\SCOPE" + (o || "[]") + ";").replace(/\\end\{scope\}/g, "\\ENDSCOPE;");
    const stmts = splitTop(body, ";").map(t => t.trim()).filter(Boolean);
    const named = {};
    const items = []; // {k:"path", d:[[cmd, pts]], st, clip} | {k:"label", p:[x,y], html, st}
    const scopes = [{ clip: null, st: {} }];
    function coord(str, cur) {
      str = str.trim();
      if (named[str]) return named[str].slice();
      let rel = 0; if (str.startsWith("++")) { rel = 2; str = str.slice(2); } else if (str.startsWith("+")) { rel = 1; str = str.slice(1); }
      let m = /^\(\s*([^,:()]+?)\s*,\s*([^,()]+?)\s*\)$/.exec(str) || /^\(\s*\{([^}]*)\}\s*,\s*\{([^}]*)\}\s*\)$/.exec(str);
      let P;
      if (m) { const a = evalNum(m[1]), b = evalNum(m[2]); P = [a, b]; }
      else if ((m = /^\(\s*([^:()]+)\s*:\s*([^()]+)\s*\)$/.exec(str))) { const a = evalNum(m[1]) * Math.PI / 180, r = evalNum(m[2]); P = [r * Math.cos(a), r * Math.sin(a)]; }
      else if ((m = /^\(\s*([A-Za-z][\w']*)\s*\)$/.exec(str)) && named[m[1]]) P = named[m[1]].slice();
      else throw "toạ độ lạ " + str;
      if (rel && cur) P = [cur[0] + P[0], cur[1] + P[1]];
      return P;
    }
    function evalNum(t) { t = String(t).trim(); const v = parseFloat(t); if (/^-?[\d.]+(e-?\d+)?$/.test(t)) return v; const L = lenToCm(t); if (L && L.u) return L.u === "pt" ? L.v / 28.45 : L.u === "mm" ? L.v / 10 : L.v; return compileExpr(t)(0); }

    for (const stmt of stmts) {
      let m;
      if ((m = /^\\SCOPE\[([^\]]*)\]$/.exec(stmt))) { const top = scopes[scopes.length - 1]; scopes.push({ clip: top.clip, st: Object.assign({}, top.st, { opt: (top.st.opt || "") + "," + m[1] }) }); continue; }
      if (stmt === "\\ENDSCOPE") { if (scopes.length > 1) scopes.pop(); continue; }
      const sc = scopes[scopes.length - 1];
      m = /^\\(draw|fill|filldraw|path|clip|node|coordinate|shade)\b\s*/.exec(stmt);
      if (!m) { if (/^\\(tikzset|pgf|def|newcommand|usetikzlibrary)/.test(stmt)) continue; throw "lệnh chưa hỗ trợ: " + stmt.slice(0, 50); }
      const cmd = m[1]; let rest = stmt.slice(m[0].length); let opt = "";
      if (rest[0] === "[") { const g = readGroup(rest, 0, "[", "]"); opt = g[0]; rest = rest.slice(g[1]).trim(); }
      const st = tikzStyle((sc.st.opt || "") + "," + opt, { w: G0.w, dash: G0.dash, arrow: "", stroke: G0.color || null, font: G0.font });
      if (cmd === "fill") { st.fill = st.fill || st.color || "#000"; if (!/\bdraw\b/.test(opt)) st.stroke = null; }
      else if (cmd === "filldraw") { st.fill = st.fill || st.color || "#000"; st.stroke = st.stroke || "#000"; }
      else if (cmd === "draw") { st.stroke = st.stroke || "#000"; }
      else if (cmd === "path" || cmd === "clip" || cmd === "shade") { if (!/\bdraw\b/.test(opt)) st.stroke = null; }
      if (cmd === "node" || cmd === "coordinate") { // \node[opt] (name) at (x,y) {text};
        let nm = null; let r = rest;
        const n1 = /^\(([A-Za-z][\w']*)\)\s*/.exec(r); if (n1) { nm = n1[1]; r = r.slice(n1[0].length); }
        const at = /^at\s*/.exec(r); let P = [0, 0];
        if (at) { r = r.slice(at[0].length); const g = readGroup(r, 0, "(", ")"); P = coord("(" + g[0] + ")"); r = r.slice(g[1]).trim(); }
        if (nm) named[nm] = P;
        if (cmd === "node") { const g = readGroup(r, 0); if (g) items.push({ k: "label", p: P, html: g[0], st, clip: sc.clip }); }
        continue;
      }
      // phân tích đường đi
      const segs = []; let cur = null, start = null; const labels = []; let i = 0; const s = rest;
      let lastSeg = null;
      while (i < s.length) {
        i = skipWs(s, i); if (i >= s.length) break;
        const ch = s[i];
        if (ch === "(" || (ch === "+" && (s[i + 1] === "(" || (s[i + 1] === "+" && s[i + 2] === "(")))) {
          const pre = ch === "+" ? (s[i + 1] === "+" ? "++" : "+") : ""; const g = readGroup(s, i + pre.length, "(", ")");
          const P = coord(pre + "(" + g[0] + ")", cur); i = g[1];
          segs.push(["M", P]); cur = P; start = P; lastSeg = null; continue;
        }
        if (s.startsWith("--", i) || s.startsWith("-|", i) || s.startsWith("|-", i)) {
          const op = s.slice(i, i + 2); i = skipWs(s, i + 2);
          if (s.startsWith("cycle", i)) { i += 5; segs.push(["Z"]); lastSeg = [cur, start]; cur = start; continue; }
          const pre = s[i] === "+" ? (s[i + 1] === "+" ? "++" : "+") : ""; const g = readGroup(s, i + pre.length, "(", ")"); if (!g) throw "thiếu toạ độ sau " + op;
          const P = coord(pre + "(" + g[0] + ")", cur); i = g[1];
          if (op === "-|") segs.push(["L", [P[0], cur[1]]]); else if (op === "|-") segs.push(["L", [cur[0], P[1]]]);
          segs.push(["L", P]); lastSeg = [cur, P]; if (pre !== "+") cur = P; continue;
        }
        if (s.startsWith("cycle", i)) { i += 5; segs.push(["Z"]); continue; }
        if (s.startsWith("rectangle", i)) {
          i = skipWs(s, i + 9); const pre = s[i] === "+" ? (s[i + 1] === "+" ? "++" : "+") : ""; const g = readGroup(s, i + pre.length, "(", ")"); const P = coord(pre + "(" + g[0] + ")", cur); i = g[1];
          segs.push(["L", [P[0], cur[1]]], ["L", P], ["L", [cur[0], P[1]]], ["Z"]); segs.push(["M", P]); lastSeg = [cur, P]; cur = P; continue;
        }
        if (s.startsWith("circle", i) || s.startsWith("ellipse", i)) {
          const isE = s.startsWith("ellipse", i); i = skipWs(s, i + (isE ? 7 : 6)); let rx, ry, abs = false;
          if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); i = g[1]; const kk = parseKeys(g[0]); const L = lenToCm(kk.radius || kk["x radius"] || "0.1"); rx = ry = L.v; abs = L.u === "pt"; if (abs) rx = ry = L.v; }
          else { const g = readGroup(s, i, "(", ")"); i = g[1]; const parts = g[0].split(/\s+and\s+/); const L1 = lenToCm(parts[0]); const L2 = lenToCm(parts[1] || parts[0]); rx = L1.v; ry = L2.v; abs = L1.u === "pt" || L1.u === "mm"; if (L1.u === "mm") { rx /= 10; ry /= 10; abs = false; } }
          segs.push(["C", cur, rx, ry, abs]); continue;
        }
        if (s.startsWith("arc", i)) {
          i = skipWs(s, i + 3); const g = readGroup(s, i, "(", ")"); i = g[1]; const [a0, a1, r] = g[0].split(":").map(t => evalNum(t));
          const rr = typeof r === "number" ? r : 1; const c0 = [cur[0] - rr * Math.cos(a0 * Math.PI / 180), cur[1] - rr * Math.sin(a0 * Math.PI / 180)];
          const N = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 5));
          for (let k = 1; k <= N; k++) { const t = (a0 + (a1 - a0) * k / N) * Math.PI / 180; segs.push(["L", [c0[0] + rr * Math.cos(t), c0[1] + rr * Math.sin(t)]]); }
          cur = [c0[0] + rr * Math.cos(a1 * Math.PI / 180), c0[1] + rr * Math.sin(a1 * Math.PI / 180)]; continue;
        }
        if (s.startsWith("plot", i)) {
          i = skipWs(s, i + 4); let pst = st;
          if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); i = skipWs(s, g[1]); pst = tikzStyle(g[0], st); }
          if (s.startsWith("coordinates", i)) {
            i = skipWs(s, i + 11); const g = readGroup(s, i); i = g[1]; const pts = []; const rc = /\(([^()]*)\)/g; let mc;
            while ((mc = rc.exec(g[0]))) pts.push(coord("(" + mc[1] + ")"));
            if (pts.length) { const sm = pst.smooth || st.smooth; pushPts(segs, pts, sm, cur !== null && false); cur = pts[pts.length - 1]; }
            continue;
          }
          const g = readGroup(s, i, "(", ")"); i = g[1];
          const parts = splitTop(g[0], ","); const fx = compileExpr(parts[0]), fy = compileExpr(unbrace(parts[1]));
          const dom = String(pst.domain || st.domain || "-5:5").split(":").map(t => evalNum(t)); const N = Math.min(600, pst.samples || st.samples || 25);
          const pts = []; for (let k = 0; k <= N; k++) { const x = dom[0] + (dom[1] - dom[0]) * k / N; const X = fx(x), Y = fy(x); pts.push(isFinite(X) && isFinite(Y) && Math.abs(Y) < 1e4 ? [X, Y] : null); }
          pushPts(segs, pts, false, cur !== null && segs.length > 0); const lp = pts.filter(Boolean).pop(); if (lp) cur = lp; continue;
        }
        if (s.startsWith("node", i)) {
          i = skipWs(s, i + 4); let nopt = "";
          if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); nopt = g[0]; i = skipWs(s, g[1]); }
          if (s[i] === "(") { const g = readGroup(s, i, "(", ")"); i = skipWs(s, g[1]); }
          const g = readGroup(s, i); if (!g) throw "node thiếu {…}"; i = g[1];
          const nst = tikzStyle(nopt, { font: st.font, text: st.text || st.color });
          let P = cur;
          if (nst.pos != null && lastSeg) P = [lastSeg[0][0] + (lastSeg[1][0] - lastSeg[0][0]) * nst.pos, lastSeg[0][1] + (lastSeg[1][1] - lastSeg[0][1]) * nst.pos];
          labels.push({ k: "label", p: P, html: g[0], st: nst, clip: null });
          continue;
        }
        if (s.startsWith("coordinate", i)) { i = skipWs(s, i + 10); if (s[i] === "[") i = readGroup(s, i, "[", "]")[1]; i = skipWs(s, i); const g = readGroup(s, i, "(", ")"); if (g) { named[g[0].trim()] = cur; i = g[1]; } continue; }
        if (s.startsWith("to", i) && /\W/.test(s[i + 2] || " ")) {
          i = skipWs(s, i + 2); if (s[i] === "[") i = readGroup(s, i, "[", "]")[1]; i = skipWs(s, i);
          const g = readGroup(s, i, "(", ")"); const P = coord("(" + g[0] + ")", cur); i = g[1]; segs.push(["L", P]); lastSeg = [cur, P]; cur = P; continue;
        }
        if (s.startsWith("grid", i)) {
          i = skipWs(s, i + 4); let step = 1; if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); i = g[1]; const kk = parseKeys(g[0]); if (kk.step) step = evalNum(kk.step); }
          const g = readGroup(s, skipWs(s, i), "(", ")"); i = g[1]; const P = coord("(" + g[0] + ")");
          const x0 = Math.min(cur[0], P[0]), x1 = Math.max(cur[0], P[0]), y0 = Math.min(cur[1], P[1]), y1 = Math.max(cur[1], P[1]);
          for (let x = Math.ceil(x0 / step) * step; x <= x1 + 1e-9; x += step) segs.push(["M", [x, y0]], ["L", [x, y1]]);
          for (let y = Math.ceil(y0 / step) * step; y <= y1 + 1e-9; y += step) segs.push(["M", [x0, y]], ["L", [x1, y]]);
          cur = P; continue;
        }
        if (s.startsWith("..", i)) { // .. controls (a) and (b) .. (c)
          i += 2; i = skipWs(s, i); if (s.startsWith("controls", i)) i += 8;
          const g1 = readGroup(s, skipWs(s, i), "(", ")"); i = g1[1]; const c1 = coord("(" + g1[0] + ")", cur); i = skipWs(s, i);
          let c2 = c1; if (s.startsWith("and", i)) { i = skipWs(s, i + 3); const g2 = readGroup(s, i, "(", ")"); i = g2[1]; c2 = coord("(" + g2[0] + ")", cur); }
          i = skipWs(s, i); if (s.startsWith("..", i)) i += 2; i = skipWs(s, i); const g3 = readGroup(s, i, "(", ")"); i = g3[1]; const P = coord("(" + g3[0] + ")", cur);
          segs.push(["B", c1, c2, P]); cur = P; continue;
        }
        if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); i = g[1]; continue; } // tuỳ chọn giữa đường
        throw "chưa hiểu: " + s.slice(i, i + 30);
      }
      if (cmd === "clip") {
        const rect = segs.filter(x => x[0] !== "C"); const pts = rect.filter(x => x[1]).map(x => x[1]);
        if (pts.length) sc.clip = { id: "cp" + (++UID), segs: segs.slice() };
        continue;
      }
      if (segs.length) items.push({ k: "path", segs, st, clip: sc.clip });
      items.push(...labels.map(l => Object.assign(l, { clip: null })));
    }
    return renderTikz(items, ux, uy, fsc0);
  }
  function pushPts(segs, pts, smooth, cont) {
    let pen = cont;
    if (smooth && pts.every(Boolean) && pts.length > 2) { // Catmull-Rom
      segs.push([pen ? "L" : "M", pts[0]]);
      for (let k = 0; k < pts.length - 1; k++) {
        const p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
        segs.push(["B", [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]);
      }
      return;
    }
    pts.forEach(p => { if (!p) { pen = false; return; } segs.push([pen ? "L" : "M", p]); pen = true; });
  }
  function renderTikz(items, ux, uy, fsc0) {
    // khung bao: các điểm (cắt theo vùng clip), nhãn ước lượng
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const acc = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    const clipBox = clip => { if (!clip) return null; let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity; clip.segs.forEach(sg => { if (sg[1] && sg[0] !== "C") { a = Math.min(a, sg[1][0]); b = Math.max(b, sg[1][0]); c = Math.min(c, sg[1][1]); d = Math.max(d, sg[1][1]); } }); return [a, b, c, d]; };
    items.forEach(it => {
      if (it.k === "path") {
        const cb = clipBox(it.clip);
        it.segs.forEach(sg => {
          const pts = sg[0] === "B" ? [sg[3]] : sg[0] === "Z" ? [] : [sg[1]];
          pts.forEach(p => { if (!p) return; if (cb && (p[0] < cb[0] - 1e-6 || p[0] > cb[1] + 1e-6 || p[1] < cb[2] - 1e-6 || p[1] > cb[3] + 1e-6)) return; acc(p[0] * ux, p[1] * uy); });
          if (sg[0] === "C") { const r = sg[4] ? sg[2] * PT : sg[2] * ux, r2 = sg[4] ? sg[3] * PT : sg[3] * uy; acc(sg[1][0] * ux - r, sg[1][1] * uy - r2); acc(sg[1][0] * ux + r, sg[1][1] * uy + r2); }
        });
        if (cb && isFinite(cb[0])) { /* vùng clip cũng thuộc khung nếu có nét vẽ trong đó */ }
      }
    });
    // nhãn
    const fpx = 16; // 12pt
    const L = items.filter(it => it.k === "label" && it.p);
    L.forEach(it => {
      const f = fontScale(it.st.font) * (it.st.font ? 1 : fsc0);
      it.fs = f;
      const w = plainLen(it.html) * fpx * f * .52 + 6, h = fpx * f * 1.25 + 4;
      const a = ANCH[it.st.anchor || "center"] || ANCH.center;
      const X = it.p[0] * ux, Y = it.p[1] * uy; // y lên trên
      acc(X - a[0] * w, Y + a[1] * h); acc(X + (1 - a[0]) * w, Y - (1 - a[1]) * h);
    });
    if (!isFinite(x0)) { x0 = 0; x1 = 10; y0 = 0; y1 = 10; }
    const pad = 3; const W = x1 - x0 + 2 * pad, H = y1 - y0 + 2 * pad;
    const X = x => (x * ux - x0 + pad), Y = y => (y1 - y * uy + pad);
    const id = ++UID;
    let defs = "", body = "", labels = "";
    const markers = {};
    const mk = color => { const k = color.replace("#", ""); if (!markers[k]) { markers[k] = `m${id}_${k}`; defs += `<marker id="${markers[k]}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0.6 L10,5 L0,9.4 L2.6,5 z" fill="${color}"/></marker>`; } return markers[k]; };
    const clips = {};
    const pathD = segs => segs.map(sg => {
      if (sg[0] === "M" || sg[0] === "L") return sg[0] + X(sg[1][0]).toFixed(2) + " " + Y(sg[1][1]).toFixed(2);
      if (sg[0] === "B") return "C" + [sg[1], sg[2], sg[3]].map(p => X(p[0]).toFixed(2) + " " + Y(p[1]).toFixed(2)).join(" ");
      if (sg[0] === "Z") return "Z";
      if (sg[0] === "C") { const cx = X(sg[1][0]), cy = Y(sg[1][1]); const rx = sg[4] ? sg[2] * PT : sg[2] * ux, ry = sg[4] ? sg[3] * PT : sg[3] * uy; return `M${(cx - rx).toFixed(2)} ${cy.toFixed(2)}a${rx.toFixed(2)} ${ry.toFixed(2)} 0 1 0 ${(2 * rx).toFixed(2)} 0a${rx.toFixed(2)} ${ry.toFixed(2)} 0 1 0 ${(-2 * rx).toFixed(2)} 0Z`; }
      return "";
    }).join("");
    items.forEach(it => {
      if (it.k !== "path") return;
      const s = it.st; let cp = "";
      if (it.clip) { if (!clips[it.clip.id]) { clips[it.clip.id] = `${it.clip.id}_${id}`; defs += `<clipPath id="${clips[it.clip.id]}"><path d="${pathD(it.clip.segs)}"/></clipPath>`; } cp = ` clip-path="url(#${clips[it.clip.id]})"`; }
      const sw = Math.max(.75, (s.w == null ? .4 : s.w) * PT);
      const stroke = s.stroke || "none"; const fill = s.fill || "none";
      let attrs = `d="${pathD(it.segs)}" fill="${fill}"${s.fop != null ? ` fill-opacity="${s.fop}"` : ""} stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"${s.dash && s.stroke ? ` stroke-dasharray="${s.dash.split(" ").map(v => (v * sw * .9 + .6).toFixed(1)).join(" ")}"` : ""}`;
      if (s.arrow && s.stroke) { const m = mk(s.stroke); if (s.arrow === "end" || s.arrow === "both") attrs += ` marker-end="url(#${m})"`; if (s.arrow === "start" || s.arrow === "both") attrs += ` marker-start="url(#${m})"`; }
      body += `<path ${attrs}${cp}/>`;
    });
    L.forEach(it => {
      const a = ANCH[it.st.anchor || "center"] || ANCH.center;
      let isep = it.st.isep != null ? lenToCm(it.st.isep) : { v: 3.33, u: "pt" }; const ip = isep.u === "pt" || !isep.u ? isep.v * PT : isep.v * CM / (isep.u === "mm" ? 10 : 1);
      let sh = 0; if (it.st.shift) { const Ls = lenToCm(it.st.shift); if (Ls) sh = Ls.u === "pt" ? Ls.v * PT : Ls.v * CM; }
      const dx = (.5 - a[0]) * 2 * sh, dy = (.5 - a[1]) * 2 * sh;
      const col = it.st.text ? `color:${it.st.text};` : "";
      labels += `<span class="tikz-lbl" style="left:${(X(it.p[0]) + dx).toFixed(1)}px;top:${(Y(it.p[1]) - dy).toFixed(1)}px;transform:translate(${-a[0] * 100}%,${-a[1] * 100}%);padding:${ip.toFixed(1)}px;font-size:${it.fs.toFixed(2)}em;${col}">${texToHtml(it.html)}</span>`;
    });
    return `<span class="tikz-wrap" style="width:${W.toFixed(1)}px;height:${H.toFixed(1)}px"><svg width="${W.toFixed(1)}" height="${H.toFixed(1)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}"><defs>${defs}</defs>${body}</svg>${labels}</span>`;
  }

  /* ================================================================ bảng biến thiên (tkz-tab) */
  function cmdArgs(s, name, n) {
    const k = s.indexOf("\\" + name); if (k < 0) return null;
    let i = k + name.length + 1, opt = ""; i = skipWs(s, i);
    if (s[i] === "[") { const g = readGroup(s, i, "[", "]"); opt = g[0]; i = g[1]; }
    const args = []; for (let j = 0; j < n; j++) { i = skipWs(s, i); const g = readGroup(s, i); if (!g) break; args.push(g[0]); i = g[1]; }
    return { opt, args };
  }
  function tkzTab(body) {
    const ini = cmdArgs(body, "tkzTabInit", 2); if (!ini) throw "tkz";
    const o = parseKeys(ini.opt); const lgt = parseFloat(o.lgt || 2), esp = parseFloat(o.espcl || 2), mar = parseFloat(o.deltacl || 0.5);
    const rows = splitTop(ini.args[0]).map(r => { const p = r.lastIndexOf("/"); return { t: r.slice(0, p).trim(), h: parseFloat(r.slice(p + 1)) || 1 }; });
    const xs = splitTop(ini.args[1]).map(x => x.trim()); const n = xs.length;
    const C = CM * .82 * (NHD.figScale || 1);
    const W = (lgt + 2 * mar + esp * (n - 1)) * C, x0 = lgt * C, Xk = k => x0 + (mar + esp * k) * C;
    const rh = rows.map(r => Math.max(r.h * C, 26)), ry = []; let acc = 0; rh.forEach(h => { ry.push(acc); acc += h; }); const H = acc;
    const id = ++UID; const lw = 1;
    let svg = `<svg width="${W.toFixed(1)}" height="${H.toFixed(1)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}"><defs><marker id="tk${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0.6 L10,5 L0,9.4 L2.6,5 z" fill="#000"/></marker></defs><g fill="none" stroke="#000" stroke-width="${lw}">`;
    svg += `<rect x=".5" y=".5" width="${(W - 1).toFixed(1)}" height="${(H - 1).toFixed(1)}"/><line x1="${x0}" y1="0" x2="${x0}" y2="${H}"/>`;
    ry.slice(1).forEach(y => svg += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
    let labels = "";
    const lbl = (x, y, html, ax = .5, ay = .5, bg) => `<span class="tikz-lbl" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;transform:translate(${-ax * 100}%,${-ay * 100}%);${bg ? "background:#fff;" : ""}padding:0 2px">${html}</span>`;
    rows.forEach((r, k) => labels += lbl(x0 / 2, ry[k] + rh[k] / 2, texToHtml(r.t)));
    xs.forEach((x, k) => labels += lbl(Xk(k), rh[0] / 2, texToHtml(x)));
    const order = []; const reAll = /\\tkzTab(Line|Var)\s*(\[[^\]]*\])?\s*\{/g; let ma;
    while ((ma = reAll.exec(body))) { const g = readGroup(body, ma.index + ma[0].length - 1); order.push({ kind: ma[1], items: splitTop(g[0]).map(t => t.trim()) }); }
    let rowIdx = 1;
    order.forEach(({ kind, items }) => {
      if (rowIdx >= rows.length) return;
      const y = ry[rowIdx], h = rh[rowIdx];
      if (kind === "Line") {
        items.forEach((t, j) => {
          const k = j / 2;
          if (j % 2 === 1) { if (t && t !== "h") labels += lbl((Xk(Math.floor(k)) + Xk(Math.ceil(k))) / 2, y + h / 2, texToHtml(/^[-+]$/.test(t) ? "$" + t + "$" : t)); else if (t === "h") svg += `<rect x="${Xk(Math.floor(k))}" y="${y}" width="${Xk(Math.ceil(k)) - Xk(Math.floor(k))}" height="${h}" fill="#ddd" stroke="none"/>`; }
          else {
            const xx = Xk(k);
            if (t === "z" || t === "0") { svg += `<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + h}" stroke-dasharray="3 3"/>`; labels += lbl(xx, y + h / 2, "0", .5, .5, true); }
            else if (t === "t") svg += `<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + h}" stroke-dasharray="3 3"/>`;
            else if (t === "d") svg += `<line x1="${xx - 2}" y1="${y}" x2="${xx - 2}" y2="${y + h}"/><line x1="${xx + 2}" y1="${y}" x2="${xx + 2}" y2="${y + h}"/>`;
            else if (t && k > 0 && k < n - 1) labels += lbl(xx, y + h / 2, texToHtml(t), .5, .5, true);
          }
        });
      } else {
        const pts = []; const pad = 11;
        items.forEach((t, k) => {
          const parts = splitTop(t, "/"); const code = parts[0].trim(); const vals = parts.slice(1);
          const xx = Xk(k), top = y + pad, bot = y + h - pad;
          const lev = c => c === "+" ? top : c === "-" ? bot : y + h / 2;
          if (code.includes("D")) {
            const [a, b] = code.split("D");
            svg += `<line x1="${xx - 2}" y1="${y}" x2="${xx - 2}" y2="${y + h}"/><line x1="${xx + 2}" y1="${y}" x2="${xx + 2}" y2="${y + h}"/>`;
            let vI = 0; let inP = null, outP = null;
            if (a) { const yy = lev(a); labels += lbl(xx - 4, yy, texToHtml(vals[vI++] || ""), 1, .5); inP = { x: xx - 26, y: yy }; }
            if (b) { const yy = lev(b); labels += lbl(xx + 4, yy, texToHtml(vals[vI++] || ""), 0, .5); outP = { x: xx + 26, y: yy }; }
            pts.push({ inP, outP });
          } else if (code === "R" || code === "") pts.push({ skip: true });
          else {
            const yy = lev(code[0]); labels += lbl(xx, yy, texToHtml(vals[0] || ""));
            pts.push({ inP: { x: xx, y: yy }, outP: { x: xx, y: yy } });
          }
        });
        const real = pts.filter(p => !p.skip);
        for (let j = 0; j + 1 < real.length; j++) {
          const A = real[j].outP, B = real[j + 1].inP; if (!A || !B) continue;
          const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), sh = 14;
          svg += `<line x1="${(A.x + dx / d * sh).toFixed(1)}" y1="${(A.y + dy / d * sh * .7).toFixed(1)}" x2="${(B.x - dx / d * sh).toFixed(1)}" y2="${(B.y - dy / d * sh * .7).toFixed(1)}" marker-end="url(#tk${id})"/>`;
        }
      }
      rowIdx++;
    });
    svg += "</g></svg>";
    return `<span class="tikz-wrap" style="width:${W.toFixed(1)}px;height:${H.toFixed(1)}px">${svg}${labels}</span>`;
  }

  /* ================================================================ trộn, ngẫu nhiên */
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function shuffle(arr, R) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* bố cục phương án: 4 cột, 2 cột hay 1 cột (dùng chung cho web và TeX) */
  function optCols(pa) {
    if (/tikzpicture|tkzTab|tabular/.test(pa.join(""))) return 2;
    const L = Math.max(...pa.map(plainLen));
    return L <= 14 ? 4 : L <= 34 ? 2 : 1;
  }

  /* Hình đặt bên phải: câu có đúng 1 hình TikZ (không phải bảng biến thiên), hình hẹp → tách hình ra khỏi đề bài */
  const SIDE_MAX_PX = 232; // ≈ 1/3 bề rộng dòng
  function sideFig(q) {
    const de = q.de || ""; if ((de.match(/\\begin\{tikzpicture\}/g) || []).length !== 1 || /\\tkzTab/.test(de)) return null;
    let a = de.indexOf("\\begin{tikzpicture}"), b = de.indexOf("\\end{tikzpicture}") + "\\end{tikzpicture}".length;
    const cs = de.lastIndexOf("\\begin{center}", a); const ce = de.indexOf("\\end{center}", b);
    if (cs >= 0 && ce >= 0 && !de.slice(cs + 14, a).trim() && !de.slice(b, ce).trim()) { a = cs; b = ce + "\\end{center}".length; }
    const figTex = de.slice(de.indexOf("\\begin{tikzpicture}"), de.indexOf("\\end{tikzpicture}") + "\\end{tikzpicture}".length);
    const html = tikz(figTex.replace(/^\\begin\{tikzpicture\}/, "").replace(/\\end\{tikzpicture\}$/, ""));
    const m = /tikz-wrap" style="width:([\d.]+)px/.exec(html); if (!m || +m[1] > SIDE_MAX_PX) return null;
    const rest = (de.slice(0, a) + " " + de.slice(b)).replace(/(\\\\\s*)+$/, "").trim();
    if (!rest) return null;
    return { figTex, figHtml: html, rest };
  }
  /* hiển thị một câu: item = {q, order} ; mode "exam" | "key" (có đáp án) ; opts.sol: kèm lời giải; opts.n: số câu */
  function renderQuestion(item, n, mode, opts = {}) {
    const { q, order } = item;
    let side = opts.side === false ? null : sideFig(q);
    if (!side && opts.hinh && G.HinhTuDong && !/tikzpicture|includegraphics/.test(q.de || "")) { const f = HinhTuDong.svg(q.de); if (f) side = { figHtml: f, rest: q.de, tuDong: true }; }
    let h = `<div class="q" data-k="${esc(q.k || q.id)}">`;
    if (opts.swap != null && opts.swap !== false) h += `<button class="swap noprint" data-swap="${opts.swap}" title="Thay bằng câu khác cùng dạng, cùng mức độ">⟳ Đổi câu</button>`;
    if (opts.meta) h += `<div class="meta"><span class="lv"><i class="${q.muc}">${q.muc}</i></span><span>${esc(q.id)}</span></div>`;
    let body = `<span class="qh">Câu ${n}.</span>${texToHtml(side ? side.rest : q.de)}`;
    if (q.loai === "TN") {
      let cols = optCols(q.pa); if (side) cols = cols === 4 ? 2 : 1;
      body += `<div class="opts c${cols}">` + order.map((j, i) => `<div class="opt${mode === "key" && j === 0 ? " right" : ""}"><b>${"ABCD"[i]}.</b>${texToHtml(q.pa[j])}</div>`).join("") + "</div>";
    } else if (q.loai === "DS") {
      body += order.map((j, i) => `<div class="ds-row"><b>${"abcd"[i]})</b><span>${texToHtml(q.y[j].t)}${mode === "key" ? ` <span class="ans">(${q.y[j].d ? "Đúng" : "Sai"})</span>` : ""}</span></div>`).join("");
    } else if (mode === "key") body += `<div>Đáp số: <span class="ans">${texToHtml(q.da)}</span></div>`;
    h += side ? `<div class="qside"><div>${body}</div><div class="qf">${side.figHtml}</div></div>` : body;
    if (opts.sol && q.loigiai) h += `<div class="sol"><span class="lb">Lời giải.</span> ${texToHtml(q.loigiai)}</div>`;
    return h + "</div>";
  }
  function keyOf(item) {
    const { q, order } = item;
    if (q.loai === "TN") return "ABCD"[order.indexOf(0)];
    if (q.loai === "DS") return order.map(j => q.y[j].d ? "Đ" : "S").join("");
    return q.da;
  }

  Object.assign(NHD, { MACROS, sideFig, esc, stripComments, readGroup, splitTop, parseKeys, parseBank, texToHtml, tikz, compileExpr, xcolor, rng, hash, shuffle, optCols, renderQuestion, keyOf, MUC, plainLen, findEnd });
})(window);
