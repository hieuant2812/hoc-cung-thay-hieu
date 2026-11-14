/* sw.js — chạy ngoại tuyến (offline) và mở nhanh khi đã cài vào Màn hình chính.
   Nguyên tắc: trang HTML luôn thử lấy bản mới trước (để sửa đổi của thầy hiện ra ngay),
   các file tĩnh (js, css, font, hình) dùng bản đã lưu rồi âm thầm cập nhật.
   Không bao giờ lưu đệm gói ngân hàng (.hcth) để khỏi chiếm dung lượng. */
const V = "hcth-v12";
const SHELL = [
  "./", "./index.html", "./rade.html", "./cham.html", "./phieu.html", "./phantich.html",
  "./tren-lop.html", "./luyentap.html", "./mophong.html", "./dapan.html", "./khbd.html", "./beamer.html", "./trochoi.html", "./hs.html",
  "./config.js", "./manifest.webmanifest",
  "./assets/style.css", "./assets/fonts.css", "./assets/site.js",
  "./assets/nhd/core.js", "./assets/nhd/store.js", "./assets/nhd/gen.js", "./assets/nhd/out.js", "./assets/nhd/app.js",
  "./assets/omr/layout.js", "./assets/omr/scan.js", "./assets/omr/keys.js", "./assets/omr/app.js", "./assets/omr/worker.js", "./assets/omr/phantich.js",
  "./assets/chon-cau.js", "./assets/saoluu.js", "./assets/dongbo.js", "./assets/docx.js",
  "./assets/khbd.js", "./assets/beamer.js", "./assets/trochoi.js", "./data/chuongtrinh.js",
  "./data/baihoc/t10.js", "./data/baihoc/t11.js", "./data/baihoc/t12.js", "./data/baihoc/cd.js",
  "./assets/lib/jszip.min.js", "./assets/lib/jspdf.umd.min.js", "./assets/lib/qrcode.js",
  "./assets/katex/katex.min.css", "./assets/katex/katex.min.js",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/favicon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: "reload" }))));
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });

const khongLuu = u => /\.hcth(\.\d+)?$/.test(u.pathname) || /nganhang\.json$/.test(u.pathname);

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // CDN, trang ngoài: để trình duyệt tự lo
  if (khongLuu(url)) return;                            // gói ngân hàng: luôn lấy từ mạng

  if (req.mode === "navigate") {                        // trang HTML: mạng trước, hỏng thì dùng bản lưu
    e.respondWith((async () => {
      try { const r = await fetch(req); const c = await caches.open(V); c.put(req, r.clone()); return r; }
      catch (err) { return (await caches.match(req)) || (await caches.match("./index.html")) || Response.error(); }
    })());
    return;
  }
  e.respondWith((async () => {                          // file tĩnh: dùng bản lưu, đồng thời cập nhật ngầm
    const hit = await caches.match(req);
    const net = fetch(req).then(r => { if (r && r.ok) caches.open(V).then(c => c.put(req, r.clone())); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
