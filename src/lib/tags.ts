// src/lib/tags.ts
import { AnyPost, getAllPostsDesc } from "./posts";

export interface TagInfo {
  count: number;
  posts: AnyPost[];
}

/**
 * 전체 포스트에서 태그 모으기
 * 정렬: 사용 빈도 내림차순 -> 태그 이름 (ko 로케일)
 */
export function getAllTags(): [string, TagInfo][] {
  const posts = getAllPostsDesc();
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
