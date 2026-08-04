// velite.config.ts
import { defineConfig, s } from "velite";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";

export default defineConfig({
  root: "src/content",

  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },

  mdx: {
    gfm: true,
    remarkPlugins: [remarkGfm, remarkSmartypants, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light-default",
            dark: "github-dark",
          },
          keepBackground: false,
        },
      ],
    ],
  },

  collections: {
    /**
     * 자기소개서. 문서 하나뿐이라 single: true.
     *
     * 스키마가 콘텐츠보다 먼저 만들어지지 않았다는 점이 중요하다.
     * src/content/about/index.mdx 를 먼저 쓰고 그 모양에 맞춰 여기를 채웠다.
     * timeline 이 구조체인 것도 글을 쓰다가 드러난 사실이지 미리 정한 게 아니다.
     */
    about: {
      name: "About",
      pattern: "about/index.mdx",
      single: true,
      schema: s.object({
        headline: s.string(),
        role: s.string(),
        now: s.array(s.string()).default([]),

        /**
         * 증거로 가는 입구. 이 페이지에 없던 유일한 구성이다.
         *
         * 포트폴리오가 별도 라우트라, /about 만 읽는 검토자는 물건을 한 번도
         * 보지 못한 채 주장과 수강 이력만 읽고 나간다. 경력 전환자에게는
         * 기본값이 "증거 없음"이라 그 구멍이 특히 크다.
         *
         * ref 는 글 slug 또는 프로젝트 slug 다. permalink 가 아니라 bare slug 를
         * 쓰는 건 writings 와 같은 이유 — 나중에 URL 이 바뀌어도 살아남는다.
         * 존재하지 않는 slug 는 lib/about.ts 가 빌드 타임에 잡는다.
         */
        selected: s
          .array(
            s.object({
              ref: s.string(),
              // 왜 이걸 먼저 읽어야 하는가. 목록이 아니라 안내가 되게 하는 값.
              why: s.string(),
            }),
          )
          .default([]),

        /**
         * 두 그룹으로 나눈다.
         *
         * 평평한 나열은 검토자에게 키워드 대조를 시키고, 그건 경력 전환자가
         * 반드시 지는 게임이다. 스스로 "손에 익은 것"과 "만져 본 것"을 갈라
         * 놓은 것 자체가 신호가 된다.
         */
        stack: s
          .object({
            primary: s.array(s.string()).default([]),
            familiar: s.array(s.string()).default([]),
          })
          .default({ primary: [], familiar: [] }),

        timeline: s
          .array(
            s.object({
              label: s.string(),
              start: s.isodate(),
              // 없으면 "진행 중"
              end: s.isodate().optional(),
              note: s.string().optional(),
              /**
               * 자격증이 사는 자리.
               *
               * 스택에 넣지 않는다 — 스택은 "무엇으로 만드는가"이고 자격증은
               * 도구가 아니다. 자격증은 날짜가 있고 끝난 노력이라 타임라인의
               * 모양과 정확히 맞는다. 경력 전환자에게는 특히, 전환기에 검증
               * 가능한 노력을 지속했다는 증거로 읽히는 자리가 여기다.
               *
               * 항목이 서너 개뿐일 때 자격증만 별도 섹션으로 빼면 오히려
               * 얇아 보인다. 종류가 늘면 그때 쪼갠다.
               */
              kind: s
                .enum(["education", "certification", "work", "project"])
                .optional(),
            }),
          )
          .default([]),
        /**
         * 일하는 방식의 한 줄 요약들. 헤더 밴드 우측에 올라간다.
         *
         * 본문(code)의 소제목과 같은 문장을 쓴다 — 밴드는 요약을, 본문은
         * 근거를 맡는 관계라 둘이 어긋나면 다른 사람처럼 읽힌다.
         */
        philosophy: s.array(s.string()).default([]),
        updated: s.isodate(),
        code: s.mdx(),
      }),
    },

    /**
     * Portfolio 항목 = Constellation. 문제, 판단, 결과, 관련 Writing 이
     * 연결된 하나의 단위다.
     *
     * 스키마는 src/content/portfolio/*.mdx 세 건을 먼저 쓰고 그 모양에
     * 맞춰 만들었다. metrics 가 전부 비어 있는 것도, visibility 가 3개 중
     * 2개 private 인 것도 실제 콘텐츠에서 나온 사실이다.
     *
     * 공개 용어는 Portfolio 지만 컬렉션 키는 projects 다. s.slug 네임스페이스와
     * 라우트 이름을 분리해 둔다.
     */
    projects: {
      name: "Project",
      pattern: "portfolio/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug("projects"),
          // 시작일. 타임라인 정렬 축이 된다.
          date: s.isodate(),
          // 없으면 진행 중
          endDate: s.isodate().optional(),
          summary: s.string().max(200),
          role: s.string(),
          // 소스와 인터페이스의 공개 여부. 설계와 판단은 어느 쪽이든 공개한다.
          visibility: s.enum(["public", "private"]).default("public"),
          stack: s.array(s.string()).default([]),
          tags: s.array(s.string()).default([]),
          problem: s.string(),
          // 버린 선택지를 반드시 포함한다. 이 페이지의 심장.
          judgment: s.array(s.string()).default([]),
          metrics: s
            .array(
              s.object({
                label: s.string(),
                // 문자열 고정. "420ms → 180ms" 같은 델타를 그대로 통과시키고
                // 단위 연산이나 자동 포맷으로 가짜 정밀도가 생기지 않게 한다.
                value: s.string(),
                // 조건/분모. 이걸 못 적는 metric 은 싣지 않는다.
                note: s.string().optional(),
              }),
            )
            .default([]),
          // 글 permalink 가 아니라 bare slug. 나중에 URL 이 바뀌어도 살아남는다.
          writings: s.array(s.string()).default([]),
          links: s
            .array(s.object({ label: s.string(), href: s.string() }))
            .default([]),
          code: s.mdx(),
        })
        .transform((entry) => ({
          ...entry,
          permalink: `/portfolio/${entry.slug}`,
          type: "project" as const,
        })),
    },

    insights: {
      name: "Insight",
      pattern: "insight/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug("insights"),
          date: s.isodate(),
          description: s.string().optional(),
          tags: s.array(s.string()).default([]),
          code: s.mdx(),
        })
        .transform((entry) => ({
          ...entry,
          permalink: `/insight/${entry.slug}`,
          type: "insight" as const,
          lens: "understand" as const,
        })),
    },

    memos: {
      name: "Memo",
      pattern: "memo/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug("memos"),
          date: s.isodate(),
          description: s.string().optional(),
          tags: s.array(s.string()).default([]),
          code: s.mdx(),
        })
        .transform((entry) => ({
          ...entry,
          permalink: `/memo/${entry.slug}`,
          type: "memo" as const,
          lens: "solve" as const,
        })),
    },

    logs: {
      name: "Log",
      pattern: "log/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug("logs"),
          date: s.isodate(),
          description: s.string().optional(),
          tags: s.array(s.string()).default([]),
          code: s.mdx(),
        })
        .transform((entry) => ({
          ...entry,
          permalink: `/log/${entry.slug}`,
          type: "log" as const,
          lens: "reflect" as const,
        })),
    },
  },
});
