import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

/** Honest note shown while the doctor dataset is empty. */
export function DoctorsEmptyNotice({ context }: { context?: string }) {
  const t = getT();
  return (
    <section aria-labelledby="doctors-empty" className="rounded-md border border-slate-300 bg-slate-50 p-4 sm:p-5">
      <h2 id="doctors-empty" className="text-lg font-semibold text-slate-900">
        {t("doctor.empty.title")}
        {context ? ` ${context}` : ""}
      </h2>
      <p className="mt-2 text-slate-700">
        {t("doctor.empty.text1")}
      </p>
      <p className="mt-2 text-slate-700">
        {t("doctor.empty.text2")}
      </p>
      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
          {t("doctor.empty.specialties")}
        </Link>
        <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
          {t("doctor.empty.hospitals")}
        </Link>
      </p>
    </section>
  );
}
