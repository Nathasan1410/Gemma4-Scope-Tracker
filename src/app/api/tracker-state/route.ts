import { get, list, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import type { TaskStatus } from "@/lib/scope-data";
import type { Report } from "@/lib/reports";

const TRACKER_STATE_PREFIX = "swara/tracker-state/";

type SharedState = {
  taskStatusById: Record<string, TaskStatus>;
  reports: Report[];
  updatedAt: string;
};

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readCurrentState() {
  const { blobs } = await list({ prefix: TRACKER_STATE_PREFIX, limit: 1000 });
  if (blobs.length === 0) return null;

  const latest = [...blobs].sort((a, b) => {
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  })[0];

  const result = await get(latest.pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  const raw = JSON.parse(text) as Partial<SharedState> | null;
  const parsed: SharedState = {
    taskStatusById: raw?.taskStatusById ?? {},
    reports: Array.isArray(raw?.reports) ? raw!.reports : [],
    updatedAt: raw?.updatedAt ?? new Date(0).toISOString(),
  };

  return {
    state: parsed,
  };
}

export async function GET() {
  if (!hasBlobToken()) {
    return NextResponse.json({ mode: "local", state: null });
  }

  try {
    const current = await readCurrentState();
    return NextResponse.json({ mode: "shared", state: current?.state ?? null });
  } catch (error) {
    console.error("Failed to read tracker state", error);
    return NextResponse.json({ mode: "shared", state: null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasBlobToken()) {
    return NextResponse.json({ mode: "local", state: null }, { status: 503 });
  }

  const body = (await request.json()) as {
    taskId?: string;
    status?: TaskStatus;
    report?: Report;
  };

  if ((!body.taskId || !body.status) && !body.report) {
    return NextResponse.json({ error: "Missing task update or report" }, { status: 400 });
  }

  try {
    const current = await readCurrentState();
    const nowIso = new Date().toISOString();
    const prevReports = Array.isArray(current?.state.reports) ? current?.state.reports : [];

    const nextReports = (() => {
      if (!body.report) return prevReports;
      const incoming = body.report;
      const idx = prevReports.findIndex((r) => r.id === incoming.id);
      const next = idx === -1 ? [incoming, ...prevReports] : prevReports.map((r) => (r.id === incoming.id ? incoming : r));
      return [...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    })();

    const nextState: SharedState = {
      taskStatusById: {
        ...(current?.state.taskStatusById ?? {}),
        ...(body.taskId && body.status ? { [body.taskId]: body.status } : {}),
      },
      reports: nextReports,
      updatedAt: nowIso,
    };

    const pathname = `${TRACKER_STATE_PREFIX}${Date.now()}.json`;
    await put(pathname, JSON.stringify(nextState, null, 2), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });

    return NextResponse.json({ mode: "shared", state: nextState });
  } catch (error) {
    console.error("Failed to write tracker state", error);
    return NextResponse.json({ error: "Failed to write shared tracker state" }, { status: 500 });
  }
}
