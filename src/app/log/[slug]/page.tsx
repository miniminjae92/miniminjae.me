import { notFound } from "next/navigation";
import { BasePageProps } from "@/types/content";
import ContentDetailPage from "@/components/post/content-detail-page";
import {
  getPostNeighbors,
  getPostsByTypeDesc,
} from "@/lib/posts";
import { SITE_URL } from "@/config/site-metadata";
import { getProjectsForPost } from "@/lib/projects";

const sortedLogs = getPostsByTypeDesc("log");

export function generateStaticParams() {
  return sortedLogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BasePageProps) {
  const { slug } = await params;
  const post = sortedLogs.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL("/api/og", SITE_URL);
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

export default async function LogDetailPage({ params }: BasePageProps) {
  const { slug } = await params;

  const post = sortedLogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getPostNeighbors(sortedLogs, slug);

  return (
    <ContentDetailPage
      post={post}
      prevPost={prev}
      nextPost={next}
      fromProjects={getProjectsForPost(post)}
    />
  );
}
