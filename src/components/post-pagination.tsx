import Link from "next/link";
import { PostContent } from "@/types/content";

interface PostPaginationProps {
  prevPost?: PostContent | null;
  nextPost?: PostContent | null;
}

export default function PostPagination({
  prevPost,
  nextPost,
}: PostPaginationProps) {
  return (
    <nav className="flex flex-col text-sm justify-between py-2 mt-4 mb-4 sm:flex-row">
      {prevPost ? (
        <Link
          href={prevPost.permalink}
          className="group flex flex-col items-start gap-1 w-full sm:w-1/2"
        >
          <span className="text-second group-hover:text-heading">Previous</span>
          <span className="font-semibold text-body transition-colors group-hover:text-heading group-hover:bg-selection line-clamp-2">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block w-1/2" />
      )}

      {nextPost ? (
        <Link
          href={nextPost.permalink}
          className="group flex flex-col items-start sm:items-end gap-1 w-full sm:w-1/2 text-left sm:text-right"
        >
          <span className="text-second group-hover:text-heading">Next</span>
          <span className="font-semibold text-body transition-colors group-hover:text-heading group-hover:bg-selection line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block w-1/2" />
      )}
    </nav>
  );
}
