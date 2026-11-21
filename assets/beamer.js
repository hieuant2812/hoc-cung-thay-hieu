/* beamer.js — soạn bản trình chiếu Beamer (LaTeX) cho cả bài học, bám sát kế hoạch bài dạy.
   Nguồn nội dung (theo thứ tự ưu tiên):
     1. Kế hoạch bài dạy của thầy (data/khbdgoc.js — trích từ các file Word): từng tiết, từng hoạt động, đủ 4 bước
        Chuyển giao nhiệm vụ → Thực hiện nhiệm vụ → Báo cáo, thảo luận → Kết luận, nhận định.
     2. Dữ liệu bài học theo SGK (data/baihoc/*.js): các mục kiến thức, ví dụ có lời giải từng bước, bài toán thực tiễn.
     3. Hình vẽ minh hoạ (data/hinhve-bai.js, vẽ bằng assets/hinhve.js) và câu luyện tập lấy từ ngân hàng đề.
   Mỗi slide được dựng thành một "khung trừu tượng" rồi xuất ra 2 dạng: LaTeX Beamer và HTML xem trước. */
(function (G) {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ================================================================ chữ & công thức */
  const LENH = new Set(("vec left right overrightarrow dfrac sqrt frac cdot alpha approx Delta cos circ le to pi int Leftrightarrow sin Rightarrow infty ge " +
    "overline ne Omega in pm bar log lim perp limits cap tan sum cup sigma setminus times widehat mathbb subset begin end varphi parallel dots cot forall " +
    "varnothing ln phi mid notin delta text beta max exists equiv mp min ell not ldots omega sim emptyset mathcal mapsto gamma theta lambda mu rho tau " +
    "leq geq neq cases array matrix quad qquad displaystyle tfrac binom mathrm operatorname underset overset xrightarrow Leftarrow leftarrow iff implies " +
    "prime cdots vdots hat dot ddot tilde widetilde underbrace overbrace angle triangle Sigma Pi Gamma Theta Lambda Phi Psi psi chi eta zeta xi kappa nu " +
    "epsilon varepsilon subseteq supset supseteq nsubseteq rightarrow longrightarrow uparrow downarrow Big big bigg Bigg mathbf boldsymbol lfloor rfloor " +
    "lceil rceil langle rangle backslash prod iint oint partial nabla ast star bullet circledast lvert rvert lVert rVert vert Vert colon dagger").split(" "));
  const UNI = { "⇒": "\\Rightarrow", "⇔": "\\Leftrightarrow", "⟹": "\\Rightarrow", "⟺": "\\Leftrightarrow", "→": "\\to", "≤": "\\le", "≥": "\\ge", "≠": "\\ne",
    "∈": "\\in", "∉": "\\notin", "⊂": "\\subset", "∩": "\\cap", "∪": "\\cup", "∅": "\\varnothing", "∞": "\\infty", "π": "\\pi", "α": "\\alpha", "β": "\\beta",
    "Δ": "\\Delta", "δ": "\\delta", "°": "^\\circ", "×": "\\times", "≈": "\\approx", "±": "\\pm", "√": "\\surd", "∀": "\\forall", "∃": "\\exists", "⊥": "\\perp",
    "∥": "\\parallel", "φ": "\\varphi", "θ": "\\theta", "λ": "\\lambda", "σ": "\\sigma", "μ": "\\mu", "Ω": "\\Omega", "ω": "\\omega", "−": "-", "⋅": "\\cdot", "·": "\\cdot",
    "ℝ": "\\mathbb{R}", "ℕ": "\\mathbb{N}", "ℤ": "\\mathbb{Z}", "ℚ": "\\mathbb{Q}", "∖": "\\setminus", "⊆": "\\subseteq", "∠": "\\angle", "△": "\\triangle", "ε": "\\varepsilon", "γ": "\\gamma", "∘": "\\circ" };
  function mathOK(m) {
    if (/`/.test(m) || /[\^_\\]\s*$/.test(m) || /\.\.\.$/.test(m)) return false;
    // \frac, \dfrac, \tfrac, \binom cần đủ 2 cặp ngoặc
    const re = /\\(d|t)?frac|\\binom/g; let mm;
    while ((mm = re.exec(m))) {
      let i = re.lastIndex, nhom = 0;
      for (let k = 0; k < 2; k++) {
        while (m[i] === " ") i++;
        if (m[i] !== "{") { if (/[0-9a-zA-Z]/.test(m[i] || "")) { i++; nhom++; continue; } break; }
        let dd = 0;
        for (; i < m.length; i++) { if (m[i] === "{") dd++; else if (m[i] === "}") { dd--; if (dd === 0) { i++; break; } } }
        nhom++;
      }
      if (nhom < 2) return false;
    }
    if (/\\sqrt(?![\s{\[0-9a-zA-Z\\])/.test(m)) return false;
    if (/&/.test(m) && !/\\begin\{(cases|array|matrix)/.test(m)) return false;
    let d = 0;
    for (const c of m.replace(/\\[{}]/g, "")) { if (c === "{") d++; else if (c === "}") { d--; if (d < 0) return false; } }
    if (d !== 0) return false;
    if (/[À-ỹĐđ]/.test(m.replace(/\\text\{[^}]*\}/g, ""))) return false;
    const cmds = m.match(/\\[a-zA-Z]+/g) || [];
    if (cmds.some(c => !LENH.has(c.slice(1)))) return false;
    if (/\\begin\{(?!cases|array|matrix)/.test(m)) return false;
    if (/\\left(?![(\[|.{\\])/.test(m) || (m.match(/\\left/g) || []).length !== (m.match(/\\right/g) || []).length) return false;
    return true;
  }
  /* chữ thường -> LaTeX (thoát kí tự đặc biệt ngoài $...$, công thức hỏng thì in như chữ) */
  function tex(s) {
    s = String(s == null ? "" : s).replace(/\\\(([\s\S]*?)\\\)/g, (a, b) => "$" + b + "$").replace(/\\\[([\s\S]*?)\\\]/g, (a, b) => "$" + b + "$");
    const kq = tex0(s);
    return /^\s*\[/.test(kq) ? "{}" + kq : kq;
  }
  function tex0(s) {
    const parts = s.split(/(\$[^$]*\$)/);
    return parts.map(p => {
      if (p.length > 1 && p[0] === "$" && p[p.length - 1] === "$") {
        let m = p.slice(1, -1).replace(/[\u2000-\u200b\u00a0]/g, " ").trim().replace(/\\\\(?=[a-zA-Z])/g, "\\").replace(/(^|[^\\])%/g, "$1\\%").replace(/(^|[^\\])#/g, "$1\\#");
        if (!m) return "";
        m = m.replace(/[⇒⇔⟹⟺→≤≥≠∈∉⊂∩∪∅∞παβΔδ°×≈±∀∃⊥∥φθλσμΩω−⋅·ℝℕℤℚ∖⊆∠△εγ∘]/g, c => (UNI[c] ? UNI[c] + " " : c));
        if (!mathOK(m)) { const m2 = bocChu(m); if (m2 !== m && mathOK(m2)) m = m2; }   // chữ Việt trong công thức → \text{…}
        return mathOK(m) ? "$" + m + "$" : thuong(m.replace(/\\[a-zA-Z]+/g, x => x.slice(1) + " ").replace(/[{}^_]/g, ""));
      }
      return thuong(p.replace(/\$/g, ""));
    }).join("");
  }
  /* bọc chữ tiếng Việt lẫn trong công thức vào \text{…}: "\right)và\left(" → "\right)\text{ và }\left(", "y_{CĐ}" → "y_{\text{CĐ}}" */
  function bocChu(m) {
    if (/\\text\{/.test(m)) return m;
    return m.replace(/(?<!\\[a-zA-Z]*)[A-Za-zÀ-ỹĐđ]*[À-ỹĐđ][A-Za-zÀ-ỹĐđ]*/g, w => /^[a-zà-ỹđ]{2,}$/.test(w) ? "\\text{ " + w + " }" : "\\text{" + w + "}");
  }
  function thuong(p) {
    let out = "";
    for (const c of p) {
      if (UNI[c]) { out += "$" + UNI[c] + "$"; continue; }
      if (c === "%" || c === "&" || c === "#" || c === "_" || c === "{" || c === "}") out += "\\" + c;
      else if (c === "\\") out += "\\textbackslash{}";
      else if (c === "~") out += "\\textasciitilde{}";
      else if (c === "^") out += "\\textasciicircum{}";
      else if (c === "\n" || /[\u2000-\u200b\u00a0]/.test(c)) out += " ";
      else if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(c)) out += "";
      else out += c;
    }
    return out;
  }
  /* câu chữ của KHBD -> lời trên slide dành cho học sinh */
  function choHS(s) {
    s = String(s || "").trim();
    s = s.replace(/^(Giáo viên|GV)\s+(yêu cầu|giao nhiệm vụ cho|hướng dẫn|cho|đề nghị|tổ chức cho|mời)\s+(học sinh|HS|các nhóm|nhóm|cả lớp)\s*/i, "")
      .replace(/^(Yêu cầu|Hướng dẫn|Cho)\s+(học sinh|HS|các nhóm|nhóm)\s*/i, "")
      .replace(/^(Học sinh|HS|Các nhóm|Mỗi nhóm|Cả lớp)\s+/i, "")
      .replace(/\b(học sinh|HS)\b/g, "các em").replace(/\b(Giáo viên|giáo viên|GV)\b/g, "thầy cô");
    return s ? s[0].toUpperCase() + s.slice(1) : s;
  }
  /* tách đoạn văn thành các ý */
  function y(s, cho) {
    const ds = String(s || "").split(/\n+/).map(t => t.replace(/^\s*[-•+▪◦*]\s*/, "").trim()).filter(t => t && !/^-?\s*Như trên\.?$/i.test(t) && t !== "." && !/`/.test(t));
    return ds.filter(t => !(/(\.\.\.|…)$/.test(t) && ds.some(u => u !== t && u.startsWith(t.replace(/(\.\.\.|…)$/, "").slice(0, 25)))))
      .map(t => cho ? choHS(t) : t);
  }
  const loaiBo = t => /^(Theo dõi|Quan sát|Gọi |Mời |Lắng nghe|Lớp nhận xét|Cả lớp lắng nghe|Ghi nhận|Ghi chép|Hỗ trợ|Đi quanh|Nhắc nhở|Khen|Yêu cầu các nhóm khác|Nhận xét,? đánh giá|Học sinh xác định được yêu cầu)/i.test(t);
  const doiTrung = arr => { const s = new Set(); return arr.filter(t => { const k = t.replace(/\s+/g, " ").toLowerCase(); if (s.has(k)) return false; s.add(k); return true; }); };

  /* ================================================================ dựng mô hình bài học */
  const SAC = { md: "phanngoc", ht: "phanvang", lt: "phanluc", vd: "phancam", hdvn: "phantim" };
  const TEN_LOAI = { md: "Mở đầu", ht: "Hình thành kiến thức", lt: "Luyện tập", vd: "Vận dụng", hdvn: "Hướng dẫn về nhà" };
  const BUOC = ["", "Chuyển giao nhiệm vụ", "Thực hiện nhiệm vụ", "Báo cáo, thảo luận", "Kết luận, nhận định"];
  const SAC_BUOC = ["", "phanngoc", "phanvang", "phancam", "phanluc"];

  function tuKHBD(K) {
    return K.tiet.map(t => ({
      so: t.so, ppct: t.ppct, ten: t.ten, vn: t.vn,
      hd: t.hd.filter(h => h.loai !== "hdvn" || (h.b && h.b.length)).map(h => {
        const b = n => (h.b || []).find(x => x.n === n) || {};
        const nv = doiTrung([...y(h.nd, true), ...y(b(1).gv, true).filter(t => !loaiBo(t))]);
        const lam = doiTrung([...y(b(2).hs, true), ...y(b(1).hs, true).filter(t => /\$|ví dụ|tính|tìm|vẽ|lập|giải/i.test(t))]);
        const goiy = doiTrung(y(b(2).gv, true).filter(t => !loaiBo(t)));
        const bc = doiTrung([...y(b(3).sp), ...y(b(3).hs, true).filter(t => /\$|=/.test(t) || !/^(Lắng nghe|Ghi chép|Lớp nhận xét|Cả lớp|Giơ tay|Nhận xét|Đại diện|Các nhóm khác|Theo dõi|Quan sát)/i.test(t)), ...y(b(3).gv, true).filter(t => /\$|ví dụ|=|kết quả|đáp/i.test(t) && !loaiBo(t)), ...y(b(2).sp)])
          .filter(t => !/^(Học sinh phát biểu|Các em phát biểu|Bài trình bày|Kết quả báo cáo)/i.test(t));
        const chot = doiTrung([...y(b(4).gv, true).filter(t => !loaiBo(t)), ...y(b(4).sp), ...y(b(1).sp), ...y(h.sp)])
          .filter(t => !/^(Học sinh|Các em) (ghi|lắng)/i.test(t));
        return { loai: h.loai, so: h.so, ten: h.ten, phut: h.phut, mt: h.mt, nv, lam, goiy, bc, chot };
      })
    })).filter(t => t.hd.length);
  }

  function tuBaiHoc(B, o) {
    const hd = [];
    if (B.tt) hd.push({ loai: "md", so: "1", ten: "Mở đầu – Tình huống xuất phát", phut: 5,
      mt: "Tạo nhu cầu tìm hiểu kiến thức mới từ một bài toán thực tế.",
      nv: ["Đọc tình huống: " + B.tt.d, "Theo em, cần kiến thức gì để giải quyết bài toán trên?"], lam: ["Thảo luận cặp đôi, nêu dự đoán và hướng giải quyết."], goiy: [],
      bc: ["Các nhóm nêu dự đoán; cả lớp nhận xét."], chot: ["Để giải quyết trọn vẹn tình huống, ta cần nội dung của bài học hôm nay."] });
    (B.md || []).forEach((m, i) => hd.push({ loai: "ht", so: "2." + (i + 1), ten: "Hình thành kiến thức – " + m.t, phut: null,
      mt: "Nắm được: " + m.t + ".",
      nv: [`Đọc SGK mục ${i + 1}: ${m.t}.`, ...(m.kp ? ["Khám phá: " + m.kp] : []), ...(m.vd ? ["Ví dụ " + (i + 1) + ". " + m.vd.d] : [])],
      lam: [...(m.kp ? ["Thảo luận cặp đôi, trả lời câu hỏi khám phá."] : []), "Đọc SGK, rút ra kiến thức trọng tâm của mục.", ...(m.vd ? ["Vận dụng kiến thức giải Ví dụ " + (i + 1) + "."] : [])],
      goiy: m.vd && m.vd.g && m.vd.g[0] ? ["Bắt đầu từ: " + m.vd.g[0]] : [],
      bc: [...(m.kpd ? ["Khám phá:", m.kpd] : []), ...(m.vd ? ["Lời giải Ví dụ " + (i + 1) + ":", ...(m.vd.g || [])] : [])],
      chot: m.y || [], lt: m.lt }));
    hd.push({ loai: "lt", so: "3", ten: "Luyện tập", phut: 15, mt: "Vận dụng kiến thức vừa học để giải bài tập.",
      nv: ["Làm các bài tập luyện tập trên màn chiếu" + (B.bt ? " và " + B.bt : ".")], lam: ["Làm việc cá nhân, sau đó trao đổi kết quả với bạn bên cạnh."], goiy: [], bc: [], chot: [] });
    if (B.tt) hd.push({ loai: "vd", so: "4", ten: "Vận dụng – Giải quyết tình huống mở đầu", phut: 10, mt: "Vận dụng kiến thức vào bài toán thực tiễn.",
      nv: [B.tt.d], lam: ["Lập mô hình toán học cho bài toán.", "Tính toán và trả lời câu hỏi thực tế."], goiy: [], bc: B.tt.g || [], chot: ["Toán học giúp mô tả và giải quyết các bài toán thực tiễn."] });
    // chia vào các tiết
    const t = Math.max(1, B.t || 1), out = [];
    const per = Math.ceil(hd.length / t);
    for (let i = 0; i < t; i++) { const ds = hd.slice(i * per, (i + 1) * per); if (ds.length) out.push({ so: i + 1, ppct: "", ten: "", hd: ds }); }
    return out;
  }

  function moHinh(o) {
    const B = (G.KHBD && KHBD.data(o.lop, o.bai)) || {};
    const C = (G.KHBD && KHBD.chuong(o.lop, o.bai)) || {};
    const K = ((G.KHBDGOC || {})[o.lop] || {})[o.bai];
    const tiet = K && K.tiet && K.tiet.length ? tuKHBD(K) : tuBaiHoc(B, o);
    const mt = (K && K.kt && K.kt.length) ? K.kt : (B.yc || []);
    const hinh = ((G.HINH || {})[String(o.lop)] || {})[o.bai] || [];   // chuyên đề tra G.HINH.CD10…, không lẫn sang bài SGK cùng số
    return { B, C, K, tiet, mt, hinh, nguon: K ? "khbd" : "baihoc" };
  }

  /* ================================================================ dựng danh sách slide trừu tượng */
  const dai = arr => arr.reduce((a, t) => a + String(t).replace(/\$[^$]*\$/g, m => " ".repeat(Math.ceil(m.length * .55))).length + 18 + 40 * Math.min(3, (String(t).match(/\\dfrac|\\displaystyle|\\int|\\sum|\\lim/g) || []).length), 0);
  let HE = 1, CHU_TO = false;   // chế độ "chữ to cho lớp đông": ít dòng mỗi slide, không thu nhỏ chữ
  function chia(items, max) {
    max = max * HE;
    const out = []; let cur = [], n = 0;
    items.forEach(t => {
      const l = dai([t]);
      if (cur.length && (n + l > max || cur.length >= 6)) { out.push(cur); cur = []; n = 0; }
      cur.push(t); n += l;
    });
    if (cur.length) out.push(cur);
    return out;
  }

  function dsSlide(o) {
    CHU_TO = !!o.chuTo; HE = CHU_TO ? 0.72 : 1;
    const M = moHinh(o); const { B, C } = M;
    const S = [];
    const tenBai = `Bài ${o.bai}: ${C.tenBai || (M.K && M.K.ten) || ""}`;
    S.push({ k: "bia", tenBai, chuong: C.ten ? "Chương " + C.so + ". " + C.ten : "", soTiet: B.t || (M.K ? M.K.tiet.length : 1) });
    if (o.mucTieu !== false && M.mt.length) chia(M.mt, 620).forEach((g, i) => S.push({ k: "mt", sac: "phanluc", tieu: "Mục tiêu bài học" + (i ? " (tiếp)" : ""), khoi: [{ t: "ds", items: g, hien: true }] }));

    // gắn hình vẽ vào hoạt động phù hợp
    const hinhCho = new Map();
    M.hinh.forEach(H => {
      const re = new RegExp(H.khi, "i"); let chon = null;
      for (const t of M.tiet) for (const h of t.hd) {
        if (chon) break;
        if ((h.loai === "ht" || h.loai === "md") && !hinhCho.has(h) && re.test(h.ten + " " + h.nv.join(" ") + " " + (h.mt || ""))) chon = h;
      }
      if (!chon) for (const t of M.tiet) for (const h of t.hd) if (!chon && h.loai === "ht" && !hinhCho.has(h)) chon = h;
      if (!chon) for (const t of M.tiet) for (const h of t.hd) if (!chon && h.loai === "ht") chon = h;
      if (chon) { if (!hinhCho.has(chon)) hinhCho.set(chon, []); hinhCho.get(chon).push(H); }
    });

    let viDuDung = 0, htDem = 0, cauDaChen = false;
    const chonTiet = o.tiet && o.tiet !== "all" ? M.tiet.filter(t => String(t.so) === String(o.tiet)) : M.tiet;
    chonTiet.forEach((t, ti) => {
      if (M.tiet.length > 1) S.push({ k: "tiet", so: t.so, ppct: t.ppct, ten: t.ten, ds: t.hd.map(h => `HĐ ${h.so}. ${TEN_LOAI[h.loai] || ""}${h.ten && !h.ten.toUpperCase().startsWith((TEN_LOAI[h.loai] || "#").toUpperCase()) ? " – " + h.ten : ""}`) });
      t.hd.forEach(h => {
        const sac = SAC[h.loai] || "phanvang";
        const nhanHD = `HĐ ${h.so} · ${TEN_LOAI[h.loai] || "Hoạt động"}`;
        S.push({ k: "hd", sac, so: h.so, loai: TEN_LOAI[h.loai] || "", ten: h.ten, phut: h.phut, mt: h.mt });
        const hinh = (hinhCho.get(h) || []).slice();
        // Bước 1
        if (h.nv.length) chia(h.nv, hinh.length ? 330 : 540).forEach((g, i) => {
          const H = i === 0 ? hinh.shift() : null;
          S.push({ k: "b", buoc: 1, sac, nhan: nhanHD, tieu: BUOC[1] + (i ? " (tiếp)" : ""), phu: h.ten, hinh: H,
            khoi: [{ t: "hop", mau: SAC_BUOC[1], ten: "Nhiệm vụ", items: g }] });
        });
        // Bước 2
        if (h.lam.length || h.goiy.length) {
          const k = [];
          if (h.lam.length) k.push({ t: "ds", items: h.lam, hien: false });
          if (h.goiy.length) k.push({ t: "hop", mau: SAC_BUOC[2], ten: "Gợi ý", items: h.goiy, hien: false });
          const tong = [...h.lam, ...h.goiy];
          if (dai(tong) > 540 || tong.length > 6) {
            chia(h.lam, 540).forEach((g, i) => S.push({ k: "b", buoc: 2, sac, nhan: nhanHD, tieu: BUOC[2] + (i ? " (tiếp)" : ""), phu: h.ten, phut: h.phut, khoi: [{ t: "ds", items: g, hien: false }] }));
            if (h.goiy.length) S.push({ k: "b", buoc: 2, sac, nhan: nhanHD, tieu: BUOC[2] + " — gợi ý", phu: h.ten, khoi: [{ t: "hop", mau: SAC_BUOC[2], ten: "Gợi ý", items: h.goiy, hien: false }] });
          } else S.push({ k: "b", buoc: 2, sac, nhan: nhanHD, tieu: BUOC[2], phu: h.ten, phut: h.phut, khoi: k });
        }
        // Bước 3
        if (h.bc.length) chia(h.bc, hinh.length ? 330 : 520).forEach((g, i) => {
          const H = i === 0 ? hinh.shift() : null;
          S.push({ k: "b", buoc: 3, sac, nhan: nhanHD, tieu: BUOC[3] + (i ? " (tiếp)" : ""), phu: h.ten, hinh: H, khoi: [{ t: "buoc", items: g, mau: SAC_BUOC[3] }] });
        });
        // chèn câu hỏi ngân hàng vào hoạt động luyện tập
        if (h.loai === "lt" && !cauDaChen && o.cauHoi && o.cauHoi.length) { cauDaChen = true; chenCau(S, o.cauHoi, nhanHD); }
        // Bước 4
        if (h.chot.length) chia(h.chot, hinh.length ? 330 : 520).forEach((g, i) => {
          const H = i === 0 ? hinh.shift() : null;
          S.push({ k: "b", buoc: 4, sac, nhan: nhanHD, tieu: BUOC[4] + (i ? " (tiếp)" : ""), phu: h.ten, hinh: H, khoi: [{ t: "hop", mau: SAC_BUOC[4], ten: h.loai === "ht" ? "Chốt kiến thức" : "Kết luận", items: g, hien: false }] });
        });
        hinh.forEach(H => S.push({ k: "hinh", sac, nhan: nhanHD, tieu: "Hình minh hoạ", phu: h.ten, hinh: H, khoi: [] }));
        if (h.lt) S.push({ k: "vd", sac: "phanluc", nhan: nhanHD, tieu: "Luyện tập nhanh", phu: h.ten, de: h.lt.d, g: ["Đáp số: " + h.lt.da] });
        // ví dụ bổ sung (từ dữ liệu bài học) sau mỗi hoạt động hình thành kiến thức
        if (h.loai === "ht" && M.nguon === "khbd" && o.viDu !== false) {
          const md = (B.md || [])[htDem++];
          if (md && md.vd) { viDuDung++; S.push({ k: "vd", sac: "phanngoc", nhan: nhanHD, tieu: "Ví dụ minh hoạ " + viDuDung, phu: md.t, de: md.vd.d, g: md.vd.g || [] }); }
        }
      });
      if (t.vn && (o.cungCo !== false)) S.push({ k: "vn", sac: "phantim", tieu: `Hướng dẫn về nhà${M.tiet.length > 1 ? " – Tiết " + t.so : ""}`, khoi: [{ t: "ds", items: y(t.vn), hien: false }] });
    });
    // ví dụ còn lại chưa dùng
    if (M.nguon === "khbd" && o.viDu !== false) (B.md || []).slice(htDem).forEach(md => { if (md.vd) { viDuDung++; S.push({ k: "vd", sac: "phanngoc", nhan: "Ví dụ bổ sung", tieu: "Ví dụ minh hoạ " + viDuDung, phu: md.t, de: md.vd.d, g: md.vd.g || [] }); } });
    if (!cauDaChen && o.cauHoi && o.cauHoi.length) chenCau(S, o.cauHoi, "Luyện tập");
    if (o.thucTien !== false && B.tt && M.nguon === "khbd") S.push({ k: "vd", sac: "phancam", nhan: "Vận dụng thực tiễn", tieu: "Bài toán thực tiễn", de: B.tt.d, g: B.tt.g || [] });
    if (o.ai !== false && B.ai) S.push({ k: "ai", sac: "phantim", tieu: "Thử thách cùng công cụ số & AI", khoi: [{ t: "ds", hien: false, items: [
      `Dùng ${({ geogebra: "GeoGebra 2D", geogebra3d: "GeoGebra 3D", casio: "máy tính cầm tay Casio", excel: "bảng tính Excel" })[B.cs] || "công cụ số"} để kiểm chứng kết quả vừa học.`,
      "Câu lệnh gửi AI: “" + (B.ai.p || "") + "”", "Cảnh giác: " + (B.ai.l || ""), "Nhiệm vụ: chỉ ra chỗ AI sai và giải thích vì sao."] }] });
    if (o.cungCo !== false) S.push({ k: "cc", sac: "phanvang", tieu: "Củng cố bài học", khoi: [{ t: "buoc", mau: "phanvang", items: [
      "Ý chính: " + ((B.md || []).map(m => m.t).join("; ") || M.mt.slice(0, 3).join("; ")),
      ...(B.ai && B.ai.l ? ["Lỗi hay mắc: " + B.ai.l] : []),
      "Bài tập về nhà: " + (B.bt || "các bài tập cuối bài trong sách giáo khoa.")] }], cam: true });
    return S;
  }
  function chenCau(S, qs, nhan) {
    qs.forEach((q, i) => S.push({ k: "cau", sac: "phanluc", nhan, tieu: `Luyện tập – Câu ${i + 1}`, q }));
  }

  /* ================================================================ xuất LaTeX */
  function preamble(o) {
    const M = o.mau || "bangxanh";
    const bo = {
      bangxanh: { nen: "1C3B32", chu: "F4F7F2", c1: "FFD66B", c2: "7FD1C1", c3: "FF9E7D", c4: "C3A6FF", c5: "9BD66B", khung: "2E5A4C", ten: "Bảng xanh – phấn màu" },
      bangden: { nen: "22262A", chu: "F2F2F2", c1: "FFD54F", c2: "4DD0E1", c3: "FF8A80", c4: "CE93D8", c5: "AED581", khung: "343A40", ten: "Bảng đen – phấn màu" },
      giay: { nen: "FFFDF7", chu: "1A2430", c1: "C77700", c2: "00796B", c3: "C62828", c4: "6A3DBF", c5: "2E7D32", khung: "EEF2F8", ten: "Nền giấy – chữ màu" }
    }[M] || {};
    const f = o.font || "Times New Roman";
    return `% ================================================================
% ${o.tieuDe || "Bản trình chiếu"}
% Soạn bằng công cụ "Học cùng Thầy Hiếu" — biên dịch bằng XeLaTeX
% Nội dung bám sát kế hoạch bài dạy: mỗi hoạt động đủ 4 bước
% Phối màu: ${bo.ten}
% ================================================================
\\documentclass[aspectratio=${o.tiLe || "169"},${o.chuTo ? 14 : (o.coChu || 12)}pt,xcolor={dvipsnames}]{beamer}
\\usepackage{fontspec}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usetikzlibrary{calc,arrows.meta}

\\IfFontExistsTF{${f}}{\\setmainfont{${f}}\\setsansfont{${f}}}{\\IfFontExistsTF{TeX Gyre Termes}{\\setmainfont{TeX Gyre Termes}\\setsansfont{TeX Gyre Termes}}{}}
\\usefonttheme{professionalfonts}

\\definecolor{nenbang}{HTML}{${bo.nen}}
\\definecolor{chuphan}{HTML}{${bo.chu}}
\\definecolor{phanvang}{HTML}{${bo.c1}}
\\definecolor{phanngoc}{HTML}{${bo.c2}}
\\definecolor{phancam}{HTML}{${bo.c3}}
\\definecolor{phantim}{HTML}{${bo.c4}}
\\definecolor{phanluc}{HTML}{${bo.c5}}
\\definecolor{khungnhe}{HTML}{${bo.khung}}

\\setbeamercolor{background canvas}{bg=nenbang}
\\setbeamercolor{normal text}{fg=chuphan}
\\setbeamercolor{frametitle}{fg=phanvang,bg=khungnhe}
\\setbeamercolor{framesubtitle}{fg=chuphan}
\\setbeamercolor{structure}{fg=phanngoc}
\\setbeamercolor{itemize item}{fg=phanvang}
\\setbeamercolor{block title}{fg=nenbang,bg=phanvang}
\\setbeamercolor{block body}{fg=chuphan,bg=khungnhe}
\\usebeamercolor{normal text}
\\setbeamertemplate{navigation symbols}{}
\\setbeamertemplate{blocks}[rounded][shadow=false]
\\setbeamertemplate{itemize item}{\\small$\\blacktriangleright$}
\\setbeamerfont{frametitle}{size=\\large,series=\\bfseries}
\\setbeamerfont{framesubtitle}{size=\\footnotesize,series=\\mdseries}
\\setbeamersize{text margin left=1.1em,text margin right=1.1em}

\\makeatletter
% vạch màu dưới tiêu đề (mỗi loại hoạt động một sắc)
\\newcommand{\\sacslide}{phanvang}
\\newcommand{\\dinhsac}[1]{\\renewcommand{\\sacslide}{#1}\\setbeamercolor{frametitle}{fg=#1,bg=khungnhe}}
\\setbeamertemplate{frametitle}{%
  \\nointerlineskip\\begin{beamercolorbox}[wd=\\paperwidth,leftskip=0.8em,rightskip=0.8em,sep=0pt]{frametitle}%
  \\vbox{\\vskip5pt
  \\usebeamerfont{frametitle}\\insertframetitle\\ifx\\insertframesubtitle\\@empty\\else\\\\[-1pt]{\\usebeamerfont{framesubtitle}\\color{chuphan!80}\\insertframesubtitle}\\fi\\vskip4pt}
  \\end{beamercolorbox}%
  \\nointerlineskip\\hbox{\\begin{tikzpicture}\\fill[\\sacslide] (0,0) rectangle (\\paperwidth,2.2pt);\\end{tikzpicture}}\\vskip4pt}
\\makeatother

% chân trang: tên giáo viên + số trang + thanh tiến trình
\\setbeamertemplate{footline}{%
  \\hbox{\\begin{beamercolorbox}[wd=\\paperwidth,ht=2.4ex,dp=1.1ex,leftskip=1em,rightskip=1em]{}%
  {\\color{phanngoc}\\scriptsize ${tex(o.chanTrang || "")}\\hfill\\color{\\sacslide}\\textbf{\\insertframenumber/\\inserttotalframenumber}}\\end{beamercolorbox}}%
  \\nointerlineskip
  \\hbox{\\begin{tikzpicture}
    \\useasboundingbox (0,0) rectangle (\\paperwidth,3pt);
    \\fill[khungnhe] (0,0) rectangle (\\paperwidth,3pt);
    \\pgfmathsetmacro{\\tile}{min(1,\\insertframenumber/max(\\inserttotalframenumber,1))}
    \\fill[\\sacslide] (0,0) rectangle ({\\tile\\paperwidth},3pt);
  \\end{tikzpicture}}}

\\newenvironment{hopmau}[2]{\\setbeamercolor{block title}{bg=#1,fg=nenbang}\\setbeamercolor{block body}{bg=khungnhe,fg=chuphan}\\begin{block}{#2}}{\\end{block}}
\\newcommand{\\sobuoc}[2]{\\tikz[baseline=(sb.base)]{\\node[circle,fill=#1,text=nenbang,inner sep=1.4pt,minimum size=1.35em,font=\\bfseries\\scriptsize] (sb) {#2};}}
\\newcommand{\\nhanbuoc}[2]{\\tikz[baseline=(nb.base)]{\\node[rounded corners=3pt,fill=#1,text=nenbang,inner sep=2.5pt,font=\\bfseries\\scriptsize] (nb) {#2};}}
\\setlength{\\parskip}{2pt}
`;
  }

  const coChu = items => { if (CHU_TO) return ""; const n = dai(items); return n > 470 ? "\\footnotesize" : n > 300 ? "\\small" : ""; };
  function khoiTex(k) {
    const nhom = (items, hien, kieu, mau) => {
      const fs = coChu(items);
      let so = 0;
      return `${fs}\\begin{itemize}\\setlength\\itemsep{${items.length > 5 ? "0.25em" : "0.45em"}}\n` + items.map((t, i) => {
        const tieuMuc = /:\s*$/.test(t) && t.length < 90;
        const ov = hien ? "" : `<${i + 1}->`;
        if (kieu === "so" && !tieuMuc) return `  \\item${ov}[\\sobuoc{${mau}}{${++so}}] ${tex(t)}`;
        if (tieuMuc) return `  \\item${ov}[] {\\color{phanvang}\\textbf{${tex(t)}}}`;
        return `  \\item${ov} ${tex(t)}`;
      }).join("\n") + "\n\\end{itemize}";
    };
    if (k.t === "ds") return nhom(k.items, k.hien, "ds");
    if (k.t === "buoc") return nhom(k.items, false, "so", k.mau || "phancam");
    if (k.t === "hop") return `\\begin{hopmau}{${k.mau}}{${tex(k.ten)}}\n${nhom(k.items, k.hien !== false, "ds")}\n\\end{hopmau}`;
    return "";
  }
  function frameTex(s, body, opt) {
    const sub = s.phu ? `\\framesubtitle{${tex(s.phu.length > 110 ? s.phu.slice(0, 107) + "…" : s.phu)}}` : "";
    const nh = s.buoc ? `\\nhanbuoc{${SAC_BUOC[s.buoc]}}{Bước ${s.buoc}} ` : "";
    return `\\begin{frame}${opt || ""}[t]\\dinhsac{${s.sac || "phanvang"}}
\\frametitle{${nh}${s.nhan ? `{\\color{chuphan!70}\\small ${tex(s.nhan)}}\\quad ` : ""}${tex(s.tieu)}}${sub}
${body}
\\end{frame}

`;
  }
  function voiHinh(s, body) {
    if (!s.hinh) return body;
    return `\\begin{columns}[T,onlytextwidth]
\\begin{column}{0.56\\textwidth}
${body}
\\end{column}
\\begin{column}{0.42\\textwidth}
\\centering
${HinhVe.tikz(Object.assign({}, s.hinh.h, { w: Math.min(s.hinh.h.w || 5, 5.4), hmax: 4.4 }))}\\\\[2pt]
{\\scriptsize\\color{phanngoc} ${tex(s.hinh.ten || "")}}
\\end{column}
\\end{columns}`;
  }
  function slideTex(s, o) {
    switch (s.k) {
      case "bia": return `\\begin{frame}[plain]
\\begin{center}
\\begin{tikzpicture}\\foreach \\c/\\x in {phanvang/0,phanngoc/1.35,phancam/2.7,phantim/4.05,phanluc/5.4}{\\fill[\\c] (\\x,0) rectangle ++(1.2,0.12);}\\end{tikzpicture}\\\\[1em]
${o.truong ? `{\\color{phanngoc}\\large ${tex(o.truong)}}\\\\[1.3em]` : "\\mbox{}\\\\[0.6em]"}
{\\color{phanvang}\\LARGE\\bfseries ${tex(s.tenBai.toUpperCase())}}\\\\[0.6em]
{\\color{chuphan}\\large ${tex(s.chuong)}}\\\\[1.5em]
{\\color{phanluc}\\normalsize Giáo viên: ${tex(o.gv || "")}}\\\\[0.3em]
{\\color{phancam}\\footnotesize ${tex(o.lopTen || "")} — ${s.soTiet} tiết}\\\\[1em]
\\begin{tikzpicture}\\foreach \\c/\\x in {phanluc/0,phantim/1.35,phancam/2.7,phanngoc/4.05,phanvang/5.4}{\\fill[\\c] (\\x,0) rectangle ++(1.2,0.12);}\\end{tikzpicture}
\\end{center}
\\end{frame}

`;
      case "tiet": return `\\begin{frame}[c]\\dinhsac{phanngoc}
\\begin{center}
{\\color{phanngoc}\\Huge\\bfseries TIẾT ${s.so}}\\\\[0.3em]
${s.ppct ? `{\\color{chuphan!70}\\small ${tex(s.ppct)}}\\\\[0.4em]` : ""}
{\\color{phanvang}\\large\\bfseries ${tex(s.ten || "")}}
\\end{center}
\\vspace{0.6em}
{\\small\\begin{itemize}\\setlength\\itemsep{0.2em}
${s.ds.map(t => "  \\item " + tex(t)).join("\n")}
\\end{itemize}}
\\end{frame}

`;
      case "hd": return `\\begin{frame}[c]\\dinhsac{${s.sac}}
\\begin{center}
{\\color{${s.sac}}\\Large\\bfseries HOẠT ĐỘNG ${tex(s.so)}}\\\\[0.2em]
{\\color{chuphan}\\large ${tex((s.loai || "").toUpperCase())}}\\\\[0.8em]
{\\color{${s.sac}}\\normalsize\\bfseries ${tex(s.ten || "")}}\\\\[0.4em]
${s.phut ? `{\\color{chuphan!70}\\small Thời gian: ${s.phut} phút}\\\\[0.6em]` : ""}
\\end{center}
${s.mt ? `\\begin{hopmau}{${s.sac}}{Mục tiêu}\\small ${tex(s.mt)}\\end{hopmau}` : ""}
\\end{frame}

`;
      case "vd": {
        const g = (s.g || []).map((t, i) => `  \\item<${i + 2}->[\\sobuoc{phanngoc}{${i + 1}}] ${tex(t)}`).join("\n");
        return frameTex(s, `${coChu([s.de, ...(s.g || [])])}\\begin{hopmau}{${s.sac}}{Đề bài}\n${tex(s.de)}\n\\end{hopmau}
\\onslide<2->{{\\color{${s.sac}}\\textbf{Lời giải}}}
\\begin{itemize}\\setlength\\itemsep{0.4em}
${g}
\\end{itemize}`);
      }
      case "cau": {
        const q = s.q;
        const pa = (q.pa || []).map((p, i) => `\\textbf{${"ABCD"[i]}.} ${tex(p)}`);
        const ngan = pa.every(p => p.length < 42);
        return frameTex(s, `${coChu([q.de, ...(q.pa || [])])}${tex(q.de)}

\\vspace{0.5em}
${ngan ? `\\begin{columns}[T]\\begin{column}{0.48\\textwidth}${pa[0]}\\\\[0.4em]${pa[2] || ""}\\end{column}\\begin{column}{0.48\\textwidth}${pa[1] || ""}\\\\[0.4em]${pa[3] || ""}\\end{column}\\end{columns}`
            : `\\begin{itemize}\\setlength\\itemsep{0.3em}${pa.map(p => "\\item[] " + p).join("\n")}\\end{itemize}`}
\\onslide<2->{\\vspace{0.4em}{\\color{phanluc}\\textbf{Đáp án: ${tex(q.dapan || "A")}}}${q.loigiai ? ` \\\\ {\\color{phanngoc}\\footnotesize ${tex(q.loigiai)}}` : ""}}`);
      }
      case "cc": return frameTex(s, s.khoi.map(khoiTex).join("\n") + `\n\\vspace{0.8em}\n\\onslide<${s.khoi[0].items.length + 1}->{\\begin{center}{\\color{phanngoc}\\large Cảm ơn các em — hẹn gặp lại ở bài sau!}\\end{center}}`);
      case "hinh": return frameTex(s, `\\begin{center}${HinhVe.tikz(Object.assign({}, s.hinh.h, { w: 7, hmax: 5.2 }))}\\\\[4pt]{\\small\\color{phanngoc} ${tex(s.hinh.ten || "")}}\\end{center}`);
      default:
        return frameTex(s, voiHinh(s, s.khoi.map(khoiTex).join("\n\\vspace{0.3em}\n")));
    }
  }

  function render(o) {
    const C = (G.KHBD && KHBD.chuong(o.lop, o.bai)) || {};
    const oo = Object.assign({ lopTen: G.KHBD ? KHBD.lopTen(o.lop) : "", tieuDe: `Bài ${o.bai}. ${C.tenBai || ""}` }, o);
    const S = dsSlide(oo);
    let s = preamble(oo);
    s += `\\title{${tex(S[0].tenBai)}}\n\\author{${tex(oo.gv || "")}}\n\\date{}\n\n\\begin{document}\n\n`;
    S.forEach(x => { s += slideTex(x, oo); });
    s += `\\end{document}\n`;
    if (oo.chuTo) { const i = s.indexOf("\\begin{document}"); s = s.slice(0, i) + s.slice(i).replace(/\{\\small\\begin\{itemize\}/g, "{\\begin{itemize}").replace(/\\end\{hopmau\}\{\\color\{phanngoc\}\\footnotesize /g, "\\end{hopmau}{\\color{phanngoc}").replace(/(\{Mục tiêu\})\\small /g, "$1"); }
    return s;
  }

  /* ================================================================ xem trước HTML */
  const MAU_CSS = { phanvang: "var(--vang)", phanngoc: "var(--xanh)", phancam: "var(--hong)", phantim: "var(--tim)", phanluc: "var(--luc)" };
  function xemTruoc(o) {
    const T = s => (G.NHD && NHD.texToHtml) ? NHD.texToHtml(s) : esc(s);
    const S = dsSlide(o);
    const ds = (items, kieu, mau, tatCa) => { let so = 0; return `<ul class="${kieu === "so" ? "buoc" : ""}${tatCa ? " tatca" : ""}">${items.map((t, i) => {
      if (/:\s*$/.test(t) && t.length < 90) return `<li class="tm">${T(t)}</li>`;
      if (kieu === "so") return `<li><span class="n" style="background:${MAU_CSS[mau] || "var(--hong)"}">${++so}</span><span>${T(t)}</span></li>`;
      return `<li>${T(t)}</li>`;
    }).join("")}</ul>`; };
    const khoi = k => k.t === "ds" ? ds(k.items, "", "", k.hien) : k.t === "buoc" ? ds(k.items, "so", k.mau, k.hien)
      : k.t === "hop" ? `<div class="blk" style="--sac:${MAU_CSS[k.mau]}"><b>${esc(k.ten)}</b>${ds(k.items, "", "", k.hien !== false)}</div>` : "";
    const dau = s => `<div class="dau">${s.buoc ? `<span class="nb" style="background:${MAU_CSS[SAC_BUOC[s.buoc]]}">Bước ${s.buoc}</span>` : ""}${s.nhan ? `<span class="nh">${esc(s.nhan)}</span>` : ""}<h3>${esc(s.tieu)}</h3>${s.phu ? `<div class="phu">${T(s.phu)}</div>` : ""}</div>`;
    return S.map(s => {
      const sac = MAU_CSS[s.sac] || "var(--vang)";
      let h = "";
      switch (s.k) {
        case "bia": h = `<div class="sl tt"><div class="truong">${esc(o.truong || "")}</div><h2>${esc(s.tenBai)}</h2><div class="ch">${esc(s.chuong)}</div><div class="gv">Giáo viên: ${esc(o.gv || "")}</div>`; break;
        case "tiet": h = `<div class="sl tiet" style="--sac:var(--xanh)"><div class="lon">TIẾT ${s.so}</div>${s.ppct ? `<div class="pp">${esc(s.ppct)}</div>` : ""}<div class="tt2">${T(s.ten || "")}</div><ul>${s.ds.map(t => `<li>${T(t)}</li>`).join("")}</ul>`; break;
        case "hd": h = `<div class="sl hdbia" style="--sac:${sac}"><div class="lon">HOẠT ĐỘNG ${esc(s.so)}</div><div class="loai">${esc((s.loai || "").toUpperCase())}</div><div class="tt2">${T(s.ten || "")}</div>${s.phut ? `<div class="pp">Thời gian: ${s.phut} phút</div>` : ""}${s.mt ? `<div class="blk"><b>Mục tiêu</b><p>${T(s.mt)}</p></div>` : ""}`; break;
        case "vd": h = `<div class="sl" style="--sac:${sac}">${dau(s)}<div class="blk"><b>Đề bài</b><p>${T(s.de)}</p></div><p><b style="color:${sac}">Lời giải</b></p>${ds(s.g, "so", s.sac)}`; break;
        case "cau": h = `<div class="sl" style="--sac:${sac}">${dau(s)}<p>${T(s.q.de)}</p><ul class="pa">${(s.q.pa || []).map((p, i) => `<li><b>${"ABCD"[i]}.</b> ${T(p)}</li>`).join("")}</ul><p style="color:${sac}"><b>Đáp án: ${esc(s.q.dapan || "A")}</b></p>`; break;
        case "hinh": h = `<div class="sl" style="--sac:${sac}">${dau(s)}<div class="hinh to">${HinhVe.svg(s.hinh.h)}<div class="cap">${T(s.hinh.ten || "")}</div></div>`; break;
        default: {
          const than = s.khoi.map(khoi).join("");
          h = `<div class="sl" style="--sac:${sac}">${dau(s)}${s.hinh ? `<div class="cot"><div>${than}</div><div class="hinh">${HinhVe.svg(s.hinh.h)}<div class="cap">${T(s.hinh.ten || "")}</div></div></div>` : than}${s.cam ? `<p class="cam">Cảm ơn các em — hẹn gặp lại ở bài sau!</p>` : ""}`;
        }
      }
      return h + `<div class="vach"></div></div>`;
    }).join("");
  }

  function thongKe(o) {
    const S = dsSlide(o); const M = moHinh(o);
    return { soSlide: S.length, nguon: M.nguon, soTiet: M.tiet.length, soHD: M.tiet.reduce((a, t) => a + t.hd.length, 0), soHinh: S.filter(s => s.hinh).length, tiet: M.tiet.map(t => ({ so: t.so, ten: t.ten })) };
  }

  G.Beamer = { render, xemTruoc, tex, dsSlide, thongKe, moHinh };
})(window);
