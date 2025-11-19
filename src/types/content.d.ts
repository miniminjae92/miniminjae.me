// src/types/content.d.ts

export interface PostContent {
  title: string;
  slug: string;
  date: string;
  code: string;
  description?: string;
  tags: string[];
  permalink: string;
  type: "insight" | "memo" | "log";
}

export interface BasePageProps {
  params: Promise<{ slug: string }>;
}
