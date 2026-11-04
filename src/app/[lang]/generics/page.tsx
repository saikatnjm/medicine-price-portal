import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { SectionHeading } from "@/components/common/section-heading";
import { genericInitial, shortProductCountText } from "@/components/generic/generic-text";
import { CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import type { GenericCount } from "@/domain/read-models";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface GenericsPageProps {
  params?: Promise<{ lang?: string }>;
}

/** Size of the "Most registered generics" section. */
const TOP_GENERICS = 40;

export async function generateMetadata({ params }: GenericsPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const generics = await services.generics.listGenerics();
  return pageMetadata({
    title: t("generic.list.title"),
    description: t("generic.list.description", { n: generics.length.toLocaleString("en-US") }),
    path: routes.generics(),
    lang,
  });
}

const letterId = (letter: string) => `letter-${letter}`;
const letterLabel = (letter: string) => (letter === "0-9" ? "0–9" : letter.toUpperCase());

/** Generics grouped by first letter, "0-9" first, then a–z (only letters that have entries). */
function byLetter(entries: readonly GenericCount[]): [string, GenericCount[]][] {
  const groups = new Map<string, GenericCount[]>();
  for (const entry of entries) {
    const letter = genericInitial(entry.generic.name);
    const list = groups.get(letter);
    if (list) list.push(entry);
    else groups.set(letter, [entry]);
  }
  return [...groups].sort(([a], [b]) => (a === "0-9" ? -1 : b === "0-9" ? 1 : a.localeCompare(b)));
}

export default async function GenericsPage({ params }: GenericsPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("generic.crumb.home"), href: routes.home() },
    { name: t("generic.crumb.generics") },
  ];
  const [generics, top] = await Promise.all([
    services.generics.listGenerics(),
    services.generics.listTopGenerics(TOP_GENERICS),
  ]);
  const letters = byLetter(generics);

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.generics(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4">{t("generic.list.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{t("generic.list.intro")}</p>

      {generics.length === 0 ? (
        <p className="mt-6 text-slate-700">{t("generic.list.empty")}</p>
      ) : (
        <div className="mt-8 space-y-10">
          <section aria-labelledby="top-generics">
            <SectionHeading id="top-generics" description={t("generic.list.top_desc")}>
              {t("generic.list.top_heading")}
            </SectionHeading>
            <ol className="flex flex-wrap gap-2">
              {top.map(({ generic, productCount }) => (
                <li key={generic.id}>
                  <Link href={routes.generic(generic.slug)} className={CHIP_CLASS}>
                    {generic.name}
                    <span className="font-normal text-slate-600">({shortProductCountText(t, productCount)})</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="all-generics">
            <SectionHeading id="all-generics">{t("generic.list.az_heading")}</SectionHeading>
            <nav aria-label={t("generic.list.jump")} className="mb-6">
              <ul className="flex flex-wrap gap-1">
                {letters.map(([letter]) => (
                  <li key={letter}>
                    <a
                      href={`#${letterId(letter)}`}
                      className="inline-flex size-11 items-center justify-center rounded-lg bg-mist text-sm font-semibold text-pine hover:bg-brand-100"
                    >
                      {letterLabel(letter)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-8">
              {letters.map(([letter, entries]) => (
                <div key={letter}>
                  <h3 id={letterId(letter)} className="mb-2 scroll-mt-24 text-lg font-semibold text-slate-900">
                    <span className="sr-only">{t("generic.list.letter", { letter: letterLabel(letter) })}</span>
                    <span aria-hidden="true">{letterLabel(letter)}</span>
                  </h3>
                  {/* Styles sit on the list (not on each of ~1,500 rows) to keep the HTML small. */}
                  <ul className="gap-x-8 text-sm sm:columns-2 lg:columns-3 [&_a]:text-brand-800 [&_a]:underline-offset-2 [&_a:hover]:underline [&_li]:flex [&_li]:break-inside-avoid [&_li]:justify-between [&_li]:gap-3 [&_li]:py-1 [&_span]:shrink-0 [&_span]:text-slate-600 [&_span]:tabular-nums">
                    {entries.map(({ generic, productCount }) => (
                      <li key={generic.id}>
                        <Link href={routes.generic(generic.slug)}>{generic.name}</Link>
                        <span>{productCount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <MedicalDisclaimer />
        </div>
      )}
    </Container>
  );
}
