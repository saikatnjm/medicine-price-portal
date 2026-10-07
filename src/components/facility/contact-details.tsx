import type { ReactNode } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { getT } from "@/i18n/server";

interface ContactDetailsProps {
  phone?: string;
  website?: string;
  email?: string;
  openingHours?: string;
  beds?: number;
  headingId?: string;
  /** Render nothing (instead of a "not published" line) when there are no details. */
  omitWhenEmpty?: boolean;
}

/** Only http(s) URLs are rendered as links. */
export function safeHttpUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const linkClass = "text-brand-800 underline underline-offset-2";

/** Contact details as a definition list; renders nothing when none are published. */
export function ContactDetails({ phone, website, email, openingHours, beds, headingId = "contact", omitWhenEmpty = false }: ContactDetailsProps) {
  const t = getT();
  const url = safeHttpUrl(website);
  const rows: Array<[string, ReactNode]> = [];
  if (phone) {
    rows.push([t("facility.contact.phone"), <a key="p" href={telHref(phone)} className={linkClass}>{phone}</a>]);
  }
  if (url) {
    rows.push([
      t("facility.contact.website"),
      <a key="w" href={url.toString()} target="_blank" rel="noopener noreferrer nofollow" className={linkClass}>
        {url.hostname.replace(/^www\./, "")}
        <span className="sr-only">{t("directory.newTab")}</span>
      </a>,
    ]);
  }
  if (email) {
    rows.push([t("facility.contact.email"), <a key="e" href={`mailto:${email}`} className={linkClass}>{email}</a>]);
  }
  if (openingHours) rows.push([t("facility.contact.openingHours"), <span key="h">{openingHours}</span>]);
  if (beds) rows.push([t("facility.contact.beds"), <span key="b">{beds.toLocaleString("en-US")}</span>]);

  if (omitWhenEmpty && rows.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId}>{t("facility.contact.heading")}</SectionHeading>
      {rows.length === 0 ? (
        <p className="text-slate-700">{t("facility.contact.none")}</p>
      ) : (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-slate-800">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-medium text-slate-700">{label}</dt>
              <dd className="min-w-0 break-words">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
