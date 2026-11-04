import Link from "@/i18n/link";
import type { BrandIndexItem, BrandInitialCount } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { formatMedicineName } from "@/lib/format";
import { routes } from "@/lib/routes";
import { medicinesPage } from "@/lib/routes-browse";

/** Latin digits with thousands separators (numbers stay Latin in both languages). */
export const fmt = (n: number) => n.toLocaleString("en-US");

/** "A" for "a", "0–9" for "0-9". */
export function initialLabel(initial: string, t: Translator): string {
  return initial === "0-9" ? t("browse.digits") : initial.toUpperCase();
}

const LETTER_CLASS =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-2 text-sm font-semibold";

/** Compact A–Z letter bar linking to each initial's first page; the current letter is not a link. */
export function LetterNav({ initials, current }: { initials: readonly BrandInitialCount[]; current?: string }) {
  const t = getT();
  return (
    <nav aria-label={t("browse.letters.label")}>
      <ul className="flex flex-wrap gap-1.5">
        {initials.map(({ initial }) => (
          <li key={initial}>
            {initial === current ? (
              <span aria-current="page" className={`${LETTER_CLASS} bg-pine text-white`}>
                {initialLabel(initial, t)}
              </span>
            ) : (
              <Link href={routes.medicines(initial)} className={`${LETTER_CLASS} bg-mist text-pine hover:bg-brand-100`}>
                {initialLabel(initial, t)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One line per product: brand + strength (link), then dosage form and generic. */
export function BrandList({ items, label }: { items: readonly BrandIndexItem[]; label: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <li key={item.slug} className="px-4 py-2.5 text-sm">
          <Link href={routes.medicine(item.slug)} className="font-semibold text-brand-800 underline-offset-2 hover:underline">
            {formatMedicineName(item)}
          </Link>{" "}
          <span className="text-slate-600">
            · {item.dosageFormLabel}
            {item.genericName && <> · {item.genericName}</>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Previous / next plus a link to every page (crawlable path URLs, at most a few dozen pages). */
export function PageLinks({ initial, page, totalPages }: { initial: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const t = getT();
  const letter = initialLabel(initial, t);
  const step = "inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50";
  const num = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-sm font-medium";
  return (
    <nav aria-label={t("browse.pagination.label", { letter })} className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-4">
        {page > 1 ? (
          <Link href={medicinesPage(initial, page - 1)} rel="prev" className={step}>
            {t("browse.pagination.previous")}
          </Link>
        ) : (
          <span />
        )}
        <p className="text-sm text-slate-600">{t("browse.pagination.pageOf", { page, total: totalPages })}</p>
        {page < totalPages ? (
          <Link href={medicinesPage(initial, page + 1)} rel="next" className={step}>
            {t("browse.pagination.next")}
          </Link>
        ) : (
          <span />
        )}
      </div>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page" className={`${num} bg-pine text-white`}>
                {n}
              </span>
            ) : (
              <Link
                href={medicinesPage(initial, n)}
                aria-label={t("browse.pagination.page", { page: n })}
                className={`${num} bg-mist text-pine hover:bg-brand-100`}
              >
                {n}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
