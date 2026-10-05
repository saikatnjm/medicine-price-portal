import Link from "next/link";
import { searchHref } from "@/lib/search-params";

export const EXAMPLE_SEARCHES: readonly string[] = [
  "Napa",
  "Paracetamol",
  "Cardiologist",
  "Hospitals in Dhaka",
  "Dhanmondi",
];

/** Links to example queries; used on the homepage and in empty search states. */
export function ExampleSearches({ label = "Try searching for" }: { label?: string }) {
  return (
    <div className="text-sm text-slate-700">
      <p className="font-medium">{label}</p>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {EXAMPLE_SEARCHES.map((example) => (
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
