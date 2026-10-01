import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const output = execFileSync(npmBin, ["sbom", "--sbom-format=cyclonedx"], {
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});
const sbom = JSON.parse(output);

const errors = [];
if (sbom.bomFormat !== "CycloneDX") errors.push(`bomFormat: expected CycloneDX, received ${JSON.stringify(sbom.bomFormat)}`);
if (typeof sbom.specVersion !== "string" || !sbom.specVersion) errors.push("specVersion is missing");
if (!sbom.metadata?.component || sbom.metadata.component.name !== "atlas") errors.push("metadata.component.name must be atlas");
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
