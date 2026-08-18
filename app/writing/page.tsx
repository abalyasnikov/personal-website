import type { Metadata } from "next";
import { ArticleChrome } from "@/components/ArticleChrome";
import { WritingList } from "@/components/WritingList";
import features from "@/config/features.json";
import { getPublishedPosts } from "@/lib/posts";
import { WRITING_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing — Andrey Balyasnikov",
  description: WRITING_DESCRIPTION,
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getPublishedPosts();

  return (
    <main className="site-shell article-shell" id="top">
      <ArticleChrome backHref={features.showWritingOnHome ? "/#writing" : "/"} backLabel="back" />

      <section className="writing-index" aria-labelledby="writing-title">
        <h1 id="writing-title">writing</h1>
        <WritingList posts={posts} />
      </section>
    </main>
  );
}
