import type { GenericCount, GenericDetail, GenericProductGroup } from "../domain/read-models";
import { DOSAGE_FORMS, type DosageForm, type Generic, type Manufacturer, type Medicine } from "../domain/types";
import type { Repositories } from "../repositories";
import { SEO_THRESHOLDS } from "../lib/seo-config";

export type GenericListEntry = GenericCount;

/** Companies listed in the "top companies" section of a generic page. */
export const GENERIC_TOP_COMPANIES = 10;
/** Related combination generics listed on a generic page. */
export const GENERIC_RELATED_LIMIT = 24;

/** Ingredient names of a generic, lower-cased ("Caffeine + Paracetamol" → ["caffeine", "paracetamol"]). */
export function genericIngredients(name: string): string[] {
  return name
    .split("+")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

/** Leading number of a strength ("500 mg" → 500); strengths without one sort last. */
function strengthValue(strength: string): number {
  const match = /^\s*(\d+(?:\.\d+)?)/.exec(strength);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

/** Natural strength order: 5 mg, 20 mg, 500 mg, then strengths without a number. */
export function compareStrengths(a: string, b: string): number {
  return strengthValue(a) - strengthValue(b) || a.localeCompare(b, "en");
}

const formOrder = (form: DosageForm) => DOSAGE_FORMS.indexOf(form);
const byCountThenName = (a: GenericCount, b: GenericCount) =>
  b.productCount - a.productCount || a.generic.name.localeCompare(b.generic.name, "en");

/** Groups products by dosage form category, precise form label and strength. */
function groupProducts(products: readonly Medicine[], manufacturerById: ReadonlyMap<string, Manufacturer>): GenericProductGroup[] {
  const groups = new Map<string, Medicine[]>();
  for (const m of products) {
    const key = `${m.dosageForm}|${m.dosageFormLabel}|${m.strength}`;
    const list = groups.get(key);
    if (list) list.push(m);
    else groups.set(key, [m]);
  }
  const makerName = (m: Medicine) => manufacturerById.get(m.manufacturerId)?.name ?? "";
  return [...groups.values()]
    .map((list) => {
      const first = list[0]!;
      const sorted = [...list].sort(
        (a, b) =>
          a.brandName.localeCompare(b.brandName, "en") ||
          makerName(a).localeCompare(makerName(b), "en") ||
          a.slug.localeCompare(b.slug, "en"),
      );
      return {
        strength: first.strength,
        dosageForm: first.dosageForm,
        dosageFormLabel: first.dosageFormLabel,
        products: sorted.map((medicine) => ({ medicine, manufacturer: manufacturerById.get(medicine.manufacturerId)! })),
      };
    })
    .sort(
      (a, b) =>
        formOrder(a.dosageForm) - formOrder(b.dosageForm) ||
        a.dosageFormLabel.localeCompare(b.dosageFormLabel, "en") ||
        compareStrengths(a.strength, b.strength),
    );
}

function countBy<T>(items: readonly T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return counts;
}

/** Generic (active ingredient) hub: index and per-generic pages. */
export class GenericService {
  constructor(private readonly repos: Repositories) {}

  /** Every generic with at least one product, sorted by name. */
  async listGenerics(): Promise<GenericListEntry[]> {
    const [generics, counts] = await Promise.all([
      this.repos.generics.listAll(),
      this.repos.medicines.countBy("genericId"),
    ]);
    return generics.flatMap((generic) => {
      const productCount = counts.get(generic.id) ?? 0;
      return productCount > 0 ? [{ generic, productCount }] : [];
    });
  }

  /** Generics whose page is indexable (enough products to not be thin content). */
  async listIndexable(): Promise<GenericListEntry[]> {
    return (await this.listGenerics()).filter((e) => e.productCount >= SEO_THRESHOLDS.minCatalogProducts);
  }

  /** Generics with the most registered products (ties by name). */
  async listTopGenerics(limit: number): Promise<GenericListEntry[]> {
    return [...(await this.listGenerics())].sort(byCountThenName).slice(0, limit);
  }

  /** Returns null for an unknown slug or a generic without products (the page renders a 404). */
  async getGenericDetail(slug: string): Promise<GenericDetail | null> {
    const generic = await this.repos.generics.findBySlug(slug);
    if (!generic) return null;
    const medicines = await this.repos.medicines.findByGeneric(generic.id);
    if (medicines.length === 0) return null;

    const [manufacturers, sources, related] = await Promise.all([
      this.repos.manufacturers.findByIds([...new Set(medicines.map((m) => m.manufacturerId))]),
      this.repos.sources.findByIds([...new Set(medicines.map((m) => m.provenance.sourceId))]),
      this.relatedGenerics(generic),
    ]);
    const manufacturerById = new Map(manufacturers.map((m) => [m.id, m]));
    // Products whose manufacturer is missing are skipped rather than crashing the page.
    const products = medicines.filter((m) => manufacturerById.has(m.manufacturerId));
    if (products.length === 0) return null;

    const formCounts = countBy(products, (m) => m.dosageForm) as Map<DosageForm, number>;
    const companyCounts = countBy(products, (m) => m.manufacturerId);

    return {
      generic,
      productCount: products.length,
      brandCount: new Set(products.map((m) => m.brandName.toLowerCase())).size,
      companyCount: companyCounts.size,
      groups: groupProducts(products, manufacturerById),
      forms: [...formCounts]
        .map(([form, count]) => ({ form, count }))
        .sort((a, b) => b.count - a.count || formOrder(a.form) - formOrder(b.form)),
      strengths: [...new Set(products.map((m) => m.strength).filter(Boolean))].sort(compareStrengths),
      topCompanies: [...companyCounts]
        .map(([id, count]) => ({ manufacturer: manufacturerById.get(id)!, count }))
        .sort((a, b) => b.count - a.count || a.manufacturer.name.localeCompare(b.manufacturer.name, "en"))
        .slice(0, GENERIC_TOP_COMPANIES),
      combinations: related.combinations,
      ingredients: related.ingredients,
      sources,
      indexable: products.length >= SEO_THRESHOLDS.minCatalogProducts,
    };
  }

  /**
   * Related generics, from names only (exact ingredient-name matches, so "Omeprazole" never
   * matches "Esomeprazole"): combinations that list this generic as an ingredient and, for a
   * combination, its single ingredients that have their own page. Name variants in the source
   * data (e.g. different salts or spellings) simply do not match.
   */
  private async relatedGenerics(generic: Generic): Promise<{ combinations: GenericCount[]; ingredients: GenericCount[] }> {
    const own = genericIngredients(generic.name);
    if (own.length === 0) return { combinations: [], ingredients: [] };
    const others = (await this.listGenerics()).filter((e) => e.generic.id !== generic.id);

    if (own.length === 1) {
      const name = own[0]!;
      const combinations = others.filter((e) => {
        const parts = genericIngredients(e.generic.name);
        return parts.length > 1 && parts.includes(name);
      });
      return { combinations: combinations.sort(byCountThenName).slice(0, GENERIC_RELATED_LIMIT), ingredients: [] };
    }

    // One entry per ingredient, in the order of the combination's name.
    const ingredients = own.flatMap((part) => {
      const match = others.find((e) => e.generic.name.trim().toLowerCase() === part);
      return match ? [match] : [];
    });
    return { combinations: [], ingredients };
  }
}
