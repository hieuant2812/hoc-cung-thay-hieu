/* docx.js — xuất tài liệu Word (.docx) từ HTML đã dựng trên trang, công thức là Equation thật của Word (OMML).
   Dùng: Docx.fromHtml(htmlStringHoặcElement, {orientation:"portrait"|"landscape", font:"Times New Roman", size:12, margins:{top,right,bottom,left} (cm), title})
         → Promise<Blob>;  Docx.save(blob, "ten-file.docx").
   - Công thức: mọi phần tử .katex (KaTeX) được đọc MathML (annotation) → đổi sang OMML.
     Có thể ghi thẳng <span data-tex="\\dfrac{1}{2}"></span> trong HTML, hàm sẽ tự biên dịch qua KaTeX.
   - Hình TikZ (.tikz-wrap), <svg>, <img> → ảnh PNG chèn vào Word (cần html2canvas cho .tikz-wrap).
   - Bảng <table> → bảng Word, giữ colspan/rowspan, độ rộng theo colgroup/width hoặc chia đều.
   - Ngắt trang: <div class="pagebreak"></div>. Đổi hướng trang giữa chừng: <div data-sect="landscape"> ... </div> (mỗi khối là một section).
   Phụ thuộc: JSZip (assets/lib/jszip.min.js), KaTeX (nếu có data-tex), html2canvas (nếu có TikZ). */
(function () {
  "use strict";
  const W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const xml = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const CM = 567; // twips / cm
  const EMU_PX = 9525; // EMU / px (96 dpi)

  /* ================================================================ MathML → OMML */
  const ACC = { "→": "\u20D7", "⃗": "\u20D7", "^": "\u0302", "ˆ": "\u0302", "~": "\u0303", "˜": "\u0303", "˙": "\u0307", "¨": "\u0308", "´": "\u0301", "`": "\u0300", "ˇ": "\u030C", "˘": "\u0306", "⃡": "\u20E1", "←": "\u20D6" };
  const NARY = new Set(["∑", "∏", "∐", "∫", "∬", "∭", "∮", "⋃", "⋂", "⋁", "⋀", "⨆", "⨁", "⨂"]);
  const FUNC = new Set(["sin", "cos", "tan", "cot", "ln", "log", "lim", "max", "min", "exp", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "det", "dim", "sup", "inf", "gcd", "deg", "arg", "mod", "lg"]);
  const isEl = n => n && n.nodeType === 1;
  const tag = n => isEl(n) ? n.localName.toLowerCase() : "";
  const kids = n => Array.from(n.childNodes).filter(c => isEl(c) || (c.nodeType === 3 && c.nodeValue.trim()));
  const mt = (t, plain, extra) => `<m:r>${plain || extra ? `<m:rPr>${plain ? '<m:sty m:val="p"/>' : ""}${extra || ""}</m:rPr>` : ""}<m:t xml:space="preserve">${xml(t)}</m:t></m:r>`;
  function mtext(n) { return n.textContent.replace(/\u00a0/g, " "); }
  function isFence(n) { return tag(n) === "mo" && (n.getAttribute("fence") === "true" || /^[()\[\]{}|‖⟨⟩⌊⌋⌈⌉]$/.test(mtext(n).trim())); }
  function omml(n) {
    if (!n) return "";
    if (n.nodeType === 3) return n.nodeValue.trim() ? mt(n.nodeValue) : "";
    const t = tag(n), K = kids(n);
    const inner = () => K.map(omml).join("");
    switch (t) {
      case "math": case "semantics": case "mstyle": case "mpadded": case "menclose": case "merror": return seq(K);
      case "annotation": case "annotation-xml": case "mphantom": return "";
      case "mrow": return seq(K);
      case "mi": { const s = mtext(n); const plain = n.getAttribute("mathvariant") === "normal" || s.length > 1 || FUNC.has(s); return s.trim() ? mt(s, plain) : ""; }
      case "mn": return mt(mtext(n));
      case "mo": { const s = mtext(n); if (!s.trim()) return ""; if (s === "\u2061" || s === "\u2062" || s === "\u2063") return ""; const par = n.parentNode; const pt = tag(par); const lone = /^[+\-−±]$/.test(s.trim()) && par && /^(msup|msub|msubsup)$/.test(pt) && kids(par)[0] !== n; return lone ? mt(s, false, "<m:nor/>") : mt(s); }
      case "mtext": { const s = mtext(n); return s ? mt(s, true) : ""; }
      case "mspace": { const w = n.getAttribute("width") || ""; return /^-?0/.test(w) || !w ? "" : mt(" "); }
      case "mfrac": { const [a, b] = K; const thin = n.getAttribute("linethickness"); return `<m:f>${thin === "0" || thin === "0px" ? '<m:fPr><m:type m:val="noBar"/></m:fPr>' : ""}<m:num>${omml(a)}</m:num><m:den>${omml(b)}</m:den></m:f>`; }
      case "msqrt": return `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>${seq(K)}</m:e></m:rad>`;
      case "mroot": return `<m:rad><m:deg>${omml(K[1])}</m:deg><m:e>${omml(K[0])}</m:e></m:rad>`;
      case "msup": { const [b, s] = K; if (naryBase(b)) return nary(b, null, s, null); return `<m:sSup><m:e>${omml(b)}</m:e><m:sup>${omml(s)}</m:sup></m:sSup>`; }
      case "msub": { const [b, s] = K; if (naryBase(b)) return nary(b, s, null, null); return `<m:sSub><m:e>${omml(b)}</m:e><m:sub>${omml(s)}</m:sub></m:sSub>`; }
      case "msubsup": { const [b, s1, s2] = K; if (naryBase(b)) return nary(b, s1, s2, null); return `<m:sSubSup><m:e>${omml(b)}</m:e><m:sub>${omml(s1)}</m:sub><m:sup>${omml(s2)}</m:sup></m:sSubSup>`; }
      case "mover": {
        const [b, o] = K; const oc = isEl(o) ? mtext(o).trim() : "";
        if (naryBase(b)) return nary(b, null, o, null);
        if (oc === "¯" || oc === "‾" || oc === "_" || oc === "―" || oc === "─") return `<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>${omml(b)}</m:e></m:bar>`;
        if (oc === "⏞" || oc === "⏜") return `<m:groupChr><m:groupChrPr><m:chr m:val="${xml(oc)}"/><m:pos m:val="top"/><m:vertJc m:val="bot"/></m:groupChrPr><m:e>${omml(b)}</m:e></m:groupChr>`;
        if (ACC[oc] || n.getAttribute("accent") === "true") return `<m:acc><m:accPr><m:chr m:val="${xml(ACC[oc] || oc)}"/></m:accPr><m:e>${omml(b)}</m:e></m:acc>`;
        return `<m:limUpp><m:e>${omml(b)}</m:e><m:lim>${omml(o)}</m:lim></m:limUpp>`;
      }
      case "munder": {
        const [b, u] = K; const uc = isEl(u) ? mtext(u).trim() : "";
        if (naryBase(b)) return nary(b, u, null, null);
        if (uc === "¯" || uc === "_" || uc === "‾") return `<m:bar><m:barPr><m:pos m:val="bot"/></m:barPr><m:e>${omml(b)}</m:e></m:bar>`;
        if (uc === "⏟" || uc === "⏝") return `<m:groupChr><m:groupChrPr><m:chr m:val="${xml(uc)}"/></m:groupChrPr><m:e>${omml(b)}</m:e></m:groupChr>`;
        return `<m:limLow><m:e>${omml(b)}</m:e><m:lim>${omml(u)}</m:lim></m:limLow>`;
      }
      case "munderover": { const [b, u, o] = K; if (naryBase(b)) return nary(b, u, o, null); return `<m:limUpp><m:e><m:limLow><m:e>${omml(b)}</m:e><m:lim>${omml(u)}</m:lim></m:limLow></m:e><m:lim>${omml(o)}</m:lim></m:limUpp>`; }
      case "mtable": return matrix(n);
      case "mtr": case "mtd": return seq(K);
      default: return inner();
    }
  }
  function naryBase(b) { return isEl(b) && tag(b) === "mo" && NARY.has(mtext(b).trim()); }
  function nary(b, sub, sup, body) {
    const ch = mtext(b).trim(); const isInt = /[∫∬∭∮]/.test(ch);
    return `<m:nary><m:naryPr><m:chr m:val="${xml(ch)}"/><m:limLoc m:val="${isInt ? "subSup" : "undOvr"}"/>${sub ? "" : '<m:subHide m:val="1"/>'}${sup ? "" : '<m:supHide m:val="1"/>'}</m:naryPr><m:sub>${sub ? omml(sub) : ""}</m:sub><m:sup>${sup ? omml(sup) : ""}</m:sup><m:e>${body || ""}</m:e></m:nary>`;
  }
  /* dãy phần tử trong một mrow: ghép ( … ) thành m:d; ∑/∫ nuốt phần đứng sau làm đối số */
  function seq(K) {
    let out = "", i = 0;
    while (i < K.length) {
      const n = K[i];
      if (isEl(n) && isFence(n) && /[(\[{|‖⟨⌊⌈]/.test(mtext(n).trim()) && n.getAttribute("fence") !== "false") {
        // tìm fence đóng cùng cấp
        const open = mtext(n).trim(); let depth = 0, j = i + 1, found = -1;
        for (; j < K.length; j++) {
          const m = K[j]; if (!isEl(m) || tag(m) !== "mo") continue; const c = mtext(m).trim();
          if (isFence(m) && /[(\[{|‖⟨⌊⌈]/.test(c) && !(c === "|" && open !== "|")) { if (c === "|" && open === "|" && depth === 0) { found = j; break; } depth++; }
          else if (isFence(m) && /[)\]}|‖⟩⌋⌉]/.test(c)) { if (depth === 0) { found = j; break; } depth--; }
        }
        if (found > 0) {
          const close = mtext(K[found]).trim(); const mid = K.slice(i + 1, found);
          if (mid.length === 1 && tag(mid[0]) === "mtable") { out += `<m:d><m:dPr><m:begChr m:val="${xml(open)}"/><m:endChr m:val="${xml(close)}"/></m:dPr><m:e>${matrix(mid[0])}</m:e></m:d>`; }
          else out += `<m:d><m:dPr><m:begChr m:val="${xml(open)}"/><m:endChr m:val="${xml(close)}"/></m:dPr><m:e>${seq(mid)}</m:e></m:d>`;
          i = found + 1; continue;
        }
        if (open === "{" && K[i + 1] && tag(K[i + 1]) === "mtable") { // hệ (cases) không có fence đóng
          out += `<m:d><m:dPr><m:begChr m:val="{"/><m:endChr m:val=""/></m:dPr><m:e>${eqArr(K[i + 1])}</m:e></m:d>`; i += 2; continue;
        }
      }
      // lim, max, min có cận dưới: m:func với đối số là phần tử kế tiếp (Word/LibreOffice hiển thị đúng)
      if (isEl(n) && (tag(n) === "munder" || tag(n) === "msub")) {
        const kk = kids(n); const b0 = kk[0]; const nm = b0 ? mtext(b0).replace(/[\u2061\u2062]/g, "").trim() : "";
        if (/^(lim|max|min|sup|inf|lim sup|lim inf)$/.test(nm) && K[i + 1]) {
          out += `<m:func><m:fName><m:limLow><m:e>${mt(nm, true)}</m:e><m:lim>${omml(kk[1])}</m:lim></m:limLow></m:fName><m:e>${omml(K[i + 1])}</m:e></m:func>`; i += 2; continue;
        }
      }
      // ∑, ∫ … có cận: lấy phần còn lại của mrow làm đối số
      const base = isEl(n) && /^(msub|msup|msubsup|munder|mover|munderover)$/.test(tag(n)) ? kids(n)[0] : (isEl(n) && tag(n) === "mo" ? n : null);
      if (base && naryBase(base)) {
        const kk = isEl(n) && tag(n) !== "mo" ? kids(n) : [n]; const t = tag(n);
        const sub = t === "msub" || t === "munder" || t === "msubsup" || t === "munderover" ? kk[1] : null;
        const sup = t === "msup" || t === "mover" ? kk[1] : (t === "msubsup" || t === "munderover" ? kk[2] : null);
        const rest = K.slice(i + 1); out += nary(base, sub, sup, seq(rest)); i = K.length; continue;
      }
      out += omml(n); i++;
    }
    return out;
  }
  function matrix(tbl) {
    const rows = kids(tbl).filter(r => tag(r) === "mtr");
    if (!rows.length) return "";
    const align = (tbl.getAttribute("columnalign") || "").trim();
    if (/left/.test(align) && rows.every(r => kids(r).length <= 2)) return eqArr(tbl); // hệ phương trình / cases
    const nc = Math.max(...rows.map(r => kids(r).length));
    return `<m:m><m:mPr><m:mcs><m:mc><m:mcPr><m:count m:val="${nc}"/><m:mcJc m:val="center"/></m:mcPr></m:mc></m:mcs></m:mPr>${rows.map(r => `<m:mr>${kids(r).map(c => `<m:e>${seq(kids(c))}</m:e>`).join("")}${"<m:e/>".repeat(nc - kids(r).length)}</m:mr>`).join("")}</m:m>`;
  }
  function eqArr(tbl) {
    const rows = kids(tbl).filter(r => tag(r) === "mtr");
    return `<m:eqArr><m:eqArrPr><m:maxDist m:val="1"/></m:eqArrPr>${rows.map(r => `<m:e>${kids(r).map((c, k) => (k ? mt("  ") : "") + seq(kids(c))).join("")}</m:e>`).join("")}</m:eqArr>`;
  }
  function mathFromTex(tex, display) {
    if (!window.katex) return null;
    try {
      const html = katex.renderToString(tex, { output: "mathml", throwOnError: false, strict: "ignore", displayMode: !!display, macros: (window.NHD && NHD.MACROS) || {} });
      const d = new DOMParser().parseFromString(html, "text/html"); return d.querySelector("math");
    } catch (e) { return null; }
  }
  function oMath(mathEl, display) {
    const body = omml(mathEl);
    return display ? `<m:oMathPara><m:oMath>${body}</m:oMath></m:oMathPara>` : `<m:oMath>${body}</m:oMath>`;
  }

  /* ================================================================ HTML → WordprocessingML */
  const BLOCK = new Set(["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "ul", "ol", "table", "tr", "blockquote", "section", "article", "header", "footer", "hr", "pre", "figure", "center"]);
  function run(text, f) {
    if (!text) return "";
    const pr = [];
    if (f.b) pr.push("<w:b/><w:bCs/>"); if (f.i) pr.push("<w:i/><w:iCs/>"); if (f.u) pr.push('<w:u w:val="single"/>');
    if (f.sup) pr.push('<w:vertAlign w:val="superscript"/>'); if (f.sub) pr.push('<w:vertAlign w:val="subscript"/>');
    if (f.color) pr.push(`<w:color w:val="${f.color}"/>`); if (f.size) pr.push(`<w:sz w:val="${Math.round(f.size * 2)}"/><w:szCs w:val="${Math.round(f.size * 2)}"/>`);
    if (f.font) pr.push(`<w:rFonts w:ascii="${xml(f.font)}" w:hAnsi="${xml(f.font)}" w:cs="${xml(f.font)}"/>`);
    if (f.strike) pr.push("<w:strike/>");
    return `<w:r>${pr.length ? "<w:rPr>" + pr.join("") + "</w:rPr>" : ""}<w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
  }
  const cssColor = s => { const m = /^#([0-9a-f]{6})$/i.exec(s || ""); if (m) return m[1].toUpperCase(); const r = /^rgb\((\d+),\s*(\d+),\s*(\d+)/.exec(s || ""); if (r) return [r[1], r[2], r[3]].map(v => (+v).toString(16).padStart(2, "0")).join("").toUpperCase(); return null; };
  class Builder {
    constructor(opt) {
      this.opt = opt; this.body = []; this.media = []; this.rels = []; this.cur = null; this.curPr = null; this.sects = []; this.sectOpt = { orientation: opt.orientation || "portrait" };
      this.defSize = opt.size || 12;
    }
    /* đoạn hiện tại */
    para(pr) { if (this.cur && this.cur.length === 0 && !this.curPr) { this.curPr = pr || null; return; } this.flush(); this.cur = []; this.curPr = pr || null; }
    flush() {
      if (this.cur) {
        const pr = this.curPr || {}; const p = [];
        if (pr.style) p.push(`<w:pStyle w:val="${pr.style}"/>`);
        if (pr.keep) p.push("<w:keepNext/>");
        if (pr.pageBreakBefore) p.push("<w:pageBreakBefore/>");
        if (pr.align) p.push(`<w:jc w:val="${pr.align}"/>`);
        if (pr.spacing) p.push(`<w:spacing w:before="${pr.spacing.before || 0}" w:after="${pr.spacing.after || 0}"${pr.spacing.line ? ` w:line="${pr.spacing.line}" w:lineRule="auto"` : ""}/>`);
        if (pr.indent) p.push(`<w:ind${pr.indent.left ? ` w:left="${pr.indent.left}"` : ""}${pr.indent.hanging ? ` w:hanging="${pr.indent.hanging}"` : ""}${pr.indent.first ? ` w:firstLine="${pr.indent.first}"` : ""}/>`);
        if (pr.tabs) p.push(`<w:tabs>${pr.tabs.map(t => `<w:tab w:val="${t.val || "left"}" w:pos="${t.pos}"/>`).join("")}</w:tabs>`);
        const content = this.cur.join("");
        if (content || pr.force) this.body.push(`<w:p>${p.length ? "<w:pPr>" + p.join("") + "</w:pPr>" : ""}${content}</w:p>`);
      }
      this.cur = null; this.curPr = null;
    }
    text(t, f) { if (!this.cur) this.para(); this.cur.push(run(t, f)); }
    raw(x) { if (!this.cur) this.para(); this.cur.push(x); }
    sectionBreak(nextOpt) {
      this.flush(); const sp = sectPr(this.sectOpt, this.opt);
      this.body.push(`<w:p><w:pPr>${sp}</w:pPr></w:p>`); this.sectOpt = Object.assign({}, this.sectOpt, nextOpt || {});
    }
    addImage(dataUrl, wPx, hPx) {
      const id = this.media.length + 1; const m = /^data:image\/(png|jpeg|jpg);base64,(.*)$/s.exec(dataUrl); if (!m) return "";
      const ext = m[1] === "jpg" ? "jpeg" : m[1]; this.media.push({ name: `image${id}.${ext}`, data: m[2], ext });
      const rid = `rIdImg${id}`; this.rels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${id}.${ext}"/>`);
      const cx = Math.round(wPx * EMU_PX), cy = Math.round(hPx * EMU_PX);
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Hình ${id}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="image${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }
  }
  function sectPr(so, opt) {
    const land = so.orientation === "landscape"; const W = land ? 16838 : 11906, H = land ? 11906 : 16838;
    const mg = Object.assign({ top: 2, right: 1.5, bottom: 2, left: 2.5 }, opt.margins || {}, so.margins || {});
    return `<w:sectPr><w:pgSz w:w="${W}" w:h="${H}"${land ? ' w:orient="landscape"' : ""}/><w:pgMar w:top="${Math.round(mg.top * CM)}" w:right="${Math.round(mg.right * CM)}" w:bottom="${Math.round(mg.bottom * CM)}" w:left="${Math.round(mg.left * CM)}" w:header="567" w:footer="567" w:gutter="0"/>${opt.pageNumbers === false ? "" : '<w:footerReference w:type="default" r:id="rIdFooter"/>'}</w:sectPr>`;
  }
  /* ảnh: phần tử DOM → dataURL png + kích thước điểm ảnh (CSS px) */
  async function elToPng(el, scale) {
    const rect = el.getBoundingClientRect(); const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    if (el.tagName.toLowerCase() === "img") {
      try { const c = document.createElement("canvas"); c.width = el.naturalWidth || w; c.height = el.naturalHeight || h; c.getContext("2d").drawImage(el, 0, 0); return { url: c.toDataURL("image/png"), w: w || c.width, h: h || c.height }; } catch (e) { return null; }
    }
    if (el.tagName.toLowerCase() === "svg") {
      try {
        const clone = el.cloneNode(true); if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const s = new XMLSerializer().serializeToString(clone); const im = new Image();
        await new Promise((res, rej) => { im.onload = res; im.onerror = rej; im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s); });
        const c = document.createElement("canvas"); c.width = Math.round(w * (scale || 3)); c.height = Math.round(h * (scale || 3)); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        return { url: c.toDataURL("image/png"), w, h };
      } catch (e) { /* rơi xuống html2canvas */ }
    }
    if (el.classList.contains("tikz-wrap")) { const r = await tikzToPng(el, scale || 3); if (r) return r; }
    if (window.html2canvas) {
      try { const c = await html2canvas(el, { scale: scale || 3, backgroundColor: "#ffffff", logging: false, useCORS: true }); return { url: c.toDataURL("image/png"), w, h }; } catch (e) { return null; }
    }
    return null;
  }
  /* hình TikZ: vẽ SVG lên canvas rồi vẽ đè các nhãn (HTML + KaTeX) bằng html2canvas */
  const tikzCache = new Map();
  async function tikzToPng(wrap, scale) {
    const svg = wrap.querySelector(":scope > svg"); if (!svg) return null;
    const key = wrap.innerHTML; if (tikzCache.has(key)) return tikzCache.get(key);
    const rect = wrap.getBoundingClientRect(); const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    let x0 = 0, y0 = 0, x1 = w, y1 = h;
    const labs = Array.from(wrap.querySelectorAll(":scope > .tikz-lbl"));
    labs.forEach(l => { const r = l.getBoundingClientRect(); x0 = Math.min(x0, r.left - rect.left); y0 = Math.min(y0, r.top - rect.top); x1 = Math.max(x1, r.right - rect.left); y1 = Math.max(y1, r.bottom - rect.top); });
    const W = x1 - x0, H = y1 - y0;
    const c = document.createElement("canvas"); c.width = Math.round(W * scale); c.height = Math.round(H * scale); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    try {
      const clone = svg.cloneNode(true); clone.setAttribute("xmlns", "http://www.w3.org/2000/svg"); clone.setAttribute("width", w); clone.setAttribute("height", h);
      const im = new Image(); await new Promise((res, rej) => { im.onload = res; im.onerror = rej; im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone)); });
      x.drawImage(im, -x0 * scale, -y0 * scale, w * scale, h * scale);
    } catch (e) { return null; }
    if (window.html2canvas && labs.length) {
      try { const lc = await html2canvas(wrap, { scale, backgroundColor: null, logging: false, ignoreElements: el => el === svg, x: x0, y: y0, width: W, height: H, scrollX: 0, scrollY: 0 }); x.drawImage(lc, 0, 0, c.width, c.height); }
      catch (e) { for (const l of labs) { try { const r = l.getBoundingClientRect(); const lc = await html2canvas(l, { scale, backgroundColor: null, logging: false }); x.drawImage(lc, (r.left - rect.left - x0) * scale, (r.top - rect.top - y0) * scale, r.width * scale, r.height * scale); } catch (e2) {} } }
    }
    const out = { url: c.toDataURL("image/png"), w: W, h: H }; tikzCache.set(key, out); if (tikzCache.size > 200) tikzCache.delete(tikzCache.keys().next().value); return out;
  }
  /* duyệt DOM */
  async function walk(node, B, f, ctx) {
    if (node.nodeType === 3) { let t = node.nodeValue.replace(/\s+/g, " "); if (ctx.pre) t = node.nodeValue; if (t.trim() || (B.cur && B.cur.length)) B.text(t, f); return; }
    if (!isEl(node)) return;
    const t = node.tagName.toLowerCase(); const cl = node.classList;
    if (t === "script" || t === "style" || t === "template" || cl.contains("noprint") || cl.contains("docx-skip")) return;
    if (node.getAttribute("hidden") !== null) return;
    // công thức
    if (cl.contains("katex") || cl.contains("katex-display") || node.hasAttribute("data-tex")) {
      let m = node.querySelector("math"); const display = cl.contains("katex-display") || node.getAttribute("data-display") === "1";
      if (!m && node.hasAttribute("data-tex")) m = mathFromTex(node.getAttribute("data-tex"), display);
      if (m) { if (display) { B.para({ align: "center" }); B.raw(oMath(m, false)); B.para(); } else B.raw(oMath(m, false)); }
      else B.text(node.textContent, f);
      return;
    }
    if (cl.contains("katex-mathml") || cl.contains("katex-html")) return;
    // hình
    if (t === "img" || t === "svg" || t === "canvas" || cl.contains("tikz-wrap") || cl.contains("docx-image")) {
      const g = t === "canvas" ? { url: node.toDataURL("image/png"), w: node.width, h: node.height } : await elToPng(node, 3);
      if (g) { const maxW = ctx.maxW || 600; let w = g.w, h = g.h; if (w > maxW) { h = h * maxW / w; w = maxW; } const center = cl.contains("center") || (node.parentElement && /center/.test(getComputedStyle(node.parentElement).textAlign)); if (center && !(B.cur && B.cur.length)) B.para({ align: "center" }); B.raw(B.addImage(g.url, w, h)); }
      return;
    }
    if (t === "br") { if (/page-break/.test(node.getAttribute("style") || "")) { B.flush(); B.body.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'); } else B.raw("<w:r><w:br/></w:r>"); return; }
    if (t === "hr" || cl.contains("pagebreak")) { B.flush(); B.body.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'); return; }
    if (node.hasAttribute("data-sect")) { const o = node.getAttribute("data-sect"); if (B.body.length) B.sectionBreak({ orientation: o }); else B.sectOpt.orientation = o; }
    if (t === "table") { await table(node, B, f, ctx); return; }
    if (cl.contains("opts")) { await optsGrid(node, B, f, ctx); return; }
    if (cl.contains("qside")) { await sideGrid(node, B, f, ctx); return; }
    if (cl.contains("hd") && node.closest(".ex")) { await hdGrid(node, B, f, ctx); return; }
    // định dạng chữ
    const st = node.style; const f2 = Object.assign({}, f);
    if (t === "b" || t === "strong" || t === "th" || /^h[1-6]$/.test(t) || st.fontWeight === "bold" || +st.fontWeight >= 600) f2.b = true;
    if (t === "i" || t === "em" || st.fontStyle === "italic") f2.i = true;
    if (t === "u" || /underline/.test(st.textDecoration)) f2.u = true;
    if (t === "s" || t === "del" || /line-through/.test(st.textDecoration)) f2.strike = true;
    if (t === "sup") f2.sup = true; if (t === "sub") f2.sub = true;
    if (t === "code" || t === "pre") f2.font = "Consolas";
    const col = cssColor(st.color); if (col && col !== "000000") f2.color = col;
    if (st.fontSize) { const m = /^([\d.]+)(pt|px)$/.exec(st.fontSize); if (m) f2.size = m[2] === "pt" ? +m[1] : +m[1] * .75; }
    if (t === "h1") f2.size = Math.round(B.defSize * 1.35); else if (t === "h2") f2.size = Math.round(B.defSize * 1.2); else if (t === "h3") f2.size = Math.round(B.defSize * 1.1);
    if (node.hasAttribute("data-size")) f2.size = +node.getAttribute("data-size");
    const block = BLOCK.has(t) || st.display === "block" || cl.contains("docx-block");
    if (block) {
      const pr = {};
      const ta = st.textAlign || (t === "center" || cl.contains("c") || cl.contains("tex-center") || cl.contains("center") ? "center" : "");
      if (ta === "center") pr.align = "center"; else if (ta === "right") pr.align = "right"; else if (ta === "justify") pr.align = "both";
      if (/^h[1-6]$/.test(t)) { pr.keep = true; pr.spacing = { before: 120, after: 60 }; if (!pr.align && t !== "h3" && t !== "h4") pr.align = "center"; }
      if (node.hasAttribute("data-align")) pr.align = node.getAttribute("data-align");
      if (cl.contains("keep")) pr.keep = true;
      if (t === "li") { const ol = node.parentElement && node.parentElement.tagName.toLowerCase() === "ol"; const idx = Array.from(node.parentElement.children).indexOf(node) + 1; pr.indent = { left: 567, hanging: 283 }; B.para(pr); B.text(ol ? idx + ". " : "– ", f2); for (const c of Array.from(node.childNodes)) await walk(c, B, f2, ctx); B.flush(); return; }
      if (t === "ul" || t === "ol") { for (const c of Array.from(node.children)) await walk(c, B, f2, ctx); return; }
      if (st.marginLeft) { const m = /^([\d.]+)(px|pt|cm)$/.exec(st.marginLeft); if (m) pr.indent = { left: Math.round(+m[1] * (m[2] === "cm" ? CM : m[2] === "pt" ? 20 : 15)) }; }
      if (st.textIndent) { const m = /^([\d.]+)(px|pt|cm)$/.exec(st.textIndent); if (m) pr.indent = Object.assign(pr.indent || {}, { first: Math.round(+m[1] * (m[2] === "cm" ? CM : m[2] === "pt" ? 20 : 15)) }); }
      if (st.marginTop || st.marginBottom) { const px = v => { const m = /^([\d.]+)(px|pt|cm)$/.exec(v || ""); return m ? Math.round(+m[1] * (m[2] === "cm" ? CM : m[2] === "pt" ? 20 : 15)) : 0; }; pr.spacing = { before: px(st.marginTop), after: px(st.marginBottom) }; }
      B.para(pr);
      for (const c of Array.from(node.childNodes)) await walk(c, B, f2, ctx);
      B.flush(); return;
    }
    for (const c of Array.from(node.childNodes)) await walk(c, B, f2, ctx);
    // khoảng cách phải (CSS margin/padding) của phần tử nội dòng → một dấu cách
    try { const cs = getComputedStyle(node); const pe = node.parentElement; if ((parseFloat(cs.marginRight) + parseFloat(cs.paddingRight) >= 2 || (pe && /flex/.test(getComputedStyle(pe).display) && node.nextElementSibling)) && B.cur && B.cur.length) B.text(" ", f2); } catch (e) {}
  }
  async function table(tb, B, f, ctx) {
    const rows = Array.from(tb.querySelectorAll(":scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr"));
    if (!rows.length) return;
    const grid = []; let ncol = 0;
    rows.forEach((tr, r) => {
      grid[r] = grid[r] || []; let c = 0;
      Array.from(tr.children).forEach(td => {
        while (grid[r][c]) c++;
        const cs = +td.getAttribute("colspan") || 1, rs = +td.getAttribute("rowspan") || 1;
        for (let i = 0; i < rs; i++) { grid[r + i] = grid[r + i] || []; for (let j = 0; j < cs; j++) grid[r + i][c + j] = { td, main: i === 0 && j === 0, vm: i > 0 && j === 0, span: cs, rs, head: td.tagName.toLowerCase() === "th", keepHead: rows[r].parentElement.tagName.toLowerCase() === "thead" }; }
        c += cs;
      });
      ncol = Math.max(ncol, grid[r].length);
    });
    const pct = s => { const m = /^([\d.]+)(%|pt|px|cm)?$/.exec(String(s || "").trim()); return m ? +m[1] * (m[2] === "cm" ? 28.35 : m[2] === "px" ? .75 : 1) : null; };
    let widths = [];
    const cols = Array.from(tb.querySelectorAll("colgroup col"));
    if (cols.length >= ncol) widths = cols.slice(0, ncol).map(c => pct(c.style.width || c.getAttribute("width")) || 0);
    else if (grid[0]) widths = grid[0].map(g => g ? (pct(g.td.style.width || g.td.getAttribute("width")) || 0) / (g.span || 1) : 0);
    const border = tb.classList.contains("noborder") || tb.getAttribute("border") === "0" ? "nil" : "single";
    await tableFromGrid(B, f, ctx, grid, ncol, widths, { border, center: tb.classList.contains("c") || tb.style.marginLeft === "auto", widthPct: pct(tb.style.width) });
  }
  /* grid[r][c] = {td, main, vm, span, rs, head} ; widths: % mỗi cột (0 = chia đều phần còn lại) */
  async function tableFromGrid(B, f, ctx, grid, ncol, widths, o) {
    B.flush();
    const land = B.sectOpt.orientation === "landscape"; const mg = Object.assign({ top: 2, right: 1.5, bottom: 2, left: 2.5 }, B.opt.margins || {});
    const avail = ctx.cellW || Math.round(((land ? 29.7 : 21) - mg.left - mg.right) * CM); const totalTw = Math.round(avail * ((o.widthPct || 100) / 100));
    widths = Array.from({ length: ncol }, (_, i) => widths[i] || 0);
    const known = widths.reduce((a, b) => a + b, 0), unk = widths.filter(w => !w).length;
    widths = widths.map(w => w || (unk ? Math.max(0, 100 - known) / unk : 0)); const sum = widths.reduce((a, b) => a + b, 0) || 1;
    const tw = widths.map(w => Math.round(totalTw * w / sum));
    const border = o.border || "single"; const fs = o.fontSize || ctx.tableSize || B.opt.tableSize || (border === "nil" ? B.defSize : Math.max(8, B.defSize - 1));
    let x = `<w:tbl><w:tblPr><w:tblW w:w="${totalTw}" w:type="dxa"/>${o.center ? '<w:jc w:val="center"/>' : ""}<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(s => `<w:${s} w:val="${border}" w:sz="4" w:space="0" w:color="000000"/>`).join("")}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="${border === "nil" ? 0 : 80}" w:type="dxa"/><w:right w:w="${border === "nil" ? 60 : 80}" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${tw.map(w => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r] || []; const isHead = row.length && row.every(c => !c || c.head || c.keepHead);
      x += `<w:tr><w:trPr><w:cantSplit/>${isHead && border !== "nil" ? "<w:tblHeader/>" : ""}</w:trPr>`;
      for (let c = 0; c < ncol;) {
        const g = row[c];
        if (!g) { x += `<w:tc><w:tcPr><w:tcW w:w="${tw[c]}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`; c++; continue; }
        const span = g.span || 1; const w = tw.slice(c, c + span).reduce((a, b) => a + b, 0);
        const td = g.td; const st = td.style || {}; const bg = cssColor(st.backgroundColor) || (g.head && border !== "nil" ? "EFEFEF" : null);
        const va = g.valign || st.verticalAlign || (g.head ? "center" : "top");
        x += `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ""}${g.main && (g.rs || 1) > 1 ? '<w:vMerge w:val="restart"/>' : g.vm ? "<w:vMerge/>" : ""}${bg ? `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>` : ""}<w:vAlign w:val="${va === "middle" || va === "center" ? "center" : va === "bottom" ? "bottom" : "top"}"/></w:tcPr>`;
        if (g.main) {
          const sub = new Builder(B.opt); sub.media = B.media; sub.rels = B.rels; sub.sectOpt = B.sectOpt; sub.defSize = fs;
          const f2 = Object.assign({}, f, { size: fs }); if (g.head) f2.b = true;
          const ta = g.align || st.textAlign || (g.head ? "center" : ""); const align = ta === "center" ? "center" : ta === "right" ? "right" : ta === "justify" ? "both" : null;
          sub.para(align ? { align } : null);
          const ctx2 = Object.assign({}, ctx, { maxW: Math.round(w / CM * 37.8) - 10, cellW: w - 160, tableSize: fs });
          const nodes = g.nodes || Array.from(td.childNodes);
          for (const ch of nodes) await walk(ch, sub, f2, ctx2);
          sub.flush();
          let cell = sub.body.join("") || "<w:p/>";
          if (align) cell = cell.replace(/<w:p>(?!<w:pPr>)/g, `<w:p><w:pPr><w:jc w:val="${align}"/></w:pPr>`).replace(/<w:p><w:pPr>(?![^<]*<w:jc)/g, `<w:p><w:pPr><w:jc w:val="${align}"/>`);
          if (/<w:tbl>$|<\/w:tbl><w:p\/>$/.test(cell) === false && cell.endsWith("</w:tbl>")) cell += "<w:p/>";
          x += cell;
        } else x += "<w:p/>";
        x += "</w:tc>"; c += span;
      }
      x += "</w:tr>";
    }
    x += "</w:tbl>";
    B.body.push(x); if (!o.noGap) B.body.push(`<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="${o.gapLine || 120}" w:lineRule="exact"/></w:pPr></w:p>`);
  }
  /* lưới phương án A B C D (div.opts.cN) → bảng không viền N cột */
  async function optsGrid(el, B, f, ctx) {
    const m = /\bc([1-4])\b/.exec(el.className); const n = m ? +m[1] : 1; const items = Array.from(el.children);
    const grid = []; for (let i = 0; i < items.length; i += n) grid.push(items.slice(i, i + n).map(it => ({ td: it, main: true, span: 1 })));
    await tableFromGrid(B, f, ctx, grid, n, [], { border: "nil", noGap: true, fontSize: f.size || B.defSize });
  }
  /* đầu đề thi (div.hd: các cặp div trái/phải) → bảng 2 cột không viền, căn giữa */
  async function hdGrid(el, B, f, ctx) {
    const ch = Array.from(el.children); const grid = [];
    for (let i = 0; i < ch.length; i += 2) grid.push([{ td: ch[i], main: true, span: 1, align: "center", valign: "middle" }, { td: ch[i + 1] || ch[i], main: true, span: 1, align: "center", valign: "middle" }]);
    await tableFromGrid(B, f, ctx, grid, 2, [45, 55], { border: "nil", noGap: true, fontSize: f.size || B.defSize });
  }
  /* câu có hình bên phải (div.qside > div, div.qf) → bảng 2 cột không viền */
  async function sideGrid(el, B, f, ctx) {
    const [a, b] = Array.from(el.children); if (!b) { for (const c of Array.from(el.childNodes)) await walk(c, B, f, ctx); return; }
    const fig = b.querySelector(".tikz-wrap, svg, img"); const fw = fig ? fig.getBoundingClientRect().width : 150; const pct = Math.min(45, Math.max(22, Math.round(fw / 6.3)));
    await tableFromGrid(B, f, ctx, [[{ td: a, main: true, span: 1 }, { td: b, main: true, span: 1, align: "center", valign: "middle" }]], 2, [100 - pct, pct], { border: "nil", noGap: true, fontSize: f.size || B.defSize });
  }
  async function fromHtml(src, opt = {}) {
    if (!window.JSZip) throw new Error("Thiếu JSZip");
    let root, holder = null;
    if (typeof src === "string") { holder = document.createElement("div"); holder.style.cssText = "position:fixed;left:-20000px;top:0;width:700px;background:#fff"; holder.innerHTML = src; document.body.appendChild(holder); root = holder; }
    else root = src;
    // biên dịch data-tex chưa có KaTeX
    if (window.katex) root.querySelectorAll("[data-tex]").forEach(el => { if (!el.querySelector("math")) { try { el.innerHTML = katex.renderToString(el.getAttribute("data-tex"), { output: "htmlAndMathml", throwOnError: false, strict: "ignore", displayMode: el.getAttribute("data-display") === "1", macros: (window.NHD && NHD.MACROS) || {} }); } catch (e) {} } });
    const B = new Builder(opt); const ctx = { maxW: opt.maxImageWidth || 600 };
    try {
      for (const c of Array.from(root.childNodes)) await walk(c, B, { size: opt.size || 12 }, ctx);
      B.flush();
    } finally { if (holder) holder.remove(); }
    const font = opt.font || "Times New Roman"; const sz = Math.round((opt.size || 12) * 2);
    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W_NS}><w:body>${B.body.join("")}${sectPr(B.sectOpt, opt)}</w:body></w:document>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${xml(font)}" w:hAnsi="${xml(font)}" w:cs="${xml(font)}" w:eastAsia="${xml(font)}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="${opt.spaceAfter != null ? opt.spaceAfter : 60}" w:line="${opt.line || 264}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/></w:rPr></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
    const footer = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${W_NS}><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">${xml(opt.footerText || "")}${opt.footerText ? " – " : ""}Trang </w:t></w:r><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
    const settings = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:settings>`;
    const zip = new JSZip();
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
    zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${B.rels.join("")}</Relationships>`);
    zip.file("word/document.xml", docXml); zip.file("word/styles.xml", styles); zip.file("word/settings.xml", settings); zip.file("word/footer1.xml", footer);
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    zip.file("docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(opt.title || "")}</dc:title><dc:creator>${xml(opt.author || "Học cùng Thầy Hiếu")}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`);
    zip.file("docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Học cùng Thầy Hiếu</Application></Properties>`);
    B.media.forEach(m => zip.file("word/media/" + m.name, m.data, { base64: true }));
    return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
  }
  function save(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
  /* tiện ích: TeX → chuỗi OMML (để kiểm thử) */
  function texToOmml(tex, display) { const m = mathFromTex(tex, display); return m ? oMath(m, display) : ""; }
  window.Docx = { fromHtml, save, texToOmml, mml2omml: omml };
})();
