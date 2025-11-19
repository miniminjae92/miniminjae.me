import { notFound } from "next/navigation";
import { insights, memos, logs } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";
import { getPostNeighbors, getRelatedPosts } from "@/lib/post-utils";

const allPosts = [...insights, ...memos, ...logs];

const sortedLogs = logs.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function generateStaticParams() {
  return logs.map((post) => ({ slug: post.slug }));
}

export default async function LogDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedLogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedLogs, slug);

  const relatedPosts = getRelatedPosts(allPosts, post, 5);

  return (
    <ContentDetailPage
      post={post}
      prevPost={prev}
      nextPost={next}
      relatedPosts={relatedPosts}
    />
  );
}
