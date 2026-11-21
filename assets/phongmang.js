/* phongmang.js — Phòng thi qua Internet (giống Kahoot): học sinh dùng 4G hay wifi nào cũng vào được, không cần chung mạng với máy thầy.
   Máy thầy giữ toàn bộ trạng thái phòng (thay cho maychu.py); máy thầy và điện thoại học sinh nhắn qua một máy chủ trung gian MQTT công cộng
   (kết nối wss:// bảo mật). Chỉ gửi đi: tên học sinh trong danh sách lớp, đề/phương án đang hỏi, đáp án các em chọn và điểm.
   Phòng tự xoá khi thầy bấm thoát.
   - PhongMang.lop : các hàm giống Lop (moPhong, url, gv, raCau, khoa, loai, cuu, themDiem, dong) — gắn vào trang trò chơi.
   - PhongMang.hs(ma) : { api(duongDan, than) } — giả lập các API của maychu.py cho trang hs.html. */
(function (G) {
  "use strict";
  const MAY_MAC_DINH = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt", "wss://test.mosquitto.org:8081/mqtt"];
  function dsMay() {
    try { const t = JSON.parse(localStorage.getItem("hcth-mq") || "null"); if (Array.isArray(t) && t.length) return t; } catch (e) {}
    const c = G.SITE && SITE.troChoi && SITE.troChoi.mayChu; return Array.isArray(c) && c.length ? c : MAY_MAC_DINH;
  }
  const GOC = "hcth-ant/v1/";
  const enc = new TextEncoder(), dec = new TextDecoder();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ================================================================ MQTT 3.1.1 tối giản qua WebSocket (QoS 0) */
  function MQ(url) {
    const me = { url, ok: false, subs: new Map(), cho: [], dong: false, lai: [], trangThai: () => {} };
    let ws = null, buf = new Uint8Array(0), pid = 1, ping = null, thuLai = 0, hen = null;
    const vlen = n => { const o = []; do { let b = n % 128; n = Math.floor(n / 128); if (n > 0) b |= 128; o.push(b); } while (n > 0); return o; };
    const chuoi = s => { const b = enc.encode(s); const o = new Uint8Array(2 + b.length); o[0] = b.length >> 8; o[1] = b.length & 255; o.set(b, 2); return o; };
    const noi = arrs => { const L = arrs.reduce((s, a) => s + a.length, 0); const o = new Uint8Array(L); let i = 0; arrs.forEach(a => { o.set(a, i); i += a.length; }); return o; };
    const goi = (dau, than) => noi([Uint8Array.from([dau, ...vlen(than.length)]), than]);
    function gui(pkt) { if (ws && ws.readyState === 1 && me.ok) ws.send(pkt); else me.cho.push(pkt); }
    function khop(loc, t) { const a = loc.split("/"), b = t.split("/"); for (let i = 0; i < a.length; i++) { if (a[i] === "#") return true; if (a[i] !== "+" && a[i] !== b[i]) return false; } return a.length === b.length; }
    function docGoi() {
      for (;;) {
        if (buf.length < 2) return;
        let mul = 1, L = 0, i = 1, b;
        do { if (i >= buf.length) return; b = buf[i++]; L += (b & 127) * mul; mul *= 128; } while (b & 128);
        if (buf.length < i + L) return;
        const dau = buf[0], than = buf.subarray(i, i + L); buf = buf.slice(i + L);
        const loai = dau >> 4;
        if (loai === 2) { // CONNACK
          if (than[1] === 0) { me.ok = true; thuLai = 0; me.trangThai("on"); if (me._ok) me._ok(); dangKyLai(); const c = me.cho; me.cho = []; c.forEach(p => ws.send(p)); me.lai.forEach(f => { try { f(); } catch (e) {} }); }
          else if (me._loi) me._loi(new Error("Máy chủ trung gian từ chối kết nối (mã " + than[1] + ")."));
        } else if (loai === 3) { // PUBLISH
          const qos = (dau >> 1) & 3; const tl = (than[0] << 8) | than[1]; const topic = dec.decode(than.subarray(2, 2 + tl));
          let j = 2 + tl; if (qos > 0) { const id = (than[j] << 8) | than[j + 1]; j += 2; if (qos === 1) gui(Uint8Array.from([0x40, 2, id >> 8, id & 255])); }
          const txt = dec.decode(than.subarray(j)); let o = null; if (txt) { try { o = JSON.parse(txt); } catch (e) { o = null; } }
          me.subs.forEach((fs, loc) => { if (khop(loc, topic)) fs.forEach(f => { try { f(o, topic); } catch (e) { console.error(e); } }); });
        }
      }
    }
    function dangKy(loc) { const id = pid++ & 0xffff || 1; gui(goi(0x82, noi([Uint8Array.from([id >> 8, id & 255]), chuoi(loc), Uint8Array.from([0])]))); }
    function dangKyLai() { me.subs.forEach((_, loc) => dangKy(loc)); }
    function moi() {
      return new Promise((ok, loi) => {
        me._ok = ok; me._loi = loi;
        let sock; try { sock = new WebSocket(url, ["mqtt"]); } catch (e) { loi(e); return; }
        ws = sock; sock.binaryType = "arraybuffer";
        let xong = false;
        const hong = () => { // gọi một lần cho mỗi lần thử, dù trình duyệt báo lỗi hay báo đóng
          if (xong) return; xong = true;
          clearTimeout(chot); const daOk = me.ok; me.ok = false; buf = new Uint8Array(0);
          if (!daOk && me._loi) { const l = me._loi; me._loi = null; l(new Error("Không mở được kết nối tới máy chủ trung gian.")); }
          if (me.dong) return; me.trangThai("mat");
          if (daOk || me.daTungOk) { me.daTungOk = true; clearTimeout(hen); hen = setTimeout(() => moi().catch(() => {}), Math.min(8000, 800 * Math.pow(1.6, thuLai++))); }
        };
        const chot = setTimeout(() => { if (!me.ok) { hong(); try { sock.close(); } catch (e) {} } }, 7000);
        sock.onopen = () => {
          const cid = "hcth" + Math.random().toString(36).slice(2, 12);
          const bien = noi([chuoi("MQTT"), Uint8Array.from([4, 0x02, 0, 45])]); // clean session, keepalive 45 s
          sock.send(goi(0x10, noi([bien, chuoi(cid)])));
        };
        sock.onmessage = e => { if (ws !== sock) return; const d = new Uint8Array(e.data); buf = buf.length ? noi([buf, d]) : d; docGoi(); };
        sock.onerror = () => { hong(); setTimeout(() => { try { sock.close(); } catch (e) {} }, 0); };
        sock.onclose = hong;
      }).then(() => { me.daTungOk = true; clearInterval(ping); ping = setInterval(() => { if (ws && ws.readyState === 1 && me.ok) ws.send(Uint8Array.from([0xC0, 0])); }, 20000); });
    }
    me.ket = moi;
    me.sub = (loc, f) => { if (!me.subs.has(loc)) { me.subs.set(loc, []); if (me.ok) dangKy(loc); } me.subs.get(loc).push(f); };
    me.unsub = loc => { me.subs.delete(loc); };
    me.pub = (topic, o, giu) => { const p = o == null ? new Uint8Array(0) : enc.encode(JSON.stringify(o)); gui(goi(0x30 | (giu ? 1 : 0), noi([chuoi(topic), p]))); };
    me.dongLai = () => { me.dong = true; clearInterval(ping); clearTimeout(hen); try { if (ws && ws.readyState === 1) ws.send(Uint8Array.from([0xE0, 0])); ws && ws.close(); } catch (e) {} };
    me.xa = () => new Promise(r => { // chờ gửi hết rồi đóng
      const t0 = Date.now(); (function c() { if (!ws || ws.bufferedAmount === 0 || Date.now() - t0 > 1500) { me.dongLai(); r(); } else setTimeout(c, 60); })();
    });
    return me;
  }
  async function ketNoi(chiSo, baoTT) {
    const ds = dsMay(); const thu = chiSo != null ? [chiSo] : ds.map((_, i) => i);
    let loiCuoi = null;
    for (const i of thu) {
      const url = ds[i] || ds[0]; const c = MQ(url); if (baoTT) c.trangThai = baoTT;
      try { await c.ket(); c.chiSo = ds[i] ? i : 0; return c; } catch (e) { loiCuoi = e; c.dong = true; }
    }
    throw new Error("Không kết nối được máy chủ trung gian qua Internet" + (loiCuoi ? " (" + loiCuoi.message + ")" : "") + ". Có thể wifi trường chặn — thầy cô thử phát 4G từ điện thoại cho máy chiếu.");
  }
  const khongDau = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/\s+/g, " ").trim();
  function goc() {
    const c = G.SITE && (SITE.diaChiWeb || (SITE.troChoi && SITE.troChoi.diaChi));
    if (/^https:/.test(location.protocol)) return location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
    return c || "https://hieuant2812.github.io/hoc-cung-thay-hieu/";
  }

  /* ================================================================ MÁY THẦY: giữ phòng */
  const P = { c: null, ma: null, phong: null, hen: 0, nhip: null, ttMang: "" };
  function tomtat(cho_gv) {
    const p = P.phong; const hs = Object.values(p.hs);
    const o = { ma: p.ma, tro: p.tro, trangthai: p.trangthai, so: p.so, ban: 0, sohs: hs.length, con: hs.filter(h => h.con).length };
    if (cho_gv) {
      o.hs = Object.entries(p.hs).map(([id, h]) => ({ id, ten: h.ten, to: h.to, diem: h.diem, con: h.con, chon: h.traloi, dung: h.dung, giay: h.giay })).sort((a, b) => b.diem - a.diem);
      if (p.cau) {
        const dem = {}; hs.forEach(h => { if (h.traloi != null) dem[h.traloi] = (dem[h.traloi] || 0) + 1; });
        o.dem = dem; o.datl = hs.filter(h => h.traloi != null).length;
        o.cau = { so: p.cau.so, dapan: p.cau.dapan, mo: p.cau.mo, hien: p.cau.hien, n: p.cau.pa.length };
      }
      o.mang = P.ttMang;
    }
    return o;
  }
  function banTin() { // gửi cho điện thoại học sinh (không có đáp án khi câu còn mở)
    const p = P.phong; const o = tomtat(false); o.luc = Date.now();
    o.hs = {}; Object.entries(p.hs).forEach(([id, h]) => { o.hs[id] = [h.diem, h.con ? 1 : 0, h.traloi, h.dung == null ? null : h.dung ? 1 : 0]; });
    if (p.cau && (p.cau.mo || p.cau.hien)) {
      const c = p.cau; o.cau = { so: c.so, loai: c.loai, n: c.pa.length, pa: c.pa, de: c.guiDe ? c.de : "", mo: c.mo };
      if (c.hien) o.cau.dapan = c.dapan;
    }
    return o;
  }
  function phat(ngay) {
    if (!P.c || !P.phong) return;
    const f = () => { P.hen = 0; if (P.c && P.phong) P.c.pub(GOC + P.ma + "/tt", banTin(), true); };
    if (ngay) { clearTimeout(P.hen); f(); } else if (!P.hen) P.hen = setTimeout(f, 250);
  }
  function phatDS() {
    const p = P.phong; const da = new Set(Object.values(p.hs).map(h => khongDau(h.ten)));
    P.c.pub(GOC + P.ma + "/ds", { ma: p.ma, tro: p.tro, ds: p.ds.map(t => ({ ten: t.ten, to: t.to || "", roi: da.has(khongDau(t.ten)) })) }, true);
  }
  function nhanVao(o) {
    const p = P.phong; if (!o || !o.rid) return;
    const tl = r => P.c.pub(GOC + P.ma + "/tl/" + String(o.rid).replace(/[^\w-]/g, ""), r, false);
    const ten = String(o.ten || "").trim(), kd = khongDau(ten);
    const t = p.ds.find(x => khongDau(x.ten) === kd);
    if (!t) return tl({ loi: "Tên này không có trong danh sách lớp." });
    const cu = Object.entries(p.hs).find(([, h]) => khongDau(h.ten) === kd);
    if (cu) return phat(true), tl({ id: cu[0], ten: cu[1].ten, to: cu[1].to, lai: true });
    const id = String(Date.now() % 1e7) + String(Math.floor(Math.random() * 900 + 100));
    p.hs[id] = { ten: t.ten, to: t.to || "", diem: 0, con: true, traloi: null, dung: null, giay: null };
    phat(true); phatDS(); tl({ id, ten: t.ten, to: t.to || "" });
  }
  function nhanTraLoi(o) {
    const p = P.phong; if (!o) return; const h = p.hs[String(o.id)], c = p.cau;
    if (!h || !c || !c.mo || !h.con || h.traloi != null) { phat(); return; }
    if (o.so != null && +o.so !== c.so) return;
    const chon = +o.chon; if (!(chon >= 0 && chon < Math.max(1, c.pa.length || 4))) return;
    h.traloi = chon; h.giay = Math.round((Date.now() - c.batdau) / 100) / 10;
    h.dung = c.dapan != null ? String(chon) === String(c.dapan) : null;
    if (h.dung) { const nhanh = Math.max(0, 1 - h.giay / Math.max(1, c.giay)); h.diem += Math.floor(c.diem * (0.6 + 0.4 * nhanh)); }
    phat();
  }
  const lop = {
    ma: null, dc: null, trucTuyen: true,
    async kiemTra() { return true; },
    async moPhong(ds, tro) {
      ds = (ds || []).map(t => typeof t === "string" ? { ten: t.trim(), to: "" } : { ten: String(t.ten || "").trim(), to: String(t.to || "").trim() }).filter(t => t.ten);
      if (!ds.length) throw new Error("Danh sách lớp đang trống.");
      if (P.c) { try { await lop.dong(); } catch (e) {} }
      const c = await ketNoi(null, s => { P.ttMang = s; });
      P.c = c; P.ttMang = "on";
      const ma = String(c.chiSo) + String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      P.ma = lop.ma = ma;
      P.phong = { ma, tro: tro || "", ds, hs: {}, cau: null, so: 0, trangthai: "cho" };
      c.sub(GOC + ma + "/vao", nhanVao);
      c.sub(GOC + ma + "/tra", nhanTraLoi);
      c.lai.push(() => { phatDS(); phat(true); }); // nối lại mạng → gửi lại trạng thái
      phatDS(); phat(true);
      clearInterval(P.nhip); P.nhip = setInterval(() => phat(true), 8000);
      return { ma };
    },
    url() { return P.ma ? goc() + "hs.html?p=" + P.ma : ""; },
    urlNgan() { return goc().replace(/^https?:\/\//, "") + "hs.html"; },
    gv() { if (!P.phong) return Promise.reject(new Error("Phòng thi đã đóng.")); return Promise.resolve(tomtat(true)); },
    raCau(o) {
      const p = P.phong; if (!p) return Promise.reject(new Error("Phòng thi đã đóng."));
      p.so += 1; const giay = parseInt(o.giay) || 30;
      p.cau = { so: p.so, de: o.de || "", guiDe: o.guiDe !== false, pa: o.pa || [], loai: o.loai || "TN", dapan: o.dapan, giay, diem: parseInt(o.diem) || 10, batdau: Date.now(), mo: true, hien: false };
      Object.values(p.hs).forEach(h => { h.traloi = null; h.dung = null; h.giay = null; });
      p.trangthai = "dang-hoi"; phat(true);
      return Promise.resolve({ ok: true, so: p.so });
    },
    khoa() { const p = P.phong; if (!p) return Promise.reject(new Error("Phòng thi đã đóng.")); if (p.cau) { p.cau.mo = false; p.cau.hien = true; } p.trangthai = "da-khoa"; phat(true); return Promise.resolve(tomtat(true)); },
    loai() { const p = P.phong; let n = 0; Object.values(p.hs).forEach(h => { if (h.con && h.dung !== true) { h.con = false; n++; } }); phat(true); return Promise.resolve({ ok: true, loai: n, con: Object.values(p.hs).filter(h => h.con).length }); },
    cuu() { const p = P.phong; Object.values(p.hs).forEach(h => { h.con = true; }); phat(true); return Promise.resolve({ ok: true, con: Object.keys(p.hs).length }); },
    themDiem(id, diem) { const h = P.phong && P.phong.hs[String(id)]; if (h) { h.diem += parseInt(diem) || 0; phat(); } return Promise.resolve({ ok: true }); },
    async dong() {
      const c = P.c, ma = P.ma; clearInterval(P.nhip); P.nhip = null; P.phong = null; P.ma = lop.ma = null; P.c = null;
      if (c && ma) { c.pub(GOC + ma + "/tt", { dong: true, luc: Date.now() }, false); c.pub(GOC + ma + "/tt", null, true); c.pub(GOC + ma + "/ds", null, true); await c.xa(); }
      return { ok: true };
    }
  };

  /* ================================================================ ĐIỆN THOẠI HỌC SINH */
  function hs(ma) {
    ma = String(ma || "").replace(/\D/g, "");
    const S = { c: null, ds: null, tt: null, dong: false, cho: [], traLoi: null, mang: "" };
    const R = GOC + ma;
    let sanSang = null;
    function batDau() {
      if (sanSang) return sanSang;
      sanSang = ketNoi(+ma[0] || 0, s => { S.mang = s; }).then(c => {
        S.c = c;
        c.sub(R + "/ds", o => { S.ds = o; });
        c.sub(R + "/tt", o => { if (o && o.dong) { S.dong = true; return; } if (o && o.luc) { S.tt = o; S.dong = false; S.nhan = Date.now(); guiLaiNeuCan(); } });
        return c;
      });
      return sanSang;
    }
    async function cho(f, ms, loi) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = f(); if (v) return v; await sleep(120); } throw new Error(loi); }
    function guiLaiNeuCan() {
      const a = S.traLoi, t = S.tt; if (!a || !t) return;
      const toi = t.hs && t.hs[a.id];
      if (!t.cau || t.cau.so !== a.so || !t.cau.mo || (toi && toi[2] != null)) { if (!t.cau || t.cau.so !== a.so || (toi && toi[2] != null)) S.traLoi = null; return; }
      if (Date.now() - a.luc > 2500 && a.lan < 5) { a.lan++; a.luc = Date.now(); S.c.pub(R + "/tra", { id: a.id, chon: a.chon, so: a.so }, false); }
    }
    async function api(du, than) {
      if (!/^\d{6}$/.test(ma)) throw new Error("Mã phòng phải gồm 6 chữ số.");
      await batDau().catch(e => { sanSang = null; throw e; });
      const path = du.split("?")[0]; const q = new URLSearchParams(du.split("?")[1] || "");
      if (path === "/api/danh-sach") {
        const d = await cho(() => S.ds, 9000, "Không tìm thấy phòng thi " + ma + ". Em kiểm tra lại mã phòng trên màn chiếu nhé.");
        return { ma, tro: d.tro, ds: d.ds || [] };
      }
      if (path === "/api/vao") {
        const rid = Math.random().toString(36).slice(2, 10);
        let tl = null; S.c.sub(R + "/tl/" + rid, o => { tl = o; });
        const gui = () => S.c.pub(R + "/vao", { rid, ten: than.ten }, false);
        gui(); let lan = 0;
        const r = await cho(() => { if (!tl && ++lan % 35 === 0) gui(); return tl; }, 12000, "Máy thầy cô chưa phản hồi. Em thử lại sau ít giây nhé.");
        S.c.unsub(R + "/tl/" + rid);
        if (r.loi) throw new Error(r.loi);
        S.vaoLuc = Date.now();
        return r;
      }
      if (path === "/api/trang-thai") {
        const t = await cho(() => S.tt, 9000, "Chưa nhận được tín hiệu từ máy thầy cô. Em chờ một chút hoặc quét lại mã QR.");
        if (S.dong) throw new Error("Phòng thi đã đóng. Cảm ơn em đã tham gia!");
        if (Date.now() - t.luc > 40000 && Date.now() - (S.nhan || 0) > 25000) throw new Error("Đang chờ tín hiệu từ máy thầy cô…" + (S.mang === "mat" ? " (điện thoại của em vừa mất mạng, đang nối lại)" : ""));
        const id = q.get("id"); const h = t.hs && t.hs[id];
        const o = { ma, tro: t.tro, trangthai: t.trangthai, so: t.so, sohs: t.sohs, con: t.con };
        o.toi = h ? { diem: h[0], con: !!h[1], chon: h[2], dung: h[3] == null ? null : !!h[3] } : (Date.now() - (S.vaoLuc || 0) < 15000 ? { diem: 0, con: true, chon: null, dung: null } : null);
        if (t.cau && (t.cau.mo || t.cau.dapan != null)) o.cau = t.cau;
        return o;
      }
      if (path === "/api/tra-loi") {
        const t = S.tt; if (!t || !t.cau || !t.cau.mo) throw new Error("Câu hỏi đã khoá.");
        S.traLoi = { id: than.id, chon: than.chon, so: t.cau.so, luc: Date.now(), lan: 0 };
        S.c.pub(R + "/tra", { id: than.id, chon: than.chon, so: t.cau.so }, false);
        return { ok: true };
      }
      throw new Error("Không có đường dẫn này.");
    }
    return { api, ma, mang: () => S.mang };
  }

  /* gắn các hàm phòng trực tuyến vào đối tượng Lop của trang trò chơi (giữ veQR, docFile…) */
  let banCu = null;
  function ganVao(L) {
    if (!banCu) { banCu = {}; ["moPhong", "url", "gv", "raCau", "khoa", "loai", "cuu", "themDiem", "dong", "kiemTra"].forEach(k => banCu[k] = L[k]); }
    ["moPhong", "url", "urlNgan", "gv", "raCau", "khoa", "loai", "cuu", "themDiem", "dong"].forEach(k => L[k] = lop[k]);
    L.trucTuyen = true;
    Object.defineProperty(L, "ma", { get: () => P.ma, set() {}, configurable: true, enumerable: true });
  }
  function boGan(L) {
    if (!banCu) return; delete L.ma; L.ma = null; Object.assign(L, banCu); L.trucTuyen = false; delete L.urlNgan;
  }
  G.PhongMang = { lop, hs, MQ, dsMay, ganVao, boGan };
})(window);
