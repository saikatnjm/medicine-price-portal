import Link from "@/i18n/link";
import type { MessageKey } from "@/i18n/messages";
import { SearchIcon } from "@/components/ui/icons";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import type { Translator } from "@/i18n/translate";

/** Nouns the list views pass in English; they are looked up so Bangla pages read naturally. */
const NOUN_KEYS: Record<string, MessageKey> = {
  pharmacies: "facility.noun.pharmacies",
  pharmacy: "facility.noun.pharmacy",
  "hospitals or clinics": "facility.noun.hospitalsOrClinics",
  "hospitals and clinics": "facility.noun.hospitalsAndClinics",
  "hospital or clinic": "facility.noun.hospitalOrClinic",
};

function localNoun(t: Translator, noun: string): string {
  const key = NOUN_KEYS[noun];
  return key ? t(key) : noun;
}

export function ResultCount({
  total,
  page,
  pageSize,
  noun,
  singular,
  nearest = false,
}: {
  total: number;
  page: number;
  pageSize: number;
  noun: string;
  /** Used when total is 1. */
  singular: string;
  /** Results are ordered by distance from the visitor ("near me"). */
  nearest?: boolean;
}) {
  const t = getT();
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p className="text-base font-semibold text-slate-900" role="status">
        {total <= pageSize
          ? t("facility.count.all", { total: total.toLocaleString("en-US"), noun: localNoun(t, total === 1 ? singular : noun) })
          : t("facility.count.range", {
              from: from.toLocaleString("en-US"),
              to: to.toLocaleString("en-US"),
              total: total.toLocaleString("en-US"),
              noun: localNoun(t, noun),
            })}
      </p>
      {nearest && <p className="text-sm text-slate-600">{t("facility.count.nearest")}</p>}
    </div>
  );
}

interface EmptyResultsProps {
  /** Nothing of this kind has been imported at all. */
  datasetEmpty: boolean;
  hasFilters: boolean;
  noun: string;
  scopeName?: string;
  clearHref: string;
}

/** Two distinct empty states: no data at all, and no matches. */
export function EmptyResults({ datasetEmpty, hasFilters, noun, scopeName, clearHref }: EmptyResultsProps) {
  const t = getT();
  const nounText = localNoun(t, noun);
  const box = "flex gap-4 rounded-2xl bg-slate-50 p-5 text-slate-800";
  const pill =
    "inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium transition-colors";
  const icon = (
    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600">
      <SearchIcon className="size-5" />
    </span>
  );
  if (datasetEmpty) {
    return (
      <div className={box}>
        {icon}
        <div>
          <p className="font-medium">{t("facility.empty.noData", { noun: nounText })}</p>
          <p className="mt-1 text-sm text-slate-700">{t("facility.empty.noDataHelp")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={box}>
      {icon}
      <div>
        <p className="font-medium">
          {hasFilters
            ? t("facility.empty.noMatch", { noun: nounText })
            : scopeName
              ? t("facility.empty.noneInScope", { noun: nounText, scope: scopeName })
              : t("facility.empty.none", { noun: nounText })}
        </p>
        <p className="mt-1 text-sm text-slate-700">{t("facility.empty.tips")}</p>
        <p className="mt-3 flex flex-wrap gap-2">
          <Link href={clearHref} className={`${pill} bg-brand-700 text-white hover:bg-brand-800`}>
            {hasFilters ? t("facility.filter.clear") : t("facility.empty.browseAll")}
          </Link>
          <Link href={routes.locations()} className={`${pill} bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100`}>
            {t("facility.empty.browseLocations")}
          </Link>
        </p>
      </div>
    </div>
  );
}
