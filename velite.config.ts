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
        stack: s.array(s.string()).default([]),
        timeline: s
          .array(
            s.object({
              label: s.string(),
              start: s.isodate(),
              // 없으면 "진행 중"
              end: s.isodate().optional(),
              note: s.string().optional(),
            }),
          )
          .default([]),
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
        })),
    },
  },
});
