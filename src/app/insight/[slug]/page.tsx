import { notFound } from "next/navigation";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/post/content-detail-page";
import {
  getAllPostsDesc,
  getPostNeighbors,
  getPostsByTypeDesc,
  getRelatedPosts,
} from "@/lib/posts";

const allPosts = getAllPostsDesc();
const sortedInsights = getPostsByTypeDesc("insight");

export function generateStaticParams() {
  return sortedInsights.map((post) => ({ slug: post.slug }));
}

export default async function InsightDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedInsights.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedInsights, slug);
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
