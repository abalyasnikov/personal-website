import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "writing");

export type PostStatus = "Draft" | "Published";

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

function readPostFile(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  if (typeof data.title !== "string" || typeof data.description !== "string") {
    throw new Error(`${filePath} must define string title and description fields`);
  }

  const normalizedStatus = String(data.status ?? "draft").toLowerCase();
  if (normalizedStatus !== "draft" && normalizedStatus !== "published") {
    throw new Error(`${filePath} has an invalid status: ${String(data.status)}`);
  }

  return {
    slug,
    title: data.title,
    description: data.description,
    status: normalizedStatus === "published" ? "Published" : "Draft",
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : typeof data.date === "string" ? data.date : undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    content,
  };
}

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

export function getPost(slug: string): Post | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;

  const filePath = path.join(postsDirectory, `${slug}.md`);
  return fs.existsSync(filePath) ? readPostFile(slug) : undefined;
}

export function getPostLabel(post: PostSummary): string {
  if (post.status === "Draft" || !post.date) return post.status;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.date}T00:00:00Z`));
}
