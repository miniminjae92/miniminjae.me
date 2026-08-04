// src/components/portfolio/project-list.tsx
import Link from "next/link";
import { formatPeriod } from "@/lib/date";
import { ProjectContent } from "@/types/content";

/**
 * 사이트의 시그니처 인터랙션인 "형제를 흐리는" 패턴을 그대로 쓴다.
 * post-archive-list, category-links 와 같은 문법이라 새로 배울 게 없다.
 */
export function ProjectList({ projects }: { projects: ProjectContent[] }) {
  if (projects.length === 0) return null;

  return (
    <ul className="group/list">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="border-b border-border/50 transition-opacity duration-300 group-hover/list:opacity-40 last:border-b-0 hover:!opacity-100"
        >
          <Link href={project.permalink} className="group/item block py-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-heading">{project.title}</p>
              <p className="shrink-0 text-xs text-second tabular-nums">
                {formatPeriod(project.date, project.endDate)}
              </p>
            </div>

            <p className="mt-1 text-sm text-second">{project.summary}</p>

            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-2xs text-disabled">
              <span>{project.role}</span>
              {project.visibility === "private" ? (
                <>
                  <span aria-hidden>·</span>
                  <span>비공개 시스템</span>
                </>
              ) : null}
              {project.stack.length > 0 ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{project.stack.join(", ")}</span>
                </>
              ) : null}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
