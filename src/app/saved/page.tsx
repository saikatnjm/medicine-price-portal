import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SavedList } from "@/components/retention/saved-list";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";

const TITLE = "Saved items";

// Personal page (the list lives in the visitor's browser): never indexed.
export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: "Medicines, hospitals, pharmacies and doctors you saved in this browser.",
  path: routes.saved(),
  indexable: false,
});

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }, { name: TITLE }];

export default function SavedPage() {
  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{TITLE}</h1>
      <p className="mt-2 max-w-2xl text-slate-700">
        Saved on this device only. No account is needed and nothing is sent to us. Clearing your browser data removes them.
      </p>
      <div className="mt-6">
        <SavedList />
      </div>
    </Container>
  );
}
