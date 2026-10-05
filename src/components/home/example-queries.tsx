import Link from "next/link";
import { searchHref } from "@/lib/search-params";

const EXAMPLES: readonly string[] = ["Napa", "Cardiologist", "Hospitals in Dhaka", "Pharmacies near Dhanmondi"];

/** Homepage example searches. */
export function ExampleQueries() {
  return (
    <div className="text-sm text-slate-700">
      <p className="font-medium">Try searching for</p>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {EXAMPLES.map((example) => (
          <li key={example}>
            <Link
              href={searchHref(example)}
              className="inline-flex min-h-8 items-center text-brand-800 underline underline-offset-2"
            >
              {example}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
