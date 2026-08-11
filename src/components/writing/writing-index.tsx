"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LENSES, WritingLens } from "@/config/lens";
import { formatArchiveDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { PostSummary } from "@/types/content";

/**
 * 렌즈 필터.
 *
 * 서버가 { title, permalink, date, lens } 만 담은 경량 배열을 넘긴다.
 * 컴파일된 MDX 는 클라이언트 번들에 들어오지 않는다. 이건 사이트 내비게이션이
 * 아니라 필터라서 헤더 nav 와 다른 컴포넌트로 둔다.
 *
 * 상태를 useState 가 아니라 ?lens= 에 둔다. 글 하단 알약형 내비가 여기로
 * 들어오기 때문에 필터가 링크로 열려야 한다.
 */
type Filter = WritingLens | "all";

function groupByYear(items: PostSummary[]): [string, PostSummary[]][] {
  const groups = new Map<string, PostSummary[]>();

  for (const item of items) {
    const year = item.date.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) bucket.push(item);
    else groups.set(year, [item]);
  }

  return [...groups.entries()];
}

export function WritingIndex({ items }: { items: PostSummary[] }) {
  const router = useRouter();
  const param = useSearchParams().get("lens");

  const filter: Filter = LENSES.some((lens) => lens.key === param)
    ? (param as WritingLens)
    : "all";

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.lens === filter)),
    [items, filter],
  );

  const active = LENSES.find((lens) => lens.key === filter);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-x-1">
          {(["all", ...LENSES.map((l) => l.key)] as Filter[]).map((key) => {
            const label =
              key === "all"
                ? "All"
                : LENSES.find((lens) => lens.key === key)!.label;

            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  router.replace(
                    key === "all" ? "/writing" : `/writing?lens=${key}`,
                    { scroll: false },
                  )
                }
                aria-pressed={filter === key}
                className={cn(
                  "cursor-pointer rounded px-2 py-1 text-sm transition-colors hover:bg-selection",
                  filter === key
                    ? "font-semibold text-heading"
                    : "text-second hover:text-heading",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 렌즈를 눌렀을 때만 뜻을 밝힌다. All 일 때 자리를 채우던 문장은
            헤더 설명문과 같은 말이라 걷어냈다. min-h-6 는 남긴다 — 없애면
            렌즈를 누를 때 아래 목록이 24px 튄다. */}
        <p className="min-h-6 text-sm text-second">{active?.description}</p>
      </div>

      <div className="group/list space-y-8">
        {groupByYear(visible).map(([year, entries]) => (
          <div key={year} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-disabled tabular-nums">{year}</span>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>

            {entries.map((item) => (
              <Link
                key={item.permalink}
                href={item.permalink}
                className="flex items-baseline justify-between gap-4 py-1 transition-opacity duration-300 group-hover/list:opacity-(--dim) hover:!opacity-100"
              >
                <span className="text-body hover:text-heading">
                  {item.title}
                </span>
                <span className="shrink-0 text-xs text-second tabular-nums">
                  {formatArchiveDate(item.date)}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
