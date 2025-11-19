"use client";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { SearchDialog } from "../search-dialog";
import { FaTags } from "react-icons/fa";

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          minjae.log
        </Link>

        <div className="flex items-center gap-2 mr-4">
          <SearchDialog />

          <Link
            href="/tags"
            className="p-2 rounded-full text-heading hover:bg-gray-100 transition"
          >
            <FaTags />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
