// src/components/layout/site-header.tsx
"use client";

import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { SearchDialog } from "../search-dialog";
import { TagsButton } from "../tags-button";

export function SiteHeader() {
  return (
    <header>
      <div className="flex items-center justify-between py-1 ">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          minjae.log
        </Link>

        <div className="flex items-center gap-2">
          <SearchDialog />
          <TagsButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
