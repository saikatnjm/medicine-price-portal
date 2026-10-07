import { services } from "@/data";

/** Each item produces one URL per language, so 22,000 items stay below the 50,000 URL limit. */
export const SITEMAP_CHUNK_SIZE = 22_000;

export const SITEMAP_GROUPS = ["core", "medicines", "facilities", "pharmacies", "doctors"] as const;
export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

/** "medicines" for the first chunk, "medicines-2" for the second, … */
export function sitemapId(group: SitemapGroup, chunk: number): string {
  return chunk === 0 ? group : `${group}-${chunk + 1}`;
}

export function parseSitemapId(id: string): { group: SitemapGroup; chunk: number } | null {
  const match = /^([a-z]+)(?:-(\d+))?$/.exec(id);
  const group = SITEMAP_GROUPS.find((g) => g === match?.[1]);
  if (!match || !group) return null;
  const chunk = match[2] ? Number.parseInt(match[2], 10) - 1 : 0;
  return chunk >= 0 && (chunk === 0 || group !== "core") ? { group, chunk } : null;
}

function chunkIds(group: SitemapGroup, total: number): string[] {
  const chunks = Math.max(1, Math.ceil(total / SITEMAP_CHUNK_SIZE));
  return Array.from({ length: chunks }, (_, i) => sitemapId(group, i));
}

/** Every sitemap id (also listed in robots.txt). Empty groups still get one (empty) file. */
export async function listSitemapIds(): Promise<string[]> {
  const [medicines, facilities, pharmacies, doctors] = await Promise.all([
    services.medicines.listMedicineIndex(),
    services.facilities.listIndex(),
    services.pharmacies.listIndex(),
    services.doctors.listIndex(),
  ]);
  return [
    "core",
    ...chunkIds("medicines", medicines.length),
    ...chunkIds("facilities", facilities.length),
    ...chunkIds("pharmacies", pharmacies.length),
    ...chunkIds("doctors", doctors.length),
  ];
}
