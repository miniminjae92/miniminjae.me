# Agent Handoff

이 노트는 **2026-08-19 머지 준비 감사** 세션을 다룹니다. 이전 상태(2026-08-07 잔부가정보 정리 + 글 상세 레이아웃 복원)는 `7a09d26` 커밋의 이 파일에 있습니다.

## Context

- Date: 2026-08-19
- Repository: `miniminjae92/miniminjae.me` (**public**. Watch Outs 첫 항목 참고)
- Branch: `feat/living-personal-site`. main 기준 **42 커밋 앞**, main 이 앞선 커밋 0건, **fast-forward 가능**. 워킹 트리 깨끗
- User goal(원문): "이제 main에 들어갈만한가? 그리고 이어서 작업할게 있었나"

## Current State

**머지 가능합니다.** 막고 있던 것은 하나였고 이 세션에서 고쳤습니다.

### 게이트 실측

| 항목 | 결과 |
|---|---|
| `pnpm build` | 통과, 34면 정적 생성 |
| `pnpm exec tsc --noEmit` | 통과 |
| `pnpm lint` | 12건(10 errors, 2 warnings). **main 을 별도 워크트리에 띄워 재보니 건수와 파일이 동일.** 이 브랜치가 추가한 건 0건 |
| Studio 라우트 | `/studio`, `/api/studio` 둘 다 프로덕션에서 404. 핸들러마다 게이트가 걸려 있음 |
| `.drafts` | gitignore 되어 있고 git 추적 0건. public repo 로 새는 초안 없음 |

lint 12건이 걸리는 파일은 `scripts/optimize-images.js`, `splash-cursor-core.tsx`, `real-time-clock.tsx`, `mdx-content.tsx`, `theme-toggle.tsx` 다섯입니다. 전부 main 기준선과 같습니다.

### 이 세션의 커밋 2건

- `4ce97a7` **`/about` 헤더의 폰 폭 줄바꿈 버그 수정.** 헤드라인 블록이 `flex-wrap` 안에서 `basis-0` 이라 줄바꿈이 영영 안 터졌습니다. Watch Outs 참고
- `a48b3a5` **폰트 랩 제거.** 조합이 확정돼 은퇴 조건이 충족됐습니다

### 사용자가 이 세션에서 닫은 결정 4건

1. **폰트 조합은 "원본"**(제목과 본문 모두 고운바탕). `globals.css` 기본값이 이미 그 값이라 굳힐 것이 없었고, 랩만 걷어냈습니다
2. **잔부가정보 3분류 기준(산문/메타데이터/장식)은 ADR 로 승격하지 않습니다.** "그때의 판단 정도로 남기는 게 좋아 보여". 다음 세션은 이 기준을 확정 결정으로 인용하지 말고 그 자리에서 판단합니다
3. **기간 꼬리 대시(`26.07 –`) 유지.** 6건 전부 실제로 진행 중임을 확인받았습니다. `endDate` 를 넣을 항목 없음
4. **콘텐츠 데이터 오류는 고치지 않습니다.** agent-os 지표의 산수 불일치(`39개 → 25개` 는 14 감소인데 note 는 도구 8개를 설명)를 올렸으나, 콘텐츠 전반이 AI 초안이고 교체 예정이라 손대지 않기로 했습니다

## Decisions (cite, do not restate)

정본(`~/.dotfiles/agent-os/DECISIONS.md`, repo `docs/adr/` 는 ADR-0001, 0002 두 건)에 위 4건은 등재돼 있지 않습니다. 전부 구두 결정이며, 2번은 **명시적으로 정본화를 거절한** 건입니다.

남은 미결:

- **`?lens=` 쿼리 파라미터 도입**: `/writing` 필터를 URL 상태로 옮겨 렌즈 필터가 링크로 열리고 공유 가능해졌습니다. 구현은 됐으나 설계 결정이 정본에 없습니다
- **다크 모드 `antialiased` 되돌림 미적용**: `layout.tsx` 주석에 되돌릴 때 두 곳(여기와 `globals.css` 의 body 규칙)을 함께 봐야 한다고 적혀 있습니다
- **증분 채굴 장치 미도입**(새 세션만 주기적으로 글감 보드에 추가)
- **주간 발행 강제 장치는 사용자가 명시 폐기**. 되살리자는 제안을 다시 꺼내지 마십시오
- **main 머지 자체**가 아직 안 됐습니다

## Files To Read First

- `src/app/about/page.tsx` 100~112행: 헤더 헤드라인 블록의 `basis` 를 왜 0 으로 두면 안 되는지가 주석에 실측값과 함께 있습니다
- `src/app/globals.css` 136~150행: 서체를 이름이 아니라 역할(`--font-display`/`--font-body`)로 부르는 이유와, 조합 확정 사실이 주석에 있습니다. 두 변수가 지금은 같은 서체를 가리키지만 **다시 가를 때 갈아 끼울 이음매라 남겨 뒀습니다**
- `src/app/globals.css` 의 `.display-face` 규칙: 이 클래스가 왜 Tailwind `font-display` 유틸리티를 대신하는지. `@theme inline` 이 값을 한 단계만 펼치는 것이 핵심입니다
- `src/components/layout/archive-nav.tsx`: 글 하단 알약 내비. 목적지를 `/writing?lens=…` 로 둔 이유가 주석에 있습니다
- `src/components/post/content-detail-page.tsx`: `pb-half-page` 가 무엇을 대체하는 여백인지, description 을 화면에서만 빼고 frontmatter 는 왜 남기는지
- `src/components/writing/writing-index.tsx`: 필터 상태가 `useState` 가 아니라 `?lens=` 인 이유

## Verification

- `pnpm build` / `pnpm exec tsc --noEmit` / `pnpm lint`: 위 표 참고. lint 기준선은 `git worktree add <경로> main` 으로 main 을 별도 워크트리에 띄워 직접 재봤습니다
- 프로덕션 번들 검사: `.next/static/chunks/` 를 grep 해 폰트 랩 문자열이 사라진 것을 확인. **제거 전에는 실려 있었습니다**(프로덕션에서 숨어 있을 뿐 localStorage 플래그로 열렸음)
- 실측 DOM(`/about`): `--font-display`, `--font-body` 둘 다 Gowun Batang, `--font-pretendard` 없음, `<html>` 인라인 오버라이드 없음(`color-scheme` 만), 랩 버튼 DOM 에 없음
- 브라우저 화면: `/about`, `/tags`(직전 인계에서 미확인으로 남았던 두 면), `/`, `/memo/mdx-special-characters`. 400px 와 1460px 양쪽
- 폭별 레이아웃 실측: `/about` 헤더를 뷰포트 1400/900/768/700/600/500/430/393/360px 에서 측정. 수정 전후 수치는 아래 Watch Outs
- 테스트 스위트 없음(repo 에 테스트 부재)

## Next Steps

1. **main 머지.** fast-forward 가능합니다
2. 콘텐츠 본문 다시 쓰기(사용자 작업). 이때부터 사실관계가 감사 대상이 됩니다
3. `?lens=` 설계 결정을 정본에 올릴지 판단
4. 다크 모드 `antialiased` 되돌림 여부 판단

## Watch Outs

- **이 저장소는 public.** 노션 DB, 아티팩트 URL, 개인 볼트 경로, 세션 로그 내용을 적지 않습니다
- **`flex-wrap` 안에서 `basis-0` 을 쓰지 마십시오.** 이번 세션 최대 함정입니다. flex 의 줄 묶기는 콘텐츠 폭이 아니라 **flex base size** 로 판정하므로, `basis-0` 인 아이템은 어떤 좁은 줄에도 "들어간다"로 읽혀 절대 다음 줄로 안 내려가고 남은 틈만큼만 부풉니다. `/about` 헤더에서 실측 결과 뷰포트 500px 에서 블록 폭 115px, 430px 에서 45px, 400px 에서 **15px 에 한 줄 한 글자로 30줄**이 났습니다. 깨지는 구간이 410~560px 라 요즘 폰 대부분이 여기 들어갑니다. 고치는 법은 아이템의 최소 편안한 폭을 실제 basis 로 주는 것입니다(여기서는 `basis-72` = 288px, `max-w-[38ch]` 인 349px 보다 작아 `grow` 를 막지 않습니다)
- **`min-w-0` 는 위 버그의 원인이 아닙니다.** 한국어 본문은 글자 사이에서 끊겨 min-content 가 한 글자 남짓이라, 지워도 줄바꿈은 안 터집니다
- **폭 0 짜리 flex 아이템도 `gap` 은 그대로 데리고 다닙니다.** 360px 에서 레이아웃이 되레 멀쩡해 보이는 이유가 이것입니다(사진 192 + 갭 32 + 이름 97 + 갭 32 = 353 이 밴드 328 을 넘겨 헤드라인이 밀려남)
- **`pnpm build` 통과는 렌더 검증이 아닙니다.** 이번에도 빌드, 타입체크, lint 가 전부 통과한 상태에서 폰 폭 레이아웃이 깨져 있었습니다. **화면을 봐야 잡힙니다**
- **브라우저 창이 400px 에 고정돼 `resize_window` 가 안 먹을 수 있습니다.** 이때는 페이지를 원하는 폭의 `<iframe>` 에 띄우면 그 안이 독립 레이아웃 뷰포트를 가지므로 폭별 측정이 됩니다(같은 오리진이라 `contentDocument` 로 실측 가능). 이번 폭별 수치는 전부 이 방법으로 얻었습니다
- **커밋 전에 explain-diff 게이트(D-027)가 막습니다.** 설명서를 만들거나 사용자 승인을 받아 skip 해야 통과합니다. 설명서는 **메인 세션에서 직접 쓰지 말고 서브에이전트에 백그라운드로 위임**합니다. 스스로 판단해 skip 하지 마십시오
- **`pnpm build` 는 dev 서버를 죽입니다.** `.next` 를 덮어써 `:3000` 의 dev 가 내려갑니다
- **`/insight`, `/memo`, `/log` 는 인덱스 페이지가 없습니다.** `[slug]` 만 남아 있어 이 세 경로로 링크를 걸면 404 입니다. 글 permalink 는 여전히 이 경로를 씁니다
- **`useSearchParams` 는 Suspense 경계를 요구합니다.** `/writing` 을 감싸 뒀습니다. 다른 면에 쿼리 파라미터를 도입하면 같은 처리가 필요합니다
- **JSX 의 `{cond && (...)}` 안에는 형제 노드를 둘 수 없습니다.** 주석은 래퍼 안쪽에 넣습니다
- **`DESCRIPTION` 상수를 화면에서 빼도 지우면 안 됩니다.** `/writing`, `/tags`, `/portfolio` 의 상수는 `metadata` 와 `openGraph` 가 계속 씁니다. 글 frontmatter 의 `description` 도 `generateMetadata`, `openGraph`, `twitter`, `/api/og` 가 쓰므로 화면의 `<p>` 만 걷어냅니다
- **본문 첫 `#` 중복은 컴포넌트가 아니라 데이터에서 고칩니다.** `mdx-content.tsx` 에서 첫 h1 을 숨기면 멀쩡한 섹션 제목까지 사라집니다
- **`stack` 값에 중점(`·`)을 넣지 마십시오.** 상세 헤더가 항목을 `·` 로 이어 붙여 값 안의 중점과 구별되지 않습니다
- **`getAllProjectsDesc` 는 visibility 를 거르지 않습니다.** 이 함수로 공개 건수를 세지 마십시오
- **알약 내비를 헤더에 넣지 마십시오.** main 은 헤더와 푸터 양쪽에서 렌더해 같은 내비게이션이 한 화면에 두 번 나왔습니다. 지금은 글 하단 한 곳뿐입니다
- **`@theme inline` 은 값을 한 단계만 펼칩니다.** 그래서 `--font-sans: var(--font-body)` 는 역할에서 멈추는데 `--font-display: var(--font-goun)` 은 서체 이름에 닿습니다. 표제 쪽만 `.display-face` 라는 우회가 필요한 이유입니다
- **Tailwind v4 잡동사니**: `--tw-leading` 은 상속 안 됨 / 컨테이너에서 `text-base` 로 body 크기를 되누르지 말 것 / next/font `subsets` 에 `korean` 을 넣으면 빌드가 막히고 `["latin"]` 으로도 한글은 다 내려옴 / `pnpm add` 는 `--store-dir ~/projects/.pnpm-store/v10` 필요
- **콘텐츠는 AI 초안입니다.** 사실관계 감사 대상이 아닙니다. 불일치를 발견하면 한 줄로 알리고 지나갑니다. 코드, 레이아웃, 렌더 결함은 이 규칙 밖입니다
- 별건 미수정: `/insight/statistics-ai` 인용문의 `**…**` 가 별표째 렌더됨(콘텐츠 마크다운 문제)
