#!/usr/bin/env node
/**
 * Step 1 of the data pipeline: download the DGDA Registered Drug Products
 * registry from the DGHS national terminology server (OCL) into a raw snapshot.
 *
 *   docker compose run --rm app npm run data:fetch
 *
 * Source: Directorate General of Drug Administration (DGDA) drug registry,
 * published by DGHS (MoHFW, Bangladesh) as the public, anonymously viewable
 * OCL source MoHFW/DGDA-Drugs. Documented in the Bangladesh Core FHIR IG:
 * https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html
 *
 * Politeness: sequential requests, a delay between pages, retries with
 * backoff. No authentication is used or bypassed.
 *
 * Output: data/raw/dgda-drug-registry.json (committed; the build step is
 * offline and deterministic from this snapshot).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://api.tr.ocl.dghs.gov.bd";
const SOURCE_PATH = "/orgs/MoHFW/sources/DGDA-Drugs/";
const PAGE_SIZE = 1000;
const DELAY_MS = 750;
const MAX_RETRIES = 4;
const USER_AGENT =
  "medicine-price-portal-data-import/1.0 (+https://github.com/saikatnjm/medicine-price-portal)";
const OUT_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/raw/dgda-drug-registry.json",
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      });
      if (response.ok) return { body: await response.json(), headers: response.headers };
      if (response.status < 500 && response.status !== 429) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      if (attempt >= MAX_RETRIES)
        throw new Error(`HTTP ${response.status} after ${attempt} attempts: ${url}`);
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
    }
    await sleep(DELAY_MS * 2 ** attempt);
  }
}

async function main() {
  const { body: source } = await getJson(`${API}${SOURCE_PATH}`);
  const records = [];
  let numFound = null;

  for (let page = 1; ; page++) {
    const url = `${API}${SOURCE_PATH}concepts/?limit=${PAGE_SIZE}&page=${page}&verbose=true&includeExtras=true`;
    const { body, headers } = await getJson(url);
    numFound = Number(headers.get("num_found"));
    const pages = Number(headers.get("pages"));
    for (const concept of body) {
      const extras = concept.extras ?? {};
      records.push({
        id: concept.id,
        conceptClass: concept.concept_class,
        retired: Boolean(concept.retired),
        darNumber: extras.dar_number ?? "",
        darQualityFlag: extras.dar_quality_flag ?? "",
        tradeName: extras.trade_name ?? "",
        company: extras.company ?? "",
        dosageForm: extras.dosage_form ?? "",
        genericContentRaw: extras.generic_content_raw ?? "",
      });
    }
    process.stdout.write(`\rFetched page ${page}/${pages} (${records.length}/${numFound})`);
    if (page >= pages || body.length === 0) break;
    await sleep(DELAY_MS);
  }
  process.stdout.write("\n");

  const unique = new Map(records.map((r) => [r.id, r]));
  if (unique.size !== numFound) {
    throw new Error(
      `Expected ${numFound} unique concepts, got ${unique.size}. Not writing a partial snapshot.`,
    );
  }

  const sorted = [...unique.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const meta = {
    source: {
      name: "DGDA Registered Drug Products",
      publisher:
        "Directorate General of Drug Administration (DGDA), via DGHS national terminology server",
      api: `${API}${SOURCE_PATH}`,
      canonicalUrl: source.canonical_url ?? "https://dgda.gov.bd/drug-registry",
      documentation: "https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html",
      publicAccess: source.public_access ?? null,
      checksum: source.checksums?.standard ?? null,
    },
    retrievedAt: new Date().toISOString(),
    numFound,
  };

  // One record per line keeps the committed snapshot diffable.
  const lines = sorted.map((r) => `    ${JSON.stringify(r)}`).join(",\n");
  const json = `{\n  "meta": ${JSON.stringify(meta)},\n  "records": [\n${lines}\n  ]\n}\n`;
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, json, "utf8");
  console.log(`Wrote ${sorted.length} records to ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(`\nFetch failed: ${error.message}`);
  process.exit(1);
});
