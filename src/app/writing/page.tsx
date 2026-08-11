import type { Metadata } from "next";
import { Suspense } from "react";
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
 * 헤더는 이름만 말하고 바로 물러난다.
 *
 * DESCRIPTION 은 화면에서 뺐다. 바로 아래 필터 줄 밑에 같은 크기·같은 색의
 * 회색 문장이 한 겹 더 있어, 목록이 시작되기도 전에 회색 산문이 두 번
 * 나왔다. 상수는 남긴다 — metadata 와 openGraph 가 계속 쓴다.
 */
export default function WritingPage() {
  // 클라이언트 필터에는 경량 배열만 넘긴다. PostContent 를 그대로 넘기면
  // 컴파일된 MDX code 가 번들에 실린다.
  const items = getPostSummaries();

  return (
    <article className="mt-8 mb-page">
      <header className="border-b border-border pb-7">
        <h1 className="text-2xl leading-tight text-heading">Writing</h1>
      </header>

      <div className="mt-9">
        {/* WritingIndex 가 ?lens= 를 읽는다. useSearchParams 는 정적 렌더 중
            Suspense 경계를 요구한다. */}
        <Suspense fallback={null}>
          <WritingIndex items={items} />
        </Suspense>
      </div>
    </article>
  );
}
