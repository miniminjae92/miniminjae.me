#!/usr/bin/env node
// scripts/import-blogs.mjs
//
// 외부 블로그 3곳의 글을 src/content/.drafts/ 로 수집한다.
//
// 수집 결과는 전부 나만보기(.drafts)로 들어간다. 이 스크립트는 공개
// 콘텐츠를 한 건도 만들지 않는다. 공개 발행은 Studio 에서 사람이 고른
// 글만 src/content/{insight,memo,log}/ 로 옮겨야 일어난다.
//
// 사용법 (pnpm 으로 부른다 — .env.local 로딩이 거기 붙어 있다):
//   pnpm import-blogs              # 전체
//   pnpm import-blogs velog        # 한 곳만
//   pnpm import-blogs --limit 5    # 앞에서 5건만 (연습용)

import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = path.resolve(import.meta.dirname, "..");
const DRAFTS = path.join(ROOT, "src/content/.drafts");

/**
 * 블로그 계정 식별자는 소스에 박지 않는다.
 *
 * 공개 저장소라 여기 적은 값은 되돌릴 수 없이 히스토리에 남는다. 특히
 * 네이버는 개인 일기가 있는 계정이라 직업용 repo 에서 그리로 가는 링크가
 * 생긴다. `.env.local` 은 `.gitignore` 의 `.env*` 에 걸려 커밋되지 않는다.
 *
 * 값이 비면 그 출처를 조용히 건너뛰는 게 아니라 무엇을 채워야 하는지
 * 알려 주고 멈춘다 — 조용한 0건은 수집 실패와 구분되지 않는다.
 */
const SOURCES = {
  velog: { user: process.env.VELOG_USER, label: "Velog", env: "VELOG_USER" },
  tistory: {
    host: process.env.TISTORY_HOST,
    label: "Tistory",
    env: "TISTORY_HOST",
  },
  naver: {
    blogId: process.env.NAVER_BLOG_ID,
    label: "Naver",
    env: "NAVER_BLOG_ID",
  },
};

/** 식별자가 비어 있으면 채워야 할 환경변수 이름, 채워져 있으면 null. */
function missingEnv(name) {
  const source = SOURCES[name];
  const id = source.user ?? source.host ?? source.blogId;
  return id ? null : source.env;
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ─────────────────────────────────────────────────────────── util

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});
turndown.use(gfm);

// 네이버·티스토리가 문단마다 뿌리는 빈 래퍼를 지운다. 남겨두면 변환 결과가
// 빈 줄과 &nbsp; 로 뒤덮인다.
turndown.addRule("stripEmpty", {
  filter: (node) =>
    ["DIV", "SPAN", "P"].includes(node.nodeName) &&
    !node.textContent.replace(/​| |\s/g, "") &&
    !node.querySelector("img"),
  replacement: () => "",
});
turndown.addRule("keepImageAlt", {
  filter: "img",
  replacement: (_c, node) => {
    const src = node.getAttribute("src") ?? node.getAttribute("data-lazy-src");
    if (!src) return "";
    const alt = (node.getAttribute("alt") ?? "").replace(/[\[\]]/g, "");
    return `\n\n![${alt}](${src})\n\n`;
  },
});

/** MDX 는 { 와 < 를 JSX 로 읽는다. 원문 그대로 두면 빌드가 깨진다. */
function escapeForMdx(md) {
  return md
    .replace(/\r\n/g, "\n")
    .replace(/ /g, " ")
    .replace(/​/g, "")
    // 코드펜스·인라인코드 안은 건드리지 않는다.
    //
    // `>` 는 제외한다. MDX 가 신경 쓰지 않는 문자이고, turndown 이 이미
    // 인용문 회피용으로 `\>` 를 넣어 두기 때문에 여기서 또 이스케이프하면
    // `\\>` 가 되어 본문에 역슬래시가 그대로 보인다.
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((chunk, i) => (i % 2 ? chunk : chunk.replace(/(?<!\\)([{}<])/g, "\\$1")))
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** 광고·공유 버튼·트래킹 스크립트를 본문 변환 전에 걷어낸다. */
function stripChrome(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<ins\b[\s\S]*?<\/ins>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function slugify(input, fallback) {
  const s = String(input ?? "")
    .toLowerCase()
    .replace(/[’'"`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || fallback;
}

function toIsoDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function yamlString(v) {
  return `"${String(v ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * 초안 한 건을 쓴다.
 *
 * lens 는 무조건 private 으로 시작한다. 자동 분류하지 않는다 — 사람이
 * 읽고 판단해야 하는 일이고, 잘못 분류된 글이 공개로 새는 것이 이 작업의
 * 유일한 비가역 실패다.
 */
async function writeDraft({ source, slug, title, date, url, tags, body }) {
  const dir = path.join(DRAFTS, `${source}-${slug}`);
  await mkdir(dir, { recursive: true });

  const fm = [
    "---",
    `title: ${yamlString(title)}`,
    `slug: ${source}-${slug}`,
    `date: ${date}`,
    "lens: private",
    `source: ${yamlString(SOURCES[source].label)}`,
    `sourceUrl: ${yamlString(url)}`,
    `tags: [${(tags ?? []).map(yamlString).join(", ")}]`,
    "---",
    "",
  ].join("\n");

  await writeFile(path.join(dir, "index.mdx"), fm + escapeForMdx(body) + "\n");
  return dir;
}

// ─────────────────────────────────────────────────────── velog

async function importVelog(limit) {
  const { user } = SOURCES.velog;
  const gql = async (query, variables) => {
    const res = await fetch("https://api.velog.io/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 200));
    return json.data;
  };

  const { posts } = await gql(
    `query($username:String,$limit:Int){posts(username:$username,limit:$limit){
       id title url_slug released_at }}`,
    { username: user, limit: 100 },
  );

  const list = limit ? posts.slice(0, limit) : posts;
  const out = [];

  for (const [i, p] of list.entries()) {
    const { post } = await gql(
      `query($username:String,$url_slug:String){post(username:$username,url_slug:$url_slug){
         title body released_at tags }}`,
      { username: user, url_slug: p.url_slug },
    );
    if (!post) {
      console.log(`  ⚠️  본문 없음: ${p.title}`);
      continue;
    }
    // velog 는 원본 마크다운을 그대로 준다. 변환 손실이 없다.
    const dir = await writeDraft({
      source: "velog",
      slug: slugify(p.url_slug, p.id.slice(0, 8)),
      title: post.title,
      date: toIsoDate(post.released_at) ?? "1970-01-01",
      url: `https://velog.io/@${user}/${encodeURIComponent(p.url_slug)}`,
      tags: post.tags ?? [],
      body: post.body ?? "",
    });
    out.push(dir);
    console.log(`  [${i + 1}/${list.length}] ${post.title}`);
    await sleep(250);
  }
  return out;
}

// ───────────────────────────────────────────────────── tistory

function extractBetween(html, startRe, endTag) {
  const m = startRe.exec(html);
  if (!m) return null;
  // 시작 태그부터 대응하는 닫는 태그까지 깊이를 세며 자른다.
  const openRe = new RegExp(`<${endTag}\\b`, "gi");
  const closeRe = new RegExp(`</${endTag}>`, "gi");
  let depth = 1;
  let idx = m.index + m[0].length;
  while (depth > 0) {
    openRe.lastIndex = idx;
    closeRe.lastIndex = idx;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) return html.slice(m.index + m[0].length);
    if (o && o.index < c.index) {
      depth += 1;
      idx = o.index + o[0].length;
    } else {
      depth -= 1;
      idx = c.index + c[0].length;
      if (depth === 0) return html.slice(m.index + m[0].length, c.index);
    }
  }
  return null;
}

async function importTistory(limit) {
  const { host } = SOURCES.tistory;
  const sitemap = await fetchText(`https://${host}/sitemap.xml`);
  const urls = [
    ...new Set(
      [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map((m) => m[1])
        .filter((u) => /\/\d+$/.test(u) && !u.includes("/m/")),
    ),
  ].sort((a, b) => Number(a.match(/\d+$/)[0]) - Number(b.match(/\d+$/)[0]));

  const list = limit ? urls.slice(0, limit) : urls;
  console.log(`  글 URL ${urls.length}건 (모바일 중복 제거 후)`);
  const out = [];

  for (const [i, url] of list.entries()) {
    try {
      const html = await fetchText(url);
      const title =
        html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ??
        html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim() ??
        "제목 없음";
      // `2025. 6. 5. 17:23` 형태의 post-meta 가 가장 정확하다. 메타 태그는
      // 스킨에 따라 없거나 수정일로 채워져 있다.
      const rawDate =
        html
          .match(/<span class="date">\s*([\d.\s:]+?)\s*<\/span>/)?.[1]
          ?.replace(/\.\s*/g, "-")
          .replace(/-(\d{2}:\d{2})$/, " $1")
          .replace(/-$/, "") ??
        html.match(/<meta property="article:published_time" content="([^"]*)"/)?.[1] ??
        html.match(/"datePublished"\s*:\s*"([^"]*)"/)?.[1];

      // 광고·공유 버튼·관련 글 표는 .entry-content 안쪽, 본문 div 바깥에 있다.
      // 안쪽 div 를 먼저 노려야 꼬리가 딸려오지 않는다.
      const clean = stripChrome(html);
      const body =
        extractBetween(clean, /<div[^>]*class="[^"]*tt_article_useless_p_margin[^"]*"[^>]*>/i, "div") ??
        extractBetween(clean, /<div[^>]*class="[^"]*contents_style[^"]*"[^>]*>/i, "div") ??
        extractBetween(clean, /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>/i, "div");

      if (!body) {
        console.log(`  ⚠️  본문 못 찾음: ${url}`);
        continue;
      }

      const dir = await writeDraft({
        source: "tistory",
        slug: slugify(title, url.match(/\d+$/)[0]),
        title: title.replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
        date: toIsoDate(rawDate) ?? "1970-01-01",
        url,
        tags: [],
        body: turndown.turndown(body),
      });
      out.push(dir);
      console.log(`  [${i + 1}/${list.length}] ${title.slice(0, 50)}`);
    } catch (err) {
      console.log(`  ⚠️  실패 ${url} — ${err.message}`);
    }
    await sleep(400);
  }
  return out;
}

// ─────────────────────────────────────────────────────── naver

async function importNaver(limit) {
  const { blogId } = SOURCES.naver;
  const rss = await fetchText(`https://rss.blog.naver.com/${blogId}.xml`);
  const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const it = m[1];
    const pick = (tag) => {
      const v = it.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";
      return v.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    };
    return { title: pick("title"), link: pick("link"), date: pick("pubDate") };
  });

  const list = limit ? items.slice(0, limit) : items;
  console.log(`  RSS item ${items.length}건`);
  const out = [];

  for (const [i, it] of list.entries()) {
    try {
      const logNo = it.link.match(/(\d{10,})/)?.[1];
      if (!logNo) {
        console.log(`  ⚠️  logNo 없음: ${it.link}`);
        continue;
      }
      const html = await fetchText(
        `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}` +
          `&redirect=Dlog&widgetTypeCall=true&directAccess=false`,
        { headers: { Referer: `https://blog.naver.com/${blogId}` } },
      );
      const clean = stripChrome(html);
      const body =
        extractBetween(clean, /<div[^>]*class="[^"]*se-main-container[^"]*"[^>]*>/i, "div") ??
        extractBetween(clean, /<div[^>]*id="postViewArea"[^>]*>/i, "div");

      if (!body) {
        console.log(`  ⚠️  본문 못 찾음: ${it.title}`);
        continue;
      }

      const dir = await writeDraft({
        source: "naver",
        slug: slugify(it.title, logNo),
        title: it.title,
        date: toIsoDate(it.date) ?? "1970-01-01",
        url: `https://blog.naver.com/${blogId}/${logNo}`,
        tags: [],
        body: turndown.turndown(body),
      });
      out.push(dir);
      console.log(`  [${i + 1}/${list.length}] ${it.title.slice(0, 50)}`);
    } catch (err) {
      console.log(`  ⚠️  실패 ${it.link} — ${err.message}`);
    }
    await sleep(500);
  }
  return out;
}

// ───────────────────────────────────────────────────────── main

const argv = process.argv.slice(2);
const limitFlag = argv.indexOf("--limit");
const limit = limitFlag >= 0 ? Number(argv[limitFlag + 1]) : null;
const only = argv.filter((a) => a in SOURCES);

const runners = {
  velog: importVelog,
  tistory: importTistory,
  naver: importNaver,
};

const requested = only.length ? only : Object.keys(runners);

// 식별자가 없는 출처는 시작 전에 걸러 낸다. 무엇을 어디에 적어야 하는지
// 같이 알려 준다 — 여기서 막히면 값이 없는 것이지 수집이 실패한 게 아니다.
const blocked = requested.filter((name) => missingEnv(name));
const targets = requested.filter((name) => !missingEnv(name));

if (blocked.length > 0) {
  console.log(`\n건너뜀: ${blocked.map((n) => SOURCES[n].label).join(", ")}`);
  console.log(`.env.local 에 아래를 채우면 수집합니다.`);
  for (const name of blocked) console.log(`  ${missingEnv(name)}=`);
}

if (targets.length === 0) {
  console.log(`\n수집할 출처가 없습니다.\n`);
  process.exit(1);
}

console.log(`\n수집 대상: ${targets.join(", ")}${limit ? ` (각 ${limit}건)` : ""}`);
console.log(`출력: src/content/.drafts/  —  전부 lens: private\n`);

await mkdir(DRAFTS, { recursive: true });

let total = 0;
for (const name of targets) {
  console.log(`── ${SOURCES[name].label} ──`);
  try {
    const dirs = await runners[name](limit);
    total += dirs.length;
    console.log(`   ✅ ${dirs.length}건\n`);
  } catch (err) {
    console.log(`   ❌ ${name} 실패 — ${err.message}\n`);
  }
}

const all = existsSync(DRAFTS) ? await readdir(DRAFTS) : [];
console.log(`완료. 이번 실행 ${total}건 / .drafts 총 ${all.length}개 폴더`);
console.log(`\n전부 나만보기입니다. 공개된 글은 없습니다.`);
console.log(`검토: pnpm dev → http://localhost:3000/studio\n`);
