"use client";

import { useId, useMemo, useState } from "react";
import { TrackedLink } from "@/components/common/tracked-link";
import { useLocale, useT } from "@/i18n/client";
import {
  buildReport,
  NOTE_MAX_LENGTH,
  reasonsFor,
  resolveReportChannel,
  type ReportEntity,
  type ReportReason,
} from "@/lib/report";

interface ReportFormProps {
  entity: ReportEntity;
  name: string;
  path: string;
  /** Record slug for the analytics event. */
  slug?: string;
  /** mailto: or https: target; without one the form explains that reporting is not set up. */
  reportUrl?: string;
}

const field = "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900";

/** Disclosure with a reason and optional note. It only prepares a report; the visitor sends it. */
export function ReportForm({ entity, name, path, slug, reportUrl }: ReportFormProps) {
  const t = useT();
  const lang = useLocale();
  const id = useId();
  const reasons = reasonsFor(entity);
  const [reason, setReason] = useState<ReportReason>(reasons[0]!);
  const [note, setNote] = useState("");
  const channel = useMemo(() => resolveReportChannel(reportUrl), [reportUrl]);
  const href = channel ? channel.href(buildReport({ reason, note, name, path, entity, lang })) : null;

  return (
    <details className="rounded-md border border-slate-200 bg-white">
      <summary className="min-h-11 cursor-pointer px-4 py-2.5 text-sm font-medium text-slate-800">
        {t("directory.report.link")}
      </summary>
      <div className="space-y-3 border-t border-slate-200 p-4">
        {!channel || !href ? (
          <p className="text-sm text-slate-700">{t("directory.report.notConfigured")}</p>
        ) : (
          <>
            <div>
              <label htmlFor={`${id}-reason`} className="mb-1 block text-sm font-medium text-slate-800">
                {t("directory.report.reason")}
              </label>
              <select
                id={`${id}-reason`}
                className={field}
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {t(`directory.report.reason.${r}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-note`} className="mb-1 block text-sm font-medium text-slate-800">
                {t("directory.report.note")}
              </label>
              <textarea
                id={`${id}-note`}
                className={field}
                rows={3}
                maxLength={NOTE_MAX_LENGTH}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                aria-describedby={`${id}-hint`}
              />
              <p id={`${id}-hint`} className="mt-1 text-xs text-slate-600">
                {t("directory.report.noteHint", { n: note.length, max: NOTE_MAX_LENGTH })}
              </p>
            </div>
            <TrackedLink
              event={{ name: "report_issue", reason, entity, slug }}
              href={href}
              {...(channel.kind === "link" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-h-11 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {channel.kind === "email" ? t("directory.report.openEmail") : t("directory.report.openForm")}
              {channel.kind === "link" && <span className="sr-only">{t("directory.newTab")}</span>}
            </TrackedLink>
            <p className="text-sm text-slate-600">
              {channel.kind === "email" ? t("directory.report.emailNote") : t("directory.report.formNote")}
            </p>
          </>
        )}
      </div>
    </details>
  );
}
