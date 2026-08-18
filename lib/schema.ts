import type { PostSummary } from "@/lib/posts";
import { AUTHOR_PROFILES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * One stable node id for the person, emitted by the layout on every page. Posts
 * point their author and publisher at it instead of restating the identity, so
 * a crawler reading any page resolves both to the same entity.
 */
const PERSON_ID = `${SITE_URL}/#person`;

/** Subjects the work and building sections already cover. Nothing beyond them. */
const KNOWS_ABOUT = [
  "Product management",
  "Consumer fintech",
  "Crypto wallets",
  "Developer platforms",
  "AI coding agents",
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/profile.webp`,
  jobTitle: "Product Lead",
  description: SITE_DESCRIPTION,
  knowsAbout: KNOWS_ABOUT,
  sameAs: AUTHOR_PROFILES,
};

export function buildPostSchema(post: PostSummary, imagePath: string) {
  const url = `${SITE_URL}/writing/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${imagePath}`,
    inLanguage: "en-US",
    // Only a real frontmatter date is published, matching the sitemap rule.
    ...(post.date ? { datePublished: post.date } : {}),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}
