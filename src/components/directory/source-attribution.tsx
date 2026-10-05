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
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {source.licenceUrl && (
        <>
          {" "}
          (
          <a href={source.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {source.licence ?? "licence"}
            <span className="sr-only"> (opens in a new tab)</span>
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

const STATUS_WORDS: Record<Provenance["status"], string> = {
  registered: "Listed in an official registry",
  unverified: "Community-mapped; not verified by us",
  needs_review: "Awaiting review",
  verified: "Verified by us",
  user_reported: "Reported by a user",
};

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
  const rows: Array<[string, string]> = [["Status", STATUS_WORDS[provenance.status]]];
  if (provenance.lastCheckedAt) rows.push(["Last checked", formatDate(provenance.lastCheckedAt)]);
  if (provenance.sourceUpdatedAt) rows.push(["Source updated", formatDate(provenance.sourceUpdatedAt)]);
  if (sourceName) rows.push(["Name in source data", sourceName]);
  return (
    <section aria-labelledby={headingId} className="space-y-2">
      <h2 id={headingId} className="text-lg font-semibold text-slate-900">
        Source &amp; last checked
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
