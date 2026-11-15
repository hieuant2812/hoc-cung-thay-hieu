/* Sổ tay theo bài – Toán 11 (KNTT): ý chính cho sơ đồ tư duy và 5 dạng bài tập tiêu biểu có giải mẫu. */
(window.SOTAYBAI = window.SOTAYBAI || {})[11] = String.raw`
@1
m: $\pi\text{ rad}=180^\circ$; độ dài cung $l=R\alpha$ ;; Đường tròn lượng giác: $\cos\alpha=x_M$, $\sin\alpha=y_M$ ;; Dấu GTLG theo góc phần tư ;; $\sin^2\alpha+\cos^2\alpha=1$, $1+\tan^2\alpha=\dfrac1{\cos^2\alpha}$
# Đổi đơn vị độ – radian
p: $a^\circ=\dfrac{a\pi}{180}$ rad; $\alpha$ rad $=\left(\dfrac{180\alpha}\pi\right)^\circ$.
d: Đổi $135^\circ$ sang radian và $\dfrac{5\pi}6$ sang độ.
g: $135^\circ=\dfrac{135\pi}{180}=\dfrac{3\pi}4$.
g: $\dfrac{5\pi}6=\dfrac{5\cdot180^\circ}6=150^\circ$.
# Độ dài cung tròn
p: Cung có số đo $\alpha$ (rad) trên đường tròn bán kính $R$: $l=R\alpha$.
d: Tính độ dài cung có số đo $60^\circ$ trên đường tròn bán kính $10$ cm.
g: $60^\circ=\dfrac\pi3$ rad.
g: $l=10\cdot\dfrac\pi3\approx10{,}47$ cm.
# Xét dấu giá trị lượng giác
p: Xác định điểm biểu diễn thuộc góc phần tư nào: I $(+,+)$, II $(\sin+,\cos-)$, III $(-,-)$, IV $(\sin-,\cos+)$.
d: Cho $\pi<\alpha<\dfrac{3\pi}2$. Xét dấu $\sin\alpha$, $\cos\alpha$, $\tan\alpha$.
g: Điểm biểu diễn thuộc góc phần tư thứ III.
g: $\sin\alpha<0$, $\cos\alpha<0$, $\tan\alpha>0$.
# Biết một giá trị lượng giác, tính các giá trị còn lại
p: Dùng hằng đẳng thức lượng giác cơ bản, chọn dấu theo góc phần tư.
d: Cho $\sin\alpha=-\dfrac45$, $\pi<\alpha<\dfrac{3\pi}2$. Tính $\cos\alpha$, $\tan\alpha$, $\cot\alpha$.
g: $\cos^2\alpha=1-\dfrac{16}{25}=\dfrac9{25}$; góc phần tư III nên $\cos\alpha=-\dfrac35$.
g: $\tan\alpha=\dfrac43$, $\cot\alpha=\dfrac34$.
# Góc có liên quan đặc biệt
p: Bớt bội của $2\pi$ (hoặc $\pi$), dùng các cặp góc đối, bù, phụ, hơn kém $\pi$.
d: Tính $\sin\dfrac{31\pi}6$ và rút gọn $A=\sin(\pi-x)+\cos\left(\dfrac\pi2-x\right)+\sin(-x)$.
g: $\dfrac{31\pi}6=4\pi+\pi+\dfrac\pi6$ nên $\sin\dfrac{31\pi}6=-\sin\dfrac\pi6=-\dfrac12$.
g: $A=\sin x+\sin x-\sin x=\sin x$.

@2
m: Cộng: $\cos(a-b)=\cos a\cos b+\sin a\sin b$, $\sin(a+b)=\sin a\cos b+\cos a\sin b$ ;; Nhân đôi: $\sin2a=2\sin a\cos a$, $\cos2a=2\cos^2a-1=1-2\sin^2a$ ;; Tích thành tổng: $\cos a\cos b=\dfrac12[\cos(a-b)+\cos(a+b)]$ ;; Tổng thành tích: $\sin a+\sin b=2\sin\dfrac{a+b}2\cos\dfrac{a-b}2$
# Công thức cộng
p: Viết góc cần tính thành tổng/hiệu của hai góc đặc biệt.
d: Tính $\cos15^\circ$.
g: $\cos15^\circ=\cos(45^\circ-30^\circ)=\cos45^\circ\cos30^\circ+\sin45^\circ\sin30^\circ$.
g: $=\dfrac{\sqrt2}2\cdot\dfrac{\sqrt3}2+\dfrac{\sqrt2}2\cdot\dfrac12=\dfrac{\sqrt6+\sqrt2}4$.
# Công thức nhân đôi
p: Tính $\sin\alpha$, $\cos\alpha$ trước, rồi dùng $\sin2\alpha$, $\cos2\alpha$.
d: Cho $\sin\alpha=\dfrac35$, $0<\alpha<\dfrac\pi2$. Tính $\sin2\alpha$, $\cos2\alpha$.
g: $\cos\alpha=\dfrac45$; $\sin2\alpha=2\cdot\dfrac35\cdot\dfrac45=\dfrac{24}{25}$.
g: $\cos2\alpha=1-2\sin^2\alpha=1-\dfrac{18}{25}=\dfrac7{25}$.
# Công thức hạ bậc
p: $\cos^2a=\dfrac{1+\cos2a}2$, $\sin^2a=\dfrac{1-\cos2a}2$.
d: Tính $\cos^2\dfrac\pi8$.
g: $\cos^2\dfrac\pi8=\dfrac{1+\cos\frac\pi4}2$.
g: $=\dfrac{2+\sqrt2}4$.
# Biến đổi tích thành tổng
p: $\cos a\cos b=\dfrac12[\cos(a-b)+\cos(a+b)]$, tương tự với $\sin a\sin b$, $\sin a\cos b$.
d: Tính $\cos75^\circ\cos15^\circ$.
g: $=\dfrac12(\cos60^\circ+\cos90^\circ)$.
g: $=\dfrac12\cdot\dfrac12=\dfrac14$.
# Biến đổi tổng thành tích – rút gọn
p: Ghép cặp các số hạng, áp dụng công thức tổng thành tích rồi rút nhân tử chung.
d: Rút gọn $A=\dfrac{\sin x+\sin3x}{\cos x+\cos3x}$.
g: Tử: $2\sin2x\cos x$; mẫu: $2\cos2x\cos x$.
g: $A=\dfrac{\sin2x}{\cos2x}=\tan2x$.

@3
m: $y=\sin x$, $y=\cos x$: $D=\mathbb R$, tập giá trị $[-1;1]$, chu kì $2\pi$ ;; $y=\tan x$: $x\ne\dfrac\pi2+k\pi$; $y=\cot x$: $x\ne k\pi$; chu kì $\pi$ ;; $\cos x$ là hàm chẵn; $\sin x$, $\tan x$, $\cot x$ là hàm lẻ ;; $y=\sin(ax+b)$ có chu kì $\dfrac{2\pi}{|a|}$
# Tìm tập xác định
p: $\tan u$ cần $u\ne\dfrac\pi2+k\pi$; $\cot u$ cần $u\ne k\pi$; mẫu khác $0$.
d: Tìm tập xác định của $y=\tan\left(2x-\dfrac\pi3\right)$.
g: Điều kiện $2x-\dfrac\pi3\ne\dfrac\pi2+k\pi\Leftrightarrow x\ne\dfrac{5\pi}{12}+\dfrac{k\pi}2$.
g: $D=\mathbb R\setminus\left\{\dfrac{5\pi}{12}+\dfrac{k\pi}2\mid k\in\mathbb Z\right\}$.
# Xét tính chẵn, lẻ
p: Kiểm tra tập xác định đối xứng, so sánh $f(-x)$ với $f(x)$.
d: Xét tính chẵn lẻ của $f(x)=x\sin x$ và $g(x)=\sin x+\tan x$.
g: $f(-x)=(-x)\sin(-x)=x\sin x=f(x)$: $f$ là hàm chẵn.
g: $g(-x)=-\sin x-\tan x=-g(x)$: $g$ là hàm lẻ.
# Tìm chu kì
p: $\sin(ax+b)$, $\cos(ax+b)$: $T=\dfrac{2\pi}{|a|}$; $\tan(ax+b)$, $\cot(ax+b)$: $T=\dfrac\pi{|a|}$.
d: Tìm chu kì của $y=\sin3x$ và $y=\tan\dfrac x2$.
g: $y=\sin3x$: $T=\dfrac{2\pi}3$.
g: $y=\tan\dfrac x2$: $T=\dfrac{\pi}{1/2}=2\pi$.
# Giá trị lớn nhất, nhỏ nhất
p: Dùng $-1\le\sin u,\cos u\le1$ rồi biến đổi bất đẳng thức.
d: Tìm GTLN, GTNN của $y=3-2\cos x$.
g: $-1\le\cos x\le1\Rightarrow1\le3-2\cos x\le5$.
g: GTNN bằng $1$ khi $x=k2\pi$; GTLN bằng $5$ khi $x=\pi+k2\pi$.
# Mô hình lượng giác thực tế
p: Dùng tập giá trị của sin, cos để tìm lớn nhất, nhỏ nhất và thời điểm đạt được.
d: Mực nước ở một cảng: $h(t)=3\cos\dfrac{\pi t}6+12$ (m), $0\le t\le24$ (giờ). Khi nào nước cao nhất, thấp nhất?
g: $h$ lớn nhất bằng $15$ m khi $\cos\dfrac{\pi t}6=1$: $t=0;12;24$.
g: $h$ nhỏ nhất bằng $9$ m khi $\cos\dfrac{\pi t}6=-1$: $t=6;18$.

@4
m: $\sin x=\sin\alpha\Leftrightarrow x=\alpha+k2\pi$ hoặc $x=\pi-\alpha+k2\pi$ ;; $\cos x=\cos\alpha\Leftrightarrow x=\pm\alpha+k2\pi$ ;; $\tan x=\tan\alpha\Leftrightarrow x=\alpha+k\pi$ ;; $\sin u=\cos v\Leftrightarrow\sin u=\sin\left(\dfrac\pi2-v\right)$
# Phương trình $\sin x=m$
p: Viết $m=\sin\alpha$ với góc đặc biệt, áp dụng công thức nghiệm.
d: Giải $\sin x=\dfrac12$.
g: $\sin x=\sin\dfrac\pi6$.
g: $x=\dfrac\pi6+k2\pi$ hoặc $x=\dfrac{5\pi}6+k2\pi$ $(k\in\mathbb Z)$.
# Phương trình $\cos u=m$
p: $\cos u=\cos\alpha\Leftrightarrow u=\pm\alpha+k2\pi$, sau đó giải ra $x$.
d: Giải $\cos\left(2x-\dfrac\pi3\right)=-\dfrac{\sqrt2}2$.
g: $2x-\dfrac\pi3=\pm\dfrac{3\pi}4+k2\pi$.
g: $x=\dfrac{13\pi}{24}+k\pi$ hoặc $x=-\dfrac{5\pi}{24}+k\pi$.
# Phương trình $\tan u=m$
p: $\tan u=\tan\alpha\Leftrightarrow u=\alpha+k\pi$.
d: Giải $\tan\left(x+\dfrac\pi6\right)=\sqrt3$.
g: $x+\dfrac\pi6=\dfrac\pi3+k\pi$.
g: $x=\dfrac\pi6+k\pi$.
# Đưa về cùng một hàm lượng giác
p: Dùng góc phụ: $\cos v=\sin\left(\dfrac\pi2-v\right)$.
d: Giải $\sin2x=\cos x$.
g: $\sin2x=\sin\left(\dfrac\pi2-x\right)$.
g: $2x=\dfrac\pi2-x+k2\pi\Rightarrow x=\dfrac\pi6+\dfrac{k2\pi}3$; hoặc $2x=\dfrac\pi2+x+k2\pi\Rightarrow x=\dfrac\pi2+k2\pi$.
# Nghiệm thuộc khoảng, đoạn cho trước
p: Viết họ nghiệm, cho thuộc đoạn để tìm các giá trị nguyên của $k$.
d: Tìm các nghiệm của $\cos2x=0$ thuộc $[0;\pi]$.
g: $2x=\dfrac\pi2+k\pi\Rightarrow x=\dfrac\pi4+\dfrac{k\pi}2$.
g: $0\le\dfrac\pi4+\dfrac{k\pi}2\le\pi\Rightarrow k\in\{0;1\}$: $x=\dfrac\pi4$, $x=\dfrac{3\pi}4$.

@5
m: Dãy số: hàm $u:\mathbb N^*\to\mathbb R$ ;; Cho bằng công thức tổng quát hoặc hệ thức truy hồi ;; Tăng: $u_{n+1}>u_n$; giảm: $u_{n+1}<u_n$ ;; Bị chặn: $m\le u_n\le M$
# Tìm số hạng từ công thức tổng quát
p: Thay $n$ vào công thức.
d: Cho $u_n=\dfrac{n+1}{2n-1}$. Tính $u_1$, $u_2$, $u_5$.
g: $u_1=2$, $u_2=\dfrac33=1$.
g: $u_5=\dfrac69=\dfrac23$.
# Dãy cho bởi hệ thức truy hồi
p: Tính lần lượt từng số hạng từ số hạng trước.
d: Cho $u_1=2$, $u_{n+1}=2u_n-1$. Tính $u_2,\dots,u_5$ và dự đoán $u_n$.
g: $u_2=3$, $u_3=5$, $u_4=9$, $u_5=17$.
g: Dự đoán $u_n=2^{n-1}+1$.
# Dự đoán công thức tổng quát
p: Quan sát quy luật tử, mẫu, dấu theo $n$.
d: Tìm công thức số hạng tổng quát của dãy $\dfrac12;\dfrac23;\dfrac34;\dfrac45;\dots$
g: Tử là $n$, mẫu là $n+1$.
g: $u_n=\dfrac n{n+1}$.
# Xét tính tăng, giảm
p: Xét dấu $u_{n+1}-u_n$ (hoặc so sánh $\dfrac{u_{n+1}}{u_n}$ với $1$ khi $u_n>0$).
d: Xét tính tăng, giảm của $u_n=\dfrac{2n+1}{n+1}$.
g: $u_{n+1}-u_n=\dfrac{2n+3}{n+2}-\dfrac{2n+1}{n+1}=\dfrac{1}{(n+1)(n+2)}>0$.
g: Dãy số tăng.
# Xét tính bị chặn
p: Biến đổi $u_n$ để đánh giá trên, dưới.
d: Chứng minh $u_n=\dfrac{2n+1}{n+1}$ bị chặn.
g: $u_n=2-\dfrac1{n+1}<2$.
g: Dãy tăng nên $u_n\ge u_1=\dfrac32$. Vậy $\dfrac32\le u_n<2$: dãy bị chặn.

@6
m: $u_{n+1}=u_n+d$ ;; $u_n=u_1+(n-1)d$ ;; $S_n=\dfrac{n(u_1+u_n)}2=\dfrac{n[2u_1+(n-1)d]}2$ ;; $u_k=\dfrac{u_{k-1}+u_{k+1}}2$
# Nhận biết cấp số cộng
p: Chứng minh $u_{n+1}-u_n$ là hằng số.
d: Dãy $u_n=3n-2$ có phải cấp số cộng không? Tìm $u_1$ và $d$.
g: $u_{n+1}-u_n=3(n+1)-2-(3n-2)=3$ không đổi.
g: Là cấp số cộng với $u_1=1$, $d=3$.
# Tìm $u_1$, $d$ từ hai số hạng
p: Viết các số hạng theo $u_1$, $d$, giải hệ.
d: Cấp số cộng có $u_3=7$, $u_7=19$. Tìm $u_1$, $d$, $u_{10}$.
g: $u_7-u_3=4d=12\Rightarrow d=3$; $u_1=7-2\cdot3=1$.
g: $u_{10}=1+9\cdot3=28$.
# Tính tổng $n$ số hạng đầu
p: $S_n=\dfrac{n[2u_1+(n-1)d]}2$.
d: Tính tổng $20$ số hạng đầu của cấp số cộng $u_1=1$, $d=3$.
g: $S_{20}=\dfrac{20(2+19\cdot3)}2$.
g: $S_{20}=10\cdot59=590$.
# Ba số lập thành cấp số cộng
p: Đặt ba số là $a-d$, $a$, $a+d$.
d: Tìm ba số lập thành cấp số cộng có tổng $15$ và tích $80$.
g: Tổng: $3a=15\Rightarrow a=5$. Tích: $5(25-d^2)=80\Rightarrow d^2=9\Rightarrow d=\pm3$.
g: Ba số là $2;5;8$ (hoặc $8;5;2$).
# Bài toán thực tế
p: Nhận ra đại lượng tăng đều một lượng không đổi rồi dùng $u_n$, $S_n$.
d: Hội trường có $15$ hàng ghế; hàng đầu $20$ ghế, mỗi hàng sau hơn hàng trước $2$ ghế. Hội trường có bao nhiêu ghế?
g: $u_1=20$, $d=2$, $u_{15}=20+14\cdot2=48$.
g: $S_{15}=\dfrac{15(20+48)}2=510$ ghế.

@7
m: $u_{n+1}=u_n\cdot q$ ;; $u_n=u_1q^{n-1}$ ;; $S_n=u_1\dfrac{1-q^n}{1-q}$ $(q\ne1)$ ;; $u_k^2=u_{k-1}u_{k+1}$
# Nhận biết cấp số nhân
p: Chứng minh $\dfrac{u_{n+1}}{u_n}$ là hằng số (với $u_n\ne0$).
d: Dãy $u_n=3\cdot2^n$ có phải cấp số nhân không?
g: $\dfrac{u_{n+1}}{u_n}=\dfrac{3\cdot2^{n+1}}{3\cdot2^n}=2$.
g: Là cấp số nhân với $u_1=6$, $q=2$.
# Tìm $u_1$, $q$
p: Lập tỉ số hai số hạng để khử $u_1$.
d: Cấp số nhân có $u_2=6$, $u_5=48$. Tìm $u_1$, $q$, $u_7$.
g: $\dfrac{u_5}{u_2}=q^3=8\Rightarrow q=2$, $u_1=3$.
g: $u_7=3\cdot2^6=192$.
# Tổng $n$ số hạng đầu
p: $S_n=u_1\dfrac{q^n-1}{q-1}$.
d: Tính tổng $6$ số hạng đầu của cấp số nhân $u_1=3$, $q=2$.
g: $S_6=3\cdot\dfrac{2^6-1}{2-1}$.
g: $S_6=189$.
# Ba số lập thành cấp số nhân
p: $a$, $b$, $c$ lập cấp số nhân $\Leftrightarrow b^2=ac$.
d: Tìm $x$ để $2$, $x$, $18$ lập thành cấp số nhân.
g: $x^2=2\cdot18=36$.
g: $x=6$ hoặc $x=-6$.
# Lãi kép
p: Sau mỗi kì số tiền nhân với $(1+r)$: $T_n=T_0(1+r)^n$.
d: Gửi $100$ triệu đồng, lãi kép $6\%$/năm. Sau $5$ năm có bao nhiêu tiền?
g: $T_5=100\cdot1{,}06^5$.
g: $T_5\approx133{,}82$ triệu đồng.

@8
m: Nhóm $[a;b)$, độ dài nhóm $b-a$ ;; Giá trị đại diện $c=\dfrac{a+b}2$ ;; Tần số, tần số tích luỹ ;; Ghép nhóm: chia khoảng giá trị thành các nhóm đều
# Đọc bảng ghép nhóm
p: Xác định cỡ mẫu (tổng tần số), nhóm có tần số lớn nhất.
d: Chiều cao (cm) của $40$ học sinh: $[150;155)$: 5; $[155;160)$: 12; $[160;165)$: 15; $[165;170)$: 8. Nhóm nào nhiều học sinh nhất?
g: Cỡ mẫu $n=5+12+15+8=40$.
g: Nhóm $[160;165)$ có tần số lớn nhất ($15$ học sinh).
# Giá trị đại diện
p: Giá trị đại diện là trung điểm của nhóm.
d: Tìm giá trị đại diện của các nhóm trong bảng trên.
g: $152{,}5$; $157{,}5$; $162{,}5$; $167{,}5$.
# Tần số tích luỹ
p: Cộng dồn tần số từ nhóm đầu tiên.
d: Lập dãy tần số tích luỹ của bảng trên.
g: $5$; $5+12=17$; $17+15=32$; $32+8=40$.
g: Có $32$ học sinh cao dưới $165$ cm.
# Ghép nhóm số liệu
p: Chọn các nhóm cùng độ dài phủ hết số liệu, đếm số giá trị mỗi nhóm.
d: Thời gian (phút) tự học của $12$ bạn: $3;5;7;8;10;12;13;15;16;18;19;22$. Ghép thành nhóm độ dài $5$ bắt đầu từ $0$.
g: $[0;5)$: 1; $[5;10)$: 3; $[10;15)$: 3.
g: $[15;20)$: 4; $[20;25)$: 1 (tổng $12$).
# Tần số tương đối
p: Tần số tương đối $=\dfrac{\text{tần số}}{n}\cdot100\%$.
d: Trong bảng chiều cao, nhóm $[160;165)$ chiếm bao nhiêu phần trăm?
g: $\dfrac{15}{40}=0{,}375$.
g: Chiếm $37{,}5\%$.

@9
m: $\bar x=\dfrac{n_1c_1+\dots+n_kc_k}n$ ;; Trung vị $M_e=u_m+\dfrac{\frac n2-C}{n_m}(u_{m+1}-u_m)$ ;; Tứ phân vị tính tương tự với $\dfrac n4$, $\dfrac{3n}4$ ;; Mốt $M_o=u_m+\dfrac{n_m-n_{m-1}}{(n_m-n_{m-1})+(n_m-n_{m+1})}h$
# Số trung bình
p: Nhân giá trị đại diện với tần số, cộng lại, chia cho $n$.
d: Bảng chiều cao: $[150;155)$: 5; $[155;160)$: 12; $[160;165)$: 15; $[165;170)$: 8. Tính chiều cao trung bình.
g: $\bar x=\dfrac{152{,}5\cdot5+157{,}5\cdot12+162{,}5\cdot15+167{,}5\cdot8}{40}=\dfrac{6430}{40}$.
g: $\bar x=160{,}75$ cm.
# Trung vị
p: Tìm nhóm chứa vị trí $\dfrac n2$ nhờ tần số tích luỹ, rồi áp dụng công thức.
d: Tìm trung vị của bảng trên.
g: $\dfrac n2=20$; tần số tích luỹ $5;17;32$ nên nhóm chứa trung vị là $[160;165)$ với $C=17$, $n_m=15$.
g: $M_e=160+\dfrac{20-17}{15}\cdot5=161$ cm.
# Tứ phân vị
p: $Q_1$ ứng với vị trí $\dfrac n4$, $Q_3$ ứng với $\dfrac{3n}4$.
d: Tìm $Q_1$, $Q_3$ của bảng trên.
g: $\dfrac n4=10$ thuộc $[155;160)$: $Q_1=155+\dfrac{10-5}{12}\cdot5\approx157{,}08$.
g: $\dfrac{3n}4=30$ thuộc $[160;165)$: $Q_3=160+\dfrac{30-17}{15}\cdot5\approx164{,}33$.
# Mốt
p: Nhóm chứa mốt là nhóm có tần số lớn nhất.
d: Tìm mốt của bảng trên.
g: Nhóm $[160;165)$: $n_m=15$, $n_{m-1}=12$, $n_{m+1}=8$, $h=5$.
g: $M_o=160+\dfrac{3}{3+7}\cdot5=161{,}5$ cm.
# Ý nghĩa các số đặc trưng
p: Diễn giải trung vị, tứ phân vị theo tỉ lệ phần trăm số liệu.
d: Nêu ý nghĩa của $M_e=161$, $Q_1\approx157{,}08$, $Q_3\approx164{,}33$.
g: Khoảng $50\%$ học sinh cao dưới $161$ cm.
g: Khoảng $25\%$ cao dưới $157{,}08$ cm và khoảng $25\%$ cao trên $164{,}33$ cm.

@10
m: Mặt phẳng xác định bởi: ba điểm không thẳng hàng; một đường thẳng và một điểm ngoài nó; hai đường thẳng cắt nhau ;; Giao tuyến: đường thẳng qua hai điểm chung ;; Giao điểm của $d$ và $(P)$: tìm $a\subset(P)$ cắt $d$ ;; Hình chóp, tứ diện
# Tìm giao tuyến của hai mặt phẳng (có sẵn hai điểm chung)
p: Tìm hai điểm chung phân biệt; giao tuyến là đường thẳng qua hai điểm đó.
d: Hình chóp $S.ABCD$ có đáy là hình bình hành tâm $O$. Tìm giao tuyến của $(SAC)$ và $(SBD)$.
g: $S$ là điểm chung thứ nhất.
g: $O=AC\cap BD$ thuộc cả hai mặt phẳng. Giao tuyến là $SO$.
# Giao tuyến khi phải kéo dài hai cạnh
p: Kéo dài hai đường thẳng đồng phẳng (mỗi đường thuộc một mặt phẳng) để được điểm chung.
d: Hình chóp $S.ABCD$ có $AB$ cắt $CD$ tại $E$. Tìm giao tuyến của $(SAB)$ và $(SCD)$.
g: $E\in AB\subset(SAB)$ và $E\in CD\subset(SCD)$.
g: Giao tuyến là $SE$.
# Tìm giao điểm của đường thẳng và mặt phẳng
p: Chọn mặt phẳng phụ chứa $d$, tìm giao tuyến với $(P)$; giao điểm của $d$ với giao tuyến là điểm cần tìm.
d: Hình chóp $S.ABCD$ đáy hình bình hành tâm $O$, $M$ là điểm trên cạnh $SC$. Tìm giao điểm của $AM$ và $(SBD)$.
g: Chọn $(SAC)\supset AM$; $(SAC)\cap(SBD)=SO$.
g: Trong $(SAC)$, $AM$ cắt $SO$ tại $I$; vậy $I=AM\cap(SBD)$.
# Chứng minh ba điểm thẳng hàng
p: Chỉ ra ba điểm cùng thuộc hai mặt phẳng phân biệt, nên thuộc giao tuyến.
d: Mặt phẳng $(P)$ cắt các cạnh $SA$, $SB$, $SC$ của hình chóp $S.ABC$ tại $M$, $N$, $P$. Gọi $D=MN\cap AB$, $E=NP\cap BC$, $F=MP\cap AC$. Chứng minh $D$, $E$, $F$ thẳng hàng.
g: $D$, $E$, $F$ thuộc $(P)$ (vì nằm trên $MN$, $NP$, $MP$) và thuộc $(ABC)$.
g: Nên chúng thuộc giao tuyến của $(P)$ và $(ABC)$: thẳng hàng.
# Thiết diện
p: Lần lượt tìm giao tuyến của mặt phẳng cắt với từng mặt của hình chóp.
d: Tứ diện $ABCD$; $M\in AB$, $N\in AC$ ($MN$ không song song $BC$), $P\in BD$. Tìm thiết diện của tứ diện cắt bởi $(MNP)$.
g: Trong $(ABC)$: $E=MN\cap BC$. Trong $(BCD)$: $EP$ cắt $CD$ tại $Q$.
g: Thiết diện là tứ giác $MNQP$.

@11
m: Hai đường thẳng: trùng, cắt, song song (đồng phẳng) hoặc chéo nhau ;; Qua điểm ngoài $a$ có duy nhất đường song song với $a$ ;; Ba mặt phẳng cắt nhau theo ba giao tuyến: đồng quy hoặc đôi một song song ;; Hai mặt phẳng chứa hai đường song song thì giao tuyến song song với chúng
# Xác định vị trí tương đối
p: Xét hai đường thẳng có cùng nằm trong một mặt phẳng hay không.
d: Trong tứ diện $ABCD$, xét vị trí tương đối của $AB$ và $CD$.
g: Nếu $AB$, $CD$ đồng phẳng thì $A,B,C,D$ đồng phẳng — vô lí.
g: Vậy $AB$ và $CD$ chéo nhau.
# Chứng minh hai đường thẳng song song
p: Dùng đường trung bình, tính chất hình bình hành, tính chất bắc cầu.
d: Tứ diện $ABCD$ có $M,N,P,Q$ là trung điểm $AB,BC,CD,DA$. Chứng minh $MNPQ$ là hình bình hành.
g: $MN\parallel AC$, $MN=\dfrac12AC$ (đường trung bình tam giác $ABC$); $QP\parallel AC$, $QP=\dfrac12AC$.
g: $MN\parallel QP$ và $MN=QP$ nên $MNPQ$ là hình bình hành.
# Giao tuyến song song (không có điểm chung thứ hai)
p: Hai mặt phẳng có điểm chung $S$ và lần lượt chứa hai đường song song thì giao tuyến qua $S$ song song với hai đường đó.
d: Hình chóp $S.ABCD$ đáy hình bình hành. Tìm giao tuyến của $(SAB)$ và $(SCD)$.
g: $S$ là điểm chung; $AB\parallel CD$.
g: Giao tuyến là đường thẳng $d$ qua $S$ và song song với $AB$.
# Tìm giao tuyến để dựng điểm
p: Dùng định lí giao tuyến song song để kẻ đường qua điểm chung.
d: Hình chóp $S.ABCD$ đáy hình bình hành, $M$ là trung điểm $SA$. Tìm giao tuyến của $(MBC)$ và $(SAD)$.
g: $M$ là điểm chung; $BC\parallel AD$.
g: Giao tuyến qua $M$ song song $AD$, cắt $SD$ tại $N$ (trung điểm $SD$): giao tuyến là $MN$.
# Chứng minh song song bằng bắc cầu
p: $a\parallel b$, $b\parallel c$ thì $a\parallel c$.
d: Hình chóp $S.ABCD$ đáy hình bình hành; $M$, $N$ là trung điểm $SA$, $SB$. Chứng minh $MN\parallel CD$.
g: $MN\parallel AB$ (đường trung bình tam giác $SAB$).
g: $AB\parallel CD$ nên $MN\parallel CD$.

@12
m: $a\parallel(P)$ khi $a\not\subset(P)$ và $a\parallel b\subset(P)$ ;; $a\parallel(P)$, $(Q)\supset a$ cắt $(P)$ theo $b$ thì $b\parallel a$ ;; Hai mặt phẳng cắt nhau cùng song song $a$ thì giao tuyến song song $a$ ;; Dựng thiết diện song song với đường thẳng cho trước
# Chứng minh đường thẳng song song với mặt phẳng
p: Chỉ ra một đường thẳng trong mặt phẳng song song với đường đã cho.
d: Hình chóp $S.ABCD$ đáy hình bình hành; $M$, $N$ là trung điểm $SA$, $SB$. Chứng minh $MN\parallel(SCD)$.
g: $MN\parallel AB$ và $AB\parallel CD$ nên $MN\parallel CD$.
g: $CD\subset(SCD)$, $MN\not\subset(SCD)$ nên $MN\parallel(SCD)$.
# Đường nối tâm và trung điểm
p: Dùng đường trung bình trong tam giác có chứa tâm hình bình hành.
d: Hình chóp $S.ABCD$ đáy hình bình hành tâm $O$, $M$ là trung điểm $SC$. Chứng minh $OM\parallel(SAB)$.
g: $OM$ là đường trung bình tam giác $SAC$ nên $OM\parallel SA$.
g: $SA\subset(SAB)$ nên $OM\parallel(SAB)$.
# Tìm giao tuyến nhờ quan hệ song song
p: Mặt phẳng chứa đường song song với mặt phẳng kia thì giao tuyến song song với đường đó.
d: Hình chóp $S.ABCD$ có đáy hình thang, $AB\parallel CD$; $M$ thuộc cạnh $SA$. Tìm giao tuyến của $(MCD)$ và $(SAB)$.
g: $CD\parallel AB\subset(SAB)$ nên $CD\parallel(SAB)$; $M$ là điểm chung.
g: Giao tuyến là đường qua $M$ song song $AB$, cắt $SB$ tại $N$: giao tuyến $MN$.
# Thiết diện song song với hai đường thẳng
p: Từ điểm đã biết, kẻ các đường song song với các đường cho trước trong từng mặt.
d: Tứ diện $ABCD$, $M$ là trung điểm $AB$; $(\alpha)$ qua $M$, song song với $AC$ và $BD$. Tìm thiết diện.
g: Trong $(ABC)$ kẻ $MN\parallel AC$ ($N$ trung điểm $BC$); trong $(ABD)$ kẻ $MQ\parallel BD$ ($Q$ trung điểm $AD$); trong $(BCD)$ kẻ $NP\parallel BD$ ($P$ trung điểm $CD$).
g: Thiết diện là hình bình hành $MNPQ$.
# Trọng tâm và quan hệ song song
p: Dùng tỉ số $\dfrac13$ của trọng tâm và định lí Thalès đảo.
d: Tứ diện $ABCD$; $G_1$, $G_2$ là trọng tâm tam giác $ACD$, $BCD$. Chứng minh $G_1G_2\parallel(ABC)$.
g: Gọi $I$ là trung điểm $CD$: $\dfrac{IG_1}{IA}=\dfrac{IG_2}{IB}=\dfrac13$ nên $G_1G_2\parallel AB$.
g: $AB\subset(ABC)$ nên $G_1G_2\parallel(ABC)$.

@13
m: $(P)\parallel(Q)$ khi $(P)$ chứa hai đường cắt nhau cùng song song $(Q)$ ;; Mặt phẳng cắt hai mặt phẳng song song theo hai giao tuyến song song ;; Định lí Thalès trong không gian ;; Hình lăng trụ, hình hộp: các mặt bên là hình bình hành
# Chứng minh hai mặt phẳng song song
p: Tìm hai đường cắt nhau trong mặt phẳng này lần lượt song song với mặt phẳng kia.
d: Hình chóp $S.ABCD$ đáy hình bình hành; $M,N,P$ là trung điểm $SA,SB,SD$. Chứng minh $(MNP)\parallel(ABCD)$.
g: $MN\parallel AB$, $MP\parallel AD$ (đường trung bình).
g: $MN$, $MP$ cắt nhau và cùng song song $(ABCD)$ nên $(MNP)\parallel(ABCD)$.
# Hai mặt phẳng song song trong hình hộp
p: Dùng các cặp cạnh, đường chéo song song của hình hộp.
d: Hình hộp $ABCD.A'B'C'D'$. Chứng minh $(A'BD)\parallel(CB'D')$.
g: $BD\parallel B'D'$; $A'B\parallel D'C$ (vì $A'BCD'$ là hình bình hành).
g: Hai đường cắt nhau $BD$, $A'B$ của $(A'BD)$ song song $(CB'D')$ nên hai mặt phẳng song song.
# Giao tuyến với hai mặt phẳng song song
p: Mặt phẳng cắt hai mặt phẳng song song thì hai giao tuyến song song.
d: Lăng trụ $ABC.A'B'C'$, $M$ là trung điểm $A'B'$. Tìm giao tuyến của $(MBC)$ với $(A'B'C')$ và thiết diện.
g: $(ABC)\parallel(A'B'C')$ nên giao tuyến qua $M$ song song $BC$, cắt $A'C'$ tại $N$ (trung điểm $A'C'$).
g: Thiết diện là hình thang $MNCB$.
# Thiết diện song song với một mặt phẳng
p: Kẻ các giao tuyến song song với các cạnh của mặt phẳng đã cho.
d: Tứ diện $ABCD$, $M$ là trung điểm $AB$. Mặt phẳng $(\alpha)$ qua $M$ song song $(BCD)$. Tìm thiết diện.
g: $(\alpha)$ cắt $AC$, $AD$ tại trung điểm $N$, $P$ (kẻ $MN\parallel BC$, $MP\parallel BD$).
g: Thiết diện là tam giác $MNP$, đồng dạng với $BCD$ theo tỉ số $\dfrac12$.
# Tính chất lăng trụ
p: Các cạnh bên song song và bằng nhau; hai đáy là hai đa giác bằng nhau nằm trên hai mặt phẳng song song.
d: Lăng trụ $ABC.A'B'C'$; $G$, $G'$ là trọng tâm hai đáy. Chứng minh $GG'\parallel AA'$ và $GG'=AA'$.
g: Gọi $M$, $M'$ là trung điểm $BC$, $B'C'$: $MM'\parallel AA'$, $MM'=AA'$, nên $AMM'A'$ là hình bình hành.
g: $G$, $G'$ chia $AM$, $A'M'$ cùng tỉ số $\dfrac23$ nên $AGG'A'$ là hình bình hành: $GG'\parallel AA'$, $GG'=AA'$.

@14
m: Phép chiếu song song giữ tính thẳng hàng, song song ;; Giữ tỉ số độ dài trên một đường hoặc hai đường song song ;; Trung điểm $\to$ trung điểm, trọng tâm $\to$ trọng tâm ;; Hình biểu diễn: hình vuông $\to$ hình bình hành, đường tròn $\to$ elip
# Tính chất bảo toàn
p: Phép chiếu song song biến trung điểm thành trung điểm, giữ tỉ số đoạn thẳng cùng phương.
d: Hình chiếu song song của trung tuyến $AM$ của tam giác $ABC$ là gì?
g: $M$ là trung điểm $BC$ nên $M'$ là trung điểm $B'C'$.
g: Hình chiếu của $AM$ là trung tuyến $A'M'$ của tam giác $A'B'C'$.
# Hình biểu diễn của hình vuông, hình chữ nhật
p: Vẽ một hình bình hành bất kì.
d: Vẽ hình biểu diễn của hình vuông $ABCD$ có tâm $O$.
g: Vẽ hình bình hành $A'B'C'D'$.
g: $O'$ là giao điểm hai đường chéo (trung điểm mỗi đường chéo).
# Hình biểu diễn của tam giác đều và đường cao
p: Tam giác bất kì; đường cao của tam giác đều là trung tuyến nên biểu diễn bằng trung tuyến.
d: Vẽ hình biểu diễn của tam giác đều $ABC$ và đường cao $AH$.
g: Vẽ tam giác $A'B'C'$ bất kì.
g: $H'$ là trung điểm $B'C'$; $A'H'$ là hình biểu diễn của đường cao.
# Hình biểu diễn của hình thang
p: Giữ song song và tỉ số hai đáy.
d: Hình thang $ABCD$ có $AB\parallel CD$, $AB=2CD$. Nêu cách vẽ hình biểu diễn.
g: Vẽ đoạn $A'B'$, vẽ $D'C'\parallel A'B'$ với $D'C'=\dfrac12A'B'$.
g: Nối $A'D'$, $B'C'$ được hình thang $A'B'C'D'$.
# Hình biểu diễn của đường tròn và lục giác đều
p: Đường tròn biểu diễn bằng elip; lục giác đều tâm $O$ gồm các hình bình hành $OABC$, …
d: Vẽ hình biểu diễn của lục giác đều $ABCDEF$ tâm $O$.
g: Vẽ hình bình hành $O'A'B'C'$.
g: Lấy $D'$, $E'$, $F'$ đối xứng với $A'$, $B'$, $C'$ qua $O'$.

@15
m: $\lim\dfrac1{n^k}=0$; $\lim q^n=0$ khi $|q|<1$ ;; Phân thức: chia tử, mẫu cho luỹ thừa cao nhất của $n$ ;; Dạng $\infty-\infty$ chứa căn: nhân liên hợp ;; Cấp số nhân lùi vô hạn: $S=\dfrac{u_1}{1-q}$
# Giới hạn của phân thức (bậc bằng nhau)
p: Chia tử và mẫu cho $n^k$ với $k$ là bậc cao nhất.
d: Tính $\lim\dfrac{2n^2+1}{3n^2-n}$.
g: $=\lim\dfrac{2+\frac1{n^2}}{3-\frac1n}$.
g: $=\dfrac23$.
# Giới hạn vô cực
p: Đặt luỹ thừa cao nhất làm nhân tử chung.
d: Tính $\lim(3n-n^3)$.
g: $3n-n^3=n^3\left(\dfrac3{n^2}-1\right)$.
g: $n^3\to+\infty$, $\dfrac3{n^2}-1\to-1$ nên giới hạn là $-\infty$.
# Nhân liên hợp
p: $\sqrt A-B=\dfrac{A-B^2}{\sqrt A+B}$.
d: Tính $\lim\left(\sqrt{n^2+n}-n\right)$.
g: $=\lim\dfrac{n}{\sqrt{n^2+n}+n}=\lim\dfrac1{\sqrt{1+\frac1n}+1}$.
g: $=\dfrac12$.
# Giới hạn có $q^n$
p: Chia cho luỹ thừa có cơ số lớn nhất.
d: Tính $\lim\dfrac{3^n+2^n}{3^{n+1}}$.
g: $=\lim\dfrac{1+\left(\frac23\right)^n}{3}$.
g: $\left(\frac23\right)^n\to0$ nên giới hạn bằng $\dfrac13$.
# Tổng cấp số nhân lùi vô hạn
p: $S=\dfrac{u_1}{1-q}$ với $|q|<1$; viết số thập phân vô hạn tuần hoàn thành tổng như vậy.
d: Viết $0{,}(12)=0{,}121212\ldots$ thành phân số.
g: $0{,}(12)=\dfrac{12}{100}+\dfrac{12}{100^2}+\dots$, với $u_1=\dfrac{12}{100}$, $q=\dfrac1{100}$.
g: $S=\dfrac{12/100}{99/100}=\dfrac{12}{99}=\dfrac4{33}$.

@16
m: Hàm sơ cấp xác định tại $x_0$: thay trực tiếp ;; Dạng $\dfrac00$: phân tích nhân tử hoặc nhân liên hợp ;; Dạng $\dfrac\infty\infty$ khi $x\to\pm\infty$: chia cho luỹ thừa cao nhất ;; Giới hạn một bên $x\to x_0^+$, $x\to x_0^-$
# Thay trực tiếp
p: Nếu $f$ xác định tại $x_0$ (đa thức, phân thức mẫu khác $0$) thì $\lim f(x)=f(x_0)$.
d: Tính $\lim\limits_{x\to2}(x^2+3x-1)$.
g: Thay $x=2$: $4+6-1$.
g: $=9$.
# Dạng $\dfrac00$ – phân tích nhân tử
p: Phân tích tử, mẫu có nhân tử $(x-x_0)$ rồi rút gọn.
d: Tính $\lim\limits_{x\to1}\dfrac{x^2-3x+2}{x-1}$.
g: $\dfrac{(x-1)(x-2)}{x-1}=x-2$.
g: Giới hạn bằng $1-2=-1$.
# Dạng $\dfrac00$ – nhân liên hợp
p: Nhân tử và mẫu với biểu thức liên hợp của căn.
d: Tính $\lim\limits_{x\to0}\dfrac{\sqrt{x+4}-2}{x}$.
g: $=\lim\dfrac{x}{x(\sqrt{x+4}+2)}=\lim\dfrac1{\sqrt{x+4}+2}$.
g: $=\dfrac14$.
# Giới hạn tại vô cực
p: Chia tử và mẫu cho $x^k$ với $k$ là bậc cao nhất của mẫu.
d: Tính $\lim\limits_{x\to+\infty}\dfrac{2x^2-x}{x^2+1}$.
g: $=\lim\dfrac{2-\frac1x}{1+\frac1{x^2}}$.
g: $=2$.
# Giới hạn một bên, giới hạn vô cực
p: Xét dấu tử và mẫu khi $x$ dần tới $x_0$ từ bên phải hoặc trái.
d: Tính $\lim\limits_{x\to2^+}\dfrac{x+1}{x-2}$ và $\lim\limits_{x\to2^-}\dfrac{x+1}{x-2}$.
g: Tử dần tới $3>0$; $x\to2^+$ thì $x-2\to0^+$: giới hạn $+\infty$.
g: $x\to2^-$ thì $x-2\to0^-$: giới hạn $-\infty$.

@17
m: $f$ liên tục tại $x_0\Leftrightarrow\lim\limits_{x\to x_0}f(x)=f(x_0)$ ;; Đa thức, phân thức, hàm lượng giác liên tục trên từng khoảng xác định ;; $f$ liên tục trên $[a;b]$, $f(a)f(b)<0$ thì có nghiệm trong $(a;b)$ ;; Tìm tham số để hàm nhiều công thức liên tục
# Xét tính liên tục tại một điểm
p: Tính $f(x_0)$ và $\lim\limits_{x\to x_0}f(x)$ rồi so sánh.
d: Cho $f(x)=\dfrac{x^2-1}{x-1}$ khi $x\ne1$, $f(1)=2$. Xét tính liên tục tại $x=1$.
g: $\lim\limits_{x\to1}\dfrac{x^2-1}{x-1}=\lim\limits_{x\to1}(x+1)=2$.
g: Bằng $f(1)=2$ nên $f$ liên tục tại $x=1$.
# Tìm tham số để hàm số liên tục
p: Cho giới hạn bằng giá trị tại điểm nối.
d: Cho $f(x)=\dfrac{x^2-4}{x-2}$ khi $x\ne2$, $f(2)=m$. Tìm $m$ để $f$ liên tục tại $x=2$.
g: $\lim\limits_{x\to2}f(x)=\lim\limits_{x\to2}(x+2)=4$.
g: Cần $m=4$.
# Khoảng liên tục của hàm phân thức
p: Phân thức liên tục trên từng khoảng của tập xác định.
d: Tìm các khoảng liên tục của $y=\dfrac{x+1}{x^2-5x+6}$.
g: Mẫu bằng $0$ khi $x=2$ hoặc $x=3$.
g: Hàm số liên tục trên $(-\infty;2)$, $(2;3)$, $(3;+\infty)$.
# Chứng minh phương trình có nghiệm
p: Chọn đoạn $[a;b]$ có $f(a)f(b)<0$, $f$ liên tục.
d: Chứng minh $x^3+x-1=0$ có nghiệm thuộc $(0;1)$.
g: $f(x)=x^3+x-1$ liên tục trên $[0;1]$; $f(0)=-1$, $f(1)=1$.
g: $f(0)f(1)<0$ nên phương trình có nghiệm thuộc $(0;1)$.
# Chứng minh phương trình có nhiều nghiệm
p: Tìm nhiều đoạn rời nhau mà $f$ đổi dấu.
d: Chứng minh $x^3-3x+1=0$ có đúng ba nghiệm.
g: $f(-2)=-1$, $f(0)=1$, $f(1)=-1$, $f(2)=3$: $f$ đổi dấu trên $(-2;0)$, $(0;1)$, $(1;2)$.
g: Có ít nhất ba nghiệm; phương trình bậc ba có không quá ba nghiệm nên có đúng ba nghiệm.

@18
m: $a^{\frac mn}=\sqrt[n]{a^m}$ $(a>0)$ ;; $a^xa^y=a^{x+y}$, $\dfrac{a^x}{a^y}=a^{x-y}$, $(a^x)^y=a^{xy}$ ;; $a>1$: $a^x<a^y\Leftrightarrow x<y$ ;; $0<a<1$: $a^x<a^y\Leftrightarrow x>y$
# Tính giá trị biểu thức
p: Đưa cơ số về luỹ thừa của số nguyên tố, dùng $(a^m)^n=a^{mn}$.
d: Tính $A=8^{\frac23}+16^{-\frac34}$.
g: $8^{\frac23}=(2^3)^{\frac23}=4$; $16^{-\frac34}=(2^4)^{-\frac34}=2^{-3}=\dfrac18$.
g: $A=\dfrac{33}8$.
# Rút gọn biểu thức chứa căn
p: Viết căn dưới dạng luỹ thừa với số mũ hữu tỉ.
d: Rút gọn $\sqrt[3]{a^2\sqrt a}$ $(a>0)$.
g: $a^2\sqrt a=a^{\frac52}$.
g: $\sqrt[3]{a^{\frac52}}=a^{\frac56}$.
# So sánh cùng cơ số
p: Cơ số lớn hơn $1$ giữ chiều, cơ số nhỏ hơn $1$ đổi chiều.
d: So sánh $0{,}5^{\sqrt3}$ và $0{,}5^{1{,}7}$.
g: $\sqrt3\approx1{,}732>1{,}7$ và $0<0{,}5<1$.
g: $0{,}5^{\sqrt3}<0{,}5^{1{,}7}$.
# So sánh khác cơ số
p: Đưa về cùng số mũ rồi so sánh cơ số.
d: So sánh $2^{300}$ và $3^{200}$.
g: $2^{300}=8^{100}$, $3^{200}=9^{100}$.
g: $8<9$ nên $2^{300}<3^{200}$.
# Mô hình tăng trưởng
p: Thay số vào công thức hàm mũ.
d: Số vi khuẩn $N(t)=N_0\cdot2^{\frac t3}$ ($t$ giờ). Sau $12$ giờ số vi khuẩn gấp bao nhiêu lần ban đầu?
g: $\dfrac{N(12)}{N_0}=2^{\frac{12}3}=2^4$.
g: Gấp $16$ lần.

@19
m: $\log_ab=\alpha\Leftrightarrow a^\alpha=b$ $(0<a\ne1,\ b>0)$ ;; $\log_a(bc)=\log_ab+\log_ac$, $\log_a\dfrac bc=\log_ab-\log_ac$ ;; $\log_ab^\alpha=\alpha\log_ab$ ;; Đổi cơ số: $\log_ab=\dfrac{\log_cb}{\log_ca}$
# Tính lôgarit theo định nghĩa
p: Viết $b$ thành luỹ thừa của $a$.
d: Tính $\log_232$, $\log_3\dfrac1{27}$, $\log_{\frac12}8$.
g: $\log_232=\log_22^5=5$; $\log_3\dfrac1{27}=\log_33^{-3}=-3$.
g: $\log_{\frac12}8=\log_{\frac12}\left(\dfrac12\right)^{-3}=-3$.
# Dùng quy tắc tính
p: Gộp tổng thành log của tích, hiệu thành log của thương.
d: Tính $\log_69+\log_64$.
g: $=\log_6(9\cdot4)=\log_636$.
g: $=2$.
# Biểu diễn lôgarit theo một lôgarit đã biết
p: Phân tích số thành tích các luỹ thừa của các số đã biết log.
d: Biết $\log_23=a$. Tính $\log_212$ và $\log_418$ theo $a$.
g: $\log_212=\log_2(4\cdot3)=2+a$.
g: $\log_418=\dfrac{\log_218}{2}=\dfrac{1+2a}2$.
# Đổi cơ số
p: $\log_{a^k}b^k=\log_ab$; $\log_ab=\dfrac{\log_cb}{\log_ca}$.
d: Biết $\log_23=a$. Tính $\log_827$ và $\log_32$.
g: $\log_827=\log_{2^3}3^3=\log_23=a$.
g: $\log_32=\dfrac1{\log_23}=\dfrac1a$.
# Ứng dụng: độ pH
p: $\text{pH}=-\log[\text{H}^+]$.
d: Một dung dịch có $[\text{H}^+]=2\cdot10^{-4}$ mol/L. Tính pH.
g: $\text{pH}=-(\log2+\log10^{-4})=4-\log2$.
g: $\text{pH}\approx3{,}7$.

@20
m: $y=a^x$: $D=\mathbb R$, tập giá trị $(0;+\infty)$ ;; $y=\log_ax$: $D=(0;+\infty)$, tập giá trị $\mathbb R$ ;; $a>1$: đồng biến; $0<a<1$: nghịch biến ;; Đồ thị $y=a^x$ và $y=\log_ax$ đối xứng qua $y=x$
# Tập xác định của hàm lôgarit
p: Biểu thức trong log phải dương.
d: Tìm tập xác định của $y=\log_2(x^2-4x+3)$.
g: $x^2-4x+3>0\Leftrightarrow x<1$ hoặc $x>3$.
g: $D=(-\infty;1)\cup(3;+\infty)$.
# Tập xác định có nhiều điều kiện
p: Kết hợp điều kiện của log, căn, mẫu.
d: Tìm tập xác định của $y=\ln(2-x)+\sqrt{x+1}$.
g: $2-x>0$ và $x+1\ge0$.
g: $D=[-1;2)$.
# Tính đơn điệu
p: So sánh cơ số với $1$.
d: Xét tính đơn điệu của $y=\left(\dfrac\pi4\right)^x$ và $y=\log_{\sqrt2}x$.
g: $0<\dfrac\pi4<1$ nên $y=\left(\dfrac\pi4\right)^x$ nghịch biến trên $\mathbb R$.
g: $\sqrt2>1$ nên $y=\log_{\sqrt2}x$ đồng biến trên $(0;+\infty)$.
# So sánh hai lôgarit
p: Cùng cơ số: dùng tính đơn điệu; khác cơ số: so sánh với số trung gian ($1$, $0$, …).
d: So sánh $\log_23$ và $\log_32$.
g: $\log_23>\log_22=1$; $\log_32<\log_33=1$.
g: Vậy $\log_23>\log_32$.
# Mô hình tăng trưởng mũ
p: $P(t)=P_0e^{rt}$; thay số và dùng máy tính.
d: Dân số $100$ triệu người, tăng theo $P(t)=P_0e^{0{,}01t}$. Ước tính dân số sau $10$ năm.
g: $P(10)=100e^{0{,}1}$.
g: $P(10)\approx110{,}5$ triệu người.

@21
m: $a^{f(x)}=a^{g(x)}\Leftrightarrow f(x)=g(x)$; $a^{f(x)}=b\Leftrightarrow f(x)=\log_ab$ ;; $\log_af(x)=\log_ag(x)\Leftrightarrow f(x)=g(x)>0$ ;; $a>1$: bất phương trình giữ chiều; $0<a<1$: đổi chiều ;; Ẩn phụ $t=a^x>0$
# Phương trình mũ đưa về cùng cơ số
p: Viết hai vế cùng cơ số rồi cho số mũ bằng nhau.
d: Giải $2^{x^2-x}=4$.
g: $2^{x^2-x}=2^2\Leftrightarrow x^2-x-2=0$.
g: $x=-1$ hoặc $x=2$.
# Phương trình mũ đặt ẩn phụ
p: Đặt $t=a^x>0$, giải phương trình bậc hai ẩn $t$.
d: Giải $4^x-3\cdot2^x+2=0$.
g: Đặt $t=2^x>0$: $t^2-3t+2=0\Rightarrow t=1$ hoặc $t=2$.
g: $2^x=1\Rightarrow x=0$; $2^x=2\Rightarrow x=1$.
# Phương trình lôgarit
p: Đặt điều kiện, dùng quy tắc log để gộp rồi mũ hoá.
d: Giải $\log_2(x+1)+\log_2(x-1)=3$.
g: Điều kiện $x>1$. Phương trình $\Leftrightarrow\log_2(x^2-1)=3\Leftrightarrow x^2-1=8$.
g: $x=3$ (nhận) hoặc $x=-3$ (loại). Vậy $x=3$.
# Bất phương trình mũ
p: Đưa về cùng cơ số; cơ số nhỏ hơn $1$ thì đổi chiều.
d: Giải $\left(\dfrac12\right)^{x-1}>\dfrac18$.
g: $\left(\dfrac12\right)^{x-1}>\left(\dfrac12\right)^3$, cơ số $\dfrac12<1$ nên $x-1<3$.
g: $x<4$.
# Bất phương trình lôgarit
p: Đặt điều kiện, đưa về cùng cơ số, xét cơ số để giữ hoặc đổi chiều.
d: Giải $\log_3(2x-1)\le2$.
g: Điều kiện $x>\dfrac12$. Bất phương trình $\Leftrightarrow2x-1\le9\Leftrightarrow x\le5$.
g: Tập nghiệm $\left(\dfrac12;5\right]$.

@22
m: Góc giữa hai đường thẳng: góc giữa hai đường cắt nhau lần lượt song song với chúng ;; Góc nằm trong $[0^\circ;90^\circ]$ ;; $a\perp b$ khi góc bằng $90^\circ$ ;; $a\parallel b$, $c\perp a$ thì $c\perp b$
# Góc giữa hai đường thẳng trong hình lập phương
p: Thay một đường bằng đường song song cắt đường kia.
d: Hình lập phương $ABCD.A'B'C'D'$. Tính góc giữa $AC$ và $A'D'$.
g: $A'D'\parallel AD$ nên góc $(AC,A'D')=(AC,AD)$.
g: $\widehat{CAD}=45^\circ$.
# Góc dựa vào tam giác đều
p: Đưa về góc trong tam giác có các cạnh là đường chéo của các mặt.
d: Hình lập phương $ABCD.A'B'C'D'$. Tính góc giữa $A'C'$ và $B'C$.
g: $A'C'\parallel AC$ nên góc cần tìm bằng góc giữa $AC$ và $B'C$.
g: Tam giác $AB'C$ có ba cạnh là đường chéo các mặt nên đều: góc bằng $60^\circ$.
# Góc giữa hai cạnh đối của tứ diện
p: Dùng trung điểm để tạo các đường trung bình song song với hai cạnh, tính góc bằng định lí côsin.
d: Tứ diện $ABCD$ có $AB=CD=a$; $M$, $N$, $P$ là trung điểm $BC$, $AC$, $BD$ và $NP=\dfrac{a\sqrt3}2$. Tính góc giữa $AB$ và $CD$.
g: $MN\parallel AB$, $MP\parallel CD$, $MN=MP=\dfrac a2$; $\cos\widehat{NMP}=\dfrac{\frac{a^2}4+\frac{a^2}4-\frac{3a^2}4}{2\cdot\frac{a^2}4}=-\dfrac12$.
g: $\widehat{NMP}=120^\circ$ nên góc giữa $AB$ và $CD$ bằng $60^\circ$.
# Chứng minh hai đường thẳng vuông góc
p: Dùng đường song song: $a\parallel b$, $c\perp a\Rightarrow c\perp b$.
d: Hình lập phương $ABCD.A'B'C'D'$. Chứng minh $AC\perp B'D'$.
g: $B'D'\parallel BD$.
g: $AC\perp BD$ (đường chéo hình vuông) nên $AC\perp B'D'$.
# Tính góc nhờ tỉ số lượng giác
p: Đưa về góc nhọn trong tam giác vuông.
d: Hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA\perp AB$, $SA=a\sqrt3$. Tính góc giữa $SB$ và $CD$.
g: $CD\parallel AB$ nên góc cần tìm là $\widehat{SBA}$.
g: $\tan\widehat{SBA}=\dfrac{SA}{AB}=\sqrt3\Rightarrow\widehat{SBA}=60^\circ$.

@23
m: $d\perp(P)\Leftrightarrow d$ vuông góc với hai đường cắt nhau trong $(P)$ ;; $d\perp(P)$ thì $d$ vuông góc mọi đường trong $(P)$ ;; Định lí ba đường vuông góc ;; Mặt phẳng trung trực của đoạn thẳng
# Chứng minh đường thẳng vuông góc với mặt phẳng
p: Chỉ ra hai đường cắt nhau trong mặt phẳng cùng vuông góc với đường thẳng.
d: Hình chóp $S.ABCD$ đáy hình vuông, $SA\perp(ABCD)$. Chứng minh $BC\perp(SAB)$.
g: $BC\perp AB$ (hình vuông); $BC\perp SA$ (vì $SA\perp(ABCD)$).
g: $AB$, $SA$ cắt nhau trong $(SAB)$ nên $BC\perp(SAB)$.
# Chứng minh hai đường thẳng vuông góc
p: Chứng minh đường này vuông góc với mặt phẳng chứa đường kia.
d: Với hình chóp trên, chứng minh $BD\perp SC$.
g: $BD\perp AC$, $BD\perp SA$ nên $BD\perp(SAC)$.
g: $SC\subset(SAC)$ nên $BD\perp SC$.
# Hai cạnh đối của tứ diện đều vuông góc
p: Dùng trung điểm và tính chất tam giác cân.
d: Chứng minh trong tứ diện đều $ABCD$ thì $AB\perp CD$.
g: Gọi $M$ là trung điểm $CD$: $CD\perp AM$, $CD\perp BM$ (trung tuyến tam giác đều).
g: $CD\perp(ABM)$ nên $CD\perp AB$.
# Tam giác vuông trong hình chóp
p: Dùng định lí ba đường vuông góc hoặc chứng minh đường vuông góc mặt phẳng.
d: Hình chóp $S.ABC$ có $SA\perp(ABC)$, tam giác $ABC$ vuông tại $B$. Chứng minh tam giác $SBC$ vuông.
g: $BC\perp AB$, $BC\perp SA$ nên $BC\perp(SAB)$.
g: Suy ra $BC\perp SB$: tam giác $SBC$ vuông tại $B$.
# Đường vuông góc hạ từ một điểm
p: Đường vuông góc với hai đường cắt nhau của một mặt phẳng thì vuông góc với mặt phẳng.
d: Hình chóp $S.ABCD$ đáy hình vuông, $SA\perp(ABCD)$, $AH\perp SB$ tại $H$. Chứng minh $AH\perp SC$.
g: $BC\perp(SAB)$ nên $BC\perp AH$; lại có $AH\perp SB$.
g: $AH\perp(SBC)$ nên $AH\perp SC$.

@24
m: Hình chiếu vuông góc của điểm, đường thẳng lên mặt phẳng ;; Góc $(d,(P))$ là góc giữa $d$ và hình chiếu $d'$ ;; $SA\perp(P)$ thì $(SB,(P))=\widehat{SBA}$ ;; Góc nằm trong $[0^\circ;90^\circ]$
# Góc giữa cạnh bên và đáy (cạnh bên vuông góc đáy)
p: Hình chiếu của $S$ là $A$ nên góc là $\widehat{SCA}$, tính bằng tỉ số lượng giác.
d: Hình chóp $S.ABCD$ đáy vuông cạnh $a$, $SA\perp(ABCD)$, $SA=a\sqrt2$. Tính góc giữa $SC$ và đáy.
g: Góc cần tìm là $\widehat{SCA}$; $AC=a\sqrt2$.
g: $\tan\widehat{SCA}=\dfrac{SA}{AC}=1\Rightarrow\widehat{SCA}=45^\circ$.
# Góc của cạnh bên khác
p: Xác định hình chiếu rồi tính tan.
d: Với hình chóp trên, tính góc giữa $SB$ và đáy.
g: Góc cần tìm là $\widehat{SBA}$.
g: $\tan\widehat{SBA}=\dfrac{a\sqrt2}{a}=\sqrt2\Rightarrow\widehat{SBA}\approx54{,}7^\circ$.
# Góc giữa đường thẳng và mặt bên
p: Tìm đường vuông góc với mặt bên để xác định hình chiếu.
d: Với hình chóp trên, tính góc giữa $SC$ và $(SAB)$.
g: $BC\perp(SAB)$ nên hình chiếu của $SC$ lên $(SAB)$ là $SB$; góc cần tìm là $\widehat{BSC}$.
g: $SB=a\sqrt3$; $\tan\widehat{BSC}=\dfrac{BC}{SB}=\dfrac1{\sqrt3}\Rightarrow\widehat{BSC}=30^\circ$.
# Góc trong hình chóp đều
p: Hình chiếu của đỉnh là tâm $O$ của đáy.
d: Hình chóp tứ giác đều $S.ABCD$ có cạnh đáy và cạnh bên đều bằng $a$. Tính góc giữa cạnh bên và đáy.
g: Góc cần tìm là $\widehat{SAO}$; $AO=\dfrac{a\sqrt2}2$.
g: $\cos\widehat{SAO}=\dfrac{AO}{SA}=\dfrac{\sqrt2}2\Rightarrow\widehat{SAO}=45^\circ$.
# Bài toán thực tế
p: Mô hình hoá bằng tam giác vuông với hình chiếu trên mặt đất.
d: Một chiếc thang dài $5$ m dựa vào tường, chân thang cách chân tường $3$ m. Tính góc giữa thang và mặt đất.
g: $\cos\alpha=\dfrac35$.
g: $\alpha\approx53{,}13^\circ$.

@25
m: $(P)\perp(Q)$ khi $(P)$ chứa một đường vuông góc với $(Q)$ ;; Hai mặt phẳng cắt nhau cùng vuông góc $(R)$ thì giao tuyến vuông góc $(R)$ ;; Góc phẳng nhị diện: hai tia cùng vuông góc với cạnh nhị diện ;; Hình lăng trụ đứng, hình chóp đều
# Chứng minh mặt bên vuông góc với đáy
p: Mặt phẳng chứa đường cao của hình chóp thì vuông góc với đáy.
d: Hình chóp $S.ABCD$ có $SA\perp(ABCD)$. Chứng minh $(SAB)\perp(ABCD)$.
g: $SA\subset(SAB)$ và $SA\perp(ABCD)$.
g: Vậy $(SAB)\perp(ABCD)$.
# Hai mặt bên vuông góc
p: Tìm một đường thẳng trong mặt này vuông góc với mặt kia.
d: Hình chóp $S.ABCD$ đáy vuông, $SA\perp(ABCD)$. Chứng minh $(SBC)\perp(SAB)$.
g: $BC\perp AB$, $BC\perp SA$ nên $BC\perp(SAB)$.
g: $BC\subset(SBC)$ nên $(SBC)\perp(SAB)$.
# Mặt phẳng chéo vuông góc
p: Dùng hai đường chéo của hình vuông vuông góc.
d: Với hình chóp trên, chứng minh $(SAC)\perp(SBD)$.
g: $BD\perp AC$, $BD\perp SA$ nên $BD\perp(SAC)$.
g: $BD\subset(SBD)$ nên $(SBD)\perp(SAC)$.
# Góc nhị diện giữa mặt bên và đáy
p: Tìm hai tia cùng vuông góc với cạnh nhị diện tại một điểm.
d: Hình chóp $S.ABCD$ đáy vuông cạnh $a$, $SA\perp(ABCD)$, $SA=a\sqrt3$. Tính số đo góc nhị diện $[S,BC,A]$.
g: $AB\perp BC$, $SB\perp BC$ nên góc phẳng nhị diện là $\widehat{SBA}$.
g: $\tan\widehat{SBA}=\sqrt3\Rightarrow\widehat{SBA}=60^\circ$.
# Góc giữa mặt bên và đáy của hình chóp đều
p: Dùng trung điểm cạnh đáy $M$: góc là $\widehat{SMO}$.
d: Hình chóp tứ giác đều $S.ABCD$ cạnh đáy $a$, chiều cao $SO=\dfrac{a\sqrt3}2$. Tính góc giữa mặt bên và đáy.
g: $M$ là trung điểm $CD$: $OM=\dfrac a2$, góc cần tìm là $\widehat{SMO}$.
g: $\tan\widehat{SMO}=\dfrac{SO}{OM}=\sqrt3\Rightarrow\widehat{SMO}=60^\circ$.

@26
m: $d(M,(P))=MH$ với $H$ là hình chiếu của $M$ ;; $a\parallel(P)$: $d(a,(P))=d(A,(P))$, $A\in a$ ;; Tam giác vuông: $\dfrac1{h^2}=\dfrac1{b^2}+\dfrac1{c^2}$ ;; Hai đường chéo nhau: độ dài đoạn vuông góc chung
# Khoảng cách từ điểm đến đường thẳng
p: Dựng đường cao trong tam giác chứa điểm và đường thẳng.
d: Hình chóp $S.ABCD$ đáy vuông cạnh $a$, $SA\perp(ABCD)$, $SA=a$. Tính $d(A,SC)$.
g: Tam giác $SAC$ vuông tại $A$, $AC=a\sqrt2$, $SC=a\sqrt3$.
g: $d(A,SC)=\dfrac{SA\cdot AC}{SC}=\dfrac{a\sqrt6}3$.
# Khoảng cách từ chân đường cao đến mặt bên
p: Kẻ $AH\perp SB$; khi $BC\perp(SAB)$ thì $AH\perp(SBC)$.
d: Với hình chóp trên, tính $d(A,(SBC))$.
g: $AH\perp(SBC)$, $\dfrac1{AH^2}=\dfrac1{a^2}+\dfrac1{a^2}$.
g: $d(A,(SBC))=\dfrac{a\sqrt2}2$.
# Đổi điểm nhờ quan hệ song song
p: Nếu $AD\parallel(SBC)$ thì mọi điểm trên $AD$ cách đều $(SBC)$.
d: Với hình chóp trên, tính $d(D,(SBC))$.
g: $AD\parallel BC$ nên $AD\parallel(SBC)$.
g: $d(D,(SBC))=d(A,(SBC))=\dfrac{a\sqrt2}2$.
# Khoảng cách giữa hai đường thẳng chéo nhau
p: Tìm đoạn vuông góc chung.
d: Với hình chóp trên, tính khoảng cách giữa $SA$ và $BD$.
g: Gọi $O=AC\cap BD$: $AO\perp BD$ và $AO\perp SA$, nên $AO$ là đoạn vuông góc chung.
g: $d(SA,BD)=AO=\dfrac{a\sqrt2}2$.
# Khoảng cách trong hình hộp chữ nhật
p: Đường thẳng vuông góc với đáy: khoảng cách từ nó đến một đường trong đáy bằng khoảng cách từ chân đến đường đó.
d: Hình hộp chữ nhật có $AB=a$, $AD=2a$. Tính khoảng cách giữa $BB'$ và $AC$.
g: $BB'\perp(ABCD)$; kẻ $BK\perp AC$ thì $BK$ là đoạn vuông góc chung.
g: $BK=\dfrac{AB\cdot BC}{AC}=\dfrac{2a^2}{a\sqrt5}=\dfrac{2a\sqrt5}5$.

@27
m: Khối chóp $V=\dfrac13Bh$ ;; Khối lăng trụ $V=Bh$ ;; Chóp cụt $V=\dfrac h3\left(S+S'+\sqrt{SS'}\right)$ ;; Tỉ số $\dfrac{V_{S.A'B'C'}}{V_{S.ABC}}=\dfrac{SA'}{SA}\cdot\dfrac{SB'}{SB}\cdot\dfrac{SC'}{SC}$
# Thể tích chóp có cạnh bên vuông góc đáy
p: Chiều cao là cạnh bên vuông góc với đáy.
d: Hình chóp $S.ABCD$ đáy vuông cạnh $a$, $SA\perp(ABCD)$, $SA=a\sqrt3$. Tính thể tích.
g: $B=a^2$, $h=a\sqrt3$.
g: $V=\dfrac13a^2\cdot a\sqrt3=\dfrac{a^3\sqrt3}3$.
# Thể tích chóp đều
p: Chiều cao $SO$ với $O$ là tâm đáy, tính bằng Pythagore.
d: Hình chóp tứ giác đều có cạnh đáy và cạnh bên đều bằng $a$. Tính thể tích.
g: $AO=\dfrac{a\sqrt2}2$, $SO=\sqrt{a^2-\dfrac{a^2}2}=\dfrac{a\sqrt2}2$.
g: $V=\dfrac13a^2\cdot\dfrac{a\sqrt2}2=\dfrac{a^3\sqrt2}6$.
# Thể tích lăng trụ đứng
p: $V=Bh$, chiều cao là cạnh bên.
d: Lăng trụ đứng $ABC.A'B'C'$ có đáy là tam giác đều cạnh $a$, $AA'=2a$. Tính thể tích.
g: $B=\dfrac{a^2\sqrt3}4$.
g: $V=\dfrac{a^2\sqrt3}4\cdot2a=\dfrac{a^3\sqrt3}2$.
# Thể tích khối chóp cụt
p: $V=\dfrac h3\left(S+S'+\sqrt{SS'}\right)$.
d: Chóp cụt tứ giác đều có hai đáy là hình vuông cạnh $4$ và $2$, chiều cao $3$. Tính thể tích.
g: $S=16$, $S'=4$, $\sqrt{SS'}=8$.
g: $V=\dfrac33(16+4+8)=28$.
# Tỉ số thể tích
p: Dùng công thức tỉ số cho hai khối chóp chung đỉnh, chung góc tam diện.
d: Hình chóp $S.ABC$, $M$, $N$ là trung điểm $SB$, $SC$. Tính $\dfrac{V_{S.AMN}}{V_{S.ABC}}$.
g: $\dfrac{V_{S.AMN}}{V_{S.ABC}}=\dfrac{SA}{SA}\cdot\dfrac{SM}{SB}\cdot\dfrac{SN}{SC}$.
g: $=1\cdot\dfrac12\cdot\dfrac12=\dfrac14$.

@28
m: Hợp $A\cup B$: $A$ hoặc $B$ xảy ra ;; Giao $AB$: cả $A$ và $B$ cùng xảy ra ;; Xung khắc: $AB=\varnothing$ ;; Độc lập: việc xảy ra của biến cố này không ảnh hưởng xác suất của biến cố kia
# Xác định biến cố hợp, giao
p: Viết các biến cố dưới dạng tập con của không gian mẫu.
d: Gieo một xúc xắc. $A$: “số chấm chẵn”, $B$: “số chấm lớn hơn $3$”. Tìm $A\cup B$, $AB$.
g: $A=\{2;4;6\}$, $B=\{4;5;6\}$.
g: $A\cup B=\{2;4;5;6\}$; $AB=\{4;6\}$.
# Biến cố xung khắc
p: Kiểm tra giao có rỗng không.
d: Với phép thử trên, $C$: “số chấm là $1$ hoặc $3$”. $A$ và $C$ có xung khắc không?
g: $A\cap C=\varnothing$.
g: $A$ và $C$ xung khắc.
# Nhận biết biến cố độc lập
p: Hai phép thử tách rời, không ảnh hưởng nhau thì các biến cố liên quan độc lập.
d: Tung một đồng xu và gieo một xúc xắc. $A$: “đồng xu sấp”, $B$: “xúc xắc ra mặt $6$”. $A$, $B$ có độc lập không?
g: Kết quả của đồng xu không ảnh hưởng đến kết quả của xúc xắc.
g: $A$ và $B$ độc lập.
# Biểu diễn biến cố qua biến cố khác
p: Dùng hợp, giao, biến cố đối để diễn tả.
d: Hai xạ thủ cùng bắn; $A_1$, $A_2$ là “xạ thủ thứ nhất, thứ hai bắn trúng”. Biểu diễn “có đúng một người bắn trúng” và “có ít nhất một người bắn trúng”.
g: Đúng một người trúng: $A_1\overline{A_2}\cup\overline{A_1}A_2$.
g: Ít nhất một người trúng: $A_1\cup A_2$.
# Kiểm tra độc lập bằng tính toán
p: $A$, $B$ độc lập $\Leftrightarrow P(AB)=P(A)P(B)$.
d: Gieo một xúc xắc. $A$: “số chấm chẵn”, $B$: “số chấm không quá $2$”. $A$, $B$ có độc lập không?
g: $P(A)=\dfrac12$, $P(B)=\dfrac13$, $AB=\{2\}$ nên $P(AB)=\dfrac16$.
g: $P(AB)=P(A)P(B)$ nên $A$, $B$ độc lập.

@29
m: $P(A\cup B)=P(A)+P(B)-P(AB)$ ;; Xung khắc: $P(A\cup B)=P(A)+P(B)$ ;; $P(\overline A)=1-P(A)$ ;; Dùng sơ đồ Ven để đọc xác suất
# Cộng xác suất hai biến cố xung khắc
p: Hai biến cố không thể cùng xảy ra thì cộng xác suất.
d: Hộp có $3$ bi đỏ, $5$ bi xanh, $2$ bi vàng. Lấy ngẫu nhiên một bi. Tính xác suất được bi đỏ hoặc vàng.
g: $P(\text{Đ})=\dfrac3{10}$, $P(V)=\dfrac2{10}$, hai biến cố xung khắc.
g: $P=\dfrac5{10}=\dfrac12$.
# Công thức cộng tổng quát
p: Trừ đi phần giao bị đếm hai lần.
d: Lớp $40$ bạn: $20$ thích bóng đá, $15$ thích cầu lông, $8$ thích cả hai. Chọn ngẫu nhiên một bạn; tính xác suất bạn đó thích ít nhất một môn.
g: $P(A\cup B)=\dfrac{20}{40}+\dfrac{15}{40}-\dfrac8{40}$.
g: $=\dfrac{27}{40}$.
# Rút thẻ chia hết
p: Đếm số chia hết cho từng số và cho bội chung nhỏ nhất.
d: Rút ngẫu nhiên một thẻ từ $30$ thẻ đánh số $1$ đến $30$. Tính xác suất số đó chia hết cho $2$ hoặc $3$.
g: Chia hết cho $2$: $15$; cho $3$: $10$; cho $6$: $5$.
g: $P=\dfrac{15+10-5}{30}=\dfrac23$.
# Tính xác suất giao từ công thức cộng
p: $P(AB)=P(A)+P(B)-P(A\cup B)$.
d: Cho $P(A)=0{,}5$, $P(B)=0{,}4$, $P(A\cup B)=0{,}7$. Tính $P(AB)$ và xác suất chỉ $A$ xảy ra.
g: $P(AB)=0{,}5+0{,}4-0{,}7=0{,}2$.
g: Chỉ $A$: $P(A)-P(AB)=0{,}3$.
# Gieo hai xúc xắc
p: Đếm trên bảng $36$ kết quả, dùng công thức cộng.
d: Gieo hai xúc xắc. Tính xác suất có ít nhất một mặt $6$ hoặc tổng số chấm bằng $7$.
g: $P(A)=\dfrac{11}{36}$ (ít nhất một mặt $6$), $P(B)=\dfrac6{36}$; $AB=\{(1;6),(6;1)\}$: $P(AB)=\dfrac2{36}$.
g: $P(A\cup B)=\dfrac{15}{36}=\dfrac5{12}$.

@30
m: $A$, $B$ độc lập $\Leftrightarrow P(AB)=P(A)\cdot P(B)$ ;; $A$, $B$ độc lập thì $\overline A$ và $B$, $A$ và $\overline B$, $\overline A$ và $\overline B$ cũng độc lập ;; “Ít nhất một”: $1-P(\overline A)P(\overline B)$ ;; Kết hợp công thức cộng và nhân
# Xác suất cả hai cùng xảy ra
p: Nhân xác suất của hai biến cố độc lập.
d: Hai xạ thủ bắn độc lập với xác suất trúng $0{,}8$ và $0{,}7$. Tính xác suất cả hai cùng trúng.
g: $P(A_1A_2)=0{,}8\cdot0{,}7$.
g: $=0{,}56$.
# Đúng một biến cố xảy ra
p: Tách thành hai trường hợp xung khắc rồi cộng.
d: Với hai xạ thủ trên, tính xác suất có đúng một người bắn trúng.
g: $P=0{,}8\cdot0{,}3+0{,}2\cdot0{,}7$.
g: $=0{,}24+0{,}14=0{,}38$.
# Ít nhất một biến cố xảy ra
p: Dùng biến cố đối “không ai trúng”.
d: Với hai xạ thủ trên, tính xác suất có ít nhất một người bắn trúng.
g: $P(\text{không ai trúng})=0{,}2\cdot0{,}3=0{,}06$.
g: $P=1-0{,}06=0{,}94$.
# Kiểm tra tính độc lập
p: So sánh $P(AB)$ với $P(A)P(B)$.
d: Cho $P(A)=0{,}4$, $P(B)=0{,}5$, $P(AB)=0{,}2$. Hai biến cố có độc lập không?
g: $P(A)P(B)=0{,}2=P(AB)$.
g: $A$ và $B$ độc lập.
# Nhiều phép thử độc lập
p: Nhân xác suất của các lần thử độc lập.
d: Một bài thi có $4$ câu, mỗi câu có $4$ phương án và chỉ một phương án đúng. Bạn An chọn ngẫu nhiên tất cả. Tính xác suất An đúng cả $4$ câu và sai cả $4$ câu.
g: Đúng cả $4$: $\left(\dfrac14\right)^4=\dfrac1{256}$.
g: Sai cả $4$: $\left(\dfrac34\right)^4=\dfrac{81}{256}$.

@31
m: $f'(x_0)=\lim\limits_{x\to x_0}\dfrac{f(x)-f(x_0)}{x-x_0}$ ;; Tiếp tuyến tại $M(x_0;y_0)$: $y=f'(x_0)(x-x_0)+y_0$ ;; Hệ số góc tiếp tuyến $k=f'(x_0)$ ;; Vận tốc tức thời $v(t)=s'(t)$
# Tính đạo hàm bằng định nghĩa
p: Lập tỉ số $\dfrac{f(x)-f(x_0)}{x-x_0}$, rút gọn rồi tính giới hạn.
d: Tính đạo hàm của $f(x)=x^2$ tại $x_0=3$ bằng định nghĩa.
g: $\dfrac{x^2-9}{x-3}=x+3$.
g: $f'(3)=\lim\limits_{x\to3}(x+3)=6$.
# Hệ số góc tiếp tuyến
p: $k=f'(x_0)$.
d: Tính hệ số góc tiếp tuyến của đồ thị $y=x^3$ tại điểm có hoành độ $x_0=1$.
g: $y'=3x^2$.
g: $k=y'(1)=3$.
# Phương trình tiếp tuyến tại một điểm
p: Tính $y_0$, $f'(x_0)$, thay vào $y=f'(x_0)(x-x_0)+y_0$.
d: Viết phương trình tiếp tuyến của $y=x^2$ tại $M(1;1)$.
g: $y'=2x$, $y'(1)=2$.
g: $y=2(x-1)+1=2x-1$.
# Tiếp tuyến biết hệ số góc
p: Giải $f'(x_0)=k$ để tìm tiếp điểm.
d: Viết phương trình tiếp tuyến của $y=x^2$ có hệ số góc bằng $4$.
g: $2x_0=4\Rightarrow x_0=2$, $y_0=4$.
g: $y=4(x-2)+4=4x-4$.
# Vận tốc tức thời
p: $v(t)=s'(t)$.
d: Một vật rơi tự do có quãng đường $s(t)=5t^2$ (m). Tính vận tốc tức thời tại $t=3$ s.
g: $v(t)=s'(t)=10t$.
g: $v(3)=30$ m/s.

@32
m: $(u\pm v)'=u'\pm v'$, $(uv)'=u'v+uv'$, $\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}$ ;; Hàm hợp: $[f(u)]'=f'(u)\cdot u'$ ;; $(\sin x)'=\cos x$, $(\cos x)'=-\sin x$, $(\tan x)'=\dfrac1{\cos^2x}$ ;; $(e^x)'=e^x$, $(\ln x)'=\dfrac1x$, $(\sqrt x)'=\dfrac1{2\sqrt x}$
# Đạo hàm đa thức
p: Dùng $(x^n)'=nx^{n-1}$ và quy tắc tổng.
d: Tính đạo hàm của $y=x^3-3x^2+2x-5$.
g: $y'=3x^2-6x+2$.
# Đạo hàm của thương
p: $\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}$.
d: Tính đạo hàm của $y=\dfrac{2x+1}{x-1}$.
g: $y'=\dfrac{2(x-1)-(2x+1)}{(x-1)^2}$.
g: $y'=\dfrac{-3}{(x-1)^2}$.
# Đạo hàm hàm hợp
p: Đạo hàm hàm ngoài nhân đạo hàm hàm trong.
d: Tính đạo hàm của $y=\sqrt{x^2+1}$ và $y=(2x-1)^5$.
g: $\left(\sqrt{x^2+1}\right)'=\dfrac{2x}{2\sqrt{x^2+1}}=\dfrac x{\sqrt{x^2+1}}$.
g: $\left[(2x-1)^5\right]'=5(2x-1)^4\cdot2=10(2x-1)^4$.
# Đạo hàm hàm lượng giác
p: Kết hợp công thức đạo hàm lượng giác với hàm hợp.
d: Tính đạo hàm của $y=\sin2x+\cos^2x$.
g: $(\sin2x)'=2\cos2x$; $(\cos^2x)'=2\cos x(-\sin x)=-\sin2x$.
g: $y'=2\cos2x-\sin2x$.
# Đạo hàm hàm mũ, lôgarit
p: $(e^u)'=u'e^u$; $(\ln u)'=\dfrac{u'}u$.
d: Tính đạo hàm của $y=xe^{2x}$ và $y=\ln(x^2+1)$.
g: $(xe^{2x})'=e^{2x}+2xe^{2x}=(1+2x)e^{2x}$.
g: $\left[\ln(x^2+1)\right]'=\dfrac{2x}{x^2+1}$.

@33
m: $f''(x)=[f'(x)]'$ ;; Gia tốc tức thời $a(t)=v'(t)=s''(t)$ ;; $(\sin ax)''=-a^2\sin ax$ ;; Tính $f'$ rồi đạo hàm tiếp
# Đạo hàm cấp hai của đa thức
p: Tính $y'$ rồi đạo hàm thêm một lần.
d: Tính $y''$ của $y=x^4-2x^2$.
g: $y'=4x^3-4x$.
g: $y''=12x^2-4$.
# Đạo hàm cấp hai của hàm lượng giác
p: Dùng đạo hàm hàm hợp hai lần.
d: Tính $y''$ của $y=\sin3x$.
g: $y'=3\cos3x$.
g: $y''=-9\sin3x$.
# Giá trị đạo hàm cấp hai tại một điểm
p: Tính $f''(x)$ rồi thay $x_0$.
d: Cho $y=\dfrac1{x+1}$. Tính $y''(1)$.
g: $y'=-\dfrac1{(x+1)^2}$, $y''=\dfrac2{(x+1)^3}$.
g: $y''(1)=\dfrac28=\dfrac14$.
# Gia tốc tức thời
p: $a(t)=s''(t)$.
d: Một vật chuyển động theo $s(t)=t^3-3t^2+5t$ (m). Tính gia tốc tại $t=2$ s.
g: $v(t)=3t^2-6t+5$, $a(t)=6t-6$.
g: $a(2)=6$ m/s$^2$.
# Chứng minh hệ thức chứa đạo hàm
p: Tính $y'$, $y''$ rồi thay vào hệ thức.
d: Cho $y=\cos2x$. Chứng minh $y''+4y=0$.
g: $y'=-2\sin2x$, $y''=-4\cos2x$.
g: $y''+4y=-4\cos2x+4\cos2x=0$.
`;
