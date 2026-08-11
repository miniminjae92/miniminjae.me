// src/components/post/author-profile.tsx
import { ArchiveNav } from "../layout/archive-nav";
import { PROFILE } from "@/config/site-metadata";
import { SocialLinks } from "../ui/social-links";

/**
 * main 의 박스를 되살렸다. "by 강민재"와 알약형 내비는 ArchiveNav 가 함께
 * 들고 있고, 이 박스는 테두리와 연락 아이콘만 얹는다.
 *
 * 헤더에는 넣지 않는다 — main 이 겪던 "같은 내비게이션이 한 화면에 두 번"은
 * 그대로 두면 안 되는 문제였다. 여기 한 곳에만 있다.
 */
export default function AuthorProfile() {
  return (
    <div className="space-y-2 rounded border border-border px-4 py-6">
      <ArchiveNav />

      <SocialLinks
        email={PROFILE.email}
        github={PROFILE.github}
        linkedin={PROFILE.linkedin}
      />
    </div>
  );
}
