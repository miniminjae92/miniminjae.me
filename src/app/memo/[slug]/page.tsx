import { notFound } from "next/navigation";
import { memos } from "#site/content";
import { MDXContent } from "@/components/mdx-content";

interface MemoPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return memos.map((post) => ({ slug: post.slug }));
}

export default async function MemoDetailPage({ params }: MemoPageProps) {
  const { slug } = await params;
  const post = memos.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Memo</p>
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-xs text-neutral-500">
          {new Date(post.date).toLocaleDateString("ko-KR")}
        </p>
        {post.description && (
          <p className="text-sm text-neutral-400">{post.description}</p>
        )}
      </header>

      <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24">
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}
