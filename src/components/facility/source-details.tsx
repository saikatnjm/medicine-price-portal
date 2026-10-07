import { ReportIssue } from "@/components/directory/report-issue";
import { SourceSection } from "@/components/directory/source-attribution";
import { ChevronIcon } from "@/components/ui/icons";
import type { DataSource, Provenance } from "@/domain/types";
import { getT } from "@/i18n/server";
import type { ReportEntity } from "@/lib/report";

interface SourceDetailsProps {
  entity: ReportEntity;
  slug: string;
  name: string;
  path: string;
  source: DataSource | null;
  provenance: Provenance;
  sourceName?: string;
}

/** "Source & last checked" and "Is something incorrect?" collapsed into one disclosure at the bottom of a page. */
export function SourceDetails({ entity, slug, name, path, source, provenance, sourceName }: SourceDetailsProps) {
  const t = getT();
  return (
    <details className="group rounded-2xl bg-slate-50 px-4 py-1 sm:px-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
        <ChevronIcon className="size-4 transition-transform group-open:rotate-90" />
        {t("facility.sourceDetails.summary")}
      </summary>
      <div className="space-y-6 pt-3 pb-4">
        <SourceSection source={source} provenance={provenance} sourceName={sourceName} />
        <ReportIssue entity={entity} slug={slug} name={name} path={path} provenance={provenance} />
      </div>
    </details>
  );
}
