import type { Metadata } from "next";
import Link from "@/i18n/link";
import { fmt, initialLabel } from "@/components/browse/brand-index";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { formatDateIn } from "@/lib/format-locale";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

type Props = { params: Promise<{ lang?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const summary = await services.browse.getSummary();
  return pageMetadata({
    title: t("browse.hub.title"),
    description: t("browse.hub.description", {
      n: fmt(summary.medicineCount),
      g: fmt(summary.genericCount),
      c: fmt(summary.companyCount),
    }),
    path: routes.medicines(),
    lang,
  });
}

export default async function MedicinesHubPage({ params }: Props) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const summary = await services.browse.getSummary();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("browse.crumb.home"), href: routes.home() },
    { name: t("browse.crumb.medicines") },
  ];
  const others = [
    { href: routes.generics(), label: t("browse.link.generics") },
    { href: routes.companies(), label: t("browse.link.companies") },
    { href: routes.dosageForms(), label: t("browse.link.dosageForms") },
    { href: routes.verify(), label: t("browse.link.verify") },
    { href: routes.search(), label: t("browse.link.search") },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.medicines(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">{t("browse.hub.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        {t("browse.hub.intro", {
          n: fmt(summary.medicineCount),
          g: fmt(summary.genericCount),
          c: fmt(summary.companyCount),
        })}
        {summary.source && (
          <>
            {" "}
            {t("browse.hub.source", {
              source: summary.source.name,
              date: formatDateIn(summary.source.retrievedAt, lang),
            })}
          </>
        )}
      </p>

      <section aria-labelledby="letters" className="mt-8">
        <SectionHeading id="letters">{t("browse.hub.lettersHeading")}</SectionHeading>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {summary.initials.map(({ initial, productCount }) => (
            <li key={initial}>
              <Link
                href={routes.medicines(initial)}
                className="flex min-h-16 flex-col justify-center rounded-2xl bg-mist px-3 py-2 text-pine hover:bg-brand-100"
              >
                <span className="text-xl font-semibold">{initialLabel(initial, t)}</span>
                <span className="text-xs text-slate-600">
                  {t(productCount === 1 ? "browse.count.one" : "browse.count.other", { n: fmt(productCount) })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="other-ways" className="mt-8">
        <SectionHeading id="other-ways">{t("browse.hub.otherHeading")}</SectionHeading>
        <ul className="flex flex-wrap gap-2">
          {others.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={CHIP_CLASS}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm text-slate-600">{t("browse.note")}</p>
    </Container>
  );
}
