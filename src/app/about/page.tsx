import type { Metadata } from "next";
import { AboutTimeline } from "@/components/about/about-timeline";
import { Rail, RailSection } from "@/components/layout/rail";
import { MDXContent } from "@/components/mdx/mdx-content";
import { SocialLinks } from "@/components/ui/social-links";
import { PROFILE, SITE_URL } from "@/config/site-metadata";
import { aboutDoc } from "@/lib/content";
import { formatDate } from "@/lib/date";

export function generateMetadata(): Metadata {
  // 기존 /api/og 라우트를 그대로 재사용한다. 신규 인프라 0.
  // date 를 넘기지 않으면 eyebrow 가 "minjae.log" 로 떨어진다.
  const ogUrl = new URL("/api/og", SITE_URL);
  ogUrl.searchParams.set("title", PROFILE.name);
  ogUrl.searchParams.set("description", aboutDoc.headline);

  return {
    title: "자기소개",
    description: aboutDoc.headline,
    alternates: { canonical: new URL("/about", SITE_URL).toString() },
    openGraph: {
      title: `${PROFILE.name} — 자기소개`,
      description: aboutDoc.headline,
      url: new URL("/about", SITE_URL).toString(),
      type: "profile",
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${PROFILE.name} — 자기소개`,
      description: aboutDoc.headline,
      images: [ogUrl.toString()],
    },
  };
}

export default function AboutPage() {
  const about = aboutDoc;

  return (
    <Rail className="space-y-half-page pt-10 pb-page">
      <RailSection className="space-y-5">
        <h1 className="max-w-[30ch] text-lg leading-9 text-balance text-heading">
          {about.headline}
        </h1>

        <p className="text-sm text-second">
          {PROFILE.name} · {about.role}
        </p>

        <SocialLinks
          email={PROFILE.email}
          github={PROFILE.github}
          linkedin={PROFILE.linkedin}
        />
      </RailSection>

      {about.now.length > 0 ? (
        <RailSection label="지금" sublabel="Now">
          <ul className="space-y-1">
            {about.now.map((line) => (
              <li key={line} className="text-body">
                {line}
              </li>
            ))}
          </ul>
        </RailSection>
      ) : null}

      <RailSection label="일하는 방식" sublabel="How I work">
        <div className="prose max-w-none text-base text-second">
          <MDXContent code={about.code} />
        </div>
      </RailSection>

      {about.timeline.length > 0 ? (
        <RailSection label="해온 일" sublabel="Timeline">
          <AboutTimeline items={about.timeline} />
        </RailSection>
      ) : null}

      {about.stack.length > 0 ? (
        <RailSection label="다루는 것" sublabel="Stack">
          {/* 뱃지도 게이지도 쓰지 않는다. 분모 없는 수치는 신뢰를 깎는다. */}
          <p className="text-sm text-body">{about.stack.join(", ")}</p>
        </RailSection>
      ) : null}

      <RailSection label="연락" sublabel="Contact">
        <ul className="space-y-1 text-sm">
          <li>
            <a className="text-body hover:text-heading" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email}
            </a>
          </li>
          <li>
            <a className="text-body hover:text-heading" href={PROFILE.github}>
              {PROFILE.github.replace("https://", "")}
            </a>
          </li>
          <li>
            <a className="text-body hover:text-heading" href={PROFILE.linkedin}>
              {PROFILE.linkedin.replace("https://", "")}
            </a>
          </li>
        </ul>
        <p className="mt-6 text-2xs text-disabled tabular-nums">
          최종 수정 {formatDate(about.updated, "yyyy. MM. dd.")}
        </p>
      </RailSection>
    </Rail>
  );
}
