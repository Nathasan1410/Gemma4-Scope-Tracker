import type { Section } from "@/lib/scope-data";

export const DEV_PHASES: Section[] = [
  {
    id: "phase-1-barebone-runtime",
    title: "Phase 1: Barebone App + Runtime",
    focus: "Lock the basic offline app shell and prove Gemma 4 runs locally.",
    tasks: [
      {
        id: "phase-1-simple-ui",
        priority: "P0",
        title: "Simple emergency UI",
        note: "Basic screen, category entry point, and enough UI to test flows.",
        defaultStatus: "done",
        briefMd: `
## Output

Barebone app UI is already present enough to continue building product flows.

## Definition of done

- App opens locally.
- Main emergency flow exists.
- UI is simple enough for team testing.
        `.trim(),
      },
      {
        id: "phase-1-gemma-running",
        priority: "P0",
        title: "Gemma 4 running properly",
        note: "Local inference works on target device/runtime path.",
        defaultStatus: "done",
        briefMd: `
## Output

Gemma 4 can produce a local answer through the current prototype/runtime path.

## Next validation

- Record exact device specs.
- Record model size and quantization.
- Capture offline/airplane-mode proof.
        `.trim(),
      },
      {
        id: "phase-1-airplane-proof",
        priority: "P0",
        title: "Airplane mode proof",
        note: "Show app and model response still work with internet disabled.",
        briefMd: `
## Why this is next

The core thesis is 100% offline survival guidance. The demo must visibly prove that the app is not calling a cloud API.

## Deliverable

- Short video clip or screenshots.
- Device in airplane mode.
- Successful emergency response.
        `.trim(),
      },
      {
        id: "phase-1-runtime-notes",
        priority: "P0",
        title: "Runtime notes",
        note: "Document model name, runtime path, device, RAM, storage, and limitations.",
      },
    ],
  },
  {
    id: "phase-2-emergency-brain",
    title: "Phase 2: Emergency Brain",
    focus: "Make Gemma behave like a survival instruction engine, not a normal chatbot.",
    tasks: [
      {
        id: "phase-2-system-prompt",
        priority: "P0",
        title: "System prompt",
        note: "Emergency assistant rules, offline thesis, safety boundaries.",
      },
      {
        id: "phase-2-response-format",
        priority: "P0",
        title: "Structured response format",
        note: "Risk, Situation, Do Now, Do Not, Next Question.",
        briefMd: `
## Target format

\`\`\`text
RISK
Low / Medium / High / Unknown

SITUATION
Short summary.

DO NOW
1. Immediate action.
2. Immediate action.
3. Immediate action.

DO NOT
1. Avoid unsafe action.
2. Avoid unsafe action.

NEXT QUESTION
Ask exactly one critical question.
\`\`\`
        `.trim(),
      },
      {
        id: "phase-2-category-templates",
        priority: "P0",
        title: "Category prompt templates",
        note: "Medical, Fire, Flood, Earthquake, Violence, Lost, Other each gets focused context.",
      },
      {
        id: "phase-2-quick-detailed",
        priority: "P0",
        title: "Quick / Detailed behavior",
        note: "Quick is short survival action; Detailed adds deeper steps without becoming bloated.",
      },
      {
        id: "phase-2-safety-rules",
        priority: "P0",
        title: "Safety rules",
        note: "No overconfident diagnosis, one critical question, useful even when help is unreachable.",
      },
    ],
  },
  {
    id: "phase-3-knowledge-survival",
    title: "Phase 3: Knowledge + Survival Book",
    focus: "Build a small curated survival pack before attempting full RAG.",
    tasks: [
      {
        id: "phase-3-survival-pack",
        priority: "P0",
        title: "Small survival pack",
        note: "Curated checklist/snippets for medical, fire, flood, earthquake, violence, lost.",
        briefMd: `
## Scope control

Do not start with vector RAG. Start with deterministic category lookup:

- Medical basics
- Fire
- Flood
- Earthquake
- Violence / safety threat
- Lost / stranded
        `.trim(),
      },
      {
        id: "phase-3-survival-book-ui",
        priority: "P0",
        title: "Survival book UI",
        note: "Static checklist mode that works without model inference.",
      },
      {
        id: "phase-3-knowledge-selection",
        priority: "P0",
        title: "Category-based knowledge selection",
        note: "Selected category inserts the relevant survival snippet into the prompt.",
      },
      {
        id: "phase-3-source-metadata",
        priority: "P0",
        title: "Source label + metadata",
        note: "Show pack label/version/last updated so guidance feels grounded.",
      },
      {
        id: "phase-3-rag-roadmap",
        priority: "P1",
        title: "Offline RAG",
        note: "Upgrade from simple lookup later if time allows.",
      },
    ],
  },
  {
    id: "phase-4-light-sharing",
    title: "Phase 4: Lightweight Sharing",
    focus: "Share useful guidance first: response and survival pack before model package.",
    tasks: [
      {
        id: "phase-4-share-response-text",
        priority: "P0",
        title: "Share response as text",
        note: "Use native share/file/text path for the generated emergency answer.",
      },
      {
        id: "phase-4-share-response-qr",
        priority: "P0",
        title: "Share response via QR",
        note: "QR payload contains readable emergency instructions.",
      },
      {
        id: "phase-4-share-survival-pack",
        priority: "P0",
        title: "Share survival checklist/pack",
        note: "Share the lightest useful package that works without the model.",
      },
      {
        id: "phase-4-app-shell-sharing",
        priority: "P0",
        title: "App shell sharing path",
        note: "Document or prototype APK/package transfer where feasible.",
      },
      {
        id: "phase-4-model-sharing-experiment",
        priority: "P1",
        title: "Model package sharing experiment",
        note: "Heavy package; attempt only after response and survival pack sharing work.",
      },
    ],
  },
  {
    id: "phase-5-proof-package",
    title: "Phase 5: Proof Package",
    focus: "Create the evidence judges need: evals, benchmarks, demo script, and technical writeup.",
    tasks: [
      {
        id: "phase-5-eval-cases",
        priority: "P0",
        title: "Emergency eval cases",
        note: "20-30 prompts across medical, fire, flood, earthquake, violence, lost.",
      },
      {
        id: "phase-5-golden-outputs",
        priority: "P0",
        title: "Expected output examples",
        note: "Golden examples that follow the structured emergency format.",
      },
      {
        id: "phase-5-latency-device",
        priority: "P0",
        title: "Latency + device specs",
        note: "Time to first token, total response time, phone, RAM, model size.",
      },
      {
        id: "phase-5-demo-script",
        priority: "P0",
        title: "Demo script",
        note: "Airplane mode, ask emergency, share QR, survival book.",
      },
      {
        id: "phase-5-technical-depth",
        priority: "P0",
        title: "Technical depth writeup",
        note: "Explain why this is an offline Gemma 4 survival system, not a chatbot.",
      },
    ],
  },
  {
    id: "phase-6-survival-node",
    title: "Phase 6: Survival Node Roadmap",
    focus: "Keep host mode and heavy package distribution as P1/P2 after MVP value is clear.",
    tasks: [
      {
        id: "phase-6-hotspot-web",
        priority: "P1",
        title: "Hotspot/local web host",
        note: "One phone or Linux device hosts a page reachable through IP/QR.",
      },
      {
        id: "phase-6-linux-runner",
        priority: "P1",
        title: "Linux barebone runner",
        note: "CLI/webserver prototype for survival node vision.",
      },
      {
        id: "phase-6-region-packs",
        priority: "P1",
        title: "Region-priority packs",
        note: "Example: flood-priority Jakarta/Sumatra pack.",
      },
      {
        id: "phase-6-compression",
        priority: "P2",
        title: "Compression/split package",
        note: "Optimize app/model/knowledge transfer later.",
      },
    ],
  },
];

