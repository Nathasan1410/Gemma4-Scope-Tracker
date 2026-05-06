import type { Task, TaskStatus } from "@/lib/scope-data";
import { PriorityPill } from "@/components/PriorityPill";
import { MarkdownBlock } from "@/components/MarkdownBlock";
import { useState } from "react";
import { buildTaskBriefMd } from "@/lib/task-brief";

const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not done",
  in_progress: "In progress",
  done: "Done",
};

export function TaskRow({
  task,
  contextTitle,
  status,
  onChangeStatus,
}: {
  task: Task;
  contextTitle: string;
  status: TaskStatus;
  onChangeStatus: (next: TaskStatus) => void;
}) {
  const muted = task.priority === "CUT";
  const [openBrief, setOpenBrief] = useState(false);
  const briefMd = task.briefMd?.trim() || buildTaskBriefMd(task, contextTitle);

  return (
    <div
      className={[
        "rounded-xl border px-3 py-3",
        muted ? "border-zinc-200 bg-zinc-50" : "border-zinc-200 bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
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

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpenBrief((v) => !v)}
          className={[
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
            "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
          ].join(" ")}
          aria-expanded={openBrief}
          aria-controls={`brief-${task.id}`}
        >
          {openBrief ? "Hide brief" : "Show brief"}
          <span className="text-zinc-500">MD</span>
        </button>
      </div>

      {openBrief ? (
        <div id={`brief-${task.id}`} className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
          <MarkdownBlock md={briefMd} />
        </div>
      ) : null}
    </div>
  );
}
