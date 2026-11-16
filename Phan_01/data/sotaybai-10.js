/* Sổ tay theo bài – Toán 10 (KNTT): ý chính cho sơ đồ tư duy (m:) và 5 dạng bài tập tiêu biểu có giải mẫu.
   Cú pháp: @số bài · m: ý 1 ;; ý 2 · # Tên dạng · p: phương pháp · d: đề · g: từng bước lời giải. Công thức trong $…$ */
(window.SOTAYBAI = window.SOTAYBAI || {})[10] = String.raw`
@1
m: Mệnh đề: khẳng định đúng hoặc sai ;; $P\Rightarrow Q$ chỉ sai khi $P$ đúng, $Q$ sai ;; $P\Leftrightarrow Q$: điều kiện cần và đủ ;; $\overline{\forall x, P(x)}$ là $\exists x, \overline{P(x)}$
# Nhận biết mệnh đề, xét tính đúng sai
p: Câu khẳng định có tính đúng hoặc sai xác định là mệnh đề; câu hỏi, câu cảm thán, câu mệnh lệnh không phải mệnh đề.
d: Câu nào là mệnh đề? Xét tính đúng sai: a) “$2023$ chia hết cho $7$”; b) “Bạn đã học bài chưa?”; c) “$\sqrt2$ là số hữu tỉ”.
g: a) Là mệnh đề. Vì $2023=7\cdot289$ nên mệnh đề đúng.
g: b) Là câu hỏi nên không phải mệnh đề.
g: c) Là mệnh đề; $\sqrt2$ là số vô tỉ nên mệnh đề sai.
# Lập mệnh đề phủ định
p: Thêm (hoặc bớt) chữ “không” trước vị ngữ; với bất đẳng thức thì đổi $>$ thành $\le$, $=$ thành $\ne$, …
d: Phát biểu mệnh đề phủ định và xét tính đúng sai: a) $P$: “$\pi>3{,}15$”; b) $Q$: “$12$ là số nguyên tố”.
g: a) $\overline{P}$: “$\pi\le3{,}15$”. Vì $\pi\approx3{,}1416$ nên $\overline P$ đúng.
g: b) $\overline{Q}$: “$12$ không là số nguyên tố”. Mệnh đề $\overline Q$ đúng vì $12=3\cdot4$.
# Mệnh đề kéo theo, mệnh đề đảo, điều kiện cần – đủ
p: $P\Rightarrow Q$: “Nếu $P$ thì $Q$”; $P$ là điều kiện đủ để có $Q$, $Q$ là điều kiện cần để có $P$. Mệnh đề đảo là $Q\Rightarrow P$.
d: Cho $P$: “Tứ giác $ABCD$ là hình chữ nhật”, $Q$: “Tứ giác $ABCD$ có hai đường chéo bằng nhau”. Phát biểu $P\Rightarrow Q$, mệnh đề đảo và xét tính đúng sai.
g: $P\Rightarrow Q$: “Nếu $ABCD$ là hình chữ nhật thì hai đường chéo bằng nhau” — đúng.
g: Mệnh đề đảo $Q\Rightarrow P$: “Nếu $ABCD$ có hai đường chéo bằng nhau thì là hình chữ nhật” — sai (hình thang cân).
g: Phát biểu dạng điều kiện: “$ABCD$ là hình chữ nhật là điều kiện đủ để $ABCD$ có hai đường chéo bằng nhau”.
# Mệnh đề tương đương
p: $P\Leftrightarrow Q$ đúng khi cả $P\Rightarrow Q$ và $Q\Rightarrow P$ đều đúng; đọc là “$P$ khi và chỉ khi $Q$”.
d: Xét tính đúng sai của $P\Leftrightarrow Q$ với $P$: “Tam giác $ABC$ vuông tại $A$”, $Q$: “$BC^2=AB^2+AC^2$”.
g: $P\Rightarrow Q$ đúng (định lí Pythagore).
g: $Q\Rightarrow P$ đúng (định lí Pythagore đảo).
g: Vậy $P\Leftrightarrow Q$ đúng: “Tam giác $ABC$ vuông tại $A$ khi và chỉ khi $BC^2=AB^2+AC^2$”.
# Mệnh đề chứa kí hiệu $\forall$, $\exists$
p: Phủ định của “$\forall x, P(x)$” là “$\exists x, \overline{P(x)}$”; phủ định của “$\exists x, P(x)$” là “$\forall x, \overline{P(x)}$”.
d: Xét tính đúng sai và lập mệnh đề phủ định của $A$: “$\exists x\in\mathbb R,\ x^2-2x+2=0$”.
g: Ta có $x^2-2x+2=(x-1)^2+1\ge1>0$ với mọi $x$ nên không có $x$ nào thỏa mãn: $A$ sai.
g: $\overline A$: “$\forall x\in\mathbb R,\ x^2-2x+2\ne0$” — mệnh đề đúng.

@2
m: $A\cap B$, $A\cup B$, $A\setminus B$, $C_EA$ ;; Tập có $n$ phần tử có $2^n$ tập con ;; Khoảng, đoạn, nửa khoảng trên trục số ;; $n(A\cup B)=n(A)+n(B)-n(A\cap B)$
# Liệt kê phần tử của tập hợp
p: Giải điều kiện đặc trưng rồi chọn các phần tử thuộc tập số đã cho ($\mathbb N$, $\mathbb Z$, …).
d: Liệt kê các phần tử của $A=\{x\in\mathbb Z\mid x^2-3x-4\le0\}$.
g: $x^2-3x-4\le0\Leftrightarrow (x+1)(x-4)\le0\Leftrightarrow -1\le x\le4$.
g: Vì $x\in\mathbb Z$ nên $A=\{-1;0;1;2;3;4\}$.
# Tập con – đếm số tập con
p: Liệt kê theo số phần tử $0,1,2,\dots$; tập có $n$ phần tử có $2^n$ tập con.
d: Viết tất cả các tập con của $A=\{1;2;3\}$.
g: Tập con có $0$ phần tử: $\varnothing$; có $1$ phần tử: $\{1\},\{2\},\{3\}$.
g: Có $2$ phần tử: $\{1;2\},\{1;3\},\{2;3\}$; có $3$ phần tử: $\{1;2;3\}$.
g: Tổng cộng $8=2^3$ tập con.
# Phép toán trên tập hợp liệt kê
p: Giao: phần tử chung; hợp: gộp tất cả (không lặp); hiệu $A\setminus B$: thuộc $A$ nhưng không thuộc $B$.
d: Cho $A=\{1;2;3;4;5\}$, $B=\{2;4;6;8\}$. Tìm $A\cap B$, $A\cup B$, $A\setminus B$, $B\setminus A$.
g: $A\cap B=\{2;4\}$; $A\cup B=\{1;2;3;4;5;6;8\}$.
g: $A\setminus B=\{1;3;5\}$; $B\setminus A=\{6;8\}$.
# Phép toán trên khoảng, đoạn
p: Biểu diễn các tập trên cùng một trục số, gạch bỏ phần không thuộc, đọc kết quả (chú ý đầu mút đóng/mở).
d: Cho $A=[-1;3)$, $B=(1;5]$. Tìm $A\cap B$, $A\cup B$, $A\setminus B$, $C_{\mathbb R}A$.
g: $A\cap B=(1;3)$; $A\cup B=[-1;5]$.
g: $A\setminus B=[-1;1]$ (điểm $1$ không thuộc $B$ nên thuộc hiệu).
g: $C_{\mathbb R}A=(-\infty;-1)\cup[3;+\infty)$.
# Bài toán đếm bằng biểu đồ Ven
p: Gọi tập hợp theo đặc điểm, dùng $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.
d: Lớp có $40$ học sinh, $25$ bạn thích Toán, $20$ bạn thích Văn, $8$ bạn không thích môn nào. Có bao nhiêu bạn thích cả hai môn?
g: Số bạn thích ít nhất một môn: $n(T\cup V)=40-8=32$.
g: $n(T\cap V)=n(T)+n(V)-n(T\cup V)=25+20-32=13$ bạn.

@3
m: Dạng $ax+by<c$ ($a^2+b^2\ne0$) ;; Miền nghiệm là một nửa mặt phẳng ;; Thay điểm $O(0;0)$ để chọn nửa mặt phẳng ;; Dấu $<,>$: bờ nét đứt; $\le,\ge$: lấy bờ
# Nhận biết bất phương trình bậc nhất hai ẩn
p: Có dạng $ax+by+c<0$ (hoặc $>,\le,\ge$) với $a,b$ không đồng thời bằng $0$; không chứa $x^2$, $xy$, …
d: Bất phương trình nào là bất phương trình bậc nhất hai ẩn: $2x-3y>1$; $x^2+y\le2$; $3x\ge0$?
g: $2x-3y>1$: có, $a=2$, $b=-3$.
g: $x^2+y\le2$: không vì chứa $x^2$.
g: $3x\ge0$: có (xem như $3x+0y\ge0$).
# Kiểm tra một điểm có thuộc miền nghiệm
p: Thay toạ độ điểm vào bất phương trình; nếu được bất đẳng thức đúng thì điểm thuộc miền nghiệm.
d: Điểm nào thuộc miền nghiệm của $2x+y\le4$: $A(1;1)$, $B(2;3)$, $C(0;4)$?
g: $A$: $2+1=3\le4$ đúng — thuộc.
g: $B$: $4+3=7\le4$ sai — không thuộc.
g: $C$: $0+4=4\le4$ đúng — thuộc (nằm trên bờ).
# Biểu diễn miền nghiệm
p: Vẽ đường thẳng bờ $ax+by=c$; thay một điểm không thuộc bờ (thường là $O$) để xác định nửa mặt phẳng nghiệm.
d: Biểu diễn miền nghiệm của $x+2y<4$.
g: Vẽ $d: x+2y=4$ qua $(4;0)$ và $(0;2)$ bằng nét đứt.
g: Thay $O(0;0)$: $0<4$ đúng nên miền nghiệm là nửa mặt phẳng bờ $d$ chứa $O$ (không kể bờ).
# Lập bất phương trình từ bài toán thực tế
p: Gọi ẩn cho số lượng hai loại; viết ràng buộc “không quá”, “ít nhất” thành $\le$, $\ge$.
d: Bút giá $5$ nghìn đồng, vở giá $8$ nghìn đồng. Lan có không quá $100$ nghìn đồng. Lập bất phương trình biểu thị số bút $x$ và số vở $y$ Lan mua được. Lan mua $4$ bút và $10$ vở được không?
g: Số tiền: $5x+8y$ (nghìn đồng). Ta có $5x+8y\le100$, $x,y\in\mathbb N$.
g: Với $x=4$, $y=10$: $20+80=100\le100$ — mua được.
# Xác định bất phương trình khi biết miền nghiệm
p: Lập phương trình bờ qua hai điểm; dùng một điểm trong miền để chọn dấu.
d: Miền nghiệm (kể cả bờ) là nửa mặt phẳng chứa $O$, có bờ đi qua $(2;0)$ và $(0;3)$. Tìm bất phương trình.
g: Bờ: $\dfrac x2+\dfrac y3=1\Leftrightarrow 3x+2y=6$.
g: Tại $O$: $0\le6$ nên bất phương trình là $3x+2y\le6$.

@4
m: Miền nghiệm của hệ là giao các miền nghiệm ;; Miền nghiệm thường là một đa giác ;; $F=ax+by$ đạt GTLN, GTNN tại một đỉnh ;; Bài toán tối ưu: lập hệ ràng buộc rồi xét các đỉnh
# Kiểm tra nghiệm của hệ
p: Một cặp số là nghiệm của hệ khi thỏa mãn đồng thời mọi bất phương trình của hệ.
d: Cho hệ $x+y\le4$, $2x-y\ge1$, $y\ge0$. Các điểm $M(1;1)$, $N(3;2)$ có là nghiệm không?
g: $M$: $2\le4$; $1\ge1$; $1\ge0$ — đều đúng nên $M$ là nghiệm.
g: $N$: $3+2=5\le4$ sai nên $N$ không là nghiệm.
# Biểu diễn miền nghiệm của hệ
p: Biểu diễn từng miền nghiệm trên cùng một hệ trục, gạch bỏ phần không thuộc; phần còn lại là miền nghiệm.
d: Biểu diễn miền nghiệm của hệ $x\ge0$, $y\ge0$, $x+y\le3$.
g: $x\ge0$, $y\ge0$: góc phần tư thứ nhất (kể cả hai trục).
g: $x+y\le3$: nửa mặt phẳng bờ $x+y=3$ chứa $O$.
g: Miền nghiệm là tam giác $OAB$ với $A(3;0)$, $B(0;3)$ (kể cả cạnh).
# Tìm GTLN, GTNN của $F=ax+by$ trên miền đa giác
p: Xác định các đỉnh của miền nghiệm, tính $F$ tại từng đỉnh rồi so sánh.
d: Tìm GTLN, GTNN của $F=2x+3y$ trên miền $x\ge0$, $y\ge0$, $x+y\le4$, $x+3y\le6$.
g: Các đỉnh: $O(0;0)$, $A(4;0)$, $C(0;2)$ và $B$ là giao của $x+y=4$, $x+3y=6$: $B(3;1)$.
g: $F(O)=0$, $F(A)=8$, $F(B)=9$, $F(C)=6$.
g: $\max F=9$ tại $(3;1)$; $\min F=0$ tại $(0;0)$.
# Bài toán tối ưu thực tế
p: Gọi ẩn, lập hệ ràng buộc (giờ máy, nguyên liệu, …), lập hàm mục tiêu và xét các đỉnh.
d: Một xưởng làm hai sản phẩm I, II. Mỗi sản phẩm I cần $2$ giờ máy A, $1$ giờ máy B, lãi $3$ triệu; sản phẩm II cần $1$ giờ máy A, $2$ giờ máy B, lãi $4$ triệu. Máy A chạy tối đa $10$ giờ, máy B tối đa $8$ giờ. Cần làm bao nhiêu sản phẩm mỗi loại để lãi nhiều nhất?
g: Gọi $x,y\ge0$ là số sản phẩm I, II: $2x+y\le10$, $x+2y\le8$. Lãi $L=3x+4y$.
g: Các đỉnh: $(0;0)$, $(5;0)$, $(4;2)$, $(0;4)$; $L$ lần lượt bằng $0$, $15$, $20$, $16$.
g: Làm $4$ sản phẩm I và $2$ sản phẩm II, lãi lớn nhất $20$ triệu đồng.
# Lập hệ khi biết miền nghiệm
p: Viết phương trình các cạnh; dùng một điểm nằm trong miền để chọn chiều bất đẳng thức.
d: Miền nghiệm là tam giác $OAB$ (kể cả cạnh) với $O(0;0)$, $A(2;0)$, $B(0;2)$. Viết hệ bất phương trình.
g: Các cạnh: $x=0$, $y=0$, $x+y=2$.
g: Điểm $(0{,}5;0{,}5)$ nằm trong miền nên hệ là $x\ge0$, $y\ge0$, $x+y\le2$.

@5
m: $\sin\alpha=y_0$, $\cos\alpha=x_0$ trên nửa đường tròn đơn vị ;; $\sin(180^\circ-\alpha)=\sin\alpha$, $\cos(180^\circ-\alpha)=-\cos\alpha$ ;; $\sin^2\alpha+\cos^2\alpha=1$ ;; $\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}$, $\cot\alpha=\dfrac{\cos\alpha}{\sin\alpha}$
# Tính giá trị lượng giác của góc đặc biệt
p: Dùng bảng giá trị góc đặc biệt và công thức góc bù $180^\circ-\alpha$.
d: Tính $A=\sin150^\circ+\cos120^\circ+\tan135^\circ$.
g: $\sin150^\circ=\sin30^\circ=\dfrac12$; $\cos120^\circ=-\cos60^\circ=-\dfrac12$; $\tan135^\circ=-\tan45^\circ=-1$.
g: $A=\dfrac12-\dfrac12-1=-1$.
# Rút gọn biểu thức có góc bù nhau
p: Ghép các cặp góc có tổng $180^\circ$: sin bằng nhau, cos đối nhau.
d: Rút gọn $B=\sin100^\circ+\sin80^\circ+\cos16^\circ+\cos164^\circ$.
g: $\sin100^\circ=\sin80^\circ$; $\cos164^\circ=-\cos16^\circ$.
g: $B=2\sin80^\circ$.
# Biết một giá trị lượng giác, tính các giá trị còn lại
p: Dùng $\sin^2\alpha+\cos^2\alpha=1$; xét dấu: với $90^\circ<\alpha<180^\circ$ thì $\cos\alpha<0$, $\tan\alpha<0$.
d: Cho $\sin\alpha=\dfrac35$ với $90^\circ<\alpha<180^\circ$. Tính $\cos\alpha$, $\tan\alpha$, $\cot\alpha$.
g: $\cos^2\alpha=1-\dfrac9{25}=\dfrac{16}{25}$, mà $\cos\alpha<0$ nên $\cos\alpha=-\dfrac45$.
g: $\tan\alpha=\dfrac{3/5}{-4/5}=-\dfrac34$; $\cot\alpha=-\dfrac43$.
# Tính biểu thức khi biết $\tan\alpha$
p: Chia cả tử và mẫu cho $\cos\alpha$ (hoặc $\cos^2\alpha$) để đưa về $\tan\alpha$.
d: Cho $\tan\alpha=2$. Tính $P=\dfrac{\sin\alpha+\cos\alpha}{\sin\alpha-\cos\alpha}$.
g: Chia tử và mẫu cho $\cos\alpha\ne0$: $P=\dfrac{\tan\alpha+1}{\tan\alpha-1}$.
g: $P=\dfrac{2+1}{2-1}=3$.
# Tìm góc khi biết giá trị lượng giác
p: Với $0^\circ\le\alpha\le180^\circ$: mỗi giá trị cos cho đúng một góc; sin dương cho hai góc bù nhau.
d: Tìm $\alpha\in[0^\circ;180^\circ]$ biết: a) $\cos\alpha=-\dfrac12$; b) $\sin\alpha=\dfrac{\sqrt3}2$.
g: a) $\cos\alpha=-\dfrac12\Rightarrow\alpha=120^\circ$.
g: b) $\sin\alpha=\dfrac{\sqrt3}2\Rightarrow\alpha=60^\circ$ hoặc $\alpha=120^\circ$.

@6
m: Định lí côsin: $a^2=b^2+c^2-2bc\cos A$ ;; Định lí sin: $\dfrac a{\sin A}=\dfrac b{\sin B}=\dfrac c{\sin C}=2R$ ;; $S=\dfrac12bc\sin A=\dfrac{abc}{4R}=pr$ ;; Hê-rông: $S=\sqrt{p(p-a)(p-b)(p-c)}$
# Tính cạnh bằng định lí côsin
p: Biết hai cạnh và góc xen giữa: $a^2=b^2+c^2-2bc\cos A$.
d: Tam giác $ABC$ có $b=3$, $c=5$, $\widehat A=120^\circ$. Tính $a$.
g: $a^2=9+25-2\cdot3\cdot5\cdot\cos120^\circ=34+15=49$.
g: $a=7$.
# Tính góc khi biết ba cạnh
p: $\cos A=\dfrac{b^2+c^2-a^2}{2bc}$; góc đối diện cạnh lớn nhất là góc lớn nhất.
d: Tam giác $ABC$ có $a=7$, $b=8$, $c=5$. Tính góc $A$.
g: $\cos A=\dfrac{64+25-49}{2\cdot8\cdot5}=\dfrac{40}{80}=\dfrac12$.
g: $\widehat A=60^\circ$.
# Định lí sin – tính cạnh, bán kính đường tròn ngoại tiếp
p: Biết một cạnh và hai góc: $\dfrac a{\sin A}=\dfrac b{\sin B}=2R$.
d: Tam giác $ABC$ có $\widehat A=60^\circ$, $\widehat B=45^\circ$, $a=\sqrt6$. Tính $b$ và $R$.
g: $b=\dfrac{a\sin B}{\sin A}=\dfrac{\sqrt6\cdot\frac{\sqrt2}2}{\frac{\sqrt3}2}=\dfrac{\sqrt{12}}{\sqrt3}=2$.
g: $R=\dfrac a{2\sin A}=\dfrac{\sqrt6}{\sqrt3}=\sqrt2$.
# Diện tích, bán kính nội – ngoại tiếp
p: Tính $p=\dfrac{a+b+c}2$, dùng Hê-rông; sau đó $R=\dfrac{abc}{4S}$, $r=\dfrac Sp$.
d: Tam giác có $a=13$, $b=14$, $c=15$. Tính $S$, $R$, $r$.
g: $p=21$; $S=\sqrt{21\cdot8\cdot7\cdot6}=\sqrt{7056}=84$.
g: $R=\dfrac{13\cdot14\cdot15}{4\cdot84}=\dfrac{65}8$; $r=\dfrac{84}{21}=4$.
# Bài toán đo khoảng cách thực tế
p: Đưa về tam giác biết hai cạnh và góc xen giữa (hoặc một cạnh, hai góc) rồi áp dụng định lí côsin (sin).
d: Hai điểm $A$, $B$ ở hai bên một hồ nước. Từ điểm $C$ đo được $CA=200$ m, $CB=300$ m, $\widehat{ACB}=60^\circ$. Tính $AB$.
g: $AB^2=200^2+300^2-2\cdot200\cdot300\cdot\cos60^\circ=70\,000$.
g: $AB=100\sqrt7\approx264{,}6$ m.

@7
m: Vectơ: đoạn thẳng có hướng, $|\vec{AB}|=AB$ ;; Cùng phương: giá song song hoặc trùng nhau ;; $\vec a=\vec b$: cùng hướng và cùng độ dài ;; Vectơ-không $\vec0$ cùng hướng với mọi vectơ
# Đếm số vectơ
p: Mỗi cặp có thứ tự (điểm đầu, điểm cuối) gồm hai điểm phân biệt cho một vectơ khác $\vec0$.
d: Cho ba điểm phân biệt $A$, $B$, $C$. Có bao nhiêu vectơ khác $\vec0$ có điểm đầu và điểm cuối là các điểm đó?
g: Các vectơ: $\vec{AB},\vec{BA},\vec{AC},\vec{CA},\vec{BC},\vec{CB}$.
g: Có $3\cdot2=6$ vectơ.
# Vectơ cùng phương, cùng hướng
p: Xét giá của các vectơ (song song hoặc trùng nhau) rồi so sánh hướng.
d: Cho hình bình hành $ABCD$. Tìm các vectơ (có điểm đầu, cuối là đỉnh) cùng hướng, ngược hướng với $\vec{AB}$.
g: $AB\parallel DC$ nên các vectơ cùng phương với $\vec{AB}$ là $\vec{BA},\vec{DC},\vec{CD}$.
g: Cùng hướng: $\vec{DC}$. Ngược hướng: $\vec{BA}$, $\vec{CD}$.
# Vectơ bằng nhau
p: Hai vectơ bằng nhau khi cùng hướng và cùng độ dài; dùng đường trung bình, hình bình hành.
d: Cho tam giác $ABC$ với $M$, $N$, $P$ lần lượt là trung điểm $AB$, $BC$, $CA$. Tìm các vectơ bằng $\vec{MN}$.
g: $MN$ là đường trung bình nên $MN\parallel AC$ và $MN=\dfrac12AC$; $\vec{MN}$ cùng hướng $\vec{AC}$.
g: Vậy $\vec{MN}=\vec{AP}=\vec{PC}$.
# Tính độ dài vectơ
p: $|\vec{AB}|=AB$; dùng định lí Pythagore, tính chất tam giác đều, hình vuông.
d: Cho tam giác đều $ABC$ cạnh $a$, $H$ là trung điểm $BC$. Tính $|\vec{AB}|$, $|\vec{AH}|$.
g: $|\vec{AB}|=AB=a$.
g: $AH$ là đường cao tam giác đều nên $|\vec{AH}|=\dfrac{a\sqrt3}2$.
# Chứng minh hai vectơ bằng nhau
p: $ABCD$ là hình bình hành $\Leftrightarrow\vec{AB}=\vec{DC}$.
d: Cho hình bình hành $ABCD$; $M$, $N$ là trung điểm $AB$, $DC$. Chứng minh $\vec{AM}=\vec{NC}$.
g: $AM=\dfrac12AB$, $NC=\dfrac12DC$ mà $AB=DC$ nên $AM=NC$.
g: $\vec{AM}$ cùng hướng $\vec{AB}$, $\vec{NC}$ cùng hướng $\vec{DC}$, mà $\vec{AB}=\vec{DC}$, nên $\vec{AM}=\vec{NC}$.

@8
m: Ba điểm: $\vec{AB}+\vec{BC}=\vec{AC}$ ;; Hình bình hành: $\vec{AB}+\vec{AD}=\vec{AC}$ ;; Hiệu: $\vec{OB}-\vec{OA}=\vec{AB}$ ;; Trung điểm $\vec{IA}+\vec{IB}=\vec0$; trọng tâm $\vec{GA}+\vec{GB}+\vec{GC}=\vec0$
# Rút gọn tổng vectơ
p: Sắp xếp các vectơ “nối đuôi” rồi dùng quy tắc ba điểm.
d: Rút gọn $\vec u=\vec{AB}+\vec{CD}+\vec{BC}+\vec{DA}$.
g: $\vec u=\vec{AB}+\vec{BC}+\vec{CD}+\vec{DA}=\vec{AA}=\vec0$.
# Chứng minh đẳng thức vectơ
p: Biến đổi một vế (chèn điểm bằng quy tắc ba điểm) cho đến khi được vế còn lại.
d: Chứng minh với bốn điểm bất kì: $\vec{AB}+\vec{CD}=\vec{AD}+\vec{CB}$.
g: $\vec{AB}=\vec{AD}+\vec{DB}$, $\vec{CD}=\vec{CB}+\vec{BD}$.
g: Cộng lại: $\vec{AB}+\vec{CD}=\vec{AD}+\vec{CB}+(\vec{DB}+\vec{BD})=\vec{AD}+\vec{CB}$.
# Tính độ dài của tổng, hiệu
p: Dựng vectơ tổng (hiệu) thành một vectơ duy nhất rồi tính độ dài đoạn thẳng.
d: Tam giác đều $ABC$ cạnh $a$. Tính $|\vec{AB}+\vec{AC}|$ và $|\vec{AB}-\vec{AC}|$.
g: Gọi $M$ trung điểm $BC$: $\vec{AB}+\vec{AC}=2\vec{AM}$, nên $|\vec{AB}+\vec{AC}|=2\cdot\dfrac{a\sqrt3}2=a\sqrt3$.
g: $\vec{AB}-\vec{AC}=\vec{CB}$ nên $|\vec{AB}-\vec{AC}|=a$.
# Tổng hợp lực
p: Hợp lực là tổng vectơ; với hai lực vuông góc dùng định lí Pythagore.
d: Hai lực $\vec{F_1}$, $\vec{F_2}$ cùng tác dụng vào một vật, vuông góc với nhau, có độ lớn $3$ N và $4$ N. Tính độ lớn hợp lực.
g: Hợp lực là đường chéo hình chữ nhật dựng trên hai lực.
g: $|\vec F|=\sqrt{3^2+4^2}=5$ N.
# Trung điểm, trọng tâm
p: Dùng $\vec{IA}+\vec{IB}=\vec0$, $\vec{GA}+\vec{GB}+\vec{GC}=\vec0$ sau khi chèn điểm.
d: $G$ là trọng tâm tam giác $ABC$. Chứng minh với mọi $M$: $\vec{MA}+\vec{MB}+\vec{MC}=3\vec{MG}$.
g: $\vec{MA}+\vec{MB}+\vec{MC}=(\vec{MG}+\vec{GA})+(\vec{MG}+\vec{GB})+(\vec{MG}+\vec{GC})$.
g: $=3\vec{MG}+(\vec{GA}+\vec{GB}+\vec{GC})=3\vec{MG}$.

@9
m: $k\vec a$ cùng hướng $\vec a$ khi $k>0$, ngược hướng khi $k<0$ ;; $|k\vec a|=|k|\cdot|\vec a|$ ;; $A,B,C$ thẳng hàng $\Leftrightarrow\vec{AB}=k\vec{AC}$ ;; $M$ trung điểm $BC$: $\vec{AM}=\dfrac12(\vec{AB}+\vec{AC})$
# Biểu diễn vectơ theo một vectơ cùng phương
p: So sánh hướng và tỉ số độ dài để tìm $k$.
d: $I$ là trung điểm $AB$. Biểu diễn $\vec{AB}$ và $\vec{IA}$ theo $\vec{AI}$.
g: $\vec{AB}$ cùng hướng $\vec{AI}$ và dài gấp đôi: $\vec{AB}=2\vec{AI}$.
g: $\vec{IA}$ ngược hướng, cùng độ dài: $\vec{IA}=-\vec{AI}$.
# Phân tích vectơ theo hai vectơ không cùng phương
p: Dùng quy tắc ba điểm, trung điểm, trọng tâm để đưa về $\vec{AB}$, $\vec{AC}$.
d: Tam giác $ABC$ có $M$ là trung điểm $BC$, $G$ là trọng tâm. Phân tích $\vec{AM}$, $\vec{AG}$ theo $\vec{AB}$, $\vec{AC}$.
g: $\vec{AM}=\dfrac12(\vec{AB}+\vec{AC})$.
g: $\vec{AG}=\dfrac23\vec{AM}=\dfrac13(\vec{AB}+\vec{AC})$.
# Chứng minh ba điểm thẳng hàng
p: Chỉ ra $\vec{AB}=k\vec{AC}$ (hoặc hai vectơ chung điểm đầu cùng phương).
d: Cho bốn điểm $O,A,B,C$ thỏa $\vec{OA}+2\vec{OB}-3\vec{OC}=\vec0$. Chứng minh $A$, $B$, $C$ thẳng hàng.
g: Viết lại: $(\vec{OA}-\vec{OC})+2(\vec{OB}-\vec{OC})=\vec0\Rightarrow\vec{CA}+2\vec{CB}=\vec0$.
g: $\vec{CA}=-2\vec{CB}$ nên $\vec{CA}$, $\vec{CB}$ cùng phương: $A$, $B$, $C$ thẳng hàng.
# Xác định điểm thỏa đẳng thức vectơ
p: Chèn điểm cố định để đưa về dạng $\vec{AM}=k\vec{AB}$.
d: Cho đoạn thẳng $AB$. Xác định điểm $M$ thỏa $\vec{MA}+2\vec{MB}=\vec0$.
g: $\vec{MA}+2(\vec{MA}+\vec{AB})=\vec0\Rightarrow3\vec{MA}=-2\vec{AB}\Rightarrow\vec{AM}=\dfrac23\vec{AB}$.
g: $M$ thuộc đoạn $AB$ với $AM=\dfrac23AB$.
# Tập hợp điểm thỏa điều kiện về độ dài
p: Rút gọn mỗi vế thành một vectơ rồi đưa về độ dài đoạn thẳng.
d: Cho đoạn $AB$, $I$ là trung điểm. Tìm tập hợp điểm $M$ thỏa $|\vec{MA}+\vec{MB}|=|\vec{MA}-\vec{MB}|$.
g: $\vec{MA}+\vec{MB}=2\vec{MI}$; $\vec{MA}-\vec{MB}=\vec{BA}$.
g: Điều kiện: $2MI=AB\Leftrightarrow MI=\dfrac{AB}2$: tập hợp là đường tròn đường kính $AB$.

@10
m: $\vec{AB}=(x_B-x_A;\,y_B-y_A)$ ;; $|\vec a|=\sqrt{x^2+y^2}$ ;; Trung điểm $\left(\dfrac{x_A+x_B}2;\dfrac{y_A+y_B}2\right)$, trọng tâm chia $3$ ;; $\vec a\parallel\vec b\Leftrightarrow\dfrac{x}{x'}=\dfrac y{y'}$
# Toạ độ và độ dài vectơ
p: “Cuối trừ đầu”; độ dài $\sqrt{x^2+y^2}$.
d: Cho $A(1;2)$, $B(4;6)$. Tìm toạ độ $\vec{AB}$ và độ dài $AB$.
g: $\vec{AB}=(3;4)$.
g: $AB=\sqrt{9+16}=5$.
# Phép toán vectơ theo toạ độ
p: Cộng, trừ, nhân số theo từng toạ độ.
d: Cho $\vec a=(2;-1)$, $\vec b=(-3;4)$. Tính $2\vec a+\vec b$ và $\vec a-3\vec b$.
g: $2\vec a+\vec b=(4-3;-2+4)=(1;2)$.
g: $\vec a-3\vec b=(2+9;-1-12)=(11;-13)$.
# Trung điểm, trọng tâm
p: Trung điểm: trung bình cộng hai toạ độ; trọng tâm: trung bình cộng ba toạ độ.
d: Cho $A(1;3)$, $B(-2;1)$, $C(4;-1)$. Tìm trung điểm $I$ của $AB$ và trọng tâm $G$ của tam giác $ABC$.
g: $I\left(-\dfrac12;2\right)$.
g: $G\left(\dfrac{1-2+4}3;\dfrac{3+1-1}3\right)=(1;1)$.
# Tìm đỉnh thứ tư của hình bình hành
p: $ABCD$ là hình bình hành $\Leftrightarrow\vec{AD}=\vec{BC}$ (chú ý thứ tự đỉnh).
d: Cho $A(1;1)$, $B(3;2)$, $C(4;5)$. Tìm $D$ để $ABCD$ là hình bình hành.
g: $\vec{BC}=(1;3)$; $\vec{AD}=(x-1;y-1)$.
g: $\vec{AD}=\vec{BC}\Rightarrow D(2;4)$.
# Hai vectơ cùng phương – ba điểm thẳng hàng
p: $A,B,C$ thẳng hàng $\Leftrightarrow\vec{AB}$, $\vec{AC}$ cùng phương: toạ độ tỉ lệ.
d: Cho $A(1;2)$, $B(3;6)$, $C(m;10)$. Tìm $m$ để $A$, $B$, $C$ thẳng hàng.
g: $\vec{AB}=(2;4)$, $\vec{AC}=(m-1;8)$.
g: Cùng phương: $\dfrac{m-1}2=\dfrac84=2\Rightarrow m=5$.

@11
m: $\vec a\cdot\vec b=|\vec a||\vec b|\cos(\vec a,\vec b)$ ;; Toạ độ: $\vec a\cdot\vec b=xx'+yy'$ ;; $\vec a\perp\vec b\Leftrightarrow\vec a\cdot\vec b=0$ ;; $\cos(\vec a,\vec b)=\dfrac{xx'+yy'}{\sqrt{x^2+y^2}\sqrt{x'^2+y'^2}}$
# Tính tích vô hướng theo định nghĩa
p: Đưa hai vectơ về chung điểm đầu để xác định góc, rồi dùng $|\vec a||\vec b|\cos(\vec a,\vec b)$.
d: Tam giác đều $ABC$ cạnh $a$. Tính $\vec{AB}\cdot\vec{AC}$ và $\vec{AB}\cdot\vec{BC}$.
g: $(\vec{AB},\vec{AC})=60^\circ$ nên $\vec{AB}\cdot\vec{AC}=a^2\cos60^\circ=\dfrac{a^2}2$.
g: $(\vec{AB},\vec{BC})=180^\circ-60^\circ=120^\circ$ nên $\vec{AB}\cdot\vec{BC}=-\dfrac{a^2}2$.
# Tích vô hướng theo toạ độ
p: $\vec a\cdot\vec b=xx'+yy'$.
d: Cho $\vec a=(1;2)$, $\vec b=(3;-1)$. Tính $\vec a\cdot\vec b$ và $\vec a\cdot(\vec a+\vec b)$.
g: $\vec a\cdot\vec b=3-2=1$.
g: $\vec a+\vec b=(4;1)$; $\vec a\cdot(\vec a+\vec b)=4+2=6$.
# Góc giữa hai vectơ
p: $\cos(\vec a,\vec b)=\dfrac{\vec a\cdot\vec b}{|\vec a||\vec b|}$.
d: Tính góc giữa $\vec a=(1;3)$ và $\vec b=(2;1)$.
g: $\vec a\cdot\vec b=5$; $|\vec a|=\sqrt{10}$, $|\vec b|=\sqrt5$.
g: $\cos(\vec a,\vec b)=\dfrac5{\sqrt{50}}=\dfrac{\sqrt2}2\Rightarrow(\vec a,\vec b)=45^\circ$.
# Điều kiện vuông góc
p: $\vec a\perp\vec b\Leftrightarrow xx'+yy'=0$.
d: Tìm $m$ để $\vec a=(m;2)$ vuông góc với $\vec b=(3;-6)$.
g: $\vec a\cdot\vec b=3m-12=0$.
g: $m=4$.
# Ứng dụng: công của lực
p: Công $A=\vec F\cdot\vec d=|\vec F||\vec d|\cos\alpha$.
d: Kéo một thùng hàng đi $5$ m bằng lực $20$ N hợp với phương chuyển động góc $60^\circ$. Tính công của lực.
g: $A=20\cdot5\cdot\cos60^\circ$.
g: $A=50$ J.

@12
m: Sai số tuyệt đối $\Delta_a=|\bar a-a|\le d$ ;; Sai số tương đối $\delta_a\le\dfrac d{|a|}$ ;; Quy tròn đến hàng lớn hơn hàng của độ chính xác ;; Số đúng viết $\bar a=a\pm d$
# Ước lượng sai số tuyệt đối
p: $\Delta_a=|\bar a-a|$; nếu không biết số đúng thì dùng độ chính xác $d$ để chặn trên.
d: Lấy $1{,}41$ làm giá trị gần đúng của $\sqrt2=1{,}41421\ldots$ Ước lượng sai số tuyệt đối.
g: $\Delta=|\sqrt2-1{,}41|=0{,}00421\ldots$
g: Vậy $\Delta<0{,}005$.
# Quy tròn số gần đúng theo độ chính xác
p: Độ chính xác $d$ ở hàng nào thì quy tròn đến hàng lớn hơn liền kề.
d: Quy tròn số gần đúng $a=2{,}4637$ biết $\bar a=2{,}4637\pm0{,}01$.
g: $d=0{,}01$ ở hàng phần trăm nên quy tròn đến hàng phần mười.
g: Kết quả $a\approx2{,}5$.
# Sai số tương đối
p: $\delta_a=\dfrac{\Delta_a}{|a|}\le\dfrac d{|a|}$, thường viết dạng phần trăm.
d: Chiều dài một sân bóng đo được $\bar a=25\pm0{,}05$ (m). Ước lượng sai số tương đối.
g: $\delta\le\dfrac{0{,}05}{25}=0{,}002$.
g: Sai số tương đối không vượt quá $0{,}2\%$.
# So sánh độ chính xác của hai phép đo
p: Phép đo có sai số tương đối nhỏ hơn thì chính xác hơn.
d: Đo chiều cao cây: $150\pm0{,}5$ cm; đo chiều dài cuốn sách: $20\pm0{,}1$ cm. Phép đo nào chính xác hơn?
g: $\delta_1\le\dfrac{0{,}5}{150}\approx0{,}33\%$; $\delta_2\le\dfrac{0{,}1}{20}=0{,}5\%$.
g: Phép đo chiều cao cây chính xác hơn.
# Viết số quy tròn và ước lượng sai số
p: Quy tròn đến hàng cho trước; sai số tuyệt đối không vượt quá nửa đơn vị hàng quy tròn.
d: Quy tròn $\pi=3{,}14159\ldots$ đến hàng phần trăm và ước lượng sai số.
g: $\pi\approx3{,}14$.
g: Sai số $|\pi-3{,}14|\approx0{,}0016<0{,}005$.

@13
m: Số trung bình $\bar x=\dfrac{x_1+\dots+x_n}n$ ;; Trung vị: số đứng giữa dãy đã sắp xếp ;; Tứ phân vị $Q_1,Q_2,Q_3$ chia dãy thành bốn phần ;; Mốt: giá trị có tần số lớn nhất
# Tính số trung bình
p: Cộng các giá trị rồi chia cho cỡ mẫu.
d: Điểm kiểm tra của một nhóm: $6;7;7;8;9;10$. Tính điểm trung bình.
g: Tổng $=47$, $n=6$.
g: $\bar x=\dfrac{47}6\approx7{,}83$.
# Tìm trung vị
p: Sắp xếp tăng dần; $n$ lẻ lấy số chính giữa, $n$ chẵn lấy trung bình hai số giữa.
d: Tìm trung vị của mẫu ở trên: $6;7;7;8;9;10$.
g: $n=6$ chẵn, hai số giữa là $7$ và $8$.
g: $M_e=7{,}5$.
# Tìm các tứ phân vị
p: $Q_2$ là trung vị; $Q_1$ là trung vị nửa dưới, $Q_3$ là trung vị nửa trên.
d: Tìm tứ phân vị của mẫu $1;3;4;5;6;8;9;10$.
g: $Q_2=\dfrac{5+6}2=5{,}5$.
g: Nửa dưới $1;3;4;5$: $Q_1=3{,}5$; nửa trên $6;8;9;10$: $Q_3=8{,}5$.
# Tìm mốt
p: Mốt là giá trị có tần số lớn nhất (có thể có nhiều mốt).
d: Cỡ giày bán được: cỡ $38$ (5 đôi), $39$ (12 đôi), $40$ (9 đôi), $41$ (4 đôi). Tìm mốt và nêu ý nghĩa.
g: Tần số lớn nhất là $12$ ứng với cỡ $39$: $M_o=39$.
g: Cửa hàng nên nhập nhiều giày cỡ $39$ nhất.
# Trung bình từ bảng tần số
p: $\bar x=\dfrac{n_1x_1+\dots+n_kx_k}{n}$.
d: Điểm: $5$ (2 bạn), $6$ (5 bạn), $7$ (8 bạn), $8$ (4 bạn), $9$ (1 bạn). Tính điểm trung bình.
g: $n=20$; tổng điểm $=10+30+56+32+9=137$.
g: $\bar x=\dfrac{137}{20}=6{,}85$.

@14
m: Khoảng biến thiên $R=x_{\max}-x_{\min}$ ;; Khoảng tứ phân vị $\Delta_Q=Q_3-Q_1$ ;; Phương sai $s^2=\dfrac1n\sum x_i^2-\bar x^2$, độ lệch chuẩn $s=\sqrt{s^2}$ ;; Giá trị ngoại lệ: ngoài $[Q_1-1{,}5\Delta_Q;\,Q_3+1{,}5\Delta_Q]$
# Khoảng biến thiên
p: Lấy giá trị lớn nhất trừ giá trị nhỏ nhất.
d: Tìm khoảng biến thiên của mẫu $3;7;9;12;5$.
g: $x_{\max}=12$, $x_{\min}=3$.
g: $R=9$.
# Khoảng tứ phân vị
p: Tìm $Q_1$, $Q_3$ rồi lấy hiệu.
d: Tìm $\Delta_Q$ của mẫu $2;4;5;7;8;10;12;15$.
g: $Q_1=\dfrac{4+5}2=4{,}5$; $Q_3=\dfrac{10+12}2=11$.
g: $\Delta_Q=6{,}5$.
# Phương sai và độ lệch chuẩn
p: Tính $\bar x$, sau đó $s^2=\dfrac1n\sum(x_i-\bar x)^2$.
d: Tính phương sai, độ lệch chuẩn của $2;4;4;4;5;5;7;9$.
g: $\bar x=\dfrac{40}8=5$.
g: $\sum(x_i-5)^2=9+1+1+1+0+0+4+16=32$; $s^2=4$, $s=2$.
# Phát hiện giá trị ngoại lệ
p: Tính $Q_1$, $Q_3$, $\Delta_Q$ rồi so sánh với hai ngưỡng $Q_1-1{,}5\Delta_Q$ và $Q_3+1{,}5\Delta_Q$.
d: Mẫu $5;6;7;7;8;8;9;30$ có giá trị ngoại lệ không?
g: $Q_1=6{,}5$; $Q_3=8{,}5$; $\Delta_Q=2$.
g: Ngưỡng: $3{,}5$ và $11{,}5$. Giá trị $30>11{,}5$ là giá trị ngoại lệ.
# So sánh độ ổn định
p: Cùng số trung bình, mẫu có độ lệch chuẩn nhỏ hơn thì ổn định hơn.
d: Điểm ba lần bắn của An: $7;8;9$; của Bình: $6;8;10$. Ai bắn ổn định hơn?
g: Cả hai có $\bar x=8$; $s^2_{\text{An}}=\dfrac{1+0+1}3=\dfrac23$; $s^2_{\text{Bình}}=\dfrac{4+0+4}3=\dfrac83$.
g: $s_{\text{An}}<s_{\text{Bình}}$ nên An bắn ổn định hơn.

@15
m: Tập xác định $D$: giá trị $x$ làm biểu thức có nghĩa ;; Đồng biến: $x_1<x_2\Rightarrow f(x_1)<f(x_2)$ ;; Nghịch biến: $x_1<x_2\Rightarrow f(x_1)>f(x_2)$ ;; Đồ thị: tập điểm $(x;f(x))$
# Tìm tập xác định
p: Mẫu khác $0$; biểu thức dưới căn bậc hai không âm.
d: Tìm tập xác định của $y=\dfrac{\sqrt{x+2}}{x-3}$.
g: Điều kiện $x+2\ge0$ và $x-3\ne0$.
g: $D=[-2;+\infty)\setminus\{3\}$.
# Tính giá trị hàm cho bởi nhiều công thức
p: Xem $x$ thuộc khoảng nào thì dùng công thức tương ứng.
d: Cho $f(x)=2x+1$ khi $x\ge1$ và $f(x)=x^2-3$ khi $x<1$. Tính $f(2)$, $f(-1)$.
g: $2\ge1$: $f(2)=5$.
g: $-1<1$: $f(-1)=1-3=-2$.
# Điểm thuộc đồ thị
p: $M(x_0;y_0)$ thuộc đồ thị $\Leftrightarrow y_0=f(x_0)$.
d: Điểm nào thuộc đồ thị $y=x^2-2x$: $M(3;3)$, $N(-1;2)$?
g: $f(3)=9-6=3$ nên $M$ thuộc đồ thị.
g: $f(-1)=1+2=3\ne2$ nên $N$ không thuộc.
# Xét tính đồng biến, nghịch biến
p: Lấy $x_1<x_2$, xét dấu $f(x_1)-f(x_2)$ (hoặc tỉ số $\dfrac{f(x_2)-f(x_1)}{x_2-x_1}$).
d: Xét tính đơn điệu của $y=-2x+5$ trên $\mathbb R$.
g: Với $x_1<x_2$: $f(x_1)-f(x_2)=-2(x_1-x_2)>0$.
g: $f(x_1)>f(x_2)$ nên hàm số nghịch biến trên $\mathbb R$.
# Hàm số trong thực tế
p: Lập công thức theo từng khoảng giá trị rồi tính.
d: Giá taxi: km đầu tiên $12$ nghìn đồng, mỗi km tiếp theo $15$ nghìn đồng. Lập hàm số tiền theo quãng đường $x$ km và tính tiền đi $10$ km.
g: $f(x)=12$ khi $0<x\le1$; $f(x)=12+15(x-1)$ khi $x>1$.
g: $f(10)=12+135=147$ nghìn đồng.

@16
m: $y=ax^2+bx+c$, đỉnh $I\left(-\dfrac b{2a};-\dfrac\Delta{4a}\right)$ ;; Trục đối xứng $x=-\dfrac b{2a}$ ;; $a>0$: giảm rồi tăng; $a<0$: tăng rồi giảm ;; GTNN ($a>0$) hoặc GTLN ($a<0$) tại đỉnh
# Đỉnh, trục đối xứng
p: Hoành độ đỉnh $-\dfrac b{2a}$, tung độ thay vào hàm số.
d: Tìm đỉnh và trục đối xứng của parabol $y=x^2-4x+3$.
g: $x_I=\dfrac42=2$, $y_I=4-8+3=-1$: $I(2;-1)$.
g: Trục đối xứng $x=2$.
# Sự biến thiên, GTLN – GTNN
p: Dựa vào dấu của $a$ và hoành độ đỉnh để lập bảng biến thiên.
d: Lập bảng biến thiên và tìm GTLN của $y=-x^2+2x+3$.
g: $a=-1<0$, đỉnh $I(1;4)$.
g: Đồng biến trên $(-\infty;1)$, nghịch biến trên $(1;+\infty)$; GTLN bằng $4$ tại $x=1$.
# Vẽ đồ thị hàm bậc hai
p: Xác định đỉnh, trục, giao điểm với các trục, vài điểm đối xứng rồi nối thành parabol.
d: Vẽ đồ thị $y=x^2-2x-3$.
g: Đỉnh $I(1;-4)$; trục $x=1$; bề lõm hướng lên.
g: Cắt $Ox$ tại $(-1;0)$, $(3;0)$; cắt $Oy$ tại $(0;-3)$, điểm đối xứng $(2;-3)$.
# Xác định parabol
p: Dùng các dữ kiện (đi qua điểm, đỉnh, trục) lập hệ phương trình ẩn $a,b,c$.
d: Tìm $y=ax^2+bx+c$ biết đồ thị đi qua $A(0;3)$ và có đỉnh $I(1;2)$.
g: Qua $A$: $c=3$. Đỉnh $x=1$: $-\dfrac b{2a}=1\Rightarrow b=-2a$.
g: Qua $I$: $a+b+3=2\Rightarrow a-2a=-1\Rightarrow a=1$, $b=-2$. Vậy $y=x^2-2x+3$.
# Bài toán thực tế
p: Đại lượng cần tối ưu là hàm bậc hai; giá trị lớn nhất/nhỏ nhất ở đỉnh.
d: Độ cao quả bóng $h(t)=-5t^2+20t+1$ (m). Sau bao lâu bóng đạt độ cao lớn nhất? Độ cao đó bằng bao nhiêu?
g: $t=-\dfrac{20}{2\cdot(-5)}=2$ (giây).
g: $h(2)=-20+40+1=21$ m.

@17
m: $f(x)=ax^2+bx+c$, $\Delta=b^2-4ac$ ;; $\Delta<0$: $f(x)$ cùng dấu $a$ với mọi $x$ ;; $\Delta>0$: “trong trái, ngoài cùng” ;; $f(x)>0\ \forall x\Leftrightarrow a>0,\ \Delta<0$
# Xét dấu tam thức bậc hai
p: Tìm nghiệm, lập bảng xét dấu theo quy tắc “trong trái, ngoài cùng” dấu $a$.
d: Xét dấu $f(x)=x^2-5x+6$.
g: Nghiệm $x=2$, $x=3$; $a=1>0$.
g: $f(x)>0$ khi $x<2$ hoặc $x>3$; $f(x)<0$ khi $2<x<3$.
# Giải bất phương trình bậc hai
p: Xét dấu vế trái rồi chọn khoảng thỏa mãn.
d: Giải $-x^2+x+6\ge0$.
g: Nghiệm $x=-2$, $x=3$; $a=-1<0$ nên tam thức không âm giữa hai nghiệm.
g: Tập nghiệm $S=[-2;3]$.
# Bất phương trình tích, thương
p: Xét dấu từng nhân tử trên cùng bảng; mẫu khác $0$.
d: Giải $\dfrac{x^2-4}{x-1}\le0$.
g: Tử có nghiệm $\pm2$, mẫu bằng $0$ tại $x=1$. Lập bảng xét dấu.
g: Biểu thức $\le0$ khi $x\le-2$ hoặc $1<x\le2$: $S=(-\infty;-2]\cup(1;2]$.
# Tam thức không đổi dấu – tìm tham số
p: $ax^2+bx+c>0\ \forall x\Leftrightarrow a>0,\ \Delta<0$ (xét riêng trường hợp $a=0$ nếu $a$ chứa tham số).
d: Tìm $m$ để $x^2-2mx+m+2>0$ với mọi $x\in\mathbb R$.
g: $a=1>0$; cần $\Delta'=m^2-m-2<0$.
g: $-1<m<2$.
# Điều kiện có nghiệm của phương trình bậc hai
p: Hai nghiệm phân biệt $\Leftrightarrow\Delta>0$; có nghiệm $\Leftrightarrow\Delta\ge0$.
d: Tìm $m$ để $x^2-2x+m-3=0$ có hai nghiệm phân biệt.
g: $\Delta'=1-(m-3)=4-m>0$.
g: $m<4$.

@18
m: $\sqrt{f(x)}=\sqrt{g(x)}$: bình phương, giải, thử lại ;; $\sqrt{f(x)}=g(x)\Leftrightarrow g(x)\ge0,\ f(x)=g^2(x)$ ;; Luôn thử lại hoặc đặt điều kiện ;; Ẩn phụ $t=x^2$ đưa về bậc hai
# Phương trình $\sqrt{f(x)}=\sqrt{g(x)}$
p: Bình phương hai vế được $f(x)=g(x)$; giải rồi thử lại điều kiện $g(x)\ge0$.
d: Giải $\sqrt{2x^2-3x-1}=\sqrt{x+5}$.
g: Bình phương: $2x^2-4x-6=0\Leftrightarrow x^2-2x-3=0\Rightarrow x=-1$ hoặc $x=3$.
g: Thử lại: $x=-1$: $\sqrt4=\sqrt4$ ✓; $x=3$: $\sqrt8=\sqrt8$ ✓. Vậy $S=\{-1;3\}$.
# Phương trình $\sqrt{f(x)}=g(x)$
p: Điều kiện $g(x)\ge0$, bình phương $f(x)=g^2(x)$.
d: Giải $\sqrt{x+7}=x+1$.
g: Điều kiện $x\ge-1$. Bình phương: $x+7=x^2+2x+1\Leftrightarrow x^2+x-6=0$.
g: $x=2$ (nhận) hoặc $x=-3$ (loại). Vậy $x=2$.
# Phương trình đặt ẩn phụ
p: Đặt $t=x^2\ge0$ (hoặc $t=\sqrt{\dots}$) đưa về phương trình bậc hai ẩn $t$.
d: Giải $x^4-5x^2+4=0$.
g: Đặt $t=x^2\ge0$: $t^2-5t+4=0\Rightarrow t=1$ hoặc $t=4$.
g: $x^2=1\Rightarrow x=\pm1$; $x^2=4\Rightarrow x=\pm2$.
# Phương trình có hai vế đều chứa căn, cần thử lại
p: Sau khi bình phương phải thử lại để loại nghiệm ngoại lai.
d: Giải $\sqrt{x^2-x+1}=\sqrt{2x-1}$.
g: Bình phương: $x^2-3x+2=0\Rightarrow x=1$ hoặc $x=2$.
g: Thử lại $2x-1\ge0$: cả hai đều thỏa. $S=\{1;2\}$.
# Bài toán thực tế dẫn đến phương trình chứa căn
p: Gọi ẩn, biểu diễn độ dài bằng định lí Pythagore (chứa căn), lập phương trình.
d: Một mảnh vườn hình chữ nhật có chu vi $34$ m, đường chéo $13$ m. Tính các kích thước.
g: Gọi chiều rộng $x$ ($0<x<17$), chiều dài $17-x$: $\sqrt{x^2+(17-x)^2}=13$.
g: $2x^2-34x+120=0\Leftrightarrow x^2-17x+60=0\Rightarrow x=5$ hoặc $x=12$. Kích thước $5$ m và $12$ m.

@19
m: VTPT $\vec n=(a;b)$: $a(x-x_0)+b(y-y_0)=0$ ;; VTCP $\vec u=(u_1;u_2)$: $x=x_0+u_1t$, $y=y_0+u_2t$ ;; $\vec n\perp\vec u$: $\vec u=(u_1;u_2)\Rightarrow\vec n=(u_2;-u_1)$ ;; Hệ số góc: $y=kx+m$
# Phương trình tổng quát biết điểm và VTPT
p: $a(x-x_0)+b(y-y_0)=0$.
d: Viết phương trình đường thẳng qua $M(1;-2)$ có VTPT $\vec n=(3;4)$.
g: $3(x-1)+4(y+2)=0$.
g: $3x+4y+5=0$.
# Phương trình đường thẳng qua hai điểm
p: VTCP $\vec u=\vec{AB}$, suy ra VTPT, viết phương trình tham số và tổng quát.
d: Viết phương trình tham số và tổng quát của đường thẳng $AB$ với $A(1;2)$, $B(3;-1)$.
g: $\vec u=\vec{AB}=(2;-3)$: $x=1+2t$, $y=2-3t$.
g: VTPT $\vec n=(3;2)$: $3(x-1)+2(y-2)=0\Leftrightarrow3x+2y-7=0$.
# Đường thẳng song song, vuông góc với đường cho trước
p: Song song: dùng lại VTPT; vuông góc: VTCP của đường đã cho là VTPT của đường cần tìm.
d: Viết phương trình đường thẳng qua $M(2;1)$ và vuông góc với $d: x-2y+3=0$.
g: $d$ có VTCP $(2;1)$, đây là VTPT của đường cần tìm.
g: $2(x-2)+(y-1)=0\Leftrightarrow2x+y-5=0$.
# Đường trung trực của đoạn thẳng
p: Qua trung điểm $I$ của $AB$, VTPT $\vec{AB}$.
d: Viết phương trình trung trực của $AB$ với $A(1;3)$, $B(5;1)$.
g: $I(3;2)$, $\vec{AB}=(4;-2)$, chọn $\vec n=(2;-1)$.
g: $2(x-3)-(y-2)=0\Leftrightarrow2x-y-4=0$.
# Đường cao trong tam giác
p: Đường cao từ $A$ qua $A$, VTPT $\vec{BC}$.
d: Tam giác $ABC$ có $A(1;2)$, $B(0;-1)$, $C(4;1)$. Viết phương trình đường cao $AH$.
g: $\vec{BC}=(4;2)$, chọn $\vec n=(2;1)$.
g: $2(x-1)+(y-2)=0\Leftrightarrow2x+y-4=0$.

@20
m: Vị trí tương đối: giải hệ hoặc so sánh tỉ số hệ số ;; $\cos(d_1,d_2)=\dfrac{|\vec{n_1}\cdot\vec{n_2}|}{|\vec{n_1}||\vec{n_2}|}$ ;; $d(M,\Delta)=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$ ;; $d_1\perp d_2\Leftrightarrow\vec{n_1}\cdot\vec{n_2}=0$
# Xét vị trí tương đối
p: So sánh $\dfrac{a_1}{a_2}$, $\dfrac{b_1}{b_2}$, $\dfrac{c_1}{c_2}$: cắt nhau nếu hai tỉ số đầu khác nhau; song song nếu hai tỉ số đầu bằng nhau và khác tỉ số thứ ba.
d: Xét vị trí tương đối của $d_1: x-2y+1=0$ và $d_2: -2x+4y+3=0$.
g: $\dfrac1{-2}=\dfrac{-2}4\ne\dfrac13$.
g: $d_1\parallel d_2$.
# Tìm giao điểm
p: Giải hệ hai phương trình đường thẳng.
d: Tìm giao điểm của $x+y-3=0$ và $2x-y=0$.
g: Cộng hai phương trình: $3x-3=0\Rightarrow x=1$, $y=2$.
g: Giao điểm $(1;2)$.
# Góc giữa hai đường thẳng
p: Dùng hai VTPT: $\cos\varphi=\dfrac{|a_1a_2+b_1b_2|}{\sqrt{a_1^2+b_1^2}\sqrt{a_2^2+b_2^2}}$.
d: Tính góc giữa $d_1: x-2y=0$ và $d_2: 3x-y=0$.
g: $\vec{n_1}=(1;-2)$, $\vec{n_2}=(3;-1)$: $\cos\varphi=\dfrac{|3+2|}{\sqrt5\sqrt{10}}=\dfrac{\sqrt2}2$.
g: $\varphi=45^\circ$.
# Khoảng cách từ một điểm đến đường thẳng
p: $d(M,\Delta)=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$.
d: Tính khoảng cách từ $M(2;1)$ đến $\Delta: 3x+4y-5=0$.
g: $d=\dfrac{|6+4-5|}{\sqrt{9+16}}$.
g: $d=1$.
# Khoảng cách giữa hai đường thẳng song song
p: Lấy một điểm trên đường này, tính khoảng cách đến đường kia.
d: Tính khoảng cách giữa $d_1: 3x-4y+2=0$ và $d_2: 3x-4y-8=0$.
g: $M(2;2)\in d_1$ (vì $6-8+2=0$).
g: $d=\dfrac{|6-8-8|}{5}=2$.

@21
m: $(x-a)^2+(y-b)^2=R^2$: tâm $I(a;b)$, bán kính $R$ ;; $x^2+y^2-2ax-2by+c=0$ với $a^2+b^2-c>0$ ;; Tiếp tuyến tại $M$: VTPT $\vec{IM}$ ;; Tiếp xúc $\Delta$: $d(I,\Delta)=R$
# Tìm tâm và bán kính
p: Đưa về dạng $x^2+y^2-2ax-2by+c=0$: tâm $I(a;b)$, $R=\sqrt{a^2+b^2-c}$.
d: Tìm tâm và bán kính của $x^2+y^2-4x+6y-3=0$.
g: $a=2$, $b=-3$, $c=-3$: tâm $I(2;-3)$.
g: $R=\sqrt{4+9+3}=4$.
# Điều kiện để phương trình là đường tròn
p: Cần $a^2+b^2-c>0$.
d: Tìm $m$ để $x^2+y^2-2mx+4y+8=0$ là phương trình đường tròn.
g: $a=m$, $b=-2$, $c=8$: $m^2+4-8>0$.
g: $m^2>4\Leftrightarrow m<-2$ hoặc $m>2$.
# Lập phương trình đường tròn biết tâm và một điểm
p: Bán kính $R=IA$.
d: Lập phương trình đường tròn tâm $I(1;2)$ đi qua $A(4;6)$.
g: $R=IA=\sqrt{9+16}=5$.
g: $(x-1)^2+(y-2)^2=25$.
# Đường tròn tiếp xúc với đường thẳng
p: $R=d(I,\Delta)$.
d: Lập phương trình đường tròn tâm $I(2;1)$ tiếp xúc với $\Delta: 3x-4y+8=0$.
g: $R=\dfrac{|6-4+8|}5=2$.
g: $(x-2)^2+(y-1)^2=4$.
# Tiếp tuyến tại một điểm trên đường tròn
p: Tiếp tuyến qua $M$ và vuông góc với $IM$: VTPT $\vec{IM}$.
d: Viết tiếp tuyến của $(C): (x-1)^2+(y+2)^2=25$ tại $M(4;2)$.
g: $I(1;-2)$, $\vec{IM}=(3;4)$.
g: $3(x-4)+4(y-2)=0\Leftrightarrow3x+4y-20=0$.

@22
m: Elip $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$, $c^2=a^2-b^2$, $MF_1+MF_2=2a$ ;; Hypebol $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$, $c^2=a^2+b^2$, $|MF_1-MF_2|=2a$ ;; Parabol $y^2=2px$: tiêu điểm $F\left(\dfrac p2;0\right)$, đường chuẩn $x=-\dfrac p2$ ;; Parabol: $MF=x_M+\dfrac p2$
# Các yếu tố của elip
p: Đọc $a^2$, $b^2$ từ phương trình chính tắc, tính $c=\sqrt{a^2-b^2}$.
d: Tìm tiêu điểm, đỉnh, độ dài trục lớn của elip $\dfrac{x^2}{25}+\dfrac{y^2}9=1$.
g: $a=5$, $b=3$, $c=4$: tiêu điểm $F_1(-4;0)$, $F_2(4;0)$.
g: Đỉnh $(\pm5;0)$, $(0;\pm3)$; trục lớn $2a=10$.
# Lập phương trình chính tắc của elip
p: Từ dữ kiện tìm $a$, $c$ rồi $b^2=a^2-c^2$.
d: Lập phương trình elip có tiêu cự bằng $6$ và độ dài trục lớn bằng $10$.
g: $c=3$, $a=5$, $b^2=25-9=16$.
g: $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$.
# Các yếu tố của hypebol
p: $c^2=a^2+b^2$; đỉnh $(\pm a;0)$.
d: Tìm tiêu điểm và đỉnh của hypebol $\dfrac{x^2}{16}-\dfrac{y^2}9=1$.
g: $a=4$, $b=3$, $c=5$.
g: Tiêu điểm $(\pm5;0)$; đỉnh $(\pm4;0)$.
# Parabol: tiêu điểm, đường chuẩn, bán kính qua tiêu
p: $y^2=2px$: $F\left(\dfrac p2;0\right)$, đường chuẩn $x=-\dfrac p2$, $MF=x_M+\dfrac p2$.
d: Cho parabol $y^2=8x$. Tìm tiêu điểm, đường chuẩn và tính $MF$ với $M(2;4)$.
g: $2p=8\Rightarrow p=4$: $F(2;0)$, đường chuẩn $x=-2$.
g: $M(2;4)$ thuộc parabol; $MF=2+2=4$.
# Ứng dụng thực tế của conic
p: Đặt hệ trục phù hợp, lập phương trình conic qua điểm đã biết.
d: Một chảo ăng-ten có mặt cắt là parabol, đường kính miệng $80$ cm, độ sâu $10$ cm. Đầu thu đặt tại tiêu điểm cách đỉnh bao nhiêu?
g: Chọn đỉnh là gốc, trục đối xứng là $Ox$: $y^2=2px$ đi qua $(10;40)$: $1600=20p\Rightarrow p=80$.
g: Tiêu điểm $F(40;0)$: đầu thu cách đỉnh $40$ cm.

@23
m: Quy tắc cộng: các phương án rời nhau ;; Quy tắc nhân: các công đoạn liên tiếp ;; Sơ đồ hình cây ;; Đếm phần bù: tổng trừ phần không thỏa
# Quy tắc cộng
p: Công việc hoàn thành bởi một trong các phương án (không trùng nhau): cộng số cách.
d: Có $5$ áo sơ mi trắng và $4$ áo sơ mi xanh. Có bao nhiêu cách chọn một áo?
g: Chọn áo trắng: $5$ cách; chọn áo xanh: $4$ cách.
g: Có $5+4=9$ cách.
# Quy tắc nhân
p: Công việc gồm các công đoạn liên tiếp: nhân số cách mỗi công đoạn.
d: Từ $A$ đến $B$ có $3$ con đường, từ $B$ đến $C$ có $4$ con đường. Có bao nhiêu cách đi từ $A$ đến $C$ qua $B$?
g: Hai công đoạn: $A\to B$ ($3$ cách), $B\to C$ ($4$ cách).
g: Có $3\cdot4=12$ cách.
# Lập số có các chữ số khác nhau
p: Chọn lần lượt từng chữ số (từ hàng có ràng buộc nhiều nhất).
d: Từ các chữ số $1,2,3,4,5$ lập được bao nhiêu số có ba chữ số khác nhau?
g: Hàng trăm $5$ cách, hàng chục $4$ cách, hàng đơn vị $3$ cách.
g: Có $5\cdot4\cdot3=60$ số.
# Lập số có điều kiện (chẵn, có chữ số $0$)
p: Chia trường hợp theo chữ số cuối; chữ số đầu khác $0$.
d: Từ $0,1,2,3,4$ lập được bao nhiêu số chẵn có ba chữ số khác nhau?
g: Tận cùng $0$: $4\cdot3=12$ số.
g: Tận cùng $2$ hoặc $4$: hàng trăm $3$ cách, hàng chục $3$ cách: $2\cdot3\cdot3=18$ số. Tổng $30$ số.
# Đếm bằng phần bù
p: Số cách thỏa “ít nhất một” $=$ tổng số cách $-$ số cách “không có”.
d: Có bao nhiêu mật khẩu gồm $4$ chữ số (từ $0$ đến $9$) có ít nhất một chữ số $0$?
g: Tổng: $10^4=10000$; không có chữ số $0$: $9^4=6561$.
g: Có $10000-6561=3439$ mật khẩu.

@24
m: Hoán vị $P_n=n!$ ;; Chỉnh hợp $A_n^k=\dfrac{n!}{(n-k)!}$ (có thứ tự) ;; Tổ hợp $C_n^k=\dfrac{n!}{k!(n-k)!}$ (không thứ tự) ;; $C_n^k=C_n^{n-k}$
# Hoán vị
p: Sắp xếp $n$ phần tử khác nhau theo thứ tự: $n!$.
d: Có bao nhiêu cách xếp $5$ bạn ngồi vào một hàng $5$ ghế?
g: Mỗi cách xếp là một hoán vị của $5$ bạn.
g: $P_5=5!=120$ cách.
# Chỉnh hợp
p: Chọn $k$ phần tử từ $n$ và có sắp thứ tự (vai trò khác nhau): $A_n^k$.
d: Từ $30$ học sinh, chọn lớp trưởng, lớp phó, bí thư (không kiêm nhiệm). Có bao nhiêu cách?
g: Chọn $3$ bạn có phân vai trò: $A_{30}^3$.
g: $A_{30}^3=30\cdot29\cdot28=24360$ cách.
# Tổ hợp
p: Chọn $k$ phần tử từ $n$, không quan tâm thứ tự: $C_n^k$.
d: Có bao nhiêu cách chọn $3$ học sinh từ $30$ học sinh đi trực?
g: Không phân vai trò nên là tổ hợp.
g: $C_{30}^3=\dfrac{30\cdot29\cdot28}{6}=4060$ cách.
# Tổ hợp có điều kiện
p: Chia nhóm theo điều kiện, dùng quy tắc nhân và cộng.
d: Nhóm có $6$ nam, $4$ nữ. Có bao nhiêu cách chọn $3$ người có đúng $1$ nữ?
g: Chọn $1$ nữ: $C_4^1=4$; chọn $2$ nam: $C_6^2=15$.
g: Có $4\cdot15=60$ cách.
# Giải phương trình chứa $A_n^k$, $C_n^k$
p: Viết theo giai thừa, rút gọn, chú ý điều kiện $n\in\mathbb N$, $n\ge k$.
d: Giải phương trình $C_n^2=15$.
g: $\dfrac{n(n-1)}2=15\Leftrightarrow n^2-n-30=0\Rightarrow n=6$ hoặc $n=-5$.
g: Vì $n\ge2$ nên $n=6$.

@25
m: $(a+b)^4=a^4+4a^3b+6a^2b^2+4ab^3+b^4$ ;; $(a+b)^5$: hệ số $1,5,10,10,5,1$ ;; Số hạng tổng quát $C_n^ka^{n-k}b^k$ ;; Tổng hệ số: thay $a=b=1$
# Khai triển $(a+b)^4$
p: Dùng công thức với hệ số $1,4,6,4,1$.
d: Khai triển $(x+2)^4$.
g: $x^4+4x^3\cdot2+6x^2\cdot4+4x\cdot8+16$.
g: $=x^4+8x^3+24x^2+32x+16$.
# Khai triển $(a+b)^5$ có dấu trừ
p: Hệ số $1,5,10,10,5,1$; số hạng có lũy thừa lẻ của $(-b)$ mang dấu trừ.
d: Khai triển $(2x-1)^5$.
g: $=32x^5-5\cdot16x^4+10\cdot8x^3-10\cdot4x^2+5\cdot2x-1$.
g: $=32x^5-80x^4+80x^3-40x^2+10x-1$.
# Tìm hệ số của một số hạng
p: Số hạng tổng quát $C_n^ka^{n-k}b^k$; chọn $k$ theo số mũ yêu cầu.
d: Tìm hệ số của $x^3$ trong khai triển $(1+2x)^5$.
g: Số hạng chứa $x^3$: $C_5^3(2x)^3=10\cdot8x^3$.
g: Hệ số là $80$.
# Số hạng không chứa $x$
p: Viết số mũ của $x$ theo $k$, cho bằng $0$.
d: Tìm số hạng không chứa $x$ trong khai triển $\left(x+\dfrac1x\right)^4$.
g: Số hạng tổng quát $C_4^kx^{4-k}x^{-k}=C_4^kx^{4-2k}$; $4-2k=0\Rightarrow k=2$.
g: Số hạng cần tìm là $C_4^2=6$.
# Tính gần đúng bằng nhị thức
p: Viết $(1+h)^n$ với $h$ nhỏ, giữ vài số hạng đầu.
d: Tính gần đúng $1{,}01^5$.
g: $(1+0{,}01)^5\approx1+5\cdot0{,}01+10\cdot0{,}0001$.
g: $\approx1{,}051$ (giá trị đúng $1{,}05101\ldots$).

@26
m: Không gian mẫu $\Omega$, $n(\Omega)$ ;; Biến cố $A\subset\Omega$ ;; $P(A)=\dfrac{n(A)}{n(\Omega)}$ ;; Biến cố đối: $P(\overline A)=1-P(A)$
# Mô tả không gian mẫu
p: Liệt kê mọi kết quả có thể (dùng sơ đồ cây hoặc bảng).
d: Tung một đồng xu hai lần. Mô tả không gian mẫu.
g: $\Omega=\{SS;SN;NS;NN\}$.
g: $n(\Omega)=4$.
# Xác suất khi gieo xúc xắc
p: Gieo hai lần: $n(\Omega)=36$; liệt kê các cặp thỏa mãn.
d: Gieo một xúc xắc hai lần. Tính xác suất tổng số chấm bằng $7$.
g: Các kết quả: $(1;6),(2;5),(3;4),(4;3),(5;2),(6;1)$: $n(A)=6$.
g: $P(A)=\dfrac6{36}=\dfrac16$.
# Xác suất chọn ngẫu nhiên đồ vật
p: Đếm bằng tổ hợp: $n(\Omega)=C_n^k$.
d: Hộp có $5$ bi đỏ, $3$ bi xanh. Lấy ngẫu nhiên $2$ bi. Tính xác suất được $2$ bi đỏ.
g: $n(\Omega)=C_8^2=28$; $n(A)=C_5^2=10$.
g: $P(A)=\dfrac{10}{28}=\dfrac5{14}$.
# Dùng biến cố đối
p: Với “ít nhất một”, tính xác suất biến cố đối rồi lấy $1$ trừ.
d: Với hộp bi trên, tính xác suất lấy được ít nhất $1$ bi xanh.
g: Biến cố đối: “cả hai bi đều đỏ”, xác suất $\dfrac5{14}$.
g: $P=1-\dfrac5{14}=\dfrac9{14}$.
# Xác suất rút thẻ số
p: Đếm số thẻ thỏa điều kiện chia hết, số nguyên tố, …
d: Rút ngẫu nhiên một thẻ từ $20$ thẻ đánh số $1$ đến $20$. Tính xác suất được số chia hết cho $3$.
g: Các số: $3,6,9,12,15,18$: $n(A)=6$.
g: $P(A)=\dfrac6{20}=\dfrac3{10}$.

@27
m: Đếm $n(\Omega)$ và $n(A)$ bằng quy tắc đếm, tổ hợp ;; Dùng sơ đồ cây khi phép thử nhiều bước ;; “Ít nhất một”: dùng biến cố đối ;; “Đứng cạnh nhau”: buộc thành một khối
# Sơ đồ hình cây
p: Vẽ cây liệt kê các kết quả đồng khả năng rồi đếm.
d: Một gia đình có $3$ con (khả năng trai, gái như nhau). Tính xác suất có đúng $2$ con trai.
g: $n(\Omega)=2^3=8$; các kết quả: $TTG, TGT, GTT$: $n(A)=3$.
g: $P(A)=\dfrac38$.
# Chọn nhóm có cả hai loại
p: Biến cố đối là “chỉ có một loại”.
d: Tổ có $6$ nam, $4$ nữ. Chọn ngẫu nhiên $3$ bạn. Tính xác suất có cả nam và nữ.
g: $n(\Omega)=C_{10}^3=120$; chỉ nam: $C_6^3=20$; chỉ nữ: $C_4^3=4$.
g: $P=1-\dfrac{24}{120}=\dfrac45$.
# Xếp hàng có điều kiện
p: Các phần tử đứng cạnh nhau: buộc thành một khối, nhân với số cách xếp trong khối.
d: Xếp ngẫu nhiên $3$ nam, $2$ nữ thành hàng ngang. Tính xác suất hai bạn nữ đứng cạnh nhau.
g: $n(\Omega)=5!=120$; coi hai nữ là một khối: $4!\cdot2!=48$.
g: $P=\dfrac{48}{120}=\dfrac25$.
# Chọn số ngẫu nhiên
p: Đếm các số thỏa điều kiện trong tập số đã cho.
d: Chọn ngẫu nhiên một số tự nhiên có hai chữ số. Tính xác suất số đó chia hết cho $5$.
g: $n(\Omega)=90$; số tận cùng $0$ hoặc $5$: $9\cdot2=18$.
g: $P=\dfrac{18}{90}=\dfrac15$.
# Gieo hai xúc xắc – “ít nhất một”
p: Tính xác suất “không có” rồi lấy phần bù.
d: Gieo hai xúc xắc. Tính xác suất có ít nhất một mặt $6$ chấm.
g: Không có mặt $6$: $5\cdot5=25$ kết quả.
g: $P=1-\dfrac{25}{36}=\dfrac{11}{36}$.
`;
