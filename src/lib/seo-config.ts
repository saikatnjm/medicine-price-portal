/** Tunable SEO thresholds. Environment overrides let you tighten or relax indexing without a code change. */
function intFromEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value >= 1 ? value : fallback;
}

export const SEO_THRESHOLDS = {
  /** Location × specialty (or location × type) pages need at least this many records to be indexed. */
  minCombinationResults: intFromEnv("SEO_MIN_COMBINATION_RESULTS", 3),
} as const;
