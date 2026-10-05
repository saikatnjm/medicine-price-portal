import type { DataSource, Generic, Manufacturer, Medicine } from "../../src/domain/types";

export interface RawRegistryRecord {
  id: string;
  conceptClass: string;
  retired: boolean;
  darNumber: string;
  darQualityFlag: string;
  tradeName: string;
  company: string;
  dosageForm: string;
  genericContentRaw: string;
}

export interface RawRegistrySnapshot {
  meta: {
    retrievedAt: string;
    numFound?: number;
    source: {
      name: string;
      publisher: string;
      api: string;
      documentation: string;
      [key: string]: unknown;
    };
  };
  records: RawRegistryRecord[];
}

export interface CatalogBuildResult {
  medicines: Medicine[];
  generics: Generic[];
  manufacturers: Manufacturer[];
  sources: DataSource[];
  popular: string[];
  report: {
    rawRecords: number;
    imported: number;
    rejected: number;
    rejectedByReason: Record<string, number>;
    duplicatesRemoved: number;
    slugCollisionsResolved: number;
    generics: number;
    manufacturers: number;
    missingPopular: string[];
    [key: string]: unknown;
  };
  rejected: { id: string; reason: string; tradeName: string }[];
  duplicates: { id: string; keptId: string; identity: string }[];
}

export declare function buildCatalog(raw: RawRegistrySnapshot): CatalogBuildResult;
