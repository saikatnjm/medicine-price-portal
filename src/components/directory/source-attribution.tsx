import type { DataSource, Provenance } from "@/domain/types";
import { formatDate } from "@/lib/format";

/**
 * Where a directory record comes from. OpenStreetMap data must carry the
 * "© OpenStreetMap contributors" attribution (ODbL).
 */
export function SourceAttribution({ source, provenance }: { source: DataSource | null; provenance?: Provenance }) {
  if (!source) return null;
  return (
    <p className="text-sm text-slate-600">
      Source:{" "}
      <a href={provenance?.recordUrl ?? source.url} target="_blank" rel="noopener noreferrer" className="underline">
        {source.attribution ?? source.name}
      </a>
      {source.licenceUrl && (
        <>
          {" "}
          (
          <a href={source.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {source.licence ?? "licence"}
          </a>
          )
        </>
      )}
      , retrieved {formatDate(source.retrievedAt)}.{" "}
      {provenance?.status === "unverified" &&
        "Community-mapped information that we have not verified. Call ahead before visiting."}
      {provenance?.status === "verified" && "Verified by us."}
    </p>
  );
}
