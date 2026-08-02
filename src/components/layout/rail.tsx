// src/components/layout/rail.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RailProps {
  children: ReactNode;
  className?: string;
}

/**
 * 사이트 전체를 관통하는 좌표축.
 *
 * 세계수를 그리지 않고 레이아웃으로 만든다. 페이지를 옮겨도 좌표계가
 * 바뀌지 않으므로 같은 문서 안에서 이동한 감각이 남는다 — 라우트가
 * 나뉘어 있어도 하나의 사이트로 읽히는 이유가 이것이다.
 *
 * 세로선은 Rail 하나가 소유한다. 섹션마다 따로 그리면 여백에서 끊겨
 * 좌표축이 아니라 장식으로 읽힌다.
 */
export function Rail({ children, className }: RailProps) {
  return <div className={cn("rail", className)}>{children}</div>;
}

interface RailSectionProps {
  /** 거터에 놓이는 좌표. 한글 라벨. */
  label?: ReactNode;
  /** 영문 보조 라벨. 라틴/숫자라 한 단계 작게 둔다. */
  sublabel?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 거터에 라벨 하나, 오른쪽에 본문.
 *
 * 위계를 크기가 아니라 거터에서 만든다. 본문이 전부 같은 크기여도
 * 왼쪽 열만 세로로 훑으면 목차를 다 읽은 것이 된다. 타입 스케일이
 * text-lg에서 멈춰 있는 채로 스캔 가능성을 얻는 방법이다.
 */
export function RailSection({
  label,
  sublabel,
  children,
  className,
}: RailSectionProps) {
  return (
    <section className={cn("relative", className)}>
      {label ? (
        <p className="rail-label text-xs leading-6 text-disabled">
          {label}
          {sublabel ? (
            <span className="block text-2xs tracking-wide uppercase">
              {sublabel}
            </span>
          ) : null}
        </p>
      ) : null}
      {children}
    </section>
  );
}
