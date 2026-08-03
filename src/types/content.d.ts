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
 * 클라이언트로 넘기는 경량 표현.
 *
 * PostContent 를 그대로 넘기면 컴파일된 MDX code 까지 번들에 실린다.
 * tags/page.tsx 와 search-dialog.tsx 가 지금 그러고 있고(.velite JSON 507KB),
 * 그 패턴을 복제하지 않기 위한 타입이다.
 */
export interface WritingListItem {
  title: string;
  permalink: string;
  date: string;
  lens: import("@/config/lens").WritingLens;
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
