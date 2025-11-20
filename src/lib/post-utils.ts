// src/lib/post-utils.ts
import { insights, memos, logs } from "#site/content";
import { PostContent } from "@/types/content";

// 모든 포스트 타입을 아우르는 타입 정의
export type AnyPost = PostContent;

/**
 * 날짜 내림차순 정렬 함수 (Comparator)
 * sort 메서드에 직접 전달하여 사용 가능
 */
export const sortByDateDesc = (a: AnyPost, b: AnyPost) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/**
 * 모든 포스트를 날짜순으로 정렬하여 반환
 */
export const getAllPostsSorted = (): AnyPost[] => {
  const allPosts = [...insights, ...memos, ...logs];
  return allPosts.sort(sortByDateDesc);
};

/**
 * 전체 포스트에서 태그를 추출하고 카운트하여 정렬된 리스트 반환
 */
export function getAllTags() {
  const posts = getAllPostsSorted();
  const map = new Map<string, { count: number; posts: AnyPost[] }>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const key = tag.trim();
      if (!key) continue;

      const entry = map.get(key) ?? { count: 0, posts: [] };
      entry.count++;
      entry.posts.push(post);
      map.set(key, entry);
    }
  }

  return Array.from(map.entries()).sort(
    (a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0], "ko"),
  );
}

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
