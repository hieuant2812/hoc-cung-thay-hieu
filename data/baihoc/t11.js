/* data/baihoc/t11.js — dữ liệu dạy học Toán 11 (Kết nối tri thức với cuộc sống)
   Dùng chung cho: soạn Kế hoạch bài dạy (khbd.html) và soạn bản trình chiếu Beamer (beamer.html).
   Mỗi bài:  t = số tiết · yc = yêu cầu cần đạt · md = mạch nội dung (mỗi mục là một phần kiến thức)
             vd = ví dụ mẫu {d: đề, g: [các bước giải]} · tt = vận dụng thực tiễn · cs = công cụ số
             ai = hoạt động phản biện AI {p: prompt mẫu, l: lỗi AI thường mắc} · bt = bài tập về nhà */
(function (G) {
  const B = G.BAIHOC = G.BAIHOC || {}; const T = B["Toán"] = B["Toán"] || {};
  T[11] = {
1: { t: 3, yc: ["Nhận biết góc lượng giác, số đo góc lượng giác, hệ thức Chasles.", "Nhận biết đơn vị rađian và đổi qua lại độ – rađian.", "Xác định điểm biểu diễn góc lượng giác trên đường tròn lượng giác; tính giá trị lượng giác của góc lượng giác."],
  md: [
   { t: "Góc lượng giác và số đo", y: ["Tia $Om$ quay quanh $O$ từ tia đầu $Ou$ đến tia cuối $Ov$ tạo thành một góc lượng giác, kí hiệu $(Ou,Ov)$.", "Chiều ngược kim đồng hồ là chiều dương.", "Hệ thức Chasles: $(Ou,Ov)+(Ov,Ow)=(Ou,Ow)+k360^\\circ$.", "Nếu một góc lượng giác $(Ou,Ov)$ có số đo $\\alpha$ thì mọi góc lượng giác cùng tia đầu, tia cuối có số đo $\\alpha+k360^\\circ$, $k\\in\\mathbb{Z}$."],
     vd: { d: "Cho góc lượng giác $(Ou,Ov)$ có số đo $-765^\\circ$. Tìm số đo dương nhỏ nhất của góc lượng giác đó.", g: ["Mọi góc lượng giác cùng tia đầu, tia cuối có số đo $-765^\\circ+k360^\\circ$.", "Cần $-765+360k>0 \\Leftrightarrow k>2{,}125$, nên $k=3$.", "Số đo cần tìm là $-765^\\circ+3\\cdot360^\\circ=315^\\circ$."] } },
   { t: "Đơn vị rađian", y: ["$1$ rađian là số đo cung có độ dài bằng bán kính: $180^\\circ=\\pi$ rad.", "$\\alpha^\\circ=\\dfrac{\\pi\\alpha}{180}$ rad và $\\beta$ rad $=\\left(\\dfrac{180\\beta}{\\pi}\\right)^\\circ$.", "Độ dài cung: $\\ell=R|\\alpha|$ với $\\alpha$ tính bằng rađian."],
     vd: { d: "Một bánh xe có bán kính $35$ cm quay được góc $150^\\circ$. Tính quãng đường một điểm trên vành bánh xe đi được.", g: ["Đổi $150^\\circ=\\dfrac{150\\pi}{180}=\\dfrac{5\\pi}{6}$ rad.", "$\\ell=R\\alpha=35\\cdot\\dfrac{5\\pi}{6}\\approx 91{,}6$ cm."] } },
   { t: "Đường tròn lượng giác và giá trị lượng giác", y: ["Điểm $M$ trên đường tròn lượng giác biểu diễn góc $\\alpha$: $\\cos\\alpha=x_M$, $\\sin\\alpha=y_M$.", "$\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$ $(\\cos\\alpha\\ne0)$, $\\cot\\alpha=\\dfrac{\\cos\\alpha}{\\sin\\alpha}$ $(\\sin\\alpha\\ne0)$.", "$\\sin^2\\alpha+\\cos^2\\alpha=1$; $1+\\tan^2\\alpha=\\dfrac{1}{\\cos^2\\alpha}$.", "Quan hệ các góc đặc biệt: đối, bù, phụ, hơn kém $\\pi$."],
     vd: { d: "Cho $\\sin\\alpha=\\dfrac{3}{5}$ và $\\dfrac{\\pi}{2}<\\alpha<\\pi$. Tính $\\cos\\alpha$ và $\\tan\\alpha$.", g: ["$\\cos^2\\alpha=1-\\sin^2\\alpha=1-\\dfrac{9}{25}=\\dfrac{16}{25}$.", "Vì $\\dfrac{\\pi}{2}<\\alpha<\\pi$ nên $\\cos\\alpha<0$, suy ra $\\cos\\alpha=-\\dfrac{4}{5}$.", "$\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}=-\\dfrac{3}{4}$."] } }],
  tt: { d: "Một vòng quay Mặt Trời (đu quay) bán kính $30$ m, trục quay cách mặt đất $35$ m, quay đều mỗi vòng $12$ phút theo chiều dương. Một cabin xuất phát ở vị trí thấp nhất. Hỏi sau $4$ phút cabin ở độ cao bao nhiêu mét?",
      g: ["Sau $4$ phút cabin quay được $\\dfrac{4}{12}$ vòng, ứng với góc $\\dfrac{2\\pi}{3}$ rad.", "Chọn gốc ở vị trí thấp nhất, độ cao $h=35-30\\cos\\alpha$ với $\\alpha$ là góc đã quay.", "$h=35-30\\cos\\dfrac{2\\pi}{3}=35+15=50$ m."] },
  cs: "geogebra", ai: { p: "Hãy đổi $-765^\\circ$ sang rađian và tìm số đo dương nhỏ nhất của góc lượng giác tương ứng, trình bày từng bước.", l: "AI hay quên tính tuần hoàn $k360^\\circ$ nên trả về một số đo duy nhất, hoặc đổi nhầm chiều âm – dương." },
  bt: "Bài 1.1 – 1.6 SGK trang 12." },

2: { t: 3, yc: ["Vận dụng công thức cộng, công thức góc nhân đôi, công thức biến đổi tổng – tích.", "Rút gọn biểu thức lượng giác và chứng minh đẳng thức lượng giác."],
  md: [
   { t: "Công thức cộng", y: ["$\\cos(a\\mp b)=\\cos a\\cos b\\pm\\sin a\\sin b$.", "$\\sin(a\\pm b)=\\sin a\\cos b\\pm\\cos a\\sin b$.", "$\\tan(a\\pm b)=\\dfrac{\\tan a\\pm\\tan b}{1\\mp\\tan a\\tan b}$."],
     vd: { d: "Tính giá trị đúng của $\\cos 15^\\circ$.", g: ["$15^\\circ=45^\\circ-30^\\circ$.", "$\\cos15^\\circ=\\cos45^\\circ\\cos30^\\circ+\\sin45^\\circ\\sin30^\\circ$.", "$=\\dfrac{\\sqrt2}{2}\\cdot\\dfrac{\\sqrt3}{2}+\\dfrac{\\sqrt2}{2}\\cdot\\dfrac12=\\dfrac{\\sqrt6+\\sqrt2}{4}$."] } },
   { t: "Công thức nhân đôi và hạ bậc", y: ["$\\sin2a=2\\sin a\\cos a$; $\\cos2a=\\cos^2a-\\sin^2a=2\\cos^2a-1=1-2\\sin^2a$.", "$\\tan 2a=\\dfrac{2\\tan a}{1-\\tan^2 a}$.", "Hạ bậc: $\\sin^2a=\\dfrac{1-\\cos2a}{2}$, $\\cos^2a=\\dfrac{1+\\cos2a}{2}$."],
     vd: { d: "Cho $\\cos a=\\dfrac{1}{3}$ với $0<a<\\dfrac{\\pi}{2}$. Tính $\\sin 2a$.", g: ["$\\sin^2a=1-\\dfrac19=\\dfrac89$, vì $0<a<\\dfrac{\\pi}{2}$ nên $\\sin a=\\dfrac{2\\sqrt2}{3}$.", "$\\sin2a=2\\sin a\\cos a=2\\cdot\\dfrac{2\\sqrt2}{3}\\cdot\\dfrac13=\\dfrac{4\\sqrt2}{9}$."] } },
   { t: "Biến đổi tổng thành tích, tích thành tổng", y: ["$\\cos a\\cos b=\\dfrac12[\\cos(a-b)+\\cos(a+b)]$.", "$\\cos u+\\cos v=2\\cos\\dfrac{u+v}{2}\\cos\\dfrac{u-v}{2}$.", "$\\sin u+\\sin v=2\\sin\\dfrac{u+v}{2}\\cos\\dfrac{u-v}{2}$."],
     vd: { d: "Rút gọn $A=\\dfrac{\\sin 3x+\\sin x}{\\cos 3x+\\cos x}$.", g: ["Tử: $\\sin3x+\\sin x=2\\sin2x\\cos x$.", "Mẫu: $\\cos3x+\\cos x=2\\cos2x\\cos x$.", "$A=\\dfrac{2\\sin2x\\cos x}{2\\cos2x\\cos x}=\\tan 2x$ (với $\\cos x\\ne0,\\ \\cos2x\\ne0$)."] } }],
  tt: { d: "Hai nguồn âm phát ra hai sóng $y_1=A\\sin(200\\pi t)$ và $y_2=A\\sin(202\\pi t)$. Tổng hai sóng là $y=y_1+y_2$. Hãy viết $y$ dưới dạng tích và cho biết tai người nghe thấy hiện tượng gì.",
      g: ["$y=A(\\sin200\\pi t+\\sin202\\pi t)=2A\\sin(201\\pi t)\\cos(\\pi t)$.", "Biên độ $2A|\\cos\\pi t|$ thay đổi chậm theo thời gian.", "Đó là hiện tượng phách: âm nghe được to nhỏ luân phiên, tần số phách $1$ Hz."] },
  cs: "geogebra", ai: { p: "Chứng minh đẳng thức $\\dfrac{\\sin3x+\\sin x}{\\cos3x+\\cos x}=\\tan2x$ và nêu điều kiện xác định.", l: "AI thường bỏ quên điều kiện $\\cos x\\ne 0$, $\\cos 2x\\ne 0$ khi rút gọn." },
  bt: "Bài 1.7 – 1.12 SGK trang 21." },

3: { t: 3, yc: ["Nhận biết hàm số chẵn, lẻ, tuần hoàn.", "Nhận biết tập xác định, tập giá trị, tính chất và đồ thị các hàm số $y=\\sin x$, $y=\\cos x$, $y=\\tan x$, $y=\\cot x$.", "Giải quyết bài toán thực tiễn gắn với hàm số lượng giác."],
  md: [
   { t: "Hàm số chẵn, lẻ, tuần hoàn", y: ["$f$ chẵn nếu $f(-x)=f(x)$, lẻ nếu $f(-x)=-f(x)$.", "$f$ tuần hoàn chu kì $T$ nếu $f(x+T)=f(x)$ với mọi $x$ thuộc tập xác định.", "$y=\\sin x$, $y=\\cos x$ tuần hoàn chu kì $2\\pi$; $y=\\tan x$, $y=\\cot x$ tuần hoàn chu kì $\\pi$."],
     vd: { d: "Xét tính chẵn, lẻ của hàm số $y=x\\sin x$.", g: ["Tập xác định $\\mathbb{R}$ đối xứng.", "$f(-x)=(-x)\\sin(-x)=(-x)(-\\sin x)=x\\sin x=f(x)$.", "Vậy hàm số chẵn."] } },
   { t: "Hàm số sin và côsin", y: ["$y=\\sin x$: tập xác định $\\mathbb{R}$, tập giá trị $[-1;1]$, hàm lẻ, đồ thị đối xứng qua gốc toạ độ.", "$y=\\cos x$: tập xác định $\\mathbb{R}$, tập giá trị $[-1;1]$, hàm chẵn, đồ thị đối xứng qua trục tung.", "Hàm số $y=a\\sin(\\omega x+\\varphi)+b$ có tập giá trị $[b-|a|;b+|a|]$."],
     vd: { d: "Tìm giá trị lớn nhất và nhỏ nhất của $y=3\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)+1$.", g: ["Vì $-1\\le\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)\\le1$ nên $-3\\le 3\\sin(\\cdot)\\le 3$.", "Suy ra $-2\\le y\\le 4$.", "$y_{\\max}=4$, $y_{\\min}=-2$."] } },
   { t: "Hàm số tang và côtang", y: ["$y=\\tan x$ xác định khi $x\\ne\\dfrac{\\pi}{2}+k\\pi$, tập giá trị $\\mathbb{R}$, hàm lẻ, chu kì $\\pi$.", "$y=\\cot x$ xác định khi $x\\ne k\\pi$, tập giá trị $\\mathbb{R}$, hàm lẻ, chu kì $\\pi$.", "Đồ thị nhận các đường $x=\\dfrac{\\pi}{2}+k\\pi$ (với tang) làm tiệm cận đứng."],
     vd: { d: "Tìm tập xác định của $y=\\tan\\left(2x+\\dfrac{\\pi}{4}\\right)$.", g: ["Điều kiện $2x+\\dfrac{\\pi}{4}\\ne\\dfrac{\\pi}{2}+k\\pi$.", "$\\Leftrightarrow 2x\\ne\\dfrac{\\pi}{4}+k\\pi \\Leftrightarrow x\\ne\\dfrac{\\pi}{8}+\\dfrac{k\\pi}{2}$.", "$D=\\mathbb{R}\\setminus\\left\\{\\dfrac{\\pi}{8}+\\dfrac{k\\pi}{2},k\\in\\mathbb{Z}\\right\\}$."] } }],
  tt: { d: "Mực nước tại một cảng biển theo thời gian $t$ (giờ, $0\\le t\\le 24$) cho bởi $h(t)=3\\cos\\left(\\dfrac{\\pi t}{6}\\right)+12$ (mét). Tàu chỉ vào cảng được khi mực nước không thấp hơn $10{,}5$ m. Hỏi trong buổi sáng (từ $0$ h đến $12$ h) tàu vào cảng được trong khoảng thời gian nào?",
      g: ["$h(t)\\ge10{,}5 \\Leftrightarrow \\cos\\dfrac{\\pi t}{6}\\ge-\\dfrac12$.", "$\\Leftrightarrow -\\dfrac{2\\pi}{3}+k2\\pi\\le\\dfrac{\\pi t}{6}\\le\\dfrac{2\\pi}{3}+k2\\pi$.", "Với $0\\le t\\le12$ ta được $0\\le t\\le4$ hoặc $8\\le t\\le12$."] },
  cs: "geogebra", ai: { p: "Vẽ đồ thị $y=3\\sin(2x-\\pi/3)+1$ và cho biết chu kì, giá trị lớn nhất, nhỏ nhất.", l: "AI hay nhầm chu kì của $y=\\sin(\\omega x+\\varphi)$ là $2\\pi$ thay vì $\\dfrac{2\\pi}{|\\omega|}$." },
  bt: "Bài 1.13 – 1.18 SGK trang 30." },

4: { t: 3, yc: ["Nhận biết công thức nghiệm của phương trình lượng giác cơ bản.", "Tính nghiệm gần đúng bằng máy tính cầm tay.", "Giải phương trình lượng giác và bài toán thực tiễn gắn với phương trình lượng giác."],
  md: [
   { t: "Phương trình $\\sin x=m$ và $\\cos x=m$", y: ["Phương trình có nghiệm khi $-1\\le m\\le 1$.", "$\\sin x=\\sin\\alpha \\Leftrightarrow x=\\alpha+k2\\pi$ hoặc $x=\\pi-\\alpha+k2\\pi$.", "$\\cos x=\\cos\\alpha \\Leftrightarrow x=\\pm\\alpha+k2\\pi$."],
     vd: { d: "Giải phương trình $2\\sin x-\\sqrt3=0$.", g: ["$\\sin x=\\dfrac{\\sqrt3}{2}=\\sin\\dfrac{\\pi}{3}$.", "$x=\\dfrac{\\pi}{3}+k2\\pi$ hoặc $x=\\dfrac{2\\pi}{3}+k2\\pi$, $k\\in\\mathbb{Z}$."] } },
   { t: "Phương trình $\\tan x=m$, $\\cot x=m$", y: ["$\\tan x=\\tan\\alpha \\Leftrightarrow x=\\alpha+k\\pi$ (điều kiện $\\cos x\\ne0$).", "$\\cot x=\\cot\\alpha \\Leftrightarrow x=\\alpha+k\\pi$ (điều kiện $\\sin x\\ne0$).", "Hai phương trình này luôn có nghiệm với mọi $m$."],
     vd: { d: "Giải phương trình $\\tan\\left(2x-\\dfrac{\\pi}{4}\\right)=1$.", g: ["$\\tan\\left(2x-\\dfrac{\\pi}{4}\\right)=\\tan\\dfrac{\\pi}{4}$.", "$2x-\\dfrac{\\pi}{4}=\\dfrac{\\pi}{4}+k\\pi \\Leftrightarrow 2x=\\dfrac{\\pi}{2}+k\\pi$.", "$x=\\dfrac{\\pi}{4}+\\dfrac{k\\pi}{2}$, $k\\in\\mathbb{Z}$."] } }],
  tt: { d: "Số giờ có ánh sáng mặt trời của một thành phố ở vĩ độ $40^\\circ$ Bắc trong ngày thứ $t$ của năm được cho bởi $d(t)=3\\sin\\left[\\dfrac{\\pi}{182}(t-80)\\right]+12$. Vào ngày nào trong năm thành phố có đúng $12$ giờ ánh sáng mặt trời?",
      g: ["$d(t)=12 \\Leftrightarrow \\sin\\left[\\dfrac{\\pi}{182}(t-80)\\right]=0$.", "$\\Leftrightarrow \\dfrac{\\pi}{182}(t-80)=k\\pi \\Leftrightarrow t=80+182k$.", "Với $1\\le t\\le365$: $t=80$ (khoảng 21/3) và $t=262$ (khoảng 19/9) — tức xuân phân và thu phân."] },
  cs: "casio", ai: { p: "Giải phương trình $\\sin 2x=\\dfrac{1}{2}$ trên khoảng $(0;\\pi)$ và liệt kê đủ các nghiệm.", l: "AI thường quên xét đủ họ nghiệm thứ hai $x=\\pi-\\alpha+k2\\pi$ hoặc liệt kê thiếu nghiệm trong khoảng cho trước." },
  bt: "Bài 1.19 – 1.24 SGK trang 40." },

5: { t: 2, yc: ["Nhận biết dãy số hữu hạn, vô hạn; cách cho một dãy số.", "Nhận biết dãy số tăng, giảm, bị chặn."],
  md: [
   { t: "Định nghĩa và cách cho dãy số", y: ["Dãy số vô hạn là hàm số $u:\\mathbb{N}^*\\to\\mathbb{R}$, viết $(u_n)$.", "Ba cách cho dãy: liệt kê, công thức số hạng tổng quát, hệ thức truy hồi.", "Ví dụ truy hồi: $u_1=1$, $u_{n+1}=u_n+3$."],
     vd: { d: "Cho dãy số $u_n=\\dfrac{2n-1}{n+1}$. Tính $u_1$, $u_5$ và xét xem $\\dfrac{9}{6}$ có là số hạng của dãy không.", g: ["$u_1=\\dfrac{1}{2}$; $u_5=\\dfrac{9}{6}=\\dfrac32$.", "Vậy $\\dfrac96$ là số hạng thứ $5$ của dãy."] } },
   { t: "Dãy số tăng, giảm, bị chặn", y: ["$(u_n)$ tăng nếu $u_{n+1}>u_n$ với mọi $n$; giảm nếu $u_{n+1}<u_n$.", "$(u_n)$ bị chặn trên nếu tồn tại $M$ sao cho $u_n\\le M$; bị chặn dưới nếu $u_n\\ge m$; bị chặn nếu có cả hai.", "Cách xét: so sánh $u_{n+1}-u_n$ với $0$ hoặc xét tỉ số $\\dfrac{u_{n+1}}{u_n}$ với dãy dương."],
     vd: { d: "Xét tính tăng, giảm của dãy $u_n=\\dfrac{n}{n+1}$.", g: ["$u_{n+1}-u_n=\\dfrac{n+1}{n+2}-\\dfrac{n}{n+1}=\\dfrac{(n+1)^2-n(n+2)}{(n+2)(n+1)}$.", "$=\\dfrac{1}{(n+1)(n+2)}>0$ với mọi $n$.", "Vậy dãy số tăng; ngoài ra $0<u_n<1$ nên dãy bị chặn."] } }],
  tt: { d: "Một người gửi tiết kiệm $100$ triệu đồng, lãi suất $6\\%$/năm, lãi nhập gốc. Gọi $u_n$ là số tiền có được sau $n$ năm. Hãy viết hệ thức truy hồi và công thức tổng quát của $(u_n)$.",
      g: ["Sau mỗi năm số tiền nhân thêm $1{,}06$: $u_1=100\\cdot1{,}06$ và $u_{n+1}=1{,}06\\,u_n$.", "Suy ra $u_n=100\\cdot(1{,}06)^n$ (triệu đồng).", "Chẳng hạn sau $5$ năm: $u_5=100\\cdot(1{,}06)^5\\approx133{,}8$ triệu đồng."] },
  cs: "excel", ai: { p: "Lập bảng 10 số hạng đầu của dãy $u_1=1$, $u_{n+1}=u_n+3$ và tìm công thức tổng quát.", l: "AI đôi khi trả lời $u_n=3n$ thay vì $u_n=3n-2$ do nhầm số hạng đầu." },
  bt: "Bài 2.1 – 2.5 SGK trang 44." },

6: { t: 3, yc: ["Nhận biết cấp số cộng và công sai.", "Tính số hạng tổng quát và tổng $n$ số hạng đầu.", "Giải quyết bài toán thực tiễn gắn với cấp số cộng."],
  md: [
   { t: "Định nghĩa và số hạng tổng quát", y: ["$(u_n)$ là cấp số cộng nếu $u_{n+1}=u_n+d$ với mọi $n$; $d$ gọi là công sai.", "Số hạng tổng quát: $u_n=u_1+(n-1)d$.", "Ba số $a,b,c$ lập thành cấp số cộng khi và chỉ khi $b=\\dfrac{a+c}{2}$."],
     vd: { d: "Cho cấp số cộng có $u_3=11$ và $u_7=27$. Tìm $u_1$ và $d$.", g: ["$u_3=u_1+2d=11$ và $u_7=u_1+6d=27$.", "Trừ vế: $4d=16 \\Rightarrow d=4$.", "$u_1=11-2\\cdot4=3$."] } },
   { t: "Tổng $n$ số hạng đầu", y: ["$S_n=\\dfrac{n(u_1+u_n)}{2}=\\dfrac{n\\left[2u_1+(n-1)d\\right]}{2}$.", "Dùng công thức này để tính nhanh tổng các số hạng cách đều."],
     vd: { d: "Tính tổng $S=5+9+13+\\dots+101$.", g: ["Đây là cấp số cộng $u_1=5$, $d=4$, $u_n=101$.", "$101=5+(n-1)\\cdot4 \\Rightarrow n=25$.", "$S=\\dfrac{25(5+101)}{2}=1325$."] } }],
  tt: { d: "Một nhà hát có $20$ hàng ghế, hàng đầu $18$ ghế, mỗi hàng sau nhiều hơn hàng trước $2$ ghế. Hỏi nhà hát có bao nhiêu ghế? Nếu bán hết vé với giá $120\\,000$ đồng một ghế thì thu được bao nhiêu tiền?",
      g: ["Số ghế mỗi hàng lập cấp số cộng $u_1=18$, $d=2$, $n=20$.", "$S_{20}=\\dfrac{20\\left[2\\cdot18+19\\cdot2\\right]}{2}=740$ ghế.", "Số tiền: $740\\times120\\,000=88\\,800\\,000$ đồng."] },
  cs: "excel", ai: { p: "Tính tổng $5+9+13+\\dots+101$ bằng công thức cấp số cộng, nêu rõ số số hạng.", l: "AI hay tính sai số số hạng $n$ (quên cộng $1$), dẫn tới tổng lệch một số hạng." },
  bt: "Bài 2.6 – 2.11 SGK trang 51." },

7: { t: 3, yc: ["Nhận biết cấp số nhân và công bội.", "Tính số hạng tổng quát và tổng $n$ số hạng đầu.", "Giải quyết bài toán thực tiễn: lãi kép, tăng trưởng, phân rã."],
  md: [
   { t: "Định nghĩa và số hạng tổng quát", y: ["$(u_n)$ là cấp số nhân nếu $u_{n+1}=u_n\\cdot q$ với $q$ là công bội.", "Số hạng tổng quát: $u_n=u_1q^{\\,n-1}$.", "Ba số $a,b,c$ khác $0$ lập cấp số nhân khi và chỉ khi $b^2=ac$."],
     vd: { d: "Cho cấp số nhân có $u_1=3$, $u_4=24$. Tìm công bội và $u_6$.", g: ["$u_4=u_1q^3 \\Rightarrow 24=3q^3 \\Rightarrow q^3=8 \\Rightarrow q=2$.", "$u_6=3\\cdot2^5=96$."] } },
   { t: "Tổng $n$ số hạng đầu", y: ["Nếu $q\\ne1$: $S_n=u_1\\cdot\\dfrac{1-q^n}{1-q}$.", "Nếu $q=1$ thì $S_n=nu_1$."],
     vd: { d: "Tính $S=2+6+18+\\dots+2\\cdot3^9$.", g: ["Cấp số nhân $u_1=2$, $q=3$, $n=10$.", "$S=2\\cdot\\dfrac{1-3^{10}}{1-3}=3^{10}-1=59\\,048$."] } }],
  tt: { d: "Một người gửi $50$ triệu đồng theo thể thức lãi kép, lãi suất $7\\%$/năm. Hỏi sau ít nhất bao nhiêu năm người đó có được hơn $100$ triệu đồng?",
      g: ["Số tiền sau $n$ năm: $T_n=50\\cdot(1{,}07)^n$ triệu đồng.", "$50\\cdot(1{,}07)^n>100 \\Leftrightarrow (1{,}07)^n>2 \\Leftrightarrow n>\\log_{1{,}07}2\\approx10{,}24$.", "Vậy sau ít nhất $11$ năm."] },
  cs: "excel", ai: { p: "Sau bao nhiêu năm thì $50$ triệu đồng gửi lãi kép $7\\%$/năm vượt $100$ triệu đồng?", l: "AI hay làm tròn xuống thành $10$ năm, trong khi phải lấy số nguyên nhỏ nhất lớn hơn $10{,}24$ là $11$." },
  bt: "Bài 2.12 – 2.17 SGK trang 57." },

8: { t: 2, yc: ["Đọc và giải thích mẫu số liệu ghép nhóm.", "Ghép nhóm mẫu số liệu, lập bảng tần số ghép nhóm."],
  md: [
   { t: "Mẫu số liệu ghép nhóm", y: ["Mẫu số liệu ghép nhóm được chia thành các nửa khoảng $[a_1;a_2),[a_2;a_3),\\dots$", "Tần số $n_i$ là số giá trị thuộc nhóm thứ $i$; $n=n_1+n_2+\\dots+n_k$.", "Giá trị đại diện của nhóm $[a_i;a_{i+1})$ là $c_i=\\dfrac{a_i+a_{i+1}}{2}$."],
     vd: { d: "Cho bảng chiều cao (cm) của $40$ học sinh: $[150;155)$: 6; $[155;160)$: 12; $[160;165)$: 14; $[165;170)$: 8. Nêu giá trị đại diện mỗi nhóm.", g: ["Các giá trị đại diện lần lượt là $152{,}5$; $157{,}5$; $162{,}5$; $167{,}5$.", "Cỡ mẫu $n=6+12+14+8=40$."] } },
   { t: "Ghép nhóm mẫu số liệu", y: ["Số nhóm nên từ $5$ đến $10$; các nhóm có độ dài bằng nhau và phủ hết miền giá trị.", "Khi ghép nhóm ta mất thông tin chi tiết nhưng thấy rõ hình dạng phân bố."],
     vd: { d: "Ghép nhóm mẫu số liệu điểm kiểm tra của lớp với độ dài nhóm bằng $2$, bắt đầu từ $0$.", g: ["Các nhóm: $[0;2),[2;4),[4;6),[6;8),[8;10]$.", "Đếm số học sinh thuộc từng nhóm để lập bảng tần số ghép nhóm."] } }],
  tt: { d: "Thầy cô cần báo cáo kết quả khảo sát thời gian tự học mỗi ngày (phút) của $120$ học sinh khối 11. Hãy nêu cách ghép nhóm hợp lí và cho biết thông tin nào bị mất đi so với số liệu gốc.",
      g: ["Chọn khoảng $[0;30),[30;60),\\dots,[150;180)$ gồm $6$ nhóm độ dài $30$ phút.", "Bảng ghép nhóm cho thấy ngay nhóm đông nhất và hình dạng phân bố.", "Mất thông tin: không còn biết giá trị chính xác của từng học sinh."] },
  cs: "excel", ai: { p: "Hãy ghép nhóm mẫu số liệu sau thành 5 nhóm có độ dài bằng nhau và lập bảng tần số.", l: "AI hay để các nhóm chồng lấn (dùng $[150;155]$ và $[155;160]$) khiến một giá trị bị đếm hai lần." },
  bt: "Bài 3.1 – 3.3 SGK trang 63." },

9: { t: 3, yc: ["Tính số trung bình, mốt, trung vị, tứ phân vị của mẫu số liệu ghép nhóm.", "Giải thích ý nghĩa và vai trò của các số đặc trưng trong thực tiễn."],
  md: [
   { t: "Số trung bình và mốt", y: ["$\\bar{x}=\\dfrac{n_1c_1+n_2c_2+\\dots+n_kc_k}{n}$ với $c_i$ là giá trị đại diện.", "Nhóm chứa mốt là nhóm có tần số lớn nhất.", "$M_o=u_m+\\dfrac{n_m-n_{m-1}}{(n_m-n_{m-1})+(n_m-n_{m+1})}\\cdot h$."],
     vd: { d: "Với bảng chiều cao ở bài 8 ($[150;155)$: 6; $[155;160)$: 12; $[160;165)$: 14; $[165;170)$: 8), tính chiều cao trung bình.", g: ["$\\bar{x}=\\dfrac{6\\cdot152{,}5+12\\cdot157{,}5+14\\cdot162{,}5+8\\cdot167{,}5}{40}$.", "$=\\dfrac{915+1890+2275+1340}{40}=\\dfrac{6420}{40}=160{,}5$ cm."] } },
   { t: "Trung vị và tứ phân vị", y: ["Trung vị: $M_e=u_m+\\dfrac{\\dfrac{n}{2}-C}{n_m}\\cdot h$ với $C$ là tần số tích luỹ trước nhóm chứa trung vị.", "Tứ phân vị $Q_1$, $Q_3$ tính tương tự với $\\dfrac{n}{4}$ và $\\dfrac{3n}{4}$.", "Trung vị ít chịu ảnh hưởng của giá trị bất thường hơn số trung bình."],
     vd: { d: "Tính trung vị của mẫu chiều cao nói trên.", g: ["$\\dfrac{n}{2}=20$; tần số tích luỹ: $6$; $18$; $32$ nên nhóm chứa trung vị là $[160;165)$.", "$M_e=160+\\dfrac{20-18}{14}\\cdot5\\approx160{,}71$ cm."] } }],
  tt: { d: "Hai lớp cùng khảo sát thời gian tự học. Lớp A có $\\bar{x}=92$ phút, $M_e=75$ phút; lớp B có $\\bar{x}=78$ phút, $M_e=76$ phút. Nên dùng số nào để so sánh hai lớp? Vì sao?",
      g: ["Lớp A có $\\bar{x}$ lớn hơn hẳn $M_e$, dấu hiệu có vài học sinh học rất nhiều kéo trung bình lên.", "Trung vị phản ánh học sinh ở giữa nên so sánh bằng trung vị công bằng hơn.", "Theo trung vị, hai lớp gần như tương đương ($75$ và $76$ phút)."] },
  cs: "excel", ai: { p: "Tính số trung bình, trung vị và mốt của bảng tần số ghép nhóm sau, trình bày công thức đã dùng.", l: "AI hay dùng công thức của mẫu không ghép nhóm, lấy luôn đầu mút nhóm thay vì giá trị đại diện $c_i$." },
  bt: "Bài 3.4 – 3.8 SGK trang 71." },

10: { t: 3, yc: ["Nhận biết các quan hệ liên thuộc cơ bản giữa điểm, đường thẳng, mặt phẳng.", "Nắm các tính chất thừa nhận và cách xác định mặt phẳng.", "Xác định giao tuyến, giao điểm, thiết diện đơn giản."],
  md: [
   { t: "Các tính chất thừa nhận", y: ["Qua hai điểm phân biệt có duy nhất một đường thẳng.", "Qua ba điểm không thẳng hàng xác định duy nhất một mặt phẳng.", "Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung duy nhất.", "Ba cách xác định mặt phẳng: ba điểm không thẳng hàng; một điểm và một đường thẳng không qua nó; hai đường thẳng cắt nhau."],
     vd: { d: "Cho tứ diện $ABCD$. Gọi $M$, $N$ lần lượt là trung điểm $AB$, $AC$. Tìm giao tuyến của $(DMN)$ và $(BCD)$.", g: ["$D$ là điểm chung thứ nhất của hai mặt phẳng.", "Trong $(ABC)$, $MN$ cắt $BC$ tại $P$ (vì $MN\\parallel BC$ thì không cắt — ở đây $MN\\parallel BC$).", "Vì $MN\\parallel BC$ nên giao tuyến là đường thẳng qua $D$ song song với $BC$."] } },
   { t: "Tìm giao tuyến, giao điểm, thiết diện", y: ["Giao tuyến: tìm hai điểm chung của hai mặt phẳng.", "Giao điểm của $d$ và $(\\alpha)$: chọn mặt phẳng phụ chứa $d$, tìm giao tuyến rồi lấy giao điểm.", "Thiết diện: lần lượt tìm giao tuyến của mặt phẳng cắt với các mặt của hình."],
     vd: { d: "Cho hình chóp $S.ABCD$ đáy là hình bình hành. Tìm giao tuyến của $(SAC)$ và $(SBD)$.", g: ["$S$ là điểm chung thứ nhất.", "Gọi $O=AC\\cap BD$ thì $O$ thuộc cả hai mặt phẳng.", "Giao tuyến là $SO$."] } }],
  tt: { d: "Vì sao chiếc ghế ba chân luôn đứng vững trên nền nhà gồ ghề, còn ghế bốn chân thì hay bị kênh? Hãy giải thích bằng tính chất thừa nhận của hình học không gian.",
      g: ["Ba điểm không thẳng hàng luôn xác định đúng một mặt phẳng, nên ba chân ghế luôn cùng nằm trên một mặt phẳng.", "Bốn điểm nói chung không đồng phẳng.", "Vì vậy ghế bốn chân cần nền phẳng hoặc bốn chân thật đều mới không kênh."] },
  cs: "geogebra3d", ai: { p: "Cho hình chóp $S.ABCD$ đáy hình bình hành, tìm giao tuyến của $(SAC)$ và $(SBD)$, giải thích từng bước.", l: "AI thường kết luận ngay mà không chỉ ra hai điểm chung, hoặc nhầm $O$ là trung điểm khi đáy chỉ là hình thang." },
  bt: "Bài 4.1 – 4.6 SGK trang 80." },

11: { t: 2, yc: ["Nhận biết vị trí tương đối của hai đường thẳng trong không gian.", "Chứng minh hai đường thẳng song song, vận dụng tính chất giao tuyến ba mặt phẳng."],
  md: [
   { t: "Vị trí tương đối của hai đường thẳng", y: ["Hai đường thẳng đồng phẳng: cắt nhau, song song hoặc trùng nhau.", "Hai đường thẳng không đồng phẳng gọi là chéo nhau.", "Qua một điểm ngoài đường thẳng $d$ có duy nhất một đường thẳng song song với $d$."],
     vd: { d: "Cho tứ diện $ABCD$. Xét vị trí tương đối của $AB$ và $CD$.", g: ["Giả sử $AB$ và $CD$ đồng phẳng thì bốn điểm $A,B,C,D$ cùng thuộc một mặt phẳng.", "Điều này trái với giả thiết $ABCD$ là tứ diện.", "Vậy $AB$ và $CD$ chéo nhau."] } },
   { t: "Tính chất và định lí giao tuyến", y: ["Hai đường thẳng phân biệt cùng song song với đường thứ ba thì song song với nhau.", "Nếu ba mặt phẳng đôi một cắt nhau theo ba giao tuyến phân biệt thì ba giao tuyến đó đồng quy hoặc đôi một song song."],
     vd: { d: "Cho hình chóp $S.ABCD$ đáy là hình bình hành. Chứng minh giao tuyến của $(SAB)$ và $(SCD)$ song song với $AB$.", g: ["Hai mặt phẳng có điểm chung $S$.", "$AB\\subset(SAB)$, $CD\\subset(SCD)$ và $AB\\parallel CD$.", "Vậy giao tuyến là đường thẳng qua $S$ và song song với $AB$."] } }],
  tt: { d: "Trong một nhà xưởng, hai đường ống được treo trên trần theo hai hướng khác nhau. Làm thế nào để biết hai ống đó có thể gặp nhau hay vĩnh viễn không chạm nhau?",
      g: ["Nếu hai ống cùng nằm trong một mặt phẳng thì chúng hoặc cắt nhau, hoặc song song.", "Nếu không tìm được mặt phẳng chứa cả hai thì chúng chéo nhau.", "Hai ống chéo nhau không bao giờ gặp nhau dù kéo dài bao xa."] },
  cs: "geogebra3d", ai: { p: "Hai đường thẳng $AB$ và $CD$ trong tứ diện $ABCD$ có vị trí tương đối nào? Chứng minh.", l: "AI đôi khi nói hai đường thẳng không cắt nhau thì song song, quên trường hợp chéo nhau trong không gian." },
  bt: "Bài 4.7 – 4.11 SGK trang 85." },

12: { t: 2, yc: ["Nhận biết đường thẳng song song với mặt phẳng.", "Chứng minh quan hệ song song đường – mặt, vận dụng tìm giao tuyến và thiết diện."],
  md: [
   { t: "Điều kiện song song", y: ["$d\\parallel(\\alpha)$ khi $d$ và $(\\alpha)$ không có điểm chung.", "Nếu $d\\not\\subset(\\alpha)$ và $d\\parallel d'$ với $d'\\subset(\\alpha)$ thì $d\\parallel(\\alpha)$.", "Nếu $d\\parallel(\\alpha)$ thì mọi mặt phẳng chứa $d$ mà cắt $(\\alpha)$ đều cắt theo giao tuyến song song với $d$."],
     vd: { d: "Cho tứ diện $ABCD$, $M$, $N$ là trung điểm $AB$, $AC$. Chứng minh $MN\\parallel(BCD)$.", g: ["$MN$ là đường trung bình tam giác $ABC$ nên $MN\\parallel BC$.", "$BC\\subset(BCD)$ và $MN\\not\\subset(BCD)$.", "Vậy $MN\\parallel(BCD)$."] } }],
  tt: { d: "Người thợ đặt mép trên của một tấm ván song song với mặt sàn. Hãy giải thích vì sao chỉ cần kiểm tra mép ván song song với một đường thẳng nằm trên sàn là đủ.",
      g: ["Theo định lí, nếu đường thẳng không nằm trong mặt phẳng mà song song với một đường thẳng của mặt phẳng đó thì nó song song với mặt phẳng.", "Mép ván không nằm trên sàn và song song với một đường kẻ trên sàn.", "Do đó mép ván song song với mặt sàn."] },
  cs: "geogebra3d", ai: { p: "Chứng minh đường trung bình $MN$ của tam giác $ABC$ song song với mặt phẳng $(BCD)$ trong tứ diện $ABCD$.", l: "AI hay bỏ sót điều kiện $MN\\not\\subset(BCD)$, khiến lập luận không chặt chẽ." },
  bt: "Bài 4.12 – 4.16 SGK trang 90." },

13: { t: 2, yc: ["Nhận biết hai mặt phẳng song song.", "Vận dụng định lí Thalès trong không gian; nhận biết hình lăng trụ, hình hộp."],
  md: [
   { t: "Hai mặt phẳng song song", y: ["Nếu $(\\alpha)$ chứa hai đường thẳng cắt nhau cùng song song với $(\\beta)$ thì $(\\alpha)\\parallel(\\beta)$.", "Nếu $(\\gamma)$ cắt $(\\alpha)$ và $(\\beta)$ song song thì hai giao tuyến song song.", "Qua một điểm ngoài mặt phẳng có duy nhất một mặt phẳng song song với mặt phẳng đó."],
     vd: { d: "Cho hình hộp $ABCD.A'B'C'D'$. Chứng minh $(AB'D')\\parallel(C'BD)$.", g: ["$AB'\\parallel DC'$ và $AD'\\parallel BC'$ (các mặt bên là hình bình hành).", "Hai đường $AB'$, $AD'$ cắt nhau tại $A$ và cùng song song với $(C'BD)$.", "Vậy $(AB'D')\\parallel(C'BD)$."] } },
   { t: "Định lí Thalès và hình lăng trụ", y: ["Ba mặt phẳng đôi một song song chắn trên hai cát tuyến những đoạn thẳng tỉ lệ.", "Hình lăng trụ có hai đáy song song và bằng nhau, các mặt bên là hình bình hành.", "Hình hộp là lăng trụ có đáy là hình bình hành."] }],
  tt: { d: "Các bậc của một cầu thang được đổ bê tông sao cho mặt bậc đều song song với nền nhà. Vì sao khi cắt cầu thang bằng một mặt phẳng nghiêng (lan can), vết cắt trên các bậc lại song song với nhau?",
      g: ["Các mặt bậc là những mặt phẳng song song với nhau.", "Mặt phẳng lan can cắt chúng theo các giao tuyến.", "Theo tính chất, hai mặt phẳng song song bị cắt bởi mặt phẳng thứ ba thì hai giao tuyến song song."] },
  cs: "geogebra3d", ai: { p: "Chứng minh $(AB'D')\\parallel(C'BD)$ trong hình hộp $ABCD.A'B'C'D'$.", l: "AI hay chỉ nêu một cặp đường song song, trong khi cần hai đường cắt nhau cùng song song với mặt phẳng kia." },
  bt: "Bài 4.17 – 4.22 SGK trang 97." },

14: { t: 2, yc: ["Nhận biết phép chiếu song song và các tính chất.", "Vẽ hình biểu diễn của một hình không gian."],
  md: [
   { t: "Phép chiếu song song", y: ["Phép chiếu song song theo phương $\\ell$ lên mặt phẳng $(\\alpha)$ biến mỗi điểm $M$ thành giao điểm của đường thẳng qua $M$ song song $\\ell$ với $(\\alpha)$.", "Phép chiếu song song biến đường thẳng thành đường thẳng, biến hai đường song song thành hai đường song song hoặc trùng nhau.", "Phép chiếu bảo toàn tỉ số độ dài của hai đoạn thẳng cùng phương."],
     vd: { d: "Hình chiếu song song của một hình vuông có thể là hình gì?", g: ["Phép chiếu giữ tính song song nên ảnh là hình bình hành.", "Tuỳ phương chiếu, ảnh có thể là hình vuông, hình chữ nhật, hình thoi hoặc hình bình hành bất kì."] } },
   { t: "Hình biểu diễn", y: ["Hình biểu diễn giữ quan hệ song song, trung điểm và tỉ số; không giữ độ dài và góc.", "Quy ước: nét khuất vẽ nét đứt; hình vuông, hình chữ nhật đáy thường vẽ thành hình bình hành."] }],
  tt: { d: "Vì sao bóng nắng của một khung cửa sổ hình chữ nhật in trên nền nhà lại là một hình bình hành, và vì sao bóng của hai thanh song song vẫn song song?",
      g: ["Tia nắng mặt trời coi như các tia song song nên bóng là hình chiếu song song.", "Phép chiếu song song biến hai đường song song thành hai đường song song.", "Hình chữ nhật có hai cặp cạnh song song nên bóng là hình bình hành."] },
  cs: "geogebra3d", ai: { p: "Hình chiếu song song của hình vuông có thể là những hình nào? Giải thích.", l: "AI hay khẳng định ảnh luôn là hình vuông hoặc luôn giữ nguyên số đo góc." },
  bt: "Bài 4.23 – 4.27 SGK trang 101." },

15: { t: 3, yc: ["Nhận biết giới hạn hữu hạn của dãy số.", "Vận dụng các phép toán giới hạn, tính tổng cấp số nhân lùi vô hạn, nhận biết giới hạn vô cực."],
  md: [
   { t: "Giới hạn hữu hạn", y: ["$\\lim u_n=a$ nếu $|u_n-a|$ nhỏ tuỳ ý khi $n$ đủ lớn.", "$\\lim\\dfrac{1}{n^k}=0$ $(k>0)$; $\\lim q^n=0$ khi $|q|<1$.", "Phép toán: giới hạn của tổng, hiệu, tích, thương (mẫu khác $0$)."],
     vd: { d: "Tính $\\lim\\dfrac{3n^2-n+2}{2n^2+5}$.", g: ["Chia tử và mẫu cho $n^2$: $\\dfrac{3-\\dfrac1n+\\dfrac{2}{n^2}}{2+\\dfrac{5}{n^2}}$.", "Khi $n\\to+\\infty$ các số hạng chứa $\\dfrac1n$, $\\dfrac{1}{n^2}$ dần về $0$.", "Giới hạn bằng $\\dfrac32$."] } },
   { t: "Cấp số nhân lùi vô hạn và giới hạn vô cực", y: ["Cấp số nhân lùi vô hạn ($|q|<1$) có tổng $S=\\dfrac{u_1}{1-q}$.", "$\\lim u_n=+\\infty$ nếu $u_n$ lớn hơn mọi số dương cho trước khi $n$ đủ lớn.", "$\\lim n^k=+\\infty$; $\\lim q^n=+\\infty$ khi $q>1$."],
     vd: { d: "Tính tổng $S=1+\\dfrac13+\\dfrac19+\\dfrac{1}{27}+\\dots$", g: ["Đây là cấp số nhân lùi vô hạn với $u_1=1$, $q=\\dfrac13$.", "$S=\\dfrac{1}{1-\\dfrac13}=\\dfrac32$."] } }],
  tt: { d: "Thả một quả bóng từ độ cao $9$ m, mỗi lần chạm đất bóng nảy lên bằng $\\dfrac23$ độ cao lần trước. Tính tổng quãng đường bóng đi được cho đến khi dừng hẳn.",
      g: ["Quãng đường rơi lần đầu: $9$ m.", "Các lần sau bóng nảy lên rồi rơi xuống: $2\\left(9\\cdot\\dfrac23+9\\cdot\\dfrac49+\\dots\\right)=2\\cdot\\dfrac{9\\cdot\\frac23}{1-\\frac23}=36$ m.", "Tổng quãng đường $=9+36=45$ m."] },
  cs: "excel", ai: { p: "Tính tổng quãng đường quả bóng rơi từ $9$ m, mỗi lần nảy lại $\\dfrac23$ độ cao trước.", l: "AI hay quên nhân đôi quãng đường các lần nảy (lên rồi lại xuống), cho kết quả $27$ m." },
  bt: "Bài 5.1 – 5.6 SGK trang 112." },

16: { t: 3, yc: ["Nhận biết giới hạn hữu hạn của hàm số tại một điểm, tại vô cực và giới hạn vô cực.", "Tính giới hạn bằng các phép toán và khử dạng vô định đơn giản."],
  md: [
   { t: "Giới hạn hữu hạn tại một điểm", y: ["$\\lim\\limits_{x\\to x_0}f(x)=L$ nếu với mọi dãy $x_n\\to x_0$ ($x_n\\ne x_0$) thì $f(x_n)\\to L$.", "Nếu $f$ xác định tại $x_0$ và là hàm đa thức, phân thức có mẫu khác $0$ thì $\\lim\\limits_{x\\to x_0}f(x)=f(x_0)$.", "Giới hạn một bên: $\\lim\\limits_{x\\to x_0^+}$ và $\\lim\\limits_{x\\to x_0^-}$; giới hạn tồn tại khi hai giới hạn một bên bằng nhau."],
     vd: { d: "Tính $\\lim\\limits_{x\\to2}\\dfrac{x^2-4}{x-2}$.", g: ["Dạng $\\dfrac00$, phân tích tử: $x^2-4=(x-2)(x+2)$.", "Rút gọn: $\\dfrac{(x-2)(x+2)}{x-2}=x+2$ với $x\\ne2$.", "Giới hạn bằng $2+2=4$."] } },
   { t: "Giới hạn tại vô cực, giới hạn vô cực", y: ["$\\lim\\limits_{x\\to\\pm\\infty}\\dfrac{1}{x^k}=0$ $(k>0)$.", "Với phân thức, chia tử mẫu cho luỹ thừa bậc cao nhất của $x$.", "$\\lim\\limits_{x\\to x_0}f(x)=\\pm\\infty$ khi $|f(x)|$ lớn vô hạn."],
     vd: { d: "Tính $\\lim\\limits_{x\\to+\\infty}\\dfrac{2x+1}{x-3}$.", g: ["Chia tử mẫu cho $x$: $\\dfrac{2+\\dfrac1x}{1-\\dfrac3x}$.", "Khi $x\\to+\\infty$ ta được $\\dfrac{2+0}{1-0}=2$."] } }],
  tt: { d: "Nồng độ thuốc trong máu sau $t$ giờ là $C(t)=\\dfrac{5t}{t^2+1}$ (mg/l). Hỏi khi thời gian rất lớn thì nồng độ thuốc tiến dần về bao nhiêu? Ý nghĩa thực tế là gì?",
      g: ["$\\lim\\limits_{t\\to+\\infty}\\dfrac{5t}{t^2+1}=\\lim\\limits_{t\\to+\\infty}\\dfrac{\\frac5t}{1+\\frac{1}{t^2}}=0$.", "Nồng độ thuốc tiến dần về $0$.", "Nghĩa là sau thời gian đủ dài thuốc được đào thải gần hết khỏi máu."] },
  cs: "geogebra", ai: { p: "Tính $\\lim\\limits_{x\\to2}\\dfrac{x^2-4}{x-2}$ và giải thích vì sao không thay trực tiếp $x=2$.", l: "AI có lúc kết luận giới hạn không tồn tại vì mẫu bằng $0$, thay vì khử dạng vô định." },
  bt: "Bài 5.7 – 5.12 SGK trang 121." },

17: { t: 2, yc: ["Nhận biết hàm số liên tục tại một điểm, trên một khoảng, trên một đoạn.", "Nhận biết tính liên tục của hàm đa thức, phân thức, lượng giác; ứng dụng chứng minh phương trình có nghiệm."],
  md: [
   { t: "Hàm số liên tục tại một điểm", y: ["$f$ liên tục tại $x_0$ nếu $\\lim\\limits_{x\\to x_0}f(x)=f(x_0)$.", "Cần ba điều kiện: $f$ xác định tại $x_0$, tồn tại giới hạn và hai giá trị đó bằng nhau.", "Hàm đa thức liên tục trên $\\mathbb{R}$; hàm phân thức liên tục trên các khoảng mà mẫu khác $0$."],
     vd: { d: "Tìm $m$ để hàm số $f(x)=\\begin{cases}\\dfrac{x^2-1}{x-1} & x\\ne1\\\\ m & x=1\\end{cases}$ liên tục tại $x=1$.", g: ["Với $x\\ne1$: $f(x)=x+1$, nên $\\lim\\limits_{x\\to1}f(x)=2$.", "Để liên tục cần $m=f(1)=2$.", "Vậy $m=2$."] } },
   { t: "Tính chất và ứng dụng", y: ["Tổng, hiệu, tích, thương (mẫu khác $0$) các hàm liên tục là hàm liên tục.", "Nếu $f$ liên tục trên $[a;b]$ và $f(a)\\cdot f(b)<0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm trong $(a;b)$."],
     vd: { d: "Chứng minh phương trình $x^3-3x+1=0$ có nghiệm thuộc $(0;1)$.", g: ["Đặt $f(x)=x^3-3x+1$ liên tục trên $[0;1]$.", "$f(0)=1>0$, $f(1)=-1<0$ nên $f(0)f(1)<0$.", "Vậy phương trình có ít nhất một nghiệm trong $(0;1)$."] } }],
  tt: { d: "Biểu giá điện sinh hoạt tính theo bậc thang: $1\\,984$ đồng/kWh cho $50$ kWh đầu, $2\\,050$ đồng/kWh cho phần tiếp theo. Hàm số tiền điện theo số kWh có liên tục không? Điều đó có ý nghĩa gì với người dùng?",
      g: ["Số tiền $T(x)$ là hàm bậc nhất từng khúc, tại $x=50$ hai nhánh cho cùng giá trị $99\\,200$ đồng.", "Vậy $T$ liên tục tại điểm chuyển bậc.", "Ý nghĩa: dùng thêm $1$ kWh quanh mốc $50$ không làm tiền điện nhảy vọt, chỉ đơn giá phần vượt tăng lên."] },
  cs: "geogebra", ai: { p: "Tìm $m$ để hàm số cho bởi hai nhánh liên tục tại $x=1$, trình bày đủ ba điều kiện.", l: "AI thường chỉ tính giới hạn mà quên so sánh với giá trị $f(1)$, hoặc bỏ qua giới hạn một bên." },
  bt: "Bài 5.13 – 5.18 SGK trang 127." },

18: { t: 2, yc: ["Nhận biết luỹ thừa với số mũ nguyên, hữu tỉ, thực.", "Vận dụng tính chất của phép tính luỹ thừa để rút gọn và tính toán."],
  md: [
   { t: "Luỹ thừa với số mũ nguyên và hữu tỉ", y: ["$a^0=1$, $a^{-n}=\\dfrac{1}{a^n}$ $(a\\ne0)$.", "Căn bậc $n$: $\\sqrt[n]{a}=b \\Leftrightarrow b^n=a$.", "$a^{\\frac{m}{n}}=\\sqrt[n]{a^m}$ với $a>0$."],
     vd: { d: "Tính $A=8^{\\frac23}\\cdot 4^{-\\frac12}$.", g: ["$8^{\\frac23}=\\sqrt[3]{8^2}=4$.", "$4^{-\\frac12}=\\dfrac{1}{\\sqrt4}=\\dfrac12$.", "$A=4\\cdot\\dfrac12=2$."] } },
   { t: "Tính chất của luỹ thừa", y: ["$a^m\\cdot a^n=a^{m+n}$; $\\dfrac{a^m}{a^n}=a^{m-n}$; $(a^m)^n=a^{mn}$.", "$(ab)^n=a^nb^n$; $\\left(\\dfrac{a}{b}\\right)^n=\\dfrac{a^n}{b^n}$.", "Với $a>1$: $a^m>a^n \\Leftrightarrow m>n$; với $0<a<1$ thì bất đẳng thức đổi chiều."],
     vd: { d: "Rút gọn $B=\\dfrac{a^{\\frac43}\\cdot a^{-\\frac13}}{\\sqrt[3]{a}}$ với $a>0$.", g: ["Tử: $a^{\\frac43-\\frac13}=a$.", "Mẫu: $\\sqrt[3]{a}=a^{\\frac13}$.", "$B=a^{1-\\frac13}=a^{\\frac23}$."] } }],
  tt: { d: "Dân số một tỉnh là $1{,}8$ triệu người, tăng $1{,}2\\%$ mỗi năm. Viết công thức dân số sau $t$ năm và tính dân số sau $10$ năm.",
      g: ["$P(t)=1{,}8\\cdot(1{,}012)^t$ (triệu người).", "$P(10)=1{,}8\\cdot(1{,}012)^{10}\\approx 1{,}8\\cdot1{,}1268$.", "$\\approx2{,}03$ triệu người."] },
  cs: "casio", ai: { p: "Rút gọn biểu thức luỹ thừa $\\dfrac{a^{4/3}a^{-1/3}}{\\sqrt[3]{a}}$ và nêu điều kiện của $a$.", l: "AI hay quên điều kiện $a>0$ khi dùng luỹ thừa với số mũ hữu tỉ." },
  bt: "Bài 6.1 – 6.6 SGK trang 11 (Tập 2)." },

19: { t: 2, yc: ["Nhận biết khái niệm lôgarit cơ số $a$.", "Vận dụng các tính chất và quy tắc tính lôgarit, đổi cơ số."],
  md: [
   { t: "Khái niệm lôgarit", y: ["Với $a>0$, $a\\ne1$, $b>0$: $\\log_ab=\\alpha \\Leftrightarrow a^\\alpha=b$.", "$\\log_a1=0$, $\\log_aa=1$, $a^{\\log_ab}=b$.", "Lôgarit thập phân $\\log b$ (cơ số $10$), lôgarit tự nhiên $\\ln b$ (cơ số $e$)."],
     vd: { d: "Tính $\\log_2 32$ và $\\log_{\\frac13}9$.", g: ["$32=2^5$ nên $\\log_232=5$.", "$9=3^2=\\left(\\dfrac13\\right)^{-2}$ nên $\\log_{\\frac13}9=-2$."] } },
   { t: "Quy tắc tính lôgarit", y: ["$\\log_a(xy)=\\log_ax+\\log_ay$; $\\log_a\\dfrac{x}{y}=\\log_ax-\\log_ay$.", "$\\log_ax^\\alpha=\\alpha\\log_ax$.", "Đổi cơ số: $\\log_ab=\\dfrac{\\log_cb}{\\log_ca}$; $\\log_ab=\\dfrac{1}{\\log_ba}$."],
     vd: { d: "Cho $\\log_23=a$. Tính $\\log_618$ theo $a$.", g: ["$\\log_618=\\dfrac{\\log_218}{\\log_26}=\\dfrac{\\log_2(2\\cdot3^2)}{\\log_2(2\\cdot3)}$.", "$=\\dfrac{1+2\\log_23}{1+\\log_23}=\\dfrac{1+2a}{1+a}$."] } }],
  tt: { d: "Độ to của âm tính bằng $L=10\\log\\dfrac{I}{I_0}$ (dB) với $I_0=10^{-12}$ W/m². Một máy cắt cỏ có $I=10^{-4}$ W/m². Tính $L$. Nếu cường độ âm tăng gấp $10$ lần thì $L$ tăng bao nhiêu?",
      g: ["$L=10\\log\\dfrac{10^{-4}}{10^{-12}}=10\\log10^{8}=80$ dB.", "Khi $I$ tăng $10$ lần: $L'=10\\log\\dfrac{10I}{I_0}=L+10\\log10=L+10$.", "Vậy độ to tăng thêm $10$ dB."] },
  cs: "casio", ai: { p: "Cho $\\log_23=a$, hãy tính $\\log_618$ theo $a$, trình bày từng bước đổi cơ số.", l: "AI hay viết $\\log_6 18=\\log_6 2+\\log_6 9$ rồi dừng, không đưa về cùng cơ số $2$ theo yêu cầu." },
  bt: "Bài 6.7 – 6.12 SGK trang 17 (Tập 2)." },

20: { t: 2, yc: ["Nhận biết hàm số mũ, hàm số lôgarit; tập xác định, tập giá trị.", "Vẽ và đọc đồ thị, nhận biết tính đồng biến, nghịch biến."],
  md: [
   { t: "Hàm số mũ", y: ["$y=a^x$ $(a>0,a\\ne1)$ có tập xác định $\\mathbb{R}$, tập giá trị $(0;+\\infty)$.", "Đồng biến khi $a>1$, nghịch biến khi $0<a<1$.", "Đồ thị luôn đi qua $(0;1)$ và nhận trục hoành làm tiệm cận ngang."],
     vd: { d: "So sánh $2^{\\sqrt3}$ và $2^{1{,}7}$.", g: ["Hàm $y=2^x$ đồng biến vì $2>1$.", "$\\sqrt3\\approx1{,}732>1{,}7$.", "Vậy $2^{\\sqrt3}>2^{1{,}7}$."] } },
   { t: "Hàm số lôgarit", y: ["$y=\\log_ax$ có tập xác định $(0;+\\infty)$, tập giá trị $\\mathbb{R}$.", "Đồng biến khi $a>1$, nghịch biến khi $0<a<1$.", "Đồ thị đi qua $(1;0)$, nhận trục tung làm tiệm cận đứng; đối xứng với đồ thị $y=a^x$ qua đường $y=x$."],
     vd: { d: "Tìm tập xác định của $y=\\log_3(2x-6)$.", g: ["Điều kiện $2x-6>0$.", "$\\Leftrightarrow x>3$.", "$D=(3;+\\infty)$."] } }],
  tt: { d: "Chất phóng xạ có chu kì bán rã $5\\,730$ năm (cacbon‑14). Khối lượng còn lại sau $t$ năm là $m(t)=m_0\\cdot\\left(\\dfrac12\\right)^{\\frac{t}{5730}}$. Một mẫu gỗ cổ còn $25\\%$ lượng cacbon‑14 ban đầu. Mẫu gỗ đó bao nhiêu tuổi?",
      g: ["$\\left(\\dfrac12\\right)^{\\frac{t}{5730}}=0{,}25=\\left(\\dfrac12\\right)^2$.", "$\\dfrac{t}{5730}=2$.", "$t=11\\,460$ năm."] },
  cs: "geogebra", ai: { p: "Vẽ đồ thị $y=2^x$ và $y=\\log_2 x$, nêu quan hệ giữa hai đồ thị.", l: "AI hay nói hai đồ thị đối xứng qua trục hoành thay vì qua đường thẳng $y=x$." },
  bt: "Bài 6.13 – 6.18 SGK trang 25 (Tập 2)." },

21: { t: 3, yc: ["Giải phương trình, bất phương trình mũ và lôgarit cơ bản.", "Vận dụng vào bài toán thực tiễn: lãi suất, tăng trưởng, phân rã."],
  md: [
   { t: "Phương trình mũ và lôgarit", y: ["$a^{f(x)}=a^{g(x)} \\Leftrightarrow f(x)=g(x)$.", "$a^{f(x)}=b$ $(b>0)$ $\\Leftrightarrow f(x)=\\log_ab$.", "$\\log_af(x)=\\log_ag(x) \\Leftrightarrow f(x)=g(x)>0$ (phải đặt điều kiện)."],
     vd: { d: "Giải phương trình $\\log_2(x-1)+\\log_2(x+1)=3$.", g: ["Điều kiện: $x>1$.", "$\\log_2\\left[(x-1)(x+1)\\right]=3 \\Leftrightarrow x^2-1=8$.", "$x^2=9 \\Rightarrow x=3$ (loại $x=-3$). Vậy $x=3$."] } },
   { t: "Bất phương trình mũ và lôgarit", y: ["Với $a>1$: $a^{f(x)}>a^{g(x)} \\Leftrightarrow f(x)>g(x)$.", "Với $0<a<1$: bất phương trình đổi chiều.", "Luôn đặt điều kiện xác định trước khi biến đổi lôgarit."],
     vd: { d: "Giải bất phương trình $\\log_{\\frac12}(x-2)>-1$.", g: ["Điều kiện $x>2$.", "Cơ số $\\dfrac12<1$ nên bất phương trình $\\Leftrightarrow x-2<\\left(\\dfrac12\\right)^{-1}=2$.", "$x<4$. Kết hợp điều kiện: $2<x<4$."] } }],
  tt: { d: "Một người vay $600$ triệu đồng mua nhà, lãi suất $9\\%$/năm, trả góp cuối mỗi năm $90$ triệu đồng. Hỏi sau bao nhiêu năm trả hết nợ?",
      g: ["Sau $n$ năm số nợ còn lại: $T_n=600(1{,}09)^n-90\\cdot\\dfrac{(1{,}09)^n-1}{0{,}09}$.", "Cho $T_n=0$: $600(1{,}09)^n=1000\\left[(1{,}09)^n-1\\right]$, suy ra $(1{,}09)^n=2{,}5$.", "$n=\\log_{1{,}09}2{,}5\\approx10{,}6$, vậy cần $11$ năm."] },
  cs: "casio", ai: { p: "Giải phương trình $\\log_2(x-1)+\\log_2(x+1)=3$, nêu rõ điều kiện xác định.", l: "AI thường nhận cả hai nghiệm $x=\\pm3$ vì bỏ qua điều kiện $x>1$." },
  bt: "Bài 6.19 – 6.26 SGK trang 32 (Tập 2)." },

22: { t: 2, yc: ["Nhận biết góc giữa hai đường thẳng trong không gian.", "Chứng minh hai đường thẳng vuông góc."],
  md: [
   { t: "Góc giữa hai đường thẳng", y: ["Góc giữa hai đường thẳng $a$, $b$ là góc giữa hai đường thẳng cắt nhau $a'\\parallel a$, $b'\\parallel b$, nhận giá trị trong $[0^\\circ;90^\\circ]$.", "$a\\perp b$ khi góc giữa chúng bằng $90^\\circ$; hai đường vuông góc có thể chéo nhau.", "Có thể dùng tích vô hướng: $\\cos(a,b)=\\dfrac{\\left|\\vec{u}\\cdot\\vec{v}\\right|}{|\\vec{u}||\\vec{v}|}$."],
     vd: { d: "Cho hình lập phương $ABCD.A'B'C'D'$. Tính góc giữa $AC$ và $B'D'$.", g: ["$B'D'\\parallel BD$ nên góc giữa $AC$ và $B'D'$ bằng góc giữa $AC$ và $BD$.", "Trong hình vuông $ABCD$, hai đường chéo vuông góc.", "Vậy góc cần tìm bằng $90^\\circ$."] } }],
  tt: { d: "Người thợ dựng một cột đèn và muốn kiểm tra cột có vuông góc với mép đường hay không, trong khi cột và mép đường không cắt nhau. Hãy nêu cách kiểm tra dựa vào định nghĩa góc giữa hai đường thẳng.",
      g: ["Kẻ qua chân cột một đường thẳng song song với mép đường.", "Đo góc giữa cột và đường vừa kẻ.", "Góc đó chính là góc giữa cột và mép đường; bằng $90^\\circ$ thì hai đường vuông góc."] },
  cs: "geogebra3d", ai: { p: "Tính góc giữa $AC$ và $B'D'$ trong hình lập phương, giải thích vì sao được phép thay $B'D'$ bởi $BD$.", l: "AI đôi khi cho rằng hai đường chéo nhau thì không xác định được góc." },
  bt: "Bài 7.1 – 7.5 SGK trang 44 (Tập 2)." },

23: { t: 3, yc: ["Nhận biết đường thẳng vuông góc với mặt phẳng.", "Chứng minh quan hệ vuông góc đường – mặt; vận dụng định lí ba đường vuông góc."],
  md: [
   { t: "Điều kiện vuông góc", y: ["$d\\perp(\\alpha)$ nếu $d$ vuông góc với mọi đường thẳng nằm trong $(\\alpha)$.", "Định lí: nếu $d$ vuông góc với hai đường thẳng cắt nhau nằm trong $(\\alpha)$ thì $d\\perp(\\alpha)$.", "Nếu $d\\perp(\\alpha)$ thì $d$ vuông góc với mọi đường thẳng của $(\\alpha)$."],
     vd: { d: "Cho hình chóp $S.ABCD$ có $SA\\perp(ABCD)$, đáy là hình vuông. Chứng minh $BC\\perp(SAB)$.", g: ["$SA\\perp(ABCD)$ nên $SA\\perp BC$.", "$ABCD$ là hình vuông nên $AB\\perp BC$.", "$BC$ vuông góc với hai đường cắt nhau $SA$, $AB$ của $(SAB)$, suy ra $BC\\perp(SAB)$."] } },
   { t: "Định lí ba đường vuông góc", y: ["Cho $a\\not\\subset(\\alpha)$, $a'$ là hình chiếu của $a$ lên $(\\alpha)$ và $b\\subset(\\alpha)$.", "Khi đó $b\\perp a \\Leftrightarrow b\\perp a'$.", "Đây là công cụ chính để chứng minh vuông góc trong hình chóp."] }],
  tt: { d: "Vì sao người thợ dựng cột chỉ cần căng dây kiểm tra cột vuông góc với hai mép sàn cắt nhau là biết cột vuông góc với cả mặt sàn?",
      g: ["Hai mép sàn cắt nhau là hai đường thẳng cắt nhau nằm trong mặt sàn.", "Theo định lí, đường thẳng vuông góc với hai đường cắt nhau của một mặt phẳng thì vuông góc với mặt phẳng ấy.", "Vậy cột vuông góc với mọi đường trên sàn, tức vuông góc với mặt sàn."] },
  cs: "geogebra3d", ai: { p: "Chứng minh $BC\\perp(SAB)$ trong hình chóp $S.ABCD$ có $SA\\perp(ABCD)$, đáy hình vuông.", l: "AI hay chỉ nêu một quan hệ vuông góc, quên điều kiện phải có hai đường cắt nhau." },
  bt: "Bài 7.6 – 7.11 SGK trang 52 (Tập 2)." },

24: { t: 2, yc: ["Nhận biết phép chiếu vuông góc.", "Xác định và tính góc giữa đường thẳng và mặt phẳng."],
  md: [
   { t: "Phép chiếu vuông góc", y: ["Phép chiếu vuông góc lên $(\\alpha)$ là phép chiếu song song theo phương vuông góc với $(\\alpha)$.", "Hình chiếu của điểm $M$ là chân đường vuông góc hạ từ $M$ xuống $(\\alpha)$."] },
   { t: "Góc giữa đường thẳng và mặt phẳng", y: ["Nếu $d\\perp(\\alpha)$ thì góc bằng $90^\\circ$.", "Nếu $d$ không vuông góc với $(\\alpha)$ thì góc giữa $d$ và $(\\alpha)$ là góc giữa $d$ và hình chiếu $d'$ của nó.", "Góc này luôn thuộc $[0^\\circ;90^\\circ]$."],
     vd: { d: "Cho hình chóp $S.ABCD$ có $SA\\perp(ABCD)$, $SA=a\\sqrt3$, đáy là hình vuông cạnh $a$. Tính góc giữa $SC$ và $(ABCD)$.", g: ["Hình chiếu của $S$ lên đáy là $A$, nên hình chiếu của $SC$ là $AC$.", "Góc cần tìm là $\\widehat{SCA}$ với $\\tan\\widehat{SCA}=\\dfrac{SA}{AC}=\\dfrac{a\\sqrt3}{a\\sqrt2}=\\sqrt{\\dfrac32}$.", "Suy ra $\\widehat{SCA}\\approx50^\\circ46'$."] } }],
  tt: { d: "Lắp một tấm pin mặt trời nghiêng so với mặt đất. Muốn biết góc nghiêng thực tế của cạnh tấm pin so với mặt đất, người kĩ thuật đo như thế nào?",
      g: ["Chiếu vuông góc cạnh tấm pin xuống mặt đất được bóng của nó.", "Góc giữa cạnh tấm pin và bóng của nó chính là góc giữa cạnh và mặt đất.", "Đo góc đó bằng thước đo góc hoặc tính qua chiều cao và chiều dài bóng."] },
  cs: "geogebra3d", ai: { p: "Tính góc giữa $SC$ và mặt phẳng đáy trong hình chóp có $SA$ vuông góc với đáy.", l: "AI hay lấy góc giữa $SC$ và cạnh $AB$ hoặc nhầm hình chiếu của $SC$ là $AB$ thay vì $AC$." },
  bt: "Bài 7.12 – 7.16 SGK trang 58 (Tập 2)." },

25: { t: 2, yc: ["Nhận biết góc nhị diện và góc phẳng nhị diện.", "Nhận biết hai mặt phẳng vuông góc; hình lăng trụ đứng, hình chóp đều."],
  md: [
   { t: "Góc nhị diện", y: ["Góc nhị diện tạo bởi hai nửa mặt phẳng có chung bờ.", "Góc phẳng nhị diện: dựng trong hai nửa mặt phẳng hai tia cùng vuông góc với cạnh nhị diện tại một điểm.", "Số đo góc nhị diện thuộc $[0^\\circ;180^\\circ]$."] },
   { t: "Hai mặt phẳng vuông góc", y: ["$(\\alpha)\\perp(\\beta)$ khi góc nhị diện tạo bởi chúng bằng $90^\\circ$.", "Nếu $(\\alpha)$ chứa một đường thẳng vuông góc với $(\\beta)$ thì $(\\alpha)\\perp(\\beta)$.", "Lăng trụ đứng có cạnh bên vuông góc với đáy; hình chóp đều có đáy là đa giác đều và chân đường cao trùng tâm đáy."],
     vd: { d: "Cho hình chóp $S.ABCD$ có $SA\\perp(ABCD)$. Chứng minh $(SAB)\\perp(ABCD)$.", g: ["$SA\\perp(ABCD)$ và $SA\\subset(SAB)$.", "Mặt phẳng $(SAB)$ chứa đường thẳng vuông góc với $(ABCD)$.", "Vậy $(SAB)\\perp(ABCD)$."] } }],
  tt: { d: "Khi xây tường, người thợ dùng dây dọi để kiểm tra. Vì sao dây dọi áp sát mặt tường lại chứng tỏ tường vuông góc với mặt đất?",
      g: ["Dây dọi có phương vuông góc với mặt đất.", "Dây áp sát tường nghĩa là tường chứa một đường thẳng vuông góc với mặt đất.", "Theo điều kiện hai mặt phẳng vuông góc, mặt tường vuông góc với mặt đất."] },
  cs: "geogebra3d", ai: { p: "Chứng minh $(SAB)\\perp(ABCD)$ khi $SA\\perp(ABCD)$ và nêu dấu hiệu nhận biết đã dùng.", l: "AI hay lẫn giữa góc nhị diện và góc giữa hai đường thẳng khi tính số đo." },
  bt: "Bài 7.17 – 7.22 SGK trang 66 (Tập 2)." },

26: { t: 2, yc: ["Xác định khoảng cách từ điểm đến đường thẳng, đến mặt phẳng.", "Xác định khoảng cách giữa hai đường thẳng chéo nhau, giữa hai mặt phẳng song song."],
  md: [
   { t: "Khoảng cách từ điểm đến đường thẳng, mặt phẳng", y: ["$d(M,\\Delta)=MH$ với $H$ là hình chiếu vuông góc của $M$ trên $\\Delta$.", "$d(M,(\\alpha))=MH$ với $H$ là hình chiếu vuông góc của $M$ trên $(\\alpha)$.", "Nếu $d\\parallel(\\alpha)$ thì mọi điểm của $d$ cách $(\\alpha)$ một khoảng như nhau."],
     vd: { d: "Cho hình chóp $S.ABCD$, $SA\\perp(ABCD)$, $SA=a$, đáy hình vuông cạnh $a$. Tính $d(A,(SBC))$.", g: ["$BC\\perp(SAB)$ nên $(SBC)\\perp(SAB)$ theo giao tuyến $SB$.", "Kẻ $AH\\perp SB$ tại $H$ thì $AH\\perp(SBC)$.", "Tam giác $SAB$ vuông cân cạnh $a$: $AH=\\dfrac{SA\\cdot AB}{SB}=\\dfrac{a\\cdot a}{a\\sqrt2}=\\dfrac{a\\sqrt2}{2}$."] } },
   { t: "Khoảng cách giữa hai đường chéo nhau", y: ["Đường vuông góc chung của $a$, $b$ chéo nhau là đường thẳng cắt và vuông góc với cả hai.", "$d(a,b)$ bằng độ dài đoạn vuông góc chung.", "Cách tính thường dùng: $d(a,b)=d(a,(\\beta))$ với $(\\beta)$ chứa $b$ và song song với $a$."] }],
  tt: { d: "Hai đường dây điện chéo nhau trong không gian. Vì sao khi kiểm tra an toàn, người ta chỉ cần đo khoảng cách ngắn nhất giữa hai dây, và khoảng cách đó xác định thế nào?",
      g: ["Khoảng cách ngắn nhất là độ dài đoạn vuông góc chung của hai đường chéo nhau.", "Dựng mặt phẳng chứa dây này và song song với dây kia rồi đo khoảng cách từ dây kia đến mặt phẳng đó.", "Nếu khoảng cách này lớn hơn mức an toàn thì mọi vị trí khác càng xa hơn."] },
  cs: "geogebra3d", ai: { p: "Tính khoảng cách từ $A$ đến $(SBC)$ trong hình chóp có $SA\\perp$ đáy, đáy hình vuông cạnh $a$, $SA=a$.", l: "AI hay lấy luôn $d(A,(SBC))=SA$ hoặc nhầm sang khoảng cách từ $A$ đến $BC$." },
  bt: "Bài 7.23 – 7.28 SGK trang 73 (Tập 2)." },

27: { t: 2, yc: ["Tính thể tích khối chóp, khối lăng trụ, khối hộp.", "Vận dụng công thức thể tích vào bài toán thực tiễn."],
  md: [
   { t: "Công thức thể tích", y: ["Khối chóp: $V=\\dfrac13 S_{\\text{đáy}}\\cdot h$.", "Khối lăng trụ: $V=S_{\\text{đáy}}\\cdot h$.", "Khối hộp chữ nhật: $V=abc$."],
     vd: { d: "Cho hình chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, $SA\\perp(ABCD)$, $SA=2a$. Tính thể tích khối chóp.", g: ["$S_{ABCD}=a^2$, chiều cao $SA=2a$.", "$V=\\dfrac13\\cdot a^2\\cdot 2a=\\dfrac{2a^3}{3}$."] } },
   { t: "Tỉ số thể tích", y: ["Với hình chóp $S.ABC$ và các điểm $A'\\in SA$, $B'\\in SB$, $C'\\in SC$:", "$\\dfrac{V_{S.A'B'C'}}{V_{S.ABC}}=\\dfrac{SA'}{SA}\\cdot\\dfrac{SB'}{SB}\\cdot\\dfrac{SC'}{SC}$.", "Công thức chỉ dùng cho khối chóp tam giác."] }],
  tt: { d: "Một mái che hình chóp tứ giác đều có đáy là hình vuông cạnh $6$ m, chiều cao $4$ m. Tính thể tích phần không gian dưới mái và lượng tôn cần để lợp bốn mặt bên.",
      g: ["$V=\\dfrac13\\cdot6^2\\cdot4=48$ m³.", "Trung đoạn: $d=\\sqrt{4^2+3^2}=5$ m.", "Diện tích xung quanh $=\\dfrac12\\cdot(4\\cdot6)\\cdot5=60$ m² tôn."] },
  cs: "geogebra3d", ai: { p: "Tính thể tích khối chóp tứ giác đều đáy cạnh $6$ m, chiều cao $4$ m và diện tích xung quanh.", l: "AI hay dùng cạnh bên thay cho trung đoạn khi tính diện tích xung quanh." },
  bt: "Bài 7.29 – 7.34 SGK trang 79 (Tập 2)." },

28: { t: 2, yc: ["Nhận biết biến cố hợp, biến cố giao, biến cố xung khắc, biến cố độc lập.", "Mô tả các biến cố đó bằng ngôn ngữ tập hợp."],
  md: [
   { t: "Biến cố hợp, giao, xung khắc", y: ["Biến cố hợp $A\\cup B$: ít nhất một trong hai biến cố xảy ra.", "Biến cố giao $A\\cap B$ (hay $AB$): cả hai cùng xảy ra.", "$A$ và $B$ xung khắc nếu $A\\cap B=\\varnothing$."],
     vd: { d: "Gieo một con xúc xắc. Gọi $A$: “số chấm chẵn”, $B$: “số chấm chia hết cho $3$”. Mô tả $A\\cup B$ và $A\\cap B$.", g: ["$A=\\{2;4;6\\}$, $B=\\{3;6\\}$.", "$A\\cup B=\\{2;3;4;6\\}$.", "$A\\cap B=\\{6\\}$, nên $A$, $B$ không xung khắc."] } },
   { t: "Biến cố độc lập", y: ["$A$, $B$ độc lập nếu việc xảy ra của biến cố này không ảnh hưởng xác suất của biến cố kia.", "Hai biến cố xung khắc (khác rỗng) thì không độc lập."] }],
  tt: { d: "Một học sinh đăng kí hai nguyện vọng vào hai trường đại học độc lập nhau. Hãy phát biểu bằng ngôn ngữ biến cố: “trúng tuyển ít nhất một trường”, “trúng tuyển cả hai trường”.",
      g: ["Gọi $A$: trúng tuyển trường thứ nhất, $B$: trúng tuyển trường thứ hai.", "“Ít nhất một trường” là biến cố $A\\cup B$.", "“Cả hai trường” là biến cố $A\\cap B$; hai biến cố này độc lập vì hai trường xét tuyển riêng."] },
  cs: "excel", ai: { p: "Gieo một xúc xắc, mô tả biến cố hợp và giao của “số chấm chẵn” và “số chấm chia hết cho 3”.", l: "AI đôi khi coi hai biến cố này là xung khắc vì chúng khác nhau, dù chúng có phần tử chung là $6$." },
  bt: "Bài 8.1 – 8.5 SGK trang 87 (Tập 2)." },

29: { t: 2, yc: ["Vận dụng công thức cộng xác suất cho hai biến cố xung khắc và trường hợp tổng quát."],
  md: [
   { t: "Công thức cộng xác suất", y: ["Nếu $A$, $B$ xung khắc: $P(A\\cup B)=P(A)+P(B)$.", "Trường hợp tổng quát: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.", "Biến cố đối: $P(\\overline{A})=1-P(A)$."],
     vd: { d: "Một hộp có $10$ viên bi: $4$ đỏ, $6$ xanh. Lấy ngẫu nhiên $1$ viên. Tính xác suất lấy được bi đỏ hoặc bi xanh.", g: ["Hai biến cố “đỏ”, “xanh” xung khắc.", "$P=\\dfrac{4}{10}+\\dfrac{6}{10}=1$.", "Hợp lí vì chắc chắn lấy được một trong hai màu."] } },
   { t: "Vận dụng", y: ["Khi bài toán có cụm từ “ít nhất một”, thường dùng biến cố đối cho nhanh.", "Khi hai biến cố có phần chung, phải trừ $P(A\\cap B)$ để không đếm hai lần."],
     vd: { d: "Lớp có $30$ học sinh: $18$ em giỏi Toán, $15$ em giỏi Văn, $9$ em giỏi cả hai. Chọn ngẫu nhiên một em, tính xác suất em đó giỏi ít nhất một môn.", g: ["$P(T)=\\dfrac{18}{30}$, $P(V)=\\dfrac{15}{30}$, $P(T\\cap V)=\\dfrac{9}{30}$.", "$P(T\\cup V)=\\dfrac{18+15-9}{30}=\\dfrac{24}{30}=0{,}8$."] } }],
  tt: { d: "Một nhà máy có hai dây chuyền. Xác suất dây chuyền I gặp sự cố trong tháng là $0{,}1$, dây chuyền II là $0{,}08$, cả hai cùng gặp sự cố là $0{,}02$. Tính xác suất trong tháng có ít nhất một dây chuyền gặp sự cố.",
      g: ["$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.", "$=0{,}1+0{,}08-0{,}02=0{,}16$.", "Vậy khoảng $16\\%$ số tháng nhà máy phải xử lí sự cố."] },
  cs: "excel", ai: { p: "Lớp 30 em, 18 giỏi Toán, 15 giỏi Văn, 9 giỏi cả hai. Tính xác suất chọn được em giỏi ít nhất một môn.", l: "AI hay cộng thẳng $18+15$ rồi chia $30$, cho kết quả lớn hơn $1$ vì quên trừ phần chung." },
  bt: "Bài 8.6 – 8.10 SGK trang 92 (Tập 2)." },

30: { t: 2, yc: ["Vận dụng công thức nhân xác suất cho hai biến cố độc lập.", "Tính xác suất trong các bài toán thực tiễn nhiều giai đoạn."],
  md: [
   { t: "Công thức nhân xác suất", y: ["Nếu $A$, $B$ độc lập: $P(A\\cap B)=P(A)\\cdot P(B)$.", "Mở rộng cho nhiều biến cố độc lập: $P(A_1A_2\\dots A_n)=P(A_1)P(A_2)\\dots P(A_n)$.", "Nếu $A$, $B$ độc lập thì $\\overline{A}$, $B$ cũng độc lập."],
     vd: { d: "Hai xạ thủ bắn độc lập, xác suất trúng đích lần lượt là $0{,}8$ và $0{,}7$. Tính xác suất cả hai cùng trúng và xác suất có ít nhất một người trúng.", g: ["Cả hai trúng: $0{,}8\\cdot0{,}7=0{,}56$.", "Cả hai cùng trượt: $0{,}2\\cdot0{,}3=0{,}06$.", "Ít nhất một người trúng: $1-0{,}06=0{,}94$."] } }],
  tt: { d: "Một hệ thống báo cháy gồm hai cảm biến hoạt động độc lập, mỗi cảm biến phát hiện đám cháy với xác suất $0{,}9$. Hệ thống báo động nếu ít nhất một cảm biến hoạt động. Tính xác suất hệ thống báo động. Nếu muốn độ tin cậy trên $99{,}9\\%$ thì cần mấy cảm biến?",
      g: ["Cả hai cùng hỏng: $0{,}1^2=0{,}01$, nên hệ báo động với xác suất $0{,}99$.", "Với $n$ cảm biến: $1-0{,}1^n>0{,}999 \\Leftrightarrow 0{,}1^n<0{,}001$.", "$n>3$ nên cần ít nhất $4$ cảm biến (thực tế $n=4$ cho $0{,}9999$)."] },
  cs: "excel", ai: { p: "Hai xạ thủ bắn độc lập với xác suất trúng $0{,}8$ và $0{,}7$, tính xác suất có ít nhất một người trúng.", l: "AI hay cộng $0{,}8+0{,}7$ thành $1{,}5$, quên rằng phải dùng biến cố đối." },
  bt: "Bài 8.11 – 8.15 SGK trang 97 (Tập 2)." },

31: { t: 3, yc: ["Nhận biết định nghĩa đạo hàm tại một điểm và ý nghĩa hình học, vật lí.", "Viết phương trình tiếp tuyến của đồ thị tại một điểm."],
  md: [
   { t: "Định nghĩa đạo hàm", y: ["$f'(x_0)=\\lim\\limits_{x\\to x_0}\\dfrac{f(x)-f(x_0)}{x-x_0}=\\lim\\limits_{\\Delta x\\to0}\\dfrac{\\Delta y}{\\Delta x}$.", "Hàm số có đạo hàm tại $x_0$ thì liên tục tại $x_0$ (điều ngược lại không đúng).", "Ý nghĩa vật lí: vận tốc tức thời $v(t)=s'(t)$."],
     vd: { d: "Tính đạo hàm của $f(x)=x^2$ tại $x_0=3$ bằng định nghĩa.", g: ["$\\dfrac{f(x)-f(3)}{x-3}=\\dfrac{x^2-9}{x-3}=x+3$ với $x\\ne3$.", "$f'(3)=\\lim\\limits_{x\\to3}(x+3)=6$."] } },
   { t: "Ý nghĩa hình học và tiếp tuyến", y: ["$f'(x_0)$ là hệ số góc tiếp tuyến của đồ thị tại điểm $M_0(x_0;f(x_0))$.", "Phương trình tiếp tuyến: $y=f'(x_0)(x-x_0)+f(x_0)$."],
     vd: { d: "Viết phương trình tiếp tuyến của $y=x^2$ tại điểm có hoành độ $x_0=3$.", g: ["$f(3)=9$, $f'(3)=6$.", "$y=6(x-3)+9=6x-9$."] } }],
  tt: { d: "Một vật rơi tự do có quãng đường $s(t)=4{,}9t^2$ (m). Tính vận tốc tức thời của vật tại giây thứ $3$ và giải thích ý nghĩa.",
      g: ["$v(t)=s'(t)=9{,}8t$.", "$v(3)=29{,}4$ m/s.", "Nghĩa là tại đúng thời điểm $t=3$ s, vật đang rơi với tốc độ $29{,}4$ m/s."] },
  cs: "geogebra", ai: { p: "Tính đạo hàm của $f(x)=x^2$ tại $x_0=3$ bằng định nghĩa và viết phương trình tiếp tuyến.", l: "AI hay bỏ qua bước lập tỉ số $\\dfrac{\\Delta y}{\\Delta x}$, áp thẳng công thức nên không đúng yêu cầu “bằng định nghĩa”." },
  bt: "Bài 9.1 – 9.6 SGK trang 109 (Tập 2)." },

32: { t: 3, yc: ["Tính đạo hàm của hàm số sơ cấp cơ bản.", "Vận dụng quy tắc tính đạo hàm của tổng, hiệu, tích, thương và hàm hợp."],
  md: [
   { t: "Đạo hàm của hàm sơ cấp", y: ["$(x^n)'=nx^{n-1}$; $(\\sqrt x)'=\\dfrac{1}{2\\sqrt x}$; $(c)'=0$.", "$(\\sin x)'=\\cos x$; $(\\cos x)'=-\\sin x$; $(\\tan x)'=\\dfrac{1}{\\cos^2x}$.", "$(e^x)'=e^x$; $(a^x)'=a^x\\ln a$; $(\\ln x)'=\\dfrac1x$; $(\\log_ax)'=\\dfrac{1}{x\\ln a}$."] },
   { t: "Quy tắc tính đạo hàm", y: ["$(u\\pm v)'=u'\\pm v'$; $(uv)'=u'v+uv'$; $\\left(\\dfrac{u}{v}\\right)'=\\dfrac{u'v-uv'}{v^2}$.", "Hàm hợp: $y'_x=y'_u\\cdot u'_x$."],
     vd: { d: "Tính đạo hàm của $y=\\dfrac{2x+1}{x-3}$.", g: ["$u=2x+1$, $v=x-3$, $u'=2$, $v'=1$.", "$y'=\\dfrac{2(x-3)-(2x+1)}{(x-3)^2}$.", "$=\\dfrac{-7}{(x-3)^2}$ với $x\\ne3$."] } }],
  tt: { d: "Lợi nhuận (triệu đồng) khi bán $x$ sản phẩm là $P(x)=-0{,}5x^2+60x-500$. Tính $P'(x)$ và cho biết bán bao nhiêu sản phẩm thì lợi nhuận lớn nhất.",
      g: ["$P'(x)=-x+60$.", "$P'(x)=0 \\Leftrightarrow x=60$; $P'>0$ khi $x<60$ và $P'<0$ khi $x>60$.", "Lợi nhuận lớn nhất khi bán $60$ sản phẩm, đạt $P(60)=1300$ triệu đồng."] },
  cs: "casio", ai: { p: "Tính đạo hàm của $y=\\dfrac{2x+1}{x-3}$ và nêu tập xác định của đạo hàm.", l: "AI hay viết nhầm tử thành $u'v+uv'$ (công thức tích) khi tính đạo hàm thương." },
  bt: "Bài 9.7 – 9.13 SGK trang 118 (Tập 2)." },

33: { t: 2, yc: ["Tính đạo hàm cấp hai.", "Nhận biết ý nghĩa cơ học của đạo hàm cấp hai (gia tốc tức thời)."],
  md: [
   { t: "Đạo hàm cấp hai", y: ["$f''(x)=\\left[f'(x)\\right]'$.", "Ý nghĩa cơ học: gia tốc tức thời $a(t)=v'(t)=s''(t)$.", "Dấu của $f''$ cho biết đồ thị lồi hay lõm (học kĩ ở lớp 12)."],
     vd: { d: "Cho $f(x)=x^3-3x^2+2$. Tính $f''(x)$ và $f''(1)$.", g: ["$f'(x)=3x^2-6x$.", "$f''(x)=6x-6$.", "$f''(1)=0$."] } }],
  tt: { d: "Một ô tô chuyển động có quãng đường $s(t)=t^3-6t^2+9t$ (m, $t$ tính bằng giây). Tính vận tốc và gia tốc tại $t=2$ s, nhận xét về chuyển động.",
      g: ["$v(t)=s'(t)=3t^2-12t+9$, $v(2)=-3$ m/s.", "$a(t)=s''(t)=6t-12$, $a(2)=0$ m/s².", "Tại $t=2$ s xe đang chuyển động ngược chiều dương và gia tốc bằng $0$ (vừa chuyển từ giảm tốc sang tăng tốc)."] },
  cs: "casio", ai: { p: "Cho $s(t)=t^3-6t^2+9t$, tính vận tốc và gia tốc tại $t=2$, giải thích ý nghĩa dấu của kết quả.", l: "AI hay gọi $s''(t)$ là vận tốc, nhầm thứ tự giữa đạo hàm cấp một và cấp hai." },
  bt: "Bài 9.14 – 9.18 SGK trang 123 (Tập 2)." }
  };
})(window);
