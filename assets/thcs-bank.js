/* thcs-bank.js — đọc file ngân hàng bài tập Toán 6–9 (NH_<khối>H<kì>_C<chương>_B<bài>_D<dạng>.tex, môi trường cauhoi).
   ThcsBank.docTep(ten, tex) → { ma, khoi, hk, chuong, bai, dang, tenChuong, tenBai, tenDang, cau:[{ma, loai:"TL"|"TN", muc, de, lg?, pa?, da?}] }
   ThcsBank.banHS(dang) → bỏ lời giải, đáp án.   Cần DeCuongTeX (assets/decuong-tex.js) để đổi TeX → HTML. */
(function (G) {
  "use strict";
  const T = () => G.DeCuongTeX;
  function nhom(s, i) { let d = 0, j = i; while (j < s.length) { const c = s[j]; if (c === "\\") { j += 2; continue; } if (c === "{") d++; else if (c === "}") { d--; if (!d) return [s.slice(i + 1, j), j + 1]; } j++; } return [s.slice(i + 1), s.length]; }
  const sach = s => s.replace(/(^|[^\\])%[^\n]*/g, "$1");
  function lay(s, re) { const m = re.exec(s); return m ? nhom(s, m.index + m[0].length - 1)[0] : ""; }
  function docTep(ten, tex) {
    const s = sach(tex);
    const mm = /(\d)H(\d)[-_]C(\d+)[-_]B(\d+)[-_]D(\d+)/.exec(ten) || /(\d)H(\d)-C(\d+)-B(\d+)-D(\d+)/.exec(s);
    if (!mm || !/\\begin\{cauhoi\}/.test(s)) return null;
    const [, khoi, hk, chuong, bai, dang] = mm;
    const ds = [...s.matchAll(/\\textbf\{((?:Chương|Bài|Dạng)[^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)].map(x => x[1]);
    const tenChuong = (ds.find(x => /^Chương/.test(x)) || "").replace(/^Chương\s*\d+\.\s*/, "");
    const tenBai = (ds.find(x => /^Bài/.test(x)) || "").replace(/^Bài\s*\d+\.\s*/, "");
    let tenDang = (ds.find(x => /^Dạng/.test(x)) || ""); const nc = /^Dạng\s*D?\d+\s*\(([^)]*)\)/.exec(tenDang);
    tenDang = tenDang.replace(/^Dạng\s*D?\d+\s*(\([^)]*\))?\s*:\s*/, "").replace(/^Dạng\s*D?\d+\s*(\([^)]*\))?\s*[-–—]+\s*/, "") + (nc ? ` (${nc[1]})` : "");
    const cau = [];
    const re = /\\begin\{cauhoi\}\{([^}]*)\}\{([^}]*)\}/g; let m;
    while ((m = re.exec(s))) {
      const ma = (/^\d+H\d-C/.test(m[1].trim()) ? m[1] : m[2]).trim(), e = s.indexOf("\\end{cauhoi}", re.lastIndex);
      let body = s.slice(re.lastIndex, e < 0 ? s.length : e);
      const k = /-(TL|TN)-(NB|TH|VD|VDC)-(\d+)$/.exec(ma); if (!k) continue;
      const q = { ma, loai: k[1], muc: k[2], tex: {} };
      const li = body.search(/\\loigiai\{/);
      if (li >= 0) { const [g, j] = nhom(body, body.indexOf("{", li)); q.lg = T().html(g); q.tex.lg = g.trim(); body = body.slice(0, li) + body.slice(j); }
      const da = body.search(/\\dapan\{/);
      if (da >= 0) { const [g, j] = nhom(body, body.indexOf("{", da)); q.da = "ABCD".indexOf(g.trim()[0]); body = body.slice(0, da) + body.slice(j); }
      if (q.loai === "TN") {
        const a = body.indexOf("\\begin{tasks}"), b = body.indexOf("\\end{tasks}");
        if (a >= 0 && b > a) {
          const inner = body.slice(a, b).replace(/^\\begin\{tasks\}(\(\d+\))?/, "");
          const raw = inner.split(/\\task(?![A-Za-z])/).slice(1).map(x => x.trim());
          q.pa = raw.map(x => T().html(x).replace(/\.$/, "")); q.tex.pa = raw;
          body = body.slice(0, a) + body.slice(b + 11);
        }
        if (!q.pa || q.pa.length !== 4 || !(q.da >= 0)) continue;
      }
      q.de = T().html(body.trim()); q.tex.de = body.trim();
      cau.push(q);
    }
    const sach2 = x => x.replace(/---?/g, "–").replace(/\\([%&#])/g, "$1").replace(/\\[a-zA-Z]+\s*/g, "").replace(/[{}]/g, "").trim();
    tenDang = sach2(tenDang);
    return { ma: `${khoi}H${hk}-C${chuong}-B${bai}-D${dang.padStart(2, "0")}`, khoi, hk, chuong, bai, dang: "D" + dang.padStart(2, "0"), tenChuong: sach2(tenChuong), tenBai: sach2(tenBai), tenDang, cau };
  }
  /* ---- Ngân hàng tự luận 103 dạng (Toán 8, 9, ôn thi vào 10): file <Mã dạng>.tex, \dang{Mã}{Tên}, \bai[Mức -- tên] + enumerate + huongdan ----
     Mỗi "bài" của ngân hàng là một câu tự luận có nhiều ý a), b), c)… (mặc định 5 ý). Mức: Cơ bản → NB, Thông hiểu → TH, Vận dụng → VD, Vận dụng cao → VDC.
     Dạng được xếp vào chương SGK (Kết nối tri thức) theo bảng CH103; dạng tổng hợp liên môn và ôn thi vào 10 có chương riêng. */
  const C7 = { 1: ["Số hữu tỉ", "1"], 2: ["Số thực", "1"], 3: ["Góc và đường thẳng song song", "1"], 4: ["Tam giác bằng nhau", "1"], 5: ["Thu thập và biểu diễn dữ liệu", "1"], 6: ["Tỉ lệ thức và đại lượng tỉ lệ", "2"], 7: ["Biểu thức đại số và đa thức một biến", "2"], 8: ["Làm quen với biến cố và xác suất của biến cố", "2"], 9: ["Quan hệ giữa các yếu tố trong một tam giác", "2"], 10: ["Một số hình khối trong thực tiễn", "2"] };
  const C8 = { 1: ["Đa thức", "1"], 2: ["Hằng đẳng thức đáng nhớ và ứng dụng", "1"], 3: ["Tứ giác", "1"], 4: ["Định lí Thalès", "1"], 5: ["Dữ liệu và biểu đồ", "1"], 6: ["Phân thức đại số", "2"], 7: ["Phương trình bậc nhất và hàm số bậc nhất", "2"], 8: ["Mở đầu về tính xác suất của biến cố", "2"], 9: ["Tam giác đồng dạng", "2"], 10: ["Một số hình khối trong thực tiễn", "2"], 11: ["Toán thực tế – liên môn (tổng hợp)", ""] };
  const C9 = { 1: ["Phương trình và hệ hai phương trình bậc nhất hai ẩn", "1"], 2: ["Phương trình và bất phương trình bậc nhất một ẩn", "1"], 3: ["Căn bậc hai và căn bậc ba", "1"], 4: ["Hệ thức lượng trong tam giác vuông", "1"], 5: ["Đường tròn", "1"], 6: ["Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn", "2"], 7: ["Tần số và tần số tương đối", "2"], 8: ["Xác suất của biến cố trong một số mô hình xác suất đơn giản", "2"], 9: ["Đường tròn ngoại tiếp và đường tròn nội tiếp", "2"], 10: ["Một số hình khối trong thực tiễn", "2"], 11: ["Toán thực tế – liên môn (tổng hợp)", ""], 12: ["Ôn thi tuyển sinh vào lớp 10", ""] };
  const CH103 = {
    "Đ7": [0, 1, 1, 1, 1, 1, 2, 2, 6, 6, 7, 7, 7], "H7": [0, 3, 3, 3, 4, 4, 4, 4, 4, 9, 9, 10], "T7": [0, 5, 8],
    "Đ8": [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7], "H8": [0, 3, 3, 3, 3, 3, 3, 4, 4, 4, 9, 9, 9, 9, 10, 9], "T8": [0, 5, 5, 5, 8, 8], "TT8": [0, 1, 6, 7, 11, 9],
    "Đ9": [0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6], "H9": [0, 4, 4, 5, 5, 5, 9, 5, 9, 9, 9, 10, 10, 10, 10, 9], "T9": [0, 7, 7, 7, 8, 8], "TT9": [0, 4, 6, 6, 11, 2], "TS": null
  };
  /* dạng → bài SGK (KNTT) để trang Tài liệu hiện bài tập 103 dạng ngay dưới bài học tương ứng; TS-xx hiện ở mục "Ôn thi vào 10" của Toán 9 */
  const BAI103 = {
    "Đ7-01": [1], "Đ7-02": [2], "Đ7-03": [2, 4], "Đ7-04": [3], "Đ7-05": [4], "Đ7-06": [5, 6], "Đ7-07": [7], "H7-01": [8], "H7-02": [9, 10], "H7-03": [11], "H7-04": [12], "H7-05": [13], "H7-06": [14], "H7-07": [15], "H7-08": [16], "Đ7-08": [20, 21], "Đ7-09": [22, 23], "Đ7-10": [24], "Đ7-11": [25, 26], "Đ7-12": [27, 28], "T7-01": [17, 18, 19], "T7-02": [29, 30], "H7-09": [31, 32, 33], "H7-10": [34, 35], "H7-11": [36, 37],
    "Đ8-01": [1, 2], "Đ8-02": [3], "Đ8-03": [4], "Đ8-04": [5], "Đ8-05": [6], "Đ8-06": [7, 8], "Đ8-07": [9], "Đ8-08": [9], "Đ8-09": [6], "Đ8-10": [9], "Đ8-11": [21], "Đ8-12": [22], "Đ8-13": [23], "Đ8-14": [24], "Đ8-15": [24], "Đ8-16": [25], "Đ8-17": [26], "Đ8-18": [26], "Đ8-19": [26], "Đ8-20": [27], "Đ8-21": [28], "Đ8-22": [29],
    "H8-01": [10], "H8-02": [11], "H8-03": [12], "H8-04": [13], "H8-05": [14], "H8-06": [14], "H8-07": [15], "H8-08": [16], "H8-09": [17], "H8-10": [33], "H8-11": [34], "H8-12": [36], "H8-13": [37], "H8-14": [38, 39], "H8-15": [35],
    "T8-01": [18], "T8-02": [19], "T8-03": [20], "T8-04": [30], "T8-05": [31], "TT8-01": [2], "TT8-02": [24], "TT8-03": [28], "TT8-04": [26], "TT8-05": [15, 37],
    "Đ9-01": [1], "Đ9-02": [2], "Đ9-03": [3], "Đ9-04": [3], "Đ9-05": [4], "Đ9-06": [5], "Đ9-07": [6], "Đ9-08": [7], "Đ9-09": [8, 9], "Đ9-10": [9], "Đ9-11": [9], "Đ9-12": [10], "Đ9-13": [18], "Đ9-14": [18], "Đ9-15": [19], "Đ9-16": [20], "Đ9-17": [21],
    "H9-01": [11], "H9-02": [12], "H9-03": [13, 14], "H9-04": [16], "H9-05": [16], "H9-06": [14, 27], "H9-07": [15], "H9-08": [28], "H9-09": [29], "H9-10": [30], "H9-11": [31], "H9-12": [31], "H9-13": [32], "H9-14": [31, 32], "H9-15": [29],
    "T9-01": [22], "T9-02": [23], "T9-03": [24], "T9-04": [25], "T9-05": [26], "TT9-01": [12], "TT9-02": [3, 21], "TT9-03": [18], "TT9-04": [21], "TT9-05": [6]
  };
  const MUC103 = s => /^Cơ bản/i.test(s) ? "NB" : /^Thông hiểu/i.test(s) ? "TH" : /^Vận dụng cao/i.test(s) ? "VDC" : /^Vận dụng/i.test(s) ? "VD" : "";
  function khoi103(ma) { // "Đ8-05" → {khoi:"8", chuong:"2"}
    const m = /^(Đ|D|H|T|TT)([6-9])-(\d+)$/.exec(ma) || /^(TS)-(\d+)$/.exec(ma); if (!m) return null;
    if (m[1] === "TS") return { khoi: "9", chuong: "12" };
    const ch = (CH103[(m[1] === "D" ? "Đ" : m[1]) + m[2]] || [])[+m[3]]; return ch ? { khoi: m[2], chuong: String(ch) } : null;
  }
  function moiTruong1(s, ten, tu) { // vị trí \begin{ten}…\end{ten} đầu tiên (có lồng nhau) từ vị trí tu
    const b = "\\begin{" + ten + "}", e = "\\end{" + ten + "}"; const a = s.indexOf(b, tu || 0); if (a < 0) return null;
    let j = a + b.length, d = 1;
    while (d) { const nb = s.indexOf(b, j), ne = s.indexOf(e, j); if (ne < 0) return null; if (nb >= 0 && nb < ne) { d++; j = nb + b.length; } else { d--; j = ne + e.length; } }
    let k = a + b.length; if (s[k] === "[") k = s.indexOf("]", k) + 1;
    return { a, e: j, trong: s.slice(k, j - e.length) };
  }
  function tachItem(s) { // tách \item ở cấp ngoài cùng (bỏ qua \item trong môi trường lồng và trong ngoặc {})
    const out = []; let d = 0, env = 0, cur = null;
    for (let i = 0; i < s.length; i++) {
      if (s.startsWith("\\begin{", i)) env++; else if (s.startsWith("\\end{", i)) env--;
      const c = s[i];
      if (c === "\\" && !d && !env && /^\\item(?![A-Za-z])/.test(s.slice(i, i + 6))) { if (cur !== null) out.push(cur); cur = ""; i += 4; continue; }
      if (c === "\\") { if (cur !== null) cur += s.slice(i, i + 2); i++; continue; }
      if (c === "{") d++; else if (c === "}") d--;
      if (cur !== null) cur += c;
    }
    if (cur !== null) out.push(cur);
    return out.map(x => x.trim());
  }
  function chuanTex(s) { // macro riêng của ngân hàng 103 dạng → TeX thường; gạch nối -- → –
    let out = "", i = 0;
    for (;;) { const k = s.indexOf("\\dapso{", i); if (k < 0) { out += s.slice(i); break; } const [g, j] = nhom(s, k + 6); out += s.slice(i, k) + "\\textbf{Đáp số:} " + g; i = j; }
    out = out.replace(/\\hs(?![A-Za-z])/g, "");
    // gạch nối ngoài TikZ
    return out.split(/(\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\})/).map((p, i) => i % 2 ? p : p.replace(/---/g, "—").replace(/--/g, "–")).join("");
  }
  const CHUOI = /(câu|ý)\s*[a-e]\)?(?![A-Za-zÀ-ỹ])|ở trên|trên đây|khi đó|kết quả|vừa (tìm|tính|lập|vẽ)|tương ứng|mỗi trường hợp|kiểm tra|từ đó|suy ra|với giá trị|nghiệm đó|đã tìm|đã tính|so sánh|hai (cách|kết quả)/i;
  function docTep103(ten, tex) {
    const s = sach(tex); const dm = /\\dang\{([^}]*)\}\{/.exec(s); if (!dm) return null;
    const ma = dm[1].trim().replace(/^D(?=\d)/, "Đ"), vt = khoi103(ma); if (!vt) return null;
    const tenDang = nhom(s, dm.index + dm[0].length - 1)[0].replace(/---?/g, "–").replace(/\\sqrt\{([^{}]*)\^2\}/g, "√($1²)").replace(/\^2/g, "²").replace(/\$/g, "").replace(/\\[a-zA-Z]+\s*/g, "").replace(/[{}]/g, "").trim();
    const bang = { 7: C7, 8: C8, 9: C9 }[vt.khoi], [tenChuong, hk] = bang[vt.chuong];
    const cau = []; let i = 0, n = 0;
    for (;;) {
      const a = s.indexOf("\\bai[", i); if (a < 0) break;
      let d = 0, k = a + 4; for (; k < s.length; k++) { const c = s[k]; if (c === "{") d++; else if (c === "}") d--; else if (c === "]" && !d) break; }
      const nhan = s.slice(a + 5, k).replace(/^\{|\}$/g, "").trim();
      const sau = s.indexOf("\\bai[", k), body = s.slice(k + 1, sau < 0 ? s.length : sau); i = sau < 0 ? s.length : sau;
      const en = moiTruong1(body, "enumerate"), hd = moiTruong1(body, "huongdan"); n++;
      const muc = MUC103(nhan); if (!en || !muc) continue;
      const dan = chuanTex(body.slice(0, en.a).trim()), y = tachItem(en.trong).map(chuanTex), g = hd ? tachItem(hd.trong).map(chuanTex) : [];
      const q = { ma: `${ma}-TL-${muc}-${String(n).padStart(3, "0")}`, loai: "TL", muc, ten: T().html(nhan.replace(/^[^–-]*(--|–)\s*/, "").replace(/^(Cơ bản|Thông hiểu|Vận dụng cao|Vận dụng)$/i, "")), dan: T().html(dan), y: y.map(x => T().html(x)), tex: { dan, y } };
      if (g.length) { q.hd = g.map(x => T().html(x)); q.tex.hd = g; }
      if (dan.replace(/\s+/g, "") || y.some(x => CHUOI.test(x))) q.chuoi = 1;
      cau.push(q);
    }
    return { ma, nguon: "tl103", khoi: vt.khoi, hk, chuong: vt.chuong, bai: ma, dang: ma, tenChuong, tenBai: tenDang, tenDang, cau };
  }
  /* câu cụ thể từ một bài nhiều ý: lấy k ý (bài chuỗi ý: k ý đầu; bài các ý độc lập: k ý ngẫu nhiên, giữ thứ tự) */
  function cuThe(q, k) {
    if (!q.y) return q;
    const n = q.y.length; k = !k || k >= n ? n : k;
    let chon = [...Array(n).keys()];
    if (k < n) { if (q.chuoi) chon = chon.slice(0, k); else { for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [chon[i], chon[j]] = [chon[j], chon[i]]; } chon = chon.slice(0, k).sort((a, b) => a - b); } }
    const nh = i => "abcdefgh"[i] + ")";
    const mot = chon.length === 1;
    const de = (q.dan ? q.dan + (mot ? " " : "<br>") : "") + chon.map((j, i) => (mot ? "" : nh(i) + " ") + q.y[j]).join("<br>");
    const lg = q.hd ? chon.map((j, i) => (mot ? "" : `<b>${nh(i)}</b> `) + (q.hd[j] || "")).join("<br>") : "";
    const tde = (q.tex.dan ? q.tex.dan + "\n" : "") + (mot ? q.tex.y[chon[0]] : "\\begin{enumerate}[label=\\alph*)]\n" + chon.map(j => "\\item " + q.tex.y[j]).join("\n") + "\n\\end{enumerate}");
    const tlg = q.tex.hd ? (mot ? q.tex.hd[chon[0]] : "\\begin{enumerate}[label=\\alph*)]\n" + chon.map(j => "\\item " + (q.tex.hd[j] || "")).join("\n") + "\n\\end{enumerate}") : "";
    return { ma: q.ma, loai: "TL", muc: q.muc, de, lg, tex: { de: tde, lg: tlg }, goc: q, y: chon };
  }
  const banHS103 = d => Object.assign({}, d, { cau: d.cau.map(q => { const x = Object.assign({}, q, { tex: { dan: q.tex.dan, y: q.tex.y } }); delete x.hd; return x; }) });

  /* ---- kho ngân hàng trên máy giáo viên (IndexedDB) ---- */
  const DBN = "hcth-thcs";
  const moDB = () => new Promise((ok, loi) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => r.result.createObjectStore("dang"); r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error); });
  async function luu(ds) { const db = await moDB(); return new Promise((ok, loi) => { const tx = db.transaction("dang", "readwrite"); const s = tx.objectStore("dang"); ds.forEach(d => s.put(d, d.ma)); tx.oncomplete = () => ok(ds.length); tx.onerror = () => loi(tx.error); }); }
  async function tatCa(khoi) { const db = await moDB(); return new Promise(ok => { const out = {}; db.transaction("dang").objectStore("dang").openCursor().onsuccess = e => { const c = e.target.result; if (c) { if (!khoi || c.value.khoi === String(khoi)) out[c.key] = c.value; c.continue(); } else ok(out); }; }); }
  async function demKho() { const db = await moDB(); return new Promise(ok => { const r = db.transaction("dang").objectStore("dang").count(); r.onsuccess = () => ok(r.result); r.onerror = () => ok(0); }); }
  async function xoaKho() { const db = await moDB(); return new Promise(ok => { const tx = db.transaction("dang", "readwrite"); tx.objectStore("dang").clear(); tx.oncomplete = ok; }); }
  /* nạp file: .tex lẻ, .zip (đọc mọi NH_*.tex), hoặc .json (đã tách) */
  async function napFile(files, onTien) {
    const ds = []; let n = 0;
    const them = (ten, tex) => { const d = docTep(ten, tex) || docTep103(ten, tex); if (d && d.cau.length) ds.push(d); };
    for (const f of files) {
      if (/\.zip$/i.test(f.name)) {
        const z = await JSZip.loadAsync(f); const ps = Object.keys(z.files).filter(p => /\.tex$/i.test(p) && !/__MACOSX/.test(p) && (/\dH\d[_-]C\d+[_-]B\d+[_-]D\d+/.test(p) || /(^|\/)(D|Đ|H|T|TT)[6-9]-\d+\.tex$|(^|\/)TS-\d+\.tex$/i.test(p)));
        for (const p of ps) { them(p.split("/").pop(), await z.files[p].async("string")); if (onTien && ++n % 10 === 0) onTien(n, ps.length); }
      } else if (/\.tex$/i.test(f.name)) them(f.name, await f.text());
    }
    await luu(ds); return ds;
  }
  const banHS = d => Object.assign({}, d, { cau: d.cau.map(q => q.loai === "TN" ? { ma: q.ma, loai: q.loai, muc: q.muc, de: q.de, pa: q.pa } : { ma: q.ma, loai: q.loai, muc: q.muc, de: q.de }) });
  G.ThcsBank = { docTep, docTep103, cuThe, BAI103, banHS103, CHUONG103: { 7: C7, 8: C8, 9: C9 }, banHS, luu, tatCa, demKho, xoaKho, napFile };
})(typeof window !== "undefined" ? window : globalThis);
