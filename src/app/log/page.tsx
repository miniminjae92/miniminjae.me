// src/app/log/page.tsx
import { logs } from "#site/content";
import { PostArchiveList } from "@/components/layout/post-archive-list";
import { ArchiveNav } from "@/components/layout/archive-nav";

export default function LogIndexPage() {
  const description = "개발 과정의 기록과 작은 전환점들을 모아두는 곳입니다.";

  return (
    <div className="space-y-2">
      <header>
        <p className="text-sm tracking-tight text-second">{description}</p>
      </header>

      {/* Navigation (아이콘 네비게이션) */}
      <ArchiveNav />

      {/* 아카이브 목록 */}
      <PostArchiveList posts={logs} />
    </div>
  );
}
