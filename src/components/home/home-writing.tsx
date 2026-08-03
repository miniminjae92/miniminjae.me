// src/components/home/home-writing.tsx
import Link from "next/link";
import { LENSES } from "@/config/lens";
import { formatPostDateShort } from "@/lib/date";
import { PostContent } from "@/types/content";

/**
 * 렌즈별 최신 글.
 *
 * 기존 category-links 의 "형제를 흐리는" 인터랙션을 그대로 계승하되,
 * Insight / Memo / Log 대신 Understand / Solve / Reflect 로 부른다.
 * URL 은 그대로다 — 라벨만 바뀐 것이다.
 */
export function HomeWriting({
  postsByLens,
}: {
  postsByLens: Record<string, PostContent[]>;
}) {
  return (
    <div className="group/list space-y-8">
      {LENSES.map((lens) => {
        const posts = postsByLens[lens.key] ?? [];
        if (posts.length === 0) return null;

        return (
          <div
            key={lens.key}
            className="transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-heading">{lens.label}</p>
              <p className="shrink-0 text-2xs text-disabled tabular-nums">
                {posts.length}
              </p>
            </div>
            <p className="mb-2 text-xs text-second">{lens.description}</p>

            <ul>
              {posts.slice(0, 3).map((post) => (
                <li key={post.slug}>
                  <Link
                    href={post.permalink}
                    className="flex items-baseline justify-between gap-4 py-1 text-sm"
                  >
                    <span className="text-body hover:text-heading">
                      {post.title}
                    </span>
                    <span className="shrink-0 text-xs text-second tabular-nums">
                      {formatPostDateShort(post.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
