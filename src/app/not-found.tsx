import Link from "next/link";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-600">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-6 max-w-xl">
        <SearchForm id="not-found-search" />
      </div>
      <Link href={routes.home()} className="mt-6 inline-block font-medium text-brand-700 underline">
        Go to the homepage
      </Link>
    </Container>
  );
}
