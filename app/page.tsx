import Image from "next/image";
import Link from "next/link";
import { EvalTerminal } from "@/components/EvalTerminal";
import { SiteChrome } from "@/components/SiteChrome";
import { WritingList } from "@/components/WritingList";
import features from "@/config/features.json";
import { building, investing, work } from "@/content/site";
import { getPublishedPosts } from "@/lib/posts";

const nav = [
  "who",
  "work",
  "building",
  ...(features.showWritingOnHome ? ["writing"] : []),
  "investing",
  "contact",
];

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
  const posts = features.showWritingOnHome ? getPublishedPosts() : [];
  const investingNumber = features.showWritingOnHome ? "05" : "04";
  const contactNumber = features.showWritingOnHome ? "06" : "05";

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
            <p>Product lead building consumer products and developer platforms across fintech and crypto.</p>
          </div>
        </div>

        <EvalTerminal />
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
                <div>
                  <h3>
                    {entry.href ? (
                      <a href={entry.href} target="_blank" rel="noreferrer">{entry.name}</a>
                    ) : (
                      entry.name
                    )}
                  </h3>
                  <p>{entry.role}</p>
                </div>
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
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {features.showWritingOnHome ? (
        <Section number="04" id="writing" title="writing">
          <WritingList posts={posts.slice(0, 3)} />
          <Link className="writing-all-link" href="/writing">read all →</Link>
        </Section>
      ) : null}

      <Section number={investingNumber} id="investing" title="angel investing">
        <div className="plain-list">
          {investing.map((item) => (
            <div className="plain-row" key={item.name}>
              <h3>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer">{item.name}</a>
                ) : (
                  item.name
                )}
              </h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section number={contactNumber} id="contact" title="contact">
        <p className="lede">Currently looking for product leadership or senior hands-on roles.</p>
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
