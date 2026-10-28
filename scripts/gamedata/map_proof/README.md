# The map proof (Bob, 27 Oct 2026)

Run on the PC against `C:\LoreRim` to prove a pixel map of Skyrim can be made from the game's own files. Throwaway code: WO-166 turns it into a real build step.

- `walk.py <Skyrim.esm> <out>`: every Tamriel cell's terrain heights (LAND VHGT, 8x8 samples a cell), water levels (XCLW) and every map marker's position (REFR with XMRK). Writes `tamriel.npz` and `markers.json`. About 4 seconds.
- `tex.py <Skyrim.esm>`: each cell's four base ground textures (LAND BTXT, LTEX editor ids such as LSnow01, LFallForestDirt01, LReachDirt01). Writes `tex.json`.
- `walk2.py`: every place in `places_raw.json` (packed as `targets.b64`) resolved to a position, from its map marker or its location's marker (LCTN MNAM), reading the plugins that own them in the active profile's load order (`lo.json`, from `paths.py`).
- `render.py`: colours each cell by its ground texture, shades by height, marks water below the cell's water level, reduces to pixels, pins the places.

What it showed: 286 places pinned on Tamriel, 35 more in a town, 210 not found (44 Solstheim, about 90 in mods' own worldspaces, about 40 in Skyrim: war camps, underground places, other worlds); 34 places listed twice.
