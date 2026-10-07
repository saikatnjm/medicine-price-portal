import Link from "@/i18n/link";

/** Honest empty state with one onward link. */
export function DirectoryEmptyNote({
  title,
  body,
  href,
  linkLabel,
}: {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm">{body}</p>
      <Link href={href} className="mt-2 inline-flex min-h-11 items-center font-medium text-brand-800 underline">
        {linkLabel}
      </Link>
    </div>
  );
}
