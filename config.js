/* ==================== THÔNG TIN WEBSITE — sửa ở đây là đổi trên mọi trang ==================== */
window.SITE = {
  tenWeb: "Học cùng Thầy Hiếu",
  khauHieu: "Đường không đi không đến, học không hành không thành.",
  tacGia: "Nguyễn Hoàng Minh Hiếu",
  hocVi: "ThS.",
  truong: "Trường THPT An Nhơn Tây",
  chanTrang: "Phát triển bởi Thầy Hiếu - GV Toán Trường THPT An Nhơn Tây - TP.HCM",
  namBatDau: 2026,
  phienBan: "2026.11.27",   // đổi số này mỗi lần đăng bản mới → máy học sinh tự cập nhật bộ đệm

  /* Địa chỉ web công khai — dùng để tạo mã QR cho học sinh vào trò chơi qua Internet */
  diaChiWeb: "https://hieuant2812.github.io/hoc-cung-thay-hieu/",

  /* Web riêng cho học sinh (kho hoc-cung-Thay-Hieu-HS): trang Tự học có nút mở và mã QR gửi cho lớp. Để trống thì ẩn. */
  webHS: "https://hieuant2812.github.io/hoc-cung-Thay-Hieu-HS/",

  /* Kết nối học sinh – giáo viên: dán URL ứng dụng web Apps Script (đuôi /exec) vào đây.
     Để trống thì web vẫn chạy, kết quả học sinh chỉ lưu trên máy của em đó. Xem trang lophoc.html. */
  lopHoc: { url: "" },

  /* Máy chủ Apps Script của web học sinh (đuôi /exec) — trang Quản lí lớp (quanly.html) dùng địa chỉ này.
     Phải giống mayChu trong config.js của web học sinh. */
  mayChu: "https://script.google.com/macros/s/AKfycbyNUNV3AfluOXgWvZ7IxXUUApH1KwtghaoS-zbFhI1hVWqo2K3aoc4lgArX7HLECbPg/exec",

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
