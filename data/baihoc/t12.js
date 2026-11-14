/* data/baihoc/t12.js — dữ liệu dạy học Toán 12 (Kết nối tri thức với cuộc sống) */
(function (G) {
  const B = G.BAIHOC = G.BAIHOC || {}; const T = B["Toán"] = B["Toán"] || {};
  T[12] = {
1: { t: 4, yc: ["Nhận biết tính đơn điệu của hàm số qua dấu của đạo hàm.", "Tìm cực trị của hàm số; đọc bảng biến thiên và đồ thị."],
  md: [
   { t: "Tính đơn điệu", y: ["$f'(x)>0$ trên $K$ thì $f$ đồng biến trên $K$; $f'(x)<0$ thì $f$ nghịch biến.", "Quy trình: tìm tập xác định → tính $f'(x)$ → tìm nghiệm $f'(x)=0$ → lập bảng xét dấu → kết luận."],
     vd: { d: "Xét tính đơn điệu của $y=x^3-3x^2+2$.", g: ["$y'=3x^2-6x=3x(x-2)$.", "$y'=0 \\Leftrightarrow x=0$ hoặc $x=2$.", "Hàm đồng biến trên $(-\\infty;0)$ và $(2;+\\infty)$, nghịch biến trên $(0;2)$."] } },
   { t: "Cực trị", y: ["$x_0$ là điểm cực đại nếu $f'$ đổi dấu từ $+$ sang $-$ khi qua $x_0$; cực tiểu thì ngược lại.", "Quy tắc 2: nếu $f'(x_0)=0$ và $f''(x_0)<0$ thì $x_0$ là điểm cực đại; $f''(x_0)>0$ thì cực tiểu."],
     vd: { d: "Tìm cực trị của hàm số trên.", g: ["Qua $x=0$ đạo hàm đổi dấu $+\\to-$: điểm cực đại, $y_{CĐ}=2$.", "Qua $x=2$ đạo hàm đổi dấu $-\\to+$: điểm cực tiểu, $y_{CT}=-2$."] } }],
  tt: { d: "Số ca mắc một dịch bệnh sau $t$ ngày được mô hình hoá bởi $N(t)=-t^3+30t^2+1000$ ($0\\le t\\le25$). Hỏi dịch bùng phát mạnh nhất (số ca tăng nhanh nhất) vào ngày thứ mấy?",
      g: ["Tốc độ tăng là $N'(t)=-3t^2+60t$.", "Tốc độ tăng lớn nhất khi $N''(t)=-6t+60=0 \\Leftrightarrow t=10$.", "Vậy dịch tăng nhanh nhất vào ngày thứ $10$."] },
  cs: "geogebra", ai: { p: "Xét tính đơn điệu và tìm cực trị của $y=x^3-3x^2+2$.", l: "AI hay kết luận $x=0$, $x=2$ đều là cực trị mà không lập bảng xét dấu, dễ sai với hàm có $f'$ không đổi dấu." },
  bt: "Bài 1.1 – 1.8 SGK trang 15." },

2: { t: 3, yc: ["Tìm giá trị lớn nhất, nhỏ nhất của hàm số trên một đoạn, một khoảng.", "Vận dụng vào bài toán tối ưu thực tiễn."],
  md: [
   { t: "Giá trị lớn nhất, nhỏ nhất trên đoạn", y: ["Quy trình trên $[a;b]$: tính $f'(x)$, tìm $x_i\\in(a;b)$ thoả $f'(x_i)=0$, so sánh $f(a)$, $f(b)$, $f(x_i)$.", "Trên khoảng: lập bảng biến thiên rồi kết luận."],
     vd: { d: "Tìm giá trị lớn nhất, nhỏ nhất của $y=x^3-3x+1$ trên $[0;2]$.", g: ["$y'=3x^2-3=0 \\Leftrightarrow x=\\pm1$; chỉ nhận $x=1\\in[0;2]$.", "$y(0)=1$, $y(1)=-1$, $y(2)=3$.", "$y_{\\max}=3$ tại $x=2$; $y_{\\min}=-1$ tại $x=1$."] } }],
  tt: { d: "Cần làm một thùng tôn hình hộp chữ nhật không nắp, đáy vuông, thể tích $32$ dm³. Tìm kích thước để tốn ít tôn nhất.",
      g: ["Gọi cạnh đáy $x$, chiều cao $h=\\dfrac{32}{x^2}$.", "$S(x)=x^2+4xh=x^2+\\dfrac{128}{x}$; $S'(x)=2x-\\dfrac{128}{x^2}=0 \\Leftrightarrow x^3=64 \\Rightarrow x=4$.", "Vậy đáy $4\\times4$ dm, cao $2$ dm, tốn $48$ dm² tôn."] },
  cs: "geogebra", ai: { p: "Thùng không nắp đáy vuông thể tích 32 dm³, tìm kích thước tốn ít tôn nhất.", l: "AI hay tính diện tích toàn phần gồm cả nắp ($2x^2+4xh$), ra kích thước sai." },
  bt: "Bài 1.9 – 1.14 SGK trang 21." },

3: { t: 2, yc: ["Nhận biết đường tiệm cận đứng, ngang, xiên của đồ thị hàm số."],
  md: [
   { t: "Tiệm cận đứng và ngang", y: ["$x=x_0$ là tiệm cận đứng nếu $\\lim\\limits_{x\\to x_0^{\\pm}}f(x)=\\pm\\infty$.", "$y=y_0$ là tiệm cận ngang nếu $\\lim\\limits_{x\\to\\pm\\infty}f(x)=y_0$."],
     vd: { d: "Tìm các tiệm cận của $y=\\dfrac{2x+1}{x-1}$.", g: ["$\\lim\\limits_{x\\to1^+}y=+\\infty$ nên $x=1$ là tiệm cận đứng.", "$\\lim\\limits_{x\\to\\pm\\infty}y=2$ nên $y=2$ là tiệm cận ngang."] } },
   { t: "Tiệm cận xiên", y: ["$y=ax+b$ là tiệm cận xiên nếu $\\lim\\limits_{x\\to\\pm\\infty}\\left[f(x)-(ax+b)\\right]=0$.", "Với hàm phân thức bậc hai trên bậc nhất, chia đa thức để tách phần nguyên."],
     vd: { d: "Tìm tiệm cận xiên của $y=\\dfrac{x^2+x+1}{x}$.", g: ["$y=x+1+\\dfrac1x$.", "$\\lim\\limits_{x\\to\\pm\\infty}\\dfrac1x=0$ nên $y=x+1$ là tiệm cận xiên."] } }],
  tt: { d: "Chi phí trung bình để sản xuất một sản phẩm là $C(x)=\\dfrac{2000+5x}{x}$ (nghìn đồng), $x$ là số sản phẩm. Khi sản xuất rất nhiều thì chi phí trung bình tiến về đâu? Ý nghĩa kinh tế?",
      g: ["$C(x)=5+\\dfrac{2000}{x}$.", "$\\lim\\limits_{x\\to+\\infty}C(x)=5$, đường $y=5$ là tiệm cận ngang.", "Nghĩa là chi phí trung bình giảm dần nhưng không bao giờ thấp hơn $5$ nghìn đồng mỗi sản phẩm."] },
  cs: "geogebra", ai: { p: "Tìm các đường tiệm cận của $y=\\dfrac{x^2+x+1}{x}$.", l: "AI đôi khi bỏ sót tiệm cận đứng $x=0$ khi đã tìm được tiệm cận xiên." },
  bt: "Bài 1.15 – 1.19 SGK trang 27." },

4: { t: 4, yc: ["Khảo sát và vẽ đồ thị hàm số bậc ba, hàm phân thức bậc nhất trên bậc nhất và bậc hai trên bậc nhất.", "Đọc đồ thị, nhận dạng hàm số từ đồ thị."],
  md: [
   { t: "Sơ đồ khảo sát", y: ["1) Tập xác định. 2) Đạo hàm, cực trị, đơn điệu. 3) Giới hạn và tiệm cận. 4) Bảng biến thiên. 5) Điểm đặc biệt và vẽ đồ thị.", "Đồ thị hàm bậc ba có tâm đối xứng là điểm uốn; đồ thị phân thức nhận giao hai tiệm cận làm tâm đối xứng."],
     vd: { d: "Khảo sát và vẽ đồ thị $y=\\dfrac{x+2}{x-1}$.", g: ["Tập xác định $\\mathbb{R}\\setminus\\{1\\}$; $y'=\\dfrac{-3}{(x-1)^2}<0$.", "Hàm nghịch biến trên từng khoảng xác định, không có cực trị.", "Tiệm cận đứng $x=1$, tiệm cận ngang $y=1$; đồ thị là hypebol nhận $I(1;1)$ làm tâm đối xứng."] } }],
  tt: { d: "Lượng thuốc còn trong máu (mg) sau $t$ giờ là $f(t)=\\dfrac{20t}{t^2+4}$. Vẽ phác đồ thị và cho biết sau bao lâu lượng thuốc đạt mức cao nhất.",
      g: ["$f'(t)=\\dfrac{20(4-t^2)}{(t^2+4)^2}$; $f'(t)=0 \\Leftrightarrow t=2$ (loại $t=-2$).", "$f$ tăng trên $(0;2)$, giảm trên $(2;+\\infty)$.", "Sau $2$ giờ lượng thuốc đạt cao nhất $f(2)=5$ mg, sau đó giảm dần về $0$."] },
  cs: "geogebra", ai: { p: "Khảo sát và vẽ đồ thị $y=\\dfrac{x+2}{x-1}$, nêu tâm đối xứng.", l: "AI hay kết luận hàm nghịch biến trên $\\mathbb{R}$ thay vì “trên từng khoảng xác định”." },
  bt: "Bài 1.20 – 1.26 SGK trang 35." },

5: { t: 3, yc: ["Vận dụng đạo hàm giải quyết các vấn đề thực tiễn: tối ưu chi phí, diện tích, thể tích, vận tốc."],
  md: [
   { t: "Quy trình giải bài toán tối ưu", y: ["Bước 1: Chọn ẩn và đặt điều kiện.", "Bước 2: Lập hàm số biểu thị đại lượng cần tối ưu.", "Bước 3: Khảo sát hàm trên miền điều kiện rồi kết luận."],
     vd: { d: "Trong các hình chữ nhật có chu vi $40$ m, tìm hình có diện tích lớn nhất.", g: ["Gọi một cạnh là $x$ $(0<x<20)$, cạnh kia $20-x$.", "$S(x)=x(20-x)=-x^2+20x$; $S'(x)=-2x+20=0 \\Leftrightarrow x=10$.", "Diện tích lớn nhất $100$ m² khi hình là hình vuông cạnh $10$ m."] } }],
  tt: { d: "Một trang trại muốn rào khu đất hình chữ nhật sát bờ sông (không rào phía bờ sông) bằng $120$ m lưới. Tìm diện tích lớn nhất có thể rào được.",
      g: ["Gọi chiều rộng (vuông góc bờ sông) là $x$, chiều dài là $120-2x$.", "$S(x)=x(120-2x)=-2x^2+120x$; $S'(x)=-4x+120=0 \\Leftrightarrow x=30$.", "$S_{\\max}=30\\cdot60=1800$ m²."] },
  cs: "geogebra", ai: { p: "Rào khu đất chữ nhật sát bờ sông bằng 120 m lưới, tìm diện tích lớn nhất.", l: "AI hay rào đủ bốn cạnh ($2x+2y=120$), bỏ qua chi tiết không rào phía bờ sông." },
  bt: "Bài 1.27 – 1.31 SGK trang 41." },

6: { t: 3, yc: ["Nhận biết vectơ trong không gian và các phép toán.", "Vận dụng quy tắc hình hộp, điều kiện đồng phẳng."],
  md: [
   { t: "Phép toán vectơ trong không gian", y: ["Cộng, trừ, nhân với một số như trong mặt phẳng; quy tắc ba điểm vẫn đúng.", "Quy tắc hình hộp: $\\overrightarrow{AB}+\\overrightarrow{AD}+\\overrightarrow{AA'}=\\overrightarrow{AC'}$.", "Ba vectơ đồng phẳng khi giá của chúng cùng song song với một mặt phẳng."],
     vd: { d: "Cho hình hộp $ABCD.A'B'C'D'$. Chứng minh $\\overrightarrow{AC'}=\\overrightarrow{AB}+\\overrightarrow{AD}+\\overrightarrow{AA'}$.", g: ["$\\overrightarrow{AC'}=\\overrightarrow{AC}+\\overrightarrow{CC'}$.", "$\\overrightarrow{AC}=\\overrightarrow{AB}+\\overrightarrow{AD}$ và $\\overrightarrow{CC'}=\\overrightarrow{AA'}$.", "Suy ra điều phải chứng minh."] } },
   { t: "Tích vô hướng trong không gian", y: ["$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos(\\vec a,\\vec b)$.", "$\\vec a\\perp\\vec b \\Leftrightarrow \\vec a\\cdot\\vec b=0$."] }],
  tt: { d: "Một vật chịu ba lực đồng thời theo ba cạnh của hình hộp xuất phát từ một đỉnh, độ lớn $3$ N, $4$ N, $12$ N đôi một vuông góc. Tính độ lớn hợp lực.",
      g: ["Hợp lực là vectơ đường chéo hình hộp chữ nhật.", "$|\\vec F|=\\sqrt{3^2+4^2+12^2}=\\sqrt{169}$.", "$|\\vec F|=13$ N."] },
  cs: "geogebra3d", ai: { p: "Ba lực 3 N, 4 N, 12 N đôi một vuông góc, tính hợp lực.", l: "AI hay cộng thẳng $3+4+12=19$ N." },
  bt: "Bài 2.1 – 2.6 SGK trang 54." },

7: { t: 3, yc: ["Nhận biết hệ trục toạ độ trong không gian, toạ độ điểm và vectơ.", "Xác định toạ độ trong các hình quen thuộc."],
  md: [
   { t: "Hệ trục toạ độ $Oxyz$", y: ["Ba trục đôi một vuông góc với các vectơ đơn vị $\\vec i$, $\\vec j$, $\\vec k$.", "$M(x;y;z) \\Leftrightarrow \\overrightarrow{OM}=x\\vec i+y\\vec j+z\\vec k$.", "$\\overrightarrow{AB}=(x_B-x_A;\\ y_B-y_A;\\ z_B-z_A)$."],
     vd: { d: "Cho $A(1;0;2)$, $B(3;4;-1)$. Tìm $\\overrightarrow{AB}$ và trung điểm $I$ của $AB$.", g: ["$\\overrightarrow{AB}=(2;4;-3)$.", "$I\\left(2;2;\\dfrac12\\right)$."] } }],
  tt: { d: "Một máy bay không người lái bay trong không gian với toạ độ (km) các vị trí liên tiếp $A(0;0;0{,}5)$, $B(4;3;1{,}2)$. Tính quãng đường bay giữa hai điểm.",
      g: ["$\\overrightarrow{AB}=(4;3;0{,}7)$.", "$AB=\\sqrt{16+9+0{,}49}=\\sqrt{25{,}49}$.", "$\\approx5{,}05$ km."] },
  cs: "geogebra3d", ai: { p: "Cho $A(1;0;2)$, $B(3;4;-1)$, tính $AB$ và trung điểm.", l: "AI đôi khi bỏ quên thành phần $z$ khi tính độ dài." },
  bt: "Bài 2.7 – 2.12 SGK trang 61." },

8: { t: 3, yc: ["Thực hiện các phép toán vectơ theo toạ độ trong không gian.", "Tính tích vô hướng, góc, khoảng cách; ứng dụng thực tiễn."],
  md: [
   { t: "Biểu thức toạ độ các phép toán", y: ["$\\vec u\\pm\\vec v=(x_1\\pm x_2;\\ y_1\\pm y_2;\\ z_1\\pm z_2)$; $k\\vec u=(kx;ky;kz)$.", "$\\vec u\\cdot\\vec v=x_1x_2+y_1y_2+z_1z_2$.", "$|\\vec u|=\\sqrt{x^2+y^2+z^2}$; $\\cos(\\vec u,\\vec v)=\\dfrac{\\vec u\\cdot\\vec v}{|\\vec u||\\vec v|}$."],
     vd: { d: "Cho $\\vec u=(1;2;-2)$, $\\vec v=(2;-1;2)$. Tính $\\vec u\\cdot\\vec v$ và góc giữa hai vectơ.", g: ["$\\vec u\\cdot\\vec v=2-2-4=-4$.", "$|\\vec u|=3$, $|\\vec v|=3$ nên $\\cos\\varphi=-\\dfrac49$.", "$\\varphi\\approx116^\\circ23'$."] } }],
  tt: { d: "Hai dây cáp treo xuất phát từ đỉnh cột $S(0;0;12)$ xuống hai điểm neo $A(5;0;0)$ và $B(0;7;0)$ (đơn vị mét). Tính góc giữa hai dây cáp.",
      g: ["$\\overrightarrow{SA}=(5;0;-12)$, $\\overrightarrow{SB}=(0;7;-12)$.", "$\\cos\\varphi=\\dfrac{0+0+144}{13\\cdot\\sqrt{193}}\\approx0{,}797$.", "$\\varphi\\approx37^\\circ$."] },
  cs: "geogebra3d", ai: { p: "Tính góc giữa hai vectơ $(1;2;-2)$ và $(2;-1;2)$.", l: "AI hay quên lấy giá trị tuyệt đối hoặc nhầm giữa góc hai vectơ và góc hai đường thẳng." },
  bt: "Bài 2.13 – 2.18 SGK trang 68." },

9: { t: 2, yc: ["Tính khoảng biến thiên, khoảng tứ phân vị của mẫu số liệu ghép nhóm.", "Giải thích ý nghĩa, phát hiện giá trị bất thường."],
  md: [
   { t: "Khoảng biến thiên và khoảng tứ phân vị", y: ["$R=$ đầu mút phải nhóm cuối $-$ đầu mút trái nhóm đầu.", "$\\Delta_Q=Q_3-Q_1$ với $Q_1$, $Q_3$ tính theo công thức nội suy của mẫu ghép nhóm.", "$\\Delta_Q$ phản ánh độ phân tán của $50\\%$ số liệu ở giữa, ít bị ảnh hưởng bởi giá trị bất thường."],
     vd: { d: "Cho bảng ghép nhóm thời gian chạy (giây): $[10;12)$: 5; $[12;14)$: 12; $[14;16)$: 8; $[16;18)$: 5. Tính $R$.", g: ["$R=18-10=8$ giây.", "Cỡ mẫu $n=30$."] } }],
  tt: { d: "Hai lớp cùng khảo sát thời gian chạy $100$ m. Lớp A có $\\Delta_Q=1{,}2$ s, lớp B có $\\Delta_Q=3{,}5$ s. Lớp nào có thành tích đồng đều hơn? Điều đó có ý nghĩa gì khi chọn đội tuyển tiếp sức?",
      g: ["Khoảng tứ phân vị nhỏ nghĩa là số liệu tập trung hơn.", "Lớp A đồng đều hơn.", "Đội tiếp sức cần các thành viên đều tay nên ưu tiên chọn từ lớp A."] },
  cs: "excel", ai: { p: "Tính khoảng biến thiên và khoảng tứ phân vị của bảng ghép nhóm đã cho.", l: "AI hay lấy $R$ bằng hiệu hai giá trị đại diện thay vì hai đầu mút nhóm." },
  bt: "Bài 3.1 – 3.5 SGK trang 78." },

10: { t: 3, yc: ["Tính phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm.", "So sánh độ phân tán và giải thích ý nghĩa trong thực tiễn."],
  md: [
   { t: "Phương sai và độ lệch chuẩn", y: ["$s^2=\\dfrac{1}{n}\\sum n_i c_i^2-\\bar{x}^2$ với $c_i$ là giá trị đại diện nhóm.", "$s=\\sqrt{s^2}$, cùng đơn vị với số liệu.", "Hai mẫu cùng trung bình: mẫu nào $s$ nhỏ hơn thì đồng đều hơn."],
     vd: { d: "Cho bảng: $[0;10)$: 2; $[10;20)$: 5; $[20;30)$: 3. Tính $\\bar{x}$ và $s$.", g: ["$c_i$ lần lượt $5;15;25$; $n=10$.", "$\\bar{x}=\\dfrac{2\\cdot5+5\\cdot15+3\\cdot25}{10}=16$.", "$s^2=\\dfrac{2\\cdot25+5\\cdot225+3\\cdot625}{10}-16^2=305-256=49$, nên $s=7$."] } }],
  tt: { d: "Hai dây chuyền đóng gói cùng cho khối lượng trung bình $500$ g. Dây chuyền I có $s=2$ g, dây chuyền II có $s=9$ g. Tiêu chuẩn cho phép sai lệch $\\pm10$ g. Dây chuyền nào đáng lo hơn?",
      g: ["Với dây chuyền I, $10$ g ứng với $5s$ — hầu như không có gói nào vượt chuẩn.", "Với dây chuyền II, $10$ g chỉ hơn $1s$ một chút — khá nhiều gói lệch chuẩn.", "Dây chuyền II cần được hiệu chỉnh."] },
  cs: "excel", ai: { p: "Tính phương sai và độ lệch chuẩn của bảng tần số ghép nhóm đã cho.", l: "AI hay dùng đầu mút nhóm thay cho giá trị đại diện $c_i$, hoặc chia cho $n-1$." },
  bt: "Bài 3.6 – 3.10 SGK trang 84." },

11: { t: 3, yc: ["Nhận biết nguyên hàm và tính chất.", "Tìm nguyên hàm của hàm số sơ cấp cơ bản."],
  md: [
   { t: "Khái niệm nguyên hàm", y: ["$F$ là nguyên hàm của $f$ trên $K$ nếu $F'(x)=f(x)$ với mọi $x\\in K$.", "Mọi nguyên hàm của $f$ có dạng $F(x)+C$.", "$\\int\\left[f(x)\\pm g(x)\\right]dx=\\int f(x)dx\\pm\\int g(x)dx$; $\\int kf(x)dx=k\\int f(x)dx$."] },
   { t: "Nguyên hàm của hàm sơ cấp", y: ["$\\int x^\\alpha dx=\\dfrac{x^{\\alpha+1}}{\\alpha+1}+C$ $(\\alpha\\ne-1)$; $\\int\\dfrac{1}{x}dx=\\ln|x|+C$.", "$\\int e^xdx=e^x+C$; $\\int a^xdx=\\dfrac{a^x}{\\ln a}+C$.", "$\\int\\cos xdx=\\sin x+C$; $\\int\\sin xdx=-\\cos x+C$; $\\int\\dfrac{dx}{\\cos^2x}=\\tan x+C$."],
     vd: { d: "Tìm $\\int\\left(3x^2-\\dfrac{2}{x}+e^x\\right)dx$.", g: ["$\\int3x^2dx=x^3$.", "$\\int\\dfrac{2}{x}dx=2\\ln|x|$.", "Kết quả: $x^3-2\\ln|x|+e^x+C$."] } }],
  tt: { d: "Một vật chuyển động với vận tốc $v(t)=6t^2+2$ (m/s). Biết tại $t=0$ vật ở vị trí $s=5$ m. Tìm quãng đường $s(t)$ và vị trí vật sau $3$ giây.",
      g: ["$s(t)=\\int v(t)dt=2t^3+2t+C$.", "$s(0)=5 \\Rightarrow C=5$.", "$s(3)=54+6+5=65$ m."] },
  cs: "casio", ai: { p: "Tìm nguyên hàm của $3x^2-\\dfrac2x+e^x$.", l: "AI hay viết $\\int\\dfrac1x dx=\\ln x$ mà thiếu dấu giá trị tuyệt đối và hằng số $C$." },
  bt: "Bài 4.1 – 4.6 SGK trang 11 (Tập 2)." },

12: { t: 3, yc: ["Nhận biết tích phân và tính chất.", "Tính tích phân bằng định nghĩa Newton–Leibniz và tính chất cơ bản."],
  md: [
   { t: "Định nghĩa và tính chất", y: ["$\\int_a^b f(x)dx=F(b)-F(a)$ với $F$ là một nguyên hàm của $f$.", "$\\int_a^a f=0$; $\\int_a^b f=-\\int_b^a f$; $\\int_a^b f=\\int_a^c f+\\int_c^b f$.", "Tích phân của tổng bằng tổng tích phân."],
     vd: { d: "Tính $I=\\int_0^2(3x^2+1)dx$.", g: ["Nguyên hàm: $F(x)=x^3+x$.", "$I=F(2)-F(0)=(8+2)-0=10$."] } }],
  tt: { d: "Lưu lượng nước chảy vào hồ là $r(t)=100+20t$ (m³/giờ) trong $5$ giờ đầu. Tính tổng lượng nước chảy vào hồ trong $5$ giờ đó.",
      g: ["Lượng nước $=\\int_0^5(100+20t)dt$.", "$=\\left[100t+10t^2\\right]_0^5=500+250$.", "$=750$ m³."] },
  cs: "casio", ai: { p: "Tính $\\int_0^2(3x^2+1)dx$ và giải thích ý nghĩa nếu $3x^2+1$ là vận tốc.", l: "AI hay quên trừ $F(a)$, chỉ lấy $F(b)$." },
  bt: "Bài 4.7 – 4.13 SGK trang 20 (Tập 2)." },

13: { t: 3, yc: ["Tính diện tích hình phẳng và thể tích vật thể tròn xoay bằng tích phân.", "Vận dụng vào bài toán thực tiễn."],
  md: [
   { t: "Diện tích hình phẳng", y: ["Hình giới hạn bởi $y=f(x)$, trục hoành, $x=a$, $x=b$: $S=\\int_a^b|f(x)|dx$.", "Giữa hai đồ thị: $S=\\int_a^b|f(x)-g(x)|dx$, với $a$, $b$ là hoành độ giao điểm."],
     vd: { d: "Tính diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.", g: ["Giao điểm: $x^2=x \\Leftrightarrow x=0$ hoặc $x=1$.", "Trên $(0;1)$ thì $x>x^2$.", "$S=\\int_0^1(x-x^2)dx=\\dfrac12-\\dfrac13=\\dfrac16$."] } },
   { t: "Thể tích vật thể tròn xoay", y: ["Quay quanh $Ox$: $V=\\pi\\int_a^b f^2(x)dx$.", "Thể tích vật thể có thiết diện $S(x)$: $V=\\int_a^b S(x)dx$."] }],
  tt: { d: "Một bồn chứa được tạo thành khi quay quanh trục hoành hình phẳng giới hạn bởi $y=\\sqrt{x}$, $y=0$, $x=0$, $x=4$ (đơn vị mét). Tính thể tích bồn.",
      g: ["$V=\\pi\\int_0^4\\left(\\sqrt x\\right)^2dx=\\pi\\int_0^4 x\\,dx$.", "$=\\pi\\left[\\dfrac{x^2}{2}\\right]_0^4=8\\pi$.", "$\\approx25{,}1$ m³."] },
  cs: "geogebra", ai: { p: "Tính diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.", l: "AI hay quên lấy trị tuyệt đối hoặc đặt sai thứ tự hàm trừ, cho diện tích âm." },
  bt: "Bài 4.14 – 4.20 SGK trang 28 (Tập 2)." },

14: { t: 3, yc: ["Lập phương trình mặt phẳng khi biết điểm và vectơ pháp tuyến.", "Xét vị trí tương đối, tính khoảng cách từ điểm đến mặt phẳng."],
  md: [
   { t: "Phương trình tổng quát", y: ["Mặt phẳng qua $M_0(x_0;y_0;z_0)$ có vectơ pháp tuyến $\\vec n=(A;B;C)$: $A(x-x_0)+B(y-y_0)+C(z-z_0)=0$.", "Dạng tổng quát $Ax+By+Cz+D=0$.", "Cặp vectơ chỉ phương $\\vec a$, $\\vec b$ cho $\\vec n=\\left[\\vec a,\\vec b\\right]$ (tích có hướng)."],
     vd: { d: "Viết phương trình mặt phẳng qua $A(1;2;3)$ và vuông góc với $\\vec n=(2;-1;3)$.", g: ["$2(x-1)-1(y-2)+3(z-3)=0$.", "$2x-y+3z-9=0$."] } },
   { t: "Khoảng cách và vị trí tương đối", y: ["$d(M,(P))=\\dfrac{\\left|Ax_0+By_0+Cz_0+D\\right|}{\\sqrt{A^2+B^2+C^2}}$.", "Hai mặt phẳng song song khi hai vectơ pháp tuyến cùng phương và $D$ khác tỉ lệ."],
     vd: { d: "Tính khoảng cách từ $M(1;1;1)$ đến $(P): 2x-y+3z-9=0$.", g: ["$d=\\dfrac{|2-1+3-9|}{\\sqrt{4+1+9}}=\\dfrac{5}{\\sqrt{14}}$.", "$\\approx1{,}34$."] } }],
  tt: { d: "Mái nhà phẳng đi qua ba điểm $A(0;0;3)$, $B(4;0;3{,}8)$, $C(0;6;3{,}5)$ (đơn vị mét). Viết phương trình mặt phẳng mái và cho biết độ cao mái tại vị trí $(2;3)$ trên nền.",
      g: ["$\\overrightarrow{AB}=(4;0;0{,}8)$, $\\overrightarrow{AC}=(0;6;0{,}5)$, $\\vec n=\\left[\\overrightarrow{AB},\\overrightarrow{AC}\\right]=(-4{,}8;-2;24)$.", "Mặt phẳng: $-4{,}8x-2y+24(z-3)=0$ hay $z=3+0{,}2x+\\dfrac{1}{12}y$.", "Tại $(2;3)$: $z=3+0{,}4+0{,}25=3{,}65$ m."] },
  cs: "geogebra3d", ai: { p: "Viết phương trình mặt phẳng qua ba điểm $A(0;0;3)$, $B(4;0;3{,}8)$, $C(0;6;3{,}5)$.", l: "AI hay tính sai tích có hướng do nhầm thứ tự khai triển định thức." },
  bt: "Bài 5.1 – 5.8 SGK trang 40 (Tập 2)." },

15: { t: 3, yc: ["Lập phương trình tham số, chính tắc của đường thẳng trong không gian.", "Xét vị trí tương đối giữa hai đường thẳng, giữa đường thẳng và mặt phẳng."],
  md: [
   { t: "Phương trình đường thẳng", y: ["Tham số: $\\begin{cases}x=x_0+at\\\\ y=y_0+bt\\\\ z=z_0+ct\\end{cases}$ với $\\vec u=(a;b;c)$ là vectơ chỉ phương.", "Chính tắc: $\\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}=\\dfrac{z-z_0}{c}$ $(abc\\ne0)$."],
     vd: { d: "Viết phương trình tham số của đường thẳng qua $A(1;0;2)$ và $B(3;4;-1)$.", g: ["$\\vec u=\\overrightarrow{AB}=(2;4;-3)$.", "$\\begin{cases}x=1+2t\\\\ y=4t\\\\ z=2-3t\\end{cases}$"] } },
   { t: "Vị trí tương đối", y: ["Hai đường thẳng: song song, trùng, cắt nhau hoặc chéo nhau — xét qua $\\vec u_1$, $\\vec u_2$ và hệ phương trình.", "$d\\parallel(P) \\Leftrightarrow \\vec u\\cdot\\vec n=0$ và $M\\notin(P)$; $d\\subset(P)$ khi thêm $M\\in(P)$."] }],
  tt: { d: "Hai máy bay bay theo hai đường thẳng $d_1:\\begin{cases}x=t\\\\ y=2t\\\\ z=3\\end{cases}$ và $d_2:\\begin{cases}x=1+s\\\\ y=2\\\\ z=3\\end{cases}$ (km). Hai đường bay có cắt nhau không? Nếu có thì có nguy hiểm không?",
      g: ["Cho $t=1+s$, $2t=2$, $3=3$ suy ra $t=1$, $s=0$.", "Hệ có nghiệm nên hai đường bay cắt nhau tại $(1;2;3)$.", "Cùng độ cao $z=3$ nên nguy hiểm nếu hai máy bay tới điểm đó cùng thời điểm — cần tách mực bay."] },
  cs: "geogebra3d", ai: { p: "Xét vị trí tương đối của hai đường thẳng đã cho trong không gian.", l: "AI hay kết luận chéo nhau ngay khi thấy hai vectơ chỉ phương không cùng phương, mà không giải hệ." },
  bt: "Bài 5.9 – 5.16 SGK trang 50 (Tập 2)." },

16: { t: 2, yc: ["Tính góc giữa hai đường thẳng, giữa đường thẳng và mặt phẳng, giữa hai mặt phẳng bằng toạ độ."],
  md: [
   { t: "Các công thức tính góc", y: ["Hai đường thẳng: $\\cos\\varphi=\\dfrac{\\left|\\vec u_1\\cdot\\vec u_2\\right|}{|\\vec u_1||\\vec u_2|}$.", "Đường thẳng và mặt phẳng: $\\sin\\varphi=\\dfrac{\\left|\\vec u\\cdot\\vec n\\right|}{|\\vec u||\\vec n|}$.", "Hai mặt phẳng: $\\cos\\varphi=\\dfrac{\\left|\\vec n_1\\cdot\\vec n_2\\right|}{|\\vec n_1||\\vec n_2|}$."],
     vd: { d: "Tính góc giữa đường thẳng có $\\vec u=(1;1;0)$ và mặt phẳng có $\\vec n=(0;0;1)$.", g: ["$\\sin\\varphi=\\dfrac{|0|}{\\sqrt2\\cdot1}=0$.", "$\\varphi=0^\\circ$: đường thẳng song song hoặc nằm trong mặt phẳng."] } }],
  tt: { d: "Một tấm pin mặt trời đặt trên mái có vectơ pháp tuyến $\\vec n=(0;1;2)$. Tia nắng có vectơ chỉ phương $\\vec u=(0;0;-1)$. Tính góc giữa tia nắng và mặt phẳng tấm pin.",
      g: ["$\\sin\\varphi=\\dfrac{|0+0-2|}{1\\cdot\\sqrt5}=\\dfrac{2}{\\sqrt5}$.", "$\\varphi\\approx63^\\circ26'$.", "Góc tới càng gần $90^\\circ$ thì pin nhận năng lượng càng nhiều."] },
  cs: "geogebra3d", ai: { p: "Tính góc giữa đường thẳng và mặt phẳng khi biết vectơ chỉ phương và vectơ pháp tuyến.", l: "AI hay dùng công thức $\\cos$ thay cho $\\sin$ khi tính góc giữa đường thẳng và mặt phẳng." },
  bt: "Bài 5.17 – 5.21 SGK trang 56 (Tập 2)." },

17: { t: 2, yc: ["Lập phương trình mặt cầu.", "Xét vị trí tương đối giữa mặt cầu với điểm, đường thẳng, mặt phẳng."],
  md: [
   { t: "Phương trình mặt cầu", y: ["Tâm $I(a;b;c)$, bán kính $R$: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$.", "Dạng khai triển: $x^2+y^2+z^2-2ax-2by-2cz+d=0$ với $R=\\sqrt{a^2+b^2+c^2-d}>0$."],
     vd: { d: "Tìm tâm và bán kính của mặt cầu $x^2+y^2+z^2-2x+4y-6z+5=0$.", g: ["$a=1$, $b=-2$, $c=3$, $d=5$.", "$R=\\sqrt{1+4+9-5}=3$.", "Tâm $I(1;-2;3)$, bán kính $3$."] } },
   { t: "Vị trí tương đối với mặt phẳng", y: ["So sánh $d(I,(P))$ với $R$: lớn hơn thì không cắt, bằng thì tiếp xúc, nhỏ hơn thì cắt theo đường tròn.", "Bán kính đường tròn giao tuyến: $r=\\sqrt{R^2-d^2}$."] }],
  tt: { d: "Một trạm phát sóng đặt tại $I(1;-2;3)$ (km) phủ sóng bán kính $3$ km. Mặt đất là mặt phẳng $z=0$. Vùng phủ sóng trên mặt đất là hình gì, bán kính bao nhiêu?",
      g: ["$d(I,(Oxy))=|3|=3$ km.", "$d=R$ nên mặt cầu tiếp xúc mặt đất.", "Vùng phủ trên mặt đất chỉ là một điểm — cần hạ thấp trạm hoặc tăng công suất."] },
  cs: "geogebra3d", ai: { p: "Tìm tâm, bán kính mặt cầu $x^2+y^2+z^2-2x+4y-6z+5=0$.", l: "AI hay quên đổi dấu khi lấy tâm từ hệ số, cho $I(-1;2;-3)$." },
  bt: "Bài 5.22 – 5.26 SGK trang 62 (Tập 2)." },

18: { t: 3, yc: ["Nhận biết xác suất có điều kiện.", "Vận dụng công thức nhân xác suất và sơ đồ hình cây."],
  md: [
   { t: "Xác suất có điều kiện", y: ["$P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$ với $P(B)>0$.", "Công thức nhân: $P(A\\cap B)=P(B)\\cdot P(A\\mid B)$.", "$A$, $B$ độc lập $\\Leftrightarrow P(A\\mid B)=P(A)$."],
     vd: { d: "Hộp có $5$ bi đỏ, $3$ bi xanh. Lấy lần lượt $2$ bi không hoàn lại. Tính xác suất bi thứ hai đỏ biết bi thứ nhất đỏ.", g: ["Sau khi lấy bi đỏ thứ nhất, hộp còn $4$ đỏ và $3$ xanh.", "$P=\\dfrac{4}{7}$."] } },
   { t: "Sơ đồ hình cây", y: ["Mỗi nhánh ghi xác suất có điều kiện; xác suất một đường đi bằng tích các xác suất trên đường đó.", "Tổng xác suất các đường đi bằng $1$."] }],
  tt: { d: "Một xét nghiệm có độ nhạy $95\\%$ (người bệnh cho kết quả dương tính) và độ đặc hiệu $90\\%$. Tỉ lệ mắc bệnh trong cộng đồng là $1\\%$. Nếu một người có kết quả dương tính, xác suất người đó thực sự mắc bệnh là bao nhiêu?",
      g: ["$P(\\text{bệnh}\\cap+)=0{,}01\\cdot0{,}95=0{,}0095$.", "$P(\\text{không bệnh}\\cap+)=0{,}99\\cdot0{,}1=0{,}099$.", "$P(\\text{bệnh}\\mid+)=\\dfrac{0{,}0095}{0{,}1085}\\approx8{,}8\\%$ — thấp hơn nhiều so với cảm nhận thông thường."] },
  cs: "excel", ai: { p: "Xét nghiệm độ nhạy 95%, độ đặc hiệu 90%, tỉ lệ mắc 1%. Dương tính thì xác suất mắc bệnh là bao nhiêu?", l: "AI hay trả lời $95\\%$ vì nhầm $P(+\\mid\\text{bệnh})$ với $P(\\text{bệnh}\\mid+)$." },
  bt: "Bài 6.1 – 6.6 SGK trang 72 (Tập 2)." },

19: { t: 3, yc: ["Vận dụng công thức xác suất toàn phần và công thức Bayes.", "Giải quyết bài toán thực tiễn có nhiều giai đoạn."],
  md: [
   { t: "Công thức xác suất toàn phần", y: ["Nếu $B$, $\\overline{B}$ là hệ đầy đủ: $P(A)=P(B)P(A\\mid B)+P(\\overline{B})P(A\\mid\\overline{B})$.", "Mở rộng cho hệ $B_1,\\dots,B_n$ đầy đủ và xung khắc từng đôi."],
     vd: { d: "Nhà máy có hai dây chuyền: I sản xuất $60\\%$ với tỉ lệ lỗi $2\\%$; II sản xuất $40\\%$ với tỉ lệ lỗi $5\\%$. Lấy ngẫu nhiên một sản phẩm, tính xác suất gặp sản phẩm lỗi.", g: ["$P(L)=0{,}6\\cdot0{,}02+0{,}4\\cdot0{,}05$.", "$=0{,}012+0{,}02=0{,}032$.", "Vậy khoảng $3{,}2\\%$ sản phẩm bị lỗi."] } },
   { t: "Công thức Bayes", y: ["$P(B\\mid A)=\\dfrac{P(B)P(A\\mid B)}{P(A)}$.", "Dùng khi biết kết quả và cần truy ngược nguyên nhân."],
     vd: { d: "Biết sản phẩm lấy ra bị lỗi, tính xác suất nó do dây chuyền II sản xuất.", g: ["$P(II\\mid L)=\\dfrac{0{,}4\\cdot0{,}05}{0{,}032}$.", "$=\\dfrac{0{,}02}{0{,}032}=0{,}625$.", "Vậy $62{,}5\\%$ sản phẩm lỗi đến từ dây chuyền II."] } }],
  tt: { d: "Một trường có $55\\%$ học sinh nữ. Tỉ lệ đạt học sinh giỏi ở nữ là $30\\%$, ở nam là $20\\%$. Chọn ngẫu nhiên một học sinh giỏi, xác suất đó là học sinh nữ bằng bao nhiêu?",
      g: ["$P(G)=0{,}55\\cdot0{,}3+0{,}45\\cdot0{,}2=0{,}165+0{,}09=0{,}255$.", "$P(\\text{nữ}\\mid G)=\\dfrac{0{,}165}{0{,}255}$.", "$\\approx0{,}647$, tức khoảng $64{,}7\\%$."] },
  cs: "excel", ai: { p: "Nhà máy hai dây chuyền 60%/40%, lỗi 2%/5%. Sản phẩm lỗi thì xác suất do dây chuyền II là bao nhiêu?", l: "AI hay trả lời luôn $5\\%$ hoặc $40\\%$, không áp dụng công thức Bayes." },
  bt: "Bài 6.7 – 6.12 SGK trang 80 (Tập 2)." }
  };
})(window);
