import Link from "next/link";
import { format } from "date-fns";
import { insights, memos, logs } from "#site/content";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type PostType =
  | (typeof insights)[number]
  | (typeof memos)[number]
  | (typeof logs)[number];

interface PostArchiveListProps {
  posts: PostType[];
}

const sortByDateDesc = (a: PostType, b: PostType) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export function PostArchiveList({ posts }: PostArchiveListProps) {
  const sorted = useMemo(() => [...posts].sort(sortByDateDesc), [posts]);

  const grouped = sorted.reduce<Record<string, PostType[]>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    (acc[year] ??= []).push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <section>
      <div className="group my-14">
        {years.map((year, index) => (
          <div
            key={year}
            className={cn(
              "group/year relative z-0",
              "border-t border-border/50",
              "border-b border-border/50",
              index === years.length - 1 ? "border-b-0" : "",
            )}
          >
            <h3 className="text-second group-hover/year:bg-selection group-hover/year:text-heading absolute top-[26px] -z-10 -mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 text-sm transition">
              {year}
            </h3>

            <ul className="py-2">
              {grouped[year].map((post) => {
                const dateLabel = format(new Date(post.date), "MM. dd.");

                return (
                  <li key={post.slug}>
                    <Link
                      href={post.permalink}
                      className="group/item flex transition-opacity duration-300 group-hover:opacity-40 hover:!opacity-100"
                    >
                      <div className="ml-[15%] flex flex-1 items-start border-t border-border/50 py-2 group-first-of-type/item:border-t-0">
                        {/* 왼쪽: 게시글 제목 */}
                        <div className="text-heading flex items-center gap-0.5">
                          <span className="group-hover/item:bg-selection mx-1 rounded-md px-1 transition">
                            {post.title}
                          </span>
                        </div>

                        {/* 오른쪽: 날짜 */}
                        <div className="text-second group-hover/item:bg-selection group-hover/item:text-heading mt-1 ml-auto flex shrink-0 items-center gap-1 rounded-md px-1 py-0.5 text-sm transition">
                          <span className="tabular-nums">{dateLabel}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
