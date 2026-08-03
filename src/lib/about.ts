// src/lib/about.ts
import { aboutDoc, allPosts, projectEntries } from "./content";
import { ResolvedSelected } from "@/types/content";

const postBySlug = new Map(allPosts.map((post) => [post.slug, post]));
const projectBySlug = new Map(
  projectEntries.map((project) => [project.slug, project]),
);

/**
 * selected 의 ref 를 실제 글/프로젝트로 해석한다.
 *
 * 글이 먼저고 프로젝트가 나중이다. 두 네임스페이스가 겹칠 일은 velite 의
 * s.slug 가 컬렉션별로 막아 주지만, 순서를 고정해 둬야 나중에 같은 이름이
 * 생겨도 동작이 안 바뀐다.
 */
function resolve(ref: string): ResolvedSelected | { ref: string } {
  const post = postBySlug.get(ref);
  if (post) {
    return {
      title: post.title,
      permalink: post.permalink,
      why: "",
      kind: "post",
      date: post.date,
    };
  }
  const project = projectBySlug.get(ref);
  if (project) {
    return {
      title: project.title,
      permalink: project.permalink,
      why: "",
      kind: "project",
      date: project.date,
    };
  }
  return { ref };
}

/**
 * 빌드 타임 검증.
 *
 * lib/projects.ts 의 writings 검증과 같은 이유로 같은 방식을 쓴다. velite 는
 * 파싱 중에 다른 컬렉션을 볼 수 없어 스키마로는 못 잡는다. 그대로 두면 자기
 * 소개서의 유일한 증거 링크가 조용히 사라지고 아무도 모른다.
 */
const unresolved = aboutDoc.selected
  .map((entry) => entry.ref)
  .filter((ref) => !postBySlug.has(ref) && !projectBySlug.has(ref));

if (unresolved.length > 0) {
  throw new Error(
    [
      "about 의 selected 에 존재하지 않는 slug 이 있습니다.",
      ...unresolved.map((ref) => `  "${ref}"`),
      "",
      "글 slug 또는 프로젝트 slug 을 씁니다. permalink 가 아닙니다.",
      "예: /memo/macos-settings → macos-settings",
    ].join("\n"),
  );
}

/** frontmatter 순서를 유지한다. 큐레이션이므로 날짜순으로 재정렬하지 않는다. */
export function getSelected(): ResolvedSelected[] {
  return aboutDoc.selected.flatMap((entry) => {
    const resolved = resolve(entry.ref);
    if (!("title" in resolved)) return [];
    return [{ ...resolved, why: entry.why }];
  });
}
