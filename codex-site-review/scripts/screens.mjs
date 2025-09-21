import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
const PAGES = (process.env.PAGES||"/").split(",").map(s=>s.trim());
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }
mkdirSync("artifacts/screens", { recursive: true });
const browser = await chromium.launch({ headless: true });
const contexts = [
{ name: "mobile",   viewport: { width: 390, height: 844 }, userAgent: "Mozilla/5.0 iPhone" },
{ name: "desktop",  viewport: { width: 1440, height: 900 } }
];
let md = ["# Screenshots\n"];
for (const ctx of contexts) {
const context = await browser.newContext({ viewport: ctx.viewport, userAgent: ctx.userAgent });
const page = await context.newPage();
md.push(`\n## ${ctx.name}`);
for (const path of PAGES) {
 const target = new URL(path, BASE_URL).toString();
 await page.goto(target, { waitUntil: "networkidle" });
 const fname = `artifacts/screens/${ctx.name}-${path.replace(/[^a-z0-9]+/gi,"_")||"home"}.png`;
 await page.screenshot({ path: fname, fullPage: true });
 md.push(`- ${target}: ${fname}`);
}
await context.close();
}
writeFileSync("reports/screens.md", md.join("\n"));
await browser.close();
