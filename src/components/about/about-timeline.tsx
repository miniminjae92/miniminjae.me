// src/components/about/about-timeline.tsx
import { formatDate } from "@/lib/date";
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

/* 날짜 열 너비. 축과 점의 가로 위치가 전부 이 값에서 파생되므로
   상수 하나로 묶는다 — "2025. 10" 이 꼭 맞게 들어가는 폭. 날짜가 왼쪽
   정렬이 되면서 열이 넓으면 날짜와 축 사이가 벌어져 따로 논다. */
const DATE_COL = "3.5rem";

/**
 * 날짜 · 축 · 내용.
 *
 * 축은 1px 헤어라인, 점은 5px 채운 원이다. 크고 속 빈 원은 장식으로
 * 읽혀서 기각됐다 — 구조 요소는 유지하되 가늘고 작게가 이 사이트의 결이다.
 * 날짜는 사이트 표기 규칙(yyyy. MM.)을 재사용한다. 새 규칙을 만들지 않는다.
 */
export function AboutTimeline({
  items,
  showKind = true,
}: {
  items: TimelineEntry[];
  /** 섹션 이름이 이미 종류를 말하면(예: Certifications) 끈다. */
  showKind?: boolean;
}) {
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <div className="group/list relative flex flex-col gap-6">
      <span
        aria-hidden
        className="absolute top-[5px] bottom-[5px] w-px bg-border"
        style={{ left: `calc(${DATE_COL} + 16px)` }}
      />

      {sorted.map((entry) => (
        <div
          key={`${entry.label}-${entry.start}`}
          className="relative grid grid-cols-[3.5rem_1fr] items-baseline gap-x-10 transition-opacity duration-300 group-hover/list:opacity-(--dim) hover:!opacity-100"
        >
          <span
            aria-hidden
            className="absolute top-[6px] size-[5px] rounded-full bg-disabled"
            style={{ left: `calc(${DATE_COL} + 14px)` }}
          />

          {/* 날짜는 섹션 왼쪽 기준선에 붙인다 — 제목·본문과 시작선을
              공유해야 열로 읽힌다. 축까지의 간격은 열 폭이 흡수한다. */}
          <span className="text-xs text-disabled tabular-nums">
            {formatDate(entry.start, "yyyy. MM")}
          </span>

          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-2 text-body">
              <span>{entry.label}</span>
              {showKind && entry.kind ? (
                <span className="text-2xs text-disabled">
                  {KIND_LABEL[entry.kind]}
                </span>
              ) : null}
            </p>
            {entry.note ? (
              <p className="text-sm text-second">{entry.note}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
