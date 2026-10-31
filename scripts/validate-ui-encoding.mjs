import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const decoder = new TextDecoder("utf-8", { fatal: true });
const errors = [];
let checked = 0;
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!/\.(tsx?|css)$/.test(entry.name)) continue;
    checked++;
    try {
      const text = decoder.decode(fs.readFileSync(file));
      if (/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(text)) errors.push(`${file}: replacement or control character`);
    } catch { errors.push(`${file}: invalid UTF-8`); }
  }
}
visit(fileURLToPath(new URL("../src/", import.meta.url)));
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`UI encoding PASS: ${checked} source files contain valid UTF-8 and no replacement characters.`);
