"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import { SearchDialog } from "../search-dialog";

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
    <header className="backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          {title}
        </Link>

        <div className="flex items-center gap-4">
          <SearchDialog />

          <Link href="/tags" className="hover:text-heading transition-colors">
            Tags
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
