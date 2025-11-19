"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { BiSearch, BiFile } from "react-icons/bi";

type PagefindResult = {
  id: string;
  data: () => Promise<{ url: string; meta: { title: string } }>;
};

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openSearch = () => setOpen(true);

    document.addEventListener("keydown", down);
    document.addEventListener("openSearch", openSearch);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("openSearch", openSearch);
    };
  }, []);

  // Pagefind 검색 로직
  const handleSearch = async (term: string) => {
    if (typeof window === "undefined" || !window.pagefind) return;

    // term이 비어있으면 결과 초기화
    if (!term) {
      setResults([]);
      return;
    }

    const search = await window.pagefind.search(term);
    // 상위 5개 결과만 로딩
    const data = await Promise.all(
      search.results.slice(0, 5).map((r: PagefindResult) => r.data()),
    );
    setResults(data);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Search"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-page shadow-2xl">
        <div className="flex items-center border-b border-border px-3">
          <BiSearch className="mr-2 h-5 w-5 text-second" />
          <Command.Input
            placeholder="Search for posts..."
            onValueChange={handleSearch}
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-second text-heading"
          />
          <div className="text-xs text-second px-2 border border-border rounded">
            ESC
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-second">
            No results found.
          </Command.Empty>

          {results.map((result, idx) => (
            <Command.Item
              key={idx}
              onSelect={() => {
                setOpen(false);
                router.push(result.url);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-heading aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
            >
              <BiFile className="h-4 w-4 text-second" />
              <span>{result.meta.title}</span>
            </Command.Item>
          ))}
        </Command.List>

        <div className="border-t border-border bg-gray-50 px-3 py-1.5 text-xs text-second dark:bg-gray-900">
          Select <kbd className="font-sans">↵</kbd>
        </div>
      </div>
    </Command.Dialog>
  );
}

declare global {
  interface Window {
    pagefind: any;
  }
}
