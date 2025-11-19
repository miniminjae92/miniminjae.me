import { MDXContent } from "@/components/mdx-content";
import { ArchiveNav } from "@/components/layout/archive-nav";
import { PostContent } from "@/types/content";
import AuthorProfile from "./author-profile";
import PostLicense from "./post-license";

interface ContentDetailPageProps {
  post: PostContent;
}

export default function ContentDetailPage({ post }: ContentDetailPageProps) {
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

      <section className="mb-5 space-y-2">
        <PostLicense />

        <AuthorProfile />
      </section>
    </article>
  );
}
