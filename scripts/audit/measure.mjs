// Geometry checks: hit areas, horizontal overflow, tab order, shared left edges.
import { HIT_TARGET_EXEMPT, HIT_TARGET_PX, OVERFLOW_TOLERANCE_PX, THEMES, WIDTHS } from "./constants.mjs";
import { openPage } from "./lib.mjs";

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const EDGE_SELECTORS = [".post-status", ".post-header h1", ".post-dek", ".post-body", ".markdown-content h2", ".post-footer"];

const probeHitAreas = ({ selector, exempt, size }) => {
  // A zone exactly `size` wide spans [centre - size/2, centre + size/2), so the
  // probe stops a hair short of the edge: 44px passes, 43px still fails.
  const reach = size / 2 - 0.1;
  const label = (element) => {
    const cls = typeof element.className === "string" && element.className
      ? `.${element.className.trim().split(/\s+/).join(".")}`
      : "";
    return `${element.tagName.toLowerCase()}${cls}:${(element.textContent || "").trim().slice(0, 20)}`;
  };

  const controls = [...document.querySelectorAll(selector)].filter((element) => {
    if (exempt.some((pattern) => element.matches(pattern))) return false;
    const style = getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none") return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  const results = [];
  for (const element of controls) {
    element.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    const probes = [
      ["left", cx - reach, cy],
      ["right", cx + reach, cy],
      ["up", cx, cy - reach],
      ["down", cx, cy + reach],
    ];

    for (const [name, x, y] of probes) {
      if (x < 0 || y < 0 || x > innerWidth - 1 || y > innerHeight - 1) {
        results.push({ control: label(element), probe: name, outcome: "outside viewport" });
        continue;
      }
      const hit = document.elementFromPoint(x, y);
      if (hit && (hit === element || element.contains(hit))) continue;
      const other = hit && hit.closest(selector);
      results.push({
        control: label(element),
        probe: name,
        outcome: other && other !== element ? `overlaps ${label(other)}` : "misses target",
      });
    }
  }
  return { count: controls.length, misses: results };
};

const measureOverflow = () => {
  const root = document.documentElement;
  const offenders = [];
  for (const element of document.querySelectorAll("body *")) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) continue;
    const right = rect.right + scrollX;
    if (right > root.clientWidth + 1) {
      offenders.push(`${element.tagName.toLowerCase()}.${String(element.className || "").trim().replace(/\s+/g, ".")} right=${Math.round(right)}`);
    }
  }
  return {
    documentOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
    offenders: [...new Set(offenders)].slice(0, 8),
  };
};

const readEdges = (selectors) =>
  Object.fromEntries(
    selectors.map((selector) => {
      const element = document.querySelector(selector);
      return [selector, element ? Math.round(element.getBoundingClientRect().left * 100) / 100 : null];
    }),
  );

export async function run(browser, routes) {
  const failures = [];
  const lines = [];

  for (const route of routes) {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        const { context, page } = await openPage(browser, { width, theme, path: route.path });

        const overflow = await page.evaluate(measureOverflow);
        if (overflow.documentOverflow > OVERFLOW_TOLERANCE_PX) {
          failures.push(`${route.path} ${theme} ${width}px  horizontal overflow ${overflow.documentOverflow}px — ${overflow.offenders.join(", ")}`);
        }

        const hit = await page.evaluate(probeHitAreas, {
          selector: INTERACTIVE,
          exempt: HIT_TARGET_EXEMPT,
          size: HIT_TARGET_PX,
        });
        for (const miss of hit.misses) {
          failures.push(`${route.path} ${theme} ${width}px  hit area <${HIT_TARGET_PX}px — ${miss.control} probe ${miss.probe}: ${miss.outcome}`);
        }
        if (theme === THEMES[0] && width === WIDTHS.at(-1)) {
          lines.push(`${route.path}: ${hit.count} interactive elements probed`);
        }

        await context.close();
      }
    }
  }

  // Shared left edge — only meaningful on article routes.
  for (const route of routes.filter((item) => item.path.startsWith("/writing/"))) {
    for (const width of WIDTHS) {
      const { context, page } = await openPage(browser, { width, theme: "light", path: route.path });
      const edges = await page.evaluate(readEdges, EDGE_SELECTORS);
      await context.close();
      const values = [...new Set(Object.values(edges).filter((value) => value !== null))];
      if (values.length > 1) {
        failures.push(`${route.path} ${width}px  left edges differ — ${JSON.stringify(edges)}`);
      } else {
        lines.push(`${route.path} ${width}px left edge ${values[0]}px shared by ${EDGE_SELECTORS.length} regions`);
      }
    }
  }

  return { name: "measure", failures, lines };
}
