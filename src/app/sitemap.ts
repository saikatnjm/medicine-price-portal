import type { MetadataRoute } from "next";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [medicines, pharmacies] = await Promise.all([
    services.medicines.listMedicineIndex(),
    services.pharmacies.listPharmacies(),
  ]);
  return [
    { url: absoluteUrl(routes.home()), changeFrequency: "weekly", priority: 1 },
    ...medicines.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(routes.medicine(slug)),
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...pharmacies.map(({ slug }) => ({
      url: absoluteUrl(routes.pharmacy(slug)),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
