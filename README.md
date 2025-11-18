# 🚀 My Tech Blog v2

Next.js와 Velite를 활용하여 구축한 개인 기술 블로그입니다.
**Insight(깊은 통찰)**와 **Memo(가벼운 기록)**를 분리하여 관리하며, MDX를 통해 유연한 콘텐츠 작성이 가능합니다.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Velite](https://img.shields.io/badge/Velite-Type--Safe-yellow?style=for-the-badge)

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Content Engine**: [Velite](https://velite.js.org/) (Type-safe MDX)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Image Optimization**: sharp (Custom Script)

## 📂 Project Structure

```bash
.
├── scripts/             # 유지보수용 스크립트 (이미지 압축 등)
├── src/
│   ├── app/             # Next.js App Router 페이지
│   ├── components/      # UI 컴포넌트
│   └── content/         # 블로그 포스트 원본 (MDX)
│       ├── insight/     # 기술적 통찰, 긴 글 (Page Bundle 구조)
│       └── memo/        # 짧은 메모, TIL (Page Bundle 구조)
└── velite.config.ts     # 콘텐츠 스키마 및 Velite 설정

```

## 🏃‍♂️ Getting Started

이 프로젝트는 pnpm을 패키지 매니저로 사용합니다.

### 1. 설치

```Bash
pnpm install
```

### 2. 개발 서버 실행

```Bash
pnpm dev
```

실행 후 [http://localhost:3000](http://localhost:3000)에서 확인 가능합니다.

## ✍️ Writing Content

모든 콘텐츠는 `src/content` 디렉토리 내에 **폴더 단위(Page Bundle)**로 작성합니다. 이미지와 MDX 파일을 같은 폴더에 두어 관리 효율성을 높입니다.

**폴더 구조 규칙**

```Plaintext

src/content/insight/
└── my-new-post/        <-- 슬러그(URL)가 될 폴더명
    ├── index.mdx       <-- 본문 파일명은 항상 index.mdx
    ├── thumbnail.png   <-- 관련 이미지
    └── architecture.svg
```

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

## 🖼️ Image Optimization

레포지토리 용량 관리와 성능 최적화를 위해 `sharp` 기반의 커스텀 스크립트를 사용합니다. 글 작성을 마치고 커밋하기 전에 아래 명령어를 실행하면 `src/content` 내의 이미지들이 자동으로 압축(Overwrite)됩니다.

```Bash
# 이미지 최적화 실행
npm run compress

# 최적화된 이미지와 글 커밋
git add .
git commit -m "feat: add new post with optimized images"
```

## 📝 License

This project is licensed under the MIT License.
