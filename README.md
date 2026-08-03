# 🌳 minjae.log

강민재의 정체성(About), 만든 결과(Portfolio), 공개 기록(Writing)을 하나의 사이트로 잇는 개인 사이트입니다.
Next.js 16 App Router와 Velite 기반의 타입 안전한 MDX 파이프라인 위에 올라가 있습니다.

![Next JS](https://img.shields.io/badge/Next-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🏃 Getting Started

패키지 매니저는 pnpm만 허용합니다(`preinstall`에서 강제).

```bash
pnpm install
pnpm dev          # → http://localhost:3000
```

`pnpm dev`는 `velite dev`(MDX 감시·컴파일)와 `next dev`(Turbopack)를 동시에 실행합니다.
`src/content` 아래 MDX를 저장하면 재컴파일 후 브라우저가 갱신됩니다.

### 환경 변수 (`.env.local`)

둘 다 선택입니다. 없어도 사이트는 정상 동작합니다. `.env*`는 커밋되지 않습니다.

```bash
# Giscus 댓글
NEXT_PUBLIC_GISCUS_REPO=your/repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# pnpm import-blogs 수집 대상. 공개 저장소라 소스에 박지 않습니다.
# 비어 있으면 그 출처를 건너뛰고 무엇을 채워야 하는지 알려 줍니다.
VELOG_USER=velog_username
TISTORY_HOST=example.tistory.com
NAVER_BLOG_ID=naver_blog_id
```

### 명령어

| 명령 | 하는 일 |
| --- | --- |
| `pnpm dev` | 개발 서버 (velite watch + next dev) |
| `pnpm build` | `velite build` → `next build` |
| `pnpm start` | 빌드 결과 로컬 서빙 |
| `pnpm lint` | ESLint |
| `pnpm new` | 글 스캐폴딩 (`pnpm new solve git-worktree`, `pnpm new private 회고`) |
| `pnpm import-blogs` | 외부 블로그를 `.drafts/`로 수집 (전부 나만보기) |
| `pnpm compress` | `src/content` 이미지 sharp 압축 (덮어쓰기) |

Node 버전은 `.nvmrc`를 따릅니다.

## 🗺️ 정보 구조

최상위는 셋입니다. Roots는 별도 영역이 아니라 Portfolio 항목으로 다룹니다([ADR-0001](docs/adr/0001-portfolio-absorbs-roots.md)).

```text
/about       About       자기소개, 지금 하는 일, 관점, 타임라인
/portfolio   Portfolio   Constellation — 문제, 판단, 결과, 관련 Writing의 연결
/writing     Writing     Understand / Solve / Reflect 세 렌즈로 묶인 글
```

### 라우트

| 경로 | 종류 | 내용 |
| --- | --- | --- |
| `/` | Static | About 요약 → Portfolio → Writing → 연락 |
| `/about` | Static | 자기소개 전문 |
| `/portfolio` | Static | Constellation 목록 |
| `/portfolio/[slug]` | SSG | 개별 프로젝트 |
| `/writing` | Static | 글 통합 인덱스 |
| `/insight/[slug]` | SSG | 개별 글 — permalink 고정 |
| `/memo/[slug]` | SSG | 개별 글 — permalink 고정 |
| `/log/[slug]` | SSG | 개별 글 — permalink 고정 |
| `/tags` | Static | 태그 클라우드 |
| `/insight`·`/memo`·`/log` | 308 | → `/writing` 영구 리다이렉트 |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | 자동 | |
| `/api/og` | Edge | 글별 OG 카드 동적 생성 |

**Writing Lens는 폴더가 결정합니다.** `insight/`→`understand`, `memo/`→`solve`, `log/`→`reflect`.
프론트매터에 적지 않습니다. 기존 글의 permalink는 그대로 두고 렌즈만 라벨로 덧입혔습니다.

### 등뼈 (Rail)

사이트 전체를 관통하는 고정 x좌표의 세로선입니다. 왼쪽 거터(`--rail-gutter: 8.5rem`)에는
섹션 라벨·연도·날짜 같은 **좌표만** 놓고 오른쪽에 본문을 둡니다. 라우트가 나뉘어도 좌표계가
바뀌지 않아 하나의 사이트로 읽힙니다. 좌표가 하나뿐인 글 상세 페이지에는 쓰지 않습니다.

## 🏗️ 데이터 흐름

```text
src/content/**/*.mdx          원본 — 여기만 편집한다
        │
        │  velite.config.ts — 스키마 검증 + MDX 컴파일
        ▼
     .velite/*.json           산출물 (git 무시, 자동 생성)
        │
        │  #site/content
        ▼
   src/lib/content.ts         유일한 진입점
        ├─ lib/posts.ts       글 정렬·렌즈별 조회
        ├─ lib/tags.ts        태그 집계
        └─ lib/projects.ts    프로젝트 ⇄ 글 양방향 링크 + 빌드타임 검증
        │
        ▼
   src/app/**/page.tsx        서버 컴포넌트에서만 읽는다
```

### 컬렉션 5개 (`velite.config.ts`)

| 키 | 패턴 | 비고 |
| --- | --- | --- |
| `about` | `about/index.mdx` | `single: true` |
| `projects` | `portfolio/**/*.mdx` | 공개 용어는 Portfolio, 컬렉션 키는 `projects` |
| `insights` | `insight/**/*.mdx` | `lens: understand` |
| `memos` | `memo/**/*.mdx` | `lens: solve` |
| `logs` | `log/**/*.mdx` | `lens: reflect` |

## 📁 Project Structure

```text
.
├── docs/
│   ├── adr/            결정 정본 (Architecture Decision Records)
│   ├── design/         설계 문서
│   └── agents/         에이전트 규약
├── scripts/            유지보수용 스크립트 (이미지 압축 등)
├── src/
│   ├── app/            App Router 라우트
│   ├── components/
│   │   ├── layout/     Rail, 헤더, 푸터, page-shell
│   │   ├── home/       홈 전용 섹션
│   │   ├── about/      타임라인
│   │   ├── portfolio/  프로젝트 목록, metric 목록
│   │   ├── writing/    통합 인덱스
│   │   ├── post/       글 상세, 관련 글, 역링크
│   │   ├── mdx/        MDX 컴포넌트 (Callout, Spacer, 코드 복사)
│   │   ├── features/   검색, 태그 클라우드, 댓글, 시계
│   │   ├── effects/    커서 (홈 한정)
│   │   └── ui/         테마 토글, 소셜 링크
│   ├── config/         navigation, lens, site-metadata
│   ├── content/        MDX 원본
│   └── lib/            content, posts, tags, projects, date, utils
├── CONTEXT.md          용어 정본 (Ubiquitous Language)
└── velite.config.ts    콘텐츠 스키마
```

## ✍️ 글 쓰기

`src/content/{insight|memo|log}/{slug}/index.mdx` 를 만듭니다. 이미지는 같은 폴더에 둡니다.

```yaml
---
title: "제목"
slug: 글-슬러그          # 폴더명과 같게
date: 2026-08-03
description: "한 줄 설명"  # 선택
tags: ["tag1", "tag2"]
---

본문…
```

사용 가능한 MDX 컴포넌트: `<Callout type="info|warning|danger" title="…">`, `<Spacer y={4} />`.
수식은 KaTeX(`$…$`), 코드 하이라이트는 Shiki가 처리합니다.

커밋 전 이미지 압축:

```bash
pnpm compress
```

### 나만보기 (`.drafts/`)

`src/content/.drafts/`는 `.gitignore`에 걸려 있고, `velite.config.ts`의 글롭 5개 중
어느 것도 이 경로를 매치하지 않습니다. 커밋도 빌드도 되지 않는다는 뜻입니다.

```bash
pnpm new private 2026-회고   # .drafts/ 아래에 생성
```

`.gitignore`의 해당 줄을 지우거나 `git add -f`를 쓰면 이 경계가 무너집니다.

### Studio (`/studio`)

개발 환경 전용 에디터입니다. 목록·편집·저장·렌즈 이동(=발행)·삭제와 실시간 미리보기를
제공하며, CodeMirror 6 위에 Vim 키바인딩이 올라가 있습니다.

**프로덕션에서는 404입니다.** 파일을 쓰는 API이므로 게이트가 라우트(`src/app/studio/page.tsx`)와
API(`src/app/api/studio/route.ts`) 양쪽에 있습니다. 한쪽만 지우면 다른 쪽이 살아남습니다.
`next dev`는 LAN에도 바인딩되므로 같은 네트워크에서 쓰기 API에 도달할 수 있습니다.

## 🌌 포트폴리오 항목 추가

`src/content/portfolio/{slug}/index.mdx`.

```yaml
---
title: "프로젝트 이름"
slug: 프로젝트-슬러그
date: 2026-01-01           # 시작일. 타임라인 정렬 축
endDate: 2026-06-30        # 없으면 "진행 중"
summary: "한 줄 결과 문장"
role: "역할"
visibility: private        # public | private
stack: ["…"]
tags: ["…"]
problem: |
  무엇이 문제였는지. 도구 자랑이 아니라 문제 서술로 시작한다.
judgment:
  - "왜 A 대신 B를 골랐는가. 버린 선택지를 반드시 쓴다."
metrics:
  - label: "빌드 시간"
    value: "420ms → 180ms"   # 문자열 고정. 가짜 정밀도를 만들지 않는다
    note: "조건과 분모"        # 이걸 못 적는 metric은 싣지 않는다
writings: ["글-슬러그"]        # bare slug. permalink 아님
links:
  - { label: "GitHub", href: "https://…" }
---
```

- `judgment`가 이 페이지의 심장입니다. **버린 선택지를 반드시 포함합니다.**
- `visibility: private`이면 링크 목록이 비어 있는 것이 정상이고, UI가 "비공개 시스템 · 소스 미공개"를 표시합니다.
- `writings`에 글 slug를 적으면 **글 쪽에 역링크가 자동 생성**됩니다. 글 파일은 손대지 않습니다.
- `writings`에 존재하지 않는 slug를 적으면 `pnpm build`가 위치를 찍고 실패합니다. 의도된 동작입니다.

## ⚠️ 주의

1. **`"use client"` 컴포넌트에서 `#site/content` / `@/lib/posts` / `@/lib/tags`를 직접 import 하지 않습니다.**
   함수가 필드를 걸러도 모듈 전체가 클라이언트 번들에 들어갑니다. 데이터는 서버에서 만들어 props로 내립니다.
2. **기존 글의 permalink를 바꾸지 않습니다.** RSS `guid`, sitemap, Giscus 스레드가 전부 거기 묶여 있습니다.
3. **결정 정본은 `docs/adr/`와 `CONTEXT.md`입니다.** `docs/design/`이나 핸드오프 노트의 서술을 확정 결정으로 인용하지 않습니다.
4. 공개 저장소입니다. 로컬 절대 경로, 사설 호스트명, 계정 정보를 커밋에 넣지 않습니다.

## 🛠️ 기술 스택

| 층 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| 콘텐츠 | Velite — MDX를 타입 안전한 JSON으로 |
| 스타일 | Tailwind CSS v4 (`@theme inline`) + CSS 변수 |
| 테마 | next-themes (라이트/다크) |
| 코드 | Shiki + rehype-pretty-code |
| 수식 | remark-math + rehype-katex |
| 댓글 | Giscus (GitHub Discussions) |
| OG 이미지 | @vercel/og (Edge) |
| 분석 | Vercel Analytics |
| 이미지 | sharp |
| 배포 | Vercel |

디자인 시스템은 `src/app/globals.css` 한 파일에 있습니다. 색을 쓰지 않고 회색 명도만으로
위계를 만들며, 다크 모드는 `.dark`에서 같은 토큰 이름을 반전시킵니다.

## 👏 Credits & Inspiration

이 블로그는 훌륭한 오픈소스 프로젝트와 블로그들로부터 많은 영감을 받아 제작되었습니다.
구조와 디자인에 대해 큰 영향을 준 원본 프로젝트들에 깊은 감사를 표합니다.

#### Design & Structure Inspiration: **bepyan.me**

블로그의 전반적인 디자인을 적극적으로 참고하여 재구성했습니다.

#### Template Reference: dalelarroder/dalelarroder

Next.js 블로그의 초기 세팅과 기술적 구현 방식에 대해 참고했습니다.

### 제작 시 도움된 사이트

- <https://tailwindcss.com/>
- <https://velite.js.org/>
- <https://react-icons.github.io/react-icons/>

## 📝 License

This project is licensed under the MIT License.
