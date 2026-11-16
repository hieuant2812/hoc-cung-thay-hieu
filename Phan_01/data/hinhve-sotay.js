/* Hình vẽ minh hoạ cho từng DẠNG bài trong Sổ tay (vẽ bằng assets/hinhve.js).
   HINHST[lớp][bài][số thứ tự dạng] = { ten: chú thích, h: mô tả hình }.
   Hình chung của cả bài (phần lí thuyết) lấy từ data/hinhve-bai.js. */
(function (G) {
  const D = (n, x, y, o) => ["diem", n, x, y, o || {}];
  const D3 = (n, x, y, z, o) => ["diem", n, x, y, z, o || {}];
  const an = (n, x, y, z) => ["diem", n, x, y, z === undefined ? { nhan: "", cham: false } : z, ...(z !== undefined && typeof z === "number" ? [] : [])];
  void an;
  const kin = (n, x, y) => ["diem", n, x, y, { nhan: "", cham: false }];
  const kin3 = (n, x, y, z) => ["diem", n, x, y, z, { nhan: "", cham: false }];
  const lapPhuong = (a, them) => ({ w: 4.6, kg: true, el: [
    D3("A", a, 0, 0, { vt: "below left" }), D3("B", a, a, 0, { vt: "below right" }), D3("C", 0, a, 0, { vt: "right" }), D3("D", 0, 0, 0, { vt: "left" }),
    D3("A'", a, 0, a, { vt: "left" }), D3("B'", a, a, a, { vt: "right" }), D3("C'", 0, a, a, { vt: "above right" }), D3("D'", 0, 0, a, { vt: "above left" }),
    ["doan", "A", "B"], ["doan", "B", "C"], ["doan", "C", "D", { net: "dut" }], ["doan", "D", "A", { net: "dut" }],
    ["doan", "A'", "B'"], ["doan", "B'", "C'"], ["doan", "C'", "D'"], ["doan", "D'", "A'"],
    ["doan", "A", "A'"], ["doan", "B", "B'"], ["doan", "C", "C'"], ["doan", "D", "D'", { net: "dut" }], ...(them || [])] });
  const chopVuong = (them) => ({ w: 4.6, kg: true, el: [
    D3("A", 0, 0, 0, { vt: "left" }), D3("B", 2.6, 0, 0, { vt: "below left" }), D3("C", 2.6, 2.6, 0, { vt: "below right" }), D3("D", 0, 2.6, 0, { vt: "right" }),
    D3("S", 0, 0, 3.2, { vt: "above" }),
    ["doan", "A", "B", { net: "dut" }], ["doan", "A", "D", { net: "dut" }], ["doan", "B", "C"], ["doan", "C", "D"],
    ["doan", "S", "A", { mau: "cam" }], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "D"], ...(them || [])] });
  const chopDeu = (them) => ({ w: 4.6, kg: true, el: [
    D3("A", 2.6, 0, 0, { vt: "below left" }), D3("B", 2.6, 2.6, 0, { vt: "below right" }), D3("C", 0, 2.6, 0, { vt: "right" }), D3("D", 0, 0, 0, { vt: "left" }),
    D3("O", 1.3, 1.3, 0, { vt: "below", mau: "cam" }), D3("S", 1.3, 1.3, 3, { vt: "above" }),
    ["doan", "A", "B"], ["doan", "B", "C"], ["doan", "C", "D", { net: "dut" }], ["doan", "D", "A", { net: "dut" }],
    ["doan", "S", "A"], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "D", { net: "dut" }], ["doan", "S", "O", { net: "dut", mau: "vang" }], ...(them || [])] });
  const chopHBH = (them) => ({ w: 4.8, kg: true, el: [
    D3("A", 2, 0, 0, { vt: "below left" }), D3("B", 2, 3.2, 0, { vt: "below right" }), D3("C", 0, 3.8, 0, { vt: "right" }), D3("D", 0, 0.6, 0, { vt: "left" }),
    D3("S", 1, 1.9, 3.2, { vt: "above" }), D3("O", 1, 1.9, 0, { vt: "below", mau: "cam" }),
    ["doan", "A", "B"], ["doan", "B", "C"], ["doan", "A", "D", { net: "dut" }], ["doan", "D", "C", { net: "dut" }],
    ["doan", "S", "A"], ["doan", "S", "B"], ["doan", "S", "C"], ["doan", "S", "D", { net: "dut" }],
    ["doan", "A", "C", { net: "dut" }], ["doan", "B", "D", { net: "dut" }], ...(them || [])] });
  const tuDien = (them) => ({ w: 4.6, kg: true, el: [
    D3("A", 0.8, 1.6, 3, { vt: "above" }), D3("B", 2, 0, 0, { vt: "below left" }), D3("C", 2, 3.4, 0, { vt: "below right" }), D3("D", 0, 2.2, 0, { vt: "right" }),
    ["doan", "A", "B"], ["doan", "A", "C"], ["doan", "B", "C"], ["doan", "A", "D", { net: "dut" }], ["doan", "B", "D", { net: "dut" }], ["doan", "C", "D", { net: "dut" }], ...(them || [])] });
  const oxyz = (them) => ({ w: 4.6, kg: true, el: [
    D3("O", 0, 0, 0, { vt: "above left" }), D3("X", 3.4, 0, 0, { cham: false, nhan: "x", vt: "below left" }), D3("Y", 0, 3.6, 0, { cham: false, nhan: "y", vt: "below" }), D3("Z", 0, 0, 3.6, { cham: false, nhan: "z", vt: "left" }),
    ["vec", "O", "X", { mau: "trang" }], ["vec", "O", "Y", { mau: "trang" }], ["vec", "O", "Z", { mau: "trang" }], ...(them || [])] });
  /* sơ đồ cây hai tầng: goc → nhánh (nhãn, xác suất) → lá (nhãn, xác suất) */
  const cay = (nhanh) => {
    const el = [D("R", 0, 0, { vt: "left", nhan: "" })]; const nL = nhanh.reduce((s, n) => s + n.la.length, 0);
    let y = (nL - 1) * 0.55, k = 0;
    nhanh.forEach((n, i) => {
      const ys = n.la.map(() => (y - 1.1 * (k++)));
      const yn = (ys[0] + ys[ys.length - 1]) / 2, ten = "N" + i;
      el.push(D(ten, 2.4, yn, { vt: "above", nhan: n.t, mau: "vang" }), ["doan", "R", ten, { mau: "ngoc" }], ["chu", 1.2, yn / 2 + 0.28, n.p, { mau: "cam" }]);
      n.la.forEach((l, j) => { const tl = ten + "L" + j; el.push(D(tl, 5, ys[j], { vt: "right", nhan: l.t }), ["doan", ten, tl], ["chu", 3.7, (yn + ys[j]) / 2 + 0.22, l.p, { mau: "cam" }]); });
    });
    return { w: 5.4, el };
  };

  G.HINHST = {
    "10": {
      3: { 3: { ten: "Miền nghiệm của $x+2y<4$: nửa mặt phẳng chứa $O$, bờ nét đứt", h: { w: 4.6, khung: [-1.2, 5.4, -1.2, 3.4], el: [
        ["mien", [[-1.2, -1.2], [5.4, -1.2], [5.4, -0.7], [-1.2, 2.6]], { to: "ngoc", do: .28 }], ["truc", { x: [-1.1, 5.2], y: [-1.1, 3.2], so: [4], soy: [2] }],
        ["thang", [4, 0], [0, 2], { keo: [-0.3, 1.5], mau: "cam", net: "dut" }], ["chu", 3.3, 1.2, "x+2y=4", { mau: "cam" }]] } },
        5: { ten: "Bờ đi qua $(2;0)$, $(0;3)$; miền chứa $O$: $3x+2y\\le6$", h: { w: 4.2, khung: [-1, 4, -1, 4.2], el: [
          ["mien", [[-1, -1], [2.67, -1], [-0.67, 4], [-1, 4]], { to: "ngoc", do: .28 }], ["truc", { x: [-0.9, 3.8], y: [-0.9, 4], so: [2], soy: [3] }],
          ["thang", [2, 0], [0, 3], { keo: [-0.3, 1.3], mau: "cam" }]] } } },
      4: { 3: { ten: "Miền nghiệm là tứ giác $OACB$ với $A(4;0)$, $B(3;1)$, $C(0;2)$", h: { w: 4.8, khung: [-0.9, 6.6, -0.9, 3.4], el: [
        ["mien", [[0, 0], [4, 0], [3, 1], [0, 2]], { to: "ngoc", do: .35 }], ["truc", { x: [-0.8, 6.4], y: [-0.8, 3.2] }],
        ["thang", [4, 0], [0, 4], { keo: [-0.1, 0.8], mau: "vang" }], ["thang", [6, 0], [0, 2], { keo: [-0.05, 1.2], mau: "cam" }],
        D("A", 4, 0, { vt: "below" }), D("B", 3, 1, { vt: "above right" }), D("C", 0, 2, { vt: "left" })] } },
        4: { ten: "Miền ràng buộc; lãi lớn nhất tại đỉnh $(4;2)$", h: { w: 4.6, khung: [-0.9, 8.6, -0.9, 6.2], el: [
          ["mien", [[0, 0], [5, 0], [4, 2], [0, 4]], { to: "ngoc", do: .35 }], ["truc", { x: [-0.8, 8.4], y: [-0.8, 6] }],
          ["thang", [5, 0], [0, 10], { keo: [-0.1, 0.55], mau: "vang", ten: "2x+y=10", vt: "right" }], ["thang", [8, 0], [0, 4], { keo: [-0.05, 1.1], mau: "cam", ten: "x+2y=8", vt: "above" }],
          D("M", 4, 2, { vt: "above right", nhan: "(4;2)", mau: "cam" })] } } },
      6: { 5: { ten: "$CA=200$ m, $CB=300$ m, $\\widehat{ACB}=60^\\circ$", h: { w: 4.6, el: [
        D("C", 0, 0, { vt: "below left" }), D("A", 2, 0, { vt: "below right" }), D("B", 1.5, 2.6, { vt: "above" }),
        ["dagiac", ["A", "B", "C"], { to: "ngoc", do: .12 }], ["doan", "A", "B", { mau: "cam", net: "dut" }], ["goc", "A", "C", "B", { ten: "60°", r: .45 }],
        ["elip", [1.95, 1.35], 0.55, 0.38, { mau: "ngoc" }], ["chu", 1.95, 1.35, "hồ", { mau: "ngoc" }]] } } },
      8: { 3: { ten: "$\\overrightarrow{AB}+\\overrightarrow{AC}=\\overrightarrow{AD}=2\\overrightarrow{AM}$", h: { w: 4, el: [
        D("A", 1.5, 2.6, { vt: "above" }), D("B", 0, 0, { vt: "left" }), D("C", 3, 0, { vt: "right" }), D("M", 1.5, 0, { vt: "below right" }), D("D", 1.5, -2.6, { vt: "below" }),
        ["doan", "B", "C"], ["doan", "B", "D", { net: "dut" }], ["doan", "C", "D", { net: "dut" }],
        ["vec", "A", "B", { mau: "vang" }], ["vec", "A", "C", { mau: "vang" }], ["vec", "A", "D", { mau: "cam" }]] } },
        4: { ten: "Hợp lực của hai lực vuông góc là đường chéo hình chữ nhật", h: { w: 3.6, el: [
          D("O", 0, 0, { vt: "below left" }), D("A", 2.4, 0, { vt: "below", nhan: "F_1" }), D("B", 0, 3.2, { vt: "left", nhan: "F_2" }), kin("C", 2.4, 3.2),
          ["doan", "A", "C", { net: "dut" }], ["doan", "B", "C", { net: "dut" }], ["vec", "O", "A", { mau: "vang" }], ["vec", "O", "B", { mau: "ngoc" }], ["vec", "O", "C", { mau: "cam" }], ["chu", 2.6, 3.35, "F", { mau: "cam" }], ["vuong", "A", "O", "B", { r: .35 }]] } } },
      9: { 4: { ten: "$\\overrightarrow{AM}=\\dfrac23\\overrightarrow{AB}$", h: { w: 4.4, khung: [-0.5, 3.5, -0.7, 0.8], el: [
        D("A", 0, 0, { vt: "below" }), D("M", 2, 0, { vt: "below", mau: "cam" }), D("B", 3, 0, { vt: "below" }), ["doan", "A", "B"], ["vec", "A", "M", { mau: "cam" }]] } },
        5: { ten: "Tập hợp điểm $M$: đường tròn đường kính $AB$", h: { w: 3.8, el: [
          D("A", -1.6, 0, { vt: "left" }), D("B", 1.6, 0, { vt: "right" }), D("I", 0, 0, { vt: "below" }), D("M", 0.96, 1.28, { vt: "above right", mau: "cam" }),
          ["tron", "I", 1.6, { mau: "ngoc" }], ["doan", "A", "B"], ["doan", "M", "A", { net: "dut" }], ["doan", "M", "B", { net: "dut" }], ["doan", "M", "I", { mau: "vang" }]] } } },
      10: { 4: { ten: "$ABCD$ là hình bình hành $\\Leftrightarrow\\overrightarrow{AD}=\\overrightarrow{BC}$", h: { w: 4, khung: [-0.8, 5, -0.8, 5.8], el: [
        ["truc", { x: [-0.7, 4.8], y: [-0.7, 5.6], so: [1, 2, 3, 4], soy: [1, 2, 4, 5] }],
        D("A", 1, 1, { vt: "below" }), D("B", 3, 2, { vt: "right" }), D("C", 4, 5, { vt: "above right" }), D("D", 2, 4, { vt: "above left", mau: "cam" }),
        ["doan", "A", "B"], ["doan", "D", "C"], ["vec", "A", "D", { mau: "cam" }], ["vec", "B", "C", { mau: "cam" }]] } } },
      11: { 1: { ten: "Góc $(\\overrightarrow{AB},\\overrightarrow{BC})=120^\\circ$: tịnh tiến về chung gốc $B$", h: { w: 4.6, el: [
        D("A", 0, 0, { vt: "below left" }), D("B", 2.4, 0, { vt: "below" }), D("C", 1.2, 2.08, { vt: "above" }), kin("E", 4.2, 0),
        ["dagiac", ["A", "B", "C"], { to: "ngoc", do: .1 }], ["vec", "A", "B", { mau: "vang" }], ["vec", "B", "E", { mau: "vang", net: "dut" }], ["vec", "B", "C", { mau: "cam" }], ["goc", "E", "B", "C", { ten: "120°", r: .45 }]] } } },
      16: { 3: { ten: "Đồ thị $y=x^2-2x-3$: đỉnh $I(1;-4)$, cắt $Ox$ tại $-1$ và $3$", h: { w: 4.2, khung: [-2.2, 4.4, -4.8, 5.4], el: [
        ["truc", { x: [-2.1, 4.2], y: [-4.6, 5.2], so: [-1, 3], soy: [-3] }], ["ham", "x*x-2*x-3", -1.9, 3.9, { mau: "vang" }],
        D("I", 1, -4, { vt: "below", mau: "cam" }), ["doan", [1, -4.5], [1, 5], { net: "dut", mau: "ngoc" }]] } } },
      17: { 1: { ten: "$f(x)=x^2-5x+6$: âm giữa hai nghiệm, dương ở ngoài", h: { w: 4.2, khung: [-0.6, 5, -1.2, 3.2], el: [
        ["vung", "x*x-5*x+6", "0", 2, 3, { to: "cam", do: .35 }], ["truc", { x: [-0.5, 4.8], y: [-1.1, 3], so: [2, 3] }], ["ham", "x*x-5*x+6", 0.6, 4.4, { mau: "vang" }],
        ["chu", 1, 1.6, "+", { mau: "luc" }], ["chu", 4, 1.6, "+", { mau: "luc" }], ["chu", 2.5, -0.65, "−", { mau: "cam" }]] } } },
      19: { 4: { ten: "Trung trực của $AB$: qua trung điểm $I$, vuông góc $AB$", h: { w: 4, khung: [-0.6, 5.8, -1.4, 4.6], el: [
        ["truc", { x: [-0.5, 5.6], y: [-1.3, 4.4] }], D("A", 1, 3, { vt: "above" }), D("B", 5, 1, { vt: "above right" }), D("I", 3, 2, { vt: "below left", mau: "cam" }),
        ["doan", "A", "B"], ["thang", [1.5, -1], [4, 4], { keo: [-0.05, 1.05], mau: "cam" }], ["vuong", "B", "I", [4, 4], { r: .3 }]] } } },
      20: { 4: { ten: "$d(M,\\Delta)=MH$ với $H$ là hình chiếu của $M$", h: { w: 4, khung: [-1.4, 3.6, -1.4, 2.6], el: [
        ["truc", { x: [-1.3, 3.4], y: [-1.3, 2.4] }], ["thang", [-1, 2], [3, -1], { keo: [-0.05, 1.1], mau: "vang", ten: "Δ", vt: "above right" }],
        D("M", 2, 1, { vt: "above right", mau: "cam" }), D("H", 1.4, 0.2, { vt: "below left" }), ["doan", "M", "H", { mau: "cam", net: "dut" }], ["vuong", "M", "H", [3, -1], { r: .25 }]] } } },
      21: { 4: { ten: "Đường tròn tiếp xúc $\\Delta$: $R=d(I,\\Delta)$", h: { w: 4, khung: [-0.8, 5, -1.8, 4], el: [
        ["truc", { x: [-0.7, 4.8], y: [-1.7, 3.8] }], D("I", 2, 1, { vt: "below left", mau: "cam" }), ["tron", "I", 2, { mau: "ngoc" }],
        ["thang", [-0.4, 1.7], [4.4, 5.3], { keo: [-0.2, 0.75], mau: "vang", ten: "Δ" }], D("T", 0.8, 2.6, { vt: "above left", nhan: "" }), ["doan", "I", "T", { net: "dut", mau: "cam" }]] } },
        5: { ten: "Tiếp tuyến tại $M$ vuông góc với bán kính $IM$", h: { w: 4, khung: [-4.4, 7, -7.4, 6], el: [
          ["truc", { x: [-4.3, 6.8], y: [-7.3, 5.8] }], D("I", 1, -2, { vt: "below", mau: "cam" }), ["tron", "I", 5, { mau: "ngoc" }], D("M", 4, 2, { vt: "right" }),
          ["doan", "I", "M", { mau: "cam" }], ["thang", [0, 5], [8, -1], { keo: [-0.05, 0.85], mau: "vang" }], ["vuong", "I", "M", [0, 5], { r: .5 }]] } } },
      22: { 1: { ten: "Elip $\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1$: $F_1(-4;0)$, $F_2(4;0)$", h: { w: 4.8, khung: [-6, 6, -3.8, 3.8], el: [
        ["truc", { x: [-5.9, 5.9], y: [-3.7, 3.7], so: [-5, 5], soy: [3] }], ["elip", [0, 0], 5, 3, { mau: "vang" }],
        D("F1", -4, 0, { vt: "below", nhan: "F_1", mau: "cam" }), D("F2", 4, 0, { vt: "below", nhan: "F_2", mau: "cam" }), D("M", 3, 2.4, { vt: "above right" }),
        ["doan", "F1", "M", { net: "dut" }], ["doan", "F2", "M", { net: "dut" }]] } },
        3: { ten: "Hypebol $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$ và hai tiệm cận $y=\\pm\\dfrac34x$", h: { w: 4.8, khung: [-7.5, 7.5, -4.8, 4.8], el: [
          ["truc", { x: [-7.4, 7.4], y: [-4.7, 4.7], so: [-4, 4] }], ["tham", "4*Math.cosh(t)", "3*Math.sinh(t)", -1.4, 1.4, { mau: "vang" }], ["tham", "-4*Math.cosh(t)", "3*Math.sinh(t)", -1.4, 1.4, { mau: "vang" }],
          ["ham", "0.75*x", -6.4, 6.4, { mau: "ngoc" }], ["ham", "-0.75*x", -6.4, 6.4, { mau: "ngoc" }], D("F1", -5, 0, { vt: "above", nhan: "F_1", mau: "cam" }), D("F2", 5, 0, { vt: "above", nhan: "F_2", mau: "cam" })] } },
        4: { ten: "Parabol $y^2=8x$: tiêu điểm $F(2;0)$, đường chuẩn $x=-2$", h: { w: 4.2, khung: [-3, 6, -5.4, 5.4], el: [
          ["truc", { x: [-2.9, 5.8], y: [-5.3, 5.3], so: [2] }], ["tham", "t*t/8", "t", -6.3, 6.3, { mau: "vang" }], ["doan", [-2, -5.2], [-2, 5.2], { mau: "ngoc", net: "dut" }],
          D("F", 2, 0, { vt: "below right", mau: "cam" }), D("M", 2, 4, { vt: "right" }), D("K", -2, 4, { vt: "left" }), ["doan", "M", "F", { net: "dut" }], ["doan", "M", "K", { net: "dut" }]] } } },
      27: { 1: { ten: "Sơ đồ cây (2 lần đầu): mỗi nhánh xác suất $\\dfrac12$", h: cay([{ t: "T", p: "1/2", la: [{ t: "TT", p: "1/2" }, { t: "TG", p: "1/2" }] }, { t: "G", p: "1/2", la: [{ t: "GT", p: "1/2" }, { t: "GG", p: "1/2" }] }]) } }
    },
    "11": {
      1: { 3: { ten: "Điểm biểu diễn góc thuộc góc phần tư III: $\\sin\\alpha<0$, $\\cos\\alpha<0$", h: { w: 3.8, khung: [-1.5, 1.5, -1.45, 1.45], el: [
        ["truc", { x: [-1.4, 1.42], y: [-1.4, 1.42] }], ["tron", [0, 0], 1, { mau: "ngoc" }], kin("O0", 0, 0), kin("A0", 1, 0),
        D("M", -0.866, -0.5, { vt: "below left", mau: "cam" }), ["doan", "O0", "M", { mau: "cam" }], ["doan", "M", [-0.866, 0], { net: "dut" }], ["doan", "M", [0, -0.5], { net: "dut" }],
        ["chu", -0.75, 0.75, "II", { mau: "vang" }], ["chu", 0.75, 0.75, "I", { mau: "vang" }], ["chu", -0.75, -0.95, "III", { mau: "cam" }], ["chu", 0.75, -0.95, "IV", { mau: "vang" }]] } } },
      3: { 4: { ten: "$y=3-2\\cos x$ dao động giữa $1$ và $5$", h: { w: 5, khung: [-3.6, 7, -0.8, 5.8], el: [
        ["truc", { x: [-3.5, 6.8], y: [-0.7, 5.6], soy: [1, 3, 5] }], ["ham", "3-2*Math.cos(x)", -3.4, 6.6, { mau: "vang" }],
        ["doan", [-3.4, 5], [6.6, 5], { net: "dut", mau: "ngoc" }], ["doan", [-3.4, 1], [6.6, 1], { net: "dut", mau: "ngoc" }]] } }
      },
      4: { 5: { ten: "Nghiệm của $\\cos2x=0$ trên $[0;\\pi]$: $\\dfrac\\pi4$ và $\\dfrac{3\\pi}4$", h: { w: 4.6, khung: [-0.5, 3.6, -1.5, 1.5], el: [
        ["truc", { x: [-0.4, 3.5], y: [-1.4, 1.4] }], ["ham", "Math.cos(2*x)", 0, 3.1416, { mau: "vang" }],
        D("P1", 0.785, 0, { vt: "below left", nhan: "π/4", mau: "cam" }), D("P2", 2.356, 0, { vt: "below right", nhan: "3π/4", mau: "cam" }), ["doan", [3.1416, -0.1], [3.1416, 0.1]], ["chu", 3.2, -0.3, "π", {}]] } } },
      10: { 1: { ten: "$(SAC)\\cap(SBD)=SO$", h: chopHBH([["doan", "S", "O", { mau: "cam", net: "day" }]]) },
        3: { ten: "Trong $(SAC)$: $AM$ cắt $SO$ tại $I$, nên $I=AM\\cap(SBD)$", h: chopHBH([D3("M", 0.5, 2.85, 1.6, { vt: "right" }), D3("I", 1, 1.9, 1.07, { vt: "left", mau: "cam" }), ["doan", "A", "M", { mau: "vang" }], ["doan", "S", "O", { net: "dut" }]]) } },
      11: { 2: { ten: "$MNPQ$ là hình bình hành ($MN\\parallel AC\\parallel QP$)", h: tuDien([D3("M", 1.4, 0.8, 1.5, { vt: "left" }), D3("N", 2, 1.7, 0, { vt: "below" }), D3("P", 1, 2.8, 0, { vt: "below right" }), D3("Q", 0.4, 1.9, 1.5, { vt: "right" }),
        ["dagiac", ["M", "N", "P", "Q"], { to: "vang", do: .25, mau: "vang" }]]) },
        3: { ten: "Giao tuyến $d$ qua $S$, song song $AB$ và $CD$", h: chopHBH([kin3("S1", 1, 0.3, 3.2), kin3("S2", 1, 3.6, 3.2), ["doan", "S1", "S2", { mau: "cam", net: "day" }], ["chu", 3.9, 2.7, "d", { mau: "cam" }]]) } },
      12: { 4: { ten: "Thiết diện song song $AC$, $BD$ là hình bình hành $MNPQ$", h: tuDien([D3("M", 1.4, 0.8, 1.5, { vt: "left" }), D3("N", 2, 1.7, 0, { vt: "below" }), D3("P", 1, 2.8, 0, { vt: "below right" }), D3("Q", 0.4, 1.9, 1.5, { vt: "right" }),
        ["dagiac", ["M", "N", "P", "Q"], { to: "ngoc", do: .3, mau: "ngoc" }]]) } },
      13: { 4: { ten: "Mặt phẳng qua trung điểm, song song $(BCD)$ cắt theo tam giác $MNP$", h: tuDien([D3("M", 1.4, 0.8, 1.5, { vt: "left" }), D3("N", 1.4, 2.5, 1.5, { vt: "right" }), D3("P", 0.4, 1.9, 1.5, { vt: "above right" }),
        ["dagiac", ["M", "N", "P"], { to: "vang", do: .3, mau: "vang" }]]) } },
      22: { 2: { ten: "Tam giác $AB'C$ đều nên góc giữa $A'C'$ và $B'C$ bằng $60^\\circ$", h: lapPhuong(2.6, [["dagiac", ["A", "B'", "C"], { to: "cam", do: .2, mau: "cam" }], ["doan", "A'", "C'", { mau: "vang" }]]) },
        4: { ten: "$B'D'\\parallel BD$ và $AC\\perp BD$", h: lapPhuong(2.6, [["doan", "A", "C", { mau: "cam", net: "dut" }], ["doan", "B", "D", { mau: "vang", net: "dut" }], ["doan", "B'", "D'", { mau: "vang" }]]) } },
      23: { 1: { ten: "$BC\\perp AB$, $BC\\perp SA$ nên $BC\\perp(SAB)$", h: chopVuong([["dagiac", ["S", "A", "B"], { to: "ngoc", do: .18 }], ["doan", "B", "C", { mau: "vang", net: "day" }], ["vuong", "A", "B", "C", { r: .35 }]]) },
        5: { ten: "$AH\\perp SB$, $AH\\perp BC$ nên $AH\\perp(SBC)$", h: chopVuong([D3("H", 1.3, 0, 1.6, { vt: "left", mau: "cam" }), ["doan", "A", "H", { mau: "cam" }], ["vuong", "A", "H", "S", { r: .3 }]]) } },
      24: { 1: { ten: "Góc giữa $SC$ và đáy là $\\widehat{SCA}$", h: chopVuong([["doan", "A", "C", { mau: "vang", net: "dut" }], ["goc", "A", "C", "S", { ten: "", r: .55 }]]) },
        3: { ten: "Hình chiếu của $SC$ lên $(SAB)$ là $SB$; góc cần tìm là $\\widehat{BSC}$", h: chopVuong([["dagiac", ["S", "A", "B"], { to: "ngoc", do: .18 }], ["goc", "B", "S", "C", { ten: "", r: .7 }]]) },
        4: { ten: "Chóp đều: góc giữa cạnh bên và đáy là $\\widehat{SAO}$", h: chopDeu([["doan", "A", "O", { mau: "cam", net: "dut" }], ["goc", "O", "A", "S", { ten: "", r: .5 }]]) } },
      25: { 4: { ten: "Góc nhị diện $[S,BC,A]$ có góc phẳng $\\widehat{SBA}$", h: chopVuong([["goc", "A", "B", "S", { ten: "", r: .5 }], ["vuong", "A", "B", "C", { r: .3 }]]) },
        5: { ten: "Góc giữa mặt bên và đáy: $\\widehat{SMO}$, $M$ là trung điểm $CD$", h: chopDeu([D3("M", 0, 1.3, 0, { vt: "below right" }), ["doan", "S", "M", { mau: "cam" }], ["doan", "O", "M", { mau: "cam", net: "dut" }], ["goc", "O", "M", "S", { ten: "", r: .4 }]]) } },
      26: { 2: { ten: "$d(A,(SBC))=AH$ với $AH\\perp SB$", h: chopVuong([D3("H", 1.3, 0, 1.6, { vt: "left", mau: "cam" }), ["doan", "A", "H", { mau: "cam" }], ["vuong", "A", "H", "S", { r: .3 }]]) },
        4: { ten: "$AO$ là đoạn vuông góc chung của $SA$ và $BD$", h: chopVuong([D3("O", 1.3, 1.3, 0, { vt: "below", mau: "cam" }), ["doan", "B", "D", { mau: "vang", net: "dut" }], ["doan", "A", "O", { mau: "cam", net: "day" }]]) } },
      27: { 5: { ten: "$\\dfrac{V_{S.AMN}}{V_{S.ABC}}=\\dfrac{SM}{SB}\\cdot\\dfrac{SN}{SC}=\\dfrac14$", h: { w: 4.4, kg: true, el: [
        D3("A", 2, 0, 0, { vt: "below left" }), D3("B", 0.6, 3.6, 0, { vt: "below right" }), D3("C", 0, 1, 0, { vt: "left" }), D3("S", 1, 1.4, 3.2, { vt: "above" }),
        ["doan", "A", "B"], ["doan", "A", "C", { net: "dut" }], ["doan", "B", "C", { net: "dut" }], ["doan", "S", "A"], ["doan", "S", "B"], ["doan", "S", "C"],
        D3("M", 0.8, 2.5, 1.6, { vt: "right" }), D3("N", 0.5, 1.2, 1.6, { vt: "left" }), ["dagiac", ["S", "M", "N"], { to: "vang", do: .2 }], ["doan", "A", "M", { mau: "vang", net: "dut" }], ["doan", "A", "N", { mau: "vang", net: "dut" }], ["doan", "M", "N", { mau: "vang" }]] } } },
      31: { 3: { ten: "Tiếp tuyến $y=2x-1$ của parabol $y=x^2$ tại $M(1;1)$", h: { w: 4, khung: [-2, 3, -1.6, 4.5], el: [
        ["truc", { x: [-1.9, 2.9], y: [-1.5, 4.3], so: [1], soy: [1] }], ["ham", "x*x", -1.9, 2.05, { mau: "vang" }], ["ham", "2*x-1", -0.3, 2.6, { mau: "cam" }], D("M", 1, 1, { vt: "right" })] } } }
    },
    "12": {
      1: { 3: { ten: "$y=x^3-3x^2+2$: cực đại $(0;2)$, cực tiểu $(2;-2)$", h: { w: 4.2, khung: [-1.4, 3.6, -2.8, 2.8], el: [
        ["truc", { x: [-1.3, 3.4], y: [-2.7, 2.7], so: [2], soy: [2, -2] }], ["ham", "x*x*x-3*x*x+2", -0.95, 2.95, { mau: "vang" }],
        D("CD", 0, 2, { vt: "above right", nhan: "CĐ", mau: "cam" }), D("CT", 2, -2, { vt: "below", nhan: "CT", mau: "cam" })] } } },
      2: { 3: { ten: "$y=x+\\dfrac4x$ trên $(0;+\\infty)$ nhỏ nhất bằng $4$ tại $x=2$", h: { w: 4, khung: [-0.6, 7, -0.6, 8], el: [
        ["truc", { x: [-0.5, 6.8], y: [-0.5, 7.8], so: [2], soy: [4] }], ["ham", "x+4/x", 0.55, 6.6, { mau: "vang" }], D("M", 2, 4, { vt: "below right", mau: "cam" }),
        ["doan", [2, 0], [2, 4], { net: "dut" }], ["doan", [0, 4], [2, 4], { net: "dut" }]] } },
        5: { ten: "Cắt bốn góc hình vuông cạnh $x$ rồi gấp thành hộp", h: { w: 3.8, el: [
          D("A", 0, 0, { nhan: "" }), D("B", 6, 0, { nhan: "" }), D("C", 6, 6, { nhan: "" }), D("E", 0, 6, { nhan: "" }),
          ["dagiac", ["A", "B", "C", "E"], { to: "ngoc", do: .12 }],
          ["dagiac", [[0, 0], [1, 0], [1, 1], [0, 1]], { to: "cam", do: .4 }], ["dagiac", [[5, 0], [6, 0], [6, 1], [5, 1]], { to: "cam", do: .4 }],
          ["dagiac", [[0, 5], [1, 5], [1, 6], [0, 6]], { to: "cam", do: .4 }], ["dagiac", [[5, 5], [6, 5], [6, 6], [5, 6]], { to: "cam", do: .4 }],
          ["dagiac", [[1, 1], [5, 1], [5, 5], [1, 5]], { to: "vang", do: .15 }], ["chu", 0.5, -0.45, "x", { mau: "cam" }], ["chu", 3, 3, "12 − 2x", { mau: "vang" }]] } } },
      3: { 1: { ten: "$y=\\dfrac{2x-1}{x+1}$: tiệm cận đứng $x=-1$, tiệm cận ngang $y=2$", h: { w: 4.2, khung: [-5.2, 4.2, -4, 7.4], el: [
        ["truc", { x: [-5.1, 4], y: [-3.9, 7.2], so: [-1], soy: [2] }], ["ham", "(2*x-1)/(x+1)", -5, -1.45, { mau: "vang" }], ["ham", "(2*x-1)/(x+1)", -0.62, 4, { mau: "vang" }],
        ["doan", [-1, -3.9], [-1, 7.2], { net: "dut", mau: "cam" }], ["doan", [-5.1, 2], [4, 2], { net: "dut", mau: "cam" }]] } },
        3: { ten: "$y=x+1+\\dfrac1x$: tiệm cận xiên $y=x+1$", h: { w: 4.2, khung: [-4.2, 4.2, -5, 5.4], el: [
          ["truc", { x: [-4.1, 4], y: [-4.9, 5.2] }], ["ham", "x+1+1/x", -4, -0.22, { mau: "vang" }], ["ham", "x+1+1/x", 0.2, 4, { mau: "vang" }],
          ["ham", "x+1", -4.1, 4, { mau: "cam" }], ["chu", 3.2, 3.6, "y=x+1", { mau: "cam" }]] } } },
      4: { 1: { ten: "$y=x^3-3x$ nhận $O$ làm tâm đối xứng", h: { w: 4, khung: [-2.6, 2.6, -2.9, 2.9], el: [
        ["truc", { x: [-2.5, 2.5], y: [-2.8, 2.8], so: [-1, 1], soy: [2, -2] }], ["ham", "x*x*x-3*x", -2.1, 2.1, { mau: "vang" }],
        D("A", -1, 2, { vt: "above", mau: "cam", nhan: "" }), D("B", 1, -2, { vt: "below", mau: "cam", nhan: "" })] } },
        4: { ten: "Đường $y=m$ ($-2<m<2$) cắt đồ thị tại ba điểm", h: { w: 4, khung: [-2.6, 2.6, -2.9, 2.9], el: [
          ["truc", { x: [-2.5, 2.5], y: [-2.8, 2.8], soy: [2, -2] }], ["ham", "x*x*x-3*x", -2.1, 2.1, { mau: "vang" }],
          ["doan", [-2.5, 1], [2.5, 1], { mau: "cam" }], ["chu", 2.3, 1.3, "y=m", { mau: "cam" }], ["doan", [-2.5, 2], [2.5, 2], { net: "dut", mau: "ngoc" }], ["doan", [-2.5, -2], [2.5, -2], { net: "dut", mau: "ngoc" }]] } },
        5: { ten: "Bậc ba có $a>0$ (nhánh phải đi lên), cắt $Oy$ tại $d<0$", h: { w: 3.8, khung: [-2.2, 3, -3, 2.6], el: [
          ["truc", { x: [-2.1, 2.9], y: [-2.9, 2.5] }], ["ham", "0.6*x*x*x-0.8*x*x-1.2*x-1", -1.6, 2.7, { mau: "vang" }], D("d", 0, -1, { vt: "left", nhan: "d", mau: "cam" })] } } },
      5: { 1: { ten: "Hàng rào ba cạnh, một cạnh dựa tường", h: { w: 4.2, khung: [-0.6, 6.6, -0.8, 3.4], el: [
        ["doan", [-0.4, 3], [6.4, 3], { mau: "trang", net: "day" }], ["chu", 3, 3.25, "tường", {}],
        ["dagiac", [[0.5, 3], [0.5, 0.5], [5.5, 0.5], [5.5, 3]], { to: "luc", do: .2, mau: "vang" }], ["chu", 0.15, 1.75, "x", { mau: "cam" }], ["chu", 5.85, 1.75, "x", { mau: "cam" }], ["chu", 3, 0.15, "100 − 2x", { mau: "cam" }]] } },
        5: { ten: "Nồng độ $C(t)=\\dfrac{5t}{t^2+4}$ đạt lớn nhất tại $t=2$", h: { w: 4.6, khung: [-0.6, 10.5, -0.4, 2], el: [
          ["truc", { x: [-0.5, 10.3], y: [-0.3, 1.9], so: [2] }], ["ham", "5*x/(x*x+4)", 0, 10, { mau: "vang", n: 200 }], D("M", 2, 1.25, { vt: "above", mau: "cam", nhan: "1,25" }), ["doan", [2, 0], [2, 1.25], { net: "dut" }]] } } },
      6: { 1: { ten: "$\\overrightarrow{AB}+\\overrightarrow{BC}+\\overrightarrow{CC'}=\\overrightarrow{AC'}$", h: lapPhuong(2.6, [["vec", "A", "B", { mau: "vang" }], ["vec", "B", "C", { mau: "vang" }], ["vec", "C", "C'", { mau: "vang" }], ["vec", "A", "C'", { mau: "cam" }]]) },
        4: { ten: "Tam giác $ACD'$ đều: $(\\overrightarrow{A'B},\\overrightarrow{AC})=60^\\circ$", h: lapPhuong(2.6, [["dagiac", ["A", "C", "D'"], { to: "cam", do: .2, mau: "cam" }], ["doan", "A'", "B", { mau: "vang" }]]) } },
      7: { 4: { ten: "Hình hộp chữ nhật $OABC.O'A'B'C'$, $B'(3;4;2)$", h: oxyz([D3("A", 3, 0, 0, { vt: "below left" }), D3("C", 0, 3, 0, { vt: "below" }), D3("Bd", 3, 3, 0, { nhan: "B", vt: "below" }), D3("Op", 0, 0, 1.8, { nhan: "O'", vt: "left" }),
        D3("Ap", 3, 0, 1.8, { nhan: "A'", vt: "left" }), D3("Cp", 0, 3, 1.8, { nhan: "C'", vt: "right" }), D3("Bp", 3, 3, 1.8, { nhan: "B'(3;4;2)", vt: "right", mau: "cam" }),
        ["doan", "A", "Bd"], ["doan", "C", "Bd"], ["doan", "Op", "Ap"], ["doan", "Op", "Cp"], ["doan", "Ap", "Bp"], ["doan", "Cp", "Bp"], ["doan", "A", "Ap"], ["doan", "Bd", "Bp"], ["doan", "C", "Cp"]]) } },
      13: { 1: { ten: "Diện tích giữa $y=x^2-2x$ và $Ox$ trên $[0;2]$", h: { w: 4, khung: [-0.8, 3.2, -1.6, 1.6], el: [
        ["vung", "0", "x*x-2*x", 0, 2, { to: "ngoc", do: .4 }], ["truc", { x: [-0.7, 3], y: [-1.5, 1.5], so: [2] }], ["ham", "x*x-2*x", -0.4, 2.6, { mau: "vang" }]] } },
        2: { ten: "Hình phẳng giữa $y=x$ và $y=x^2$", h: { w: 3.8, khung: [-0.6, 1.8, -0.4, 1.8], el: [
          ["vung", "x", "x*x", 0, 1, { to: "ngoc", do: .45 }], ["truc", { x: [-0.5, 1.7], y: [-0.3, 1.7], so: [1], soy: [1] }], ["ham", "x*x", -0.2, 1.3, { mau: "vang" }], ["ham", "x", -0.2, 1.5, { mau: "cam" }]] } },
        3: { ten: "Quay hình phẳng dưới $y=\\sqrt x$ quanh $Ox$", h: { w: 4.4, khung: [-0.6, 5, -2.6, 2.6], el: [
          ["vung", "Math.sqrt(x)", "-Math.sqrt(x)", 0, 4, { to: "ngoc", do: .15 }], ["truc", { x: [-0.5, 4.8], y: [-2.5, 2.5], so: [4] }], ["ham", "Math.sqrt(x)", 0, 4, { mau: "vang" }], ["ham", "-Math.sqrt(x)", 0, 4, { mau: "vang", net: "dut" }],
          ["elip", [4, 0], 0.35, 2, { mau: "cam" }], ["elip", [2, 0], 0.25, 1.414, { mau: "ngoc" }]] } } },
      14: { 2: { ten: "Mặt phẳng chắn ba trục tại $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$", h: oxyz([D3("A", 1.4, 0, 0, { vt: "left" }), D3("B", 0, 2.2, 0, { vt: "below" }), D3("C", 0, 0, 2.6, { vt: "right" }), ["dagiac", ["A", "B", "C"], { to: "vang", do: .3, mau: "vang" }]]) } },
      17: { 5: { ten: "Mặt phẳng cắt mặt cầu theo đường tròn bán kính $r=\\sqrt{R^2-d^2}$", h: { w: 4, khung: [-3, 3, -3, 3], el: [
        ["tron", [0, 0], 2.5, { mau: "ngoc" }], ["elip", [0, 0], 2.5, 0.6, { mau: "ngoc", net: "dut" }], ["elip", [0, 1.5], 2, 0.48, { mau: "vang" }],
        D("O", 0, 0, { vt: "below right" }), D("H", 0, 1.5, { vt: "above left" }), D("M", 2, 1.5, { vt: "right" }), ["doan", "O", "H", { mau: "cam", net: "dut" }], ["doan", "O", "M", { mau: "cam" }], ["doan", "H", "M", { mau: "vang" }]] } } },
      18: { 4: { ten: "Sơ đồ cây: lấy lần lượt không hoàn lại", h: cay([{ t: "Đỏ", p: "4/10", la: [{ t: "Đỏ", p: "3/9" }, { t: "Xanh", p: "6/9" }] }, { t: "Xanh", p: "6/10", la: [{ t: "Đỏ", p: "4/9" }, { t: "Xanh", p: "5/9" }] }]) } },
      19: { 1: { ten: "Sơ đồ cây: chọn máy rồi xét sản phẩm lỗi", h: cay([{ t: "Máy I", p: "0,6", la: [{ t: "Lỗi", p: "0,02" }, { t: "Tốt", p: "0,98" }] }, { t: "Máy II", p: "0,4", la: [{ t: "Lỗi", p: "0,03" }, { t: "Tốt", p: "0,97" }] }]) },
        3: { ten: "Sơ đồ cây cho bài toán xét nghiệm", h: cay([{ t: "Bệnh", p: "0,01", la: [{ t: "+", p: "0,99" }, { t: "−", p: "0,01" }] }, { t: "Không bệnh", p: "0,99", la: [{ t: "+", p: "0,05" }, { t: "−", p: "0,95" }] }]) },
        4: { ten: "Sơ đồ cây: chọn hộp rồi lấy bi", h: cay([{ t: "Hộp I", p: "1/2", la: [{ t: "Đỏ", p: "3/5" }, { t: "Xanh", p: "2/5" }] }, { t: "Hộp II", p: "1/2", la: [{ t: "Đỏ", p: "1/5" }, { t: "Xanh", p: "4/5" }] }]) } }
    }
  };
})(window);
