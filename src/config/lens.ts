// src/config/lens.ts

/**
 * Writing Lens — 글이 독자에게 제공하는 주된 가치를 나타내는 관점.
 * 정의는 CONTEXT.md 의 정본을 그대로 따른다.
 *
 * 기존 insight / memo / log 컬렉션에 라벨로만 덧입힌다. permalink 도,
 * RSS guid 도, Giscus 스레드도 건드리지 않는다. 나중에 URL 까지 옮기고
 * 싶으면 velite transform 의 permalink 한 줄과 redirects 세 줄이면 된다.
 */
export type WritingLens = "understand" | "solve" | "reflect";

export interface LensConfig {
  key: WritingLens;
  label: string;
  description: string;
}

export const LENSES: LensConfig[] = [
  {
    key: "understand",
    label: "Understand",
    description: "개념, 원리, 구조를 이해할 수 있게 만든다",
  },
  {
    key: "solve",
    label: "Solve",
    description: "구체적인 문제와 해결 과정을 재사용할 수 있게 만든다",
  },
  {
    key: "reflect",
    label: "Reflect",
    description: "경험에서 얻은 판단, 변화, 다음 질문을 공유한다",
  },
];

export const LENS_BY_KEY: Record<WritingLens, LensConfig> = Object.fromEntries(
  LENSES.map((lens) => [lens.key, lens]),
) as Record<WritingLens, LensConfig>;
