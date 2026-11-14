/* beamer.js — soạn bản trình chiếu Beamer (LaTeX) từ dữ liệu bài học ở data/baihoc/*.js
   Nguyên tắc trình chiếu trước lớp: nền bảng xanh – chữ phấn trắng, chữ to, ít dòng mỗi slide,
   lời giải hiện ra từng bước (\pause), màu nhấn hài hoà (phấn vàng, phấn hồng, phấn xanh).
   Kết quả là file .tex biên dịch bằng XeLaTeX. */
(function (G) {
  "use strict";
  /* ---------------------------------------------------------------- thoát kí tự LaTeX ngoài vùng $...$ */
  function tex(s) {
    s = String(s == null ? "" : s);
    let out = "", i = 0, inMath = false;
    while (i < s.length) {
      const c = s[i];
      if (c === "\\" && s[i + 1] === "$" && !inMath) { out += "\\$"; i += 2; continue; }
      if (c === "$") { inMath = !inMath; out += c; i++; continue; }
      if (inMath) { out += c; i++; continue; }
      if (c === "%" || c === "&" || c === "#") out += "\\" + c;
      else if (c === "~") out += "\\textasciitilde{}";
      else if (c === "^") out += "\\textasciicircum{}";
      else if (c === "_") out += "\\_";
      else if (c === "{" || c === "}") out += "\\" + c;
      else out += c;
      i++;
    }
    if (inMath) out += "$";
    return out;
  }
  const CS = { geogebra: "GeoGebra 2D", geogebra3d: "GeoGebra 3D", casio: "máy tính cầm tay Casio", excel: "bảng tính Excel", ai: "Chatbot AI" };

  /* ---------------------------------------------------------------- phần mở đầu của file .tex */
  function preamble(o) {
    const M = o.mau || "bangxanh";
    const bo = {
      bangxanh: { nen: "1C3B32", chu: "F4F7F2", c1: "FFD66B", c2: "7FD1C1", c3: "FF9E7D", c4: "C3A6FF", c5: "9BD66B", khung: "2E5A4C", ten: "Bảng xanh – phấn màu" },
      bangden: { nen: "22262A", chu: "F2F2F2", c1: "FFD54F", c2: "4DD0E1", c3: "FF8A80", c4: "CE93D8", c5: "AED581", khung: "343A40", ten: "Bảng đen – phấn màu" },
      giay: { nen: "FFFDF7", chu: "1A2430", c1: "C77700", c2: "00796B", c3: "C62828", c4: "6A3DBF", c5: "2E7D32", khung: "EEF2F8", ten: "Nền giấy – chữ màu" }
    }[M] || {};
    return `% ================================================================
% ${o.tieuDe || "Bản trình chiếu"}
% Soạn bằng công cụ "Học cùng Thầy Hiếu" — biên dịch bằng XeLaTeX
% Phối màu: ${bo.ten}
% ================================================================
\\documentclass[aspectratio=${o.tiLe || "169"},${o.coChu || 12}pt,xcolor={dvipsnames}]{beamer}
\\usepackage{fontspec}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usetikzlibrary{calc,arrows.meta}
\\usepackage{pgfplots}\\pgfplotsset{compat=1.18}

% ---- phông chữ (đổi tên phông nếu máy không có)
\\IfFontExistsTF{${o.font || "Times New Roman"}}{\\setmainfont{${o.font || "Times New Roman"}}\\setsansfont{${o.font || "Times New Roman"}}}{}
\\IfFontExistsTF{Latin Modern Math}{\\usepackage{unicode-math}\\setmathfont{Latin Modern Math}}{}

% ---- phối màu (năm sắc phấn để slide không đơn điệu)
\\definecolor{nenbang}{HTML}{${bo.nen}}
\\definecolor{chuphan}{HTML}{${bo.chu}}
\\definecolor{phanvang}{HTML}{${bo.c1}}
\\definecolor{phanngoc}{HTML}{${bo.c2}}
\\definecolor{phancam}{HTML}{${bo.c3}}
\\definecolor{phantim}{HTML}{${bo.c4}}
\\definecolor{phanluc}{HTML}{${bo.c5}}
\\definecolor{khungnhe}{HTML}{${bo.khung}}
\\colorlet{phanhong}{phancam}
\\colorlet{phanxanh}{phanngoc}

\\setbeamercolor{background canvas}{bg=nenbang}
\\setbeamercolor{normal text}{fg=chuphan}
\\setbeamercolor{frametitle}{fg=phanvang,bg=khungnhe}
\\setbeamercolor{title}{fg=phanvang}
\\setbeamercolor{structure}{fg=phanngoc}
\\setbeamercolor{itemize item}{fg=phanvang}
\\setbeamercolor{itemize subitem}{fg=phanngoc}
\\setbeamercolor{block title}{fg=nenbang,bg=phanvang}
\\setbeamercolor{block body}{fg=chuphan,bg=khungnhe}
\\setbeamercolor{alerted text}{fg=phancam}
\\usebeamercolor{normal text}

\\setbeamertemplate{navigation symbols}{}
\\setbeamertemplate{frametitle}[default][leftskip=0.6em,rightskip=0.6em]
\\setbeamertemplate{blocks}[rounded][shadow=false]
\\addtobeamertemplate{frametitle}{\\vskip2pt}{\\vskip2pt}
\\setbeamertemplate{itemize item}{\\textbullet}
\\setbeamertemplate{itemize subitem}{--}
\\setbeamerfont{frametitle}{size=\\large,series=\\bfseries}
\\setbeamerfont{itemize/enumerate body}{size=\\large}
\\setbeamerfont{itemize/enumerate subbody}{size=\\normalsize}
\\setbeamerfont{block body}{size=\\large}
\\setbeamersize{text margin left=1.3em,text margin right=1.3em}

% ---- vạch màu dưới tiêu đề: mỗi loại slide một sắc riêng
\\newcommand{\\sacslide}{phanvang}
\\newcommand{\\dinhsac}[1]{\\renewcommand{\\sacslide}{#1}\\setbeamercolor{frametitle}{fg=#1,bg=khungnhe}}
\\addtobeamertemplate{frametitle}{}{%
  \\vskip-2pt\\hspace*{-0.6em}\\begin{tikzpicture}\\fill[\\sacslide] (0,0) rectangle (\\paperwidth,2.2pt);\\end{tikzpicture}}

% ---- chân trang: tên giáo viên + thanh tiến trình nhiều màu
\\setbeamertemplate{footline}{%
  \\hbox{\\begin{beamercolorbox}[wd=\\paperwidth,ht=2.4ex,dp=1.1ex,leftskip=1em,rightskip=1em]{}%
  {\\color{phanngoc}\\footnotesize ${tex(o.chanTrang || "")}\\hfill\\color{\\sacslide}\\textbf{\\insertframenumber}}\\end{beamercolorbox}}%
  \\nointerlineskip
  \\hbox{\\begin{tikzpicture}
    \\useasboundingbox (0,0) rectangle (\\paperwidth,3pt);
    \\fill[khungnhe] (0,0) rectangle (\\paperwidth,3pt);
    \\fill[\\sacslide] (0,0) rectangle ({\\paperwidth*\\insertframenumber/\\inserttotalframenumber},3pt);
  \\end{tikzpicture}}}

% ---- khung dùng lại
\\newcommand{\\buoc}[1]{{\\color{phanvang}\\textbf{#1}}}
\\newcommand{\\nhan}[1]{{\\color{phancam}\\textbf{#1}}}
% khung có màu riêng: \\begin{hopmau}{phanngoc}{Tiêu đề}
\\newenvironment{hopmau}[2]{%
  \\setbeamercolor{block title}{bg=#1,fg=nenbang}%
  \\setbeamercolor{block body}{bg=khungnhe,fg=chuphan}%
  \\begin{block}{#2}}{\\end{block}}
\\newenvironment{khung}[1]{\\begin{hopmau}{phanvang}{#1}}{\\end{hopmau}}
% số thứ tự bước trong vòng tròn màu
\\newcommand{\\sobuoc}[2]{\\tikz[baseline=(sb.base)]{\\node[circle,fill=#1,text=nenbang,inner sep=1.6pt,minimum size=1.5em,font=\\bfseries\\small] (sb) {#2};}}
\\setlength{\\parskip}{2pt}

`;
  }

  /* ---------------------------------------------------------------- các slide */
  const frame = (title, body, opt) => `\\begin{frame}${opt || ""}[t]\n\\frametitle{${title}}\n${body}\n\\end{frame}\n\n`;

  function slideTieuDe(o, C) {
    return `\\begin{frame}[plain]
\\begin{center}
\\begin{tikzpicture}
  \\fill[phanvang] (0,0) rectangle (1.2,0.12);
  \\fill[phanngoc] (1.35,0) rectangle (2.55,0.12);
  \\fill[phancam] (2.7,0) rectangle (3.9,0.12);
  \\fill[phantim] (4.05,0) rectangle (5.25,0.12);
  \\fill[phanluc] (5.4,0) rectangle (6.6,0.12);
\\end{tikzpicture}\\\\[1.2em]
{\\color{phanngoc}\\large ${tex(o.truong || "")}}\\\\[1.6em]
{\\color{phanvang}\\LARGE\\bfseries ${tex(o.tenBai.toUpperCase())}}\\\\[0.6em]
{\\color{chuphan}\\large ${tex(C.ten ? "Chương " + C.so + ". " + C.ten : "")}}\\\\[1.8em]
{\\color{phanluc}\\normalsize ${tex(o.gv || "")}}\\\\[0.3em]
{\\color{phancam}\\footnotesize ${tex(o.lopTen)} — ${o.soTiet} tiết}\\\\[1.2em]
\\begin{tikzpicture}
  \\fill[phanluc] (0,0) rectangle (1.2,0.12);
  \\fill[phantim] (1.35,0) rectangle (2.55,0.12);
  \\fill[phancam] (2.7,0) rectangle (3.9,0.12);
  \\fill[phanngoc] (4.05,0) rectangle (5.25,0.12);
  \\fill[phanvang] (5.4,0) rectangle (6.6,0.12);
\\end{tikzpicture}
\\end{center}
\\end{frame}

`;
  }
  function slideMucTieu(B) {
    return frame("Mục tiêu bài học", `\\dinhsac{phanluc}\n\\begin{itemize}\\setlength\\itemsep{0.8em}\n${(B.yc || []).map(y => `  \\item<+-> ${tex(y)}`).join("\n")}\n\\end{itemize}`);
  }
  function slideKienThuc(m) {
    const ys = (m.y || []).map(y => `  \\item<+-> ${tex(y)}`).join("\n");
    return frame(tex(m.t), `\\dinhsac{phanvang}\n\\begin{hopmau}{phanvang}{Ghi nhớ}\n\\begin{itemize}\\setlength\\itemsep{0.7em}\n${ys}\n\\end{itemize}\n\\end{hopmau}`);
  }
  function slideViDu(m, i) {
    if (!m.vd) return "";
    const g = (m.vd.g || []).map((s, k) => `  \\item<${k + 2}->[\\sobuoc{phanngoc}{${k + 1}}] ${tex(s)}`).join("\n");
    return frame(`Ví dụ ${i}`, `\\dinhsac{phanngoc}\n\\large {\\color{phanvang}\\textbf{Đề bài.}} ${tex(m.vd.d)}

\\vspace{0.7em}
\\onslide<2->{{\\color{phanngoc}\\textbf{Lời giải.}}}
\\begin{itemize}\\setlength\\itemsep{0.6em}
${g}
\\end{itemize}`);
  }
  function slideThucTien(B) {
    if (!B.tt) return "";
    const g = (B.tt.g || []).map((s, k) => `  \\item<${k + 2}->[\\sobuoc{phancam}{${k + 1}}] ${tex(s)}`).join("\n");
    return frame("Vận dụng thực tiễn", `\\dinhsac{phancam}\n\\large\n\\begin{hopmau}{phancam}{Bài toán}\n${tex(B.tt.d)}\n\\end{hopmau}

\\onslide<2->{{\\color{phancam}\\textbf{Hướng giải.}}}
\\begin{itemize}\\setlength\\itemsep{0.55em}
${g}
\\end{itemize}`);
  }
  function slideAI(B, o) {
    if (!B.ai) return "";
    return frame("Thử thách cùng công cụ số", `\\dinhsac{phantim}\n\\begin{itemize}\\setlength\\itemsep{0.8em}
  \\item<1-> {\\color{phanvang}Dùng ${tex(CS[B.cs] || "công cụ số")}} để kiểm chứng kết quả vừa học.
  \\item<2-> {\\color{phantim}Câu lệnh gửi AI:} \\textit{\`\`${tex(B.ai.p || "")}''}
  \\item<3-> \\nhan{Cảnh giác:} ${tex(B.ai.l || "")}
  \\item<4-> Nhiệm vụ: chỉ ra chỗ AI sai và giải thích \\textbf{vì sao}.
\\end{itemize}`);
  }
  function slideCungCo(B, bai) {
    return frame("Củng cố — Về nhà", `\\dinhsac{phanvang}\n\\begin{itemize}\\setlength\\itemsep{0.9em}
  \\item<1->[\\sobuoc{phanvang}{1}] Nhắc lại các ý chính: ${tex((B.md || []).map(m => m.t).join("; "))}.
  \\item<2->[\\sobuoc{phancam}{2}] Lỗi hay mắc: ${tex((B.ai && B.ai.l) || "trình bày thiếu điều kiện xác định")}
  \\item<3->[\\sobuoc{phanluc}{3}] {\\color{phanvang}Bài tập về nhà:} ${tex(B.bt || "bài tập cuối bài trong sách giáo khoa")}
\\end{itemize}

\\vspace{1em}
\\onslide<4->{\\begin{center}{\\color{phanngoc}\\large Cảm ơn các em — hẹn gặp lại ở bài sau!}\\end{center}}`);
  }
  function slideCauHoi(qs) {
    if (!qs || !qs.length) return "";
    return qs.map((q, i) => {
      const pa = (q.pa || []).map((p, k) => `  \\item<1-> \\textbf{${"ABCD"[k]}.} ${tex(p)}`).join("\n");
      return frame(`Luyện tập ${i + 1}`, `\\dinhsac{phanluc}\n${tex(q.de)}

\\vspace{0.5em}
\\begin{itemize}\\setlength\\itemsep{0.35em}
${pa}
\\end{itemize}
\\onslide<2->{\\vspace{0.4em}{\\color{phanluc}\\textbf{Đáp án: ${tex(q.dapan || "A")}}}${q.loigiai ? ` \\\\ {\\color{phanxanh}\\small ${tex(q.loigiai)}}` : ""}}`);
    }).join("");
  }

  /* ---------------------------------------------------------------- dựng cả bài */
  function render(o) {
    const B = KHBD.data(o.lop, o.bai); if (!B) return "% chưa có dữ liệu bài này";
    const C = KHBD.chuong(o.lop, o.bai);
    const oo = Object.assign({ tenBai: `Bài ${o.bai}: ${C.tenBai}`, lopTen: KHBD.lopTen(o.lop), soTiet: B.t, tieuDe: `Bài ${o.bai}. ${C.tenBai}` }, o);
    let s = preamble(oo);
    s += `\\title{${tex(oo.tenBai)}}\n\\author{${tex(oo.gv || "")}}\n\\date{}\n\n\\begin{document}\n\n`;
    s += slideTieuDe(oo, C);
    if (o.mucTieu !== false) s += slideMucTieu(B);
    (B.md || []).forEach((m, i) => { s += slideKienThuc(m); if (o.viDu !== false) s += slideViDu(m, i + 1); });
    if (o.thucTien !== false) s += slideThucTien(B);
    if (o.ai !== false) s += slideAI(B, oo);
    if (o.cauHoi && o.cauHoi.length) s += slideCauHoi(o.cauHoi);
    if (o.cungCo !== false) s += slideCungCo(B, o.bai);
    s += `\\end{document}\n`;
    return s;
  }

  /* ---------------------------------------------------------------- xem trước bằng HTML (giống slide thật) */
  function xemTruoc(o) {
    const B = KHBD.data(o.lop, o.bai); if (!B) return "<p>Chưa có dữ liệu bài này.</p>";
    const C = KHBD.chuong(o.lop, o.bai); const T = s => NHD.texToHtml(s);
    const sl = [];
    sl.push(`<div class="sl tt" data-k="bia"><div class="truong">${esc(o.truong || "")}</div><h2>${esc("Bài " + o.bai + ": " + C.tenBai)}</h2>
      <div class="ch">${esc(C.ten ? "Chương " + C.so + ". " + C.ten : "")}</div><div class="gv">Giáo viên: ${esc(o.gv || "")}</div></div>`);
    if (o.mucTieu !== false) sl.push(`<div class="sl" data-k="mt"><span class="tag">Mục tiêu</span><h3>Mục tiêu bài học</h3><ul>${(B.yc || []).map(y => `<li>${T(y)}</li>`).join("")}</ul></div>`);
    (B.md || []).forEach((m, i) => {
      sl.push(`<div class="sl" data-k="kt"><span class="tag">Kiến thức</span><h3>${esc(m.t)}</h3><div class="blk"><b>Ghi nhớ</b><ul>${(m.y || []).map(y => `<li>${T(y)}</li>`).join("")}</ul></div></div>`);
      if (o.viDu !== false && m.vd) sl.push(`<div class="sl" data-k="vd"><span class="tag">Ví dụ</span><h3>Ví dụ ${i + 1}</h3><p><b class="vang">Đề bài.</b> ${T(m.vd.d)}</p><p><b class="xanh">Lời giải.</b></p><ul class="buoc">${(m.vd.g || []).map((g, k) => `<li><span class="n">${k + 1}</span>${T(g)}</li>`).join("")}</ul></div>`);
    });
    if (o.thucTien !== false && B.tt) sl.push(`<div class="sl" data-k="tt"><span class="tag">Thực tiễn</span><h3>Vận dụng thực tiễn</h3><div class="blk"><b>Bài toán</b><p>${T(B.tt.d)}</p></div><ul class="buoc">${(B.tt.g || []).map((g, k) => `<li><span class="n">${k + 1}</span>${T(g)}</li>`).join("")}</ul></div>`);
    if (o.ai !== false && B.ai) sl.push(`<div class="sl" data-k="ai"><span class="tag">Công cụ số &amp; AI</span><h3>Thử thách cùng công cụ số</h3><ul><li>Dùng <b class="vang">${esc(CS[B.cs] || "công cụ số")}</b> để kiểm chứng kết quả.</li><li><b class="xanh">Câu lệnh gửi AI:</b> <i>“${T(B.ai.p || "")}”</i></li><li><b class="hong">Cảnh giác:</b> ${T(B.ai.l || "")}</li><li>Nhiệm vụ: chỉ ra chỗ AI sai và giải thích <b>vì sao</b>.</li></ul></div>`);
    (o.cauHoi || []).forEach((q, i) => sl.push(`<div class="sl" data-k="lt"><span class="tag">Luyện tập</span><h3>Luyện tập ${i + 1}</h3><p>${T(q.de)}</p><ul class="pa">${(q.pa || []).map((p, k) => `<li><b>${"ABCD"[k]}.</b> ${T(p)}</li>`).join("")}</ul><p class="vang"><b>Đáp án: ${esc(q.dapan || "A")}</b></p></div>`));
    if (o.cungCo !== false) sl.push(`<div class="sl" data-k="cc"><span class="tag">Củng cố</span><h3>Củng cố — Về nhà</h3><ul><li>Ý chính: ${esc((B.md || []).map(m => m.t).join("; "))}.</li><li><b class="hong">Lỗi hay mắc:</b> ${T((B.ai && B.ai.l) || "")}</li><li><b class="vang">Bài tập về nhà:</b> ${esc(B.bt || "")}</li></ul></div>`);
    return sl.map(x => x.replace("</div>", '<div class="vach"></div></div>')).join("");
  }
  const esc = G.esc || (s => String(s == null ? "" : s));
  G.Beamer = { render, xemTruoc, tex };
})(window);
