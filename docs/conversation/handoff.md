# Agent Handoff

이전 핸드오프(2026-08-04, /about 이력서형 개편 세션)는 `46f26f3` 커밋에 남아 있다.
이 노트는 2026-08-04 세계수 폐기 + 전 페이지 재구성 + 라이트 모드 조정 세션을 다룬다.

## Context

- Date: 2026-08-04
- Repository: `miniminjae92/miniminjae.me` (**public**)
- Branch: `feat/living-personal-site` — `eee977e` 까지 **origin 에 푸시됨**
- User goal(원문 요지): ① "각 카테고리에 맞는 것이 중요하다. 홈·Projects·Writing 은
  각각을 최대한 잘 표현해야 한다. 세계수 정본은 없애버려라." ② "라이트 모드에서
  호버(포커스) 차이가 잘 안 느껴지고 기본 채도도 다크보다 바래 보인다.
  예민하게 만져 달라." — 둘 다 반영됐고 사용자가 확인·승인했다.

## Current State

전부 커밋·푸시됨, 워킹 트리 깨끗:

- **세계수 은유 전면 폐기 (ADR-0002)** — `docs/adr/0002-drop-world-tree-metaphor.md`.
  - `rail.tsx` 삭제, `globals.css` 의 rail 토큰·규칙 삭제.
  - CONTEXT.md: Living Tree / Rail / Constellation 삭제, Portfolio → **Projects**
    개명(URL `/portfolio` 유지), 세계관 서사 제거.
  - `docs/design/living-personal-site.md` 재작성, README 동기화.
- **전 페이지를 /about 문법으로 재구성** (`8052327`):
  - 홈: 히어로 + Projects + Writing (Contact 섹션 제거 — 히어로와 중복).
  - `/writing` `/portfolio` `/tags`: 제목 + 한 문장 + 헤어라인 헤더.
  - `/portfolio/[slug]`: 헤더 밴드 + Problem/Decision/Result/Writing 영문 섹션 제목.
  - 내비 라벨 Portfolio → Projects, `project-list.tsx` 마지막 항목 `last:border-b-0`.
- **라이트 모드 미세 조정** (`eee977e`), 사용자 확인 완료:
  - 형제 흐림을 `--dim` 변수로 승격 — 라이트 28% / 다크 40%(기존값).
    사용처 7곳이 `group-hover/list:opacity-(--dim)` 으로 통일됨.
  - 라이트 텍스트 반 단계 진하게: body #3a3a3a(11.1:1), second #616161(6.1:1),
    disabled #6e6e6e(5.0:1). 다크 토큰은 무변경.
  - 라이트 헤어라인 알파 0.09 → 0.12.

의도적으로 안 바꾼 것:

- `/portfolio` URL — Projects 는 라벨 교체(ADR-0002).
- `pnpm lint` 기존 에러 12건(scripts/optimize-images.js require,
  splash-cursor 인라인 class, theme-toggle set-state-in-effect) — 이번 작업과 무관.
- 다크 모드 토큰·흐림 강도 전부.

## Decisions (cite, do not restate)

- 확정: `ADR-0001` — Portfolio 가 Roots 를 흡수. `ADR-0002` — 세계수 은유·레일
  폐기, 페이지별 표현 + 공통 디테일 문법, Projects 개명. 전문은 `docs/adr/`.
- 미결(노트 초안 — 확정 인용 금지): 라이트 `--dim` 28%·헤어라인 0.12·텍스트
  토큰 값은 이번 세션의 감각 조정 결과로 사용자가 승인했으나 ADR 은 아니다.
  재조정 요청이 오면 `globals.css` 의 해당 변수만 움직인다.

## Files To Read First

- `docs/adr/0002-drop-world-tree-metaphor.md`: 이번 세션의 확정 결정과 근거.
- `src/app/globals.css`: 팔레트·`--dim`·헤어라인 — 시각 조정의 단일 지점.
- `src/app/about/page.tsx`: 공통 문법의 기준점(이전 세션 산출물).

## Work In Progress

- Changed files: 없음 (전부 커밋·푸시: `8052327` 재구성, `1c75974` 정본,
  `f7bdbfa` 인계 노트, `eee977e` 라이트 조정)
- Untracked files: 없음
- Known dirty state: 없음

## Verification

- Command: `pnpm build`
  Result: 통과 (재구성 후, 라이트 조정 후 각각 실행)
- Command: headless Chrome 1280px 스크린샷 (홈·/writing·/portfolio·/portfolio/dref)
  Result: 정상. 이중 헤어라인 1건 발견 → `last:border-b-0` 로 수정.
- Command: claude-in-chrome 으로 라이트/다크 호버 상태 실측
  Result: 라이트 흐림 차이 뚜렷, 다크 무변화. 확인용 localStorage theme 은 원복함.
- 테스트 스위트 없음(repo 에 테스트 부재). `pnpm lint` 는 기존 에러 12건으로
  실패하나 이번 변경 파일은 무관.

## Next Steps

1. 콘텐츠 TODO 채우기(사용자 몫): 프로젝트 summary/problem/result,
   /about 사진·Now·Skills. 에이전트는 재촉만.
2. 390px 가로 넘침 원인 조사 — /writing 등에서 재현되는 기존 이슈.
3. 필요시 dref 첨삭 루프 재개(스크린샷 교체 → 핀 → 반영).

## Watch Outs

- 390px 가로 넘침은 이번 작업 이전부터 있던 이슈 — 재구성 탓으로 오인해
  되돌리지 말 것.
- 레일 부활 제안은 ADR-0002 "되돌리는 법" 절 기준으로 판단.
- 라이트 모드 값은 "반 단계" 감각으로 수렴한 상태 — 큰 폭 이동 금지,
  변수 하나씩만.
