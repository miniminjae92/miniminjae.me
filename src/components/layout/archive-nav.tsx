// src/components/layout/archive-nav.tsx (수정된 코드)
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { AiOutlineHome, AiOutlineClockCircle } from "react-icons/ai";
import { FaRegLightbulb, FaRegStickyNote } from "react-icons/fa";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: AiOutlineHome },
  { href: "/insight", label: "Insight", icon: FaRegLightbulb },
  { href: "/memo", label: "Memo", icon: FaRegStickyNote },
  { href: "/log", label: "Log", icon: AiOutlineClockCircle },
];

export function ArchiveNav() {
  const pathname = usePathname();

  return (
    <div className="text-second text-sm flex items-baseline flex-wrap gap-x-1">
      <span className="text-disabled mr-1 whitespace-nowrap">by 강민재</span>

      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-baseline gap-x-0.5 transition",
              "text-[12px] whitespace-nowrap px-1.5 py-1 rounded-md",

              isActive
                ? "text-heading font-medium"
                : "text-second hover:text-heading",

              isActive ? "bg-gray-200" : "hover:bg-gray-200",
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
