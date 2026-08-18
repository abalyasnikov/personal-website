import fs from "node:fs";
import path from "node:path";

const ENV_FILE = path.join(process.cwd(), ".env.local");
const KEY_PATTERN = /^[a-f0-9]{8,128}$/i;

function readFromEnvFile() {
  if (!fs.existsSync(ENV_FILE)) return undefined;
  const match = fs.readFileSync(ENV_FILE, "utf8").match(/^INDEXNOW_KEY=(.*)$/m);
  return match ? match[1].trim() : undefined;
}

/**
 * IndexNow proves ownership with a file the site serves publicly, so the key
 * cannot stay secret once deployed. It still never enters git: the value lives
 * in INDEXNOW_KEY, either in the environment or in the untracked .env.local,
 * and the served file is written at build time.
 *
 * Returns undefined when no key is configured. Throws when one is configured
 * but malformed, because a wrong key fails silently at the API otherwise.
 */
export function readIndexNowKey() {
  const key = process.env.INDEXNOW_KEY ?? readFromEnvFile();
  if (key === undefined || key === "") return undefined;

  if (!KEY_PATTERN.test(key)) {
    throw new Error(
      `INDEXNOW_KEY expected 8 to 128 hexadecimal characters, received ${JSON.stringify(key)}`,
    );
  }

  return key;
}
