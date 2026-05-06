<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Scope Tracker (Project Instructions)

Repo root: `C:\Nael-Hackathon\Scope-Tracker`

## What This App Is

Single-page project tracker:

- Left: list of section cards (each shows KPI `done/total`)
- Right: segmented accordion (Not done yet / On progress / Completed)
- Each task has a status dropdown that auto-saves instantly (no save button)

## Where To Edit Data

- Main data file: `src/lib/scope-data.ts`
  - Edit `export const SECTIONS` to add/remove sections and tasks.
  - Keep `task.id` stable; local persistence keys use task ids.
- Human-readable mirror: `SCOPE.md`
  - Optional; keep in sync with `scope-data.ts` for non-dev editing.

## Project Brief Markdown

- Edit `public/brief.md`
  - This renders inside the "Project brief" dropdown accordion.
  - Images in markdown should reference files in `public/` via absolute paths, e.g. `![Alt](/my-image.png)`.

## Persistence

- Stored in browser `localStorage` under key `scope-tracker:v1` (see `src/lib/storage.ts`).
- If you rename task ids, users will "lose" status for those tasks (because keys changed).

## Barebone / Empty Version

If you want a version with no scope data yet:

- Template file: `src/lib/scope-data.empty.ts`
- Use it by either copying it over `src/lib/scope-data.ts`, or changing the import in `src/app/page.tsx` to `@/lib/scope-data.empty`.
