// src/app/insight/page.tsx
import Link from "next/link";
import { insights } from "#site/content";

const sortedInsights = [...insights].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function InsightIndexPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Insight</h1>
        <p className="text-sm text-neutral-400">
          정제된 지식을 정리하고 이해를 깊게 만드는 공간
        </p>
      </header>

      <ul className="space-y-3">
        {sortedInsights.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.permalink}
              className="block rounded-md border border-neutral-900 bg-neutral-900/40 px-4 py-3 text-sm transition hover:border-neutral-500 hover:bg-neutral-800/60"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-neutral-50">
                  {post.title}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </span>
              </div>
              {post.description && (
                <p className="mt-1 text-xs text-neutral-400">
                  {post.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
