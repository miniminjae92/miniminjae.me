// app/tags/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArchiveNav } from "@/components/layout/archive-nav";
import { getAllTags } from "@/lib/tags";

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const tags = getAllTags();
  const postsForSelected =
    selectedTag == null
      ? []
      : (tags.find(([tag]) => tag === selectedTag)?.[1].posts ?? []);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-second">
          전체 글에서 태그를 모아 한 번에 볼 수 있습니다.
        </p>
        <ArchiveNav />
      </header>

      {/* 태그 리스트 */}
      <div className="flex flex-wrap gap-2">
        {tags.map(([tag, info]) => {
          const active = tag === selectedTag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(active ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs transition
                ${
                  active
                    ? "border-heading bg-page/80 text-heading"
                    : "border-border bg-page/40 text-second hover:border-heading hover:text-heading"
                }`}
            >
              {tag}
              <span className="ml-1 text-[10px] text-second/70">
                {info.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 선택된 태그의 글 목록 */}
      {selectedTag && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-heading">
            “{selectedTag}” 태그가 달린 글
          </h2>

          <div className="space-y-1">
            {postsForSelected.map((post) => (
              <Link
                key={`${post.type}-${post.slug}`}
                href={post.permalink}
                className="group flex items-baseline justify-between gap-3 rounded-md
                           px-3 py-2 text-sm text-second transition
                           hover:bg-page/80 hover:text-heading"
              >
                <span className="flex-1 truncate group-hover:text-heading">
                  {post.title}
                </span>
                <span className="text-[11px] text-second">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
