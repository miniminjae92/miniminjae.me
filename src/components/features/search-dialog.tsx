// src/components/search/search-dialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { getAllPostsDesc } from "@/lib/posts";

const allPosts = getAllPostsDesc();

const searchStyles = {
  // Trigger button
  triggerButton:
    "p-2 rounded-full text-heading transition hover:bg-selection hover:text-heading cursor-pointer",

  // Dim + blur background (backdrop layer, z-40)
  backdrop: "fixed inset-0 z-40 bg-page/50",

  // Centered layer for the dialog (z-50)
  layer:
    "z-50 fixed w-[600px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  // Dialog container (card)
  dialog:
    "h-full flex flex-col rounded-xl border border-border bg-page shadow-2xl shadow-black/40 overflow-hidden text-sm text-body",

  // Header row of the dialog
  header: "flex items-center gap-4 px-3 py-3 border-b border-border/60",

  // Search icon in the header
  headerIcon: "w-5 h-5 text-second",

  // Text input field
  input: "flex-1 text-[14px] text-heading outline-none placeholder:text-second",

  // Scrollable results region with fixed height
  resultsContainer: "flex-1 overflow-y-auto p-2",

  // Wrapper when there are no results / no query
  emptyWrapper: "flex h-full justify-center p-2",

  // Text for empty states
  emptyText: "text-sm text-second",

  // Section label (e.g. “Posts”)
  sectionLabel: "px-2 py-1 text-[11px] font-medium text-second",

  // Single result row container
  resultItem:
    "group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-selection cursor-pointer",

  // Result title text
  resultTitle: "text-sm text-body truncate group-hover:text-heading",

  // Result description text
  // resultDescription: "mt-0.5 text-[11px] text-second",

  // Footer row at the bottom of the dialog
  footer:
    "flex justify-end px-4 py-2 border-t border-border text-[10px] text-second",
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
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
      {/* trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={searchStyles.triggerButton}
        aria-label="Open search dialog"
      >
        <FiSearch className="w-4 h-4" />
      </button>

      {!open ? null : (
        <>
          {/* backdrop layer (click to close) */}
          <div
            className={searchStyles.backdrop}
            onClick={() => setOpen(false)}
          />

          {/* dialog layer */}
          <div className={searchStyles.layer}>
            <div
              className={searchStyles.dialog}
              role="dialog"
              aria-modal="true"
            >
              {/* header */}
              <div className={searchStyles.header}>
                <FiSearch className={searchStyles.headerIcon} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  className={searchStyles.input}
                />
              </div>

              {/* results area - fixed height, always scrollable */}
              <div className={searchStyles.resultsContainer}>
                {results.length === 0 && query.length === 0 && (
                  <div className={searchStyles.emptyWrapper}>
                    <p className={searchStyles.emptyText}>Type to search.</p>
                  </div>
                )}

                {results.length === 0 && query.length > 0 && (
                  <div className={searchStyles.emptyWrapper}>
                    <p className={searchStyles.emptyText}>No results found.</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-1">
                    <p className={searchStyles.sectionLabel}>Posts</p>

                    {results.map((post) => (
                      <Link
                        key={`${post.type}-${post.slug}`}
                        href={post.permalink}
                        onClick={() => setOpen(false)}
                        className={searchStyles.resultItem}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={searchStyles.resultTitle}>
                            {post.title}
                          </p>
                          {/* {post.description && ( */}
                          {/*   <p className={searchStyles.resultDescription}> */}
                          {/*     {post.description} */}
                          {/*   </p> */}
                          {/* )} */}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* footer */}
              <div className={searchStyles.footer}>Search by minjae.log</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
