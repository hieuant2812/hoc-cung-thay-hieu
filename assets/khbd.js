/* khbd.js — soạn Kế hoạch bài dạy theo Công văn 5512, tích hợp Khung năng lực số (TT 02/2025/TT-BGDĐT)
   và Khung năng lực AI (QĐ 2422/QĐ-BGDĐT). Sinh HTML, sau đó assets/docx.js đổi sang .docx với công thức Equation.
   Dùng dữ liệu bài học ở data/baihoc/*.js (window.BAIHOC) và tên chương bài ở data/chuongtrinh.js. */
(function (G) {
  "use strict";
  const esc = G.esc || (s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const T = s => NHD.texToHtml(String(s == null ? "" : s));   // $...$ → KaTeX (docx.js đọc được MathML để tạo Equation)

  /* ---------------------------------------------------------------- mã năng lực số và AI (theo bộ mã thầy cô đang dùng) */
  const NLS = {
    "1.1.CB2a": "Phân loại và quản lí danh sách dữ liệu",
    "1.3.NC1a": "Quản lí dữ liệu, thông tin và nội dung số",
    "1.3.NC1b": "Tổ chức, lưu trữ và truy xuất dữ liệu số",
    "2.4.NC1a": "Hợp tác thông qua công nghệ số",
    "3.1.NC1a": "Phát triển nội dung số",
    "3.2.NC1a": "Tích hợp và tạo lập lại nội dung số",
    "4.2.NC1a": "Bảo vệ dữ liệu cá nhân và quyền riêng tư",
    "5.2.NC1b": "Xác định nhu cầu và giải pháp công nghệ",
    "5.2.NC1c": "Sử dụng sáng tạo công nghệ số để giải quyết vấn đề",
    "6.3.NC1a": "Sử dụng có trách nhiệm hệ thống thông minh"
  };
  const AI = { "A1.2": "Con người trong hệ thống AI", "A3.1": "Đạo đức AI và trung thực trong học tập", "C3.1": "Thiết lập câu lệnh (prompt) có cấu trúc", "C3.2": "Tuỳ chỉnh và tối ưu hệ thống AI" };
  const CS = {
    geogebra: { ten: "GeoGebra 2D", mo: "vẽ đồ thị, dựng hình, kiểm chứng trực quan" },
    geogebra3d: { ten: "GeoGebra 3D", mo: "dựng hình không gian, quan sát thiết diện, đo góc và khoảng cách" },
    casio: { ten: "Máy tính cầm tay Casio fx-580VN X / fx-880BTG", mo: "tính toán, kiểm tra kết quả, giải phương trình" },
    excel: { ten: "Bảng tính Excel / Google Sheets", mo: "lập bảng số liệu, vẽ biểu đồ, tính các số đặc trưng" },
    ai: { ten: "Chatbot AI (Gemini / ChatGPT)", mo: "soạn câu lệnh có cấu trúc và phản biện câu trả lời" }
  };
  const aiMa = (lop, k) => (String(lop).replace(/\D/g, "") || "10") + "." + k;

  /* ---------------------------------------------------------------- tiện ích */
  const chuong = (lop, bai) => {
    const CT = String(lop).startsWith("CD") ? (G.CHUYEN_DE || {})[lop] : ((G.CHUONG_TRINH || {})["Toán"] || {})[lop];
    for (const c in CT || {}) if (CT[c][1] && CT[c][1][bai]) return { so: c, ten: CT[c][0], tenBai: CT[c][1][bai] };
    return { so: "", ten: "", tenBai: "" };
  };
  const dsBai = lop => {
    const CT = String(lop).startsWith("CD") ? (G.CHUYEN_DE || {})[lop] : ((G.CHUONG_TRINH || {})["Toán"] || {})[lop];
    const out = [];
    Object.keys(CT || {}).sort((a, b) => a - b).forEach(c => Object.keys(CT[c][1]).sort((a, b) => a - b).forEach(b => out.push({ bai: +b, chuong: c, tenChuong: CT[c][0], ten: CT[c][1][b] })));
    return out;
  };
  const data = (lop, bai) => (((G.BAIHOC || {})["Toán"] || {})[lop] || {})[bai] || null;
  const lopTen = lop => String(lop).startsWith("CD") ? "Chuyên đề học tập Toán " + String(lop).slice(2) : "Toán " + lop;
  const bangHD = rows => `<table class="hd"><colgroup><col style="width:30%"><col style="width:26%"><col style="width:24%"><col style="width:20%"></colgroup>
    <tr><th>HOẠT ĐỘNG CỦA GIÁO VIÊN</th><th>HOẠT ĐỘNG CỦA HỌC SINH</th><th>DỰ KIẾN SẢN PHẨM</th><th>NLS/AI – GDĐĐ/ANQP</th></tr>
    ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}</table>`;
  const hd = (ten, phut, muc, rows) => `<p class="h3"><b>${esc(ten)}${phut ? ` (${phut} phút)` : ""}</b></p>
    <p><b>a) Mục tiêu:</b> ${T(muc)}</p>
    <p><b>b) Nội dung:</b> Học sinh thực hiện nhiệm vụ do giáo viên chuyển giao theo bốn bước trong bảng dưới đây.</p>
    <p><b>c) Sản phẩm:</b> Xem cột “Dự kiến sản phẩm”.</p>
    <p><b>d) Tổ chức thực hiện:</b></p>${bangHD(rows)}`;

  /* ---------------------------------------------------------------- các hoạt động */
  function hdMoDau(B, o) {
    const tt = B.tt || {};
    return hd("HOẠT ĐỘNG 1. MỞ ĐẦU / KHỞI ĐỘNG", o.phutMoDau || 5,
      "Tạo tình huống có vấn đề gắn với thực tiễn, khơi dậy nhu cầu tìm hiểu kiến thức mới của bài học.",
      [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên nêu tình huống mở đầu: " + T(tt.d || "một tình huống thực tiễn liên quan đến nội dung bài học") + " Yêu cầu học sinh thảo luận cặp đôi, dự đoán cách giải quyết.",
        "Học sinh đọc tình huống, thảo luận cặp đôi và ghi nhanh dự đoán ra giấy nháp.",
        "Dự đoán ban đầu của học sinh về hướng giải quyết.", "Khơi dậy hứng thú, tư duy mô hình hoá."],
       ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên quan sát, gợi ý học sinh xác định đại lượng đã biết và đại lượng cần tìm.",
        "Học sinh làm việc cặp đôi, xác định dữ kiện của tình huống.",
        "Bảng tóm tắt dữ kiện của tình huống.", "Hợp tác, giao tiếp toán học."],
       ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên mời đại diện 1–2 cặp trình bày dự đoán, các cặp khác nhận xét.",
        "Đại diện học sinh trình bày, lớp nhận xét và bổ sung.",
        "Ý kiến thảo luận của học sinh.", "Mạnh dạn phát biểu ý kiến."],
       ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên ghi nhận các dự đoán và nêu vấn đề: cần công cụ toán học nào để giải quyết trọn vẹn tình huống trên? Dẫn vào bài mới.",
        "Học sinh lắng nghe và ghi tên bài học vào vở.", "Tên bài học và vấn đề cần giải quyết.", "Định hướng nhiệm vụ học tập."]]);
  }
  function hdKienThuc(B, o, i) {
    const m = B.md[i]; const vd = m.vd;
    const y = (m.y || []).map(x => "<br>• " + T(x)).join("");
    return hd(`HOẠT ĐỘNG 2.${i + 1}. HÌNH THÀNH KIẾN THỨC — ${m.t.toUpperCase()}`, o.phutKT || 20,
      `Học sinh hình thành và phát biểu được kiến thức về ${m.t.toLowerCase()}; vận dụng vào ví dụ mẫu.`,
      [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên yêu cầu học sinh đọc sách giáo khoa phần tương ứng và trả lời câu hỏi dẫn dắt để rút ra kiến thức trọng tâm." + (m.kp ? "<br><b>Câu hỏi khám phá:</b> " + T(m.kp) : "") + (m.kpd ? "<br><i>Dự kiến trả lời:</i> " + T(m.kpd) : ""),
        "Học sinh đọc sách giáo khoa, trao đổi nhóm bàn và ghi nhận kiến thức.",
        "<b>Kiến thức trọng tâm:</b>" + y, "Tự học, tư duy và lập luận toán học."],
       ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên phân tích, làm rõ từng ý; lưu ý điều kiện áp dụng và những chỗ học sinh hay nhầm." + (vd ? " Giao ví dụ: " + T(vd.d) : ""),
        "Học sinh ghi bài, làm ví dụ vào vở theo hướng dẫn.",
        vd ? "<b>Ví dụ.</b> " + T(vd.d) : "Nội dung kiến thức ghi vở.", "Rèn tính cẩn thận, chính xác."],
       ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên gọi học sinh lên bảng trình bày lời giải ví dụ, học sinh khác nhận xét.",
        "Học sinh lên bảng trình bày; lớp theo dõi, nhận xét và chữa bài.",
        vd ? "<b>Lời giải.</b>" + (vd.g || []).map((s, k) => `<br>${k + 1}) ${T(s)}`).join("") : "Lời giải của học sinh.", "Giao tiếp toán học."],
       ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên chốt kiến thức, nhấn mạnh điều kiện áp dụng và cách trình bày chuẩn mực." + (m.lt ? "<br><b>Luyện tập nhanh:</b> " + T(m.lt.d) : ""),
        "Học sinh hoàn thiện bài vào vở" + (m.lt ? " và làm bài luyện tập nhanh." : "."), m.lt ? "<b>Đáp số luyện tập:</b> " + T(m.lt.da) : "Kiến thức được chốt và ghi nhớ.", "Chính xác, khoa học."]]);
  }
  function hdSoAI(B, o) {
    const cs = CS[B.cs] || CS.geogebra; const ai = B.ai || {};
    const ma1 = o.nls && o.nls.length ? o.nls[0] : "3.2.NC1a";
    const ma2 = o.nls && o.nls.length > 1 ? o.nls[1] : "5.2.NC1b";
    return hd("HOẠT ĐỘNG 3. LUYỆN TẬP — TRẢI NGHIỆM CÔNG CỤ SỐ VÀ PHẢN BIỆN AI", o.phutLT || 15,
      `Học sinh sử dụng ${cs.ten} để ${cs.mo} (mã NLS ${ma1}, ${ma2}); soạn câu lệnh có cấu trúc gửi Chatbot AI, phát hiện và phản biện lỗi sai của AI (mã AI ${aiMa(o.lop, "C3.2")}, ${aiMa(o.lop, "A1.2")}).`,
      [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên chia lớp thành các nhóm và giao <b>Phiếu học tập số 1</b>:<br>• Nhóm A: dùng " + esc(cs.ten) + " để " + esc(cs.mo) + ".<br>• Nhóm B: gửi Chatbot AI câu lệnh “" + T(ai.p || "trình bày lời giải từng bước cho bài toán của tiết học") + "”, rồi kiểm chứng lại kết quả.",
        "Học sinh nhận nhiệm vụ, phân công trong nhóm, mở thiết bị số cá nhân.",
        "Phiếu học tập số 1 của các nhóm.", `🔴 NLS ${esc(ma1)}: ${esc(NLS[ma1] || "")}.`],
       ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên hỗ trợ kĩ thuật, nhắc học sinh lưu lại ảnh màn hình và nguyên văn câu trả lời của AI để đối chiếu.",
        "Nhóm A thao tác trên phần mềm; nhóm B ghi lại câu trả lời của Chatbot AI.",
        "Ảnh chụp màn hình phần mềm; biên bản câu trả lời của AI.", `🔴 NLS ${esc(ma2)}: ${esc(NLS[ma2] || "")}.`],
       ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên mời nhóm A chiếu kết quả phần mềm, nhóm B chỉ ra chỗ AI trả lời chưa đúng và giải thích vì sao.",
        "Nhóm B phát hiện lỗi: " + T(ai.l || "AI trình bày thiếu bước hoặc bỏ qua điều kiện xác định") + " và lập biên bản phản biện.",
        "Biên bản phản biện lỗi của AI, có dẫn chứng từ phần mềm hoặc sách giáo khoa.", `🔴 AI ${esc(aiMa(o.lop, "C3.2"))}: ${esc(AI["C3.2"])}.`],
       ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên chốt: công cụ số giúp trực quan và kiểm chứng nhanh, nhưng kết quả của AI <b>bắt buộc phải được con người rà soát</b>; học sinh phải công khai mức độ sử dụng AI trong sản phẩm học tập.",
        "Học sinh ghi nhận kết luận và cam kết trung thực khi dùng AI.",
        "Kết luận về vai trò kiểm soát của con người với AI.", `🔴 AI ${esc(aiMa(o.lop, "A1.2"))}: ${esc(AI["A1.2"])}.`]]);
  }
  function hdVanDung(B, o) {
    const tt = B.tt || {};
    return hd("HOẠT ĐỘNG 4. VẬN DỤNG THỰC TIỄN", o.phutVD || 10,
      "Học sinh vận dụng kiến thức của bài để giải quyết một vấn đề thực tiễn, phát triển năng lực mô hình hoá toán học.",
      [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên nêu bài toán: " + T(tt.d || "một bài toán thực tiễn vận dụng kiến thức bài học"),
        "Học sinh đọc đề, xác định dữ kiện và yêu cầu.", "Tóm tắt bài toán thực tiễn.", "Năng lực mô hình hoá toán học."],
       ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên hướng dẫn học sinh chuyển tình huống thực tế thành mô hình toán học rồi giải.",
        "Học sinh làm việc nhóm, thiết lập mô hình và tính toán.",
        "<b>Hướng giải.</b>" + (tt.g || []).map((s, k) => `<br>${k + 1}) ${T(s)}`).join(""), "Giải quyết vấn đề thực tiễn."],
       ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên mời đại diện nhóm trình bày, các nhóm khác phản biện về tính hợp lí của kết quả so với thực tế.",
        "Đại diện nhóm trình bày; các nhóm nhận xét, đối chiếu với thực tế.",
        "Lời giải hoàn chỉnh kèm nhận xét ý nghĩa thực tiễn.", "Giao tiếp, hợp tác."],
       ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên chốt lời giải, nhấn mạnh ý nghĩa thực tiễn và lưu ý việc làm tròn, đối chiếu điều kiện thực tế.",
        "Học sinh ghi lời giải hoàn chỉnh vào vở.", "Ý nghĩa ứng dụng của kiến thức.", "Ý thức vận dụng tri thức vào cuộc sống."]]);
  }
  function hdVeNha(B, o) {
    return hd("HOẠT ĐỘNG 5. TỔNG KẾT VÀ HƯỚNG DẪN VỀ NHÀ", o.phutVN || 5,
      "Hệ thống hoá kiến thức toàn bài, phổ biến tiêu chí đánh giá và giao nhiệm vụ về nhà.",
      [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên hệ thống bài học bằng sơ đồ tư duy các đơn vị kiến thức đã học.",
        "Học sinh quan sát và hoàn thiện sơ đồ tư duy vào vở.", "Sơ đồ tư duy tổng kết bài học.", "Tư duy hệ thống."],
       ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên phổ biến <b>Bảng tiêu chí đánh giá (Rubric)</b> và hướng dẫn các nhóm tự đánh giá, đánh giá chéo.",
        "Các nhóm tự đánh giá và đánh giá chéo theo Rubric.", "Bảng điểm đánh giá nhóm.", `🔴 AI ${esc(aiMa(o.lop, "A3.1"))}: ${esc(AI["A3.1"])}.`],
       ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên nhắc lại cam kết trung thực khi sử dụng AI trong học tập và kiểm tra.",
        "Học sinh ghi nhớ và thực hiện cam kết.", "Cam kết trung thực học thuật.", "Trung thực, trách nhiệm."],
       ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên giao bài tập về nhà: " + esc(B.bt || "bài tập cuối bài trong sách giáo khoa") + " và dặn dò chuẩn bị bài sau.",
        "Học sinh ghi bài tập về nhà vào vở.", "Kế hoạch tự học ở nhà.", "Chăm chỉ, tự giác."]]);
  }

  /* ---------------------------------------------------------------- hồ sơ dạy học */
  function hoSo(B, o) {
    const cs = CS[B.cs] || CS.geogebra; const ai = B.ai || {};
    let h = `<p class="h2"><b>IV. HỒ SƠ DẠY HỌC</b></p>`;
    if (o.phieu !== false) {
      h += `<p class="h3"><b>1. PHIẾU HỌC TẬP SỐ 1 — THỰC HÀNH ${esc(cs.ten.toUpperCase())} VÀ PHẢN BIỆN LỖI AI</b></p>
      <p>Nhóm: ………………………… Lớp: ………… Ngày: ………………</p>
      <table class="hd"><colgroup><col style="width:34%"><col style="width:33%"><col style="width:33%"></colgroup>
      <tr><th>NỘI DUNG RÀ SOÁT</th><th>KẾT QUẢ CHATBOT AI TRẢ LỜI</th><th>KẾT QUẢ KIỂM CHỨNG (phần mềm / SGK)</th></tr>
      <tr><td>Câu lệnh đã gửi: “${T(ai.p || "…")}”</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      <tr><td>Các bước giải AI đưa ra có đầy đủ và đúng điều kiện không?</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      <tr><td>Chỗ AI trả lời chưa chính xác (nếu có) và lí do</td><td>&nbsp;</td><td>&nbsp;</td></tr>
      <tr><td>Kết quả kiểm chứng bằng ${esc(cs.ten)}</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>
      <p><i>Gợi ý cho giáo viên: lỗi AI thường gặp ở bài này — ${T(ai.l || "trình bày thiếu bước hoặc bỏ qua điều kiện xác định")}</i></p>`;
    }
    if (o.rubric !== false) {
      h += `<p class="h3"><b>${o.phieu !== false ? "2" : "1"}. BẢNG TIÊU CHÍ ĐÁNH GIÁ HOẠT ĐỘNG NHÓM (RUBRIC)</b></p>
      <table class="hd"><colgroup><col style="width:25%"><col style="width:25%"><col style="width:25%"><col style="width:25%"></colgroup>
      <tr><th>TIÊU CHÍ</th><th>MỨC TỐT (8 – 10 điểm)</th><th>MỨC KHÁ (6 – 7,9 điểm)</th><th>MỨC CHƯA ĐẠT (dưới 6 điểm)</th></tr>
      <tr><td>Kiến thức trọng tâm của bài</td><td>Vận dụng chính xác, trình bày chặt chẽ, đủ điều kiện áp dụng.</td><td>Làm đúng hướng nhưng còn sai sót nhỏ khi trình bày.</td><td>Chưa nắm được kiến thức trọng tâm, giải sai bản chất.</td></tr>
      <tr><td>Kĩ năng sử dụng ${esc(cs.ten)}</td><td>Thao tác thành thạo, đọc đúng kết quả từ phần mềm.</td><td>Thao tác được nhưng còn chậm, cần trợ giúp.</td><td>Chưa thực hiện được thao tác cơ bản.</td></tr>
      <tr><td>Soạn prompt và phản biện AI</td><td>Câu lệnh rõ ràng, phát hiện chính xác lỗi của AI và giải thích thuyết phục.</td><td>Phát hiện được lỗi nhưng giải thích chưa chặt chẽ.</td><td>Chấp nhận câu trả lời của AI mà không kiểm chứng.</td></tr>
      <tr><td>Hợp tác nhóm</td><td>Phân công rõ ràng, mọi thành viên đều tham gia.</td><td>Có phân công nhưng một vài thành viên còn thụ động.</td><td>Hoạt động rời rạc, chỉ một người làm việc.</td></tr>
      <tr><td>Trung thực học thuật (AI ${esc(aiMa(o.lop, "A3.1"))})</td><td>Khai báo đầy đủ, trung thực mức độ sử dụng AI.</td><td>Có khai báo nhưng chưa đầy đủ câu lệnh đã dùng.</td><td>Sao chép đầu ra của AI, không kiểm chứng, không khai báo.</td></tr></table>`;
    }
    return h;
  }

  /* ---------------------------------------------------------------- toàn bộ kế hoạch bài dạy */
  function render(o) {
    const B = data(o.lop, o.bai); if (!B) return `<p>Chưa có dữ liệu cho bài này.</p>`;
    const C = chuong(o.lop, o.bai);
    const soTiet = o.soTiet || B.t || 2;
    const t1 = o.tietBatDau || 1;
    const tiets = Array.from({ length: soTiet }, (_, i) => t1 + i);
    const cs = CS[B.cs] || CS.geogebra;
    const nls = (o.nls && o.nls.length ? o.nls : ["3.2.NC1a", "5.2.NC1b"]);
    const tenBai = C.tenBai || B.ten || "";
    const tieu = String(o.lop).startsWith("CD") ? `CHUYÊN ĐỀ ${C.so}. BÀI ${o.bai}: ${tenBai.toUpperCase()}` : `BÀI ${o.bai}: ${tenBai.toUpperCase()}`;

    let h = `<p class="right"><i>Ngày soạn: ${esc(o.ngaySoan || ".../.../20...")}<br>Ngày dạy: ${esc(o.ngayDay || ".../.../20...")}</i></p>
      <p class="title"><b>${esc(tieu)}</b></p>
      <p class="center">Môn học: ${esc(lopTen(o.lop))} | Thời gian thực hiện: ${soTiet} tiết (Tiết ${tiets.join(", ")} theo PPCT)<br>
      ${esc(o.truong || "")}${o.gv ? " — Giáo viên thực hiện: " + esc(o.gv) : ""}</p>

      <p class="h2"><b>I. MỤC TIÊU</b></p>
      <p><b>1. Về kiến thức</b></p><p>${(B.yc || []).map(x => "– " + T(x)).join("<br>")}</p>
      <p><b>2. Về năng lực</b></p>
      <p><i>a) Năng lực chung</i><br>
      – Năng lực tự chủ và tự học: chủ động đọc sách giáo khoa, hoàn thành nhiệm vụ học tập cá nhân.<br>
      – Năng lực giao tiếp và hợp tác: thảo luận nhóm khi thực hành công cụ số và phản biện AI.<br>
      – Năng lực giải quyết vấn đề và sáng tạo: mô hình hoá và giải quyết tình huống thực tiễn của bài học.</p>
      <p><i>b) Năng lực đặc thù môn Toán</i><br>
      – Năng lực tư duy và lập luận toán học: ${T((B.md[0] && B.md[0].t ? "phân tích, lập luận về " + B.md[0].t.toLowerCase() : "lập luận chặt chẽ trong các bước giải"))}.<br>
      – Năng lực mô hình hoá toán học: chuyển tình huống thực tiễn thành mô hình toán học và giải quyết.<br>
      – Năng lực sử dụng công cụ, phương tiện học toán: sử dụng ${esc(cs.ten)} để ${esc(cs.mo)}.</p>
      <p><i>c) Năng lực số (theo Thông tư 02/2025/TT-BGDĐT)</i><br>
      ${nls.map(m => `🔴 Mã chỉ báo <b>${esc(m)}</b> (${esc(NLS[m] || "")}): học sinh sử dụng ${esc(cs.ten)} để ${esc(cs.mo)} trong hoạt động luyện tập của bài học.`).join("<br>")}</p>
      <p><i>d) Năng lực AI (theo Quyết định 2422/QĐ-BGDĐT)</i><br>
      🔴 Mã <b>${esc(aiMa(o.lop, "C3.2"))}</b> (${esc(AI["C3.2"])}): học sinh soạn câu lệnh có cấu trúc gửi Chatbot AI cho nhiệm vụ của bài học.<br>
      🔴 Mã <b>${esc(aiMa(o.lop, "A1.2"))}</b> (${esc(AI["A1.2"])}): học sinh rà soát, phát hiện và phản biện chỗ chưa chính xác trong câu trả lời của AI.</p>
      <p><b>3. Về phẩm chất</b></p>
      <p>– Chăm chỉ: tích cực hoàn thành nhiệm vụ cá nhân và nhiệm vụ nhóm.<br>
      – Trách nhiệm: giữ gìn thiết bị số, thực hiện đúng nội quy phòng học.<br>
      🔴 Mã <b>${esc(aiMa(o.lop, "A3.1"))}</b> (${esc(AI["A3.1"])}): trung thực, tự giác khai báo mức độ sử dụng AI trong sản phẩm học tập.</p>`;

    h += `<p class="h2"><b>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</b></p>
      <p><b>1. Giáo viên:</b> Kế hoạch bài dạy (Công văn 5512), sách giáo khoa ${esc(lopTen(o.lop))}, bài giảng điện tử; máy tính, máy chiếu, ${esc(cs.ten)}, tài khoản Chatbot AI; Phiếu học tập số 1 và Bảng tiêu chí đánh giá.</p>
      <p><b>2. Học sinh:</b> Sách giáo khoa, vở ghi, máy tính cầm tay Casio fx-580VN X / fx-880BTG; thiết bị số cá nhân có kết nối Internet (dùng theo hướng dẫn của giáo viên).</p>
      <p class="h2"><b>III. TIẾN TRÌNH DẠY HỌC</b></p>`;

    /* phân bổ các mục kiến thức vào từng tiết */
    const md = B.md || []; const perTiet = Math.max(1, Math.ceil(md.length / soTiet));
    let idx = 0;
    for (let k = 0; k < soTiet; k++) {
      const cuoi = k === soTiet - 1;
      const mucs = md.slice(idx, cuoi ? md.length : idx + perTiet); idx += mucs.length;
      h += `<p class="h2b"><b>TIẾT ${tiets[k]}${mucs.length ? ": " + esc(mucs.map(m => m.t).join(" — ").toUpperCase()) : ": LUYỆN TẬP VÀ VẬN DỤNG"}</b></p>`;
      if (o.moDau !== false) h += hdMoDau(B, Object.assign({}, o, { phutMoDau: k === 0 ? 7 : 5 }));
      mucs.forEach(m => { h += hdKienThuc(B, o, md.indexOf(m)); });
      if (cuoi) {
        if (o.soAI !== false) h += hdSoAI(B, o);
        if (o.vanDung !== false) h += hdVanDung(B, o);
        if (o.veNha !== false) h += hdVeNha(B, o);
      } else {
        h += hd("HOẠT ĐỘNG 3. LUYỆN TẬP", 12, "Học sinh luyện tập, củng cố kiến thức vừa hình thành trong tiết.",
          [["<b>Bước 1: Chuyển giao nhiệm vụ.</b> Giáo viên giao bài luyện tập trong sách giáo khoa tương ứng phần vừa học.", "Học sinh làm bài cá nhân vào vở.", "Lời giải bài luyện tập.", "Rèn kĩ năng tính toán."],
           ["<b>Bước 2: Thực hiện nhiệm vụ.</b> Giáo viên theo dõi, hỗ trợ học sinh gặp khó khăn.", "Học sinh làm bài, trao đổi với bạn cùng bàn.", "Bài làm trong vở.", "Hợp tác học tập."],
           ["<b>Bước 3: Báo cáo, thảo luận.</b> Giáo viên gọi học sinh lên bảng chữa bài.", "Học sinh trình bày, lớp nhận xét.", "Bài chữa trên bảng.", "Giao tiếp toán học."],
           ["<b>Bước 4: Kết luận, nhận định.</b> Giáo viên chốt phương pháp và nhắc lỗi thường gặp.", "Học sinh sửa bài vào vở.", "Phương pháp giải được chốt.", "Cẩn thận, chính xác."]]);
      }
    }
    h += hoSo(B, o);
    if (o.kiDuyet !== false) {
      h += `<table class="ky"><colgroup><col style="width:34%"><col style="width:33%"><col style="width:33%"></colgroup>
        <tr><td class="center"><b>DUYỆT CỦA BAN GIÁM HIỆU</b></td><td class="center"><b>TỔ TRƯỞNG CHUYÊN MÔN</b></td><td class="center"><b>GIÁO VIÊN SOẠN</b></td></tr>
        <tr><td class="center" style="height:70px">&nbsp;</td><td class="center">${esc(o.toTruong || "")}</td><td class="center">${esc(o.gv || "")}</td></tr></table>`;
    }
    return h;
  }

  /* ---------------------------------------------------------------- Kế hoạch giáo dục (Phụ lục I và III) */
  function keHoach(lop, o) {
    o = o || {};
    const ds = dsBai(lop).filter(b => data(lop, b.bai));
    let tiet = 0; const rows = []; const chiTiet = []; let chuongHienTai = "";
    ds.forEach((b, i) => {
      const B = data(lop, b.bai); const st = B.t || 2;
      if (b.chuong !== chuongHienTai) { chuongHienTai = b.chuong; rows.push({ ch: `CHƯƠNG ${b.chuong}. ${b.tenChuong.toUpperCase()}` }); }
      const cs = CS[B.cs] || CS.geogebra;
      rows.push({ stt: i + 1, ten: `Bài ${b.bai}: ${b.ten}`, st, tl: `${st * 45} phút (${st} tiết × 45')`, yc: (B.yc || [])[0] || "", ma: `NLS ${(o.nls || ["3.2.NC1a"])[0]}; AI ${aiMa(lop, "C3.2")}, ${aiMa(lop, "A1.2")} (${cs.ten})` });
      for (let k = 1; k <= st; k++) { tiet++; chiTiet.push({ tiet, tuan: Math.ceil(tiet / (o.tietTuan || 3)), ten: `Bài ${b.bai}: ${b.ten} (Tiết ${k}/${st})`, pb: k === st ? "Khởi động (5') + Luyện tập, thực hành công cụ số và phản biện AI (25') + Vận dụng thực tiễn (10') + Tổng kết (5')" : "Khởi động (5') + Hình thành kiến thức (25') + Luyện tập (12') + Tổng kết (3')", cs: (CS[B.cs] || CS.geogebra).ten }); }
    });
    let h = `<p class="center"><b>${esc(o.so || "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. HỒ CHÍ MINH")}<br>${esc(o.truong || "")}<br>TỔ CHUYÊN MÔN: ${esc(o.to || "TOÁN – TIN HỌC")}</b></p>
      <p class="title"><b>KẾ HOẠCH GIÁO DỤC MÔN ${esc(lopTen(lop).toUpperCase())}</b></p>
      <p class="center">BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG — NĂM HỌC ${esc(o.namHoc || "20... – 20...")}<br>(Tổng ${tiet} tiết; ${o.tietTuan || 3} tiết/tuần; 45 phút/tiết)</p>
      <p><i>Căn cứ Công văn 5512/BGDĐT-GDTrH, Thông tư 02/2025/TT-BGDĐT về Khung năng lực số và Quyết định 2422/QĐ-BGDĐT về Khung năng lực trí tuệ nhân tạo.</i></p>
      <p class="h2"><b>PHỤ LỤC I — KẾ HOẠCH GIÁO DỤC THEO BÀI HỌC</b></p>
      <table class="hd"><colgroup><col style="width:5%"><col style="width:27%"><col style="width:7%"><col style="width:13%"><col style="width:28%"><col style="width:20%"></colgroup>
      <tr><th>STT</th><th>Bài học</th><th>Số tiết</th><th>Thời lượng</th><th>Yêu cầu cần đạt cốt lõi</th><th>Tích hợp NLS + AI</th></tr>`;
    rows.forEach(r => { h += r.ch ? `<tr><td colspan="6"><b>${esc(r.ch)}</b></td></tr>` : `<tr><td class="center">${r.stt}</td><td>${esc(r.ten)}</td><td class="center">${r.st}</td><td>${esc(r.tl)}</td><td>${T(r.yc)}</td><td>${esc(r.ma)}</td></tr>`; });
    h += `</table><div class="pagebreak"></div><p class="h2"><b>PHỤ LỤC III — PHÂN PHỐI CHƯƠNG TRÌNH CHI TIẾT (${tiet} TIẾT)</b></p>
      <table class="hd"><colgroup><col style="width:6%"><col style="width:7%"><col style="width:30%"><col style="width:40%"><col style="width:17%"></colgroup>
      <tr><th>Tuần</th><th>Tiết</th><th>Tên bài học / tiết dạy</th><th>Phân bổ hoạt động (phút)</th><th>Công cụ số</th></tr>`;
    chiTiet.forEach(c => { h += `<tr><td class="center">${c.tuan}</td><td class="center">${c.tiet}</td><td>${esc(c.ten)}</td><td>${esc(c.pb)}</td><td>${esc(c.cs)}</td></tr>`; });
    h += `</table><table class="ky" style="margin-top:14px"><colgroup><col style="width:34%"><col style="width:33%"><col style="width:33%"></colgroup>
      <tr><td class="center"><b>DUYỆT CỦA BAN GIÁM HIỆU</b></td><td class="center"><b>TỔ TRƯỞNG CHUYÊN MÔN</b></td><td class="center"><b>GIÁO VIÊN LẬP KẾ HOẠCH</b></td></tr>
      <tr><td class="center" style="height:70px">&nbsp;</td><td class="center">${esc(o.toTruong || "")}</td><td class="center">${esc(o.gv || "")}</td></tr></table>`;
    return h;
  }

  G.KHBD = { render, keHoach, dsBai, data, chuong, lopTen, NLS, AI, CS, aiMa };
})(window);
