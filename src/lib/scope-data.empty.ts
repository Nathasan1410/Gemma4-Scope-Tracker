export type Priority = "P0" | "P1" | "P2" | "CUT";

export type TaskStatus = "not_started" | "in_progress" | "done";

export type Task = {
  id: string; // must be stable; used as localStorage key
  title: string;
  note: string;
  priority: Priority;
};

export type Section = {
  id: string; // must be stable; used for left-side selection
  title: string;
  focus: string;
  tasks: Task[];
};

// Barebone template: intentionally empty.
// To start from scratch, either:
// 1) Replace src/lib/scope-data.ts with this file's content, or
// 2) Change src/app/page.tsx to import from "@/lib/scope-data.empty".
export const SECTIONS: Section[] = [];

