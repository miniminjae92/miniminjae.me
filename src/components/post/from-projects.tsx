// src/components/post/from-projects.tsx
import Link from "next/link";
import { ProjectContent } from "@/types/content";

/**
 * 역방향 링크. 이 글이 어느 프로젝트에서 나왔는지 보여준다.
 *
 * 역인덱스에 히트가 없으면 아무것도 렌더하지 않는다. 지금 18개 글 중
 * 두 개(optimize-img-video-workflow, mdx-special-characters)만 이 줄을
 * 갖게 되고, 그게 정직한 상태다. 가짜 데이터도 빈 껍데기 UI도 만들지 않는다.
 */
export function FromProjects({ projects }: { projects: ProjectContent[] }) {
  if (projects.length === 0) return null;

  return (
    <p className="border-y border-border py-4 text-sm text-second">
      이 글은{" "}
      {projects.map((project, index) => (
        <span key={project.slug}>
          {index > 0 ? ", " : null}
          <Link
            href={project.permalink}
            className="rounded-md px-1 text-heading hover:bg-selection"
          >
            〈{project.title}〉
          </Link>
        </span>
      ))}{" "}
      작업 중 나온 기록입니다.
    </p>
  );
}
