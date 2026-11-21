/* sw.js — chạy ngoại tuyến (offline) và mở nhanh khi đã cài vào Màn hình chính.
   - Số phiên bản lấy từ config.js (SITE.phienBan): đổi phienBan là trình duyệt tự cập nhật bộ đệm. Không cần sửa file này.
   - Trang HTML, JS, CSS, JSON: lấy bản MỚI trên mạng trước (chờ tối đa 3 giây), mạng chậm/mất thì dùng bản đã lưu
     → trang và mã luôn cùng một phiên bản, không bị lẫn bản cũ – bản mới.
   - Font, hình, ảnh: dùng bản đã lưu cho nhanh, đồng thời cập nhật ngầm (hình đề cương đặt tên theo mã băm nên không đổi).
   - Chỉ lưu phản hồi thành công (không lưu trang lỗi 404).
   - Bộ "hcth-nt" do nút 📥 Tải sẵn (assets/ngoaituyen.js) tạo, được giữ qua các lần cập nhật.
   - Không bao giờ lưu đệm gói ngân hàng (.hcth) và bản GV đề cương. */
self.window = self;
try { importScripts("config.js"); } catch (e) {}
const V = "hcth-v-" + (((self.SITE || {}).phienBan) || "0");
const NT = "hcth-nt";

/* Lõi nhẹ cho học sinh — tải sẵn ngay lần đầu vào web. Công cụ giáo viên tải sau (nút 📥 hoặc khi mở trang). */
const SHELL = [
  "./", "./index.html", "./mophong.html", "./luyentap.html", "./tailieu.html", "./hs.html",
  "./config.js", "./manifest.webmanifest",
  "./assets/style.css", "./assets/fonts.css", "./assets/site.js", "./assets/ngoaituyen.js",
  "./data/sims.js", "./data/chuongtrinh.js", "./data/sotay.js", "./data/sotaybai-10.js", "./data/sotaybai-11.js", "./data/sotaybai-12.js", "./data/hinhve-sotay.js",
  "./assets/sotay.js", "./assets/lophoc.js", "./assets/chon-cau.js", "./assets/hinhtudong.js", "./assets/phongmang.js",
  "./assets/nhd/core.js", "./assets/nhd/store.js", "./assets/saoluu.js", "./assets/dongbo.js", "./assets/lib/jszip.min.js",
  "./assets/tailieu.js", "./assets/decuong-tex.js", "./assets/thcs-bank.js", "./assets/ts10.js",
  "./data/decuong/index.json", "./data/decuong/hinh/ds.json",
  "./assets/katex/katex.min.css", "./assets/katex/katex.min.js",
  "./assets/katex/fonts/KaTeX_AMS-Regular.woff2", "./assets/katex/fonts/KaTeX_Caligraphic-Bold.woff2", "./assets/katex/fonts/KaTeX_Caligraphic-Regular.woff2",
  "./assets/katex/fonts/KaTeX_Fraktur-Bold.woff2", "./assets/katex/fonts/KaTeX_Fraktur-Regular.woff2", "./assets/katex/fonts/KaTeX_Main-Bold.woff2",
  "./assets/katex/fonts/KaTeX_Main-BoldItalic.woff2", "./assets/katex/fonts/KaTeX_Main-Italic.woff2", "./assets/katex/fonts/KaTeX_Main-Regular.woff2",
  "./assets/katex/fonts/KaTeX_Math-BoldItalic.woff2", "./assets/katex/fonts/KaTeX_Math-Italic.woff2", "./assets/katex/fonts/KaTeX_SansSerif-Bold.woff2",
  "./assets/katex/fonts/KaTeX_SansSerif-Italic.woff2", "./assets/katex/fonts/KaTeX_SansSerif-Regular.woff2", "./assets/katex/fonts/KaTeX_Script-Regular.woff2",
  "./assets/katex/fonts/KaTeX_Size1-Regular.woff2", "./assets/katex/fonts/KaTeX_Size2-Regular.woff2", "./assets/katex/fonts/KaTeX_Size3-Regular.woff2",
  "./assets/katex/fonts/KaTeX_Size4-Regular.woff2", "./assets/katex/fonts/KaTeX_Typewriter-Regular.woff2",
  "./assets/fonts/be-vietnam-pro-vietnamese-400-normal.woff2", "./assets/fonts/be-vietnam-pro-latin-400-normal.woff2",
  "./assets/fonts/be-vietnam-pro-vietnamese-600-normal.woff2", "./assets/fonts/be-vietnam-pro-latin-600-normal.woff2",
  "./assets/fonts/be-vietnam-pro-vietnamese-700-normal.woff2", "./assets/fonts/be-vietnam-pro-latin-700-normal.woff2",
  "./assets/fonts/baloo-2-vietnamese-800-normal.woff2", "./assets/fonts/baloo-2-latin-800-normal.woff2",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-180.png", "./assets/favicon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await Promise.allSettled(SHELL.map(async u => {
      const r = await fetch(new Request(u, { cache: "reload" }));
      if (r.ok) await c.put(u, r);
    }));
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== V && k !== NT && /^hcth-/.test(k)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });

const khongLuu = u => /\.hcth(\.\d+)?$/.test(u.pathname) || /nganhang\.json$/.test(u.pathname) || /decuong\/gv-/.test(u.pathname) || /thcs\/nganhang/.test(u.pathname);
const laMa = (req, u) => req.mode === "navigate" || /\.(html?|js|css|json|webmanifest)$/i.test(u.pathname) || /\/$/.test(u.pathname);
const batBien = u => /\/data\/decuong\/hinh\/[0-9a-f]{8}\./.test(u.pathname);   // tên theo mã băm: không bao giờ đổi

/* tìm bản đã lưu: đúng địa chỉ trước, rồi bỏ qua ?v=…; bộ chính trước, bộ tải sẵn sau */
async function timBan(req) {
  for (const ten of [V, NT]) {
    const c = await caches.open(ten);
    const r = (await c.match(req)) || (await c.match(req, { ignoreSearch: true, ignoreVary: true }));
    if (r) return r;
  }
  return null;
}
/* lưu bản mới: vào bộ chính; nếu bộ tải sẵn đang giữ file này thì thay luôn ở đó */
async function luu(req, r) {
  if (!r || !r.ok || r.type !== "basic") return;
  const a = r.clone(), b = r.clone();
  const c = await caches.open(V); await c.put(req, a);
  const nt = await caches.open(NT);
  const cu = await nt.keys(req, { ignoreSearch: true });
  if (cu.length) { await Promise.all(cu.map(k => nt.delete(k))); await nt.put(req, b); }
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // CDN, trang ngoài: để trình duyệt tự lo
  if (khongLuu(url)) return;                              // gói ngân hàng: luôn lấy từ mạng
  if (req.headers.get("x-hcth-tai")) return;               // nút 📥 đang tải: để trang tự lưu vào bộ tải sẵn

  if (batBien(url)) {                                      // hình đề cương: có rồi thì khỏi hỏi mạng
    e.respondWith((async () => {
      const cu = await timBan(req); if (cu) return cu;
      try { const r = await fetch(req); e.waitUntil(luu(req, r.clone())); return r; } catch (err) { return Response.error(); }
    })());
    return;
  }
  const mang = fetch(req).then(r => ({ r, sao: r.clone() }));
  e.waitUntil(mang.then(x => luu(req, x.sao)).catch(() => {}));

  if (laMa(req, url)) {                                    // mã, trang, dữ liệu: mạng trước
    e.respondWith((async () => {
      const cho = new Promise(ok => setTimeout(ok, 3000, "cham"));
      try {
        const x = await Promise.race([mang, cho]);
        if (x !== "cham") {
          if (x.r.ok) return x.r;
          return (await timBan(req)) || x.r;               // máy chủ báo lỗi nhưng có bản cũ → dùng bản cũ
        }
        const cu = await timBan(req); if (cu) return cu;   // mạng chậm quá 3 giây: dùng bản đã lưu
        return (await mang).r;
      } catch (err) {
        const cu = await timBan(req); if (cu) return cu;
        if (req.mode === "navigate") return (await timBan(new Request("./index.html"))) || Response.error();
        return Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {                            // font, hình: bản lưu trước, cập nhật ngầm
    const cu = await timBan(req);
    if (cu) return cu;
    try { return (await mang).r; } catch (err) { return Response.error(); }
  })());
});
