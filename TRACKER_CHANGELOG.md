# Tracker Changelog

This file tracks changes to the tracker content and tracker behavior over time.

Use this especially when:

- adding a new section
- removing a section
- adding a task
- removing a task
- moving a task between roadmap and phases
- changing task meaning in a way that affects planning

## 2026-05-06

### Added

- Initial roadmap tracker based on the emergency app PRD.
- `Roadmap Progress` tab backed by `src/lib/scope-data.ts`.
- `Development Phases` tab backed by `src/lib/dev-phases.ts`.
- Per-task brief accordion with Markdown support.
- Generated fallback brief for every task when `briefMd` is not provided.
- Shared sync mode design using `/api/tracker-state` with Vercel Blob as the shared store.
- `DEV_PHASES.md` as the human-readable mirror for the phase tab.
- `BRAND_GUIDELINES.md` for the Swara brand direction.

### Changed

- Tracker layout changed from one flat scope view into two planning views:
  - feature roadmap
  - execution phases
- Project-level brief support was added through `public/brief.md`.
- Task rows now support both short note and expandable implementation brief.

### Notes

- Roadmap data remains the source of truth for feature scope.
- Development phase data is the source of truth for step-by-step execution order.
- Shared sync requires Vercel Blob configuration in the deployed project before it works across devices.

