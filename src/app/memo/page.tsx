// src/app/memo/page.tsx
import ContentIndexPage from "@/components/post/content-index-page";
import { getPostsByTypeDesc } from "@/lib/posts";

export default function MemoIndexPage() {
  const posts = getPostsByTypeDesc("memo");

  return (
    <ContentIndexPage
      posts={posts}
      description="유용한 지식을 보관하는 공간입니다."
    />
  );
}
