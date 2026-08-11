"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPostDateShort } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { TagInfo } from "@/lib/tags";

/**
 * 태그 필터의 인터랙션 부분만 클라이언트로 내린다.
 *
 * 이전에는 페이지 전체가 "use client" 인 채 getAllTags() 를 호출했다.
 * 그러면 #site/content 모듈 전체가 클라이언트 번들에 딸려 들어간다.
 * 데이터는 서버에서 만들고 여기는 props 로 받는다.
 */
export function TagCloud({ tags }: { tags: [string, TagInfo][] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const postsForSelected =
    selectedTag == null
      ? []
      : (tags.find(([tag]) => tag === selectedTag)?.[1].posts ?? []);

  return (
    <div className="space-y-8">
      {/* 칩에 글 수를 붙이지 않는다. 태그 15개 중 13개가 1이라 거의 모든
          칩에 같은 숫자가 달렸다. info.count 는 남는다 — 칩 정렬이 빈도
          내림차순이고 그 기준이 이 값이다. */}
      <div className="flex flex-wrap gap-2">
        {tags.map(([tag]) => {
          const active = tag === selectedTag;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedTag(active ? null : tag)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors",
                active
                  ? "border-heading text-heading"
                  : "border-border text-second hover:border-heading hover:text-heading",
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {selectedTag ? (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-heading">
            “{selectedTag}” 태그가 달린 글
          </h2>

          <ul className="group/list">
            {postsForSelected.map((post) => (
              <li key={`${post.type}-${post.slug}`}>
                <Link
                  href={post.permalink}
                  className="flex items-baseline justify-between gap-3 py-1.5 text-sm transition-opacity duration-300 group-hover/list:opacity-(--dim) hover:!opacity-100"
                >
                  <span className="flex-1 truncate text-body hover:text-heading">
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
      ) : null}
    </div>
  );
}
