import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { TRUST_LABEL } from "@/domain/healthcare";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd, type BreadcrumbItem } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const TITLE = "About the data";
const DESCRIPTION =
  "Where Bangladesh Healthcare Search gets its medicine, hospital, clinic and pharmacy information, what the labels mean, and how to report an error.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: routes.about() });

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }, { name: TITLE }];
const link = "text-brand-800 underline underline-offset-2";
const h2 = "text-xl font-semibold text-slate-900";

const LABELS: ReadonlyArray<{ label: string; meaning: string }> = [
  { label: TRUST_LABEL.unverified, meaning: "Mapped by volunteers on OpenStreetMap. We have not checked it ourselves, so it may be incomplete or out of date." },
  { label: TRUST_LABEL.needs_review, meaning: "Something about the listing looks unusual (for example an unclear name or category), so it is kept out of search-engine indexing until checked." },
  { label: TRUST_LABEL.verified, meaning: "Confirmed against an identified, verifiable source or by the facility itself. No listing carries this label yet." },
  { label: TRUST_LABEL.registered, meaning: "Taken from an official registry, such as the DGDA list of registered medicines." },
];

export default async function AboutPage() {
  const { sources } = await services.directory.getSummary();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs, routes.about()),
          webPageJsonLd({ name: `${TITLE} | ${siteConfig.name}`, description: DESCRIPTION, path: routes.about() }),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{TITLE}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        {siteConfig.name} helps you find medicine information and healthcare places. We would rather
        show less than show something we cannot stand behind, so this page explains where each kind
        of information comes from and how far to trust it.
      </p>

      <div className="mt-8 max-w-3xl space-y-10">
        <section aria-labelledby="sources" className="space-y-4">
          <h2 id="sources" className={h2}>
            Sources
          </h2>
          <ul className="space-y-4">
            {sources.map((source) => (
              <li key={source.id} className="border-b border-slate-200 pb-4">
                <p className="font-medium text-slate-900">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className={link}>
                    {source.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
                <p className="text-sm text-slate-700">Publisher: {source.publisher}</p>
                {source.licence && (
                  <p className="text-sm text-slate-700">
                    Licence:{" "}
                    {source.licenceUrl ? (
                      <a href={source.licenceUrl} target="_blank" rel="noopener noreferrer" className={link}>
                        {source.licence}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      source.licence
                    )}
                  </p>
                )}
                {source.note && <p className="text-sm text-slate-700">{source.note}</p>}
                <p className="text-sm text-slate-600">Retrieved {formatDate(source.retrievedAt)}.</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-700">
            <strong className="font-medium">Google information</strong> (a Google Maps link and,
            where enabled, the current Google rating) is shown separately, clearly labelled, and is
            never mixed with our own information. <strong className="font-medium">Doctor profiles</strong>{" "}
            will only be added from identified, verifiable sources; none are listed yet.
          </p>
        </section>

        <section aria-labelledby="labels" className="space-y-3">
          <h2 id="labels" className={h2}>
            What the labels mean
          </h2>
          <dl className="space-y-3 text-sm text-slate-700">
            {LABELS.map(({ label, meaning }) => (
              <div key={label}>
                <dt className="font-medium text-slate-900">{label}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="review" className="space-y-3 text-slate-700">
          <h2 id="review" className={h2}>
            How listings are reviewed
          </h2>
          <p>
            Listings are imported automatically from the sources above. Names are tidied (for
            example, category text pasted into a name is trimmed), obvious duplicates are merged, and
            records that are clearly not healthcare places are left out. Listings with an unusual
            name, category or very little detail are marked <em>Needs review</em> and are not
            submitted to search engines. We do not add details that the source does not publish.
          </p>
          <p>
            Prices and stock are not available. Always call ahead before visiting, and speak to a
            qualified healthcare professional about your health and medicines.
          </p>
        </section>

        <section aria-labelledby="report" className="space-y-3 text-slate-700">
          <h2 id="report" className={h2}>
            Reporting an error
          </h2>
          <p>
            Most healthcare places come from OpenStreetMap, so the best fix is to correct the map
            itself: open the <em>Source</em> link on a listing and choose Edit on OpenStreetMap. Our
            next update picks up the change.
          </p>
          {siteConfig.reportUrl ? (
            <p>
              To tell us about a problem with a listing or with this site,{" "}
              <a href={siteConfig.reportUrl} target="_blank" rel="noopener noreferrer" className={link}>
                use our report form
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          ) : null}
        </section>
      </div>
    </Container>
  );
}
