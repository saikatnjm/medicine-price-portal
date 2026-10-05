import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function DoctorNotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Doctor not found</h1>
      <p className="mt-2 text-slate-700">
        We could not find that doctor profile. Doctor profiles are only listed from verified or
        consented sources.
      </p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.doctors()} className="font-medium text-brand-800 underline">
          Doctors
        </Link>
        <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
          Browse specialties
        </Link>
        <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
          Hospitals &amp; clinics
        </Link>
      </div>
    </Container>
  );
}
