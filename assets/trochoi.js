/* trochoi.js — 10 trò chơi ôn tập cả lớp cùng tham gia, lấy câu từ ngân hàng đề trên máy.
   Dùng: TroChoi.batDau(ma, cfg, host) với cfg = {cau:[...], doi:[{ten,mau}], giay, am, hs:[tên học sinh]}
   Mọi trò dùng chung: thẻ câu hỏi, đồng hồ, bảng điểm đội, phím tắt, nút lời giải. */
(function (G) {
  "use strict";
  const esc = G.esc || (s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const T = s => (G.NHD && NHD.texToHtml) ? NHD.texToHtml(String(s == null ? "" : s)) : esc(s);
  const CHU = "ABCD";
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const tron = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);

  /* ---------------------------------------------------------------- âm thanh */
  let AC = null;
  function beep(f, t, kieu) {
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = kieu || "sine"; o.frequency.value = f; g.gain.value = .14;
      o.connect(g); g.connect(AC.destination); o.start();
      g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + t);
      o.stop(AC.currentTime + t);
    } catch (e) {}
  }
  const AM = {
    on: true,
    tick() { if (AM.on) beep(880, .05, "square"); },
    dung() { if (!AM.on) return; beep(784, .12); setTimeout(() => beep(1175, .25), 110); },
    sai() { if (!AM.on) return; beep(220, .3, "sawtooth"); },
    het() { if (AM.on) beep(330, .5, "triangle"); },
    quay() { if (AM.on) beep(440 + Math.random() * 400, .04, "square"); },
    thang() { if (!AM.on) return;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .25), i * 140)); }
  };

  /* ---------------------------------------------------------------- bối cảnh dùng chung */
  function taoCtx(cfg, host) {
    const ctx = {
      cfg, host, doi: (cfg.doi || []).map(d => Object.assign({ diem: 0 }, d)),
      i: 0, cau: cfg.cau.slice(), phim: {}, dungLai: false
    };
    ctx.layCau = (loc) => {
      for (let k = 0; k < ctx.cau.length; k++) {
        const q = ctx.cau[(ctx.i + k) % ctx.cau.length];
        if (!loc || loc(q)) { ctx.i = (ctx.i + k + 1) % ctx.cau.length; return q; }
      }
      return ctx.cau[(ctx.i++) % ctx.cau.length];
    };
    ctx.themDiem = (k, d) => { if (ctx.doi[k]) { ctx.doi[k].diem += d; veDiem(ctx); } };
    return ctx;
  }
  function veDiem(ctx) {
    const el = ctx.host.querySelector("[data-diem]"); if (!el) return;
    el.innerHTML = ctx.doi.map((d, k) => `<div class="doi${d.luot ? " luot" : ""}" style="--c:${d.mau}"><b>${esc(d.ten)}</b><span>${d.diem}</span></div>`).join("");
  }
  function khung(ctx, ten, than, duoi) {
    ctx.host.innerHTML = `<div class="tc-wrap">
      <div class="tc-top"><div class="tc-ten">${esc(ten)}</div><div class="tc-diem" data-diem></div>
        <button class="tc-x" data-thoat title="Kết thúc (Esc)">✕</button></div>
      <div class="tc-than" data-than>${than || ""}</div>
      <div class="tc-duoi" data-duoi>${duoi || ""}</div></div>`;
    ctx.host.querySelector("[data-thoat]").onclick = () => ctx.ketThuc();
    veDiem(ctx);
  }
  const than = ctx => ctx.host.querySelector("[data-than]");
  const duoi = ctx => ctx.host.querySelector("[data-duoi]");

  /* ---------------------------------------------------------------- phòng chờ (học sinh quét QR vào dự thi) */
  function phongCho(ctx, tenTro) {
    return new Promise(async (resolve) => {
      khung(ctx, tenTro + " — phòng chờ");
      than(ctx).innerHTML = `<div class="pc">
        <div class="pc-qr"><div data-qr></div>
          <div class="pc-ma">Mã phòng <b>${Lop.ma}</b></div>
          <div class="pc-url">${esc(Lop.url())}</div></div>
        <div class="pc-ds">
          <h3>Đã vào: <b data-so>0</b>/<span data-tong>${ctx.cfg.ds ? ctx.cfg.ds.length : 0}</span></h3>
          <div class="pc-ten" data-ten></div>
          <p class="tc-nhan">Các em dùng điện thoại quét mã QR bên cạnh (cùng wifi với máy này), chọn đúng tên mình rồi chờ.</p>
        </div></div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-batdau>Bắt đầu thi <kbd>Enter</kbd></button>
        <span class="tc-nhan">Có thể bắt đầu khi đủ số em cần thiết.</span></div>`;
      Lop.veQR(ctx.host.querySelector("[data-qr]"), Lop.url(), 7);
      let chay = true;
      (async function lap() {
        while (chay) {
          try {
            const t = await Lop.gv();
            const so = ctx.host.querySelector("[data-so]"); if (so) so.textContent = t.sohs;
            const dt = ctx.host.querySelector("[data-ten]");
            if (dt) dt.innerHTML = (t.hs || []).map(h => `<span class="v">${esc(h.ten)}${h.to ? ` <i>${esc(h.to)}</i>` : ""}</span>`).join("");
          } catch (e) {}
          await sleep(1200);
        }
      })();
      const xong = () => { chay = false; document.removeEventListener("keydown", ph); resolve(); };
      ctx.host.querySelector("[data-batdau]").onclick = xong;
      const ph = e => { if (e.key === "Enter") xong(); };
      document.addEventListener("keydown", ph);
    });
  }

  /* ---------------------------------------------------------------- thẻ câu hỏi dùng chung
     o = {giay, nhan, tuDong, anDapAn} → trả {dung, chon, q, hetGio} */
  function hoiCau(ctx, q, o) {
    o = o || {};
    return new Promise(resolve => {
      const giay = o.giay != null ? o.giay : (ctx.cfg.giay || 30);
      let pa = [], dung = 0;
      if (q.loai === "TN") { const t = tron(q.pa.map((x, i) => ({ x, i }))); pa = t.map(p => p.x); dung = t.findIndex(p => p.i === 0); }
      const ys = q.loai === "DS" ? (q.y || []) : [];
      than(ctx).innerHTML = `<div class="tc-cau">
        ${o.nhan ? `<div class="tc-nhan">${o.nhan}</div>` : ""}
        <div class="tc-de">${T(q.de)}</div>
        ${q.loai === "TN" ? `<div class="tc-pa">${pa.map((p, k) => `<button class="pa" data-k="${k}"><i>${CHU[k]}</i><span>${T(p)}</span></button>`).join("")}</div>`
          : q.loai === "DS" ? `<div class="tc-ds">${ys.map((y, k) => `<div class="ds" data-k="${k}"><b>${"abcd"[k]})</b> <span>${T(y.t)}</span><em></em></div>`).join("")}</div>`
            : `<div class="tc-tln">Đáp án: <b data-tln>? ? ?</b></div>`}
        <div class="tc-lg hidden" data-lg></div></div>`;
      duoi(ctx).innerHTML = `<div class="tc-dh"><span class="dh" data-dh>${giay}</span>
        <div class="tc-nut">
          <button class="btn ghost sm" data-hien>Hiện đáp án <kbd>Space</kbd></button>
          <button class="btn ghost sm" data-loigiai>Lời giải <kbd>G</kbd></button>
          <button class="btn coral sm hidden" data-tiep>Câu tiếp <kbd>Enter</kbd></button>
        </div></div>`;
      const $ = s => ctx.host.querySelector(s);
      let con = giay, hen = null, xong = false, chon = -1;
      const dhEl = $("[data-dh]");
      function dem() {
        hen = setInterval(() => {
          if (!dhEl || !dhEl.isConnected) { clearInterval(hen); return; }
          con--; dhEl.textContent = con;
          dhEl.classList.toggle("gap", con <= 5);
          if (con <= 5 && con > 0) AM.tick();
          if (con <= 0) { clearInterval(hen); AM.het(); hienDap(null, true); }
        }, 1000);
      }
      if (giay > 0) dem();
      /* --- chế độ học sinh dự thi bằng điện thoại --- */
      let dungLive = false;
      if (ctx.cfg.live && window.Lop && Lop.ma && q.loai === "TN") {
        than(ctx).insertAdjacentHTML("beforeend", `<div class="live"><div class="live-qr" data-lqr></div>
          <div><b data-dtl>0</b>/<span data-ltong>0</span> em đã trả lời<div class="live-dem" data-ldem></div></div></div>`);
        Lop.veQR(ctx.host.querySelector("[data-lqr]"), Lop.url(), 3);
        Lop.raCau({ de: q.de, pa, dapan: dung, giay, diem: o.diem || 10, loai: "TN", guiDe: ctx.cfg.guiDe !== false }).catch(() => {});
        (async function theoDoi() {
          while (!xong && !dungLive) {
            try {
              const t = await Lop.gv();
              const a = ctx.host.querySelector("[data-dtl]"), b2 = ctx.host.querySelector("[data-ltong]");
              if (a) a.textContent = t.datl || 0;
              if (b2) b2.textContent = t.con || t.sohs || 0;
              if ((t.datl || 0) >= (t.con || t.sohs || 0) && (t.sohs || 0) > 0) { hienDap(null); break; }
            } catch (e) {}
            await sleep(900);
          }
        })();
      }
      function hienDap(k, hetGio) {
        if (xong || !dhEl || !dhEl.isConnected) return; xong = true; clearInterval(hen);
        chon = (k == null ? -1 : k);
        if (q.loai === "TN") {
          ctx.host.querySelectorAll(".pa").forEach((b, idx) => {
            if (idx === dung) b.classList.add("dung");
            if (k != null && idx === k && idx !== dung) b.classList.add("sai");
          });
        } else if (q.loai === "DS") {
          ctx.host.querySelectorAll(".ds").forEach((d, idx) => { d.classList.add(ys[idx].d ? "dung" : "sai"); d.querySelector("em").textContent = ys[idx].d ? "Đúng" : "Sai"; });
        } else if ($("[data-tln]")) $("[data-tln]").textContent = q.da || "";
        const ok = q.loai === "TN" ? (k === dung) : null;
        if (k != null) (ok ? AM.dung() : AM.sai());
        const bt = $("[data-tiep]"), bh = $("[data-hien]");
        if (bt) bt.classList.remove("hidden");
        if (bh) bh.classList.add("hidden");
        if (o.tuDong) setTimeout(tiep, o.tuDong);
      }
      const res = {};
      function tiep() {
        if (!ctx._dangTiep) {
          ctx._dangTiep = true; thaoPhim(); dungLive = true;
          resolve(Object.assign(res, { q, chon, dung: q.loai === "TN" ? chon === dung : null, hetGio: con <= 0, dapAn: dung }));
          setTimeout(() => ctx._dangTiep = false, 50);
        }
      }
      ctx.host.querySelectorAll(".pa").forEach((b, k) => b.onclick = () => hienDap(k));
      $("[data-hien]").onclick = () => hienDap(null);
      $("[data-loigiai]").onclick = () => { const e = $("[data-lg]"); if (!e) return; e.classList.toggle("hidden"); if (!e.innerHTML) e.innerHTML = "<b>Lời giải.</b> " + T(q.loigiai || "(ngân hàng chưa có lời giải cho câu này)"); };
      $("[data-tiep]").onclick = tiep;
      function phim(e) {
        if (!dhEl || !dhEl.isConnected) { thaoPhim(); return; }
        if (e.key === " ") { e.preventDefault(); xong ? tiep() : hienDap(null); }
        else if (e.key === "Enter") { e.preventDefault(); xong ? tiep() : hienDap(null); }
        else if (e.key.toLowerCase() === "g") $("[data-loigiai]").click();
        else if (/^[1-4]$/.test(e.key) && q.loai === "TN" && !xong) hienDap(+e.key - 1);
        else if (/^[a-dA-D]$/.test(e.key) && q.loai === "TN" && !xong) hienDap(CHU.indexOf(e.key.toUpperCase()));
      }
      const thaoPhim = () => document.removeEventListener("keydown", phim);
      document.addEventListener("keydown", phim);
      ctx._thaoPhim = thaoPhim;
    });
  }

  /* chấm nhanh cho đội: trả về chỉ số đội được cộng điểm (phím 1..6), hoặc -1 nếu bỏ qua */
  function chamDoi(ctx, nhan) {
    return new Promise(resolve => {
      duoi(ctx).innerHTML = `<div class="tc-cham"><span>${nhan || "Đội nào trả lời đúng?"}</span>
        ${ctx.doi.map((d, k) => `<button class="btn sm" style="background:${d.mau};color:#fff" data-k="${k}">${k + 1}. ${esc(d.ten)}</button>`).join("")}
        <button class="btn ghost sm" data-k="-1">Không đội nào <kbd>0</kbd></button></div>`;
      const xong = k => { document.removeEventListener("keydown", ph); resolve(k); };
      duoi(ctx).querySelectorAll("[data-k]").forEach(b => b.onclick = () => xong(+b.dataset.k));
      const ph = e => { if (/^[0-9]$/.test(e.key)) { const n = +e.key; xong(n === 0 ? -1 : Math.min(n, ctx.doi.length) - 1); } };
      document.addEventListener("keydown", ph);
    });
  }

  function bangKetQua(ctx, loiNhan) {
    const sx = ctx.doi.map((d, k) => ({ d, k })).sort((a, b) => b.d.diem - a.d.diem);
    AM.thang();
    khung(ctx, "Kết quả", `<div class="tc-ket">
      <h2>🏆 ${esc(loiNhan || "Kết thúc trò chơi")}</h2>
      <div class="bxh">${sx.map((s, i) => `<div class="hang${i === 0 ? " nhat" : ""}" style="--c:${s.d.mau}">
        <span class="th">${i + 1}</span><b>${esc(s.d.ten)}</b><span class="dd">${s.d.diem}</span></div>`).join("")}</div>
      <div class="tc-nut" style="margin-top:22px">
        <button class="btn coral" data-lai>Chơi lại</button>
        <button class="btn ghost" data-ve>Về danh sách trò chơi</button></div></div>`);
    ctx.host.querySelector("[data-lai]").onclick = () => ctx.choiLai && ctx.choiLai();
    ctx.host.querySelector("[data-ve]").onclick = () => ctx.thoat && ctx.thoat();
    try { localStorage.setItem("tc-diem-" + (ctx.ma || "x"), JSON.stringify({ t: Date.now(), doi: ctx.doi.map(d => ({ ten: d.ten, diem: d.diem })) })); } catch (e) {}
  }

  /* ================================================================ 1. RUNG CHUÔNG VÀNG */
  async function rungChuong(ctx) {
    let conLai = ctx.cfg.siSo || 40, cuuTro = true, cau = 0;
    if (ctx.cfg.live) { await phongCho(ctx, "Rung chuông vàng"); const t = await Lop.gv().catch(() => null); if (t) conLai = t.sohs; }
    const tongCau = Math.min(ctx.cau.length, ctx.cfg.soCau || 15);
    while (cau < tongCau && !ctx.dungLai) {
      cau++;
      khung(ctx, `Rung chuông vàng — câu ${cau}/${tongCau} · còn ${conLai} bạn`);
      await hoiCau(ctx, ctx.layCau(q => q.loai === "TN"), { giay: ctx.cfg.giay, nhan: `${ctx.cfg.live ? "Các em bấm đáp án trên điện thoại" : "Cả lớp viết đáp án ra bảng con"} · còn lại <b data-cl>${conLai}</b> bạn` });
      if (ctx.dungLai) break;
      if (ctx.cfg.live) {
        const r = await Lop.loai().catch(() => null);
        if (r) { conLai = r.con; await banTen(ctx, r.loai, conLai); }
        if (conLai <= 3 && cuuTro) {
          cuuTro = false;
          if (confirm("Còn rất ít bạn. Dùng lượt CỨU TRỢ để cả lớp quay lại cuộc chơi?")) { const c = await Lop.cuu().catch(() => null); if (c) conLai = c.con; }
        }
      } else {
        const loai = await nhapSo(ctx, `Có bao nhiêu bạn trả lời <b>sai</b> câu này?`, 0, conLai);
        conLai = Math.max(0, conLai - loai);
        if (conLai <= 3 && cuuTro) {
          cuuTro = false;
          const them = await nhapSo(ctx, `🔔 <b>Cứu trợ!</b> Cả lớp chơi trò phụ, thầy cô cho bao nhiêu bạn được trở lại?`, 0, 20);
          conLai += them;
        }
      }
      if (conLai <= 0) { if (ctx.cfg.live) await bangHS(ctx, `Không còn bạn nào trụ lại sau câu ${cau}`); else bangKetQua(ctx, `Không còn bạn nào trụ lại sau câu ${cau}`); return; }
    }
    if (ctx.cfg.live) await bangHS(ctx, `Còn ${conLai} bạn trụ lại đến cuối — rung chuông vàng!`);
    else bangKetQua(ctx, `Còn ${conLai} bạn trụ lại đến cuối — rung chuông vàng!`);
  }
  function nhapSo(ctx, nhan, min, max) {
    return new Promise(resolve => {
      duoi(ctx).innerHTML = `<div class="tc-cham"><span>${nhan}</span>
        <button class="btn ghost sm" data-tru>−</button><b class="so" data-so>0</b><button class="btn ghost sm" data-cong>+</button>
        <button class="btn coral sm" data-ok>Xong <kbd>Enter</kbd></button></div>`;
      let v = 0; const el = duoi(ctx).querySelector("[data-so]");
      const dat = x => { v = Math.max(min, Math.min(max, x)); el.textContent = v; };
      duoi(ctx).querySelector("[data-tru]").onclick = () => dat(v - 1);
      duoi(ctx).querySelector("[data-cong]").onclick = () => dat(v + 1);
      const xong = () => { document.removeEventListener("keydown", ph); resolve(v); };
      duoi(ctx).querySelector("[data-ok]").onclick = xong;
      const ph = e => {
        if (e.key === "ArrowUp" || e.key === "+") dat(v + 1);
        else if (e.key === "ArrowDown" || e.key === "-") dat(v - 1);
        else if (/^[0-9]$/.test(e.key)) dat(v * 10 + +e.key);
        else if (e.key === "Enter") { e.preventDefault(); xong(); }
      };
      document.addEventListener("keydown", ph);
    });
  }

  function banTen(ctx, soLoai, conLai) {
    return new Promise(async res => {
      let t = null; try { t = await Lop.gv(); } catch (e) {}
      const rot = (t && t.hs || []).filter(h => !h.con);
      than(ctx).innerHTML = `<div class="tc-ket"><h2>Còn lại ${conLai} bạn</h2>
        ${soLoai ? `<p class="tc-nhan">${soLoai} bạn dừng cuộc chơi ở câu này:</p><div class="pc-ten">${rot.slice(-24).map(h => `<span class="v rot">${esc(h.ten)}</span>`).join("")}</div>` : `<p class="tc-nhan">Cả lớp đều trả lời đúng!</p>`}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-ok>Câu tiếp theo <kbd>Enter</kbd></button></div>`;
      const xong = () => { document.removeEventListener("keydown", ph); res(); };
      ctx.host.querySelector("[data-ok]").onclick = xong;
      const ph = e => { if (e.key === "Enter") xong(); };
      document.addEventListener("keydown", ph);
    });
  }
  async function bangHS(ctx, loi) {
    let t = null; try { t = await Lop.gv(); } catch (e) {}
    const hs = (t && t.hs || []).slice(0, 15);
    AM.thang();
    khung(ctx, "Kết quả");
    than(ctx).innerHTML = `<div class="tc-ket"><h2>🏆 ${esc(loi || "Kết thúc")}</h2>
      <div class="bxh">${hs.map((h, i) => `<div class="hang${i === 0 ? " nhat" : ""}" style="--c:${["#ffd66b", "#7fd1c1", "#ff9e7d"][i] || "#5e86d6"}">
        <span class="th">${i + 1}</span><b>${esc(h.ten)}</b>${h.to ? `<span class="tc-nhan">${esc(h.to)}</span>` : ""}<span class="dd">${h.diem}</span></div>`).join("")}</div>
      <div class="tc-nut" style="margin-top:20px"><button class="btn coral" data-lai>Chơi lại</button>
      <button class="btn ghost" data-ve>Về danh sách trò chơi</button></div></div>`;
    duoi(ctx).innerHTML = "";
    ctx.host.querySelector("[data-lai]").onclick = () => ctx.choiLai && ctx.choiLai();
    ctx.host.querySelector("[data-ve]").onclick = () => ctx.thoat && ctx.thoat();
  }

  /* ================================================================ 2. AI LÀ TRIỆU PHÚ */
  async function trieuPhu(ctx) {
    if (ctx.cfg.live) await phongCho(ctx, "Ai là triệu phú");
    const MOC = [100, 200, 300, 500, 1000, 2000, 3000, 6000, 10000, 15000, 30000, 60000, 125000, 250000, 500000];
    const MUC = ["NB", "NB", "NB", "TH", "TH", "TH", "TH", "VD", "VD", "VD", "VD", "VDC", "VDC", "VDC", "VDC"];
    let tro = { nam: true, lop: true, to: true };
    for (let n = 0; n < 15 && !ctx.dungLai; n++) {
      const q = ctx.layCau(x => x.loai === "TN" && x.muc === MUC[n]) || ctx.layCau(x => x.loai === "TN");
      khung(ctx, `Ai là triệu phú — câu ${n + 1}`);
      than(ctx).insertAdjacentHTML("afterbegin", `<div class="thang">${MOC.map((m, k) => `<span class="${k === n ? "nay" : k < n ? "qua" : ""}${[4, 9, 14].includes(k) ? " moc" : ""}">${k + 1}. ${m.toLocaleString("vi-VN")}</span>`).join("")}</div>`);
      const r = await hoiCau(ctx, q, { giay: ctx.cfg.giay || 45, nhan: `Mốc: <b>${MOC[n].toLocaleString("vi-VN")}</b> điểm` + troHtml(tro) });
      gắnTro(ctx, tro, q);
      if (ctx.dungLai) return;
      if (r.chon >= 0 && !r.dung) { bangKetQua(ctx, `Dừng ở câu ${n + 1} — được ${n > 0 ? MOC[Math.max(0, [4, 9, 14].filter(x => x < n).pop() || 0)].toLocaleString("vi-VN") : 0} điểm`); return; }
      if (r.dung) { ctx.themDiem(0, MOC[n] / 100); }
    }
    bangKetQua(ctx, "Chinh phục trọn vẹn 15 câu!");
  }
  const troHtml = tro => ` · Trợ giúp: ${tro.nam ? "<kbd>5</kbd> 50:50" : "<s>50:50</s>"} ${tro.lop ? "<kbd>L</kbd> hỏi lớp" : "<s>hỏi lớp</s>"} ${tro.to ? "<kbd>T</kbd> gọi tổ" : "<s>gọi tổ</s>"}`;
  function gắnTro(ctx, tro, q) {
    const ph = e => {
      const k = e.key.toLowerCase();
      if (k === "5" && tro.nam) {
        tro.nam = false;
        const pas = [...ctx.host.querySelectorAll(".pa")];
        const dung = pas.findIndex(p => p.classList.contains("dung")) >= 0 ? pas.findIndex(p => p.classList.contains("dung")) : 0;
        const bo = tron(pas.map((p, i) => i).filter(i => i !== dungIdx(ctx))).slice(0, 2);
        bo.forEach(i => pas[i].classList.add("mo"));
      } else if (k === "l" && tro.lop) { tro.lop = false; ctx.host.querySelector(".tc-cau").insertAdjacentHTML("beforeend", `<div class="tc-nhan" style="margin-top:10px">👥 Cả lớp biểu quyết: mời các em giơ tay theo từng phương án.</div>`); }
      else if (k === "t" && tro.to) { tro.to = false; ctx.host.querySelector(".tc-cau").insertAdjacentHTML("beforeend", `<div class="tc-nhan" style="margin-top:10px">🙋 Gọi một tổ trợ giúp trong 30 giây.</div>`); }
    };
    document.addEventListener("keydown", ph);
    setTimeout(() => document.removeEventListener("keydown", ph), 600000);
  }
  function dungIdx(ctx) { // vị trí phương án đúng (phần tử có thuộc tính data-dung do hoiCau gán khi hiện)
    const pas = [...ctx.host.querySelectorAll(".pa")];
    const i = pas.findIndex(p => p.classList.contains("dung"));
    return i >= 0 ? i : 0;
  }

  /* ================================================================ 3. LẬT MẢNH GHÉP */
  async function manhGhep(ctx) {
    const so = ctx.cfg.soManh || 8, tuKhoa = ctx.cfg.tuKhoa || "TOÁN HỌC";
    let mo = new Array(so).fill(false), luot = 0;
    const ve = () => {
      khung(ctx, "Lật mảnh ghép");
      than(ctx).innerHTML = `<div class="mg" style="--n:${so <= 6 ? 3 : 4}">
        ${mo.map((m, k) => `<div class="o${m ? " mo" : ""}" data-k="${k}">${m ? "" : `<b>${k + 1}</b>`}</div>`).join("")}
        <div class="nen">${esc(tuKhoa)}</div></div>
        <div class="tc-nhan" style="text-align:center;margin-top:12px">Tổ <b>${esc(ctx.doi[luot % ctx.doi.length].ten)}</b> chọn một mảnh · Đoán được từ khoá: <b>+30 điểm</b> <kbd>K</kbd></div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><span>Bấm vào mảnh để mở câu hỏi</span><button class="btn ghost sm" data-ketthuc>Kết thúc trò chơi</button></div>`;
      ctx.host.querySelectorAll(".o:not(.mo)").forEach(o => o.onclick = () => choi(+o.dataset.k));
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc — xếp hạng các tổ");
      ctx.doi.forEach((d, k) => d.luot = (k === luot % ctx.doi.length)); veDiem(ctx);
    };
    const doanTuKhoa = e => {
      if (e.key.toLowerCase() !== "k") return;
      chamDoi(ctx, "Tổ nào đoán đúng từ khoá?").then(k => {
        if (k >= 0) { ctx.themDiem(k, 30); mo = mo.map(() => true); ve(); setTimeout(() => bangKetQua(ctx, `Tổ ${ctx.doi[k].ten} đoán đúng từ khoá!`), 1200); }
        else ve();
      });
    };
    document.addEventListener("keydown", doanTuKhoa);
    ctx._dongPhim = () => document.removeEventListener("keydown", doanTuKhoa);
    async function choi(k) {
      const doi = luot % ctx.doi.length;
      khung(ctx, `Mảnh số ${k + 1} — tổ ${ctx.doi[doi].ten}`);
      const r = await hoiCau(ctx, ctx.layCau(q => q.loai === "TN"), { nhan: `Tổ <b>${esc(ctx.doi[doi].ten)}</b> trả lời` });
      if (r.dung) { ctx.themDiem(doi, 10); mo[k] = true; }
      luot++;
      if (mo.every(Boolean)) { bangKetQua(ctx, "Đã mở hết mảnh ghép!"); return; }
      ve();
    }
    ve();
  }

  /* ================================================================ 4. ĐUA XE TIẾP SỨC */
  async function duaXe(ctx) {
    if (ctx.cfg.live) await phongCho(ctx, "Đua xe tiếp sức");
    const dich = ctx.cfg.soO || 10; const XE = ["🚗", "🚙", "🏎️", "🚐", "🚕", "🛻"];
    ctx.doi.forEach(d => d.o = 0);
    const ve = (nhan) => {
      khung(ctx, "Đua xe tiếp sức");
      than(ctx).innerHTML = `<div class="dua">${ctx.doi.map((d, k) => `
        <div class="lane" style="--c:${d.mau}"><span class="ten">${esc(d.ten)}</span>
          <div class="track">${Array.from({ length: dich }, (_, i) => `<i class="${i < d.o ? "qua" : ""}"></i>`).join("")}
            <span class="xe" style="left:calc(${Math.min(d.o, dich)} * (100% / ${dich}))">${XE[k % XE.length]}</span></div>
          <span class="co">🏁</span></div>`).join("")}</div>
        <div class="tc-nhan" style="text-align:center;margin-top:14px">${nhan || "Trả lời đúng: tiến 1 ô · Câu Vận dụng cao: tiến 2 ô"}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-cau>Ra câu hỏi <kbd>Enter</kbd></button>
        <button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelector("[data-cau]").onclick = raCau;
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc cuộc đua");
      const ph = e => { if (e.key === "Enter") { document.removeEventListener("keydown", ph); raCau(); } };
      document.addEventListener("keydown", ph);
    };
    async function raCau() {
      const q = ctx.layCau(x => x.loai === "TN");
      const buoc = q.muc === "VDC" ? 2 : 1;
      khung(ctx, "Đua xe tiếp sức");
      await hoiCau(ctx, q, { nhan: `Các tổ cùng trả lời — câu này đi <b>${buoc}</b> ô` });
      if (ctx.dungLai) return;
      if (ctx.cfg.live) {
        let t = null; try { t = await Lop.gv(); } catch (e) {}
        const hs = (t && t.hs) || [];
        const bang = ctx.doi.map((d, k) => {
          const trong = hs.filter(h => (h.to || "").trim().toLowerCase() === d.ten.trim().toLowerCase());
          const dung = trong.filter(h => h.dung).length;
          return { k, n: trong.length, dung };
        });
        bang.forEach(b => {
          if (!b.n) return;
          let di = b.dung > 0 ? buoc : 0;
          if (b.dung === b.n && b.n > 0) di += 1;
          ctx.doi[b.k].o += di; ctx.themDiem(b.k, 10 * di);
        });
        await bangTo(ctx, bang);
      } else {
        const k = await chamDoi(ctx, "Tổ nào trả lời đúng? (có thể bấm nhiều tổ, Enter để tiếp)");
        if (k >= 0) { ctx.doi[k].o += buoc; ctx.themDiem(k, 10 * buoc); }
      }
      const vd = ctx.doi.find(d => d.o >= dich);
      if (vd) { ve(`🏁 ${esc(vd.ten)} về đích!`); setTimeout(() => bangKetQua(ctx, `${vd.ten} về đích trước!`), 1500); return; }
      ve();
    }
    ve();
  }

  function bangTo(ctx, bang) {
    return new Promise(res => {
      than(ctx).innerHTML = `<div class="tc-ket"><h2>Kết quả câu vừa rồi</h2>
        <div class="bxh">${bang.map(b => `<div class="hang" style="--c:${ctx.doi[b.k].mau}"><b>${esc(ctx.doi[b.k].ten)}</b>
          <span class="tc-nhan">${b.dung}/${b.n} bạn trả lời đúng</span>
          <span class="dd">${b.dung === b.n && b.n ? "+2 ô" : b.dung ? "+1 ô" : "đứng yên"}</span></div>`).join("")}</div></div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-ok>Tiếp tục <kbd>Enter</kbd></button></div>`;
      const xong = () => { document.removeEventListener("keydown", ph); res(); };
      ctx.host.querySelector("[data-ok]").onclick = xong;
      const ph = e => { if (e.key === "Enter") xong(); };
      document.addEventListener("keydown", ph);
    });
  }

  /* ================================================================ 5. VÒNG QUAY MAY MẮN */
  async function vongQuay(ctx) {
    const O = [{ t: "10 điểm", d: 10, c: "#3b7bff" }, { t: "20 điểm", d: 20, c: "#13b981" }, { t: "30 điểm", d: 30, c: "#f59e0b" },
    { t: "Nhân đôi", d: "x2", c: "#8b5cf6" }, { t: "Mất lượt", d: 0, c: "#64748b" }, { t: "Câu khó +50", d: 50, c: "#ef4444" },
    { t: "20 điểm", d: 20, c: "#0ea5e9" }, { t: "Đổi tổ", d: "doi", c: "#ec4899" }];
    let luot = 0;
    const ve = (gocEnd, nhan) => {
      khung(ctx, "Vòng quay may mắn");
      const n = O.length, goc = 360 / n;
      than(ctx).innerHTML = `<div class="vq">
        <div class="kim">▼</div>
        <div class="dia" data-dia style="transform:rotate(${gocEnd || 0}deg);background:conic-gradient(${O.map((o, k) => `${o.c} ${k * goc}deg ${(k + 1) * goc}deg`).join(",")})">
          ${O.map((o, k) => `<span style="transform:rotate(${k * goc + goc / 2}deg)"><i>${o.t}</i></span>`).join("")}
        </div></div>
        <div class="tc-nhan" style="text-align:center;margin-top:10px">${nhan || `Lượt của tổ <b>${esc(ctx.doi[luot % ctx.doi.length].ten)}</b>`}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-quay>Quay <kbd>Space</kbd></button>
        ${(ctx.cfg.hs || []).length ? `<button class="btn ghost sm" data-goiten>🎯 Gọi tên ngẫu nhiên</button>` : ""}
        <button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelector("[data-quay]").onclick = quay;
      const gt = ctx.host.querySelector("[data-goiten]"); if (gt) gt.onclick = goiTen;
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc vòng quay");
      ctx.doi.forEach((d, k) => d.luot = (k === luot % ctx.doi.length)); veDiem(ctx);
      const ph = e => { if (e.key === " ") { e.preventDefault(); document.removeEventListener("keydown", ph); quay(); } };
      document.addEventListener("keydown", ph);
      ctx._dongPhim = () => document.removeEventListener("keydown", ph);
    };
    function goiTen() {
      const hs = ctx.cfg.hs || []; let n = 0;
      const el = ctx.host.querySelector(".tc-nhan");
      const t = setInterval(() => { el.innerHTML = `🎯 <b style="font-size:1.5em">${esc(hs[Math.floor(Math.random() * hs.length)])}</b>`; AM.quay(); if (++n > 18) { clearInterval(t); AM.dung(); } }, 90);
    }
    async function quay() {
      const n = O.length, k = Math.floor(Math.random() * n), goc = 360 * 4 + (360 - (k * (360 / n) + (360 / n) / 2));
      const dia = ctx.host.querySelector("[data-dia]");
      if (dia) { dia.style.transition = "transform 2.6s cubic-bezier(.17,.67,.21,1)"; dia.style.transform = `rotate(${goc}deg)`; }
      for (let i = 0; i < 14; i++) { AM.quay(); await sleep(120); }
      await sleep(900);
      const o = O[k]; const doi = luot % ctx.doi.length;
      if (o.d === 0) { ve(0, `😅 Tổ <b>${esc(ctx.doi[doi].ten)}</b> mất lượt!`); luot++; return; }
      if (o.d === "doi") { luot++; ve(0, `🔄 Chuyển sang tổ <b>${esc(ctx.doi[luot % ctx.doi.length].ten)}</b>`); return; }
      const nhan = o.d === "x2" ? 2 : 1, diem = o.d === "x2" ? 20 : o.d;
      const q = ctx.layCau(x => x.loai === "TN" && (o.d === 50 ? ["VD", "VDC"].includes(x.muc) : true)) || ctx.layCau(x => x.loai === "TN");
      khung(ctx, `Vòng quay — ${o.t}`);
      const r = await hoiCau(ctx, q, { nhan: `Tổ <b>${esc(ctx.doi[doi].ten)}</b> trả lời — ô <b>${o.t}</b>` });
      if (r.dung) ctx.themDiem(doi, diem * nhan);
      luot++;
      if (ctx.dungLai) return;
      ve(0);
    }
    ve(0);
  }

  /* ================================================================ 6. BINGO ĐÁP ÁN */
  async function bingo(ctx) {
    const n = 4; // bảng 4x4
    const qs = tron(ctx.cau.filter(q => q.loai === "TLN" && q.da)).slice(0, n * n);
    if (qs.length < n * n) { khung(ctx, "Bingo"); than(ctx).innerHTML = `<div class="tc-nhan">Ngân hàng cần ít nhất ${n * n} câu <b>trả lời ngắn</b> cho phần đã chọn. Thầy cô chọn thêm dạng hoặc bỏ lọc mức độ nhé.</div>`; return; }
    let danh = new Array(n * n).fill(false), daRa = 0;
    const ve = (nhan) => {
      khung(ctx, "Bingo đáp án");
      than(ctx).innerHTML = `<div class="bingo" style="--n:${n}">${qs.map((q, k) => `<div class="o${danh[k] ? " danh" : ""}">${esc(q.da)}</div>`).join("")}</div>
        <div class="tc-nhan" style="text-align:center;margin-top:12px">${nhan || `Đã đọc <b>${daRa}</b>/${qs.length} câu · Học sinh đánh dấu đáp án trên phiếu của mình`}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-cau>Đọc câu tiếp <kbd>Enter</kbd></button>
        <button class="btn ghost sm" data-in>🖨 In phiếu Bingo cho lớp</button>
        <button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelector("[data-cau]").onclick = raCau;
      ctx.host.querySelector("[data-in]").onclick = inPhieu;
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc Bingo");
      const ph = e => { if (e.key === "Enter") { document.removeEventListener("keydown", ph); raCau(); } };
      document.addEventListener("keydown", ph);
    };
    function inPhieu() {
      const soPhieu = ctx.cfg.soPhieu || 12;
      const w = window.open("", "_blank");
      let h = `<!doctype html><html><head><meta charset="utf-8"><title>Phiếu Bingo</title><style>
        body{font-family:Arial,sans-serif;margin:12mm} .p{page-break-inside:avoid;display:inline-block;width:46%;margin:0 1% 8mm;vertical-align:top}
        table{border-collapse:collapse;width:100%} td{border:1.5px solid #000;height:44px;text-align:center;font-size:15px}
        h4{margin:0 0 4px;font-size:14px}</style></head><body>`;
      for (let i = 0; i < soPhieu; i++) {
        const o = tron(qs.map(q => q.da));
        h += `<div class="p"><h4>PHIẾU BINGO — Họ tên: ...................................</h4><table>`;
        for (let r = 0; r < n; r++) { h += "<tr>"; for (let c = 0; c < n; c++) h += `<td>${esc(o[r * n + c])}</td>`; h += "</tr>"; }
        h += `</table></div>`;
      }
      w.document.write(h + "</body></html>"); w.document.close(); setTimeout(() => w.print(), 600);
    }
    async function raCau() {
      const con = qs.map((q, k) => k).filter(k => !danh[k]);
      if (!con.length) { bangKetQua(ctx, "Đã đọc hết câu hỏi"); return; }
      const k = con[Math.floor(Math.random() * con.length)];
      khung(ctx, `Bingo — câu ${daRa + 1}`);
      await hoiCau(ctx, qs[k], { nhan: "Tính kết quả rồi tìm ô có đáp án đó trên phiếu" });
      danh[k] = true; daRa++;
      if (ctx.dungLai) return;
      const ai = await chamDoi(ctx, "Có tổ/bạn nào hô BINGO không?");
      if (ai >= 0) { ctx.themDiem(ai, 50); ve(`🎉 <b>${esc(ctx.doi[ai].ten)}</b> hô Bingo!`); setTimeout(() => bangKetQua(ctx, `${ctx.doi[ai].ten} thắng Bingo!`), 1500); return; }
      ve();
    }
    ve();
  }

  /* ================================================================ 7. ONG TÌM MẬT */
  async function ongTimMat(ctx) {
    const tang = ctx.cfg.soO || 8;
    ctx.doi.forEach(d => d.o = 0);
    const ve = (nhan) => {
      khung(ctx, "Ong tìm mật");
      than(ctx).innerHTML = `<div class="ong">${ctx.doi.map((d, k) => `
        <div class="cot" style="--c:${d.mau}">
          <div class="to">🍯</div>
          ${Array.from({ length: tang }, (_, i) => tang - 1 - i).map(i => `<div class="o ${d.o > i ? "qua" : ""}">${d.o === i ? "🐝" : ""}</div>`).join("")}
          <span class="ten">${esc(d.ten)}</span></div>`).join("")}</div>
        <div class="tc-nhan" style="text-align:center;margin-top:12px">${nhan || "Mỗi câu đúng ong bay lên một tầng · Lên tới hũ mật là thắng"}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-cau>Ra câu hỏi <kbd>Enter</kbd></button><button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelector("[data-cau]").onclick = raCau;
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc trò chơi");
      const ph = e => { if (e.key === "Enter") { document.removeEventListener("keydown", ph); raCau(); } };
      document.addEventListener("keydown", ph);
    };
    async function raCau() {
      khung(ctx, "Ong tìm mật");
      await hoiCau(ctx, ctx.layCau(q => q.loai === "TN"), { nhan: "Các tổ cùng suy nghĩ" });
      if (ctx.dungLai) return;
      const k = await chamDoi(ctx, "Tổ nào trả lời đúng?");
      if (k >= 0) { ctx.doi[k].o++; ctx.themDiem(k, 10); }
      const vd = ctx.doi.find(d => d.o >= tang);
      if (vd) { ve(`🍯 Ong của tổ <b>${esc(vd.ten)}</b> đã tới hũ mật!`); setTimeout(() => bangKetQua(ctx, `${vd.ten} tìm được mật ngọt!`), 1500); return; }
      ve();
    }
    ve();
  }

  /* ================================================================ 8. ĐƯỜNG LÊN ĐỈNH (4 vòng) */
  async function duongLen(ctx) {
    const VONG = [
      { ten: "Khởi động", mo: "Mỗi tổ 4 câu nhanh, mỗi câu 10 điểm", so: 4, diem: 10, giay: 15 },
      { ten: "Vượt chướng ngại vật", mo: "Trả lời để mở mảnh ghép, đoán từ khoá được 40 điểm", so: 4, diem: 15, giay: 25 },
      { ten: "Tăng tốc", mo: "Trả lời càng nhanh điểm càng cao (40 → 10 điểm)", so: 4, diem: 40, giay: 30 },
      { ten: "Về đích", mo: "Mỗi tổ chọn gói 10, 20 hoặc 30 điểm", so: 3, diem: 0, giay: 20 }
    ];
    for (let v = 0; v < VONG.length && !ctx.dungLai; v++) {
      const V = VONG[v];
      await manHinhVong(ctx, `Vòng ${v + 1}: ${V.ten}`, V.mo);
      if (ctx.dungLai) return;
      if (v === 0 || v === 1) {
        for (let i = 0; i < V.so * (v === 0 ? ctx.doi.length : 1) && !ctx.dungLai; i++) {
          const doi = v === 0 ? i % ctx.doi.length : null;
          khung(ctx, `${V.ten} — câu ${i + 1}`);
          const r = await hoiCau(ctx, ctx.layCau(q => q.loai === "TN"), { giay: V.giay, nhan: doi != null ? `Tổ <b>${esc(ctx.doi[doi].ten)}</b>` : "Các tổ cùng trả lời" });
          if (ctx.dungLai) return;
          if (doi != null) { if (r.dung) ctx.themDiem(doi, V.diem); }
          else { const k = await chamDoi(ctx, "Tổ nào trả lời đúng?"); if (k >= 0) ctx.themDiem(k, V.diem); }
        }
        if (v === 1) { const k = await chamDoi(ctx, "Tổ nào đoán đúng từ khoá? (+40 điểm)"); if (k >= 0) ctx.themDiem(k, 40); }
      } else if (v === 2) {
        for (let i = 0; i < V.so && !ctx.dungLai; i++) {
          khung(ctx, `Tăng tốc — câu ${i + 1}`);
          const t0 = Date.now();
          await hoiCau(ctx, ctx.layCau(q => q.loai === "TN" && ["TH", "VD"].includes(q.muc)) || ctx.layCau(q => q.loai === "TN"), { giay: V.giay, nhan: "Trả lời càng nhanh điểm càng cao" });
          if (ctx.dungLai) return;
          const giay = Math.round((Date.now() - t0) / 1000);
          const d = giay <= 8 ? 40 : giay <= 15 ? 30 : giay <= 22 ? 20 : 10;
          const k = await chamDoi(ctx, `Tổ nào trả lời đúng? (${giay}s → ${d} điểm)`);
          if (k >= 0) ctx.themDiem(k, d);
        }
      } else {
        for (let d = 0; d < ctx.doi.length && !ctx.dungLai; d++) {
          const goi = await chonGoi(ctx, ctx.doi[d]);
          for (let i = 0; i < goi.length && !ctx.dungLai; i++) {
            khung(ctx, `Về đích — tổ ${ctx.doi[d].ten}`);
            const muc = goi[i] >= 30 ? "VDC" : goi[i] >= 20 ? "VD" : "TH";
            const r = await hoiCau(ctx, ctx.layCau(q => q.loai === "TN" && q.muc === muc) || ctx.layCau(q => q.loai === "TN"), { giay: V.giay, nhan: `Câu <b>${goi[i]}</b> điểm` });
            if (r.dung) ctx.themDiem(d, goi[i]); else if (r.chon >= 0) ctx.themDiem(d, -goi[i] / 2);
          }
        }
      }
    }
    bangKetQua(ctx, "Chung cuộc");
  }
  function manHinhVong(ctx, ten, mo) {
    return new Promise(res => {
      khung(ctx, ten);
      than(ctx).innerHTML = `<div class="tc-ket"><h2>${esc(ten)}</h2><p style="font-size:1.3em">${esc(mo)}</p></div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-ok>Bắt đầu vòng này <kbd>Enter</kbd></button></div>`;
      const xong = () => { document.removeEventListener("keydown", ph); res(); };
      ctx.host.querySelector("[data-ok]").onclick = xong;
      const ph = e => { if (e.key === "Enter") xong(); };
      document.addEventListener("keydown", ph);
    });
  }
  function chonGoi(ctx, doi) {
    return new Promise(res => {
      khung(ctx, `Về đích — tổ ${doi.ten}`);
      than(ctx).innerHTML = `<div class="tc-ket"><h2>Tổ ${esc(doi.ten)} chọn gói câu hỏi</h2></div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham">
        <button class="btn sm" data-g="10">Gói 10 – 10 – 10</button>
        <button class="btn sm" data-g="20">Gói 20 – 20 – 20</button>
        <button class="btn sm" data-g="30">Gói 30 – 20 – 10</button></div>`;
      duoi(ctx).querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
        const g = +b.dataset.g; res(g === 30 ? [30, 20, 10] : [g, g, g]);
      });
    });
  }

  /* ================================================================ 9. LẬT THẺ GHI NHỚ */
  async function latThe(ctx) {
    const cap = ctx.cfg.soCap || 8;
    const qs = tron(ctx.cau.filter(q => (q.loai === "TLN" && q.da) || q.loai === "TN")).slice(0, cap);
    if (qs.length < 4) { khung(ctx, "Lật thẻ ghi nhớ"); than(ctx).innerHTML = `<div class="tc-nhan">Cần ít nhất 4 câu trong phần đã chọn.</div>`; return; }
    const the = [];
    qs.forEach((q, k) => {
      const dap = q.loai === "TLN" ? q.da : q.pa[0];
      the.push({ id: k, mat: rutGon(q.de), kieu: "de" }); the.push({ id: k, mat: dap, kieu: "da" });
    });
    const bo = tron(the); let lat = [], ghep = new Set(), luot = 0;
    const ve = (nhan) => {
      khung(ctx, "Lật thẻ ghi nhớ");
      than(ctx).innerHTML = `<div class="lt" style="--n:${Math.ceil(Math.sqrt(bo.length))}">
        ${bo.map((t, k) => `<div class="the${ghep.has(t.id) ? " ghep" : lat.includes(k) ? " lat" : ""}" data-k="${k}">
          <span class="sau">${T(t.mat)}</span><span class="truoc">${t.kieu === "de" ? "❓" : "✅"}</span></div>`).join("")}</div>
        <div class="tc-nhan" style="text-align:center;margin-top:10px">${nhan || `Lượt tổ <b>${esc(ctx.doi[luot % ctx.doi.length].ten)}</b> — lật 2 thẻ để ghép câu hỏi với đáp án`}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><span>Ghép đúng: +20 điểm và được đi tiếp</span><button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelectorAll(".the:not(.ghep)").forEach(e => e.onclick = () => chon(+e.dataset.k));
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc trò chơi");
      ctx.doi.forEach((d, k) => d.luot = (k === luot % ctx.doi.length)); veDiem(ctx);
    };
    async function chon(k) {
      if (lat.includes(k) || ghep.has(bo[k].id)) return;
      lat.push(k); ve();
      if (lat.length === 2) {
        const [a, b] = lat.map(i => bo[i]);
        await sleep(900);
        if (a.id === b.id && lat[0] !== lat[1]) {
          ghep.add(a.id); ctx.themDiem(luot % ctx.doi.length, 20); AM.dung();
          lat = [];
          if (ghep.size === qs.length) { bangKetQua(ctx, "Đã ghép hết các cặp!"); return; }
          ve("🎉 Ghép đúng! Tổ này được đi tiếp.");
        } else { AM.sai(); lat = []; luot++; ve("Chưa khớp — chuyển lượt."); }
      }
    }
    ve();
  }
  const rutGon = s => { const t = String(s || "").replace(/\s+/g, " ").trim(); return t.length > 110 ? t.slice(0, 110) + "…" : t; };

  /* ================================================================ 10. TRUY TÌM KHO BÁU */
  async function khoBau(ctx) {
    const chang = ctx.cfg.soChang || 6;
    ctx.doi.forEach(d => d.o = 0);
    const BD = ["🏝️", "🌴", "⛰️", "🌊", "🕳️", "🗿", "💎"];
    const ve = (nhan) => {
      khung(ctx, "Truy tìm kho báu");
      than(ctx).innerHTML = `<div class="kb">
        <div class="duong">${Array.from({ length: chang }, (_, i) => `<div class="chang"><span class="bd">${BD[i % BD.length]}</span><b>${i + 1}</b></div>`).join("")}<div class="chang kho"><span class="bd">🏆</span><b>Kho báu</b></div></div>
        <div class="doiline">${ctx.doi.map(d => `<div class="dd" style="--c:${d.mau};left:calc(${d.o} * (100% / ${chang + 1}) + 1%)">${esc(d.ten)}</div>`).join("")}</div></div>
        <div class="tc-nhan" style="text-align:center;margin-top:14px">${nhan || "Trả lời đúng để qua chặng · Câu sai thì dừng lại một lượt"}</div>`;
      duoi(ctx).innerHTML = `<div class="tc-cham"><button class="btn coral" data-cau>Chặng tiếp theo <kbd>Enter</kbd></button><button class="btn ghost sm" data-ketthuc>Kết thúc</button></div>`;
      ctx.host.querySelector("[data-cau]").onclick = raCau;
      ctx.host.querySelector("[data-ketthuc]").onclick = () => bangKetQua(ctx, "Kết thúc hành trình");
      const ph = e => { if (e.key === "Enter") { document.removeEventListener("keydown", ph); raCau(); } };
      document.addEventListener("keydown", ph);
    };
    let luot = 0;
    async function raCau() {
      const doi = luot % ctx.doi.length;
      khung(ctx, `Kho báu — chặng ${ctx.doi[doi].o + 1}`);
      const r = await hoiCau(ctx, ctx.layCau(q => q.loai === "TN"), { nhan: `Tổ <b>${esc(ctx.doi[doi].ten)}</b> vượt chặng ${ctx.doi[doi].o + 1}` });
      if (ctx.dungLai) return;
      if (r.dung) { ctx.doi[doi].o++; ctx.themDiem(doi, 10 + ctx.doi[doi].o * 5); }
      luot++;
      const vd = ctx.doi.find(d => d.o > chang);
      if (vd) { ve(`🏆 Tổ <b>${esc(vd.ten)}</b> tìm được kho báu!`); setTimeout(() => bangKetQua(ctx, `${vd.ten} tìm được kho báu!`), 1500); return; }
      ve();
    }
    ve();
  }

  /* ---------------------------------------------------------------- danh sách trò chơi */
  const GAMES = [
    { ma: "rungchuong", ten: "Rung chuông vàng", icon: "🔔", mo: "Cả lớp viết đáp án ra bảng con, sai thì ngồi xuống, ai trụ lại cuối cùng thì thắng.", chay: rungChuong, can: "Cả lớp · bảng con" },
    { ma: "trieuphu", ten: "Ai là triệu phú", icon: "💎", mo: "15 câu từ dễ đến khó, có 50:50, hỏi ý kiến lớp và gọi tổ trợ giúp.", chay: trieuPhu, can: "1 bạn chơi chính" },
    { ma: "manhghep", ten: "Lật mảnh ghép", icon: "🧩", mo: "Trả lời đúng mở một mảnh, đoán được từ khoá phía sau thì được điểm lớn.", chay: manhGhep, can: "Chơi theo tổ" },
    { ma: "duaxe", ten: "Đua xe tiếp sức", icon: "🏎️", mo: "Mỗi câu đúng xe của tổ tiến một ô, câu vận dụng cao tiến hai ô.", chay: duaXe, can: "Chơi theo tổ" },
    { ma: "vongquay", ten: "Vòng quay may mắn", icon: "🎡", mo: "Quay trúng ô nào trả lời câu tương ứng; có ô nhân đôi, mất lượt, câu khó.", chay: vongQuay, can: "Theo tổ · gọi tên ngẫu nhiên" },
    { ma: "bingo", ten: "Bingo đáp án", icon: "🎱", mo: "In phiếu cho cả lớp, thầy cô đọc câu, học sinh tính rồi đánh dấu ô đáp án.", chay: bingo, can: "Cần câu trả lời ngắn" },
    { ma: "ongtimmat", ten: "Ong tìm mật", icon: "🐝", mo: "Mỗi câu đúng ong bay lên một tầng, tổ nào tới hũ mật trước thì thắng.", chay: ongTimMat, can: "Chơi theo tổ" },
    { ma: "duonglen", ten: "Đường lên đỉnh", icon: "🏔️", mo: "Bốn vòng: Khởi động, Vượt chướng ngại vật, Tăng tốc, Về đích chọn gói điểm.", chay: duongLen, can: "Theo tổ · 1 tiết" },
    { ma: "latthe", ten: "Lật thẻ ghi nhớ", icon: "🃏", mo: "Lật hai thẻ để ghép câu hỏi với đáp án đúng, ghép trúng thì được đi tiếp.", chay: latThe, can: "Chơi theo tổ" },
    { ma: "khobau", ten: "Truy tìm kho báu", icon: "🗺️", mo: "Vượt từng chặng trên bản đồ, càng về cuối điểm mỗi chặng càng cao.", chay: khoBau, can: "Chơi theo tổ" }
  ];

  async function batDau(ma, cfg, host, onThoat) {
    const g = GAMES.find(x => x.ma === ma); if (!g) return;
    AM.on = cfg.am !== false;
    const ctx = taoCtx(cfg, host); ctx.ma = ma;
    ctx.thoat = () => { ctx.dungLai = true; if (cfg.live && window.Lop && Lop.ma) Lop.dong().catch(() => {}); if (ctx._thaoPhim) ctx._thaoPhim(); if (ctx._dongPhim) ctx._dongPhim(); onThoat && onThoat(); };
    ctx.ketThuc = () => bangKetQua(ctx, "Kết thúc trò chơi");
    ctx.choiLai = () => { if (ctx._dongPhim) ctx._dongPhim(); batDau(ma, cfg, host, onThoat); };
    const esc2 = e => { if (e.key === "Escape") { ctx.thoat(); document.removeEventListener("keydown", esc2); } };
    document.addEventListener("keydown", esc2);
    try { await g.chay(ctx); } catch (e) { console.error(e); }
  }

  G.TroChoi = { GAMES, batDau, AM };
})(window);
