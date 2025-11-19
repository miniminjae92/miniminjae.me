import { PostArchiveList } from "@/components/layout/post-archive-list";
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
    <div className="space-y-2">
      <header>
        <p className="text-sm tracking-tight text-second">{description}</p>
      </header>

      {/* Navigation (아이콘 네비게이션) - 공통 요소 */}
      <ArchiveNav />

      {/* 아카이브 목록 - 데이터에 따라 달라짐 */}
      <PostArchiveList posts={posts} />
    </div>
  );
}
