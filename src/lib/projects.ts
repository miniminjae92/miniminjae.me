// src/lib/projects.ts
import { allPosts, projectEntries } from "./content";
import { PostContent, ProjectContent } from "@/types/content";

const postBySlug = new Map(allPosts.map((post) => [post.slug, post]));

/**
 * 빌드 타임 검증.
 *
 * velite 는 writings 안의 오타 slug 을 잡지 못한다. 파싱 중에 다른 컬렉션을
 * 볼 수 없어서 .refine() 으로도 해결이 안 된다. 그대로 두면 링크가 조용히
 * 사라지고 아무도 모른다. 모듈 초기화 시점에 던져서 pnpm build 가 깨지게 한다.
 */
const unresolved = projectEntries.flatMap((project) =>
  project.writings
    .filter((slug) => !postBySlug.has(slug))
    .map((slug) => `  ${project.slug} → "${slug}"`),
);

if (unresolved.length > 0) {
  throw new Error(
    [
      "포트폴리오 writings 에 존재하지 않는 글 slug 이 있습니다.",
      ...unresolved,
      "",
      "permalink 가 아니라 bare slug 를 씁니다. 예: /memo/macos-settings → macos-settings",
    ].join("\n"),
  );
}

/** 프로젝트 → 관련 글. frontmatter 에 적힌 순서를 유지한다. */
const projectsByPostSlug = new Map<string, ProjectContent[]>();

for (const project of projectEntries) {
  for (const slug of project.writings) {
    const bucket = projectsByPostSlug.get(slug);
    if (bucket) bucket.push(project);
    else projectsByPostSlug.set(slug, [project]);
  }
}

/** 진행 중인 항목이 먼저, 그다음 시작일 역순. */
export function getAllProjectsDesc(): ProjectContent[] {
  return [...projectEntries].sort((a, b) => {
    const aOngoing = a.endDate ? 0 : 1;
    const bOngoing = b.endDate ? 0 : 1;
    if (aOngoing !== bOngoing) return bOngoing - aOngoing;
    return b.date.localeCompare(a.date);
  });
}

export function getProjectBySlug(slug: string): ProjectContent | undefined {
  return projectEntries.find((project) => project.slug === slug);
}

/** 정방향: frontmatter 의 writings 를 실제 글로 해석한다. */
export function getWritingsForProject(project: ProjectContent): PostContent[] {
  return project.writings
    .map((slug) => postBySlug.get(slug))
    .filter((post): post is PostContent => Boolean(post));
}

/**
 * 역방향: 이 글이 어느 프로젝트에서 나왔는가.
 *
 * 글 frontmatter 에 project 필드를 두지 않는 이유는 (1) 기존 18개 파일을
 * 편집해야 하고 (2) 양쪽 간선이 반드시 어긋나기 때문이다. 진실은 한 방향에만
 * 두고 반대편은 파생시킨다.
 */
export function getProjectsForPost(post: PostContent): ProjectContent[] {
  return projectsByPostSlug.get(post.slug) ?? [];
}

export function getProjectNeighbors(slug: string): {
  prevProject: ProjectContent | null;
  nextProject: ProjectContent | null;
} {
  const ordered = getAllProjectsDesc();
  const index = ordered.findIndex((project) => project.slug === slug);

  if (index === -1) return { prevProject: null, nextProject: null };

  return {
    prevProject: ordered[index + 1] ?? null,
    nextProject: ordered[index - 1] ?? null,
  };
}
