// src/app/studio/page.tsx
//
// 개발 환경 전용. 프로덕션 빌드에서는 404 다.
//
// 파일을 쓰는 API 를 뒤에 두고 있으므로 게이트가 라우트와 API 양쪽에
// 있다. 한쪽만 막으면 라우트가 사라져도 API 는 살아 있다.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioClient } from "@/components/studio/studio-client";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StudioClient />;
}
