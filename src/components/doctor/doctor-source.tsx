import type { Doctor, DoctorVerificationMethod } from "@/domain/healthcare";
import { ReportIssue } from "@/components/directory/report-issue";
import { routes } from "@/lib/routes";
import type { DataSource } from "@/domain/types";
import { formatDate } from "@/lib/format";

const METHOD_TEXT: Record<DoctorVerificationMethod, string> = {
  official_profile: "checked against the official profile page of the doctor's hospital or organisation",
  doctor_provided: "provided by the doctor, with their consent",
  registry: "checked against a professional registry",
};

/** Where a doctor profile came from and how it was verified, plus a way to report a problem. */
export function DoctorSource({ doctor, source }: { doctor: Doctor; source: DataSource | null }) {
  const { provenance } = doctor;
  const method = METHOD_TEXT[provenance.verificationMethod as DoctorVerificationMethod];
  return (
    <section aria-labelledby="doctor-source" className="space-y-2 text-sm text-slate-700">
      <h2 id="doctor-source" className="text-base font-semibold text-slate-900">
        Source &amp; verification
      </h2>
      <p>
        {source && (
          <>
            Source:{" "}
            <a
              href={provenance.recordUrl ?? source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-800 underline"
            >
              {source.name}
            </a>
            .{" "}
          </>
        )}
        {provenance.verifiedAt && <>Verified on {formatDate(provenance.verifiedAt)}</>}
        {method && <>{provenance.verifiedAt ? ", " : "Verification: "}{method}</>}
        {(provenance.verifiedAt || method) && "."}
      </p>
      <p>
        Details can change. Please confirm chamber times and fees with the doctor&apos;s office before you visit.
      </p>
      <ReportIssue name={doctor.name} path={routes.doctor(doctor.slug)} provenance={provenance} />
    </section>
  );
}
