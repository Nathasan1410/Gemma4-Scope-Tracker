"use client";

import { useEffect, useState } from "react";
import { MarkdownBlock } from "@/components/MarkdownBlock";

export function ProjectBriefAccordion({
  title = "Project brief",
  defaultOpen,
}: {
  title?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(() => Boolean(defaultOpen));
  const [md, setMd] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/brief.md", { cache: "no-store" });
        const text = await res.text();
        if (!cancelled) setMd(text);
      } catch {
        if (!cancelled) setMd("");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
      >
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <span className="text-xs font-medium text-zinc-500">{open ? "Collapse" : "Expand"}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
            {!loaded ? (
              <div className="text-xs text-zinc-500">Loading…</div>
            ) : md.trim().length === 0 ? (
              <div className="text-xs text-zinc-500">
                Empty. Edit <span className="font-medium text-zinc-700">public/brief.md</span>.
              </div>
            ) : (
              <MarkdownBlock md={md} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
