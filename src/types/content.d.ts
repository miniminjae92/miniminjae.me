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

export interface TimelineEntry {
  label: string;
  start: string;
  /** 없으면 진행 중 */
  end?: string;
  note?: string;
}

export interface AboutContent {
  headline: string;
  role: string;
  now: string[];
  stack: string[];
  timeline: TimelineEntry[];
  updated: string;
  code: string;
}

export interface BasePageProps {
  params: Promise<{ slug: string }>;
}
