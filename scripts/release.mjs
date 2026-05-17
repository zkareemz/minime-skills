#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error("Usage: npm run release <version>  (e.g. npm run release 0.2.1)");
  process.exit(1);
}

const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const prev = pkg.version;
if (prev === version) {
  console.error(`Already at version ${version}`);
  process.exit(1);
}

pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`Updated package.json: ${prev} → ${version}`);

const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

run(`git add package.json`);
run(`git commit -m "chore: release v${version}"`);
run(`git push -u origin HEAD`);

console.log(`\nPushed release commit — GitHub Actions will publish v${version} to npm.`);
