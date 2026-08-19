import { Metadata } from "next";
import { Gowun_Batang } from "next/font/google";
import { siteMetadata } from "@/config/site-metadata";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";
import { CursorFx } from "@/components/effects/cursor-fx";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { getPostSummaries } from "@/lib/posts";

export const metadata: Metadata = siteMetadata;

/**
 * 고운바탕 400 + 700.
 *
 * 700 이 이 선언의 목적이다. 예전에는 Regular 한 벌만 받아서, 제목·강조처럼
 * 굵게 쓰는 자리마다 브라우저가 획을 부풀리는 합성 볼드가 걸렸다. 한글
 * 세리프의 가는 획에서 그 손상이 특히 크다.
 *
 * subsets 에 "korean" 을 넣을 수 없다 — next/font 의 이 서체 메타데이터에는
 * latin/latin-ext/vietnamese 만 등재돼 있어 빌드가 막힌다. 한글 자소는
 * subsets 와 무관하게 내려받는다(구글 CSS 의 모든 unicode-range 조각을
 * 받아 자체 호스팅한다). subsets 는 어느 조각을 preload 할지만 고른다.
 */
const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gowun",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* antialiased 를 뺐다. macOS 에서 이 옵션은 서브픽셀 렌더링을
       그레이스케일로 바꿔 글자를 더 얇게 만드는데, 고운바탕은 이 사이트에서
       가장 획이 가는 서체다. 가장 가는 서체에 가장 얇아지는 옵션이 걸려
       있었다. globals.css 의 body 규칙에도 같은 클래스가 있었으니 되돌릴
       때는 두 곳을 함께 되돌려야 한다. */
    <html lang="ko" className={gowunBatang.variable} suppressHydrationWarning>
      <body className="bg-page text-body">
        <ThemeProvider attribute="class" defaultTheme="system">
          <CursorFx />
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
