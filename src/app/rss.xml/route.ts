import { siteMetadata } from "@/config/site-metadata";
import { getAllPostsDesc } from "@/lib/posts";

export async function GET() {
  const siteUrl =
    siteMetadata.metadataBase?.toString() || "https://miniminjae.vercel.app";
  const posts = getAllPostsDesc();

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${
      (siteMetadata.title as any)?.default || siteMetadata.title || "minjae.log"
    }</title>
    <link>${siteUrl}</link>
    <description>${siteMetadata.description}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${post.permalink}</link>
      <guid isPermaLink="true">${siteUrl}${post.permalink}</guid>
      <description><![CDATA[${post.description || ""}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
