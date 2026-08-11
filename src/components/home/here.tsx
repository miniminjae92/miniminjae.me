// src/components/home/here.tsx  (HomeHero)
import Link from "next/link";
import { SocialLinks } from "@/components/ui/social-links";
import { PROFILE } from "@/config/site-metadata";
import { aboutDoc } from "@/lib/content";

/**
 * 홈의 주인공은 자기소개다.
 *
 * 다만 홈은 3초 버전(주장 + 증거로 가는 링크)이고 /about 이 3분 버전(증거)이다.
 * 이 경계를 안 정하면 /about 이 홈의 복사본이 된다.
 *
 * 카피는 기존 것을 그대로 둔다. 검증된 목소리이고 사용자가 톤을 계승하기로
 * 했다. 바뀐 건 역할 한 줄과 자기소개서로 가는 출구뿐이다.
 */
export function HomeHero() {
  return (
    <header className="space-y-5">
      <p className="max-w-[34ch] text-lg leading-9 text-balance text-second">
        <span className="font-bold text-body">호기심</span>으로 본질을 묻고,
        복잡함을 <span className="font-bold text-body">단순하게</span> 정돈하는
        과정을 사랑합니다.
        <br />
        모든 것에 <span className="font-bold text-body">감사하며</span>, 제가
        얻은 깨달음이{" "}
        <span className="font-bold text-body">세상에 선한 기여로</span> 남기를
        소망합니다.
      </p>

      <p className="text-sm text-second">
        {PROFILE.name} · {aboutDoc.role}
      </p>

      <div className="flex items-center justify-between gap-4">
        <SocialLinks
          email={PROFILE.email}
          github={PROFILE.github}
          linkedin={PROFILE.linkedin}
        />
        <Link
          href="/about"
          className="shrink-0 text-sm text-second hover:text-heading"
        >
          About me →
        </Link>
      </div>
    </header>
  );
}
