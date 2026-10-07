import Link from "@/i18n/link";
import { CHIP_CLASS } from "@/components/ui/chip";
import { getT } from "@/i18n/server";
import { searchHref } from "@/lib/search-params";

export const EXAMPLE_SEARCHES: readonly string[] = [
  "Napa",
  "Paracetamol",
  "Cardiologist",
  "Hospitals in Dhaka",
  "Dhanmondi",
];

/** Links to example queries; used on the homepage and in empty search states. */
export function ExampleSearches({ label }: { label?: string }) {
  const t = getT();
  return (
    <div className="text-sm text-slate-700">
      <p className="font-medium">{label ?? t("search.example.label")}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {EXAMPLE_SEARCHES.map((example) => (
          <li key={example}>
            <Link href={searchHref(example)} className={CHIP_CLASS}>
              {example}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
