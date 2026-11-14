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

## 4. Phiếu trả lời & chấm bằng điện thoại

- Trang **Phiếu & chấm** (`phieu.html`): chọn 1 trong 5 mẫu phiếu (15 phút khổ A5; 45, 60 phút in A4 hoặc thu nhỏ A5; Toán 90 phút 12–4–6; Lí/Hoá 50 phút 18–4–6), điền trường – kì kiểm tra rồi in (tỉ lệ 100%).
- Ứng dụng chấm (`cham.html`) chạy ngay trên trình duyệt điện thoại (Safari/Chrome), không cần cài đặt. Cần mở qua địa chỉ https (GitHub Pages) để dùng được camera.
- Nạp đáp án: trang Ra đề → bước 4 → mục **Chấm bằng điện thoại** có mã QR; quét bằng camera điện thoại là mở ứng dụng và nạp sẵn đáp án mọi mã đề. Cũng có thể mở file `DapAn_ChamDienThoai.json` (có trong gói đề) hoặc nhập đáp án bằng tay.
- Chấm: đưa trọn 4 ô vuông đen của phiếu vào khung, giữ yên khoảng nửa giây — máy tự chụp, đọc SBD, mã đề, chấm theo thang điểm Bộ (khoảng 1 giây một phiếu, camera không bị đứng). Phiếu không cần nằm giữa khung, xoay ngang hay lộn ngược đều được.
- **Tự lưu khi đọc rõ** (bật sẵn): phiếu đọc rõ — mã đề có trong đáp án, SBD đủ, không tô trùng — được lưu ngay, máy báo điểm rồi chờ phiếu tiếp. Phiếu có vấn đề thì dừng lại để kiểm tra ảnh (xanh = đúng, đỏ = sai, xanh dương = đáp án), sửa SBD/mã đề rồi bấm "Lưu và chấm phiếu tiếp". Tắt ô này nếu muốn xem từng phiếu.
- **Phiếu A5 chưa cắt** (2 phiếu trên một tờ A4 ngang): chụp cả tờ, máy chấm và lưu cả 2 phiếu.
- **📸 Chụp ảnh nét**: mở máy ảnh của điện thoại (nét hơn khung hình video) — dùng khi chỗ tối hoặc phiếu khó đọc. **🖼 Chấm từ ảnh có sẵn**: chọn nhiều ảnh cùng lúc (chụp trước cả lớp rồi chấm một lượt).
- Phiếu không đọc được: máy rung, báo lí do (thiếu góc, sai mẫu phiếu…) và giữ lại ảnh. Bấm “📤 Tải ảnh chưa đọc được” để gửi kiểm tra.
- Kết quả lưu trong điện thoại; mục Kết quả có thống kê, tải Excel/CSV, dán danh sách lớp (SBD – Họ tên) để hiện tên.

- **In phiếu**: nút “⬇ Tải PDF khổ A4 để in” tạo file PDF khổ A4. Phiếu khổ A5 (15 phút, hoặc phiếu 45 hoặc 60 phút thu nhỏ) được ghép 2 phiếu trên 1 tờ A4 ngang, có đường cắt ở giữa. Khi in chọn tỉ lệ 100%, rồi cắt đôi tờ giấy.
- Phiếu **kèm tự luận**: ở trang Phiếu & chấm tích “Kèm phần tự luận ở mặt sau”. Mặt sau kẻ dòng chấm, có ô điểm tự luận và chữ kí giám khảo. In 2 mặt (A4 dọc lật theo cạnh dài; A5 – 2 phiếu/tờ lật theo cạnh ngắn). Máy chỉ chấm mặt trước.

## 4b. Phân tích kết quả và đề ôn tập theo chỗ yếu
- Trên điện thoại: mục **📈 Phân tích** trong ứng dụng chấm, gồm:
  - tổng quan, phổ điểm, so sánh các lớp làm cùng đề;
  - tỉ lệ đúng theo dạng, theo mức độ và từng câu;
  - những câu nhiều em cùng chọn một phương án sai.
- Trên máy tính (bảng lớn, xem nội dung câu sai, in báo cáo, tải Excel):
  1. Trên điện thoại bấm **Gửi kết quả sang máy tính**.
  2. Chuyển file `KetQua_….json` qua Zalo, Drive hoặc email.
  3. Kéo thả file vào trang **Phân tích**.
- **Phân tích theo dạng** cần “thông tin câu hỏi” (mã câu, dạng, mức):
  - Có sẵn khi phân tích trên máy tính đã ra đề, hoặc khi bài được nạp bằng file `DapAn_ChamDienThoai.json`.
  - Bài nạp bằng mã QR thì bấm “Gắn thông tin câu hỏi” và chọn file `DapAn_ChamDienThoai.json` trong gói đề.
- **So sánh lớp**: mỗi lớp là một bài riêng, cùng đáp án (quét lại cùng mã QR). Đặt tên lớp rồi tích các lớp cần so sánh.
- **Đề ôn tập theo chỗ yếu**: ở trang Phân tích chọn số dạng yếu và số câu từng phần, rồi bấm **Sinh đề ôn tập**.
  - Trang Ra đề tự lập ma trận cho các dạng có tỉ lệ đúng thấp nhất, ưu tiên câu chưa dùng, rồi sinh đề.
  - Thầy tải gói .zip, trong đó có đề, đáp án và lời giải.
  - Nút “Trả lại ma trận trước đó” khôi phục ma trận đang soạn dở.

## 4c. Sao lưu một chạm
- Có ở trang chủ, trang Ra đề (bước 1), trang Phân tích và ứng dụng chấm (mục Bài kiểm tra).
- **Sao lưu toàn bộ** tải về một file `SaoLuu_HocCungThayHieu_<ngày>.zip`, gồm:
  - ngân hàng đề;
  - mẫu ma trận;
  - các đề đã ra (thông tin câu hỏi);
  - bài chấm, kết quả, danh sách lớp;
  - cài đặt.
- Thầy cất file vào Google Drive. Đổi máy thì chọn **Khôi phục từ file** và chọn đúng file .zip đó, không cần giải nén.
- Dữ liệu được **gộp**, không xoá dữ liệu đang có.

## 4d. Trên lớp (`tren-lop.html`)
- **Trình chiếu câu hỏi**:
  - Chọn môn, lớp, dạng, mức độ và số câu từ ngân hàng trên máy.
  - Câu hiện chữ to, có đồng hồ đếm ngược cho mỗi câu và nút hiện đáp án, lời giải. Nút ⟳ thay câu khác cùng dạng, cùng mức.
  - Phím tắt: → câu sau, ← câu trước, A đáp án, L lời giải, T đồng hồ, +/− cỡ chữ, F toàn màn hình.
  - Dưới câu hỏi có đường dẫn sang các mô phỏng cùng chương.
- **Phiếu học tập (QR)**: chọn câu và bấm “Tạo phiếu”, rồi in.
  - Mã QR trên phiếu mở trang đáp số (`dapan.html`) ngay trên điện thoại học sinh.
  - Có thêm bản đáp án và lời giải cho giáo viên.
- **Gọi tên ngẫu nhiên, chia nhóm**: dán danh sách lớp, mỗi dòng một tên.
- **Đồng hồ**: đếm ngược hoặc bấm giờ, có chế độ toàn màn hình.
- **Bảng vẽ**: nền trắng, lưới, hệ trục Oxy hoặc kẻ dòng. Vẽ được đồ thị `y = f(x)` (nhiều hàm, ngăn cách bằng dấu `;`), có tẩy, đoạn thẳng và lưu ảnh.
- **Liên kết với mô phỏng**:
  - Mỗi thẻ mô phỏng (Toán, Lí, Hoá lớp 10–12) có nút “🎯 Chiếu 5 câu luyện tập”, lấy câu từ các dạng liên quan.
  - Cây ngân hàng ở trang Ra đề hiện các mô phỏng của từng chương.

## 4e. Tự học (`luyentap.html`)
- **Học sinh**:
  - Chọn bộ luyện tập, rồi chọn dạng và mức độ, làm trên điện thoại. Mỗi câu được chấm ngay và có lời giải.
  - Máy lưu tiến độ theo từng dạng.
  - Mục **Sổ tay công thức** có Toán 10, 11, 12 theo chương, tìm kiếm được.
- **Giáo viên** (tab “Giáo viên: tạo bộ luyện tập”):
  - Chọn câu từ ngân hàng. Nên bỏ các câu đã dùng trong đề kiểm tra.
  - Bấm nút tạo: máy tải về `LT_….json` và `index.json`.
  - Tải **cả hai** file lên thư mục `data/luyentap/` của kho GitHub. Cũng có thể gửi file `LT_….json` cho học sinh mở trực tiếp.
- Lưu ý: bộ luyện tập đưa lên mạng là công khai, nên chỉ chọn câu dành riêng cho luyện tập.

## 4f. Công việc chuyên môn
- **Ma trận và bản đặc tả theo mẫu Phụ lục Công văn 7991/BGDĐT-GDTrH**:
  - Lấy ở trang Ra đề, bước 2, nút “⬇ Word (CV 7991)”. File này cũng có trong gói đề .zip.
  - Khổ ngang, gồm cột TNKQ (nhiều lựa chọn, Đúng – Sai, trả lời ngắn), cột Tự luận và cột Tổng. Mức VD cao được tính vào cột Vận dụng.
  - Khi đã sinh đề, bản đặc tả ghi số thứ tự câu (C1, C2…). Cột “Yêu cầu cần đạt” có sẵn dòng gợi ý, thầy chỉnh lại trong Word.
- **Đề thi tốt nghiệp nhiều khối**:
  - Trang Ra đề, tab lớp “🎓 Thi tốt nghiệp (nhiều khối)”: tích các khối 10, 11, 12 cần đưa vào đề.
  - Ở bước 2, chọn dạng và mức độ như bình thường.
- **Phiếu mẫu Bộ** (trang Phiếu & chấm): bố cục như phiếu thi tốt nghiệp, gồm 40 câu, 8 câu Đúng/Sai và 6 câu trả lời ngắn. Máy chấm tự nhận loại phiếu.
- **Sổ điểm theo lớp** (trang Phân tích, tab “Sổ điểm”):
  - Gom mọi bài đã chấm cùng tên lớp. Đặt được hệ số cho từng bài, có điểm trung bình, tải Excel được.
- **Xếp hạng toàn khối** (tab “Xếp hạng”):
  - Gom mọi lớp làm cùng một đề, xếp hạng học sinh và các lớp, có phổ điểm, tải Excel được.

## 5. Định dạng câu hỏi trong ngân hàng

```latex
%% Dạng: Tên dạng toán (dòng này đặt tên dạng trong ma trận)
\cauTN[id=T10-C1-B1-D01-NB-001,muc=NB,loigiai={...}]{Đề bài}{Đáp án đúng}{Sai 1}{Sai 2}{Sai 3}
\cauDS[id=...-TH-001,muc=TH,loigiai={...}]{Đề bài}{\y{Ý a}{d} \y{Ý b}{s} \y{Ý c}{d} \y{Ý d}{s}}
\cauTLN[id=...-VD-001,muc=VD,loigiai={...}]{Đề bài}{2,5}
```

- Trong mã câu, `C…-B…-D…` là chương, bài, dạng.
- `muc` nhận một trong các giá trị NB, TH, VD, VDC.
- Ở `\cauTN`, phương án đầu tiên là đáp án đúng; web tự đảo thứ tự phương án.

## 6. Sửa thông tin, thêm nội dung

- `config.js`: tên web, khẩu hiệu, dòng chân trang, thông tin điền sẵn cho đầu đề.
- `data/chuongtrinh.js`: tên chương, bài theo SGK Kết nối tri thức. Muốn thêm lớp hoặc môn mới thì thêm một khối theo mẫu có sẵn.
- `data/sims.js` và thư mục `sims/`: danh sách và các trang mô phỏng.
