import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

const externalLink = "text-brand-800 underline underline-offset-2";

/** Compact, honest summary of where the information comes from. Details live on /about. */
export function DataSourcesNote() {
  const t = getT();
  return (
    <section aria-labelledby="data-sources">
      <h2 id="data-sources" className="text-xl font-semibold text-slate-900">
        {t("home.sources.title")}
      </h2>
      <dl className="mt-4 grid max-w-3xl gap-x-6 gap-y-3 text-sm text-slate-700 sm:grid-cols-[13rem_1fr]">
        <dt className="font-medium text-slate-900">{t("home.sources.medicine")}</dt>
        <dd>{t("home.sources.medicineText")}</dd>
        <dt className="font-medium text-slate-900">{t("home.sources.locations")}</dt>
        <dd>
          {t("home.sources.osmPre")}{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className={externalLink}>
            OpenStreetMap
          </a>{" "}
          {t("home.sources.osmPost")}
        </dd>
        <dt className="font-medium text-slate-900">{t("home.sources.boundaries")}</dt>
        <dd>
          <a href="https://www.geoboundaries.org/" target="_blank" rel="noopener noreferrer" className={externalLink}>
            geoBoundaries
          </a>
          {t("home.sources.boundariesEnd")}
        </dd>
        <dt className="font-medium text-slate-900">{t("home.sources.google")}</dt>
        <dd>{t("home.sources.googleText")}</dd>
        <dt className="font-medium text-slate-900">{t("home.sources.doctors")}</dt>
        <dd>{t("home.sources.doctorsText")}</dd>
      </dl>
      <p className="mt-4 text-sm">
        <Link href={routes.about()} className={externalLink}>
          {t("home.sources.more")}
        </Link>
      </p>
    </section>
  );
}
