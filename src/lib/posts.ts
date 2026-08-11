// src/lib/posts.ts
import { PostContent, PostSummary } from "@/types/content";
import { WritingLens } from "@/config/lens";
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
 * 렌즈별 포스트 목록 (날짜 내림차순).
 *
 * lens 는 라벨이라 URL 을 따라가지 않는다. 지금은 type 과 1:1 이지만
 * 나중에 한 컬렉션 안에서 렌즈가 갈릴 수 있으므로 lens 로 직접 거른다.
 */
export function getPostsByLens(lens: WritingLens): PostContent[] {
  return allPosts.filter((post) => post.lens === lens).sort(sortByDateDesc);
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
 * 클라이언트로 넘길 경량 배열. code 를 떨어뜨린다.
 *
 * 클라이언트 컴포넌트가 PostContent 를 직접 import 하면 컴파일된 MDX 가
 * 통째로 번들에 실린다. 데이터는 서버에서 만들어 props 로 내려보낸다.
 */
export function getPostSummaries(): PostSummary[] {
  return getAllPostsDesc().map((post) => ({
    title: post.title,
    slug: post.slug,
    permalink: post.permalink,
    date: post.date,
    tags: post.tags,
    description: post.description,
    lens: post.lens,
    type: post.type,
  }));
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
