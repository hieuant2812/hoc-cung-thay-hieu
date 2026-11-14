/* data/baihoc/cd.js — dữ liệu Chuyên đề học tập Toán 10, 11, 12 (Kết nối tri thức với cuộc sống) */
(function (G) {
  const B = G.BAIHOC = G.BAIHOC || {}; const T = B["Toán"] = B["Toán"] || {};
  G.CHUYEN_DE = {
    "CD10": { 1: ["Hệ phương trình bậc nhất ba ẩn", { 1: "Hệ phương trình bậc nhất ba ẩn", 2: "Ứng dụng hệ phương trình bậc nhất ba ẩn" }],
              2: ["Phương pháp quy nạp toán học. Nhị thức Newton", { 3: "Phương pháp quy nạp toán học", 4: "Nhị thức Newton" }],
              3: ["Ba đường conic và ứng dụng", { 5: "Elip", 6: "Hypebol", 7: "Parabol", 8: "Sự thống nhất giữa ba đường conic" }] },
    "CD11": { 1: ["Phép biến hình trong mặt phẳng", { 1: "Phép biến hình", 2: "Phép tịnh tiến", 3: "Phép đối xứng trục", 4: "Phép đối xứng tâm", 5: "Phép quay", 6: "Phép vị tự", 7: "Phép đồng dạng" }],
              2: ["Làm quen với một vài khái niệm của lí thuyết đồ thị", { 8: "Một vài khái niệm cơ bản", 9: "Đường đi Euler và đường đi Hamilton", 10: "Bài toán tìm đường tối ưu trong một vài trường hợp đơn giản" }],
              3: ["Một số yếu tố vẽ kĩ thuật", { 11: "Hình chiếu vuông góc và hình chiếu trục đo", 12: "Bản vẽ kĩ thuật" }] },
    "CD12": { 1: ["Biến ngẫu nhiên rời rạc. Các số đặc trưng của biến ngẫu nhiên rời rạc", { 1: "Biến ngẫu nhiên rời rạc", 2: "Biến ngẫu nhiên rời rạc có phân bố nhị thức" }],
              2: ["Ứng dụng toán học để giải quyết một số bài toán tối ưu", { 3: "Vận dụng hệ bất phương trình bậc nhất hai ẩn để giải quyết một số bài toán quy hoạch tuyến tính", 4: "Vận dụng đạo hàm để giải quyết một số bài toán tối ưu trong thực tiễn" }],
              3: ["Ứng dụng toán học trong một số vấn đề liên quan đến tài chính", { 5: "Tiền tệ. Lãi suất", 6: "Tín dụng. Vay nợ", 7: "Đầu tư tài chính. Lập kế hoạch tài chính cá nhân" }] }
  };

  T["CD10"] = {
1: { t: 3, yc: ["Nhận biết hệ phương trình bậc nhất ba ẩn và nghiệm.", "Giải hệ bằng phương pháp Gauss và bằng máy tính cầm tay."],
  md: [
   { t: "Hệ phương trình bậc nhất ba ẩn", y: ["Dạng $\\begin{cases}a_1x+b_1y+c_1z=d_1\\\\ a_2x+b_2y+c_2z=d_2\\\\ a_3x+b_3y+c_3z=d_3\\end{cases}$", "Nghiệm là bộ ba $(x_0;y_0;z_0)$ thoả mãn cả ba phương trình.", "Hệ có thể có nghiệm duy nhất, vô nghiệm hoặc vô số nghiệm."] },
   { t: "Phương pháp Gauss", y: ["Dùng các phép biến đổi tương đương đưa hệ về dạng tam giác.", "Ba phép biến đổi: đổi chỗ hai phương trình; nhân một phương trình với số khác $0$; cộng bội của phương trình này vào phương trình kia.", "Từ dạng tam giác, giải ngược từ dưới lên."],
     vd: { d: "Giải hệ $\\begin{cases}x+y+z=6\\\\ 2x-y+z=3\\\\ x+2y-z=2\\end{cases}$", g: ["Trừ $2\\times$ phương trình (1) khỏi (2): $-3y-z=-9$.", "Trừ (1) khỏi (3): $y-2z=-4$.", "Giải hệ hai ẩn: $y=2$, $z=3$, thay lại được $x=1$. Nghiệm $(1;2;3)$."] } }],
  tt: { d: "Một cửa hàng bán ba loại vé: người lớn $80$ nghìn, học sinh $50$ nghìn, trẻ em $30$ nghìn. Một ngày bán $100$ vé thu $5{,}6$ triệu đồng, biết số vé học sinh gấp đôi vé trẻ em. Tính số vé mỗi loại.",
      g: ["$\\begin{cases}x+y+z=100\\\\ 80x+50y+30z=5600\\\\ y=2z\\end{cases}$", "Thay $y=2z$: $x+3z=100$ và $80x+130z=5600$.", "Giải được $z=16$, $y=32$, $x=52$."] },
  cs: "casio", ai: { p: "Giải hệ ba ẩn bằng phương pháp Gauss, trình bày từng phép biến đổi.", l: "AI hay nhảy thẳng tới nghiệm mà không ghi phép biến đổi, khiến học sinh không kiểm chứng được." },
  bt: "Bài 1.1 – 1.6 Chuyên đề trang 14." },

2: { t: 3, yc: ["Vận dụng hệ phương trình bậc nhất ba ẩn vào bài toán thực tiễn: kinh tế, hoá học, giao thông."],
  md: [
   { t: "Quy trình mô hình hoá", y: ["Bước 1: Chọn ba ẩn và đặt điều kiện.", "Bước 2: Lập ba phương trình từ các dữ kiện.", "Bước 3: Giải hệ, đối chiếu điều kiện và trả lời."],
     vd: { d: "Cân bằng phương trình hoá học $aFe+bO_2\\to cFe_2O_3$.", g: ["Cân bằng Fe: $a=2c$; cân bằng O: $2b=3c$.", "Chọn $c=2$ thì $a=4$, $b=3$.", "Phương trình: $4Fe+3O_2\\to2Fe_2O_3$."] } }],
  tt: { d: "Ba phân xưởng cùng làm một đơn hàng $1200$ sản phẩm. Phân xưởng I làm nhiều hơn II là $100$ sản phẩm; III làm bằng nửa tổng của I và II. Tính số sản phẩm mỗi phân xưởng.",
      g: ["$\\begin{cases}x+y+z=1200\\\\ x-y=100\\\\ z=\\dfrac{x+y}{2}\\end{cases}$", "Thay vào: $x+y=800$ nên $z=400$.", "Kết hợp $x-y=100$: $x=450$, $y=350$."] },
  cs: "excel", ai: { p: "Lập và giải hệ ba ẩn cho bài toán ba phân xưởng nói trên.", l: "AI hay đặt ẩn thiếu điều kiện nguyên dương, cho nghiệm lẻ không phù hợp thực tế." },
  bt: "Bài 1.7 – 1.12 Chuyên đề trang 22." },

3: { t: 3, yc: ["Hiểu và vận dụng phương pháp quy nạp toán học để chứng minh mệnh đề phụ thuộc số tự nhiên."],
  md: [
   { t: "Nguyên lí quy nạp", y: ["Bước 1 (cơ sở): kiểm tra mệnh đề đúng với $n=n_0$.", "Bước 2 (quy nạp): giả sử đúng với $n=k\\ge n_0$, chứng minh đúng với $n=k+1$.", "Kết luận: mệnh đề đúng với mọi $n\\ge n_0$."],
     vd: { d: "Chứng minh $1+2+\\dots+n=\\dfrac{n(n+1)}{2}$ với mọi $n\\ge1$.", g: ["Với $n=1$: vế trái $=1$, vế phải $=1$ (đúng).", "Giả sử đúng với $n=k$: $1+\\dots+k=\\dfrac{k(k+1)}{2}$.", "Với $n=k+1$: tổng $=\\dfrac{k(k+1)}{2}+(k+1)=\\dfrac{(k+1)(k+2)}{2}$ (đúng)."] } }],
  tt: { d: "Chứng minh rằng với mọi $n\\ge1$, số tiền gửi tiết kiệm lãi kép sau $n$ kì là $T_n=T_0(1+r)^n$ bằng phương pháp quy nạp.",
      g: ["$n=1$: sau một kì, $T_1=T_0(1+r)$ (đúng theo định nghĩa lãi kép).", "Giả sử $T_k=T_0(1+r)^k$.", "Kì thứ $k+1$: $T_{k+1}=T_k(1+r)=T_0(1+r)^{k+1}$."] },
  cs: "ai", ai: { p: "Chứng minh $1+2+\\dots+n=\\dfrac{n(n+1)}{2}$ bằng quy nạp, nêu đủ hai bước.", l: "AI hay bỏ bước cơ sở hoặc chỉ thử vài giá trị rồi kết luận, đó không phải chứng minh." },
  bt: "Bài 2.1 – 2.6 Chuyên đề trang 31." },

4: { t: 3, yc: ["Khai triển nhị thức Newton với số mũ tự nhiên bất kì.", "Tìm hệ số, số hạng chứa $x^k$ trong khai triển."],
  md: [
   { t: "Công thức tổng quát", y: ["$(a+b)^n=\\sum\\limits_{k=0}^{n}C_n^ka^{n-k}b^k$.", "Số hạng tổng quát $T_{k+1}=C_n^ka^{n-k}b^k$.", "Tam giác Pascal cho các hệ số $C_n^k$."],
     vd: { d: "Tìm hệ số của $x^5$ trong khai triển $(2x-3)^8$.", g: ["$T_{k+1}=C_8^k(2x)^{8-k}(-3)^k$.", "Cần $8-k=5 \\Rightarrow k=3$.", "Hệ số: $C_8^3\\cdot2^5\\cdot(-3)^3=56\\cdot32\\cdot(-27)=-48\\,384$."] } }],
  tt: { d: "Dùng nhị thức Newton tính gần đúng $(1{,}01)^{10}$ với ba số hạng đầu và so sánh với giá trị máy tính.",
      g: ["$(1+0{,}01)^{10}\\approx1+10(0{,}01)+45(0{,}01)^2$.", "$=1+0{,}1+0{,}0045=1{,}1045$.", "Máy tính cho $1{,}10462$ — sai lệch rất nhỏ."] },
  cs: "casio", ai: { p: "Tìm hệ số của $x^5$ trong $(2x-3)^8$.", l: "AI hay quên luỹ thừa của hệ số $2$ và dấu âm của $(-3)^k$." },
  bt: "Bài 2.7 – 2.12 Chuyên đề trang 40." },

5: { t: 3, yc: ["Nhận biết elip và phương trình chính tắc.", "Xác định các yếu tố: tiêu điểm, tiêu cự, trục, tâm sai; ứng dụng thực tiễn."],
  md: [
   { t: "Định nghĩa và phương trình chính tắc", y: ["Elip là tập hợp điểm $M$ có $MF_1+MF_2=2a$ (hằng số, $2a>F_1F_2=2c$).", "Phương trình chính tắc: $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ với $b^2=a^2-c^2$.", "Tâm sai $e=\\dfrac{c}{a}<1$; elip càng dẹt khi $e$ càng gần $1$."],
     vd: { d: "Cho elip $\\dfrac{x^2}{100}+\\dfrac{y^2}{64}=1$. Tìm tiêu điểm và tâm sai.", g: ["$a=10$, $b=8$ nên $c^2=100-64=36 \\Rightarrow c=6$.", "Tiêu điểm $F_{1,2}(\\mp6;0)$.", "$e=\\dfrac{6}{10}=0{,}6$."] } }],
  tt: { d: "Quỹ đạo Trái Đất quanh Mặt Trời là elip có bán trục lớn $a\\approx149{,}6$ triệu km và tâm sai $e\\approx0{,}0167$. Tính khoảng cách gần nhất và xa nhất từ Trái Đất đến Mặt Trời.",
      g: ["$c=ae\\approx2{,}5$ triệu km.", "Gần nhất (cận nhật): $a-c\\approx147{,}1$ triệu km.", "Xa nhất (viễn nhật): $a+c\\approx152{,}1$ triệu km."] },
  cs: "geogebra", ai: { p: "Tính khoảng cách gần nhất, xa nhất từ Trái Đất đến Mặt Trời khi biết $a$ và $e$.", l: "AI hay nhầm $e=\\dfrac{a}{c}$ nên cho kết quả vô lí." },
  bt: "Bài 3.1 – 3.6 Chuyên đề trang 52." },

6: { t: 3, yc: ["Nhận biết hypebol và phương trình chính tắc; xác định tiệm cận và ứng dụng."],
  md: [
   { t: "Hypebol", y: ["Tập hợp điểm $M$ có $\\left|MF_1-MF_2\\right|=2a$ với $2a<F_1F_2=2c$.", "Phương trình chính tắc $\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$ với $b^2=c^2-a^2$.", "Hai tiệm cận: $y=\\pm\\dfrac{b}{a}x$; tâm sai $e=\\dfrac ca>1$."],
     vd: { d: "Cho hypebol $\\dfrac{x^2}{9}-\\dfrac{y^2}{16}=1$. Tìm tiêu điểm và tiệm cận.", g: ["$a=3$, $b=4$ nên $c=\\sqrt{9+16}=5$.", "Tiêu điểm $F_{1,2}(\\mp5;0)$.", "Tiệm cận $y=\\pm\\dfrac43x$."] } }],
  tt: { d: "Tháp giải nhiệt nhà máy điện có mặt cắt dọc là một nhánh hypebol. Biết eo thắt rộng $18$ m ở độ cao $40$ m, đáy rộng $30$ m. Lập phương trình mặt cắt (gốc tại eo thắt).",
      g: ["Eo thắt cho $a=9$; đáy ở $y=-40$ với $x=15$.", "Thay vào $\\dfrac{x^2}{81}-\\dfrac{y^2}{b^2}=1$: $\\dfrac{225}{81}-\\dfrac{1600}{b^2}=1$.", "$b^2=\\dfrac{1600\\cdot81}{144}=900$, nên $\\dfrac{x^2}{81}-\\dfrac{y^2}{900}=1$."] },
  cs: "geogebra", ai: { p: "Lập phương trình hypebol mặt cắt tháp giải nhiệt với các số liệu trên.", l: "AI hay dùng công thức $b^2=a^2-c^2$ của elip cho hypebol." },
  bt: "Bài 3.7 – 3.11 Chuyên đề trang 58." },

7: { t: 3, yc: ["Nhận biết parabol và phương trình chính tắc; vận dụng tính chất quang học của parabol."],
  md: [
   { t: "Parabol", y: ["Tập hợp điểm cách đều tiêu điểm $F$ và đường chuẩn $\\Delta$.", "Phương trình chính tắc $y^2=2px$ $(p>0)$, tiêu điểm $F\\left(\\dfrac p2;0\\right)$, đường chuẩn $x=-\\dfrac p2$.", "Tính chất quang học: tia song song trục phản xạ qua tiêu điểm."],
     vd: { d: "Cho parabol $y^2=8x$. Tìm tiêu điểm và đường chuẩn.", g: ["$2p=8 \\Rightarrow p=4$.", "Tiêu điểm $F(2;0)$, đường chuẩn $x=-2$."] } }],
  tt: { d: "Chảo thu sóng vệ tinh có mặt cắt là parabol sâu $0{,}2$ m, miệng rộng $1{,}6$ m. Phải đặt đầu thu ở đâu để thu tín hiệu tốt nhất?",
      g: ["Chọn hệ trục đỉnh tại đáy chảo: parabol $x^2=2py'$ qua điểm $(0{,}8;0{,}2)$.", "$0{,}64=2p\\cdot0{,}2 \\Rightarrow 2p=3{,}2 \\Rightarrow \\dfrac{p}{2}=0{,}8$.", "Đặt đầu thu tại tiêu điểm, cách đáy chảo $0{,}8$ m trên trục."] },
  cs: "geogebra", ai: { p: "Chảo parabol sâu 0,2 m, miệng rộng 1,6 m, tính vị trí đặt đầu thu.", l: "AI hay đặt đầu thu ở đỉnh chảo hoặc tính nhầm $p$ với $\\dfrac p2$." },
  bt: "Bài 3.12 – 3.16 Chuyên đề trang 64." },

8: { t: 3, yc: ["Nhận biết sự thống nhất giữa ba đường conic qua đường chuẩn và tâm sai.", "Nhận biết conic trong thực tiễn."],
  md: [
   { t: "Định nghĩa thống nhất", y: ["Conic là tập hợp điểm $M$ sao cho $\\dfrac{MF}{d(M,\\Delta)}=e$ với $F$ là tiêu điểm, $\\Delta$ là đường chuẩn.", "$e<1$: elip; $e=1$: parabol; $e>1$: hypebol.", "Ba đường conic đều là giao tuyến của mặt nón tròn xoay với một mặt phẳng."] }],
  tt: { d: "Vì sao bóng của chiếc đèn bàn chụp hình nón hắt lên tường lúc là đường tròn, lúc là elip, lúc lại là hypebol?",
      g: ["Chùm sáng tạo thành một mặt nón; bức tường đóng vai trò mặt phẳng cắt.", "Mặt phẳng cắt vuông góc trục nón cho đường tròn; nghiêng ít cho elip.", "Nghiêng tới mức song song với một đường sinh cho parabol, nghiêng hơn nữa cắt cả hai nhánh cho hypebol."] },
  cs: "geogebra", ai: { p: "Giải thích vì sao ba đường conic đều là giao của mặt nón với mặt phẳng.", l: "AI hay mô tả chung chung, không nêu điều kiện góc giữa mặt phẳng cắt và đường sinh." },
  bt: "Bài 3.17 – 3.20 Chuyên đề trang 70." }
  };

  T["CD11"] = {
1: { t: 2, yc: ["Nhận biết khái niệm phép biến hình, ảnh của một điểm, một hình."],
  md: [{ t: "Phép biến hình", y: ["Phép biến hình là quy tắc cho mỗi điểm $M$ ứng với duy nhất một điểm $M'$.", "$M'$ gọi là ảnh của $M$, kí hiệu $M'=f(M)$.", "Ảnh của hình $\\mathcal{H}$ là tập ảnh của mọi điểm thuộc $\\mathcal{H}$."],
     vd: { d: "Quy tắc “cho mỗi điểm $M$ ứng với điểm $M'$ cách $M$ một khoảng $2$ cm” có phải phép biến hình không?", g: ["Có vô số điểm cách $M$ một khoảng $2$ cm.", "Ảnh không duy nhất nên đây không phải phép biến hình."] } }],
  tt: { d: "Khi ta phóng to một bức ảnh trên điện thoại, mỗi điểm ảnh được đưa tới một vị trí mới. Đó có phải một phép biến hình không? Vì sao?",
      g: ["Mỗi điểm trên ảnh gốc ứng với đúng một điểm trên ảnh phóng to.", "Vậy đây là một phép biến hình (cụ thể là phép vị tự).", "Nếu một điểm cho ra nhiều vị trí thì không phải phép biến hình."] },
  cs: "geogebra", ai: { p: "Quy tắc nào sau đây là phép biến hình? Giải thích.", l: "AI hay bỏ qua yêu cầu “duy nhất” trong định nghĩa." },
  bt: "Bài 1.1 – 1.3 Chuyên đề trang 9." },

2: { t: 2, yc: ["Nhận biết phép tịnh tiến và tính chất; xác định ảnh của điểm, đường thẳng, đường tròn."],
  md: [{ t: "Phép tịnh tiến", y: ["$T_{\\vec v}(M)=M' \\Leftrightarrow \\overrightarrow{MM'}=\\vec v$.", "Biểu thức toạ độ: $\\begin{cases}x'=x+a\\\\ y'=y+b\\end{cases}$ với $\\vec v=(a;b)$.", "Phép tịnh tiến bảo toàn khoảng cách, biến đường thẳng thành đường thẳng song song hoặc trùng."],
     vd: { d: "Tìm ảnh của đường tròn $(x-1)^2+(y+2)^2=9$ qua $T_{\\vec v}$ với $\\vec v=(3;1)$.", g: ["Tâm $I(1;-2) \\to I'(4;-1)$, bán kính giữ nguyên $R=3$.", "Ảnh: $(x-4)^2+(y+1)^2=9$."] } }],
  tt: { d: "Hoa văn trên một dải băng trang trí được tạo bằng cách lặp lại một hoạ tiết, mỗi lần dịch sang phải $4$ cm. Hãy mô tả bằng phép biến hình và cho biết hoạ tiết thứ $10$ cách hoạ tiết đầu bao nhiêu.",
      g: ["Mỗi lần lặp là phép tịnh tiến theo $\\vec v=(4;0)$ (cm).", "Hoạ tiết thứ $10$ là ảnh qua $9$ lần tịnh tiến.", "Khoảng cách $=9\\times4=36$ cm."] },
  cs: "geogebra", ai: { p: "Tìm ảnh của đường tròn qua phép tịnh tiến theo $\\vec v=(3;1)$.", l: "AI đôi khi tịnh tiến cả bán kính, làm đổi kích thước đường tròn." },
  bt: "Bài 1.4 – 1.8 Chuyên đề trang 14." },

3: { t: 2, yc: ["Nhận biết phép đối xứng trục, trục đối xứng của một hình."],
  md: [{ t: "Phép đối xứng trục", y: ["$Đ_d(M)=M'$ với $d$ là đường trung trực của $MM'$ (nếu $M\\notin d$).", "Biểu thức toạ độ qua $Ox$: $(x;y)\\mapsto(x;-y)$; qua $Oy$: $(x;y)\\mapsto(-x;y)$.", "Phép đối xứng trục bảo toàn khoảng cách."],
     vd: { d: "Tìm ảnh của $A(3;-2)$ qua phép đối xứng trục $Ox$.", g: ["Giữ hoành độ, đổi dấu tung độ.", "$A'(3;2)$."] } }],
  tt: { d: "Vì sao chữ “A”, “H”, “M” in hoa có trục đối xứng còn chữ “F”, “G” thì không? Nêu ứng dụng của tính đối xứng trong thiết kế logo.",
      g: ["Chữ có trục đối xứng khi tồn tại đường thẳng chia hình thành hai nửa trùng khít qua phép đối xứng trục.", "“A”, “M” đối xứng qua trục dọc; “H” có cả trục dọc và trục ngang.", "Logo đối xứng tạo cảm giác cân bằng, dễ nhận diện."] },
  cs: "geogebra", ai: { p: "Liệt kê các chữ in hoa tiếng Việt có trục đối xứng.", l: "AI hay kể cả chữ “N”, “S” (vốn chỉ có tâm đối xứng, không có trục)." },
  bt: "Bài 1.9 – 1.13 Chuyên đề trang 19." },

4: { t: 2, yc: ["Nhận biết phép đối xứng tâm, tâm đối xứng của một hình."],
  md: [{ t: "Phép đối xứng tâm", y: ["$Đ_I(M)=M' \\Leftrightarrow I$ là trung điểm $MM'$.", "Biểu thức toạ độ qua $I(a;b)$: $\\begin{cases}x'=2a-x\\\\ y'=2b-y\\end{cases}$", "Phép đối xứng tâm là phép quay $90^\\circ\\times2$ quanh $I$, tức phép quay góc $180^\\circ$."],
     vd: { d: "Tìm ảnh của $M(2;5)$ qua phép đối xứng tâm $I(1;1)$.", g: ["$x'=2\\cdot1-2=0$; $y'=2\\cdot1-5=-3$.", "$M'(0;-3)$."] } }],
  tt: { d: "Nhiều hoa văn gạch lát nền có tâm đối xứng. Hãy giải thích vì sao khi xoay viên gạch $180^\\circ$ ta vẫn thấy hoa văn như cũ.",
      g: ["Xoay $180^\\circ$ quanh tâm chính là phép đối xứng tâm.", "Nếu hoa văn nhận tâm viên gạch làm tâm đối xứng thì ảnh trùng với chính nó.", "Nhờ vậy thợ lát không cần để ý chiều viên gạch."] },
  cs: "geogebra", ai: { p: "Tìm ảnh của $M(2;5)$ qua phép đối xứng tâm $I(1;1)$.", l: "AI hay lấy $M'=(2a+x;2b+y)$ do nhớ nhầm công thức." },
  bt: "Bài 1.14 – 1.18 Chuyên đề trang 23." },

5: { t: 2, yc: ["Nhận biết phép quay và tính chất; xác định ảnh qua phép quay."],
  md: [{ t: "Phép quay", y: ["$Q_{(O;\\alpha)}(M)=M'$ với $OM=OM'$ và góc lượng giác $(OM,OM')=\\alpha$.", "$Q_{(O;180^\\circ)}$ chính là phép đối xứng tâm $O$.", "Phép quay bảo toàn khoảng cách và độ lớn góc."],
     vd: { d: "Tìm ảnh của $A(1;0)$ qua phép quay tâm $O$ góc $90^\\circ$ (ngược chiều kim đồng hồ).", g: ["Quay $(1;0)$ một góc $90^\\circ$ cho $(0;1)$.", "$A'(0;1)$."] } }],
  tt: { d: "Cánh quạt ba cánh của một tua-bin gió trùng khít với chính nó sau mỗi lần quay bao nhiêu độ? Nêu ý nghĩa với việc cân bằng động của cánh quạt.",
      g: ["Ba cánh chia đều $360^\\circ$ nên trùng khít sau mỗi $120^\\circ$.", "Hình có phép quay $120^\\circ$ biến nó thành chính nó.", "Nhờ đối xứng quay, khối lượng phân bố đều giúp tua-bin quay cân bằng, ít rung."] },
  cs: "geogebra", ai: { p: "Cánh quạt ba cánh trùng khít với chính nó sau khi quay bao nhiêu độ?", l: "AI hay trả lời $360^\\circ$ vì chỉ xét vòng quay trọn vẹn." },
  bt: "Bài 1.19 – 1.23 Chuyên đề trang 28." },

6: { t: 2, yc: ["Nhận biết phép vị tự và tính chất; xác định ảnh của hình qua phép vị tự."],
  md: [{ t: "Phép vị tự", y: ["$V_{(O;k)}(M)=M' \\Leftrightarrow \\overrightarrow{OM'}=k\\overrightarrow{OM}$ $(k\\ne0)$.", "Biến đường thẳng thành đường thẳng song song hoặc trùng; biến đường tròn bán kính $R$ thành đường tròn bán kính $|k|R$.", "$V_{(O;1)}$ là phép đồng nhất; $V_{(O;-1)}$ là phép đối xứng tâm $O$."],
     vd: { d: "Tìm ảnh của đường tròn tâm $I(2;3)$ bán kính $4$ qua $V_{(O;2)}$ với $O$ là gốc toạ độ.", g: ["$I'=(4;6)$ vì $\\overrightarrow{OI'}=2\\overrightarrow{OI}$.", "Bán kính $R'=|2|\\cdot4=8$.", "Ảnh: $(x-4)^2+(y-6)^2=64$."] } }],
  tt: { d: "Máy photocopy phóng to bản vẽ theo tỉ lệ $141\\%$ (từ A4 lên A3). Hãy mô tả bằng phép vị tự và cho biết diện tích bản vẽ tăng bao nhiêu lần.",
      g: ["Đây là phép vị tự tỉ số $k=1{,}41$.", "Độ dài tăng $1{,}41$ lần.", "Diện tích tăng $1{,}41^2\\approx2$ lần — đúng bằng tỉ lệ A4 : A3."] },
  cs: "geogebra", ai: { p: "Phóng to tỉ lệ 141% thì diện tích tăng bao nhiêu lần?", l: "AI hay trả lời $1{,}41$ lần, quên rằng diện tích tỉ lệ với bình phương tỉ số vị tự." },
  bt: "Bài 1.24 – 1.28 Chuyên đề trang 33." },

7: { t: 2, yc: ["Nhận biết phép đồng dạng và hai hình đồng dạng."],
  md: [{ t: "Phép đồng dạng", y: ["Phép biến hình $f$ là đồng dạng tỉ số $k>0$ nếu $M'N'=k\\,MN$ với mọi $M$, $N$.", "Phép dời hình là phép đồng dạng tỉ số $k=1$.", "Hai hình đồng dạng nếu có phép đồng dạng biến hình này thành hình kia."],
     vd: { d: "Phép vị tự tỉ số $k=-3$ là phép đồng dạng tỉ số bao nhiêu?", g: ["Độ dài ảnh gấp $|k|$ lần.", "Tỉ số đồng dạng là $3$."] } }],
  tt: { d: "Bản đồ tỉ lệ $1:25\\,000$. Hai địa điểm trên bản đồ cách nhau $7$ cm thì ngoài thực địa cách nhau bao nhiêu km? Diện tích một khu đất $4$ cm² trên bản đồ tương ứng bao nhiêu hecta?",
      g: ["Khoảng cách thực: $7\\times25\\,000=175\\,000$ cm $=1{,}75$ km.", "Diện tích thực: $4\\times25\\,000^2$ cm² $=2{,}5\\times10^9$ cm².", "$=250\\,000$ m² $=25$ ha."] },
  cs: "geogebra", ai: { p: "Bản đồ tỉ lệ 1:25000, khu đất 4 cm² trên bản đồ ứng với bao nhiêu hecta?", l: "AI hay nhân diện tích với $25\\,000$ thay vì $25\\,000^2$." },
  bt: "Bài 1.29 – 1.33 Chuyên đề trang 38." },

8: { t: 3, yc: ["Nhận biết đồ thị, đỉnh, cạnh, bậc của đỉnh, đường đi và chu trình."],
  md: [{ t: "Khái niệm cơ bản", y: ["Đồ thị $G$ gồm tập đỉnh và tập cạnh nối các đỉnh.", "Bậc $d(v)$ là số cạnh nối với đỉnh $v$; tổng bậc bằng hai lần số cạnh.", "Đồ thị liên thông nếu giữa hai đỉnh bất kì luôn có đường đi."],
     vd: { d: "Một đồ thị có $5$ đỉnh, mỗi đỉnh bậc $4$. Tính số cạnh.", g: ["Tổng bậc $=5\\times4=20$.", "Số cạnh $=\\dfrac{20}{2}=10$."] } }],
  tt: { d: "Mô hình hoá mạng lưới $6$ tuyến xe buýt nối $5$ bến xe thành đồ thị. Làm thế nào để biết từ bến A có thể đi tới mọi bến khác?",
      g: ["Mỗi bến là một đỉnh, mỗi tuyến là một cạnh.", "Kiểm tra đồ thị có liên thông hay không.", "Nếu liên thông thì từ A luôn có đường đi (có thể phải đổi tuyến) tới mọi bến."] },
  cs: "ai", ai: { p: "Đồ thị 5 đỉnh, mỗi đỉnh bậc 4 có bao nhiêu cạnh?", l: "AI hay trả lời $20$ cạnh vì quên chia đôi tổng bậc." },
  bt: "Bài 2.1 – 2.5 Chuyên đề trang 40." },

9: { t: 3, yc: ["Nhận biết đường đi, chu trình Euler và Hamilton; vận dụng định lí Euler."],
  md: [{ t: "Đường đi Euler và Hamilton", y: ["Chu trình Euler đi qua mỗi **cạnh** đúng một lần và trở về đỉnh xuất phát.", "Định lí Euler: đồ thị liên thông có chu trình Euler khi và chỉ khi mọi đỉnh đều bậc chẵn; có đường đi Euler khi có đúng hai đỉnh bậc lẻ.", "Chu trình Hamilton đi qua mỗi **đỉnh** đúng một lần."],
     vd: { d: "Bài toán bảy cây cầu Königsberg: bốn vùng đất với các bậc $5;3;3;3$. Có thể đi qua mỗi cầu đúng một lần rồi về chỗ cũ không?", g: ["Cả bốn đỉnh đều có bậc lẻ.", "Theo định lí Euler, đồ thị không có chu trình Euler.", "Vậy không thể đi như vậy."] } }],
  tt: { d: "Nhân viên vệ sinh cần quét toàn bộ các con đường trong khu phố rồi quay về điểm xuất phát, mỗi đường chỉ quét một lần. Khi nào làm được? Nếu không được thì xử lí thế nào?",
      g: ["Làm được khi đồ thị đường phố liên thông và mọi ngã tư có số đường chẵn.", "Nếu có đúng hai ngã tư bậc lẻ thì phải xuất phát và kết thúc tại hai ngã tư đó.", "Nếu nhiều hơn, buộc phải đi lặp lại một số đoạn — chọn đoạn ngắn nhất để lặp."] },
  cs: "ai", ai: { p: "Bảy cây cầu Königsberg: giải thích bằng định lí Euler vì sao không có lời giải.", l: "AI hay nhầm chu trình Euler (qua mỗi cạnh) với chu trình Hamilton (qua mỗi đỉnh)." },
  bt: "Bài 2.6 – 2.12 Chuyên đề trang 44." },

10: { t: 3, yc: ["Vận dụng thuật toán tìm đường đi ngắn nhất trong trường hợp đơn giản."],
  md: [{ t: "Bài toán đường đi ngắn nhất", y: ["Đồ thị có trọng số: mỗi cạnh gắn một số (độ dài, thời gian, chi phí).", "Thuật toán tìm đường ngắn nhất: lần lượt gán nhãn tạm cho các đỉnh rồi cố định nhãn nhỏ nhất (thuật toán Dijkstra).", "Kết quả gồm độ dài ngắn nhất và đường đi tương ứng."],
     vd: { d: "Nêu các bước tìm đường ngắn nhất từ $A$ đến $E$ trong đồ thị có trọng số cho trước.", g: ["Gán nhãn $A=0$, các đỉnh khác $+\\infty$.", "Lặp: chọn đỉnh nhãn nhỏ nhất chưa cố định, cập nhật nhãn các đỉnh kề.", "Dừng khi $E$ được cố định; truy vết ngược để có đường đi."] } }],
  tt: { d: "Ứng dụng bản đồ trên điện thoại tìm đường nhanh nhất từ nhà đến trường. Hãy mô tả bài toán đó bằng ngôn ngữ đồ thị và cho biết trọng số nên là gì vào giờ cao điểm.",
      g: ["Các ngã tư là đỉnh, các đoạn đường là cạnh.", "Trọng số nên là thời gian di chuyển (có tính tắc đường), không phải độ dài.", "Thuật toán tìm đường ngắn nhất theo trọng số thời gian sẽ cho lộ trình nhanh nhất."] },
  cs: "ai", ai: { p: "Mô tả các bước của thuật toán tìm đường đi ngắn nhất trên đồ thị có trọng số.", l: "AI hay bỏ bước cập nhật nhãn, hoặc áp dụng khi có trọng số âm (thuật toán Dijkstra không dùng được)." },
  bt: "Bài 2.13 – 2.18 Chuyên đề trang 50." },

11: { t: 3, yc: ["Nhận biết hình chiếu vuông góc và hình chiếu trục đo; vẽ hình chiếu của vật thể đơn giản."],
  md: [{ t: "Hình chiếu vuông góc", y: ["Ba hình chiếu cơ bản: hình chiếu đứng, hình chiếu bằng, hình chiếu cạnh.", "Các hình chiếu được bố trí theo quy ước: chiếu bằng đặt dưới chiếu đứng, chiếu cạnh đặt bên phải.", "Từ ba hình chiếu có thể dựng lại hình dạng vật thể."] },
   { t: "Hình chiếu trục đo", y: ["Hình chiếu trục đo cho hình ảnh ba chiều trực quan của vật thể.", "Hệ số biến dạng theo các trục cho biết tỉ lệ rút ngắn."] }],
  tt: { d: "Vì sao bản vẽ kĩ thuật của một chi tiết máy cần cả ba hình chiếu vuông góc chứ không chỉ một hình chiếu trục đo đẹp mắt?",
      g: ["Hình chiếu trục đo trực quan nhưng kích thước bị biến dạng, khó ghi chính xác.", "Ba hình chiếu vuông góc cho kích thước thật theo từng phương.", "Người gia công cần số liệu chính xác nên bắt buộc có hình chiếu vuông góc."] },
  cs: "geogebra3d", ai: { p: "Mô tả ba hình chiếu vuông góc của một khối hộp có rãnh.", l: "AI hay mô tả sai vị trí quy ước của hình chiếu bằng và hình chiếu cạnh." },
  bt: "Bài 3.1 – 3.6 Chuyên đề trang 66." },

12: { t: 3, yc: ["Đọc và lập bản vẽ kĩ thuật đơn giản theo đúng nguyên tắc."],
  md: [{ t: "Nguyên tắc bản vẽ kĩ thuật", y: ["Nguyên tắc phản chuyển: các hình biểu diễn xác định duy nhất hình dạng vật thể.", "Nguyên tắc đầy đủ: ghi đủ kích thước để chế tạo được vật thể.", "Bản vẽ có khung bản vẽ, khung tên, tỉ lệ và yêu cầu kĩ thuật."],
     vd: { d: "Một bản vẽ chỉ ghi chiều dài và chiều rộng của tấm thép chữ nhật. Bản vẽ đó đạt yêu cầu chưa?", g: ["Thiếu chiều dày nên không chế tạo được.", "Vi phạm nguyên tắc đầy đủ."] } }],
  tt: { d: "Lập bản vẽ kĩ thuật đơn giản cho một chiếc kệ sách gỗ ba tầng để đặt gia công. Cần ghi những thông tin gì để thợ làm đúng ý?",
      g: ["Ba hình chiếu vuông góc kèm kích thước đầy đủ: cao, rộng, sâu, khoảng cách giữa các tầng, độ dày ván.", "Khung tên: tên sản phẩm, vật liệu, tỉ lệ, người vẽ.", "Yêu cầu kĩ thuật: loại gỗ, cách liên kết, xử lí bề mặt."] },
  cs: "geogebra3d", ai: { p: "Liệt kê các thông tin bắt buộc trên một bản vẽ kĩ thuật.", l: "AI hay quên khung tên và yêu cầu kĩ thuật, chỉ nói về hình vẽ." },
  bt: "Bài 3.7 – 3.12 Chuyên đề trang 78." }
  };

  T["CD12"] = {
1: { t: 4, yc: ["Nhận biết biến ngẫu nhiên rời rạc và bảng phân bố xác suất.", "Tính kì vọng, phương sai, độ lệch chuẩn."],
  md: [
   { t: "Bảng phân bố xác suất", y: ["Biến ngẫu nhiên rời rạc $X$ nhận các giá trị $x_1,\\dots,x_n$ với xác suất $p_1,\\dots,p_n$, $\\sum p_i=1$.", "Bảng phân bố xác suất liệt kê các cặp $(x_i;p_i)$."],
     vd: { d: "Gieo hai đồng xu, $X$ là số mặt sấp. Lập bảng phân bố xác suất.", g: ["$X\\in\\{0;1;2\\}$.", "$P(X=0)=\\dfrac14$, $P(X=1)=\\dfrac12$, $P(X=2)=\\dfrac14$."] } },
   { t: "Kì vọng và phương sai", y: ["$E(X)=\\sum x_ip_i$ — giá trị trung bình về lâu dài.", "$V(X)=\\sum x_i^2p_i-\\left[E(X)\\right]^2$; $\\sigma=\\sqrt{V(X)}$."],
     vd: { d: "Tính $E(X)$, $V(X)$ của ví dụ trên.", g: ["$E(X)=0\\cdot\\dfrac14+1\\cdot\\dfrac12+2\\cdot\\dfrac14=1$.", "$\\sum x_i^2p_i=0+\\dfrac12+1=\\dfrac32$, nên $V(X)=\\dfrac32-1=\\dfrac12$."] } }],
  tt: { d: "Một công ty bảo hiểm bán gói bảo hiểm $500$ nghìn đồng/năm, xác suất phải bồi thường $20$ triệu đồng là $0{,}015$. Tính lợi nhuận kì vọng trên mỗi hợp đồng.",
      g: ["$X$ là lợi nhuận: $0{,}5$ triệu với xác suất $0{,}985$; $0{,}5-20=-19{,}5$ triệu với xác suất $0{,}015$.", "$E(X)=0{,}5\\cdot0{,}985-19{,}5\\cdot0{,}015=0{,}4925-0{,}2925$.", "$=0{,}2$ triệu đồng mỗi hợp đồng."] },
  cs: "excel", ai: { p: "Tính lợi nhuận kì vọng của gói bảo hiểm nói trên.", l: "AI hay quên rằng khi bồi thường công ty vẫn thu phí, nên tính nhầm giá trị $-20$ thay vì $-19{,}5$." },
  bt: "Bài 1.1 – 1.8 Chuyên đề trang 12." },

2: { t: 4, yc: ["Nhận biết phân bố nhị thức.", "Tính xác suất, kì vọng, phương sai của biến ngẫu nhiên có phân bố nhị thức."],
  md: [
   { t: "Phân bố nhị thức", y: ["$X\\sim B(n;p)$ khi $X$ là số lần thành công trong $n$ phép thử Bernoulli độc lập.", "$P(X=k)=C_n^kp^k(1-p)^{n-k}$.", "$E(X)=np$; $V(X)=np(1-p)$."],
     vd: { d: "Gieo $5$ lần một đồng xu cân đối. Tính xác suất có đúng $3$ lần mặt sấp.", g: ["$X\\sim B\\left(5;\\dfrac12\\right)$.", "$P(X=3)=C_5^3\\left(\\dfrac12\\right)^5=\\dfrac{10}{32}=0{,}3125$."] } }],
  tt: { d: "Một dây chuyền có tỉ lệ sản phẩm lỗi $4\\%$. Kiểm tra ngẫu nhiên $20$ sản phẩm. Tính xác suất có không quá $1$ sản phẩm lỗi và số sản phẩm lỗi trung bình.",
      g: ["$X\\sim B(20;0{,}04)$.", "$P(X\\le1)=0{,}96^{20}+20\\cdot0{,}04\\cdot0{,}96^{19}\\approx0{,}442+0{,}368=0{,}810$.", "$E(X)=20\\cdot0{,}04=0{,}8$ sản phẩm."] },
  cs: "excel", ai: { p: "Dây chuyền lỗi 4%, kiểm tra 20 sản phẩm, tính xác suất không quá 1 sản phẩm lỗi.", l: "AI hay chỉ tính $P(X=1)$ mà quên cộng $P(X=0)$." },
  bt: "Bài 1.9 – 1.15 Chuyên đề trang 22." },

3: { t: 4, yc: ["Vận dụng hệ bất phương trình bậc nhất hai ẩn giải bài toán quy hoạch tuyến tính."],
  md: [{ t: "Bài toán quy hoạch tuyến tính", y: ["Lập hàm mục tiêu $F=ax+by$ và hệ ràng buộc.", "Miền nghiệm là miền đa giác lồi; $F$ đạt cực trị tại đỉnh.", "Quy trình: đặt ẩn → lập ràng buộc → vẽ miền → tính $F$ tại các đỉnh."],
     vd: { d: "Tìm giá trị lớn nhất của $F=2x+3y$ với $x+y\\le10$, $2x+y\\le16$, $x,y\\ge0$.", g: ["Các đỉnh: $(0;0)$, $(8;0)$, $(6;4)$, $(0;10)$.", "$F$ lần lượt $0$; $16$; $24$; $30$.", "$F_{\\max}=30$ tại $(0;10)$."] } }],
  tt: { d: "Một xưởng sản xuất hai loại bàn: loại A lãi $700$ nghìn, cần $3$ giờ máy; loại B lãi $500$ nghìn, cần $2$ giờ máy. Mỗi tuần xưởng có $120$ giờ máy và tối đa $50$ sản phẩm. Lập kế hoạch sản xuất để lãi cao nhất.",
      g: ["Ràng buộc: $3x+2y\\le120$; $x+y\\le50$; $x,y\\ge0$.", "Các đỉnh: $(0;0)$, $(40;0)$, $(20;30)$, $(0;50)$.", "$L=700x+500y$ lớn nhất tại $(20;30)$: $L=29$ triệu đồng/tuần."] },
  cs: "excel", ai: { p: "Giải bài toán quy hoạch tuyến tính với hai ràng buộc nói trên.", l: "AI hay bỏ sót đỉnh giao của hai đường ràng buộc, chỉ xét các đỉnh trên trục." },
  bt: "Bài 2.1 – 2.6 Chuyên đề trang 38." },

4: { t: 4, yc: ["Vận dụng đạo hàm giải bài toán tối ưu trong thực tiễn."],
  md: [{ t: "Tối ưu bằng đạo hàm", y: ["Lập hàm mục tiêu một biến trên miền xác định thực tế.", "Tìm điểm tới hạn qua $f'(x)=0$, lập bảng biến thiên và kết luận.", "Luôn kiểm tra nghiệm có thoả điều kiện thực tế hay không."],
     vd: { d: "Cần làm hộp hình trụ không nắp thể tích $500$ cm³ tốn ít vật liệu nhất. Tìm bán kính đáy.", g: ["$h=\\dfrac{500}{\\pi r^2}$; $S=\\pi r^2+2\\pi rh=\\pi r^2+\\dfrac{1000}{r}$.", "$S'=2\\pi r-\\dfrac{1000}{r^2}=0 \\Leftrightarrow r^3=\\dfrac{500}{\\pi}$.", "$r\\approx5{,}42$ cm, khi đó $h\\approx5{,}42$ cm (bằng bán kính)."] } }],
  tt: { d: "Một hãng vận tải tính chi phí nhiên liệu mỗi giờ là $\\dfrac{v^2}{200}$ (nghìn đồng) và chi phí tài xế là $240$ nghìn đồng/giờ, với $v$ là vận tốc (km/h). Tìm vận tốc để chi phí trên mỗi km nhỏ nhất.",
      g: ["Thời gian đi $1$ km là $\\dfrac1v$ giờ, chi phí mỗi km $C(v)=\\dfrac{1}{v}\\left(\\dfrac{v^2}{200}+240\\right)=\\dfrac{v}{200}+\\dfrac{240}{v}$.", "$C'(v)=\\dfrac{1}{200}-\\dfrac{240}{v^2}=0 \\Leftrightarrow v^2=48\\,000$.", "$v\\approx219$ km/h — vượt giới hạn cho phép, nên thực tế chọn vận tốc tối đa hợp pháp."] },
  cs: "geogebra", ai: { p: "Tìm vận tốc tối ưu cho bài toán chi phí vận tải nói trên.", l: "AI hay bỏ qua bước đối chiếu với điều kiện thực tế (giới hạn tốc độ), kết luận thiếu thực tiễn." },
  bt: "Bài 2.7 – 2.12 Chuyên đề trang 48." },

5: { t: 4, yc: ["Hiểu khái niệm tiền tệ, lãi đơn, lãi kép.", "Tính giá trị tương lai, giá trị hiện tại của một khoản tiền."],
  md: [{ t: "Lãi đơn và lãi kép", y: ["Lãi đơn: $T_n=T_0(1+nr)$.", "Lãi kép: $T_n=T_0(1+r)^n$.", "Giá trị hiện tại: $T_0=\\dfrac{T_n}{(1+r)^n}$.", "Lãi kép theo kì: nếu một năm ghép $m$ kì thì $T=T_0\\left(1+\\dfrac{r}{m}\\right)^{mn}$."],
     vd: { d: "Gửi $100$ triệu, lãi suất $6\\%$/năm. So sánh số tiền sau $5$ năm theo lãi đơn và lãi kép.", g: ["Lãi đơn: $100(1+5\\cdot0{,}06)=130$ triệu.", "Lãi kép: $100(1{,}06)^5\\approx133{,}8$ triệu.", "Lãi kép hơn khoảng $3{,}8$ triệu."] } }],
  tt: { d: "Để có $500$ triệu đồng sau $10$ năm cho con vào đại học, bây giờ cần gửi bao nhiêu với lãi suất $6{,}5\\%$/năm ghép lãi hằng năm?",
      g: ["$T_0=\\dfrac{500}{(1{,}065)^{10}}$.", "$(1{,}065)^{10}\\approx1{,}877$.", "$T_0\\approx266{,}4$ triệu đồng."] },
  cs: "excel", ai: { p: "Cần gửi bao nhiêu hôm nay để có 500 triệu sau 10 năm, lãi 6,5%/năm?", l: "AI hay chia $500$ cho $(1+0{,}065\\cdot10)$ (lãi đơn) thay vì chiết khấu theo lãi kép." },
  bt: "Bài 3.1 – 3.8 Chuyên đề trang 60." },

6: { t: 4, yc: ["Hiểu khái niệm tín dụng, vay trả góp.", "Tính số tiền trả mỗi kì và tổng lãi phải trả."],
  md: [{ t: "Vay trả góp", y: ["Số tiền trả đều mỗi kì: $A=\\dfrac{P\\cdot r(1+r)^n}{(1+r)^n-1}$ với $P$ là tiền vay, $r$ lãi suất mỗi kì, $n$ số kì.", "Tổng lãi $=nA-P$.", "Lãi suất danh nghĩa khác lãi suất thực tế khi số dư giảm dần."],
     vd: { d: "Vay $300$ triệu trong $5$ năm, lãi $1\\%$/tháng, trả góp đều hằng tháng. Tính số tiền trả mỗi tháng.", g: ["$n=60$, $r=0{,}01$, $(1{,}01)^{60}\\approx1{,}8167$.", "$A=\\dfrac{300\\cdot0{,}01\\cdot1{,}8167}{0{,}8167}\\approx6{,}67$ triệu đồng/tháng.", "Tổng trả $\\approx400$ triệu, tức lãi khoảng $100$ triệu."] } }],
  tt: { d: "Một cửa hàng quảng cáo “mua trả góp $0\\%$ lãi suất” cho điện thoại giá $20$ triệu, trả trong $12$ tháng nhưng thu phí hồ sơ $1{,}5$ triệu ngay từ đầu. Lãi suất thực tế khoảng bao nhiêu?",
      g: ["Thực chất khách nhận giá trị $20$ triệu nhưng trả tổng $21{,}5$ triệu.", "Mỗi tháng trả $\\dfrac{20}{12}\\approx1{,}667$ triệu, cộng phí ban đầu.", "Giải $20=1{,}667\\cdot\\dfrac{1-(1+r)^{-12}}{r}$ sau khi trừ phí, được $r\\approx1{,}15\\%$/tháng, tức gần $14\\%$/năm — không hề “$0\\%$”."] },
  cs: "excel", ai: { p: "Tính số tiền trả góp mỗi tháng khi vay 300 triệu, 5 năm, lãi 1%/tháng.", l: "AI hay chia đều $300/60$ rồi cộng lãi trên dư nợ gốc ban đầu, cho con số thấp hơn thực tế." },
  bt: "Bài 3.9 – 3.16 Chuyên đề trang 70." },

7: { t: 4, yc: ["Hiểu các kênh đầu tư cơ bản và rủi ro.", "Lập kế hoạch tài chính cá nhân đơn giản."],
  md: [{ t: "Đầu tư và rủi ro", y: ["Lợi nhuận kì vọng $E(R)=\\sum p_iR_i$; rủi ro đo bằng độ lệch chuẩn.", "Nguyên tắc: lợi nhuận kì vọng càng cao thường đi kèm rủi ro càng lớn.", "Đa dạng hoá danh mục giúp giảm rủi ro."],
     vd: { d: "Một khoản đầu tư có $60\\%$ khả năng lãi $20\\%$ và $40\\%$ khả năng lỗ $10\\%$. Tính lợi nhuận kì vọng.", g: ["$E(R)=0{,}6\\cdot20\\%+0{,}4\\cdot(-10\\%)$.", "$=12\\%-4\\%=8\\%$."] } },
   { t: "Kế hoạch tài chính cá nhân", y: ["Các bước: xác định mục tiêu → ước lượng thu nhập, chi tiêu → lập kế hoạch tiết kiệm → theo dõi, điều chỉnh.", "Nguyên tắc quỹ dự phòng: để dành $3$–$6$ tháng chi tiêu."] }],
  tt: { d: "Một bạn học sinh đi làm thêm được $2$ triệu đồng/tháng, muốn mua máy tính $18$ triệu sau $1$ năm. Hãy lập kế hoạch tiết kiệm và cho biết nếu gửi tiết kiệm $5\\%$/năm thì mỗi tháng cần để dành bao nhiêu.",
      g: ["Nếu chỉ cất tiền: cần $18/12=1{,}5$ triệu đồng/tháng.", "Nếu gửi tiết kiệm hằng tháng lãi $r=\\dfrac{0{,}05}{12}$: $18=A\\cdot\\dfrac{(1+r)^{12}-1}{r}$.", "$A\\approx1{,}46$ triệu đồng/tháng — tiết kiệm giúp giảm nhẹ gánh nặng."] },
  cs: "excel", ai: { p: "Cần để dành mỗi tháng bao nhiêu để có 18 triệu sau 1 năm với lãi 5%/năm?", l: "AI hay bỏ qua việc tiền gửi mỗi tháng sinh lãi khác nhau, chỉ chia đều $18/12$." },
  bt: "Bài 3.17 – 3.24 Chuyên đề trang 82." }
  };
})(window);
