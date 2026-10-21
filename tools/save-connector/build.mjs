// Builds the save connector (WO-112 Part 3): node tools/save-connector/build.mjs
// Bundles server.ts and the planner's reader into one file, copies quest_forms.json beside it, and packs both
// with manifest.json into save-connector.mcpb, the file Claude Desktop installs (a zip; manifest.json at its root).
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "dist");
mkdirSync(join(dist, "server"), { recursive: true });
await build({
  entryPoints: [join(here, "server.ts")],
  outfile: join(dist, "server", "index.js"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node18",
  logLevel: "warning",
});
const forms = readFileSync(join(here, "..", "..", "src", "data", "lorerim-5.0.4.8", "quest_forms.json"));
writeFileSync(join(dist, "server", "quest_forms.json"), forms);
const files = [
  ["manifest.json", readFileSync(join(here, "manifest.json"))],
  ["server/index.js", readFileSync(join(dist, "server", "index.js"))],
  ["server/quest_forms.json", forms],
];
writeFileSync(join(dist, "save-connector.mcpb"), zip(files));
console.log(`built ${join(dist, "save-connector.mcpb")}`);

/** A zip of the files, stored (not compressed): enough for an extension of a few hundred KB. */
function zip(entries) {
  const table = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (b) => {
    let c = 0xffffffff;
    for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const locals = [];
  const central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const n = Buffer.from(name);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(n.length, 26);
    locals.push(local, n, data);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0);
    c.writeUInt16LE(20, 4);
    c.writeUInt16LE(20, 6);
    c.writeUInt32LE(crc, 16);
    c.writeUInt32LE(data.length, 20);
    c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(n.length, 28);
    c.writeUInt32LE(offset, 42);
    central.push(c, n);
    offset += 30 + n.length + data.length;
  }
  const dir = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dir, end]);
}
