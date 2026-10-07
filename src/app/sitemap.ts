import type { MetadataRoute } from "next";
import { services } from "@/data";
import { LOCALES, localizePath } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { listSitemapIds, parseSitemapId, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-ids";

type Entries = MetadataRoute.Sitemap;
type Entry = Entries[number];

/** One entry per language, each pointing at its translations (hreflang alternates). */
function localized(path: string, extra: Omit<Entry, "url" | "alternates">): Entries {
  const languages = Object.fromEntries(LOCALES.map((lang) => [lang, absoluteUrl(localizePath(path, lang))]));
  return LOCALES.map((lang) => ({ url: absoluteUrl(localizePath(path, lang)), ...extra, alternates: { languages } }));
}

export async function generateSitemaps(): Promise<{ id: string }[]> {
  return (await listSitemapIds()).map((id) => ({ id }));
}

async function coreEntries(): Promise<Entries> {
  const [specialties, locations, combinations] = await Promise.all([
    services.specialties.listSpecialties(),
    services.locations.listIndexable(),
    services.directory.listCombinations(),
  ]);
  const sections = [routes.hospitals(), routes.pharmacies(), routes.doctors(), routes.specialties(), routes.locations(), routes.about()];
  return [
    ...localized(routes.home(), { changeFrequency: "weekly", priority: 1 }),
    ...sections.flatMap((path) => localized(path, { changeFrequency: "weekly", priority: 0.8 })),
    ...specialties.flatMap(({ specialty }) =>
      localized(routes.specialty(specialty.slug), { changeFrequency: "monthly", priority: 0.6 }),
    ),
    ...locations.flatMap(({ location }) => localized(routes.location(location.slug), { changeFrequency: "monthly", priority: 0.6 })),
    ...combinations.flatMap((entry) =>
      localized(
        entry.type === "hospitals"
          ? routes.hospitals(entry.locationSlug, entry.specialtySlug)
          : entry.type === "doctors"
            ? routes.doctors(entry.locationSlug, entry.specialtySlug)
            : routes.pharmacies(entry.locationSlug),
        { changeFrequency: "monthly", priority: 0.5 },
      ),
    ),
  ];
}

function slice<T>(items: readonly T[], chunk: number): T[] {
  return items.slice(chunk * SITEMAP_CHUNK_SIZE, (chunk + 1) * SITEMAP_CHUNK_SIZE);
}

export default async function sitemap(props: { id: Promise<string> }): Promise<Entries> {
  const parsed = parseSitemapId(await props.id);
  if (!parsed) return [];
  const { group, chunk } = parsed;

  switch (group) {
    case "core":
      return coreEntries();
    case "medicines":
      return slice(await services.medicines.listMedicineIndex(), chunk).flatMap(({ slug, updatedAt }) =>
        localized(routes.medicine(slug), { lastModified: updatedAt, changeFrequency: "weekly", priority: 0.8 }),
      );
    case "facilities":
      return slice(await services.facilities.listIndex(), chunk).flatMap(({ slug, updatedAt }) =>
        localized(routes.hospital(slug), { lastModified: updatedAt, changeFrequency: "monthly", priority: 0.5 }),
      );
    case "pharmacies":
      return slice(await services.pharmacies.listIndex(), chunk).flatMap(({ slug, updatedAt }) =>
        localized(routes.pharmacy(slug), { lastModified: updatedAt, changeFrequency: "monthly", priority: 0.4 }),
      );
    case "doctors":
      return slice(await services.doctors.listIndex(), chunk).flatMap(({ slug, updatedAt }) =>
        localized(routes.doctor(slug), { lastModified: updatedAt, changeFrequency: "monthly", priority: 0.5 }),
      );
  }
}
