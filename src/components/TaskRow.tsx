import type { Task, TaskStatus } from "@/lib/scope-data";
import { PriorityPill } from "@/components/PriorityPill";

const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not done",
  in_progress: "In progress",
  done: "Done",
};

export function TaskRow({
  task,
  status,
  onChangeStatus,
}: {
  task: Task;
  status: TaskStatus;
  onChangeStatus: (next: TaskStatus) => void;
}) {
  const muted = task.priority === "CUT";

  return (
    <div
      className={[
        "flex items-start justify-between gap-3 rounded-xl border px-3 py-3",
        muted ? "border-zinc-200 bg-zinc-50" : "border-zinc-200 bg-white",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className={["text-sm font-semibold", muted ? "text-zinc-600" : "text-zinc-900"].join(" ")}>
            {task.title}
          </div>
          <PriorityPill value={task.priority} />
        </div>
        <div className={["mt-1 text-xs leading-5", muted ? "text-zinc-500" : "text-zinc-600"].join(" ")}>
          {task.note}
        </div>
      </div>

      <div className="shrink-0">
        <label className="sr-only" htmlFor={`status-${task.id}`}>
          Status
        </label>
        <select
          id={`status-${task.id}`}
          value={status}
          onChange={(e) => onChangeStatus(e.target.value as TaskStatus)}
          className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-900 shadow-sm hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
        >
          <option value="not_started">{STATUS_LABEL.not_started}</option>
          <option value="in_progress">{STATUS_LABEL.in_progress}</option>
          <option value="done">{STATUS_LABEL.done}</option>
        </select>
      </div>
    </div>
  );
}

