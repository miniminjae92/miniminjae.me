import { notFound } from "next/navigation";
import { insights } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export default async function InsightDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = insights.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <ContentDetailPage post={post} />;
}
