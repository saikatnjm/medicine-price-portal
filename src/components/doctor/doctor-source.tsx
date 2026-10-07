import type { Doctor, DoctorVerificationMethod } from "@/domain/healthcare";
import { ReportIssue } from "@/components/directory/report-issue";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import type { DataSource } from "@/domain/types";
import { formatDate } from "@/lib/format";

const METHOD_KEY = {
  official_profile: "doctor.source.method.official_profile",
  doctor_provided: "doctor.source.method.doctor_provided",
  registry: "doctor.source.method.registry",
} as const satisfies Record<DoctorVerificationMethod, string>;

/** "1 Oct 2026" in English; Bangla month names with Latin digits. */
function formatVerifiedDate(iso: string, lang: Locale): string {
  if (lang === DEFAULT_LOCALE) return formatDate(iso);
  return new Intl.DateTimeFormat("bn-BD-u-nu-latn", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));
}

/** Where a doctor profile came from and how it was verified, plus a way to report a problem. */
export function DoctorSource({ doctor, source }: { doctor: Doctor; source: DataSource | null }) {
  const t = getT();
  const lang = getLocale();
  const { provenance } = doctor;
  const methodKey = METHOD_KEY[provenance.verificationMethod as DoctorVerificationMethod] as
    | (typeof METHOD_KEY)[DoctorVerificationMethod]
    | undefined;
  const method = methodKey ? t(methodKey) : undefined;
  return (
    <section aria-labelledby="doctor-source" className="space-y-2 text-sm text-slate-700">
      <h2 id="doctor-source" className="text-base font-semibold text-slate-900">
        {t("doctor.source.heading")}
      </h2>
      <p>
        {source && (
          <>
            {t("doctor.source.sourceLabel")}{" "}
            <a
              href={provenance.recordUrl ?? source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-800 underline"
            >
              {source.name}
            </a>
            {t("doctor.dot")}{" "}
          </>
        )}
        {provenance.verifiedAt && <>{t("doctor.source.verifiedOn", { date: formatVerifiedDate(provenance.verifiedAt, lang) })}</>}
        {method && <>{provenance.verifiedAt ? ", " : t("doctor.source.verificationLabel")}{method}</>}
        {(provenance.verifiedAt || method) && t("doctor.dot")}
      </p>
      <p>{t("doctor.source.note")}</p>
      <ReportIssue entity="doctor" slug={doctor.slug} name={doctor.name} path={routes.doctor(doctor.slug)} provenance={provenance} />
    </section>
  );
}
