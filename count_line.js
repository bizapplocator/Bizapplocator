#!/usr/bin/env node
import fs from "fs";
import path from "path";

// ---- Config ----
const TARGET_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".html",
  ".json",
];
const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
];

// ---- Get target folder ----
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), "src");

if (!fs.existsSync(targetDir)) {
  console.error(`❌  Folder not found: ${targetDir}`);
  console.error(`Usage: node count-lines.js [path/to/folder]`);
  process.exit(1);
}

// ---- Walk directory recursively ----
function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        files = files.concat(walkDir(fullPath));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (TARGET_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// ---- Count lines in a file ----
function countLines(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const total = lines.length;
  const blank = lines.filter((l) => l.trim() === "").length;
  const comments = lines.filter(
    (l) =>
      l.trim().startsWith("//") ||
      l.trim().startsWith("*") ||
      l.trim().startsWith("/*"),
  ).length;
  const code = total - blank - comments;

  return { total, blank, comments, code };
}

// ---- Main ----
const files = walkDir(targetDir);

let grandTotal = 0;
let grandCode = 0;
let grandBlank = 0;
let grandComments = 0;

// group by extension
const byExt = {};

console.log(`\n📁  Scanning: ${targetDir}\n`);
console.log("─".repeat(80));
console.log(
  `${"File".padEnd(60)} ${"Total".padStart(6)} ${"Code".padStart(6)} ${"Blank".padStart(6)}`,
);
console.log("─".repeat(80));

for (const file of files) {
  const { total, blank, comments, code } = countLines(file);
  const relativePath = path.relative(targetDir, file);
  const ext = path.extname(file).toLowerCase();

  // per file output
  console.log(
    `${relativePath.padEnd(60)} ${String(total).padStart(6)} ${String(code).padStart(6)} ${String(blank).padStart(6)}`,
  );

  // accumulate
  grandTotal += total;
  grandCode += code;
  grandBlank += blank;
  grandComments += comments;

  if (!byExt[ext]) byExt[ext] = { files: 0, total: 0, code: 0 };
  byExt[ext].files++;
  byExt[ext].total += total;
  byExt[ext].code += code;
}

// ---- Summary ----
console.log("─".repeat(80));
console.log(`\n📊  Summary\n`);
console.log(`  Total files scanned : ${files.length}`);
console.log(`  Total lines         : ${grandTotal.toLocaleString()}`);
console.log(`  Code lines          : ${grandCode.toLocaleString()}`);
console.log(`  Blank lines         : ${grandBlank.toLocaleString()}`);
console.log(`  Comment lines       : ${grandComments.toLocaleString()}`);

console.log(`\n📂  Breakdown by file type\n`);
for (const [ext, stats] of Object.entries(byExt).sort(
  (a, b) => b[1].total - a[1].total,
)) {
  console.log(
    `  ${ext.padEnd(8)}  ${String(stats.files).padStart(3)} file(s)   ${String(stats.total).padStart(6)} lines   ${String(stats.code).padStart(6)} code`,
  );
}

console.log("\n" + "─".repeat(80));
console.log(`\n✅  Done!\n`);
