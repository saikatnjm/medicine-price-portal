/**
 * "Report incorrect information" logic: pure and provider-agnostic.
 * `buildReport` turns the visitor's choices into a subject and body; a `ReportChannel` decides where the report
 * goes. The only built-in channel hands the report to the visitor (their email app, or a configured https
 * form) and never sends anything itself. Reports never include the visitor's location or saved items.
 */
export type ReportEntity = "medicine" | "hospital" | "pharmacy" | "doctor";

export type ReportReason =
  | "wrong_name"
  | "wrong_location"
  | "wrong_phone"
  | "wrong_specialty"
  | "duplicate"
  | "closed"
  | "incorrect_medicine_info"
  | "other";

export const NOTE_MAX_LENGTH = 500;

const REASONS_BY_ENTITY: Record<ReportEntity, readonly ReportReason[]> = {
  medicine: ["wrong_name", "duplicate", "incorrect_medicine_info", "other"],
  hospital: ["wrong_name", "wrong_location", "wrong_phone", "wrong_specialty", "duplicate", "closed", "other"],
  pharmacy: ["wrong_name", "wrong_location", "wrong_phone", "duplicate", "closed", "other"],
  doctor: ["wrong_name", "wrong_location", "wrong_phone", "wrong_specialty", "duplicate", "other"],
};

/** Reasons that make sense for the record type; "incorrect medicine information" is medicine-only. */
export function reasonsFor(entity: ReportEntity): readonly ReportReason[] {
  return REASONS_BY_ENTITY[entity];
}

/** English labels for the message body: the report is read by the site maintainers, not the visitor. */
const REASON_LABELS: Record<ReportReason, string> = {
  wrong_name: "Wrong name",
  wrong_location: "Wrong location",
  wrong_phone: "Wrong phone",
  wrong_specialty: "Wrong specialty",
  duplicate: "Duplicate",
  closed: "Closed facility",
  incorrect_medicine_info: "Incorrect medicine information",
  other: "Other",
};

export interface ReportInput {
  reason: ReportReason;
  note?: string;
  /** Record name. */
  name: string;
  /** Public path of the page, e.g. "/hospital/abc". */
  path: string;
  entity: ReportEntity;
  /** Language the visitor was reading. */
  lang: string;
}

export interface Report {
  subject: string;
  body: string;
}

export function buildReport({ reason, note, name, path, entity, lang }: ReportInput): Report {
  const trimmed = (note ?? "").replace(/\r\n?/g, "\n").trim().slice(0, NOTE_MAX_LENGTH);
  const lines = [
    `Reason: ${REASON_LABELS[reason]}`,
    `Record: ${name}`,
    `Type: ${entity}`,
    `Page: ${path}`,
    `Language: ${lang}`,
  ];
  if (trimmed) lines.push("", "Note:", trimmed);
  return { subject: `Incorrect information: ${name} (${path})`, body: lines.join("\n") };
}

/** Report link with a prefilled subject (and body). Only mailto: and https: targets are accepted. */
export function reportHref(reportUrl: string | undefined, subject: string, body?: string): string | null {
  const base = reportUrl?.trim();
  if (!base || !/^(mailto:|https:\/\/)/i.test(base)) return null;
  const extra = body ? `&body=${encodeURIComponent(body)}` : "";
  return `${base}${base.includes("?") ? "&" : "?"}subject=${encodeURIComponent(subject)}${extra}`;
}

/** Where a report goes. Replace the channel to send reports somewhere else (e.g. an API) later. */
export interface ReportChannel {
  /** "email": opens the visitor's email app. "link": opens a configured https page in a new tab. */
  kind: "email" | "link";
  /** The link that hands the report over; nothing is sent until the visitor completes it there. */
  href(report: Report): string;
}

/** The configured channel, or null when neither a report email nor a report URL is set. */
export function resolveReportChannel(reportUrl: string | undefined): ReportChannel | null {
  const base = reportUrl?.trim();
  if (!base) return null;
  const kind = /^mailto:/i.test(base) ? "email" : "link";
  if (!reportHref(base, "x")) return null;
  return { kind, href: (report) => reportHref(base, report.subject, report.body) as string };
}
