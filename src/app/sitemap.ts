import type { MetadataRoute } from "next";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { listSitemapIds, parseSitemapId, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-ids";

type Entries = MetadataRoute.Sitemap;

export async function generateSitemaps(): Promise<{ id: string }[]> {
  return (await listSitemapIds()).map((id) => ({ id }));
}

async function coreEntries(): Promise<Entries> {
  const [specialties, locations, combinations] = await Promise.all([
    services.specialties.listSpecialties(),
    services.locations.listIndexable(),
    services.directory.listCombinations(),
  ]);
  const sections = [routes.hospitals(), routes.pharmacies(), routes.doctors(), routes.specialties(), routes.locations()];
  return [
    { url: absoluteUrl(routes.home()), changeFrequency: "weekly", priority: 1 },
    ...sections.map((path) => ({ url: absoluteUrl(path), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...specialties.map(({ specialty }) => ({
      url: absoluteUrl(routes.specialty(specialty.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...locations.map(({ location }) => ({
      url: absoluteUrl(routes.location(location.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...combinations.map((entry) => ({
      url: absoluteUrl(
        entry.type === "hospitals"
          ? routes.hospitals(entry.locationSlug, entry.specialtySlug)
          : entry.type === "doctors"
            ? routes.doctors(entry.locationSlug, entry.specialtySlug)
            : routes.pharmacies(entry.locationSlug),
      ),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
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
      return slice(await services.medicines.listMedicineIndex(), chunk).map(({ slug, updatedAt }) => ({
        url: absoluteUrl(routes.medicine(slug)),
        lastModified: updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    case "facilities":
      return slice(await services.facilities.listIndex(), chunk).map(({ slug, updatedAt }) => ({
        url: absoluteUrl(routes.hospital(slug)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      }));
    case "pharmacies":
      return slice(await services.pharmacies.listIndex(), chunk).map(({ slug, updatedAt }) => ({
        url: absoluteUrl(routes.pharmacy(slug)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.4,
      }));
    case "doctors":
      return slice(await services.doctors.listIndex(), chunk).map(({ slug, updatedAt }) => ({
        url: absoluteUrl(routes.doctor(slug)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      }));
  }
}
