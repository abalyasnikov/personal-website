// Shared helpers for the audit suite: server preflight, page setup, PNG diffing.
import zlib from "node:zlib";
import { AUDIT_URL, DEVICE_SCALE_FACTOR, VIEWPORT_HEIGHT } from "./constants.mjs";

/** Fails loudly instead of silently starting a server the operator did not ask for. */
export async function requireServer() {
  try {
    const response = await fetch(`${AUDIT_URL}/`, { redirect: "follow" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(
      `No server answered at ${AUDIT_URL} (${error.message}).\n` +
        "npm run audit never starts one. Run `npm run dev -- -p 3001` in another shell, " +
        "or point AUDIT_URL at a running instance.",
    );
  }
}

/** Opens a page with the theme pinned before any script on the page runs. */
export async function openPage(browser, { width, theme, path = "/", reducedMotion }) {
  const context = await browser.newContext({
    viewport: { width, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: theme === "dark" ? "dark" : "light",
    ...(reducedMotion ? { reducedMotion } : {}),
  });
  if (theme) {
    await context.addInitScript(
      `try { localStorage.setItem('site-theme', ${JSON.stringify(theme)}); } catch (e) {}`,
    );
  }
  const page = await context.newPage();
  await page.goto(`${AUDIT_URL}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

/** Home plus every writing route the home page links to, so new posts are covered automatically. */
export async function discoverRoutes(browser) {
  const { context, page } = await openPage(browser, { width: 1440, theme: "light" });
  const posts = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/writing/"]')].map((a) => new URL(a.href).pathname),
  );
  await context.close();
  return [{ name: "home", path: "/" }, ...[...new Set(posts)].map((path) => ({ name: path, path }))];
}

/* ------------------------------------------------------------------ *
 * Minimal PNG reader: 8-bit RGB/RGBA, non-interlaced — what Chromium
 * emits. Keeps the suite dependency-free beyond Playwright itself.
 * ------------------------------------------------------------------ */
export function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let offset = 8;
  let width = 0;
  let height = 0;
  let depth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      depth = data.readUInt8(8);
      colorType = data.readUInt8(9);
      if (depth !== 8 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`unsupported PNG (depth ${depth}, color type ${colorType})`);
      }
      if (data.readUInt8(12) !== 0) throw new Error("interlaced PNG is unsupported");
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = pixels.subarray(y * stride, (y + 1) * stride);
    const prior = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x += 1) {
      const a = x >= channels ? out[x - channels] : 0;
      const b = prior ? prior[x] : 0;
      const c = prior && x >= channels ? prior[x - channels] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) {
        throw new Error(`unknown PNG filter ${filter}`);
      }
      out[x] = value & 0xff;
    }
  }

  return { width, height, channels, pixels };
}

/** Returns the number of differing pixels, or -1 when the geometry differs. */
export function diffPng(aBuffer, bBuffer, channelTolerance = 0) {
  const a = decodePng(aBuffer);
  const b = decodePng(bBuffer);
  if (a.width !== b.width || a.height !== b.height) return -1;

  let differing = 0;
  const count = a.width * a.height;
  for (let i = 0; i < count; i += 1) {
    const ai = i * a.channels;
    const bi = i * b.channels;
    for (let channel = 0; channel < 3; channel += 1) {
      if (Math.abs(a.pixels[ai + channel] - b.pixels[bi + channel]) > channelTolerance) {
        differing += 1;
        break;
      }
    }
  }
  return differing;
}
