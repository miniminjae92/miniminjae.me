import { insights } from "#site/content";
import ContentIndexPage from "@/components/content-index-page";

export default function InsightIndexPage() {
  return (
    <ContentIndexPage
      posts={insights}
      description="인사이트를 보관하는 공간입니다."
    />
  );
}
