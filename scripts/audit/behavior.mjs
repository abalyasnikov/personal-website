// Runtime behaviour: theme resolution before paint, system preference, keyboard focus.
import { AUDIT_URL, DESKTOP_WIDTH, VIEWPORT_HEIGHT } from "./constants.mjs";
import { navigatePage, openPage } from "./lib.mjs";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]",
].join(",");

// Installed before any page script. The root element does not exist yet, so
// the observer watches the document subtree and exposes setup failures.
const OBSERVER = `
  window.__themeMutations = [];
  window.__firstPaint = null;
  window.__observerInstalled = false;
  window.__themeObserverError = null;
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
  } catch (error) {
    window.__themeObserverError = String(error);
  }
`;

async function themedContext(browser, { colorScheme, storedTheme }) {
  const context = await browser.newContext({
    viewport: { width: DESKTOP_WIDTH, height: VIEWPORT_HEIGHT },
    colorScheme,
  });
  const storageSetup = storedTheme
    ? `localStorage.setItem('site-theme', ${JSON.stringify(storedTheme)});`
    : "localStorage.removeItem('site-theme');";
  await context.addInitScript(`${storageSetup}\n${OBSERVER}`);
  return { context, page: await context.newPage() };
}

async function checkThemeScript() {
  const failures = [];
  const lines = [];
  const html = await (await fetch(`${AUDIT_URL}/`)).text();
  const head = html.slice(0, html.search(/<\/head>/i));
  const script = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .find((match) => match[1].includes("site-theme"));
  const stylesheetOffset = head.search(/<link[^>]+rel=["']?stylesheet/i);

  if (!script) return { failures: ["theme script: no inline site-theme script found in <head>"], lines };
  const tag = script[0].slice(0, script[0].indexOf(">") + 1);
  if (/\b(defer|async)\b/i.test(tag)) failures.push(`theme script: must be synchronous, found ${tag}`);
  if (/\bsrc=/i.test(tag)) failures.push(`theme script: must be inline, found ${tag}`);
  lines.push(`theme script inline+synchronous in <head> at offset ${script.index} (first stylesheet at ${stylesheetOffset})`);
  return { failures, lines };
}

async function checkStoredTheme(browser) {
  const { context, page } = await themedContext(browser, { colorScheme: "light", storedTheme: "dark" });
  await navigatePage(page);
  const state = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    background: getComputedStyle(document.body).backgroundColor,
    firstPaint: window.__firstPaint,
    installed: window.__observerInstalled,
    observerError: window.__themeObserverError,
    mutations: window.__themeMutations,
  }));
  await context.close();

  const failures = [];
  if (!state.installed) failures.push(`stored dark: observer setup failed (${state.observerError ?? "unknown error"})`);
  if (state.theme !== "dark") failures.push(`stored dark: expected dark, received ${state.theme}`);
  const late = state.mutations.filter((item) => state.firstPaint !== null && item.at > state.firstPaint);
  if (late.length) failures.push(`stored dark: ${late.length} data-theme change(s) after first paint — ${JSON.stringify(late)}`);
  const lines = late.length ? [] : [`stored dark: ${state.mutations.length} pre-paint data-theme write(s), background ${state.background}`];
  return { failures, lines };
}

async function checkThemeCases(browser) {
  const cases = [
    { colorScheme: "dark", storedTheme: null, expected: "dark", note: "system dark, empty storage" },
    { colorScheme: "light", storedTheme: null, expected: "light", note: "system light, empty storage" },
    { colorScheme: "dark", storedTheme: "light", expected: "light", note: "manual light over system dark" },
    { colorScheme: "light", storedTheme: "dark", expected: "dark", note: "manual dark over system light" },
  ];
  const failures = [];
  const lines = [];
  for (const item of cases) {
    const { context, page } = await themedContext(browser, item);
    await navigatePage(page);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await context.close();
    if (theme === item.expected) lines.push(`${item.note}: ${theme}`);
    else failures.push(`${item.note}: expected ${item.expected}, received ${theme}`);
  }
  return { failures, lines };
}

async function checkThemeToggle(browser) {
  const context = await browser.newContext({
    viewport: { width: DESKTOP_WIDTH, height: VIEWPORT_HEIGHT },
    colorScheme: "light",
  });
  const page = await context.newPage();
  await navigatePage(page);
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.click(".theme-toggle");
  const toggled = await page.evaluate(() => document.documentElement.dataset.theme);
  await navigatePage(page);
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  await context.close();

  const failures = [];
  if (toggled === before) failures.push("theme toggle: clicking did not change the theme");
  if (after !== toggled) failures.push(`theme toggle: expected persisted ${toggled}, received ${after}`);
  const lines = failures.length ? [] : [`theme toggle: ${before} -> ${toggled}, persisted across reload`];
  return { failures, lines };
}

async function prepareFocusAudit(page) {
  return page.evaluate((selector) => {
    const candidates = [...document.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return element.tabIndex >= 0 && !element.closest("[inert]") &&
        style.display !== "none" && style.visibility !== "hidden" &&
        bounds.width > 0 && bounds.height > 0;
    });
    return candidates.map((element, index) => {
      element.dataset.auditFocusIndex = String(index);
      return {
        index,
        label: `${element.tagName.toLowerCase()}:${(element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 32)}`,
        tabIndex: element.tabIndex,
      };
    });
  }, FOCUSABLE_SELECTOR);
}

async function readFocusStop(page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    const index = Number(element.dataset.auditFocusIndex);
    if (!Number.isInteger(index)) return null;
    const style = getComputedStyle(element);
    const hasOutline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    const hasShadow = style.boxShadow !== "none";
    return {
      index,
      outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
      visible: hasOutline || hasShadow,
    };
  });
}

async function checkRouteFocus(browser, route) {
  const { context, page } = await openPage(browser, { width: DESKTOP_WIDTH, theme: "light", path: route.path });
  const candidates = await prepareFocusAudit(page);
  const observed = [];
  for (let index = 0; index <= candidates.length; index += 1) {
    await page.keyboard.press("Tab");
    const stop = await readFocusStop(page);
    if (!stop || observed.some((item) => item.index === stop.index)) break;
    observed.push(stop);
  }
  await context.close();

  const failures = candidates.filter((item) => item.tabIndex > 0)
    .map((item) => `${route.path} positive tabindex on ${item.label}: ${item.tabIndex}`);
  const expectedOrder = candidates.map((item) => item.index);
  const observedOrder = observed.map((item) => item.index);
  if (JSON.stringify(observedOrder) !== JSON.stringify(expectedOrder)) {
    failures.push(`${route.path} focus order expected ${JSON.stringify(expectedOrder)}, received ${JSON.stringify(observedOrder)}`);
  }
  for (const stop of observed.filter((item) => !item.visible)) {
    failures.push(`${route.path} focus ring missing on ${candidates[stop.index].label} (${stop.outline})`);
  }
  return { failures, line: `${route.path}: ${observed.length} focus stops in DOM order, all with a visible ring` };
}

async function checkKeyboard(browser, routes) {
  const failures = [];
  const lines = [];
  for (const route of routes) {
    const result = await checkRouteFocus(browser, route);
    failures.push(...result.failures);
    lines.push(result.line);
  }
  return { failures, lines };
}

function mergeReport(target, report) {
  target.failures.push(...report.failures);
  target.lines.push(...report.lines);
}

export async function run(browser, routes) {
  const report = { name: "behavior", failures: [], lines: [] };
  mergeReport(report, await checkThemeScript());
  mergeReport(report, await checkStoredTheme(browser));
  mergeReport(report, await checkThemeCases(browser));
  mergeReport(report, await checkThemeToggle(browser));
  mergeReport(report, await checkKeyboard(browser, routes));
  return report;
}
