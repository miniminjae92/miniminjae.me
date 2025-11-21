// src/components/post/related-posts.tsx
import Link from "next/link";
import { PostContent } from "@/types/content";
import { hoverStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: PostContent[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="text-sm py-4 space-y-1">
      <p className="text-second">Related Posts</p>
      <ul className="flex flex-col space-y-1">
        {posts.map((post) => (
          <Link key={post.slug} href={post.permalink}>
            <span className="mr-1">&gt;</span>
            <span className={cn(hoverStyles.text, "truncate font-semibold")}>
              {post.title}
            </span>
          </Link>
        ))}
      </ul>
    </section>
  );
}
