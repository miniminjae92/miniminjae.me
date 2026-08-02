import type { Metadata } from "next";

export const SITE_URL = "https://minjae-log.vercel.app";
export const SITE_NAME = "minjae.log";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "호기심으로 본질을 탐구하고, 복잡함을 단순하게 정돈합니다. 개발자 강민재의 기록을 담는 공간입니다.",
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
    description: "개발 지식을 정리하고 일상을 기록하는 공간입니다.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
