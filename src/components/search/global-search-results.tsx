import Link from "@/i18n/link";
import type { ReactNode } from "react";
import { DoctorCard, FacilityCard, PharmacyCard, ResultList } from "@/components/directory/result-cards";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { GlobalSearchResult, MedicineListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";
import { DirectoryEmptyNote } from "./directory-empty-note";
import { ExampleSearches } from "./example-searches";
import { searchViewHref } from "./search-tabs";
import { UnderstoodAs } from "./understood-as";

const seeAllClass = "mt-3 inline-flex min-h-11 items-center font-medium text-brand-800 underline underline-offset-2";

function Group({
  id,
  title,
  total,
  seeAll,
  children,
}: {
  id: string;
  title: string;
  total: number;
  seeAll?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-2 text-xl font-semibold text-slate-900">
        {title} <span className="text-base font-normal text-slate-600">({total})</span>
      </h2>
      {children}
      {seeAll && (
        <Link href={seeAll.href} className={seeAllClass}>
          {seeAll.label}
        </Link>
      )}
    </section>
  );
}

/** Appends the free-text part of the query, when any, so "see all" matches what was searched. */
function withText(path: string, text: string): string {
  return text ? `${path}?q=${encodeURIComponent(text)}` : path;
}

interface GlobalSearchResultsProps {
  result: GlobalSearchResult;
  suggestions: readonly MedicineListItem[];
}

/** Grouped results across the whole directory ("All" view). */
export function GlobalSearchResults({ result, suggestions }: GlobalSearchResultsProps) {
  const t = getT();
  const facilityText = (n: number) => t(n === 1 ? "search.count.facility.one" : "search.count.facility.other", { n: n.toLocaleString("en-US") });
  if (result.status === "empty_query") {
    return (
      <div className="space-y-6">
        <p className="text-slate-700">
          {t("search.promptAll")}
        </p>
        <ExampleSearches />
      </div>
    );
  }
  if (result.status === "query_too_short") {
    return (
      <p role="status" className="text-slate-700">
        {t("search.tooShort", { n: SEARCH_MIN_QUERY_LENGTH })}
      </p>
    );
  }

  const { intent, query } = result;
  const text = intent.text;
  const asksForDoctors = intent.entity === "doctor";

  if (result.total === 0 && !asksForDoctors) {
    return (
      <div className="space-y-8">
        <div role="status" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="font-medium text-slate-900">{t("search.noResults.title", { query })}</p>
          <p className="mt-1 text-slate-700">
            {t("search.noResults.hint")}
          </p>
        </div>
        <ExampleSearches />
        {suggestions.length > 0 && (
          <section aria-labelledby="popular-medicines-heading">
            <h2 id="popular-medicines-heading" className="mb-2 text-lg font-semibold text-slate-900">
              {t("search.popularMedicines")}
            </h2>
            <MedicineList items={suggestions} />
          </section>
        )}
      </div>
    );
  }

  const { medicines, doctors, facilities, pharmacies, specialties, locations } = result;
  return (
    <div className="space-y-10">
      <UnderstoodAs intent={intent} />
      <p role="status" className="sr-only">
        {t(result.total === 1 ? "search.found.result.one" : "search.found.result.other", {
          n: result.total.toLocaleString("en-US"),
          query,
        })}
      </p>

      {medicines.total > 0 && (
        <Group
          id="group-medicines"
          title={t("search.group.medicine")}
          total={medicines.total}
          seeAll={{
            href: searchViewHref(query, "medicine"),
            label: t(medicines.total === 1 ? "search.seeAll.medicine.one" : "search.seeAll.medicine.other", {
              n: medicines.total.toLocaleString("en-US"),
            }),
          }}
        >
          <MedicineList items={medicines.items} headingLevel="h3" />
        </Group>
      )}

      {(doctors.total > 0 || asksForDoctors) && (
        <Group
          id="group-doctors"
          title={t("search.group.doctor")}
          total={doctors.total}
          seeAll={doctors.total > 0 ? { href: withText(routes.doctors(intent.location?.slug, intent.specialty?.slug), text), label: t("search.seeAll.doctors") } : undefined}
        >
          {doctors.total > 0 ? (
            <ResultList label={t("search.list.doctors")}>
              {doctors.items.map((item) => (
                <DoctorCard key={item.doctor.id} item={item} />
              ))}
            </ResultList>
          ) : (
            <DirectoryEmptyNote
              title={t("search.doctorsEmpty.title")}
              body={t("search.doctorsEmpty.body")}
              href={routes.hospitals(intent.location?.slug, intent.specialty?.slug)}
              linkLabel={t("search.doctorsEmpty.link")}
            />
          )}
        </Group>
      )}

      {facilities.total > 0 && (
        <Group
          id="group-hospitals"
          title={t("search.group.hospital")}
          total={facilities.total}
          seeAll={{ href: withText(routes.hospitals(intent.location?.slug, intent.specialty?.slug), text), label: t("search.seeAll.hospitals") }}
        >
          <ResultList label={t("search.list.hospitals")}>
            {facilities.items.map((item) => (
              <FacilityCard key={item.facility.id} item={item} />
            ))}
          </ResultList>
        </Group>
      )}

      {pharmacies.total > 0 && (
        <Group
          id="group-pharmacies"
          title={t("search.group.pharmacy")}
          total={pharmacies.total}
          seeAll={{ href: withText(routes.pharmacies(intent.location?.slug), text), label: t("search.seeAll.pharmacies") }}
        >
          <ResultList label={t("search.list.pharmacies")}>
            {pharmacies.items.map((item) => (
              <PharmacyCard key={item.pharmacy.id} item={item} />
            ))}
          </ResultList>
        </Group>
      )}

      {specialties.total > 0 && (
        <Group
          id="group-specialties"
          title={t("search.group.specialty")}
          total={specialties.total}
          seeAll={specialties.total > specialties.items.length ? { href: routes.specialties(), label: t("search.seeAll.specialties") } : undefined}
        >
          <ul className="border-t border-slate-200">
            {specialties.items.map(({ specialty, facilityCount }) => (
              <li key={specialty.id} className="border-b border-slate-200">
                <Link href={routes.specialty(specialty.slug)} className="flex min-h-12 items-center justify-between gap-3 py-2">
                  <span className="font-medium text-brand-800 underline-offset-2 hover:underline">{specialty.name}</span>
                  {facilityCount > 0 && (
                    <span className="text-sm text-slate-600">{facilityText(facilityCount)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      )}

      {locations.total > 0 && (
        <Group
          id="group-locations"
          title={t("search.group.location")}
          total={locations.total}
          seeAll={locations.total > locations.items.length ? { href: routes.locations(), label: t("search.seeAll.locations") } : undefined}
        >
          <ul className="border-t border-slate-200">
            {locations.items.map(({ location, facilityCount }) => (
              <li key={location.id} className="border-b border-slate-200">
                <Link href={routes.location(location.slug)} className="flex min-h-12 items-center justify-between gap-3 py-2">
                  <span className="font-medium text-brand-800 underline-offset-2 hover:underline">{location.name}</span>
                  {facilityCount > 0 && (
                    <span className="text-sm text-slate-600">{facilityText(facilityCount)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      )}

      {(facilities.total > 0 || pharmacies.total > 0) && (
        <p className="text-sm text-slate-600">
          {t("search.osm.pre")}{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
            {t("search.osm.link")}
          </a>
          {t("search.osm.post")}
        </p>
      )}
    </div>
  );
}
