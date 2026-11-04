import type { ReactNode } from "react";
import Link from "@/i18n/link";
import { Container } from "@/components/ui/container";
import { CHIP_CLASS } from "@/components/ui/chip";
import type { CatalogCount } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { formatCount } from "./catalog-text";

export const TH_CLASS = "px-3 py-2 text-left font-medium text-slate-600";
export const TD_CLASS = "px-3 py-2 align-top";
export const LINK_CLASS = "font-medium text-brand-800 underline-offset-2 hover:underline";

/** Chips with a count: "Paracetamol · 25". */
export function CountChips<T>({
  items,
  href,
  name,
}: {
  items: readonly CatalogCount<T>[];
  href: (item: T) => string;
  name: (item: T) => string;
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ item, count }) => (
        <li key={name(item)}>
          <Link href={href(item)} className={CHIP_CLASS}>
            {name(item)}
            <span className="text-slate-600">· {formatCount(count)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Scrollable table wrapper (long rows scroll inside the table, never the page). */
export function CatalogTable({ label, head, children }: { label: string; head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-sm" aria-label={label}>
        <thead className="bg-slate-50">
          <tr>{head}</tr>
        </thead>
        {children}
      </table>
    </div>
  );
}

/** Shared not-found body for company and dosage-form routes. */
export function CatalogNotFound() {
  const t = getT();
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">{t("company.notFound.heading")}</h1>
      <p className="mt-2 text-slate-700">{t("company.notFound.body")}</p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.companies()} className="font-medium text-brand-800 underline">
          {t("company.notFound.companies")}
        </Link>
        <Link href={routes.dosageForms()} className="font-medium text-brand-800 underline">
          {t("company.notFound.forms")}
        </Link>
      </div>
    </Container>
  );
}
