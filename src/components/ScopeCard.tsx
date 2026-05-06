import type { Section, Task, TaskStatus } from "@/lib/scope-data";

function countDone(tasks: Task[], statusById: Record<string, TaskStatus>, opts: { includeP1P2: boolean }) {
  const filtered = tasks.filter((t) => {
    if (t.priority === "CUT") return false;
    if (!opts.includeP1P2) return t.priority === "P0";
    return true;
  });

  const total = filtered.length;
  const done = filtered.filter((t) => statusById[t.id] === "done").length;
  return { done, total };
}

export function ScopeCard({
  section,
  selected,
  statusById,
  includeP1P2,
  onClick,
}: {
  section: Section;
  selected: boolean;
  statusById: Record<string, TaskStatus>;
  includeP1P2: boolean;
  onClick: () => void;
}) {
  const { done, total } = countDone(section.tasks, statusById, { includeP1P2 });

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative w-full rounded-2xl border p-4 text-left transition",
        "bg-white hover:bg-zinc-50",
        selected ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900">{section.title}</div>
          <div className="mt-1 text-xs leading-5 text-zinc-600">{section.focus}</div>
        </div>
        <div className="shrink-0 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white">
          {done}/{total}
        </div>
      </div>
      <div className="pointer-events-none mt-3 h-px w-full bg-zinc-100" />
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span className="truncate">{includeP1P2 ? "KPI: P0+P1+P2" : "KPI: P0 only"}</span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100">Open</span>
      </div>
    </button>
  );
}
