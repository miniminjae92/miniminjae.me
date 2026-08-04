# Agent Handoff

이전 핸드오프(2026-08-04, /about 이력서형 개편 세션)는 `46f26f3` 커밋에 남아 있다.
이 노트는 2026-08-04 세계수 폐기 + 전 페이지 재구성 세션을 다룬다.

## Context

- Date: 2026-08-04
- Repository: `miniminjae92/miniminjae.me` (**public**)
- Branch: `feat/living-personal-site` (**푸시 안 함** — 푸시는 사용자 지시 필요)
- User goal(원문 요지): "각 카테고리에 맞는 것이 중요하다. /about 은 이제 잘
  나타난다. 홈·Projects·Writing 페이지는 각각을 최대한 잘 표현해야 한다.
  세계수 정본은 없애버려라." — 이전 세션이 위임한 '수석 디자이너 재량' 작업.

## Current State

전부 이번 세션에서 반영·검증됨:

- **세계수 은유 전면 폐기 (ADR-0002)** — `docs/adr/0002-drop-world-tree-metaphor.md`.
  - `rail.tsx` 삭제, `globals.css` 의 rail 토큰·규칙 삭제.
  - CONTEXT.md 에서 Living Tree / Rail / Constellation 용어 삭제,
    Portfolio → **Projects** 개명(URL `/portfolio` 유지), 서문에서 세계관 서사 제거.
  - `docs/design/living-personal-site.md` 재작성(세계수·도서관·우주 서사 제거,
    "페이지별 표현 + 공통 디테일 문법"으로 재정의). README 동기화.
- **전 페이지를 /about 문법으로 재구성** — 헤어라인 구획, 영문 단독 섹션
  제목(text-xl), 페이지 제목 text-2xl, 중복 제거:
  - 홈(`src/app/page.tsx`): 히어로 + Projects + Writing. Contact 섹션 제거
    (히어로 소셜 링크와 중복). "전체 보기 →"는 섹션 제목 행 오른쪽 끝.
  - `/writing`, `/portfolio`, `/tags`: 제목 + 한 문장 + 헤어라인 헤더.
  - `/portfolio/[slug]`: 헤더 밴드 + Problem/Decision/Result/Writing 섹션 제목.
  - `project-list.tsx`: 마지막 항목 `last:border-b-0` (섹션 border-t 와 이중선 방지).
  - 내비 라벨 Portfolio → Projects (`navigation.ts`).

## Decisions (cite, do not restate)

- 확정(정본): ADR-0002 — 세계수 은유·레일 폐기, 페이지별 표현, Projects 개명.
  이 repo ADR 은 이제 0001, 0002 둘.
- 공통 문법(ADR-0002 본문에 명시): 1px 헤어라인 / 영문 단독 섹션 제목 /
  `yyyy. MM. dd.` + tabular-nums / 분모 없는 수치 금지.

## Files To Read First

- `docs/adr/0002-drop-world-tree-metaphor.md`: 이번 세션의 확정 결정.
- `src/app/about/page.tsx`: 문법의 기준점(이전 세션 산출물, 이번엔 주석만 수정).
- `src/app/page.tsx`: 홈 재구성 결과.

## Work In Progress

- 없음. 워킹 트리 깨끗(커밋 완료), 테스트 스위트 없음.

## Verification

- `pnpm build` 통과. `pnpm lint` 는 **기존** 에러 12건(scripts/optimize-images.js
  require, splash-cursor 인라인 class, theme-toggle set-state-in-effect) — 이번
  변경과 무관, 손대지 않음.
- headless Chrome 1280px 스크린샷으로 홈·/writing·/portfolio·/portfolio/dref 확인.
- 390px 가로 넘침은 여전한 기존 이슈(실기기 확인 필요) — 이번 작업으로 오인 금지.

## Next Steps

1. 사용자 확인 → 필요시 dref 첨삭 루프(핀 → 반영) 재개.
2. 콘텐츠 TODO(프로젝트 summary/problem/result, /about 사진·Now·Skills)는 사용자 몫.
3. 390px 가로 넘침 원인 조사(기존 이슈).

## Watch Outs

- `/portfolio` URL 은 의도적으로 유지 — Projects 는 라벨 교체다(ADR-0002).
- 레일을 되살리자는 제안이 오면 ADR-0002 의 "되돌리는 법" 절 기준으로 판단.
- 브랜치 푸시 안 됨 — 푸시는 사용자 지시 필요.
