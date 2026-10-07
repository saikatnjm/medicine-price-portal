import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { WHITE_CHIP_CLASS } from "@/components/ui/chip";
import { searchHref } from "@/lib/search-params";

const POPULAR_SEARCHES: readonly string[] = [
  "Napa 500 mg",
  "Cardiologist in Dhaka",
  "Hospitals in Dhaka",
  "Pharmacies in Dhanmondi",
];

/** Homepage "Popular searches": quick chips (for the mist hero) that run a normal search. */
export function ExampleQueries() {
  const t = getT();
  return (
    <section aria-labelledby="popular-searches">
      <h2 id="popular-searches" className="text-sm font-semibold text-slate-700">
        {t("home.popularSearches")}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((example) => (
          <li key={example}>
            <Link
              href={searchHref(example)}
              className={WHITE_CHIP_CLASS}
            >
              {example}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
