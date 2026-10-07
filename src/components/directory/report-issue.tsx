import type { Provenance } from "@/domain/types";
import { getT } from "@/i18n/server";
import { reportHref, type ReportEntity } from "@/lib/report";
import { ReportForm } from "./report-form";

export { reportHref };

const OSM_RECORD = /^(node|way|relation)\/(\d+)$/;

/** OpenStreetMap edit link for an OSM-sourced record ("node/123"); null for other sources. */
export function osmEditUrl(provenance: Pick<Provenance, "sourceId" | "recordId" | "recordUrl">): string | null {
  const isOsm = provenance.sourceId === "osm" || Boolean(provenance.recordUrl?.includes("openstreetmap.org"));
  const match = OSM_RECORD.exec(provenance.recordId);
  if (!isOsm || !match) return null;
  return `https://www.openstreetmap.org/edit?${match[1]}=${match[2]}`;
}

const linkClass =
  "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50";

interface ReportIssueProps {
  /** Record name, used in the prefilled subject. */
  name: string;
  /** Public path of the page, e.g. "/hospital/abc". */
  path: string;
  provenance: Provenance;
  /** Record type; decides which report reasons are offered. Defaults to "hospital". */
  entity?: ReportEntity;
  /** Record slug, for the analytics event. */
  slug?: string;
  /** mailto: or https: target. Defaults to NEXT_PUBLIC_REPORT_URL. */
  reportUrl?: string;
}

/** "Is something incorrect?": fix at the source (OSM) and/or prepare a report for us. */
export function ReportIssue({
  name,
  path,
  provenance,
  entity = "hospital",
  slug,
  reportUrl = process.env.NEXT_PUBLIC_REPORT_URL,
}: ReportIssueProps) {
  const t = getT();
  const edit = osmEditUrl(provenance);
  return (
    <section aria-labelledby="report-issue" className="space-y-3">
      <h2 id="report-issue" className="text-lg font-semibold text-slate-900">
        {t("directory.report.heading")}
      </h2>
      {edit && (
        <div className="flex flex-wrap gap-2">
          <a href={edit} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t("directory.report.suggestOsm")}
            <span className="sr-only">{t("directory.newTab")}</span>
          </a>
        </div>
      )}
      <ReportForm entity={entity} name={name} path={path} slug={slug} reportUrl={reportUrl} />
      {edit && <p className="text-sm text-slate-600">{t("directory.report.osmNote")}</p>}
    </section>
  );
}
