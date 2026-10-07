export interface CheckResult {
  severity: "error" | "warning" | "info";
  count: number;
  examples: string[];
}

export interface QualityReport {
  generatedAt: string;
  thresholds: {
    staleAfterDays: number;
    duplicateRadiusMeters: number;
    coordinateRange: { minLat: number; maxLat: number; minLon: number; maxLon: number };
    exampleCap: number;
  };
  totals: { error: number; warning: number; info: number };
  datasets: Record<string, { total: number } & Record<string, CheckResult | number>>;
}

interface Named {
  id?: string;
  slug?: string;
  name?: string;
  coordinates?: { lat: number; lon: number } | null;
  [key: string]: unknown;
}

export declare const BD_COORD_RANGE: { minLat: number; maxLat: number; minLon: number; maxLon: number };
export declare const STALE_AFTER_DAYS: number;
export declare const DUPLICATE_RADIUS_M: number;
export declare const DEFAULT_EXAMPLE_CAP: number;
export declare function isValidPhone(value: unknown): boolean;
export declare function normalizeName(name: unknown): string;
export declare function haversineMeters(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number;
export declare function coordinateProblem(coords: { lat?: unknown; lon?: unknown } | null | undefined): "missing" | "invalid" | "outside_bangladesh" | null;
export declare function findDuplicateSlugs(records: Named[]): Array<{ slug: string; ids: Array<string | undefined> }>;
export declare function findProbableDuplicates(records: Named[], radiusM?: number): Array<[string | undefined, string | undefined]>;
export declare function isStale(iso: string | undefined, now: Date, days?: number): boolean;
export declare function findDuplicateChambers(doctors: Array<{ id: string; chambers?: Array<Record<string, unknown>> }>): Array<{ doctorId: string; facility: string }>;
export declare function buildQualityReport(
  data: { facilities?: unknown[]; pharmacies?: unknown[]; doctors?: unknown[]; locations?: unknown[]; medicines?: unknown[] },
  options?: { now?: Date; cap?: number },
): QualityReport;
export declare function summarizeReport(report: QualityReport): string[];
