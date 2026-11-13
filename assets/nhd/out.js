/* nhd/out.js — xuất đề: file TeX (biên dịch XeLaTeX), trang giấy A4 (xem trước, in, PDF), bảng ma trận/đặc tả */
(function (G) {
  "use strict";
  const NHD = G.NHD = G.NHD || {};
  const esc = NHD.esc;
  const tq = s => String(s || "").replace(/\\/g, "\\textbackslash{}").replace(/([&%#_{}$])/g, "\\$1").replace(/~/g, "\\textasciitilde{}");
  const ROMAN = ["I", "II", "III"];
  const LOAI = ["TN", "DS", "TLN"];

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
  function preamble(info) {
    return String.raw`% !TeX program = xelatex
% Đề được tạo bởi trang "Học cùng Thầy Hiếu". Biên dịch bằng XeLaTeX 2 lần (để có số trang).
\documentclass[12pt,a4paper]{article}
\usepackage[top=1.3cm,bottom=1.6cm,left=1.9cm,right=1.5cm]{geometry}
\usepackage{fontspec}
\IfFontExistsTF{Times New Roman}{\setmainfont{Times New Roman}}{\setmainfont{TeX Gyre Termes}}
\usepackage{amsmath,amssymb,array,graphicx,fancyhdr}
\usepackage{tikz}\usetikzlibrary{calc,arrows.meta}
\usepackage{tkz-tab}
\setlength{\parindent}{0pt}\setlength{\parskip}{2pt}
\pagestyle{fancy}\fancyhf{}\renewcommand{\headrulewidth}{0pt}
\newcommand{\made}{}
\newcommand{\chantrang}{Mã đề \made}
\fancyfoot[C]{\small\textit{Trang \thepage/\pageref{het-\made} -- \chantrang}}
\newcolumntype{L}[1]{>{\raggedright\arraybackslash}p{#1}}
\newcolumntype{C}[1]{>{\centering\arraybackslash}p{#1}}
\newcommand{\cau}[1]{\par\smallskip\noindent\textbf{Câu #1.}~}
\newcommand{\bonPA}[4]{\par\noindent\begin{tabular}{@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}L{0.25\linewidth}@{}}\textbf{A.}~#1&\textbf{B.}~#2&\textbf{C.}~#3&\textbf{D.}~#4\end{tabular}\par}
\newcommand{\haiPA}[4]{\par\noindent\begin{tabular}{@{}L{0.5\linewidth}@{}L{0.5\linewidth}@{}}\textbf{A.}~#1&\textbf{B.}~#2\\[2pt] \textbf{C.}~#3&\textbf{D.}~#4\end{tabular}\par}
\newcommand{\motPA}[4]{\par\textbf{A.}~#1\par\textbf{B.}~#2\par\textbf{C.}~#3\par\textbf{D.}~#4\par}
\newcommand{\y}[2]{\par\hangindent=1.6em\hangafter=1\hspace*{0.8em}\textbf{#1)}~#2}
\newcommand{\dapso}[1]{\par\textbf{Đáp án:}~#1}
\newcommand{\loigiai}[1]{\par\smallskip{\small\textit{Lời giải.}~#1}\par}
`;
  }
  function headerTex(info, ma) {
    const so = tq(info.so), tr = tq(info.truong), ky = tq(info.ky), nh = tq(info.namHoc), mon = tq(info.monTen || "TOÁN"), lop = tq(info.lop);
    return String.raw`\renewcommand{\made}{${ma}}\renewcommand{\chantrang}{${ma === "GOC" ? "Đề gốc" : "Mã đề " + ma}}\setcounter{page}{1}
\noindent\begin{tabular}{@{}C{0.42\linewidth}@{}C{0.58\linewidth}@{}}
${so} & \textbf{${ky}}\\
\textbf{${tr}} & \textbf{NĂM HỌC ${nh}}\\[2pt]
${info.chinhThuc === false ? "" : "\\fbox{\\textbf{" + tq(info.loaiDe || "ĐỀ CHÍNH THỨC") + "}}"} & \textbf{Môn: ${mon}${lop ? " -- Lớp " + lop : ""}}\\
\textit{(Đề thi có \pageref{het-${ma}} trang)} & \textit{Thời gian làm bài: ${tq(info.phut)} phút, không kể thời gian phát đề}
\end{tabular}
\par\medskip
\noindent Họ, tên thí sinh: \makebox[7.2cm]{\dotfill}\par\smallskip
\noindent Số báo danh: \makebox[4.5cm]{\dotfill}\hfill\fbox{\textbf{${ma === "GOC" ? "ĐỀ GỐC" : "Mã đề thi: " + ma}}}
\par\medskip
`;
  }
  function qTex(item, n, opt) {
    const { q, order } = item; let s = `\\cau{${n}}${q.de}\n`;
    if (q.loai === "TN") {
      const cols = NHD.optCols(q.pa); const cmd = cols === 4 ? "bonPA" : cols === 2 ? "haiPA" : "motPA";
      s += `\\${cmd}` + order.map(j => `{${q.pa[j]}}`).join("") + "\n";
      if (opt.dapan) s += `\\dapso{${"ABCD"[order.indexOf(0)]}}\n`;
    } else if (q.loai === "DS") {
      s += order.map((j, i) => `\\y{${"abcd"[i]}}{${q.y[j].t}${opt.dapan ? ` \\textbf{(${q.y[j].d ? "Đúng" : "Sai"})}` : ""}}`).join("\n") + "\n";
    } else if (opt.dapan) s += `\\dapso{$${String(q.da).replace(/^\$|\$$/g, "").replace(/,/g, "{,}")}$}\n`;
    if (opt.loigiai && q.loigiai) s += `\\loigiai{${q.loigiai}}\n`;
    return opt.loigiai ? s : `\\par\\noindent\\begin{minipage}{\\linewidth}\\setlength{\\parskip}{2pt}\n${s}\\end{minipage}\\par\n`;
  }
  function versionTex(P, info, ma, opt = {}) {
    const T = partTitles(P);
    let s = headerTex(info, ma);
    LOAI.forEach(L => {
      if (!P[L].length) return;
      s += `\\par\\medskip\\noindent\\textbf{PHẦN ${T[L].so}. }${T[L].text}\n`;
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
  const doc = (info, body) => preamble(info) + "\\begin{document}\n" + body + "\\end{document}\n";

  /* ======================================================== HTML trang A4 */
  function headerHtml(info, ma, pagesRef) {
    return `<div class="hd"><div class="l">${esc(info.so)}<b>${esc(info.truong)}</b>${info.chinhThuc === false ? "" : `<span class="box">${esc(info.loaiDe || "ĐỀ CHÍNH THỨC")}</span><br>`}<i>(Đề thi có <span class="npages">${pagesRef || "…"}</span> trang)</i></div>
      <div class="r"><b>${esc(info.ky)}</b><b>NĂM HỌC ${esc(info.namHoc)}</b><b>Môn: ${esc(info.monTen || "TOÁN")}${info.lop ? " – Lớp " + esc(info.lop) : ""}</b><i>Thời gian làm bài: ${esc(info.phut)} phút, không kể thời gian phát đề</i></div></div>
      <div class="sv"><div>Họ, tên thí sinh: ……………………………………………………<br>Số báo danh: ……………………………</div><div class="made">${/^G/.test(ma) ? "ĐỀ GỐC" : "Mã đề thi: " + esc(ma)}</div></div>`;
  }
  /* các khối (khối = không bị cắt khi sang trang) của một mã đề */
  function versionBlocks(P, info, ma, opt = {}) {
    const T = partTitles(P); const B = [{ html: headerHtml(info, ma), head: true }];
    LOAI.forEach(L => {
      if (!P[L].length) return;
      B.push({ html: `<div class="ph"><b>PHẦN ${T[L].so}.</b> ${T[L].text}</div>`, keep: true });
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
  function paginate(blocks, footer) {
    const meas = document.createElement("div"); meas.className = "paper ex"; meas.style.cssText = "position:absolute;left:-30000px;top:0;visibility:hidden;min-height:0";
    document.body.appendChild(meas);
    const mm = 3.7795; const avail = (297 - 12 - 14) * mm - 26;
    const pages = []; let cur = null, used = 0;
    const newPage = () => { cur = document.createElement("div"); cur.className = "paper ex"; pages.push(cur); used = 0; };
    newPage();
    const els = blocks.map(b => { const d = document.createElement("div"); d.innerHTML = b.html; d.className = "blk"; meas.appendChild(d); return { d, h: d.getBoundingClientRect().height + 1, keep: b.keep }; });
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

  NHD.Out = { preamble, headerTex, versionTex, keysTex, doc, versionBlocks, keysBlocks, paginate, pagesToPdf, printPages, waitFonts, matrixTables, partTitles };
})(window);
