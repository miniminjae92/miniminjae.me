import { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site-metadata";
import { getAllPostsDesc } from "@/lib/posts";
import { getAllProjectsDesc } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsDesc();
  const projects = getAllProjectsDesc();

  const routes = [
    "",
    "/about",
    "/portfolio",
    "/insight",
    "/memo",
    "/log",
    "/tags",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}${post.permalink}`,
    lastModified: new Date(post.date).toISOString().split("T")[0],
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}${project.permalink}`,
    // 진행 중이면 시작일이 아니라 오늘을 쓴다. 갱신되는 문서이기 때문이다.
    lastModified: new Date(project.endDate ?? Date.now())
      .toISOString()
      .split("T")[0],
  }));

  return [...routes, ...postRoutes, ...projectRoutes];
}
