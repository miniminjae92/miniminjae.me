// src/app/api/studio/preview/route.ts
//
// 초안 본문을 사이트와 같은 파이프라인으로 렌더한다.
//
// velite.config.ts 의 플러그인 구성을 그대로 복제한다. 미리보기가 실제
// 화면과 다르면 미리보기를 만든 이유가 사라지므로, 플러그인을 하나
// 추가하거나 뺄 때는 양쪽을 같이 고쳐야 한다.
//
// 차이가 하나 있다. 여기는 마크다운 파이프라인이라 MDX 의 JSX 컴포넌트
// (<Callout>, <Spacer>)를 해석하지 못한다. 수집한 초안 79편은 전부 순수
// 마크다운이라 문제가 없고, JSX 를 쓴 공개 글은 실제 라우트에서 봐야 한다.

import { NextResponse } from "next/server";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { parseFrontmatter } from "@/lib/studio";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypePrettyCode, {
    theme: { light: "github-light-default", dark: "github-dark" },
    keepBackground: false,
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { content } = await request.json();
    if (typeof content !== "string") {
      return NextResponse.json({ error: "content 가 필요합니다." }, { status: 400 });
    }

    const { data, body } = parseFrontmatter(content);
    // MDX 이스케이프(\{, \<)는 마크다운 파서에게는 의미가 없다. 그대로 두면
    // 역슬래시가 화면에 보이므로 미리보기에서만 되돌린다.
    const unescaped = body.replace(/\\([{}<])/g, "$1");
    const file = await processor.process(unescaped);

    return NextResponse.json({
      html: String(file),
      title: typeof data.title === "string" ? data.title : "",
      date: typeof data.date === "string" ? data.date : "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
