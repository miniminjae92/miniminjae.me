// src/components/about/about-timeline.tsx
import { formatPeriod } from "@/lib/date";
import { TimelineEntry, TimelineKind } from "@/types/content";

/**
 * 항목 종류. 자격증이 사는 자리가 여기다.
 *
 * 키는 영문, 표시는 한글이다 — config/lens.ts 와 같은 규칙. 종류가 섞인
 * 타임라인은 경력 전환자에게 흔한 모양이고, 마커가 없으면 교육과 자격과
 * 경력이 한 덩어리로 읽힌다.
 */
const KIND_LABEL: Record<TimelineKind, string> = {
  education: "교육",
  certification: "자격",
  work: "경력",
  project: "프로젝트",
};

/**
 * 시간축은 이 사이트에서 유일하게 살아남은 "진짜 시각화"다.
 *
 * 관계 그래프는 노드가 모자라 비어 보이고, 활동 밀도 스트립은 공백 개월을
 * 정밀하게 렌더링하고, 스킬 게이지는 분모가 없다. 반면 날짜는 모든 항목에
 * 있고 스키마로 검증되고 쓸수록 좋아진다.
 *
 * 연도 마커를 반드시 그린다. 눈금 없는 축은 축으로 읽히지 않는다.
 */
function groupByYear(items: TimelineEntry[]): [string, TimelineEntry[]][] {
  const sorted = [...items].sort((a, b) => b.start.localeCompare(a.start));
  const groups = new Map<string, TimelineEntry[]>();

  for (const item of sorted) {
    const year = item.start.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) bucket.push(item);
    else groups.set(year, [item]);
  }

  return [...groups.entries()];
}

export function AboutTimeline({ items }: { items: TimelineEntry[] }) {
  if (items.length === 0) return null;

  return (
    <div className="group/list space-y-8">
      {groupByYear(items).map(([year, entries]) => (
        <div key={year} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-disabled tabular-nums">{year}</span>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>

          {entries.map((entry) => (
            <div
              key={`${year}-${entry.label}-${entry.start}`}
              className="transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="flex flex-wrap items-baseline gap-x-2 text-body">
                  <span>{entry.label}</span>
                  {entry.kind ? (
                    <span className="text-2xs text-disabled">
                      {KIND_LABEL[entry.kind]}
                    </span>
                  ) : null}
                </p>
                <p className="shrink-0 text-xs text-second tabular-nums">
                  {formatPeriod(entry.start, entry.end)}
                </p>
              </div>
              {entry.note ? (
                <p className="text-sm text-second">{entry.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
