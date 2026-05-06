"use client";

import type { Task, TaskStatus } from "@/lib/scope-data";
import { StatusPill } from "@/components/StatusPill";
import { TaskRow } from "@/components/TaskRow";
import { useState } from "react";

export function SegmentAccordion({
  title,
  status,
  tasks,
  contextTitle,
  statusById,
  defaultOpen,
  onChangeTaskStatus,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  contextTitle: string;
  statusById: Record<string, TaskStatus>;
  defaultOpen?: boolean;
  onChangeTaskStatus: (taskId: string, next: TaskStatus) => void;
}) {
  const [open, setOpen] = useState<boolean>(() => Boolean(defaultOpen));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <StatusPill value={status} />
          <span className="text-xs font-medium text-zinc-500">{tasks.length}</span>
        </div>
        <span className="text-xs font-medium text-zinc-500">{open ? "Collapse" : "Expand"}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4">
          <div className="grid gap-2">
            {tasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 px-3 py-4 text-xs text-zinc-500">
                No tasks.
              </div>
            ) : (
              tasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                contextTitle={contextTitle}
                status={statusById[t.id] ?? "not_started"}
                onChangeStatus={(next) => onChangeTaskStatus(t.id, next)}
              />
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
