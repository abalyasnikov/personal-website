#!/usr/bin/env node
// Checks the static export the way a crawler reads it: files on disk, no
// browser and no server. `npm run audit` covers what a page looks like;
// this covers what a machine is told about it.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const OUT_DIRECTORY = path.join(process.cwd(), "out");
const POSTS_DIRECTORY = path.join(process.cwd(), "content", "writing");
const SITE_URL = "https://balyasnikov.com";
// Google truncates around these lengths. Over them is a warning, never a failure.
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const problems = [];
const warnings = [];

function fail(message) {
  problems.push(message);
}

function warn(message) {
  warnings.push(message);
}

/** Mirrors getPublishedPosts in lib/posts.ts: a draft produces no route. */
function readPublishedSlugs() {
  return fs.readdirSync(POSTS_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => {
      const { data } = matter(fs.readFileSync(path.join(POSTS_DIRECTORY, fileName), "utf8"));
      return String(data.status ?? "draft").toLowerCase() === "published";
    })
    .map((fileName) => fileName.slice(0, -3));
}

function readExport(relativePath) {
  const filePath = path.join(OUT_DIRECTORY, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`out/${relativePath} is missing`);
    return undefined;
  }
  return fs.readFileSync(filePath, "utf8");
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1];
}

/** Only real script tags match; the RSC payload copy carries escaped quotes. */
function readSchemaNodes(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function checkPageMetadata(html, route, expectedCanonical) {
  const canonical = firstMatch(html, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== expectedCanonical) {
    fail(`${route} expected canonical ${expectedCanonical}, received ${canonical ?? "none"}`);
  }

  const title = firstMatch(html, /<title>([^<]*)<\/title>/);
  if (!title) fail(`${route} has no title`);
  else if (title.length > TITLE_LIMIT) warn(`${route} title is ${title.length} characters`);

  const description = firstMatch(html, /<meta name="description" content="([^"]*)"/);
  if (!description) fail(`${route} has no meta description`);
  else if (description.length > DESCRIPTION_LIMIT) {
    warn(`${route} description is ${description.length} characters`);
  }

  const image = firstMatch(html, /<meta property="og:image" content="([^"]+)"/);
  if (!image) fail(`${route} has no og:image`);
  else assertExportedAsset(image, route);
}

function assertExportedAsset(url, route) {
  if (!url.startsWith(SITE_URL)) {
    fail(`${route} og:image ${url} is not on ${SITE_URL}`);
    return;
  }
  const assetPath = url.slice(SITE_URL.length);
  if (!fs.existsSync(path.join(OUT_DIRECTORY, assetPath))) {
    fail(`${route} og:image points at out${assetPath}, which was not exported`);
  }
}

function checkPersonNode(html, route) {
  const person = readSchemaNodes(html).find((node) => node["@type"] === "Person");
  if (!person) {
    fail(`${route} carries no Person schema`);
    return;
  }
  for (const field of ["@id", "name", "url", "jobTitle", "description", "knowsAbout", "sameAs"]) {
    if (!person[field]) fail(`${route} Person schema has no ${field}`);
  }
}

function checkPostNode(html, route, slug) {
  const nodes = readSchemaNodes(html);
  const post = nodes.find((node) => node["@type"] === "BlogPosting");
  if (!post) {
    fail(`${route} carries no BlogPosting schema`);
    return;
  }
  for (const field of ["headline", "description", "image", "datePublished", "author"]) {
    if (!post[field]) fail(`${route} BlogPosting schema has no ${field}`);
  }
  if (post["@id"] !== `${SITE_URL}/writing/${slug}#post`) {
    fail(`${route} BlogPosting @id is ${post["@id"]}`);
  }
  const person = nodes.find((node) => node["@type"] === "Person");
  if (person && post.author?.["@id"] !== person["@id"]) {
    fail(`${route} BlogPosting author does not resolve to the Person node on the page`);
  }
}

function checkPages(slugs) {
  const home = readExport("index.html");
  if (home) {
    checkPageMetadata(home, "/", SITE_URL);
    checkPersonNode(home, "/");
  }

  const archive = readExport("writing.html");
  if (archive) checkPageMetadata(archive, "/writing", `${SITE_URL}/writing`);

  for (const slug of slugs) {
    const route = `/writing/${slug}`;
    const html = readExport(`writing/${slug}.html`);
    if (!html) continue;
    checkPageMetadata(html, route, `${SITE_URL}${route}`);
    checkPersonNode(html, route);
    checkPostNode(html, route, slug);
  }
}

function checkMachineSurfaces(slugs) {
  const expectedUrls = ["/", "/writing", ...slugs.map((slug) => `/writing/${slug}`)]
    .map((route) => (route === "/" ? SITE_URL : `${SITE_URL}${route}`));

  const surfaces = [
    ["sitemap.xml", readExport("sitemap.xml")],
    ["feed.xml", readExport("feed.xml")],
    ["llms.txt", readExport("llms.txt")],
  ];

  for (const [name, content] of surfaces) {
    if (!content) continue;
    // The feed lists posts only; the home and archive URLs are its channel link.
    const required = name === "feed.xml"
      ? expectedUrls.filter((url) => url.includes("/writing/"))
      : expectedUrls;
    for (const url of required) {
      if (!content.includes(url)) fail(`out/${name} does not list ${url}`);
    }
  }

  const robots = readExport("robots.txt");
  if (robots && !robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    fail("out/robots.txt does not point at the sitemap");
  }
}

if (!fs.existsSync(OUT_DIRECTORY)) {
  console.error("\nout/ is missing. Run npm run build first.\n");
  process.exit(1);
}

const slugs = readPublishedSlugs();
checkPages(slugs);
checkMachineSurfaces(slugs);

console.log(`seo ${slugs.length + 2} routes checked in out/`);
for (const warning of warnings) console.log(`  warn  ${warning}`);
for (const problem of problems) console.error(`  fail  ${problem}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s)\n`);
  process.exit(1);
}

console.log(warnings.length ? `\n${warnings.length} warning(s), no problems\n` : "\nno problems\n");
