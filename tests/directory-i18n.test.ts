import { describe, expect, it } from "vitest";
import { createT } from "@/i18n/translate";
import { divisionName, facilityKindPhrase, formatDateIn, formatDistanceT, ofPlace } from "@/lib/directory-labels";
import {
  directoryListBreadcrumbs,
  directoryListJsonLd,
  facilityListDescription,
  facilityListHeading,
  facilityListTitle,
  pharmacyListHeading,
} from "@/lib/seo-facilities";

describe("directory labels in English and Bangla", () => {
  const en = createT("en");
  const bn = createT("bn");

  it("keeps the English wording", () => {
    expect(facilityKindPhrase(en, "hospital", "private")).toBe("Private hospital");
    expect(divisionName(en, "Dhaka")).toBe("Dhaka Division");
    expect(formatDistanceT(en, 0.14)).toBe("150 m away");
    expect(formatDistanceT(en, 2.44)).toBe("2.4 km away");
    expect(formatDateIn("2026-10-01T00:00:00Z")).toBe("1 Oct 2026");
    expect(ofPlace(en)).toBe("Bangladesh");
  });

  it("translates labels, counts and place forms to Bangla", () => {
    expect(facilityKindPhrase(bn, "hospital", "government")).toBe("সরকারি হাসপাতাল");
    expect(divisionName(bn, "Dhaka")).toBe("Dhaka বিভাগ");
    expect(formatDistanceT(bn, 2.44)).toBe("2.4 কিমি দূরে");
    expect(ofPlace(bn)).toBe("বাংলাদেশের");
    expect(ofPlace(bn, "Dhaka")).toBe("Dhaka-এর");
  });
});

describe("directory SEO builders take an optional language", () => {
  it("defaults to the unchanged English copy", () => {
    expect(facilityListTitle({})).toBe("Hospitals & Clinics in Bangladesh");
    expect(facilityListHeading({ scopeName: "Dhaka", specialtyName: "Cardiology" })).toBe("Cardiology hospitals & clinics in Dhaka");
    expect(pharmacyListHeading()).toBe("Pharmacies in Bangladesh");
    expect(facilityListDescription({ total: 0 })).toBe("Hospitals and clinics in Bangladesh. No listings are available yet.");
  });

  it("returns Bangla copy for bn", () => {
    expect(facilityListTitle({}, "bn")).toBe("বাংলাদেশের হাসপাতাল ও ক্লিনিক");
    expect(facilityListHeading({ scopeName: "Dhaka" }, "bn")).toBe("Dhaka-এর হাসপাতাল ও ক্লিনিক");
    expect(pharmacyListHeading(undefined, "bn")).toBe("বাংলাদেশের ফার্মেসি");
    expect(directoryListBreadcrumbs("hospitals", undefined, [], undefined, "bn")).toEqual([
      { name: "হোম", href: "/" },
      { name: "হাসপাতাল" },
    ]);
  });

  it("points structured data at the same-language URL", () => {
    const input = { name: "a", description: "b", path: "/hospitals", items: [{ name: "X", path: "/hospital/x" }] };
    const bnJson = JSON.stringify(directoryListJsonLd({ ...input, lang: "bn" }));
    expect(bnJson).toContain("/bn/hospitals");
    expect(bnJson).toContain("/bn/hospital/x");
    expect(bnJson).toContain('"inLanguage":"bn"');
    expect(JSON.stringify(directoryListJsonLd(input))).not.toContain("/bn/");
  });
});
