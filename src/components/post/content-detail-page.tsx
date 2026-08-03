import { MDXContent } from "@/components/mdx/mdx-content";
import { PostContent, ProjectContent } from "@/types/content";
import AuthorProfile from "./author-profile";
import { FromProjects } from "./from-projects";
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
  /** 이 글이 나온 프로젝트. 데이터 조회는 라우트가, 렌더는 여기가 한다. */
  fromProjects?: ProjectContent[];
}

export default function ContentDetailPage({
  post,
  prevPost,
  nextPost,
  relatedPosts = [],
  fromProjects = [],
}: ContentDetailPageProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-4">
        {/* 지금까지 frontmatter title 이 화면에 전혀 나오지 않았고 본문의 첫
            `#` 가 제목 역할을 대신하고 있었다. 페이지의 h1을 제자리로 돌린다. */}
        <div className="space-y-2">
          <p className="text-sm text-second tabular-nums">
            {formatPostDate(post.date)}
          </p>
          <h1 className="text-lg text-balance text-heading">{post.title}</h1>
          {post.description ? (
            <p className="text-sm text-second">{post.description}</p>
          ) : null}
        </div>
      </header>

      <div className="prose max-w-none text-base text-second mb-10">
        <MDXContent code={post.code} />
      </div>

      <footer className="py-10 mb-5 space-y-2">
        <FromProjects projects={fromProjects} />
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
