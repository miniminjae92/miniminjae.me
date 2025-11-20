import type { Metadata } from "next";
import "./globals.css";
import { HomeCursor } from "@/components/home-cursor";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeProvider } from "next-themes";

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
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-page text-body page-shell">
        <ThemeProvider attribute="class" defaultTheme="system">
          <HomeCursor />

          <div className="min-h-screen">
            <div className="flex min-h-screen flex-col pt-[var(--page-top)]">
              <div className="relative">
                <SiteHeader />
              </div>

              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
