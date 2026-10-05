import type { ReactNode } from "react";
import Link from "next/link";
import { LocationBlock } from "@/components/directory/location-block";
import type { ChamberView } from "@/domain/read-models";
import { routes } from "@/lib/routes";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** One consulting place: location block plus consultation times and appointment contacts. */
export function ChamberSection({ view, index }: { view: ChamberView; index: number }) {
  const { chamber, facility, name, place, coordinates } = view;
  const phone = chamber.appointmentPhone ?? chamber.phone;
  const details: Array<[string, ReactNode]> = [];
  if (facility) {
    details.push([
      "Facility",
      <Link key="f" href={routes.hospital(facility.slug)} className="font-medium text-brand-800 underline">
        {facility.name}
      </Link>,
    ]);
  }
  if (chamber.consultationDays) details.push(["Consultation days", chamber.consultationDays]);
  if (chamber.consultationHours) details.push(["Consultation hours", chamber.consultationHours]);
  if (phone) {
    details.push([
      chamber.appointmentPhone ? "Appointment phone" : "Phone",
      <a key="p" href={telHref(phone)} className="font-medium text-brand-800 underline">
        {phone}
      </a>,
    ]);
  }
  if (chamber.appointmentUrl && isHttpUrl(chamber.appointmentUrl)) {
    details.push([
      "Appointments",
      <a
        key="u"
        href={chamber.appointmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-800 underline"
      >
        Book or enquire online
      </a>,
    ]);
  }

  return (
    <div className="space-y-4">
      <LocationBlock
        name={name}
        address={chamber.address}
        placeLabel={place.label}
        postalCode={chamber.postalCode}
        coordinates={coordinates}
        google={facility?.google}
        headingId={`chamber-${index + 1}-location`}
        heading={`Chamber: ${name}`}
      />
      {details.length > 0 && (
        <dl className="grid gap-x-6 gap-y-2 text-slate-800 sm:grid-cols-[max-content_1fr]">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-sm font-medium text-slate-600">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
