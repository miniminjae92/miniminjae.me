import type { Metadata } from "next";
import { WritingIndex } from "@/components/writing/writing-index";
import { SITE_URL } from "@/config/site-metadata";
import { getPostSummaries } from "@/lib/posts";

const DESCRIPTION =
  "개인적인 경험과 지식을 다른 사람이 읽고 사용할 수 있도록 옮겨 둔 기록입니다.";

export const metadata: Metadata = {
  title: "기록",
  description: DESCRIPTION,
  alternates: { canonical: new URL("/writing", SITE_URL).toString() },
  openGraph: {
    title: "기록",
    description: DESCRIPTION,
    url: new URL("/writing", SITE_URL).toString(),
  },
};

/**
 * Writing 은 아카이브다 — 이 페이지의 주인공은 목록의 밀도다.
 * 헤더는 이름과 한 문장만 말하고 바로 물러난다. 글 수는 필터의
 * All 카운트가 이미 말하므로 헤더에서 반복하지 않는다.
 */
export default function WritingPage() {
  // 클라이언트 필터에는 경량 배열만 넘긴다. PostContent 를 그대로 넘기면
  // 컴파일된 MDX code 가 번들에 실린다.
  const items = getPostSummaries();

  return (
    <article className="mt-8 mb-page">
      <header className="border-b border-border pb-7">
        <h1 className="text-2xl leading-tight text-heading">Writing</h1>
        <p className="mt-3 max-w-[42ch] text-sm text-balance text-second">
          {DESCRIPTION}
        </p>
      </header>

      <div className="mt-9">
        <WritingIndex items={items} />
      </div>
    </article>
  );
}
