#!/usr/bin/env node
// Runs as `prebuild`, so the ownership file exists in every export that ships.
// Without a configured key the build carries on and says so.
import fs from "node:fs";
import path from "node:path";
import { readIndexNowKey } from "./key.mjs";

const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const KEY_FILE_PATTERN = /^[a-f0-9]{8,128}\.txt$/i;

let key;
try {
  key = readIndexNowKey();
} catch (error) {
  console.error(`\n${error.message}\n`);
  process.exit(1);
}

if (!key) {
  console.log("indexnow: no INDEXNOW_KEY configured, skipping the ownership file");
  process.exit(0);
}

const keyFileName = `${key}.txt`;

// Only files this script writes are removed, so a rotated key cannot ship
// alongside the one it replaced.
for (const fileName of fs.readdirSync(PUBLIC_DIRECTORY)) {
  if (KEY_FILE_PATTERN.test(fileName) && fileName !== keyFileName) {
    fs.rmSync(path.join(PUBLIC_DIRECTORY, fileName));
    console.log(`indexnow: removed the stale public/${fileName}`);
  }
}

fs.writeFileSync(path.join(PUBLIC_DIRECTORY, keyFileName), key);
console.log(`indexnow: wrote public/${keyFileName}`);
