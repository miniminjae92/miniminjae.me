// src/components/layout/archive-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineClockCircle } from "react-icons/ai";
import { FaRegLightbulb, FaRegStickyNote } from "react-icons/fa";
import { PROFILE } from "@/config/site-metadata";
import { cn } from "@/lib/utils";

/**
 * 글 하단의 알약형 내비. main 에 있던 모양을 그대로 되살렸다.
 *
 * 바뀐 것은 두 가지다. 라벨이 Insight/Memo/Log 대신 렌즈 이름이고,
 * 목적지가 /writing 의 렌즈 필터다 — 컬렉션 인덱스(/insight, /memo, /log)는
 * 이 브랜치에서 [slug] 만 남기고 삭제돼 링크할 자리가 없다.
 *
 * 현재 면 판정은 여전히 글이 속한 컬렉션 경로로 한다. log 글을 읽는 중이면
 * Reflect 가 눌린 것으로 보인다 — main 의 동작 그대로다.
 *
 * 헤더에서는 쓰지 않는다. main 에서는 헤더와 이 자리에 두 번 렌더돼 같은
 * 내비게이션이 한 화면에 겹쳐 있었다.
 */
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: AiOutlineHome, section: null },
  {
    href: "/writing?lens=understand",
    label: "Understand",
    icon: FaRegLightbulb,
    section: "/insight",
  },
  {
    href: "/writing?lens=solve",
    label: "Solve",
    icon: FaRegStickyNote,
    section: "/memo",
  },
  {
    href: "/writing?lens=reflect",
    label: "Reflect",
    icon: AiOutlineClockCircle,
    section: "/log",
  },
];

export function ArchiveNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-baseline gap-x-1 text-sm text-second">
      <span className="mr-1 whitespace-nowrap text-disabled">
        by {PROFILE.name}
      </span>

      {NAV_ITEMS.map((item) => {
        const isActive = item.section
          ? pathname.startsWith(item.section)
          : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mt-1.5 flex items-baseline gap-x-0.5 rounded-md px-1.5 py-1 text-[12px] font-semibold whitespace-nowrap transition",
              isActive
                ? "bg-selection text-heading"
                : "text-body hover:bg-selection hover:text-heading",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
