// velite.config.ts
import { defineConfig, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";

const prettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
};

export default defineConfig({
  root: "src/content",

  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },

  collections: {
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
          code: s.mdx({
            rehypePlugins: [[rehypePrettyCode, prettyCodeOptions as any]],
          }),
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
          code: s.mdx({
            rehypePlugins: [[rehypePrettyCode, prettyCodeOptions as any]],
          }),
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
          code: s.mdx({
            rehypePlugins: [[rehypePrettyCode, prettyCodeOptions as any]],
          }),
        })
        .transform((entry) => ({
          ...entry,
          permalink: `/log/${entry.slug}`,
          type: "log" as const,
        })),
    },
  },
});
