import type { DataSource, Provenance } from "@/domain/types";
import type { MessageKey } from "@/i18n/messages";
import { getLocale, getT } from "@/i18n/server";
import { formatDateIn } from "@/lib/directory-labels";

/**
 * Where a directory record comes from. OpenStreetMap data must carry the
 * "© OpenStreetMap contributors" attribution (ODbL).
 */
export function SourceAttribution({ source, provenance }: { source: DataSource | null; provenance?: Provenance }) {
  if (!source) return null;
  const t = getT();
  const lang = getLocale();
  return (
    <p className="text-sm text-slate-600">
      {t("directory.source.label")}{" "}
      <a href={provenance?.recordUrl ?? source.url} target="_blank" rel="noopener noreferrer" className="underline">
        {source.attribution ?? source.name}
        <span className="sr-only">{t("directory.newTab")}</span>
      </a>
      {source.licenceUrl && (
        <>
          {" "}
          (
          <a href={source.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {source.licence ?? t("directory.source.licence")}
            <span className="sr-only">{t("directory.newTab")}</span>
          </a>
          )
        </>
      )}
      {t("directory.source.retrieved", { date: formatDateIn(source.retrievedAt, lang) })}{" "}
      {provenance?.status === "unverified" && t("directory.source.unverifiedNote")}
      {provenance?.status === "verified" && t("directory.source.verifiedNote")}
    </p>
  );
}

const STATUS_KEYS = {
  registered: "directory.source.status.registered",
  unverified: "directory.source.status.unverified",
  needs_review: "directory.source.status.needs_review",
  verified: "directory.source.status.verified",
  user_reported: "directory.source.status.user_reported",
} as const satisfies Record<Provenance["status"], MessageKey>;

/** "Source & last checked": source, plain-words status, dates and the name as it appears in the source. */
export function SourceSection({
  source,
  provenance,
  sourceName,
  headingId = "source",
}: {
  source: DataSource | null;
  provenance: Provenance;
  /** Original name in the source data, when it differs from the displayed name. */
  sourceName?: string;
  headingId?: string;
}) {
  const t = getT();
  const lang = getLocale();
  const rows: Array<[string, string]> = [[t("directory.source.row.status"), t(STATUS_KEYS[provenance.status])]];
  if (provenance.lastCheckedAt) rows.push([t("directory.source.row.lastChecked"), formatDateIn(provenance.lastCheckedAt, lang)]);
  if (provenance.sourceUpdatedAt) rows.push([t("directory.source.row.sourceUpdated"), formatDateIn(provenance.sourceUpdatedAt, lang)]);
  if (sourceName) rows.push([t("directory.source.row.sourceName"), sourceName]);
  return (
    <section aria-labelledby={headingId} className="space-y-2">
      <h2 id={headingId} className="text-lg font-semibold text-slate-900">
        {t("directory.source.heading")}
      </h2>
      <SourceAttribution source={source} provenance={provenance} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-slate-700">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-medium">{label}</dt>
            <dd className="min-w-0 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
