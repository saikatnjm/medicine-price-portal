import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { localizePath } from "@/i18n/config";
import type { MessageKey } from "@/i18n/messages";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd, type BreadcrumbItem } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("pages.about.title"),
    description: t("pages.about.description"),
    path: routes.about(),
    lang,
  });
}

const link = "text-brand-800 underline underline-offset-2";
const h2 = "text-xl font-semibold text-slate-900";

const LABELS: ReadonlyArray<{ label: MessageKey; meaning: MessageKey }> = [
  { label: "common.trust.unverified", meaning: "pages.about.meaning.unverified" },
  { label: "common.trust.needs_review", meaning: "pages.about.meaning.needs_review" },
  { label: "common.trust.verified", meaning: "pages.about.meaning.verified" },
  { label: "common.trust.registered", meaning: "pages.about.meaning.registered" },
];

export default async function AboutPage({ params }: Props) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const TITLE = t("pages.about.title");
  const DESCRIPTION = t("pages.about.description");
  const path = localizePath(routes.about(), lang);
  const breadcrumbs: BreadcrumbItem[] = [{ name: t("common.home"), href: routes.home() }, { name: TITLE }];
  const newTab = <span className="sr-only"> {t("common.newTab")}</span>;
  const { sources } = await services.directory.getSummary();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs, routes.about(), lang),
          webPageJsonLd({ name: `${TITLE} | ${siteConfig.name}`, description: DESCRIPTION, path }),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{TITLE}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        {t("pages.about.intro", { site: siteConfig.name })}
      </p>

      <div className="mt-8 max-w-3xl space-y-10">
        <section aria-labelledby="sources" className="space-y-4">
          <h2 id="sources" className={h2}>
            {t("pages.about.sources")}
          </h2>
          <ul className="space-y-4">
            {sources.map((source) => (
              <li key={source.id} className="border-b border-slate-200 pb-4">
                <p className="font-medium text-slate-900">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className={link}>
                    {source.name}
                    {newTab}
                  </a>
                </p>
                <p className="text-sm text-slate-700">{t("pages.about.publisher", { name: source.publisher })}</p>
                {source.licence && (
                  <p className="text-sm text-slate-700">
                    {t("pages.about.licence")}{" "}
                    {source.licenceUrl ? (
                      <a href={source.licenceUrl} target="_blank" rel="noopener noreferrer" className={link}>
                        {source.licence}
                        {newTab}
                      </a>
                    ) : (
                      source.licence
                    )}
                  </p>
                )}
                {source.note && <p className="text-sm text-slate-700">{source.note}</p>}
                <p className="text-sm text-slate-600">{t("pages.about.retrieved", { date: formatDate(source.retrievedAt) })}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-700">
            <strong className="font-medium">{t("pages.about.googleLabel")}</strong>{" "}
            {t("pages.about.googleRest")}{" "}
            <strong className="font-medium">{t("pages.about.doctorsLabel")}</strong>{" "}
            {t("pages.about.doctorsRest")}
          </p>
        </section>

        <section aria-labelledby="labels" className="space-y-3">
          <h2 id="labels" className={h2}>
            {t("pages.about.labels")}
          </h2>
          <dl className="space-y-3 text-sm text-slate-700">
            {LABELS.map(({ label, meaning }) => (
              <div key={label}>
                <dt className="font-medium text-slate-900">{t(label)}</dt>
                <dd>{t(meaning)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="review" className="space-y-3 text-slate-700">
          <h2 id="review" className={h2}>
            {t("pages.about.review")}
          </h2>
          <p>
            {t("pages.about.review1a")} <em>{t("common.trust.needs_review")}</em> {t("pages.about.review1b")}
          </p>
          <p>
            {t("pages.about.review2")}
          </p>
        </section>

        <section aria-labelledby="report" className="space-y-3 text-slate-700">
          <h2 id="report" className={h2}>
            {t("pages.about.report")}
          </h2>
          <p>
            {t("pages.about.report1a")} <em>{t("pages.about.reportSource")}</em> {t("pages.about.report1b")}
          </p>
          {siteConfig.reportUrl ? (
            <p>
              {t("pages.about.report2a")}{" "}
              <a href={siteConfig.reportUrl} target="_blank" rel="noopener noreferrer" className={link}>
                {t("pages.about.report2link")}
                {newTab}
              </a>
              .
            </p>
          ) : null}
        </section>

        {siteConfig.gaMeasurementId ? (
          <section aria-labelledby="analytics" className="space-y-3 text-slate-700">
            <h2 id="analytics" className={h2}>
              {t("pages.about.analytics")}
            </h2>
            <p>
              {t("pages.about.analyticsText")}
            </p>
          </section>
        ) : null}
      </div>
    </Container>
  );
}
