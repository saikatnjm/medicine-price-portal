import type { Medicine } from "./types";

/**
 * Same generic, strength and precise dosage form (e.g. "SR Tablet" ≠ "Tablet"):
 * the definition of a same-generic alternative brand. Informational only,
 * never a substitution recommendation.
 */
export function isSameProductForm(a: Medicine, b: Medicine): boolean {
  return (
    a.genericId === b.genericId &&
    a.strength === b.strength &&
    a.dosageFormLabel === b.dosageFormLabel
  );
}

/** Dosage forms that are priced per individual countable unit (e.g. per tablet). */
export function isUnitDosageForm(medicine: Medicine): boolean {
  return medicine.dosageForm === "tablet" || medicine.dosageForm === "capsule";
}
