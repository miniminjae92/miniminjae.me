import type { Metadata } from "next";
import { Rail, RailSection } from "@/components/layout/rail";
import { WritingIndex } from "@/components/writing/writing-index";
import { SITE_URL } from "@/config/site-metadata";
import { getAllPostsDesc } from "@/lib/posts";

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

export default function WritingPage() {
  // 클라이언트 필터에는 경량 배열만 넘긴다. PostContent 를 그대로 넘기면
  // 컴파일된 MDX code 가 번들에 실린다.
  const items = getAllPostsDesc().map((post) => ({
    title: post.title,
    permalink: post.permalink,
    date: post.date,
    lens: post.lens,
  }));

  return (
    <Rail className="space-y-half-page pt-10 pb-page">
      <RailSection label="쓴 것" sublabel="Writing">
        <p className="max-w-[38ch] text-sm text-balance text-second">
          {DESCRIPTION}
        </p>
      </RailSection>

      <RailSection>
        <WritingIndex items={items} />
      </RailSection>
    </Rail>
  );
}
