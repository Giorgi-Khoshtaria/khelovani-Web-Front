#!/usr/bin/env node
/**
 * Fetches translations from the DB, scans the frontend codebase, and reports:
 *
 *   missing        — key used in code but not in DB at all
 *   wrongNamespace — key exists in DB but not reachable from call's namespace chain
 *
 * Checks two kinds of usage:
 *   1. useClientTranslation("ns") → t("key")  in .ts/.tsx files
 *   2. Zod error strings  in src/lib/validations/**  → validated against the
 *      "validation" namespace
 *
 * Usage:
 *   node scripts/translations/audit.mjs
 */

import { writeFileSync, readFileSync, readdirSync } from "fs";
import { resolve, relative } from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const REPORT_FILE = "scripts/translations/audit-report.json";
const SRC_DIR = resolve("src");
const VALIDATIONS_DIR = resolve("src/lib/validations");

// ── Fetch translations from DB ────────────────────────────────────────────────

process.stdout.write(`Fetching translations from ${API_URL} … `);

let db;
try {
  const res = await fetch(`${API_URL}/api/admin/translations?limit=0`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = await res.json();
  if (!body?.data?.grouped) throw new Error("Unexpected response shape");
  db = body.data.grouped;
  const total = Object.values(db).reduce((s, k) => s + Object.keys(k).length, 0);
  console.log(`✓  ${Object.keys(db).length} namespaces, ${total} keys`);
} catch (err) {
  console.error(`\nFailed: ${err.message}`);
  console.error("Is the backend running? Try: npm run i18n:fetch first.");
  process.exit(1);
}

// ── Walk a directory recursively ──────────────────────────────────────────────

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(full);
  }
  return results;
}

// ── Lookup a key across all DB namespaces ─────────────────────────────────────

function lookupInDb(key) {
  const foundIn = [];
  for (const [ns, keys] of Object.entries(db)) {
    if (keys[key] !== undefined) foundIn.push(ns);
  }
  return foundIn; // empty = not in DB at all
}

// ── Deduplication set ─────────────────────────────────────────────────────────

const seen = new Set();
const missing = [];
const wrongNamespace = [];

function classify({ key, chain, file, line }) {
  const cacheKey = `${key}::${chain.join(",")}`;
  if (seen.has(cacheKey)) return;
  seen.add(cacheKey);

  const foundIn = lookupInDb(key);

  if (foundIn.length === 0) {
    missing.push({ key, namespace: chain[0], file, line });
    return;
  }

  const resolvedBy = foundIn.filter((ns) => chain.includes(ns));
  if (resolvedBy.length === 0) {
    wrongNamespace.push({
      key,
      actuallyIn: foundIn,
      suggestion: `Switch to a hook/namespace bound to "${foundIn[0]}"`,
      file,
      line,
    });
  }
}

// ── Pass 1: useClientTranslation() calls in all .ts/.tsx files ───────────────

function extractTranslationHookUsages(filePath) {
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

    // "common" is always the implicit last fallback (matches the hook)
    const chain = [...new Set([...namespaces, "common"])];
    aliasMap.set(alias, chain);
  }

  for (const [alias, chain] of aliasMap) {
    // Matches: tFoo("some.key")  or  tFoo('some.key')  — skips template literals
    const callRe = new RegExp(`\\b${alias}\\(["']([^"')]+)["']\\)`, "g");
    while ((m = callRe.exec(src)) !== null) {
      const key = m[1];
      const line = src.slice(0, m.index).split("\n").length;
      usages.push({ key, chain, file: relative(process.cwd(), filePath), line });
    }
  }

  return usages;
}

const allSrcFiles = walkDir(SRC_DIR);
const namespacesInCode = new Set();
let totalHookUsages = 0;

for (const filePath of allSrcFiles) {
  const usages = extractTranslationHookUsages(filePath);
  for (const usage of usages) {
    usage.chain.forEach((ns) => namespacesInCode.add(ns));
    totalHookUsages++;
    classify(usage);
  }
}

// ── Pass 2: Zod error message strings in src/lib/validations/ ────────────────
// These are string keys passed to .min(), .max(), .regex(), .refine(),
// { message: "key" }, etc. They should all resolve in the "validation" namespace.

function extractZodErrorKeys(filePath) {
  const src = readFileSync(filePath, "utf8");
  const keys = [];

  // Patterns:
  //   .min(1, "key")  .max(100, "key")  .regex(/.../, "key")  .length(9, "key")
  //   { message: "key" }
  //   z.string().trim().min(1, "key")  etc.
  const patterns = [
    /\.\s*(?:min|max|length|regex|email|url|uuid|trim)\s*\([^,)]*,\s*["']([^"']+)["']/g,
    /\.\s*refine\s*\([^,)]+,\s*["']([^"']+)["']/g,
    /\bmessage\s*:\s*["']([^"']+)["']/g,
    // bare second-arg string: z.string().min(1, "key")
    /(?:z\.\w+\(\)|\.trim\(\)|\.optional\(\))\s*\.\w+\([^,)]+,\s*["']([^"']+)["']/g,
  ];

  const lineCache = src.split("\n");

  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      const key = m[1];
      const line = src.slice(0, m.index).split("\n").length;
      // Skip keys that look like actual error text (contain spaces or are very long)
      if (!key.includes(" ") && key.length < 60) {
        keys.push({ key, line });
      }
    }
  }

  return keys;
}

const validationFiles = walkDir(VALIDATIONS_DIR);
let totalZodKeys = 0;

for (const filePath of validationFiles) {
  const rel = relative(process.cwd(), filePath);
  for (const { key, line } of extractZodErrorKeys(filePath)) {
    totalZodKeys++;
    classify({
      key,
      chain: ["validation", "common"],
      file: rel,
      line,
    });
  }
}

// ── Write JSON report ─────────────────────────────────────────────────────────

const report = {
  summary: {
    missing: missing.length,
    wrongNamespace: wrongNamespace.length,
  },
  missing,
  wrongNamespace,
};

writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), "utf8");

// ── Print to console ──────────────────────────────────────────────────────────

console.log("\n── Translation Audit ────────────────────────────────────────");
console.log(`Files scanned:      ${allSrcFiles.length} src files  +  ${validationFiles.length} validation files`);
console.log(`Namespaces checked: ${[...namespacesInCode].sort().join(", ")}`);
console.log(`Keys checked:       ${totalHookUsages} hook usages  +  ${totalZodKeys} zod error keys`);

if (missing.length === 0 && wrongNamespace.length === 0) {
  console.log("✓ All keys are present and correctly namespaced.");
} else {
  if (missing.length > 0) {
    console.log(`\n❌  MISSING (${missing.length}) — in code but not in DB:`);
    for (const item of missing) {
      console.log(`    "${item.key}"  [${item.namespace}]  ${item.file}:${item.line}`);
    }
  }

  if (wrongNamespace.length > 0) {
    console.log(
      `\n⚠️   WRONG NAMESPACE (${wrongNamespace.length}) — exists in DB but under a different namespace:`,
    );
    for (const item of wrongNamespace) {
      console.log(`    "${item.key}"`);
      console.log(`      actually in [${item.actuallyIn.join(", ")}]`);
      console.log(`      💡 ${item.suggestion}`);
      console.log(`      ${item.file}:${item.line}`);
    }
  }
}

console.log(`\nFull report → ${REPORT_FILE}`);
console.log("─────────────────────────────────────────────────────────────\n");
