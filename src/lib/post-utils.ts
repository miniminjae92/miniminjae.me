import { PostContent } from "@/types/content";

/**
 * 전체 포스트 목록과 현재 슬러그를 받아 이전/다음 포스트를 반환합니다.
 * 전제조건: posts 배열은 이미 날짜순(최신순)으로 정렬되어 있어야 합니다.
 */
export function getPostNeighbors(posts: PostContent[], currentSlug: string) {
  const index = posts.findIndex((post) => post.slug === currentSlug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const nextPost = index > 0 ? posts[index - 1] : null;
  const prevPost = index < posts.length - 1 ? posts[index + 1] : null;

  return { prev: prevPost, next: nextPost };
}
