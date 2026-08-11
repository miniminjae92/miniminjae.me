import type { Metadata } from "next";
import { ProjectList } from "@/components/portfolio/project-list";
import { SITE_URL } from "@/config/site-metadata";
import { getAllProjectsDesc } from "@/lib/projects";

const DESCRIPTION =
  "만든 것과 그 작업이 만든 변화를 설명하는 공간입니다. 완성품보다 어떤 문제를 어떻게 판단했는지를 남깁니다.";

/**
 * 화면에는 둘째 문장만 쓴다. 첫 문장이 말하는 것은 h1 "Projects" 와 바로
 * 아래 목록이 이미 보여준다. 검색 결과에는 두 문장이 다 필요하므로
 * metadata 쪽은 DESCRIPTION 을 그대로 쓴다.
 */
const LEAD = "완성품보다 어떤 문제를 어떻게 판단했는지를 남깁니다.";

export const metadata: Metadata = {
  title: "프로젝트",
  description: DESCRIPTION,
  alternates: { canonical: new URL("/portfolio", SITE_URL).toString() },
  openGraph: {
    title: "프로젝트",
    description: DESCRIPTION,
    url: new URL("/portfolio", SITE_URL).toString(),
  },
};

/**
 * Projects 는 증거다 — 항목 하나하나가 문제·판단·결과로 이어지는 입구라서
 * 목록 자체에 힘을 준다. 헤더는 Writing 과 같은 문법(이름 + 한 문장 +
 * 헤어라인)으로 두 인덱스가 형제로 읽히게 한다.
 */
export default function PortfolioPage() {
  const projects = getAllProjectsDesc();

  return (
    <article className="mt-8 mb-page">
      <header className="border-b border-border pb-7">
        <h1 className="text-2xl leading-tight text-heading">Projects</h1>
        <p className="mt-3 max-w-[42ch] text-sm text-balance text-second">
          {LEAD}
        </p>
      </header>

      <div className="mt-9">
        <ProjectList projects={projects} />
      </div>
    </article>
  );
}
