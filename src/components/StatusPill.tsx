import type { TaskStatus } from "@/lib/scope-data";

const LABEL: Record<TaskStatus, string> = {
  not_started: "Not done",
  in_progress: "In progress",
  done: "Done",
};

const STYLES: Record<TaskStatus, string> = {
  not_started: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
  in_progress: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  done: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
};

export function StatusPill({ value }: { value: TaskStatus }) {
  return (
    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", STYLES[value]].join(" ")}>
      {LABEL[value]}
    </span>
  );
}
