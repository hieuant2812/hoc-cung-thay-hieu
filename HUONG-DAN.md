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
  - Đã sửa lỗi **mất dấu vectơ, dấu căn** khi chiếu (do quy tắc hiển thị hình TikZ đè lên công thức).
  - **✏️ Ghi bảng — viết trực tiếp lên câu đang chiếu** (nút ở góc dưới trái), khỏi phải chụp màn hình rồi dán sang app ghi chú:
    - Dùng chuột, ngón tay hoặc Apple Pencil. Khi đã dùng bút, ngón tay sẽ dùng để cuộn trang.
    - Có bút 6 màu, 3 độ dày, bút dạ quang, thước kẻ đoạn thẳng (tự hít góc 15°), tia laser tự mờ, tẩy từng nét, hoàn tác, xoá trang, ẩn/hiện nét.
    - **Bảng trắng** (có lưới ô vuông) để nháp, và nút 📷 lưu ảnh câu hỏi kèm nét viết.
    - Nét vẽ gắn với từng câu: chuyển câu rồi quay lại vẫn còn; đổi cỡ chữ hay cuộn thì nét đi theo nội dung.
    - Phím tắt: B bút, H dạ quang, R thước, K laser, E tẩy, W bảng trắng, X xoá trang, Ctrl/⌘+Z hoàn tác, Esc tắt bút.
  - **Hình minh hoạ tự động** cho câu hình học chưa có hình (khoảng 1.500 câu trong ngân hàng 10–12):
    - Web đọc đề rồi tự vẽ: hình chóp, tứ diện, lăng trụ, lập phương, hình hộp, tam giác, hình bình hành, hình vuông, hình chữ nhật, hình thoi, hình thang, lục giác đều.
    - Có trung điểm, trọng tâm, tâm, điểm chia theo tỉ số, chân đường cao, hình chiếu, giao điểm, đường tròn ngoại tiếp/nội tiếp, góc cho trong đề.
    - Cạnh khuất vẽ nét đứt theo đúng mặt bị che.
    - Chỉ đọc phần đề, không đọc phương án nên không lộ đáp án.
    - Câu cho toạ độ (Oxy, Oxyz) không vẽ. Câu đã có hình TikZ giữ nguyên hình gốc.
    - Hình hiện ở Trình chiếu, Tự học, Trò chơi và trên điện thoại học sinh.
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
    - **Hình vẽ minh hoạ**: phần lí thuyết có hình của bài; các dạng hình học, đồ thị, xác suất (sơ đồ cây) có hình đặt cạnh ví dụ — thêm, sửa trong `data/hinhve-sotay.js`.
    - Học sinh bấm **☐ Đánh dấu đã học** / **🔁 Cần ôn lại** ở đầu mỗi bài; cột trái hiện ✅ và tiến độ từng chương.
    - **⚡ Tra công thức nhanh**: sổ tay công thức theo chương như trước, tìm kiếm được.
- **Giáo viên** (tab “Giáo viên: tạo bộ luyện tập”):
  - Chọn câu từ ngân hàng. Nên bỏ các câu đã dùng trong đề kiểm tra.
  - Bấm nút tạo: máy tải về `LT_….json` và `index.json`.
  - Tải **cả hai** file lên thư mục `data/luyentap/` của kho GitHub. Cũng có thể gửi file `LT_….json` cho học sinh mở trực tiếp.
- Lưu ý: bộ luyện tập đưa lên mạng là công khai, nên chỉ chọn câu dành riêng cho luyện tập.

## 4e1. Tài liệu học tập — đề cương theo bài (`tailieu.html`)

Đề cương Toán 10, 11, 12 của thầy (trích từ file TeX) đặt ở mục **Tài liệu** trên thanh menu.

- **Học sinh** chỉ thấy **bản học sinh**: lí thuyết có chỗ trống để điền (đường chấm), ví dụ minh hoạ, bài tập luyện tập, câu hỏi trắc nghiệm, đề ôn tập chương — **không có** nội dung chỗ điền, lời giải, đáp số, đáp án. Trên web chỉ đăng file bản học sinh (`data/decuong/hs-*.json`), nên học sinh không thể xem được đáp án kể cả khi mở mã nguồn trang.
- Mỗi bài, mỗi đề có nút **🖨 In** và **⬇ Tải PDF** (chân trang “GV: ThS Nguyễn Hoàng Minh Hiếu - GV Toán THPT An Nhơn Tây”). Link thẳng tới một bài: `tailieu.html#12/b13`, đề ôn chương: `tailieu.html#12/o4`.
- **Giáo viên** bấm **🔑 Giáo viên** (cột trái) → có nút chuyển **Bản học sinh / Bản giáo viên** và chọn nguồn:
  - *Đề cương đã đăng trên web*: bấm **🔑 Mở bản giáo viên đã đăng**, nhập mật khẩu → xem bản đầy đủ (chỗ điền tô đỏ, lời giải, đáp án, bảng đáp án đề ôn) trên bất kì máy nào.
  - *Đề cương đang soạn trên máy này*: bản đang sửa, chỉ có trên trình duyệt của máy thầy.

**Mỗi năm học — sửa, thêm rồi xuất bản (giống thêm ngân hàng đề):**
1. Tài liệu → 🔑 Giáo viên → **✏️ Soạn & xuất bản đề cương**. Nhập **Năm học**.
2. **📂 Nạp file TeX / zip**: chọn các file zip đề cương thầy đang có (nạp cùng lúc được nhiều zip; file bìa, file chính tự bỏ qua). Nhớ nạp **đủ cả học kì I và II**.
3. Bấm tên file để mở: bên trái sửa mã TeX, bên phải xem trước **bản GV / bản HS** ngay khi gõ; tự lưu. **＋ Thêm bài mới** tạo khung bài đúng mẫu của từng lớp.
4. Hình TikZ có sẵn hiện ngay. Hình TikZ **mới** hiện ô “Hình chưa có ảnh”: thầy biên dịch trên máy, chụp/xuất ảnh PNG hoặc SVG rồi bấm vào ô đó để tải ảnh lên.
5. **📤 Xuất bản lên web** → đặt mật khẩu bản giáo viên → tải về `XuatBan_DeCuong_<ngày>.zip` → kéo thư mục `data` trong gói lên GitHub → Commit. Học sinh thấy bản mới ngay.
6. **⬇ Tải TeX (.zip)** để lấy lại các file TeX đã sửa, biên dịch bản in bằng XeLaTeX như trước.

Mẫu file TeX được nhận dạng: Toán 10 `\bai{n}{..}` + `\phan{A|B|C}`, `vd`/`\loigiai`, `bt`, đề ôn `dethi`/`cau`/`\choice`/`\ydung`/`\traloi`; Toán 11 `\section{..}` + `\lythuyet`/`\vidumuc`/`\baitapmuc`, đề ôn `\dethi{..}{Đề n}`/`\pa{\T..}`/`\D`/`\S`/`\dapso{..}{..}{..}{..}`; Toán 12 `\baihoc{n}{..}` + `\lithuyet`/`\viduminhhoa`/`\subsubsection` (dạng)/`loigiai`/`\luyentap`/`\phanbt`/`bai`+`\dapso`, đề ôn `deontap`/`\dapan`.

## 4e1b. Tài liệu Toán THCS và Ra đề Toán THCS

**Tài liệu (lớp 6–9)** — mục Tài liệu, chọn lớp 6, 7, 8, 9: mỗi bài SGK (KNTT) hiện các dạng bài trong ngân hàng của thầy, mỗi dạng 10 bài tự luận + 10 câu trắc nghiệm một bộ, chuyển **Bộ 1 → Bộ 5** để có thêm bài. Học sinh chỉ thấy đề (file `data/thcs/hs-*.json` không chứa lời giải, đáp án). Giáo viên bấm 🔑 Giáo viên → Bản giáo viên thấy lời giải, đáp án (lấy từ ngân hàng đã nạp trên máy). In / tải PDF như các bài khác. Link: `tailieu.html#8/t34`.

**Ra đề THCS** (`rade-thcs.html`, menu “Ra đề THCS”):
1. **Nạp ngân hàng** một lần trên mỗi máy: chọn file zip ngân hàng Toán 6–9 (hoặc các file `.tex` dạng `NH_8H2_C9_B34_D01.tex`). Ngân hàng chỉ nằm trong trình duyệt máy thầy. Dùng trên iPad: 🔒 *Tạo gói mã hoá* → tải `nganhang-thcs.hcth` lên GitHub thư mục `data/thcs/` → trên iPad bấm ☁️ *Tải từ web* + mật khẩu.
2. **Thông tin đề**: khối, loại đề (giữa kì / cuối kì TN 3đ + TL 7đ; tự luận 100%; 15 phút TN hoặc TL; ôn tập chương; đề tham khảo tuyển sinh 10 TP.HCM; phiếu bài tập), tên trường, năm học, số mã đề, trộn câu / trộn phương án.
3. **Phạm vi**: tick chương, bài (nút nhanh Học kì I / II / Cả năm).
4. **Ma trận**: web tự phân bổ số câu TN (NB/TH/VD) và số ý TL (NB/TH/VD/VDC) cho từng bài theo loại đề; thầy sửa trực tiếp từng ô.
5. **Bài hình học** (ô trong Thông tin đề): *Tự động* — đề luôn có một bài hình chứng minh, ưu tiên dạng có ý a), b), c), đặt cuối đề, khoảng 2–2,5 điểm; *Không bắt buộc* — bốc ngẫu nhiên theo ma trận; hoặc chọn đúng một dạng hình trong phạm vi. Dòng chú thích cho biết phạm vi có bao nhiêu dạng hình, bao nhiêu dạng đủ ý a), b), c).
6. **🎲 Tạo đề**: bốc câu đúng bài, đúng mức (thiếu thì lấy mức gần nhất và ghi chú), không lấy hai câu cùng bộ số liệu, ưu tiên mỗi dạng một câu; tự luận gom theo chương thành Bài 1, 2, 3… có ý a), b), c), câu có sẵn nhiều ý đứng riêng, ý vận dụng cao để cuối; điểm tự luận tự chia theo mức độ, tổng 10 điểm.
7. Tab **Đề gốc**: rê chuột vào câu → **🔄 đổi** để thay câu khác cùng bài, cùng mức. Các tab mã đề, **Đáp án – HDC** (bảng đáp án từng mã + lời giải, điểm từng ý), **Ma trận – Đặc tả**.
8. Xuất: **Word** (gói zip: từng mã đề, đáp án – HDC, ma trận – đặc tả; công thức là Equation của Word), **TeX** (biên dịch XeLaTeX), **In / PDF**.

## 4e1c. Ôn thi vào 10 (bộ 50 đề theo khung 7 bài của Sở)

- **Tài liệu › 🎯 Ôn thi vào 10**:
  - **Theo đề**: 50 đề chia ba mức (làm quen, sát đề Sở, nâng cao).
  - **Luyện theo dạng**: chọn một mã dạng (ví dụ `B6-D2` chuyển động trên đường khép kín) → hiện mọi bài cùng dạng trong 50 đề.
  - **🎲 Ghép đề mới**: mỗi bài bốc ngẫu nhiên từ kho cùng vị trí, lọc được theo mức.
- Học sinh chỉ thấy đề (file công khai `data/ts10/hs.json` không có lời giải).
- **Bản giáo viên** (lời giải, hướng dẫn chấm đến 0,25 điểm):
  - File `TS10_GV_LoiGiai.json` — **thầy giữ trên máy, không đăng lên GitHub**.
  - Vào chế độ giáo viên ở trang Tài liệu → **📥 Nạp file lời giải TS10** (nạp một lần cho mỗi trình duyệt).
  - Tải được TeX bản học sinh hoặc TeX có lời giải (khung lệnh `\loigiaitrue/false` như bộ gốc).
- **Ra đề THCS** › Loại đề **“Đề tuyển sinh 10 TP.HCM — khung 7 bài”**:
  - Chọn mức → **Tạo đề**. Nút 🔄 đổi bài khác cùng vị trí.
  - Có tab đáp án – HDC, ma trận – đặc tả; xuất Word, TeX, in.

## 4e2. Lớp học: kết nối học sinh với giáo viên (`lophoc.html`)

Học sinh nhập **họ tên, lớp** một lần trên máy của em. Mỗi lượt luyện tập (điểm, dạng đúng/sai) và mỗi bài Sổ tay em đánh dấu “đã học / cần ôn” được gửi về **Google Trang tính của thầy**. Mất mạng thì web tự xếp hàng đợi và gửi lại khi có mạng.

**Cài một lần (khoảng 5 phút):** mở `lophoc.html` → thẻ **⚙️ Cài đặt kết nối**, làm theo 6 bước (tạo Trang tính → Apps Script → dán mã → đổi `KHOA_GV` → Triển khai ứng dụng web “Bất kỳ ai” → chép URL `/exec`). Dán URL vào `config.js` (`lopHoc: { url: "…/exec" }`) rồi tải `config.js` lên GitHub. Khoá giáo viên chỉ nhập trên máy thầy, không ghi vào `config.js`.

- **📌 Giao bài:** chọn lớp (VD `12A1`, cả khối `12`, hoặc `TẤT CẢ`), chọn bài Sổ tay / sơ đồ chương / bộ luyện tập, đặt hạn → học sinh lớp đó thấy ngay ở đầu trang Tự học, bài làm xong có dấu ✅. Nút **Chép link gửi Zalo**.
- **📊 Kết quả học sinh:** lọc theo lớp, theo ngày; bảng từng học sinh (số bài đã học, cần ôn, lượt luyện, tỉ lệ đúng, lần cuối hoạt động); bài được học nhiều/ít; **dạng cả lớp sai nhiều nhất**; **Xuất Excel (CSV)**.
- Chưa cài URL thì web vẫn chạy bình thường, tiến độ chỉ lưu trên máy học sinh.
- Dữ liệu nằm trong Trang tính của thầy (Google Drive), không ai khác xem được nếu không có khoá giáo viên.

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

### Cách 1 (mặc định, từ bản 2026.11.21): thi qua Internet, giống Kahoot — không cần chung wifi

- Không cần cài gì, không cần chạy `maychu.py`. Mở trang **Trò chơi** trên web như bình thường (máy chiếu cần có Internet).
- Bấm vào trò chơi → màn hình hiện **mã QR** và **mã phòng 6 chữ số**.
- Học sinh dùng **4G hay wifi nào cũng được**: quét QR, hoặc mở `hieuant2812.github.io/hoc-cung-thay-hieu/hs.html` rồi gõ mã phòng.
- Máy thầy giữ toàn bộ phòng thi (danh sách, điểm). Máy thầy và điện thoại nhắn qua một **máy chủ trung gian công cộng** (giao thức MQTT, kết nối bảo mật `wss://`).
  - Chỉ gửi đi tên học sinh trong danh sách lớp, đề và phương án đang hỏi, đáp án các em chọn.
  - Thầy bấm thoát trò chơi là phòng tự xoá.
- Mạng chập chờn: máy thầy và điện thoại **tự nối lại** rồi tiếp tục, không mất điểm. Màn hình phòng chờ báo nếu máy thầy mất Internet.
- Nếu wifi trường chặn: phát 4G từ điện thoại cho máy chiếu. Thầy cũng có thể đổi danh sách máy chủ trung gian ở dòng `troChoi.mayChu` trong `config.js`.
- Khi đáp án được công bố, điện thoại mỗi em hiện ngay đúng/sai và điểm.

### Cách 2: máy chủ trong lớp (chung wifi) — dùng khi không có Internet

Khi trang trò chơi được mở qua `maychu.py`, ô cài đặt hiện thêm lựa chọn **Qua Internet / Máy chủ trong lớp** để thầy chọn.

### Chuẩn bị cho cách 2 (làm một lần)

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
2. Chọn câu hỏi như bình thường rồi bấm vào trò chơi → màn hình hiện **mã QR cỡ lớn và mã phòng** (6 chữ số khi thi qua Internet, 4 chữ số khi dùng máy chủ trong lớp).
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
- Danh sách lớp và kết quả chỉ nằm trong bộ nhớ máy thầy cô; thoát trò chơi (hoặc tắt máy chủ trong lớp) là xoá hết.
- Màn hình trò chơi cũng có nút **✏️ Ghi bảng** (góc trên trái) để viết lên câu đang chiếu; trong trò chơi các phím chữ A–D vẫn dùng để chọn đáp án.

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

## Gói 18 — ngoại tuyến, trang chủ HS/GV (21/11/2026)
- **Số phiên bản chỉ còn một chỗ**: `config.js` → `phienBan`. Mỗi lần đăng bản mới, thầy đổi số này (VD `2026.11.21b` → `2026.11.22`); máy học sinh tự làm mới bộ đệm. Không cần sửa `sw.js`.
- `sw.js`: trang và mã (HTML/JS/CSS/JSON) lấy bản mới trên mạng trước, chờ tối đa 3 giây rồi mới dùng bản đã lưu → không còn lẫn bản cũ – mới. Chỉ lưu phản hồi thành công. Lõi tải sẵn cho học sinh khoảng 1,4 MB (có font công thức KaTeX).
- **📥 Tải sẵn ngoại tuyến** (Trang chủ → Dành cho giáo viên, hoặc menu Giáo viên ▾): chọn nhóm Mô phỏng / Đề cương 10, 11, 12 / THCS 6–9 / Ôn thi vào 10 / Công cụ giáo viên. Bấm ở nhà khi có wifi; web có bản mới thì bấm 🔄 Cập nhật. Máy đã có ngân hàng đề tự tải ngầm nhóm Công cụ giáo viên.
- Danh sách file nhóm Công cụ giáo viên nằm ở `data/ngoaituyen.json`. Trang mới chưa có trong danh sách vẫn được lưu khi mở lần đầu.
- Trang chủ chia khối Học sinh / Giáo viên; khối Giáo viên tự thu gọn trên máy học sinh. Menu: 5 mục cho học sinh + "🧑‍🏫 Giáo viên ▾".
- jsPDF (phieu.html) và html2canvas (rade-thcs.html) chỉ nạp khi bấm xuất: `napThuVien(src)` trong `site.js`.

## Gói 20 — trình chiếu trên web, phiếu cuối giờ, sổ lỗi sai, KHBD Toán 11, chuyên đề (22/11/2026)
- **Beamer → ▶ Trình chiếu ngay trên web** (`assets/trinhchieu.js`): không cần XeLaTeX; lời giải hiện từng dòng; ← → / chạm hai bên / vuốt để chuyển; gõ số + Enter nhảy slide; **B** bút ghi bảng (nét vẽ lưu riêng từng slide); F toàn màn hình; Esc thoát. Chạm đúp một slide ở bản xem trước để chiếu từ slide đó.
- **Chữ to cho lớp đông**: 14pt, không thu nhỏ chữ, tự chia slide thưa hơn (cả bản .tex và bản chiếu web).
- **KHBD Toán 11** HK2 (Bài 18–33) và **Chuyên đề 11** (Bài 1–12) của tổ Toán đã nhập vào `data/khbdgoc.js`; số tiết PPCT lấy từ KHGD của trường. Công thức MathType trong file chuyên đề được đọc từ mã TeX lưu sẵn bên trong.
- **Soạn bài**: ô "Theo KHBD của tổ/thầy" — bài nào đã có KHBD gốc thì xuất Word giữ nguyên tiết, hoạt động, bảng 4 bước (công thức Equation của Word).
- **Phân bổ 35 tiết chuyên đề** (`data/ppct-chuyende.js`): mỗi chuyên đề 10 hoặc 15 tiết; kiểm tra chuyên đề gộp vào tiết "Bài tập cuối chuyên đề". Sửa file này là cả web cập nhật.
- **Trên lớp → 🎫 Phiếu cuối giờ**: 3 câu trắc nghiệm, học sinh trả lời bằng điện thoại (hs.html, mã phòng); xem tỉ lệ đúng từng câu; kết quả tự lưu sang trang Phân tích (lớp lấy từ danh sách ở tab Gọi tên).
- **Tự học → 📕 Sổ lỗi sai**: câu làm sai được hỏi lại sau 1 → 3 → 7 ngày; đúng cả 3 lần thì rời sổ. Lưu trên máy học sinh.
- **Chuyên đề 10, 11**: thêm 27 mục kiến thức có ví dụ, lời giải từng bước; 15 hình minh hoạ (`G.HINH.CD10`, `G.HINH.CD11` trong `data/hinhve-bai.js`). Tên bài Chuyên đề 11 Bài 4–5, Chuyên đề 12 Bài 1–2 theo đúng SGK KNTT.

## Gói 21 — Hình ngân hàng đề biên dịch sẵn thành SVG (2026.11.23)
- 4.104 hình TikZ của ngân hàng Toán 12 (bản 144 dạng và bản cũ) và Toán 11 (bản cũ) đã biên dịch bằng XeLaTeX → SVG, giống hệt bản in (kể cả \clip, plot, tkz-tab).
- Lưu ở `data/hinhnh/` thành 62 gói `.json` (mỗi gói ≤ 100 hình của một dạng) và `chi-muc.json` (mã hình → gói).
- `assets/nhd/core.js` gắn mã băm cho mỗi hình; trang tự tải gói cần thiết và thay hình vẽ nhanh bằng ảnh SVG. Không có mạng/chưa có gói thì vẫn hiện hình vẽ nhanh như trước.
- Áp dụng cho mọi trang dùng ngân hàng: Ra đề, Tự học, Trên lớp, Trò chơi, Phân tích…
- Toán 10 (bản TRON_BO_v2) không có hình TikZ nên không cần biên dịch.
- Khi có ngân hàng mới (ví dụ Toán 11 bản mới): gửi zip để biên dịch thêm; tên gói theo nội dung nên máy học sinh tự lấy bản mới.
