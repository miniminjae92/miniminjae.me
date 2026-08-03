// src/lib/studio.ts
//
// Studio 는 개발 환경 전용 도구다. 파일을 쓰는 API 이므로 경계를 코드로
// 강제한다. 규약이나 주석이 아니라 호출마다 검사한다.
//
// 이 모듈은 서버에서만 import 한다. 클라이언트에서 쓰면 node:fs 가 없어
// 빌드가 깨지므로 실수로 새는 경로는 없다.

import { readdir, readFile, writeFile, mkdir, rm, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { WritingLens } from "@/config/lens";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src/content");
const DRAFTS_DIR = ".drafts";

/**
 * 렌즈 → 디렉터리.
 *
 * 폴더 이름이 렌즈 이름과 다른 건 permalink 를 지키기 위해서다.
 * private 만 .drafts 로 빠지고, 이 디렉터리는 gitignore 되어 커밋되지 않는다.
 */
export const LENS_DIR: Record<WritingLens | "private", string> = {
  understand: "insight",
  solve: "memo",
  reflect: "log",
  private: DRAFTS_DIR,
};

export const DIR_LENS: Record<string, WritingLens | "private"> = {
  insight: "understand",
  memo: "solve",
  log: "reflect",
  [DRAFTS_DIR]: "private",
};

export type StudioLens = WritingLens | "private";

export interface StudioDoc {
  /** src/content 기준 상대 경로. 이 값이 API 의 유일한 식별자다. */
  id: string;
  slug: string;
  title: string;
  date: string;
  lens: StudioLens;
  /** 나만보기면 true. .drafts 아래인지로만 판정한다. */
  isPrivate: boolean;
  source?: string;
  sourceUrl?: string;
  tags: string[];
  chars: number;
}

/** 프로덕션에서는 존재하지 않는 기능이다. 모든 진입점이 이걸 먼저 부른다. */
export function assertDev(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Studio 는 개발 환경에서만 동작합니다.");
  }
}

/**
 * 경로 검증. `..` 이나 절대 경로로 src/content 밖을 건드리지 못하게 한다.
 *
 * 문자열 검사가 아니라 resolve 후 접두사 비교를 쓴다. 인코딩 트릭이나
 * 심볼릭 링크가 아닌 한 문자열 필터는 우회된다.
 */
export function resolveDocPath(id: string): string {
  const abs = path.resolve(CONTENT, id);
  const rel = path.relative(CONTENT, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`src/content 밖의 경로입니다: ${id}`);
  }
  if (!abs.endsWith(".mdx")) {
    throw new Error(`.mdx 파일만 다룹니다: ${id}`);
  }
  return abs;
}

// ────────────────────────────────────────────── frontmatter

/**
 * 최소 frontmatter 파서.
 *
 * 전체 YAML 을 지원하지 않는다. Studio 가 읽는 건 스칼라 몇 개와 문자열
 * 배열 하나뿐이고, 진짜 스키마 검증은 velite 가 빌드 때 한다. 여기서
 * 파서를 하나 더 들이면 두 곳의 해석이 어긋난다.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  body: string;
} {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { data: {}, body: raw };

  const data: Record<string, string | string[]> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue.trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body: raw.slice(m[0].length) };
}

function str(v: string | string[] | undefined, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

// ─────────────────────────────────────────────────── listing

async function listDir(dirName: string): Promise<StudioDoc[]> {
  const dir = path.join(CONTENT, dirName);
  if (!existsSync(dir)) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  const docs: StudioDoc[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const file = path.join(dir, entry.name, "index.mdx");
    if (!existsSync(file)) continue;

    const raw = await readFile(file, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const isPrivate = dirName === DRAFTS_DIR;

    docs.push({
      id: path.join(dirName, entry.name, "index.mdx"),
      slug: str(data.slug, entry.name),
      title: str(data.title, entry.name),
      // 기존 공개 글은 date 에 시각까지 들어 있다. 목록에서는 날짜만 쓴다.
      date: str(data.date, "1970-01-01").slice(0, 10),
      lens: isPrivate ? "private" : (DIR_LENS[dirName] as StudioLens),
      isPrivate,
      source: str(data.source) || undefined,
      sourceUrl: str(data.sourceUrl) || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      chars: body.trim().length,
    });
  }
  return docs;
}

/** 공개 글과 나만보기를 한 목록으로 준다. 최신순. */
export async function listDocs(): Promise<StudioDoc[]> {
  assertDev();
  const all = await Promise.all(
    [DRAFTS_DIR, "insight", "memo", "log"].map(listDir),
  );
  return all.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export async function readDoc(id: string): Promise<string> {
  assertDev();
  return readFile(resolveDocPath(id), "utf8");
}

export async function saveDoc(id: string, content: string): Promise<void> {
  assertDev();
  const abs = resolveDocPath(id);
  if (!existsSync(abs)) throw new Error(`없는 파일입니다: ${id}`);
  await writeFile(abs, content, "utf8");
}

/**
 * 렌즈를 바꾼다 = 파일을 옮긴다.
 *
 * private → 공개 렌즈로 옮기는 것이 곧 "발행"이다. 되돌리는 것도 같은
 * 연산이라 별도 unpublish 를 두지 않는다.
 *
 * 이미지 등 형제 파일이 같이 가야 하므로 폴더째 옮긴다.
 */
export async function moveDoc(
  id: string,
  toLens: StudioLens,
): Promise<{ id: string }> {
  assertDev();
  const abs = resolveDocPath(id);
  const fromDir = path.dirname(abs);
  const slug = path.basename(fromDir);

  const toDirName = LENS_DIR[toLens];
  const toDir = path.join(CONTENT, toDirName, slug);

  if (path.resolve(fromDir) === path.resolve(toDir)) return { id };
  if (existsSync(toDir)) {
    throw new Error(`대상에 같은 이름이 이미 있습니다: ${toDirName}/${slug}`);
  }

  // 공개로 나가는 글은 frontmatter 도 공개 스키마에 맞춰야 velite 가 받는다.
  // lens 는 폴더가 결정하므로 필드로 남기지 않고, 대신 description 자리를
  // 비워 둔다. source/sourceUrl 은 출처 표기라 남긴다.
  if (toLens !== "private") {
    const raw = await readFile(abs, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const lines = [
      "---",
      `title: "${str(data.title).replace(/"/g, '\\"')}"`,
      `slug: ${slug}`,
      `date: ${str(data.date, new Date().toISOString().slice(0, 10))}`,
      `description: "${str(data.description).replace(/"/g, '\\"')}"`,
      `tags: [${(Array.isArray(data.tags) ? data.tags : [])
        .map((t) => `"${t}"`)
        .join(", ")}]`,
      // 출처와 교정 이력은 발행 후에도 남긴다. 옛 글을 다시 싣는 것이므로
      // 어디서 왔고 언제 손봤는지가 글 자체만큼 중요하다.
      ...(data.source ? [`source: "${str(data.source)}"`] : []),
      ...(data.sourceUrl ? [`sourceUrl: "${str(data.sourceUrl)}"`] : []),
      ...(data.edited ? [`edited: ${str(data.edited)}`] : []),
      "---",
      "",
    ].join("\n");
    await writeFile(abs, lines + body.trimStart(), "utf8");
  }

  await mkdir(path.dirname(toDir), { recursive: true });
  await rename(fromDir, toDir);

  return { id: path.join(toDirName, slug, "index.mdx") };
}

/** 초안 삭제. 공개 글은 이 API 로 지울 수 없다. */
export async function deleteDraft(id: string): Promise<void> {
  assertDev();
  const abs = resolveDocPath(id);
  const rel = path.relative(CONTENT, abs);
  if (!rel.startsWith(DRAFTS_DIR + path.sep)) {
    throw new Error("공개 글은 Studio 에서 삭제하지 않습니다. git 으로 다루세요.");
  }
  await rm(path.dirname(abs), { recursive: true, force: true });
}
