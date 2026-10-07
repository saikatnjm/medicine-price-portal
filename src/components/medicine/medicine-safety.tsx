import type { ReactNode } from "react";
import { SirenIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/common/section-heading";
import type { MedicineSafetyInfo } from "@/domain/medicine-safety";
import type { MedicineDetail } from "@/domain/read-models";
import { getLocale, getT } from "@/i18n/server";
import { formatDateIn } from "@/lib/format-locale";

export const SAFETY_SECTION_ID = "medicine-safety";

/** Items shown before the rest of a long list is collapsed behind "Read more". */
const VISIBLE_ITEMS = 5;

const externalRel = "noopener noreferrer";

/** DailyMed label search for a generic name. Needs nothing from our data beyond the name. */
export function dailyMedSearchUrl(genericName: string): string {
  return `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(genericName)}`;
}

function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </svg>
  );
}

function Prose({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <div className="mt-1 text-slate-800">{children}</div>
    </div>
  );
}

/** A bullet list; anything past the first few items sits behind a native "Read more" disclosure. */
function BulletList({ items }: { items: readonly string[] }) {
  const t = getT();
  const shown = items.slice(0, VISIBLE_ITEMS);
  const rest = items.slice(VISIBLE_ITEMS);
  const list = (entries: readonly string[]) => (
    <ul className="list-disc space-y-1 pl-5 marker:text-slate-400">
      {entries.map((entry, i) => (
        <li key={`${i}-${entry}`}>{entry}</li>
      ))}
    </ul>
  );
  return (
    <>
      {list(shown)}
      {rest.length > 0 && (
        <details className="mt-2">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-medium text-brand-800 underline">
            {t("medicine.safety.read_more", { n: rest.length })}
          </summary>
          <div className="pt-1">{list(rest)}</div>
        </details>
      )}
    </>
  );
}

type Tone = "info" | "serious" | "urgent";

const TONE: Record<Tone, string> = {
  info: "border-brand-600 bg-brand-50 text-brand-800",
  serious: "border-amber-600 bg-amber-50 text-amber-900",
  urgent: "border-red-700 bg-red-50 text-red-900",
};

/** Side-effect group: text heading + icon + colour, so the level never depends on colour alone. */
function Group({ tone, title, items }: { tone: Tone; title: string; items: readonly string[] }) {
  const icon = tone === "info" ? <InfoIcon /> : tone === "serious" ? <WarningIcon /> : <SirenIcon className="size-5" />;
  return (
    <div className={`rounded-lg border-l-4 px-4 py-3 ${TONE[tone]}`}>
      <h3 className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </h3>
      <div className="mt-2 text-slate-900">
        <BulletList items={items} />
      </div>
    </div>
  );
}

function nonEmpty(items: string[] | null): items is string[] {
  return Array.isArray(items) && items.length > 0;
}

function SafetyContent({ safety }: { safety: MedicineSafetyInfo }) {
  const t = getT();
  const lang = getLocale();
  const lists: [string, string[] | null][] = [
    [t("medicine.safety.warnings"), safety.warnings],
    [t("medicine.safety.contraindications"), safety.contraindications],
    [t("medicine.safety.interactions"), safety.interactions],
  ];
  const texts: [string, string | null][] = [
    [t("medicine.safety.pregnancy"), safety.pregnancyInfo],
    [t("medicine.safety.breastfeeding"), safety.breastfeedingInfo],
    [t("medicine.safety.storage"), safety.storage],
  ];
  return (
    <div className="space-y-6">
      {safety.description && <Prose title={t("medicine.safety.what")}><p>{safety.description}</p></Prose>}
      {nonEmpty(safety.uses) && (
        <Prose title={t("medicine.safety.uses")}>
          <BulletList items={safety.uses} />
        </Prose>
      )}
      {safety.mechanism && <Prose title={t("medicine.safety.how")}><p>{safety.mechanism}</p></Prose>}

      {nonEmpty(safety.commonSideEffects) && (
        <Group tone="info" title={t("medicine.safety.common")} items={safety.commonSideEffects} />
      )}
      {nonEmpty(safety.seriousSideEffects) && (
        <Group tone="serious" title={t("medicine.safety.serious")} items={safety.seriousSideEffects} />
      )}
      {nonEmpty(safety.seekHelpIf) && (
        <Group tone="urgent" title={t("medicine.safety.urgent")} items={safety.seekHelpIf} />
      )}

      {lists.map(([title, items]) =>
        nonEmpty(items) ? (
          <Prose key={title} title={title}>
            <BulletList items={items} />
          </Prose>
        ) : null,
      )}
      {texts.map(([title, text]) =>
        text ? (
          <Prose key={title} title={title}>
            <p>{text}</p>
          </Prose>
        ) : null,
      )}

      <div className="space-y-1 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <p>{t("medicine.safety.source", { source: safety.source, date: formatDateIn(safety.lastCheckedAt, lang) })}</p>
        {isHttpUrl(safety.sourceUrl) && (
          <p>
            <a href={safety.sourceUrl} target="_blank" rel={externalRel} className="font-medium text-brand-800 underline">
              {t("medicine.safety.view_source")}
              <span className="sr-only"> {t("medicine.safety.new_tab")}</span>
            </a>
          </p>
        )}
        <p>{t("medicine.safety.licence", { note: safety.licenceNote })}</p>
        <p>{t("medicine.safety.not_reviewed")}</p>
      </div>
    </div>
  );
}

function SafetyUnavailable({ genericName }: { genericName: string }) {
  const t = getT();
  return (
    <div className="rounded-lg bg-brand-50/60 px-4 py-4 text-slate-800">
      <p className="font-medium text-slate-900">{t("medicine.safety.unavailable_title")}</p>
      <p className="mt-1 text-sm">{t("medicine.safety.unavailable_body")}</p>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{t("medicine.safety.external_heading")}</h3>
      <ul className="mt-1 text-sm">
        <li>
          <a
            href={dailyMedSearchUrl(genericName)}
            target="_blank"
            rel={externalRel}
            className="inline-flex min-h-11 items-center font-medium text-brand-800 underline"
          >
            {t("medicine.safety.dailymed")}
            <span className="sr-only"> {t("medicine.safety.new_tab")}</span>
          </a>
        </li>
      </ul>
      <p className="text-xs text-slate-600">{t("medicine.safety.external_note")}</p>
    </div>
  );
}

/**
 * "Medicine information & safety". Renders only fields present in the cited record, or, when no
 * record exists, a calm "not available yet" panel. Never fills gaps with text of our own.
 */
export function MedicineSafety({ detail }: { detail: MedicineDetail }) {
  const t = getT();
  const { safety, generic } = detail;
  return (
    <section aria-labelledby={SAFETY_SECTION_ID}>
      <SectionHeading
        id={SAFETY_SECTION_ID}
        description={safety ? t("medicine.safety.about_generic", { generic: generic.name }) : undefined}
      >
        {t("medicine.safety.heading")}
      </SectionHeading>
      {safety ? <SafetyContent safety={safety} /> : <SafetyUnavailable genericName={generic.name} />}
      <p className="mt-4 text-sm text-slate-700">{t("medicine.safety.disclaimer")}</p>
    </section>
  );
}
