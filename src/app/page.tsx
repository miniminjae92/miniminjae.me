import Link from "next/link";
import { insights, memos } from "#site/content";

type Insight = (typeof insights)[number];
type Memo = (typeof memos)[number];
type AnyPost = Insight | Memo;

function sortByDateDesc(a: AnyPost, b: AnyPost) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export default function HomePage() {
  const latest: AnyPost[] = [...insights, ...memos]
    .sort(sortByDateDesc)
    .slice(0, 6);

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-sm text-second">Minjae Kang</p>

        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Insight / Memo 를 쌓아가는 블로그
        </h1>

        <p className="text-sm text-second">
          공부하면서 떠오른 생각(Insight)과 짧은 메모(Memo)를 정리하는 공간.
        </p>
      </header>

      {/* Latest Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-second">
          Latest
        </h2>

        <div className="space-y-2">
          {latest.map((post) => (
            <Link
              key={`${post.type}-${post.slug}`}
              href={post.permalink}
              className="block rounded-lg border border-border bg-page/60 px-4 py-3 text-sm transition
                         hover:border-heading hover:bg-page/80"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wide text-second">
                  {post.type}
                </span>

                <span className="text-[11px] text-second">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </span>
              </div>

              <p className="mt-1 font-medium text-heading">{post.title}</p>

              {post.description && (
                <p className="mt-1 text-xs text-second">{post.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
