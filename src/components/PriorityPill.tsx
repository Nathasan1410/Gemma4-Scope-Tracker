import type { Priority } from "@/lib/scope-data";

const PRIORITY_STYLES: Record<Priority, string> = {
  P0: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  P1: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  P2: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  CUT: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
};

export function PriorityPill({ value }: { value: Priority }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        PRIORITY_STYLES[value],
      ].join(" ")}
    >
      {value}
    </span>
  );
}

