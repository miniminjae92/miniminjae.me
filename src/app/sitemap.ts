import { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site-metadata";
import { getAllPostsDesc } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsDesc();

  const routes = ["", "/about", "/insight", "/memo", "/log"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}${post.permalink}`,
    lastModified: new Date(post.date).toISOString().split("T")[0],
  }));

  return [...routes, ...postRoutes];
}
