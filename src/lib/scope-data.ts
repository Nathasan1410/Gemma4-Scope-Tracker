export type Priority = "P0" | "P1" | "P2" | "CUT";

export type TaskStatus = "not_started" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  note: string;
  briefMd?: string;
  defaultStatus?: TaskStatus;
  priority: Priority;
};

export type Section = {
  id: string;
  title: string;
  focus: string;
  tasks: Task[];
};

export const SECTIONS: Section[] = [
  {
    id: "app-dev",
    title: "App Development",
    focus: "User bisa pakai app emergency secara offline.",
    tasks: [
      {
        id: "app-emergency-chat-screen",
        priority: "P0",
        title: "Emergency chat screen",
        note: "User bisa input situasi darurat dan dapat jawaban Gemma.",
      },
      {
        id: "app-emergency-category-buttons",
        priority: "P0",
        title: "Emergency category buttons",
        note: "Medical, Fire, Flood, Earthquake, Violence, Lost, Other.",
      },
      {
        id: "app-panic-friendly-ui",
        priority: "P0",
        title: "Panic-friendly UI",
        note: "Tombol besar, teks jelas, minim distraksi.",
      },
      {
        id: "app-quick-detailed-toggle",
        priority: "P0",
        title: "Quick / Detailed answer toggle",
        note: "Cukup “Quick Help” dan “Detailed Steps”.",
      },
      {
        id: "app-survival-book-mode",
        priority: "P0",
        title: "Survival book mode",
        note: "Mode tanpa model: checklist emergency statis offline.",
      },
      {
        id: "app-share-response",
        priority: "P0",
        title: "Share response",
        note: "Jawaban Gemma bisa di-share via text/QR.",
      },
      { id: "app-voice-input", priority: "P1", title: "Voice input", note: "User bisa ngomong (roadmap)." },
      { id: "app-tts", priority: "P1", title: "Text-to-speech", note: "App bacain instruksi (roadmap)." },
      { id: "app-local-history", priority: "P1", title: "Local history/log", note: "Simpan lokal kalau user mau." },
      { id: "app-printable-card", priority: "CUT", title: "Printable card", note: "Tidak relevan buat MVP." },
    ],
  },
  {
    id: "model-runtime",
    title: "Model Runtime Development",
    focus: "Gemma 4 beneran jalan di device.",
    tasks: [
      {
        id: "runtime-gemma4-on-phone",
        priority: "P0",
        title: "Gemma 4 E2B-it on phone",
        note: "Bukti utama: model jalan lokal di HP.",
      },
      {
        id: "runtime-litert-path",
        priority: "P0",
        title: "LiteRT path",
        note: "Primary special track; core technical claim.",
      },
      {
        id: "runtime-airplane-mode-demo",
        priority: "P0",
        title: "Airplane mode demo",
        note: "Internet mati, app tetap jalan.",
      },
      {
        id: "runtime-quantized-model",
        priority: "P0",
        title: "Quantized model",
        note: "Pakai Q4/optimized model supaya feasible di device.",
      },
      {
        id: "runtime-default-short-output",
        priority: "P0",
        title: "Default short output",
        note: "Default 512–1024 token, bukan 8K.",
      },
      { id: "runtime-64k-context", priority: "P1", title: "64K context cap", note: "Bagus kalau feasible." },
      { id: "runtime-long-output", priority: "P1", title: "Long output mode", note: "4K–8K hanya untuk detailed/protocol mode." },
      {
        id: "runtime-linux-runner",
        priority: "P1",
        title: "Linux barebone runner",
        note: "CLI/server minimal buat laptop/Raspberry Pi vision.",
      },
      { id: "runtime-gguf-roadmap", priority: "P2", title: "llama.cpp/GGUF mode", note: "Roadmap untuk hardware constraint." },
      { id: "runtime-ollama-cut", priority: "CUT", title: "Ollama as core", note: "Tidak cocok jadi core mobile-first story." },
    ],
  },
  {
    id: "slm-intel",
    title: "SLM / Emergency Intelligence Development",
    focus: "Gemma bukan chatbot biasa, tapi emergency assistant.",
    tasks: [
      { id: "slm-prompt-only-mode", priority: "P0", title: "Prompt-only emergency mode", note: "System prompt + template + rules." },
      { id: "slm-structured-format", priority: "P0", title: "Structured response format", note: "Situation, Do Now, Do Not, Next Question." },
      { id: "slm-one-critical-question", priority: "P0", title: "One critical question", note: "App cuma tanya 1 pertanyaan penting berikutnya." },
      { id: "slm-do-not-warnings", priority: "P0", title: "“Do Not” warnings", note: "Selalu kasih larangan/tindakan yang harus dihindari." },
      {
        id: "slm-availability-framing",
        priority: "P0",
        title: "Help availability framing",
        note: "Kalau bantuan bisa dihubungi, hubungi; kalau tidak, lakukan langkah ini.",
      },
      { id: "slm-no-diagnosis", priority: "P0", title: "No definitive diagnosis", note: "Jangan klaim diagnosis pasti; tetap kasih guidance." },
      { id: "slm-finetune", priority: "P1", title: "Fine-tuned emergency SLM", note: "Eksperimen 3–8 jam (opsional)." },
      { id: "slm-lora", priority: "P1", title: "LoRA / Unsloth adapter", note: "Bagus untuk technical story." },
      { id: "slm-validator", priority: "P2", title: "Output validator", note: "Roadmap untuk cek format/safety otomatis." },
      { id: "slm-smaller-fallback-cut", priority: "CUT", title: "Smaller fallback model", note: "Tambah storage dan complexity." },
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge Development",
    focus: "Jawaban grounded ke survival/SOP lokal, bukan ngarang bebas.",
    tasks: [
      {
        id: "know-sop-pack",
        priority: "P0",
        title: "Local emergency SOP pack",
        note: "First aid, evacuation, fire, flood, earthquake, violence, lost.",
      },
      { id: "know-survival-book-content", priority: "P0", title: "Survival book content", note: "Checklist statis yang bisa dibuka tanpa model." },
      { id: "know-source-labels", priority: "P0", title: "Source labels", note: "Tampilkan “based on local survival pack”/sumber internal." },
      { id: "know-last-updated", priority: "P0", title: "Last updated metadata", note: "Knowledge pack punya tanggal update." },
      { id: "know-offline-rag", priority: "P1", title: "Offline RAG", note: "Ambil bagian SOP relevan untuk dimasukkan ke prompt." },
      { id: "know-region-based", priority: "P1", title: "Region-based knowledge", note: "Jakarta/flood, Japan/earthquake, etc." },
      { id: "know-org-pack", priority: "P2", title: "Organization SOP pack", note: "Sekolah/kantor/mall/RS bisa punya SOP sendiri." },
      { id: "know-emergency-number-cut", priority: "CUT", title: "Emergency number database as core", note: "Bukan core: 72 jam pertama bisa unreachable." },
    ],
  },
  {
    id: "distribution",
    title: "Distribution Development",
    focus: "App/knowledge/response bisa disebarkan saat internet mati.",
    tasks: [
      { id: "dist-share-response-qr", priority: "P0", title: "Share response via QR", note: "Jawaban emergency bisa dibaca device lain." },
      { id: "dist-share-survival-pack", priority: "P0", title: "Share survival pack", note: "Versi ringan bisa disebar tanpa model." },
      { id: "dist-app-shell-sharing", priority: "P0", title: "App shell sharing", note: "App bisa disebar sebagai package/installable." },
      { id: "dist-qr-scan-flow", priority: "P0", title: "QRIS-like scan flow", note: "Scan → open/connect/download/read." },
      { id: "dist-share-full-model", priority: "P1", title: "Share full model package", note: "Vision; jangan blocker kalau belum stabil." },
      { id: "dist-hotspot-web", priority: "P1", title: "Hotspot/local web barebone", note: "Satu device host halaman lokal via IP/QR." },
      { id: "dist-linux-host", priority: "P1", title: "Linux host mode", note: "Laptop/Raspberry Pi jadi survival node." },
      { id: "dist-nfc", priority: "P2", title: "NFC/tap sharing", note: "Nice UX, bukan wajib." },
      { id: "dist-compression", priority: "P2", title: "Compression/split package", note: "Optimasi distribusi app/model/knowledge." },
    ],
  },
  {
    id: "eval",
    title: "Evaluation & Benchmark Development",
    focus: "Bukti bahwa ini real, bukan demo palsu.",
    tasks: [
      { id: "eval-test-cases", priority: "P0", title: "Emergency test cases", note: "Skenario medical/fire/flood/etc untuk ngetes output." },
      { id: "eval-expected-examples", priority: "P0", title: "Expected output examples", note: "Golden format untuk jawaban yang dianggap benar." },
      { id: "eval-safety-fails", priority: "P0", title: "Safety fail cases", note: "Test prompt berbahaya/ambiguous." },
      { id: "eval-offline-benchmark", priority: "P0", title: "Offline benchmark", note: "Bukti app jalan tanpa internet." },
      { id: "eval-latency", priority: "P0", title: "Latency benchmark", note: "TTFT / total response time." },
      { id: "eval-device-specs", priority: "P0", title: "Device specs page", note: "HP apa, RAM berapa, model size berapa." },
      { id: "eval-memory", priority: "P1", title: "Memory benchmark", note: "RAM/storage usage." },
      { id: "eval-battery", priority: "P1", title: "Battery benchmark", note: "Konsumsi baterai." },
      { id: "eval-harness", priority: "P2", title: "Automated eval harness", note: "Script scoring otomatis." },
    ],
  },
  {
    id: "writeup",
    title: "Product / Business / Writeup",
    focus: "Submission kebaca solid.",
    tasks: [
      { id: "w-brief", priority: "P0", title: "Project brief", note: "Problem, user, kenapa offline." },
      { id: "w-roadmap", priority: "P0", title: "Roadmap", note: "MVP → disaster node → regional packs → hardware deployment." },
      { id: "w-biz-plan", priority: "P0", title: "Business plan", note: "Public facilities, malls, police posts, hospitals, disaster posts." },
      { id: "w-tech-depth", priority: "P0", title: "Technical depth writeup", note: "Kenapa Gemma 4 dipakai secara inovatif." },
      { id: "w-arch-diagram", priority: "P0", title: "Architecture diagram", note: "App → category → SOP → Gemma → response → share." },
      { id: "w-demo-script", priority: "P0", title: "Demo script", note: "Airplane mode → ask → share QR → survival book." },
      { id: "w-model-card", priority: "P1", title: "Model card", note: "Model, quantization, limitation." },
      { id: "w-safety-doc", priority: "P1", title: "Safety design doc", note: "Limits dan risk mitigation." },
    ],
  },
];
