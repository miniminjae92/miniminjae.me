// src/components/related-posts.tsx
import Link from "next/link";
import { PostContent } from "@/types/content";
import { format } from "date-fns";

interface RelatedPostsProps {
  posts: PostContent[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="mb-4 text-lg font-semibold text-heading">Related Posts</h3>
      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.permalink}
              className="group flex items-center justify-between rounded-lg px-3 py-2
                         transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
            >
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="truncate font-medium text-body transition-colors group-hover:text-heading">
                  {post.title}
                </span>
              </div>

              <span className="ml-4 shrink-0 text-xs text-second tabular-nums">
                {format(new Date(post.date), "yy.MM.dd")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
