import { MDXContent } from "@/components/mdx/mdx-content";
import { PostContent, ProjectContent } from "@/types/content";
import AuthorProfile from "./author-profile";
import { FromProjects } from "./from-projects";
import PostLicense from "./post-license";
import PostPagination from "./post-pagination";
import { Comments } from "../features/comments";
import { formatPostDate } from "@/lib/date";

interface ContentDetailPageProps {
  post: PostContent;
  prevPost?: PostContent | null;
  nextPost?: PostContent | null;
  /** 이 글이 나온 프로젝트. 데이터 조회는 라우트가, 렌더는 여기가 한다. */
  fromProjects?: ProjectContent[];
}

export default function ContentDetailPage({
  post,
  prevPost,
  nextPost,
  fromProjects = [],
}: ContentDetailPageProps) {
  return (
    <article className="space-y-6">
      {/* 제목 블록 아래로 공기를 준다. main 에서는 본문 첫 `#` 의 mt-18 이
          이 여백을 만들어 줬는데, 그 중복 제목을 걷어내면서 사라졌다. 없으면
          사이트 헤더 · 날짜 · 제목 · 본문이 한 덩어리로 붙어 읽힌다.

          description 은 화면에서 뺐다. 14건 중 8건이 제목을 그대로 되풀이하고
          2건은 빈 문자열이었다. frontmatter 값은 그대로 둔다 — generateMetadata
          와 openGraph, /api/og 가 계속 쓴다. */}
      <header className="pb-half-page">
        <p className="text-sm text-second tabular-nums">
          {formatPostDate(post.date)}
        </p>
        <h1 className="mt-2 text-2xl leading-tight text-balance text-heading">
          {post.title}
        </h1>
      </header>

      {/* text-base 를 걷어냈다. body 가 부리체에 맞춰 17px 를 정하는데
          여기서 16px 로 되눌러, 정작 가장 오래 읽는 면만 보정에서 빠져
          있었다. 크기는 body 에서 상속받는다. */}
      <div className="prose max-w-none text-second mb-10">
        <MDXContent code={post.code} />
      </div>

      <footer className="py-10 mb-5 space-y-2">
        <FromProjects projects={fromProjects} />
        <PostLicense />
        <AuthorProfile />
        {(prevPost || nextPost) && (
          <PostPagination prevPost={prevPost} nextPost={nextPost} />
        )}
        {/* Related Posts 를 걷어냈다. log 8건이 '프리코스' 태그 하나로 묶여
            어느 회고에 들어가도 같은 5줄이 떴고, 그중 앞뒤 글은 바로 위
            Previous·Next 가 제목까지 이미 보여주고 있었다. */}
        <Comments />
      </footer>
    </article>
  );
}
