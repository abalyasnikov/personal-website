// WCAG AA contrast for every rendered text node, with real alpha compositing.
import {
  CONTRAST_LARGE,
  CONTRAST_NORMAL,
  LARGE_BOLD_PX,
  LARGE_BOLD_WEIGHT,
  LARGE_TEXT_PX,
  THEMES,
  WIDTHS,
} from "./constants.mjs";
import { openPage } from "./lib.mjs";

const collect = ({ normal, large, largePx, largeBoldPx, largeBoldWeight }) => {
  // Handles rgb()/rgba() and the color(srgb r g b / a) form that color-mix() computes to.
  const parse = (value) => {
    if (!value || value === "transparent") return [0, 0, 0, 0];
    const srgb = value.match(/^color\(srgb\s+([^)]+)\)$/i);
    if (srgb) {
      const [rgb, alpha = "1"] = srgb[1].split("/");
      const [r, g, b] = rgb.trim().split(/\s+/).map(Number);
      return [r * 255, g * 255, b * 255, Number(alpha)];
    }
    const parts = value.match(/-?[\d.]+/g);
    if (!parts) return [0, 0, 0, 0];
    const [r, g, b, a = 1] = parts.map(Number);
    return [r, g, b, Number(a)];
  };

  const over = (fg, bg) => {
    const a = fg[3];
    if (a >= 1) return [fg[0], fg[1], fg[2], 1];
    return [
      fg[0] * a + bg[0] * (1 - a),
      fg[1] * a + bg[1] * (1 - a),
      fg[2] * a + bg[2] * (1 - a),
      1,
    ];
  };

  const luminance = ([r, g, b]) => {
    const channel = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };

  const ratio = (fg, bg) => {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // Composites every ancestor background down onto the canvas.
  const backdrop = (element) => {
    const stack = [];
    for (let node = element; node; node = node.parentElement) {
      stack.push(parse(getComputedStyle(node).backgroundColor));
    }
    let result = [255, 255, 255, 1];
    for (let i = stack.length - 1; i >= 0; i -= 1) result = over(stack[i], result);
    return result;
  };

  const label = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const cls = typeof element.className === "string" && element.className
      ? `.${element.className.trim().split(/\s+/).join(".")}`
      : "";
    return `${element.tagName.toLowerCase()}${id}${cls}`;
  };

  const results = [];
  const check = (element, pseudo, text) => {
    const style = getComputedStyle(element, pseudo);
    if (style.visibility === "hidden" || style.display === "none") return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const isLarge = size >= largePx || (size >= largeBoldPx && weight >= largeBoldWeight);
    const bg = backdrop(element);
    const fg = over(parse(style.color), bg);
    const value = ratio(fg, bg);
    const required = isLarge ? large : normal;

    results.push({
      selector: label(element) + (pseudo || ""),
      text: text.trim().slice(0, 48),
      fontSize: size,
      fontWeight: weight,
      ratio: Math.round(value * 100) / 100,
      required,
      pass: value + 1e-9 >= required,
    });
  };

  for (const element of document.querySelectorAll("body *")) {
    const own = [...element.childNodes]
      .filter((node) => node.nodeType === 3 && node.textContent.trim())
      .map((node) => node.textContent)
      .join(" ");
    if (own) check(element, "", own);

    for (const pseudo of ["::before", "::after"]) {
      const content = getComputedStyle(element, pseudo).content;
      if (!content || content === "none" || content === "normal" || content === '""') continue;
      check(element, pseudo, content);
    }
  }
  return results;
};

// Animated colour has to be sampled deterministically. "rest" asks the browser
// for reduced motion, which the site honours by freezing the runner; "peak"
// pins every animation to the moment the eval key is fully accent-coloured.
const HIGHLIGHT_OFFSET_MS = 1400;

const freezeAtHighlight = (offset) => {
  for (const animation of document.getAnimations()) {
    animation.pause();
    const timing = animation.effect ? animation.effect.getComputedTiming() : {};
    animation.currentTime = (timing.delay || 0) + offset;
  }
};

export async function run(browser, routes) {
  const failures = [];
  const lines = [];
  let checked = 0;

  const passes = [
    { name: "rest", reducedMotion: "reduce" },
    { name: "peak", reducedMotion: undefined },
  ];

  for (const route of routes) {
    for (const theme of THEMES) {
      for (const width of [WIDTHS[0], WIDTHS.at(-1)]) {
        for (const pass of passes) {
          const { context, page } = await openPage(browser, {
            width,
            theme,
            path: route.path,
            reducedMotion: pass.reducedMotion,
          });
          if (pass.name === "peak") await page.evaluate(freezeAtHighlight, HIGHLIGHT_OFFSET_MS);
          const results = await page.evaluate(collect, {
            normal: CONTRAST_NORMAL,
            large: CONTRAST_LARGE,
            largePx: LARGE_TEXT_PX,
            largeBoldPx: LARGE_BOLD_PX,
            largeBoldWeight: LARGE_BOLD_WEIGHT,
          });
          await context.close();

          checked += results.length;
          for (const result of results.filter((item) => !item.pass)) {
            failures.push(`${route.path} ${theme} ${width}px ${pass.name}  ${result.ratio}:1 < ${result.required} — ${result.selector} @${result.fontSize}px/${result.fontWeight} "${result.text}"`);
          }
        }
      }
    }
  }

  lines.push(`${checked} text nodes measured across ${routes.length} routes x ${THEMES.length} themes x ${passes.length} motion states`);
  lines.push(`thresholds: ${CONTRAST_NORMAL}:1 normal, ${CONTRAST_LARGE}:1 large (>=${LARGE_TEXT_PX}px or >=${LARGE_BOLD_PX}px at ${LARGE_BOLD_WEIGHT})`);
  return { name: "contrast", failures, lines };
}
