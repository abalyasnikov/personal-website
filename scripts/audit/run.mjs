#!/usr/bin/env node
// Regression suite for the 2026-07-31 audit. Expects a server that is already
// running; never starts one. Exits 0 when every check passes, 1 otherwise.
import { chromium } from "playwright";
import { AUDIT_URL, TARGET_MIN_AA, TARGET_MIN_AAA, THEMES, WIDTHS } from "./constants.mjs";
import { discoverRoutes, requireServer } from "./lib.mjs";
import { run as contrast } from "./contrast.mjs";
import { run as measure } from "./measure.mjs";
import { run as behavior } from "./behavior.mjs";
import { run as shots } from "./shots.mjs";

const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));

try {
  await requireServer();
} catch (error) {
  console.error(`\n${error.message}\n`);
  process.exit(1);
}

console.log(`audit ${AUDIT_URL}`);
console.log(`widths ${WIDTHS.join("/")} · themes ${THEMES.join("/")} · targets ${TARGET_MIN_AA}px AA enforced, ${TARGET_MIN_AAA}px AAA reported\n`);

const browser = await chromium.launch();
let failed = 0;

try {
  const routes = await discoverRoutes(browser);
  const checks = [
    ["contrast", () => contrast(browser, routes)],
    ["measure", () => measure(browser, routes)],
    ["behavior", () => behavior(browser)],
    ["shots", () => shots(browser, routes)],
  ];

  for (const [name, check] of checks) {
    if (only.length && !only.includes(name)) continue;
    const report = await check();
    const status = report.failures.length ? `FAIL (${report.failures.length})` : "PASS";
    console.log(`── ${report.name} — ${status}`);
    for (const line of report.lines) console.log(`   ${line}`);
    for (const failure of report.failures) console.log(`   ✗ ${failure}`);
    console.log("");
    failed += report.failures.length;
  }
} finally {
  await browser.close();
}

console.log(failed ? `${failed} violation(s)` : "no violations");
process.exit(failed ? 1 : 0);
