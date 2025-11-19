import { memos } from "#site/content";
import ContentIndexPage from "@/components/content-index-page";

export default function MemoIndexPage() {
  return (
    <ContentIndexPage
      posts={memos}
      description="유용한 지식을 보관하는 공간입니다."
    />
  );
}
