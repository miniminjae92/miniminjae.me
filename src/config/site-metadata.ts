import type { Metadata } from "next";

export const SITE_URL = "https://minjae-log.vercel.app";
export const SITE_NAME = "minjae.log";

/**
 * 정체성 상수. here.tsx 와 author-profile.tsx 에 각각 하드코딩돼 있던 것을
 * 한곳으로 모은다. /about 이 같은 값을 세 번째로 복제하지 않도록.
 */
export const PROFILE = {
  name: "강민재",
  nameEn: "Minjae Kang",
  email: "miniminjae92@gmail.com",
  github: "https://github.com/miniminjae92",
  linkedin: "https://www.linkedin.com/in/miniminjae92",
} as const;

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  // 이 도메인이 지원서에 붙이는 링크가 된다. 미리보기 카드는 블로그가 아니라
  // 사람을 소개해야 한다. src/content/about/index.mdx 의 headline 과 맞춘다.
  description:
    "복잡한 것을 이해하고, 다음 사람이 쓸 수 있는 모양으로 남깁니다. 백엔드 개발자 강민재의 자기소개와 기록.",
  authors: [{ name: "Minjae Kang" }],

  creator: "Minjae Kang",

  openGraph: {
    title: SITE_NAME,
    description:
      "호기심으로 본질을 묻고, 배운 가치를 세상에 기여하고 싶은 개발자의 기록.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "minjae.log - 호기심과 본질을 탐구하는 개발 블로그",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "복잡한 것을 이해하고, 다음 사람이 쓸 수 있는 모양으로 남깁니다.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
