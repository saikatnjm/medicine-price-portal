import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function PharmacyNotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Pharmacy not found</h1>
      <p className="mt-2 text-slate-700">We could not find that pharmacy.</p>
      <div className="mt-6 flex flex-wrap gap-6">
        <Link href={routes.search()} className="font-medium text-brand-800 underline">
          Search medicines
        </Link>
        <Link href={routes.home()} className="font-medium text-brand-800 underline">
          Go to the homepage
        </Link>
      </div>
    </Container>
  );
}
