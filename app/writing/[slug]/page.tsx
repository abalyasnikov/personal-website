import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleChrome } from "@/components/ArticleChrome";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { formatPostDate, getAllPosts, getPost, getPublishedPosts } from "@/lib/posts";
import { buildPostSchema } from "@/lib/schema";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_CARD_PATH = "/og.png";

/** A post shows its own cover when the article-image skill drew one. */
function postImagePath(slug: string): string {
  const coverPath = `/og/${slug}.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", coverPath)) ? coverPath : SITE_CARD_PATH;
}

export function generateStaticParams() {
  // Dev also renders drafts: the exported param list is the only set of slugs
  // Next will serve under `output: "export"`, even from the dev server.
  const posts = process.env.NODE_ENV === "development" ? getAllPosts() : getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  const title = `${post.title} — Andrey Balyasnikov`;
  const url = `/writing/${slug}`;
  const imagePath = postImagePath(slug);
  const image = {
    url: imagePath,
    width: 1200,
    height: 630,
    alt: imagePath === SITE_CARD_PATH
      ? "Andrey Balyasnikov — product lead"
      : `Cover illustration: ${post.title}`,
  };

  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: post.description,
      url,
      images: [image],
      // Only emitted when the post actually carries a date in its frontmatter.
      ...(post.date ? { publishedTime: post.date } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <main className="site-shell article-shell" id="top">
      <ArticleChrome path={post.slug} />

      <article className="post">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPostSchema(post, postImagePath(slug))) }}
        />

        <header className="post-header">
          {post.date ? <time className="post-date" dateTime={post.date}>{formatPostDate(post.date)}</time> : null}
          <h1>{post.title}</h1>
          <p className="post-dek">{post.description}</p>
        </header>

        <div className="post-body markdown-content">
          <MarkdownArticle content={post.content} />
        </div>

        <footer className="post-footer">
          <Link href="/writing">← all writings</Link>
          <a href="#top">back to top ↑</a>
        </footer>
      </article>
    </main>
  );
}
