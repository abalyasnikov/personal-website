import Link from "next/link";
import { ArticleChrome } from "@/components/ArticleChrome";

export default function PostNotFound() {
  return (
    <main className="site-shell article-shell" id="top">
      <ArticleChrome path="not-found" />
      <section className="post-empty" aria-labelledby="not-found-title">
        <p>404</p>
        <h1 id="not-found-title">This post does not exist.</h1>
        <Link href="/writing">← all writings</Link>
      </section>
    </main>
  );
}
