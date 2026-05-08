# QR Distribution (Primary) — Findings + Constraints

Tujuan: share **mini-article/instruksi** yang bisa dibaca **instantly** setelah scan QR, dengan minim friction.

Di sini QR adalah **metode distribusi utama**. Hotspot/LAN adalah **opsi pendukung** untuk mengatasi limit QR payload dan kompatibilitas.

---

## Fakta keras QR (yang menentukan desain)

1. **QR payload terbatas** dan makin panjang payload → QR makin padat → makin susah discan lintas HP.
2. Kapasitas best-case (QR standard, Model 2):
   - **Byte mode (ASCII-ish)** max kira-kira **2953 bytes** di **Version 40, ECC L**.
   - **Alphanumeric mode** max kira-kira **4296 chars** di **Version 40, ECC L**.
3. Mode encoding menentukan kapasitas:
   - Kalau konten hanya pakai karakter “alphanumeric QR” (`A–Z 0–9 spasi $%*+-./:`) encoder bisa pakai **alphanumeric mode** → lebih muat.
   - Begitu pakai karakter di luar itu (lowercase, emoji, sebagian punctuation, non-ASCII), umumnya jatuh ke **byte mode** → kapasitas turun.

---

## Dua skenario produk

### A) Offline total (QR-only, tanpa hotspot, tanpa internet)

**Yang paling robust / realistis lintas device:**
- QR berisi **plain text** yang sudah didesain punya hierarchy (ASCII).
- Hasil scan:
  - Banyak scanner bisa menampilkan teks langsung / copy ke Notes/Chat.
  - Tidak “serapi web page”, tapi ini yang paling kompatibel.

**Yang paling “serasa web” (tapi risk tinggi):**
- QR berisi `data:text/html,...` (HTML+CSS inline) sehingga setelah scan bisa membuka halaman rapi tanpa network.
- Constraints:
  - **Tidak universal**: behavior scanner berbeda-beda; beberapa flow (terutama iOS Camera) tidak konsisten membuka `data:` URL.
  - Payload cepat membesar → QR version naik → scan reliability turun.

Kesimpulan offline total:
- Kalau requirement kamu “works everywhere, no install” → pilih **TXT ASCII hierarchy**.
- Kalau requirement kamu “must look like article UI” → `data:` HTML bisa, tapi kamu harus menerima risiko kompatibilitas + QR padat.

### B) Hotspot/LAN beberapa detik (QR tetap utama, hotspot pendukung)

Pola:
- QR payload = **URL lokal pendek** `http://<local-ip>:<port>/...` (QR kecil, gampang discan).
- Receiver join hotspot sebentar, scan QR, browser load 1 halaman viewer.
- Setelah halaman selesai load, receiver boleh disconnect dan tetap baca **selama tab masih terbuka**.

Kenapa ini superior untuk “tampilan panik-friendly”:
- Formatting kaya web (HTML+CSS) tidak perlu dimasukkan ke QR payload.
- QR tetap low-version → lebih tahan variasi kamera/screen.

Catatan penting:
- “Reopen offline setelah tab ditutup” tidak selalu bisa dijamin tanpa offline caching yang andal (umumnya butuh secure context/HTTPS untuk Service Worker). Target yang aman: **load cepat → bisa dibaca setelah disconnect**.

Detail implementasi netral: lihat `docs/HOTSPOT_FINDINGS.md`.

---

## Perbandingan ukuran (konten sama, ASCII-only, tanpa emoji)

Contoh konten: instruksi “Emergency water filtering (drinking)” dengan warning + langkah bernomor.
Angka di bawah: **UTF‑8 bytes** dan **QR version** saat encode ECC **L**.

- `TXT (plain)`: **380 B** → QR **V13**
- `TXT (ASCII hierarchy)`: **537 B** → QR **V16**
- `MD (ASCII)`: **536 B** → QR **V16**
- `HTML (no CSS)`: **777 B** → QR **V19**
- `HTML + CSS (minimal)`: **1085 B** → QR **V23**
- `data: (HTML + CSS minimal)` (biar scan→open offline): **1470 B** → QR **V28**

Interpretasi:
- TXT/MD ukurannya mirip; bedanya MD “enak” hanya kalau ada renderer.
- HTML+CSS memberikan hierarchy yang jelas, tapi kalau dipaksa jadi `data:` URL, overhead naik lagi dan QR jadi jauh lebih padat.

---

## Aturan praktis “biar gampang discan”

1. Targetkan QR version rendah kalau bisa (contoh: V13–V23 lebih nyaman daripada V28+).
2. Jaga payload pendek dan hindari karakter yang memaksa byte mode:
   - Prefer **uppercase + punctuation sederhana** jika tujuannya muat & scan reliability.
3. Untuk display QR di layar:
   - Pastikan kontras tinggi (hitam-putih), brightness cukup, dan ada margin (quiet zone).
   - Jangan tampilkan QR terlalu kecil; QR padat butuh ukuran tampilan lebih besar.

---

## Rekomendasi “urgent instruction / mini textbook”

Jika kamu butuh hierarchy bagus di kondisi panik:

1. **Best overall (pragmatis):** QR → URL lokal (hotspot/LAN) → viewer HTML+CSS minimal.
2. **Best offline-only universal:** TXT ASCII hierarchy (judul besar, warning jelas, numbering, spacing).
3. **Offline-only “paling cantik” tapi risk:** `data:` HTML+CSS (uji di device target; siapkan fallback TXT).

