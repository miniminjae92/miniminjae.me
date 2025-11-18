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
      {/* Header */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-second">Memo</p>

        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          {post.title}
        </h1>

        <p className="text-xs text-second">
          {new Date(post.date).toLocaleDateString("ko-KR")}
        </p>

        {post.description && (
          <p className="text-sm text-second">{post.description}</p>
        )}
      </header>

      {/* Body */}
      <div
        className="prose max-w-none 
        prose-headings:text-heading 
        prose-p:text-body 
        prose-strong:text-heading
        prose-a:text-heading hover:prose-a:text-heading/80
        prose-ul:text-body prose-ol:text-body"
      >
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}
