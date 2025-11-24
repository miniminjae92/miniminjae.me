import { MetadataRoute } from "next";
import { siteMetadata } from "@/config/site-metadata";
import { getAllPostsDesc } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    siteMetadata.metadataBase?.toString() || "https://miniminjae.vercel.app";
  const posts = getAllPostsDesc();

  const routes = ["", "/insight", "/memo", "/log"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}${post.permalink}`,
    lastModified: new Date(post.date).toISOString().split("T")[0],
  }));

  return [...routes, ...postRoutes];
}
