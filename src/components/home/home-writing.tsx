// src/components/home/home-writing.tsx
import Link from "next/link";
import { LENSES } from "@/config/lens";
import { PostContent } from "@/types/content";

/**
 * 렌즈별 최신 글.
 *
 * 기존 category-links 의 "형제를 흐리는" 인터랙션을 그대로 계승하되,
 * Insight / Memo / Log 대신 Understand / Solve / Reflect 로 부른다.
 * URL 은 그대로다 — 라벨만 바뀐 것이다.
 *
 * 라벨과 제목만 남긴다. 렌즈별 글 수는 바로 아래 3행이 이미 보여줬고,
 * 렌즈 설명 세 줄은 /writing 에서 버튼을 눌렀을 때 한 줄씩 뜨는 같은
 * 문장이며, 오른쪽 날짜 9개는 그중 4개가 짝으로 겹쳐 변별력이 0이었다.
 * 시간 축의 주인은 연도 라벨을 가진 /writing 아카이브다.
 */
export function HomeWriting({
  postsByLens,
}: {
  postsByLens: Record<string, PostContent[]>;
}) {
  return (
    <div className="group/list space-y-8">
      {LENSES.map((lens) => {
        const posts = postsByLens[lens.key] ?? [];
        if (posts.length === 0) return null;

        return (
          <div
            key={lens.key}
            className="transition-opacity duration-300 group-hover/list:opacity-(--dim) hover:!opacity-100"
          >
            <p className="mb-2 text-heading">{lens.label}</p>

            <ul>
              {posts.slice(0, 3).map((post) => (
                <li key={post.slug}>
                  <Link href={post.permalink} className="block py-1 text-sm">
                    <span className="text-body hover:text-heading">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
