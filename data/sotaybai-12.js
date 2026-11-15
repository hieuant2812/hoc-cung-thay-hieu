/* Sổ tay theo bài – Toán 12 (KNTT): ý chính cho sơ đồ tư duy và 5 dạng bài tập tiêu biểu có giải mẫu. */
(window.SOTAYBAI = window.SOTAYBAI || {})[12] = String.raw`
@1
m: $f'(x)>0$ trên $K$: đồng biến; $f'(x)<0$: nghịch biến ;; $f'$ đổi dấu từ $+$ sang $-$: cực đại; từ $-$ sang $+$: cực tiểu ;; Lập bảng biến thiên từ nghiệm của $f'$ ;; $ax^2+bx+c\ge0\ \forall x\Leftrightarrow a>0,\ \Delta\le0$
# Tìm khoảng đơn điệu của hàm đa thức
p: Tính $y'$, giải $y'=0$, lập bảng xét dấu $y'$.
d: Tìm các khoảng đơn điệu của $y=x^3-3x^2+2$.
g: $y'=3x^2-6x=0\Leftrightarrow x=0$ hoặc $x=2$.
g: Đồng biến trên $(-\infty;0)$ và $(2;+\infty)$; nghịch biến trên $(0;2)$.
# Đơn điệu của hàm phân thức
p: Hàm $y=\dfrac{ax+b}{cx+d}$ có $y'=\dfrac{ad-bc}{(cx+d)^2}$ không đổi dấu trên từng khoảng xác định.
d: Xét tính đơn điệu của $y=\dfrac{x+1}{x-1}$.
g: $y'=\dfrac{-1-1}{(x-1)^2}=\dfrac{-2}{(x-1)^2}<0$.
g: Hàm số nghịch biến trên $(-\infty;1)$ và $(1;+\infty)$.
# Tìm cực trị
p: Từ bảng biến thiên, tại điểm $y'$ đổi dấu là điểm cực trị.
d: Tìm cực trị của $y=x^3-3x^2+2$.
g: $y'$ đổi dấu $+\to-$ tại $x=0$: cực đại $y_{\text{CĐ}}=2$.
g: $y'$ đổi dấu $-\to+$ tại $x=2$: cực tiểu $y_{CT}=-2$.
# Tìm tham số để hàm số đồng biến trên $\mathbb R$
p: Cần $y'\ge0$ với mọi $x$ (dấu bằng chỉ tại hữu hạn điểm).
d: Tìm $m$ để $y=x^3-3x^2+mx$ đồng biến trên $\mathbb R$.
g: $y'=3x^2-6x+m\ge0\ \forall x\Leftrightarrow\Delta'=9-3m\le0$.
g: $m\ge3$.
# Cực trị từ biểu thức của $f'$
p: Chỉ những nghiệm làm $f'$ đổi dấu mới là điểm cực trị (nghiệm bội chẵn không đổi dấu).
d: Hàm số $f$ có $f'(x)=(x-1)^2(x+2)$. Tìm số điểm cực trị.
g: $f'$ không đổi dấu qua $x=1$ (nghiệm kép); đổi dấu $-\to+$ qua $x=-2$.
g: Hàm số có đúng một điểm cực trị (cực tiểu tại $x=-2$).

@2
m: Trên đoạn $[a;b]$: so sánh $f(a)$, $f(b)$ và $f$ tại các nghiệm của $f'$ ;; Trên khoảng: dùng bảng biến thiên ;; Hàm đơn điệu trên đoạn: GTLN, GTNN ở hai đầu mút ;; Bài toán tối ưu: lập hàm, tìm miền xác định
# GTLN, GTNN trên đoạn
p: Tìm nghiệm của $f'$ thuộc đoạn, tính $f$ tại các nghiệm và hai đầu mút.
d: Tìm GTLN, GTNN của $y=x^3-3x+1$ trên $[0;2]$.
g: $y'=3x^2-3=0\Rightarrow x=1\in[0;2]$ ($x=-1$ loại).
g: $f(0)=1$, $f(1)=-1$, $f(2)=3$: $\max=3$, $\min=-1$.
# Hàm phân thức trên đoạn
p: Hàm đơn điệu trên đoạn thì đạt GTLN, GTNN tại hai đầu mút.
d: Tìm GTLN, GTNN của $y=\dfrac{2x+1}{x+1}$ trên $[0;2]$.
g: $y'=\dfrac1{(x+1)^2}>0$ nên hàm đồng biến trên $[0;2]$.
g: $\min=f(0)=1$; $\max=f(2)=\dfrac53$.
# GTLN, GTNN trên khoảng
p: Lập bảng biến thiên trên khoảng đã cho.
d: Tìm GTNN của $y=x+\dfrac4x$ trên $(0;+\infty)$.
g: $y'=1-\dfrac4{x^2}=0\Rightarrow x=2$; $y'$ đổi dấu $-\to+$.
g: $\min\limits_{(0;+\infty)}y=y(2)=4$ (không có GTLN).
# Hàm chứa căn
p: Tìm tập xác định, đánh giá trực tiếp hoặc dùng đạo hàm.
d: Tìm GTLN, GTNN của $y=\sqrt{4-x^2}$.
g: $D=[-2;2]$; $0\le4-x^2\le4$.
g: $\max y=2$ tại $x=0$; $\min y=0$ tại $x=\pm2$.
# Bài toán tối ưu thể tích
p: Gọi ẩn, lập hàm thể tích, tìm GTLN trên khoảng xác định.
d: Từ tấm bìa vuông cạnh $12$ cm, cắt bốn góc bốn hình vuông cạnh $x$ rồi gấp thành hộp không nắp. Tìm $x$ để thể tích lớn nhất.
g: $V(x)=x(12-2x)^2$, $0<x<6$; $V'(x)=(12-2x)(12-6x)=0\Rightarrow x=2$.
g: $V$ đạt lớn nhất tại $x=2$: $V=2\cdot8^2=128$ cm$^3$.

@3
m: Tiệm cận đứng $x=x_0$: $\lim\limits_{x\to x_0^\pm}f(x)=\pm\infty$ ;; Tiệm cận ngang $y=y_0$: $\lim\limits_{x\to\pm\infty}f(x)=y_0$ ;; Tiệm cận xiên $y=ax+b$: $a=\lim\dfrac{f(x)}x$, $b=\lim[f(x)-ax]$ ;; $y=\dfrac{ax+b}{cx+d}$: $x=-\dfrac dc$, $y=\dfrac ac$
# Tiệm cận của hàm bậc nhất trên bậc nhất
p: Tiệm cận đứng là nghiệm mẫu (không là nghiệm tử); tiệm cận ngang $y=\dfrac ac$.
d: Tìm các đường tiệm cận của $y=\dfrac{2x-1}{x+1}$.
g: $\lim\limits_{x\to-1^\pm}y=\mp\infty$: tiệm cận đứng $x=-1$.
g: $\lim\limits_{x\to\pm\infty}y=2$: tiệm cận ngang $y=2$.
# Phân thức có nghiệm chung của tử và mẫu
p: Rút gọn trước; nghiệm của mẫu bị triệt tiêu không cho tiệm cận đứng.
d: Tìm tiệm cận của $y=\dfrac{x+1}{x^2-1}$.
g: Với $x\ne-1$: $y=\dfrac1{x-1}$; $\lim\limits_{x\to-1}y=-\dfrac12$ nên $x=-1$ không là tiệm cận.
g: Tiệm cận đứng $x=1$; tiệm cận ngang $y=0$.
# Tiệm cận xiên
p: Chia đa thức: $y=ax+b+\dfrac{r}{cx+d}$ thì $y=ax+b$ là tiệm cận xiên.
d: Tìm tiệm cận của $y=\dfrac{x^2+x+1}{x}$.
g: $y=x+1+\dfrac1x$; $\lim\limits_{x\to\pm\infty}[y-(x+1)]=0$: tiệm cận xiên $y=x+1$.
g: Tiệm cận đứng $x=0$.
# Tìm tham số theo tiệm cận
p: Viết công thức tiệm cận theo tham số rồi cho bằng giá trị đề bài.
d: Tìm $m$ để đồ thị $y=\dfrac{mx+1}{x-2}$ có tiệm cận ngang $y=3$.
g: Tiệm cận ngang $y=m$.
g: $m=3$ (khi đó $2m+1\ne0$ nên vẫn có tiệm cận đứng $x=2$).
# Ý nghĩa thực tế của tiệm cận
p: Tiệm cận ngang cho biết giá trị mà đại lượng tiến tới khi biến số rất lớn.
d: Chi phí trung bình để sản xuất $x$ sản phẩm là $C(x)=\dfrac{50x+1000}{x}$ (nghìn đồng). Tìm tiệm cận ngang và nêu ý nghĩa.
g: $\lim\limits_{x\to+\infty}C(x)=50$: tiệm cận ngang $y=50$.
g: Sản xuất càng nhiều, chi phí trung bình mỗi sản phẩm càng gần $50$ nghìn đồng.

@4
m: Sơ đồ: tập xác định $\to$ chiều biến thiên (đạo hàm, giới hạn, tiệm cận, bảng biến thiên) $\to$ đồ thị ;; Bậc ba nhận điểm $x_0$ với $y''(x_0)=0$ làm tâm đối xứng ;; $y=\dfrac{ax+b}{cx+d}$ đối xứng qua giao điểm hai tiệm cận ;; Số nghiệm của $f(x)=m$ = số giao điểm với đường $y=m$
# Khảo sát hàm bậc ba
p: Tìm cực trị, giới hạn, bảng biến thiên, giao điểm với trục, tâm đối xứng.
d: Khảo sát và vẽ đồ thị $y=x^3-3x$.
g: $y'=3x^2-3=0\Leftrightarrow x=\pm1$; cực đại $(-1;2)$, cực tiểu $(1;-2)$.
g: Đồ thị cắt $Ox$ tại $x=0$, $x=\pm\sqrt3$; nhận $O(0;0)$ làm tâm đối xứng.
# Khảo sát hàm phân thức bậc nhất
p: Xác định hai tiệm cận, chiều biến thiên, giao điểm với các trục.
d: Khảo sát và vẽ đồ thị $y=\dfrac{x+1}{x-1}$.
g: Tiệm cận đứng $x=1$, tiệm cận ngang $y=1$; $y'=\dfrac{-2}{(x-1)^2}<0$: nghịch biến trên từng khoảng.
g: Cắt $Ox$ tại $(-1;0)$, cắt $Oy$ tại $(0;-1)$; tâm đối xứng $I(1;1)$.
# Khảo sát hàm bậc hai trên bậc nhất
p: Viết $y=ax+b+\dfrac r{x-x_0}$ để thấy tiệm cận xiên; tìm cực trị.
d: Khảo sát $y=\dfrac{x^2-x+1}{x-1}$.
g: $y=x+\dfrac1{x-1}$: tiệm cận đứng $x=1$, tiệm cận xiên $y=x$.
g: $y'=1-\dfrac1{(x-1)^2}=0\Leftrightarrow x=0$ hoặc $x=2$: cực đại $(0;-1)$, cực tiểu $(2;3)$.
# Biện luận số nghiệm bằng đồ thị
p: Đưa phương trình về $f(x)=m$, dựa vào đồ thị (bảng biến thiên) của $f$.
d: Tìm $m$ để $x^3-3x=m$ có ba nghiệm phân biệt.
g: Đường $y=m$ cắt đồ thị $y=x^3-3x$ tại ba điểm khi nằm giữa hai giá trị cực trị.
g: $-2<m<2$.
# Nhận dạng đồ thị hàm bậc ba
p: Dựa vào dáng đồ thị (nhánh cuối đi lên/xuống) xác định dấu $a$; giao với $Oy$ cho dấu $d$.
d: Đồ thị $y=ax^3+bx^2+cx+d$ có nhánh bên phải đi lên và cắt trục tung tại điểm nằm dưới gốc toạ độ. Xét dấu $a$, $d$.
g: $\lim\limits_{x\to+\infty}y=+\infty$ nên $a>0$.
g: Giao với $Oy$ là $(0;d)$ nằm dưới $O$ nên $d<0$.

@5
m: Lập hàm mục tiêu theo một biến, xác định miền ;; Tìm GTLN, GTNN bằng đạo hàm ;; Tốc độ thay đổi của đại lượng là đạo hàm ;; Lợi nhuận $=$ doanh thu $-$ chi phí
# Tối ưu diện tích
p: Biểu diễn diện tích theo một kích thước, tìm GTLN.
d: Dùng $100$ m lưới rào một mảnh vườn hình chữ nhật, một cạnh dựa vào tường (không rào). Tìm diện tích lớn nhất.
g: Hai cạnh vuông góc với tường dài $x$, cạnh còn lại $100-2x$: $S=x(100-2x)$, $0<x<50$.
g: $S'=100-4x=0\Rightarrow x=25$: $S_{\max}=25\cdot50=1250$ m$^2$.
# Tối ưu vật liệu
p: Dùng điều kiện cố định (thể tích) để khử một ẩn.
d: Làm hộp không nắp đáy vuông có thể tích $32$ dm$^3$. Tìm kích thước để tốn ít vật liệu nhất.
g: Cạnh đáy $x$, chiều cao $\dfrac{32}{x^2}$: $S=x^2+\dfrac{128}x$, $S'=2x-\dfrac{128}{x^2}=0\Rightarrow x=4$.
g: Cạnh đáy $4$ dm, cao $2$ dm, diện tích nhỏ nhất $48$ dm$^2$.
# Chuyển động: vận tốc, gia tốc
p: $v(t)=s'(t)$, $a(t)=v'(t)$; vật dừng khi $v=0$.
d: Một vật chuyển động theo $s(t)=t^3-6t^2+9t$ (m). Khi nào vận tốc bằng $0$? Tính gia tốc lúc đó.
g: $v(t)=3t^2-12t+9=0\Leftrightarrow t=1$ hoặc $t=3$.
g: $a(t)=6t-12$: $a(1)=-6$ m/s$^2$, $a(3)=6$ m/s$^2$.
# Lợi nhuận lớn nhất
p: Lập $P(x)=R(x)-C(x)$ rồi tìm GTLN.
d: Doanh thu $R(x)=200x-x^2$, chi phí $C(x)=40x+1000$ (nghìn đồng). Tìm $x$ để lợi nhuận lớn nhất.
g: $P(x)=-x^2+160x-1000$; $P'(x)=-2x+160=0\Rightarrow x=80$.
g: Lợi nhuận lớn nhất $P(80)=5400$ nghìn đồng.
# Tốc độ thay đổi và giá trị lớn nhất
p: Đạo hàm cho biết đại lượng tăng hay giảm; đạt cực đại khi đạo hàm đổi dấu $+\to-$.
d: Nồng độ thuốc trong máu sau $t$ giờ: $C(t)=\dfrac{5t}{t^2+4}$ (mg/L). Khi nào nồng độ cao nhất?
g: $C'(t)=\dfrac{5(4-t^2)}{(t^2+4)^2}=0\Rightarrow t=2$; $C'$ đổi dấu $+\to-$.
g: Sau $2$ giờ nồng độ cao nhất $C(2)=1{,}25$ mg/L.

@6
m: Quy tắc hình hộp: $\vec{AB}+\vec{AD}+\vec{AA'}=\vec{AC'}$ ;; Trọng tâm tứ diện: $\vec{GA}+\vec{GB}+\vec{GC}+\vec{GD}=\vec0$ ;; $\vec a\cdot\vec b=|\vec a||\vec b|\cos(\vec a,\vec b)$ ;; Góc giữa hai vectơ: đưa về chung gốc
# Rút gọn tổng vectơ trong hình hộp
p: Thay vectơ bằng vectơ bằng nó để nối đuôi.
d: Hình hộp $ABCD.A'B'C'D'$. Rút gọn $\vec{AB}+\vec{B'C'}+\vec{DD'}$.
g: $\vec{B'C'}=\vec{BC}$, $\vec{DD'}=\vec{CC'}$.
g: Tổng $=\vec{AB}+\vec{BC}+\vec{CC'}=\vec{AC'}$.
# Trung điểm, trọng tâm trong tứ diện
p: Chèn điểm và dùng hệ thức trung điểm.
d: Tứ diện $ABCD$, $M$, $N$ là trung điểm $AB$, $CD$. Chứng minh $\vec{MN}=\dfrac12(\vec{AD}+\vec{BC})$.
g: $\vec{MN}=\vec{MA}+\vec{AD}+\vec{DN}$ và $\vec{MN}=\vec{MB}+\vec{BC}+\vec{CN}$.
g: Cộng lại, $\vec{MA}+\vec{MB}=\vec0$, $\vec{DN}+\vec{CN}=\vec0$: $2\vec{MN}=\vec{AD}+\vec{BC}$.
# Tích vô hướng trong hình lập phương
p: Thay vectơ bằng vectơ cùng gốc rồi dùng định nghĩa.
d: Hình lập phương cạnh $a$. Tính $\vec{AB}\cdot\vec{A'C'}$.
g: $\vec{A'C'}=\vec{AC}$; $(\vec{AB},\vec{AC})=45^\circ$, $AC=a\sqrt2$.
g: $\vec{AB}\cdot\vec{A'C'}=a\cdot a\sqrt2\cdot\dfrac{\sqrt2}2=a^2$.
# Góc giữa hai vectơ
p: Đưa về hai vectơ chung gốc, tính góc trong tam giác.
d: Hình lập phương $ABCD.A'B'C'D'$. Tính góc giữa $\vec{A'B}$ và $\vec{AC}$.
g: $\vec{A'B}=\vec{D'C}$; tam giác $ACD'$ đều (ba đường chéo mặt).
g: $(\vec{D'C},\vec{AC})=(\vec{CD'},\vec{CA})=60^\circ$.
# Hợp lực trong không gian
p: Ba lực đôi một vuông góc: độ lớn hợp lực bằng đường chéo hình hộp chữ nhật.
d: Ba lực đôi một vuông góc có độ lớn $3$ N, $4$ N, $12$ N cùng tác dụng vào một vật. Tính độ lớn hợp lực.
g: $|\vec F|=\sqrt{3^2+4^2+12^2}$.
g: $|\vec F|=13$ N.

@7
m: $M(x;y;z)\Leftrightarrow\vec{OM}=x\vec i+y\vec j+z\vec k$ ;; Hình chiếu lên $(Oxy)$: $(x;y;0)$; lên $Ox$: $(x;0;0)$ ;; Đối xứng qua $O$: $(-x;-y;-z)$; qua $(Oxy)$: $(x;y;-z)$ ;; $\vec{AB}=(x_B-x_A;y_B-y_A;z_B-z_A)$
# Toạ độ vectơ
p: Hệ số của $\vec i,\vec j,\vec k$ là các toạ độ.
d: Tìm toạ độ của $\vec a=2\vec i-\vec j+3\vec k$ và $\vec b=\vec j-4\vec k$.
g: $\vec a=(2;-1;3)$.
g: $\vec b=(0;1;-4)$.
# Hình chiếu của điểm
p: Giữ các toạ độ ứng với mặt phẳng/trục chiếu, các toạ độ còn lại bằng $0$.
d: Cho $M(2;-3;5)$. Tìm hình chiếu của $M$ lên $(Oxy)$, $(Oyz)$, trục $Oz$.
g: Lên $(Oxy)$: $(2;-3;0)$; lên $(Oyz)$: $(0;-3;5)$.
g: Lên $Oz$: $(0;0;5)$.
# Điểm đối xứng
p: Đổi dấu các toạ độ không thuộc mặt phẳng/trục đối xứng.
d: Tìm điểm đối xứng của $M(2;-3;5)$ qua $O$, qua $(Oxy)$, qua trục $Ox$.
g: Qua $O$: $(-2;3;-5)$; qua $(Oxy)$: $(2;-3;-5)$.
g: Qua $Ox$: $(2;3;-5)$.
# Toạ độ đỉnh hình hộp
p: Dùng quy tắc hình hộp: $\vec{OB'}=\vec{OA}+\vec{OC}+\vec{OO'}$.
d: Hình hộp chữ nhật $OABC.O'A'B'C'$ có $A(3;0;0)$, $C(0;4;0)$, $O'(0;0;2)$. Tìm toạ độ $B'$.
g: $\vec{OB'}=\vec{OA}+\vec{OC}+\vec{OO'}$.
g: $B'(3;4;2)$.
# Ứng dụng: định vị
p: Chọn hệ trục gắn với thực tế, đọc toạ độ, tính khoảng cách.
d: Một drone ở độ cao $50$ m, cách điểm cất cánh $O$ là $30$ m về phía đông, $40$ m về phía bắc ($Ox$ hướng đông, $Oy$ hướng bắc, $Oz$ hướng lên). Tìm toạ độ drone và khoảng cách đến $O$.
g: Toạ độ $(30;40;50)$.
g: Khoảng cách $\sqrt{30^2+40^2+50^2}=50\sqrt2\approx70{,}7$ m.

@8
m: $\vec a\pm\vec b$, $k\vec a$ tính theo từng toạ độ ;; $\vec a\cdot\vec b=xx'+yy'+zz'$; $|\vec a|=\sqrt{x^2+y^2+z^2}$ ;; Trung điểm, trọng tâm: trung bình cộng toạ độ ;; $\cos(\vec a,\vec b)=\dfrac{\vec a\cdot\vec b}{|\vec a||\vec b|}$
# Phép toán vectơ theo toạ độ
p: Cộng, trừ, nhân số theo từng toạ độ.
d: Cho $\vec a=(1;-2;3)$, $\vec b=(2;0;-1)$. Tính $\vec a+2\vec b$ và $\vec a\cdot\vec b$.
g: $\vec a+2\vec b=(5;-2;1)$.
g: $\vec a\cdot\vec b=2+0-3=-1$.
# Độ dài đoạn thẳng
p: $AB=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2+(z_B-z_A)^2}$.
d: Cho $A(1;2;3)$, $B(3;0;4)$. Tính $AB$.
g: $\vec{AB}=(2;-2;1)$.
g: $AB=\sqrt{4+4+1}=3$.
# Trung điểm, trọng tâm
p: Trung bình cộng toạ độ.
d: Cho $A(1;2;3)$, $B(3;0;4)$, $C(2;1;-1)$. Tìm trung điểm $I$ của $AB$ và trọng tâm $G$ của tam giác $ABC$.
g: $I\left(2;1;\dfrac72\right)$.
g: $G(2;1;2)$.
# Góc giữa hai vectơ
p: $\cos(\vec a,\vec b)=\dfrac{\vec a\cdot\vec b}{|\vec a||\vec b|}$.
d: Tính góc giữa $\vec a=(1;1;0)$ và $\vec b=(0;1;1)$.
g: $\vec a\cdot\vec b=1$, $|\vec a|=|\vec b|=\sqrt2$.
g: $\cos(\vec a,\vec b)=\dfrac12\Rightarrow(\vec a,\vec b)=60^\circ$.
# Điều kiện vuông góc
p: $\vec a\perp\vec b\Leftrightarrow xx'+yy'+zz'=0$.
d: Tìm $m$ để $\vec a=(m;1;2)$ vuông góc với $\vec b=(1;-3;m)$.
g: $m-3+2m=0$.
g: $m=1$.

@9
m: Khoảng biến thiên $R=u_{k+1}-u_1$ ;; $Q_1=u_m+\dfrac{\frac n4-C}{n_m}(u_{m+1}-u_m)$ ;; $Q_3$ tương tự với vị trí $\dfrac{3n}4$ ;; $\Delta_Q=Q_3-Q_1$: độ phân tán của nửa giữa số liệu
# Khoảng biến thiên của mẫu ghép nhóm
p: Lấy đầu mút trên của nhóm cuối (có tần số) trừ đầu mút dưới của nhóm đầu.
d: Thời gian (phút) dùng mạng xã hội của $40$ bạn: $[0;20)$: 5; $[20;40)$: 9; $[40;60)$: 12; $[60;80)$: 10; $[80;100)$: 4. Tìm khoảng biến thiên.
g: Đầu mút dưới nhóm đầu: $0$; đầu mút trên nhóm cuối: $100$.
g: $R=100$ phút.
# Tứ phân vị thứ nhất
p: Vị trí $\dfrac n4$; xác định nhóm nhờ tần số tích luỹ.
d: Tìm $Q_1$ của bảng trên.
g: Tần số tích luỹ: $5;14;26;36;40$; $\dfrac n4=10$ thuộc nhóm $[20;40)$, $C=5$, $n_m=9$.
g: $Q_1=20+\dfrac{10-5}9\cdot20\approx31{,}11$.
# Tứ phân vị thứ ba và khoảng tứ phân vị
p: Vị trí $\dfrac{3n}4$; $\Delta_Q=Q_3-Q_1$.
d: Tìm $Q_3$ và $\Delta_Q$ của bảng trên.
g: $\dfrac{3n}4=30$ thuộc nhóm $[60;80)$, $C=26$, $n_m=10$: $Q_3=60+\dfrac{30-26}{10}\cdot20=68$.
g: $\Delta_Q\approx68-31{,}11=36{,}89$ phút.
# Tính trọn vẹn cho một bảng khác
p: Lập tần số tích luỹ, xác định nhóm chứa $Q_1$, $Q_3$.
d: Điểm của $40$ học sinh: $[5;6)$: 3; $[6;7)$: 7; $[7;8)$: 15; $[8;9)$: 10; $[9;10)$: 5. Tìm $R$, $Q_1$, $Q_3$, $\Delta_Q$.
g: $R=10-5=5$; tần số tích luỹ $3;10;25;35;40$.
g: $Q_1=6+\dfrac{10-3}7\cdot1=7$; $Q_3=8+\dfrac{30-25}{10}\cdot1=8{,}5$; $\Delta_Q=1{,}5$.
# So sánh độ phân tán
p: Mẫu có $\Delta_Q$ nhỏ hơn thì nửa giữa số liệu tập trung hơn.
d: Lớp A có $\Delta_Q\approx36{,}9$ phút, lớp B có $\Delta_Q=25$ phút (thời gian dùng mạng xã hội). Lớp nào đồng đều hơn?
g: $\Delta_Q$ của lớp B nhỏ hơn.
g: Thời gian dùng mạng xã hội của lớp B đồng đều hơn.

@10
m: $\bar x=\dfrac1n\sum n_ic_i$ ($c_i$: giá trị đại diện) ;; $s^2=\dfrac1n\sum n_ic_i^2-\bar x^2$ ;; Độ lệch chuẩn $s=\sqrt{s^2}$ ;; $s$ càng lớn, số liệu càng phân tán (rủi ro càng cao)
# Số trung bình của mẫu ghép nhóm
p: Lấy giá trị đại diện của mỗi nhóm, nhân tần số, chia cho $n$.
d: Lợi nhuận (%) của một khoản đầu tư qua $10$ tháng: $[0;2)$: 2; $[2;4)$: 3; $[4;6)$: 3; $[6;8)$: 2. Tính số trung bình.
g: Giá trị đại diện $1;3;5;7$.
g: $\bar x=\dfrac{2+9+15+14}{10}=4$.
# Phương sai
p: $s^2=\dfrac1n\sum n_ic_i^2-\bar x^2$.
d: Tính phương sai của bảng trên.
g: $\sum n_ic_i^2=2\cdot1+3\cdot9+3\cdot25+2\cdot49=202$.
g: $s^2=\dfrac{202}{10}-16=4{,}2$.
# Độ lệch chuẩn
p: $s=\sqrt{s^2}$, cùng đơn vị với số liệu.
d: Tính độ lệch chuẩn của bảng trên.
g: $s=\sqrt{4{,}2}$.
g: $s\approx2{,}05$ (%).
# Tính cho bảng khác
p: Có thể tính $s^2=\dfrac1n\sum n_i(c_i-\bar x)^2$.
d: Chiều cao (cm) của $20$ cây: $[10;14)$: 5; $[14;18)$: 10; $[18;22)$: 5. Tính $\bar x$ và $s$.
g: Giá trị đại diện $12;16;20$: $\bar x=\dfrac{60+160+100}{20}=16$.
g: $s^2=\dfrac{5\cdot16+0+5\cdot16}{20}=8$, $s=2\sqrt2\approx2{,}83$ cm.
# So sánh mức độ rủi ro
p: Cùng trung bình, độ lệch chuẩn nhỏ hơn thì ổn định (ít rủi ro) hơn.
d: Hai khoản đầu tư có cùng lợi nhuận trung bình $4\%$; độ lệch chuẩn lần lượt $2{,}05\%$ và $3{,}1\%$. Khoản nào ít rủi ro hơn?
g: $2{,}05<3{,}1$.
g: Khoản đầu tư thứ nhất ít rủi ro hơn.

@11
m: $F$ là nguyên hàm của $f$ khi $F'(x)=f(x)$ ;; $\displaystyle\int x^\alpha dx=\dfrac{x^{\alpha+1}}{\alpha+1}+C$ $(\alpha\ne-1)$, $\displaystyle\int\dfrac1xdx=\ln|x|+C$ ;; $\displaystyle\int\sin x\,dx=-\cos x+C$, $\displaystyle\int\cos x\,dx=\sin x+C$ ;; $\displaystyle\int e^xdx=e^x+C$, $\displaystyle\int a^xdx=\dfrac{a^x}{\ln a}+C$
# Nguyên hàm của đa thức
p: Dùng tính chất tổng và công thức luỹ thừa.
d: Tìm $\displaystyle\int(3x^2-4x+1)\,dx$.
g: $=3\cdot\dfrac{x^3}3-4\cdot\dfrac{x^2}2+x+C$.
g: $=x^3-2x^2+x+C$.
# Luỹ thừa với số mũ hữu tỉ, số mũ âm
p: Viết căn, phân thức dưới dạng $x^\alpha$.
d: Tìm $\displaystyle\int\left(\sqrt x+\dfrac1{x^2}\right)dx$.
g: $=\displaystyle\int\left(x^{\frac12}+x^{-2}\right)dx=\dfrac23x^{\frac32}-x^{-1}+C$.
g: $=\dfrac23x\sqrt x-\dfrac1x+C$.
# Nguyên hàm lượng giác
p: Dùng bảng nguyên hàm cơ bản.
d: Tìm $\displaystyle\int(2\cos x-3\sin x)\,dx$.
g: $=2\sin x-3(-\cos x)+C$.
g: $=2\sin x+3\cos x+C$.
# Nguyên hàm hàm mũ
p: $\displaystyle\int e^xdx=e^x+C$; $\displaystyle\int a^xdx=\dfrac{a^x}{\ln a}+C$.
d: Tìm $\displaystyle\int(e^x+2^x)\,dx$.
g: $=e^x+\dfrac{2^x}{\ln2}+C$.
# Nguyên hàm thoả điều kiện cho trước
p: Tìm họ nguyên hàm rồi thay điều kiện để tìm $C$.
d: Tìm nguyên hàm $F$ của $f(x)=2x+1$ biết $F(1)=3$.
g: $F(x)=x^2+x+C$; $F(1)=2+C=3\Rightarrow C=1$.
g: $F(x)=x^2+x+1$.

@12
m: $\displaystyle\int_a^bf(x)\,dx=F(b)-F(a)$ ;; $\displaystyle\int_a^bf=\int_a^cf+\int_c^bf$ ;; $\displaystyle\int_a^b[kf\pm g]=k\int_a^bf\pm\int_a^bg$ ;; Quãng đường $s=\displaystyle\int_a^bv(t)\,dt$
# Tích phân hàm đa thức
p: Tìm một nguyên hàm rồi lấy hiệu giá trị tại cận trên và cận dưới.
d: Tính $\displaystyle\int_0^2(3x^2-2x)\,dx$.
g: $=\left[x^3-x^2\right]_0^2$.
g: $=8-4=4$.
# Tích phân hàm lượng giác, mũ
p: Dùng bảng nguyên hàm cơ bản.
d: Tính $\displaystyle\int_0^{\frac\pi2}\cos x\,dx$ và $\displaystyle\int_0^1e^xdx$.
g: $\left[\sin x\right]_0^{\frac\pi2}=1$.
g: $\left[e^x\right]_0^1=e-1$.
# Tính chất cộng đoạn
p: Tách hoặc gộp các đoạn lấy tích phân.
d: Biết $\displaystyle\int_0^3f(x)\,dx=5$, $\displaystyle\int_2^3f(x)\,dx=2$. Tính $\displaystyle\int_0^2f(x)\,dx$.
g: $\displaystyle\int_0^3f=\int_0^2f+\int_2^3f$.
g: $\displaystyle\int_0^2f=5-2=3$.
# Tích phân chứa dấu giá trị tuyệt đối
p: Xét dấu biểu thức để tách đoạn và bỏ trị tuyệt đối.
d: Tính $\displaystyle\int_0^2|x-1|\,dx$.
g: $=\displaystyle\int_0^1(1-x)\,dx+\int_1^2(x-1)\,dx$.
g: $=\dfrac12+\dfrac12=1$.
# Quãng đường từ vận tốc
p: Quãng đường vật đi được (vận tốc không âm) bằng tích phân của vận tốc.
d: Một vật chuyển động với vận tốc $v(t)=3t^2+2$ (m/s). Tính quãng đường vật đi trong $2$ giây đầu.
g: $s=\displaystyle\int_0^2(3t^2+2)\,dt=\left[t^3+2t\right]_0^2$.
g: $s=12$ m.

@13
m: Diện tích hình phẳng $S=\displaystyle\int_a^b|f(x)-g(x)|\,dx$ ;; Giới hạn bởi đồ thị và $Ox$: $S=\displaystyle\int_a^b|f(x)|\,dx$ ;; Thể tích vật thể $V=\displaystyle\int_a^bS(x)\,dx$ ;; Khối tròn xoay quanh $Ox$: $V=\pi\displaystyle\int_a^bf^2(x)\,dx$
# Diện tích giới hạn bởi đồ thị và trục hoành
p: Xét dấu $f$ trên đoạn để bỏ trị tuyệt đối.
d: Tính diện tích hình phẳng giới hạn bởi $y=x^2-2x$, trục $Ox$, $x=0$, $x=2$.
g: Trên $[0;2]$, $x^2-2x\le0$: $S=\displaystyle\int_0^2(2x-x^2)\,dx$.
g: $S=\left[x^2-\dfrac{x^3}3\right]_0^2=\dfrac43$.
# Diện tích giữa hai đồ thị
p: Tìm hoành độ giao điểm làm cận, xét hàm nào nằm trên.
d: Tính diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.
g: Giao điểm $x=0$, $x=1$; trên $[0;1]$ có $x\ge x^2$.
g: $S=\displaystyle\int_0^1(x-x^2)\,dx=\dfrac12-\dfrac13=\dfrac16$.
# Thể tích khối tròn xoay
p: $V=\pi\displaystyle\int_a^bf^2(x)\,dx$.
d: Tính thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi $y=\sqrt x$, $Ox$, $x=4$ quanh $Ox$.
g: $V=\pi\displaystyle\int_0^4x\,dx$.
g: $V=\pi\left[\dfrac{x^2}2\right]_0^4=8\pi$.
# Thể tích theo diện tích thiết diện
p: $V=\displaystyle\int_a^bS(x)\,dx$ với $S(x)$ là diện tích thiết diện vuông góc $Ox$.
d: Một vật thể nằm giữa hai mặt phẳng $x=0$, $x=3$; thiết diện vuông góc với $Ox$ tại $x$ là hình vuông cạnh $x$. Tính thể tích.
g: $S(x)=x^2$.
g: $V=\displaystyle\int_0^3x^2\,dx=9$.
# Thể tích khối cầu
p: Quay nửa hình tròn quanh trục chứa đường kính.
d: Chứng minh thể tích khối cầu bán kính $R$ là $\dfrac43\pi R^3$.
g: Quay $y=\sqrt{R^2-x^2}$, $-R\le x\le R$ quanh $Ox$: $V=\pi\displaystyle\int_{-R}^R(R^2-x^2)\,dx$.
g: $V=\pi\left[R^2x-\dfrac{x^3}3\right]_{-R}^R=\dfrac43\pi R^3$.

@14
m: Qua $M_0$, VTPT $\vec n=(A;B;C)$: $A(x-x_0)+B(y-y_0)+C(z-z_0)=0$ ;; Cặp VTCP $\vec u,\vec v$: $\vec n=[\vec u,\vec v]$ ;; Đoạn chắn: $\dfrac xa+\dfrac yb+\dfrac zc=1$ ;; $d(M,(P))=\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}$
# Mặt phẳng qua một điểm, biết VTPT
p: $A(x-x_0)+B(y-y_0)+C(z-z_0)=0$.
d: Viết phương trình mặt phẳng qua $M(1;-2;3)$ có VTPT $\vec n=(2;1;-1)$.
g: $2(x-1)+(y+2)-(z-3)=0$.
g: $2x+y-z+3=0$.
# Phương trình theo đoạn chắn
p: Mặt phẳng cắt ba trục tại $(a;0;0)$, $(0;b;0)$, $(0;0;c)$.
d: Viết phương trình mặt phẳng qua $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$.
g: $\dfrac x1+\dfrac y2+\dfrac z3=1$.
g: $6x+3y+2z-6=0$.
# Mặt phẳng qua ba điểm
p: VTPT là tích có hướng của hai vectơ $\vec{AB}$, $\vec{AC}$.
d: Viết phương trình mặt phẳng qua $A(1;1;1)$, $B(2;0;1)$, $C(1;2;3)$.
g: $\vec{AB}=(1;-1;0)$, $\vec{AC}=(0;1;2)$; $[\vec{AB},\vec{AC}]=(-2;-2;1)$.
g: $-2(x-1)-2(y-1)+(z-1)=0\Leftrightarrow2x+2y-z-3=0$.
# Mặt phẳng song song với mặt phẳng cho trước
p: Dùng lại VTPT của mặt phẳng đã cho.
d: Viết phương trình mặt phẳng qua $M(1;2;-1)$ và song song với $(P): 2x-y+3z+5=0$.
g: VTPT $\vec n=(2;-1;3)$: $2(x-1)-(y-2)+3(z+1)=0$.
g: $2x-y+3z+3=0$.
# Khoảng cách từ điểm đến mặt phẳng
p: Thay toạ độ điểm vào công thức.
d: Tính khoảng cách từ $M(1;2;3)$ đến $(P): 2x-2y+z+4=0$.
g: $d=\dfrac{|2-4+3+4|}{\sqrt{4+4+1}}$.
g: $d=\dfrac53$.

@15
m: Tham số: $x=x_0+at$, $y=y_0+bt$, $z=z_0+ct$ ;; Chính tắc: $\dfrac{x-x_0}a=\dfrac{y-y_0}b=\dfrac{z-z_0}c$ $(abc\ne0)$ ;; Đường vuông góc mặt phẳng: VTCP là VTPT ;; Vị trí tương đối: xét VTCP và một điểm
# Phương trình tham số, chính tắc
p: Biết điểm và VTCP, viết trực tiếp.
d: Viết phương trình đường thẳng qua $A(1;2;-1)$ có VTCP $\vec u=(2;-1;3)$.
g: Tham số: $x=1+2t$, $y=2-t$, $z=-1+3t$.
g: Chính tắc: $\dfrac{x-1}2=\dfrac{y-2}{-1}=\dfrac{z+1}3$.
# Đường thẳng qua hai điểm
p: VTCP $\vec u=\vec{AB}$.
d: Viết phương trình đường thẳng qua $A(1;0;2)$, $B(3;1;0)$.
g: $\vec u=\vec{AB}=(2;1;-2)$.
g: $x=1+2t$, $y=t$, $z=2-2t$.
# Đường thẳng vuông góc với mặt phẳng
p: VTCP của đường là VTPT của mặt phẳng.
d: Viết phương trình đường thẳng qua $M(1;-1;2)$ vuông góc với $(P): x-2y+2z-1=0$.
g: $\vec u=(1;-2;2)$.
g: $x=1+t$, $y=-1-2t$, $z=2+2t$.
# Giao điểm của đường thẳng và mặt phẳng
p: Thay $x,y,z$ theo $t$ vào phương trình mặt phẳng, giải $t$.
d: Tìm giao điểm của $d: x=1+t$, $y=2-t$, $z=3+2t$ với $(P): x+y+z-8=0$.
g: $(1+t)+(2-t)+(3+2t)-8=0\Rightarrow t=1$.
g: Giao điểm $(2;1;5)$.
# Vị trí tương đối của hai đường thẳng
p: VTCP cùng phương: kiểm tra một điểm của đường này có thuộc đường kia (trùng hay song song).
d: Xét vị trí tương đối của $d_1: x=1+t$, $y=2t$, $z=3-t$ và $d_2: x=2+2s$, $y=1+4s$, $z=1-2s$.
g: $\vec{u_2}=(2;4;-2)=2\vec{u_1}$: cùng phương.
g: $M(1;0;3)\in d_1$: từ $x$ có $s=-\dfrac12$, khi đó $y=-1\ne0$ nên $M\notin d_2$. Vậy $d_1\parallel d_2$.

@16
m: $\cos(d_1,d_2)=\dfrac{|\vec{u_1}\cdot\vec{u_2}|}{|\vec{u_1}||\vec{u_2}|}$ ;; $\sin(d,(P))=\dfrac{|\vec u\cdot\vec n|}{|\vec u||\vec n|}$ ;; $\cos((P),(Q))=\dfrac{|\vec{n_1}\cdot\vec{n_2}|}{|\vec{n_1}||\vec{n_2}|}$ ;; Các góc nằm trong $[0^\circ;90^\circ]$
# Góc giữa hai đường thẳng
p: Dùng hai VTCP.
d: Tính góc giữa hai đường thẳng có VTCP $\vec{u_1}=(1;1;0)$, $\vec{u_2}=(1;0;1)$.
g: $\cos\varphi=\dfrac{|1|}{\sqrt2\cdot\sqrt2}=\dfrac12$.
g: $\varphi=60^\circ$.
# Góc giữa đường thẳng và mặt phẳng
p: Dùng $\sin$ với VTCP và VTPT.
d: Tính góc giữa đường thẳng có VTCP $\vec u=(1;0;1)$ và mặt phẳng $(Oxy)$.
g: $(Oxy)$ có VTPT $\vec k=(0;0;1)$: $\sin\varphi=\dfrac1{\sqrt2}$.
g: $\varphi=45^\circ$.
# Góc giữa hai mặt phẳng
p: Dùng hai VTPT.
d: Tính góc giữa $(P): x+y-1=0$ và $(Q): y+z=0$.
g: $\vec{n_1}=(1;1;0)$, $\vec{n_2}=(0;1;1)$: $\cos\varphi=\dfrac12$.
g: $\varphi=60^\circ$.
# Hai mặt phẳng vuông góc – tìm tham số
p: $(P)\perp(Q)\Leftrightarrow\vec{n_1}\cdot\vec{n_2}=0$.
d: Tìm $m$ để $(P): x+my+z-1=0$ vuông góc với $(Q): 2x-y+z=0$.
g: $2-m+1=0$.
g: $m=3$.
# Góc nghiêng thực tế
p: Mặt đất là mặt phẳng $(Oxy)$; góc nghiêng là góc giữa hai mặt phẳng.
d: Một mái nhà nằm trong mặt phẳng $x+z-4=0$ (mặt đất là $(Oxy)$). Tính góc nghiêng của mái.
g: $\vec n=(1;0;1)$, $\vec k=(0;0;1)$: $\cos\varphi=\dfrac1{\sqrt2}$.
g: Mái nghiêng $45^\circ$.

@17
m: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$: tâm $I(a;b;c)$ ;; $x^2+y^2+z^2-2ax-2by-2cz+d=0$, $R=\sqrt{a^2+b^2+c^2-d}$ ;; Tiếp xúc $(P)$: $d(I,(P))=R$ ;; Mặt phẳng cắt mặt cầu theo đường tròn bán kính $r=\sqrt{R^2-d^2}$
# Xác định tâm, bán kính
p: Đọc $a,b,c,d$ từ dạng khai triển.
d: Tìm tâm, bán kính của $x^2+y^2+z^2-2x+4y-6z-2=0$.
g: Tâm $I(1;-2;3)$.
g: $R=\sqrt{1+4+9+2}=4$.
# Mặt cầu biết tâm, đi qua một điểm
p: $R=IA$.
d: Viết phương trình mặt cầu tâm $I(1;2;-1)$ đi qua $A(3;0;0)$.
g: $R^2=IA^2=4+4+1=9$.
g: $(x-1)^2+(y-2)^2+(z+1)^2=9$.
# Mặt cầu đường kính $AB$
p: Tâm là trung điểm $AB$, $R=\dfrac{AB}2$.
d: Viết phương trình mặt cầu đường kính $AB$ với $A(1;2;3)$, $B(3;4;-1)$.
g: $I(2;3;1)$, $R^2=IA^2=1+1+4=6$.
g: $(x-2)^2+(y-3)^2+(z-1)^2=6$.
# Mặt cầu tiếp xúc mặt phẳng
p: $R=d(I,(P))$.
d: Viết phương trình mặt cầu tâm $I(1;-1;2)$ tiếp xúc với $(P): 2x+2y-z+11=0$.
g: $R=\dfrac{|2-2-2+11|}3=3$.
g: $(x-1)^2+(y+1)^2+(z-2)^2=9$.
# Giao tuyến của mặt phẳng và mặt cầu
p: $r=\sqrt{R^2-d^2}$ với $d=d(I,(P))<R$.
d: Mặt cầu tâm $O$, bán kính $5$ bị mặt phẳng $z=3$ cắt theo đường tròn. Tính bán kính đường tròn.
g: $d(O,(P))=3<5$.
g: $r=\sqrt{25-9}=4$.

@18
m: $P(A\mid B)=\dfrac{P(AB)}{P(B)}$ $(P(B)>0)$ ;; Công thức nhân: $P(AB)=P(B)\cdot P(A\mid B)$ ;; Lấy không hoàn lại: xác suất lần sau phụ thuộc lần trước ;; Sơ đồ hình cây
# Xác suất có điều kiện từ bảng số liệu
p: Thu hẹp không gian mẫu về nhóm đã biết.
d: Lớp $40$ bạn: $25$ nam ($15$ thích Toán), $15$ nữ ($9$ thích Toán). Chọn ngẫu nhiên một bạn, biết là nữ. Tính xác suất bạn đó thích Toán.
g: Chỉ xét $15$ bạn nữ, trong đó $9$ bạn thích Toán.
g: $P=\dfrac9{15}=\dfrac35$.
# Dùng công thức
p: $P(A\mid B)=\dfrac{P(AB)}{P(B)}$.
d: Cho $P(A)=0{,}6$, $P(B)=0{,}5$, $P(AB)=0{,}2$. Tính $P(A\mid B)$ và $P(B\mid A)$.
g: $P(A\mid B)=\dfrac{0{,}2}{0{,}5}=0{,}4$.
g: $P(B\mid A)=\dfrac{0{,}2}{0{,}6}=\dfrac13$.
# Lấy lần lượt không hoàn lại
p: Sau lần đầu, số lượng trong hộp thay đổi.
d: Hộp có $4$ bi đỏ, $6$ bi xanh. Lấy lần lượt hai bi không hoàn lại. Biết lần đầu được bi đỏ, tính xác suất lần hai cũng được bi đỏ.
g: Sau lần đầu còn $3$ đỏ, $6$ xanh.
g: $P=\dfrac39=\dfrac13$.
# Công thức nhân xác suất
p: $P(AB)=P(A)\cdot P(B\mid A)$.
d: Với hộp bi trên, tính xác suất cả hai bi lấy ra đều đỏ.
g: $P=\dfrac4{10}\cdot\dfrac39$.
g: $P=\dfrac2{15}$.
# Thu hẹp không gian mẫu khi gieo xúc xắc
p: Liệt kê các kết quả của biến cố điều kiện.
d: Gieo hai xúc xắc, biết tổng số chấm bằng $8$. Tính xác suất có ít nhất một mặt $6$.
g: Tổng bằng $8$: $(2;6),(3;5),(4;4),(5;3),(6;2)$ — $5$ kết quả.
g: Có mặt $6$: $2$ kết quả. $P=\dfrac25$.

@19
m: Toàn phần: $P(A)=P(B)P(A\mid B)+P(\overline B)P(A\mid\overline B)$ ;; Bayes: $P(B\mid A)=\dfrac{P(B)P(A\mid B)}{P(A)}$ ;; Vẽ sơ đồ cây: nhánh nguyên nhân rồi nhánh kết quả ;; Ứng dụng: kiểm định chất lượng, xét nghiệm y tế
# Công thức xác suất toàn phần
p: Chia theo các nguyên nhân (máy, hộp, nhóm) rồi cộng các nhánh.
d: Máy I làm $60\%$ sản phẩm với tỉ lệ lỗi $2\%$; máy II làm $40\%$ với tỉ lệ lỗi $3\%$. Lấy ngẫu nhiên một sản phẩm. Tính xác suất sản phẩm bị lỗi.
g: $P(L)=0{,}6\cdot0{,}02+0{,}4\cdot0{,}03$.
g: $P(L)=0{,}012+0{,}012=0{,}024$.
# Công thức Bayes
p: Xác suất nguyên nhân khi đã biết kết quả.
d: Với dữ kiện trên, biết sản phẩm bị lỗi. Tính xác suất nó do máy I làm.
g: $P(I\mid L)=\dfrac{0{,}6\cdot0{,}02}{0{,}024}$.
g: $=0{,}5$.
# Bài toán xét nghiệm
p: Lập sơ đồ cây với tỉ lệ mắc bệnh, độ nhạy, tỉ lệ dương tính giả.
d: Tỉ lệ mắc một bệnh là $1\%$. Xét nghiệm cho dương tính với $99\%$ người bệnh và $5\%$ người không bệnh. Một người có kết quả dương tính; tính xác suất người đó thật sự mắc bệnh.
g: $P(+)=0{,}01\cdot0{,}99+0{,}99\cdot0{,}05=0{,}0594$.
g: $P(\text{bệnh}\mid+)=\dfrac{0{,}0099}{0{,}0594}\approx0{,}167$.
# Chọn hộp rồi lấy bi
p: Nhánh 1: chọn hộp; nhánh 2: lấy bi.
d: Hộp I có $3$ đỏ, $2$ xanh; hộp II có $1$ đỏ, $4$ xanh. Chọn ngẫu nhiên một hộp rồi lấy một bi. Tính xác suất được bi đỏ.
g: $P(\text{Đ})=\dfrac12\cdot\dfrac35+\dfrac12\cdot\dfrac15$.
g: $P(\text{Đ})=\dfrac25$.
# Bayes với bài toán hai hộp
p: Chia xác suất nhánh tương ứng cho xác suất toàn phần.
d: Với dữ kiện trên, biết lấy được bi đỏ. Tính xác suất bi đó từ hộp I.
g: $P(I\mid \text{Đ})=\dfrac{\frac12\cdot\frac35}{\frac25}$.
g: $=\dfrac34$.
`;
