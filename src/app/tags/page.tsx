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
      <header className="border-b border-border pb-7">
        <h1 className="text-2xl leading-tight text-heading">Tags</h1>
        <p className="mt-3 text-sm text-second">{DESCRIPTION}</p>
      </header>

      <div className="mt-9">
        <TagCloud tags={tags} />
      </div>
    </article>
  );
}
