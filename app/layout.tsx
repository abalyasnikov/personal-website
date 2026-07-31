import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/tokens.css";
import "./globals.css";

const siteUrl = "https://balyasnikov.com";
const siteTitle = "Andrey Balyasnikov — Product Lead";
const siteDescription =
  "Product lead building consumer products and developer platforms across fintech and crypto.";
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Andrey Balyasnikov",
  url: siteUrl,
  image: `${siteUrl}/profile.webp`,
  jobTitle: "Product Lead",
  sameAs: [
    "https://www.linkedin.com/in/abalyasnikov",
    "https://github.com/abalyasnikov",
    "https://x.com/A_Balyasnikov",
    "https://t.me/abalyasnikov",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Andrey Balyasnikov",
    title: siteTitle,
    description: cardDescription,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Andrey Balyasnikov — product lead" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script defer data-domain="balyasnikov.com" src="https://plausible.io/js/script.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
