// src/components/related-posts.tsx
import Link from "next/link";
import { PostContent } from "@/types/content";

interface RelatedPostsProps {
  posts: PostContent[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="text-sm">
      <p className="text-second">Related Posts</p>
      <ul className="flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.permalink}
            className="group flex items-center rounded-lg py-1
                         transition-colors "
          >
            <span className="mr-1">&gt;</span>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate text-heading transition-colors hover:text-heading hover:bg-selection">
                {post.title}
              </span>
            </div>
          </Link>
        ))}
      </ul>
    </section>
  );
}
