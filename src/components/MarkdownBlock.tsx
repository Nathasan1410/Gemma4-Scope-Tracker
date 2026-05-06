"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownBlock({ md }: { md: string }) {
  return (
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
            <pre className="mt-3 overflow-auto rounded-xl bg-white p-3 text-xs text-zinc-900 ring-1 ring-zinc-200" {...props} />
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
  );
}

