import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { SearchButton } from "../search-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/insight", label: "Insight" },
  { href: "/memo", label: "Memo" },
  { href: "/log", label: "Log" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-heading"
        >
          minjae.log
        </Link>

        <div className="flex items-center gap-4">
          <SearchButton />

          <nav className="flex gap-3 text-xs font-medium text-second">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-heading transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
