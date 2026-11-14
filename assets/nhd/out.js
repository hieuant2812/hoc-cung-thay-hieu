/* nhd/out.js — xuất đề: file TeX (biên dịch XeLaTeX), trang giấy A4 (xem trước, in, PDF), bảng ma trận/đặc tả */
(function (G) {
  "use strict";
  const NHD = G.NHD = G.NHD || {};
  const esc = NHD.esc;
  const tq = s => String(s || "").replace(/\\/g, "\\textbackslash{}").replace(/([&%#_{}$])/g, "\\$1").replace(/~/g, "\\textasciitilde{}");
  const ROMAN = ["I", "II", "III"];
  const LOAI = ["TN", "DS", "TLN"];

  /* các mức "nén" để đề vừa số trang mong muốn: cỡ chữ (pt), tỉ lệ hình, giãn dòng */
  const LEVELS = [
    { fs: 12, fig: 1, lh: 1.32, gap: 4 },
    { fs: 12, fig: .85, lh: 1.27, gap: 3 },
    { fs: 12, fig: .75, lh: 1.24, gap: 2 },
    { fs: 11.5, fig: .7, lh: 1.22, gap: 2 },
    { fs: 11, fig: .65, lh: 1.2, gap: 1 },
    { fs: 11, fig: .58, lh: 1.17, gap: 1 },
    { fs: 10.5, fig: .55, lh: 1.15, gap: 0 }
  ];
  /* tách tên Sở thành 2 dòng: "SỞ GIÁO DỤC VÀ ĐÀO TẠO" / "THÀNH PHỐ ..." (hoặc dùng dấu | để tự ngắt) */
  function soLines(so) {
    so = String(so || "").trim();
    if (/[|\n]/.test(so)) return so.split(/\s*[|\n]\s*/).slice(0, 2);
    const m = so.match(/^(SỞ GIÁO DỤC VÀ ĐÀO TẠO|SỞ GIÁO DỤC - ĐÀO TẠO|SỞ GD ?& ?ĐT|SỞ GD&ĐT)\s+(.+)$/i);
    return m ? [m[1], m[2]] : [so, ""];
  }
  function partTitles(P, mon) {
    const T = {
      TN: n => `Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu ${n}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.`,
      DS: n => `Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu ${n}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`,
      TLN: n => `Câu trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu ${n}.`
    };
    let k = 0; const out = {};
    LOAI.forEach(L => { if (P[L].length) out[L] = { so: ROMAN[k++], text: T[L](P[L].length) }; });
    return out;
  }

  /* ======================================================== TeX */
  function preamble(info, lv) {
    lv = lv || LEVELS[0];
    return String.raw`% !TeX program = xelatex
% Đề được tạo bởi trang "Học cùng Thầy Hiếu". Biên dịch bằng XeLaTeX 2 lần (để có số trang).
\documentclass[12pt,a4paper]{article}
\usepackage[top=1cm,bottom=1.5cm,left=1.5cm,right=1.2cm,footskip=0.7cm]{geometry}
\usepackage{fontspec}
\IfFontExistsTF{Times New Roman}{\setmainfont{Times New Roman}}{\setmainfont{TeX Gyre Termes}}
\usepackage{amsmath,amssymb,array,graphicx,fancyhdr,refcount}
\usepackage{tikz}\usetikzlibrary{calc,arrows.meta}
\usepackage{tkz-tab}
\setlength{\parindent}{0pt}\setlength{\parskip}{${lv.gap / 2}pt}
\AtBeginDocument{\fontsize{${lv.fs}}{${(lv.fs * lv.lh).toFixed(1)}}\selectfont}
\tikzset{every picture/.append style={scale=${lv.fig}}}
\newcommand{\sotrang}[1]{\ifnum0\getpagerefnumber{#1}<10 0\fi\getpagerefnumber{#1}}
\pagestyle{fancy}\fancyhf{}\renewcommand{\headrulewidth}{0pt}
\newcommand{\made}{}
\newcommand{\chantrang}{Mã đề \made}
\fancyfoot[C]{\small\textit{Trang \thepage/\pageref{het-\made} -- \chantrang}}
\newcolumntype{L}[1]{>{\raggedright\arraybackslash}p{#1}}
\renewcommand{\arraystretch}{1.12}\setlength{\lineskiplimit}{2pt}\setlength{\lineskip}{3pt}
\newcolumntype{C}[1]{>{\centering\arraybackslash}p{#1}}
\newcommand{\causkip}{${lv.gap}pt}
\newcommand{\cau}[1]{\par\vspace{\causkip}\noindent\textbf{Câu #1.}~}
\newcommand{\bonPA}[4]{\par\noindent\begin{tabular}{@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}}\textbf{A.}~#1&\textbf{B.}~#2&\textbf{C.}~#3&\textbf{D.}~#4\end{tabular}\par}
\newcommand{\haiPA}[4]{\par\noindent\begin{tabular}{@{}L{0.5\linewidth}@{}L{0.5\linewidth}@{}}\textbf{A.}~#1&\textbf{B.}~#2\\[6pt] \textbf{C.}~#3&\textbf{D.}~#4\end{tabular}\par}
\newcommand{\motPA}[4]{\par\textbf{A.}~#1\par\textbf{B.}~#2\par\textbf{C.}~#3\par\textbf{D.}~#4\par}
\newcommand{\y}[2]{\par\hangindent=1.6em\hangafter=1\hspace*{0.8em}\textbf{#1)}~#2}
\newcommand{\dapso}[1]{\par\textbf{Đáp án:}~#1}
\newcommand{\loigiai}[1]{\par\smallskip{\small\textit{Lời giải.}~#1}\par}
`;
  }
  function headerTex(info, ma) {
    const [so1, so2] = soLines(info.so).map(tq), tr = tq(info.truong), ky = tq(info.ky), nh = tq(info.namHoc), mon = tq(info.monTen || "TOÁN"), lop = tq(info.lop);
    const box = info.chinhThuc === false ? "" : "\\fbox{\\textbf{" + tq(info.loaiDe || "ĐỀ CHÍNH THỨC") + "}}";
    const made = ma === "GOC" ? "ĐỀ GỐC" : "Mã đề thi: " + ma;
    return String.raw`\renewcommand{\made}{${ma}}\renewcommand{\chantrang}{${ma === "GOC" ? "Đề gốc" : "Mã đề " + ma}}\setcounter{page}{1}
\noindent\begin{tabular}{@{}C{0.45\linewidth}@{}C{0.55\linewidth}@{}}
${so1} & \textbf{${ky}}\\
${so2 ? so2 : ""} & \textbf{NĂM HỌC ${nh}}\\
\textbf{${tr}} & \textbf{Môn: ${mon}${lop ? " -- Lớp " + lop : ""}}\\[1pt]
${box} & \textit{Thời gian làm bài: ${tq(info.phut)} phút, không kể thời gian phát đề}\\[1pt]
\textit{(Đề thi có \sotrang{het-${ma}} trang)} & \fbox{\textbf{${made}}}
\end{tabular}
\par\smallskip
\noindent Họ, tên thí sinh: \makebox[8cm]{\dotfill}\par
\noindent Số báo danh: \makebox[5cm]{\dotfill}
\par\smallskip
`;
  }
  function qTex(item, n, opt) {
    const { q, order } = item; const side = NHD.sideFig(q);
    let s = `\\cau{${n}}${side ? side.rest : q.de}\n`;
    if (q.loai === "TN") {
      let cols = NHD.optCols(q.pa); if (side) cols = cols === 4 ? 2 : 1;
      const cmd = cols === 4 ? "bonPA" : cols === 2 ? "haiPA" : "motPA";
      s += `\\${cmd}` + order.map(j => `{${q.pa[j]}}`).join("") + "\n";
      if (opt.dapan) s += `\\dapso{${"ABCD"[order.indexOf(0)]}}\n`;
    } else if (q.loai === "DS") {
      s += order.map((j, i) => `\\y{${"abcd"[i]}}{${q.y[j].t}${opt.dapan ? ` \\textbf{(${q.y[j].d ? "Đúng" : "Sai"})}` : ""}}`).join("\n") + "\n";
    } else if (opt.dapan) s += `\\dapso{$${String(q.da).replace(/^\$|\$$/g, "").replace(/,/g, "{,}")}$}\n`;
    if (side) s = `\\par\\vspace{\\causkip}\\noindent\\begin{minipage}[t]{0.655\\linewidth}\\vspace{0pt}\\setlength{\\parskip}{2pt}\\renewcommand{\\causkip}{0pt}\n${s}\\end{minipage}\\hfill\\begin{minipage}[t]{0.335\\linewidth}\\vspace{0pt}\\centering\n${side.figTex}\n\\end{minipage}\\par\n`;
    if (opt.loigiai && q.loigiai) s += `\\loigiai{${q.loigiai}}\n`;
    return opt.loigiai || side ? s : `\\par\\noindent\\begin{minipage}{\\linewidth}\\setlength{\\parskip}{2pt}\n${s}\\end{minipage}\\par\n`;
  }
  function versionTex(P, info, ma, opt = {}) {
    const T = partTitles(P);
    let s = headerTex(info, ma);
    LOAI.forEach(L => {
      if (!P[L].length) return;
      s += `\\par\\smallskip\\noindent\\textbf{PHẦN ${T[L].so}. ${T[L].text}}\n`;
      P[L].forEach((it, i) => s += qTex(it, i + 1, opt));
    });
    s += `\\par\\bigskip\\begin{center}\\textbf{------ HẾT ------}\\end{center}\n{\\small\\textit{- Thí sinh không được sử dụng tài liệu.\\quad - Giám thị không giải thích gì thêm.}}\\label{het-${ma}}\n\\clearpage\n`;
    return s;
  }
  function keysTex(all, mon) { // all: [{ma, keys}]
    let s = `\\renewcommand{\\made}{DA}\\renewcommand{\\chantrang}{Đáp án}\\setcounter{page}{1}\\begin{center}\\textbf{\\large BẢNG ĐÁP ÁN TỔNG HỢP}\\end{center}\n`;
    const w = NHD.Gen.diem(mon);
    const block = (L, title, fmt) => {
      const n = all[0].keys[L].length; if (!n) return "";
      let out = `\\par\\medskip\\noindent\\textbf{${title}}\\par\\smallskip\n`;
      for (let a = 0; a < n; a += 12) {
        const cols = Math.min(12, n - a);
        out += `{\\small\\noindent\\begin{tabular}{|c|${"c|".repeat(cols)}}\\hline\n\\textbf{Mã đề}` + Array.from({ length: cols }, (_, k) => `&\\textbf{${a + k + 1}}`).join("") + "\\\\\\hline\n";
        all.forEach(v => out += v.ma + v.keys[L].slice(a, a + cols).map(x => "&" + fmt(x)).join("") + "\\\\\\hline\n");
        out += "\\end{tabular}}\\par\\smallskip\n";
      }
      return out;
    };
    s += block("TN", `PHẦN I. Mỗi câu trả lời đúng được ${String(w.TN).replace(".", ",")} điểm.`, x => x);
    s += block("DS", "PHẦN II. Điểm tối đa của 01 câu hỏi là 1 điểm (đúng 1 ý: 0,1 điểm; 2 ý: 0,25 điểm; 3 ý: 0,5 điểm; 4 ý: 1 điểm).", x => x.split("").map((c, i) => "abcd"[i] + ")" + c).join(" "));
    s += block("TLN", `PHẦN III. Mỗi câu trả lời đúng được ${String(w.TLN).replace(".", ",")} điểm.`, x => "$" + String(x).replace(/,/g, "{,}") + "$");
    s += "\\label{het-DA}\n";
    return s;
  }
  const doc = (info, body, lv) => preamble(info, lv) + "\\begin{document}\n" + body + "\\end{document}\n";

  /* ======================================================== HTML trang A4 */
  function headerHtml(info, ma, pagesRef) {
    const [so1, so2] = soLines(info.so);
    const box = info.chinhThuc === false ? "" : `<span class="box">${esc(info.loaiDe || "ĐỀ CHÍNH THỨC")}</span>`;
    const made = /^G/.test(ma) ? "ĐỀ GỐC" : "Mã đề thi: " + esc(ma);
    const r = (a, b) => `<div>${a}</div><div>${b}</div>`;
    return `<div class="hd">${r(esc(so1), `<b>${esc(info.ky)}</b>`)}${r(esc(so2), `<b>NĂM HỌC ${esc(info.namHoc)}</b>`)}${r(`<b>${esc(info.truong)}</b>`, `<b>Môn: ${esc(info.monTen || "TOÁN")}${info.lop ? " – Lớp " + esc(info.lop) : ""}</b>`)}${r(box, `<i>Thời gian làm bài: ${esc(info.phut)} phút, không kể thời gian phát đề</i>`)}${r(`<i>(Đề thi có <span class="npages">${pagesRef || "…"}</span> trang)</i>`, `<span class="made">${made}</span>`)}</div>
      <div class="sv">Họ, tên thí sinh: …………………………………………………………<br>Số báo danh: ……………………………………</div>`;
  }
  /* các khối (khối = không bị cắt khi sang trang) của một mã đề */
  function versionBlocks(P, info, ma, opt = {}) {
    const T = partTitles(P); const B = [{ html: headerHtml(info, ma), head: true }];
    LOAI.forEach(L => {
      if (!P[L].length) return;
      B.push({ html: `<div class="ph"><b>PHẦN ${T[L].so}. ${T[L].text}</b></div>`, keep: true });
      P[L].forEach((it, i) => B.push({ html: NHD.renderQuestion(it, i + 1, opt.dapan ? "key" : "exam", { sol: opt.loigiai, swap: opt.swap ? it.slot : null }) }));
    });
    B.push({ html: `<div class="het">------ HẾT ------</div><div class="ghichu">- Thí sinh không được sử dụng tài liệu. - Giám thị không giải thích gì thêm.</div>` });
    return B;
  }
  function keysBlocks(all, mon) {
    const w = NHD.Gen.diem(mon); const B = [{ html: `<h3 class="c">BẢNG ĐÁP ÁN TỔNG HỢP</h3>` }];
    const tbl = (L, title, fmt) => {
      const n = all[0].keys[L].length; if (!n) return;
      B.push({ html: `<div style="margin-top:6px"><b>${title}</b></div>`, keep: true });
      for (let a = 0; a < n; a += 12) {
        const cols = Math.min(12, n - a);
        B.push({ html: `<table class="dap"><tr><th>Mã đề</th>${Array.from({ length: cols }, (_, k) => `<th>${a + k + 1}</th>`).join("")}</tr>` + all.map(v => `<tr><td><b>${esc(v.ma)}</b></td>${v.keys[L].slice(a, a + cols).map(x => `<td>${fmt(x)}</td>`).join("")}</tr>`).join("") + "</table>" });
      }
    };
    tbl("TN", `PHẦN I. Mỗi câu trả lời đúng được ${String(w.TN).replace(".", ",")} điểm.`, x => x);
    tbl("DS", "PHẦN II. Đúng 1 ý: 0,1 điểm; 2 ý: 0,25 điểm; 3 ý: 0,5 điểm; 4 ý: 1 điểm.", x => x.split("").map((c, i) => "abcd"[i] + ")" + c).join(" "));
    tbl("TLN", `PHẦN III. Mỗi câu trả lời đúng được ${String(w.TLN).replace(".", ",")} điểm.`, x => NHD.texToHtml("$" + x + "$"));
    return B;
  }
  /* xếp khối vào các trang A4; trả mảng phần tử .paper */
  function applyLevel(el, lv) { el.style.fontSize = lv.fs + "pt"; el.style.lineHeight = lv.lh; el.style.setProperty("--gap", lv.gap + "px"); }
  function paginate(blocks, footer, lv) {
    lv = lv || LEVELS[0];
    const meas = document.createElement("div"); meas.className = "paper ex"; meas.style.cssText = "position:absolute;left:-30000px;top:0;visibility:hidden;min-height:0"; applyLevel(meas, lv);
    document.body.appendChild(meas);
    const mm = 3.7795; const avail = (297 - 10 - 15) * mm - 4;
    const pages = []; let cur = null, used = 0;
    const newPage = () => { cur = document.createElement("div"); cur.className = "paper ex"; applyLevel(cur, lv); pages.push(cur); used = 0; };
    newPage();
    const els = blocks.map(b => { const d = document.createElement("div"); d.innerHTML = b.html; d.className = "blk"; meas.appendChild(d); const cs = getComputedStyle(d.firstElementChild || d); return { d, h: d.getBoundingClientRect().height + (parseFloat(cs.marginBottom) || 0) + (parseFloat(cs.marginTop) || 0), keep: b.keep }; });
    els.forEach((e, i) => {
      let need = e.h; if (e.keep && els[i + 1]) need += Math.min(els[i + 1].h, avail * 0.6);
      if (used > 0 && used + need > avail) newPage();
      cur.appendChild(e.d); used += e.h;
    });
    meas.remove();
    const N = pages.length;
    pages.forEach((p, i) => { const f = document.createElement("div"); f.className = "pfoot"; f.textContent = footer(i + 1, N); p.appendChild(f); p.querySelectorAll(".npages").forEach(x => x.textContent = String(N).padStart(2, "0")); });
    return pages;
  }
  /* tìm mức nén nhỏ nhất để mọi mã đề không quá "target" trang; trả chỉ số mức */
  function fitLevel(buildBlocks, nVersions, target) {
    if (!target) return 0;
    for (let k = 0; k < LEVELS.length; k++) {
      NHD.figScale = LEVELS[k].fig; let ok = true;
      for (let v = 0; v < nVersions && ok; v++) if (paginate(buildBlocks(v), () => "", LEVELS[k]).length > target) ok = false;
      if (ok) return k;
    }
    return LEVELS.length - 1;
  }
  async function waitFonts() { try { await document.fonts.ready; } catch (e) {} }

  /* PDF từ các trang (ảnh độ phân giải cao) */
  async function pagesToPdf(pages, onProg) {
    const { jsPDF } = G.jspdf; const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const host = document.createElement("div"); host.style.cssText = "position:fixed;left:-30000px;top:0;width:210mm";
    document.body.appendChild(host);
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i].cloneNode(true); p.style.boxShadow = "none"; p.style.margin = "0"; host.appendChild(p);
      const cv = await html2canvas(p, { scale: 2.2, backgroundColor: "#ffffff", logging: false, useCORS: true });
      if (i) pdf.addPage();
      pdf.addImage(cv.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, 210, 297);
      host.removeChild(p); onProg && onProg(i + 1, pages.length);
    }
    host.remove();
    return pdf.output("blob");
  }
  /* mở cửa sổ in */
  function printPages(pages, title) {
    const w = window.open("", "_blank"); if (!w) { alert("Trình duyệt chặn cửa sổ mới. Hãy cho phép cửa sổ bật lên (pop-up) rồi bấm lại."); return; }
    const base = location.href.replace(/[^/]*$/, "");
    w.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title><base href="${base}"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/katex/katex.min.css"><link rel="stylesheet" href="assets/style.css">
      <style>body{background:#e9ecf3;display:block}body::before{display:none}.paper{margin:12px auto}.swap{display:none}@media print{body{background:#fff}.paper{margin:0}}</style></head><body>${pages.map(p => p.outerHTML).join("")}<script>document.fonts.ready.then(()=>setTimeout(()=>print(),400))<\/script></body></html>`);
    w.document.close();
  }

  /* ======================================================== ma trận & đặc tả (HTML dùng cho in và Excel) */
  function matrixTables(M, idx, names, info, mon) {
    const lv = idx.levels; const w = NHD.Gen.diem(mon);
    const PART = { TN: "Phần I. Trắc nghiệm nhiều lựa chọn", DS: "Phần II. Trắc nghiệm đúng sai", TLN: "Phần III. Trả lời ngắn" };
    const rows = idx.list.filter(d => M[d.dkey] && LOAI.some(L => Object.values(M[d.dkey][L] || {}).some(n => +n > 0)));
    const sum = {}; const cell = (d, L, m) => +(((M[d.dkey] || {})[L] || {})[m]) || 0;
    let h = `<table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse;font:13px 'Times New Roman',serif"><tr><th rowspan="2">TT</th><th rowspan="2">Chương</th><th rowspan="2">Nội dung (dạng toán)</th>` + LOAI.map(L => `<th colspan="${lv.length}">${PART[L]}</th>`).join("") + `<th rowspan="2">Tổng số câu</th><th rowspan="2">Điểm</th></tr><tr>` + LOAI.map(() => lv.map(m => `<th>${({ NB: "Biết", TH: "Hiểu", VD: "Vận dụng", VDC: "VD cao" })[m]}</th>`).join("")).join("") + "</tr>";
    rows.forEach((d, i) => {
      let n = 0, dd = 0;
      h += `<tr><td align="center">${i + 1}</td><td>${esc(names.chuong(d.chuong))}</td><td>${esc(d.ten || d.dkey)} <i>(${esc(names.bai(d.chuong, d.bai))})</i></td>` + LOAI.map(L => lv.map(m => { const c = cell(d, L, m); n += c; dd += c * w[L]; sum[L + m] = (sum[L + m] || 0) + c; return `<td align="center">${c || ""}</td>`; }).join("")).join("") + `<td align="center"><b>${n}</b></td><td align="center">${String(+dd.toFixed(2)).replace(".", ",")}</td></tr>`;
    });
    const t = NHD.Gen.totals(M, mon);
    h += `<tr><th colspan="3">Tổng số câu</th>` + LOAI.map(L => lv.map(m => `<th>${sum[L + m] || 0}</th>`).join("")).join("") + `<th>${t.n}</th><th>${String(+t.raw.toFixed(2)).replace(".", ",")}</th></tr>`;
    h += `<tr><th colspan="3">Tỉ lệ theo mức độ</th><td colspan="${lv.length * 3 + 2}" align="center">${lv.map(m => `${({ NB: "Biết", TH: "Hiểu", VD: "Vận dụng", VDC: "VD cao" })[m]}: ${t.n ? Math.round((t.lv[m] || 0) / t.n * 100) : 0}%`).join(" · ")}</td></tr></table>`;
    // đặc tả
    let d2 = `<table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse;font:13px 'Times New Roman',serif"><tr><th>TT</th><th>Chương / Bài</th><th>Nội dung (dạng toán)</th><th>Yêu cầu cần đạt theo mức độ</th><th>Số câu Phần I</th><th>Số câu Phần II</th><th>Số câu Phần III</th></tr>`;
    rows.forEach((d, i) => {
      const lvTxt = lv.filter(m => LOAI.some(L => cell(d, L, m))).map(m => `<b>${({ NB: "Biết", TH: "Hiểu", VD: "Vận dụng", VDC: "Vận dụng cao" })[m]}:</b> ${esc(d.ten || d.dkey)} (${LOAI.map(L => cell(d, L, m) ? cell(d, L, m) + " " + { TN: "TN", DS: "Đ/S", TLN: "TLN" }[L] : "").filter(Boolean).join(", ")})`).join("<br>");
      d2 += `<tr><td align="center">${i + 1}</td><td>${esc(names.chuong(d.chuong))}<br><i>${esc(names.bai(d.chuong, d.bai))}</i></td><td>${esc(d.ten || d.dkey)}</td><td>${lvTxt}</td>` + LOAI.map(L => `<td align="center">${lv.reduce((a, m) => a + cell(d, L, m), 0) || ""}</td>`).join("") + "</tr>";
    });
    d2 += "</table>";
    const head = `<p style="text-align:center;font:bold 16px 'Times New Roman',serif;margin:6px 0">MA TRẬN ĐỀ ${esc(info.ky || "KIỂM TRA")} – MÔN ${esc((info.monTen || mon).toUpperCase())}${info.lop ? " – LỚP " + esc(info.lop) : ""}</p>`;
    const head2 = `<p style="text-align:center;font:bold 16px 'Times New Roman',serif;margin:18px 0 6px">BẢNG ĐẶC TẢ</p>`;
    return head + h + head2 + d2;
  }

  /* Ma trận + bản đặc tả theo mẫu Phụ lục Công văn 7991/BGDĐT-GDTrH, xuất file Word (.doc)
     pos (tuỳ chọn): {dkey|L|muc: [số câu…]} — số thứ tự câu trong đề để ghi vào bản đặc tả */
  function matrix7991(M, idx, names, info, mon, pos, bodyOnly) {
    const w = NHD.Gen.diem(mon); const LV3 = ["B", "H", "V"]; const lvOf = m => m === "NB" ? "B" : m === "TH" ? "H" : "V";
    const rows = idx.list.filter(d => M[d.dkey] && LOAI.some(L => Object.values(M[d.dkey][L] || {}).some(n => +n > 0)));
    const cnt = (d, L, k) => ["NB", "TH", "VD", "VDC"].filter(m => lvOf(m) === k).reduce((a, m) => a + (+(((M[d.dkey] || {})[L] || {})[m]) || 0), 0);
    const nums = (d, L, k) => { if (!pos) return ""; const a = []; ["NB", "TH", "VD", "VDC"].filter(m => lvOf(m) === k).forEach(m => a.push(...(pos[d.dkey + "|" + L + "|" + m] || []))); return a.sort((x, y) => x - y).map(n => "C" + n).join(", "); };
    const TD = `style="border:1px solid #000;padding:2px 3px;font:10.5pt 'Times New Roman';text-align:center;vertical-align:middle"`;
    const TL = `style="border:1px solid #000;padding:2px 4px;font:10.5pt 'Times New Roman';vertical-align:top"`;
    const TH = `style="border:1px solid #000;padding:2px 2px;font:bold 10pt 'Times New Roman';text-align:center;vertical-align:middle;background:#f2f2f2"`;
    const f = x => x ? String(+x.toFixed(2)).replace(".", ",") : "";
    const grp = `<th ${TH} colspan="3">Nhiều lựa chọn</th><th ${TH} colspan="3">“Đúng – Sai”</th><th ${TH} colspan="3">Trả lời ngắn</th>`;
    const sub = Array(5).fill(`<th ${TH}>B</th><th ${TH}>H</th><th ${TH}>VD</th>`).join("");
    // gộp chương
    const span = {}; rows.forEach(d => span[d.chuong] = (span[d.chuong] || 0) + 1);
    const cols = (a, n, b) => `<colgroup>${a.map(w => `<col width="${w}" style="width:${w}pt">`).join("")}${Array(n).fill(`<col width="27" style="width:27pt">`).join("")}${b.map(w => `<col width="${w}" style="width:${w}pt">`).join("")}</colgroup>`;
    let h = `<table width="780" style="border-collapse:collapse;width:780pt;table-layout:fixed">${cols([24, 110, 200], 15, [45])}<tr><th ${TH} rowspan="4">TT</th><th ${TH} rowspan="4">Chủ đề/<br>Chương</th><th ${TH} rowspan="4">Nội dung/đơn vị kiến thức</th><th ${TH} colspan="12">Mức độ đánh giá</th><th ${TH} colspan="3" rowspan="3">Tổng</th><th ${TH} rowspan="4">Tỉ lệ %<br>điểm</th></tr>
      <tr><th ${TH} colspan="9">TNKQ</th><th ${TH} colspan="3" rowspan="2">Tự luận</th></tr><tr>${grp}</tr><tr>${sub}</tr>`;
    const tot = {}; let i = 0, lastC = null, ptAll = 0;
    rows.forEach(d => {
      let rowPt = 0; const lvSum = { B: 0, H: 0, V: 0 };
      const cells = LOAI.map(L => LV3.map(k => { const c = cnt(d, L, k); tot[L + k] = (tot[L + k] || 0) + c; lvSum[k] += c; rowPt += c * w[L]; return `<td ${TD}>${c || ""}</td>`; }).join("")).join("") + `<td ${TD}></td><td ${TD}></td><td ${TD}></td>`;
      ptAll += rowPt; d._pt = rowPt;
      const first = d.chuong !== lastC; if (first) { i++; lastC = d.chuong; }
      h += `<tr>${first ? `<td ${TD} rowspan="${span[d.chuong]}">${i}</td><td ${TL} rowspan="${span[d.chuong]}"><b>${esc(names.chuong(d.chuong))}</b></td>` : ""}<td ${TL}>${esc(d.ten || d.dkey)}</td>${cells}${LV3.map(k => `<td ${TD}>${lvSum[k] || ""}</td>`).join("")}<td ${TD}>__PT_${d.dkey}__</td></tr>`;
    });
    rows.forEach(d => h = h.replace(`__PT_${d.dkey}__`, ptAll ? f(d._pt / ptAll * 100) + "%" : ""));
    const totN = k => LOAI.reduce((a, L) => a + (tot[L + k] || 0), 0);
    h += `<tr><td ${TH} colspan="3">Tổng số câu</td>${LOAI.map(L => LV3.map(k => `<td ${TH}>${tot[L + k] || 0}</td>`).join("")).join("")}<td ${TH}>0</td><td ${TH}>0</td><td ${TH}>0</td>${LV3.map(k => `<td ${TH}>${totN(k)}</td>`).join("")}<td ${TH}></td></tr>`;
    const ptK = k => LOAI.reduce((a, L) => a + (tot[L + k] || 0) * w[L], 0);
    const sc = ptAll ? 10 / ptAll : 1; // quy về thang 10
    h += `<tr><td ${TH} colspan="3">Tổng số điểm</td>${LOAI.map(L => `<td ${TH} colspan="3">${f(LV3.reduce((a, k) => a + (tot[L + k] || 0), 0) * w[L] * sc)}</td>`).join("")}<td ${TH} colspan="3">0</td>${LV3.map(k => `<td ${TH}>${f(ptK(k) * sc)}</td>`).join("")}<td ${TH}>10,0</td></tr>`;
    h += `<tr><td ${TH} colspan="3">Tỉ lệ %</td>${LOAI.map(L => `<td ${TH} colspan="3">${f(LV3.reduce((a, k) => a + (tot[L + k] || 0), 0) * w[L] * sc * 10)}%</td>`).join("")}<td ${TH} colspan="3">0%</td>${LV3.map(k => `<td ${TH}>${f(ptK(k) * sc * 10)}%</td>`).join("")}<td ${TH}>100%</td></tr></table>`;
    // bản đặc tả
    const MUCT = { B: "Biết", H: "Hiểu", V: "Vận dụng" };
    let d2 = `<table width="780" style="border-collapse:collapse;width:780pt;table-layout:fixed">${cols([24, 95, 130, 207], 12, [])}<tr><th ${TH} rowspan="4">TT</th><th ${TH} rowspan="4">Chủ đề/<br>Chương</th><th ${TH} rowspan="4">Nội dung/đơn vị kiến thức</th><th ${TH} rowspan="4">Yêu cầu cần đạt</th><th ${TH} colspan="12">Số câu hỏi ở các mức độ đánh giá</th></tr>
      <tr><th ${TH} colspan="9">TNKQ</th><th ${TH} colspan="3" rowspan="2">Tự luận</th></tr><tr>${grp}</tr><tr>${Array(4).fill(`<th ${TH}>B</th><th ${TH}>H</th><th ${TH}>VD</th>`).join("")}</tr>`;
    i = 0; lastC = null;
    rows.forEach(d => {
      const ks = LV3.filter(k => LOAI.some(L => cnt(d, L, k)));
      const yc = ks.map(k => `<b>${MUCT[k]}:</b><br>– ${esc(d.ten || d.dkey)}${k === "B" ? " (nhận biết công thức, khái niệm)." : k === "H" ? " (hiểu, tính toán trực tiếp)." : " (vận dụng giải quyết bài toán, bài toán thực tế)."}`).join("<br>");
      const first = d.chuong !== lastC; if (first) { i++; lastC = d.chuong; }
      d2 += `<tr>${first ? `<td ${TD} rowspan="${span[d.chuong]}">${i}</td><td ${TL} rowspan="${span[d.chuong]}"><b>${esc(names.chuong(d.chuong))}</b></td>` : ""}<td ${TL}>${esc(d.ten || d.dkey)}<br><i>${esc(names.bai(d.chuong, d.bai))}</i></td><td ${TL}>${yc}</td>` +
        LOAI.map(L => LV3.map(k => { const c = cnt(d, L, k); return `<td ${TD}>${c ? (pos ? nums(d, L, k) || c : c) : ""}</td>`; }).join("")).join("") + `<td ${TD}></td><td ${TD}></td><td ${TD}></td></tr>`;
    });
    d2 += `<tr><td ${TH} colspan="4">Tổng số câu</td>${LOAI.map(L => LV3.map(k => `<td ${TH}>${tot[L + k] || 0}</td>`).join("")).join("")}<td ${TH}>0</td><td ${TH}>0</td><td ${TH}>0</td></tr></table>`;
    const P = s => `<p style="text-align:center;font:bold 13pt 'Times New Roman';margin:4pt 0">${s}</p>`;
    const hd = `<table style="width:100%;border:0"><tr><td style="text-align:center;font:11pt 'Times New Roman';width:40%">${esc((info.so || "SỞ GIÁO DỤC VÀ ĐÀO TẠO").replace("|", " "))}<br><b>${esc(info.truong || "TRƯỜNG ……")}</b><br>TỔ: ……………</td><td style="text-align:center;font:11pt 'Times New Roman'"><b>${esc(info.ky || "KIỂM TRA")}</b><br>NĂM HỌC ${esc(info.namHoc || "……")}<br>Môn: ${esc(info.monTen || mon)} – Lớp ${esc(info.lop || "")} · Thời gian: ${esc(info.phut || "…")} phút</td></tr></table>`;
    const note = `<p style="font:italic 10.5pt 'Times New Roman';margin:4pt 0">Ghi chú: Mỗi câu “Đúng – Sai” gồm 4 ý; điểm Phần I ${String(w.TN).replace(".", ",")} đ/câu, Phần II tối đa 1 đ/câu, Phần III ${String(w.TLN).replace(".", ",")} đ/câu${Math.abs(ptAll - 10) > 1e-9 ? " (đã quy về thang điểm 10)" : ""}. B: Biết, H: Hiểu, VD: Vận dụng; mức “vận dụng cao” của ngân hàng được tính vào cột Vận dụng theo mẫu Công văn 7991/BGDĐT-GDTrH.${pos ? " Bản đặc tả ghi số thứ tự câu trong đề gốc/mã đề đầu tiên (C1 = câu 1 của phần tương ứng)." : ""}</p>`;
    const body = hd + P("MA TRẬN ĐỀ KIỂM TRA") + h + note + `<br style="page-break-before:always" clear="all">` + P("BẢN ĐẶC TẢ ĐỀ KIỂM TRA") + d2;
    if (bodyOnly) return body;
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Ma tran dac ta</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page{size:841.9pt 595.3pt;margin:30pt 28pt}@page WordSection1{size:841.9pt 595.3pt;mso-page-orientation:landscape;margin:30pt 28pt 30pt 28pt}div.WordSection1{page:WordSection1}table{mso-table-layout-alt:fixed}</style></head><body><div class="WordSection1">${body}</div></body></html>`;
  }

  NHD.Out = { matrix7991, LEVELS, soLines, fitLevel, applyLevel, preamble, headerTex, versionTex, keysTex, doc, versionBlocks, keysBlocks, paginate, pagesToPdf, printPages, waitFonts, matrixTables, partTitles };
})(window);
