import { notFound } from "next/navigation";
import { memos } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";

export function generateStaticParams() {
  return memos.map((post) => ({ slug: post.slug }));
}

export default async function MemoDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = memos.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <ContentDetailPage post={post} />;
}
