# Agent Handoff

이 노트는 **2026-08-07 잔부가정보 정리 + 글 상세 레이아웃 복원** 세션을 다룹니다. 직전 세션(2026-08-06, 글감 채굴 + 타이포그래피/커서)의 변경도 **아직 커밋되지 않은 채 같은 워킹 트리에 섞여 있으므로**, 그 세션의 미결과 주의사항을 아래에 이어 싣습니다. 그 이전(2026-08-05~06, Projects, About 콘텐츠 채우기)은 `e3a45a8` 커밋에 있습니다.

## Context

- Date: 2026-08-07
- Repository: `miniminjae92/miniminjae.me` (**public**. Watch Outs 첫 항목 참고)
- Branch: `feat/living-personal-site`. 이번 세션 커밋 0건, 전부 워킹 트리
- User goal(원문):
  1. "자잘자잘한 쓸데없는 부가 정보들만 줄이면 더 이뻐보이겠는데, 상세내용들은 눌러서 들어가면 보이도록 하는게 중요한 게 더 눈에 들어오고 좋을것같아"
  2. 기준 정정: "서울, 자기소개 전문보다 about me or 제거, **보조 설명들이 너무 길고 많다는거였어**, cc라이선스는 괜찮았던것같은데?, 푸터 한글 툴팁섹션도 이쁘잖아, **보조 메타데이터들말하는거야**"
  3. 작업 중 추가: "글 들어가보니깐 예전 main 브랜치 페이지랑 레이아웃이 너무 차이나더라 해당부분도 체크해봐 똑같이 안가더라도 **가져올건 가져와야지 글이 완전 상단에 붙더라**"

## Current State

### 판정 기준을 한 번 갈아엎었다 (다음 세션이 반드시 알아야 함)

첫 감사는 "반복되면 지운다"로 훑어 CC 라이선스 고지, 푸터 한글 툴팁, 푸터 섹션 링크, 저작권, 실시간 시계, 헤더 태그 아이콘까지 삭제 후보로 올렸습니다. 사용자가 정정했고, 그 뒤 **산문 / 메타데이터 / 장식** 3분류로 재판정했습니다.

- **산문**(화면에 붙은 설명 문장) → 지운다 / 줄인다 / 남긴다
- **메타데이터**(역할, 기간, 공개여부, 카운트, 날짜, 순번) → 지운다 / 옮긴다 / 남긴다
- **장식**(툴팁, 라이선스 고지, 아이콘, 구분자, 헤어라인, 워드마크) → **기본값 남긴다.** 지우려면 그것이 "읽어야 할 정보"로 읽혀 실제로 밀도를 올린다는 증거가 필요. 애매하면 남긴다

### 적용 완료

- **잔부가정보 정리**: 산문 축약 + 보조 메타데이터 제거를 콘텐츠와 코드 양쪽에 반영. 가장 큰 덩어리는 Projects 상세의 지표 note 18건(합계 1349자, 그중 13건이 Problem, Decision, 본문 문장을 되풀이하고 있었음)
- **Projects 목록**: 세 번째 회색 메타 줄(역할, 공개여부, 스택)과 기간을 통째로 제거해 제목 + 한 줄 요약 두 겹으로 정리. 지운 값은 전부 상세 헤더에 있고, **스택은 상세에 렌더 줄을 새로 만들어 옮겼습니다**(옮기기 전에는 stack 을 렌더하는 곳이 목록 하나뿐이었음)
- **글 상세 레이아웃**: 제목 위계 회복(`text-lg` → `text-2xl`), 제목 블록 아래 `pb-half-page` 로 공기 확보, description 제거, 본문 첫 `#` 중복 제목 제거
- **글 하단 프로필 박스**: main 의 알약형 내비(`ArchiveNav`)를 복원

### 의도적으로 안 한 것

- **커밋 0건.** 직전 세션 변경과 섞여 있어 그룹을 갈라야 하며, 사용자 승인 대기 중인 항목이 포함돼 있음
- **히어로 카피 83자 유지.** 사용자가 명시적으로 "그대로 둔다"를 선택. `here.tsx` 주석에도 계승 결정이 박혀 있음
- **장식 일체 유지.** CC 라이선스, 푸터 툴팁, 섹션 링크, 저작권, 실시간 시계, 헤더 태그 아이콘, 검색 다이얼로그 서명, Decision 앞 순번, 글 상세 발행일
- **상세 헤더 기간의 꼬리 대시(`26.07 –`) 유지.** 6건 전부 endDate 가 없어 "진행 중"을 뜻함. 미결 3 참고
- **데이터 오류 2건 미수정**(미결 4). 콘텐츠 판단이 필요해 손대지 않음
- 직전 세션의 폰트 랩과 커서 팔레트는 그대로 둠

## Decisions (cite, do not restate)

정본(`~/.dotfiles/agent-os/DECISIONS.md`, repo `docs/adr/` 는 ADR-0001, 0002 두 건)에 **이번 세션 주제는 하나도 등재돼 있지 않습니다.** 아래는 전부 구두 지시이거나 초안이며, 다음 세션이 확정 결정으로 인용하면 안 됩니다. 승격할 값이 있으면 이 노트가 아니라 정본에 신설합니다.

- 미결 1, **잔부가정보 판정 기준 3분류**: 위 Current State 의 산문/메타데이터/장식 기준. 사용자 정정에서 도출했고 141건 판정에 실제로 적용했으나 정본에 없음. `CONTEXT.md` 나 ADR 로 승격할 값이 있음
- 미결 2, **사용자가 고른 6건**: `· 서울` 제거 / `자기소개 전문 →` → `About me →` / About 의 Projects 요약 비우고 제목만 / 홈 렌즈 설명 3줄 제거 / 히어로 카피 유지 / 글 하단 박스는 main 의 알약형 내비 복원. 전부 이번 세션 구두 선택
- 미결 3, **기간 꼬리 대시**: 목록에서 뺀 뒤 사이트에 이 표기가 상세 한 자리만 남음. 진행 중 표시로 유지했으나 사용자 확인 안 받음
- 미결 4, **콘텐츠 데이터 오류 2건**: ① agent-os `직접 만든 명령어` 지표. 값은 `39개 → 25개`(14개 감소)인데 note 는 도구 8개를 설명해 분모가 안 맞음. ② minjae-log 는 note 의 `18개월 중 8개월 공백` 과 Decision 4번의 `18개월 중 10개월` 이 모순. note 쪽 나열은 이번에 걷어내 화면에서는 안 보이지만 Decision 본문에는 남아 있음
- 미결 5, **`?lens=` 쿼리 파라미터 도입**: 알약 내비의 목적지를 만들려고 `/writing` 필터를 URL 상태로 옮김. 부수 효과로 렌즈 필터가 링크로 열리고 공유 가능해짐. 설계 결정이지만 정본에 없음
- 직전 세션에서 이월된 미결(그대로 유효): **타이포그래피 처방 승인 전**, **폰트 조합 확정 전**(폰트 랩 제거 조건), **다크 모드 `antialiased` 되돌림 미적용**, **주간 발행 강제 장치는 사용자가 명시 폐기**(되살리자는 제안 다시 꺼내지 말 것), **증분 채굴 장치 미도입**

## Files To Read First

- `src/components/layout/archive-nav.tsx`(신규): main 에서 되살린 알약 내비. **목적지를 왜 `/writing?lens=…` 로 바꿔야 했는지**와 활성 판정을 컬렉션 경로로 하는 이유가 주석에 있음
- `src/components/post/content-detail-page.tsx`: `pb-half-page` 가 무엇을 대체하는 여백인지, description 을 화면에서만 빼고 frontmatter 는 왜 남기는지가 주석에 있음
- `src/components/portfolio/project-list.tsx`: 메타 줄을 통째로 걷어낸 근거(6건 중 4건이 같은 역할 문자열 등)
- `src/components/writing/writing-index.tsx`: 필터 상태가 `useState` 가 아니라 `?lens=` 인 이유
- `src/components/effects/cursor-fx.tsx`, `src/components/dev/font-lab.tsx`: 직전 세션 산출물. 커서와 서체를 건드리기 전 필독(폰트 랩은 제거 조건이 주석에 있음)
- `src/app/globals.css`, `src/app/layout.tsx`: 직전 세션의 서체 변수 구조와 next/font `subsets` 함정

## Work In Progress

- 신규(untracked): `src/components/layout/archive-nav.tsx`
- 삭제: `src/components/post/related-posts.tsx`, `src/components/effects/home-cursor.tsx`(직전 세션)
- 이번 세션 변경, **콘텐츠**: `src/content/about/index.mdx`, `src/content/portfolio/{agent-os,agent-notify,dref,element-to-markdown,manual-library,minjae-log}/index.mdx`, 글 mdx 7건(`insight/{bigdata-recommendsystem,preview-docker-k8s-kernel,statistics-ai}`, `log/{ww-7th-week-1,ww-open-mission}`, `memo/{mdx-special-chracters,optimize-img-video-workflow}`)
- 이번 세션 변경, **코드**: `src/app/{about,portfolio,tags,writing}/page.tsx`, `src/app/portfolio/[slug]/page.tsx`, `src/app/{insight,memo,log}/[slug]/page.tsx`, `src/components/home/{here,home-writing}.tsx`, `src/components/portfolio/project-list.tsx`, `src/components/post/{content-detail-page,author-profile}.tsx`, `src/components/writing/writing-index.tsx`, `src/components/features/{search-dialog,tag-cloud}.tsx`, `src/lib/posts.ts`
- 직전 세션에서 이월된 미커밋: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/site-header.tsx`, `src/components/effects/splash-cursor-core.tsx`, `src/components/portfolio/metric-list.tsx`, `src/components/mdx/mdx-content.tsx`, untracked `src/components/dev/`, `src/components/effects/{cursor-fx,cursor-palette}.tsx`
- Known dirty state: **위 전부 되돌리지 말 것.** 두 세션 분량이 겹쳐 있으며 양쪽 다 사용자 판단 대기 상태

## Verification

- Command: `pnpm build`
  Result: 통과. 34면 정적 생성 성공
- Command: `pnpm exec tsc --noEmit`
  Result: 통과(exit 0)
- Command: `pnpm lint`
  Result: 실패(10 errors, 2 warnings). **main 워크트리에서 돌린 기준선과 건수가 같고**, 걸린 파일은 전부 이번 세션이 손대지 않은 기존 파일(`theme-toggle.tsx`, `real-time-clock.tsx`, `splash-cursor-core.tsx`, `mdx-content.tsx`, `scripts/optimize-images.js`). 이번 세션이 추가한 건 없음
- Command: `git worktree add /tmp/claude-501/mainref main` + `:3001` 로 main 을 띄워 현재 브랜치 `:3000` 과 스크린샷 대조
  Result: "글이 상단에 붙는다"의 원인을 특정. main 은 날짜 → 알약 내비 → 95px 공기 → 큼직한 제목 순인데, 현재는 사이트 헤더 바로 아래 날짜, 제목, 설명이 한 덩어리이고 제목이 `text-lg` 라 본문 소제목과 크기가 같았음. 조치 후 재확인 완료
- Command: 브라우저 실측(claude-in-chrome)
  Result: 홈, `/portfolio`, `/portfolio/agent-os`, `/writing?lens=solve`, 글 상세 2건 확인 완료. `?lens=solve` 로 직접 열었을 때 Solve 가 선택된 상태로 렌더되는 것, memo 글에서 알약 내비의 Solve 가 활성으로 보이는 것 확인
- **미확인**: `/about` 과 `/tags` 는 화면 확인 전(사용자가 중단). Next Steps 1
- 테스트 스위트 없음(repo 에 테스트 부재)

## Next Steps

1. `/about` 과 `/tags` 화면 확인. About 은 이번에 7군데를 건드려(영문 이름, 글 description, 카운트 2개, Projects 요약, 최종 수정일, linkedin `www.`, Timeline `showKind={false}`) 오른쪽 열이 비어 보이지 않는지 봐야 함
2. 커밋 그룹 나누기. **두 세션이 섞여 있으므로** 최소 5덩이로 갈림: ① 커서 팔레트, ② 타이포그래피, ③ 폰트 랩(승인 시 삭제로 대체), ④ 잔부가정보 정리, ⑤ 글 상세 레이아웃 복원 + 알약 내비. `git ai-commit` 을 제안으로 받아 검증할 것
3. 직전 세션 이월: 폰트 조합, 가독성 처방 승인받고 폰트 랩 제거
4. 미결 4 의 데이터 오류 2건 처리 여부 결정
5. 미결 1(3분류 기준)을 `CONTEXT.md` 나 ADR 로 승격할지 결정
6. **워크트리 정리**: `git worktree remove /tmp/claude-501/mainref`

## Watch Outs

- **이 저장소는 public.** 노션 DB, 아티팩트 URL, 개인 볼트 경로, 세션 로그 내용을 적지 않습니다. 채굴 카드에 `공개 전 확인` 속성이 있으니 글로 쓸 때 먼저 봅니다
- **`pnpm build` 는 dev 서버를 죽입니다.** `.next` 를 덮어써 `:3000` 의 dev 가 내려갑니다. 빌드 후 화면을 볼 거면 재기동해야 합니다
- **`pnpm build` 통과는 렌더 검증이 아닙니다**(이전 세션에서 이어지는 규칙). 이번에도 빌드는 통과했는데 화면에서 제목 위계와 여백 문제가 잡혔습니다. **레이아웃 회귀는 코드만 읽어서 못 찾았고, main 을 worktree 로 띄워 나란히 놓고서야 특정됐습니다**
- **`/insight`·`/memo`·`/log` 는 인덱스 페이지가 없습니다.** 이 브랜치가 `content-index-page.tsx` 를 지우면서 `[slug]` 만 남았습니다. 이 세 경로로 링크를 걸면 404 입니다. 글 permalink 는 여전히 이 경로를 씁니다
- **`useSearchParams` 는 Suspense 경계를 요구합니다.** `/writing` 을 감싸 뒀습니다. 다른 면에 쿼리 파라미터를 도입하면 같은 처리가 필요합니다
- **JSX 의 `{cond && (...)}` 안에는 형제 노드를 둘 수 없습니다.** 주석을 형제로 넣었다가 빌드가 깨졌습니다(`search-dialog.tsx`). 주석은 래퍼 안쪽에 넣습니다
- **`DESCRIPTION` 상수를 화면에서 빼도 지우면 안 됩니다.** `/writing`, `/tags`, `/portfolio` 의 상수는 `metadata` 와 `openGraph` 가 계속 씁니다. `/portfolio` 는 렌더용으로 `LEAD` 를 따로 뒀습니다. 글 frontmatter 의 `description` 도 `generateMetadata`·`openGraph`·`twitter`·`/api/og` 가 쓰므로 화면의 `<p>` 만 걷어냅니다
- **본문 첫 `#` 중복은 컴포넌트가 아니라 데이터에서 고쳤습니다.** `mdx-content.tsx` 에서 첫 h1 을 숨기는 방식을 쓰면 `# 서론`, `# 1차 심사 합격!!!`, `# 트랙패드…` 같은 멀쩡한 섹션 제목까지 사라집니다
- **`stack` 값에 중점(`·`)을 넣지 마십시오.** 상세 헤더가 항목을 `·` 로 이어 붙여 값 안의 중점과 구별되지 않습니다. dref 의 `HTML · CSS` 를 `HTML/CSS` 로 바꿨습니다
- **`getAllProjectsDesc` 는 visibility 를 거르지 않습니다.** About 이 이 값으로 "공개된 작업 6건"을 세면서 private 2건을 포함하고 있었습니다(카운트 자체를 제거함). 이 함수로 공개 건수를 세지 마십시오
- **알약 내비를 헤더에 넣지 마십시오.** main 은 헤더와 푸터 양쪽에서 렌더해 같은 내비게이션이 한 화면에 두 번 나왔습니다. 지금은 글 하단 한 곳뿐입니다
- **글 상세의 이미지 빈 박스는 이번 변경과 무관합니다.** main 에서도 똑같이 뜨며 dev 서버가 이미지를 굽고 나면 정상입니다
- 직전 세션 함정(그대로 유효): `@theme inline` 은 유틸리티 값을 빌드 시점에 고정 / Tailwind v4 `--tw-leading` 은 상속 안 됨 / 컨테이너에서 `text-base` 로 body 크기를 되누르지 말 것 / next/font `subsets` 에 `korean` 을 넣으면 빌드가 막히고 `["latin"]` 으로도 한글은 다 내려옴 / `pnpm add` 는 `--store-dir ~/projects/.pnpm-store/v10` 필요 / 브라우저 캐시로 옛 HTML 을 측정할 수 있음
- 별건 미수정: `/insight/statistics-ai` 인용문의 `**…**` 가 별표째 렌더됨(콘텐츠 마크다운 문제, 이번 변경과 무관)
