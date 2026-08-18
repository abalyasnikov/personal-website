#!/usr/bin/env node
// Tells IndexNow that the exported URLs changed. Bing indexes from it within
// hours instead of days, and ChatGPT and Copilot answer from that index.
//
// Run it after the deploy is live: the API fetches the ownership file from the
// site, so submitting ahead of a deploy fails validation.
import fs from "node:fs";
import path from "node:path";
import { readIndexNowKey } from "./key.mjs";

const SITEMAP_PATH = path.join(process.cwd(), "out", "sitemap.xml");
const ENDPOINT = "https://api.indexnow.org/indexnow";

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail(`${SITEMAP_PATH} is missing. Run npm run build first.`);
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!urls.length) fail(`${SITEMAP_PATH} contains no <loc> entries.`);

  // IndexNow accepts one host per submission, and the sitemap is the only place
  // that knows which host was exported.
  const hosts = new Set(urls.map((url) => new URL(url).host));
  if (hosts.size !== 1) {
    fail(`${SITEMAP_PATH} expected a single host, received ${[...hosts].join(", ")}.`);
  }

  return { urls, host: [...hosts][0] };
}

let key;
try {
  key = readIndexNowKey();
} catch (error) {
  fail(error.message);
}

if (!key) {
  fail("INDEXNOW_KEY is not configured. Add it to .env.local and to the Vercel project.");
}

const { urls, host } = readSitemapUrls();

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  }),
});

if (!response.ok) {
  fail(`${ENDPOINT} answered ${response.status} ${response.statusText}: ${await response.text()}`);
}

console.log(`indexnow: submitted ${urls.length} urls for ${host}, ${response.status} ${response.statusText}`);
