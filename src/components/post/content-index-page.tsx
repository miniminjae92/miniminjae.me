// src/components/content-index-page.tsx
import { PostArchiveList } from "@/components/post/post-archive-list";
import { ArchiveNav } from "@/components/layout/archive-nav";
import { PostContent } from "@/types/content";

interface ContentIndexPageProps {
  posts: PostContent[];
  description: string;
}

export default function ContentIndexPage({
  posts,
  description,
}: ContentIndexPageProps) {
  return (
    <section className="space-y-2">
      <header>
        <p className="text-sm tracking-tight text-second">{description}</p>

        {/* Navigation (아이콘 네비게이션) - 공통 요소 */}
        <ArchiveNav />
      </header>

      {/* 아카이브 목록 - 데이터에 따라 달라짐 */}
      <PostArchiveList posts={posts} />
    </section>
  );
}
