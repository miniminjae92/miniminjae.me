// components/search-dialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { insights, memos } from "#site/content";
import { FiSearch } from "react-icons/fi";

type Insight = (typeof insights)[number];
type Memo = (typeof memos)[number];
type AnyPost = Insight | Memo;

const allPosts: AnyPost[] = [...insights, ...memos].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allPosts.filter((post) => {
      const text =
        `${post.title} ${post.description ?? ""} ${post.tags.join(" ")}`.toLowerCase();
      return text.includes(q);
    });
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-heading hover:text-heading hover:bg-gray-100 transition"
      >
        <FiSearch className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="mx-auto mt-24 w-full max-w-xl rounded-xl border border-border bg-page p-4 shadow-lg">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 태그, 키워드로 검색해 보세요..."
                className="flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-second"
              />
              <span className="rounded border border-border px-2 py-0.5 text-[10px] text-second">
                ESC
              </span>
            </div>

            <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
              {results.length === 0 ? (
                <p className="px-2 py-3 text-xs text-second">
                  검색 결과가 없습니다.
                </p>
              ) : (
                results.map((post) => (
                  <Link
                    key={`${post.type}-${post.slug}`}
                    href={post.permalink}
                    onClick={() => setOpen(false)}
                    className="group block rounded-md px-3 py-2 text-sm text-second transition
                                     hover:bg-page/80 hover:text-heading"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-heading group-hover:text-heading">
                        {post.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-second">
                        {post.type}
                      </span>
                    </div>
                    {post.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-second">
                        {post.description}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
