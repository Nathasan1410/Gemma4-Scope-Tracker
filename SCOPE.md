# Scope Tracker Data (Editable)

This file mirrors the **current scope list** shown in the UI.

**Priority legend**

- `P0` = MVP wajib untuk demo
- `P1` = nice-to-have kalau sempat
- `P2` = roadmap/writeup
- `CUT` = jangan disentuh dulu

## Where This Lives In Code

- Data source (edit this to change the app content): [src/lib/scope-data.ts](C:/Nael-Hackathon/Scope-Tracker/src/lib/scope-data.ts)
  - `export const SECTIONS: Section[] = [...]`
- UI consumes it here: [src/app/page.tsx](C:/Nael-Hackathon/Scope-Tracker/src/app/page.tsx)
  - imports `SECTIONS` and renders cards + segmented accordions

## 1) App Development

Fokus: user bisa pakai app emergency secara offline.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Emergency chat screen | User bisa input situasi darurat dan dapat jawaban Gemma. |
| P0 | Emergency category buttons | Medical, Fire, Flood, Earthquake, Violence, Lost, Other. |
| P0 | Panic-friendly UI | Tombol besar, teks jelas, minim distraksi. |
| P0 | Quick / Detailed answer toggle | Cukup “Quick Help” dan “Detailed Steps”. |
| P0 | Survival book mode | Mode tanpa model: checklist emergency statis offline. |
| P0 | Share response | Jawaban Gemma bisa di-share via text/QR. |
| P1 | Voice input | User bisa ngomong (roadmap). |
| P1 | Text-to-speech | App bacain instruksi (roadmap). |
| P1 | Local history/log | Simpan lokal kalau user mau. |
| CUT | Printable card | Tidak relevan buat MVP. |

## 2) Model Runtime Development

Fokus: Gemma 4 beneran jalan di device.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Gemma 4 E2B-it on phone | Bukti utama: model jalan lokal di HP. |
| P0 | LiteRT path | Primary special track; core technical claim. |
| P0 | Airplane mode demo | Internet mati, app tetap jalan. |
| P0 | Quantized model | Pakai Q4/optimized model supaya feasible di device. |
| P0 | Default short output | Default 512–1024 token, bukan 8K. |
| P1 | 64K context cap | Bagus kalau feasible. |
| P1 | Long output mode | 4K–8K hanya untuk detailed/protocol mode. |
| P1 | Linux barebone runner | CLI/server minimal buat laptop/Raspberry Pi vision. |
| P2 | llama.cpp/GGUF mode | Roadmap untuk hardware constraint. |
| CUT | Ollama as core | Tidak cocok jadi core mobile-first story. |

## 3) SLM / Emergency Intelligence Development

Fokus: Gemma bukan chatbot biasa, tapi emergency assistant.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Prompt-only emergency mode | System prompt + template + rules. |
| P0 | Structured response format | Situation, Do Now, Do Not, Next Question. |
| P0 | One critical question | App cuma tanya 1 pertanyaan penting berikutnya. |
| P0 | “Do Not” warnings | Selalu kasih larangan/tindakan yang harus dihindari. |
| P0 | Help availability framing | Kalau bantuan bisa dihubungi, hubungi; kalau tidak, lakukan langkah ini. |
| P0 | No definitive diagnosis | Jangan klaim diagnosis pasti; tetap kasih guidance. |
| P1 | Fine-tuned emergency SLM | Eksperimen 3–8 jam (opsional). |
| P1 | LoRA / Unsloth adapter | Bagus untuk technical story. |
| P2 | Output validator | Roadmap untuk cek format/safety otomatis. |
| CUT | Smaller fallback model | Tambah storage dan complexity. |

## 4) Knowledge Development

Fokus: jawaban grounded ke survival/SOP lokal, bukan ngarang bebas.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Local emergency SOP pack | First aid, evacuation, fire, flood, earthquake, violence, lost. |
| P0 | Survival book content | Checklist statis yang bisa dibuka tanpa model. |
| P0 | Source labels | Tampilkan “based on local survival pack”/sumber internal. |
| P0 | Last updated metadata | Knowledge pack punya tanggal update. |
| P1 | Offline RAG | Ambil bagian SOP relevan untuk dimasukkan ke prompt. |
| P1 | Region-based knowledge | Jakarta/flood, Japan/earthquake, etc. |
| P2 | Organization SOP pack | Sekolah/kantor/mall/RS bisa punya SOP sendiri. |
| CUT | Emergency number database as core | Bukan core: 72 jam pertama bisa unreachable. |

## 5) Distribution Development

Fokus: app/knowledge/response bisa disebarkan saat internet mati.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Share response via QR | Jawaban emergency bisa dibaca device lain. |
| P0 | Share survival pack | Versi ringan bisa disebar tanpa model. |
| P0 | App shell sharing | App bisa disebar sebagai package/installable. |
| P0 | QRIS-like scan flow | Scan → open/connect/download/read. |
| P1 | Share full model package | Vision; jangan blocker kalau belum stabil. |
| P1 | Hotspot/local web barebone | Satu device host halaman lokal via IP/QR. |
| P1 | Linux host mode | Laptop/Raspberry Pi jadi survival node. |
| P2 | NFC/tap sharing | Nice UX, bukan wajib. |
| P2 | Compression/split package | Optimasi distribusi app/model/knowledge. |

## 6) Evaluation & Benchmark Development

Fokus: bukti bahwa ini real, bukan demo palsu.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Emergency test cases | Skenario medical/fire/flood/etc untuk ngetes output. |
| P0 | Expected output examples | Golden format untuk jawaban yang dianggap benar. |
| P0 | Safety fail cases | Test prompt berbahaya/ambiguous. |
| P0 | Offline benchmark | Bukti app jalan tanpa internet. |
| P0 | Latency benchmark | TTFT / total response time. |
| P0 | Device specs page | HP apa, RAM berapa, model size berapa. |
| P1 | Memory benchmark | RAM/storage usage. |
| P1 | Battery benchmark | Konsumsi baterai. |
| P2 | Automated eval harness | Script scoring otomatis. |

## 7) Product / Business / Writeup

Fokus: submission kebaca solid.

| Priority | Scope | One-liner |
| --- | --- | --- |
| P0 | Project brief | Problem, user, kenapa offline. |
| P0 | Roadmap | MVP → disaster node → regional packs → hardware deployment. |
| P0 | Business plan | Public facilities, malls, police posts, hospitals, disaster posts. |
| P0 | Technical depth writeup | Kenapa Gemma 4 dipakai secara inovatif. |
| P0 | Architecture diagram | App → category → SOP → Gemma → response → share. |
| P0 | Demo script | Airplane mode → ask → share QR → survival book. |
| P1 | Model card | Model, quantization, limitation. |
| P1 | Safety design doc | Limits dan risk mitigation. |

