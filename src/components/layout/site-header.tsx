"use client";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { SearchDialog } from "../search-dialog";
import { FaTags } from "react-icons/fa";

export function SiteHeader() {
  return (
    <header>
      <div className="py-1 flex items-center justify-between h-[var(--header-height)]">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          minjae.log
        </Link>

        <div className="flex items-center gap-2">
          <SearchDialog />

          <Link
            href="/tags"
            className="p-2 rounded-full text-heading hover:bg-selection transition"
          >
            <FaTags />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
