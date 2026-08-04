import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "writing");

export type PostStatus = "draft" | "published";

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  status: PostStatus;
  date?: string;
  order?: number;
};

export type Post = PostSummary & {
  content: string;
};

function describeValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function readRawDate(source: string): string | undefined {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (frontmatter === undefined) return undefined;
  const match = frontmatter.match(/^date:\s*(.*?)\s*$/m);
  if (!match) return undefined;
  const rawValue = match[1];
  if (rawValue === undefined) return undefined;
  const value = rawValue.trim();
  const isQuoted = value.length >= 2 && (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  );
  return isQuoted ? value.slice(1, -1) : value;
}

function normalizePostDate(rawValue: string | undefined, parsedValue: unknown, location: string): string | undefined {
  if (rawValue === undefined && parsedValue === undefined) return undefined;

  if (rawValue && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const parsed = new Date(`${rawValue}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === rawValue) {
      return rawValue;
    }
  }

  throw new Error(`${location} expected date as a real YYYY-MM-DD value, received ${describeValue(rawValue ?? parsedValue)}`);
}

function normalizePostOrder(value: unknown, filePath: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error(`${filePath} expected order as a finite number, received ${describeValue(value)}`);
}

function readPostFile(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  if (typeof data.title !== "string" || typeof data.description !== "string") {
    throw new Error(`${filePath} must define string title and description fields`);
  }

  const normalizedStatus = String(data.status ?? "draft").toLowerCase();
  if (normalizedStatus !== "draft" && normalizedStatus !== "published") {
    throw new Error(
      `${filePath} expected status as draft or published, received ${describeValue(data.status)}`,
    );
  }

  return {
    slug,
    title: data.title,
    description: data.description,
    status: normalizedStatus,
    date: normalizePostDate(readRawDate(source), data.date, filePath),
    order: normalizePostOrder(data.order, filePath),
    content,
  };
}

/**
 * Every post on disk, drafts included. Use this only where drafts are wanted,
 * such as local previews. Anything that ships to visitors takes
 * `getPublishedPosts` instead.
 */
export function getAllPosts(): PostSummary[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => readPostFile(fileName.slice(0, -3)))
    .sort((a, b) => {
      const orderDelta = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      if (orderDelta !== 0) return orderDelta;

      return (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug);
    })
    .map(({ content: _content, ...post }) => post);
}

/**
 * Posts marked `published`. This is what the home page, the writing index, the
 * static routes and the sitemap are built from, so a `draft` file never reaches
 * the export: no listing, no route, no sitemap entry. Drafts still render under
 * `next dev`, which is how they get previewed.
 */
export function getPublishedPosts(): PostSummary[] {
  return getAllPosts().filter((post) => post.status === "published");
}

export function getPost(slug: string): Post | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;

  const filePath = path.join(postsDirectory, `${slug}.md`);
  return fs.existsSync(filePath) ? readPostFile(slug) : undefined;
}

export function formatPostDate(date: string): string {
  const normalizedDate = normalizePostDate(date, date, "formatPostDate input");
  if (!normalizedDate) {
    throw new Error("formatPostDate input expected date as YYYY-MM-DD, received undefined");
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${normalizedDate}T00:00:00Z`));
}
