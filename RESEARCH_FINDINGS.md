# Research Findings (Tracker + QR Payloads)

Date: 2026-05-08

This note captures what we changed in this repo, what we observed, and what we learned while aligning Swara knowledge + shared reporting.

## What We Changed (Repo)

- Added a **Reports** tab that supports quick Markdown reporting and is **shared-synced** via the existing `/api/tracker-state` Vercel Blob snapshot mechanism (same “Sync: shared/local” concept as task status).
- Updated Swara knowledge docs and exposed them through the **Resource** tab:
  - `PROJECT_KNOWLEDGE.md` (corrected MVP vs roadmap decisions)
  - `PACKAGE_STRATEGY.md`, `SPECIAL_TRACKS.md`, `TECHNICAL_DEPTH.md`, `MODEL_RUNTIME.md`, `KNOWLEDGE_STRATEGY.md`, `GLOSSARY.md`
- Updated the resource API map so these docs can be loaded in-app.

## What We Learned (Shared Sync)

- The tracker’s shared sync is “snapshot-based”: every update writes a new JSON blob, and clients poll to merge.
  - This keeps backend complexity low (no database), but updates are not “real-time” (poll interval based).
- Extending the shared state schema is the simplest way to share new collaborative features (like reports):
  - put it into the same shared state document,
  - merge/upsert on the server,
  - have clients fetch/poll and update local UI state.

## What We Learned (Git/Windows Environment)

- Git can fail in Windows environments even when file edits are fine:
  - “dubious ownership” can block git commands unless safe.directory is set (or commands pass a safe.directory override).
  - filesystem ACLs can block writes to `.git` (index lock creation) even if you can read the repo.
- The most reliable repair when `.git` is ACL-broken is to reset ACLs recursively for `.git` and then retry add/commit/push.

## QR Payload Reality Check (Why MD Feels “Big”)

- QR code capacity is limited and depends heavily on:
  - **version** (1–40, bigger symbol = more capacity),
  - **error correction level** (L/M/Q/H; higher resilience = lower capacity),
  - **encoding mode** (numeric/alphanumeric/byte).
- Markdown is not “heavy” by itself, but it encourages:
  - more characters (headings, bullets, blank lines),
  - and a richer structure that often increases payload length.
- For QR-only transfer, the dominant constraint is **bytes**, not “format name”.
  - A small, strict, plain-text schema often beats Markdown because it avoids extra punctuation/whitespace.

## Working Heuristics (Actionable)

- Prefer **short, structured plaintext** for QR payloads.
- If you must carry larger payloads:
  - split across multiple QR codes (sequence scanning),
  - or encode a compact binary payload and then use a QR-friendly text encoding.

