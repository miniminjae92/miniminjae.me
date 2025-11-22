import { MDXContent } from "@/components/mdx/mdx-content";
import { ArchiveNav } from "@/components/layout/archive-nav";
import { PostContent } from "@/types/content";
import AuthorProfile from "./author-profile";
import PostLicense from "./post-license";
import PostPagination from "./post-pagination";
import { RelatedPosts } from "./related-posts";
import { Comments } from "../features/comments";
import { formatPostDate } from "@/lib/date";

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
        <p className="text-sm text-second">{formatPostDate(post.date)}</p>
        <ArchiveNav />
      </header>

      <div className="prose max-w-none text-[15px] text-second mb-10">
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
