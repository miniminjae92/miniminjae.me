"use client";

import { useEffect, useRef, useState } from "react";
import { CURSOR_EFFECTS, type CursorEffectId } from "./cursor-fx";

interface CursorPaletteProps {
  selected: CursorEffectId | null;
  onSelect: (id: CursorEffectId | null) => void;
}

/**
 * 물감 팔레트. 화가가 팔레트에 물감을 짜 놓고 고르듯, 타원 보드 위의
 * 물감 덩어리를 눌러 커서 효과의 농도를 고른다. 같은 물감을 다시 누르면
 * 끈다.
 *
 * 덩어리가 왼쪽에서 오른쪽으로 커지는 것은 장식이 아니라 농도 자체다 —
 * 묽게·보통·진하게가 짜 놓은 양으로 보인다. 위치와 기울기는 팔레트에
 * 실제로 짜 놓은 듯한 배치를 위한 수작업 좌표라, 농도가 늘면 여기에
 * 자리를 하나 더 잡아야 한다.
 */
const DAB_SPOTS = [
  { left: "30%", top: "22%", rotate: "-10deg" },
  { left: "53%", top: "16%", rotate: "6deg" },
  { left: "71%", top: "38%", rotate: "-4deg" },
];

/** 물감 덩어리의 비정형 실루엣 — 정원(正圓)이면 버튼이지 물감이 아니다. */
const DAB_SHAPE = "58% 42% 55% 45% / 45% 58% 42% 55%";

export function CursorPalette({ selected, onSelect }: CursorPaletteProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeDab = CURSOR_EFFECTS.find((fx) => fx.id === selected)?.dab;

  return (
    <div ref={rootRef} className="fixed right-5 bottom-5 z-50">
      {open && (
        <div
          role="radiogroup"
          aria-label="커서 효과"
          className="absolute right-0 bottom-11 h-[124px] w-[196px] rounded-[50%] border border-border bg-page shadow-[0_10px_32px_rgba(0,0,0,0.10)]"
        >
          {/* 엄지 구멍 — 진짜 팔레트의 흔적 기관 */}
          <span
            aria-hidden
            className="absolute bottom-[15%] left-[20%] h-6 w-7 rounded-[50%] border border-border"
          />

          <button
            type="button"
            role="radio"
            aria-checked={selected === null}
            title="끄기"
            onClick={() => onSelect(null)}
            className="absolute left-[13%] top-[42%] h-7 w-7 border border-border text-second transition-transform hover:scale-110"
            style={{
              borderRadius: DAB_SHAPE,
              boxShadow:
                selected === null
                  ? "0 0 0 2px var(--page-background), 0 0 0 3px var(--heading)"
                  : undefined,
            }}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="mx-auto h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {CURSOR_EFFECTS.map((fx, i) => (
            <button
              key={fx.id}
              type="button"
              role="radio"
              aria-checked={selected === fx.id}
              title={fx.name}
              onClick={() => onSelect(selected === fx.id ? null : fx.id)}
              className="absolute transition-transform hover:scale-110"
              style={{
                ...DAB_SPOTS[i],
                width: fx.amount,
                height: fx.amount,
                marginLeft: -fx.amount / 2,
                marginTop: -fx.amount / 2,
                background: fx.dab,
                borderRadius: DAB_SHAPE,
                transform: `rotate(${DAB_SPOTS[i].rotate})`,
                boxShadow:
                  selected === fx.id
                    ? "0 0 0 2px var(--page-background), 0 0 0 3px var(--heading)"
                    : "inset 0 -2px 4px rgba(0,0,0,0.18)",
              }}
            >
              <span className="sr-only">{fx.name}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label="커서 효과 팔레트"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-page text-second transition-colors hover:text-heading"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3a9 9 0 1 0 0 18h1.6a2.4 2.4 0 0 0 0-4.8H12a2.1 2.1 0 0 1 0-4.2h6.4A3.6 3.6 0 0 0 22 8.4C22 5.1 17.6 3 12 3Z" />
          <circle cx="7.4" cy="10.6" r="1" fill="currentColor" stroke="none" />
          <circle cx="11" cy="7.2" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="9.6" r="1" fill="currentColor" stroke="none" />
        </svg>
        {/* 켜져 있는 물감을 버튼 귀퉁이에 한 방울 — 닫혀 있어도 상태가 보인다. */}
        {activeDab && !open && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full"
            style={{ background: activeDab }}
          />
        )}
      </button>
    </div>
  );
}
