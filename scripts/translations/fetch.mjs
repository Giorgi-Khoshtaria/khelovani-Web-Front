#!/usr/bin/env node
/**
 * Fetches all translations from the DB and saves them to translations.json
 *
 * Usage:
 *   node scripts/translations/fetch.mjs
 */

import { writeFileSync, mkdirSync } from "fs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const OUT_FILE = "scripts/translations/translations.json";

async function main() {
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

  // grouped shape: { namespace: { key: { ge: "...", en: "..." } } }
  const grouped = body.data.grouped;

  let totalKeys = 0;
  for (const keys of Object.values(grouped)) {
    totalKeys += Object.keys(keys).length;
  }

  mkdirSync("scripts/translations", { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(grouped, null, 2), "utf8");

  console.log(`\nSaved → ${OUT_FILE}`);
  console.log(`Namespaces: ${Object.keys(grouped).join(", ")}`);
  console.log(`Total keys: ${totalKeys}`);
}

main();
