import Link from "@/i18n/link";
import { Container } from "@/components/ui/container";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

export default function DoctorNotFound() {
  const t = getT();
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">{t("doctor.notFound.title")}</h1>
      <p className="mt-2 text-slate-700">{t("doctor.notFound.text")}</p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.doctors()} className="font-medium text-brand-800 underline">
          {t("doctor.notFound.doctors")}
        </Link>
        <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
          {t("doctor.notFound.specialties")}
        </Link>
        <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
          {t("doctor.notFound.hospitals")}
        </Link>
      </div>
    </Container>
  );
}
