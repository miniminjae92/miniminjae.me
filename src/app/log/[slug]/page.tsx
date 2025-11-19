import { notFound } from "next/navigation";
import { logs } from "#site/content";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/content-detail-page";

export function generateStaticParams() {
  return logs.map((post) => ({ slug: post.slug }));
}

export default async function LogDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = logs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <ContentDetailPage post={post} />;
}
