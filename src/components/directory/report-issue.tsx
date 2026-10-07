import type { Provenance } from "@/domain/types";
import { getT } from "@/i18n/server";

const OSM_RECORD = /^(node|way|relation)\/(\d+)$/;

/** OpenStreetMap edit link for an OSM-sourced record ("node/123"); null for other sources. */
export function osmEditUrl(provenance: Pick<Provenance, "sourceId" | "recordId" | "recordUrl">): string | null {
  const isOsm = provenance.sourceId === "osm" || Boolean(provenance.recordUrl?.includes("openstreetmap.org"));
  const match = OSM_RECORD.exec(provenance.recordId);
  if (!isOsm || !match) return null;
  return `https://www.openstreetmap.org/edit?${match[1]}=${match[2]}`;
}

/** Report link with a prefilled subject. Only mailto: and https: targets are accepted. */
export function reportHref(reportUrl: string | undefined, subject: string): string | null {
  const base = reportUrl?.trim();
  if (!base || !/^(mailto:|https:\/\/)/i.test(base)) return null;
  return `${base}${base.includes("?") ? "&" : "?"}subject=${encodeURIComponent(subject)}`;
}

const linkClass =
  "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50";

interface ReportIssueProps {
  /** Record name, used in the prefilled subject. */
  name: string;
  /** Public path of the page, e.g. "/hospital/abc". */
  path: string;
  provenance: Provenance;
  /** Defaults to NEXT_PUBLIC_REPORT_URL. */
  reportUrl?: string;
}

/** "Is something incorrect?": fix at the source (OSM) and/or report to us. Renders nothing without options. */
export function ReportIssue({ name, path, provenance, reportUrl = process.env.NEXT_PUBLIC_REPORT_URL }: ReportIssueProps) {
  const t = getT();
  const edit = osmEditUrl(provenance);
  const report = reportHref(reportUrl, `Incorrect information: ${name} (${path})`);
  if (!edit && !report) return null;
  const external = report?.startsWith("https:");
  return (
    <section aria-labelledby="report-issue" className="space-y-3">
      <h2 id="report-issue" className="text-lg font-semibold text-slate-900">
        {t("directory.report.heading")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {edit && (
          <a href={edit} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t("directory.report.suggestOsm")}
            <span className="sr-only">{t("directory.newTab")}</span>
          </a>
        )}
        {report && (
          <a
            href={report}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={linkClass}
          >
            {t("directory.report.link")}
            {external && <span className="sr-only">{t("directory.newTab")}</span>}
          </a>
        )}
      </div>
      {edit && (
        <p className="text-sm text-slate-600">
          {t("directory.report.osmNote")}
        </p>
      )}
    </section>
  );
}
