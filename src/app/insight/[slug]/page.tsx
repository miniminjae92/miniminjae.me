import { notFound } from "next/navigation";
import { insights } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";
import { getPostNeighbors } from "@/lib/post-utils";

const sortedInsights = insights.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export default async function InsightDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedInsights.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedInsights, slug);

  return <ContentDetailPage post={post} prevPost={prev} nextPost={next} />;
}
