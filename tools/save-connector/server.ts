/**
 * The save connector (WO-112 Part 3): a local MCP server for Claude Desktop that reads the player's Skyrim SE
 * saves on their PC with the planner's own reader and answers with what it found, never the file. Two tools:
 * read_latest_save and list_saves. It speaks MCP over stdio (one JSON-RPC message a line) with no packages,
 * so the bundle is one file.
 *
 * The save folders come as arguments (the extension's setting), then SAVE_FOLDERS (separated by ;), then the
 * defaults: every profile's saves under C:\LoreRim, and Documents\My Games\Skyrim Special Edition\Saves.
 */
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { defaultFolders, listSaves, loadForms, readLatest } from "../../src/lib/save/connector";
import { SaveError } from "../../src/lib/save/read";

const here = typeof __dirname !== "undefined" ? __dirname : process.cwd(); // the bundle is CommonJS, so __dirname is there
const given = process.argv.slice(2).flatMap((a) => a.split(";")).map((a) => a.trim()).filter(Boolean);
const folders = given.length ? given : (process.env.SAVE_FOLDERS ?? "").split(";").map((a) => a.trim()).filter(Boolean);
const FOLDERS = folders.length ? folders : defaultFolders(homedir());
const FORMS = loadForms([join(here, "quest_forms.json"), join(here, "..", "..", "src", "data", "lorerim-5.0.4.8", "quest_forms.json")]);

const TOOLS = [
  {
    name: "read_latest_save",
    title: "Read the latest save",
    description:
      "Read the player's newest Skyrim save on this PC: name, level, XP, day, place, save number and each quest's highest stage, never the file. With character, and the newest save is someone else's, it reads that character's newest save instead and says so; with no save of that character, it lists the five newest saves for the player to choose from. Pass `snapshot` to the planner's set_snapshot unchanged.",
    inputSchema: { type: "object", properties: { character: { type: "string", description: "The character's name, as the save has it: \"Kyria Severa\"." } }, additionalProperties: false },
  },
  {
    name: "list_saves",
    title: "List the saves",
    description: "List the newest saves in the save folders, newest first: the file, the character, their level, place and save number, and when it was saved. With character, only theirs.",
    inputSchema: {
      type: "object",
      properties: { character: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 50, description: "How many; 10 if not given." } },
      additionalProperties: false,
    },
  },
];

function call(name: string, args: Record<string, unknown>) {
  const character = typeof args.character === "string" && args.character.trim() ? args.character : undefined;
  if (name === "read_latest_save") return readLatest(FOLDERS, FORMS, character);
  if (name === "list_saves") {
    const limit = typeof args.limit === "number" ? Math.max(1, Math.min(50, Math.floor(args.limit))) : 10;
    const saves = listSaves(FOLDERS, { character, limit });
    return { folders: FOLDERS, saves, ...(saves.length ? {} : { note: character ? `There's no save of ${character} in the save folders.` : "There are no saves in the save folders." }) };
  }
  throw new Error(`There's no tool called ${name}.`);
}

function answer(id: unknown, result: unknown) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}
function refuse(id: unknown, code: number, message: string) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let msg: { id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    msg = JSON.parse(line);
  } catch {
    return refuse(null, -32700, "That message isn't JSON.");
  }
  const { id, method, params = {} } = msg;
  if (id === undefined) return; // a notification (initialized, cancelled): nothing to answer
  if (method === "initialize")
    return answer(id, {
      protocolVersion: typeof params.protocolVersion === "string" ? params.protocolVersion : "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "lorerim-save-connector", title: "LoreRim save connector", version: "1.0.0" },
      instructions: "Reads the player's Skyrim saves on this PC for the LoreRim Build Planner. Pass read_latest_save's snapshot to set_snapshot unchanged.",
    });
  if (method === "ping") return answer(id, {});
  if (method === "tools/list") return answer(id, { tools: TOOLS });
  if (method === "tools/call") {
    const name = String(params.name ?? "");
    try {
      const result = call(name, (params.arguments as Record<string, unknown>) ?? {});
      return answer(id, { content: [{ type: "text", text: JSON.stringify(result, null, 1) }], structuredContent: result });
    } catch (e) {
      const text = e instanceof SaveError ? `The save didn't read: ${e.message}` : e instanceof Error ? e.message : "That didn't work.";
      return answer(id, { content: [{ type: "text", text }], isError: true });
    }
  }
  refuse(id, -32601, `There's no method called ${method}.`);
});
