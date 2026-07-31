import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DESKTOP_WIDTH } from "./constants.mjs";
import { openPage } from "./lib.mjs";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "writing");
const FEATURES_PATH = path.join(process.cwd(), "config", "features.json");
const HOME_POST_LIMIT = 3;

function readFeatures() {
  const value = JSON.parse(fs.readFileSync(FEATURES_PATH, "utf8"));
  if (typeof value.showWritingOnHome !== "boolean") {
    throw new Error(`${FEATURES_PATH} expected boolean showWritingOnHome, received ${JSON.stringify(value.showWritingOnHome)}`);
  }
  return value;
}

function readExpectedPosts() {
  return fs.readdirSync(POSTS_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(POSTS_DIRECTORY, fileName);
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      const date = data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : typeof data.date === "string" ? data.date : "";
      const order = typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER;
      return { path: `/writing/${fileName.slice(0, -3)}`, date, order };
    })
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date) || a.path.localeCompare(b.path));
}

function assertPaths(actual, expected, location) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) return;
  throw new Error(
    `${location} expected links ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
  );
}

async function readNavigation(browser, route) {
  const { context, page } = await openPage(browser, { width: DESKTOP_WIDTH, theme: "light", path: route });
  const navigation = await page.evaluate(() => ({
    postRoutes: [...document.querySelectorAll('a[href^="/writing/"]')]
      .map((link) => new URL(link.href).pathname),
    links: [...document.querySelectorAll("a")].map((link) => ({
      href: link.getAttribute("href"),
      text: (link.textContent || "").trim(),
    })),
  }));
  await context.close();
  return navigation;
}

function assertLink(links, href, text, location) {
  if (links.some((link) => link.href === href && link.text === text)) return;
  throw new Error(`${location} expected link ${JSON.stringify({ href, text })}, received ${JSON.stringify(links)}`);
}

function assertNoLink(links, href, location) {
  const received = links.filter((link) => link.href === href);
  if (!received.length) return;
  throw new Error(`${location} expected no ${href} link, received ${JSON.stringify(received)}`);
}

export async function discoverRoutes(browser) {
  const features = readFeatures();
  const posts = readExpectedPosts();
  const postRoutes = posts.map((post) => post.path);
  const home = await readNavigation(browser, "/");
  const archive = await readNavigation(browser, "/writing");

  const expectedHomePosts = features.showWritingOnHome ? postRoutes.slice(0, HOME_POST_LIMIT) : [];
  assertPaths(home.postRoutes, expectedHomePosts, "home writing preview");
  assertPaths(archive.postRoutes, postRoutes, "writing archive");
  if (features.showWritingOnHome) {
    assertLink(home.links, "/writing", "read all →", "home writing navigation");
  } else {
    assertNoLink(home.links, "#writing", "home section navigation");
    assertNoLink(home.links, "/writing", "home writing navigation");
  }
  const archiveBackHref = features.showWritingOnHome ? "/#writing" : "/";
  assertLink(archive.links, archiveBackHref, "← back", "writing archive navigation");

  for (const route of postRoutes) {
    const article = await readNavigation(browser, route);
    assertLink(article.links, "/writing", "← all writings", `${route} navigation`);
  }

  return [
    { name: "home", path: "/" },
    { name: "/writing", path: "/writing" },
    ...postRoutes.map((route) => ({ name: route, path: route })),
  ];
}
