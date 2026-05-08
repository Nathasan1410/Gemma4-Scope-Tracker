# Hotspot Mode (Netral Platform) — Findings

Dokumen ini merangkum pengetahuan/finding untuk flow **share artikel/instruksi via QR** dengan asumsi:

- Receiver bisa **connect ke hotspot/LAN beberapa detik**.
- Setelah itu receiver bisa **disconnect** tapi tetap bisa membaca konten **seketika** (tanpa “download file” UI).
- Implementasi server **netral** (bisa Android device, Raspberry Pi, laptop, dll). Tidak mengikat Node.js.

## Ringkasan pola

1. Sender menyiapkan konten (Markdown/teks).
2. Sender menjalankan **server HTTP lokal** di jaringan hotspot/LAN.
3. QR berisi URL lokal: `http://<local-ip>:<port>/<path>` (payload kecil → QR mudah discan).
4. Receiver join hotspot sebentar, scan QR, browser membuka halaman viewer.
5. Setelah halaman selesai load, receiver bisa disconnect dan tetap membaca **selama tab masih terbuka**.

## Kenapa “instant” tetap bisa setelah disconnect

Tujuan utama adalah **1 page load sukses** yang membawa seluruh konten yang diperlukan untuk membaca:

- Semua CSS inline / dibundel (hindari CDN).
- Tidak ada font/image eksternal.
- Konten artikel sudah ada di HTML response (atau minimal data + renderer kecil).

Kalau semua itu sudah masuk response pertama, browser tidak perlu koneksi lagi untuk “tetap menampilkan” halaman yang sudah terbuka.

## Kebutuhan server (agnostik)

Server lokal cukup menyediakan:

- **Create doc** (opsional): menerima payload konten dan mengembalikan `id` pendek.
  - Contoh: `POST /api/create` → `{ id: "abc123" }`
  - Storage bisa in-memory + TTL (mis. 5–30 menit) untuk PoC.
- **Viewer by id**: `GET /v/<id>` mengembalikan HTML viewer yang sudah berisi konten.
- **Static UI sender** (opsional): halaman untuk mengetik/paste konten dan memunculkan QR.

Catatan praktik:

- Batasi ukuran payload (mis. 64–512KB) supaya server tidak drop.
- Tambahkan TTL expiry untuk dokumen.
- QR payload sebaiknya hanya URL singkat (hindari query panjang).

## Offline behavior: apa yang bisa vs tidak bisa dijamin

**Bisa dijamin**

- Jika viewer page sudah selesai load, receiver bisa baca setelah Wi‑Fi putus **selama tab tidak ditutup**.

**Tidak bisa dijamin (tanpa HTTPS/Service Worker)**

- Receiver menutup tab lalu membuka ulang URL yang sama ketika offline.

Alasan: offline reopen yang “andal” biasanya perlu Service Worker/offline app shell caching di origin tersebut. Banyak browser mensyaratkan **secure context (HTTPS)** (localhost pengecualian; LAN IP umumnya bukan).

**Best-effort tambahan**

- Viewer page dapat menyimpan isi artikel ke `localStorage`/IndexedDB untuk “tetap ada di device”.
- Tapi navigasi/reopen URL offline tetap bisa gagal jika browser tidak punya cache route (tanpa SW).

## QR payload dan scan reliability

Hotspot mode membuat payload QR sangat pendek karena hanya URL lokal (biasanya puluhan karakter).

Dampak:

- QR version rendah → modul lebih sedikit → QR lebih mudah discan di banyak kamera/layar.
- Ini jauh lebih robust dibanding “offline QR-only” yang memaksa konten ikut masuk QR.

## Packaging konten untuk viewer (rekomendasi)

Untuk urgent instruction / mini-article:

- Gunakan 1 HTML response yang sudah mengandung:
  - `h1/h2`, list (`ol/ul`), blok peringatan (`div.warn`), spacing yang jelas
  - CSS minimal inline (cukup untuk hierarchy dan legibility)
- Hindari:
  - asset eksternal (CDN), font eksternal, gambar eksternal
  - script berat; idealnya viewer “static” saja

Pilihan implementasi:

- **Server render:** server mengubah Markdown/teks → safe HTML, kirim hasil jadi viewer (klien tidak perlu renderer).
- **Client render:** server kirim Markdown/teks + renderer JS kecil di viewer page (lebih fleksibel tapi lebih berat).

## Keamanan konten

Jika konten berasal dari input user:

- Jangan izinkan raw HTML tanpa sanitasi.
- Escape default (atau sanitize) untuk mencegah XSS.
- Jika viewer tidak butuh JS sama sekali, pertimbangkan Content Security Policy yang ketat (opsional).

## UX flow yang paling cepat untuk “connect 5 detik”

Flow dua-QR (opsional tapi sangat membantu):

1. **QR #1: Wi‑Fi Join QR** (format standar) → receiver cukup scan untuk join hotspot tanpa mengetik password.
2. **QR #2: URL lokal viewer** → receiver scan, halaman kebuka.

## Catatan untuk implementasi lintas device

- Pastikan hotspot tidak mengaktifkan “client isolation” yang memblokir akses antar perangkat.
- Tampilkan di UI sender URL yang benar untuk jaringan aktif (IP yang bisa diakses receiver).
- Gunakan port tetap (mis. 4173) agar mudah didokumentasikan.

