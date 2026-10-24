#!/usr/bin/env python3
"""Typographic Open Graph image. No faces, no AUB logo, no patient imagery.

The October card and favicon-october.svg use the ribbon-mark path from index.html.
"""

import io
import re
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
W, H = 1200, 630
CREAM = (255, 250, 241)
PLUM = (45, 24, 41)
PLUM_BAND = (68, 31, 65)
ROSE = (194, 24, 91)

SERIF_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def wrap(draw, text, font, max_width):
    words = text.split()
    lines, line = [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit_size(draw, lines, font_path, max_width, start, minimum):
    size = start
    while size > minimum:
        font = ImageFont.truetype(font_path, size)
        if all(draw.textlength(line, font=font) <= max_width for line in lines):
            return font, size
        size -= 2
    font = ImageFont.truetype(font_path, minimum)
    return font, minimum


def ribbon_source():
    """The one ribbon path. index.html is the source; do not redraw it here."""
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    match = re.search(
        r'<symbol id="ribbon-mark" viewBox="([^"]+)"[^>]*>\s*<path\b[^>]*\bd="([^"]+)"',
        html,
    )
    if not match:
        raise SystemExit("ribbon-mark path missing from index.html")
    return match.group(1), match.group(2)


def ribbon_path(d_attr):
    """Stroke the page path. Do not fill it, and do not add a ring."""
    return (
        f'<path fill="none" stroke="#c2185b" stroke-width="15" '
        f'stroke-linecap="round" stroke-linejoin="round" d="{d_attr}"/>'
    )


def ribbon_png(d_attr, viewbox, height=220):
    _minx, _miny, vw, vh = (float(n) for n in viewbox.split())
    scale = height / vh
    w = max(1, round(vw * scale))
    h = max(1, round(vh * scale))
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{viewbox}">'
        f"{ribbon_path(d_attr)}"
        "</svg>"
    )
    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"))
    return Image.open(io.BytesIO(png)).convert("RGBA")


def write_october_favicon(d_attr, viewbox):
    """Same stroked path and rose as the page, on a cream plate."""
    minx, miny, vw, vh = (float(n) for n in viewbox.split())
    pad = 1.6
    inner = 32 - 2 * pad
    sc = min(inner / vw, inner / vh)
    tx = (32 - vw * sc) / 2 - minx * sc
    ty = (32 - vh * sc) / 2 - miny * sc
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
        '<rect width="32" height="32" rx="6" fill="#fffaf1"/>'
        f'<g transform="translate({tx:.3f} {ty:.3f}) scale({sc:.5f})">{ribbon_path(d_attr)}</g>'
        "</svg>\n"
    )
    (ROOT / "favicon-october.svg").write_text(svg, encoding="utf-8")


def write_october():
    """October card. Typographic, with the page's ribbon mark. No faces, no logo."""
    rose = ROSE
    ink = PLUM
    soft = (92, 61, 82)
    viewbox, mark = ribbon_source()
    write_october_favicon(mark, viewbox)
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 14], fill=rose)
    ribbon = ribbon_png(mark, viewbox, 250)
    img.paste(ribbon, (W - 56 - ribbon.width, (H - ribbon.height) // 2), ribbon)

    x = 72
    max_w = 860

    kicker_f = ImageFont.truetype(SANS_BOLD, 22)
    body_f = ImageFont.truetype(SANS, 30)
    foot_f = ImageFont.truetype(SANS, 22)

    title_lines = [
        "Breast cancer is the",
        "most common cancer",
        "in Lebanon.",
    ]
    title_f, title_size = fit_size(d, title_lines, SERIF_BOLD, max_w, 72, 48)
    line_h = int(title_size * 1.12)

    support = (
        "3,404 new cases in 2024, 19.2% of all new cancers. "
        "IARC GLOBOCAN 2024."
    )
    body_lines = wrap(d, support, body_f, max_w)

    kicker_h = 28
    rule_gap = 22
    rule_h = 5
    after_rule = 32
    after_title = 28
    body_h = 42 * len(body_lines)
    block = kicker_h + rule_gap + rule_h + after_rule + line_h * len(title_lines) + after_title + body_h
    footer_top = H - 78
    y = max(48, int((footer_top - block) / 2))

    d.text((x, y), "WICHE ONCOLOGY ENDOWED FUND", font=kicker_f, fill=rose)
    y += kicker_h + rule_gap
    d.rectangle([x, y, x + 88, y + rule_h], fill=rose)
    y += rule_h + after_rule

    for line in title_lines:
        d.text((x, y), line, font=title_f, fill=ink)
        y += line_h

    y += after_title
    for line in body_lines:
        d.text((x, y), line, font=body_f, fill=soft)
        y += 42

    d.text(
        (x, footer_top),
        "A named endowment at AUBMC.",
        font=foot_f,
        fill=rose,
    )

    img.save(ROOT / "og-image-october.png", "PNG", optimize=True)


def main():
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    kicker_f = ImageFont.truetype(SANS_BOLD, 20)
    title_f = ImageFont.truetype(SERIF_BOLD, 86)
    body_f = ImageFont.truetype(SANS, 30)

    x = 72
    max_w = W - 144

    title_lines = ["WICHE Oncology", "Endowed Fund"]
    desc = (
        "Cancer care at AUBMC is priced in dollars. Since 2019 the Lebanese "
        "pound has lost 98 percent of its value. This endowment pays for "
        "treatment so a diagnosis is not the bill that stops care."
    )
    body_lines = wrap(d, desc, body_f, max_w)

    kicker_h = 28
    title_h = 96 * len(title_lines)
    rule_h = 28
    body_h = 40 * len(body_lines)
    block = kicker_h + title_h + rule_h + body_h
    y = int((H - block) / 2) - 8

    d.text((x, y), "A NAMED ENDOWMENT AT AUBMC", font=kicker_f, fill=PLUM_BAND)
    y += kicker_h + 18

    for line in title_lines:
        d.text((x, y), line, font=title_f, fill=PLUM)
        y += 96

    y += 4
    d.rectangle([x, y, x + 88, y + 4], fill=PLUM_BAND)
    y += 32

    for line in body_lines:
        d.text((x, y), line, font=body_f, fill=PLUM)
        y += 40

    img.save(ROOT / "og-image.png", "PNG", optimize=True)

    icon = Image.new("RGB", (180, 180), PLUM_BAND)
    di = ImageDraw.Draw(icon)
    letter = ImageFont.truetype(SERIF_BOLD, 110)
    bbox = di.textbbox((0, 0), "W", font=letter)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    di.text(
        ((180 - tw) / 2 - bbox[0], (180 - th) / 2 - bbox[1] - 4),
        "W",
        font=letter,
        fill=CREAM,
    )
    icon.save(ROOT / "apple-touch-icon.png", "PNG", optimize=True)
    write_october()


if __name__ == "__main__":
    main()
