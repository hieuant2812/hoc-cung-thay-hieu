/* ==================== THÔNG TIN WEBSITE — sửa ở đây là đổi trên mọi trang ==================== */
window.SITE = {
  tenWeb: "Học cùng Thầy Hiếu",
  khauHieu: "Đường không đi không đến, học không hành không thành.",
  tacGia: "Nguyễn Hoàng Minh Hiếu",
  hocVi: "ThS.",
  truong: "Trường THPT An Nhơn Tây",
  chanTrang: "Phát triển bởi Thầy Hiếu - GV Toán Trường THPT An Nhơn Tây - TP.HCM",
  namBatDau: 2026,
  phienBan: "2026.11.22",   // đổi số này mỗi lần đăng bản mới → máy học sinh tự cập nhật bộ đệm

  /* Địa chỉ web công khai — dùng để tạo mã QR cho học sinh vào trò chơi qua Internet */
  diaChiWeb: "https://hieuant2812.github.io/hoc-cung-thay-hieu/",

  /* Kết nối học sinh – giáo viên: dán URL ứng dụng web Apps Script (đuôi /exec) vào đây.
     Để trống thì web vẫn chạy, kết quả học sinh chỉ lưu trên máy của em đó. Xem trang lophoc.html. */
  lopHoc: { url: "" },

  /* Trò chơi thi qua Internet (giống Kahoot): mặc định dùng máy chủ trung gian MQTT công cộng, không cần cài đặt.
     Nếu wifi trường chặn, có thể thay danh sách máy chủ wss:// khác ở đây (để trống = dùng mặc định). */
  troChoi: { mayChu: [] },

  /* Giá trị điền sẵn ở bước "Thông tin đề" (thầy vẫn sửa được trên trang) */
  de: {
    so: "SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH",
    truong: "TRƯỜNG THPT AN NHƠN TÂY",
    namHoc: "2026 – 2027"
  }
};
