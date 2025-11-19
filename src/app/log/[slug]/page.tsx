import { notFound } from "next/navigation";
import { logs } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";
import { getPostNeighbors } from "@/lib/post-utils";

const sortedLogs = logs.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function generateStaticParams() {
  return logs.map((post) => ({ slug: post.slug }));
}

export default async function InsightDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedLogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedLogs, slug);

  return <ContentDetailPage post={post} prevPost={prev} nextPost={next} />;
}
