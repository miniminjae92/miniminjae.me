"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { CursorPalette } from "./cursor-palette";

/* 정적 import 로 바꾸지 말 것. 기본이 OFF 인 효과라, 이 분리가 없으면
   물감을 고르지 않은 방문자까지 WebGL 셰이더를 내려받는다. */
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

export type CursorEffectId = "light" | "medium" | "strong";

/**
 * 팔레트에 짜 놓은 물감. 서로 다른 효과가 아니라 **같은 물감의 농도**다.
 *
 * 유체 커서는 숫자 몇 개로 세기가 갈린다. 효과를 여러 종류 늘어놓는 것보다
 * 이쪽이 팔레트라는 은유에 맞는다 — 화가도 팔레트에서 물감을 묽게 타거나
 * 진하게 짠다. dab 은 팔레트 위 물감 덩어리의 겉모습이고, amount 는 그
 * 덩어리의 크기다.
 *
 * 값의 뜻:
 * - OPACITY / SATURATION — 화면에 남는 자국의 세기와 색기(色氣).
 * - DENSITY_DISSIPATION — 클수록 빨리 마른다. 옅은 쪽이 큰 값이다.
 * - SPLAT_RADIUS / SPLAT_FORCE — 한 번 스칠 때 번지는 크기와 밀어내는 힘.
 * - CURL — 소용돌이. 클수록 자국이 오래 꿈틀거린다.
 *
 * '보통'은 예전에 코드에 굳어 있던 값 그대로다.
 */
export const CURSOR_EFFECTS: {
  id: CursorEffectId;
  name: string;
  dab: string;
  /** 팔레트 위 물감 덩어리 지름(px). 농도가 곧 양으로 보이게 한다. */
  amount: number;
  params: {
    OPACITY: number;
    SATURATION: number;
    DENSITY_DISSIPATION: number;
    SPLAT_RADIUS: number;
    SPLAT_FORCE: number;
    CURL: number;
  };
}[] = [
  {
    id: "light",
    name: "묽게",
    dab: "radial-gradient(circle at 34% 28%, #d8d8d8, #9a9a9a 76%)",
    amount: 22,
    params: {
      OPACITY: 0.09,
      SATURATION: 0,
      DENSITY_DISSIPATION: 5.5,
      SPLAT_RADIUS: 0.14,
      SPLAT_FORCE: 4200,
      CURL: 2,
    },
  },
  {
    id: "medium",
    name: "보통",
    dab: "radial-gradient(circle at 34% 28%, #b4b4b4, #6d6d6d 76%)",
    amount: 30,
    params: {
      OPACITY: 0.15,
      SATURATION: 0,
      DENSITY_DISSIPATION: 3.5,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      CURL: 3,
    },
  },
  {
    id: "strong",
    name: "진하게",
    dab: "radial-gradient(circle at 34% 28%, #a8c8e8, #7a6ea8 74%)",
    amount: 38,
    params: {
      OPACITY: 0.3,
      SATURATION: 0.6,
      DENSITY_DISSIPATION: 2.2,
      SPLAT_RADIUS: 0.27,
      SPLAT_FORCE: 8200,
      CURL: 4,
    },
  },
];

const STORAGE_KEY = "cursor-effect";

/* 선택값은 localStorage 가 정본이고 React 는 구독자다. effect 안에서
   setState 로 복사해 오는 대신 useSyncExternalStore 로 직접 읽는다 —
   하이드레이션 어긋남도, 캐스케이딩 렌더도 없고, 다른 탭에서 바꾸면
   storage 이벤트로 즉시 따라온다. */
const storeListeners = new Set<() => void>();

function emitEffectChange() {
  storeListeners.forEach((listener) => listener());
}

function subscribeEffect(onChange: () => void) {
  storeListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    storeListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * 효과를 띄우는 면. 정확히 일치하는 경로만이라, /portfolio/:slug 와 글
 * 상세는 자동으로 빠진다 — 긴 본문은 읽는 면이라 글자 위로 효과가
 * 흐르면 읽기를 방해한다. 라우트가 늘면 여기에 명시적으로 추가해야 한다.
 */
const CURSOR_ROUTES = new Set(["/", "/about", "/portfolio", "/writing"]);

function getEffectSnapshot(): CursorEffectId | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return CURSOR_EFFECTS.some((fx) => fx.id === saved)
    ? (saved as CursorEffectId)
    : null;
}

function getEffectServerSnapshot(): CursorEffectId | null {
  return null;
}

/**
 * 커서 효과 놀이터.
 *
 * 원래 유체 커서가 항상 켜져 있었는데, 독자 두 명이 "효과가 너무
 * 강하다"고 했다. 효과 자체는 이 사이트의 애착이라 없애는 대신
 * 뒤집었다: 디폴트 OFF, 원하는 방문자만 우하단 팔레트에서 물감의
 * 농도를 골라 켠다. 선택은 localStorage 에 남아 다음 방문에도 유지된다.
 */
export function CursorFx() {
  const pathname = usePathname();
  const capable = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const effect = useSyncExternalStore(
    subscribeEffect,
    getEffectSnapshot,
    getEffectServerSnapshot,
  );

  const select = (id: CursorEffectId | null) => {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
    emitEffectChange();
  };

  if (!CURSOR_ROUTES.has(pathname) || !capable) return null;

  const chosen = CURSOR_EFFECTS.find((fx) => fx.id === effect);

  return (
    <>
      {chosen && (
        <SplashCursor
          key={chosen.id}
          TRANSPARENT={true}
          BACK_COLOR={{ r: 5, g: 5, b: 10 }}
          {...chosen.params}
        />
      )}
      <CursorPalette selected={effect} onSelect={select} />
    </>
  );
}
