import { LinkChecker } from "linkinator";
import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }
const checker = new LinkChecker({ recurse: true, timeout: 15000, linksToSkip: [/mailto:/, /tel:/] });
const results = await checker.check({ path: BASE_URL });
const bad = results.links.filter(l => l.state === "BROKEN");
let md = [`# Link Check`, `Base URL: ${BASE_URL}`, `Scanned: ${results.links.length} links`, `Broken: **${bad.length}**\n`];
bad.forEach(b => md.push(`- ${b.url} ← ${b.parent} (${b.status})`));
writeFileSync("reports/links.md", md.join("\n"));
