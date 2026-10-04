import Link from "next/link";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function MedicineNotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Medicine not found</h1>
      <p className="mt-2 text-slate-700">
        We could not find that medicine. It may not be in the pilot yet, or the link may be wrong.
      </p>
      <div className="mt-6 max-w-xl">
        <SearchForm id="not-found-search" />
      </div>
      <Link href={routes.home()} className="mt-6 inline-block font-medium text-brand-800 underline">
        Go to the homepage
      </Link>
    </Container>
  );
}
