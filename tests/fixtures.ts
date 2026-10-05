import type { LocalDataset } from "@/data/local/dataset";
import type { Medicine } from "@/domain/types";

const updatedAt = "2026-10-01T00:00:00Z";

const osm = (recordId: string) => ({
  sourceId: "osm",
  recordId,
  recordUrl: `https://www.openstreetmap.org/${recordId}`,
  status: "unverified" as const,
});

function med(overrides: Partial<Medicine> & Pick<Medicine, "id" | "slug" | "brandName">): Medicine {
  return {
    genericId: "g1",
    manufacturerId: "mf1",
    strength: "500 mg",
    dosageForm: "tablet",
    dosageFormLabel: "Tablet",
    updatedAt,
    provenance: { sourceId: "src1", recordId: overrides.id, status: "registered" },
    ...overrides,
  };
}

/**
 * Small hand-made dataset for service and component tests, independent of the
 * real catalogue. Prices and pharmacies here are test data only.
 */
export const fixtureDataset: LocalDataset = {
  generics: [
    { id: "g1", slug: "paracetamol", name: "Paracetamol" },
    { id: "g2", slug: "omeprazole", name: "Omeprazole" },
  ],
  manufacturers: [{ id: "mf1", slug: "maker", name: "Maker Ltd." }],
  sources: [
    {
      id: "osm",
      name: "OpenStreetMap",
      publisher: "OpenStreetMap contributors",
      url: "https://www.openstreetmap.org/",
      licence: "Open Database License (ODbL) 1.0",
      attribution: "© OpenStreetMap contributors",
      retrievedAt: updatedAt,
    },
    {
      id: "test-doctors",
      name: "Test doctor source",
      publisher: "Test Publisher",
      url: "https://example.org/doctors",
      retrievedAt: updatedAt,
    },
    {
      id: "src1",
      name: "Test Registry",
      publisher: "Test Publisher",
      url: "https://example.org/registry",
      retrievedAt: updatedAt,
    },
  ],
  medicines: [
    med({
      id: "m1",
      slug: "napa-500mg",
      brandName: "Napa",
      packSize: { quantity: 10, unit: "tablets" },
      prescriptionRequired: false,
      provenance: {
        sourceId: "src1",
        recordId: "m1",
        darNumber: "186-0030-006",
        status: "registered",
      },
    }),
    med({ id: "m2", slug: "ace-500mg", brandName: "Ace" }),
    med({
      id: "m3",
      slug: "napa-120mg-5ml-suspension",
      brandName: "Napa",
      strength: "120 mg/5 mL",
      dosageForm: "suspension",
      dosageFormLabel: "Suspension",
    }),
    med({
      id: "m4",
      slug: "seclo-20mg",
      brandName: "Seclo",
      genericId: "g2",
      strength: "20 mg",
      dosageForm: "capsule",
      dosageFormLabel: "Capsule",
    }),
    med({ id: "m5", slug: "napadol-500mg", brandName: "Napadol" }),
    med({
      id: "m6",
      slug: "napa-sr-500mg-sr-tablet",
      brandName: "Napa SR",
      dosageFormLabel: "SR Tablet",
      registeredName: "Napa SR 500",
    }),
  ],
  pharmacies: [
    {
      id: "p1",
      slug: "alpha-pharmacy",
      name: "Alpha Pharmacy",
      locality: "Road 27",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_dhanmondi",
      phone: "+880 1700-000001",
      coordinates: { lat: 23.7465, lon: 90.3760 },
      updatedAt,
      provenance: osm("node/101"),
    },
    {
      id: "p2",
      slug: "beta-pharmacy",
      name: "Beta Pharmacy",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_gulshan",
      coordinates: { lat: 23.7925, lon: 90.4078 },
      updatedAt,
      provenance: osm("node/102"),
    },
  ],
  popularMedicineIds: ["m2", "m1", "missing-id"],
  prices: [
    {
      id: "pr1",
      medicineId: "m1",
      pharmacyId: "p1",
      amount: 12,
      currency: "BDT",
      availability: "in_stock",
      source: "sample",
      updatedAt,
    },
    {
      id: "pr2",
      medicineId: "m1",
      pharmacyId: "p2",
      amount: 11.5,
      currency: "BDT",
      availability: "limited",
      source: "sample",
      updatedAt,
    },
    {
      id: "pr3",
      medicineId: "m2",
      pharmacyId: "p1",
      amount: 12,
      currency: "BDT",
      availability: "in_stock",
      source: "sample",
      updatedAt,
    },
  ],
  locations: [
    { id: "loc_div_dhaka", slug: "dhaka-division", name: "Dhaka", level: "division" },
    { id: "loc_div_ctg", slug: "chattogram-division", name: "Chattogram", level: "division" },
    { id: "loc_dis_dhaka", slug: "dhaka", name: "Dhaka", nameBn: "ঢাকা", level: "district", parentId: "loc_div_dhaka" },
    { id: "loc_dis_ctg", slug: "chattogram", name: "Chattogram", level: "district", parentId: "loc_div_ctg" },
    { id: "loc_area_dhanmondi", slug: "dhanmondi", name: "Dhanmondi", level: "area", parentId: "loc_dis_dhaka" },
    { id: "loc_area_gulshan", slug: "gulshan", name: "Gulshan", level: "area", parentId: "loc_dis_dhaka" },
  ],
  specialties: [
    {
      id: "spec_cardiology",
      slug: "cardiology",
      name: "Cardiology",
      practitionerTitle: "Cardiologist",
      description: "The branch of medicine concerned with the heart and blood vessels.",
      aliases: ["heart", "cardiac"],
    },
    {
      id: "spec_dentistry",
      slug: "dentistry",
      name: "Dentistry",
      practitionerTitle: "Dentist",
      description: "Care of the teeth, gums and mouth.",
      aliases: ["dental", "teeth"],
    },
  ],
  facilities: [
    {
      id: "fac_1",
      slug: "central-heart-hospital-dhaka",
      name: "Central Heart Hospital",
      kind: "hospital",
      ownership: "private",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_dhanmondi",
      locality: "Panthapath",
      address: "1 Test Road, Dhanmondi, Dhaka",
      phone: "+880 2-0000001",
      website: "https://example.org/hospital",
      emergency: true,
      specialtyIds: ["spec_cardiology"],
      coordinates: { lat: 23.7500, lon: 90.3800 },
      updatedAt,
      provenance: osm("way/201"),
    },
    {
      id: "fac_2",
      slug: "gulshan-dental-clinic-dhaka",
      name: "Gulshan Dental Clinic",
      kind: "dental_clinic",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_gulshan",
      phone: "+880 1700-000002",
      specialtyIds: ["spec_dentistry"],
      coordinates: { lat: 23.7930, lon: 90.4080 },
      updatedAt,
      provenance: osm("node/202"),
    },
    {
      id: "fac_3",
      slug: "harbour-hospital-chattogram",
      name: "Harbour Hospital",
      kind: "hospital",
      districtId: "loc_dis_ctg",
      specialtyIds: [],
      updatedAt,
      provenance: osm("node/203"),
    },
  ],
  doctors: [
    {
      id: "doc_1",
      slug: "dr-test-example",
      name: "Dr. Test Example",
      specialtyIds: ["spec_cardiology"],
      qualifications: "MBBS (test)",
      chambers: [
        { facilityId: "fac_1", consultationDays: "Sat–Thu", consultationHours: "5 pm – 9 pm" },
        { facilityName: "Test Chamber", districtId: "loc_dis_dhaka", areaId: "loc_area_gulshan" },
      ],
      updatedAt,
      provenance: { sourceId: "test-doctors", recordId: "d1", status: "verified", verificationMethod: "official_profile", verifiedAt: "2026-10-01T00:00:00Z", recordUrl: "https://example.org/dr/d1" },
    },
  ],
};
