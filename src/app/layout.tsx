import { Metadata } from "next";
import { siteMetadata } from "@/config/site-metadata";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";
import { HomeCursor } from "@/components/effects/home-cursor";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { getPostSummaries } from "@/lib/posts";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-page text-body">
        <ThemeProvider attribute="class" defaultTheme="system">
          <HomeCursor />
          <a className="skip-link" href="#content">
            본문으로 건너뛰기
          </a>
          <PageShell>
            {/* 검색 인덱스를 서버에서 만들어 내려보낸다. 헤더가 클라이언트
                컴포넌트라 여기서 직접 import 하면 컴파일된 MDX 가 전부
                번들에 실린다(실측 544KB). */}
            <SiteHeader searchIndex={getPostSummaries()} />
            <main id="content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </PageShell>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
