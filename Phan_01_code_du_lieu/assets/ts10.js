/* ts10.js — Ngân hàng 50 đề ôn tuyển sinh 10 Toán TP.HCM (khung 7 bài của Sở).
   Bản học sinh (không lời giải): data/ts10/hs.json — đăng công khai.
   Bản giáo viên (lời giải, hướng dẫn chấm): file TS10_GV_LoiGiai.json thầy giữ trên máy, nạp một lần → lưu trong trình duyệt (IndexedDB).
   TS10.nap() → {dang, de:[{so, muc, bai:[{k, diem, dang, ma, de, tex, lg?, texLg?}]}]}  */
(function (G) {
  "use strict";
  const DB = "hcth-ts10", ST = "gv";
  const mo = () => new Promise((ok, loi) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error); });
  async function idb(cach, ...a) { const db = await mo(); return new Promise((ok, loi) => { const t = db.transaction(ST, cach === "get" ? "readonly" : "readwrite"); const s = t.objectStore(ST); const r = s[cach](...a); r.onsuccess = () => ok(r.result); r.onerror = () => loi(r.error); }); }
  let HS = null, GVD = undefined;
  const MUC = { lq: "Làm quen", sat: "Sát đề Sở", nc: "Nâng cao" };
  async function napHS() { if (!HS) HS = await (await fetch("data/ts10/hs.json", { cache: "no-cache" })).json(); return HS; }
  async function napGVD() { if (GVD === undefined) { try { GVD = (await idb("get", "gv")) || null; } catch (e) { GVD = null; } } return GVD; }
  async function nap() {
    const h = await napHS(), g = await napGVD();
    const lg = {}; if (g) g.de.forEach(d => d.bai.forEach(b => lg[b.ma] = b));
    return { dang: h.dang, coGV: !!g, de: h.de.map(d => ({ so: d.so, muc: d.muc, bai: d.bai.map(b => Object.assign({}, b, lg[b.ma] ? { lg: lg[b.ma].lg, texLg: lg[b.ma].tex } : {})) })) };
  }
  async function napFile(f) {
    const o = JSON.parse(await f.text());
    if (!o || o.loai !== "TS10-GV" || !Array.isArray(o.de)) throw new Error("File này không phải bản lời giải TS10 (TS10_GV_LoiGiai.json).");
    await idb("put", o, "gv"); GVD = o; return o.de.length;
  }
  async function xoa() { await idb("delete", "gv"); GVD = null; }
  const tenDang = (dang, ma) => { const ps = String(ma).split("/"); return ps.map(p => dang.dang[p] || p).join(" · "); };
  const nhomBai = ma => String(ma).slice(0, 2); // "B6-D2" → "B6"
  /* ghép một đề mới theo khung 7 bài: mỗi bài lấy ngẫu nhiên từ kho cùng vị trí, lọc theo mức */
  function ghep(D, muc, tranh) {
    tranh = tranh || new Set();
    const out = [];
    for (let k = 1; k <= 7; k++) {
      let ds = []; D.de.forEach(d => { if (muc && muc !== "all" && d.muc !== muc) return; d.bai.forEach(b => { if (b.k === k) ds.push(Object.assign({ so: d.so }, b)); }); });
      const chua = ds.filter(b => !tranh.has(b.ma)); if (chua.length) ds = chua;
      out.push(ds[Math.floor(Math.random() * ds.length)]);
    }
    return out;
  }
  /* TeX đầy đủ (dùng lại khung lệnh của bộ đề gốc) */
  function tex(tieuDe, bais, coLG) {
    const pre = `\\documentclass[12pt,a4paper]{article}
\\usepackage[top=1.5cm,bottom=1.5cm,left=2cm,right=1.5cm]{geometry}
\\usepackage{fontspec}\\setmainfont{TeX Gyre Termes}
\\usepackage{amsmath,amssymb,tikz,tasks}
\\setlength{\\parindent}{0pt}
\\newif\\ifloigiai \\loigiai${coLG ? "true" : "false"}   % \\loigiaifalse để in bản học sinh
\\newenvironment{bai}[4]{\\par\\medskip\\noindent\\textbf{Bài #1. (#2 điểm)}\\ }{\\par}
\\newcommand{\\y}[2]{\\par\\hspace*{1em}#1)~#2}
\\newcommand{\\loigiai}[1]{\\ifloigiai\\par\\smallskip\\noindent\\textit{Lời giải.} #1\\par\\fi}
\\newcommand{\\diem}[1]{\\ifloigiai\\hfill\\textbf{(#1đ)}\\fi}
\\begin{document}
\\begin{center}\\textbf{${tieuDe}}\\\\ Thời gian: 120 phút (không kể thời gian phát đề)\\end{center}
`;
    return pre + bais.map((b, i) => `\\begin{bai}{${i + 1}}{${b.diem}}{${b.dang}}{${b.ma}}\n${b.tex}\n${b.texLg ? `\\loigiai{\n${b.texLg}\n}` : ""}\n\\end{bai}\n`).join("\n") + "\n\\begin{center}--- HẾT ---\\end{center}\n\\end{document}\n";
  }
  G.TS10 = { nap, napFile, xoa, tenDang, nhomBai, ghep, tex, MUC };
})(window);
