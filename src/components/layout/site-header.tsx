// src/components/layout/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import { SearchDialog } from "../features/search-dialog";
import { TagsButton } from "../ui/tags-button";
import { isNavItemActive, NAV_ITEMS } from "@/config/navigation";
import { SITE_NAME } from "@/config/site-metadata";
import { cn } from "@/lib/utils";
import { PostSummary } from "@/types/content";

/**
 * 헤더가 섹션 내비게이션의 유일한 주인이다.
 *
 * 이전에는 헤더에 섹션 링크가 아예 없고 ArchiveNav 가 페이지 본문 안에서
 * 그 역할을 대신했다. 상세 페이지에서는 두 번 렌더되기까지 했다.
 *
 * 항목이 세 개뿐이라 모바일에서 drawer 를 만들지 않는다. 두 줄로 접는다.
 * 재사용할 만한 메뉴 프리미티브도 저장소에 없다.
 */
export function SiteHeader({ searchIndex }: { searchIndex: PostSummary[] }) {
  const pathname = usePathname();

  return (
    <header className="space-y-2 py-1">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-heading"
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="주요 메뉴" className="hidden sm:block">
          <ul className="flex items-center gap-x-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    isNavItemActive(pathname, item.href) ? "page" : undefined
                  }
                  className={cn(
                    "rounded px-2 py-1 text-sm transition-colors hover:bg-selection",
                    isNavItemActive(pathname, item.href)
                      ? "font-semibold text-heading"
                      : "text-second hover:text-heading",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <SearchDialog items={searchIndex} />
          <TagsButton />
          <ThemeToggle />
        </div>
      </div>

      {/* 모바일: 두 번째 줄로 내린다. */}
      <nav aria-label="주요 메뉴" className="sm:hidden">
        <ul className="flex items-center gap-x-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={
                  isNavItemActive(pathname, item.href) ? "page" : undefined
                }
                className={cn(
                  "rounded px-2 py-1 text-sm transition-colors hover:bg-selection",
                  isNavItemActive(pathname, item.href)
                    ? "font-semibold text-heading"
                    : "text-second",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
