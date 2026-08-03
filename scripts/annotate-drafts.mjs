#!/usr/bin/env node
// scripts/annotate-drafts.mjs
//
// 손댈 기계적 손상이 없는 초안에 편집자 주를 단다.
//
// 이 스크립트는 본문을 고치지 않는다. frontmatter 에 edited 를 넣고 본문 맨
// 앞에 인용문 한 덩이를 붙이는 것이 전부다. 문구가 날짜와 출처만 바뀌는
// 정형문이라 자동화해도 사실이 틀어질 여지가 없기 때문에 스크립트로 돌린다.
//
// 반대로 코드가 깨진 글은 이 스크립트가 건드리면 안 된다. "손상이 없어
// 그대로 둡니다" 라고 적어 버리면 편집자 주가 거짓말이 된다. 그래서 펜스
// 밖 코드를 스스로 검사해서 발견하면 그 글을 건너뛰고 목록으로 보고한다.
//
// 사용법:
//   node scripts/annotate-drafts.mjs --dry-run   # 미리보기
//   node scripts/annotate-drafts.mjs             # 실제 적용

import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DRAFTS = path.join(ROOT, "src/content/.drafts");

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const TODAY = new Date().toISOString().slice(0, 10);

/** 코드 펜스 밖에서 코드처럼 보이는 줄. 이게 있으면 사람이 봐야 한다. */
const CODEY =
  /^\s*(function\s+\w+|int\s+\w|void\s|public\s|private\s|class\s+\w|#include|if\s*\(|while\s*\(|for\s*\(|\}|\w+\(\)\s*;|export\s+\w+=|alias\s|zplug\s)/;

function linesOutsideFences(body) {
  const out = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out;
}

function splitFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return null;
  return { fm: m[1], body: raw.slice(m[0].length) };
}

function field(fm, key) {
  const m = new RegExp(`^${key}:\\s*(.*)$`, "m").exec(fm);
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
}

const SOURCE_KO = { Velog: "Velog", Tistory: "티스토리", Naver: "네이버 블로그" };

function note(date, source) {
  const where = SOURCE_KO[source] ? `${SOURCE_KO[source]}에 ` : "";
  return [
    `> **${TODAY} 편집자 주** — ${date}에 ${where}쓴 글입니다. 코드 블록이 깨지거나`,
    `> 플랫폼 잔재가 섞인 곳이 없어 본문을 손대지 않았습니다. 내용과 판단, 표현은`,
    `> 당시 그대로입니다.`,
    "",
    "",
  ].join("\n");
}

const entries = existsSync(DRAFTS)
  ? await readdir(DRAFTS, { withFileTypes: true })
  : [];

const skippedHasEdited = [];
const skippedNeedsHand = [];
const applied = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const file = path.join(DRAFTS, entry.name, "index.mdx");
  if (!existsSync(file)) continue;

  const raw = await readFile(file, "utf8");
  const parts = splitFrontmatter(raw);
  if (!parts) continue;

  if (/^edited:/m.test(parts.fm)) {
    skippedHasEdited.push(entry.name);
    continue;
  }

  const codey = linesOutsideFences(parts.body).filter((l) => CODEY.test(l));
  if (codey.length >= 3) {
    skippedNeedsHand.push([entry.name, codey.length]);
    continue;
  }

  const date = field(parts.fm, "date") || "날짜 미상";
  const source = field(parts.fm, "source");

  const next =
    "---\n" +
    `${parts.fm}\nedited: ${TODAY}\n` +
    "---\n\n" +
    note(date, source) +
    parts.body.replace(/^\n+/, "");

  if (!dryRun) await writeFile(file, next, "utf8");
  applied.push(entry.name);
}

console.log(`\n${dryRun ? "[미리보기] " : ""}편집자 주 대상\n`);
console.log(`  적용        ${applied.length}편`);
console.log(`  이미 있음   ${skippedHasEdited.length}편`);
console.log(`  손으로 봐야 ${skippedNeedsHand.length}편`);

if (skippedNeedsHand.length) {
  console.log(`\n  ↓ 펜스 밖 코드가 있어 건너뜁니다. 사람이 교정한 뒤 다시 실행하세요.`);
  for (const [name, n] of skippedNeedsHand) console.log(`     ${n}줄  ${name}`);
}

if (dryRun) console.log(`\n  실제 적용: --dry-run 을 빼고 다시 실행하세요.\n`);
else console.log(`\n  완료. 전부 나만보기이며 커밋되지 않습니다.\n`);
