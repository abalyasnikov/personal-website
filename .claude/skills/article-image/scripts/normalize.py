#!/usr/bin/env python3
"""Normalize an illustration's paper background to the site's light canvas.

Usage: python3 normalize.py FILE [FILE ...]

Generated paper tones drift warm (cream) against the site's `--canvas`
(#FAF9F6). This measures the background from the image corners and applies a
per-channel gain that maps it onto the canvas exactly, in place. Ink stays
near black; the accent keeps its saturation (channels clamp at 255).
"""

import statistics
import sys

from PIL import Image

CANVAS = (250, 249, 246)  # --canvas light, #FAF9F6


def background(im: Image.Image) -> tuple[int, int, int]:
    px = []
    for x0, y0 in [(30, 30), (im.width - 60, 30), (30, im.height - 60)]:
        for dx in range(0, 30, 5):
            for dy in range(0, 30, 5):
                px.append(im.getpixel((x0 + dx, y0 + dy)))
    return tuple(int(statistics.median(c[i] for c in px)) for i in range(3))


def main() -> None:
    for path in sys.argv[1:]:
        im = Image.open(path).convert("RGB")
        bg = background(im)
        gains = [CANVAS[i] / bg[i] for i in range(3)]
        lut = [min(255, round(v * gains[i])) for i in range(3) for v in range(256)]
        im = im.point(lut)
        im.save(path)
        print(f"{path}: bg {'#%02X%02X%02X' % bg} -> #FAF9F6")


if __name__ == "__main__":
    main()
