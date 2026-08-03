# Agent Handoff

이전 핸드오프(2026-08-03 오전, 브랜치 커밋 8개 시점)는 `05b99d3` 커밋에 남아 있다.
이 노트는 그 이후의 작업을 다룬다. 세션 끝에 8개 커밋으로 정리해 푸시했다(브랜치 총 16개).

## Context

- Date: 2026-08-03
- Repository: `miniminjae92/miniminjae.me` (**public**)
- Branch: `feat/living-personal-site` (main 기준 커밋 16개, **푸시됨. 머지는 안 함**)
- User goal (원문, 세션 순서대로):
  1. "간단한 가이드가 필요해, 어떻게 개발 실행해서 볼지, 그리고 최종 진행 사항"
  2. "README도 현재 구조에 맞게 갱신해줘" + "글 작성을 mdview 내 프로그램에 만들어서… 아니면 따로 블로그에만 글쓰기 붙일수도있나?"
  3. "나만 보이는 폴더? 분류도 하나 있으면 좋겠어"
  4. "understand, solve, reflect, 그리고 나만보기 가능한 한가지 분류 추가해서 위의 모든 글들 지금 프로젝트에 일원화해줘"
  5. "발행글이 아예 없어도 좋아 모두 나만보기로 가도 좋아 우선은"
  6. "글자 색? 채도?를 가식성 기준으로 조금 추천안을… 밝기모드에 따라서 두가지 모두 선택"
  7. "세로 선이 너무 길게 헤더 밑에 바로 있는 느낌" → 디자인 전문가 검토 요청
  8. "자기소개서의 본질이 무엇이고 그러면 꼭 필요한 구성들이 무엇들이고… 안에 내용은 내가 바꾸면 되니깐"
  9. "쓴것, writing 같이 한글 영어 두개 사용하는것보다 영어로만 통일해서 해"

## Current State

What is already done (전부 워킹 트리, 커밋 안 됨):

- **나만보기 경계** — `src/content/.drafts/`. `.gitignore:58`에 이미 있던 항목을 정본으로 채택.
  velite 글롭 5개 중 어느 것도 `.drafts/`를 매치할 수 없어 **구조적으로** 공개 빌드 유출 불가.
- **외부 블로그 79편 수집** — Velog 22 · Tistory 38 · Naver 19. 전부 `lens: private`.
  GitHub `miniminjae92.github.io/docs/_posts`는 **실제 글 0편**(70개 전부 Minimal Mistakes 테마 데모)이라 제외.
- **79편 교정 완료** — 손 교정 7편(코드 펜스·이스케이프·들여쓰기), 파일럿 5편, 스크립트 67편.
  데이터 손상 2건 복원: `karabiner`의 `com.apple.keylayout.ABC`(티스토리 자동 링크가 쪼갬),
  `프리코스 2주차 회고`의 `List<String>`(티스토리가 `<String>`을 태그로 보고 삭제, Velog판에서 추론 복원 — 편집자 주에 명시).
- **스크립트 3종** — `scripts/new-post.mjs`(`pnpm new`), `scripts/import-blogs.mjs`, `scripts/annotate-drafts.mjs`.
- **Studio** — `/studio` dev 전용 에디터. CodeMirror 6 + `@replit/codemirror-vim`. 목록·편집·저장·렌즈 이동(=발행)·삭제·실시간 미리보기.
- **본문 색 재조정** — 라이트 `--text-disabled` 2.14:1(WCAG AA 미달) → 4.56:1. 다크 본문 11.94:1 → 10.29:1(헤일레이션 완화).
- **워드마크** `minjae.log` → `minjae.space`. 하드코딩 4곳을 `SITE_NAME` 참조로 통일.
- **레일** 안 A만 적용 — 세로 여백을 패딩에서 마진으로. 헤더↔선 간격 0px → 64px.
- **거터 라벨 영어 단독** — 15곳. `RailSection`의 `sublabel` 프로퍼티 제거.
- **`/about` 재구성** — `Selected` 신설(증거 입구), `How I work`를 3번째→5번째로 이동, `Stack` 그룹형(`primary`/`familiar`), `Timeline`에 `kind` 추가(자격증 자리).
- **의존성 추가** — `turndown`, `turndown-plugin-gfm`, `@types/turndown`(dev) / `codemirror`, `@codemirror/*`, `@replit/codemirror-vim`, `unified`, `remark-parse`, `remark-rehype`, `rehype-stringify`.

What is intentionally not changed:

- **기존 글 18개 permalink** — RSS `guid`, sitemap, Giscus 스레드가 묶여 있다.
- **`SITE_URL`** — `minjae-log.vercel.app` 유지. `minjae.space` 도메인 미확보. 먼저 바꾸면 canonical·OG 절대경로·RSS guid가 없는 주소를 가리킨다.
- **`How I work`의 `text-second` → `text-body`** — 사용자가 보류. 위치만 옮겼다.
- **레일 안 B/C/D** — 사용자가 "현재 유지" 선택.
- **포트폴리오 구조** — 시각화 추가 안 함. 사용자 질문에 "필요 없다"로 답했고 구조 변경 없음.
- **포트폴리오 slug `minjae-log`** — 제목만 `minjae.space`로 바꾸고 slug은 유지.
- **과거 글 `ww-open-mission`의 `[minjae.log](...)` 링크** — 2025년에 쓸 때는 실제 그 이름이었다.
- **린트 12건** — 전부 이번 세션이 건드리지 않은 기존 파일. 신규 파일은 0건.

Important assumptions:

- 사용자는 **경력 전환자**로 보인다(2022 네이버 일기 "31세 직장인", 2023 C언어 입문, 2024~2026 우테코). `/about` IA를 이 전제로 설계했다. **확인 필요.**
- 정보처리기사는 티스토리 글 "정보처리기사 실기공부중"(2025-04-17)만 근거다. **취득 여부 모름.** 타임라인에 TODO로 자리만 잡아 뒀다.
- `selected` 기본값 3건(`agent-os`, `preview-docker-k8s-kernel`, `ww-8th-final-test`)은 내가 고른 것이다. 사용자 선택 아님.

## Decisions (cite, do not restate)

- 확정: `docs/adr/0001-portfolio-absorbs-roots.md` — Portfolio가 Roots를 흡수한다.
- 확정(용어 정본): `CONTEXT.md` — `Rail`, `Visibility`, `Writing Lens`.
- 미결: **나만보기 경계를 `src/content/.drafts/` + gitignore로 둔다** — 구현돼 있으나 ADR 번호 없음. 공개 저장소라는 제약과 직결되므로 승격 1순위.
- 미결: **워드마크 `minjae.space`** — 사용자가 선택지에서 고름. 도메인 미확보 상태라 워드마크와 `SITE_URL`이 분리돼 있다.
- 미결: **본문 색 스킴 B** — 시맨틱 토큰 5개를 회색 스케일 참조에서 직접 hex로 바꿨다. 스케일 indirection을 여기서만 깬 것이 판단.
- 미결: **거터 라벨 영어 단독**.
- 미결: **`/about` IA** — `주장 → Now → Selected → Timeline → How I work → Stack → Contact`. 근거는 "증거가 철학보다 먼저 온다".
- 미결: **자격증은 Stack이 아니라 Timeline `kind`** 로 다룬다.
- 미결: **레일은 안 A만** — 헤더 간격 결함만 고치고 B(눈금)·C(좌표 회수)·D(밴드)는 미적용. 디자인 에이전트 추천은 C였다.
- 미결: **포트폴리오에 시각화를 넣지 않는다** — `docs/design/living-personal-site.md`의 "시각화에 대한 판정"에 서술돼 있으나 ADR 번호 없음.

> 위 `미결`은 이 노트의 서술일 뿐 확정 결정이 아니다 (D-015). 다음 세션은 인용하지 말고 그 자리에서 판단하거나, 승격할 값이 있으면 `docs/adr/`에 번호를 신설할 것.

## Files To Read First

- `docs/adr/0001-portfolio-absorbs-roots.md`: 유일한 확정 결정
- `CONTEXT.md`: 용어 정본
- `docs/design/living-personal-site.md`: 시각화 판정, 거절된 프로토타입 6종과 사유
- `src/lib/studio.ts`: Studio의 경계 강제(`assertDev`, `resolveDocPath`). 파일 쓰기 API의 안전 장치 전부
- `src/lib/about.ts`: `selected` ref 해석 + **모듈 초기화 시 throw**
- `src/lib/projects.ts`: 같은 패턴의 선행 사례(`writings` 검증)
- `src/app/globals.css`: 색 토큰 5개(라이트/다크) + `.rail` + `.studio-preview`
- `velite.config.ts`: `about` 스키마에 `selected`·`stack.primary/familiar`·`timeline.kind` 추가됨
- `scripts/import-blogs.mjs`: 재수집이 필요할 때. 출처별 추출 경로가 주석에 있다

## Work In Progress

- 위 워킹 트리(21 modified + 9 untracked)는 **8개 커밋으로 나뉘어 커밋·푸시됐다.**
  스크립트 / Studio / 색 대비 / 레일 / `/about` / 워드마크 / 커서 / 문서 순.
  `src/app/globals.css`는 세 갈래(색 토큰·`.studio-preview`·`.rail`)라 hunk 단위로 쪼개 세 커밋에 나눠 넣었다.
- 커밋 과정에서 바꾼 것 하나: `scripts/import-blogs.mjs`의 블로그 계정 식별자 3개를
  `process.env`(`VELOG_USER`/`TISTORY_HOST`/`NAVER_BLOG_ID`)로 뺐다. 공개 저장소라 히스토리에
  영구히 남기 때문이다. 값은 `.env.local`에 있고 `pnpm import-blogs`가
  `--env-file-if-exists`로 읽는다. 값이 비면 그 출처를 건너뛰고 무엇을 채울지 안내한다.
- Known dirty state that should not be reverted:
  - **`src/content/.drafts/` 79편은 gitignore 되어 `git status`에 안 보인다.** 존재하지만 추적되지 않는다.
    원본은 아직 온라인에 있지만 **교정 내용은 디스크에만 있다. 백업 없음.**
  - `.env.local`도 커밋되지 않는다. 다른 기기에서 `pnpm import-blogs`를 돌리려면 다시 채워야 한다.

## Verification

- Command: `pnpm build`
  Result: 통과. 정적 35개(이전 32 + `/studio`, `/api/studio`, `/api/studio/preview`).

- Command: `pnpm exec eslint`
  Result: 12 problems (10 errors, 2 warnings). **세션 시작 시점과 동일.** 신규 파일 5개는 0건.

- Command: 프로덕션 게이트 검증 (`pnpm start` 후 curl)
  Result: `/studio` 404 · `GET /api/studio` 404 · **쓰기 페이로드를 실은 `PUT /api/studio` 404이고 대상 파일 미변경.**

- Command: `git check-ignore -v src/content/.drafts/`
  Result: `.gitignore:58` 매치. `git status`에 초안 0건.

- Command: `node scripts/import-blogs.mjs`
  Result: 79/79 수집, 실패 0.

- Command: `node scripts/annotate-drafts.mjs --dry-run` → 실제 실행
  Result: 적용 67 · 이미 있음 12 · 손으로 봐야 0. 최종 79/79에 편집자 주.

- Command: `about/index.mdx`의 `selected` ref에 오타(`agent-osXX`) 주입 후 `pnpm build`
  Result: **의도대로 빌드 실패.** 메시지가 slug을 짚음. 원복 완료.

- Command: 라우트 HTTP 체크 (dev)
  Result: `/`, `/about`, `/portfolio`, `/writing`, `/tags`, `/studio` 전부 200. 인덱스 3개 308.

- 테스트: **자동화 테스트 없음.** 이 repo에 테스트 러너가 설정돼 있지 않아 실행하지 않았다.
  검증은 빌드·린트·HTTP 체크·컴파일된 CSS 확인·육안으로 대체.

- 육안 확인(데스크톱, 라이트·다크): 홈, `/studio`, 색 재조정 전후. **`/about` 재구성 결과와 레일 안 A 적용 결과는 눈으로 못 봤다** — 브라우저 스크린샷 도구가 6회 연속 타임아웃. 대신 렌더된 HTML의 섹션 순서·Stack 그룹·Timeline `kind` 마커를 curl로 확인했다.
- 육안 확인(모바일): **하지 못함.**

## Next Steps

1. **사용자 작업** — `src/content/about/index.mdx`의 TODO 14곳:
   `selected[].why` ×3, `stack.primary`/`familiar`, `now` ×2, `timeline` 첫 항목,
   **정보처리기사 취득 여부**(아니면 그 항목 삭제), `How I work` 본문 3개.
2. **사용자 작업** — `src/content/portfolio/{agent-os,dref,minjae-log}/index.mdx` TODO 17곳.
3. `.drafts/` 79편 검토 → 공개할 것 선별. Studio의 렌즈 버튼으로 옮기면 발행이다.
   **중복 8편 처리 판단 필요**(Velog 7 + Tistory 1이 이미 공개된 글과 동일. 우테코 회고 5편 포함).
4. Naver 19편은 일기·서평(부동산·니체·밀리의서재)이다. 나만보기가 맞는 자리인지 확인.
5. 레일 안 B/C 적용 여부 판단. 디자인 에이전트 진단: `/writing` 거터 136px에 라벨 1개인데 본문 열에 좌표 21개.
6. `How I work` 색·간격(보류 항목) 재개.
7. `minjae.space` 도메인 확보 → `SITE_URL` 갱신 → Vercel 커스텀 도메인.
8. 모바일 육안 확인 (≤768px). 특히 거터 0 분기와 Studio.
9. Vercel 배포 후 **OG 카드 한글 렌더 확인**.
10. `미결` 중 승격할 것 선별해 `docs/adr/`에 번호 신설. 1순위는 나만보기 경계.
11. **main 머지 판단.** 푸시는 끝났고 PR·머지는 아직이다.

## Watch Outs

- **공개 저장소다.** `src/content/.drafts/` 79편에는 개인 일기(2022~2023 네이버)가 들어 있다.
  gitignore가 유일한 방어선이다. `git add -f`, `.gitignore` 수정, `git clean -x` 전부 위험하다.
- **`.drafts/`는 백업이 없다.** 교정한 79편은 디스크에만 있다. 원본은 온라인에 남아 있지만 교정 결과는 아니다.
- **`"use client"` 컴포넌트에서 `#site/content` / `@/lib/posts` / `@/lib/tags`를 직접 import 하지 말 것.** 544KB 청크의 원인이었다.
- **글 18개 permalink를 건드리지 말 것.**
- **Studio는 파일을 쓴다.** 게이트가 라우트(`src/app/studio/page.tsx`)와 API(`src/app/api/studio/route.ts`) 양쪽에 있다. 한쪽만 지우면 다른 쪽이 살아남는다.
  `next dev`는 LAN에도 바인딩된다(`Network: http://…:3000`). 같은 네트워크에서 쓰기 API에 도달 가능하다.
- **`pnpm build`와 `pnpm dev`를 동시에 돌리지 말 것.** 이번 세션에서 dev가 3001로 밀리고 3000에 프로덕션이 떠 있어, `/studio` 404를 결함으로 오진할 뻔했다.
- **pnpm 스토어 경로가 어긋나 있다.** 설치 시 `--store-dir /Users/miniminjae/projects/.pnpm-store` 필요.
  `pnpm config set store-dir` 로 고정하면 해소된다.
- **Node 버전 불일치** — `.nvmrc` v24.11.1 vs 설치된 v26.0.0.
- 거절된 프로토타입 방향(손으로 그린 세계수 SVG, 장식 키프레임, 자체 팔레트)을 되살리지 말 것.
- **편집자 주는 사실이어야 한다.** 교정 중 "코드를 한 글자도 안 바꿨다"고 썼다가 실제로는 들여쓰기를 복원한 것이어서 문구를 고쳤다. `annotate-drafts.mjs`가 펜스 밖 코드를 스스로 검사해 건너뛰는 것도 같은 이유다.
- `docs/adr/`가 결정 정본이다. 이 노트나 `docs/design/`의 서술을 확정 결정으로 인용하지 말 것 (D-015).
- 이 환경에서 브라우저 스크린샷 도구가 세션 후반 내내 실패했다. 반응형·시각 확인은 다른 수단이 필요하다.
