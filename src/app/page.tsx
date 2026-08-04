// src/app/page.tsx
import Link from "next/link";
import { HomeHero } from "@/components/home/here";
import { HomeWriting } from "@/components/home/home-writing";
import { ProjectList } from "@/components/portfolio/project-list";
import { LENSES } from "@/config/lens";
import { getPostsByLens } from "@/lib/posts";
import { getAllProjectsDesc } from "@/lib/projects";
import { PostContent } from "@/types/content";

/**
 * 홈은 3초 버전이다. 주장(누구인가)을 크게 말하고, 증거(Projects)와
 * 기록(Writing)으로 가는 입구만 놓는다. 3분 버전은 /about 이 맡는다.
 *
 * Projects 를 Writing 앞에 두는 이유: 주장 다음에는 증거가 와야 하고,
 * 홈이 이미 글 목록이라 Writing 을 두 번째에 두면 Projects 가 스크롤
 * 아래로 묻힌다.
 *
 * 섹션 구획은 /about 과 같은 언어다 — 헤어라인 하나, 영문 단독 제목.
 * Contact 섹션은 두지 않는다. 히어로의 소셜 링크와 중복이었다.
 */
export default function HomePage() {
  const projects = getAllProjectsDesc();

  const postsByLens = Object.fromEntries(
    LENSES.map((lens) => [lens.key, getPostsByLens(lens.key)]),
  ) as Record<string, PostContent[]>;

  return (
    <article className="mt-8 mb-page">
      <HomeHero />

      <div className="mt-14 space-y-14">
        {projects.length > 0 ? (
          <section className="space-y-6 border-t border-border pt-9">
            {/* "전체 보기" 를 제목 행 오른쪽 끝에 둔다. 리스트 아래 행을
                하나 더 쓰면 섹션마다 꼬리가 생겨 리듬이 무거워진다. */}
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl leading-tight text-heading">Projects</h2>
              <Link
                href="/portfolio"
                className="shrink-0 text-sm text-second hover:text-heading"
              >
                전체 보기 →
              </Link>
            </div>
            <ProjectList projects={projects.slice(0, 3)} />
          </section>
        ) : null}

        <section className="space-y-6 border-t border-border pt-9">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl leading-tight text-heading">Writing</h2>
            <Link
              href="/writing"
              className="shrink-0 text-sm text-second hover:text-heading"
            >
              전체 보기 →
            </Link>
          </div>
          <HomeWriting postsByLens={postsByLens} />
        </section>
      </div>
    </article>
  );
}
