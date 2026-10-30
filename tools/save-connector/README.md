# The save connector

A small local connector for Claude Desktop that reads your Skyrim saves on this PC with the planner's own save reader. Your Claude can then update where you stand from your latest save: level, XP, day, place, skills, the lute, and each quest's highest stage. The save file never leaves your PC; only those fields go to the planner, and only when your Claude passes them to `set_snapshot`.

It has two tools:

- `read_latest_save` reads your newest save. Ask for a character ("Kyria Severa") and, if your newest save is someone else's, it reads that character's newest instead and says so. If there's no save of them, it lists your five newest saves so you can pick one.
- `list_saves` lists your newest saves by character, with level, place, save number and when.

It reads your 18 skills (checked against Kyria's skills menu) and, with Skyrim's Got Talent, your lute skill as the count `lute`.

## Add it to Claude Desktop

1. In the planner's folder, build it: `node tools/save-connector/build.mjs`. It writes `tools/save-connector/dist/save-connector.mcpb`. Node 18 or newer is enough, and so is the planner's own `npm ci`.
2. In Claude Desktop, open **Settings**, then **Extensions**, then **Advanced settings**, and choose **Install Extension…**. Pick `save-connector.mcpb`. (Double-clicking the file does the same.)
3. Claude Desktop shows the LoreRim save connector and its one setting, **Save folders**. The default reads every profile's saves under `C:\LoreRim` and the game's own `Documents\My Games\Skyrim Special Edition\Saves`. Change it if your LoreRim folder is somewhere else, then choose **Install**.
4. Make sure it's switched on in **Settings**, then **Extensions**, and that the planner's connector (the door) is connected too.
5. Ask your Claude: "Read my latest save for Kyria Severa and update her playthrough." It reads the save with `read_latest_save` and passes the `snapshot` it found to the planner's `set_snapshot` unchanged. Where you stand and the quest objectives fill in on Play.

To update it later, build it again and install the new `save-connector.mcpb` over the old one.

## How it works

`server.ts` speaks MCP over stdio with no packages and uses `src/lib/save/connector.ts` and `src/lib/save/read.ts`, the same reader the site's Read a save uses. `build.mjs` bundles them into `dist/server/index.js`, copies `quest_forms.json` (which save form is which planner quest) beside it, and zips both with `manifest.json`. Run it by hand to see what it answers:

```
node tools/save-connector/dist/server/index.js "C:\LoreRim"
```

then send it one JSON-RPC message a line (`initialize`, `tools/list`, `tools/call`).

## Out of the launch (WO-182)

The planner has no playthroughs yet, so both tools answer that they are out of the launch and do nothing else (`server.ts`, `PAUSED`). `SAVE_CONNECTOR=on` in the connector's environment brings them back as they were; the reader under them is untouched.
