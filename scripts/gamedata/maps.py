"""
The site's map of Skyrim (WO-166 Part 2), from LoreRim's own paper map: Skyrim Paper Map by Caro Tuts, whose author cleared its
use here with a credit and a link (Dave, 27 Oct 2026). Only Skyrim's map is cleared; Solstheim's and the mod lands' are other
authors', so nothing is built for them.
  python3 scripts/gamedata/maps.py [version]

Reads the winning copy of textures/terrain/tamriel/skyrim.dds in the profile's load order (8192 x 8192, DXT5) and writes
  public/maps/tamriel/<zoom>/<x>_<y>.webp   512 px tiles at two zooms: 1 is the full 8192, 0 is half (4096). Only tiles that touch
                                            the map are written: the picture has black margins above and below its frame.
  public/maps/tamriel.webp                  the whole map in one picture, about 2000 px wide, cropped to the map's own frame
  src/data/lorerim-<version>/maps.json      per world (Tamriel): the picture's size, the frame, the tile grid, the rule from a game
                                            position to a pixel, and the credit (so the site never types it)

The rule: the texture covers the world's whole map area, 64 game units to a pixel with the origin in the middle,
  pixel x = 4096 + x / 64,  pixel y = 4096 - y / 64   on the 8192 image
(Bob's proof, checked on Lake Ilinalta, Lake Honrich and Riverwood; WO-166's log checks it again on three more places). The whole-map
picture is the frame's crop of that, scaled to its width: `toWhole` does it.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import esp  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
TEXTURE = "textures/terrain/tamriel/skyrim.dds"
SIZE = 8192  # the texture's side, in pixels
ORIGIN = SIZE // 2  # the pixel the game's (0, 0) falls on, both ways
UNITS_PER_PIXEL = 64.0  # game units to a pixel of the 8192 image
TILE = 512
ZOOMS = {0: 4096, 1: 8192}  # zoom -> the side of the whole map at that zoom, in pixels (1 is the full 8192)
WHOLE_WIDTH = 2000
TILE_QUALITY, WHOLE_QUALITY = 82, 85
FRAME_ALPHA = 8  # the margins above and below the frame are transparent (alpha 0); the frame itself is opaque
CREDIT = {"text": "Skyrim Paper Map by Caro Tuts", "url": "https://www.nexusmods.com/skyrimspecialedition/mods/62705"}


def to_pixel(x, y):
    """A game position in Tamriel -> a pixel of the 8192 image."""
    return ORIGIN + x / UNITS_PER_PIXEL, ORIGIN - y / UNITS_PER_PIXEL


def tile_grid(border, side, tile=TILE):
    """The tiles (column range, row range, inclusive) that touch the frame at a zoom whose whole map is `side` pixels."""
    k = side / SIZE
    x0, y0, x1, y1 = (v * k for v in border)
    return (int(x0 // tile), int((x1 - 1) // tile)), (int(y0 // tile), int((y1 - 1) // tile))


def entry(border, width, height):
    """Tamriel's entry in maps.json. `border` is the frame on the 8192 image as (x0, y0, x1, y1), the end exclusive."""
    zooms = []
    for z, side in sorted(ZOOMS.items()):
        (c0, c1), (r0, r1) = tile_grid(border, side)
        zooms.append({"z": z, "size": side, "columns": [c0, c1], "rows": [r0, r1]})
    return {
        "world": "Tamriel",
        "credit": dict(CREDIT),
        # A game position's pixel on the 8192 image: x = origin + gameX / unitsPerPixel, y = origin - gameY / unitsPerPixel.
        "texture": {"width": SIZE, "height": SIZE, "origin": [ORIGIN, ORIGIN], "unitsPerPixel": UNITS_PER_PIXEL},
        # The map's own frame on that image (x0, y0, x1, y1; the end exclusive). The whole-map picture is this crop.
        "border": list(border),
        "image": {"url": "/maps/tamriel.webp", "width": width, "height": height},
        "tiles": {"url": "/maps/tamriel/{z}/{x}_{y}.webp", "size": TILE, "zooms": zooms},
    }


def to_whole(m, x, y):
    """A game position -> a pixel of the whole-map picture (maps.json's own numbers, as the Mac side reads them)."""
    t, (bx0, by0, bx1, by1), img = m["texture"], m["border"], m["image"]
    px = t["origin"][0] + x / t["unitsPerPixel"]
    py = t["origin"][1] - y / t["unitsPerPixel"]
    return (px - bx0) * img["width"] / (bx1 - bx0), (py - by0) * img["height"] / (by1 - by0)


def build(version="5.0.4.8", source=None):
    from PIL import Image

    Image.MAX_IMAGE_PIXELS = None
    source = source or esp.winning_asset(TEXTURE)
    if not source:
        raise SystemExit(f"no {TEXTURE} anywhere in the load order")
    im = Image.open(source)
    if im.size != (SIZE, SIZE):
        raise SystemExit(f"{source} is {im.size}, not {SIZE} x {SIZE}: the rule from a position to a pixel assumes the whole map area")
    im.load()
    box = im.getchannel("A").point(lambda v: 255 if v > FRAME_ALPHA else 0).getbbox()
    rgb = im.convert("RGB")
    out = os.path.join(REPO, "public", "maps")
    written = 0
    for z, side in sorted(ZOOMS.items()):
        layer = rgb if side == SIZE else rgb.resize((side, side), Image.LANCZOS)
        (c0, c1), (r0, r1) = tile_grid(box, side)
        folder = os.path.join(out, "tamriel", str(z))
        os.makedirs(folder, exist_ok=True)
        for old in os.listdir(folder):
            os.remove(os.path.join(folder, old))  # a tile the grid no longer wants is not left behind
        for ty in range(r0, r1 + 1):
            for tx in range(c0, c1 + 1):
                layer.crop((tx * TILE, ty * TILE, (tx + 1) * TILE, (ty + 1) * TILE)).save(
                    os.path.join(folder, f"{tx}_{ty}.webp"), "WEBP", quality=TILE_QUALITY, method=6)
                written += 1
    frame = rgb.crop(box)
    height = round(frame.height * WHOLE_WIDTH / frame.width)
    frame.resize((WHOLE_WIDTH, height), Image.LANCZOS).save(os.path.join(out, "tamriel.webp"), "WEBP", quality=WHOLE_QUALITY, method=6)
    maps = {"Tamriel": entry(box, WHOLE_WIDTH, height)}
    path = os.path.join(REPO, "src", "data", f"lorerim-{version}", "maps.json")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(maps, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{written} tiles, tamriel.webp {WHOLE_WIDTH} x {height}, frame {box} -> public/maps and maps.json (from {source})")
    return maps


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8")
