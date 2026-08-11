// src/app/tags/page.tsx
import type { Metadata } from "next";
import { TagCloud } from "@/components/features/tag-cloud";
import { SITE_URL } from "@/config/site-metadata";
import { getAllTags } from "@/lib/tags";

const DESCRIPTION = "전체 글에서 태그를 모아 한 번에 볼 수 있습니다.";

export const metadata: Metadata = {
  title: "태그",
  description: DESCRIPTION,
  alternates: { canonical: new URL("/tags", SITE_URL).toString() },
};

export default function TagsPage() {
  // 서버에서 계산한다. 페이지 전체를 "use client" 로 두면 #site/content 가
  // 클라이언트 번들에 딸려 들어간다.
  const tags = getAllTags();

  return (
    <article className="mt-8 mb-page">
      {/* 설명문은 화면에서 뺐다. 바로 아래 태그 칩 더미가 같은 말을 이미
          보여준다. DESCRIPTION 상수는 metadata 가 계속 쓴다. */}
      <header className="border-b border-border pb-7">
        <h1 className="text-2xl leading-tight text-heading">Tags</h1>
      </header>

      <div className="mt-9">
        <TagCloud tags={tags} />
      </div>
    </article>
  );
}
