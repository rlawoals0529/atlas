import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const releaseSource = fs.readFileSync(new URL("../src/shared/release.ts", import.meta.url), "utf8");
const readme = fs.readFileSync(new URL("../README.md", import.meta.url), "utf8");
const changelog = fs.readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");

const match = releaseSource.match(/label:\s*"([^"]+)"/);
if (!match) {
  console.error("Release contract FAILED: RELEASE.label is missing.");
  process.exit(1);
}
const releaseLabel = match[1];
const version = String(pkg.version ?? "");
const errors = [];

if (releaseLabel !== version) errors.push(`RELEASE.label ${releaseLabel} does not match package.json version ${version}`);
if (!readme.includes(`[v${version}](https://github.com/rlawoals0529/atlas/releases/tag/v${version})`)) errors.push(`README must link v${version} as the public release`);
if (!readme.includes(`## Current build — v${version}`)) errors.push(`README current-build heading must be v${version}`);
if (!changelog.includes(`## v${version} —`)) errors.push(`CHANGELOG must contain a v${version} release section`);

const notesUrl = new URL(`../docs/releases/v${version}.md`, import.meta.url);
if (!fs.existsSync(notesUrl)) errors.push(`docs/releases/v${version}.md is missing`);

if (errors.length) {
  console.error("Release contract FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Release contract PASS: package, RELEASE.label, README, changelog and release notes agree on v${version}.`);
