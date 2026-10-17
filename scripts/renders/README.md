# Item renders (spike)

A private experiment: render LoreRim items to images from the game's own models and textures. Not
part of the app; nothing here is used by `src/`.

On a PC with LoreRim installed, Blender 4.5 LTS and the PyNifly add-on (29.1.0):

```
LORERIM_ROOT=C:/LoreRim python scripts/renders/fetch.py <work>
blender --background --python scripts/renders/render.py -- <work>/<item> <renders>/<item>
python scripts/renders/finish.py <renders> renders-spike <item> ...
```

- `fetch.py` finds each item's winning record and its model (WEAP `MODL`, ARMO `MOD2`), then pulls the
  `.nif` and the `.dds` files it names from wherever the game would load them: loose files in MO2
  priority order, then BSAs, later archives winning. It writes `<work>/items.json` with where each
  file came from (copied here as `renders-spike/sources.json`).
- `render.py` imports the NIF with PyNifly, turns it the way the game's inventory shows it (the
  NIF's `BSInvMarker`), hides the scabbard and effect shapes, and renders with EEVEE on a transparent
  background: a fixed three-quarter view (35 degrees round, 20 up) and a soft area light from the top
  left. A 512 px still and 24 turntable frames at 256 px.
- `finish.py` makes the sprite sheet (6 by 4) and the 64 px pixelated still (Pillow).

Keep `<work>` and `<renders>` on a short path: Blender's Python can't open paths past Windows' 260
characters.
