---
name: article-image
description: Generate the cover illustration for a writing post — a hand-drawn ink sketch with a single signal-blue accent on the site's light canvas, used in-article and as the post's 1200x630 OG image. Use when Andrey asks for an article image, a post cover, or an OG image for a post.
---

# Article image

Every post gets one illustration, used both inside the article and as its
social-share image. The style is a house style; describe it in its own terms
and do not name external publications or inspirations in any tracked file.

## Style contract (locked)

- Loose, confident hand-drawn black ink sketch — editorial-cartoon linework,
  slight paper texture, flat colors.
- Canvas is the site's light `--canvas` `#FAF9F6` exactly — a cool off-white,
  not cream, not ivory. Models drift warm, so every accepted image runs
  through `scripts/normalize.py`, which measures the paper tone and maps it
  onto the canvas value. Light canvas only; the image stays light in both
  site themes.
- Exactly one accent element in signal blue `#2B61FF`, and the accent is the
  point of the article (the thing doing the work in the metaphor). Everything
  else is black ink.
- One physical metaphor of the article's central mechanism, instantly
  readable. Not a mood illustration. The scene must work in the real world:
  a lighthouse beam lights a lane on the water, it does not carry boats
  through the sky. Before showing a variant, review it against the article —
  does each element have a reason, and would a stranger read the mechanism
  correctly? Reject compositions that fail this or drown the single accent
  in repetition.
- Generous negative space. Playful but restrained.
- No text, no letters. Two exceptions: a single simplified human figure when
  the article's mechanism needs the human in the scene (no faces, no
  portraits), and tiny hand-written semantic marks such as version tags when
  the metaphor needs them — generate those with the pro model.

Approved compositions live in `reference/`: `anchored-panels.png` (drifting
browser panels held in a row by a blue anchor), `plumb-line.png` (a blue plumb
line straightening crooked frames), `spec-stack.png` (a document stack with
one blue sheet pulled out). Pass one as `--ref` when a new generation should
match the established linework.

## Prompt template

> Editorial illustration in the style of a premium tech publication cover.
> Loose, confident hand-drawn black ink cartoon on a cool off-white
> background (#FAF9F6, not cream, not yellow), flat colors, slight paper
> texture. Concept, physically correct: {METAPHOR — one scene, with the
> single working element in cobalt blue (#2B61FF)}. Blue is the only color,
> everything else black ink linework. Generous negative space, playful but
> restrained, no text, no letters, no people.

## Workflow

1. Read the post in `content/writing/` and name its central mechanism.
2. Propose 2–3 metaphor options to Andrey. He picks; nothing ships without
   his choice.
3. Generate 2–3 variants per chosen metaphor with the bundled script. The key
   comes from the `GEMINI_API_KEY` environment variable, or from
   `.env.local` at the repository root (gitignored) as a fallback:

   ```bash
   python3 .claude/skills/article-image/scripts/generate.py out.png --og < prompt.txt
   ```

   Model `gemini-3.1-flash-image` is the default; use `--model
   gemini-3-pro-image` for compositions the flash model keeps getting wrong.
   Generation is 16:9 (1376x768); `--og` adds a 1200x630 center-cropped copy.
4. Andrey picks a variant. The pick runs through
   `scripts/normalize.py` (paper tone onto the exact canvas), then a center
   crop to 1200x630 saved as JPEG quality 82 — the paper grain keeps PNG
   near ten times heavier for no visible gain. The file goes to
   `public/og/<slug>.jpg`; keep the uncropped original out of the
   repository.
5. Wire the post metadata to the per-post image in
   `app/writing/[slug]/page.tsx` and, when the article should carry the
   illustration inline, reference it from the post Markdown.

## Rules

- The API key lives only in the `GEMINI_API_KEY` environment variable. Never
  write it into any file in this repository.
- Adding a new approved composition to `reference/` is a style decision:
  confirm with Andrey first.
- If the style contract needs to change (canvas, accent, linework), change
  this file first, then regenerate; do not drift one image at a time.
