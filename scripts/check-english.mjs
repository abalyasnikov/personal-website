#!/usr/bin/env node
// Enforces the English-only rule from CODING_STANDARDS.md across the repository.
//
//   node scripts/check-english.mjs            tracked files
//   node scripts/check-english.mjs --commits  tracked files and commit messages
//
// Exits 1 and names every file and line that carries Cyrillic text.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const RULE = "CODING_STANDARDS.md: code, comments and documentation in this repository are in English.";
// Escapes, not literals: Cyrillic (U+0400-U+04FF) and its supplement
// (U+0500-U+052F). Writing the range literally would make this file fail its
// own check.
const CYRILLIC = /[\u0400-\u04FF\u0500-\u052F]/;
// Binary and generated files never carry prose worth checking.
const SKIP = /\.(png|jpe?g|gif|webp|avif|ico|pdf|woff2?|ttf|otf|eot|mp4|webm|zip|gz)$/i;

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

function findings(label, text) {
  const hits = [];
  text.split("\n").forEach((line, index) => {
    if (!CYRILLIC.test(line)) return;
    const excerpt = line.trim().slice(0, 80);
    hits.push(`${label}:${index + 1}: ${excerpt}`);
  });
  return hits;
}

const problems = [];

const files = git("ls-files", "-z").split("\0").filter(Boolean);
let scanned = 0;
for (const file of files) {
  if (SKIP.test(file) || !fs.existsSync(file)) continue;
  const buffer = fs.readFileSync(file);
  // A NUL byte means binary; skip rather than dump bytes into the report.
  if (buffer.includes(0)) continue;
  scanned += 1;
  problems.push(...findings(file, buffer.toString("utf8")));
}

if (process.argv.includes("--commits")) {
  const log = git("log", "--format=%H%x1f%B%x1e");
  for (const entry of log.split("\x1e")) {
    const [hash, body] = entry.split("\x1f");
    if (!hash || !body) continue;
    problems.push(...findings(`commit ${hash.trim().slice(0, 9)}`, body));
  }
}

if (problems.length === 0) {
  console.log(`check-english: ${scanned} tracked text files scanned, no non-English text found`);
  process.exit(0);
}

console.error(`check-english: found Cyrillic text in ${problems.length} place(s).\n${RULE}\n`);
for (const problem of problems) console.error(`  ${problem}`);
process.exit(1);
