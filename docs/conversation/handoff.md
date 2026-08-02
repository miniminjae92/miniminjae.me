# Agent Handoff

## Context

- Date: 2026-07-25
- Repository: `miniminjae92/miniminjae.me`
- Branch: `main`
- User goal: 기존 Next.js 블로그를 `자기소개 + Writing + Portfolio`가 연결된 개인 사이트로 확장한다. 세계수·마법의 도서관·우주 같은 세계관을 원하지만 첫 화면은 자기소개가 주인공이어야 한다.
- Latest user judgment: 이번 세션에서 만든 프로토타입은 **전부 마음에 들지 않음**. 다음 세션에서는 기존 안을 다듬지 말고 시각 방향부터 새로 시작한다.

## Current State

- What is already done:
  - OG URL과 사이트 URL 정본 문제를 수정했다.
  - 사이트 세계관과 공개/비공개 경계를 `CONTEXT.md`와 설계 문서에 기록했다.
  - 기존 `/prototype/world-tree` A/B/C와 새 `/prototype/living-system` A/B/C가 존재한다.
  - 두 프로토타입 묶음은 모두 사용자에게 선택받지 못했다. 프로덕션 후보로 간주하지 않는다.
- What is intentionally not changed:
  - 실제 홈페이지 `/`와 기존 콘텐츠 구조는 변경하지 않았다.
  - 실제 Agent OS Monitor, dref, Tailscale 주소나 데이터는 연결하지 않았다.
  - 커밋과 push는 하지 않았다.
  - 거절된 프로토타입 파일은 삭제 권한을 받지 않았으므로 그대로 보존했다.
- Important assumptions:
  - 다음에도 유지할 개념은 `첫 화면 자기소개 중심`, `Writing=나무`, `Portfolio=별자리`, `Roots=비공개 기반 시스템`이다.
  - 이번 프로토타입의 색감, 레이아웃, 세계수 표현 방식은 폐기 대상으로 본다.

## Key Decisions

- Decision: 첫 화면의 주인공은 세계수가 아니라 강민재의 자기소개다.
  Reason: 방문자는 세계관보다 먼저 “이 사람이 누구이며 무엇을 하는가”를 이해해야 한다.
- Decision: Writing의 관점은 `Understand / Solve / Reflect`다.
  Reason: 글의 형식보다 독자에게 제공하는 가치로 분류한다.
- Decision: Portfolio 항목은 고립된 카드보다 문제, 판단, 결과, 관련 Writing이 연결된 `Constellation`으로 본다.
  Reason: 작업의 완성품뿐 아니라 과정과 연결 관계를 보여주기 위해서다.
- Decision: `Roots`는 Agent OS 한 개가 아니라 dref 등을 포함하는 private-first 기반 시스템 전체다.
  Reason: 공개 활동을 지속시키는 개인 시스템이라는 공통 역할을 갖는다.
- Decision: Roots의 실제 인터페이스는 추후 Tailscale Serve를 고려하되 공개 사이트와 분리한다.
  Reason: 공개 사이트에는 실제 데이터, 상태, 내부 주소, 인증 정보를 포함하지 않는다. Funnel은 사용하지 않는다.
- Decision: 새 시각 작업은 기존 A/B/C 개선이 아니라 아트디렉션 탐색부터 다시 시작한다.
  Reason: 사용자가 이번 프로토타입 전체를 명확히 거절했다.

## Files To Read First

- `CONTEXT.md`: About, Writing Lens, Constellation, Roots, Root System, Private Interface 정본 용어.
- `docs/design/living-personal-site.md`: 현재 정보 구조와 보안 경계. `이번 프로토타입` 절의 A/B/C는 거절된 안이므로 다음 세션에서 갱신 필요.
- `src/app/prototype/living-system/`: 최신이지만 거절된 자기소개 중심 프로토타입 3종.
- `src/app/prototype/world-tree/`: 이전에 만든 세계수·도서관·룬 프로토타입 3종. 이것도 선택받지 못함.
- `docs/conversation/handoff.md`: 이 문서.

## Work In Progress

- Modified, uncommitted OG/metadata files:
  - `src/config/site-metadata.ts`
  - `src/app/api/og/route.tsx`
  - `src/app/insight/[slug]/page.tsx`
  - `src/app/log/[slug]/page.tsx`
  - `src/app/memo/[slug]/page.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/app/rss.xml/route.ts`
- New/untracked project files:
  - `AGENTS.md`
  - `CONTEXT.md`
  - `docs/`
  - `src/app/prototype/`
- Known dirty state that should not be reverted:
  - OG/metadata 변경은 앞선 사용자 요청으로 구현하고 검증한 작업이다.
  - `AGENTS.md`와 기존 `docs/`는 사용자 소유 파일이 포함되어 있다.
  - 프로토타입은 거절됐지만 삭제 요청은 없었다. 삭제 전 반드시 사용자에게 확인한다.
- External records (mimir 볼트 기준 상대 경로):
  - `40 Reviews/Runs/2026-07-25-blog-og-metadata-fix.md`
  - `40 Reviews/Runs/2026-07-25-living-personal-site-prototype.md`
  - `40 Reviews/Periodic/2026-07-25-browser-visual-qa-friction-review.md`

## Verification

- Command: `pnpm exec eslint src/app/prototype/living-system/page.tsx src/app/prototype/living-system/living-system-prototype.tsx`
  Result: 통과.
- Command: `pnpm build`
  Result: 통과. `/prototype/living-system`과 `/prototype/world-tree` 정적 경로 생성 확인.
- Command: A/B/C 각각 `curl http://127.0.0.1:3000/prototype/living-system?variant=<A|B|C>`
  Result: 모두 HTTP 200.
- Command: `git diff --check`
  Result: 통과.
- Visual verification:
  Result: 수행하지 못함. 인앱 브라우저 초기화가 `Cannot redefine property: process`로 실패했다. 빌드와 HTTP 검증은 시각 QA를 대체하지 않는다.
- Earlier OG verification:
  Result: 대상 lint와 `pnpm build` 통과, `/api/og`, sitemap, metadata 런타임 확인 완료.
- Whole-repo lint:
  Result: 이번 작업에서는 재실행하지 않음. 앞선 실행에서 `scripts/optimize-images.js`, splash cursor, clock, MDX, theme toggle의 기존 오류가 남아 있었다.

## Next Steps

1. 기존 프로토타입을 열거나 개선하지 말고, 먼저 사용자가 싫었던 지점과 원하는 감각을 시각 언어로 좁힌다.
2. 저장된 승인 레퍼런스는 dref의 `토스 홈` 하나이며 취향 주석은 “한국어 카피와 모션의 밀도”다. rejected 레퍼런스는 긍정 근거로 사용하지 않는다.
3. 아트디렉션 2~3개를 작은 한 장면으로 비교한 뒤 하나를 고른다. 전체 장문 페이지 3종을 먼저 만들지 않는다.
4. 방향이 선택된 뒤에만 새 프로토타입을 만들고, 거절된 프로토타입 처리 여부를 사용자에게 확인한다.
5. 실제 구현 단계에서는 기존 MDX 콘텐츠를 보존하고 About, Writing, Portfolio를 점진적으로 연결한다.
6. Roots의 Private Interface는 사이트 디자인 확정 이후 별도 작업으로 다룬다.

## Watch Outs

- 이번 A/B/C를 “초안이니 조금 고치면 된다”고 전제하지 않는다. 사용자의 판정은 전체 거절이다.
- 세계관을 첫 화면에서 자기소개보다 크게 만들지 않는다.
- `Learn / Build / ?`의 과거 세 번째 단어는 기록에서 복구되지 않았다. `Learn / Build / Share`는 라이프사이클 후보일 뿐 Writing Lens 정본이 아니다.
- 실제 `.ts.net` 호스트명, 세션 제목, 로컬 경로, 비용, 사용량, 계정 정보는 공개 코드나 문서에 넣지 않는다.
- 숨겨진 링크나 난해한 URL은 인증 수단이 아니다.
- GitHub Pages 이전은 권고하지 않는다. 현재 Vercel 배포를 유지하며 커스텀 도메인은 추후 결정한다.
- 사용자 승인 없이 commit, push, 파일 삭제를 하지 않는다.
