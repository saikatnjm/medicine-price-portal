import type { Location } from "@/domain/healthcare";
import type { LocationDetail } from "@/domain/read-models";
import { createT } from "@/i18n/translate";
import type { Locale } from "@/i18n/config";
import { formatPlace } from "@/lib/format";
import { countText, doctorCountText, pharmacyCountText } from "@/components/specialty/specialty-text";

/**
 * Readable place name: area → "Dhanmondi, Dhaka", district → "Dhaka",
 * division → "Dhaka Division" (বিভাগ in Bangla). `ancestors` is outermost first.
 */
export function placeName(location: Location, ancestors: readonly Location[], lang: Locale): string {
  if (location.level === "division") return createT(lang)("location.place.division", { name: location.name });
  const district = location.level === "area" ? ancestors.find((a) => a.level === "district") : null;
  return formatPlace(location.name, district?.name);
}

/** Breadcrumb name: divisions are labelled so they are not confused with the same-name district. */
export function crumbName(location: Location, lang: Locale): string {
  return location.level === "division" ? createT(lang)("location.place.division", { name: location.name }) : location.name;
}

export function locationHeading(detail: LocationDetail, lang: Locale): string {
  return createT(lang)("location.page.heading", { place: placeName(detail.location, detail.ancestors, lang) });
}

export function locationTitle(detail: LocationDetail, lang: Locale): string {
  return createT(lang)("location.page.title", { place: placeName(detail.location, detail.ancestors, lang) });
}

/** Counts sentence built only from real numbers. */
export function locationSummary(detail: LocationDetail, lang: Locale): string {
  const t = createT(lang);
  const place = placeName(detail.location, detail.ancestors, lang);
  const parts: string[] = [];
  if (detail.facilityCount > 0) {
    const hospitals =
      detail.hospitalCount > 0
        ? t("location.summary.hospitalsParen", {
            hospitals: countText(t, detail.hospitalCount, "location.summary.hospital.one", "location.summary.hospital.other"),
          })
        : "";
    parts.push(
      `${countText(t, detail.facilityCount, "location.summary.facility.one", "location.summary.facility.other")}${hospitals}`,
    );
  }
  if (detail.pharmacyCount > 0) parts.push(pharmacyCountText(t, detail.pharmacyCount));
  if (detail.doctorCount > 0) parts.push(doctorCountText(t, detail.doctorCount));
  if (parts.length === 0) return t("location.summary.empty", { place });
  const and = t("location.summary.and");
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")}${and}${parts.at(-1)}` : (parts[0] ?? "");
  return t("location.summary.lists", { list, place });
}

export function locationDescription(detail: LocationDetail, lang: Locale): string {
  return locationSummary(detail, lang) + createT(lang)("location.desc.suffix");
}
