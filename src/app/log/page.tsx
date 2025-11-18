// src/app/log/page.tsx
import Link from "next/link";
import { logs } from "#site/content";

const sortedLogs = [...logs].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function LogIndexPage() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-heading">
          Log
        </h1>
        <p className="text-sm text-second">시간이 만든 나의 개발 일지</p>
      </header>

      {/* List */}
      <ul className="space-y-3">
        {sortedLogs.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.permalink}
              className="block rounded-md border border-border bg-page/60 px-4 py-3 text-sm transition 
                         hover:border-heading hover:bg-page/80"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-heading">{post.title}</span>

                <span className="text-[11px] text-second">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </span>
              </div>

              {post.description && (
                <p className="mt-1 text-xs text-second">{post.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
