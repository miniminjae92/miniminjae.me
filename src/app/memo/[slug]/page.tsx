import { notFound } from "next/navigation";
import { memos } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";
import { getPostNeighbors } from "@/lib/post-utils";

const sortedMemos = memos.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function generateStaticParams() {
  return memos.map((post) => ({ slug: post.slug }));
}

export default async function MemoDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedMemos.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedMemos, slug);

  return <ContentDetailPage post={post} prevPost={prev} nextPost={next} />;
}
