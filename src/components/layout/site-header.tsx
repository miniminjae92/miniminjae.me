"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import { SearchDialog } from "../search-dialog";
import { FaTags } from "react-icons/fa";

export function SiteHeader() {
  const pathname = usePathname();

  const title = pathname.startsWith("/insight")
    ? "Insight"
    : pathname.startsWith("/memo")
      ? "Memo"
      : pathname.startsWith("/log")
        ? "Log"
        : "minjae.log";

  return (
    <header>
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          {title}
        </Link>

        <div className="flex items-center gap-2 mr-4">
          <SearchDialog />

          {/*   className="text-heading hover:text-heading hover:bg-gray-100 transition-colors" */}
          <Link
            href="/tags"
            className="p-2 rounded-full text-heading hover:text-heading hover:bg-gray-100 transition"
          >
            <FaTags />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
