#!/usr/bin/env node
// scripts/new-post.mjs
//
// 글 하나를 스캐폴딩한다. 폴더를 만들고 slug 를 폴더명과 맞추고 오늘 날짜를
// 넣는다. 이 셋이 손으로 할 때 가장 자주 어긋나는 값들이다.
//
// 사용법:
//   pnpm new                        # 대화형
//   pnpm new solve git-worktree     # 렌즈 + slug
//   pnpm new private 2026-회고      # 나만보기(.drafts)로

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

/**
 * 렌즈 → 디렉터리.
 *
 * 공개 글의 폴더 이름이 렌즈 이름과 다른 건 permalink 를 지키기 위해서다.
 * /insight/:slug 18건에 RSS guid 와 Giscus 스레드가 묶여 있다.
 * private 만 src/content/.drafts 로 빠진다 — gitignore 되어 커밋되지 않는다.
 */
const LENSES = {
  understand: { dir: "src/content/insight", label: "개념·원리·구조를 이해시킨다" },
  solve: { dir: "src/content/memo", label: "문제와 해결 과정을 재사용하게 한다" },
  reflect: { dir: "src/content/log", label: "경험에서 얻은 판단과 다음 질문" },
  private: { dir: "src/content/.drafts", label: "나만보기 — 커밋되지 않는다" },
};

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[’'"`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

const today = new Date().toISOString().slice(0, 10);

let [lens, ...rest] = process.argv.slice(2);
let title = rest.join(" ");

if (!lens || !(lens in LENSES) || !title) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  if (!lens || !(lens in LENSES)) {
    console.log("\n렌즈를 고르세요:\n");
    for (const [key, v] of Object.entries(LENSES)) {
      console.log(`  ${key.padEnd(11)} ${v.label}`);
    }
    lens = (await rl.question("\n렌즈 > ")).trim();
    while (!(lens in LENSES)) {
      lens = (await rl.question(`'${lens}' 는 없습니다. 다시 > `)).trim();
    }
  }
  if (!title) {
    title = (await rl.question("제목 > ")).trim();
    while (!title) title = (await rl.question("제목이 필요합니다 > ")).trim();
  }
  rl.close();
}

const slug = slugify(title);
if (!slug) {
  console.error("제목에서 slug 를 만들 수 없습니다.");
  process.exit(1);
}

const dir = path.join(ROOT, LENSES[lens].dir, slug);
if (existsSync(dir)) {
  console.error(`\n이미 있습니다: ${path.relative(ROOT, dir)}`);
  process.exit(1);
}

const isPrivate = lens === "private";

const frontmatter = [
  "---",
  `title: "${title.replace(/"/g, '\\"')}"`,
  `slug: ${slug}`,
  `date: ${today}`,
  ...(isPrivate ? ["lens: private"] : [`description: ""`]),
  "tags: []",
  "---",
  "",
  "",
].join("\n");

await mkdir(dir, { recursive: true });
await writeFile(path.join(dir, "index.mdx"), frontmatter);

const rel = path.relative(ROOT, path.join(dir, "index.mdx"));
console.log(`\n✅ ${rel}`);
console.log(`   렌즈 ${lens} · ${today}`);
if (isPrivate) {
  console.log(`   나만보기입니다. gitignore 되어 커밋·배포되지 않습니다.`);
} else {
  console.log(`   공개 글입니다. 저장하면 pnpm dev 가 즉시 반영합니다.`);
}
console.log(`\n   이미지는 같은 폴더에 넣고 커밋 전 pnpm compress 를 실행하세요.\n`);
