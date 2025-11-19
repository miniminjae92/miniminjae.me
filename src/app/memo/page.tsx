import { memos } from "#site/content";
import { PostArchiveList } from "@/components/layout/post-archive-list";
import { ArchiveNav } from "@/components/layout/archive-nav";

export default function MemoIndexPage() {
  const description = "유용한 지식을 보관하는 공간입니다.";

  return (
    <div className="space-y-2">
      <header>
        <p className="text-sm tracking-tight text-second">{description}</p>
      </header>

      {/* Navigation (아이콘 네비게이션) */}
      <ArchiveNav />

      {/* 아카이브 목록 */}
      <PostArchiveList posts={memos} />
    </div>
  );
}
