import type { Metadata } from "next";
import Image from "next/image";
import { AboutTimeline } from "@/components/about/about-timeline";
import { PROFILE, SITE_URL } from "@/config/site-metadata";
import { aboutDoc, allPosts } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { getAllPostsDesc } from "@/lib/posts";
import { getAllProjectsDesc } from "@/lib/projects";
import Link from "next/link";

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

/** 대표를 몇 개까지 보여줄지. 늘리면 큐레이션이 아니라 목록이 된다. */
const FEATURED_COUNT = 3;

/**
 * 섹션 제목은 영문 단독이다 — 한글 병기는 한 칸에 두 줄을 만들어 제목이
 * 캡션이 된다. 구획은 열 사이 세로선 하나가 맡는다(구획 시안 A).
 * 이 문법(헤어라인·영문 제목·점 표기 날짜)이 다른 페이지들의 기준이다.
 */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl leading-tight text-heading">{children}</h2>;
}

const SECTION_FRAME = "min-w-0 space-y-6";

export default function AboutPage() {
  const about = aboutDoc;
  const certifications = about.timeline.filter(
    (entry) => entry.kind === "certification",
  );
  const timeline = about.timeline.filter(
    (entry) => entry.kind !== "certification",
  );
  const projects = getAllProjectsDesc();
  const recentPosts = getAllPostsDesc().slice(0, FEATURED_COUNT);

  const contact = [
    { href: `mailto:${PROFILE.email}`, label: PROFILE.email },
    { href: PROFILE.github, label: PROFILE.github.replace("https://", "") },
    { href: PROFILE.linkedin, label: PROFILE.linkedin.replace("https://", "") },
  ];

  return (
    <article className="mt-8 mb-page">
      {/* 이력서형 헤더 밴드 — 사진 · 이름 · 철학 요약.
          첫 화면이 사람(이름)과 주장(헤드라인·일하는 방식)을 함께 보여준다.
          contact 는 페이지 맨 아래로 — 읽기를 마친 사람이 찾는 정보다.
          영문 이름은 동일 무게 병기가 아니라 작은 자간 넓은 라벨이다. */}
      <header className="flex flex-wrap items-end gap-x-8 gap-y-6 border-b border-border pb-9">
        {/* 원본이 1086×1448 로 이미 정확히 3:4 라 잘라내지 않았다.
            테두리는 자리표시자에서 그대로 가져온다 — 사진도 다른 구획과
            같은 1px 헤어라인을 쓴다(ADR-0002). */}
        <Image
          src="/profile.webp"
          alt="강민재와 아기, 강아지를 함께 그린 색연필 그림"
          width={768}
          height={1024}
          priority
          className="aspect-[3/4] w-48 shrink-0 border border-border object-cover"
        />

        <div className="min-w-0">
          <h1 className="text-4xl leading-tight text-heading">
            {PROFILE.name}
          </h1>
          <p className="mt-1.5 text-xs tracking-[0.18em] text-disabled uppercase">
            {PROFILE.nameEn}
          </p>
          <p className="mt-3 text-sm text-second">{about.role}</p>
        </div>

        {/* grow + max-w 로 블록의 오른쪽 모서리를 밴드 끝선에 붙인다.
            shrink-to-fit 이면 가장 긴 행 기준으로 오른쪽에 어정쩡한 틈이
            남아 붕 떠 보인다. 이름과의 중앙 여백은 의도된 간격이라
            폭은 조금씩만 늘린다 — 중앙 여백을 다 먹으면 밴드가 답답해진다. */}
        <div className="ml-auto min-w-0 grow basis-0 self-end space-y-5 max-w-[38ch]">
          <p className="text-base leading-8 text-balance text-heading">
            {about.headline}
          </p>
          {about.philosophy.length > 0 ? (
            <ul className="space-y-1.5">
              {about.philosophy.map((line) => (
                <li key={line} className="text-sm text-body">
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
          {about.now.length > 0 ? (
            <div className="space-y-1">
              {about.now.map((line) => (
                <p key={line} className="text-sm text-second">
                  {line}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {/* 여섯 섹션이 하나의 4:3 그리드를 공유한다.
          행마다 그리드를 따로 만들면 열 경계가 행 사이에서 어긋난다 —
          세로 기준선이 페이지 전체를 관통해야 좌표로 읽힌다.
          왼쪽(넓은 열): Timeline · Writing · Skills / 오른쪽: 자격·작업·연락. */}
      <div className="relative mt-11 grid gap-x-14 gap-y-12 md:grid-cols-[4fr_3fr]">
        {/* 열 사이 세로선. 4fr:3fr 경계의 거터 한가운데 —
            (전체 폭 − 거터 3.5rem) × 4/7 + 거터 절반. 행이 늘어도
            컨테이너 높이를 따라 자란다. 모바일 1열에서는 숨긴다. */}
        <span
          aria-hidden
          className="absolute top-1 bottom-1 hidden w-px bg-border md:block"
          style={{ left: "calc((100% - 3.5rem) * 4 / 7 + 1.75rem)" }}
        />
        {timeline.length > 0 ? (
          <section className={SECTION_FRAME}>
            <SectionHeading>Timeline</SectionHeading>
            <AboutTimeline items={timeline} />
          </section>
        ) : null}

        {certifications.length > 0 ? (
          <section className={SECTION_FRAME}>
            <SectionHeading>Certifications</SectionHeading>
            {/* 섹션 이름이 이미 종류를 말하므로 kind 마커는 중복이다. */}
            <AboutTimeline items={certifications} showKind={false} />
          </section>
        ) : null}

        {/* 대표를 보여준다 — 갯수는 정보가 없고, 검토자가 타고 들어갈
            입구가 필요하다. 타이틀 옆 부가설명은 있으면 싣고 없으면
            비운다 — dref 같은 고유명사는 이름만으로 아무것도 말하지 않는다. */}
        <section className={SECTION_FRAME}>
          <SectionHeading>Writing</SectionHeading>
          <ul className="space-y-2.5">
            {recentPosts.map((post) => (
              <li key={post.slug} className="text-sm">
                <Link
                  className="text-body hover:text-heading"
                  href={post.permalink}
                >
                  {post.title}
                </Link>
                {post.description ? (
                  <span className="ml-2 text-xs text-disabled">
                    {post.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link className="text-second hover:text-heading" href="/writing">
              글 {allPosts.length}편 · 전체 보기 →
            </Link>
          </p>
        </section>

        <section className={SECTION_FRAME}>
          <SectionHeading>Projects</SectionHeading>
          <ul className="space-y-2.5">
            {projects.slice(0, FEATURED_COUNT).map((project) => (
              <li key={project.slug} className="text-sm">
                <Link
                  className="text-body hover:text-heading"
                  href={project.permalink}
                >
                  {project.title}
                </Link>
                <span className="ml-2 text-xs text-disabled">
                  {project.summary}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link className="text-second hover:text-heading" href="/portfolio">
              공개된 작업 {projects.length}건 · 전체 보기 →
            </Link>
          </p>
        </section>

        {about.stack.primary.length + about.stack.familiar.length > 0 ? (
          <section className={SECTION_FRAME}>
            <SectionHeading>Skills</SectionHeading>
            {/* 뱃지도 게이지도 쓰지 않는다. 분모 없는 수치는 신뢰를 깎는다.
                라벨은 구어체("~것") 대신 명사 한 단어 — 이력서형의 톤.
                dd 는 라벨 오른쪽 열 안에서만 줄바꿈한다(행잉 인덴트) —
                두 줄이 되어도 라벨 밑으로 흘러내리지 않는다. */}
            <dl className="space-y-4 text-sm">
              {about.stack.primary.length > 0 ? (
                <div className="flex items-baseline gap-x-4">
                  <dt className="w-16 shrink-0 text-xs text-disabled">주력</dt>
                  <dd className="min-w-0 flex-1 text-body">
                    {about.stack.primary.join(" · ")}
                  </dd>
                </div>
              ) : null}
              {about.stack.familiar.length > 0 ? (
                <div className="flex items-baseline gap-x-4">
                  <dt className="w-16 shrink-0 text-xs text-disabled">경험</dt>
                  <dd className="min-w-0 flex-1 text-second">
                    {about.stack.familiar.join(" · ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}

        <section className={SECTION_FRAME}>
          <SectionHeading>Contact</SectionHeading>
          {/* 아이콘이 아니라 텍스트다 — 이력서에서 주소는 장식이 아니라
              복사·검색되는 정보다. 긴 URL 은 anywhere 로 줄바꿈을 허용해
              min-content 폭이 페이지를 밀지 않게 한다. */}
          <ul className="space-y-1.5 text-sm [overflow-wrap:anywhere]">
            {contact.map((item) => (
              <li key={item.href}>
                <a
                  className="text-body hover:text-heading"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-2xs text-disabled tabular-nums">
            최종 수정 {formatDate(about.updated, "yyyy. MM. dd.")}
          </p>
        </section>
      </div>
    </article>
  );
}
