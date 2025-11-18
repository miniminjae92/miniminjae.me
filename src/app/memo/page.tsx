import Link from "next/link";
import { memos } from "#site/content";

const sortedMemos = [...memos].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function MemoIndexPage() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-heading">
          Memo
        </h1>
        <p className="text-sm text-second">
          바로 쓰고 바로 찾아보는 실용 정보 저장 공간
        </p>
      </header>

      {/* List */}
      <ul className="space-y-3">
        {sortedMemos.map((post) => (
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
