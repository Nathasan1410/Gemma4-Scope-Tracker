<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Scope Tracker (Project Instructions)

Repo root: `C:\Nael-Hackathon\Scope-Tracker`

## What This App Is

Single-page project tracker:

- Tab 1: **Roadmap Progress** sourced from `src/lib/scope-data.ts`
- Tab 2: **Development Phases** sourced from `src/lib/dev-phases.ts`
- Each tab shows section cards + segmented accordion (Not done yet / On progress / Completed)
- Each task has a status dropdown that auto-saves instantly (no save button)

## Where To Edit Data

- Roadmap tab data: `src/lib/scope-data.ts`
  - Edit `export const SECTIONS` to add/remove roadmap sections and tasks.
  - Per-task detail markdown: set `task.briefMd` (optional) on each task.
  - If `briefMd` is missing, the UI generates a default PRD-aware brief from task title, note, priority, and section.
  - Human-readable mirror: `SCOPE.md` (optional, keep in sync).
- Development Phases tab data: `src/lib/dev-phases.ts`
  - Edit `export const DEV_PHASES` to add/remove phase sections and tasks.
  - Per-task detail markdown: set `task.briefMd` (optional) on each task.
  - If `briefMd` is missing, the UI generates a default PRD-aware brief from task title, note, priority, and phase.
  - Human-readable mirror: `DEV_PHASES.md` (optional, keep in sync).
- Keep every `task.id` stable across both files; local persistence keys use task ids.
- When roadmap or phase content changes, update `TRACKER_CHANGELOG.md` with the added/removed/moved tasks.

## Project Brief Markdown

- Edit `public/brief.md`
  - This renders inside the "Project brief" dropdown accordion.
  - Images in markdown should reference files in `public/` via absolute paths, e.g. `![Alt](/my-image.png)`.

## Persistence

- Stored in browser `localStorage` under key `scope-tracker:v1` (see `src/lib/storage.ts`).
- If you rename task ids, users will "lose" status for those tasks (because keys changed).
- When `BLOB_READ_WRITE_TOKEN` is present in the deployed Vercel project, `/api/tracker-state` enables shared state across devices using Vercel Blob snapshots.

## Barebone / Empty Version

If you want a version with no scope data yet:

- Template file: `src/lib/scope-data.empty.ts`
- Use it by either copying it over `src/lib/scope-data.ts`, or changing the import in `src/app/page.tsx` to `@/lib/scope-data.empty`.
