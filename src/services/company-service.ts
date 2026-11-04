import type {
  CatalogCount,
  CatalogPagination,
  CompanyDetail,
  CompanyProductGroup,
  DosageFormDetail,
} from "../domain/read-models";
import { DOSAGE_FORMS, type DosageForm, type Generic, type ID, type Manufacturer, type Medicine } from "../domain/types";
import type { Repositories } from "../repositories";
import { SEO_THRESHOLDS } from "../lib/seo-config";

export interface CompanyListEntry {
  manufacturer: Manufacturer;
  productCount: number;
}

export interface DosageFormListEntry {
  form: DosageForm;
  productCount: number;
}

/** A paginated catalogue page after the first (page >= 2), for the sitemap. */
export interface CatalogPageRef {
  type: "company" | "dosageForm";
  /** Manufacturer slug or dosage form. */
  slug: string;
  page: number;
}

/** Products per page on company and dosage-form pages. */
export const CATALOG_PAGE_SIZE = 200;
/** Length of "top generics" / "top companies" lists. */
export const CATALOG_TOP_LIMIT = 12;

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

export function isDosageForm(value: string): value is DosageForm {
  return (DOSAGE_FORMS as readonly string[]).includes(value);
}

/** null when the page is out of range (or not a positive integer). */
export function paginate(total: number, page: number, pageSize: number): CatalogPagination | null {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  return { page, totalPages, pageSize, offset: (page - 1) * pageSize };
}

function countValues<K>(items: readonly Medicine[], key: (m: Medicine) => K): Map<K, number> {
  const counts = new Map<K, number>();
  for (const m of items) counts.set(key(m), (counts.get(key(m)) ?? 0) + 1);
  return counts;
}

/** Most products first; ties by name. */
function ranked<T>(counts: ReadonlyMap<ID, number>, byId: ReadonlyMap<ID, T>, name: (item: T) => string): CatalogCount<T>[] {
  return [...counts]
    .flatMap(([id, count]) => {
      const item = byId.get(id);
      return item ? [{ item, count }] : [];
    })
    .sort((a, b) => b.count - a.count || collator.compare(name(a.item), name(b.item)));
}

const byIdMap = <T extends { id: ID }>(items: readonly T[]) => new Map(items.map((item) => [item.id, item]));

/** Pharmaceutical company (manufacturer) and dosage-form hubs. */
export class CompanyService {
  constructor(
    private readonly repos: Repositories,
    private readonly pageSize: number = CATALOG_PAGE_SIZE,
  ) {}

  /** Every manufacturer with at least one product, sorted by name. */
  async listCompanies(): Promise<CompanyListEntry[]> {
    const [manufacturers, counts] = await Promise.all([
      this.repos.manufacturers.listAll(),
      this.repos.medicines.countBy("manufacturerId"),
    ]);
    return manufacturers.flatMap((manufacturer) => {
      const productCount = counts.get(manufacturer.id) ?? 0;
      return productCount > 0 ? [{ manufacturer, productCount }] : [];
    });
  }

  /** Companies by number of registered products (most first; ties by name). Not a ranking of merit. */
  async listRanked(): Promise<CompanyListEntry[]> {
    return (await this.listCompanies()).sort((a, b) => b.productCount - a.productCount);
  }

  async listIndexable(): Promise<CompanyListEntry[]> {
    return (await this.listCompanies()).filter((e) => e.productCount >= SEO_THRESHOLDS.minCatalogProducts);
  }

  /** Dosage forms with at least one product, in DOSAGE_FORMS order. */
  async listDosageForms(): Promise<DosageFormListEntry[]> {
    const counts = await this.repos.medicines.countBy("dosageForm");
    return DOSAGE_FORMS.flatMap((form) => {
      const productCount = counts.get(form) ?? 0;
      return productCount > 0 ? [{ form, productCount }] : [];
    });
  }

  /** Pages 2..N of every indexable company and dosage form (page 1 is the hub/detail URL itself). */
  async listIndexablePages(): Promise<CatalogPageRef[]> {
    const [companies, forms] = await Promise.all([this.listIndexable(), this.listDosageForms()]);
    const pages = (type: CatalogPageRef["type"], slug: string, count: number): CatalogPageRef[] =>
      Array.from({ length: Math.ceil(count / this.pageSize) - 1 }, (_, i) => ({ type, slug, page: i + 2 }));
    return [
      ...companies.flatMap((e) => pages("company", e.manufacturer.slug, e.productCount)),
      ...forms
        .filter((e) => e.productCount >= SEO_THRESHOLDS.minCatalogProducts)
        .flatMap((e) => pages("dosageForm", e.form, e.productCount)),
    ];
  }

  /** Company page: products sorted by generic then brand, grouped by generic. null when unknown or out of range. */
  async getCompanyDetail(slug: string, page = 1): Promise<CompanyDetail | null> {
    const manufacturer = await this.repos.manufacturers.findBySlug(slug);
    if (!manufacturer) return null;
    const all = await this.repos.medicines.findByManufacturer(manufacturer.id);
    const genericsById = byIdMap(await this.repos.generics.findByIds(all.map((m) => m.genericId)));
    const products = all.filter((m) => genericsById.has(m.genericId));
    if (products.length === 0) return null;
    const pagination = paginate(products.length, page, this.pageSize);
    if (!pagination) return null;

    const genericName = (m: Medicine) => genericsById.get(m.genericId)!.name;
    // Stable sort: the repository's brand order is kept within each generic.
    products.sort((a, b) => collator.compare(genericName(a), genericName(b)) || collator.compare(a.genericId, b.genericId));

    const groups: CompanyProductGroup[] = [];
    for (const medicine of products.slice(pagination.offset, pagination.offset + this.pageSize)) {
      const last = groups[groups.length - 1];
      if (last?.generic.id === medicine.genericId) last.products.push(medicine);
      else groups.push({ generic: genericsById.get(medicine.genericId)!, products: [medicine] });
    }

    const genericCounts = countValues(products, (m) => m.genericId);
    const formCounts = countValues(products, (m) => m.dosageForm);
    return {
      manufacturer,
      productCount: products.length,
      genericCount: genericCounts.size,
      forms: DOSAGE_FORMS.flatMap((form) => (formCounts.has(form) ? [{ item: form, count: formCounts.get(form)! }] : [])).sort(
        (a, b) => b.count - a.count,
      ),
      topGenerics: ranked(genericCounts, genericsById, (g: Generic) => g.name).slice(0, CATALOG_TOP_LIMIT),
      groups,
      pagination,
      indexable: products.length >= SEO_THRESHOLDS.minCatalogProducts,
    };
  }

  /** Dosage-form page: counts, top generics and companies, and a brand-sorted product page. */
  async getDosageFormDetail(form: string, page = 1): Promise<DosageFormDetail | null> {
    if (!isDosageForm(form)) return null;
    const all = await this.repos.medicines.findByDosageForm(form);
    const [generics, manufacturers] = await Promise.all([
      this.repos.generics.findByIds(all.map((m) => m.genericId)),
      this.repos.manufacturers.findByIds(all.map((m) => m.manufacturerId)),
    ]);
    const genericsById = byIdMap(generics);
    const manufacturersById = byIdMap(manufacturers);
    const products = all.filter((m) => genericsById.has(m.genericId) && manufacturersById.has(m.manufacturerId));
    if (products.length === 0) return null;
    const pagination = paginate(products.length, page, this.pageSize);
    if (!pagination) return null;

    const genericCounts = countValues(products, (m) => m.genericId);
    const companyCounts = countValues(products, (m) => m.manufacturerId);
    const labels = [...countValues(products, (m) => m.dosageFormLabel)]
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count || collator.compare(a.item, b.item));
    return {
      form,
      productCount: products.length,
      genericCount: genericCounts.size,
      companyCount: companyCounts.size,
      labels: labels.slice(0, CATALOG_TOP_LIMIT),
      topGenerics: ranked(genericCounts, genericsById, (g: Generic) => g.name).slice(0, CATALOG_TOP_LIMIT),
      topCompanies: ranked(companyCounts, manufacturersById, (m: Manufacturer) => m.name).slice(0, CATALOG_TOP_LIMIT),
      products: products.slice(pagination.offset, pagination.offset + this.pageSize).map((medicine) => ({
        medicine,
        generic: genericsById.get(medicine.genericId)!,
        manufacturer: manufacturersById.get(medicine.manufacturerId)!,
      })),
      pagination,
      indexable: products.length >= SEO_THRESHOLDS.minCatalogProducts,
    };
  }
}
