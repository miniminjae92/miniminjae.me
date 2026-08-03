// src/app/page.tsx
import Link from "next/link";
import { HomeHero } from "@/components/home/here";
import { HomeWriting } from "@/components/home/home-writing";
import { Rail, RailSection } from "@/components/layout/rail";
import { ProjectList } from "@/components/portfolio/project-list";
import { SocialLinks } from "@/components/ui/social-links";
import { LENSES } from "@/config/lens";
import { PROFILE } from "@/config/site-metadata";
import { getPostsByLens } from "@/lib/posts";
import { getAllProjectsDesc } from "@/lib/projects";
import { PostContent } from "@/types/content";

/**
 * 홈은 셋을 하나의 서사로 잇는다. 주장(누구인가) → 증거(무엇을 만들었나)
 * → 기록(무엇을 남기나) → 연락.
 *
 * Portfolio 를 Writing 앞에 두는 건 설계 문서의 순서와 다르다. 지원용이
 * 급하고 주장 다음에는 증거가 와야 하며, 홈이 이미 글 목록이라 Writing 을
 * 두 번째에 두면 새 Portfolio 가 스크롤 아래로 묻힌다.
 *
 * 섹션 사이에 구분선이나 배경 전환을 넣지 않는다. 레일은 안 끊기고
 * 거터 라벨만 바뀐다. 같은 축 위를 이동하는 감각이 셋을 하나로 묶는다.
 */
export default function HomePage() {
  const projects = getAllProjectsDesc();

  const postsByLens = Object.fromEntries(
    LENSES.map((lens) => [lens.key, getPostsByLens(lens.key)]),
  ) as Record<string, PostContent[]>;

  return (
    <Rail className="space-y-half-page pt-10 pb-page">
      <RailSection>
        <HomeHero />
      </RailSection>

      {projects.length > 0 ? (
        <RailSection label="만든 것" sublabel="Portfolio">
          <ProjectList projects={projects.slice(0, 3)} />
          <p className="mt-4 text-right">
            <Link
              href="/portfolio"
              className="text-sm text-second hover:text-heading"
            >
              전체 보기 →
            </Link>
          </p>
        </RailSection>
      ) : null}

      <RailSection label="쓴 것" sublabel="Writing">
        <HomeWriting postsByLens={postsByLens} />
        <p className="mt-6 text-right">
          <Link
            href="/writing"
            className="text-sm text-second hover:text-heading"
          >
            전체 보기 →
          </Link>
        </p>
      </RailSection>

      <RailSection label="연락" sublabel="Contact">
        <SocialLinks
          email={PROFILE.email}
          github={PROFILE.github}
          linkedin={PROFILE.linkedin}
        />
      </RailSection>
    </Rail>
  );
}
