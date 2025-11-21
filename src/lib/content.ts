// src/lib/content.ts
import { insights, memos, logs } from "#site/content";
import { PostContent } from "@/types/content";

export const insightPosts: PostContent[] = insights as PostContent[];
export const memoPosts: PostContent[] = memos as PostContent[];
export const logPosts: PostContent[] = logs as PostContent[];

export const allPosts: PostContent[] = [
  ...insightPosts,
  ...memoPosts,
  ...logPosts,
];
