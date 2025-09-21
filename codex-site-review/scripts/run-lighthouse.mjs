import lighthouse from "lighthouse";
import { launch as launchChrome } from "chrome-launcher";
import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }

const run = async (formFactor) => {
const chrome = await launchChrome({ chromeFlags: ["--headless=new"] });
const opts = { port: chrome.port, onlyCategories: ["performance","accessibility","seo","best-practices"], formFactor, screenEmulation: formFactor === "mobile" ? { mobile: true, width: 360, height: 720, deviceScaleFactor: 2, disabled: false } : { mobile: false, width: 1366, height: 768, deviceScaleFactor: 1, disabled: false } };
const config = { extends: "lighthouse:default" };
const runner = await lighthouse(BASE_URL, opts, config);
const cat = (k) => Math.round((runner.lhr.categories[k].score||0)*100);
const md = [
 `# Lighthouse (${formFactor})`,
 `URL: ${BASE_URL}`,
 "",
 `- Performance: **${cat("performance")}**`,
 `- Accessibility: **${cat("accessibility")}**`,
 `- Best Practices: **${cat("best-practices")}**`,
 `- SEO: **${cat("seo")}**`,
 "",
 "## Top opportunities",
 ...(runner.lhr.categories.performance.auditRefs
   .filter(a=>a.group==="load-opportunities")
   .map(a=>runner.lhr.audits[a.id])
   .filter(Boolean)
   .map(a=>`- ${a.title} — ${a.displayValue||""}`) || [])
].join("\n");
writeFileSync(`reports/lighthouse-${formFactor}.md`, md);
writeFileSync(`artifacts/lighthouse-${formFactor}.json`, JSON.stringify(runner.lhr,null,2));
await chrome.kill();
};

await run("mobile");
await run("desktop");
writeFileSync("reports/lighthouse.md", `# Lighthouse\n\n- See [mobile](./lighthouse-mobile.md) and [desktop](./lighthouse-desktop.md).\n`);
