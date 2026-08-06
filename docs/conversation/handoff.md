# Agent Handoff

이전 핸드오프(2026-08-04, 세계수 폐기·전 페이지 재구성 세션)는 `64a1c53` 커밋에
남아 있다. 이 노트는 2026-08-05~06 Projects·About 콘텐츠 채우기 세션을 다룬다.

## Context

- Date: 2026-08-06
- Repository: `miniminjae92/miniminjae.me` (**public**)
- Branch: `feat/living-personal-site` — 이번 세션 8커밋
- User goal(원문 요지): ① "Projects를 채우려고 한다. 우선순위 리스트업하고 하나씩
  완성하자. 반복되는 부분은 기록해서 스킬화하자." ② 진행 중 추가: "일반인도
  이해가 쉽도록 하는 것이 중요하다." ③ "private일 필요가 있나?" ④ "시각적으로
  보여줄 부분은 무조건 있는 게 좋고 만들어내는 게 중요한가?" ⑤ "about도 진행,
  개인 노트 볼트를 참고해도 좋다." ⑥ "42 경산, AI 국비교육 자료도 올려달라.
  Writing에 임시글이 섞여 있어 고민된다."

  ※ 이력의 출처는 개인 노트 볼트의 교육 요약 문서다. 볼트 위치는 이 저장소가
  아니라 개인 에이전트 설정(AGENTS.md)에 있다 — 공개 저장소에 적지 않는다.

## Current State

전부 커밋됨, 워킹 트리 깨끗:

- **Projects 6건 완성 (TODO 0)** — Agent OS, minjae.space, dref, agent-notify,
  Element to Markdown, 설명보따리. 모든 문장이 대상 저장소의 README·ADR·결정
  기록·커밋에서 확인된 사실이다. 검증 못 한 서술과 `note` 없는 지표는 안 실었다.
- **About 개편** — `role` 을 백엔드 개발자 → **AX 엔지니어**로. 이력 복원(42 경산,
  성균관대 산학협력단 AI 과정, 우테코 8기 본과정 진행 중), 자격증 3종, 프로필 사진.
- **Writing 18편 → 14편** — 얇은 메모 4편을 `.drafts/` 로 내림.
- **죽은 파이프라인 제거** — `selected` 와 MDX 본문은 ADR-0002 재구성 때 화면에서
  빠졌는데 배관만 남아 있었다. `src/lib/about.ts`·`SelectedList` 삭제.
- **사이트 버그 2건** — 문단 아래 여백 가드(전 글 첫 문단이 둘째와 붙어 있었다),
  결과 지표 그리드 반응형.
- **스킬 신설** — `.claude/skills/portfolio-entry/SKILL.md` (저장소 로컬).

의도적으로 안 한 것:

- `naon`·`hushaby`·`gh-mine`·`video-summary` 등 나머지 Projects 후보 — 6건이
  서로 다른 능력을 맡도록 구성한 결과이지 누락이 아니다.
- 시각 자료 — 아래 Watch Outs 참고.
- `/about` 의 `selected`·본문 복원 — 사용자 판단으로 정리 쪽을 택했다.

## Decisions (cite, do not restate)

- 확정(ADR 아님, 이번 세션 사용자 승인):
  - `role: AX 엔지니어`. 근거는 실측(스스로 만든 저장소에 Java 0, Swift/TS/JS/
    Python 중심)과 여섯 항목의 관통선("AI 를 어디서 멈춰 세우는가").
  - Agent OS `visibility: public`. dotfiles 가 public 저장소이고 결정 기록이 그
    안에 있어 private 은 사실과 다르다.
  - Writing 4편 하차. 삭제가 아니라 초안 이동.
  - `/about` 의 `selected`·본문은 복원하지 않고 필드째 제거.
- 미결(확정 인용 금지):
  - 우테코 8기 본과정 시작일 `2026-03-01` 은 **추정치**다. 볼트 문서에 "2026.03"
    까지만 있다. 정확한 날짜를 받으면 고친다.
  - `dref`·`manual-library` 공개 전환. 막던 이유(남의 저작물·데이터)는 이미 없다 —
    `dref/library/.gitignore` 가 이미지를 전부 제외하고, `manual-library` 는 데이터가
    없다. 남은 관문은 시크릿 스캔(D-020)이고 `gitleaks` 가 아직 미설치다.

## Files To Read First

- `.claude/skills/portfolio-entry/SKILL.md`: 항목 작성 절차와 이 저장소 고유 함정.
  Projects 를 손대기 전에 반드시 읽는다.
- `src/content/portfolio/agent-os/index.mdx`: 문체와 눈높이의 기준점.
- `~/.dotfiles/agent-os/DECISIONS.md`: Agent OS 항목의 근거(D-001~D-022).

## Work In Progress

- Changed files: 없음
- Untracked files: 없음
- Known dirty state: 없음

## Verification

- Command: `pnpm build`
  Result: 통과. 최종 상태와 각 커밋 시점 모두.
- Command: `git worktree add --detach <tmp> HEAD~2 && pnpm build`
  Result: 통과. 커밋 순서를 빌드 기준으로 잡았다는 주장을 실제로 확인한 것 —
  About 콘텐츠를 죽은 스키마 제거보다 먼저 넣지 않으면 중간 커밋이 깨진다.
- Command: claude-in-chrome 실측 (1440px / 485px)
  Result: 문단 여백 균일, 지표 그리드 데스크톱 3열·모바일 1열, 가로 넘침 0.
- Command: `pnpm lint`
  Result: 기존과 동일한 12건(10 errors, 2 warnings)으로 실패. 이번 변경이 추가한
  것은 없다. `mdx-content.tsx` 의 2건은 이번에 고친 `p:` 규칙(25행)이 아니라
  `MDXContent` 컴포넌트 팩토리(170·173행)다.
- 테스트 스위트 없음(repo 에 테스트 부재).

## Next Steps

1. 우테코 8기 본과정 정확한 시작일 확인 후 `about/index.mdx` timeline 수정.
2. `brew install gitleaks` → `dref`·`manual-library` 스캔 → 통과 시 사용자가
   `gh repo edit --visibility public` 실행 → 각 항목의 `visibility`·`links` 갱신.
3. `manual-library` 를 실제 설명서를 담은 상태로 재캡처하면 시각 자료가 생긴다.
4. Projects 확장 후보: `gh-mine`(골드라벨 채점 + 사람 승인 관문),
   `video-summary`(기본 모델 호출 0), `naon`(프라이버시 설계).
5. 390px 가로 넘침 — 이전 세션부터 있던 미해결 이슈. 이번에 만든
   `/portfolio/*` 에서는 재현되지 않았다.

## Watch Outs

- **`src/content/.drafts/` 는 gitignore 대상이다.** 그리로 옮기면 "이동"이 아니라
  추적 해제로 기록된다(커밋 `727295c` 는 -504 deletions 로 보인다). 파일은 디스크에
  있고 git 이력으로도 복구된다. 되살리려면 `.drafts/memo-*` 를 `memo/` 로 옮긴다.
- **`pnpm build` 통과는 렌더 검증이 아니다.** 스키마만 본다. 이번 세션에서 빌드를
  통과한 뒤 브라우저에서 잡힌 것: `summary` 실질 상한 70자(`max-w-[38ch]`),
  `problem` 의 `whitespace-pre-line` 줄바꿈(한 문단 = 한 줄로 쓸 것),
  `judgment` 의 plain text 렌더(마크다운·곧은따옴표 안 됨).
- **시각 자료는 "있는가"가 아니라 "작동을 보여주는가"로 판정한다.** 이번에 걸러낸
  셋: 스토어 홍보 배너(로고), 디자인 QA 캡처(더미 데이터 `0페이지`), 아이콘 에셋.
  없는 것을 포트폴리오용으로 만들어 내는 것은 `note` 없는 지표를 싣는 것과 같다.
- **`~/projects/ww-project` 는 우테코 8기 레벨3 팀 프로젝트다.** 저장소 원격이
  타인 계정이고 본인 커밋이 0건이라 남의 저장소로 오인하기 쉽다. 기존 코드베이스를
  계승하는 팀 과제이며, 기여가 쌓이면 Projects 항목 후보가 된다.
- 일반인 눈높이는 이 사이트의 유지 규칙이다. 설명을 덧붙이지 말고 같은 길이로 더
  쉬운 단어를 쓴다. 숫자와 사실은 뭉개지 않는다. 상세는 스킬 문서에 있다.
