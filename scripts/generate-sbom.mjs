import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
// npm.cmd cannot be launched directly by execFileSync on current Windows Node.
// npm scripts expose the CLI path, so run it through Node without a shell.
const npmCli = process.env.npm_execpath;
const output = execFileSync(npmCli ? process.execPath : npmBin, [
  ...(npmCli ? [npmCli] : []), "sbom", "--sbom-format=cyclonedx",
], {
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
  shell: !npmCli && process.platform === "win32",
});
const sbom = JSON.parse(output);

const errors = [];
if (sbom.bomFormat !== "CycloneDX") errors.push(`bomFormat: expected CycloneDX, received ${JSON.stringify(sbom.bomFormat)}`);
if (typeof sbom.specVersion !== "string" || !sbom.specVersion) errors.push("specVersion is missing");
if (sbom.metadata?.component?.name?.toLowerCase() !== "atlas") errors.push("metadata.component.name must be atlas (case-insensitive)");
if (!Array.isArray(sbom.components) || sbom.components.length === 0) errors.push("components must be a non-empty array");

if (errors.length) {
  console.error("SBOM generation FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const generatedDir = path.resolve("generated");
fs.mkdirSync(generatedDir, { recursive: true });
const outputPath = path.join(generatedDir, "sbom.cdx.json");
fs.writeFileSync(outputPath, JSON.stringify(sbom, null, 2) + "\n");
console.log(`CycloneDX SBOM PASS: ${sbom.components.length} components written to generated/sbom.cdx.json (spec ${sbom.specVersion}).`);
