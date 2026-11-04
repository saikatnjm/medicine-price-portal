import type { Facility } from "../../domain/healthcare";
import type { Medicine, Pharmacy } from "../../domain/types";

export declare const MEDICINES_FORMAT: "medicines/v1";
export declare const DIRECTORY_FORMAT: "directory/v1";
export declare const MEDICINE_COLUMNS: string[];

/** On-disk shape of medicines.json. */
export interface CompactMedicines {
  format: string;
  idPrefix: string;
  updatedAt: string | null;
  provenance: { sourceId: string; [key: string]: unknown };
  /** DAR numbers that are not the record id prefix; null = no DAR number. */
  darNumberExceptions: Record<string, string | null>;
  columns: string[];
  records: string[][];
}

/** On-disk shape of facilities.json and pharmacies.json. */
export interface CompactDirectory {
  format: string;
  idPrefix: string;
  recordUrlPrefix: string;
  updatedAt: string | null;
  provenance: { sourceId: string; [key: string]: unknown };
  records: { recordId: string; [key: string]: unknown }[];
}

export declare function compactMedicines(medicines: Medicine[], options: { idPrefix: string }): CompactMedicines;
export declare function expandMedicines(data: CompactMedicines): Medicine[];
export declare function compactDirectory<T extends Facility | Pharmacy>(
  items: T[],
  options: { idPrefix: string; recordUrlPrefix: string },
): CompactDirectory;
/** Field values are not checked here; scripts/data/validate-data.mjs verifies them. */
export declare function expandDirectory<T extends Facility | Pharmacy>(data: CompactDirectory): T[];
/** Compact files are expanded; plain arrays are returned unchanged. */
export declare function expandSeed<T = unknown>(data: unknown): T[];
export declare function formatCompactSeed(data: CompactMedicines | CompactDirectory): string;
