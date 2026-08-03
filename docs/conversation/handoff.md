# Agent Handoff

이전 핸드오프(2026-07-25, 프로토타입 6종 거절 기록)는 `ebe6c33` 커밋에 남아 있다. 그 내용의 실질은 `docs/design/living-personal-site.md`와 `docs/adr/0001`로 승격됐다.

## Context

- Date: 2026-08-03
- Repository: `miniminjae92/miniminjae.me`
- Branch: `feat/living-personal-site` (main 기준 커밋 7개, **푸시 안 함**)
- User goal (원문): "자기소개서, 블로깅, 포트폴리오 시각화 이렇게 세가지를 다 나타낼 수 있는 공간들을 만들려는데 하나의 페이지에 넣지마? 하나의 웹 사이트에서 모두 표현 가능한게 좋지 않아?"
- 사용자가 세션 중 답한 것:
  - 자기소개서 1차 독자 — 둘 다. **지원용이 더 급함.** 기존 홈 카피 톤은 계승
  - 포트폴리오 실체 — **Agent OS, dref, 이 블로그.** 우테코 미션 회고는 아님
  - 구조 — About·Portfolio **전부 분리**(새 라우트 + 헤더 nav 신설)

## Current State

What is already done:

- `/about`, `/portfolio`, `/portfolio/[slug]`, `/writing` 신설. 헤더·푸터 내비게이션 신설
- 등뼈(Rail) 레이아웃 토큰과 컴포넌트. `/`, `/about`, `/portfolio/*`, `/writing`, `/tags`에 적용
- velite 컬렉션 2개 추가(`about` single, `projects`), 기존 3개 컬렉션에 `lens` 필드 추가
- 양방향 링크(프로젝트 ⇄ 글). 정방향은 frontmatter `writings`, 역방향은 빌드 타임 역인덱스
- 거절된 `src/app/prototype/**` 삭제(사용자 승인). `ArchiveNav`, `ContentIndexPage`, `PostArchiveList`, `category-links` 삭제
- 기존 결함 수정: 클라이언트 번들 544KB(글 본문 전량), `page-shell` 이중 적용, 글 제목 미렌더, `ArchiveNav` 이중 렌더, `prefers-reduced-motion`·`:focus-visible`·skip link 부재, 한글 어절 중간 줄바꿈, OG 한글 폰트 미임베드

What is intentionally not changed:

- **기존 글 18개 permalink** (`/insight/:slug`, `/memo/:slug`, `/log/:slug`). RSS `guid`, sitemap, Giscus 스레드가 전부 여기 묶여 있다. 인덱스 3개만 308
- `SITE_URL`은 `minjae-log.vercel.app` 유지 (커스텀 도메인 미결)
- 린트 문제 12건. 전부 이번 세션이 건드리지 않은 기존 파일(`theme-toggle`, `real-time-clock`, `mdx-content`, `splash-cursor-core`, `scripts/optimize-images.js`)
- `src/content/memo/markdown-style-test/` — 테스트 픽스처가 RSS·sitemap에 공개된 상태 그대로

Important assumptions:

- 사용자가 우테코 8기 1차 심사에 합격한 사실은 글 본문에 있으나, 이후 결과나 현재 소속은 **모름**. `about/index.mdx`의 `now`와 `timeline` 첫 항목은 TODO로 비워 뒀다
- Agent OS·dref의 구체 내용은 사용자 소유 정보라 초안에 채우지 않았다. 구조와 프롬프트만 넣었다

## Decisions (cite, do not restate)

- 확정: `docs/adr/0001-portfolio-absorbs-roots.md` — Portfolio가 Roots를 흡수한다. 최상위는 About/Portfolio/Writing 셋.
- 확정(용어 정본): `CONTEXT.md` — `Rail`, `Visibility` 항목 신설, `Roots`·`Living Tree` 갱신.
- 미결: **라우트 분리 구조 자체** — 구현돼 있고 `docs/design/living-personal-site.md`에 서술돼 있으나 ADR 번호 없음. 설계 문서는 이 repo의 결정 정본이 아니다(`AGENTS.md`: 정본은 `CONTEXT.md` + `docs/adr/`).
- 미결: **글 URL 마이그레이션 연기** (`/insight/:slug` → `/writing/:slug`). Lens를 라벨로만 덧입힌 상태. 나중에 옮기려면 velite `permalink` 한 줄 + `next.config.ts` 와일드카드 3줄.
- 미결: **시각화 판정** — 관계 그래프·월별 활동 밀도·스킬 게이지를 만들지 않고 시간축만 채택. 근거는 실데이터(태그 8개 중 `프리코스` 하나가 8편, 18개월 중 8개월 공백).
- 미결: **홈 섹션 순서** `About → Portfolio → Writing`. 설계 문서 원안(`About → Writing → Portfolio`)과 다르다.
- 미결: **글 상세 페이지에 레일을 쓰지 않는다.** 실제 적용 후 거터가 빈 여백으로 읽혀 원복했다.

> 위 `미결` 항목은 이 노트의 서술일 뿐 확정 결정이 아니다. 다음 세션은 인용하지 말고 그 자리에서 판단하거나, 승격할 값이 있으면 `docs/adr/`에 번호를 신설할 것.

## Files To Read First

- `docs/adr/0001-portfolio-absorbs-roots.md`: 유일한 확정 결정. Portfolio/Roots 경계
- `CONTEXT.md`: 용어 정본. `Rail`, `Visibility`, `Writing Lens`
- `docs/design/living-personal-site.md`: IA, 채택한 시각 방향(등뼈), 시각화 판정 근거
- `src/app/globals.css`: 디자인 시스템 전부. `--rail-gutter` 유도 근거가 주석에 있음
- `velite.config.ts`: 컬렉션 5개. 스키마를 콘텐츠보다 먼저 만들지 않았다는 점이 주석에 있음
- `src/lib/projects.ts`: 역인덱스 + **미해결 slug면 모듈 초기화 시 throw**
- `src/content/about/index.mdx`, `src/content/portfolio/*/index.mdx`: TODO가 남은 초안

## Work In Progress

- Changed files: 없음. 작업 트리 깨끗, 커밋 7개 전부 브랜치에 있음
- Untracked files: 없음
- Known dirty state that should not be reverted:
  - main의 `c447d0b`, `ebe6c33` 두 커밋은 이전 세션 작업을 정리한 것. 되돌리지 말 것
  - 브랜치는 **푸시되지 않았다.** 푸시·머지는 사용자 승인 필요

## Verification

- Command: `pnpm build`
  Result: 통과. 32개 정적 페이지 생성. `/portfolio/{agent-os,dref,minjae-log}` SSG 확인

- Command: 라우트 33개 HTTP 체크 (`pnpm start` 후 curl)
  Result: 통과 33 / 실패 0. 글 18개 전부 200, 인덱스 3개 308, 신규 라우트 전부 200

- Command: RSS·sitemap 항목 수
  Result: RSS 18개(변화 없음), sitemap 26개(정적 5 + 글 18 + 프로젝트 3)

- Command: `writings`에 오타 slug 주입 후 `pnpm build`
  Result: **의도대로 빌드 실패.** 메시지가 `minjae-log → "mdx-special-charactersXX"`로 위치를 짚음. 원복 완료

- Command: 양방향 링크 렌더 여부 확인
  Result: `writings`에 등록된 2편만 "이 글은 〈minjae.log〉…" 표시, 나머지 16편은 미표시

- Command: `grep -rl "<글 본문 문자열>" .next/static/chunks/`
  Result: 수정 전 544KB 청크에서 검출 → 수정 후 미검출. 최대 청크 544K → 212K

- Command: `pnpm exec eslint`
  Result: 12 problems (10 errors, 2 warnings). **전부 이번 세션이 건드리지 않은 기존 파일.** 세션 중 새로 만든 1건은 `useSyncExternalStore`로 해소

- 테스트: **자동화 테스트 없음.** 이 repo에 테스트 러너가 설정돼 있지 않다. 검증은 빌드·린트·HTTP 체크·육안 확인으로 대체

- 육안 확인(데스크톱): `/`, `/about`, `/portfolio/minjae-log`, `/log/ww-8th-final-test`, OG 카드. 라이트·다크 모두
- 육안 확인(모바일): **하지 못함.** 브라우저 창 리사이즈가 두 번 다 스크린샷에 반영되지 않았다. 미디어쿼리와 `sm:hidden` 분기는 코드로만 확인

## Next Steps

1. **사용자 작업** — `src/content/about/index.mdx`와 `src/content/portfolio/{agent-os,dref,minjae-log}/index.mdx`의 TODO 채우기. 구조·실데이터·근거 링크는 이미 있음
2. 모바일 육안 확인 (≤768px). 헤더 2줄 접힘, 레일 거터 라벨의 인라인 이동
3. Vercel 배포 후 **OG 카드 한글 렌더 확인**. 로컬 성공이 Edge 성공을 보장하지 않음
4. 커스텀 도메인 연결 여부 판단. 지원서 링크로 쓸 거면 `SITE_URL` 갱신 필요
5. `src/content/memo/markdown-style-test/` 처리 판단 (`.drafts/` 이동 또는 유지)
6. `미결` 항목 중 승격할 것 선별해 `docs/adr/`에 번호 신설
7. 브랜치 머지·푸시 판단

## Watch Outs

- **`"use client"` 컴포넌트에서 `#site/content`(또는 `@/lib/posts`, `@/lib/tags`)를 직접 import 하지 말 것.** 함수가 필드를 걸러도 모듈 자체가 번들에 들어간다. 544KB 청크의 원인이었다. 데이터는 서버에서 만들어 `PostSummary` props로 내려보낼 것
- **글 18개 permalink를 건드리지 말 것.** RSS `guid isPermaLink="true"`, sitemap, Giscus 스레드가 묶여 있다
- 포트폴리오 `writings`는 **bare slug**다. permalink를 넣으면 URL 마이그레이션 때 죽는다
- `metrics`는 조건/분모(`note`)를 못 적으면 싣지 않는다. 근거 없는 정밀함이 자기소개서에서 신뢰를 가장 빨리 깎는다
- 거절된 프로토타입 방향(손으로 그린 세계수 SVG, 장식 키프레임, 자체 팔레트)을 되살리지 말 것. 거절의 진짜 원인은 시각 방향이 아니라 **구조를 콘텐츠보다 먼저 만든 순서**였다
- `docs/adr/`가 결정 정본이다. 이 노트나 `docs/design/`의 서술을 확정 결정으로 인용하지 말 것 (D-015)
- 공개 저장소다. 로컬 절대 경로, `.ts.net` 호스트명, 세션 제목, 비용·사용량, 계정 정보를 커밋에 넣지 말 것
- 이 환경에서 브라우저 창 리사이즈가 동작하지 않는다. 반응형 육안 확인은 다른 수단이 필요하다
