# 🚀 minjae.log

개발 지식을 정리하고 일상을 기록하는 개인 기술 블로그입니다.
**Insight(깊은 통찰)**, **Memo(가벼운 기록)**, **Log(회고)**로 나누어 콘텐츠를 관리하며, Next.js 16과 Velite를 활용한 현대적인 아키텍처로 구축되었습니다.

![Next JS](https://img.shields.io/badge/Next-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Key Features

- **Framework**: Next.js 16 (App Router) & React 19
- **Content Engine**: [Velite](https://velite.js.org/)를 활용한 Type-safe MDX 파이프라인
- **Styling**: Tailwind CSS v4 & 다크 모드 지원 (`next-themes`)
- **Interactivity**:
  - 유동적인 커서 인터랙션 (`splash-cursor`)
  - 실시간 시계 및 태그 필터링 시스템
- **Optimization**:
  - `sharp`를 활용한 로컬 이미지 자동 압축 스크립트
  - 시멘틱 태그를 활용한 SEO 구조
- **Communication**: Giscus를 이용한 GitHub 기반 댓글 시스템

## 📂 Project Structure

```bash
.
├── scripts/             # 유지보수용 스크립트 (이미지 압축 등)
├── src/
│   ├── app/             # Next.js App Router 페이지 (Insight, Memo, Log)
│   ├── components/      # UI 컴포넌트 (공통, 레이아웃, MDX 요소)
│   ├── content/         # 블로그 포스트 원본 (MDX + Images)
│   │   ├── insight/     # 기술적 통찰, 긴 글
│   │   ├── memo/        # 짧은 메모, TIL, 스니펫
│   │   └── log/         # 회고 및 개발 일지
│   └── lib/             # 유틸리티 함수 (포스트 정렬, 태그 처리 등)
└── velite.config.ts     # 콘텐츠 스키마 및 Velite 설정
```

## 🏃‍♂️ Getting Started

이 프로젝트는 pnpm을 패키지 매니저로 사용합니다.

### 1. 설치

```Bash
pnpm install
```

### 2. 환경 변수 설정 (.env.local)

Giscus 댓글 기능을 사용하려면 아래 변수 설정이 필요합니다.

```Bash
NEXT_PUBLIC_GISCUS_REPO=your/repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

### 3. 개발 서버 실행

Velite가 콘텐츠를 컴파일하고 Next.js 개발 서버를 실행합니다.

```Bash
pnpm dev
```

브라우저에서 <http://localhost:3000>을 열어 확인하세요.

## ✍️ Workflow

1. 콘텐츠 작성 src/content/{category}/{slug}/index.mdx 경로에 글을 작성합니다.

**Frontmatter 예시 (`index.mdx`)**

**Insight (깊은 글)**

```YAML

---
title: "Next.js 14 아키텍처 분석"
slug: nextjs-architecture
date: 2025-11-18
description: "App Router의 동작 원리를 깊게 파헤쳐봅니다."
tags: ["nextjs", "react", "architecture"]
---
```

**Memo (가벼운 메모)**

```YAML
---
title: "오늘의 Git 명령어 팁"
slug: git-tips-2025
date: 2025-11-18
tags: ["git", "til"]
---
```

2. 🖼️ Image Optimization

레포지토리 용량 관리와 성능 최적화를 위해 `sharp` 기반의 커스텀 스크립트를 사용합니다. 글 작성을 마치고 커밋하기 전에 아래 명령어를 실행하면 `src/content` 내의 이미지들이 자동으로 압축(Overwrite)됩니다.

```Bash
pnpm compress
```

## 👏 Credits & Inspiration

이 블로그는 훌륭한 오픈소스 프로젝트와 블로그들로부터 많은 영감을 받아 제작되었습니다. 구조와 디자인에 대해 큰 영향을 준 원본 프로젝트들에 깊은 감사를 표합니다.

#### Design & Structure Inspiration: **bepyan.me**

블로그의 전반적인 디자인을 적극적으로 참고하여 재구성했습니다.

#### Template Reference: dalelarroder/dalelarroder

Next.js 블로그의 초기 세팅과 기술적 구현 방식에 대해 참고했습니다.

### 제작 시 도움된 사이트

- <https://tailwindcss.com/>
- <https://react-icons.github.io/react-icons/>

## 📝 License

This project is licensed under the MIT License.
