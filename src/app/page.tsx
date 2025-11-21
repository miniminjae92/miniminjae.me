// src/app/page.tsx
import { HomeHero } from "@/components/home/here";
import { getPostsByTypeDesc } from "@/lib/posts";
import { HomeCategoryLinks } from "@/components/home/category-links";

export default function HomePage() {
  const latestInsights = getPostsByTypeDesc("insight").slice(0, 5);
  const latestMemos = getPostsByTypeDesc("memo").slice(0, 5);
  const latestLogs = getPostsByTypeDesc("log").slice(0, 5);

  return (
    <section className="space-y-10">
      <HomeHero />
      <HomeCategoryLinks
        insights={latestInsights}
        memos={latestMemos}
        logs={latestLogs}
      />
    </section>
  );
}
