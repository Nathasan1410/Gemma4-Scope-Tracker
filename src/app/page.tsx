"use client";

import { useEffect, useMemo, useState } from "react";
import type { Section, Task, TaskStatus } from "@/lib/scope-data";
import { SECTIONS } from "@/lib/scope-data";
import { DEV_PHASES } from "@/lib/dev-phases";
import { loadStoredState, saveStoredState } from "@/lib/storage";
import type { Report } from "@/lib/reports";
import { ScopeCard } from "@/components/ScopeCard";
import { SegmentAccordion } from "@/components/SegmentAccordion";
import { ProjectBriefAccordion } from "@/components/ProjectBriefAccordion";
import { MarkdownBlock } from "@/components/MarkdownBlock";

type TrackerTab = "roadmap" | "phases" | "reports" | "changelog" | "resources";
type SyncMode = "loading" | "local" | "shared";

function buildDefaultStatusMap(sections: Section[]) {
  const map: Record<string, TaskStatus> = {};
  for (const s of sections) for (const t of s.tasks) map[t.id] = t.defaultStatus ?? "not_started";
  return map;
}

function filterTasks(tasks: Task[], opts: { showAllPriorities: boolean }) {
  if (opts.showAllPriorities) return tasks.filter((t) => t.priority !== "CUT");
  return tasks.filter((t) => t.priority === "P0");
}

type ChangelogEntry = {
  id: string; // usually date
  date: string; // YYYY-MM-DD
  title?: string;
  summary: string;
  sections: {
    added: string[];
    changed: string[];
    removed: string[];
    notes: string[];
  };
};

type ResourceItem = {
  id: string;
  title: string;
  subtitle: string;
};

const RESOURCE_ITEMS: ResourceItem[] = [
  { id: "brand", title: "Brand Guidelines", subtitle: "Swara naming, tone, messaging, and visual direction." },
  { id: "project-brief", title: "Project Brief", subtitle: "Short product summary and demo flow." },
  { id: "prd", title: "PRD", subtitle: "Product requirements doc (bloated, but canonical context)." },
  { id: "scope", title: "Roadmap Scope", subtitle: "Human-readable mirror of Roadmap Progress tab." },
  { id: "dev-phases", title: "Dev Phases", subtitle: "Human-readable mirror of Development Phases tab." },
  { id: "tracker-changelog", title: "Tracker Changelog", subtitle: "History of tracker content changes." },
  { id: "project-knowledge", title: "Project Knowledge", subtitle: "Decisions, MVP scope, and how this repo works." },
  { id: "package-strategy", title: "Package Strategy", subtitle: "Package types + MVP share/import vs roadmap robustness." },
  { id: "special-tracks", title: "Special Tracks", subtitle: "LiteRT primary; Unsloth optional; host-node tracks roadmap." },
  { id: "technical-depth", title: "Technical Depth", subtitle: "Why this is not just a chatbot; innovation rationale." },
  { id: "model-runtime", title: "Model Runtime", subtitle: "Model selection, quantization targets, and honest runtime state." },
  { id: "knowledge-strategy", title: "Knowledge Strategy", subtitle: "Survival pack categories, region priority, survival book." },
  { id: "glossary", title: "Glossary", subtitle: "Terms: LiteRT, LoRA, quantization, packs, host mode, etc." },
];

function parseChangelog(md: string): ChangelogEntry[] {
  const lines = md.split(/\r?\n/);
  const entries: ChangelogEntry[] = [];

  let current: ChangelogEntry | null = null;
  let currentSection: keyof ChangelogEntry["sections"] | null = null;

  const pushCurrent = () => {
    if (!current) return;
    // derive a one-line summary from the first non-empty bullet across sections
    const first =
      current.sections.added[0] ??
      current.sections.changed[0] ??
      current.sections.removed[0] ??
      current.sections.notes[0] ??
      "";
    const summary = (current.title && current.title.trim().length > 0 ? current.title.trim() : first.trim()) || "Update";
    current.summary = summary;
    entries.push(current);
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) continue;

    const h2 = line.match(/^##\s+(\d{4}-\d{2}-\d{2})(?:\s+(.*))?$/);
    if (h2) {
      pushCurrent();
      current = {
        id: h2[1],
        date: h2[1],
        title: h2[2]?.trim() || undefined,
        summary: "",
        sections: { added: [], changed: [], removed: [], notes: [] },
      };
      currentSection = null;
      continue;
    }

    if (!current) continue;

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      const label = h3[1].toLowerCase();
      if (label.includes("added")) currentSection = "added";
      else if (label.includes("changed")) currentSection = "changed";
      else if (label.includes("removed")) currentSection = "removed";
      else currentSection = "notes";
      continue;
    }

    const bullet = line.match(/^-+\s+(.*)$/);
    if (bullet) {
      const text = bullet[1].trim();
      const target = currentSection ?? "notes";
      current.sections[target].push(text);
      continue;
    }
  }

  pushCurrent();

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackerTab>("roadmap");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(SECTIONS[0]?.id ?? "");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(DEV_PHASES[0]?.id ?? "");
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [reportSaveStatus, setReportSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);
  const [selectedChangelogId, setSelectedChangelogId] = useState<string>("");
  const [selectedResourceId, setSelectedResourceId] = useState<string>(RESOURCE_ITEMS[0]?.id ?? "");
  const [resourceMd, setResourceMd] = useState<string>("");
  const [resourceLoaded, setResourceLoaded] = useState(false);
  const [showAllPriorities, setShowAllPriorities] = useState(false);
  const [syncMode, setSyncMode] = useState<SyncMode>("loading");
  const [statusById, setStatusById] = useState<Record<string, TaskStatus>>(() =>
    buildDefaultStatusMap([...SECTIONS, ...DEV_PHASES]),
  );

  useEffect(() => {
    const stored = loadStoredState();
    if (stored) {
      // Loading persisted client state on mount is a legitimate effect; keep it simple for this personal tracker.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatusById((prev) => ({ ...prev, ...stored.taskStatusById }));
    }

    let cancelled = false;

    async function loadSharedState() {
      try {
        const response = await fetch("/api/tracker-state", {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          mode?: "local" | "shared";
          state?: { taskStatusById?: Record<string, TaskStatus>; reports?: Report[] } | null;
        };

        if (cancelled) return;

        setSyncMode(data.mode === "shared" ? "shared" : "local");
        if (data.state?.taskStatusById) {
          setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
        }
        if (data.state?.reports) {
          setReports(data.state.reports);
          setSelectedReportId((prev) => prev || data.state!.reports?.[0]?.id || "");
        }
      } catch {
        if (!cancelled) setSyncMode("local");
      }
    }

    void loadSharedState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/tracker-changelog", { cache: "no-store" });
        const md = await res.text();
        if (cancelled) return;
        const parsed = parseChangelog(md);
        setChangelogEntries(parsed);
        setSelectedChangelogId((prev) => prev || parsed[0]?.id || "");
      } catch {
        if (!cancelled) setChangelogEntries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "resources") return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResourceLoaded(false);
    (async () => {
      try {
        const res = await fetch(`/api/resource?id=${encodeURIComponent(selectedResourceId)}`, { cache: "no-store" });
        const md = await res.text();
        if (!cancelled) setResourceMd(md);
      } catch {
        if (!cancelled) setResourceMd("");
      } finally {
        if (!cancelled) setResourceLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedResourceId]);

  useEffect(() => {
    saveStoredState({ taskStatusById: statusById, updatedAt: new Date().toISOString() });
  }, [statusById]);

  useEffect(() => {
    if (syncMode !== "shared") return;

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch("/api/tracker-state", { cache: "no-store" });
        const data = (await response.json()) as {
          mode?: "local" | "shared";
          state?: { taskStatusById?: Record<string, TaskStatus>; reports?: Report[] } | null;
        };
        if (data.mode !== "shared" || !data.state) return;
        if (data.state.taskStatusById) {
          setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
        }
        if (data.state.reports) {
          setReports(data.state.reports);
        }
      } catch {
        // Keep current local state if the shared refresh fails.
      }
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [syncMode]);

  const activeSections = activeTab === "roadmap" ? SECTIONS : DEV_PHASES;
  const selectedSectionId = activeTab === "roadmap" ? selectedRoadmapId : selectedPhaseId;
  const setSelectedSectionId = activeTab === "roadmap" ? setSelectedRoadmapId : setSelectedPhaseId;
  const dataFile = activeTab === "roadmap" ? "src/lib/scope-data.ts" : "src/lib/dev-phases.ts";

  const selectedSection = useMemo(
    () => activeSections.find((s) => s.id === selectedSectionId) ?? activeSections[0],
    [activeSections, selectedSectionId],
  );

  const visibleTasks = useMemo(() => {
    if (!selectedSection) return [];
    return filterTasks(selectedSection.tasks, { showAllPriorities });
  }, [selectedSection, showAllPriorities]);

  const tasksByStatus = useMemo(() => {
    const notStarted: Task[] = [];
    const inProgress: Task[] = [];
    const done: Task[] = [];

    for (const t of visibleTasks) {
      const st = statusById[t.id] ?? "not_started";
      if (st === "done") done.push(t);
      else if (st === "in_progress") inProgress.push(t);
      else notStarted.push(t);
    }

    const sorter = (a: Task, b: Task) => a.title.localeCompare(b.title);
    notStarted.sort(sorter);
    inProgress.sort(sorter);
    done.sort(sorter);

    return { notStarted, inProgress, done };
  }, [visibleTasks, statusById]);

  function pushReportToShared(report: Report) {
    if (syncMode !== "shared") return;
    setReportSaveStatus("saving");
    void fetch("/api/tracker-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ report }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as {
          state?: { taskStatusById?: Record<string, TaskStatus>; reports?: Report[] } | null;
        };
      })
      .then((data) => {
        if (!data?.state) return;
        if (data.state.taskStatusById) {
          setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
        }
        if (data.state.reports) {
          setReports(data.state.reports);
        }
        setReportSaveStatus("saved");
      })
      .catch(() => {
        setReportSaveStatus("error");
      });
  }

  function updateTaskStatus(taskId: string, next: TaskStatus) {
    setStatusById((prev) => ({ ...prev, [taskId]: next }));

    if (syncMode !== "shared") return;

    void fetch("/api/tracker-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, status: next }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as {
          state?: { taskStatusById?: Record<string, TaskStatus> } | null;
        };
      })
      .then((data) => {
        if (!data?.state?.taskStatusById) return;
        setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
      })
      .catch(() => {
        // Keep local state if shared sync fails.
      });
  }

  function createNewReport() {
    const iso = new Date().toISOString();
    const date = iso.slice(0, 10);
    const id = `rep_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const title = `Report ${date}`;
    const next: Report = {
      id,
      title,
      md: `# ${title}\n\n- `,
      createdAt: iso,
      updatedAt: iso,
    };
    setReports((prev) => [next, ...prev]);
    setSelectedReportId(id);
    pushReportToShared(next);
  }

  function updateReport(reportId: string, patch: { title?: string; md?: string }) {
    const nowIso = new Date().toISOString();
    let nextReport: Report | null = null;
    setReports((prev) => {
      const current = prev.find((r) => r.id === reportId);
      if (!current) return prev;
      nextReport = { ...current, ...patch, updatedAt: nowIso };
      return prev.map((r) => (r.id === reportId ? nextReport! : r));
    });
    if (nextReport) pushReportToShared(nextReport);
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_20%_-10%,#f4f4f5,transparent),radial-gradient(900px_500px_at_90%_0%,#e4e4e7,transparent),linear-gradient(to_bottom,#fafafa,#f4f4f5)]">
      <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col px-4 py-8">
        <header className="flex shrink-0 flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Scope Tracker</h1>
              <p className="mt-1 text-sm text-zinc-600">Roadmap and dev phases in one persistent tracker.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 rounded-full border border-zinc-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("roadmap")}
                  className={[
                    "h-8 rounded-full px-3 text-xs font-semibold transition",
                    activeTab === "roadmap" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                  ].join(" ")}
                  aria-pressed={activeTab === "roadmap"}
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("phases")}
                  className={[
                    "h-8 rounded-full px-3 text-xs font-semibold transition",
                    activeTab === "phases" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                  ].join(" ")}
                  aria-pressed={activeTab === "phases"}
                >
                  Phases
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("reports")}
                  className={[
                    "h-8 rounded-full px-3 text-xs font-semibold transition",
                    activeTab === "reports" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                  ].join(" ")}
                  aria-pressed={activeTab === "reports"}
                >
                  Reports
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("changelog")}
                  className={[
                    "h-8 rounded-full px-3 text-xs font-semibold transition",
                    activeTab === "changelog" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                  ].join(" ")}
                  aria-pressed={activeTab === "changelog"}
                >
                  Changelog
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("resources")}
                  className={[
                    "h-8 rounded-full px-3 text-xs font-semibold transition",
                    activeTab === "resources" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50",
                  ].join(" ")}
                  aria-pressed={activeTab === "resources"}
                >
                  Resource
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAllPriorities((v) => !v)}
                className={[
                  "h-9 rounded-full border px-3 text-xs font-semibold transition",
                  showAllPriorities
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
                ].join(" ")}
                aria-pressed={showAllPriorities}
              >
                {showAllPriorities ? "Showing: P0+P1+P2" : "Showing: P0 only"}
              </button>
              <span className="inline-flex h-9 items-center rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700">
                {syncMode === "loading" ? "Sync: checking" : syncMode === "shared" ? "Sync: shared" : "Sync: local"}
              </span>
            </div>
          </div>
        </header>

        <main className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <section className="min-h-0">
            <div className="h-full rounded-3xl border border-zinc-200 bg-white/60 p-3 backdrop-blur">
              <div className="h-full overflow-auto pr-1">
                {activeTab === "changelog" ? (
                  changelogEntries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                      No changelog entries yet. Edit <span className="font-medium text-zinc-900">TRACKER_CHANGELOG.md</span>.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {changelogEntries.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelectedChangelogId(e.id)}
                          className={[
                            "w-full rounded-2xl border p-4 text-left transition",
                            "bg-white hover:bg-zinc-50",
                            e.id === selectedChangelogId ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-zinc-900">{e.date}</div>
                              <div className="mt-1 text-xs leading-5 text-zinc-600">{e.summary}</div>
                            </div>
                            <div className="shrink-0 rounded-xl bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-white">
                              {e.sections.added.length + e.sections.changed.length + e.sections.removed.length}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                ) : activeTab === "resources" ? (
                  <div className="grid gap-3">
                    {RESOURCE_ITEMS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedResourceId(r.id)}
                        className={[
                          "w-full rounded-2xl border p-4 text-left transition",
                          "bg-white hover:bg-zinc-50",
                          r.id === selectedResourceId ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200",
                        ].join(" ")}
                      >
                        <div className="text-sm font-semibold text-zinc-900">{r.title}</div>
                        <div className="mt-1 text-xs leading-5 text-zinc-600">{r.subtitle}</div>
                      </button>
                    ))}
                  </div>
                ) : activeTab === "reports" ? (
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3 px-1">
                      <div className="text-xs font-semibold text-zinc-700">Reports</div>
                      <button
                        type="button"
                        onClick={createNewReport}
                        className="h-9 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        + New
                      </button>
                    </div>

                    {reports.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                        No reports yet. Click <span className="font-medium text-zinc-900">+ New</span> to start one.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {reports.map((r) => {
                          const summary =
                            r.md
                              .split(/\r?\n/)
                              .map((l) => l.trim())
                              .find((l) => l.length > 0 && !l.startsWith("#")) ?? "Markdown report";
                          const shortDate = r.updatedAt.slice(0, 10);
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setSelectedReportId(r.id)}
                              className={[
                                "w-full rounded-2xl border p-4 text-left transition",
                                "bg-white hover:bg-zinc-50",
                                r.id === selectedReportId ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200",
                              ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-zinc-900">{r.title || "Untitled report"}</div>
                                  <div className="mt-1 text-xs leading-5 text-zinc-600">{summary}</div>
                                </div>
                                <div className="shrink-0 rounded-xl bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-white">
                                  {shortDate}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : activeSections.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                    No sections yet. Add them in <span className="font-medium text-zinc-900">{dataFile}</span>.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {activeSections.map((s) => (
                      <ScopeCard
                        key={s.id}
                        section={s}
                        selected={s.id === selectedSectionId}
                        statusById={statusById}
                        includeP1P2={showAllPriorities}
                        onClick={() => setSelectedSectionId(s.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="min-h-0">
            <div className="h-full overflow-auto rounded-3xl border border-zinc-200 bg-white/70 p-5 backdrop-blur">
              {activeTab === "changelog" ? (
                (() => {
                  const entry = changelogEntries.find((e) => e.id === selectedChangelogId) ?? changelogEntries[0];
                  if (!entry) {
                    return (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                        Pick a date on the left.
                      </div>
                    );
                  }

                  const SectionBlock = ({ title, items }: { title: string; items: string[] }) => {
                    if (items.length === 0) return null;
                    return (
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="text-sm font-semibold text-zinc-900">{title}</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                          {items.map((it, idx) => (
                            <li key={`${title}-${idx}`}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  };

                  return (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-zinc-900">{entry.date}</div>
                          <div className="mt-1 text-sm text-zinc-600">{entry.summary}</div>
                        </div>
                        <div className="shrink-0 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
                          {entry.sections.added.length + entry.sections.changed.length + entry.sections.removed.length} changes
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <SectionBlock title="Added" items={entry.sections.added} />
                        <SectionBlock title="Changed" items={entry.sections.changed} />
                        <SectionBlock title="Removed" items={entry.sections.removed} />
                        <SectionBlock title="Notes" items={entry.sections.notes} />
                      </div>
                    </>
                  );
                })()
              ) : activeTab === "resources" ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">
                        {RESOURCE_ITEMS.find((r) => r.id === selectedResourceId)?.title ?? "Resource"}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">
                        {RESOURCE_ITEMS.find((r) => r.id === selectedResourceId)?.subtitle ?? ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(resourceMd);
                        } catch {
                          // ignore
                        }
                      }}
                      className="h-9 shrink-0 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                    >
                      Copy page
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4">
                    {!resourceLoaded ? (
                      <div className="text-xs text-zinc-500">Loading…</div>
                    ) : resourceMd.trim().length === 0 ? (
                      <div className="text-sm text-zinc-600">Empty.</div>
                    ) : (
                      <MarkdownBlock md={resourceMd} />
                    )}
                  </div>
                </>
              ) : activeTab === "reports" ? (
                (() => {
                  const report = reports.find((r) => r.id === selectedReportId) ?? reports[0];
                  if (!report) {
                    return (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                        No reports yet. Create one from the left panel.
                      </div>
                    );
                  }

                  const statusLabel =
                    reportSaveStatus === "saving"
                      ? "Syncing…"
                      : reportSaveStatus === "saved"
                        ? "Synced"
                        : reportSaveStatus === "error"
                          ? "Sync failed"
                          : "Not synced";

                  return (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <input
                            value={report.title}
                            onChange={(e) => updateReport(report.id, { title: e.target.value })}
                            placeholder="Report title"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                          />
                          <div className="mt-1 text-xs text-zinc-500">
                            Updated {report.updatedAt.slice(0, 19).replace("T", " ")}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
                            {statusLabel}
                          </span>
                          <button
                            type="button"
                            onClick={createNewReport}
                            className="h-9 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                          >
                            + New
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(report.md);
                              } catch {
                                // ignore
                              }
                            }}
                            className="h-9 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                          >
                            Copy MD
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                          <div className="text-xs font-semibold text-zinc-700">Write</div>
                          <textarea
                            value={report.md}
                            onChange={(e) => updateReport(report.id, { md: e.target.value })}
                            className="mt-3 min-h-[340px] w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-xs text-zinc-900 outline-none focus:border-zinc-900"
                            placeholder={"# What’s done so far\n\n- Shipped …\n- Fixed …\n- Next: …"}
                          />
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                          <div className="text-xs font-semibold text-zinc-700">Preview</div>
                          <div className="mt-3">
                            {report.md.trim().length === 0 ? (
                              <div className="text-sm text-zinc-600">Empty.</div>
                            ) : (
                              <MarkdownBlock md={report.md} />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : !selectedSection ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                  Pick a section on the left (or add one in <span className="font-medium text-zinc-900">{dataFile}</span>).
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-semibold text-zinc-900">{selectedSection.title}</div>
                    <div className="text-sm text-zinc-600">{selectedSection.focus}</div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ProjectBriefAccordion />
                    <SegmentAccordion
                      title="Not done yet"
                      status="not_started"
                      tasks={tasksByStatus.notStarted}
                      contextTitle={selectedSection.title}
                      statusById={statusById}
                      defaultOpen
                      onChangeTaskStatus={updateTaskStatus}
                    />
                    <SegmentAccordion
                      title="On progress"
                      status="in_progress"
                      tasks={tasksByStatus.inProgress}
                      contextTitle={selectedSection.title}
                      statusById={statusById}
                      onChangeTaskStatus={updateTaskStatus}
                    />
                    <SegmentAccordion
                      title="Completed"
                      status="done"
                      tasks={tasksByStatus.done}
                      contextTitle={selectedSection.title}
                      statusById={statusById}
                      onChangeTaskStatus={updateTaskStatus}
                    />
                  </div>
                </>
              )}

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
