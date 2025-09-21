import { JSDOM } from "jsdom";
import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
const PAGES = (process.env.PAGES||"/").split(",").map(s=>s.trim());
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }
let md = [`# SEO Checks`, `Base: ${BASE_URL}\n`];
const fetchDoc = async (u) => {
const html = await (await fetch(u)).text();
return new JSDOM(html).window.document;
};
for (const path of PAGES) {
const target = new URL(path, BASE_URL).toString();
const d = await fetchDoc(target);
const title = d.querySelector("title")?.textContent?.trim()||"";
const desc = d.querySelector('meta[name="description"]')?.getAttribute("content")||"";
const canon = d.querySelector('link[rel="canonical"]')?.getAttribute("href")||"";
const h1 = d.querySelector("h1")?.textContent?.trim()||"";
const ogImage = d.querySelector('meta[property="og:image"]')?.getAttribute("content")||"";
const robots = d.querySelector('meta[name="robots"]')?.getAttribute("content")||"";
md.push(`\n## ${target}
- Title (${title.length}): ${title||"**MISSING**"}
- Meta description (${desc.length}): ${desc||"**MISSING**"}
- Canonical: ${canon||"**MISSING**"}
- H1: ${h1||"**MISSING**"}
- og:image: ${ogImage||"**MISSING**"}
- robots meta: ${robots||"(none)"}
`);
}
writeFileSync("reports/seo.md", md.join("\n"));
