export type WorkEntry = {
  name: string;
  role: string;
  date: string;
  body: React.ReactNode;
};

export type IndexEntry = {
  name: string;
  description: string;
  meta?: string;
  href?: string;
  placeholder?: boolean;
};

export const work: WorkEntry[] = [
  {
    name: "Zerion",
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
    name: "ML trading systems",
    meta: "Prediction markets / Solana",
    description: "Data pipelines, feature engineering, backtesting and live execution, run end to end.",
  },
  {
    name: "Personal AI assistant",
    meta: "OpenClaw → Hermes",
    description: "One sentence about what it does is still needed.",
    placeholder: true,
  },
];

export const investing: IndexEntry[] = [
  {
    name: "Alliance DAO",
    description: "Web3 accelerator and founder community. Invested when it was still DeFi Alliance.",
  },
  { name: "zkSync", description: "ZK rollup scaling Ethereum, built by Matter Labs." },
  {
    name: "Socket",
    description: "Chain abstraction. One API to read state and write transactions across 20+ chains.",
  },
  {
    name: "CoW Swap",
    description: "A DEX that settles through batch auctions and coincidence of wants, protecting orders from MEV.",
  },
  {
    name: "Align Labs",
    description: "Financial infrastructure for stablecoins, linking cross-border payments to stablecoin and fiat rails.",
  },
];
