/**
 * Reading and writing seed files from Node scripts. The compact format itself
 * lives in src/data/local/seed-format.mjs (shared with the app).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { expandSeed, formatCompactSeed } from "../../../src/data/local/seed-format.mjs";

/** Reads a seed file as the app sees it (compact files expanded). Missing file → fallback. */
export function readSeedFile(path, fallback) {
  if (fallback !== undefined && !existsSync(path)) return fallback;
  return expandSeed(JSON.parse(readFileSync(path, "utf8")));
}

/**
 * Writes `items` in the compact format produced by `compact`, after checking that
 * expanding it gives back exactly `items` (so the format can never drop data).
 */
export function writeCompactSeedFile(path, items, compact) {
  const data = compact(items);
  const expanded = expandSeed(data);
  const bad = items.findIndex((item, i) => !isDeepStrictEqual(item, expanded[i]));
  if (bad !== -1 || expanded.length !== items.length) {
    const id = items[bad]?.id ?? "(record count)";
    throw new Error(`${path}: the compact seed format cannot represent record ${id}; update src/data/local/seed-format.mjs`);
  }
  writeFileSync(path, formatCompactSeed(data), "utf8");
}

/**
 * Writes a report object with one top-level field per line and the entries of
 * top-level arrays/objects one per line (deeper values inline): diffable, and
 * about 25% smaller than 2-space pretty-printing.
 */
export function writeReportJson(path, report) {
  const entry = (indent, key, value) => `${indent}${key === null ? "" : `${JSON.stringify(key)}: `}${value}`;
  const block = (value) => {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    const isArray = Array.isArray(value);
    const items = isArray ? value.map((v) => [null, v]) : Object.entries(value);
    if (!items.length) return isArray ? "[]" : "{}";
    const lines = items.map(([k, v]) => entry("    ", k, JSON.stringify(v)));
    return `${isArray ? "[" : "{"}\n${lines.join(",\n")}\n  ${isArray ? "]" : "}"}`;
  };
  const lines = Object.entries(report).map(([k, v]) => entry("  ", k, block(v)));
  writeFileSync(path, `{\n${lines.join(",\n")}\n}\n`, "utf8");
}
