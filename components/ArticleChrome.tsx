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
        <span>{path ? `writing / ${path}` : "writing"}</span>
      </nav>
      <SiteChrome />
    </header>
  );
}
