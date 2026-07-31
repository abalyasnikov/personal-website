import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export function ArticleChrome({ path }: { path: string }) {
  return (
    <header className="topline article-topline">
      <nav className="article-nav" aria-label="Article navigation">
        <Link href="/#writing">← home</Link>
        <span>writing / {path}</span>
      </nav>
      <SiteChrome />
    </header>
  );
}
