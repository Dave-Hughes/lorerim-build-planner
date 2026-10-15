// Screenshot helper for checking screens against the design canvas.
// node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage 0|1] [clickText] [selector]
// SCALE=2 takes it at 2x (the device pixel ratio), for images the site shows (WO-84).
import { chromium } from "playwright-core";
import fs from "node:fs";
const [url, out, w = "1440", h = "2200", full = "1", click = "", selector = ""] = process.argv.slice(2);
const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
const context = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: Number(process.env.SCALE) || 1 });
if (process.env.SESSION_TOKEN) await context.addCookies([{ name: "authjs.session-token", value: process.env.SESSION_TOKEN, domain: "localhost", path: "/" }]);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
await page.goto(url, { waitUntil: "load" });
if (click) { await page.getByText(click, { exact: true }).first().click(); await page.waitForTimeout(300); }
await page.waitForTimeout(400);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
if (overflow > 0) errors.push(`page overflows horizontally by ${overflow}px`);
if (selector) await page.locator(selector).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage: full === "1" });
console.log(errors.length ? errors.join("\n") : "no errors");
await browser.close();
