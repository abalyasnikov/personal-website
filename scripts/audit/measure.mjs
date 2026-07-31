// Geometry checks: target size, horizontal overflow, shared left edges.
import {
  HIT_TARGET_EXEMPT,
  OVERFLOW_TOLERANCE_PX,
  TARGET_MIN_AA,
  TARGET_MIN_AAA,
  THEMES,
  WIDTHS,
} from "./constants.mjs";
import { openPage } from "./lib.mjs";

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const EDGE_SELECTORS = [".post-date", ".post-header h1", ".post-dek", ".post-body", ".markdown-content h2", ".post-footer"];

const collectTargets = ({ selector, exempt, aa, aaa }) => {
  const label = (element) => {
    const cls = typeof element.className === "string" && element.className
      ? `.${element.className.trim().split(/\s+/).join(".")}`
      : "";
    return `${element.tagName.toLowerCase()}${cls}:${(element.textContent || "").trim().slice(0, 20)}`;
  };

  /* A scrolling ancestor clips what the user can actually reach. The header
     navigation scrolls horizontally, so its far items keep their unclipped
     geometry in getBoundingClientRect and appear to sit under the theme
     control. Intersecting with every clipping ancestor removes those phantoms
     and drops anything currently scrolled out of view. */
  const visibleRect = (element) => {
    let rect = element.getBoundingClientRect();
    let box = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    for (let node = element.parentElement; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.overflowX === "visible" && style.overflowY === "visible") continue;
      const clip = node.getBoundingClientRect();
      box = {
        left: Math.max(box.left, clip.left),
        top: Math.max(box.top, clip.top),
        right: Math.min(box.right, clip.right),
        bottom: Math.min(box.bottom, clip.bottom),
      };
    }
    return box;
  };

  const controls = [...document.querySelectorAll(selector)].filter((element) => {
    if (exempt.some((pattern) => element.matches(pattern))) return false;
    const style = getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none") return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  const targets = controls
    .map((element) => {
      const rect = visibleRect(element);
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      return {
        name: label(element),
        rect,
        cx: (rect.left + rect.right) / 2,
        cy: (rect.top + rect.bottom) / 2,
        width,
        height,
        undersized: width < aa || height < aa,
      };
    })
    .filter((target) => target.width > 0 && target.height > 0);

  /* SC 2.5.8 Target Size (Minimum), Level AA.
     24x24 passes outright. An undersized target passes on spacing when the
     24px-diameter circle centred on its bounding box intersects neither
     another target's box nor another undersized target's circle. Tangency is
     allowed, so only a strict overlap counts. */
  const radius = aa / 2;
  const epsilon = 0.01;
  const distanceToRect = (x, y, r) => {
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.hypot(dx, dy);
  };

  const aaFailures = [];
  for (const target of targets) {
    if (!target.undersized) continue;
    const clashes = [];
    for (const other of targets) {
      if (other === target) continue;
      if (distanceToRect(target.cx, target.cy, other.rect) < radius - epsilon) {
        clashes.push(`box of ${other.name}`);
        continue;
      }
      if (other.undersized && Math.hypot(target.cx - other.cx, target.cy - other.cy) < aa - epsilon) {
        clashes.push(`circle of ${other.name}`);
      }
    }
    if (clashes.length) {
      aaFailures.push({
        name: target.name,
        size: `${Math.round(target.width)}x${Math.round(target.height)}`,
        clashes: [...new Set(clashes)].slice(0, 3),
      });
    }
  }

  /* SC 2.5.5 Target Size (Enhanced), Level AAA — reported, never enforced. */
  const aaaShort = targets
    .filter((target) => target.width < aaa || target.height < aaa)
    .map((target) => ({ name: target.name, size: `${Math.round(target.width)}x${Math.round(target.height)}` }));

  /* Tightest centre-to-centre distance among pairs where at least one target is
     undersized — the only pairs SC 2.5.8 turns on. Two full-size targets may sit
     as close as they like. */
  let closest = Infinity;
  for (let i = 0; i < targets.length; i += 1) {
    for (let j = i + 1; j < targets.length; j += 1) {
      if (!targets[i].undersized && !targets[j].undersized) continue;
      closest = Math.min(closest, Math.hypot(targets[i].cx - targets[j].cx, targets[i].cy - targets[j].cy));
    }
  }

  return {
    count: targets.length,
    aaFailures,
    aaaShort,
    closest: Number.isFinite(closest) ? Math.round(closest) : null,
  };
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
  const aaaShort = new Map();
  let closest = Infinity;

  for (const route of routes) {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        const { context, page } = await openPage(browser, { width, theme, path: route.path });

        const overflow = await page.evaluate(measureOverflow);
        if (overflow.documentOverflow > OVERFLOW_TOLERANCE_PX) {
          failures.push(`${route.path} ${theme} ${width}px  horizontal overflow ${overflow.documentOverflow}px — ${overflow.offenders.join(", ")}`);
        }

        const targets = await page.evaluate(collectTargets, {
          selector: INTERACTIVE,
          exempt: HIT_TARGET_EXEMPT,
          aa: TARGET_MIN_AA,
          aaa: TARGET_MIN_AAA,
        });
        for (const failure of targets.aaFailures) {
          failures.push(`${route.path} ${theme} ${width}px  ${failure.size} target fails SC 2.5.8 — ${failure.name} clashes with ${failure.clashes.join(", ")}`);
        }
        for (const short of targets.aaaShort) {
          aaaShort.set(`${short.name} — ${short.size}`, (aaaShort.get(`${short.name} — ${short.size}`) ?? 0) + 1);
        }
        if (targets.closest !== null) closest = Math.min(closest, targets.closest);
        if (theme === THEMES[0] && width === WIDTHS.at(-1)) {
          lines.push(`${route.path}: ${targets.count} targets measured`);
        }

        await context.close();
      }
    }
  }

  lines.push(`SC 2.5.8 (AA, ${TARGET_MIN_AA}px or spacing): pass — tightest pair involving an undersized target is ${closest}px centre to centre`);
  if (aaaShort.size === 0) {
    lines.push(`SC 2.5.5 (AAA, ${TARGET_MIN_AAA}px): every target clears it`);
  } else {
    lines.push(`SC 2.5.5 (AAA, ${TARGET_MIN_AAA}px): ${aaaShort.size} target(s) below it — reported, not enforced`);
    for (const [key, count] of [...aaaShort.entries()].sort()) {
      lines.push(`   ${key} (${count} viewport/theme combinations)`);
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
