"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SplashCursor = dynamic(() => import("./splash-cursor-core"), {
  ssr: false,
});

/**
 * WebGL 유체 커서.
 *
 * 세 가지가 바뀌었다.
 *
 * 1. 홈에만 띄운다. 이름은 HomeCursor 인데 root layout 에 마운트돼 모든
 *    페이지에서 돌고 있었다. 채용 담당자가 /about 을 열었을 때 자기소개서
 *    위로 유체가 흐르면 application-grade 로 읽히지 않는다.
 * 2. prefers-reduced-motion 을 존중한다. CSS 미디어쿼리로는 WebGL 캔버스를
 *    막을 수 없어서 여기서 따로 게이팅해야 한다.
 * 3. 판정을 렌더 본문이 아니라 effect 에서 한다. typeof window 로 렌더 중에
 *    분기하면 서버와 클라이언트 결과가 갈려 하이드레이션이 어긋난다.
 */
export function HomeCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setEnabled(finePointer && !reducedMotion);
  }, []);

  if (pathname !== "/" || !enabled) return null;

  return <SplashCursor TRANSPARENT={true} BACK_COLOR={{ r: 5, g: 5, b: 10 }} />;
}
