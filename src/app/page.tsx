"use client";

import { useEffect, useMemo, useState } from "react";
import type { Section, Task, TaskStatus } from "@/lib/scope-data";
import { SECTIONS } from "@/lib/scope-data";
import { DEV_PHASES } from "@/lib/dev-phases";
import { loadStoredState, saveStoredState } from "@/lib/storage";
import { ScopeCard } from "@/components/ScopeCard";
import { SegmentAccordion } from "@/components/SegmentAccordion";
import { ProjectBriefAccordion } from "@/components/ProjectBriefAccordion";
import { TrackerChangelogAccordion } from "@/components/TrackerChangelogAccordion";

type TrackerTab = "roadmap" | "phases";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackerTab>("roadmap");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(SECTIONS[0]?.id ?? "");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(DEV_PHASES[0]?.id ?? "");
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
          state?: { taskStatusById?: Record<string, TaskStatus> } | null;
        };

        if (cancelled) return;

        setSyncMode(data.mode === "shared" ? "shared" : "local");
        if (data.state?.taskStatusById) {
          setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
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
    saveStoredState({ taskStatusById: statusById, updatedAt: new Date().toISOString() });
  }, [statusById]);

  useEffect(() => {
    if (syncMode !== "shared") return;

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch("/api/tracker-state", { cache: "no-store" });
        const data = (await response.json()) as {
          mode?: "local" | "shared";
          state?: { taskStatusById?: Record<string, TaskStatus> } | null;
        };
        if (data.mode !== "shared" || !data.state?.taskStatusById) return;
        setStatusById((prev) => ({ ...prev, ...data.state!.taskStatusById }));
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
                {activeSections.length === 0 ? (
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
              {!selectedSection ? (
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
                    <TrackerChangelogAccordion />
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

              <footer className="mt-8 text-xs text-zinc-500">
                Stored locally in your browser (`localStorage`). No accounts, no server.
              </footer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
