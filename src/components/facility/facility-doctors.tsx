import Link from "@/i18n/link";
import { SectionHeading } from "@/components/common/section-heading";
import { CompactList, DoctorRow } from "./compact-rows";
import type { DoctorListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

export function FacilityDoctors({ doctors, facilityName }: { doctors: readonly DoctorListItem[]; facilityName: string }) {
  const t = getT();
  const heading = t("facility.doctors.heading", { name: facilityName });
  return (
    <section aria-labelledby="doctors">
      <SectionHeading id="doctors">{heading}</SectionHeading>
      {doctors.length > 0 ? (
        <CompactList label={heading}>
          {doctors.map((item) => (
            <DoctorRow key={item.doctor.id} item={item} />
          ))}
        </CompactList>
      ) : (
        <p className="text-slate-700">
          {t("facility.doctors.empty")}{" "}
          <Link href={routes.doctors()} className="text-brand-800 underline underline-offset-2">
            {t("facility.doctors.see")}
          </Link>
          {t("directory.stop")}
        </p>
      )}
    </section>
  );
}
