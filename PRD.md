# PRD - Swara (Powered by Gemma 4)

This PRD is intentionally broad. The tracker tabs exist to keep execution focused while preserving this as canonical context.

## 0. Retrieval Audit Summary

This document is a revision after re-checking scope notes and team discussion. Key corrections:

1. Core thesis clarified: built for the first 72 hours of a disaster when internet and emergency services may be unavailable, overloaded, or unusable.
2. Call-help is not a mandatory output block: the app may mention seeking help if available, but MVP must not depend on emergency services being reachable.
3. Survival book mode is not only an automatic fallback: it is a standalone primary mode for low-storage / no-model usage.
4. Distribution is a main feature: sharing app, model package, survival pack, response, QR, hotspot/local access is a core value proposition.
5. Host mode is vision/P1, not core P0: mobile demo stays primary; Linux/webserver/Raspberry Pi-like node is strong roadmap.
6. Emergency router is not multi-model routing: MVP uses category/knowledge selection, not Cactus-style routing across multiple models.
7. SLM/fine-tuning is an experiment/story path: can be tried 3-8 hours if time allows, but prompt-only mode is MVP-safe.
8. Cactus skipped for now: we do not want multi-model routing; focus on one main model, Gemma 4 E2B-it.
9. LiteRT is primary special track: mobile/on-device/offline is core.
10. English-first demo; Indonesian/localization partial/roadmap: international hackathon, but localization remains an impact story.

## 1. Product Summary

- Working name: Swara (concept phrase: Gema Swara)
- Product type: Offline-first emergency survival assistant + disaster distribution system
- Core model: Gemma 4 E2B-it
- Primary runtime target: LiteRT / mobile on-device runtime
- Primary special track: LiteRT
- Secondary optional tracks: Unsloth experiment, llama.cpp/Linux roadmap
- Skipped special track: Cactus unless real multi-model routing exists

Swara is a 100% offline emergency survival assistant powered by Gemma 4. It is designed for the first 72 hours of a disaster, when internet connectivity, cell networks, electricity, and emergency services may be unavailable, overloaded, or unreachable.

The MVP is not just "Gemma 4 running on a phone." The MVP is a mobile-first survival system where one device can:

1. run Gemma 4 locally;
2. provide structured emergency/survival instructions;
3. open a static survival book without model inference;
4. share responses, app shell, model package, or survival pack through offline-friendly flows;
5. demonstrate airplane-mode functionality;
6. provide enough benchmark/eval/writeup evidence for technical judging.

### MVP Statement

> A 100% offline mobile emergency assistant running Gemma 4 locally, with structured survival responses, bundled survival knowledge, survival-book mode, and QR/local sharing of guidance and packages to nearby users.

### Vision Statement

> Turn phones and low-cost Linux devices into shareable offline survival nodes that distribute AI-guided emergency knowledge during the first 72 hours of a disaster.

### One-Sentence Pitch

> Swara turns a phone into a shareable emergency voice, running Gemma 4 fully offline to provide structured survival guidance and distribute emergency knowledge through QR, hotspot, and local package sharing when internet and emergency services are unavailable.

## 2. Background and Context

In major emergencies, normal assumptions fail:

- internet may be unavailable;
- mobile networks may be overloaded;
- electricity may be limited;
- emergency services may be unreachable;
- people may panic and need short, actionable instructions;
- cloud AI tools may not work;
- one working phone or local device may need to help multiple people nearby.

This product is built around the idea that emergency AI should not depend on the cloud. It should run locally, degrade gracefully, and be shareable.

Two layers:

1. AI guidance layer - Gemma 4 E2B-it running locally for emergency instructions.
2. Survival distribution layer - static survival book, app/model/survival-pack sharing, QR/local transfer, and future hotspot/Linux host mode.

## 3. Problem Statement

During the first 72 hours of a disaster, many people need reliable survival guidance but cannot depend on internet access, cloud AI, or emergency hotlines. Existing emergency apps often assume connectivity or reachable services. Swara solves this by making emergency guidance local, lightweight, and shareable.

The problem is not only "how do we answer emergency questions?" but also:

> How can one working device distribute emergency knowledge to nearby people when networks are down?

## 4. Product Thesis

### Core Thesis

Gemma 4 E2B-it can act as a local emergency instruction-following model on mobile/edge devices. Combined with an offline survival pack and QR/local distribution, it can become a practical survival node for disaster scenarios.

### What Makes This Different

Not a normal chatbot:

- runs offline;
- uses category-based emergency flows;
- produces structured survival outputs;
- includes survival book mode without AI;
- supports sharing app/response/model/survival pack;
- can evolve into Linux/Raspberry Pi-like host nodes.

Not a replacement for emergency services:

- designed for scenarios where services may be unavailable;
- if help is reachable, users can still seek help;
- core value is survival guidance when help cannot be reached.

## 5. Target Users

### 5.1 Primary Users

| User | Need |
| --- | --- |
| Civilian in emergency | Needs fast offline survival instructions. |
| Disaster survivor in first 72 hours | Needs guidance when internet/help is unavailable. |
| Community volunteer | Needs a tool to help others locally. |
| Person with one working phone | Needs to share instructions or app package to others. |

### 5.2 Secondary Users

| User | Need |
| --- | --- |
| Public facility operator | Wants future emergency node in mall, school, hospital, police post, office. |
| NGO/disaster response group | Wants offline survival packs for local regions. |
| Developer/maintainer | Wants to build region packs, Linux host mode, or fine-tuned model. |
| Hackathon judge | Needs proof that Gemma 4 is used meaningfully and the tech is real. |

## 6. Product Goals

### 6.1 MVP Goals

1. Run Gemma 4 E2B-it locally on a phone.
2. Work in airplane mode / no internet.
3. Provide emergency category selection.
4. Produce structured survival guidance.
5. Include survival book mode that works without AI.
6. Include local survival/SOP knowledge pack.
7. Share Gemma response via QR/text/file.
8. Share app shell and/or survival pack offline.
9. Attempt/model package sharing path if feasible.
10. Provide demo, benchmark, eval, and technical writeup.

### 6.2 Roadmap Goals

1. Linux/webserver host mode.
2. Raspberry Pi-like survival node vision.
3. Hotspot + QR access to local survival node.
4. Region-based survival packs.
5. Fine-tuned emergency SLM via LoRA/Unsloth.
6. llama.cpp/GGUF resource-constrained mode.
7. Voice input and text-to-speech.
8. Compression and split-package distribution.
9. Battery/thermal-aware mode.
10. Output validator.

## 7. Non-Goals for MVP

Not required for MVP:

1. Full cloud fallback.
2. Cactus-style multi-model routing.
3. Smaller fallback model.
4. Production-ready Raspberry Pi deployment.
5. Full automated safety validator.
6. NFC/tap production flow.
7. Printable emergency card.
8. Organization-specific SOP system.
9. Fully polished voice/TTS.
10. Ollama as the main runtime.

## 8. Product Principles

### 8.1 100% Offline First

The app must be demonstrable in airplane mode.

### 8.2 Survival Over Chat

Responses should be action-oriented, not conversational.

### 8.3 No Dependency on Emergency Services

The app can mention help if reachable, but MVP should not rely on emergency numbers or call-first workflows.

### 8.4 Shareability is Core

The product must help users spread instructions, survival packs, app shell, and eventually model packages.

### 8.5 Graceful Degradation

If the model cannot run, the app still works as a survival book. If full model sharing is too heavy, share survival pack first. If host mode is not ready, QR/text sharing still works.

### 8.6 Panic-Friendly UX

Large buttons, clear categories, short outputs, simple toggles.

### 8.7 Real Tech, Not Demo Theater

Repo/writeup must include benchmark, eval cases, device specs, prompt templates, runtime notes, and offline proof.

## 9. MVP Scope by Workstream (High Level)

This PRD's workstreams are tracked in:

- Roadmap Progress tab (feature scope)
- Development Phases tab (execution order)

Key workstreams:

- App Development
- Model Runtime Development
- SLM / Emergency Intelligence Development
- Knowledge Development
- Distribution Development
- Evaluation & Benchmark Development
- Product / Business / Writeup

## 10. Default Response Format

MVP format:

```text
RISK
Low / Medium / High / Unknown

SITUATION
Short summary of what the user is facing.

DO NOW
1. Immediate survival action.
2. Immediate survival action.
3. Immediate survival action.

DO NOT
1. Avoid this action.
2. Avoid this action.

NEXT QUESTION
Ask exactly one critical question.
```

Optional note, only when appropriate:

```text
IF HELP IS REACHABLE
Try to contact local emergency help or nearby trusted people. If not reachable, continue with the steps above.
```

## 11. Repository / Submission Structure (Target)

```text
/app
  mobile app source
  emergency UI
  survival book mode
  QR/text/file sharing

/model
  Gemma 4 runtime notes
  LiteRT notes
  quantization notes
  prompt templates

/knowledge
  survival_pack/
  categories/
  metadata.json

/distribution
  package_strategy.md
  app_shell_notes.md
  survival_pack_transfer.md
  model_pack_transfer_experiment.md

/evals
  emergency_test_cases.jsonl
  expected_outputs.jsonl
  safety_fail_cases.jsonl

/benchmarks
  offline.md
  latency.md
  device_specs.md
  memory.md
  battery.md

/docs
  PRD.md
  architecture.md
  technical_depth.md
  roadmap.md
  business_plan.md
  safety.md
  model_card.md

/demo
  script.md
  screenshots/
  video_notes.md
```

## 12. MVP Lock (Six Blocks)

The MVP has six blocks only:

| Block | MVP Output |
| --- | --- |
| App | Emergency UI + category buttons + survival book. |
| Runtime | Gemma 4 E2B-it runs offline on phone. |
| SLM Behavior | Prompt template + structured emergency/survival answer. |
| Knowledge | Local survival/SOP pack bundled offline. |
| Distribution | Share response + app/survival pack; model sharing experiment if feasible. |
| Proof | Demo video + benchmarks + eval cases + writeup. |

