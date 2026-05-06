"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
              <article className="max-w-none text-sm text-zinc-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-base font-semibold text-zinc-900" {...props} />,
                    h2: (props) => <h2 className="mt-4 text-sm font-semibold text-zinc-900" {...props} />,
                    h3: (props) => <h3 className="mt-3 text-sm font-semibold text-zinc-900" {...props} />,
                    p: (props) => <p className="mt-2 leading-6" {...props} />,
                    ul: (props) => <ul className="mt-2 list-disc pl-5 leading-6" {...props} />,
                    ol: (props) => <ol className="mt-2 list-decimal pl-5 leading-6" {...props} />,
                    li: (props) => <li className="mt-1" {...props} />,
                    blockquote: (props) => (
                      <blockquote className="mt-3 border-l-2 border-zinc-300 pl-3 italic text-zinc-700" {...props} />
                    ),
                    code: ({ className, ...props }) => (
                      <code
                        className={[
                          "rounded bg-white px-1 py-0.5 font-mono text-xs text-zinc-900 ring-1 ring-zinc-200",
                          className ?? "",
                        ].join(" ")}
                        {...props}
                      />
                    ),
                    pre: (props) => (
                      <pre
                        className="mt-3 overflow-auto rounded-xl bg-white p-3 text-xs text-zinc-900 ring-1 ring-zinc-200"
                        {...props}
                      />
                    ),
                    a: (props) => <a className="font-medium text-zinc-900 underline underline-offset-2" {...props} />,
                    img: (props) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="mt-3 w-full rounded-xl border border-zinc-200 bg-white" {...props} alt={props.alt ?? ""} />
                    ),
                  }}
                >
                  {md}
                </ReactMarkdown>
              </article>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
