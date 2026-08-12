export type WorkEntry = {
  name: string;
  role: string;
  date: string;
  body: React.ReactNode;
  href?: string;
};

export type IndexEntry = {
  name: string;
  description: string;
  meta?: string;
  href?: string;
};

export const work: WorkEntry[] = [
  {
    name: "Zerion",
    href: "https://zerion.io",
    role: "Founding Head of Product",
    date: "2018—2026",
    body: (
      <>
        First hire. Built a self-custodial crypto wallet from zero to <strong>1M+</strong> monthly active wallets, then productized the API we had built for ourselves into more than half of company revenue, with Coinbase, Kraken and Uniswap as clients. Most recently Zerion CLI, which lets AI agents read portfolios and execute swaps, bridges and signing across EVM and Solana, bounded by token policies.
      </>
    ),
  },
  {
    name: "Evotor",
    role: "Head of Product",
    date: "2016—2018",
    body: (
      <>
        Invited by QIWI&apos;s founder to build the company from scratch. Took the smart-POS app marketplace from nothing to <strong>$12M</strong> a month across 500K business customers.
      </>
    ),
  },
  {
    name: "QIWI",
    role: "PM → Senior PM",
    date: "2014—2016",
    body: (
      <>
        Relaunched the mobile apps for Russia&apos;s largest payment system, <strong>70M+</strong> monthly active users, and built cross-border payments with AliExpress, JD.com and eBay.
      </>
    ),
  },
];

export const building: IndexEntry[] = [
  {
    name: "Product OS",
    href: "https://github.com/abalyasnikov/product-os",
    meta: "Open source",
    description:
      "Product decision infrastructure for agentic teams. Customer evidence becomes bets, readable PRDs and measured outcomes, with the decision trail kept in Git.",
  },
  {
    name: "ML trading systems",
    meta: "Prediction markets / Solana",
    description: "Data pipelines, feature engineering, backtesting and live execution, run end to end.",
  },
  {
    name: "Personal AI assistant",
    meta: "OpenClaw → Hermes",
    description: "A proactive AI second brain that captures links, meetings, notes and messages into structured memory, then uses that context to run useful skills like Telegram digests, portfolio sync, reminders, reviews and contextual search.",
  },
];
