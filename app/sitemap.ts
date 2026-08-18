import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Drafts are absent from getPublishedPosts, so they never reach the sitemap.
  const posts = getPublishedPosts().map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    // Only real frontmatter dates are published; a build date would be a lie.
    ...(post.date ? { lastModified: new Date(`${post.date}T00:00:00Z`) } : {}),
  }));

  return [{ url: SITE_URL }, { url: `${SITE_URL}/writing` }, ...posts];
}
