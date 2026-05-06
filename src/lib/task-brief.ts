import type { Priority, Task } from "@/lib/scope-data";

const PRIORITY_MEANING: Record<Priority, string> = {
  P0: "MVP-critical. This should be finished before the demo is considered stable.",
  P1: "Nice-to-have. Do this only after the core offline survival loop is reliable.",
  P2: "Roadmap or writeup material. Useful for vision, but not a blocker for MVP.",
  CUT: "Out of scope for now. Keep this visible so the team does not accidentally spend time on it.",
};

const NEXT_ACTION: Record<Priority, string> = {
  P0: "Turn this into a small, testable deliverable and update the status as soon as the demo path works.",
  P1: "Leave it in backlog unless the P0 flow is already working end to end.",
  P2: "Capture the idea in docs or roadmap; implementation can wait.",
  CUT: "Do not implement during MVP unless the scope is explicitly reopened.",
};

export function buildTaskBriefMd(task: Task, contextTitle: string) {
  return `
## ${task.title}

**Context:** ${contextTitle}

**Priority:** ${task.priority} - ${PRIORITY_MEANING[task.priority]}

## What this means

${task.note}

## Why it matters

GemmaAid is scoped around a 72-hour disaster scenario where internet, cloud AI, and emergency services may be unavailable or overloaded. This item should be judged by whether it helps the offline survival loop, the sharing/distribution loop, or the proof package.

## Done when

- The output is visible in the app, demo, docs, evals, or benchmark package.
- The team can explain why it belongs in the MVP or roadmap.
- The status in this tracker matches the current implementation reality.

## Next action

${NEXT_ACTION[task.priority]}
  `.trim();
}

