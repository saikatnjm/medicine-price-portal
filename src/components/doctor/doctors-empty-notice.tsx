import Link from "@/i18n/link";
import { CHIP_CLASS } from "@/components/ui/chip";
import { EntityTile } from "@/components/ui/hero-card";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

/** Honest note shown while the doctor dataset is empty. */
export function DoctorsEmptyNotice({ context }: { context?: string }) {
  const t = getT();
  return (
    <section aria-labelledby="doctors-empty" className="flex gap-4 rounded-2xl bg-slate-50 p-4 sm:p-5">
      <EntityTile kind="doctor" />
      <div className="min-w-0">
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
        <p className="mt-3 flex flex-wrap gap-2">
          <Link href={routes.specialties()} className={CHIP_CLASS}>
            {t("doctor.empty.specialties")}
          </Link>
          <Link href={routes.hospitals()} className={CHIP_CLASS}>
            {t("doctor.empty.hospitals")}
          </Link>
        </p>
      </div>
    </section>
  );
}
