import type { Metadata } from "next";
import { Rail, RailSection } from "@/components/layout/rail";
import { ProjectList } from "@/components/portfolio/project-list";
import { SITE_URL } from "@/config/site-metadata";
import { getAllProjectsDesc } from "@/lib/projects";

const DESCRIPTION =
  "만든 것과 그 작업이 만든 변화를 설명하는 공간입니다. 완성품보다 어떤 문제를 어떻게 판단했는지를 남깁니다.";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: DESCRIPTION,
  alternates: { canonical: new URL("/portfolio", SITE_URL).toString() },
  openGraph: {
    title: "포트폴리오",
    description: DESCRIPTION,
    url: new URL("/portfolio", SITE_URL).toString(),
  },
};

export default function PortfolioPage() {
  const projects = getAllProjectsDesc();

  return (
    <Rail className="space-y-half-page">
      <RailSection label="Portfolio">
        <p className="max-w-[38ch] text-sm text-balance text-second">
          {DESCRIPTION}
        </p>
      </RailSection>

      <RailSection>
        <ProjectList projects={projects} />
      </RailSection>
    </Rail>
  );
}
