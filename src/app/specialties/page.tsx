import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SpecialtyList } from "@/components/specialty/specialty-list";
import { InformationNotice } from "@/components/specialty/information-notice";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { SPECIALTIES_DESCRIPTION, SPECIALTIES_TITLE } from "@/lib/seo-directory";

export const metadata: Metadata = pageMetadata({
  title: SPECIALTIES_TITLE,
  description: SPECIALTIES_DESCRIPTION,
  path: routes.specialties(),
});

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }, { name: "Specialties" }];

export default async function SpecialtiesPage() {
  const specialties = await services.specialties.listSpecialties();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.specialties())} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Medical specialties</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        Browse fields of medicine and see which hospitals and clinics in Bangladesh list them.
        Counts show what is currently in our directory, not everything that exists.
      </p>
      <div className="mt-6 space-y-8">
        {specialties.length > 0 ? (
          <SpecialtyList items={specialties} />
        ) : (
          <p className="text-slate-700">No specialties are available right now.</p>
        )}
        <InformationNotice />
      </div>
    </Container>
  );
}
