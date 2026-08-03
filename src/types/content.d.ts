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

export interface ProjectMetric {
  label: string;
  /** "420ms → 180ms" 처럼 델타를 문자열 그대로. 단위 연산 없음. */
  value: string;
  /** 조건/분모. 없으면 그 metric 은 싣지 않는다. */
  note?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

/**
 * PostContent 와 별도 인터페이스로 둔다. type 유니온에 "project" 를 섞으면
 * getPostsByTypeDesc, getRelatedPosts, groupPostsByYear 가 조용히 오염된다.
 */
export interface ProjectContent {
  title: string;
  slug: string;
  date: string;
  /** 없으면 진행 중 */
  endDate?: string;
  summary: string;
  role: string;
  visibility: "public" | "private";
  stack: string[];
  tags: string[];
  problem: string;
  judgment: string[];
  metrics: ProjectMetric[];
  /** 관련 글의 bare slug. permalink 아님. */
  writings: string[];
  links: ProjectLink[];
  code: string;
  permalink: string;
  type: "project";
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
