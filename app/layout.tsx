import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/caveat";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andrey Balyasnikov — Product Lead",
  description: "Product lead building consumer products and developer platforms across fintech and crypto.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
