import type { Metadata } from "next";
import "./globals.css";
import { HomeCursor } from "@/components/home-cursor";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://minjae-log.vercel.app"),
  title: {
    default: "minjae.log",
    template: "%s | minjae.log",
  },
  description: "개발 지식을 정리하고 일상을 기록하는 공간입니다.",
  openGraph: {
    title: "minjae.log",
    description: "백엔드 개발자의 Insight & Memo 저장소",
    url: "https://minjae-log.vercel.app",
    siteName: "minjae.log",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "minjae.log preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "minjae.log",
    description: "개발 지식을 정리하고 일상을 기록하는 공간입니다.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <HomeCursor />
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
