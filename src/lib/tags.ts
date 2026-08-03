// src/lib/tags.ts
import { getPostSummaries } from "./posts";
import { PostSummary } from "@/types/content";

export interface TagInfo {
  count: number;
  posts: PostSummary[];
}

/**
 * 전체 포스트에서 태그 모으기
 * 정렬: 사용 빈도 내림차순 -> 태그 이름 (ko 로케일)
 *
 * PostContent 가 아니라 PostSummary 를 담는다. /tags 페이지의 필터가
 * 클라이언트에서 돌기 때문에, 여기에 code 가 섞이면 컴파일된 MDX 가
 * 전부 번들에 실린다.
 */
export function getAllTags(): [string, TagInfo][] {
  const posts = getPostSummaries();
  const map = new Map<string, TagInfo>();

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
