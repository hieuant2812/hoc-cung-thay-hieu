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

## 4a. Dùng ngân hàng đề trên iPad / điện thoại (không phải đăng lại file .tex)

Ngân hàng nằm trong trình duyệt của từng máy, nên máy mới sẽ trống. Thay vì đăng lại các file .tex, hãy đặt **một gói ngân hàng đã mã hoá** lên chính trang web; máy nào cần thì tải về một lần.

**Bước 1 — trên máy tính (máy đang có ngân hàng).** Vào *Ra đề* → bước 1 → mở mục **📲 Dùng ngân hàng trên iPad / máy khác** → bấm **🔐 Tạo gói để đăng lên web** → đặt một mật khẩu (nhớ kĩ, ít nhất 6 kí tự). Trang tải về **một file** `nganhang-<ngày>.zip` (bên trong là thư mục `data` gồm `nganhang.json` và một hoặc vài file `nganhang….hcth`). Nếu trình duyệt không tự tải, bấm nút **⬇ Tải gói (1 file .zip)** hiện ngay bên dưới.

**Bước 2 — chọn một trong hai cách đưa sang iPad.**

- *Cách A — qua trang web (iPad nào cũng tự lấy được):* nhấp đúp file .zip để giải nén → được thư mục **`data`** → vào GitHub chọn *Add file → Upload files* → **kéo cả thư mục `data`** vào → *Commit changes*. Chờ 1–2 phút để trang cập nhật. Gói đã được nén và **mã hoá AES‑256** bằng mật khẩu của thầy nên để trên GitHub công khai vẫn an toàn.
- *Cách B — không cần GitHub:* gửi file .zip sang iPad (AirDrop, Zalo, Google Drive…), lưu vào ứng dụng Tệp.

**Bước 3 — trên iPad.** Mở trang → *Trang chủ* hoặc *Ra đề* → với cách A bấm **📥 Lấy ngân hàng về máy này**; với cách B bấm **📂 Nạp từ file (.zip hoặc .hcth)** rồi chọn chính file .zip. Nhập mật khẩu, vài giây là xong. Mật khẩu được nhớ sẵn nên lần sau không phải nhập lại.

- Khi ngân hàng có thay đổi: tạo gói mới, đăng đè lên 2 file cũ. Máy nào mở trang cũng thấy dòng nhắc **“có bản mới”**.
- Ngân hàng của máy nào vẫn nằm ở máy đó; gói trên web chỉ là bản sao để phát cho các máy. Máy tính vẫn là bản gốc.
- Không có mạng vẫn dùng được: ngân hàng đã nằm trong máy rồi.

### Cài trang web thành ứng dụng trên iPad (nên làm)

Safari **tự xoá dữ liệu của trang web sau khoảng 7 ngày không mở** — ngân hàng vừa tải về có thể mất. Chỉ cần cài trang vào Màn hình chính là dữ liệu được giữ lâu dài:

mở trang bằng **Safari** → nút **Chia sẻ** (hình ↑) → **Thêm vào MH chính** → Thêm.

Sau khi cài: có biểu tượng riêng, mở toàn màn hình như một ứng dụng, **dùng được cả khi không có mạng** (ra đề, chấm phiếu, xem mô phỏng), và iPad không xoá ngân hàng nữa. Trang sẽ tự nhắc việc này khi thầy mở bằng iPad.

## 4a2. Soạn kế hoạch bài dạy và kế hoạch giáo dục (`khbd.html`)

Trang **Soạn bài** dựng sẵn kế hoạch bài dạy theo **Công văn 5512**, có tích hợp **Khung năng lực số** (Thông tư 02/2025/TT-BGDĐT) và **Khung năng lực AI** (Quyết định 2422/QĐ-BGDĐT) — đúng bộ mã thầy đang dùng (NLS 3.2.NC1a, 5.2.NC1b…; AI 10/11/12.C3.2, A1.2, A3.1).

- Chọn lớp (Toán 10, 11, 12 và chuyên đề của cả ba khối) → chọn bài → tích các mục muốn đưa vào (hoạt động mở đầu, trải nghiệm công cụ số và phản biện AI, vận dụng thực tiễn, phiếu học tập, rubric, khung kí duyệt) → xem trước ngay bên phải.
- **⬇ Tải file Word**: ra file .docx đúng mẫu CV 5512 với đủ bảng bốn bước và bốn cột (có cột *NLS/AI – GDĐĐ/ANQP*). **Công thức toán là Equation của Word**, bấm vào sửa trực tiếp, không cần MathType.
- **⬇ Cả chương**: tải một lượt tất cả kế hoạch bài dạy của chương đang chọn, tiết PPCT tự đánh số nối tiếp.
- Thẻ **Kế hoạch giáo dục cả năm** dựng Phụ lục I (theo bài học) và Phụ lục III (phân phối chương trình từng tiết) từ chính số tiết của các bài, cũng xuất ra Word.

Dữ liệu bài học nằm ở `data/baihoc/t10.js`, `t11.js`, `t12.js`, `cd.js` — mỗi bài gồm yêu cầu cần đạt, mạch kiến thức, ví dụ mẫu có lời giải từng bước, bài toán thực tiễn, công cụ số và tình huống phản biện AI. Thầy cô sửa trực tiếp các file này là cả kế hoạch bài dạy lẫn bản trình chiếu đều đổi theo.

## 4a3. Bản trình chiếu trên lớp (`beamer.html`)

Soạn slide **Beamer** cho trọn một bài học, theo nguyên tắc trình chiếu: nền **bảng xanh – chữ phấn trắng**, chữ to, **lời giải hiện ra từng bước**.

**Nội dung lấy từ đâu**
- **Toán 10, Toán 12, Chuyên đề 12:** lấy thẳng từ **kế hoạch bài dạy của thầy** (các file Word đã gửi, trích sẵn vào `data/khbdgoc.js`). Mỗi tiết có slide mở đầu tiết; mỗi hoạt động có slide giới thiệu (tên, thời gian, mục tiêu) rồi **đủ 4 bước**: *Bước 1 Chuyển giao nhiệm vụ* (nhiệm vụ, ví dụ) → *Bước 2 Thực hiện nhiệm vụ* (việc học sinh làm, gợi ý) → *Bước 3 Báo cáo, thảo luận* (lời giải, kết quả hiện từng dòng) → *Bước 4 Kết luận, nhận định* (khung chốt kiến thức). Cuối mỗi tiết có hướng dẫn về nhà.
- Sau mỗi hoạt động hình thành kiến thức có thêm **ví dụ minh hoạ** với lời giải từng bước.
- **Toán 11** (chưa có file kế hoạch bài dạy của thầy): mỗi mục trong SGK thành một hoạt động 4 bước gồm câu hỏi khám phá, ví dụ có lời giải, khung chốt kiến thức và **bài luyện tập nhanh** có đáp số.
- **Hình vẽ minh hoạ** tự vẽ cho các bài hình học và đồ thị (vectơ, hệ thức lượng, đường tròn, ba đường conic, đường tròn lượng giác, hình chóp, hình hộp, góc – khoảng cách trong không gian, đồ thị hàm số, tiệm cận, diện tích hình phẳng, Oxyz, mặt phẳng, mặt cầu…).

**Cách dùng**
- Chọn lớp, bài; ô **Tiết dạy** cho phép xuất cả bài hoặc chỉ một tiết để chiếu đúng tiết đang dạy.
- Ba phối màu: bảng xanh, bảng đen, nền giấy; chọn tỉ lệ 16:9 hoặc 4:3 và cỡ chữ.
- Tích “Chèn câu luyện tập lấy từ ngân hàng đề” để chèn câu hỏi của đúng bài vào hoạt động Luyện tập (phương án đảo, đáp án hiện sau một nhịp).
- **⬇ Tải file .tex** (hoặc cả chương thành .zip) rồi mở bằng TeXShop/VS Code trên máy Mac, biên dịch bằng **XeLaTeX** (biên dịch 2 lần để thanh tiến trình ở chân trang chính xác).
- Muốn sửa nội dung slide: sửa trong file .tex, hoặc gửi lại kế hoạch bài dạy đã sửa để trích lại.

## 4a4. Trò chơi ôn tập trên lớp (`trochoi.html`)

Mười trò chơi chiếu lên màn hình cho cả lớp cùng tham gia, câu hỏi lấy thẳng từ ngân hàng đề trên máy (chọn lớp – chương – dạng – mức độ). Không cần mạng, không cần học sinh có điện thoại.

| Trò chơi | Cách chơi gọn |
|---|---|
| 🔔 Rung chuông vàng | Cả lớp viết đáp án ra bảng con, sai thì ngồi xuống; có một lượt cứu trợ; ai trụ lại cuối cùng thì thắng. |
| 💎 Ai là triệu phú | 15 câu từ dễ lên khó theo đúng mức NB → TH → VD → VDC, có 50:50 (phím 5), hỏi ý kiến lớp (phím L), gọi tổ trợ giúp (phím T). |
| 🧩 Lật mảnh ghép | Trả lời đúng mở một mảnh; đoán được từ khoá phía sau (phím K) được 30 điểm. Từ khoá do thầy cô tự đặt. |
| 🏎️ Đua xe tiếp sức | Mỗi câu đúng xe của tổ tiến một ô, câu vận dụng cao tiến hai ô; về đích trước thì thắng. |
| 🎡 Vòng quay may mắn | Quay trúng ô nào trả lời câu tương ứng; có ô nhân đôi, mất lượt, đổi tổ, câu khó +50; kèm nút gọi tên học sinh ngẫu nhiên. |
| 🎱 Bingo đáp án | In phiếu Bingo cho cả lớp (mỗi phiếu xáo khác nhau), thầy cô đọc câu, học sinh tính rồi đánh dấu ô đáp án. Cần câu trả lời ngắn. |
| 🐝 Ong tìm mật | Mỗi câu đúng ong bay lên một tầng, tổ nào tới hũ mật trước thì thắng. |
| 🏔️ Đường lên đỉnh | Bốn vòng: Khởi động, Vượt chướng ngại vật, Tăng tốc (trả lời càng nhanh điểm càng cao), Về đích chọn gói 10/20/30. |
| 🃏 Lật thẻ ghi nhớ | Lật hai thẻ để ghép câu hỏi với đáp án; ghép trúng được 20 điểm và đi tiếp, sai thì chuyển lượt. |
| 🗺️ Truy tìm kho báu | Vượt từng chặng trên bản đồ, càng về cuối điểm mỗi chặng càng cao. |

- Trước khi chơi: mở mục **Chuẩn bị**, chọn nguồn câu hỏi, đặt thời gian mỗi câu, sĩ số, số tổ và tên tổ (có chọn màu), từ khoá mảnh ghép, dán danh sách lớp.
- Trong lúc chơi: **Space** hiện đáp án, **Enter** sang câu tiếp, **G** xem lời giải, **1–4** hoặc **A–D** chọn phương án, **1–6** chấm điểm cho tổ, **Esc** thoát. Máy tự chiếu toàn màn hình.
- Điểm của các tổ hiện ngay trên đầu màn hình, cuối trò có bảng xếp hạng và được lưu lại trong máy.

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
  - Mục **Sổ tay kiến thức** có hai phần:
    - **📚 Theo bài học** (Toán 10, 11, 12): bấm vào bài ở cột trái để hiện *tóm tắt lí thuyết* và *5 dạng bài tập tiêu biểu* (phương pháp, ví dụ, nút “Xem lời giải mẫu”). Cuối mỗi chương có **🧠 Sơ đồ tư duy** tổng hợp kiến thức chương.
    - Nút **⬇ Tải PDF phần đang xem** (bài: khổ A4 dọc, lời giải hiện đầy đủ; sơ đồ: A4 ngang), **🖼 Tải ảnh sơ đồ (PNG)** và **🖨 In**. Mọi trang in/PDF có chân trang “GV: ThS Nguyễn Hoàng Minh Hiếu - GV Toán THPT An Nhơn Tây”.
    - Gửi học sinh đường link thẳng tới một bài, ví dụ `luyentap.html#st/12/b13` (Toán 12, bài 13) hoặc sơ đồ chương `luyentap.html#st/11/c7`.
    - Nội dung dạng bài nằm trong `data/sotaybai-10.js`, `-11.js`, `-12.js` (viết dạng văn bản: `@số bài`, `m:` ý chính sơ đồ, `# tên dạng`, `p:` phương pháp, `d:` đề, `g:` từng bước giải) — thầy sửa, thêm trực tiếp được.
    - **⚡ Tra công thức nhanh**: sổ tay công thức theo chương như trước, tìm kiếm được.
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

## 4a5. Học sinh dự thi bằng điện thoại (quét QR chọn tên)

Ba trò **Rung chuông vàng**, **Đua xe tiếp sức**, **Ai là triệu phú** cho phép cả lớp dự thi bằng điện thoại: các em quét mã QR hiện trên màn chiếu, chọn đúng tên mình trong danh sách lớp rồi bấm đáp án. Máy chấm tự động, thầy cô không phải đếm tay.

### Chuẩn bị (làm một lần)

1. Tải cả thư mục web về máy (máy Mac của thầy cô).
2. Mở **Terminal**, chuyển vào thư mục đó rồi chạy:

```bash
cd ~/Downloads/hoc-cung-thay-hieu     # đường dẫn tới thư mục web
python3 maychu.py
```

3. Cửa sổ Terminal in ra địa chỉ, ví dụ `http://192.168.1.12:8080/trochoi.html`. **Mở địa chỉ đó bằng trình duyệt trên máy thầy cô** (không mở bằng cách nhấp đúp vào file).
4. Máy thầy cô và điện thoại học sinh phải **dùng chung một wifi** (wifi nhà trường hoặc phát 4G từ điện thoại thầy cô).
5. Muốn dừng máy chủ: bấm `Ctrl + C` trong Terminal.

> Không chạy máy chủ thì web vẫn dùng bình thường, 10 trò chơi vẫn chơi được theo cách tính điểm cho tổ.

### Khi tổ chức trò chơi

1. Vào **Trò chơi**, phần *Chuẩn bị*:
   - Dán danh sách lớp vào ô “Danh sách lớp”, mỗi dòng một em, muốn chia tổ thì ghi `Nguyễn Văn An, Tổ 1`.
   - Hoặc bấm **📄 Nạp từ Excel / CSV** rồi chọn file `.xlsx` xuất từ sổ điểm (web tự tìm cột *Họ và tên* và cột *Tổ*).
   - Tích **“Học sinh dự thi bằng điện thoại”**. Dòng chữ xanh phía trên cho biết đã nối được với máy chủ hay chưa.
   - Bỏ tích “Gửi cả đề lên điện thoại” nếu muốn các em nhìn đề trên màn chiếu, điện thoại chỉ còn 4 nút A, B, C, D.
2. Chọn câu hỏi như bình thường rồi bấm vào trò chơi → màn hình hiện **mã QR cỡ lớn và mã phòng 4 chữ số**.
3. Các em quét QR, chọn tên mình. Màn chiếu đếm số em đã vào.
4. Bấm **Bắt đầu thi** (hoặc Enter).
5. Mỗi câu: màn chiếu hiện đề, điện thoại hiện các phương án. Khi đủ số em trả lời, máy tự công bố đáp án kèm biểu đồ số em chọn mỗi phương án.
   - *Rung chuông vàng*: bạn nào sai sẽ tự dừng cuộc chơi, màn chiếu hiện tên; còn ≤ 3 bạn thì có lượt cứu trợ cho cả lớp trở lại.
   - *Đua xe tiếp sức*: tổ có bạn trả lời đúng tiến 1 ô, tổ **cả tổ cùng đúng** được thưởng thêm 1 ô.
   - *Ai là triệu phú*: trợ giúp “hỏi ý kiến lớp” (phím `L`) lấy đúng số liệu bình chọn của lớp.
6. Điểm mỗi em tính theo độ chính xác **và tốc độ** (trả lời sớm được nhiều điểm hơn). Kết thúc có bảng xếp hạng 15 bạn dẫn đầu.

### Vài lưu ý

- Tên trong danh sách không cần gõ dấu chính xác tuyệt đối, máy so khớp không phân biệt hoa thường và dấu.
- Một tên chỉ vào được một máy; em nào lỡ thoát thì mở lại link cũ là tiếp tục được.
- Danh sách lớp và kết quả chỉ nằm trong bộ nhớ máy thầy cô, tắt máy chủ là xoá hết, không gửi đi đâu.

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
