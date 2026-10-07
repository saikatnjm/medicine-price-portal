import Link from "@/i18n/link";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

export default function MedicineNotFound() {
  const t = getT();
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">{t("medicine.notfound.heading")}</h1>
      <p className="mt-2 text-slate-700">{t("medicine.notfound.body")}</p>
      <div className="mt-6 max-w-xl">
        <SearchForm id="not-found-search" />
      </div>
      <Link href={routes.home()} className="mt-6 inline-block font-medium text-brand-800 underline">
        {t("medicine.notfound.home")}
      </Link>
    </Container>
  );
}
