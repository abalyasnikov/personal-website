import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

type ArticleChromeProps = {
  path?: string;
  backHref?: string;
  backLabel?: string;
};

export function ArticleChrome({ path, backHref = "/writing", backLabel = "all writings" }: ArticleChromeProps) {
  return (
    <header className="topline article-topline">
      <nav className="article-nav" aria-label="Writing navigation">
        <Link href={backHref}>← {backLabel}</Link>
        {/* The archive already states its own name in the h1 directly below, so
            a breadcrumb there would print the same word twice. Only an article
            needs the trail, to say which section it sits in. */}
        {path ? <span>writing / {path}</span> : null}
      </nav>
      <SiteChrome />
    </header>
  );
}
