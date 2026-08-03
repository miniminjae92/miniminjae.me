// src/lib/content.ts
import { about, insights, memos, logs, projects } from "#site/content";
import { AboutContent, PostContent, ProjectContent } from "@/types/content";

export const aboutDoc: AboutContent = about as AboutContent;
export const projectEntries: ProjectContent[] = projects as ProjectContent[];

export const insightPosts: PostContent[] = insights as PostContent[];
export const memoPosts: PostContent[] = memos as PostContent[];
export const logPosts: PostContent[] = logs as PostContent[];

export const allPosts: PostContent[] = [
  ...insightPosts,
  ...memoPosts,
  ...logPosts,
];
