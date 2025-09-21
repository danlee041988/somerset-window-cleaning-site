import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
if (!BASE_URL) { console.error("ERROR: Set URL"); process.exit(1); }
const res = await fetch(BASE_URL, { redirect: "manual" });
const wanted = ["content-security-policy","x-frame-options","x-content-type-options","referrer-policy","strict-transport-security","permissions-policy","cross-origin-opener-policy","cross-origin-resource-policy"];
let md = [`# Security Headers`, `URL: ${BASE_URL}\n`];
for (const h of wanted) {
const v = res.headers.get(h);
md.push(`- ${h}: ${v ? "`"+v+"`" : "**MISSING**"}`);
}
writeFileSync("reports/security-headers.md", md.join("\n"));
