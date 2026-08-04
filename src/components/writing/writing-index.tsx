"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: items.length };
    for (const lens of LENSES) {
      result[lens.key] = items.filter((item) => item.lens === lens.key).length;
    }
    return result;
  }, [items]);

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
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={cn(
                  "cursor-pointer rounded px-2 py-1 text-sm transition-colors hover:bg-selection",
                  filter === key
                    ? "font-semibold text-heading"
                    : "text-second hover:text-heading",
                )}
              >
                {label}{" "}
                <span className="text-2xs text-disabled tabular-nums">
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="min-h-6 text-sm text-second">
          {active ? active.description : "지금까지 남긴 기록 전부"}
        </p>
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
