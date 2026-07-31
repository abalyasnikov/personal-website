import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Not found — Andrey Balyasnikov",
};

export default function NotFound() {
  return (
    <main className="site-shell article-shell" id="top">
      <header className="topline article-topline">
        <nav className="article-nav" aria-label="Site navigation">
          <Link href="/">← home</Link>
        </nav>
        <SiteChrome />
      </header>

      <section className="post-empty" aria-labelledby="not-found-title">
        <p>404</p>
        <h1 id="not-found-title">This page does not exist.</h1>
        <Link href="/">← back home</Link>
      </section>
    </main>
  );
}
