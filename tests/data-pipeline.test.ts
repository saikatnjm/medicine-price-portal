import { describe, expect, it } from "vitest";
import { DOSAGE_FORMS } from "@/domain/types";
import { buildCatalog, type RawRegistryRecord } from "../scripts/data/build-catalog.mjs";
import {
  brandNameOf,
  classifyDosageForm,
  DOSAGE_FORM_CATEGORIES,
  isVeterinary,
  manufacturerDisplayName,
  manufacturerKey,
  normalizeStrength,
  splitGenericContent,
} from "../scripts/data/lib/normalize.mjs";
import { validateDataset } from "../scripts/data/validate-data.mjs";

describe("normalisation rules", () => {
  it("splits generic content into ingredients and strength", () => {
    expect(splitGenericContent("Amoxicillin + Clavulanic Acid  140 mg + 35 mg/ml")).toEqual({
      ingredients: ["Amoxicillin", "Clavulanic Acid"],
      strength: "140 mg + 35 mg/mL",
    });
    expect(splitGenericContent("Pentosan Polysulfate  Sodium  100 mg")).toEqual({
      ingredients: ["Pentosan Polysulfate Sodium"],
      strength: "100 mg",
    });
    expect(splitGenericContent("")).toBeNull();
  });

  it("normalises strength notation without losing concentration", () => {
    expect(normalizeStrength(" .5 %")).toBe("0.5%");
    expect(normalizeStrength("200 mg / 5 ml")).toBe("200 mg/5 mL");
    expect(normalizeStrength("40000 iu")).toBe("40000 IU");
  });

  it("keeps the precise dosage form and maps it to a controlled category", () => {
    expect(classifyDosageForm("Sr Tablet")).toEqual({ category: "tablet", label: "SR Tablet" });
    expect(classifyDosageForm("Powder For Suspension")).toEqual({
      category: "suspension",
      label: "Powder for Suspension",
    });
    expect(classifyDosageForm("Eye and Ear Drops")).toEqual({
      category: "drops",
      label: "Eye and Ear Drops",
    });
    expect(classifyDosageForm("Bolus")).toHaveProperty("excluded");
    expect(classifyDosageForm("")).toHaveProperty("excluded");
  });

  it("keeps the controlled vocabulary in sync with the domain types", () => {
    expect([...DOSAGE_FORM_CATEGORIES].sort()).toEqual([...DOSAGE_FORMS].sort());
  });

  it("drops factory sites from manufacturer names but not the company", () => {
    expect(manufacturerDisplayName("Square Pharmaceuticals PLC, Pabna")).toBe(
      "Square Pharmaceuticals PLC",
    );
    expect(manufacturerDisplayName("Eskayef Pharmaceuticals Ltd. Mirpur.")).toBe(
      "Eskayef Pharmaceuticals Ltd.",
    );
    expect(manufacturerKey("Opsonin Pharma Limited")).toBe(manufacturerKey("Opsonin Pharma Ltd."));
  });

  it("removes a strength suffix from the brand only when it matches the strength", () => {
    expect(brandNameOf("Acumet 50", "50 mg")).toBe("Acumet");
    expect(brandNameOf("Naproxen-500", "500 mg")).toBe("Naproxen");
    expect(brandNameOf("Acumet 50", "25 mg")).toBe("Acumet 50");
    expect(brandNameOf("Napa", "500 mg")).toBe("Napa");
  });

  it("detects veterinary products", () => {
    expect(isVeterinary({ darNumber: "005-0619-077", tradeName: "Acimec", company: "ACI" })).toBe(
      true,
    );
    expect(
      isVeterinary({ darNumber: "036-0852-", tradeName: "Moxilin Vet LA", company: "ACME" }),
    ).toBe(true);
    expect(isVeterinary({ darNumber: "186-0030-006", tradeName: "Napa", company: "Beximco" })).toBe(
      false,
    );
  });
});

function record(
  overrides: Partial<RawRegistryRecord> & Pick<RawRegistryRecord, "id">,
): RawRegistryRecord {
  return {
    conceptClass: "Drug",
    retired: false,
    darNumber: "100-0001-006",
    darQualityFlag: "",
    tradeName: "Brand",
    company: "Maker Pharmaceuticals Ltd.",
    dosageForm: "Tablet",
    genericContentRaw: "Paracetamol  500 mg",
    ...overrides,
  };
}

const raw = {
  meta: {
    retrievedAt: "2026-10-04T00:00:00.000Z",
    source: {
      name: "Registry",
      publisher: "Publisher",
      api: "https://api.example",
      documentation: "https://docs.example",
    },
  },
  records: [
    record({ id: "1--napa", tradeName: "Napa", darNumber: "186-0030-006" }),
    record({
      id: "2--napa",
      tradeName: "Napa",
      darNumber: "321-0080-006",
      company: "Maker Pharmaceuticals Ltd., Gazipur",
    }),
    record({ id: "3--napa", tradeName: "Napa", company: "Other Labs Ltd." }),
    record({
      id: "4--acumet-50",
      tradeName: "Acumet 50",
      genericContentRaw: "Metoprolol Tartrate  50 mg",
    }),
    record({ id: "5--vet", tradeName: "Cure Vet", darNumber: "100-0002-023" }),
    record({ id: "6--bolus", tradeName: "Big", dosageForm: "Bolus" }),
    record({ id: "7--dar077", tradeName: "Livestock", darNumber: "100-0003-077" }),
    record({ id: "8--ingredient", conceptClass: "Ingredient" }),
    record({ id: "9--retired", retired: true }),
    record({ id: "10--blank", tradeName: "" }),
    record({
      id: "11--flagged",
      tradeName: "Flagged",
      darNumber: "100--006",
      darQualityFlag: "dar_malformed",
    }),
  ],
};

describe("catalogue build", () => {
  const result = buildCatalog(raw);
  const bySlug = new Map(result.medicines.map((m) => [m.slug, m]));

  it("rejects non-human, non-drug, retired and malformed records with reasons", () => {
    expect(result.report.rejectedByReason).toEqual({
      veterinary_product: 2,
      non_human_dosage_form: 1,
      not_a_drug_product: 1,
      retired: 1,
      missing_or_malformed_brand: 1,
    });
  });

  it("deduplicates the same product registered at several plants of one company", () => {
    expect(result.duplicates).toEqual([
      expect.objectContaining({ id: "2--napa", keptId: "1--napa" }),
    ]);
  });

  it("keeps the same brand from a different manufacturer and resolves the slug collision", () => {
    expect(bySlug.get("napa-500mg")?.provenance.recordId).toBe("1--napa");
    expect(bySlug.get("napa-500mg-other-labs")?.provenance.recordId).toBe("3--napa");
    expect(result.report.slugCollisionsResolved).toBe(1);
  });

  it("normalises names and keeps the registered name and provenance", () => {
    const acumet = bySlug.get("acumet-50mg");
    expect(acumet?.brandName).toBe("Acumet");
    expect(acumet?.registeredName).toBe("Acumet 50");
    expect(acumet?.provenance).toEqual({
      sourceId: "dgda-registry",
      recordId: "4--acumet-50",
      darNumber: "100-0001-006",
      status: "registered",
    });
    expect(result.manufacturers.map((m) => m.name)).toEqual([
      "Maker Pharmaceuticals Ltd.",
      "Other Labs Ltd.",
    ]);
  });

  it("withholds DAR numbers that failed the source's quality checks", () => {
    expect(bySlug.get("flagged-500mg")?.provenance.darNumber).toBeUndefined();
  });

  it("produces a dataset that passes validation, and is deterministic", () => {
    const { errors } = validateDataset({
      medicines: result.medicines,
      generics: result.generics,
      manufacturers: result.manufacturers,
      sources: result.sources,
      pharmacies: [],
      prices: [],
      popular: result.popular,
    });
    expect(errors).toEqual([]);
    expect(JSON.stringify(buildCatalog(raw).medicines)).toBe(JSON.stringify(result.medicines));
  });
});

describe("dataset validation", () => {
  const base = buildCatalog(raw);
  const files = () => ({
    medicines: base.medicines.map((m) => ({ ...m })),
    generics: base.generics,
    manufacturers: base.manufacturers,
    sources: base.sources,
    pharmacies: [],
    prices: [],
    popular: [],
  });

  it("detects duplicate ids, broken references and invalid dosage forms", () => {
    const data = files();
    data.medicines[1] = { ...data.medicines[1]!, id: data.medicines[0]!.id };
    data.medicines[2] = {
      ...data.medicines[2]!,
      genericId: "gen_missing",
      dosageForm: "potion" as never,
    };
    const { errors } = validateDataset(data);
    expect(errors.some((e) => e.startsWith("[duplicate_medicine_id]"))).toBe(true);
    expect(errors.some((e) => e.startsWith("[broken_reference]"))).toBe(true);
    expect(errors.some((e) => e.startsWith("[invalid_dosage_form]"))).toBe(true);
  });

  it("detects duplicate product identities and missing required fields", () => {
    const data = files();
    data.medicines.push({ ...data.medicines[0]!, id: "copy", slug: "copy" });
    data.medicines.push({ ...data.medicines[0]!, id: "blank", slug: "blank", brandName: "" });
    const { errors } = validateDataset(data);
    expect(errors.some((e) => e.startsWith("[duplicate_product]"))).toBe(true);
    expect(errors.some((e) => e.startsWith("[missing_field]"))).toBe(true);
  });
});
