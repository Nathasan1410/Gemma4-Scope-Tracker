# Project Knowledge (So Far)

This file is the quick "what are we building and how do we run it" note for Swara + the tracker repo.

## Product

Brand name: Swara

Swara is an offline-first emergency guidance and distribution system powered by Gemma 4, designed for the first critical hours (first 72 hours) of a disaster when networks and services can be unavailable or overloaded.

Core idea:

- One device is one clear emergency voice.
- Many nearby devices become redundancy: one voice -> many voices -> a resilient local network.
- Sharing and distribution is a core feature, not a side feature.

Swara is not a replacement for emergency services. It is meant to keep guidance alive until help arrives.

## Key Decisions From Planning

- Distribution is MVP scope. Users must be able to share/import a model package (robust transfer is roadmap).
- Survival Book is a primary mode (usable without AI), not just a fallback.
- Category buttons select relevant knowledge scope (they do not switch between different models).
- Linux/Raspberry Pi/local host mode is an official strategic direction for Survival Node (partial/roadmap).
- Unsloth / fine-tuned SLM is a P1 story/experiment and not a blocker for MVP.
- Voice input, TTS, and NFC are roadmap (not ignored).
- English-first demo is MVP. Indonesian/localization is partial/roadmap.

## MVP Lock (Six Blocks)

- App: emergency UI + category buttons + survival book.
- Runtime: Gemma 4 runs locally on phone, works offline (airplane mode demo).
- SLM behavior: prompt templates + structured emergency output.
- Knowledge: bundled survival/SOP pack; survival book works without AI.
- Distribution: visible share/import path for response → survival pack → app shell → model pack (robustness is roadmap).
- Proof: demo script + eval cases + benchmarks + device specs + technical writeup.

## Distribution Hierarchy (Concept)

Swara shares and distributes in layers:

1. Response (single generated answer + structured steps)
2. Survival pack (offline knowledge bundle)
3. App shell (UI + logic without the model)
4. Model pack (on-device model runtime package; MVP includes share/import path)
5. Host node (future Survival Node mode: LAN/hotspot/local web host)

## This Repo (Scope Tracker App)

This repo is the planning tool used by the team to keep scope and execution aligned.

It is a Next.js single-page tracker with:

- Roadmap tab: feature-by-feature scope.
- Phases tab: step-by-step execution phases.
- Reports tab: quick Markdown reports of what’s done so far (shared sync when enabled).
- Changelog tab: tracker change history (dates + details).
- Resource tab: reads markdown resources and provides a Copy Page button.

Each task has:

- status dropdown: Not done / In progress / Done
- expandable brief panel (Markdown)
  - if `briefMd` exists, it shows that
  - if missing, it generates a default brief from task fields and context

## Where To Edit Data

- Roadmap scope data: `src/lib/scope-data.ts` (`SECTIONS`)
- Development phases data: `src/lib/dev-phases.ts` (`DEV_PHASES`)
- Tracker changelog source: `TRACKER_CHANGELOG.md`
- Resources list is hardcoded in: `src/app/page.tsx`

Task rules:

- keep `task.id` stable, because persistence uses task ids

## Persistence / Sync

Local persistence:

- browser localStorage key: `scope-tracker:v1` (`src/lib/storage.ts`)

Shared sync (two-person sync):

- API: `src/app/api/tracker-state/route.ts`
- Uses Vercel Blob snapshots when `BLOB_READ_WRITE_TOKEN` exists in the deployed Vercel project.
- UI shows `Sync: shared` or `Sync: local`.

## Brand / Messaging

The merged brand guide (lore + rules) lives in `BRAND_GUIDELINES.md`.

Naming rule:

- product name is Swara
- Gemma is referenced as technology attribution ("Powered by Gemma 4"), not the product name

## How To Run Locally

```powershell
cd C:\Nael-Hackathon\Scope-Tracker
npm install
npm run dev
```
