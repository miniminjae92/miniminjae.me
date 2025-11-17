import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/insight", label: "Insight" },
  { href: "/memo", label: "Memo" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          minjae.log
        </Link>
        <nav className="flex gap-4 text-xs font-medium text-neutral-400">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
