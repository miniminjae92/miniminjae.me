// src/lib/posts.ts
import { PostContent } from "@/types/content";
import { insightPosts, memoPosts, logPosts, allPosts } from "./content";

export type AnyPost = PostContent;
export type PostType = PostContent["type"];

/**
 * 날짜 내림차순 정렬 (최신 글 우선)
 */
export const sortByDateDesc = (a: AnyPost, b: AnyPost) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/**
 * 타입별 원본 배열
 */
const typeToPostsMap: Record<PostType, PostContent[]> = {
  insight: insightPosts,
  memo: memoPosts,
  log: logPosts,
};

function getRawPostsByType(type: PostType): PostContent[] {
  return typeToPostsMap[type] ?? [];
}

/**
 * 타입별 포스트 목록 (날짜 내림차순 정렬본 반환)
 */
export function getPostsByTypeDesc(type: PostType): PostContent[] {
  return [...getRawPostsByType(type)].sort(sortByDateDesc);
}

/**
 * 모든 포스트(정렬 X)
 */
export function getAllPosts(): AnyPost[] {
  return [...allPosts];
}

/**
 * 모든 포스트(날짜 내림차순)
 */
export function getAllPostsDesc(): AnyPost[] {
  return getAllPosts().sort(sortByDateDesc);
}

/**
 * 정렬된 posts 배열 + 현재 slug → 이전/다음 글
 */
export function getPostNeighbors(
  posts: PostContent[],
  currentSlug: string,
): { prev: PostContent | null; next: PostContent | null } {
  const index = posts.findIndex((post) => post.slug === currentSlug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const nextPost = index > 0 ? posts[index - 1] : null;
  const prevPost = index < posts.length - 1 ? posts[index + 1] : null;

  return { prev: prevPost, next: nextPost };
}

function sortRelatedPosts(
  a: { post: PostContent; sharedTagsCount: number },
  b: { post: PostContent; sharedTagsCount: number },
) {
  // 1순위: 태그 개수 (내림차순)
  if (a.sharedTagsCount !== b.sharedTagsCount) {
    return b.sharedTagsCount - a.sharedTagsCount;
  }
  // 2순위: 날짜 (내림차순)
  return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
}

/**
 * 태그 기반 관련 글
 * 1순위: 겹치는 태그 수, 2순위: 최신순
 */
export function getRelatedPosts(
  all: PostContent[],
  currentPost: PostContent,
  limit: number = 5,
): PostContent[] {
  return all
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      sharedTagsCount: post.tags.filter((tag) => currentPost.tags.includes(tag))
        .length,
    }))
    .filter((item) => item.sharedTagsCount > 0)
    .sort(sortRelatedPosts)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * 포스트 리스트를 연도별로 그룹화 (내림차순)
 */
export function groupPostsByYear(posts: PostContent[]) {
  const sorted = [...posts].sort(sortByDateDesc);

  const grouped = sorted.reduce<Record<string, PostContent[]>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    (acc[year] ??= []).push(post);
    return acc;
  }, {});

  // 연도 리스트 (내림차순: 2025, 2024...)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return { grouped, years };
}
