import type { TaskStatus } from "@/lib/scope-data";

const STORAGE_KEY = "scope-tracker:v1";

export type StoredState = {
  taskStatusById: Record<string, TaskStatus>;
  updatedAt: string; // ISO
};

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "not_started" || value === "in_progress" || value === "done";
}

export function loadStoredState(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const obj = parsed as { taskStatusById?: unknown; updatedAt?: unknown };
    if (!obj.taskStatusById || typeof obj.taskStatusById !== "object") return null;

    const taskStatusById: Record<string, TaskStatus> = {};
    for (const [k, v] of Object.entries(obj.taskStatusById as Record<string, unknown>)) {
      if (isTaskStatus(v)) taskStatusById[k] = v;
    }

    const updatedAt = typeof obj.updatedAt === "string" ? obj.updatedAt : new Date(0).toISOString();
    return { taskStatusById, updatedAt };
  } catch {
    return null;
  }
}

export function saveStoredState(state: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/security errors; this is a tiny personal tracker.
  }
}

