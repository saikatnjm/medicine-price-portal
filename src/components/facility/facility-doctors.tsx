import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorCard, ResultList } from "@/components/directory/result-cards";
import type { DoctorListItem } from "@/domain/read-models";
import { routes } from "@/lib/routes";

export function FacilityDoctors({ doctors, facilityName }: { doctors: readonly DoctorListItem[]; facilityName: string }) {
  return (
    <section aria-labelledby="doctors">
      <SectionHeading id="doctors">Doctors at {facilityName}</SectionHeading>
      {doctors.length > 0 ? (
        <ResultList label={`Doctors at ${facilityName}`}>
          {doctors.map((item) => (
            <DoctorCard key={item.doctor.id} item={item} />
          ))}
        </ResultList>
      ) : (
        <p className="text-slate-700">
          Doctor listings for this place are not available yet. We only publish doctor profiles from sources that are
          verified or given with consent.{" "}
          <Link href={routes.doctors()} className="text-brand-800 underline underline-offset-2">
            See the doctors section
          </Link>
          .
        </p>
      )}
    </section>
  );
}
