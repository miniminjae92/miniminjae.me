import { MDXContent } from "@/components/mdx-content";
import { ArchiveNav } from "@/components/layout/archive-nav";
import { PostContent } from "@/types/content";
import AuthorProfile from "./author-profile";
import PostLicense from "./post-license";
import PostPagination from "./post-pagination";
import { RelatedPosts } from "./related-posts";
import { format } from "date-fns";
import { Comments } from "./comments";

interface ContentDetailPageProps {
  post: PostContent;
  prevPost?: PostContent | null;
  nextPost?: PostContent | null;
  relatedPosts?: PostContent[];
}

export default function ContentDetailPage({
  post,
  prevPost,
  nextPost,
  relatedPosts = [],
}: ContentDetailPageProps) {
  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm text-second">
          {format(new Date(post.date), "MMM d, yyyy")}
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

      <footer className="py-10 mb-5 space-y-2">
        <PostLicense />

        <AuthorProfile />

        {(prevPost || nextPost) && (
          <PostPagination prevPost={prevPost} nextPost={nextPost} />
        )}

        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}

        <Comments />
      </footer>
    </article>
  );
}
