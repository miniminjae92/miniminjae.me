// src/components/portfolio/metric-list.tsx
import { cn } from "@/lib/utils";
import { ProjectMetric } from "@/types/content";

/**
 * 차트 라이브러리 없이 결과를 표현한다. 신규 토큰 0개, 신규 의존성 0개.
 *
 * 규칙 세 가지:
 * 1. value 는 문자열 그대로. "420ms → 180ms" 처럼 두 숫자를 다 보여주는 게
 *    막대 하나보다 정직하고 정보량이 크다.
 * 2. note(조건/분모) 없이 쓰지 않는다. "57% 개선"만 있고 무엇 대비인지
 *    없으면 그건 광고다. 이건 콘텐츠 규칙이라 여기서 강제하지 않고
 *    스키마 주석과 초안 mdx 에 적어 뒀다.
 * 3. metrics 가 비면 아무것도 렌더하지 않는다. 지금 세 항목 모두 비어 있고
 *    그게 정직한 상태다. 빈 3열 그리드를 보여주는 것보다 낫다.
 */
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

export function MetricList({ metrics }: { metrics: ProjectMetric[] }) {
  if (metrics.length === 0) return null;

  const columns = Math.min(metrics.length, 3);

  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-8 border-y border-border py-8",
        GRID_COLS[columns],
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1">
          <dt className="text-xs text-disabled">{metric.label}</dt>
          <dd className="text-lg text-heading tabular-nums">{metric.value}</dd>
          {metric.note ? (
            <dd className="text-xs text-second">{metric.note}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
