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
  /**
   * 거터에 놓이는 좌표. 영문 단독으로 쓴다.
   *
   * 한글+영문 병기를 쓰다가 영문만 남겼다. 거터는 좌표를 놓는 자리이지
   * 읽는 자리가 아니라, 한 칸에 두 줄이 들어가면 좌표가 아니라 캡션이 된다.
   * 라틴만 남으니 tracking 을 조금 벌려야 같은 크기에서 읽힌다.
   */
  label?: ReactNode;
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
export function RailSection({ label, children, className }: RailSectionProps) {
  return (
    <section className={cn("relative", className)}>
      {label ? (
        <p className="rail-label text-xs leading-6 tracking-wide text-disabled">
          {label}
        </p>
      ) : null}
      {children}
    </section>
  );
}
