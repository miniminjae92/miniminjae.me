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
  /** 라벨로만 덧입힌 관점. URL 은 type 을 따른다. */
  lens: import("@/config/lens").WritingLens;
}

/**
 * 클라이언트로 넘기는 경량 표현. code 가 없다는 게 핵심이다.
 *
 * PostContent 를 클라이언트 컴포넌트에서 그대로 import 하면 컴파일된 MDX 가
 * 전부 번들에 실린다. 실제로 544KB 청크가 만들어지고 있었고, 검색 다이얼로그가
 * 헤더에 있어서 모든 페이지가 그 비용을 냈다.
 */
export interface PostSummary {
  title: string;
  slug: string;
  permalink: string;
  date: string;
  tags: string[];
  description?: string;
  lens: import("@/config/lens").WritingLens;
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
