// src/components/about/selected-list.tsx
import Link from "next/link";
import { ResolvedSelected } from "@/types/content";

/**
 * 증거로 가는 입구.
 *
 * 검토자는 글 18편을 훑지 않는다. 두세 개를 골라 주고 "왜 이걸 먼저"를
 * 한 줄로 붙이는 것이, 목록을 길게 주는 것보다 언제나 낫다.
 *
 * 날짜를 싣지 않는다. 여기는 시간순이 아니라 큐레이션이고, 날짜가 붙으면
 * 읽는 사람이 최신순인지 아닌지를 먼저 판단하게 된다.
 */
export function SelectedList({ items }: { items: ResolvedSelected[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="group/list">
      {items.map((item) => (
        <li
          key={item.permalink}
          className="border-b border-border/50 transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100"
        >
          <Link href={item.permalink} className="block py-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-heading">{item.title}</p>
              <p className="shrink-0 text-2xs text-disabled">
                {item.kind === "project" ? "Portfolio" : "Writing"}
              </p>
            </div>
            <p className="mt-1 max-w-[46ch] text-sm text-second">{item.why}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
