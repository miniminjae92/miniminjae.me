// src/components/search/search-dialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { getAllPostsDesc } from "@/lib/posts";
import { hoverStyles } from "@/lib/styles";

const allPosts = getAllPostsDesc();

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 단축키 & 스크롤 잠금 처리
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
        className={hoverStyles.full}
        aria-label="검색창 열기"
      >
        <FiSearch className="w-4 h-4" />
      </button>

      {open && (
        // 배경(Backdrop) 클릭 시 닫기, 박스 누르면 닫히지 않게 막음 (이벤트 전파 중단)
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          {/* 실제 검색창 박스 */}
          <div
            className="w-full max-w-xl rounded-xl border border-border bg-page p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="무엇을 찾고 계신가요?"
                className="flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-second/50"
              />
              <span className="hidden sm:inline-block rounded border border-border/60 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-second font-medium">
                ESC
              </span>
            </div>

            {/* 검색 결과 리스트 */}
            <div className="mt-3 max-h-[60vh] space-y-1 overflow-y-auto scrollbar-hide">
              {results.length === 0 && query.length > 0 ? (
                <p className="px-2 py-8 text-center text-xs text-second">
                  "{query}"에 대한 검색 결과가 없습니다.
                </p>
              ) : results.length === 0 ? (
                <p className="px-2 py-8 text-center text-xs text-second/70">
                  키워드를 입력해 보세요.
                </p>
              ) : (
                results.map((post) => (
                  <Link
                    key={`${post.type}-${post.slug}`}
                    href={post.permalink}
                    onClick={() => setOpen(false)}
                    className="group block rounded-md px-3 py-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-heading group-hover:text-primary truncate">
                        {post.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-second/80 border border-border rounded px-1.5 py-0.5">
                        {post.type}
                      </span>
                    </div>
                    {post.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-second group-hover:text-body">
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
