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

/**
 * 전체 포스트 중 현재 포스트와 태그가 겹치는 글을 찾아 반환합니다.
 * 정렬 우선순위: 1. 겹치는 태그 수(내림차순) 2. 날짜(최신순)
 */
export function getRelatedPosts(
  allPosts: PostContent[],
  currentPost: PostContent,
  limit: number = 5,
) {
  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTagsCount = post.tags.filter((tag) =>
        currentPost.tags.includes(tag),
      ).length;
      return { ...post, sharedTagsCount };
    })
    .filter((post) => post.sharedTagsCount > 0)
    .sort((a, b) => {
      if (a.sharedTagsCount !== b.sharedTagsCount) {
        return b.sharedTagsCount - a.sharedTagsCount;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}
