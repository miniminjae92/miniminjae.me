// src/components/comments.tsx
"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "noborder_gray" : "noborder_light";

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-8 w-full">
      <Giscus
        id="comments"
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}
