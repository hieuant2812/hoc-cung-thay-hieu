#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""maychu.py — Máy chủ lớp học cho các trò chơi "Học cùng Thầy Hiếu".

Chạy ngay trên máy của thầy cô (macOS có sẵn Python 3), không cần cài thêm gì,
không cần internet. Học sinh dùng điện thoại cùng mạng wifi, quét mã QR trên màn
chiếu là vào dự thi được.

    Cách chạy:  mở Terminal, gõ        python3 maychu.py
    Dừng lại:   bấm Control + C

Máy chủ vừa phục vụ trang web (trochoi.html, hs.html…) vừa giữ phòng thi.
Mọi dữ liệu chỉ nằm trong bộ nhớ máy này, tắt là hết.
"""
import json, os, random, re, socket, sys, threading, time, unicodedata
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

CONG = int(os.environ.get("CONG", "8080"))
GOC = os.path.dirname(os.path.abspath(__file__))
KHOA = threading.Lock()
PHONG = {}          # ma -> phòng
HET_HAN = 6 * 3600  # dọn phòng cũ sau 6 giờ


def khong_dau(s):
    s = unicodedata.normalize("NFD", str(s or ""))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s.replace("đ", "d").replace("Đ", "D").lower().strip()


def ip_lan():
    """địa chỉ IP của máy trong mạng lớp học"""
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ips.append(s.getsockname()[0]); s.close()
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips or ["127.0.0.1"]


def ma_phong():
    while True:
        m = "".join(random.choice("0123456789") for _ in range(4))
        if m not in PHONG:
            return m


def phong_moi(ds, tro):
    ma = ma_phong()
    PHONG[ma] = {
        "ma": ma, "tro": tro or "", "tao": time.time(), "ds": ds or [],
        "hs": {},            # id -> {ten, to, diem, con, traloi, dung}
        "cau": None,         # câu hỏi đang hỏi
        "so": 0, "trangthai": "cho", "ban": 0
    }
    return PHONG[ma]


def don_phong():
    bay = [m for m, p in PHONG.items() if time.time() - p["tao"] > HET_HAN]
    for m in bay:
        PHONG.pop(m, None)


def tomtat(p, cho_gv=False):
    o = {"ma": p["ma"], "tro": p["tro"], "trangthai": p["trangthai"], "so": p["so"], "ban": p["ban"],
         "sohs": len(p["hs"]), "con": sum(1 for h in p["hs"].values() if h["con"])}
    if cho_gv:
        o["hs"] = [{"id": i, "ten": h["ten"], "to": h["to"], "diem": h["diem"], "con": h["con"],
                    "chon": h["traloi"], "dung": h["dung"], "giay": h.get("giay")}
                   for i, h in sorted(p["hs"].items(), key=lambda kv: -kv[1]["diem"])]
        if p["cau"]:
            dem = {}
            for h in p["hs"].values():
                if h["traloi"] is not None:
                    dem[h["traloi"]] = dem.get(h["traloi"], 0) + 1
            o["dem"] = dem
            o["datl"] = sum(1 for h in p["hs"].values() if h["traloi"] is not None)
            o["cau"] = {"so": p["cau"]["so"], "dapan": p["cau"]["dapan"], "mo": p["cau"]["mo"],
                        "hien": p["cau"].get("hien", False), "n": len(p["cau"]["pa"])}
    return o


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=GOC, **kw)

    def log_message(self, *a):
        pass

    # ------------------------------------------------------------------ tiện ích
    def tra(self, o, ma=200):
        b = json.dumps(o, ensure_ascii=False).encode("utf-8")
        self.send_response(ma)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(b)

    def than(self):
        n = int(self.headers.get("Content-Length") or 0)
        if not n:
            return {}
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except Exception:
            return {}

    def end_headers(self):
        if self.path.endswith((".html", ".js", ".css", ".json")):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    # ------------------------------------------------------------------ GET
    def do_GET(self):
        if not self.path.startswith("/api/"):
            return super().do_GET()
        from urllib.parse import urlparse, parse_qs
        u = urlparse(self.path); q = {k: v[0] for k, v in parse_qs(u.query).items()}
        with KHOA:
            don_phong()
            p = PHONG.get(q.get("ma", ""))
            if u.path == "/api/dia-chi":
                return self.tra({"ip": ip_lan(), "cong": CONG})
            if u.path == "/api/danh-sach":
                if not p: return self.tra({"loi": "Không tìm thấy phòng thi. Thầy cô kiểm tra lại mã."}, 404)
                davao = {khong_dau(h["ten"]) for h in p["hs"].values()}
                return self.tra({"ma": p["ma"], "tro": p["tro"],
                                 "ds": [{"ten": t["ten"], "to": t.get("to", ""), "roi": khong_dau(t["ten"]) in davao} for t in p["ds"]]})
            if u.path == "/api/trang-thai":        # cho điện thoại học sinh
                if not p: return self.tra({"loi": "Phòng thi đã đóng."}, 404)
                h = p["hs"].get(q.get("id", ""))
                o = tomtat(p)
                o["toi"] = {"ten": h["ten"], "to": h["to"], "diem": h["diem"], "con": h["con"],
                            "chon": h["traloi"], "dung": h["dung"]} if h else None
                if p["cau"] and p["cau"]["mo"]:
                    c = p["cau"]
                    o["cau"] = {"so": c["so"], "loai": c["loai"], "n": len(c["pa"]), "pa": c["pa"],
                                "de": c["de"] if c.get("guiDe") else "", "het": c["het"]}
                    if c.get("hien"):
                        o["cau"]["dapan"] = c["dapan"]
                return self.tra(o)
            if u.path == "/api/gv":                 # cho máy chiếu của thầy cô
                if not p: return self.tra({"loi": "Phòng thi đã đóng."}, 404)
                return self.tra(tomtat(p, True))
        self.tra({"loi": "Không có đường dẫn này."}, 404)

    # ------------------------------------------------------------------ POST
    def do_POST(self):
        d = self.than()
        with KHOA:
            don_phong()
            p = PHONG.get(str(d.get("ma", "")))
            if self.path == "/api/mo-phong":
                ds = []
                for t in (d.get("ds") or []):
                    if isinstance(t, str):
                        ds.append({"ten": t.strip(), "to": ""})
                    elif t.get("ten"):
                        ds.append({"ten": str(t["ten"]).strip(), "to": str(t.get("to", "")).strip()})
                if not ds:
                    return self.tra({"loi": "Danh sách lớp đang trống."}, 400)
                p = phong_moi(ds, d.get("tro"))
                return self.tra({"ma": p["ma"], "ip": ip_lan(), "cong": CONG})
            if not p:
                return self.tra({"loi": "Phòng thi đã đóng."}, 404)

            if self.path == "/api/vao":            # học sinh chọn tên để vào
                ten = str(d.get("ten", "")).strip()
                kd = khong_dau(ten)
                if not any(khong_dau(t["ten"]) == kd for t in p["ds"]):
                    return self.tra({"loi": "Tên này không có trong danh sách lớp."}, 403)
                for i, h in p["hs"].items():
                    if khong_dau(h["ten"]) == kd:
                        return self.tra({"id": i, "ten": h["ten"], "to": h["to"], "lai": True})
                to = next((t.get("to", "") for t in p["ds"] if khong_dau(t["ten"]) == kd), "")
                i = "%d%03d" % (int(time.time() * 10) % 100000, random.randint(0, 999))
                p["hs"][i] = {"ten": ten, "to": to, "diem": 0, "con": True, "traloi": None, "dung": None}
                return self.tra({"id": i, "ten": ten, "to": to})

            if self.path == "/api/tra-loi":        # học sinh gửi đáp án
                h = p["hs"].get(str(d.get("id", "")))
                c = p["cau"]
                if not h or not c or not c["mo"]:
                    return self.tra({"loi": "Chưa có câu hỏi nào đang mở."}, 400)
                if not h["con"]:
                    return self.tra({"loi": "Em đã dừng cuộc chơi."}, 403)
                if h["traloi"] is not None:
                    return self.tra({"ok": True, "lai": True})
                chon = d.get("chon")
                h["traloi"] = chon
                h["giay"] = round(time.time() - c["batdau"], 1)
                h["dung"] = (str(chon) == str(c["dapan"])) if c["dapan"] is not None else None
                if h["dung"]:
                    nhanh = max(0, 1 - h["giay"] / max(1, c["giay"]))
                    h["diem"] += int(c.get("diem", 10) * (0.6 + 0.4 * nhanh))
                return self.tra({"ok": True})

            # ---- các lệnh của máy thầy cô
            if self.path == "/api/gv/cau":
                p["so"] += 1
                p["cau"] = {"so": p["so"], "de": d.get("de", ""), "guiDe": bool(d.get("guiDe", True)),
                            "pa": d.get("pa") or [], "loai": d.get("loai", "TN"), "dapan": d.get("dapan"),
                            "giay": int(d.get("giay") or 30), "diem": int(d.get("diem") or 10),
                            "batdau": time.time(), "het": time.time() + int(d.get("giay") or 30),
                            "mo": True, "hien": False}
                for h in p["hs"].values():
                    h["traloi"] = None; h["dung"] = None; h["giay"] = None
                p["trangthai"] = "dang-hoi"
                return self.tra({"ok": True, "so": p["so"]})
            if self.path == "/api/gv/khoa":
                if p["cau"]:
                    p["cau"]["mo"] = False; p["cau"]["hien"] = True
                p["trangthai"] = "da-khoa"
                return self.tra(tomtat(p, True))
            if self.path == "/api/gv/loai":        # loại những em trả lời sai (rung chuông vàng)
                n = 0
                for h in p["hs"].values():
                    if h["con"] and h["dung"] is not True:
                        h["con"] = False; n += 1
                return self.tra({"ok": True, "loai": n, "con": sum(1 for h in p["hs"].values() if h["con"])})
            if self.path == "/api/gv/cuu":         # cứu trợ: cho tất cả quay lại
                for h in p["hs"].values():
                    h["con"] = True
                return self.tra({"ok": True, "con": len(p["hs"])})
            if self.path == "/api/gv/diem":
                h = p["hs"].get(str(d.get("id", "")))
                if h: h["diem"] += int(d.get("diem") or 0)
                return self.tra({"ok": True})
            if self.path == "/api/gv/dong":
                PHONG.pop(p["ma"], None)
                return self.tra({"ok": True})
        self.tra({"loi": "Không có đường dẫn này."}, 404)


def main():
    global CONG
    for _ in range(12):
        try:
            sv = ThreadingHTTPServer(("0.0.0.0", CONG), Handler)
            break
        except OSError:
            CONG += 1
    else:
        print("Không mở được cổng nào, thầy cô thử tắt bớt chương trình khác rồi chạy lại."); return
    ips = ip_lan()
    print("\n" + "=" * 64)
    print("  MÁY CHỦ LỚP HỌC — Học cùng Thầy Hiếu".center(64))
    print("=" * 64)
    print("\n  Thầy cô mở trang điều khiển trò chơi ở địa chỉ:\n")
    print("      http://%s:%d/trochoi.html\n" % (ips[0], CONG))
    if len(ips) > 1:
        print("  (máy có nhiều mạng, nếu không vào được thì thử: %s)\n"
              % ", ".join("http://%s:%d/trochoi.html" % (i, CONG) for i in ips[1:]))
    print("  Học sinh KHÔNG cần gõ địa chỉ: các em chỉ quét mã QR hiện trên màn chiếu.")
    print("  Điều kiện: điện thoại học sinh dùng chung wifi với máy này.")
    print("\n  Bấm Control + C để tắt máy chủ.\n")
    try:
        sv.serve_forever()
    except KeyboardInterrupt:
        print("\n  Đã tắt máy chủ. Hẹn gặp lại thầy cô!\n")


if __name__ == "__main__":
    main()
