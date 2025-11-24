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

export async function generateMetadata({ params }: BasePageProps) {
  const { slug } = await params;
  const post = sortedInsights.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL("https://miniminjae.vercel.app");
  ogUrl.searchParams.set("title", post.title);
  ogUrl.searchParams.set("date", post.date);
  if (post.description) {
    ogUrl.searchParams.set("description", post.description);
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: post.permalink,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
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
