// src/lib/content.ts
import { about, insights, memos, logs } from "#site/content";
import { AboutContent, PostContent } from "@/types/content";

export const aboutDoc: AboutContent = about as AboutContent;

export const insightPosts: PostContent[] = insights as PostContent[];
export const memoPosts: PostContent[] = memos as PostContent[];
export const logPosts: PostContent[] = logs as PostContent[];

export const allPosts: PostContent[] = [
  ...insightPosts,
  ...memoPosts,
  ...logPosts,
];
