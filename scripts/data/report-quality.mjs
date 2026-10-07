/**
 * Read-only data-quality report.
 *
 *   node scripts/data/report-quality.mjs [--strict]
 *   npm run data:report
 *
 * Reads src/data/local/seed/*.json and writes reports/data-quality.json (gitignored). It never modifies or
 * deletes seed data. Exit code 0 unless --strict is given and error-level issues exist.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildQualityReport, summarizeReport } from "./lib/quality-report.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SEED = join(ROOT, "src/data/local/seed");
const OUT = join(ROOT, "reports/data-quality.json");

const load = (name) => JSON.parse(readFileSync(join(SEED, `${name}.json`), "utf8"));
const data = Object.fromEntries(["facilities", "pharmacies", "doctors", "locations", "medicines"].map((n) => [n, load(n)]));

const report = buildQualityReport(data);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);

console.log(summarizeReport(report).join("\n"));
console.log(`\nWrote ${OUT.replace(`${ROOT}/`, "")}`);
if (process.argv.includes("--strict") && report.totals.error > 0) process.exit(1);
