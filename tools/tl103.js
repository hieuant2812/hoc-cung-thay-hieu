/* tools/tl103.js — dựng data/thcs/tl103.json (bản đề, KHÔNG có hướng dẫn giải) từ thư mục tex của
   "Ngân hàng bài tập tự luận Toán THCS 103 dạng", và vẽ sẵn hình TikZ thành SVG trong data/decuong/hinh/.
   Chạy:  node tools/tl103.js <thư mục chứa các file D8-01.tex, H9-05.tex, TS-01.tex…>
   Hướng dẫn giải không đăng công khai: giáo viên nạp file zip ngân hàng ở trang Ra đề THCS (lưu trên máy). */
const fs = require("fs"), path = require("path"), vm = require("vm");
const goc = path.join(__dirname, "..");
const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ["assets/decuong-tex.js", "assets/thcs-bank.js", "assets/nhd/core.js"]) vm.runInContext(fs.readFileSync(path.join(goc, f), "utf8"), ctx, { filename: f });
const { ThcsBank, DeCuongTeX, NHD } = ctx;
const thuMuc = process.argv[2]; if (!thuMuc) { console.error("Cần đường dẫn thư mục tex"); process.exit(1); }
const out = {}; let soCau = 0, soY = 0; const muc = {};
for (const f of fs.readdirSync(thuMuc).filter(x => /\.tex$/.test(x)).sort()) {
  const d = ThcsBank.docTep103(f, fs.readFileSync(path.join(thuMuc, f), "utf8"));
  if (!d) { console.warn("Bỏ qua", f); continue; }
  d.cau.forEach(q => { if (q.hd && q.hd.length !== q.y.length) console.warn("Lệch số ý/hướng dẫn:", q.ma); soY += q.y.length; muc[q.muc] = (muc[q.muc] || 0) + 1; });
  soCau += d.cau.length; out[d.ma] = ThcsBank.banHS103(d);
}
// hình TikZ → SVG (mã băm giống DeCuongTeX nên bản nạp từ zip trên máy GV cũng dùng chung ảnh)
const dsP = path.join(goc, "data/decuong/hinh/ds.json"), ds = JSON.parse(fs.readFileSync(dsP, "utf8"));
let soHinh = 0;
// nhãn TikZ (trên web là <span> đặt chồng lên hình) → <text> trong SVG để ảnh đứng riêng vẫn có nhãn A, B, C…
const KH = { alpha: "α", beta: "β", gamma: "γ", varphi: "φ", theta: "θ", pi: "π", circ: "°", Delta: "Δ", cdot: "·", ell: "ℓ" };
function nhanSVG(span) {
  let out = ""; const re = /<span class="tikz-lbl" style="left:([\d.-]+)px;top:([\d.-]+)px;transform:translate\(([\d.-]+)%,([\d.-]+)%\);padding:([\d.]+)px;font-size:([\d.]+)em;[^"]*">([\s\S]*?)<\/span>/g; let m;
  while ((m = re.exec(span))) {
    const [, l, t, tx, ty, pd, fs, raw] = m; const ax = -tx / 100, ay = -ty / 100, p = +pd, px = 16 * fs;
    const x = +l + (ax === 0 ? p : ax === 1 ? -p : 0), y = +t + (ay === 0 ? p + px * .8 : ay === 1 ? -p - px * .2 : px * .35);
    const txt = raw.replace(/<[^>]+>/g, "").replace(/\\([A-Za-z]+)/g, (q, k) => KH[k] || k).replace(/\^\{?\\?circ\}?|\^°/g, "°").replace(/[{}$]/g, "");
    const parts = /\d/.test(txt) ? txt : txt.split(/(\s+)/).map(w => /^[A-Za-zα-ω](['’]?\d?)$/.test(w) ? `<tspan font-style="italic">${w}</tspan>` : w).join("");
    out += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Times New Roman,Times,serif" font-size="${px.toFixed(1)}" text-anchor="${ax === 0 ? "start" : ax === 1 ? "end" : "middle"}">${parts}</text>`;
  }
  return out;
}
for (const f of fs.readdirSync(thuMuc).filter(x => /\.tex$/.test(x))) {
  const s = fs.readFileSync(path.join(thuMuc, f), "utf8"); const re = /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g; let m;
  while ((m = re.exec(s))) {
    const code = m[0], h = DeCuongTeX.bam(code);
    const span = NHD.tikz(code.replace(/^\\begin\{tikzpicture\}/, "").replace(/\\end\{tikzpicture\}$/, ""));
    let svg = (/<svg[\s\S]*<\/svg>/.exec(span) || [])[0];
    if (svg) svg = svg.replace("</svg>", nhanSVG(span) + "</svg>");
    if (!svg) { console.warn("Không vẽ được hình trong", f); continue; }
    fs.writeFileSync(path.join(goc, "data/decuong/hinh", h + ".svg"), svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'));
    ds[h] = ".svg"; soHinh++;
  }
}
fs.writeFileSync(dsP, JSON.stringify(ds));
fs.writeFileSync(path.join(goc, "data/thcs/tl103.json"), JSON.stringify(out));
console.log(`${Object.keys(out).length} dạng, ${soCau} bài (${soY} ý), theo mức:`, muc, `· ${soHinh} hình`);
