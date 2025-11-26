import { Metadata } from "next";
import { siteMetadata } from "@/config/site-metadata";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";
import { HomeCursor } from "@/components/effects/home-cursor";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = siteMetadata;

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
          <PageShell>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </PageShell>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
