// Every audit threshold lives here. Nothing else in scripts/audit hard-codes a limit.

export const AUDIT_URL = (process.env.AUDIT_URL || "http://localhost:3001").replace(/\/$/, "");
export const AUDIT_BASELINE = process.env.AUDIT_BASELINE || "";
export const AUDIT_OUT = process.env.AUDIT_OUT || "";

/** Viewport widths every visual check runs at. */
export const WIDTHS = [320, 375, 768, 1440];
/** Viewport height used while measuring; full-page shots ignore it. */
export const VIEWPORT_HEIGHT = 900;
/** Both themes are first-class; neither is allowed to fail a check. */
export const THEMES = ["light", "dark"];

/** WCAG AA. */
export const CONTRAST_NORMAL = 4.5;
export const CONTRAST_LARGE = 3;
/** Text counts as large at >= 24px, or >= 18.66px when the weight is >= 700. */
export const LARGE_TEXT_PX = 24;
export const LARGE_BOLD_PX = 18.66;
export const LARGE_BOLD_WEIGHT = 700;

/**
 * WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — enforced.
 * A target passes at 24x24 CSS px, or by spacing: a 24px-diameter circle
 * centred on its bounding box must not intersect another target or another
 * undersized target's circle.
 */
export const TARGET_MIN_AA = 24;

/**
 * SC 2.5.5 Target Size (Enhanced), Level AAA, and the Apple HIG figure —
 * reported, never enforced. Falling short of it is not a standards failure.
 */
export const TARGET_MIN_AAA = 44;

/** Allowed horizontal overflow of the document, in CSS pixels. */
export const OVERFLOW_TOLERANCE_PX = 0;

/** Screenshot settings. */
export const DEVICE_SCALE_FACTOR = 2;
export const SHOT_DIFF_TOLERANCE_PX = 0;
/** Per-channel difference below which two pixels count as identical. */
export const SHOT_CHANNEL_TOLERANCE = 0;

/**
 * Excluded from the target checks: links that sit inside running text rather
 * than standing alone as controls. SC 2.5.8 exempts these under "inline".
 */
export const HIT_TARGET_EXEMPT = [
  ".markdown-content p a",
  ".markdown-content li a",
  ".markdown-content td a",
  ".plain-row h3 a",
];
