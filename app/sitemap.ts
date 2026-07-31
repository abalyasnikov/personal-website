import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const siteUrl = "https://balyasnikov.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    // Only real frontmatter dates are published; a build date would be a lie.
    ...(post.date ? { lastModified: new Date(`${post.date}T00:00:00Z`) } : {}),
  }));

  return [{ url: siteUrl }, { url: `${siteUrl}/writing` }, ...posts];
}
