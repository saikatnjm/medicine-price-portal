import type { Metadata } from "next";
import Link from "@/i18n/link";
import { fmt } from "@/components/browse/brand-index";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq } from "@/components/common/faq";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { searchViewHref } from "@/components/search/search-tabs";
import { CHIP_CLASS, INDEX_CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import type { MedicineSummary } from "@/domain/read-models";
import { localizePath } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import { formatMedicineName } from "@/lib/format";
import { formatDateIn } from "@/lib/format-locale";
import { routes } from "@/lib/routes";
import { cleanSearchQuery, SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";
import { firstParam, type SearchParamValue } from "@/lib/search-params";
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd, type BreadcrumbItem } from "@/lib/seo";

interface VerifyPageProps {
  params?: Promise<{ lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

/** A DAR number from the registry snapshot, used as the format example (it is looked up, never assumed). */
const EXAMPLE_DAR = "186-0030-006";
/** DGDA's official domain, shown as text (not a link) for people to type themselves. */
const DGDA_DOMAIN = "dgda.gov.bd";

export async function generateMetadata({ params, searchParams }: VerifyPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const query = await searchParams;
  const input = cleanSearchQuery(firstParam(query.dar) || firstParam(query.q));
  const { medicineCount, source } = await services.browse.getSummary();
  return pageMetadata({
    title: input ? t("browse.verify.titleQuery", { query: input }) : t("browse.verify.title"),
    description: t("browse.verify.description", {
      n: fmt(medicineCount),
      date: source ? formatDateIn(source.retrievedAt, lang) : "",
    }),
    // Any URL with parameters is a lookup result: never indexed, canonical is the clean /verify (D14).
    path: routes.verify(),
    indexable: Object.keys(query).length === 0,
    lang,
  });
}

const input = "h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:border-brand-600";
const button =
  "inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-pine px-5 text-sm font-semibold text-white hover:bg-brand-700";

function ResultRows({ items, date, label }: { items: readonly MedicineSummary[]; date: string; label: string }) {
  const t = getT();
  return (
    <ul aria-label={label} className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
      {items.map(({ medicine, generic, manufacturer }) => (
        <li key={medicine.id} className="space-y-0.5 px-4 py-3 text-sm">
          <p>
            <Link href={routes.medicine(medicine.slug)} className="font-semibold text-brand-800 underline-offset-2 hover:underline">
              {formatMedicineName(medicine)}
            </Link>{" "}
            <span className="text-slate-600">
              · {medicine.dosageFormLabel} · {generic.name}
            </span>
          </p>
          <p className="text-slate-700">{manufacturer.name}</p>
          <p className="text-slate-700">
            {medicine.provenance.darNumber ? (
              <>
                {t("browse.verify.row.dar")} <span className="font-mono font-medium text-slate-900">{medicine.provenance.darNumber}</span>
              </>
            ) : (
              t("browse.verify.row.noDar")
            )}
          </p>
          <p className="text-accent-700">{t("browse.verify.row.status", { date })}</p>
        </li>
      ))}
    </ul>
  );
}

export default async function VerifyPage({ params: routeParams, searchParams }: VerifyPageProps) {
  const lang = await initLocale(routeParams);
  const t = getT(lang);
  const query = await searchParams;
  const darRaw = firstParam(query.dar);
  const name = cleanSearchQuery(firstParam(query.q));

  const [summary, darResult, nameResult, example] = await Promise.all([
    services.browse.getSummary(),
    darRaw !== undefined ? services.browse.verifyByDar(darRaw) : null,
    name ? services.search.searchMedicines(name, 1) : null,
    services.browse.verifyByDar(EXAMPLE_DAR),
  ]);
  const exampleProduct = example.matches[0];
  const date = summary.source ? formatDateIn(summary.source.retrievedAt, lang) : "";
  const counts = { n: fmt(summary.medicineCount), g: fmt(summary.genericCount), c: fmt(summary.companyCount) };

  const path = routes.verify();
  const title = t("browse.verify.heading");
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("browse.crumb.home"), href: routes.home() },
    { name: t("browse.crumb.verify") },
  ];
  const action = localizePath(path, lang);
  const notProof = (
    <>
      <p className="text-slate-700">{t("browse.verify.notProof")}</p>
      <p className="text-slate-700">{t("browse.verify.dgda", { domain: DGDA_DOMAIN })}</p>
    </>
  );
  const packNote = <p className="text-sm text-slate-700">{t("browse.verify.packNote")}</p>;

  const faq = [
    { question: t("browse.faq.count.q"), answer: t("browse.faq.count.a", { ...counts, date }) },
    { question: t("browse.faq.fake.q"), answer: t("browse.faq.fake.a", { date, domain: DGDA_DOMAIN }) },
    { question: t("browse.faq.genuine.q"), answer: t("browse.faq.genuine.a") },
    ...(summary.source
      ? [
          {
            question: t("browse.faq.source.q"),
            answer: t("browse.faq.source.a", { source: summary.source.name, publisher: summary.source.publisher, date }),
          },
        ]
      : []),
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs, path, lang),
          webPageJsonLd({
            name: title,
            description: t("browse.verify.description", { n: counts.n, date }),
            path: localizePath(path, lang),
          }),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{t("browse.verify.intro", { n: counts.n, date })}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <form action={action} method="get" className="space-y-2 rounded-2xl bg-mist p-4">
          <h2 className="font-semibold text-slate-900">{t("browse.verify.byDar")}</h2>
          <label htmlFor="verify-dar" className="block text-sm font-medium text-slate-800">
            {t("browse.verify.dar.label")}
          </label>
          <div className="flex gap-2">
            <input
              id="verify-dar"
              name="dar"
              type="text"
              autoComplete="off"
              spellCheck={false}
              maxLength={40}
              defaultValue={darRaw ?? ""}
              placeholder={EXAMPLE_DAR}
              aria-describedby="verify-dar-hint"
              className={input}
            />
            <button type="submit" className={button}>
              {t("browse.verify.submit")}
            </button>
          </div>
          <p id="verify-dar-hint" className="text-xs text-slate-600">
            {t("browse.verify.dar.hint", { example: EXAMPLE_DAR })}
          </p>
        </form>
        <form action={action} method="get" className="space-y-2 rounded-2xl bg-mist p-4">
          <h2 className="font-semibold text-slate-900">{t("browse.verify.byName")}</h2>
          <label htmlFor="verify-q" className="block text-sm font-medium text-slate-800">
            {t("browse.verify.q.label")}
          </label>
          <div className="flex gap-2">
            <input
              id="verify-q"
              name="q"
              type="search"
              autoComplete="off"
              maxLength={100}
              defaultValue={name}
              placeholder={t("browse.verify.q.placeholder")}
              className={input}
            />
            <button type="submit" className={button}>
              {t("browse.verify.submit")}
            </button>
          </div>
        </form>
      </div>

      {darResult && darResult.status !== "empty" && (
        <section aria-labelledby="dar-result" className="mt-8 space-y-3">
          <h2 id="dar-result" className="text-xl font-semibold text-slate-900">
            {t("browse.verify.resultHeading")}
            {darResult.darNumber && <>: {t("browse.verify.foundDar", { dar: darResult.darNumber })}</>}
          </h2>
          {darResult.status === "invalid" && (
            <p role="status" className="text-slate-700">
              {t("browse.verify.invalid", { input: darResult.input, example: EXAMPLE_DAR })}
            </p>
          )}
          {darResult.status === "not_found" && darResult.darNumber && (
            <div role="status" className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="font-medium text-slate-900">{t("browse.verify.notFound", { dar: darResult.darNumber, date })}</p>
              {notProof}
            </div>
          )}
          {darResult.status === "found" && (
            <>
              <p role="status" className="font-medium text-accent-700">
                {t("browse.verify.found", { date })}
              </p>
              <ResultRows items={darResult.matches} date={date} label={t("browse.verify.row.label")} />
              {packNote}
            </>
          )}
        </section>
      )}

      {nameResult && (
        <section aria-labelledby="name-result" className="mt-8 space-y-3">
          <h2 id="name-result" className="text-xl font-semibold text-slate-900">
            {t("browse.verify.nameHeading", { query: name })}
          </h2>
          {nameResult.status === "query_too_short" && (
            <p role="status" className="text-slate-700">
              {t("browse.verify.nameShort", { n: SEARCH_MIN_QUERY_LENGTH })}
            </p>
          )}
          {nameResult.status === "ok" && nameResult.total === 0 && (
            <div role="status" className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="font-medium text-slate-900">{t("browse.verify.nameNone", { query: name, date })}</p>
              {notProof}
            </div>
          )}
          {nameResult.status === "ok" && nameResult.total > 0 && (
            <>
              {nameResult.matchedQuery !== nameResult.query && (
                <p className="text-sm text-slate-700">{t("browse.verify.nameFallback", { query: nameResult.matchedQuery })}</p>
              )}
              <p role="status" className="font-medium text-accent-700">
                {t("browse.verify.found", { date })}
              </p>
              <p className="text-sm text-slate-600">
                {t("browse.verify.nameCount", { n: fmt(nameResult.total), shown: fmt(nameResult.items.length) })}
              </p>
              <ResultRows items={nameResult.items} date={date} label={t("browse.verify.row.label")} />
              {nameResult.total > nameResult.items.length && (
                <p>
                  <Link href={searchViewHref(nameResult.matchedQuery, "medicine")} className={INDEX_CHIP_CLASS}>
                    {t("browse.verify.seeAll", { n: fmt(nameResult.total) })}
                  </Link>
                </p>
              )}
              {packNote}
            </>
          )}
        </section>
      )}

      <section aria-labelledby="about-dar" className="mt-10 max-w-3xl space-y-3">
        <SectionHeading id="about-dar">{t("browse.verify.about.heading")}</SectionHeading>
        {exampleProduct && (
          <p className="text-slate-700">
            {t("browse.verify.about.p1", {
              example: EXAMPLE_DAR,
              product: `${formatMedicineName(exampleProduct.medicine)} ${exampleProduct.medicine.dosageFormLabel}`,
            })}
          </p>
        )}
        <p className="text-slate-700">{t("browse.verify.about.p2")}</p>
        <p className="text-slate-700">{t("browse.verify.about.p3")}</p>
        <p className="text-slate-700">{t("browse.note")}</p>
      </section>

      <div className="mt-10 max-w-3xl">
        <Faq items={faq} id="verify-faq" />
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        <li>
          <Link href={routes.medicines()} className={CHIP_CLASS}>
            {t("browse.link.az")}
          </Link>
        </li>
        <li>
          <Link href={routes.search()} className={CHIP_CLASS}>
            {t("browse.link.search")}
          </Link>
        </li>
      </ul>
    </Container>
  );
}
