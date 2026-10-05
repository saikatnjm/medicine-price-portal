import Link from "next/link";
import { routes } from "@/lib/routes";

/** Honest note shown while the doctor dataset is empty. */
export function DoctorsEmptyNotice({ context }: { context?: string }) {
  return (
    <section aria-labelledby="doctors-empty" className="rounded-md border border-slate-300 bg-slate-50 p-4 sm:p-5">
      <h2 id="doctors-empty" className="text-lg font-semibold text-slate-900">
        Doctor profiles are not listed yet{context ? ` ${context}` : ""}
      </h2>
      <p className="mt-2 text-slate-700">
        We will only list doctor profiles from verified sources or with the doctor&apos;s consent. We
        have not added any yet, and we do not copy profiles from other websites.
      </p>
      <p className="mt-2 text-slate-700">
        In the meantime you can browse hospitals and clinics by specialty to see where a field of
        medicine is offered, then call the facility to ask about its doctors.
      </p>
      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
          Browse specialties
        </Link>
        <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
          Browse hospitals &amp; clinics
        </Link>
      </p>
    </section>
  );
}
