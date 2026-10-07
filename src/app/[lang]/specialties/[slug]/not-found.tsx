import Link from "@/i18n/link";
import { Container } from "@/components/ui/container";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

export default function SpecialtyNotFound() {
  const t = getT();
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">{t("specialty.notFound.title")}</h1>
      <p className="mt-2 text-slate-700">{t("specialty.notFound.text")}</p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
          {t("specialty.notFound.all")}
        </Link>
        <Link href={routes.home()} className="font-medium text-brand-800 underline">
          {t("specialty.notFound.home")}
        </Link>
      </div>
    </Container>
  );
}
