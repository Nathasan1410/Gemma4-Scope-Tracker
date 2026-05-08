# QR + Hotspot Distribution — Findings (Swara-Fit)

Tujuan: sharing guidance/konten survival dengan friksi minimum, sambil realistis terhadap batas QR payload dan batas context/generation.

Doc ini adalah gabungan dari:

- `QR_FINDINGS.md` (QR-only constraints)
- `HOTSPOT_FINDINGS.md` (QR→LAN/hotspot viewer pattern)

## Ringkasan (Keputusan Praktis)

1) **QR-only universal (paling kompatibel lintas device):** kirim **TXT dengan ASCII hierarchy**.
2) **“Panik-friendly UI” tapi tetap cepat:** QR berisi **URL lokal pendek** → receiver connect hotspot sebentar → buka viewer → boleh disconnect (tab tetap kebuka).
3) **QR “data:text/html” offline-article:** bisa, tapi **risk** (kompatibilitas scanner, iOS behavior, QR makin padat).

## Fakta Keras QR (Yang Mengubah Desain)

- QR payload terbatas; payload makin panjang → QR makin padat → makin susah discan lintas HP.
- Mode encoding menentukan kapasitas:
  - Konten yang hanya memakai charset “QR alphanumeric” bisa lebih muat (lebih dense).
  - Begitu masuk non-ASCII/lowercase/emoji/punctuation tertentu → sering jatuh ke byte mode → kapasitas efektif turun.

## Perbandingan Ukuran (Konten Sama, ASCII-only)

Empiris (ECC L):

- `TXT (plain)`: 380 B → QR V13
- `TXT (ASCII hierarchy)`: 537 B → QR V16
- `MD (ASCII)`: 536 B → QR V16
- `HTML (no CSS)`: 777 B → QR V19
- `HTML + CSS (minimal)`: 1085 B → QR V23
- `data: (HTML + CSS minimal)`: 1470 B → QR V28

Interpretasi untuk Swara:

- **MD tidak otomatis lebih besar** dari TXT kalau tetap ASCII dan sederhana.
- Masalahnya: “instant article UI” butuh renderer (HTML/CSS/JS) → payload cepat naik.
- Untuk QR-only, **yang menang adalah struktur teks**, bukan format “MD vs TXT”.

## Batas Context / Generation (Swara-Fit)

Swara perlu menghindari output panjang yang sulit dishare/scan. Praktiknya:

- Default output ringkas (checklist + warning + eskalasi).
- Batasi langkah utama (misal 5–9 steps) + 3–5 warnings.
- Gunakan “facts input” yang pendek:
  - lokasi/region
  - kondisi (air banjir / luka / api)
  - resource available (mis. “no charcoal”)

Ini menjaga:

- token budget generation tetap aman,
- payload share lebih kecil (QR-friendly),
- dan follow-up questions tetap bisa ditangani tanpa meledakkan konteks.

## Sharing “Chat Snippet” (Multi-turn) via QR

Use case: share sebagian sesi tanya jawab (bukan cuma jawaban final), supaya receiver paham constraint user.

### Kenapa chat snippet berguna

- Receiver bisa melihat “kenapa rekomendasi berubah” (contoh: tidak punya charcoal).
- Bagus untuk mode kolaborasi (teman/keluarga) di lapangan: “ini konteksnya, ini adaptasinya”.

### Format yang disarankan (TXT, QR-friendly)

Gunakan tag pendek dan numbering:

```
SWARA/CHAT/1
CAT:WATER
REG:JKT
U1:FILTER AIR? QUICK.
A1:OK. BOIL IF POSSIBLE. IF NOT...
U2:NO CHARCOAL.
A2:ALT: CLOTH+SAND+GRAVEL. THEN BOIL.
U3:WHERE FIND?
A3:TRY: ROOFS GUTTERS, HARDWARE, CLEAN SAND.
END:IF DIARRHEA/FEVER -> SEEK HELP ASAP
```

Aturan:

- Uppercase + ASCII (lebih stabil untuk QR encoding).
- Satu ide per baris.
- Jawaban “ALT:” untuk substitusi jika constraint berubah.
- Akhiri dengan 1 baris “END:” (safety escalation).

### Kalau payload kepanjangan

- Jangan kirim seluruh chat.
- Kirim **3 turn paling menentukan** + “END:” + “NEXT QUESTIONS” (opsional).

## Hotspot/LAN Pattern (QR Tetap Utama, Hotspot Pendukung)

Pola yang paling pragmatis untuk “article UI”:

1. Sender menyiapkan konten (TXT/MD).
2. Sender menjalankan HTTP server lokal di hotspot/LAN.
3. QR payload = URL lokal pendek `http://<local-ip>:<port>/<id>` (QR kecil, gampang discan).
4. Receiver connect beberapa detik, buka viewer.
5. Setelah load sukses, receiver disconnect dan tetap baca **selama tab tidak ditutup**.

Catatan penting:

- Target yang aman: **load cepat → bisa dibaca setelah disconnect**.
- “Reopen offline setelah tab ditutup” tidak bisa dijamin tanpa caching/SW yang andal.

## Aturan Praktis “Biar Gampang Discan”

- Jaga QR version serendah mungkin (payload kecil).
- Hindari emoji dan karakter non-ASCII untuk QR-only.
- Pakai baris pendek dan struktur jelas.

## Rekomendasi Final (Untuk MVP)

- MVP harus punya dua mode distribusi yang jelas:
  1) **QR-only TXT** untuk universal fallback.
  2) **QR→local viewer** untuk “panic-friendly UI” yang tetap cepat.

