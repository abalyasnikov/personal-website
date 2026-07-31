import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function textContent(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textContent).join("");
  if (value && typeof value === "object" && "props" in value) {
    return textContent((value as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

function headingId(children: React.ReactNode): string {
  return textContent(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MarkdownArticle({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
        h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
        a: ({ href = "", children, ...props }) => {
          if (href.startsWith("/")) {
            return <Link href={href}>{children}</Link>;
          }

          return <a href={href} rel="noreferrer" {...props}>{children}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
