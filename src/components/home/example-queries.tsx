import Link from "next/link";
import { searchHref } from "@/lib/search-params";

const POPULAR_SEARCHES: readonly string[] = [
  "Napa 500 mg",
  "Cardiologist in Dhaka",
  "Hospitals in Dhaka",
  "Pharmacies in Dhanmondi",
];

/** Homepage "Popular searches": quick chips that run a normal search. */
export function ExampleQueries() {
  return (
    <section aria-labelledby="popular-searches">
      <h2 id="popular-searches" className="text-sm font-semibold text-slate-700">
        Popular searches
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((example) => (
          <li key={example}>
            <Link
              href={searchHref(example)}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:border-brand-600 hover:text-brand-800"
            >
              {example}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
