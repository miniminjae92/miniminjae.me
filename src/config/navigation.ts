// src/config/navigation.ts

/**
 * 최상위 영역 세 개. 헤더와 푸터가 같은 배열을 읽는다.
 *
 * Roots 를 네 번째로 두지 않는다. Agent OS 와 dref 는 Portfolio 항목이 되고,
 * 공개/비공개 경계는 항목 안에서 visibility 로 처리한다. (ADR-0001)
 *
 * 용어는 CONTEXT.md 정본을 따른다. Blog / Archive / Portfolio / Showcase 는
 * 쓰지 않는다. URL 은 /portfolio 를 유지한다 — 라벨 교체이지 이주가 아니다.
 */
export interface NavItem {
  href: string;
  label: string;
  /** 한글 병기. 푸터 title 속성에서 쓴다. */
  ko: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/about", label: "About", ko: "자기소개" },
  { href: "/portfolio", label: "Projects", ko: "만든 것" },
  { href: "/writing", label: "Writing", ko: "쓴 것" },
];

/** 현재 경로가 해당 영역 안에 있는지. 하위 경로도 활성으로 본다. */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
