import Link from "next/link";
import { routes } from "@/lib/routes";

const externalLink = "text-brand-800 underline underline-offset-2";

/** Compact, honest summary of where the information comes from. Details live on /about. */
export function DataSourcesNote() {
  return (
    <section aria-labelledby="data-sources">
      <h2 id="data-sources" className="text-xl font-semibold text-slate-900">
        Where our data comes from
      </h2>
      <dl className="mt-4 grid max-w-3xl gap-x-6 gap-y-3 text-sm text-slate-700 sm:grid-cols-[13rem_1fr]">
        <dt className="font-medium text-slate-900">Medicine information</dt>
        <dd>DGDA registered product data.</dd>
        <dt className="font-medium text-slate-900">Healthcare locations</dt>
        <dd>
          Community-mapped{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className={externalLink}>
            OpenStreetMap
          </a>{" "}
          data. It has not been verified.
        </dd>
        <dt className="font-medium text-slate-900">Area boundaries</dt>
        <dd>
          <a href="https://www.geoboundaries.org/" target="_blank" rel="noopener noreferrer" className={externalLink}>
            geoBoundaries
          </a>
          .
        </dd>
        <dt className="font-medium text-slate-900">Google information</dt>
        <dd>Shown separately and labelled when available.</dd>
        <dt className="font-medium text-slate-900">Doctor profiles</dt>
        <dd>Only from identified, verifiable sources. None are listed yet.</dd>
      </dl>
      <p className="mt-4 text-sm">
        <Link href={routes.about()} className={externalLink}>
          More about the data
        </Link>
      </p>
    </section>
  );
}
