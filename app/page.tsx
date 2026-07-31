import Image from "next/image";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { building, investing, work } from "@/content/site";
import { getAllPosts, getPostLabel } from "@/lib/posts";

const nav = ["who", "work", "building", "writing", "investing", "contact"];

const productEval = [
  ["frame", "where user value is blocked"],
  ["inspect", "concrete failed journeys"],
  ["define", "“better” as an eval"],
  ["build", "the smallest end‑to‑end intervention"],
  ["measure", "behavior against baseline"],
  ["learn", "update the product thesis"],
  ["decide", "ship · scale · kill"],
] as const;

function Section({ number, id, title, children }: { number: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="reference-section" aria-labelledby={`${id}-title`}>
      <div className="section-title">
        <span>{number}</span>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="site-shell" id="top">
      <header className="topline">
        <nav className="header-nav" aria-label="Page sections">
          {nav.map((label) => (
            <a key={label} href={`#${label}`}>{label}</a>
          ))}
        </nav>
        <SiteChrome />
      </header>

      <section className="reference-hero" aria-labelledby="page-title">
        <div className="identity">
          <Image src="/profile.webp" width={384} height={384} priority alt="Portrait of Andrey Balyasnikov" />
          <div>
            <h1 id="page-title">andrey</h1>
            <p><span className="accent-word">Product lead</span> building consumer products and developer platforms across fintech and crypto.</p>
          </div>
        </div>

        <div className="terminal" aria-label="Product evaluation workflow">
          <div className="terminal-title">
            <span>andrey.run / product_eval</span>
            <strong><i aria-hidden="true" />active</strong>
          </div>
          <div className="terminal-body">
            <dl className="eval-list">
              {productEval.map(([label, description], index) => (
                <div
                  className={`eval-row${label === "learn" ? " eval-loop" : ""}`}
                  key={label}
                  style={{ "--eval-delay": `${index * 4}s` } as React.CSSProperties}
                >
                  <dt>{label}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Section number="01" id="who" title="who">
        <p className="lede">
          I build products from zero and scale what works. I’m most useful when the path is unclear, turning a rough direction into a product people use.
        </p>
      </Section>

      <Section number="02" id="work" title="work">
        <div className="stack-list work-stack">
          {work.map((entry) => (
            <article key={entry.name}>
              <header>
                <div><h3>{entry.name}</h3><p>{entry.role}</p></div>
                <span className="work-date">{entry.date}</span>
              </header>
              <div>{entry.body}</div>
            </article>
          ))}
        </div>
      </Section>

      <Section number="03" id="building" title="building">
        <div className="plain-list">
          {building.map((item) => (
            <div className="plain-row" key={item.name}>
              <div><h3>{item.name}</h3><span>{item.meta}</span></div>
              <p className={item.placeholder ? "placeholder" : undefined}>{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section number="04" id="writing" title="writing">
        <div className="writing-list">
          {posts.map((post) => (
            <Link href={`/writing/${post.slug}`} key={post.slug}>
              <span>{getPostLabel(post)}</span>
              <div><h3>{post.title}</h3><p>{post.description}</p></div>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </Section>

      <Section number="05" id="investing" title="angel investing">
        <div className="plain-list">
          {investing.map((item) => (
            <div className="plain-row" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section number="06" id="contact" title="contact">
        <p className="lede">Have a hard product problem?</p>
        <a className="email-link" href="mailto:andrew.balyasnikov@gmail.com">andrew.balyasnikov@gmail.com ↗</a>
        <a className="resume-link" href="/andrey-balyasnikov-resume.pdf" download>download résumé ↓</a>
        <div className="contact-links">
          <a href="https://www.linkedin.com/in/abalyasnikov">linkedin</a>
          <a href="https://github.com/abalyasnikov">github</a>
          <a href="https://x.com/A_Balyasnikov">x</a>
          <a href="https://t.me/abalyasnikov">telegram</a>
        </div>
      </Section>

      <footer className="reference-footer">
        <span>andrey balyasnikov</span>
        <a href="#top">back to top ↑</a>
      </footer>
    </main>
  );
}
