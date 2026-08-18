/**
 * The facts every machine-facing surface has to agree on. The URL alone was
 * already repeated in the layout, the sitemap and robots; the feed, llms.txt
 * and the schema graph would have repeated it three more times.
 */
export const SITE_URL = "https://balyasnikov.com";
export const SITE_NAME = "Andrey Balyasnikov";
export const SITE_TITLE = "Andrey Balyasnikov — Product Lead";
export const SITE_DESCRIPTION =
  "Product lead building consumer products and developer platforms across fintech and crypto.";
/** The writing archive's own line, shared by its page metadata and the feed. */
export const WRITING_DESCRIPTION =
  "Notes on products, infrastructure and applied machine learning.";

/**
 * Profiles that describe the same person elsewhere. Search engines and answer
 * engines read this as one identity, so a profile belongs here only while it
 * links back to this site.
 */
export const AUTHOR_PROFILES = [
  "https://www.linkedin.com/in/abalyasnikov",
  "https://github.com/abalyasnikov",
  "https://x.com/A_Balyasnikov",
  "https://t.me/abalyasnikov",
];
