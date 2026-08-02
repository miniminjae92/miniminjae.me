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
