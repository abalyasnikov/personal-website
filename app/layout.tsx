import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { personSchema } from "@/lib/schema";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "@/styles/tokens.css";
import "./globals.css";

// The share card carries its own line, so the image and the card text match.
const cardDescription = "Building consumer products and developer platforms in fintech and crypto.";

const themeScript = `(function () {
  try {
    var t = localStorage.getItem('site-theme');
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();`;

// Marks the pending terminal run before first paint, so the exported settled
// markup never flashes ahead of it. The run happens on every pageview; only
// visitors who prefer reduced motion land on the settled state directly.
const evalScript = `(function () {
  try {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('eval-replay');
    }
  } catch (e) {}
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} — writing` }] },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: cardDescription,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Andrey Balyasnikov — product lead" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: cardDescription,
    images: [{ url: "/og.png", alt: "Andrey Balyasnikov — product lead" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#191919" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: evalScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="859935e8-90f0-4422-8570-344edf288854"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
