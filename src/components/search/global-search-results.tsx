import Link from "next/link";
import type { ReactNode } from "react";
import { DoctorCard, FacilityCard, PharmacyCard, ResultList } from "@/components/directory/result-cards";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { GlobalSearchResult, MedicineListItem } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
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
  if (result.status === "empty_query") {
    return (
      <div className="space-y-6">
        <p className="text-slate-700">
          Search for a medicine, hospital, clinic, pharmacy, specialty or place.
        </p>
        <ExampleSearches />
      </div>
    );
  }
  if (result.status === "query_too_short") {
    return (
      <p role="status" className="text-slate-700">
        Please enter at least {SEARCH_MIN_QUERY_LENGTH} characters.
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
          <p className="font-medium text-slate-900">No results found for “{query}”.</p>
          <p className="mt-1 text-slate-700">
            Check the spelling, try a generic name, or search with fewer words.
          </p>
        </div>
        <ExampleSearches />
        {suggestions.length > 0 && (
          <section aria-labelledby="popular-medicines-heading">
            <h2 id="popular-medicines-heading" className="mb-2 text-lg font-semibold text-slate-900">
              Popular medicines
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
        {pluralize(result.total, "result", "results")} found for {query}
      </p>

      {medicines.total > 0 && (
        <Group
          id="group-medicines"
          title="Medicines"
          total={medicines.total}
          seeAll={{
            href: searchViewHref(query, "medicine"),
            label: `See all ${pluralize(medicines.total, "medicine", "medicines")}`,
          }}
        >
          <MedicineList items={medicines.items} headingLevel="h3" />
        </Group>
      )}

      {(doctors.total > 0 || asksForDoctors) && (
        <Group
          id="group-doctors"
          title="Doctors"
          total={doctors.total}
          seeAll={doctors.total > 0 ? { href: withText(routes.doctors(intent.location?.slug, intent.specialty?.slug), text), label: "See all doctors" } : undefined}
        >
          {doctors.total > 0 ? (
            <ResultList label="Doctors">
              {doctors.items.map((item) => (
                <DoctorCard key={item.doctor.id} item={item} />
              ))}
            </ResultList>
          ) : (
            <DirectoryEmptyNote
              title="Doctor profiles are not available yet."
              body="We do not list doctors until there is a reliable source. You can browse hospitals and clinics instead."
              href={routes.hospitals(intent.location?.slug, intent.specialty?.slug)}
              linkLabel="Browse hospitals and clinics"
            />
          )}
        </Group>
      )}

      {facilities.total > 0 && (
        <Group
          id="group-hospitals"
          title="Hospitals & clinics"
          total={facilities.total}
          seeAll={{ href: withText(routes.hospitals(intent.location?.slug, intent.specialty?.slug), text), label: "See all hospitals & clinics" }}
        >
          <ResultList label="Hospitals and clinics">
            {facilities.items.map((item) => (
              <FacilityCard key={item.facility.id} item={item} />
            ))}
          </ResultList>
        </Group>
      )}

      {pharmacies.total > 0 && (
        <Group
          id="group-pharmacies"
          title="Pharmacies"
          total={pharmacies.total}
          seeAll={{ href: withText(routes.pharmacies(intent.location?.slug), text), label: "See all pharmacies" }}
        >
          <ResultList label="Pharmacies">
            {pharmacies.items.map((item) => (
              <PharmacyCard key={item.pharmacy.id} item={item} />
            ))}
          </ResultList>
        </Group>
      )}

      {specialties.total > 0 && (
        <Group
          id="group-specialties"
          title="Specialties"
          total={specialties.total}
          seeAll={specialties.total > specialties.items.length ? { href: routes.specialties(), label: "See all specialties" } : undefined}
        >
          <ul className="border-t border-slate-200">
            {specialties.items.map(({ specialty, facilityCount }) => (
              <li key={specialty.id} className="border-b border-slate-200">
                <Link href={routes.specialty(specialty.slug)} className="flex min-h-12 items-center justify-between gap-3 py-2">
                  <span className="font-medium text-brand-800 underline-offset-2 hover:underline">{specialty.name}</span>
                  {facilityCount > 0 && (
                    <span className="text-sm text-slate-600">{pluralize(facilityCount, "facility", "facilities")}</span>
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
          title="Locations"
          total={locations.total}
          seeAll={locations.total > locations.items.length ? { href: routes.locations(), label: "See all locations" } : undefined}
        >
          <ul className="border-t border-slate-200">
            {locations.items.map(({ location, facilityCount }) => (
              <li key={location.id} className="border-b border-slate-200">
                <Link href={routes.location(location.slug)} className="flex min-h-12 items-center justify-between gap-3 py-2">
                  <span className="font-medium text-brand-800 underline-offset-2 hover:underline">{location.name}</span>
                  {facilityCount > 0 && (
                    <span className="text-sm text-slate-600">{pluralize(facilityCount, "facility", "facilities")}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      )}

      {(facilities.total > 0 || pharmacies.total > 0) && (
        <p className="text-sm text-slate-600">
          Hospital, clinic and pharmacy data: ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
            OpenStreetMap contributors
          </a>
          , unverified.
        </p>
      )}
    </div>
  );
}
