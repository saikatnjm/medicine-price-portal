import { Container } from "@/components/ui/container";
import { getT } from "@/i18n/server";

export default function SearchLoading() {
  const t = getT();
  return (
    <Container className="py-8 sm:py-10">
      <p role="status" className="sr-only">
        {t("search.loading")}
      </p>
      <div aria-hidden="true" className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="h-10 max-w-2xl rounded bg-slate-200" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded bg-slate-100" />
        ))}
      </div>
    </Container>
  );
}
