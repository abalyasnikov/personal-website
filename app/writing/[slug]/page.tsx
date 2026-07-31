import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleChrome } from "@/components/ArticleChrome";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { getAllPosts, getPost, getPostLabel } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: `${post.title} — Andrey Balyasnikov`,
    description: post.description,
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
        <header className="post-header">
          <p className="post-status">{getPostLabel(post)}</p>
          <h1>{post.title}</h1>
          <p className="post-dek">{post.description}</p>
        </header>

        <div className="post-body markdown-content">
          <MarkdownArticle content={post.content} />
        </div>

        <footer className="post-footer">
          <Link href="/#writing">← back to writing</Link>
          <a href="#top">back to top ↑</a>
        </footer>
      </article>
    </main>
  );
}
