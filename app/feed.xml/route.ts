import { getPublishedPosts, type PostSummary } from "@/lib/posts";
import { SITE_NAME, SITE_URL, WRITING_DESCRIPTION } from "@/lib/site";

export const dynamic = "force-static";

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => XML_ESCAPES[character] ?? character);
}

function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function renderItem(post: PostSummary): string {
  const url = `${SITE_URL}/writing/${post.slug}`;

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    ...(post.date ? [`      <pubDate>${toRfc822(post.date)}</pubDate>`] : []),
    `      <description>${escapeXml(post.description)}</description>`,
    "    </item>",
  ].join("\n");
}

export function GET(): Response {
  const posts = getPublishedPosts();
  // The newest post date rather than the build time: rebuilding is not publishing,
  // and a moving timestamp would make every export differ from the last.
  const latestDate = posts.flatMap((post) => (post.date ? [post.date] : [])).sort().at(-1);

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${SITE_NAME} — writing`)}</title>`,
    `    <link>${SITE_URL}/writing</link>`,
    `    <description>${escapeXml(WRITING_DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`,
    ...(latestDate ? [`    <lastBuildDate>${toRfc822(latestDate)}</lastBuildDate>`] : []),
    ...posts.map(renderItem),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(feed, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
