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
 * 1. 최상위 면에만 띄운다. root layout 에 마운트돼 모든 페이지에서 돌고
 *    있던 것을 홈으로 좁혔다가, /about·/portfolio·/writing 까지 넓혔다.
 *    상세 페이지(글, 프로젝트)는 제외한 채로 둔다 — 긴 본문은 읽는 면이라
 *    글자 위로 유체가 흐르면 읽기를 방해한다. 최상위 넷은 훑는 면이라
 *    사이트에 하나 있는 움직임을 여기에 몰아 둔다.
 * 2. prefers-reduced-motion 을 존중한다. CSS 미디어쿼리로는 WebGL 캔버스를
 *    막을 수 없어서 여기서 따로 게이팅해야 한다.
 * 3. 판정을 렌더 본문의 typeof window 대신 useSyncExternalStore 로 옮겼다.
 *    렌더 중 분기는 하이드레이션을 어긋나게 하고, effect + setState 는
 *    캐스케이딩 렌더를 만든다. 미디어쿼리는 외부 저장소로 다루는 게 맞고,
 *    덤으로 사용자가 OS 설정을 중간에 바꿔도 즉시 반영된다.
 */
/**
 * 커서를 띄우는 면. 정확히 일치하는 경로만이라, /portfolio/:slug 와 글
 * 상세는 자동으로 빠진다. 라우트가 늘면 여기에 명시적으로 추가해야 한다.
 */
const CURSOR_ROUTES = new Set(["/", "/about", "/portfolio", "/writing"]);

export function HomeCursor() {
  const pathname = usePathname();
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!CURSOR_ROUTES.has(pathname) || !enabled) return null;

  return <SplashCursor TRANSPARENT={true} BACK_COLOR={{ r: 5, g: 5, b: 10 }} />;
}
