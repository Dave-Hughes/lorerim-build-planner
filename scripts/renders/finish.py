"""
Spike: turns render.py's output into the three images per item.

  python scripts/renders/finish.py <render dir> <out dir> <item> [<item> ...]

For each item, from <render dir>/<item>/ (still.png and turn/0000-0023.png), writes to <out>/<item>/:
  still.png       the 512 px render
  turntable.png   the 24 turntable frames as a sprite sheet, 6 across by 4 down, 256 px each
  pixel-64.png    the still at 64 px, pixelated: cropped to the item, box-filtered down, hard alpha,
                  a 24-colour palette
  pixel-64-x8.png the same blown up 8x with no smoothing, to look at
"""
import glob
import os
import shutil
import sys

from PIL import Image

COLS, ROWS, CELL = 6, 4, 256


def sheet(frames):
    out = Image.new("RGBA", (COLS * CELL, ROWS * CELL), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        out.paste(Image.open(f).convert("RGBA"), ((i % COLS) * CELL, (i // COLS) * CELL))
    return out


def pixelate(still, size=64, colours=24, margin=2):
    """Cropped to the item (square, `margin` px of the result spare), box-filtered down, hard alpha, few colours."""
    still = still.convert("RGBA")
    l, t, r, b = still.getchannel("A").point(lambda a: 255 if a >= 16 else 0).getbbox()
    side = int(max(r - l, b - t) * size / (size - 2 * margin))
    cx, cy = (l + r) // 2, (t + b) // 2
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(still.crop((cx - side // 2, cy - side // 2, cx - side // 2 + side, cy - side // 2 + side)), (0, 0))
    small = square.resize((size, size), Image.BOX)
    alpha = small.getchannel("A").point(lambda a: 255 if a >= 110 else 0)
    rgb = small.convert("RGB").quantize(colors=colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def main(src, out, items):
    for item in items:
        d, o = os.path.join(src, item), os.path.join(out, item)
        os.makedirs(o, exist_ok=True)
        shutil.copy(os.path.join(d, "still.png"), os.path.join(o, "still.png"))
        frames = sorted(glob.glob(os.path.join(d, "turn", "*.png")))
        sheet(frames).save(os.path.join(o, "turntable.png"), optimize=True)
        px = pixelate(Image.open(os.path.join(d, "still.png")))
        px.save(os.path.join(o, "pixel-64.png"))
        px.resize((512, 512), Image.NEAREST).save(os.path.join(o, "pixel-64-x8.png"))
        print(item, len(frames), "frames ->", o)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
