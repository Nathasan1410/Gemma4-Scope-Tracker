import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const RESOURCE_MAP: Record<string, string> = {
  brand: "BRAND_GUIDELINES.md",
  "project-brief": "public/brief.md",
  prd: "PRD.md",
  scope: "SCOPE.md",
  "dev-phases": "DEV_PHASES.md",
  "tracker-changelog": "TRACKER_CHANGELOG.md",
  "project-knowledge": "PROJECT_KNOWLEDGE.md",
  "package-strategy": "PACKAGE_STRATEGY.md",
  "special-tracks": "SPECIAL_TRACKS.md",
  "technical-depth": "TECHNICAL_DEPTH.md",
  "model-runtime": "MODEL_RUNTIME.md",
  "knowledge-strategy": "KNOWLEDGE_STRATEGY.md",
  glossary: "GLOSSARY.md",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const rel = RESOURCE_MAP[id];

  if (!rel) {
    return new NextResponse("", {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), rel);
    const md = await readFile(filePath, "utf8");
    return new NextResponse(md, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(`Failed to read resource ${id}`, error);
    return new NextResponse("", {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
