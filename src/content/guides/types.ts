import type { Locale } from "../../i18n/config";

/** One block of guide body text. Plain data, rendered by the guide page (no HTML strings). */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** Highlighted callout, e.g. "ask a registered doctor or pharmacist". */
  | { type: "note"; text: string }
  /** Internal link card, `href` is an unlocalised path from `routes`. */
  | { type: "link"; href: string; label: string }
  /** Chips linking every specialty page, filled from `services.specialties` by the page. */
  | { type: "specialtyLinks" };

export type GuideCategory = "medicines" | "registration" | "healthcare" | "using-the-site";

export interface GuideContent {
  title: string;
  /** Meta description, ≤ 160 characters. */
  description: string;
  /** Short intro shown under the title. */
  summary: string;
  body: GuideBlock[];
  /** Question/answer pairs shown at the end (rendered as native <details>). */
  faq?: { q: string; a: string }[];
}

export interface Guide {
  slug: string;
  /** Grouping on the /guides index. */
  category: GuideCategory;
  /** ISO date the guide was last reviewed. */
  updatedAt: string;
  /** External sources the guide's facts come from (shown at the end). */
  sources?: { label: string; url: string }[];
  content: Record<Locale, GuideContent>;
}
