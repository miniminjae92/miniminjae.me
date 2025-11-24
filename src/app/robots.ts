import { MetadataRoute } from "next";
import { siteMetadata } from "@/config/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    siteMetadata.metadataBase?.toString() || "https://miniminjae.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
