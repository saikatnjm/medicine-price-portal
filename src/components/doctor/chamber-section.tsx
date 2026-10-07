import type { ReactNode } from "react";
import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { LocationBlock } from "@/components/directory/location-block";
import type { ChamberView } from "@/domain/read-models";
import { routes } from "@/lib/routes";
import { isHttpUrl, telHref } from "./doctor-actions";

/** One consulting place: location block plus consultation times and appointment contacts. */
export function ChamberSection({ view, index, total = 1 }: { view: ChamberView; index: number; total?: number }) {
  const t = getT();
  const { chamber, facility, name, place, coordinates } = view;
  const phone = chamber.appointmentPhone ?? chamber.phone;
  const details: Array<[string, ReactNode]> = [];
  if (facility) {
    details.push([
      t("doctor.chamber.facility"),
      <Link key="f" href={routes.hospital(facility.slug)} className="font-medium text-brand-800 underline">
        {facility.name}
      </Link>,
    ]);
  }
  if (chamber.consultationDays) details.push([t("doctor.chamber.days"), chamber.consultationDays]);
  if (chamber.consultationHours) details.push([t("doctor.chamber.hours"), chamber.consultationHours]);
  if (phone) {
    details.push([
      chamber.appointmentPhone ? t("doctor.chamber.appointmentPhone") : t("doctor.chamber.phone"),
      <a key="p" href={telHref(phone)} className="font-medium text-brand-800 underline">
        {phone}
      </a>,
    ]);
  }
  if (isHttpUrl(chamber.appointmentUrl)) {
    details.push([
      t("doctor.chamber.appointments"),
      <a
        key="u"
        href={chamber.appointmentUrl as string}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-800 underline"
      >
        {t("doctor.chamber.bookOnline")}
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
        heading={
          total > 1
            ? t("doctor.chamber.headingNumbered", { index: index + 1, name })
            : t("doctor.chamber.heading", { name })
        }
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
