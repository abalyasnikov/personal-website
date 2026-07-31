// Full-page screenshots at every supported width and theme, with an optional baseline diff.
import fs from "node:fs";
import path from "node:path";
import {
  AUDIT_BASELINE,
  AUDIT_OUT,
  SHOT_CHANNEL_TOLERANCE,
  SHOT_DIFF_TOLERANCE_PX,
  THEMES,
  WIDTHS,
} from "./constants.mjs";
import { diffPng, openPage } from "./lib.mjs";

export async function run(browser, routes) {
  const failures = [];
  const lines = [];
  const outDir = AUDIT_OUT || path.join(process.cwd(), ".audit", "shots");
  fs.mkdirSync(outDir, { recursive: true });

  for (const route of routes) {
    const slug = route.path === "/" ? "home" : route.path.replace(/^\/|\/$/g, "").replace(/\//g, "-");
    for (const width of WIDTHS) {
      for (const theme of THEMES) {
        const { context, page } = await openPage(browser, { width, theme, path: route.path });
        const name = `${slug}-${width}-${theme}.png`;
        const file = path.join(outDir, name);
        await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
        await context.close();

        if (!AUDIT_BASELINE) continue;
        const reference = path.join(AUDIT_BASELINE, name);
        if (!fs.existsSync(reference)) {
          lines.push(`${name}: no baseline frame, captured only`);
          continue;
        }
        const differing = diffPng(fs.readFileSync(reference), fs.readFileSync(file), SHOT_CHANNEL_TOLERANCE);
        if (differing === -1) {
          failures.push(`${name}: size differs from baseline`);
        } else if (differing > SHOT_DIFF_TOLERANCE_PX) {
          failures.push(`${name}: ${differing} pixels differ from baseline`);
        } else {
          lines.push(`${name}: identical to baseline`);
        }
      }
    }
  }

  lines.push(`shots written to ${outDir}${AUDIT_BASELINE ? ` (compared against ${AUDIT_BASELINE})` : " (set AUDIT_BASELINE to compare)"}`);
  return { name: "shots", failures, lines };
}
