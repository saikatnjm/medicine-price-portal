import type { ChamberView } from "@/domain/read-models";
import { mapLinksFor } from "@/lib/maps";

const primary =
  "inline-flex min-h-11 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800";
const secondary =
  "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50";

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function isHttpUrl(value: string | undefined): value is string {
  return Boolean(value && /^https?:\/\//i.test(value));
}

/** Phone to call: first chamber's appointment/chamber phone, else the doctor's practice phone. */
export function callNumber(chambers: readonly ChamberView[], doctorPhone?: string): string | null {
  for (const { chamber } of chambers) {
    const phone = chamber.appointmentPhone ?? chamber.phone;
    if (phone) return phone;
  }
  return doctorPhone ?? null;
}

/** Call / Directions / Appointment: each is shown only when the data exists. */
export function DoctorActions({
  name,
  chambers,
  doctorPhone,
}: {
  name: string;
  chambers: readonly ChamberView[];
  doctorPhone?: string;
}) {
  const phone = callNumber(chambers, doctorPhone);
  const located = chambers.find((c) =>
    mapLinksFor({ name: c.name, address: c.chamber.address, coordinates: c.coordinates ?? undefined }),
  );
  const directions = located
    ? mapLinksFor({ name: located.name, address: located.chamber.address, coordinates: located.coordinates ?? undefined })
    : null;
  const appointmentUrl = chambers.map((c) => c.chamber.appointmentUrl).find(isHttpUrl);
  if (!phone && !directions && !appointmentUrl) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={`Contact ${name}`}>
      {phone && (
        <a href={telHref(phone)} className={primary}>
          Call<span className="sr-only"> {phone}</span>
        </a>
      )}
      {directions && (
        <a href={directions.directionsUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          Directions<span className="sr-only"> to {located?.name} (opens Google Maps)</span>
        </a>
      )}
      {appointmentUrl && (
        <a href={appointmentUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          Appointment<span className="sr-only"> with {name} (opens the booking page)</span>
        </a>
      )}
    </div>
  );
}
