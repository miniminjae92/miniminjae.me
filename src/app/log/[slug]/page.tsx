import { notFound } from "next/navigation";
import { logs } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { ArchiveNav } from "@/components/layout/archive-nav";

interface LogPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return logs.map((post) => ({ slug: post.slug }));
}

export default async function LogDetailPage({ params }: LogPageProps) {
  const { slug } = await params;
  const post = logs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm text-second">
          {new Date(post.date).toLocaleDateString("ko-KR")}
        </p>
        <ArchiveNav />
      </header>
      <div
        className="prose max-w-none prose-headings:text-heading prose-p:text-body prose-strong:text-heading 
                      prose-a:text-heading hover:prose-a:text-heading/80 
                      prose-ul:text-body prose-ol:text-body mb-10"
      >
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}
