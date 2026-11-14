/* lop.js — nối trang trò chơi với "máy chủ lớp học" (maychu.py) để học sinh quét QR vào dự thi.
   Chỉ hoạt động khi trang được mở qua địa chỉ của máy chủ (http://192.168.x.x:8080/trochoi.html). */
(function (G) {
  "use strict";
  const J = async (du, o) => {
    const r = await fetch(du, o ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(o) } : { cache: "no-store" });
    const j = await r.json().catch(() => ({ loi: "Không đọc được trả lời của máy chủ." }));
    if (!r.ok) throw new Error(j.loi || "Lỗi máy chủ"); return j;
  };
  const Lop = {
    ma: null, dc: null,
    async kiemTra() { try { Lop.dc = await J("/api/dia-chi"); return true; } catch (e) { return false; } },
    async moPhong(ds, tro) { const r = await J("/api/mo-phong", { ds, tro }); Lop.ma = r.ma; Lop.dc = r; return r; },
    url() { return Lop.dc ? `http://${Lop.dc.ip[0]}:${Lop.dc.cong}/hs.html?ma=${Lop.ma}` : ""; },
    gv() { return J(`/api/gv?ma=${Lop.ma}`); },
    raCau(o) { return J("/api/gv/cau", Object.assign({ ma: Lop.ma }, o)); },
    khoa() { return J("/api/gv/khoa", { ma: Lop.ma }); },
    loai() { return J("/api/gv/loai", { ma: Lop.ma }); },
    cuu() { return J("/api/gv/cuu", { ma: Lop.ma }); },
    themDiem(id, diem) { return J("/api/gv/diem", { ma: Lop.ma, id, diem }); },
    dong() { const m = Lop.ma; Lop.ma = null; return m ? J("/api/gv/dong", { ma: m }) : Promise.resolve(); },

    /* vẽ mã QR vào phần tử (dùng assets/lib/qrcode.js) */
    veQR(el, url, co) {
      if (!el) return;
      try {
        const q = qrcode(0, "M"); q.addData(url); q.make();
        el.innerHTML = q.createSvgTag({ cellSize: co || 6, margin: 2, scalable: true });
        const svg = el.querySelector("svg");
        if (svg) { svg.style.width = "100%"; svg.style.height = "auto"; svg.style.background = "#fff"; }
      } catch (e) { el.textContent = url; }
    },

    /* đọc danh sách lớp từ file .xlsx (cột Họ tên, cột Tổ nếu có) hoặc .csv/.txt */
    async docFile(f) {
      const ten = (f.name || "").toLowerCase();
      if (ten.endsWith(".xlsx") || ten.endsWith(".xlsm")) return Lop.docXlsx(await f.arrayBuffer());
      const t = await f.text();
      return Lop.docVanBan(t);
    },
    docVanBan(t) {
      return String(t || "").split(/\r?\n/).map(d => {
        const c = d.split(/[\t,;|]/).map(x => x.trim()).filter(x => x !== "");
        if (!c.length) return null;
        if (c.length === 1) return { ten: c[0], to: "" };
        const so = c.findIndex(x => /^\d+$/.test(x));
        const ten = c.find(x => /[A-Za-zÀ-ỹ]{2,}/.test(x) && !/^(stt|họ|tên|tổ|lớp)/i.test(x));
        if (!ten) return null;
        const to = c.find((x, i) => x !== ten && i !== so && /[A-Za-zÀ-ỹ0-9]/.test(x) && x.length <= 12) || "";
        return { ten, to };
      }).filter(x => x && x.ten && !/^(stt|họ và tên|họ tên|danh sách)/i.test(x.ten));
    },
    async docXlsx(buf) {
      const zip = await JSZip.loadAsync(buf);
      const ss = [];
      const fss = zip.file("xl/sharedStrings.xml");
      if (fss) {
        const x = new DOMParser().parseFromString(await fss.async("string"), "application/xml");
        x.querySelectorAll("si").forEach(si => ss.push(Array.from(si.querySelectorAll("t")).map(t => t.textContent).join("")));
      }
      const ten1 = Object.keys(zip.files).filter(n => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0];
      if (!ten1) return [];
      const x = new DOMParser().parseFromString(await zip.file(ten1).async("string"), "application/xml");
      const hang = [];
      x.querySelectorAll("row").forEach(r => {
        const o = [];
        r.querySelectorAll("c").forEach(c => {
          const ref = (c.getAttribute("r") || "").replace(/\d+/g, "");
          const cot = ref.split("").reduce((a, ch) => a * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
          const v = c.querySelector("v"); const isv = c.querySelector("is t");
          let s = isv ? isv.textContent : (v ? v.textContent : "");
          if (c.getAttribute("t") === "s" && v) s = ss[+v.textContent] || "";
          o[cot] = String(s || "").trim();
        });
        hang.push(o);
      });
      return Lop.tuBang(hang);
    },
    tuBang(hang) {
      let iTen = -1, iTo = -1, batDau = 0;
      for (let r = 0; r < Math.min(hang.length, 12); r++) {
        const h = hang[r] || [];
        h.forEach((c, i) => {
          const k = String(c || "").toLowerCase();
          if (iTen < 0 && /(họ.*tên|họ và tên|^tên$|hovaten|ho ten)/.test(k)) { iTen = i; batDau = r + 1; }
          if (iTo < 0 && /^(tổ|to|nhóm|nhom|đội|doi)/.test(k)) iTo = i;
        });
        if (iTen >= 0) break;
      }
      if (iTen < 0) {   // không có tiêu đề: lấy cột có nhiều chữ nhất
        const diem = [];
        hang.forEach(h => (h || []).forEach((c, i) => { if (/[A-Za-zÀ-ỹ]{3,}\s+[A-Za-zÀ-ỹ]/.test(String(c || ""))) diem[i] = (diem[i] || 0) + 1; }));
        iTen = diem.indexOf(Math.max(...diem.map(x => x || 0)));
        batDau = 0;
      }
      const ds = [];
      for (let r = batDau; r < hang.length; r++) {
        const h = hang[r] || []; const ten = String(h[iTen] || "").trim();
        if (!ten || /^(stt|họ|tên|danh sách)/i.test(ten)) continue;
        ds.push({ ten, to: iTo >= 0 ? String(h[iTo] || "").trim() : "" });
      }
      return ds;
    }
  };
  G.Lop = Lop;
})(window);
