// src/components/post/author-profile.tsx
import Link from "next/link";
import { PROFILE } from "@/config/site-metadata";
import { SocialLinks } from "../ui/social-links";

/**
 * ArchiveNav 를 여기서 제거했다. 상세 페이지는 이미 header 에서 한 번
 * 렌더하고 있어서 같은 내비게이션이 한 화면에 두 번 나오고 있었다.
 *
 * 대신 ArchiveNav 가 들고 있던 "by 강민재" 정체성 신호는 여기 남기고,
 * /about 으로 나가는 출구를 만든다. 18개 글 전부가 자기소개서로 가는
 * 유입 경로가 된다.
 */
export default function AuthorProfile() {
  return (
    <div className="border border-border rounded px-4 py-6 space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-second">
          by <span className="text-heading">{PROFILE.name}</span>
        </p>
        <Link
          href="/about"
          className="shrink-0 text-sm text-second hover:text-heading"
        >
          자기소개 →
        </Link>
      </div>

      <SocialLinks
        email={PROFILE.email}
        github={PROFILE.github}
        linkedin={PROFILE.linkedin}
      />
    </div>
  );
}
