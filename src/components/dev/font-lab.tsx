"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * 폰트 랩 — 서체 조합을 갈아 끼며 실물로 비교하는 임시 장치.
 *
 * 커서 팔레트가 방문자용 장난감이라면 이건 주인용 자다. 조합이 정해지면
 * globals.css 의 --font-display / --font-body 기본값을 그 값으로 굳히고
 * 이 파일과 layout.tsx 의 마운트를 지운다.
 *
 * 노출 규칙: 개발 모드에서는 항상, 배포본에서는 ?fontlab=1 로 한 번
 * 열어 둔 브라우저에서만 보인다(?fontlab=0 으로 끈다). 방문자는 볼 일이
 * 없고, 폰에서 실물을 확인해야 할 때만 문을 연다.
 */

interface Preset {
  id: string;
  name: string;
  note: string;
  display: string;
  body: string;
  /** 이 조합에만 필요한 웹폰트. 랩을 열 때만 받아온다. */
  needs?: FaceId[];
}

type FaceId = "pretendard" | "myeongjo" | "noto-serif" | "suit";

/** 실제로 200 을 주는 주소만 쓴다 — 죽은 주소는 조용히 대체 서체로 보여
    비교 자체가 거짓이 된다. 명조 둘은 구글 폰트, 나머지는 jsDelivr.
    Pretendard 도 여기 있다 — 기본 서체가 고운바탕으로 돌아간 뒤로는
    랩에서 비교할 때만 쓰이므로, 방문자에게 내려보낼 이유가 없다. */
const FACES: Record<FaceId, { href?: string; css?: string }> = {
  pretendard: {
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css",
  },
  myeongjo: {
    href: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap",
  },
  "noto-serif": {
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&display=swap",
  },
  suit: {
    css: `@font-face{font-family:"SUIT Variable";src:url("https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.woff2") format("woff2-variations");font-weight:100 900;font-display:swap}`,
  },
};

const GOUN = "var(--font-gowun), serif";
const PRETENDARD = '"Pretendard Variable", sans-serif';

const PRESETS: Preset[] = [
  {
    id: "origin",
    name: "원본",
    note: "전부 고운바탕 — 지금 기본값",
    display: GOUN,
    body: GOUN,
  },
  {
    id: "split",
    name: "제목만 고운바탕",
    note: "본문은 Pretendard",
    display: GOUN,
    body: PRETENDARD,
    needs: ["pretendard"],
  },
  {
    id: "sans",
    name: "전부 Pretendard",
    note: "서체 대비 없이 크기로만 위계",
    display: PRETENDARD,
    body: PRETENDARD,
    needs: ["pretendard"],
  },
  {
    id: "myeongjo",
    name: "제목 나눔명조",
    note: "고운바탕보다 굵고 고전적인 명조",
    display: '"Nanum Myeongjo", serif',
    body: PRETENDARD,
    needs: ["myeongjo", "pretendard"],
  },
  {
    id: "noto-serif",
    name: "제목 본명조",
    note: "획이 균일한 현대 명조 (Noto Serif KR)",
    display: '"Noto Serif KR", serif',
    body: PRETENDARD,
    needs: ["noto-serif", "pretendard"],
  },
  {
    id: "suit",
    name: "본문 SUIT",
    note: "제목 고운바탕 + 본문을 다른 산세리프로",
    display: GOUN,
    body: '"SUIT Variable", sans-serif',
    needs: ["suit"],
  },
];

const STORAGE_KEY = "font-lab-preset";
const OPEN_KEY = "font-lab-enabled";
const LOADED = new Set<FaceId>();

/* 랩의 상태는 localStorage 가 정본이고 React 는 구독자다. 효과 안에서
   setState 로 복사해 오면 캐스케이딩 렌더가 되므로, 커서 팔레트와 같은
   구독 방식을 쓴다. */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getVisible() {
  return (
    process.env.NODE_ENV !== "production" ||
    window.localStorage.getItem(OPEN_KEY) === "1"
  );
}

function getPicked() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function serverFalse() {
  return false;
}

function serverNull() {
  return null;
}

function loadFaces(ids: FaceId[] = []) {
  for (const id of ids) {
    if (LOADED.has(id)) continue;
    LOADED.add(id);
    const face = FACES[id];
    if (face.href) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = face.href;
      link.dataset.fontLab = id;
      document.head.append(link);
    } else {
      const style = document.createElement("style");
      style.dataset.fontLab = id;
      style.textContent = face.css ?? "";
      document.head.append(style);
    }
  }
}

function applyPreset(preset: Preset | null) {
  const root = document.documentElement;
  if (!preset) {
    root.style.removeProperty("--font-display");
    root.style.removeProperty("--font-body");
    return;
  }
  loadFaces(preset.needs);
  root.style.setProperty("--font-display", preset.display);
  root.style.setProperty("--font-body", preset.body);
}

export function FontLab() {
  const [open, setOpen] = useState(false);
  const visible = useSyncExternalStore(subscribe, getVisible, serverFalse);
  const picked = useSyncExternalStore(subscribe, getPicked, serverNull);

  /* ?fontlab=1 로 배포본에서도 랩을 연다(=0 으로 닫는다). localStorage 를
     쓴 뒤 구독자에게 알리면 위의 visible 이 따라온다. */
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("fontlab");
    if (param !== "1" && param !== "0") return;
    if (param === "1") window.localStorage.setItem(OPEN_KEY, "1");
    else window.localStorage.removeItem(OPEN_KEY);
    emit();
  }, []);

  /* 고른 조합을 <html> 인라인 스타일로 덮어쓴다. 폰트는 React 바깥의
     외부 시스템이라 여기가 제자리다. */
  useEffect(() => {
    if (!visible) return;
    applyPreset(PRESETS.find((p) => p.id === picked) ?? null);
  }, [visible, picked]);

  /* 패널을 열면 모든 서체를 받아 둔다. 목록의 각 줄은 그 조합의 서체로
     쓰여 있는데, 받아오지 않은 서체는 대체 서체로 보여 비교가 거짓이 된다. */
  useEffect(() => {
    if (open) loadFaces(Object.keys(FACES) as FaceId[]);
  }, [open]);

  const choose = (preset: Preset | null) => {
    if (preset) window.localStorage.setItem(STORAGE_KEY, preset.id);
    else window.localStorage.removeItem(STORAGE_KEY);
    emit();
  };

  if (!visible) return null;

  return (
    /* 좌하단 구석은 Next.js 개발 인디케이터가 쓴다 — 한 칸 위로 올린다. */
    <div className="fixed bottom-16 left-5 z-50 text-xs">
      {open && (
        <div className="mb-2 w-64 border border-border bg-page p-3 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
          <p className="mb-2 text-2xs tracking-wide text-disabled uppercase">
            폰트 랩 · 개발 전용
          </p>

          <ul className="flex flex-col">
            {PRESETS.map((preset) => {
              const active = picked === preset.id;
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    onClick={() => choose(active ? null : preset)}
                    aria-pressed={active}
                    className="w-full border-b border-border/60 py-2 text-left last:border-b-0 hover:bg-selection"
                  >
                    <span
                      className={
                        active
                          ? "block font-semibold text-heading"
                          : "block text-body"
                      }
                      style={{ fontFamily: preset.display }}
                    >
                      {active ? "● " : ""}
                      {preset.name}
                    </span>
                    <span
                      className="mt-0.5 block text-2xs text-disabled"
                      style={{ fontFamily: preset.body }}
                    >
                      {preset.note}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-2 border-t border-border pt-2 text-2xs leading-relaxed text-disabled">
            고른 조합은 이 브라우저에만 적용된다. 정하면 알려줘 —
            globals.css 기본값으로 굳히고 랩을 걷어낸다.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="border border-border bg-page px-2 py-1 text-2xs text-second hover:text-heading"
      >
        Aa {picked ? PRESETS.find((p) => p.id === picked)?.name : "기본"}
      </button>
    </div>
  );
}
