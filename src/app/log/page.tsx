// src/app/log/page.tsx
import ContentIndexPage from "@/components/post/content-index-page";
import { getPostsByTypeDesc } from "@/lib/posts";

export default function LogIndexPage() {
  const posts = getPostsByTypeDesc("log");

  return (
    <ContentIndexPage
      posts={posts}
      description="개발 과정의 기록과 작은 전환점들을 모아두는 곳입니다."
    />
  );
}
