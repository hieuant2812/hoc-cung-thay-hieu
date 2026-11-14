/* data/baihoc/t10.js — dữ liệu dạy học Toán 10 (Kết nối tri thức với cuộc sống) */
(function (G) {
  const B = G.BAIHOC = G.BAIHOC || {}; const T = B["Toán"] = B["Toán"] || {};
  T[10] = {
1: { t: 4, yc: ["Nhận biết mệnh đề, mệnh đề chứa biến, tính đúng sai của mệnh đề.", "Lập mệnh đề phủ định, mệnh đề kéo theo, mệnh đề đảo, mệnh đề tương đương.", "Sử dụng kí hiệu $\\forall$, $\\exists$ và lập mệnh đề phủ định của chúng."],
  md: [
   { t: "Mệnh đề, mệnh đề chứa biến", y: ["Mệnh đề là câu khẳng định hoặc đúng hoặc sai, không thể vừa đúng vừa sai.", "Câu cảm thán, câu hỏi, câu mệnh lệnh không phải mệnh đề.", "Mệnh đề chứa biến $P(n)$ chỉ xác định đúng sai khi cho biến một giá trị cụ thể."],
     vd: { d: "Trong các câu sau, câu nào là mệnh đề: a) “$7$ là số nguyên tố”; b) “Hôm nay trời đẹp quá!”; c) “$n$ chia hết cho $3$”.", g: ["a) Là mệnh đề đúng.", "b) Câu cảm thán, không phải mệnh đề.", "c) Mệnh đề chứa biến, đúng sai tuỳ theo $n$."] } },
   { t: "Phủ định, kéo theo, tương đương", y: ["Phủ định $\\overline{P}$ đúng khi $P$ sai và ngược lại.", "$P\\Rightarrow Q$ chỉ sai khi $P$ đúng và $Q$ sai; $P$ là điều kiện đủ, $Q$ là điều kiện cần.", "$P\\Leftrightarrow Q$ đúng khi $P$, $Q$ cùng đúng hoặc cùng sai."],
     vd: { d: "Phát biểu mệnh đề đảo của “Nếu tứ giác là hình vuông thì nó là hình thoi” và xét tính đúng sai.", g: ["Mệnh đề đảo: “Nếu tứ giác là hình thoi thì nó là hình vuông”.", "Mệnh đề thuận đúng, mệnh đề đảo sai (hình thoi chưa chắc có góc vuông)."] } },
   { t: "Kí hiệu $\\forall$, $\\exists$", y: ["$\\forall x\\in X, P(x)$ đúng khi $P(x)$ đúng với mọi $x$.", "$\\exists x\\in X, P(x)$ đúng khi có ít nhất một $x$ làm $P(x)$ đúng.", "Phủ định: $\\overline{\\forall x, P(x)}=\\exists x,\\overline{P(x)}$ và ngược lại."],
     vd: { d: "Lập mệnh đề phủ định của “$\\forall x\\in\\mathbb{R}, x^2+1>0$”.", g: ["Phủ định: “$\\exists x\\in\\mathbb{R}, x^2+1\\le0$”.", "Mệnh đề gốc đúng nên mệnh đề phủ định sai."] } }],
  tt: { d: "Điều lệ xét học bổng ghi: “Học sinh được xét học bổng nếu có điểm trung bình từ $8{,}0$ trở lên”. Một bạn có điểm $8{,}5$ nhưng không được xét vì vi phạm nội quy. Nhà trường có làm sai điều lệ không?",
      g: ["Điều lệ cho mệnh đề $P\\Rightarrow Q$ với $P$: “điểm từ $8{,}0$”, $Q$: “được xét”.", "Nếu hiểu đúng theo logic, $P$ đúng mà $Q$ sai thì mệnh đề sai, tức nhà trường làm trái điều lệ.", "Bài học: văn bản cần nêu rõ “điều kiện cần” hay “điều kiện đủ” để tránh hiểu sai."] },
  cs: "ai", ai: { p: "Lập mệnh đề phủ định của “$\\forall x\\in\\mathbb{R}, x^2+1>0$” và xét tính đúng sai.", l: "AI hay phủ định thành “$\\forall x, x^2+1\\le0$”, giữ nguyên lượng từ thay vì đổi $\\forall$ thành $\\exists$." },
  bt: "Bài 1.1 – 1.7 SGK trang 11." },

2: { t: 4, yc: ["Nhận biết tập hợp, tập con, hai tập hợp bằng nhau.", "Thực hiện phép hợp, giao, hiệu, phần bù; biểu diễn khoảng, đoạn, nửa khoảng.", "Vận dụng biểu đồ Ven giải bài toán thực tế."],
  md: [
   { t: "Tập hợp và tập con", y: ["Hai cách xác định tập hợp: liệt kê phần tử và nêu tính chất đặc trưng.", "$A\\subset B$ nếu mọi phần tử của $A$ đều thuộc $B$.", "$A=B \\Leftrightarrow A\\subset B$ và $B\\subset A$. Tập rỗng $\\varnothing$ là tập con của mọi tập hợp.", "Tập có $n$ phần tử thì có $2^n$ tập con."],
     vd: { d: "Viết tập $A=\\{x\\in\\mathbb{N}\\mid x^2-5x+6=0\\}$ bằng cách liệt kê và cho biết số tập con.", g: ["$x^2-5x+6=0 \\Leftrightarrow x=2$ hoặc $x=3$.", "$A=\\{2;3\\}$.", "Số tập con là $2^2=4$."] } },
   { t: "Các phép toán và khoảng, đoạn", y: ["$A\\cup B$, $A\\cap B$, $A\\setminus B$ và phần bù $C_EA=E\\setminus A$.", "Khoảng $(a;b)$, đoạn $[a;b]$, nửa khoảng $[a;b)$, $(-\\infty;b]$…", "Dùng trục số để tìm giao, hợp, hiệu của các khoảng."],
     vd: { d: "Cho $A=[-1;4)$, $B=(2;6]$. Tìm $A\\cap B$ và $A\\cup B$.", g: ["Biểu diễn hai tập lên trục số.", "$A\\cap B=(2;4)$.", "$A\\cup B=[-1;6]$."] } },
   { t: "Biểu đồ Ven và bài toán đếm", y: ["$|A\\cup B|=|A|+|B|-|A\\cap B|$.", "Với ba tập: $|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|B\\cap C|-|C\\cap A|+|A\\cap B\\cap C|$."],
     vd: { d: "Lớp có $40$ học sinh, $25$ em chơi bóng đá, $20$ em chơi cầu lông, $8$ em chơi cả hai. Hỏi bao nhiêu em không chơi môn nào?", g: ["Số em chơi ít nhất một môn: $25+20-8=37$.", "Số em không chơi môn nào: $40-37=3$."] } }],
  tt: { d: "Đoàn trường khảo sát $120$ học sinh về hai câu lạc bộ: $70$ em đăng kí CLB Tin học, $55$ em đăng kí CLB Tiếng Anh, $25$ em đăng kí cả hai. Ban tổ chức cần chuẩn bị bao nhiêu suất tài liệu nếu mỗi em đăng kí ít nhất một CLB nhận một suất?",
      g: ["Số em đăng kí ít nhất một CLB: $70+55-25=100$.", "Cần $100$ suất tài liệu.", "Còn $20$ em chưa đăng kí CLB nào để vận động thêm."] },
  cs: "ai", ai: { p: "Lớp 40 em, 25 chơi bóng đá, 20 chơi cầu lông, 8 chơi cả hai. Hỏi mấy em không chơi môn nào?", l: "AI hay cộng $25+20=45$ rồi kết luận số âm, vì quên trừ phần giao." },
  bt: "Bài 1.8 – 1.14 SGK trang 19." },

3: { t: 2, yc: ["Nhận biết bất phương trình bậc nhất hai ẩn và nghiệm của nó.", "Biểu diễn miền nghiệm trên mặt phẳng toạ độ."],
  md: [
   { t: "Bất phương trình bậc nhất hai ẩn", y: ["Dạng $ax+by\\le c$ (hoặc $<,\\ \\ge,\\ >$) với $a$, $b$ không đồng thời bằng $0$.", "Cặp $(x_0;y_0)$ là nghiệm nếu thay vào được bất đẳng thức đúng."],
     vd: { d: "Cặp $(2;1)$ có là nghiệm của $3x-2y\\le5$ không?", g: ["Thay vào: $3\\cdot2-2\\cdot1=4$.", "$4\\le5$ đúng, nên $(2;1)$ là nghiệm."] } },
   { t: "Miền nghiệm", y: ["Vẽ đường thẳng $ax+by=c$ chia mặt phẳng thành hai nửa.", "Lấy điểm thử (thường là $O(0;0)$ nếu đường thẳng không đi qua gốc) để chọn nửa mặt phẳng.", "Bất phương trình có dấu $\\le$, $\\ge$ thì lấy cả bờ; dấu $<$, $>$ thì bỏ bờ."],
     vd: { d: "Biểu diễn miền nghiệm của $2x+y\\le4$.", g: ["Vẽ đường $2x+y=4$ qua $(2;0)$ và $(0;4)$.", "Thay $O(0;0)$: $0\\le4$ đúng.", "Miền nghiệm là nửa mặt phẳng chứa $O$, kể cả bờ."] } }],
  tt: { d: "Một xưởng may dùng không quá $120$ m vải để may áo và quần: mỗi áo hết $2$ m, mỗi quần hết $3$ m. Gọi $x$, $y$ là số áo và quần. Hãy lập bất phương trình mô tả điều kiện về vải và nêu ý nghĩa miền nghiệm.",
      g: ["$2x+3y\\le120$ với $x\\ge0$, $y\\ge0$ nguyên.", "Miền nghiệm là phần tam giác giới hạn bởi ba đường trên.", "Mỗi điểm nguyên trong miền ứng với một phương án sản xuất khả thi."] },
  cs: "geogebra", ai: { p: "Biểu diễn miền nghiệm của $2x+y\\le4$ và giải thích cách chọn nửa mặt phẳng.", l: "AI hay chọn nhầm nửa mặt phẳng khi đường thẳng đi qua gốc toạ độ mà vẫn lấy $O$ làm điểm thử." },
  bt: "Bài 2.1 – 2.5 SGK trang 25." },

4: { t: 3, yc: ["Nhận biết hệ bất phương trình bậc nhất hai ẩn và miền nghiệm.", "Vận dụng vào bài toán tối ưu (quy hoạch tuyến tính) đơn giản."],
  md: [
   { t: "Hệ bất phương trình và miền nghiệm", y: ["Miền nghiệm của hệ là giao các miền nghiệm của từng bất phương trình.", "Miền nghiệm thường là một đa giác lồi (miền đa giác)."],
     vd: { d: "Xác định miền nghiệm của hệ $\\begin{cases}x\\ge0\\\\ y\\ge0\\\\ x+y\\le4\\end{cases}$", g: ["Hai bất phương trình đầu cho góc phần tư thứ nhất.", "Thêm $x+y\\le4$ cắt bởi đường qua $(4;0)$, $(0;4)$.", "Miền nghiệm là tam giác $O(0;0)$, $A(4;0)$, $B(0;4)$ kể cả biên."] } },
   { t: "Bài toán tối ưu", y: ["$F=ax+by$ đạt giá trị lớn nhất, nhỏ nhất tại một đỉnh của miền đa giác nghiệm.", "Quy trình: lập hệ ràng buộc → vẽ miền nghiệm → tính $F$ tại các đỉnh → so sánh."],
     vd: { d: "Tìm giá trị lớn nhất của $F=3x+2y$ trên miền nghiệm ở ví dụ trên.", g: ["Các đỉnh: $O(0;0)$, $A(4;0)$, $B(0;4)$.", "$F(O)=0$, $F(A)=12$, $F(B)=8$.", "$F_{\\max}=12$ tại $A(4;0)$."] } }],
  tt: { d: "Một hộ nông dân trồng ngô và đậu trên $8$ ha. Mỗi ha ngô cần $20$ công, lãi $40$ triệu; mỗi ha đậu cần $30$ công, lãi $50$ triệu. Hộ có tối đa $180$ công. Hỏi trồng bao nhiêu ha mỗi loại để lãi cao nhất?",
      g: ["Gọi $x$, $y$ là số ha ngô, đậu: $x+y\\le8$; $20x+30y\\le180$; $x,y\\ge0$.", "Các đỉnh miền nghiệm: $(0;0)$, $(8;0)$, $(6;2)$, $(0;6)$.", "$L=40x+50y$ đạt lớn nhất tại $(6;2)$: $L=340$ triệu đồng."] },
  cs: "geogebra", ai: { p: "Tìm giá trị lớn nhất của $F=40x+50y$ với ràng buộc $x+y\\le8$, $20x+30y\\le180$, $x,y\\ge0$.", l: "AI thỉnh thoảng chỉ xét các đỉnh trên trục toạ độ mà bỏ sót đỉnh giao của hai đường ràng buộc." },
  bt: "Bài 2.6 – 2.10 SGK trang 30." },

5: { t: 2, yc: ["Nhận biết giá trị lượng giác của góc từ $0^\\circ$ đến $180^\\circ$.", "Tính giá trị lượng giác của các góc đặc biệt và quan hệ giữa hai góc bù nhau."],
  md: [
   { t: "Giá trị lượng giác của một góc", y: ["Với $M$ trên nửa đường tròn đơn vị, góc $\\widehat{xOM}=\\alpha$: $\\sin\\alpha=y_M$, $\\cos\\alpha=x_M$.", "$\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$, $\\cot\\alpha=\\dfrac{\\cos\\alpha}{\\sin\\alpha}$.", "Với $0^\\circ\\le\\alpha\\le180^\\circ$: $\\sin\\alpha\\ge0$; $\\cos\\alpha>0$ khi $\\alpha<90^\\circ$ và $\\cos\\alpha<0$ khi $\\alpha>90^\\circ$."],
     vd: { d: "Tính $\\sin120^\\circ$, $\\cos135^\\circ$.", g: ["$\\sin120^\\circ=\\sin(180^\\circ-60^\\circ)=\\sin60^\\circ=\\dfrac{\\sqrt3}{2}$.", "$\\cos135^\\circ=-\\cos45^\\circ=-\\dfrac{\\sqrt2}{2}$."] } },
   { t: "Hai góc bù nhau", y: ["$\\sin(180^\\circ-\\alpha)=\\sin\\alpha$; $\\cos(180^\\circ-\\alpha)=-\\cos\\alpha$.", "$\\tan(180^\\circ-\\alpha)=-\\tan\\alpha$ $(\\alpha\\ne90^\\circ)$.", "$\\sin^2\\alpha+\\cos^2\\alpha=1$."],
     vd: { d: "Cho $\\cos\\alpha=-\\dfrac35$ với $90^\\circ<\\alpha<180^\\circ$. Tính $\\sin\\alpha$.", g: ["$\\sin^2\\alpha=1-\\dfrac9{25}=\\dfrac{16}{25}$.", "Vì $90^\\circ<\\alpha<180^\\circ$ nên $\\sin\\alpha>0$.", "$\\sin\\alpha=\\dfrac45$."] } }],
  tt: { d: "Một con dốc nghiêng $150^\\circ$ so với hướng đông (đo ngược chiều kim đồng hồ). Hãy xác định dấu của $\\cos$ và $\\sin$ của góc đó và cho biết hướng dịch chuyển theo trục Ox, Oy.",
      g: ["$\\cos150^\\circ=-\\dfrac{\\sqrt3}{2}<0$: dịch chuyển về phía tây (ngược chiều dương Ox).", "$\\sin150^\\circ=\\dfrac12>0$: đi lên phía bắc.", "Vậy hướng di chuyển là tây – bắc."] },
  cs: "geogebra", ai: { p: "Cho $\\cos\\alpha=-3/5$ với $90^\\circ<\\alpha<180^\\circ$, tính $\\sin\\alpha$ và $\\tan\\alpha$.", l: "AI hay cho ra cả hai dấu $\\pm$ mà không loại nghiệm theo điều kiện của góc." },
  bt: "Bài 3.1 – 3.5 SGK trang 37." },

6: { t: 3, yc: ["Vận dụng định lí côsin, định lí sin.", "Tính diện tích tam giác, giải tam giác và vận dụng vào đo đạc thực tế."],
  md: [
   { t: "Định lí côsin và định lí sin", y: ["$a^2=b^2+c^2-2bc\\cos A$ và $\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}$.", "$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R$."],
     vd: { d: "Cho tam giác $ABC$ có $b=8$, $c=5$, $\\widehat{A}=60^\\circ$. Tính $a$.", g: ["$a^2=8^2+5^2-2\\cdot8\\cdot5\\cos60^\\circ$.", "$=64+25-40=49$.", "$a=7$."] } },
   { t: "Diện tích tam giác", y: ["$S=\\dfrac12ab\\sin C=\\dfrac{abc}{4R}=pr=\\sqrt{p(p-a)(p-b)(p-c)}$ (Heron).", "$p=\\dfrac{a+b+c}{2}$ là nửa chu vi."],
     vd: { d: "Tính diện tích tam giác có ba cạnh $a=7$, $b=8$, $c=5$.", g: ["$p=\\dfrac{7+8+5}{2}=10$.", "$S=\\sqrt{10\\cdot3\\cdot2\\cdot5}=\\sqrt{300}=10\\sqrt3$."] } }],
  tt: { d: "Để đo khoảng cách từ bờ đến một cù lao giữa sông, người ta chọn hai điểm $A$, $B$ trên bờ cách nhau $120$ m, đo được $\\widehat{BAC}=65^\\circ$, $\\widehat{ABC}=48^\\circ$ (với $C$ là điểm trên cù lao). Tính khoảng cách $AC$.",
      g: ["$\\widehat{ACB}=180^\\circ-65^\\circ-48^\\circ=67^\\circ$.", "Theo định lí sin: $\\dfrac{AC}{\\sin\\widehat{ABC}}=\\dfrac{AB}{\\sin\\widehat{ACB}}$.", "$AC=\\dfrac{120\\sin48^\\circ}{\\sin67^\\circ}\\approx96{,}9$ m."] },
  cs: "casio", ai: { p: "Đo khoảng cách qua sông bằng định lí sin với $AB=120$ m, hai góc $65^\\circ$ và $48^\\circ$.", l: "AI hay áp định lí côsin cho dữ kiện góc – góc – cạnh, dẫn tới thiếu dữ kiện và kết quả sai." },
  bt: "Bài 3.6 – 3.12 SGK trang 44." },

7: { t: 2, yc: ["Nhận biết vectơ, giá, độ dài, hai vectơ cùng phương, cùng hướng, bằng nhau.", "Nhận biết vectơ–không."],
  md: [
   { t: "Khái niệm vectơ", y: ["Vectơ là đoạn thẳng có hướng, kí hiệu $\\overrightarrow{AB}$ với $A$ là điểm đầu, $B$ là điểm cuối.", "Giá của vectơ là đường thẳng chứa vectơ đó.", "Độ dài $\\left|\\overrightarrow{AB}\\right|=AB$."],
     vd: { d: "Cho hình bình hành $ABCD$. Chỉ ra các vectơ bằng $\\overrightarrow{AB}$.", g: ["$\\overrightarrow{AB}$ và $\\overrightarrow{DC}$ cùng hướng và cùng độ dài.", "Vậy $\\overrightarrow{AB}=\\overrightarrow{DC}$."] } },
   { t: "Cùng phương, cùng hướng, bằng nhau", y: ["Hai vectơ cùng phương nếu giá của chúng song song hoặc trùng nhau.", "Hai vectơ bằng nhau nếu cùng hướng và cùng độ dài.", "$\\vec0$ có độ dài $0$, cùng phương và cùng hướng với mọi vectơ."] }],
  tt: { d: "Một chiếc thuyền đi từ bến $A$ sang bến $B$ rồi quay lại $A$. Hãy so sánh $\\overrightarrow{AB}$ và $\\overrightarrow{BA}$ về phương, hướng, độ dài và nêu ý nghĩa thực tế.",
      g: ["Hai vectơ cùng phương, ngược hướng, cùng độ dài.", "$\\overrightarrow{AB}=-\\overrightarrow{BA}$.", "Quãng đường đi được gấp đôi $AB$ nhưng độ dời tổng cộng bằng $\\vec0$."] },
  cs: "geogebra", ai: { p: "Trong hình bình hành $ABCD$, các vectơ nào bằng $\\overrightarrow{AB}$? Giải thích.", l: "AI hay kể cả $\\overrightarrow{CD}$ vì chỉ xét độ dài mà quên điều kiện cùng hướng." },
  bt: "Bài 4.1 – 4.5 SGK trang 50." },

8: { t: 2, yc: ["Thực hiện phép cộng, trừ vectơ; vận dụng quy tắc ba điểm, hình bình hành, quy tắc hiệu.", "Vận dụng vào bài toán tổng hợp lực."],
  md: [
   { t: "Tổng và hiệu hai vectơ", y: ["Quy tắc ba điểm: $\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$.", "Quy tắc hình bình hành: $\\overrightarrow{AB}+\\overrightarrow{AD}=\\overrightarrow{AC}$ với $ABCD$ là hình bình hành.", "Quy tắc hiệu: $\\overrightarrow{MB}-\\overrightarrow{MA}=\\overrightarrow{AB}$."],
     vd: { d: "Rút gọn $\\overrightarrow{AB}+\\overrightarrow{BC}+\\overrightarrow{CD}$.", g: ["$\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$.", "$\\overrightarrow{AC}+\\overrightarrow{CD}=\\overrightarrow{AD}$."] } },
   { t: "Tính chất và độ dài vectơ tổng", y: ["$\\vec a+\\vec b=\\vec b+\\vec a$; $(\\vec a+\\vec b)+\\vec c=\\vec a+(\\vec b+\\vec c)$.", "$\\left|\\vec a+\\vec b\\right|\\le|\\vec a|+|\\vec b|$, dấu bằng khi hai vectơ cùng hướng.", "Với $\\vec a\\perp\\vec b$: $\\left|\\vec a+\\vec b\\right|=\\sqrt{|\\vec a|^2+|\\vec b|^2}$."] }],
  tt: { d: "Hai người kéo một vật bằng hai sợi dây hợp với nhau góc $90^\\circ$, lực kéo lần lượt $60$ N và $80$ N. Tính độ lớn hợp lực.",
      g: ["Hợp lực $\\vec F=\\vec F_1+\\vec F_2$ với $\\vec F_1\\perp\\vec F_2$.", "$|\\vec F|=\\sqrt{60^2+80^2}=\\sqrt{10000}$.", "$|\\vec F|=100$ N."] },
  cs: "geogebra", ai: { p: "Hai lực $60$ N và $80$ N vuông góc nhau, tính hợp lực.", l: "AI đôi khi cộng thẳng $60+80=140$ N, bỏ qua việc lực là đại lượng vectơ." },
  bt: "Bài 4.6 – 4.11 SGK trang 54." },

9: { t: 2, yc: ["Thực hiện phép nhân vectơ với một số.", "Vận dụng điều kiện cùng phương, tính chất trung điểm, trọng tâm; phân tích vectơ."],
  md: [
   { t: "Tích của vectơ với một số", y: ["$k\\vec a$ cùng hướng với $\\vec a$ nếu $k>0$, ngược hướng nếu $k<0$, độ dài $|k||\\vec a|$.", "$\\vec a$, $\\vec b$ ($\\vec b \\ne \\vec 0$) cùng phương $\\Leftrightarrow$ tồn tại $k$ sao cho $\\vec a=k\\vec b$.", "Trung điểm $I$ của $AB$: $\\overrightarrow{IA}+\\overrightarrow{IB}=\\vec0$ và $\\overrightarrow{MA}+\\overrightarrow{MB}=2\\overrightarrow{MI}$.", "Trọng tâm $G$: $\\overrightarrow{GA}+\\overrightarrow{GB}+\\overrightarrow{GC}=\\vec0$ và $\\overrightarrow{MA}+\\overrightarrow{MB}+\\overrightarrow{MC}=3\\overrightarrow{MG}$."],
     vd: { d: "Cho tam giác $ABC$ có trọng tâm $G$, $M$ là điểm bất kì. Chứng minh $\\overrightarrow{MA}+\\overrightarrow{MB}+\\overrightarrow{MC}=3\\overrightarrow{MG}$.", g: ["$\\overrightarrow{MA}=\\overrightarrow{MG}+\\overrightarrow{GA}$, tương tự với $B$, $C$.", "Cộng ba đẳng thức: tổng $=3\\overrightarrow{MG}+(\\overrightarrow{GA}+\\overrightarrow{GB}+\\overrightarrow{GC})$.", "Vì $G$ là trọng tâm nên tổng trong ngoặc bằng $\\vec0$."] } },
   { t: "Phân tích vectơ", y: ["Cho $\\vec a$, $\\vec b$ không cùng phương, mọi vectơ $\\vec x$ đều viết được duy nhất $\\vec x=m\\vec a+n\\vec b$.", "Dùng để chứng minh ba điểm thẳng hàng: $\\overrightarrow{AB}=k\\overrightarrow{AC}$."] }],
  tt: { d: "Ba lực cùng tác dụng vào một vật tại trọng tâm $G$ của tam giác $ABC$ theo ba hướng $\\overrightarrow{GA}$, $\\overrightarrow{GB}$, $\\overrightarrow{GC}$ với độ lớn tỉ lệ các đoạn đó. Vật có chuyển động không?",
      g: ["Hợp lực tỉ lệ với $\\overrightarrow{GA}+\\overrightarrow{GB}+\\overrightarrow{GC}$.", "Theo tính chất trọng tâm, tổng này bằng $\\vec0$.", "Hợp lực bằng $\\vec0$ nên vật đứng yên (cân bằng)."] },
  cs: "geogebra", ai: { p: "Chứng minh $\\overrightarrow{MA}+\\overrightarrow{MB}+\\overrightarrow{MC}=3\\overrightarrow{MG}$ với $G$ là trọng tâm tam giác $ABC$.", l: "AI hay dùng toạ độ cụ thể rồi coi là chứng minh tổng quát." },
  bt: "Bài 4.12 – 4.17 SGK trang 58." },

10: { t: 3, yc: ["Xác định toạ độ vectơ, toạ độ điểm.", "Thực hiện các phép toán vectơ theo toạ độ; tính độ dài, trung điểm, trọng tâm."],
  md: [
   { t: "Toạ độ vectơ và điểm", y: ["$\\vec u=(x;y) \\Leftrightarrow \\vec u=x\\vec i+y\\vec j$.", "$\\overrightarrow{AB}=(x_B-x_A;\\ y_B-y_A)$.", "$\\left|\\overrightarrow{AB}\\right|=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$."],
     vd: { d: "Cho $A(1;2)$, $B(4;6)$. Tính $\\overrightarrow{AB}$ và $AB$.", g: ["$\\overrightarrow{AB}=(3;4)$.", "$AB=\\sqrt{3^2+4^2}=5$."] } },
   { t: "Phép toán theo toạ độ", y: ["$\\vec u\\pm\\vec v=(x_1\\pm x_2;\\ y_1\\pm y_2)$; $k\\vec u=(kx;ky)$.", "Trung điểm $I$ của $AB$: $\\left(\\dfrac{x_A+x_B}{2};\\dfrac{y_A+y_B}{2}\\right)$.", "Trọng tâm $G$: $\\left(\\dfrac{x_A+x_B+x_C}{3};\\dfrac{y_A+y_B+y_C}{3}\\right)$.", "Cùng phương: $x_1y_2-x_2y_1=0$."],
     vd: { d: "Cho $A(1;1)$, $B(5;3)$, $C(3;7)$. Tìm trọng tâm $G$ của tam giác $ABC$.", g: ["$x_G=\\dfrac{1+5+3}{3}=3$.", "$y_G=\\dfrac{1+3+7}{3}=\\dfrac{11}{3}$.", "$G\\left(3;\\dfrac{11}{3}\\right)$."] } }],
  tt: { d: "Một flycam bay từ điểm $A(0;0)$ đến $B(300;400)$ rồi đến $C(700;100)$ (đơn vị mét). Tính tổng quãng đường bay và khoảng cách từ điểm cuối về điểm xuất phát.",
      g: ["$AB=\\sqrt{300^2+400^2}=500$ m; $BC=\\sqrt{400^2+300^2}=500$ m.", "Tổng quãng đường $=1000$ m.", "$AC=\\sqrt{700^2+100^2}\\approx707{,}1$ m — ngắn hơn nhiều so với đường bay."] },
  cs: "geogebra", ai: { p: "Cho $A(1;1)$, $B(5;3)$, $C(3;7)$, tìm trọng tâm và chu vi tam giác $ABC$.", l: "AI hay nhầm công thức trọng tâm với trung điểm khi chỉ chia cho $2$." },
  bt: "Bài 4.18 – 4.23 SGK trang 65." },

11: { t: 3, yc: ["Nhận biết tích vô hướng của hai vectơ và tính chất.", "Tính tích vô hướng theo toạ độ; tính góc, chứng minh vuông góc; tính công của lực."],
  md: [
   { t: "Định nghĩa và tính chất", y: ["$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos(\\vec a,\\vec b)$.", "$\\vec a\\perp\\vec b \\Leftrightarrow \\vec a\\cdot\\vec b=0$.", "$\\vec a^2=|\\vec a|^2$; tích vô hướng có tính giao hoán và phân phối."],
     vd: { d: "Cho $|\\vec a|=3$, $|\\vec b|=4$, góc giữa chúng $60^\\circ$. Tính $\\vec a\\cdot\\vec b$.", g: ["$\\vec a\\cdot\\vec b=3\\cdot4\\cdot\\cos60^\\circ$.", "$=12\\cdot\\dfrac12=6$."] } },
   { t: "Biểu thức toạ độ", y: ["$\\vec a\\cdot\\vec b=x_1x_2+y_1y_2$.", "$\\cos(\\vec a,\\vec b)=\\dfrac{x_1x_2+y_1y_2}{\\sqrt{x_1^2+y_1^2}\\sqrt{x_2^2+y_2^2}}$.", "$\\vec a\\perp\\vec b \\Leftrightarrow x_1x_2+y_1y_2=0$."],
     vd: { d: "Cho $\\vec a=(2;-1)$, $\\vec b=(1;2)$. Chứng minh $\\vec a\\perp\\vec b$.", g: ["$\\vec a\\cdot\\vec b=2\\cdot1+(-1)\\cdot2=0$.", "Vậy hai vectơ vuông góc."] } }],
  tt: { d: "Một người kéo vali bằng lực $F=50$ N, tay kéo hợp với phương ngang góc $30^\\circ$, đi được quãng đường $40$ m. Tính công của lực kéo.",
      g: ["$A=\\vec F\\cdot\\vec d=|\\vec F||\\vec d|\\cos\\alpha$.", "$A=50\\cdot40\\cdot\\cos30^\\circ=2000\\cdot\\dfrac{\\sqrt3}{2}$.", "$A=1000\\sqrt3\\approx1732$ J."] },
  cs: "casio", ai: { p: "Tính công của lực $50$ N kéo nghiêng $30^\\circ$ trên quãng đường $40$ m.", l: "AI hay bỏ qua $\\cos30^\\circ$ và trả lời $2000$ J." },
  bt: "Bài 4.24 – 4.29 SGK trang 71." },

12: { t: 2, yc: ["Hiểu khái niệm số gần đúng, sai số tuyệt đối, sai số tương đối.", "Quy tròn số và xác định số chữ số chắc."],
  md: [
   { t: "Số gần đúng và sai số", y: ["Sai số tuyệt đối: $\\Delta_a=|a-\\overline{a}|\\le d$ (độ chính xác).", "Sai số tương đối: $\\delta_a=\\dfrac{\\Delta_a}{|\\overline a|}$, thường viết dưới dạng phần trăm.", "Sai số tương đối càng nhỏ thì phép đo càng chính xác."],
     vd: { d: "Đo chiều dài bàn được $\\overline{a}=120$ cm với độ chính xác $d=0{,}5$ cm. Tính sai số tương đối tối đa.", g: ["$\\delta_a\\le\\dfrac{0{,}5}{120}\\approx0{,}0042$.", "Tức khoảng $0{,}42\\%$."] } },
   { t: "Quy tròn số", y: ["Quy tắc: chữ số bỏ đi đầu tiên $\\ge5$ thì tăng chữ số giữ lại thêm $1$.", "Khi biết độ chính xác $d$, quy tròn đến hàng cao hơn hàng của chữ số đầu tiên khác $0$ của $d$."],
     vd: { d: "Quy tròn $\\overline{a}=2{,}4653$ với độ chính xác $d=0{,}01$.", g: ["$d=0{,}01$ nên quy tròn đến hàng phần mười.", "Kết quả: $2{,}5$."] } }],
  tt: { d: "Hai cửa hàng báo cân nặng một bao gạo: cửa hàng A ghi $50\\pm0{,}5$ kg, cửa hàng B ghi $25\\pm0{,}3$ kg. Phép cân nào chính xác hơn?",
      g: ["$\\delta_A\\le\\dfrac{0{,}5}{50}=1\\%$.", "$\\delta_B\\le\\dfrac{0{,}3}{25}=1{,}2\\%$.", "Sai số tương đối của A nhỏ hơn nên phép cân của A chính xác hơn, dù sai số tuyệt đối lớn hơn."] },
  cs: "casio", ai: { p: "So sánh độ chính xác của phép đo $50\\pm0{,}5$ kg và $25\\pm0{,}3$ kg.", l: "AI hay so sánh sai số tuyệt đối rồi kết luận ngược." },
  bt: "Bài 5.1 – 5.5 SGK trang 80." },

13: { t: 2, yc: ["Tính số trung bình, trung vị, tứ phân vị, mốt của mẫu số liệu không ghép nhóm.", "Giải thích ý nghĩa và chọn số đặc trưng phù hợp."],
  md: [
   { t: "Số trung bình và mốt", y: ["$\\bar{x}=\\dfrac{x_1+x_2+\\dots+x_n}{n}$.", "Mốt là giá trị xuất hiện nhiều nhất; một mẫu có thể có nhiều mốt.", "Số trung bình bị ảnh hưởng mạnh bởi giá trị bất thường."],
     vd: { d: "Tính số trung bình của mẫu: $5;7;7;8;9;10$.", g: ["Tổng $=46$, cỡ mẫu $n=6$.", "$\\bar{x}=\\dfrac{46}{6}\\approx7{,}67$. Mốt là $7$."] } },
   { t: "Trung vị và tứ phân vị", y: ["Sắp xếp số liệu tăng dần; trung vị là số ở giữa (hoặc trung bình hai số giữa).", "$Q_1$ là trung vị nửa dưới, $Q_3$ là trung vị nửa trên, $Q_2=M_e$.", "Trung vị ổn định hơn trước giá trị bất thường."],
     vd: { d: "Tìm trung vị và tứ phân vị của mẫu: $4;6;7;9;10;12;15$.", g: ["$n=7$, trung vị là số thứ tư: $M_e=9$.", "Nửa dưới $4;6;7$ nên $Q_1=6$; nửa trên $10;12;15$ nên $Q_3=12$."] } }],
  tt: { d: "Lương tháng (triệu đồng) của $7$ nhân viên một cửa hàng: $7;7{,}5;8;8;8{,}5;9;60$. Khi tuyển dụng nên công bố mức lương nào để trung thực với ứng viên?",
      g: ["$\\bar{x}=\\dfrac{108}{7}\\approx15{,}4$ triệu — bị kéo lên bởi mức $60$ của chủ cửa hàng.", "$M_e=8$ triệu, phản ánh đúng mức lương thường gặp.", "Nên công bố trung vị $8$ triệu kèm khoảng lương để minh bạch."] },
  cs: "excel", ai: { p: "Mẫu lương $7;7{,}5;8;8;8{,}5;9;60$ — nên dùng trung bình hay trung vị để mô tả? Vì sao?", l: "AI hay mặc định chọn số trung bình mà không nhận ra giá trị bất thường $60$." },
  bt: "Bài 5.6 – 5.10 SGK trang 86." },

14: { t: 3, yc: ["Tính khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn.", "Phát hiện giá trị bất thường; so sánh độ phân tán của hai mẫu."],
  md: [
   { t: "Khoảng biến thiên và khoảng tứ phân vị", y: ["$R=x_{\\max}-x_{\\min}$.", "$\\Delta_Q=Q_3-Q_1$, ít chịu ảnh hưởng của giá trị bất thường.", "Giá trị $x$ là bất thường nếu $x<Q_1-1{,}5\\Delta_Q$ hoặc $x>Q_3+1{,}5\\Delta_Q$."],
     vd: { d: "Mẫu $4;6;7;9;10;12;40$ có $Q_1=6$, $Q_3=12$. Xác định giá trị bất thường.", g: ["$\\Delta_Q=12-6=6$; $1{,}5\\Delta_Q=9$.", "Ngưỡng trên: $12+9=21$.", "$40>21$ nên $40$ là giá trị bất thường."] } },
   { t: "Phương sai và độ lệch chuẩn", y: ["$s^2=\\dfrac{1}{n}\\sum(x_i-\\bar{x})^2$; $s=\\sqrt{s^2}$.", "Độ lệch chuẩn cùng đơn vị với số liệu, dùng để so sánh độ ổn định.", "Hai mẫu cùng trung bình, mẫu nào có $s$ nhỏ hơn thì ổn định hơn."],
     vd: { d: "Tính phương sai của mẫu $2;4;4;6$.", g: ["$\\bar{x}=4$.", "$s^2=\\dfrac{(2-4)^2+0+0+(6-4)^2}{4}=\\dfrac{8}{4}=2$.", "$s=\\sqrt2\\approx1{,}41$."] } }],
  tt: { d: "Hai vận động viên bắn súng cùng có điểm trung bình $9{,}0$. Xạ thủ A có $s=0{,}3$; xạ thủ B có $s=1{,}2$. Nên chọn ai vào đội tuyển thi đấu đồng đội? Vì sao?",
      g: ["Hai người có thành tích trung bình như nhau.", "Độ lệch chuẩn của A nhỏ hơn nhiều nên A bắn ổn định hơn.", "Thi đồng đội cần ổn định, nên chọn A."] },
  cs: "excel", ai: { p: "Tính phương sai, độ lệch chuẩn của mẫu $2;4;4;6$ và giải thích ý nghĩa.", l: "AI hay dùng công thức chia cho $n-1$ (phương sai mẫu hiệu chỉnh) khác với SGK lớp 10 chia cho $n$." },
  bt: "Bài 5.11 – 5.16 SGK trang 92." },

15: { t: 2, yc: ["Nhận biết hàm số, tập xác định, đồ thị.", "Nhận biết tính đồng biến, nghịch biến."],
  md: [
   { t: "Hàm số và tập xác định", y: ["Quy tắc cho mỗi $x\\in D$ đúng một giá trị $y$ gọi là hàm số.", "Tập xác định là tập các $x$ làm biểu thức có nghĩa: mẫu khác $0$, biểu thức dưới căn bậc hai không âm."],
     vd: { d: "Tìm tập xác định của $y=\\dfrac{\\sqrt{x+2}}{x-1}$.", g: ["Điều kiện: $x+2\\ge0$ và $x-1\\ne0$.", "$x\\ge-2$ và $x\\ne1$.", "$D=[-2;+\\infty)\\setminus\\{1\\}$."] } },
   { t: "Đồng biến, nghịch biến", y: ["$f$ đồng biến trên $K$ nếu $x_1<x_2 \\Rightarrow f(x_1)<f(x_2)$.", "$f$ nghịch biến nếu $x_1<x_2 \\Rightarrow f(x_1)>f(x_2)$.", "Đồ thị hàm đồng biến đi lên, nghịch biến đi xuống theo chiều tăng của $x$."] }],
  tt: { d: "Cước taxi: $12\\,000$ đồng cho km đầu, $11\\,000$ đồng mỗi km tiếp theo. Viết hàm số tiền cước theo số km $x\\ge1$ và tính tiền cho quãng đường $12$ km.",
      g: ["$T(x)=12\\,000+11\\,000(x-1)=11\\,000x+1\\,000$ (đồng).", "$T(12)=11\\,000\\cdot12+1\\,000=133\\,000$ đồng.", "Hàm đồng biến: đi càng xa trả càng nhiều."] },
  cs: "geogebra", ai: { p: "Tìm tập xác định của $y=\\dfrac{\\sqrt{x+2}}{x-1}$.", l: "AI hay quên loại $x=1$ hoặc viết tập xác định là $[-2;+\\infty)$." },
  bt: "Bài 6.1 – 6.6 SGK trang 11 (Tập 2)." },

16: { t: 3, yc: ["Nhận biết hàm số bậc hai, lập bảng biến thiên và vẽ parabol.", "Vận dụng vào bài toán thực tiễn liên quan đến giá trị lớn nhất, nhỏ nhất."],
  md: [
   { t: "Đồ thị và bảng biến thiên", y: ["$y=ax^2+bx+c$ $(a\\ne0)$ có đỉnh $I\\left(-\\dfrac{b}{2a};-\\dfrac{\\Delta}{4a}\\right)$, trục đối xứng $x=-\\dfrac{b}{2a}$.", "$a>0$: bề lõm hướng lên, hàm nghịch biến rồi đồng biến, có giá trị nhỏ nhất tại đỉnh.", "$a<0$: bề lõm hướng xuống, có giá trị lớn nhất tại đỉnh."],
     vd: { d: "Lập bảng biến thiên và tìm giá trị nhỏ nhất của $y=x^2-4x+5$.", g: ["$a=1>0$; đỉnh $x_I=\\dfrac{4}{2}=2$, $y_I=1$.", "Hàm nghịch biến trên $(-\\infty;2)$, đồng biến trên $(2;+\\infty)$.", "$y_{\\min}=1$ tại $x=2$."] } }],
  tt: { d: "Một quả bóng được đá lên có độ cao $h(t)=-4{,}9t^2+19{,}6t+1$ (m). Tính độ cao lớn nhất và thời điểm đạt độ cao đó.",
      g: ["$a=-4{,}9<0$ nên hàm đạt giá trị lớn nhất tại đỉnh.", "$t=-\\dfrac{19{,}6}{2\\cdot(-4{,}9)}=2$ giây.", "$h(2)=-4{,}9\\cdot4+39{,}2+1=20{,}6$ m."] },
  cs: "geogebra", ai: { p: "Tìm độ cao lớn nhất của $h(t)=-4{,}9t^2+19{,}6t+1$ và thời điểm đạt được.", l: "AI hay quên dấu trừ trong công thức đỉnh $-\\dfrac{b}{2a}$, cho $t=-2$ giây vô lí." },
  bt: "Bài 6.7 – 6.12 SGK trang 15 (Tập 2)." },

17: { t: 3, yc: ["Nhận biết tam thức bậc hai và định lí về dấu.", "Giải bất phương trình bậc hai một ẩn và vận dụng thực tiễn."],
  md: [
   { t: "Định lí về dấu của tam thức bậc hai", y: ["$f(x)=ax^2+bx+c$ $(a\\ne0)$, $\\Delta=b^2-4ac$.", "$\\Delta<0$: $f(x)$ cùng dấu với $a$ với mọi $x$.", "$\\Delta=0$: $f(x)$ cùng dấu với $a$ với mọi $x\\ne-\\dfrac{b}{2a}$.", "$\\Delta>0$: “trong trái, ngoài cùng” so với dấu của $a$."],
     vd: { d: "Xét dấu $f(x)=x^2-5x+6$.", g: ["$\\Delta=1>0$, hai nghiệm $x_1=2$, $x_2=3$; $a=1>0$.", "$f(x)<0$ khi $x\\in(2;3)$.", "$f(x)>0$ khi $x\\in(-\\infty;2)\\cup(3;+\\infty)$."] } },
   { t: "Bất phương trình bậc hai", y: ["Đưa về dạng $f(x)>0$ (hoặc $<,\\ \\ge,\\ \\le$) rồi xét dấu tam thức.", "Đọc tập nghiệm theo bảng xét dấu, chú ý dấu bằng ở hai nghiệm."],
     vd: { d: "Giải bất phương trình $-x^2+4x-3\\ge0$.", g: ["Nghiệm của $-x^2+4x-3=0$ là $x=1$, $x=3$; $a=-1<0$.", "$f(x)\\ge0$ trong khoảng hai nghiệm.", "$S=[1;3]$."] } }],
  tt: { d: "Một công ty có lợi nhuận $L(x)=-2x^2+120x-1000$ (triệu đồng) khi sản xuất $x$ sản phẩm. Hỏi sản xuất bao nhiêu sản phẩm thì công ty không bị lỗ?",
      g: ["Không lỗ khi $L(x)\\ge0 \\Leftrightarrow -2x^2+120x-1000\\ge0$.", "$\\Leftrightarrow x^2-60x+500\\le0$, hai nghiệm $x=10$ và $x=50$.", "$10\\le x\\le50$: sản xuất từ $10$ đến $50$ sản phẩm."] },
  cs: "geogebra", ai: { p: "Xét dấu $f(x)=-x^2+4x-3$ và giải $f(x)\\ge0$.", l: "AI hay quên $a<0$ nên áp sai quy tắc “trong trái ngoài cùng”, cho tập nghiệm ngược lại." },
  bt: "Bài 6.13 – 6.18 SGK trang 19 (Tập 2)." },

18: { t: 2, yc: ["Giải phương trình chứa căn dạng $\\sqrt{f(x)}=\\sqrt{g(x)}$ và $\\sqrt{f(x)}=g(x)$.", "Biết thử lại nghiệm và loại nghiệm ngoại lai."],
  md: [
   { t: "Phương trình quy về bậc hai", y: ["$\\sqrt{f(x)}=\\sqrt{g(x)} \\Leftrightarrow \\begin{cases}f(x)=g(x)\\\\ f(x)\\ge0\\end{cases}$", "$\\sqrt{f(x)}=g(x) \\Leftrightarrow \\begin{cases}g(x)\\ge0\\\\ f(x)=g^2(x)\\end{cases}$", "Bình phương hai vế có thể sinh nghiệm ngoại lai nên phải thử lại."],
     vd: { d: "Giải phương trình $\\sqrt{x+3}=x+1$.", g: ["Điều kiện $x+1\\ge0 \\Leftrightarrow x\\ge-1$.", "Bình phương: $x+3=x^2+2x+1 \\Leftrightarrow x^2+x-2=0$.", "$x=1$ hoặc $x=-2$; loại $x=-2$. Vậy $x=1$."] } }],
  tt: { d: "Khoảng cách nhìn thấy đường chân trời từ độ cao $h$ (m) là $d=\\sqrt{12{,}74h}$ (km). Muốn nhìn xa $20$ km thì đài quan sát phải cao bao nhiêu mét?",
      g: ["$\\sqrt{12{,}74h}=20$.", "$12{,}74h=400 \\Rightarrow h=\\dfrac{400}{12{,}74}$.", "$h\\approx31{,}4$ m."] },
  cs: "casio", ai: { p: "Giải phương trình $\\sqrt{x+3}=x+1$ và chỉ rõ nghiệm ngoại lai.", l: "AI hay nhận cả $x=-2$ vì chỉ bình phương mà không kiểm tra điều kiện $x+1\\ge0$." },
  bt: "Bài 6.19 – 6.23 SGK trang 25 (Tập 2)." },

19: { t: 3, yc: ["Nhận biết vectơ chỉ phương, vectơ pháp tuyến của đường thẳng.", "Viết phương trình tham số, phương trình tổng quát của đường thẳng.", "Vận dụng vào bài toán thực tiễn về chuyển động, đường đi."],
  md: [
   { t: "Vectơ chỉ phương và pháp tuyến", y: ["$\\vec u=(a;b)\\ne\\vec0$ là vectơ chỉ phương nếu giá của nó song song hoặc trùng với $\\Delta$.", "$\\vec n=(A;B)$ là vectơ pháp tuyến nếu $\\vec n\\perp\\vec u$.", "Nếu $\\vec u=(a;b)$ thì chọn được $\\vec n=(-b;a)$ hoặc $\\vec n=(b;-a)$."],
     vd: { d: "Đường thẳng $\\Delta$ đi qua $A(1;2)$ có vectơ chỉ phương $\\vec u=(3;-1)$. Tìm một vectơ pháp tuyến.", g: ["Chọn $\\vec n=(1;3)$ vì $\\vec n\\cdot\\vec u=1\\cdot3+3\\cdot(-1)=0$."] } },
   { t: "Phương trình đường thẳng", y: ["Tham số: $\\begin{cases}x=x_0+at\\\\ y=y_0+bt\\end{cases}$", "Tổng quát: $A(x-x_0)+B(y-y_0)=0$ hay $Ax+By+C=0$.", "Đường thẳng qua hai điểm $A$, $B$ nhận $\\overrightarrow{AB}$ làm vectơ chỉ phương."],
     vd: { d: "Viết phương trình tổng quát của đường thẳng qua $A(1;2)$ và $B(3;6)$.", g: ["$\\overrightarrow{AB}=(2;4)$, chọn $\\vec u=(1;2)$ nên $\\vec n=(2;-1)$.", "$2(x-1)-1(y-2)=0$.", "$2x-y=0$."] } }],
  tt: { d: "Một tàu chạy thẳng đều, lúc $t=0$ ở vị trí $A(2;1)$ (đơn vị km) và sau mỗi giờ dịch chuyển thêm vectơ $\\vec v=(12;5)$ km/h. Viết phương trình quỹ đạo của tàu và cho biết sau $2$ giờ tàu ở đâu.",
      g: ["Phương trình tham số: $\\begin{cases}x=2+12t\\\\ y=1+5t\\end{cases}$", "Khử $t$: $\\dfrac{x-2}{12}=\\dfrac{y-1}{5} \\Leftrightarrow 5x-12y+2=0$.", "Với $t=2$: tàu ở $(26;11)$, tức cách $A$ một khoảng $26$ km."] },
  cs: "geogebra", ai: { p: "Viết phương trình tổng quát của đường thẳng qua $A(1;2)$ và $B(3;6)$.", l: "AI hay lấy luôn $\\overrightarrow{AB}$ làm vectơ pháp tuyến, cho phương trình $2x+4y-10=0$ sai bản chất." },
  bt: "Bài 7.1 – 7.6 SGK trang 34 (Tập 2)." },

20: { t: 2, yc: ["Xét vị trí tương đối của hai đường thẳng.", "Tính góc giữa hai đường thẳng và khoảng cách từ điểm đến đường thẳng."],
  md: [
   { t: "Vị trí tương đối và góc", y: ["Xét hệ hai phương trình: vô nghiệm (song song), vô số nghiệm (trùng), một nghiệm (cắt).", "$\\cos(\\Delta_1,\\Delta_2)=\\dfrac{\\left|\\vec n_1\\cdot\\vec n_2\\right|}{|\\vec n_1||\\vec n_2|}$, góc thuộc $[0^\\circ;90^\\circ]$.", "$\\Delta_1\\perp\\Delta_2 \\Leftrightarrow \\vec n_1\\cdot\\vec n_2=0$."],
     vd: { d: "Tính góc giữa $\\Delta_1: x+y-1=0$ và $\\Delta_2: x-2y+3=0$.", g: ["$\\vec n_1=(1;1)$, $\\vec n_2=(1;-2)$.", "$\\cos\\varphi=\\dfrac{|1-2|}{\\sqrt2\\cdot\\sqrt5}=\\dfrac{1}{\\sqrt{10}}$.", "$\\varphi\\approx71^\\circ34'$."] } },
   { t: "Khoảng cách", y: ["$d(M,\\Delta)=\\dfrac{\\left|Ax_0+By_0+C\\right|}{\\sqrt{A^2+B^2}}$.", "Khoảng cách giữa hai đường song song: lấy một điểm trên đường này rồi tính khoảng cách đến đường kia."],
     vd: { d: "Tính khoảng cách từ $M(2;3)$ đến $\\Delta: 3x-4y+5=0$.", g: ["$d=\\dfrac{|3\\cdot2-4\\cdot3+5|}{\\sqrt{9+16}}$.", "$=\\dfrac{|-1|}{5}=0{,}2$."] } }],
  tt: { d: "Một trạm phát sóng đặt tại $M(2;3)$ (km). Tuyến đường cao tốc có phương trình $3x-4y+5=0$. Tính khoảng cách ngắn nhất từ trạm đến cao tốc để biết xe chạy trên đường có nằm trong vùng phủ sóng bán kính $1$ km không.",
      g: ["$d(M,\\Delta)=\\dfrac{|6-12+5|}{5}=0{,}2$ km.", "$0{,}2<1$ nên cao tốc nằm trong vùng phủ sóng.", "Đoạn cao tốc được phủ sóng có độ dài $2\\sqrt{1^2-0{,}2^2}\\approx1{,}96$ km."] },
  cs: "geogebra", ai: { p: "Tính khoảng cách từ $M(2;3)$ đến đường thẳng $3x-4y+5=0$.", l: "AI hay quên lấy trị tuyệt đối ở tử số, cho kết quả âm." },
  bt: "Bài 7.7 – 7.12 SGK trang 41 (Tập 2)." },

21: { t: 2, yc: ["Lập phương trình đường tròn khi biết tâm và bán kính.", "Nhận dạng phương trình đường tròn; viết phương trình tiếp tuyến."],
  md: [
   { t: "Phương trình đường tròn", y: ["Tâm $I(a;b)$, bán kính $R$: $(x-a)^2+(y-b)^2=R^2$.", "Dạng khai triển: $x^2+y^2-2ax-2by+c=0$ với $R=\\sqrt{a^2+b^2-c}$, điều kiện $a^2+b^2-c>0$."],
     vd: { d: "Xác định tâm và bán kính của $x^2+y^2-4x+6y-3=0$.", g: ["$-2a=-4 \\Rightarrow a=2$; $-2b=6 \\Rightarrow b=-3$; $c=-3$.", "$R=\\sqrt{4+9+3}=4$.", "Tâm $I(2;-3)$, bán kính $R=4$."] } },
   { t: "Tiếp tuyến của đường tròn", y: ["Tiếp tuyến tại $M(x_0;y_0)$ nhận $\\overrightarrow{IM}$ làm vectơ pháp tuyến.", "Đường thẳng $\\Delta$ tiếp xúc $(I;R)$ khi $d(I,\\Delta)=R$."],
     vd: { d: "Viết phương trình tiếp tuyến của đường tròn $(x-1)^2+(y-2)^2=25$ tại $M(4;6)$.", g: ["$\\overrightarrow{IM}=(3;4)$ là vectơ pháp tuyến.", "$3(x-4)+4(y-6)=0$.", "$3x+4y-36=0$."] } }],
  tt: { d: "Một vòi phun nước tưới tự động đặt tại $I(1;2)$ có bán kính tưới $25$ m (đơn vị trục là mét, $(x-1)^2+(y-2)^2=625$). Một luống rau nằm trên đường thẳng $3x+4y-36=0$. Luống rau có được tưới không?",
      g: ["$d(I,\\Delta)=\\dfrac{|3+8-36|}{5}=5$ m.", "$5<25$ nên đường thẳng cắt đường tròn.", "Vậy luống rau được tưới, phần được tưới dài $2\\sqrt{25^2-5^2}\\approx49$ m."] },
  cs: "geogebra", ai: { p: "Tìm tâm, bán kính của $x^2+y^2-4x+6y-3=0$.", l: "AI hay lấy $R=\\sqrt{c}$ hoặc quên đổi dấu khi tìm tâm từ hệ số." },
  bt: "Bài 7.13 – 7.17 SGK trang 47 (Tập 2)." },

22: { t: 3, yc: ["Nhận biết ba đường conic: elip, hypebol, parabol và phương trình chính tắc.", "Giải quyết bài toán thực tiễn gắn với ba đường conic."],
  md: [
   { t: "Elip và hypebol", y: ["Elip: $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ $(a>b>0)$, $c^2=a^2-b^2$, tiêu điểm $F_{1,2}(\\mp c;0)$, $MF_1+MF_2=2a$.", "Hypebol: $\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$, $c^2=a^2+b^2$, $\\left|MF_1-MF_2\\right|=2a$."],
     vd: { d: "Cho elip $\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1$. Tìm độ dài trục lớn, trục bé và tiêu cự.", g: ["$a=5$, $b=3$ nên trục lớn $2a=10$, trục bé $2b=6$.", "$c^2=25-9=16 \\Rightarrow c=4$, tiêu cự $2c=8$."] } },
   { t: "Parabol", y: ["Phương trình chính tắc: $y^2=2px$ $(p>0)$, tiêu điểm $F\\left(\\dfrac{p}{2};0\\right)$, đường chuẩn $x=-\\dfrac{p}{2}$.", "Mỗi điểm trên parabol cách đều tiêu điểm và đường chuẩn."] }],
  tt: { d: "Một cổng chào hình bán elip rộng $10$ m, cao $3$ m. Một xe tải cao $2{,}4$ m, rộng $4$ m đi chính giữa cổng có qua được không?",
      g: ["Chọn hệ trục với tâm ở giữa chân cổng: $\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1$, $y\\ge0$.", "Tại $x=2$ (mép xe): $y=3\\sqrt{1-\\dfrac{4}{25}}=3\\cdot\\dfrac{\\sqrt{21}}{5}\\approx2{,}75$ m.", "$2{,}75>2{,}4$ nên xe qua được."] },
  cs: "geogebra", ai: { p: "Cổng hình bán elip rộng 10 m cao 3 m, xe cao 2,4 m rộng 4 m có qua được không?", l: "AI hay so sánh chiều cao xe với chiều cao đỉnh cổng ($3$ m) mà quên xét tại mép xe $x=2$." },
  bt: "Bài 7.18 – 7.23 SGK trang 55 (Tập 2)." },

23: { t: 2, yc: ["Vận dụng quy tắc cộng, quy tắc nhân.", "Vận dụng sơ đồ hình cây trong bài toán đếm."],
  md: [
   { t: "Quy tắc cộng và quy tắc nhân", y: ["Quy tắc cộng: công việc có $k$ phương án rời nhau, phương án $i$ có $n_i$ cách thì có $n_1+n_2+\\dots+n_k$ cách.", "Quy tắc nhân: công việc gồm $k$ công đoạn nối tiếp, công đoạn $i$ có $n_i$ cách thì có $n_1n_2\\dots n_k$ cách."],
     vd: { d: "Có $4$ áo và $3$ quần. Hỏi có bao nhiêu cách chọn một bộ gồm áo và quần?", g: ["Hai công đoạn nối tiếp nên dùng quy tắc nhân.", "$4\\times3=12$ cách."] } },
   { t: "Vận dụng kết hợp", y: ["Phân biệt: “hoặc” thường ứng với quy tắc cộng; “rồi”, “và” ứng với quy tắc nhân.", "Sơ đồ hình cây giúp hình dung đủ các trường hợp, tránh trùng và sót."],
     vd: { d: "Từ các chữ số $1;2;3;4;5$ lập được bao nhiêu số tự nhiên có $3$ chữ số đôi một khác nhau?", g: ["Chữ số hàng trăm: $5$ cách; hàng chục: $4$ cách; hàng đơn vị: $3$ cách.", "$5\\times4\\times3=60$ số."] } }],
  tt: { d: "Mật khẩu két sắt gồm $4$ chữ số từ $0$ đến $9$. Nếu kẻ trộm thử mỗi mật khẩu mất $3$ giây thì cần tối đa bao lâu để mở được két?",
      g: ["Số mật khẩu: $10^4=10\\,000$.", "Thời gian tối đa: $10\\,000\\times3=30\\,000$ giây.", "Khoảng $8$ giờ $20$ phút — nên dùng mật khẩu dài hơn."] },
  cs: "ai", ai: { p: "Từ các chữ số 1;2;3;4;5 lập được bao nhiêu số có 3 chữ số đôi một khác nhau?", l: "AI hay nhầm với trường hợp chữ số được lặp, trả lời $125$." },
  bt: "Bài 8.1 – 8.5 SGK trang 63 (Tập 2)." },

24: { t: 3, yc: ["Tính số hoán vị, chỉnh hợp, tổ hợp.", "Phân biệt chỉnh hợp và tổ hợp trong tình huống cụ thể."],
  md: [
   { t: "Hoán vị và chỉnh hợp", y: ["$P_n=n!$ là số cách sắp thứ tự $n$ phần tử.", "$A_n^k=\\dfrac{n!}{(n-k)!}$: chọn $k$ trong $n$ phần tử **có** thứ tự."],
     vd: { d: "Có bao nhiêu cách xếp $5$ học sinh thành một hàng dọc? Bao nhiêu cách chọn $3$ em làm lớp trưởng, lớp phó, thủ quỹ từ $5$ em?", g: ["Xếp hàng: $5!=120$ cách.", "Chọn có phân công chức vụ (có thứ tự): $A_5^3=60$ cách."] } },
   { t: "Tổ hợp", y: ["$C_n^k=\\dfrac{n!}{k!(n-k)!}$: chọn $k$ trong $n$ phần tử **không** kể thứ tự.", "$C_n^k=C_n^{n-k}$; $C_n^0=C_n^n=1$.", "Dấu hiệu phân biệt: có phân công vai trò thì dùng chỉnh hợp, chỉ chọn nhóm thì dùng tổ hợp."],
     vd: { d: "Từ $10$ học sinh chọn $3$ em đi dự hội nghị. Có bao nhiêu cách?", g: ["Ba em có vai trò như nhau nên dùng tổ hợp.", "$C_{10}^3=\\dfrac{10\\cdot9\\cdot8}{3\\cdot2\\cdot1}=120$ cách."] } }],
  tt: { d: "Giải bóng đá có $8$ đội thi đấu vòng tròn một lượt. Hỏi có bao nhiêu trận đấu? Nếu trao $3$ huy chương vàng, bạc, đồng thì có bao nhiêu khả năng xếp hạng?",
      g: ["Mỗi trận là một cặp không kể thứ tự: $C_8^2=28$ trận.", "Trao huy chương có phân biệt thứ hạng: $A_8^3=336$ khả năng."] },
  cs: "casio", ai: { p: "Giải bóng đá 8 đội vòng tròn một lượt có bao nhiêu trận?", l: "AI hay trả lời $A_8^2=56$ vì coi trận “A gặp B” khác “B gặp A”." },
  bt: "Bài 8.6 – 8.11 SGK trang 71 (Tập 2)." },

25: { t: 2, yc: ["Khai triển nhị thức Newton với $n=4$, $n=5$.", "Xác định hệ số, số hạng trong khai triển."],
  md: [
   { t: "Công thức nhị thức Newton", y: ["$(a+b)^n=\\sum\\limits_{k=0}^{n}C_n^k a^{n-k}b^k$.", "Khai triển có $n+1$ số hạng; số hạng tổng quát $T_{k+1}=C_n^ka^{n-k}b^k$.", "Hệ số các số hạng cách đều hai đầu thì bằng nhau."],
     vd: { d: "Khai triển $(x+2)^4$.", g: ["$=C_4^0x^4+C_4^1x^3\\cdot2+C_4^2x^2\\cdot4+C_4^3x\\cdot8+C_4^4\\cdot16$.", "$=x^4+8x^3+24x^2+32x+16$."] } }],
  tt: { d: "Dân số một xã tăng $2\\%$ mỗi năm. Dùng khai triển nhị thức Newton để ước tính $(1{,}02)^5$ và cho biết sau $5$ năm dân số tăng khoảng bao nhiêu phần trăm.",
      g: ["$(1+0{,}02)^5=1+5(0{,}02)+10(0{,}02)^2+10(0{,}02)^3+\\dots$", "$\\approx1+0{,}1+0{,}004+0{,}00008\\approx1{,}1041$.", "Dân số tăng khoảng $10{,}4\\%$ sau $5$ năm, nhiều hơn mức $10\\%$ nếu tính cộng dồn đơn giản."] },
  cs: "casio", ai: { p: "Khai triển $(x+2)^4$ và tìm hệ số của $x^2$.", l: "AI hay quên luỹ thừa của $2$ trong từng số hạng, cho hệ số $C_4^2=6$ thay vì $24$." },
  bt: "Bài 8.12 – 8.15 SGK trang 74 (Tập 2)." },

26: { t: 2, yc: ["Nhận biết phép thử ngẫu nhiên, không gian mẫu, biến cố.", "Tính xác suất theo định nghĩa cổ điển."],
  md: [
   { t: "Không gian mẫu và biến cố", y: ["Không gian mẫu $\\Omega$ là tập mọi kết quả có thể của phép thử.", "Biến cố là tập con của $\\Omega$; biến cố đối $\\overline{A}=\\Omega\\setminus A$.", "Biến cố chắc chắn là $\\Omega$, biến cố không thể là $\\varnothing$."],
     vd: { d: "Gieo đồng thời hai đồng xu. Mô tả không gian mẫu và biến cố “có đúng một mặt sấp”.", g: ["$\\Omega=\\{SS;SN;NS;NN\\}$, $n(\\Omega)=4$.", "$A=\\{SN;NS\\}$, $n(A)=2$."] } },
   { t: "Định nghĩa cổ điển của xác suất", y: ["$P(A)=\\dfrac{n(A)}{n(\\Omega)}$ khi các kết quả đồng khả năng.", "$0\\le P(A)\\le1$; $P(\\Omega)=1$, $P(\\varnothing)=0$.", "$P(\\overline{A})=1-P(A)$."],
     vd: { d: "Tính xác suất của biến cố “có đúng một mặt sấp” ở ví dụ trên.", g: ["$P(A)=\\dfrac{2}{4}=0{,}5$."] } }],
  tt: { d: "Một hộp có $20$ sản phẩm trong đó $3$ phế phẩm. Kiểm tra ngẫu nhiên $2$ sản phẩm. Tính xác suất có ít nhất một phế phẩm.",
      g: ["$n(\\Omega)=C_{20}^2=190$.", "Biến cố đối: cả hai đều tốt, $C_{17}^2=136$.", "$P=1-\\dfrac{136}{190}=\\dfrac{54}{190}\\approx0{,}284$."] },
  cs: "excel", ai: { p: "Hộp 20 sản phẩm có 3 phế phẩm, lấy 2 sản phẩm, tính xác suất có ít nhất một phế phẩm.", l: "AI hay tính trực tiếp rồi cộng nhầm các trường hợp, thay vì dùng biến cố đối cho gọn." },
  bt: "Bài 9.1 – 9.5 SGK trang 83 (Tập 2)." },

27: { t: 2, yc: ["Vận dụng quy tắc đếm và các công thức tổ hợp để tính xác suất.", "Sử dụng tính chất của xác suất và biến cố đối trong bài toán thực tiễn."],
  md: [
   { t: "Tính xác suất bằng tổ hợp", y: ["Đếm $n(\\Omega)$ và $n(A)$ bằng hoán vị, chỉnh hợp, tổ hợp.", "Với bài toán chọn ngẫu nhiên nhiều phần tử, thường dùng tổ hợp.", "Nhiều bài tính nhanh hơn qua biến cố đối."],
     vd: { d: "Lớp có $20$ nam, $15$ nữ. Chọn ngẫu nhiên $4$ em. Tính xác suất chọn được $2$ nam và $2$ nữ.", g: ["$n(\\Omega)=C_{35}^4=52\\,360$.", "$n(A)=C_{20}^2\\cdot C_{15}^2=190\\cdot105=19\\,950$.", "$P(A)=\\dfrac{19\\,950}{52\\,360}\\approx0{,}381$."] } },
   { t: "Mô phỏng và tần suất", y: ["Khi khó đếm, có thể mô phỏng nhiều lần và lấy tần suất xấp xỉ xác suất.", "Số phép thử càng lớn, tần suất càng gần xác suất lí thuyết (luật số lớn)."] }],
  tt: { d: "Vé số có $6$ chữ số từ $000000$ đến $999999$. Tính xác suất trúng giải đặc biệt (trùng cả $6$ chữ số) và xác suất trúng giải khuyến khích (trùng $2$ chữ số cuối).",
      g: ["$n(\\Omega)=10^6$. Giải đặc biệt: $P=\\dfrac{1}{10^6}=0{,}000001$.", "Hai chữ số cuối: $P=\\dfrac{1}{100}=0{,}01$.", "Xác suất trúng giải đặc biệt chỉ bằng một phần triệu — cần hiểu đúng để không kì vọng sai."] },
  cs: "excel", ai: { p: "Lớp 20 nam 15 nữ, chọn 4 em, tính xác suất được 2 nam 2 nữ.", l: "AI hay cộng $C_{20}^2+C_{15}^2$ thay vì nhân, do không phân biệt quy tắc cộng với quy tắc nhân." },
  bt: "Bài 9.6 – 9.10 SGK trang 87 (Tập 2)." }
  };
})(window);
