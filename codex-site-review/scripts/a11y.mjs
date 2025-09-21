import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
const PAGES = (process.env.PAGES||"/").split(",").map(s=>s.trim());
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }
const browser = await chromium.launch({ headless: true });
let out = [`# Accessibility (axe)\nBase URL: ${BASE_URL}\n`];
for (const path of PAGES) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const target = new URL(path, BASE_URL).toString();
  await page.goto(target, { waitUntil: "domcontentloaded" });
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations || [];
  out.push(`\n## ${target}\n- Violations: **${violations.length}**`);
  for (const v of violations) {
    out.push(`- **${v.id}**: ${v.help} (${v.impact||"unknown"})`);
  }
  await context.close();
}
writeFileSync("reports/a11y.md", out.join("\n"));
await browser.close();
