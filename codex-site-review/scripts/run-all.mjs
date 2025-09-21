import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const BASE_URL = process.env.URL;
if (!BASE_URL) { console.error("ERROR: Set URL env var"); process.exit(1); }
const run = (cmd) => execSync(cmd, { stdio: "inherit" });

console.log("▶ Lighthouse…"); run("npm run audit:lighthouse");
console.log("▶ Accessibility (axe)…"); run("npm run audit:a11y");
console.log("▶ Links…"); run("npm run audit:links");
console.log("▶ Security headers…"); run("npm run audit:security");
console.log("▶ SEO checks…"); run("npm run audit:seo");
console.log("▶ Screenshots…"); run("npm run audit:screens");

writeFileSync("reports/_INDEX.md", `# Audit index

- [Lighthouse](./lighthouse.md)
- [Accessibility](./a11y.md)
- [Links](./links.md)
- [Security Headers](./security-headers.md)
- [SEO](./seo.md)
- [Screenshots](./screens.md)
`);
console.log("✅ All audits complete. See reports/_INDEX.md");
