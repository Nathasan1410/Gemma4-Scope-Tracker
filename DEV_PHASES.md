# Development Phases Data (Editable)

This file mirrors the **Development Phases** tab shown in the UI.

## Where This Lives In Code

- Phase data source (edit this to change this tab): [src/lib/dev-phases.ts](C:/Nael-Hackathon/Scope-Tracker/src/lib/dev-phases.ts)
  - `export const DEV_PHASES: Section[] = [...]`
- Per-task detail markdown: `task.briefMd` in each task object inside `DEV_PHASES`
- Other tab data source: [src/lib/scope-data.ts](C:/Nael-Hackathon/Scope-Tracker/src/lib/scope-data.ts) (`SECTIONS`)
- Project-level brief markdown: [public/brief.md](C:/Nael-Hackathon/Scope-Tracker/public/brief.md)

## Editing Notes

- Keep every `task.id` stable to preserve status persistence in local storage.
- Use `briefMd` for task-specific markdown content shown in task detail/brief UI.
