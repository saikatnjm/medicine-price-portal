import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const t = getT();
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold">{t("layout.notFound.title")}</h1>
      <p className="mt-2 text-slate-600">
        {t("layout.notFound.body")}
      </p>
      <div className="mt-6 max-w-xl">
        <SearchForm id="not-found-search" />
      </div>
      <Link href={routes.home()} className="mt-6 inline-block font-medium text-brand-700 underline">
        {t("layout.notFound.home")}
      </Link>
    </Container>
  );
}
