/* omr/worker.js — chấm phiếu trong luồng nền để camera không bị đứng hình */
importScripts("layout.js?v=6", "scan.js?v=6");
onmessage = e => {
  const { id, img, ids } = e.data; let out;
  try { out = OMR.readAuto(img, ids); } catch (err) { out = { ok: false, why: "Lỗi xử lý ảnh: " + (err && err.message || err) }; }
  postMessage({ id, out });
};
