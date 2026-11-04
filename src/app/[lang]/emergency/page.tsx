import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { buildHref } from "@/components/directory/pagination";
import { CompactList, FacilityRow } from "@/components/facility/compact-rows";
import { INDEX_CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { AlertIcon, PhoneIcon } from "@/components/ui/icons";
import { services } from "@/data";
import type { Location } from "@/domain/healthcare";
import type { FacilityListItem } from "@/domain/read-models";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface EmergencyPageProps {
  params?: Promise<{ lang?: string }>;
}

/** Upper bound for one request; the OSM import lists far fewer emergency facilities. */
const MAX_FACILITIES = 2000;

const SOURCES = [
  { key: "guide.emergency.sourceDailyStar", url: "https://www.thedailystar.net/country/toll-free-national-help-desk-999-gets-live-1312624" },
  {
    key: "guide.emergency.sourceDhakaTribune",
    url: "https://www.dhakatribune.com/amp/bangladesh/412748/national-emergency-service-999-receives-over-72.36",
  },
] as const;

interface DivisionGroup {
  division: Location | null;
  items: FacilityListItem[];
}

/** Groups by division: largest first, facilities without a division last. */
function groupByDivision(items: readonly FacilityListItem[]): DivisionGroup[] {
  const groups = new Map<string, DivisionGroup>();
  for (const item of items) {
    const division = item.place.division;
    const key = division?.id ?? "";
    const group = groups.get(key) ?? { division, items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => {
    if (!a.division !== !b.division) return a.division ? -1 : 1;
    return b.items.length - a.items.length || (a.division?.name ?? "").localeCompare(b.division?.name ?? "");
  });
}

export async function generateMetadata({ params }: EmergencyPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("guide.emergency.title"),
    description: t("guide.emergency.description"),
    path: routes.emergency(),
    lang,
  });
}

export default async function EmergencyPage({ params }: EmergencyPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("guide.crumb.home"), href: routes.home() },
    { name: t("guide.emergency.crumb") },
  ];
  const { results } = await services.facilities.listFacilities({ emergency: true, page: 1, pageSize: MAX_FACILITIES });
  const groups = groupByDivision(results.items);
  const newTab = <span className="sr-only"> {t("common.newTab")}</span>;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.emergency(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 max-w-3xl space-y-8">
        <h1>{t("guide.emergency.h1")}</h1>

        <section aria-labelledby="call-999" className="space-y-3 rounded-2xl bg-red-50 p-5 ring-1 ring-flag/30 sm:p-6">
          <h2 id="call-999" className="text-2xl font-semibold text-flag">
            {t("guide.emergency.callHeading")}
          </h2>
          <p className="text-slate-800">{t("guide.emergency.callText")}</p>
          <a
            href="tel:999"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-flag px-6 text-lg font-semibold text-white hover:opacity-90"
          >
            <PhoneIcon className="size-5" />
            {t("guide.emergency.callButton")}
          </a>
          <p className="text-sm text-slate-600">
            {t("guide.emergency.callSource")}{" "}
            {SOURCES.map((source, index) => (
              <span key={source.url}>
                {index > 0 && ", "}
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {t(source.key)}
                  {newTab}
                </a>
              </span>
            ))}
          </p>
          <p className="text-sm">
            <Link href={routes.guide("national-emergency-999")} className="font-medium text-brand-800 underline underline-offset-2">
              {t("guide.emergency.guideLink")}
            </Link>
          </p>
        </section>

        <section aria-labelledby="emergency-notice" className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-slate-800">
          <AlertIcon className="mt-0.5 size-5 text-amber-700" />
          <div className="space-y-1">
            <h2 id="emergency-notice" className="text-base font-semibold text-slate-900">
              {t("guide.emergency.noticeHeading")}
            </h2>
            <p className="text-sm">{t("guide.emergency.notice")}</p>
          </div>
        </section>

        <section aria-labelledby="emergency-facilities" className="space-y-6">
          <SectionHeading id="emergency-facilities" description={t("guide.emergency.listIntro", { n: results.total })}>
            {t("guide.emergency.listHeading")}
          </SectionHeading>
          {groups.length === 0 ? (
            <p className="text-slate-700">
              {t("guide.emergency.empty")}{" "}
              <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
                {t("guide.emergency.browseAll")}
              </Link>
            </p>
          ) : (
            groups.map(({ division, items }) => {
              const name = division?.name ?? t("guide.emergency.unknownDivision");
              const id = `division-${division?.slug ?? "unknown"}`;
              return (
                <section key={id} aria-labelledby={id}>
                  <h3 id={id} className="text-lg font-semibold text-slate-900">
                    {name} <span className="text-sm font-normal text-slate-600">({t("guide.emergency.divisionCount", { n: items.length })})</span>
                  </h3>
                  <CompactList label={name}>
                    {items.map((item) => (
                      <FacilityRow key={item.facility.id} item={item} />
                    ))}
                  </CompactList>
                  {division && (
                    <p className="mt-2">
                      <Link href={buildHref(routes.hospitals(division.slug), { emergency: "1" })} className={INDEX_CHIP_CLASS}>
                        {t("guide.emergency.seeDivision", { name: division.name })}
                      </Link>
                    </p>
                  )}
                </section>
              );
            })
          )}
        </section>
      </div>
    </Container>
  );
}
