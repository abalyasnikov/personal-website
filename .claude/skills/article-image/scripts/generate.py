#!/usr/bin/env python3
"""Generate an article illustration via the Gemini image API.

Usage:
    GEMINI_API_KEY=... python3 generate.py OUTFILE [--model MODEL] [--ref IMAGE ...] [--og] < prompt.txt

The prompt is read from stdin. Generation is 16:9 (1376x768). With --og the
saved image is also center-cropped to a 1200x630 copy next to OUTFILE, named
OUTFILE with an `-og` suffix, via macOS `sips`.

The API key comes only from the GEMINI_API_KEY environment variable. Never
write the key into this repository.
"""

import argparse
import base64
import json
import mimetypes
import os
import pathlib
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models"
# scripts/ -> article-image/ -> skills/ -> .claude/ -> repository root
REPO_ROOT = pathlib.Path(__file__).resolve().parents[4]


def load_key() -> str:
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    env_file = REPO_ROOT / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            name, _, value = line.partition("=")
            if name.strip() == "GEMINI_API_KEY" and value.strip():
                return value.strip()
    sys.exit("GEMINI_API_KEY is not set (environment or .env.local).")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("outfile")
    ap.add_argument("--model", default="gemini-3.1-flash-image")
    ap.add_argument("--ref", action="append", default=[],
                    help="Reference image for style consistency; repeatable.")
    ap.add_argument("--og", action="store_true",
                    help="Also write a 1200x630 center-cropped -og copy.")
    args = ap.parse_args()

    key = load_key()

    parts = []
    for ref in args.ref:
        mime = mimetypes.guess_type(ref)[0] or "image/png"
        with open(ref, "rb") as f:
            data = base64.b64encode(f.read()).decode()
        parts.append({"inlineData": {"mimeType": mime, "data": data}})
    parts.append({"text": sys.stdin.read()})

    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {"aspectRatio": "16:9"},
        },
    }

    resp = None
    for attempt in range(5):
        req = urllib.request.Request(
            f"{API}/{args.model}:generateContent",
            data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json", "x-goog-api-key": key},
        )
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                resp = json.load(r)
            break
        except urllib.error.HTTPError as e:
            print(f"attempt {attempt + 1}: HTTP {e.code} {e.read().decode()[:300]}",
                  file=sys.stderr)
            if e.code == 429 and attempt < 4:
                time.sleep(20 * (attempt + 1))
            else:
                sys.exit(1)

    saved = False
    for part in resp["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            with open(args.outfile, "wb") as f:
                f.write(base64.b64decode(part["inlineData"]["data"]))
            saved = True
        elif part.get("text", "").strip():
            print(f"[model text] {part['text'][:200]}", file=sys.stderr)
    if not saved:
        sys.exit(f"no image in response for {args.outfile}")
    print("saved", args.outfile)

    if args.og:
        root, ext = os.path.splitext(args.outfile)
        og = f"{root}-og{ext}"
        shutil.copyfile(args.outfile, og)
        subprocess.run(["sips", "--resampleWidth", "1200", og],
                       check=True, capture_output=True)
        subprocess.run(["sips", "-c", "630", "1200", og],
                       check=True, capture_output=True)
        print("saved", og)


if __name__ == "__main__":
    main()
