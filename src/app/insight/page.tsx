// src/app/insight/page.tsx
import ContentIndexPage from "@/components/post/content-index-page";
import { getPostsByTypeDesc } from "@/lib/posts";

export default function InsightIndexPage() {
  const posts = getPostsByTypeDesc("insight");

  return (
    <ContentIndexPage
      posts={posts}
      description="인사이트를 보관하는 공간입니다."
    />
  );
}
