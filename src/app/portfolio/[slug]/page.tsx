import Link from "next/link";
import { notFound } from "next/navigation";
import { Rail, RailSection } from "@/components/layout/rail";
import { MDXContent } from "@/components/mdx/mdx-content";
import { MetricList } from "@/components/portfolio/metric-list";
import { SITE_URL } from "@/config/site-metadata";
import { formatPeriod, formatPostDateShort } from "@/lib/date";
import {
  getAllProjectsDesc,
  getProjectBySlug,
  getProjectNeighbors,
  getWritingsForProject,
} from "@/lib/projects";
import { BasePageProps } from "@/types/content";

export function generateStaticParams() {
  return getAllProjectsDesc().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: BasePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  const ogUrl = new URL("/api/og", SITE_URL);
  ogUrl.searchParams.set("title", project.title);
  ogUrl.searchParams.set("description", project.summary);

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: new URL(project.permalink, SITE_URL).toString(),
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: project.permalink,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [ogUrl.toString()],
    },
  };
}

export default async function ProjectDetailPage({ params }: BasePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const writings = getWritingsForProject(project);
  const { prevProject, nextProject } = getProjectNeighbors(slug);

  return (
    <Rail className="space-y-half-page pt-10 pb-page">
      <RailSection className="space-y-3">
        <h1 className="text-lg text-balance text-heading">{project.title}</h1>
        <p className="max-w-[38ch] text-balance text-body">{project.summary}</p>

        <p className="flex flex-wrap items-center gap-x-2 text-sm text-second">
          <span>{project.role}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            {formatPeriod(project.date, project.endDate)}
          </span>
          {project.visibility === "private" ? (
            <>
              <span aria-hidden>·</span>
              {/* 링크가 없는 게 정상 상태다. 빈 링크 행 대신 이유를 밝힌다. */}
              <span className="text-disabled">비공개 시스템 · 소스 미공개</span>
            </>
          ) : null}
        </p>

        {project.links.length > 0 ? (
          <ul className="flex flex-wrap gap-x-4 text-sm">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  className="text-body hover:text-heading"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </RailSection>

      <RailSection label="문제" sublabel="Problem">
        <p className="whitespace-pre-line text-body">{project.problem}</p>
      </RailSection>

      {project.judgment.length > 0 ? (
        <RailSection label="판단" sublabel="Decision">
          <ol className="space-y-5">
            {project.judgment.map((item, index) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden
                  className="shrink-0 pt-0.5 text-xs text-disabled tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-body">{item}</span>
              </li>
            ))}
          </ol>
        </RailSection>
      ) : null}

      <RailSection label="결과" sublabel="Result">
        <MetricList metrics={project.metrics} />
        <div className="prose max-w-none text-base text-second">
          <MDXContent code={project.code} />
        </div>
      </RailSection>

      {writings.length > 0 ? (
        <RailSection label="관련 기록" sublabel="Writing">
          <ul className="group/list">
            {writings.map((post) => (
              <li
                key={post.slug}
                className="transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100"
              >
                <Link
                  href={post.permalink}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <span className="text-body hover:text-heading">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-xs text-second tabular-nums">
                    {formatPostDateShort(post.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RailSection>
      ) : null}

      {prevProject || nextProject ? (
        <RailSection>
          <nav className="flex justify-between gap-4 border-t border-border pt-6 text-sm">
            {prevProject ? (
              <Link
                href={prevProject.permalink}
                className="text-second hover:text-heading"
              >
                ← {prevProject.title}
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link
                href={nextProject.permalink}
                className="text-right text-second hover:text-heading"
              >
                {nextProject.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </RailSection>
      ) : null}
    </Rail>
  );
}
