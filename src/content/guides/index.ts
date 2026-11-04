import { checkDgdaRegistration } from "./check-dgda-registration";
import { combinationMedicinesLabel } from "./combination-medicines-label";
import { compareBrandsSameGeneric } from "./compare-brands-same-generic";
import { dosageFormsExplained } from "./dosage-forms-explained";
import { findGenericNameOfABrand } from "./find-generic-name-of-a-brand";
import { findHospitalInYourDistrict } from "./find-hospital-in-your-district";
import { findPharmacyNearYou } from "./find-pharmacy-near-you";
import { fixMissingHospitalOpenstreetmap } from "./fix-missing-hospital-openstreetmap";
import { genericVsBrandName } from "./generic-vs-brand-name";
import { hospitalClinicPharmacyListings } from "./hospital-clinic-pharmacy-listings";
import { injectionLabelsIvIm } from "./injection-labels-iv-im";
import { keepFamilyMedicineList } from "./keep-family-medicine-list";
import { medicalDepartmentsExplained } from "./medical-departments-explained";
import { medicineNamesBanglaEnglish } from "./medicine-names-bangla-english";
import { nationalEmergency999 } from "./national-emergency-999";
import { pharmaceuticalCompaniesInBangladesh } from "./pharmaceutical-companies-in-bangladesh";
import { prepareForHospitalVisit } from "./prepare-for-hospital-visit";
import { readAMedicinePack } from "./read-a-medicine-pack";
import { readExpiryDate } from "./read-expiry-date";
import { readMedicineStrength } from "./read-medicine-strength";
import { reportFakeMedicineDgda } from "./report-fake-medicine-dgda";
import { tabletSuffixesXrSrErMups } from "./tablet-suffixes-xr-sr-er-mups";
import type { Guide, GuideCategory } from "./types";
import { whatIsDarNumber } from "./what-is-dar-number";
import { whatIsDgda } from "./what-is-dgda";
import { whyOneGenericHasManyBrands } from "./why-one-generic-has-many-brands";

export type { Guide, GuideBlock, GuideCategory, GuideContent } from "./types";

/** Index page section order. */
export const GUIDE_CATEGORIES: readonly GuideCategory[] = ["registration", "medicines", "healthcare", "using-the-site"];

/** Editorial guides, in display order. Content only: no medical advice, no invented data. */
export const GUIDES: readonly Guide[] = [
  whatIsDgda,
  checkDgdaRegistration,
  whatIsDarNumber,
  genericVsBrandName,
  findGenericNameOfABrand,
  whyOneGenericHasManyBrands,
  compareBrandsSameGeneric,
  readMedicineStrength,
  dosageFormsExplained,
  tabletSuffixesXrSrErMups,
  injectionLabelsIvIm,
  combinationMedicinesLabel,
  readAMedicinePack,
  readExpiryDate,
  reportFakeMedicineDgda,
  pharmaceuticalCompaniesInBangladesh,
  medicineNamesBanglaEnglish,
  findHospitalInYourDistrict,
  findPharmacyNearYou,
  hospitalClinicPharmacyListings,
  fixMissingHospitalOpenstreetmap,
  prepareForHospitalVisit,
  keepFamilyMedicineList,
  nationalEmergency999,
  medicalDepartmentsExplained,
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

/** Other guides in the same category, in display order. */
export function relatedGuides(guide: Guide, limit = 4): Guide[] {
  return GUIDES.filter((g) => g.category === guide.category && g.slug !== guide.slug).slice(0, limit);
}
