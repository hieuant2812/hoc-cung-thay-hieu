/* nhd/gen.js — ma trận, gợi ý tự động, sinh đề (trộn từ đề gốc hoặc nhiều đề khác số liệu) */
(function (G) {
  "use strict";
  const NHD = G.NHD = G.NHD || {};
  const { rng, hash, shuffle } = NHD;
  const LOAI = ["TN", "DS", "TLN"];
  const MUC = ["NB", "TH", "VD", "VDC"];

  /* điểm theo cấu trúc 2025 */
  function diem(mon) { return { TN: .25, DS: 1, TLN: /^To[aá]n/i.test(mon || "") ? .5 : .25 }; }
  function cauTrucChuan(mon) { return /^To[aá]n/i.test(mon || "") ? { TN: 12, DS: 4, TLN: 6 } : { TN: 18, DS: 4, TLN: 6 }; }

  /* gom nhóm câu: pool["C1-B1-D01|TN|NB"] = [q...] ; info dạng */
  function buildIndex(questions, dangNames) {
    const pool = {}, dang = {};
    questions.forEach(q => {
      const k = q.dkey + "|" + q.loai + "|" + q.muc; (pool[k] = pool[k] || []).push(q);
      const d = dang[q.dkey] = dang[q.dkey] || { dkey: q.dkey, chuong: q.chuong, bai: q.bai, so: q.dangSo, ten: (dangNames || {})[q.dkey] || "", n: 0, c: {} };
      d.n++; d.c[q.loai + "|" + q.muc] = (d.c[q.loai + "|" + q.muc] || 0) + 1;
    });
    const list = Object.values(dang).sort((a, b) => a.chuong - b.chuong || a.bai - b.bai || a.so - b.so);
    const levels = MUC.filter(m => questions.some(q => q.muc === m));
    return { pool, dang, list, levels };
  }

  /* chia số nguyên theo tỉ lệ (phần dư lớn nhất) */
  function apportion(total, weights) {
    const s = weights.reduce((a, b) => a + b, 0) || 1;
    const raw = weights.map(w => total * w / s), fl = raw.map(Math.floor);
    let rest = total - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { fl[i]++; rest--; } });
    return fl;
  }

  /* Gợi ý ma trận: scope = danh sách dkey được chọn; ct = {TN,DS,TLN}; pct = {NB,TH,VD,VDC} */
  function suggest(idx, scope, ct, pct, seed) {
    const R = rng(hash("goi-y|" + seed));
    const lv = idx.levels;
    const total = ct.TN + ct.DS + ct.TLN;
    const nLv = apportion(total, lv.map(m => +pct[m] || 0));
    const seq = []; lv.forEach((m, i) => { for (let k = 0; k < nLv[i]; k++) seq.push(m); });
    const asg = { TN: seq.slice(0, ct.TN), TLN: seq.slice(seq.length - ct.TLN), DS: seq.slice(ct.TN, seq.length - ct.TLN) };
    // xếp dạng xen kẽ theo chương để rải đều
    const byCh = {}; scope.forEach(k => { const d = idx.dang[k]; if (d) (byCh[d.chuong] = byCh[d.chuong] || []).push(d); });
    const chs = Object.keys(byCh).sort((a, b) => a - b).map(c => shuffle(byCh[c], R));
    const order = []; for (let r = 0; order.length < scope.length && r < 999; r++) chs.forEach(arr => { if (arr[r]) order.push(arr[r]); });
    const M = {}; const used = {}; order.forEach(d => used[d.dkey] = 0);
    const can = (d, L, m) => (d.c[L + "|" + m] || 0) > ((M[d.dkey] && M[d.dkey][L] && M[d.dkey][L][m]) || 0);
    let rot = 0; const short = [];
    ["TLN", "DS", "TN"].forEach(L => {
      asg[L].forEach(m => {
        let best = null;
        for (let j = 0; j < order.length; j++) {
          const d = order[(j + rot) % order.length];
          if (!can(d, L, m)) continue;
          if (!best || used[d.dkey] < used[best.dkey]) best = d;
        }
        // không còn câu đúng mức này: lùi xuống mức gần nhất
        let mm = m;
        if (!best) { for (const alt of [...lv].sort((a, b) => Math.abs(lv.indexOf(a) - lv.indexOf(m)) - Math.abs(lv.indexOf(b) - lv.indexOf(m)))) { for (const d of order) if (can(d, L, alt) && (!best || used[d.dkey] < used[best.dkey])) best = d; if (best) { mm = alt; break; } } }
        if (!best) { short.push(L + " " + m); return; }
        M[best.dkey] = M[best.dkey] || {}; M[best.dkey][L] = M[best.dkey][L] || {};
        M[best.dkey][L][mm] = (M[best.dkey][L][mm] || 0) + 1; used[best.dkey]++; rot++;
      });
    });
    return { M, short };
  }

  /* tổng hợp ma trận */
  function totals(M, mon) {
    const t = { TN: 0, DS: 0, TLN: 0, lv: {}, cells: 0 }; const w = diem(mon);
    Object.values(M).forEach(byL => LOAI.forEach(L => Object.entries((byL || {})[L] || {}).forEach(([m, n]) => { n = +n || 0; t[L] += n; t.lv[m] = (t.lv[m] || 0) + n; })));
    t.n = t.TN + t.DS + t.TLN;
    t.raw = t.TN * w.TN + t.DS * w.DS + t.TLN * w.TLN;
    return t;
  }

  /* danh sách "ô" (slot) theo thứ tự: phần → chương → bài → dạng → mức */
  function slotsOf(M, idx) {
    const slots = [];
    LOAI.forEach(L => idx.list.forEach(d => { const c = (M[d.dkey] || {})[L] || {}; MUC.forEach(m => { for (let k = 0; k < (+c[m] || 0); k++) slots.push({ loai: L, dkey: d.dkey, muc: m }); }); }));
    return slots;
  }

  /* Sinh đề.
     opt: {mode:"goc"|"khac", soMa, mas:[...], seed, tronCau, tronY, uuTienMoi, used:Set(id)} */
  function generate(M, idx, opt) {
    const slots = slotsOf(M, idx);
    const R = rng(hash("sinh|" + opt.seed));
    const short = [];
    // hàng đợi câu cho từng loại ô: ưu tiên câu chưa dùng
    const queues = {};
    const queue = key => {
      if (!queues[key]) {
        const all = shuffle(idx.pool[key] || [], R);
        queues[key] = { list: opt.uuTienMoi && opt.used ? all.filter(q => !opt.used.has(q.id)).concat(all.filter(q => opt.used.has(q.id))) : all, i: 0 };
      }
      return queues[key];
    };
    const take = (s, taken) => {
      const Q = queue(s.dkey + "|" + s.loai + "|" + s.muc);
      for (let t = 0; t < Q.list.length; t++) { const q = Q.list[(Q.i + t) % Q.list.length]; if (!taken.has(q.id)) { Q.i = (Q.i + t + 1) % Q.list.length; taken.add(q.id); return q; } }
      return null;
    };
    const versions = [];
    let basePick = null;
    if (opt.mode === "goc") {
      const taken = new Set(); basePick = slots.map(s => { const q = take(s, taken); if (!q) short.push(s); return q; });
    }
    const globalTaken = new Set();
    opt.mas.forEach((ma, v) => {
      const Rv = rng(hash("ma|" + ma + "|" + opt.seed));
      let pick;
      if (opt.mode === "goc") pick = basePick;
      else {
        const taken = new Set();
        pick = slots.map(s => { // tránh trùng giữa các mã nếu ngân hàng còn đủ
          const Q = queue(s.dkey + "|" + s.loai + "|" + s.muc);
          let q = null;
          for (let t = 0; t < Q.list.length; t++) { const c = Q.list[(Q.i + t) % Q.list.length]; if (!taken.has(c.id) && !globalTaken.has(c.id)) { q = c; Q.i = (Q.i + t + 1) % Q.list.length; break; } }
          if (!q) q = take(s, taken); else taken.add(q.id);
          if (q) globalTaken.add(q.id); else short.push(s);
          return q;
        });
      }
      const perm = {}; const ord = [];
      LOAI.forEach(L => { const ids = slots.map((s, i) => s.loai === L ? i : -1).filter(i => i >= 0); perm[L] = opt.tronCau ? shuffle(ids, Rv) : ids; });
      slots.forEach((s, i) => ord[i] = s.loai === "TN" ? shuffle([0, 1, 2, 3], Rv) : s.loai === "DS" && opt.tronY ? shuffle([0, 1, 2, 3], Rv) : [0, 1, 2, 3]);
      versions.push({ ma: String(ma), pick, perm, ord });
    });
    return { slots, basePick, versions, mode: opt.mode, short };
  }
  /* các câu của một mã theo phần: [{q, order, slot}] */
  function partsOf(ex, v) {
    const V = ex.versions[v]; const out = {};
    LOAI.forEach(L => out[L] = V.perm[L].map(i => ({ q: V.pick[i], order: V.ord[i], slot: i })).filter(x => x.q));
    return out;
  }
  function baseParts(ex) {
    const out = {}; LOAI.forEach(L => out[L] = ex.slots.map((s, i) => s.loai === L ? { q: ex.basePick[i], order: [0, 1, 2, 3], slot: i } : null).filter(x => x && x.q)); return out;
  }
  /* đổi câu ở ô slot (của mã v, hoặc đề gốc khi mode "goc") */
  function swap(ex, idx, v, slot, seed) {
    const s = ex.slots[slot]; const list = idx.pool[s.dkey + "|" + s.loai + "|" + s.muc] || [];
    const pickArr = ex.mode === "goc" ? ex.basePick : ex.versions[v].pick;
    const inUse = new Set(); ex.versions.forEach(V => V.pick.forEach(q => q && inUse.add(q.id)));
    const cand = list.filter(q => !inUse.has(q.id)); const cand2 = cand.length ? cand : list.filter(q => q.id !== (pickArr[slot] || {}).id);
    if (!cand2.length) return false;
    pickArr[slot] = cand2[Math.floor(rng(hash("swap|" + seed + "|" + slot + "|" + Date.now()))() * cand2.length)];
    return true;
  }
  function keys(ex, v) { const P = partsOf(ex, v); const o = {}; LOAI.forEach(L => o[L] = P[L].map(NHD.keyOf)); return o; }

  /* mã đề */
  function makeMas(n, start, kieu, seed) {
    if (kieu === "ngaunhien") { const R = rng(hash("ma|" + seed)); const s = new Set(); while (s.size < n) s.add(String(100 + Math.floor(R() * 900))); return [...s]; }
    const a = []; for (let i = 0; i < n; i++) a.push(String((+start || 101) + i).padStart(String(start || "101").length, "0")); return a;
  }

  NHD.Gen = { LOAI, MUC, diem, cauTrucChuan, buildIndex, suggest, totals, slotsOf, generate, partsOf, baseParts, swap, keys, makeMas, apportion };
})(window);
