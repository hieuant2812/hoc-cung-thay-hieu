/* decuong-tex.js — đọc file TeX đề cương (Toán 10, 11, 12 theo mẫu của thầy Hiếu) thành dữ liệu hiển thị trên web.
   Nhận dạng tự động:  \bai{n}{..} (Toán 10) · \section{..}+\lythuyet (Toán 11) · \baihoc{n}{..} (Toán 12)
                       đề ôn: \begin{dethi} (10) · \dethi{..}{Đề n} (11) · \begin{deontap}{n} (12)
   Hình TikZ thay bằng [[HINH:mã]] (mã = băm FNV-1a của mã TikZ đã bỏ khoảng trắng) để lấy ảnh đã biên dịch sẵn.
   Dùng được trong trình duyệt và Node:  DeCuongTeX.docTep(tenTep, noiDung) · DeCuongTeX.banHS(bai) */
(function (G) {
  "use strict";
  const bam = s => { let h = 0x811c9dc5; s = s.replace(/\s+/g, ""); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("00000000" + h.toString(16)).slice(-8); };
  const boChuThich = s => s.replace(/(^|[^\\])%[^\n]*/g, "$1");
  function nhom(s, i) {
    let d = 0, j = i;
    while (j < s.length) {
      const c = s[j];
      if (c === "\\") { j += 2; continue; }
      if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) return [s.slice(i + 1, j), j + 1]; }
      j++;
    }
    return [s.slice(i + 1), s.length];
  }
  function tuyChon(s, i) {
    let j = i; while (j < s.length && (s[j] === " " || s[j] === "\t")) j++;
    if (s[j] === "[" && !s.startsWith("[[HINH:", j)) { let d = 0; for (let k = j; k < s.length; k++) { if (s[k] === "[") d++; else if (s[k] === "]") { d--; if (!d) return [s.slice(j + 1, k), k + 1]; } } }
    return [null, i];
  }
  const boCach = (s, i) => { while (i < s.length && " \t\n".includes(s[i])) i++; return i; };
  function moiTruong(s, ten) {
    const out = [], b = "\\begin{" + ten + "}", e = "\\end{" + ten + "}"; let i = 0;
    for (;;) {
      const a = s.indexOf(b, i); if (a < 0) break;
      let j = a + b.length, d = 1;
      while (d) {
        const nb = s.indexOf(b, j); let ne = s.indexOf(e, j);
        if (ne < 0) { ne = s.length; j = ne; d = 0; break; }
        if (nb >= 0 && nb < ne) { d++; j = nb + b.length; } else { d--; j = ne + e.length; }
      }
      let [opt, k] = tuyChon(s, a + b.length);
      const k2 = boCach(s, k);
      if (s[k2] === "(") k = s.indexOf(")", k2) + 1;
      out.push([a, j, opt, s.slice(k, Math.max(k, j - e.length))]);
      i = j;
    }
    return out;
  }
  const escH = t => t.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------------- hình ---------------- */
  let HINH = {};
  function tachTikz(s) {
    let out = "", i = 0;
    for (;;) {
      const a = s.indexOf("\\begin{tikzpicture}", i); if (a < 0) { out += s.slice(i); break; }
      let e = s.indexOf("\\end{tikzpicture}", a); e = e >= 0 ? e + 17 : s.length;
      const code = s.slice(a, e), h = bam(code); HINH[h] = code;
      out += s.slice(i, a) + "[[HINH:" + h + "]]"; i = e;
    }
    return out;
  }

  /* ---------------- công thức ---------------- */
  function toan(m) {
    let s = m;
    for (const cmd of ["dienct", "dien"]) {
      const re = new RegExp("\\\\" + cmd + "(?![A-Za-z])");
      for (;;) {
        const k = re.exec(s); if (!k) break;
        let j = k.index + k[0].length; [, j] = tuyChon(s, j); j = boCach(s, j);
        if (s[j] !== "{") { s = s.slice(0, k.index) + s.slice(k.index + k[0].length); continue; }
        const [g, j2] = nhom(s, j);
        s = s.slice(0, k.index) + "\\htmlClass{dien}{" + g + "}" + s.slice(j2);
      }
    }
    for (;;) {
      const k = /\\text\{\s*\\htmlClass\{dien\}\{/.exec(s); if (!k) break;
      let [g] = nhom(s, k.index + k[0].length - 1); const [, e2] = nhom(s, k.index + 5);
      g = g.trim(); if (g[0] === "$" && g.endsWith("$")) g = g.slice(1, -1);
      s = s.slice(0, k.index) + "\\htmlClass{dien}{" + g + "}" + s.slice(e2);
    }
    for (;;) {
      const k = /\\htmlClass\{dien\}\{\s*\$/.exec(s); if (!k) break;
      const st = s.indexOf("{", k.index + 16); const [g, e] = nhom(s, st);
      s = s.slice(0, st) + "{" + g.trim().replace(/^\$+|\$+$/g, "") + "}" + s.slice(e);
    }
    return s.replace(/\\T /g, "").replace(/\\(scriptsize|footnotesize|small|normalsize)\b/g, "").replace(/\\(textcolor|color)\{[^}]*\}/g, "")
      .replace(/\\leqslant/g, "\\le").replace(/\\geqslant/g, "\\ge");
  }

  /* ---------------- văn bản → HTML ---------------- */
  const MATH_ENV = ["align*", "align", "equation*", "equation", "gather*", "gather", "cases", "eqnarray*"];
  const BO = new Set("noindent centering hfill smallskip medskip bigskip par newline linebreak clearpage newpage raggedright small footnotesize scriptsize normalsize large Large itshape bfseries upshape vfill null indent selectfont headfont heros nobreak allowbreak break protect relax displaystyle phieutln phieutl otraloi Needspace setlength addvspace arraystretch renewcommand oDS T D S".split(" "));
  const HOP = { khung: "Kiến thức", dinhnghia: "Định nghĩa", dinhly: "Định lí", dinhli: "Định lí", tinhchat: "Tính chất", chuy: "Chú ý", phuongphap: "Phương pháp giải", kienthuc: "Kiến thức cần nhớ", congthuc: "Công thức", nhanxet: "Nhận xét", yccd: "Yêu cầu cần đạt", hequa: "Hệ quả", tomtat: "Tóm tắt", luuy: "Lưu ý", meo: "Mẹo", tcolorbox: "" };
  function doiSo(s, j) { [, j] = tuyChon(s, j); j = boCach(s, j); if (s[j] === "{") return nhom(s, j); if (j < s.length) return [s[j], j + 1]; return ["", j]; }

  function html(src) {
    const s = tachTikz(src), n = s.length, out = []; let i = 0;
    while (i < n) {
      const c = s[i];
      if (c === "$") {
        if (s.startsWith("$$", i)) { let e = s.indexOf("$$", i + 2); if (e < 0) e = n; out.push("$$" + toan(s.slice(i + 2, e)) + "$$"); i = e + 2; continue; }
        let e = i + 1, dd = 0;
        while (e < n) { const ch = s[e]; if (ch === "\\") { e += 2; continue; } if (ch === "{") dd++; else if (ch === "}") dd--; else if (ch === "$" && dd <= 0) break; e++; }
        out.push("$" + toan(s.slice(i + 1, e)) + "$"); i = e + 1; continue;
      }
      if (s.startsWith("\\[", i)) { let e = s.indexOf("\\]", i + 2); if (e < 0) e = n; out.push("$$" + toan(s.slice(i + 2, e)) + "$$"); i = e + 2; continue; }
      if (s.startsWith("\\(", i)) { let e = s.indexOf("\\)", i + 2); if (e < 0) e = n; out.push("$" + toan(s.slice(i + 2, e)) + "$"); i = e + 2; continue; }
      if (s.startsWith("\\begin{", i)) {
        const [ten, j] = nhom(s, i + 6);
        if (MATH_ENV.includes(ten)) {
          const end = "\\end{" + ten + "}", e = s.indexOf(end, j); let body = s.slice(j, e < 0 ? n : e);
          if (/^(align|eqnarray)/.test(ten)) body = "\\begin{aligned}" + body + "\\end{aligned}";
          else if (ten === "cases") body = "\\begin{cases}" + body + "\\end{cases}";
          else if (/^gather/.test(ten)) body = "\\begin{gathered}" + body + "\\end{gathered}";
          out.push("$$" + toan(body) + "$$"); i = (e < 0 ? n : e + end.length); continue;
        }
        const blk = moiTruong(s.slice(i), ten);
        if (!blk.length) { i = j; continue; }
        const [, e, opt, body] = blk[0]; out.push(mtHtml(ten, opt, body)); i += e; continue;
      }
      if (c === "\\") {
        const m = /^\\([A-Za-z@]+\*?|.)/.exec(s.slice(i, i + 40)); const cmd = m[1]; let j = i + m[0].length;
        const r = lenh(cmd, s, j); if (r) { out.push(r[0]); i = r[1]; } else i = j; continue;
      }
      if (c === "~") { out.push("&nbsp;"); i++; continue; }
      if (c === "{" || c === "}") { i++; continue; }
      if (c === "<") { out.push("&lt;"); i++; continue; }
      if (c === ">") { out.push("&gt;"); i++; continue; }
      if (c === "&") { out.push(" "); i++; continue; }
      if (c === "\n") { const mm = /^\n[ \t]*\n/.exec(s.slice(i, i + 20)); if (mm) { out.push("<br>"); i += mm[0].length; continue; } }
      out.push(c); i++;
    }
    return out.join("").replace(/(<br>\s*){2,}/g, "<br>").replace(/[ \t]+/g, " ").replace(/^\s*(<br>\s*)+|(\s*<br>)+\s*$/g, "").trim();
  }
  function lenh(cmd, s, j) {
    let g;
    if (cmd === "\\") { [, j] = tuyChon(s, j); return ["<br>", j]; }
    if (",; !:".includes(cmd) && cmd.length === 1) return [" ", j];
    if ("%&#_{}$".includes(cmd) && cmd.length === 1) return [cmd === "&" ? "&amp;" : cmd, j];
    if (cmd === "textbf" || cmd === "mathbf") { [g, j] = doiSo(s, j); return ["<b>" + html(g) + "</b>", j]; }
    if (cmd === "textit" || cmd === "emph" || cmd === "textsl") { [g, j] = doiSo(s, j); return ["<i>" + html(g) + "</i>", j]; }
    if (cmd === "underline") { [g, j] = doiSo(s, j); return ["<u>" + html(g) + "</u>", j]; }
    if (cmd === "dien" || cmd === "dienct") { [, j] = tuyChon(s, j); [g, j] = doiSo(s, j); return ['<span class="dien">' + html(g) + "</span>", j]; }
    if (["text", "mbox", "makebox", "fbox", "hbox", "textrm", "textnormal", "textsf", "mucnho"].includes(cmd)) { [, j] = tuyChon(s, j); [g, j] = doiSo(s, j); return [cmd === "mucnho" ? "<b>" + html(g) + "</b><br>" : html(g), j]; }
    if (cmd === "textcolor" || cmd === "colorbox") { [, j] = doiSo(s, j); [g, j] = doiSo(s, j); return [html(g), j]; }
    if (cmd === "color") { [, j] = doiSo(s, j); return ["", j]; }
    if (cmd === "chuthich") { [g, j] = doiSo(s, j); return ['<span class="cth">' + html(g) + "</span>", j]; }
    if (cmd === "hinh" || cmd === "hinhgiua") { let o; [o, j] = tuyChon(s, j); [g, j] = doiSo(s, j); return ['<div class="hinhdc">' + html(g) + (o ? '<span class="cth">' + html(o) + "</span>" : "") + "</div>", j]; }
    if (["vspace", "hspace", "vspace*", "hspace*", "dongke", "setcounter", "addtocounter", "label", "ref", "Needspace", "phantom", "rule", "setlength", "addvspace"].includes(cmd)) {
      [, j] = tuyChon(s, j); [, j] = doiSo(s, j); if (["setcounter", "addtocounter", "setlength", "rule"].includes(cmd)) [, j] = doiSo(s, j); return ["", j];
    }
    if (["quad", "qquad", "enspace", "thinspace", "hskip"].includes(cmd)) return [" &nbsp;", j];
    if (["dots", "ldots", "dotsc"].includes(cmd)) return ["…", j];
    if (cmd === "dc") return ["°", j];
    if (cmd === "item" || cmd === "task") { [, j] = tuyChon(s, j); return ["\u0000LI\u0000", j]; }
    if (cmd === "y") return ["\u0000LI\u0000", j];
    if (BO.has(cmd)) return ["", j];
    if (cmd === "R") return ["$\\mathbb R$", j];
    if (["Rightarrow", "Leftrightarrow", "to", "infty", "pi", "alpha", "beta", "Delta", "le", "ge", "ne", "approx", "cdot", "times", "in", "perp", "parallel"].includes(cmd)) return ["$\\" + cmd + "$", j];
    if (s[j] === "{") { [g, j] = nhom(s, j); return [html(g), j]; }
    return ["", j];
  }
  function dsItems(body, kieu) {
    const parts = html(body).split("\u0000LI\u0000").map(x => x.trim());
    if (parts.length < 2) return parts[0];
    const ol = ["enumerate", "tasks", "ycon", "dungsai", "chon"].includes(kieu);
    const cls = { tasks: "abc", ycon: "abc", dungsai: "abc", chon: "ABC", enumerate: "abc" }[kieu] || "";
    const tag = ol ? "ol" : "ul";
    return (parts[0] ? parts[0] + " " : "") + `<${tag} class="${cls}">` + parts.slice(1).map(x => `<li>${x}</li>`).join("") + `</${tag}>`;
  }
  function bang(body) {
    body = body.replace(/^\s*\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/, "");
    const rows = body.split(/\\\\(?:\[[^\]]*\])?/); const out = [];
    for (let r of rows) {
      r = r.replace(/\\(hline|cline\{[^}]*\}|toprule|midrule|bottomrule)/g, "").trim(); if (!r) continue;
      const cells = []; let d = 0, cur = "";
      for (let k = 0; k < r.length; k++) {
        const ch = r[k];
        if (ch === "\\" && k + 1 < r.length) { cur += r.slice(k, k + 2); k++; continue; }
        if (ch === "$") { const e = r.indexOf("$", k + 1); cur += r.slice(k, e + 1); k = e; continue; }
        if (ch === "{") d++; if (ch === "}") d--;
        if (ch === "&" && d === 0) { cells.push(cur); cur = ""; } else cur += ch;
      }
      cells.push(cur);
      out.push("<tr>" + cells.map(c => { const m = /^\s*\\multicolumn\{(\d+)\}\{[^}]*\}\{([\s\S]*)\}\s*$/.exec(c); return m ? `<td colspan="${m[1]}">${html(m[2])}</td>` : `<td>${html(c)}</td>`; }).join("") + "</tr>");
    }
    return '<table class="bdc">' + out.join("") + "</table>";
  }
  function mtHtml(ten, opt, body) {
    const t = ten.replace(/\*$/, "");
    if (["itemize", "enumerate", "tasks", "ycon", "dungsai", "chon", "description"].includes(t)) return dsItems(body, t);
    if (["tabular", "tabularx", "array"].includes(t)) { if (t === "tabularx") body = body.replace(/^\s*\{[^}]*\}/, ""); return bang(body); }
    if (t in HOP) { const tieu = t === "tcolorbox" ? "" : (opt ? html(opt) : HOP[t]); return `<div class="hop ${t}">` + (tieu ? `<div class="ht">${tieu}</div>` : "") + `<div class="hb">${html(body)}</div></div>`; }
    if (t === "minipage" || t === "multicols") body = body.replace(/^\s*\{[^}]*\}/, "");
    if (t === "center") return `<div class="giua">${html(body)}</div>`;
    if (t === "minipage") return `<div class="mp">${html(body)}</div>`;
    return html(body);
  }

  /* ---------------- câu hỏi có đáp án ---------------- */
  function tachDap(s, ten) {
    const m = new RegExp("\\\\" + ten + "(?![A-Za-z])").exec(s); if (!m) return [null, s];
    let j = m.index + m[0].length; const args = [];
    for (;;) { const k = boCach(s, j); if (s[k] === "{") { const [g, e] = nhom(s, k); args.push(g); j = e; } else break; }
    return [args, s.slice(0, m.index) + s.slice(j)];
  }
  function cauTN(raw) {
    const m = /\\(choice|pa|paii|pai)(?![A-Za-z])/.exec(raw); if (!m) return null;
    let j = m.index + m[0].length, dung = null;
    if (m[1] === "choice") { let o; [o, j] = tuyChon(raw, j); if (o && /^\s*\d+\s*$/.test(o)) dung = +o - 1; }
    const pas = [];
    for (let k = 0; k < 4; k++) { j = boCach(raw, j); if (raw[j] !== "{") return null; let g; [g, j] = nhom(raw, j); pas.push(g); }
    pas.forEach((p, k) => { if (/^\s*\\T(?![A-Za-z])/.test(p)) { dung = k; pas[k] = p.replace(/^\s*\\T\s*/, ""); } });
    return [raw.slice(0, m.index) + raw.slice(j), pas.map(p => html(p).replace(/\.$/, "")), dung];
  }
  function cauHoi(raw) {
    raw = raw.trim();
    const ds = moiTruong(raw, "dungsai");
    if (ds.length) {
      const [a, e, , body] = ds[0]; const de = raw.slice(0, a), sau = raw.slice(e); const ys = [];
      const reY = /\\(ydung|ysai)(?![A-Za-z])/g; let m;
      while ((m = reY.exec(body))) { const [g] = nhom(body, boCach(body, m.index + m[0].length)); ys.push([g, m[1] === "ydung"]); }
      if (!ys.length) body.split(/\\(?:task|y|item)(?![A-Za-z])/).slice(1).forEach(it => {
        let d = null; if (/^\s*\\D(?![A-Za-z])/.test(it)) d = true; else if (/^\s*\\S(?![A-Za-z])/.test(it)) d = false;
        ys.push([it.replace(/^\s*\\[DS](?![A-Za-z])\s*/, "").replace(/\\oDS/g, ""), d]);
      });
      let lg = ""; let [args] = tachDap(sau, "dapan");
      if (args) { const k = args[0].split(/[,;\s]+/).filter(Boolean); if (k.length >= 4) for (let i = 0; i < Math.min(4, ys.length); i++) ys[i][1] = /^Đ/i.test(k[i]); lg = args[1] || ""; }
      else { const [a2] = tachDap(sau, "dapso"); if (a2) { const txt = a2[0]; "abcd".split("").forEach((lab, i) => { const mm = new RegExp(lab + "\\)\\s*(Đúng|Sai|Đ|S)").exec(txt); if (mm && i < ys.length) ys[i][1] = mm[1][0] === "Đ"; }); lg = txt; } }
      if (ys.length !== 4 || ys.some(y => y[1] === null)) return null;
      const q = { loai: "DS", de: html(de), y: ys.map(y => ({ t: html(y[0]), d: y[1] })) }; if (lg.trim()) q.lg = html(lg); return q;
    }
    if (/\\(choice|pa|paii|pai)(?![A-Za-z])/.test(raw)) {
      let [args, rest] = tachDap(raw, "dapan"); let lg = "";
      if (!args) { [args, rest] = tachDap(raw, "dapso"); if (args) { const m = /^\s*([A-D])[.\s]?([\s\S]*)/.exec(args[0]); args = m ? [m[1], m[2]] : null; } }
      const r = cauTN(rest); if (!r) return null;
      let [de, pas, dung] = r;
      if (args) { dung = "ABCD".indexOf(args[0].trim()[0].toUpperCase()); lg = args[1] || ""; }
      if (dung == null || dung < 0) return null;
      const q = { loai: "TN", de: html(de), pa: pas, da: dung }; if (lg.trim()) q.lg = html(lg); return q;
    }
    for (const ten of ["traloi", "dapan", "dapso"]) {
      const [args, rest] = tachDap(raw, ten); if (!args) continue;
      let da, lg = "";
      if (ten === "dapso" && args.length === 4) da = args.map(a => a.trim()).join("");
      else if (ten === "dapso") { const m = /^\s*(\$?[-−]?[0-9][0-9{},.\s]*\$?)\s*\.?\s*([\s\S]*)/.exec(args[0]); if (!m) return { loai: "TL", de: html(rest), lg: html(args[0]) }; da = m[1]; lg = m[2]; }
      else { da = args[0]; lg = args[1] || ""; }
      da = da.replace(/\{,\}/g, ",").replace(/\$/g, "").replace(/\s/g, "").replace(/\.$/, "");
      if (!/^[-−]?[0-9]+([.,][0-9]+)?$/.test(da)) return { loai: "TL", de: html(rest), lg: html(ten === "dapso" ? args[0] : args[0] + ". " + lg) };
      const q = { loai: "TLN", de: html(rest), da: da.replace("−", "-") }; if (lg.trim()) q.lg = html(lg); return q;
    }
    return null;
  }

  /* ---------------- cấu trúc một file ---------------- */
  function mucs(lt, lenhMuc) {
    const re = new RegExp("\\\\" + lenhMuc + "\\*?\\{", "g"); const pos = []; let m;
    while ((m = re.exec(lt))) pos.push([m.index, m.index + m[0].length]);
    if (!pos.length) return lt.trim() ? [{ t: "", h: html(lt) }] : [];
    const res = []; const dau = lt.slice(0, pos[0][0]).trim(); if (dau) res.push({ t: "", h: html(dau) });
    pos.forEach(([a, b], k) => { const [t, j] = nhom(lt, b - 1); res.push({ t: html(t), h: html(lt.slice(j, k + 1 < pos.length ? pos[k + 1][0] : lt.length)) }); });
    return res;
  }
  function viDu(txt, tenMt) {
    const out = [];
    const pos = []; const re = /\\subsubsection\*?\{/g; let m; while ((m = re.exec(txt))) pos.push([m.index, m.index + m[0].length]);
    const doan = [["", pos.length ? txt.slice(0, pos[0][0]) : txt]];
    pos.forEach(([a, b], k) => { const [t, j] = nhom(txt, b - 1); doan.push([t, txt.slice(j, k + 1 < pos.length ? pos[k + 1][0] : txt.length)]); });
    for (const [dang, t] of doan) {
      const blocks = tenMt.flatMap(n => moiTruong(t, n)).sort((x, y) => x[0] - y[0]);
      for (const [, e, , body0] of blocks) {
        let body = body0, lg = "";
        const lb = moiTruong(body, "loigiai");
        if (lb.length) { lg = lb[0][3]; body = body.slice(0, lb[0][0]) + body.slice(lb[0][1]); }
        const m2 = /\\loigiai(?![A-Za-z])/.exec(body);
        if (!lg && m2) { let j = m2.index + m2[0].length; [, j] = tuyChon(body, j); j = boCach(body, j); if (body[j] === "{") { let j2; [lg, j2] = nhom(body, j); body = body.slice(0, m2.index) + body.slice(j2); } }
        if (!lg && t.slice(e, e + 30).trimStart().startsWith("\\begin{loigiai}")) { const l2 = moiTruong(t.slice(e), "loigiai"); if (l2.length) lg = l2[0][3]; }
        lg = lg.replace(/\\tuduy/g, "<b>Định hướng:</b> ");
        out.push({ dang: html(dang), de: html(body), lg: lg ? html(lg) : "" });
      }
    }
    return out;
  }
  function docTep(ten, noiDung) {
    HINH = {};
    const s = boChuThich(noiDung);
    const lopM = /TOAN(\d{1,2})/i.exec(ten) || /To[aá]n\s*(\d{1,2})/i.exec(s.slice(0, 400));
    const chM = /_C(\d+)_/i.exec(ten);
    const res = { tep: ten, lop: lopM ? lopM[1] : "", chuong: chM ? chM[1] : "" };
    let m;
    // ---- đề ôn tập
    if (/\\begin\{dethi\}|\\dethi\{|\\begin\{deontap\}/.test(s)) {
      const des = [];
      if (/\\dethi\{/.test(s) && !/\\begin\{dethi\}/.test(s)) {
        const parts = s.split(/\\dethi\{[^}]*\}\{([^}]*)\}/);
        for (let k = 1; k < parts.length; k += 2) des.push({ ten: parts[k], q: moiTruong(parts[k + 1], "cau").map(x => cauHoi(x[3])).filter(q => q && q.loai !== "TL") });
      } else {
        const env = /\\begin\{deontap\}/.test(s) ? "deontap" : "dethi";
        moiTruong(s, env).forEach((x, i) => { const so = /ONTAP(\d)/i.exec(ten); des.push({ ten: "Đề " + (env === "deontap" && so ? so[1] : i + 1), q: moiTruong(x[3], "cau").map(c => cauHoi(c[3])).filter(q => q && q.loai !== "TL") }); });
      }
      return Object.assign(res, { loai: "ontap", de: des, hinh: HINH });
    }
    let B = null;
    if ((m = /\\bai\{(\d+)\}\{/.exec(s))) {                                     // Toán 10
      const ten2 = nhom(s, m.index + m[0].length - 1)[0];
      const ph = []; const re = /\\phan\{([A-Z])\}\{/g; let k; while ((k = re.exec(s))) ph.push([k.index, k.index + k[0].length, k[1]]);
      const khoi = {}; ph.forEach(([a, b, L], i) => { const [, j] = nhom(s, b - 1); khoi[L] = s.slice(j, i + 1 < ph.length ? ph[i + 1][0] : s.length); });
      B = { so: m[1], ten: ten2, lt: mucs(khoi.A || "", "muc"), vd: viDu(khoi.B || "", ["vd"]), bt: moiTruong(khoi.C || "", "bt").map(x => ({ de: html(x[3]) })), tn: [] };
    } else if ((m = /\\baihoc\{(\d+)\}\{/.exec(s))) {                           // Toán 12
      const ten2 = nhom(s, m.index + m[0].length - 1)[0];
      const a = s.indexOf("\\lithuyet"), b = s.indexOf("\\viduminhhoa"), c = s.indexOf("\\luyentap");
      const lt = s.slice(a + 9, b > 0 ? b : (c > 0 ? c : s.length));
      B = { so: m[1], ten: ten2, lt: mucs(lt, /\\subsubsection/.test(lt) ? "subsubsection" : "muc"), vd: b > 0 ? viDu(s.slice(b + 12, c > 0 ? c : s.length), ["vidu", "viduds"]) : [], bt: [], tn: [] };
      const ltr = c > 0 ? s.slice(c + 9) : "", secs = ltr.split(/\\phanbt\{([^}]*)\}/);
      for (let k = 1; k < secs.length; k += 2) moiTruong(secs[k + 1], "bai").forEach(x => {
        const q = cauHoi(x[3]);
        if (q && ["TN", "DS", "TLN"].includes(q.loai)) B.tn.push(q);
        else { const [a2, rest] = tachDap(x[3], "dapso"); B.bt.push({ de: html(rest), ds: a2 ? html(a2[0]) : "", nhom: secs[k] }); }
      });
    } else if ((m = /\\section\{/.exec(s)) && /\\lythuyet/.test(s)) {          // Toán 11
      const ten2 = nhom(s, m.index + m[0].length - 1)[0];
      const so = (/BAI(\d+)/i.exec(ten) || [])[1] || "";
      const a = s.indexOf("\\lythuyet"), b = s.indexOf("\\vidumuc"), c = s.indexOf("\\baitapmuc");
      B = { so, ten: ten2, lt: mucs(s.slice(a + 9, b > 0 ? b : s.length), "muc"), vd: b > 0 ? viDu(s.slice(b, c > 0 ? c : s.length), ["vidu"]) : [], bt: c > 0 ? moiTruong(s.slice(c), "baitap").map(x => ({ de: html(x[3]) })) : [], tn: [] };
    }
    if (!B) return Object.assign(res, { loai: "khac" });
    return Object.assign(res, { loai: "bai", bai: B, hinh: HINH });
  }

  /* ---------------- bản học sinh: bỏ mọi đáp án ---------------- */
  function trongHTML(h) {
    // chỗ điền trong văn bản
    h = h.replace(/<span class="dien">([\s\S]*?)<\/span>/g, (m, x) => `<span class="trong" style="min-width:${Math.min(18, Math.max(4, x.replace(/<[^>]+>|\$|\\[a-z]+/gi, "").length * 0.55)).toFixed(1)}em"></span>`);
    // chỗ điền trong công thức
    for (;;) {
      const k = h.indexOf("\\htmlClass{dien}{"); if (k < 0) break;
      const [g, e] = nhom(h, k + 16);
      const w = Math.min(14, Math.max(3, g.replace(/\\[a-z]+|[{}^_]/gi, "").length * 0.5));
      h = h.slice(0, k) + "\\htmlClass{trong}{\\underline{\\hspace{" + w.toFixed(1) + "em}}}" + h.slice(e);
    }
    return h;
  }
  function banHS(B) {
    return {
      so: B.so, ten: B.ten,
      lt: B.lt.map(m => ({ t: m.t, h: trongHTML(m.h) })),
      vd: B.vd.map(v => ({ dang: v.dang, de: trongHTML(v.de) })),
      bt: B.bt.map(b => ({ de: trongHTML(b.de), nhom: b.nhom })),
      tn: (B.tn || []).map(q => cauHS(q))
    };
  }
  function cauHS(q) {
    if (q.loai === "TN") return { loai: "TN", de: trongHTML(q.de), pa: q.pa };
    if (q.loai === "DS") return { loai: "DS", de: trongHTML(q.de), y: q.y.map(y => ({ t: y.t })) };
    return { loai: q.loai, de: trongHTML(q.de) };
  }
  const deHS = d => ({ ten: d.ten, q: d.q.map(cauHS) });

  G.DeCuongTeX = { docTep, banHS, deHS, bam, html };
})(typeof window !== "undefined" ? window : globalThis);
