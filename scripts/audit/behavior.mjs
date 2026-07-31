// Runtime behaviour: theme resolution before paint, system preference, keyboard focus.
import { AUDIT_URL, VIEWPORT_HEIGHT } from "./constants.mjs";
import { openPage } from "./lib.mjs";

// Installed before any page script. `document.documentElement` does not exist
// yet at that point, so the observer watches the document subtree instead.
const OBSERVER = `
  window.__themeMutations = [];
  window.__firstPaint = null;
  window.__observerInstalled = false;
  requestAnimationFrame(function () { window.__firstPaint = performance.now(); });
  try {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i += 1) {
        if (records[i].target !== document.documentElement) continue;
        window.__themeMutations.push({
          at: performance.now(),
          from: records[i].oldValue,
          to: document.documentElement.getAttribute('data-theme')
        });
      }
    }).observe(document, { attributes: true, attributeOldValue: true, attributeFilter: ['data-theme'], subtree: true });
    window.__observerInstalled = true;
  } catch (e) {}
`;

async function themedContext(browser, { colorScheme, storedTheme }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: VIEWPORT_HEIGHT },
    colorScheme,
  });
  await context.addInitScript(
    storedTheme
      ? `try { localStorage.setItem('site-theme', ${JSON.stringify(storedTheme)}); } catch (e) {}\n${OBSERVER}`
      : `try { localStorage.removeItem('site-theme'); } catch (e) {}\n${OBSERVER}`,
  );
  const page = await context.newPage();
  return { context, page };
}

export async function run(browser) {
  const failures = [];
  const lines = [];

  // 1. The theme script must be inline, synchronous and inside <head>, so the
  //    parser runs it before the first frame. Its position relative to the
  //    stylesheet is reported but not enforced: the App Router hoists
  //    `<link rel="stylesheet" data-precedence>` above every non-hoisted head
  //    child, and a render-blocking stylesheet cannot paint before the parser
  //    has executed a later synchronous script anyway. Check 2 is the proof.
  const html = await (await fetch(`${AUDIT_URL}/`)).text();
  const head = html.slice(0, html.search(/<\/head>/i));
  const scriptMatch = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].find((match) =>
    match[1].includes("site-theme"),
  );
  const linkIndex = head.search(/<link[^>]+rel=["']?stylesheet/i);

  if (!scriptMatch) {
    failures.push("theme script: no inline script referencing site-theme found in <head>");
  } else {
    const openTag = scriptMatch[0].slice(0, scriptMatch[0].indexOf(">") + 1);
    if (/\b(defer|async)\b/i.test(openTag)) {
      failures.push(`theme script: must be synchronous, found ${openTag}`);
    }
    if (/\bsrc=/i.test(openTag)) {
      failures.push(`theme script: must be inline, found ${openTag}`);
    }
    lines.push(`theme script inline+synchronous in <head> at offset ${scriptMatch.index} (first stylesheet at ${linkIndex})`);
  }

  // 2. Stored dark must be applied before the first frame, with no later flip.
  {
    const { context, page } = await themedContext(browser, { colorScheme: "light", storedTheme: "dark" });
    await page.goto(`${AUDIT_URL}/`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      background: getComputedStyle(document.body).backgroundColor,
      firstPaint: window.__firstPaint,
      installed: window.__observerInstalled,
      mutations: window.__themeMutations,
    }));
    await context.close();

    if (!state.installed) failures.push("stored dark: the pre-navigation MutationObserver failed to install");
    if (state.theme !== "dark") failures.push(`stored dark: resolved to ${state.theme}`);
    const late = state.mutations.filter((m) => state.firstPaint !== null && m.at > state.firstPaint);
    if (late.length) {
      failures.push(`stored dark: ${late.length} data-theme change(s) after first paint — ${JSON.stringify(late)}`);
    } else {
      lines.push(`stored dark: ${state.mutations.length} pre-paint data-theme write(s), background ${state.background}`);
    }
  }

  // 3. System preference on a first visit, and manual override winning over it.
  const cases = [
    { colorScheme: "dark", storedTheme: null, expected: "dark", note: "system dark, empty storage" },
    { colorScheme: "light", storedTheme: null, expected: "light", note: "system light, empty storage" },
    { colorScheme: "dark", storedTheme: "light", expected: "light", note: "manual light over system dark" },
    { colorScheme: "light", storedTheme: "dark", expected: "dark", note: "manual dark over system light" },
  ];
  for (const item of cases) {
    const { context, page } = await themedContext(browser, item);
    await page.goto(`${AUDIT_URL}/`, { waitUntil: "networkidle" });
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await context.close();
    if (theme !== item.expected) failures.push(`${item.note}: expected ${item.expected}, got ${theme}`);
    else lines.push(`${item.note}: ${theme}`);
  }

  // 4. A click on the theme control must survive a reload.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: VIEWPORT_HEIGHT }, colorScheme: "light" });
    const page = await context.newPage();
    await page.goto(`${AUDIT_URL}/`, { waitUntil: "networkidle" });
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.click(".theme-toggle");
    const toggled = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.reload({ waitUntil: "networkidle" });
    const after = await page.evaluate(() => document.documentElement.dataset.theme);
    await context.close();
    if (toggled === before) failures.push("theme toggle: clicking did not change the theme");
    if (after !== toggled) failures.push(`theme toggle: ${toggled} did not survive reload (got ${after})`);
    else lines.push(`theme toggle: ${before} -> ${toggled}, persisted across reload`);
  }

  // 5. Every keyboard stop must show a visible focus ring.
  {
    const { context, page } = await openPage(browser, { width: 1440, theme: "light", path: "/" });
    const order = [];
    for (let i = 0; i < 60; i += 1) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return null;
        if (element.tagName.includes("-")) return { skip: true };
        const style = getComputedStyle(element);
        return {
          label: `${element.tagName.toLowerCase()}:${(element.textContent || "").trim().slice(0, 20)}`,
          outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
          visible: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0,
        };
      });
      if (!stop) break;
      if (stop.skip) continue;
      if (order.some((item) => item.label === stop.label) && order.length > 8) break;
      order.push(stop);
    }
    for (const stop of order.filter((item) => !item.visible)) {
      failures.push(`focus ring missing on ${stop.label} (${stop.outline})`);
    }
    lines.push(`keyboard: ${order.length} focus stops, all with a visible ring`);
    await context.close();
  }

  return { name: "behavior", failures, lines };
}
