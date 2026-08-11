// src/components/portfolio/project-list.tsx
import Link from "next/link";
import { ProjectContent } from "@/types/content";

/**
 * 사이트의 시그니처 인터랙션인 "형제를 흐리는" 패턴을 그대로 쓴다.
 * post-archive-list, category-links 와 같은 문법이라 새로 배울 게 없다.
 *
 * 항목은 제목과 한 줄 요약 두 겹으로만 둔다. 기간·역할·공개여부·스택을
 * 달고 있던 회색 줄은 통째로 걷어냈다 — 6건 중 4건의 역할이 글자까지
 * 같았고 6건 전부 endDate 가 없어 기간이 "26.07 –" 로 찍혔다. 지운 값은
 * 전부 상세 헤더에 있다. 정렬이 이미 최신순이라 시간 축은 순서가 말한다.
 */
export function ProjectList({ projects }: { projects: ProjectContent[] }) {
  if (projects.length === 0) return null;

  return (
    <ul className="group/list">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="border-b border-border/50 transition-opacity duration-300 group-hover/list:opacity-(--dim) last:border-b-0 hover:!opacity-100"
        >
          <Link href={project.permalink} className="group/item block py-5">
            <p className="text-heading">{project.title}</p>
            <p className="mt-1 text-sm text-second">{project.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
