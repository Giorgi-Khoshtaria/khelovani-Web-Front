#!/usr/bin/env node
/**
 * Fetches all translations from the DB, saves them to translations.json,
 * scans the codebase (hooks + validation files) for missing keys,
 * and writes the results to audit-report.json.
 *
 * Usage:
 *   node scripts/translations/fetch.mjs
 */

import { writeFileSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { resolve, relative } from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const OUT_FILE = "scripts/translations/translations.json";
const REPORT_FILE = "scripts/translations/audit-report.json";
const SRC_DIR = resolve("src");
const VALIDATIONS_DIR = resolve("src/lib/validations");

// ── Helpers ───────────────────────────────────────────────────────────────────

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(full);
  }
  return results;
}

// ── Fetch translations ────────────────────────────────────────────────────────

console.log(`Fetching from ${API_URL}/api/admin/translations?limit=0 ...`);

let res;
try {
  res = await fetch(`${API_URL}/api/admin/translations?limit=0`);
} catch {
  console.error("Cannot reach the API. Is the backend running?");
  process.exit(1);
}

if (!res.ok) {
  console.error(`API returned ${res.status} ${res.statusText}`);
  process.exit(1);
}

const body = await res.json();

if (!body?.data?.grouped) {
  console.error("Unexpected response — expected body.data.grouped");
  process.exit(1);
}

const db = body.data.grouped;
const dbNamespaces = new Set(Object.keys(db));

let totalKeys = 0;
for (const keys of Object.values(db)) totalKeys += Object.keys(keys).length;

mkdirSync("scripts/translations", { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(db, null, 2), "utf8");

console.log(`\nSaved → ${OUT_FILE}`);
console.log(`DB namespaces (${dbNamespaces.size}): ${[...dbNamespaces].sort().join(", ")}`);
console.log(`Total keys: ${totalKeys}`);

// ── DB key lookup ─────────────────────────────────────────────────────────────

function lookupInDb(key) {
  const foundIn = [];
  for (const [ns, keys] of Object.entries(db)) {
    if (keys[key] !== undefined) foundIn.push(ns);
  }
  return foundIn;
}

// ── Classify each usage ───────────────────────────────────────────────────────

const seen = new Set();
const missing = [];
const wrongNamespace = [];

function classify({ key, namespace, file, line }) {
  const cacheKey = `${key}::${namespace}`;
  if (seen.has(cacheKey)) return;
  seen.add(cacheKey);

  const foundIn = lookupInDb(key);

  if (foundIn.length === 0) {
    missing.push({ key, file, line });
    return;
  }

  if (!foundIn.includes(namespace)) {
    wrongNamespace.push({
      key,
      actuallyIn: foundIn,
      file,
      line,
    });
  }
}

// ── Pass 1: useClientTranslation() calls ──────────────────────────────────────

function extractHookUsages(filePath) {
  const src = readFileSync(filePath, "utf8");
  const usages = [];
  const declRe =
    /const\s*\{\s*t(?:\s*:\s*(\w+))?\s*[^}]*\}\s*=\s*useClientTranslation\(([^)]+)\)/g;
  const aliasMap = new Map();
  let m;

  while ((m = declRe.exec(src)) !== null) {
    const alias = m[1] || "t";
    const nsArg = m[2].trim();
    let namespaces;
    if (nsArg.startsWith("[")) {
      namespaces = [...nsArg.matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
    } else {
      const s = nsArg.match(/["']([^"']+)["']/);
      namespaces = s ? [s[1]] : [];
    }
    for (const ns of [...new Set([...namespaces, "common"])]) {
      aliasMap.set(alias, ns);
    }
    aliasMap.set(alias, [...new Set([...namespaces, "common"])][0]);
  }

  for (const [alias, namespace] of aliasMap) {
    const callRe = new RegExp(`\\b${alias}\\(["']([^"')]+)["']\\)`, "g");
    while ((m = callRe.exec(src)) !== null) {
      const key = m[1];
      const line = src.slice(0, m.index).split("\n").length;
      usages.push({ key, namespace, file: relative(process.cwd(), filePath), line });
    }
  }

  return usages;
}

let totalHookUsages = 0;
for (const filePath of walkDir(SRC_DIR)) {
  for (const usage of extractHookUsages(filePath)) {
    totalHookUsages++;
    classify(usage);
  }
}

// ── Pass 2: Zod error keys in src/lib/validations/ ───────────────────────────

function extractZodKeys(filePath) {
  const src = readFileSync(filePath, "utf8");
  const keys = [];
  const patterns = [
    /\.\s*(?:min|max|length|regex|email|url|uuid|trim)\s*\([^,)]*,\s*["']([^"']+)["']/g,
    /\.\s*refine\s*\([^,)]+,\s*["']([^"']+)["']/g,
    /\bmessage\s*:\s*["']([^"']+)["']/g,
    /(?:z\.\w+\(\)|\.trim\(\)|\.optional\(\))\s*\.\w+\([^,)]+,\s*["']([^"']+)["']/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      const key = m[1];
      if (!key.includes(" ") && key.length < 60) {
        const line = src.slice(0, m.index).split("\n").length;
        keys.push({ key, line });
      }
    }
  }
  return keys;
}

let totalZodKeys = 0;
for (const filePath of walkDir(VALIDATIONS_DIR)) {
  const rel = relative(process.cwd(), filePath);
  for (const { key, line } of extractZodKeys(filePath)) {
    totalZodKeys++;
    classify({ key, namespace: "validation", file: rel, line });
  }
}

// ── Write audit-report.json ───────────────────────────────────────────────────

const report = {
  summary: { missing: missing.length, wrongNamespace: wrongNamespace.length },
  missing,
  wrongNamespace,
};

writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), "utf8");

// ── Console output ────────────────────────────────────────────────────────────

console.log("\n── Translation Audit ─────────────────────────────────────────");
console.log(`Hook usages checked:       ${totalHookUsages}`);
console.log(`Validation keys checked:   ${totalZodKeys}`);

if (missing.length === 0 && wrongNamespace.length === 0) {
  console.log("✓ All keys are present and correctly namespaced.");
} else {
  if (missing.length > 0) {
    console.log(`\n❌ Missing keys (${missing.length}) — in code but not in DB:`);
    for (const item of missing) {
      console.log(`   - "${item.key}"  [${item.namespace}]  ${item.file}:${item.line}`);
    }
  }

  if (wrongNamespace.length > 0) {
    console.log(`\n⚠️  Wrong namespace (${wrongNamespace.length}) — exists in DB but under a different namespace:`);
    for (const item of wrongNamespace) {
      console.log(`   - "${item.key}"  called in [${item.namespace}]  actually in [${item.actuallyIn.join(", ")}]  ${item.file}:${item.line}`);
    }
  }
}

console.log(`\nFull report → ${REPORT_FILE}`);
console.log("──────────────────────────────────────────────────────────────\n");
