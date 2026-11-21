/* Hình vẽ minh hoạ cho từng bài (dùng trong bản trình chiếu).
   khi: cụm từ (biểu thức chính quy, không phân biệt hoa thường) để tìm hoạt động phù hợp mà gắn hình;
   ten: chú thích dưới hình; h: mô tả hình (xem assets/hinhve.js). */
(function (G) {
  const tamGiac = (o) => ({ w: 5.4, el: [
    ["diem", "A", 1, 2.8, { vt: "above" }], ["diem", "B", 0, 0, { vt: "below left" }], ["diem", "C", 4.4, 0, { vt: "below right" }],
    ["dagiac", ["A", "B", "C"], { to: "ngoc", do: .12 }], ...(o || [])] });
  const chopDayHBH = (them) => ({ w: 5.2, kg: true, el: [
    ["diem", "A", 2, 0, 0, { vt: "below left" }], ["diem", "B", 2, 3.2, 0, { vt: "below right" }], ["diem", "C", 0, 3.8, 0, { vt: "right" }], ["diem", "D", 0, 0.6, 0, { vt: "left" }],
    ["diem", "S", 1, 1.9, 3.2, { vt: "above" }],
    ["doan", "A", "B"], ["doan", "B", "C"], ["doan", "A", "D", { net: "dut" }], ["doan", "D", "C", { net: "dut" }],
    ["doan", "S", "A"], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "D", { net: "dut" }], ...(them || [])] });
  const chopSAvuong = (them) => ({ w: 5, kg: true, el: [
    ["diem", "A", 0, 0, 0, { vt: "left" }], ["diem", "B", 2.6, 0, 0, { vt: "below left" }], ["diem", "C", 2.6, 2.6, 0, { vt: "below right" }], ["diem", "D", 0, 2.6, 0, { vt: "right" }],
    ["diem", "S", 0, 0, 3.2, { vt: "above" }],
    ["doan", "A", "B", { net: "dut" }], ["doan", "A", "D", { net: "dut" }], ["doan", "B", "C"], ["doan", "C", "D"],
    ["doan", "S", "A", { mau: "cam" }], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "D"], ["vuong", "S", "A", "D", { r: .5 }], ...(them || [])] });
  const hop = (them) => ({ w: 5, kg: true, el: [
    ["diem", "A", 2.4, 0, 0, { vt: "below left" }], ["diem", "B", 2.4, 3, 0, { vt: "below right" }], ["diem", "C", 0, 3, 0, { vt: "right" }], ["diem", "D", 0, 0, 0, { vt: "left" }],
    ["diem", "A'", 2.4, 0, 2.2, { vt: "left" }], ["diem", "B'", 2.4, 3, 2.2, { vt: "right" }], ["diem", "C'", 0, 3, 2.2, { vt: "above right" }], ["diem", "D'", 0, 0, 2.2, { vt: "above left" }],
    ["doan", "A", "B"], ["doan", "B", "C"], ["doan", "C", "D", { net: "dut" }], ["doan", "D", "A", { net: "dut" }],
    ["doan", "A'", "B'"], ["doan", "B'", "C'"], ["doan", "C'", "D'"], ["doan", "D'", "A'"],
    ["doan", "A", "A'"], ["doan", "B", "B'"], ["doan", "C", "C'"], ["doan", "D", "D'", { net: "dut" }], ...(them || [])] });
  const oxyz = (them) => ({ w: 5, kg: true, el: [
    ["diem", "O", 0, 0, 0, { vt: "above left", nhan: "O" }], ["diem", "X", 3.4, 0, 0, { cham: false, nhan: "x", vt: "below left" }], ["diem", "Y", 0, 4, 0, { cham: false, nhan: "y", vt: "below" }], ["diem", "Z", 0, 0, 3.4, { cham: false, nhan: "z", vt: "left" }],
    ["vec", "O", "X", { mau: "trang" }], ["vec", "O", "Y", { mau: "trang" }], ["vec", "O", "Z", { mau: "trang" }], ...(them || [])] });

  G.HINH = {
    "10": {
      3: [{ khi: "miền nghiệm|biểu diễn", ten: "Miền nghiệm của $x+y\\le 4$ (phần tô màu, kể cả bờ)", h: { w: 5, khung: [-1.2, 5.2, -1.2, 5.2], el: [
        ["mien", [[-1.2, -1.2], [5.2, -1.2], [5.2, -1.2], [-1.2, 5.2]], { to: "ngoc", do: .3 }], ["truc", { x: [-1.1, 5], y: [-1.1, 5], so: [4], soy: [4] }],
        ["diem", "M", 0, 4, { nhan: "", cham: false }], ["diem", "N", 4, 0, { nhan: "", cham: false }], ["thang", "M", "N", { keo: [-0.25, 1.25], mau: "vang", ten: "$x+y=4$", vt: "above" }], ["diem", "O1", 0, 0, { nhan: "", mau: "cam" }]] } }],
      4: [{ khi: "miền nghiệm|hệ", ten: "Miền nghiệm của hệ là tứ giác $OABC$", h: { w: 5.2, khung: [-1, 7, -1, 6], el: [
        ["mien", [[0, 0], [5, 0], [2, 3], [0, 4]], { to: "ngoc", do: .35 }], ["truc", { x: [-0.9, 6.8], y: [-0.9, 5.8] }],
        ["thang", [0, 5], [5, 0], { keo: [-0.15, 1.2], mau: "vang", ten: "$x+y=5$" }], ["thang", [0, 4], [8, 0], { keo: [-0.15, 0.85], mau: "cam", ten: "$x+2y=8$", vt: "above" }],
        ["diem", "A", 5, 0, { vt: "below" }], ["diem", "B", 2, 3, { vt: "above right" }], ["diem", "C", 0, 4, { vt: "left" }]] } }],
      5: [{ khi: "đường tròn đơn vị|định nghĩa", ten: "Nửa đường tròn đơn vị: $\\sin\\alpha=y_0$, $\\cos\\alpha=x_0$", h: { w: 5.4, khung: [-1.5, 1.5, -0.35, 1.35], el: [
        ["truc", { x: [-1.4, 1.42], y: [-0.3, 1.3] }], ["cung", [0, 0], 1, 0, 180, { mau: "ngoc" }],
        ["diem", "M", -0.5, 0.866, { vt: "above left", nhan: "M(x_0;y_0)" }], ["diem", "A", 1, 0, { vt: "below", nhan: "A(1;0)" }], ["diem", "O0", 0, 0, { nhan: "", cham: false }],
        ["doan", "O0", "M", { mau: "vang" }], ["doan", "M", [-0.5, 0], { net: "dut" }], ["doan", "M", [0, 0.866], { net: "dut" }],
        ["goc", "A", "O0", "M", { ten: "$\\alpha$", r: .3 }], ["chu", -0.5, -0.17, "$x_0$", { mau: "vang" }], ["chu", 0.17, 0.87, "$y_0$", { mau: "vang" }]] } }],
      6: [{ khi: "định lí côsin|định lý côsin|cosin|hệ thức|tam giác", ten: "Tam giác $ABC$: $a=BC$, $b=CA$, $c=AB$", h: tamGiac([
        ["chu", 2.2, -0.3, "$a$", { mau: "vang" }], ["chu", 2.95, 1.55, "$b$", { mau: "vang" }], ["chu", 0.3, 1.55, "$c$", { mau: "vang" }],
        ["goc", "B", "A", "C", { ten: "$A$", r: .4 }], ["diem", "H", 1, 0, { vt: "below", nhan: "H" }], ["doan", "A", "H", { net: "dut", mau: "ngoc" }], ["vuong", "A", "H", "C", { r: .4 }]]) },
        { khi: "thực tế|đo|khoảng cách|chiều cao", ten: "Đo chiều cao tháp từ hai vị trí quan sát", h: { w: 5.4, el: [
          ["diem", "A", 0, 0, { vt: "below" }], ["diem", "B", 2, 0, { vt: "below" }], ["diem", "H", 5, 0, { vt: "below" }], ["diem", "T", 5, 3, { vt: "above" }],
          ["doan", "A", "H"], ["doan", "H", "T", { mau: "vang", net: "day" }], ["doan", "A", "T", { net: "dut" }], ["doan", "B", "T", { net: "dut" }],
          ["goc", "H", "A", "T", { ten: "$\\alpha$", r: .7 }], ["goc", "H", "B", "T", { ten: "$\\beta$", r: .5, mau: "ngoc" }], ["vuong", "A", "H", "T", { r: .45 }]] } }],
      7: [{ khi: "vectơ|hướng|độ dài", ten: "Hai vectơ bằng nhau $\\overrightarrow{AB}=\\overrightarrow{DC}$ trong hình bình hành $ABCD$", h: { w: 5.2, el: [
        ["diem", "A", 0, 0, { vt: "below left" }], ["diem", "B", 3, 0, { vt: "below right" }], ["diem", "C", 4, 2, { vt: "above right" }], ["diem", "D", 1, 2, { vt: "above left" }],
        ["doan", "A", "D", { net: "dut" }], ["doan", "B", "C", { net: "dut" }], ["vec", "A", "B", { mau: "vang" }], ["vec", "D", "C", { mau: "vang" }]] } }],
      8: [{ khi: "quy tắc|tổng", ten: "Quy tắc hình bình hành: $\\overrightarrow{AB}+\\overrightarrow{AD}=\\overrightarrow{AC}$", h: { w: 5.2, el: [
        ["diem", "A", 0, 0, { vt: "below left" }], ["diem", "B", 3, 0, { vt: "below right" }], ["diem", "C", 4, 2, { vt: "above right" }], ["diem", "D", 1, 2, { vt: "above left" }],
        ["doan", "B", "C", { net: "dut" }], ["doan", "D", "C", { net: "dut" }], ["vec", "A", "B", { mau: "vang" }], ["vec", "A", "D", { mau: "ngoc" }], ["vec", "A", "C", { mau: "cam" }]] } }],
      9: [{ khi: "trung điểm|trọng tâm|cùng phương", ten: "$\\overrightarrow{GA}+\\overrightarrow{GB}+\\overrightarrow{GC}=\\vec 0$ với $G$ là trọng tâm", h: tamGiac([
        ["diem", "M", 2.2, 0, { vt: "below" }], ["doan", "A", "M", { net: "dut" }], ["diem", "G", 1.8, 0.933, { vt: "right", mau: "cam" }],
        ["vec", "G", "A", { mau: "vang" }], ["vec", "G", "B", { mau: "ngoc" }], ["vec", "G", "C", { mau: "cam" }]]) }],
      10: [{ khi: "tọa độ|toạ độ", ten: "$\\overrightarrow{OM}=x\\vec i+y\\vec j\\Leftrightarrow M(x;y)$", h: { w: 5, khung: [-1, 4.4, -1, 3.2], el: [
        ["truc", { x: [-0.9, 4.2], y: [-0.9, 3], so: [3], soy: [2] }], ["diem", "M", 3, 2, { vt: "above right", nhan: "M(3;2)" }], ["diem", "O0", 0, 0, { nhan: "", cham: false }],
        ["doan", "M", [3, 0], { net: "dut" }], ["doan", "M", [0, 2], { net: "dut" }], ["vec", "O0", "M", { mau: "vang" }],
        ["vec", "O0", [1, 0], { mau: "cam", ten: "$\\vec i$", vt: "below" }], ["vec", "O0", [0, 1], { mau: "ngoc", ten: "$\\vec j$", vt: "left" }]] } }],
      11: [{ khi: "góc giữa|tích vô hướng", ten: "Góc giữa hai vectơ: đưa về chung gốc $O$", h: { w: 5, el: [
        ["diem", "O", 0, 0, { vt: "below left" }], ["diem", "A", 3.6, 0.4, { vt: "right" }], ["diem", "B", 1.2, 2.6, { vt: "above" }],
        ["vec", "O", "A", { mau: "vang", ten: "$\\vec u$", vt: "below" }], ["vec", "O", "B", { mau: "ngoc", ten: "$\\vec v$", vt: "left" }], ["goc", "A", "O", "B", { ten: "$\\alpha$", r: .6 }]] } },
        { khi: "công|lực", ten: "Công của lực: $A=\\vec F\\cdot\\vec d=|\\vec F|\\,|\\vec d|\\cos\\alpha$", h: { w: 5, el: [
          ["dagiac", [[0, 0], [1.2, 0], [1.2, 0.8], [0, 0.8]], { to: "cam", do: .3 }], ["diem", "P", 0.6, 0.4, { nhan: "", cham: false }],
          ["vec", "P", [3, 2.1], { mau: "vang", ten: "$\\vec F$", vt: "above left" }], ["vec", [0, -0.4], [4, -0.4], { mau: "ngoc", ten: "$\\vec d$", vt: "below" }],
          ["doan", "P", [3.4, 0.4], { net: "dut" }], ["goc", [3.4, 0.4], "P", [3, 2.1], { ten: "$\\alpha$", r: .8 }]] } }],
      15: [{ khi: "đồ thị|đồng biến|nghịch biến", ten: "Đồ thị hàm số: đi lên là đồng biến, đi xuống là nghịch biến", h: { w: 5, khung: [-1.5, 4.5, -1.6, 3.6], el: [
        ["truc", { x: [-1.4, 4.3], y: [-1.5, 3.4] }], ["ham", "x*x-2*x", -0.9, 3.1, { mau: "vang", ten: "$y=x^2-2x$" }], ["diem", "I", 1, -1, { vt: "below" }]] } }],
      16: [{ khi: "đồ thị|parabol|đỉnh", ten: "Parabol $y=x^2-4x+3$: đỉnh $I(2;-1)$, trục đối xứng $x=2$", h: { w: 5, khung: [-1, 5, -1.6, 4], el: [
        ["truc", { x: [-0.9, 4.8], y: [-1.5, 3.8], so: [1, 3] }], ["ham", "x*x-4*x+3", -0.3, 4.3, { mau: "vang" }], ["diem", "I", 2, -1, { vt: "below right" }],
        ["doan", [2, -1.5], [2, 3.8], { net: "dut", mau: "ngoc" }], ["diem", "C3", 0, 3, { nhan: "3", vt: "left" }]] } }],
      17: [{ khi: "dấu|định lí|định lý", ten: "Dấu của $f(x)$ đọc từ vị trí parabol so với trục $Ox$", h: { w: 5.2, khung: [-1, 5, -1.6, 3.4], el: [
        ["truc", { x: [-0.9, 4.8], y: [-1.5, 3.2] }], ["ham", "x*x-4*x+3", -0.2, 4.2, { mau: "vang" }], ["diem", "X1", 1, 0, { nhan: "x_1", vt: "below left" }], ["diem", "X2", 3, 0, { nhan: "x_2", vt: "below right" }],
        ["chu", -0.2, 1.3, "$+$", { mau: "ngoc" }], ["chu", 2, -0.55, "$-$", { mau: "cam" }], ["chu", 4.2, 1.3, "$+$", { mau: "ngoc" }]] } }],
      20: [{ khi: "khoảng cách", ten: "Khoảng cách từ $M$ đến $\\Delta$ là $MH$", h: { w: 5, el: [
        ["diem", "P1", 0, 0.5, { nhan: "", cham: false }], ["diem", "P2", 4, 2.5, { nhan: "", cham: false }], ["thang", "P1", "P2", { keo: [-0.1, 1.15], mau: "ngoc", ten: "$\\Delta$" }],
        ["diem", "M", 1, 3, { vt: "above" }], ["diem", "H", 2, 1.5, { vt: "below right" }], ["doan", "M", "H", { mau: "vang", net: "dut" }], ["vuong", "M", "H", "P2", { r: .4 }]] } },
        { khi: "góc|vị trí", ten: "Hai đường thẳng cắt nhau tạo thành góc $\\varphi$", h: { w: 5, el: [
          ["diem", "I", 2, 1.5, { vt: "below" }], ["thang", [0, 0.5], [4, 2.5], { keo: [-0.05, 1.1], mau: "ngoc", ten: "$\\Delta_1$" }], ["thang", [0.5, 3.5], [3.5, -0.5], { keo: [-0.05, 1.1], mau: "vang", ten: "$\\Delta_2$" }],
          ["goc", [4, 2.5], "I", [0.5, 3.5], { ten: "$\\varphi$", r: .5 }]] } }],
      21: [{ khi: "tiếp tuyến", ten: "Tiếp tuyến tại $M$ vuông góc với bán kính $IM$", h: { w: 5, el: [
        ["diem", "I", 0, 0, { vt: "below left" }], ["tron", "I", 2, { mau: "ngoc" }], ["diem", "M", 1.2, 1.6, { vt: "above right" }], ["doan", "I", "M", { mau: "vang" }],
        ["thang", [1.2 - 1.6 * 1.3, 1.6 + 1.2 * 1.3], [1.2 + 1.6 * 1.3, 1.6 - 1.2 * 1.3], { keo: [0, 1], mau: "cam", ten: "$\\Delta$" }], ["vuong", "I", "M", [2.8, 0.4], { r: .4 }]] } },
        { khi: "phương trình đường tròn|đường tròn", ten: "Đường tròn tâm $I(a;b)$, bán kính $R$: $(x-a)^2+(y-b)^2=R^2$", h: { w: 5, khung: [-1, 5, -1, 4.6], el: [
          ["truc", { x: [-0.9, 4.8], y: [-0.9, 4.4] }], ["tron", [2, 2], 1.8, { mau: "ngoc", to: "ngoc" }], ["diem", "I", 2, 2, { vt: "below", nhan: "I(a;b)" }], ["diem", "M", 3.27, 3.27, { vt: "above right" }],
          ["doan", "I", "M", { mau: "vang" }], ["chu", 2.9, 2.35, "$R$", { mau: "vang" }]] } }],
      22: [{ khi: "elip", ten: "Elip: $MF_1+MF_2=2a$", h: { w: 5.4, khung: [-3.8, 3.8, -2.5, 2.6], el: [
        ["truc", { x: [-3.6, 3.7], y: [-2.4, 2.5] }], ["elip", [0, 0], 3, 2, { mau: "vang" }], ["diem", "F1", -2.24, 0, { nhan: "F_1", vt: "below" }], ["diem", "F2", 2.24, 0, { nhan: "F_2", vt: "below" }],
        ["diem", "M", 1.5, 1.73, { vt: "above right" }], ["doan", "F1", "M", { mau: "ngoc" }], ["doan", "F2", "M", { mau: "ngoc" }]] } },
        { khi: "hypebol", ten: "Hypebol: $|MF_1-MF_2|=2a$", h: { w: 5.4, khung: [-4.2, 4.2, -3, 3], el: [
          ["truc", { x: [-4, 4.1], y: [-2.9, 2.9] }], ["tham", "2/Math.cos(t)", "1.5*Math.tan(t)", -1.15, 1.15, { mau: "vang" }], ["tham", "-2/Math.cos(t)", "1.5*Math.tan(t)", -1.15, 1.15, { mau: "vang" }],
          ["diem", "F1", -2.5, 0, { nhan: "F_1", vt: "below left" }], ["diem", "F2", 2.5, 0, { nhan: "F_2", vt: "below right" }],
          ["thang", [-4, -3], [4, 3], { keo: [0, 1], mau: "trang", net: "dut" }], ["thang", [-4, 3], [4, -3], { keo: [0, 1], mau: "trang", net: "dut" }]] } },
        { khi: "parabol", ten: "Parabol: $MF=d(M,\\Delta)$", h: { w: 5.2, khung: [-2, 4.6, -3.2, 3.2], el: [
          ["truc", { x: [-1.9, 4.4], y: [-3.1, 3.1] }], ["tham", "t*t/4", "t", -3.4, 3.4, { mau: "vang" }], ["diem", "F", 1, 0, { vt: "below" }],
          ["thang", [-1, -3], [-1, 3], { keo: [0, 1], mau: "ngoc", ten: "$\\Delta$" }], ["diem", "M", 2.25, 3, { vt: "right" }], ["doan", "M", "F", { mau: "cam" }], ["doan", "M", [-1, 3], { mau: "cam", net: "dut" }]] } }]
    },
    "11": {
      1: [{ khi: "đường tròn lượng giác|góc lượng giác|số đo", ten: "Đường tròn lượng giác, điểm biểu diễn góc $\\alpha$", h: { w: 5, khung: [-1.5, 1.5, -1.4, 1.45], el: [
        ["truc", { x: [-1.4, 1.42], y: [-1.3, 1.38], O: false }], ["tron", [0, 0], 1, { mau: "ngoc" }], ["diem", "A", 1, 0, { vt: "below right" }], ["diem", "A'", -1, 0, { vt: "below left" }],
        ["diem", "B", 0, 1, { vt: "above right" }], ["diem", "B'", 0, -1, { vt: "below right" }], ["diem", "M", 0.5, 0.866, { vt: "above right" }], ["diem", "O", 0, 0, { vt: "below left" }],
        ["doan", "O", "M", { mau: "vang" }], ["goc", "A", "O", "M", { ten: "$\\alpha$", r: .3 }]] } }],
      2: [{ khi: "công thức cộng|cộng", ten: "Hai góc $a$, $b$ trên đường tròn lượng giác", h: { w: 4.6, khung: [-1.4, 1.5, -0.4, 1.4], el: [
        ["truc", { x: [-1.3, 1.42], y: [-0.3, 1.3], O: false }], ["cung", [0, 0], 1, -10, 190, { mau: "ngoc" }], ["diem", "O", 0, 0, { vt: "below left" }],
        ["diem", "M", 0.866, 0.5, { vt: "right" }], ["diem", "N", -0.342, 0.94, { vt: "above left" }], ["doan", "O", "M", { mau: "vang" }], ["doan", "O", "N", { mau: "cam" }],
        ["goc", [1, 0], "O", "M", { ten: "$a$", r: .3 }], ["goc", [1, 0], "O", "N", { ten: "$b$", r: .5, mau: "cam" }]] } }],
      3: [{ khi: "sin|côsin|cosin|đồ thị", ten: "Đồ thị $y=\\sin x$ (vàng) và $y=\\cos x$ (xanh), chu kì $2\\pi$", h: { w: 6, khung: [-7, 7, -1.7, 1.8], el: [
        ["truc", { x: [-6.9, 6.9], y: [-1.6, 1.7] }], ["ham", "Math.sin(x)", -6.6, 6.6, { mau: "vang" }], ["ham", "Math.cos(x)", -6.6, 6.6, { mau: "ngoc" }],
        ["chu", 3.14, -0.32, "$\\pi$", {}], ["chu", -3.14, -0.32, "$-\\pi$", {}], ["chu", 6.28, -0.32, "$2\\pi$", {}]] } }],
      4: [{ khi: "sin x|phương trình", ten: "$\\sin x=\\dfrac12$: hai điểm $M$, $N$ trên đường tròn lượng giác", h: { w: 5, khung: [-1.5, 1.5, -1.3, 1.4], el: [
        ["truc", { x: [-1.4, 1.42], y: [-1.25, 1.35] }], ["tron", [0, 0], 1, { mau: "ngoc" }], ["thang", [-1.3, 0.5], [1.3, 0.5], { keo: [0, 1], mau: "cam", ten: "$y=\\frac12$", vt: "above" }],
        ["diem", "M", 0.866, 0.5, { vt: "above right" }], ["diem", "N", -0.866, 0.5, { vt: "above left" }], ["doan", [0, 0], "M", { mau: "vang" }], ["doan", [0, 0], "N", { mau: "vang" }]] } }],
      10: [{ khi: "giao tuyến|giao điểm|mặt phẳng", ten: "Hình chóp $S.ABCD$: giao tuyến của $(SAC)$ và $(SBD)$ là $SO$", h: chopDayHBH([
        ["diem", "O", 1, 1.9, 0, { vt: "below", mau: "cam" }], ["doan", "A", "C", { net: "dut", mau: "ngoc" }], ["doan", "B", "D", { net: "dut", mau: "ngoc" }], ["doan", "S", "O", { mau: "cam", net: "dut" }]]) }],
      11: [{ khi: "song song|giao tuyến", ten: "$(SAB)\\cap(SCD)=d$ đi qua $S$ và song song với $AB$, $CD$", h: chopDayHBH([
        ["thang", [1, 0.3, 3.2], [1, 3.5, 3.2], { keo: [0, 1], mau: "cam", ten: "$d$" }]]) }],
      12: [{ khi: "song song", ten: "$MN\\parallel AB$ nên $MN\\parallel(ABCD)$", h: chopDayHBH([
        ["diem", "M", 1.5, 0.95, 1.6, { vt: "left", mau: "cam" }], ["diem", "N", 1.5, 2.55, 1.6, { vt: "right", mau: "cam" }], ["doan", "M", "N", { mau: "cam", net: "day" }]]) }],
      13: [{ khi: "hình hộp|lăng trụ|song song", ten: "Hình hộp $ABCD.A'B'C'D'$: $(ABCD)\\parallel(A'B'C'D')$", h: hop() }],
      14: [{ khi: "hình biểu diễn|phép chiếu", ten: "Hình biểu diễn của hình lăng trụ tam giác", h: { w: 4.6, kg: true, el: [
        ["diem", "A", 2, 0, 0, { vt: "below left" }], ["diem", "B", 2, 3, 0, { vt: "below right" }], ["diem", "C", 0, 1.5, 0, { vt: "left" }],
        ["diem", "A'", 2, 0, 2.4, { vt: "left" }], ["diem", "B'", 2, 3, 2.4, { vt: "right" }], ["diem", "C'", 0, 1.5, 2.4, { vt: "above" }],
        ["doan", "A", "B"], ["doan", "A", "C", { net: "dut" }], ["doan", "B", "C", { net: "dut" }], ["doan", "A'", "B'"], ["doan", "B'", "C'"], ["doan", "C'", "A'"],
        ["doan", "A", "A'"], ["doan", "B", "B'"], ["doan", "C", "C'", { net: "dut" }]] } }],
      20: [{ khi: "hàm số mũ|lôgarit|đồ thị", ten: "Đồ thị $y=2^x$ và $y=\\log_2x$ đối xứng nhau qua đường thẳng $y=x$", h: { w: 5, khung: [-3, 4.6, -3, 4.6], el: [
        ["truc", { x: [-2.9, 4.4], y: [-2.9, 4.4] }], ["ham", "Math.pow(2,x)", -2.9, 2.15, { mau: "vang", ten: "$y=2^x$", vt: "left" }], ["ham", "Math.log2(x)", 0.12, 4.4, { mau: "ngoc", ten: "$y=\\log_2x$", vt: "below" }],
        ["ham", "x", -2.8, 4.3, { mau: "trang", net: "dut" }], ["diem", "P1", 0, 1, { nhan: "1", vt: "left" }], ["diem", "P2", 1, 0, { nhan: "1", vt: "below" }]] } }],
      22: [{ khi: "góc giữa|vuông góc", ten: "Hình lập phương: góc giữa $AB$ và $B'C'$ bằng $90^\\circ$", h: hop() }],
      23: [{ khi: "vuông góc với mặt phẳng|vuông góc", ten: "$SA\\perp(ABCD)$", h: chopSAvuong() }],
      24: [{ khi: "góc giữa đường thẳng|hình chiếu", ten: "Góc giữa $SC$ và $(ABCD)$ là $\\widehat{SCA}$", h: chopSAvuong([["doan", "A", "C", { net: "dut", mau: "ngoc" }], ["goc", "A", "C", "S", { ten: "$\\varphi$", r: .55 }]]) }],
      25: [{ khi: "nhị diện|góc", ten: "Góc nhị diện $[S,BC,A]$ có số đo $\\widehat{SBA}$", h: chopSAvuong([["goc", "A", "B", "S", { ten: "$\\varphi$", r: .5 }], ["vuong", "A", "B", "C", { r: .4 }]]) }],
      26: [{ khi: "khoảng cách", ten: "$d(A,(SBC))=AH$ với $AH\\perp SB$", h: chopSAvuong([["diem", "H", 1.25, 0, 1.66, { vt: "left", mau: "cam" }], ["doan", "A", "H", { mau: "cam", net: "dut" }], ["vuong", "A", "H", "B", { r: .3 }]]) }],
      27: [{ khi: "thể tích|khối chóp", ten: "Khối chóp: $V=\\dfrac13 S_{\\text{đáy}}\\cdot h$", h: { w: 4.8, kg: true, el: [
        ["diem", "A", 2.4, 0, 0, { vt: "below left" }], ["diem", "B", 1.4, 3.4, 0, { vt: "below right" }], ["diem", "C", -0.6, 1.2, 0, { vt: "left" }],
        ["diem", "H", 1.07, 1.53, 0, { vt: "below", mau: "cam" }], ["diem", "S", 1.07, 1.53, 3.2, { vt: "above" }],
        ["dagiac", ["A", "B", "C"], { to: "ngoc", do: .15, vien: false }], ["doan", "A", "B"], ["doan", "A", "C", { net: "dut" }], ["doan", "B", "C", { net: "dut" }],
        ["doan", "S", "A"], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "H", { mau: "cam", net: "dut" }], ["chu", 1.6, 1.1, "$h$", { mau: "cam" }]] } }],
      31: [{ khi: "tiếp tuyến|hình học", ten: "Tiếp tuyến của $y=x^2$ tại $M(1;1)$ có hệ số góc $f'(1)=2$", h: { w: 5, khung: [-1.8, 3.2, -1.4, 4.2], el: [
        ["truc", { x: [-1.7, 3], y: [-1.3, 4] }], ["ham", "x*x", -1.7, 2, { mau: "vang", ten: "$y=x^2$", vt: "left" }], ["ham", "2*x-1", -0.2, 2.5, { mau: "cam", ten: "$y=2x-1$" }], ["diem", "M", 1, 1, { vt: "right" }]] } }]
    },
    "12": {
      1: [{ khi: "cực trị|đồng biến|đơn điệu|bảng biến thiên", ten: "Đồ thị $y=x^3-3x$: cực đại $(-1;2)$, cực tiểu $(1;-2)$", h: { w: 5, khung: [-2.6, 2.8, -2.8, 2.8], el: [
        ["truc", { x: [-2.5, 2.7], y: [-2.7, 2.7], so: [-1, 1] }], ["ham", "x*x*x-3*x", -2.15, 2.15, { mau: "vang" }], ["diem", "CD", -1, 2, { nhan: "CĐ", vt: "above" }], ["diem", "CT", 1, -2, { nhan: "CT", vt: "below" }],
        ["doan", "CD", [-1, 0], { net: "dut" }], ["doan", "CT", [1, 0], { net: "dut" }]] } }],
      2: [{ khi: "giá trị lớn nhất|giá trị nhỏ nhất|đoạn", ten: "Trên đoạn $[-2;2]$: $\\max y=3$, $\\min y=-1$", h: { w: 5, khung: [-2.6, 2.8, -1.8, 3.6], el: [
        ["truc", { x: [-2.5, 2.7], y: [-1.7, 3.5], so: [-2, 2] }], ["ham", "x*x*x-3*x+1", -2, 2, { mau: "vang" }], ["diem", "M1", -1, 3, { nhan: "", mau: "luc" }], ["diem", "M2", 2, 3, { nhan: "", mau: "luc" }],
        ["diem", "N1", 1, -1, { nhan: "", mau: "cam" }], ["diem", "N2", -2, -1, { nhan: "", mau: "cam" }]] } }],
      3: [{ khi: "tiệm cận", ten: "Đồ thị $y=\\dfrac{2x+1}{x-1}$: tiệm cận đứng $x=1$, tiệm cận ngang $y=2$", h: { w: 5, khung: [-3, 5, -3, 6.5], el: [
        ["truc", { x: [-2.9, 4.8], y: [-2.9, 6.3] }], ["ham", "(2*x+1)/(x-1)", -2.9, 0.62, { mau: "vang" }], ["ham", "(2*x+1)/(x-1)", 1.45, 4.8, { mau: "vang" }],
        ["doan", [1, -2.9], [1, 6.3], { net: "dut", mau: "ngoc" }], ["doan", [-2.9, 2], [4.8, 2], { net: "dut", mau: "ngoc" }], ["chu", 4.3, 2.35, "$y=2$", { mau: "ngoc" }], ["chu", 1.45, 5.9, "$x=1$", { mau: "ngoc" }]] } }],
      4: [{ khi: "bậc ba|khảo sát|đồ thị", ten: "Đồ thị hàm bậc ba $y=-x^3+3x^2-1$, tâm đối xứng $I(1;1)$", h: { w: 5, khung: [-1.6, 3.6, -2, 4], el: [
        ["truc", { x: [-1.5, 3.4], y: [-1.9, 3.8] }], ["ham", "-x*x*x+3*x*x-1", -1.05, 3.05, { mau: "vang" }], ["diem", "I", 1, 1, { vt: "right", mau: "cam" }], ["diem", "A", 2, 3, { vt: "above", nhan: "" }], ["diem", "B", 0, -1, { vt: "below", nhan: "" }]] } },
        { khi: "phân thức|bậc nhất trên bậc nhất|hữu tỉ", ten: "Đồ thị $y=\\dfrac{x+1}{x-1}$ nhận giao điểm hai tiệm cận làm tâm đối xứng", h: { w: 5, khung: [-3, 5, -3, 5], el: [
          ["truc", { x: [-2.9, 4.8], y: [-2.9, 4.8] }], ["ham", "(x+1)/(x-1)", -2.9, 0.5, { mau: "vang" }], ["ham", "(x+1)/(x-1)", 1.5, 4.8, { mau: "vang" }],
          ["doan", [1, -2.9], [1, 4.8], { net: "dut", mau: "ngoc" }], ["doan", [-2.9, 1], [4.8, 1], { net: "dut", mau: "ngoc" }], ["diem", "I", 1, 1, { vt: "below right", mau: "cam" }]] } }],
      6: [{ khi: "vectơ|hình hộp|quy tắc", ten: "Quy tắc hình hộp: $\\overrightarrow{AB}+\\overrightarrow{AD}+\\overrightarrow{AA'}=\\overrightarrow{AC'}$", h: hop([
        ["vec", "A", "B", { mau: "vang" }], ["vec", "A", "D", { mau: "vang" }], ["vec", "A", "A'", { mau: "vang" }], ["vec", "A", "C'", { mau: "cam" }]]) }],
      7: [{ khi: "tọa độ|toạ độ|hệ trục", ten: "Điểm $M(x;y;z)$ trong hệ trục $Oxyz$", h: oxyz([
        ["diem", "M", 2, 3, 2.2, { vt: "above right", nhan: "M(x;y;z)" }], ["diem", "M1", 2, 3, 0, { nhan: "", mau: "ngoc" }],
        ["doan", "M", "M1", { net: "dut" }], ["doan", "M1", [2, 0, 0], { net: "dut" }], ["doan", "M1", [0, 3, 0], { net: "dut" }], ["vec", "O", "M", { mau: "cam" }]]) }],
      8: [{ khi: "tọa độ|vectơ|biểu thức", ten: "Vectơ trong hệ trục $Oxyz$: $\\vec a=(a_1;a_2;a_3)$", h: oxyz([
        ["vec", "O", [1, 0, 0], { mau: "cam", ten: "$\\vec i$", vt: "below" }], ["vec", "O", [0, 1, 0], { mau: "cam", ten: "$\\vec j$", vt: "below" }], ["vec", "O", [0, 0, 1], { mau: "cam", ten: "$\\vec k$", vt: "left" }],
        ["vec", "O", [2, 3, 2], { mau: "vang", ten: "$\\vec a$", vt: "above left" }]]) }],
      12: [{ khi: "tích phân|hình thang cong|diện tích", ten: "Hình thang cong: $S=\\displaystyle\\int_a^b f(x)\\,dx$", h: { w: 5, khung: [-0.8, 4.4, -0.8, 4], el: [
        ["vung", "0.4*x*x-x+2", "0", 1, 3.4, { to: "ngoc", do: .35 }], ["truc", { x: [-0.7, 4.2], y: [-0.7, 3.8] }], ["ham", "0.4*x*x-x+2", -0.3, 4, { mau: "vang", ten: "$y=f(x)$", vt: "above" }],
        ["doan", [1, 0], [1, 1.4], { net: "dut" }], ["doan", [3.4, 0], [3.4, 3.22], { net: "dut" }], ["chu", 1, -0.3, "$a$", {}], ["chu", 3.4, -0.3, "$b$", {}]] } }],
      13: [{ khi: "diện tích|hai đồ thị|hình phẳng", ten: "Diện tích hình phẳng giới hạn bởi $y=2x$ và $y=x^2$: $S=\\displaystyle\\int_0^2(2x-x^2)\\,dx=\\dfrac43$", h: { w: 5, khung: [-0.8, 3, -0.8, 4.6], el: [
        ["vung", "2*x", "x*x", 0, 2, { to: "ngoc", do: .4 }], ["truc", { x: [-0.7, 2.8], y: [-0.7, 4.4], so: [2] }], ["ham", "x*x", -0.6, 2.1, { mau: "vang", ten: "$y=x^2$", vt: "right" }], ["ham", "2*x", -0.3, 2.2, { mau: "cam", ten: "$y=2x$", vt: "left" }]] } },
        { khi: "thể tích|tròn xoay", ten: "Khối tròn xoay sinh bởi hình phẳng quay quanh $Ox$", h: { w: 5, khung: [-0.6, 4.4, -2.4, 2.6], el: [
          ["vung", "Math.sqrt(x)", "-Math.sqrt(x)", 0, 4, { to: "ngoc", do: .2 }], ["truc", { x: [-0.5, 4.3], y: [-2.3, 2.5] }], ["ham", "Math.sqrt(x)", 0, 4, { mau: "vang", ten: "$y=\\sqrt x$", vt: "above" }], ["ham", "-Math.sqrt(x)", 0, 4, { mau: "vang", net: "dut" }],
          ["elip", [4, 0], 0.35, 2, { mau: "vang" }]] } }],
      14: [{ khi: "mặt phẳng|pháp tuyến", ten: "Mặt phẳng $(P)$ qua $M_0$ nhận $\\vec n$ làm vectơ pháp tuyến", h: { w: 5, kg: true, el: [
        ["dagiac", [[2.5, 0, 0], [2.5, 4, 0], [-1.5, 4, 0], [-1.5, 0, 0]], { to: "ngoc", do: .25, mau: "ngoc" }], ["diem", "M0", 0.5, 2, 0, { nhan: "M_0", vt: "below right" }], ["diem", "M", 1.5, 3, 0, { vt: "below" }],
        ["vec", "M0", [0.5, 2, 2.4], { mau: "cam", ten: "$\\vec n$", vt: "left" }], ["doan", "M0", "M", { mau: "vang" }], ["vuong", [0.5, 2, 2.4], "M0", "M", { r: .5 }], ["chu", 3.4, -0.6, "$(P)$", { mau: "ngoc" }]] } }],
      15: [{ khi: "đường thẳng|chỉ phương", ten: "Đường thẳng $\\Delta$ qua $M_0$ có vectơ chỉ phương $\\vec u$", h: oxyz([
        ["diem", "M0", 1.5, 1, 1, { nhan: "M_0", vt: "below right" }], ["thang", [2.5, -0.5, 0.2], [0.5, 2.5, 1.8], { keo: [-0.3, 1.3], mau: "ngoc", ten: "$\\Delta$" }], ["vec", "M0", [1, 1.75, 1.4], { mau: "vang", ten: "$\\vec u$", vt: "above" }]]) }],
      16: [{ khi: "góc giữa đường thẳng và mặt phẳng|góc", ten: "Góc giữa $\\Delta$ và $(P)$: $\\sin\\varphi=|\\cos(\\vec u,\\vec n)|$", h: { w: 5, kg: true, el: [
        ["dagiac", [[2.5, -0.5, 0], [2.5, 4, 0], [-1.5, 4, 0], [-1.5, -0.5, 0]], { to: "ngoc", do: .22, mau: "ngoc" }], ["diem", "I", 0.5, 1.5, 0, { vt: "below" }], ["diem", "A", 0.5, 3.6, 2.2, { vt: "above" }], ["diem", "H", 0.5, 3.6, 0, { vt: "below right" }],
        ["doan", "I", "A", { mau: "vang", net: "day" }], ["doan", "A", "H", { net: "dut" }], ["doan", "I", "H", { mau: "cam" }], ["goc", "H", "I", "A", { ten: "$\\varphi$", r: .7 }]] } }],
      17: [{ khi: "mặt cầu", ten: "Mặt cầu tâm $I(a;b;c)$, bán kính $R$", h: { w: 4.6, khung: [-2.6, 2.6, -2.4, 2.5], el: [
        ["tron", [0, 0], 2, { mau: "ngoc", to: "ngoc", do: .12 }], ["elip", [0, 0], 2, 0.55, { mau: "ngoc", net: "dut" }], ["diem", "I", 0, 0, { vt: "below left" }], ["diem", "M", 1.41, 1.41, { vt: "above right" }],
        ["doan", "I", "M", { mau: "vang" }], ["chu", 0.95, 0.5, "$R$", { mau: "vang" }]] } }]
    }
  };
  /* hình chuyên đề — Beamer tra G.HINH.CD10 / CD11 theo số bài */
  G.HINH.CD10 = {"2":[{"khi":"parabol|ba điểm","ten":"Parabol $y=x^2-2x+3$ đi qua $A$, $B$, $C$","h":{"w":5,"khung":[-2,3.2,-0.8,7],"el":[["truc",{"x":[-2,3.1],"y":[-0.6,6.9]}],["ham","x*x-2*x+3",-1.6,3,{"mau":"vang"}],["diem","A",1,2,{"vt":"below"}],["diem","B",-1,6,{"vt":"left"}],["diem","C",2,3,{"vt":"right"}]]}}],"5":[{"khi":"elip|bán kính qua tiêu","ten":"Elip $\\frac{x^2}{25}+\\frac{y^2}{16}=1$, tiêu điểm $F_1(-3;0)$, $F_2(3;0)$","h":{"w":6,"khung":[-6,6,-4.8,4.8],"el":[["truc",{"x":[-6,6],"y":[-4.6,4.6]}],["elip",[0,0],5,4,{"mau":"vang"}],["diem","F1",-3,0,{"nhan":"F_1","vt":"below"}],["diem","F2",3,0,{"nhan":"F_2","vt":"below"}],["diem","M",3,3.2,{"vt":"above right"}],["doan","M","F1",{"mau":"cam"}],["doan","M","F2",{"mau":"cam"}]]}}],"6":[{"khi":"hypebol|tiệm cận","ten":"Hypebol $\\frac{x^2}{16}-\\frac{y^2}{9}=1$ và hai tiệm cận $y=\\pm\\frac34x$","h":{"w":6,"khung":[-8,8,-5.5,5.5],"el":[["truc",{"x":[-8,8],"y":[-5.4,5.4]}],["tham","4/Math.cos(t)","3*Math.tan(t)",-1.08,1.08,{"mau":"vang"}],["tham","-4/Math.cos(t)","3*Math.tan(t)",-1.08,1.08,{"mau":"vang"}],["thang",[0,0],[8,6],{"keo":[-1,1],"mau":"ngoc","net":"dut"}],["thang",[0,0],[8,-6],{"keo":[-1,1],"mau":"ngoc","net":"dut"}],["diem","F1",-5,0,{"nhan":"F_1","vt":"below"}],["diem","F2",5,0,{"nhan":"F_2","vt":"below"}]]}}],"7":[{"khi":"parabol|tiêu điểm","ten":"Parabol $y^2=4x$, tiêu điểm $F(1;0)$, đường chuẩn $x=-1$","h":{"w":5,"khung":[-2,6,-5,5],"el":[["truc",{"x":[-2,6],"y":[-4.9,4.9]}],["tham","t*t/4","t",-4.5,4.5,{"mau":"vang"}],["thang",[-1,-4],[-1,4],{"keo":[0,1],"mau":"cam"}],["chu",-1,4.4,"$x=-1$",{"mau":"cam","vt":"left"}],["diem","F",1,0,{"vt":"below"}],["diem","M",4,4,{"vt":"right"}],["doan","M","F",{"mau":"ngoc"}],["doan","M",[-1,4],{"mau":"ngoc","net":"dut"}]]}}],"8":[{"khi":"đường chuẩn|tâm sai","ten":"Elip $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ và hai đường chuẩn $x=\\pm\\frac{25}{4}$","h":{"w":6,"khung":[-7.5,7.5,-3.8,3.8],"el":[["truc",{"x":[-7.5,7.5],"y":[-3.6,3.6]}],["elip",[0,0],5,3,{"mau":"vang"}],["thang",[-6.25,-3.4],[-6.25,3.4],{"keo":[0,1],"mau":"cam"}],["thang",[6.25,-3.4],[6.25,3.4],{"keo":[0,1],"mau":"cam"}],["diem","F1",-4,0,{"nhan":"F_1","vt":"below"}],["diem","F2",4,0,{"nhan":"F_2","vt":"below"}]]}}]};
  G.HINH.CD11 = {"1":[{"khi":"co|giãn|đường tròn","ten":"Phép co về trục $Ox$ hệ số $\\frac12$ biến đường tròn thành elip","h":{"w":5,"khung":[-3,3,-2.6,2.6],"el":[["truc",{"x":[-3,3],"y":[-2.5,2.5]}],["tron",[0,0],2,{"mau":"ngoc"}],["elip",[0,0],2,1,{"mau":"vang"}],["diem","M",1.2,1.6,{"vt":"above right"}],["diem","M'",1.2,0.8,{"nhan":"M'","vt":"right"}],["vec","M","M'",{"mau":"cam"}]]}}],"2":[{"khi":"tịnh tiến|ảnh","ten":"$T_{\\vec u}$ với $\\vec u=(2;-1)$: $A\\mapsto A'$, $d\\mapsto d'$","h":{"w":5,"khung":[-1.5,5,-1.5,4.5],"el":[["truc",{"x":[-1.5,5],"y":[-1.4,4.4]}],["thang",[-1,-1],[1.5,4],{"keo":[0,1],"mau":"ngoc","ten":"$d$","vt":"left"}],["thang",[1.5,-1],[4.25,4.5],{"keo":[0,0.9],"mau":"vang","ten":"$d'$","vt":"right"}],["diem","A",1,3,{"vt":"left"}],["diem","A'",3,2,{"nhan":"A'","vt":"right"}],["vec","A","A'",{"mau":"cam","ten":"$\\vec u$","vt":"above"}]]}}],"3":[{"khi":"ngắn nhất|đối xứng","ten":"$MA+MB=MA'+MB\\ge A'B$; $M(3;0)$","h":{"w":5,"khung":[-0.5,5,-2.6,2.8],"el":[["truc",{"x":[-0.5,5],"y":[-2.5,2.7]}],["diem","A",1,2,{"vt":"above"}],["diem","B",4,1,{"vt":"above right"}],["diem","A'",1,-2,{"nhan":"A'","vt":"below"}],["diem","M",3,0,{"vt":"below right"}],["doan","A","M",{"mau":"vang"}],["doan","M","B",{"mau":"vang"}],["doan","A'","M",{"mau":"ngoc","net":"dut"}],["doan","A","A'",{"mau":"trang","net":"dut"}]]}}],"4":[{"khi":"quay","ten":"$Q_{(O,90^\\circ)}$: $M(3;1)\\mapsto M'(-1;3)$","h":{"w":4.5,"khung":[-2,3.8,-0.8,3.8],"el":[["truc",{"x":[-2,3.7],"y":[-0.7,3.7]}],["diem","O",0,0,{"vt":"below left"}],["diem","M",3,1,{"vt":"right"}],["diem","M'",-1,3,{"nhan":"M'","vt":"left"}],["doan","O","M",{"mau":"vang"}],["doan","O","M'",{"mau":"vang"}],["goc","M","O","M'",{"ten":"$90^\\circ$","r":0.6,"mau":"cam"}]]}},{"khi":"đối xứng tâm","ten":"$\\text{Đ}_I$ với $I(1;2)$: $M(3;-1)\\mapsto M'(-1;5)$","h":{"w":4.5,"khung":[-2,4,-1.8,5.6],"el":[["truc",{"x":[-2,4],"y":[-1.7,5.5]}],["diem","I",1,2,{"vt":"right"}],["diem","M",3,-1,{"vt":"right"}],["diem","M'",-1,5,{"nhan":"M'","vt":"left"}],["doan","M","M'",{"mau":"vang"}]]}}],"5":[{"khi":"dời hình|bằng nhau","ten":"Phép dời hình biến tam giác $ABC$ thành tam giác $A'B'C'$ bằng nó","h":{"w":5,"khung":[-4,4,-1,3.5],"el":[["truc",{"x":[-4,4],"y":[-0.8,3.4]}],["diem","A",1,0.5,{"vt":"below"}],["diem","B",3.2,0.8,{"vt":"below"}],["diem","C",2,3,{"vt":"above"}],["dagiac",["A","B","C"],{"to":"vang","mau":"vang"}],["diem","A'",-1,0.5,{"nhan":"A'","vt":"below"}],["diem","B'",-3.2,0.8,{"nhan":"B'","vt":"below"}],["diem","C'",-2,3,{"nhan":"C'","vt":"above"}],["dagiac",["A'","B'","C'"],{"to":"ngoc","mau":"ngoc"}]]}}],"6":[{"khi":"vị tự","ten":"$V_{(I,-2)}$: $M\\mapsto M'$, $I$ nằm giữa $M$ và $M'$, $IM'=2IM$","h":{"w":4.5,"khung":[-2.2,3,-3.8,4],"el":[["truc",{"x":[-2.2,3],"y":[-3.7,3.9]}],["diem","I",1,1,{"vt":"right"}],["diem","M",2,3,{"vt":"right"}],["diem","M'",-1,-3,{"nhan":"M'","vt":"left"}],["doan","M","M'",{"mau":"vang"}],["tron","M",0.75,{"mau":"ngoc"}],["tron","M'",1.5,{"mau":"cam"}]]}}],"7":[{"khi":"đồng dạng","ten":"$V_{(O,2)}$ rồi $\\text{Đ}_{Ox}$: $M(1;2)\\mapsto M_1(2;4)\\mapsto M'(2;-4)$","h":{"w":4,"khung":[-1,3.5,-4.6,4.6],"el":[["truc",{"x":[-1,3.4],"y":[-4.5,4.5]}],["diem","O",0,0,{"vt":"below left"}],["diem","M",1,2,{"vt":"left"}],["diem","M1",2,4,{"nhan":"M_1","vt":"right"}],["diem","M'",2,-4,{"nhan":"M'","vt":"right"}],["doan","O","M1",{"mau":"vang"}],["doan","M1","M'",{"mau":"ngoc","net":"dut"}]]}}],"8":[{"khi":"bậc|đồ thị|bắt tay","ten":"Đồ thị $G$: $\\deg A=2$, $\\deg B=2$, $\\deg C=3$, $\\deg D=1$","h":{"w":4.5,"khung":[-0.6,4.6,-0.6,3.2],"el":[["diem","A",0,0,{"vt":"below left"}],["diem","B",0,2.6,{"vt":"above left"}],["diem","C",2,1.3,{"vt":"above"}],["diem","D",4,1.3,{"vt":"right"}],["doan","A","B",{"mau":"vang"}],["doan","A","C",{"mau":"vang"}],["doan","B","C",{"mau":"vang"}],["doan","C","D",{"mau":"vang"}]]}}],"9":[{"khi":"euler|ngôi nhà","ten":"Đồ thị “ngôi nhà”: đường đi Euler $A\\to E\\to B\\to A\\to D\\to C\\to B$","h":{"w":4,"khung":[-0.8,3.8,-0.6,4.2],"el":[["diem","D",0,0,{"vt":"below left"}],["diem","C",3,0,{"vt":"below right"}],["diem","B",3,2.4,{"vt":"right"}],["diem","A",0,2.4,{"vt":"left"}],["diem","E",1.5,3.8,{"vt":"above"}],["doan","A","B",{"mau":"vang"}],["doan","B","C",{"mau":"vang"}],["doan","C","D",{"mau":"vang"}],["doan","D","A",{"mau":"vang"}],["doan","A","E",{"mau":"ngoc"}],["doan","B","E",{"mau":"ngoc"}]]}}],"10":[{"khi":"dijkstra|ngắn nhất|tối ưu","ten":"Đồ thị có trọng số — đường ngắn nhất $A\\to C\\to B\\to D\\to E$ dài $10$","h":{"w":6,"khung":[-0.6,6.6,-0.8,3.4],"el":[["diem","A",0,1.3,{"vt":"left"}],["diem","B",2.2,2.8,{"vt":"above"}],["diem","C",2.2,-0.2,{"vt":"below"}],["diem","D",4.4,2.8,{"vt":"above"}],["diem","E",6.2,1.3,{"vt":"right"}],["doan","A","B",{"mau":"trang"}],["doan","A","C",{"mau":"vang"}],["doan","B","C",{"mau":"vang"}],["doan","B","D",{"mau":"vang"}],["doan","C","D",{"mau":"trang"}],["doan","C","E",{"mau":"trang"}],["doan","D","E",{"mau":"vang"}],["chu",0.9,2.3,"$4$",{"mau":"cam"}],["chu",0.9,0.3,"$2$",{"mau":"cam"}],["chu",2.45,1.3,"$1$",{"mau":"cam"}],["chu",3.3,3.1,"$5$",{"mau":"cam"}],["chu",3.55,1.5,"$8$",{"mau":"cam"}],["chu",4.3,0.25,"$10$",{"mau":"cam"}],["chu",5.55,2.35,"$2$",{"mau":"cam"}]]}}],"11":[{"khi":"trục đo|hộp","ten":"Hình chiếu trục đo của hộp chữ nhật $40\\times30\\times20$","h":{"w":4.5,"kg":true,"khung":[-2,4,-1.5,2.6],"el":[["diem","O",0,0,0,{"nhan":"","cham":false}],["diem","X",4,0,0,{"nhan":"","cham":false}],["diem","Y",0,3,0,{"nhan":"","cham":false}],["diem","Z",0,0,2,{"nhan":"","cham":false}],["diem","P",4,3,0,{"nhan":"","cham":false}],["diem","Q",4,0,2,{"nhan":"","cham":false}],["diem","R",0,3,2,{"nhan":"","cham":false}],["diem","S",4,3,2,{"nhan":"","cham":false}],["doan","X","P",{"mau":"vang"}],["doan","Y","P",{"mau":"vang"}],["doan","X","Q",{"mau":"vang"}],["doan","Y","R",{"mau":"vang"}],["doan","P","S",{"mau":"vang"}],["doan","Q","S",{"mau":"vang"}],["doan","R","S",{"mau":"vang"}],["doan","Z","Q",{"mau":"vang"}],["doan","Z","R",{"mau":"vang"}],["doan","O","X",{"mau":"ngoc","net":"dut"}],["doan","O","Y",{"mau":"ngoc","net":"dut"}],["doan","O","Z",{"mau":"ngoc","net":"dut"}]]}}]};
})(window);
