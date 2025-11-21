"use client";

import dynamic from "next/dynamic";

const SplashCursor = dynamic(() => import("./splash-cursor-core"), {
  ssr: false,
});

export function HomeCursor() {
  if (typeof window !== "undefined") {
    const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (!hasFinePointer) {
      return null;
    }
  }

  return <SplashCursor TRANSPARENT={true} BACK_COLOR={{ r: 5, g: 5, b: 10 }} />;
}
