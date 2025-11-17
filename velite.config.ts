// velite.config.ts
import { defineConfig, s } from "velite";

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
          title: s.string().max(100),
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
          title: s.string().max(100),
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
  },
});
