# Học cùng Thầy Hiếu — hướng dẫn

Website có 2 phần:

- **Mô phỏng**: 99 trang mô phỏng Toán (6–12), KHTN (6–9), Vật lí và Hoá học (10–12).
- **Ra đề kiểm tra**: đăng ngân hàng đề LaTeX, lập ma trận, sinh nhiều mã đề, xuất TeX/PDF kèm đáp án.

Web chạy hoàn toàn trên trình duyệt (Chrome, Edge, Safari; dùng được trên Mac và Windows). Không cần máy chủ, không cần Google Apps Script.

## 1. Xem thử trên máy

Giải nén, mở `index.html` bằng Chrome. Phần Mô phỏng chạy được ngay. Phần Ra đề cũng chạy được khi mở trực tiếp file, nhưng ổn định nhất là khi web đã đưa lên GitHub (mục 2).

## 2. Đưa lên mạng (GitHub Pages, miễn phí)

1. Tạo tài khoản ở **github.com**. Cài **GitHub Desktop** (desktop.github.com) và đăng nhập.
2. GitHub Desktop: *File → New repository* → tên `hoc-cung-thay-hieu` → *Create repository*.
3. *Repository → Show in Finder/Explorer*. Chép **toàn bộ nội dung** thư mục web vào đó, sao cho `index.html` nằm ngay trong thư mục.
4. Quay lại GitHub Desktop: gõ mô tả ở ô *Summary* → *Commit to main* → *Publish repository*. Bỏ tích ô *Keep this code private*.
5. Trên github.com: mở kho → *Settings → Pages* → *Branch*: `main`, `/ (root)` → *Save*.
6. Sau 2–3 phút, web có địa chỉ dạng `https://<tên-tài-khoản>.github.io/hoc-cung-thay-hieu/`.

**Không cài GitHub Desktop?** Làm ngay trên github.com: tạo kho mới (*New repository*, chọn *Public*, tích *Add a README file*) → *Add file → Upload files*. Mỗi lần tải tối đa 100 file, nên chia 3 lượt: (1) 5 file ở ngoài cùng + thư mục `assets` + thư mục `data`; (2) thư mục `sims`; (3) thư mục `thumbs`. Mỗi lượt bấm *Commit changes*. Sau đó bật *Settings → Pages* như bước 5.

**Cập nhật trên github.com (khi Claude gửi "gói cập nhật"):** giải nén gói → mở kho trên github.com, đứng ở trang gốc của kho → *Add file → Upload files* → kéo **tất cả những gì nằm trong** thư mục gói cập nhật (file lẻ và thư mục `assets`…) vào → *Commit changes*. File trùng tên được thay mới, các file khác giữ nguyên. Đợi 1–2 phút, mở web và bấm Ctrl+F5 (Mac: ⌘+Shift+R).

Mỗi lần cập nhật bằng GitHub Desktop: chép file mới vào thư mục → GitHub Desktop → *Commit* → *Push origin*.

> **Không chép file ngân hàng đề (.tex, .zip) vào thư mục web.** Kho để công khai nên ai cũng tải được, kể cả đáp án.

## 3. Ra đề kiểm tra

**Bước 1 – Ngân hàng đề.**
- Chọn môn và lớp, rồi kéo thả file `.tex`, file `.zip` (kể cả zip lồng nhau) hoặc cả thư mục.
- Web tự nhận lớp theo mã câu (`T10-…`, `T11-…`) hoặc theo dòng đầu file (`Ngân hàng đề Toán 12`).
- Ngân hàng được lưu trong trình duyệt của máy đang dùng. Sang máy khác thì đăng lại các file zip.

**Bước 2 – Ma trận.**
- Chọn chương, đặt cấu trúc (Toán 12–4–6, Lí/Hoá 18–4–6) và tỉ lệ mức độ.
- Bấm **Gợi ý ma trận tự động**, rồi sửa số câu ở từng ô theo ý muốn.
- Ô báo đỏ là chỗ ngân hàng không đủ câu.
- Có thể lưu ma trận thành mẫu để dùng lại, và in hoặc tải Excel ma trận kèm bảng đặc tả.

**Bước 3 – Thông tin đề.**
- Điền sở, trường, kì kiểm tra, năm học, thời gian.
- Chọn cách sinh đề:
  - *Một đề gốc → trộn nhiều mã*: các mã dùng chung câu hỏi, chỉ đảo thứ tự câu và phương án.
  - *Mỗi mã một bộ câu khác*: các mã cùng dạng, cùng mức độ ở mỗi vị trí nhưng khác số liệu.
- Tuỳ chọn đảo thứ tự ý a), b), c), d) ở Phần II.
- Tuỳ chọn ưu tiên câu chưa dùng ở các đề đã xuất trước đó.

**Bước 4 – Sinh và xuất.**
- Xem trước từng mã đề. Bấm **⟳ Đổi câu** để thay một câu bằng câu khác cùng dạng, cùng mức độ.
- **Tải gói đề (.zip)** có 2 lựa chọn: *PDF + TeX* hoặc *chỉ TeX*.
- Trong gói có:
  - từng mã đề;
  - file tất cả mã đề, có bảng đáp án tổng hợp ở cuối;
  - bảng đáp án;
  - lời giải chi tiết;
  - đề gốc;
  - ma trận (Excel).
- File `.tex` biên dịch bằng **XeLaTeX** (chạy 2 lần để số trang hiện đúng).

**Thang điểm** (Bộ GD&ĐT, từ năm 2025):

| Phần | Cách tính điểm |
|---|---|
| Phần I | 0,25 điểm/câu |
| Phần II | Đúng 1/2/3/4 ý: 0,1/0,25/0,5/1 điểm |
| Phần III | Toán 0,5 điểm/câu; Lí, Hoá 0,25 điểm/câu |

## 4. Định dạng câu hỏi trong ngân hàng

```latex
%% Dạng: Tên dạng toán (dòng này đặt tên dạng trong ma trận)
\cauTN[id=T10-C1-B1-D01-NB-001,muc=NB,loigiai={...}]{Đề bài}{Đáp án đúng}{Sai 1}{Sai 2}{Sai 3}
\cauDS[id=...-TH-001,muc=TH,loigiai={...}]{Đề bài}{\y{Ý a}{d} \y{Ý b}{s} \y{Ý c}{d} \y{Ý d}{s}}
\cauTLN[id=...-VD-001,muc=VD,loigiai={...}]{Đề bài}{2,5}
```

- Trong mã câu, `C…-B…-D…` là chương, bài, dạng.
- `muc` nhận một trong các giá trị NB, TH, VD, VDC.
- Ở `\cauTN`, phương án đầu tiên là đáp án đúng; web tự đảo thứ tự phương án.

## 5. Sửa thông tin, thêm nội dung

- `config.js`: tên web, khẩu hiệu, dòng chân trang, thông tin điền sẵn cho đầu đề.
- `data/chuongtrinh.js`: tên chương, bài theo SGK Kết nối tri thức. Muốn thêm lớp hoặc môn mới thì thêm một khối theo mẫu có sẵn.
- `data/sims.js` và thư mục `sims/`: danh sách và các trang mô phỏng.
