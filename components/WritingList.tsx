import Link from "next/link";
import { formatPostDate, type PostSummary } from "@/lib/posts";

export function WritingList({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="writing-list">
      {posts.map((post) => (
        <Link href={`/writing/${post.slug}`} key={post.slug}>
          <div>
            {post.date ? <time dateTime={post.date}>{formatPostDate(post.date)}</time> : null}
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </div>
          <b aria-hidden="true">→</b>
        </Link>
      ))}
    </div>
  );
}
