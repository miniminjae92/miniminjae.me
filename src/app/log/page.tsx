// src/app/log/page.tsx
import { logs } from "#site/content";
import ContentIndexPage from "@/components/content-index-page";

export default function LogIndexPage() {
  return (
    <ContentIndexPage
      posts={logs}
      description="개발 과정의 기록과 작은 전환점들을 모아두는 곳입니다."
    />
  );
}
