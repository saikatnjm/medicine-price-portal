import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function FacilityNotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Hospital or clinic not found</h1>
      <p className="mt-2 text-slate-700">We could not find that hospital or clinic. It may have been renamed or removed.</p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
          Browse hospitals &amp; clinics
        </Link>
        <Link href={routes.search()} className="font-medium text-brand-800 underline">
          Search
        </Link>
        <Link href={routes.home()} className="font-medium text-brand-800 underline">
          Go to the homepage
        </Link>
      </div>
    </Container>
  );
}
