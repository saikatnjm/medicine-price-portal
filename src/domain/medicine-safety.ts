import type { ISODateString } from "./types";

/** Kind of source the information was taken from (never mixed within one record). */
export const SAFETY_SOURCE_TYPES = ["regulator", "manufacturer", "public_health", "medical_reference"] as const;
export type SafetySourceType = (typeof SAFETY_SOURCE_TYPES)[number];

/**
 * - source_cited: every statement comes from the cited source; not independently reviewed by us.
 * - needs_review: flagged; hidden from pages until reviewed.
 */
export type SafetyVerificationStatus = "source_cited" | "needs_review";

/**
 * General information about an active ingredient (generic), from ONE cited source.
 * Keyed by generic, not brand: the text describes the ingredient, and brands with the same
 * generic share it. Every content field may be null; missing data is never filled in.
 * Informational only: never dosing, never advice to start, stop or change a medicine.
 */
export interface MedicineSafetyInfo {
  genericSlug: string;
  genericName: string;
  description: string | null;
  uses: string[] | null;
  mechanism: string | null;
  commonSideEffects: string[] | null;
  seriousSideEffects: string[] | null;
  /** Situations the source says need urgent medical attention. */
  seekHelpIf: string[] | null;
  warnings: string[] | null;
  contraindications: string[] | null;
  interactions: string[] | null;
  pregnancyInfo: string | null;
  breastfeedingInfo: string | null;
  storage: string | null;
  source: string;
  sourceUrl: string;
  sourceType: SafetySourceType;
  sourceUpdatedAt: ISODateString | null;
  lastCheckedAt: ISODateString;
  verificationStatus: SafetyVerificationStatus;
  /** Licence or permission under which the text may be shown (required: no licence, no data). */
  licenceNote: string;
}

/** True when the record has at least one displayable content field. */
export function hasSafetyContent(info: MedicineSafetyInfo): boolean {
  return [
    info.description,
    info.uses,
    info.mechanism,
    info.commonSideEffects,
    info.seriousSideEffects,
    info.seekHelpIf,
    info.warnings,
    info.contraindications,
    info.interactions,
    info.pregnancyInfo,
    info.breastfeedingInfo,
    info.storage,
  ].some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));
}
