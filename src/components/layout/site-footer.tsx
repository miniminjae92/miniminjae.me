import Link from "next/link";
import { RealTimeClock } from "../features/real-time-clock";
import { NAV_ITEMS } from "@/config/navigation";
import { PROFILE } from "@/config/site-metadata";

/**
 * 푸터가 모든 깊은 페이지에서 나머지 영역으로 나가는 출구가 된다.
 * "하나의 웹사이트에서 모두 표현"이 실무에서 실제로 의미하는 게 이것이다.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20">
      <div className="space-y-6 py-10 text-xs text-second">
        <nav aria-label="사이트 맵">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-heading"
                  title={item.ko}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tags" className="hover:text-heading">
                Tags
              </Link>
            </li>
            <li>
              <a href="/rss.xml" className="hover:text-heading">
                RSS
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-between gap-4">
          <span>Copyright © {PROFILE.name}</span>
          <span className="font-mono text-[11px] tabular-nums">
            <RealTimeClock />
          </span>
        </div>
      </div>
    </footer>
  );
}
