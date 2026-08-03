import type { Metadata } from "next";
import { AboutTimeline } from "@/components/about/about-timeline";
import { SelectedList } from "@/components/about/selected-list";
import { Rail, RailSection } from "@/components/layout/rail";
import { MDXContent } from "@/components/mdx/mdx-content";
import { SocialLinks } from "@/components/ui/social-links";
import { PROFILE, SITE_URL } from "@/config/site-metadata";
import { getSelected } from "@/lib/about";
import { aboutDoc } from "@/lib/content";
import { formatDate } from "@/lib/date";

export function generateMetadata(): Metadata {
  // 기존 /api/og 라우트를 그대로 재사용한다. 신규 인프라 0.
  // date 를 넘기지 않으면 eyebrow 가 SITE_NAME 으로 떨어진다.
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
  const selected = getSelected();

  return (
    <Rail className="space-y-half-page">
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
        <RailSection label="Now">
          <ul className="space-y-1">
            {about.now.map((line) => (
              <li key={line} className="text-body">
                {line}
              </li>
            ))}
          </ul>
        </RailSection>
      ) : null}

      {/* 증거가 철학보다 먼저 온다.
          읽는 사람이 아직 물건을 못 본 상태에서 읽는 가치관은 구호로 읽힌다.
          경력 전환자는 회사 이름이 없어 기본값이 "증거 없음"이라 더 그렇다. */}
      {selected.length > 0 ? (
        <RailSection label="Selected">
          <SelectedList items={selected} />
        </RailSection>
      ) : null}

      {about.timeline.length > 0 ? (
        <RailSection label="Timeline">
          <AboutTimeline items={about.timeline} />
        </RailSection>
      ) : null}

      <RailSection label="How I work">
        <div className="max-w-none text-base text-body">
          <MDXContent code={about.code} />
        </div>
      </RailSection>

      {about.stack.primary.length + about.stack.familiar.length > 0 ? (
        <RailSection label="Stack">
          {/* 뱃지도 게이지도 쓰지 않는다. 분모 없는 수치는 신뢰를 깎는다.
              대신 두 그룹으로 나눈다 — 평평한 나열은 읽는 사람에게 키워드
              대조를 시키고, 스스로 깊이를 갈라 놓은 것 자체가 신호가 된다. */}
          <dl className="space-y-3 text-sm">
            {about.stack.primary.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <dt className="w-24 shrink-0 text-xs text-disabled">
                  주로 쓰는 것
                </dt>
                <dd className="text-body">
                  {about.stack.primary.join(" · ")}
                </dd>
              </div>
            ) : null}
            {about.stack.familiar.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <dt className="w-24 shrink-0 text-xs text-disabled">
                  써 본 것
                </dt>
                <dd className="text-second">
                  {about.stack.familiar.join(" · ")}
                </dd>
              </div>
            ) : null}
          </dl>
        </RailSection>
      ) : null}

      <RailSection label="Contact">
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
