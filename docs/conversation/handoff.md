# Agent Handoff

이전 핸드오프(2026-08-03, 79편 수집·교정 세션)는 `7da0e0b` 커밋에 남아 있다.
이 노트는 2026-08-04 /about 이력서형 개편 세션을 다룬다.

## Context

- Date: 2026-08-04
- Repository: `miniminjae92/miniminjae.me` (**public**)
- Branch: `feat/living-personal-site` (이번 세션 커밋 4개: `17ddccf`..`7857b80`, **푸시 안 함**)
- User goal: /about 을 이력서형으로 개편. dref annotate(핀 첨삭) ↔ 구현 루프를 5라운드 돌려 수렴.
  **다음 세션 목표(사용자 원문)**: "다른 부분들과 위화감이 심해서 우선은 자유롭게 만져볼래?
  수석 디자이너의 감으로" — /about 은 이 정도로 마무리, 나머지 페이지들을 /about 과 결이 맞게
  자유 재량으로 다듬는 것. 사용자가 "이어서"라고 하면 시작.

## Current State

What is already done (전부 커밋됨, 워킹 트리 깨끗):

- **/about 전면 개편** (`src/app/about/page.tsx`) — 최종 구조:
  1. 헤더 밴드: 사진 플레이스홀더(w-48, 3:4) | 강민재(text-4xl) + MINJAE KANG(스몰캡스
     tracking 0.18em) + 직함 | 우측 About me(헤드라인 + philosophy 3줄 + Now, `grow basis-0
     max-w-[38ch]`로 우측 끝 정렬). 밴드 하단 선은 border-border 헤어라인.
  2. 단일 4:3 그리드 6섹션: 좌 Timeline·Writing·Skills / 우 Certifications·Projects·Contact.
     열 사이 절대배치 세로 헤어라인 하나가 전 행 관통(구획 A안, `calc((100% - 3.5rem)*4/7 + 1.75rem)`).
  3. Projects/Writing 은 대표 3개 타이틀 + summary/description 부가설명 + "전체 보기 →".
- **타임라인 컴포넌트** (`src/components/about/about-timeline.tsx`) — 날짜(3.5rem, 좌측 정렬,
  "yyyy. MM") | 1px 축 + 5px 채운 점 | 내용. `showKind` prop(Certifications 에서 false).
- **philosophy frontmatter 필드 신설** — `velite.config.ts` + `src/types/content.d.ts` +
  `src/content/about/index.mdx`. 본문 소제목 3개와 같은 문장 유지가 규칙.
- Rail/RailSection 은 /about 에서만 제거됨(다른 페이지는 그대로).

What is intentionally not changed:

- `index.mdx` 의 '일하는 방식' 본문(### 3개)은 파일에 남아 있지만 **현재 페이지에서 렌더링 안 함**
  (philosophy 요약이 밴드에서 대신함). 지우지 말 것 — 사용자가 내용 채운 뒤 재사용 여지.
- Selected 섹션·`SelectedList`·`getSelected()` — 페이지에서 제거됐지만 컴포넌트·데이터·빌드 검증은
  남아 있음. 대표작 입구는 Projects/Writing 리스트가 대체.
- 타임라인 기간 표기(`formatPeriod`) → 시작 날짜만 표기로 변경됨(end 데이터는 frontmatter 에 유지).

Important assumptions:

- 사용자와의 첨삭 루프: dref item `20260804-1640-about-이력서형-시안-c안-헤더-밴드-2열-그리드`
  (`http://127.0.0.1:4180/annotate?item=<id>`). 구현이 바뀌면 스크린샷(shot.jpg)을 로컬 빌드
  렌더로 교체해 왔다(headless Chrome, `--enable-unsafe-swiftshader` 필요 — WebGL 커서 때문).
- 시안 아티팩트: 이력서형 4안 `eb56afd8-…`, 구획 4종 `7b9c95a5-…` (claude.ai/code/artifact).

## Decisions (cite, do not restate)

- 확정(정본): 이 repo 의 ADR 은 `docs/adr/0001` 하나뿐. 이번 세션 결정들은 D-번호 없음.
- 미결(노트 초안 — 확정 인용 금지): 섹션 제목 영문 단독 / 이름만 국·영 병기(영문은 스몰캡스
  라벨) / 구획은 열 사이 세로선 하나(A안) / Skills 라벨 "주력·경험" / 날짜 "yyyy. MM." 점 표기.
  전 세션 메모리 `site-design-taste`(사용자 취향: 세련·정제, 중복 제거, 헤어라인 디테일)도 참고.

## Files To Read First

- `src/app/about/page.tsx`: 개편 결과 전체. 주석에 각 결정의 이유가 있음.
- `src/components/about/about-timeline.tsx`: 축 타임라인. DATE_COL 상수에서 위치 파생.
- `src/content/about/index.mdx`: TODO 천지 — 콘텐츠는 사용자 몫.
- `src/app/globals.css`: rail·팔레트·spacing 토큰. 다른 페이지 위화감 작업의 기준.

## Work In Progress

- Changed files: 없음 (커밋 4개로 정리 완료: `17ddccf` 스키마·타입, `a6e84cc` mdx,
  `54b2a25` 타임라인, `7857b80` 페이지)
- Untracked files: 없음
- Known dirty state: 없음

## Verification

- Command: `pnpm build` (velite + next)
  Result: 통과 (세션 중 매 반영마다 실행)
- Command: headless Chrome 스크린샷 1280px / 590px / 390px
  Result: 데스크톱·중간 폭 정상. **390px 에서 사이트 전체 가로 넘침** — /writing 등 기존
  페이지도 동일 재현이라 /about 무관 기존 이슈(실기기 확인 필요). 테스트 스위트는 없음(repo 에 테스트 부재).

## Next Steps

1. 사용자 "이어서" 신호 후: /about 과 나머지 페이지(홈 `src/app/page.tsx`, /writing,
   /portfolio, 글 상세)의 위화감을 수석 디자이너 재량으로 해소. 어디를 어떻게 만질지는
   자유지만, /about 이 기준점(헤어라인·영문 라벨·점 표기·세로선 문법).
2. 방향 잡히면 dref 첨삭 루프 재개(스크린샷 교체 → 핀 → 반영) 가능성 높음.
3. 콘텐츠 TODO(사진·Now·철학 근거·Skills·프로젝트 summary)는 사용자 몫 — 재촉만.

## Watch Outs

- 390px 가로 넘침은 기존 이슈 — /about 작업으로 오인해 되돌리지 말 것.
- dref 서버(4180)·markup 라운드는 로컬 상태. 라운드 응답은
  `~/.markup-blueprint/rounds/<id>/review-response.json` 직접 쓰기 + 핀 status PUT.
- `git ai-commit` 은 plan → `apply --reviewed` 2단계(경고 시 기본 중단).
- 브랜치 푸시 안 됨 — 푸시는 사용자 지시 필요.
