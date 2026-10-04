import type { Medicine } from "./types";

/**
 * Same generic, strength and dosage form: the definition of a same-generic
 * alternative brand. Informational comparison only, never a substitution advice.
 */
export function isSameProductForm(a: Medicine, b: Medicine): boolean {
  return a.genericId === b.genericId && a.strength === b.strength && a.dosageForm === b.dosageForm;
}

/** Dosage forms that are priced per individual countable unit (e.g. per tablet). */
export function isUnitDosageForm(medicine: Medicine): boolean {
  return medicine.dosageForm === "tablet" || medicine.dosageForm === "capsule";
}
