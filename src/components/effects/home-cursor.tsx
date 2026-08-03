"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const SplashCursor = dynamic(() => import("./splash-cursor-core"), {
  ssr: false,
});

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia(FINE_POINTER),
    window.matchMedia(REDUCED_MOTION),
  ];

  queries.forEach((query) => query.addEventListener("change", onChange));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", onChange));
}

function getSnapshot() {
  return (
    window.matchMedia(FINE_POINTER).matches &&
    !window.matchMedia(REDUCED_MOTION).matches
  );
}

/** 서버에서는 항상 꺼진 상태. dynamic 이 ssr:false 라 어차피 렌더되지 않는다. */
function getServerSnapshot() {
  return false;
}

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
 * 3. 판정을 렌더 본문의 typeof window 대신 useSyncExternalStore 로 옮겼다.
 *    렌더 중 분기는 하이드레이션을 어긋나게 하고, effect + setState 는
 *    캐스케이딩 렌더를 만든다. 미디어쿼리는 외부 저장소로 다루는 게 맞고,
 *    덤으로 사용자가 OS 설정을 중간에 바꿔도 즉시 반영된다.
 */
export function HomeCursor() {
  const pathname = usePathname();
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (pathname !== "/" || !enabled) return null;

  return <SplashCursor TRANSPARENT={true} BACK_COLOR={{ r: 5, g: 5, b: 10 }} />;
}
