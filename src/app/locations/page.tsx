import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { LocationTree } from "@/components/location/location-tree";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { LOCATIONS_DESCRIPTION, LOCATIONS_TITLE } from "@/lib/seo-directory";

export const metadata: Metadata = pageMetadata({
  title: LOCATIONS_TITLE,
  description: LOCATIONS_DESCRIPTION,
  path: routes.locations(),
});

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }, { name: "Locations" }];

export default async function LocationsPage() {
  const divisions = await services.locations.listLocationTree();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.locations())} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Healthcare by location</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        Choose a division and district to find hospitals, clinics and pharmacies. Counts show what
        is currently in our directory; many places are still being added.
      </p>
      <div className="mt-8">
        {divisions.length > 0 ? (
          <LocationTree divisions={divisions} />
        ) : (
          <p className="text-slate-700">No locations are available right now.</p>
        )}
      </div>
    </Container>
  );
}
