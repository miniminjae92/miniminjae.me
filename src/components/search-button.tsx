"use client";

import { BiSearch } from "react-icons/bi";

export function SearchButton() {
  return (
    <button
      onClick={() => document.dispatchEvent(new Event("openSearch"))}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-second hover:text-heading"
      aria-label="Open Search"
    >
      <BiSearch className="h-5 w-5" />
    </button>
  );
}
