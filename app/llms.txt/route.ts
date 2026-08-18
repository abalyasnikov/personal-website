import { getPublishedPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, WRITING_DESCRIPTION } from "@/lib/site";

export const dynamic = "force-static";

const RESUME_PATH = "/andrey-balyasnikov-resume.pdf";

export function GET(): Response {
  const posts = getPublishedPosts().map(
    (post) => `- [${post.title}](${SITE_URL}/writing/${post.slug}): ${post.description}`,
  );

  // The llms.txt convention: one H1, a blockquote summary, then link sections.
  // Every line here restates something the site already says in HTML.
  const document = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}): ${SITE_DESCRIPTION}`,
    `- [Writing](${SITE_URL}/writing): ${WRITING_DESCRIPTION}`,
    `- [Résumé](${SITE_URL}${RESUME_PATH}): PDF.`,
    "",
    "## Writing",
    "",
    ...posts,
    "",
  ].join("\n");

  return new Response(document, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
