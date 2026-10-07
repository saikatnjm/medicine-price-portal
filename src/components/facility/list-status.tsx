import Link from "@/i18n/link";
import type { MessageKey } from "@/i18n/messages";
import { getT } from "@/i18n/server";
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
}: {
  total: number;
  page: number;
  pageSize: number;
  noun: string;
  /** Used when total is 1. */
  singular: string;
}) {
  const t = getT();
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <p className="text-base font-medium text-slate-900" role="status">
      {total <= pageSize
        ? t("facility.count.all", { total: total.toLocaleString("en-US"), noun: localNoun(t, total === 1 ? singular : noun) })
        : t("facility.count.range", {
            from: from.toLocaleString("en-US"),
            to: to.toLocaleString("en-US"),
            total: total.toLocaleString("en-US"),
            noun: localNoun(t, noun),
          })}
    </p>
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
  const box = "rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-800";
  if (datasetEmpty) {
    return (
      <div className={box}>
        <p className="font-medium">{t("facility.empty.noData", { noun: nounText })}</p>
        <p className="mt-1 text-sm text-slate-700">
          {t("facility.empty.noDataHelp")}
        </p>
      </div>
    );
  }
  return (
    <div className={box}>
      <p className="font-medium">
        {hasFilters
          ? t("facility.empty.noMatch", { noun: nounText })
          : scopeName
            ? t("facility.empty.noneInScope", { noun: nounText, scope: scopeName })
            : t("facility.empty.none", { noun: nounText })}
      </p>
      <p className="mt-1 text-sm text-slate-700">{t("facility.empty.tips")}</p>
      <p className="mt-3">
        <Link href={clearHref} className="font-medium text-brand-800 underline underline-offset-2">
          {hasFilters ? t("facility.filter.clear") : t("facility.empty.browseAll")}
        </Link>
      </p>
    </div>
  );
}
