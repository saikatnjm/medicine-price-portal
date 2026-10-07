import Link from "@/i18n/link";
import type { SearchIntent } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

const ENTITY_LABEL = {
  doctor: "search.entity.doctor",
  hospital: "search.entity.hospital",
  pharmacy: "search.entity.pharmacy",
} as const;

/** Path (with optional ?q=) of the directory page that best matches the understood query. */
export function intentHref(intent: SearchIntent): string | null {
  const { entity, specialty, location, text } = intent;
  const loc = location?.slug;
  const spec = specialty?.slug;
  const withText = (path: string) => (text ? `${path}?q=${encodeURIComponent(text)}` : path);
  if (entity === "doctor") return withText(routes.doctors(loc, spec));
  if (entity === "hospital") return withText(routes.hospitals(loc, spec));
  if (entity === "pharmacy") return withText(routes.pharmacies(loc));
  if (specialty && !text) return location ? routes.hospitals(loc, spec) : routes.specialty(specialty.slug);
  if (location && !specialty && !text) return routes.location(location.slug);
  return null;
}

/** "Understood as: Cardiologists · Gulshan" with a link to the matching directory page. */
export function UnderstoodAs({ intent }: { intent: SearchIntent }) {
  const t = getT();
  const { entity, specialty, location } = intent;
  if (!entity && !specialty && !location) return null;
  const subject = entity === "doctor" && specialty
    ? t("search.understood.doctorTitle", { title: specialty.practitionerTitle })
    : [entity ? t(ENTITY_LABEL[entity]) : null, specialty?.name].filter(Boolean).join(" · ") || null;
  const label = [subject, location?.name].filter(Boolean).join(" · ");
  const href = intentHref(intent);
  return (
    <p className="mb-6 text-sm text-slate-700">
      <span className="text-slate-600">{t("search.understood.label")}</span>
      {href ? (
        <Link href={href} className="font-medium text-brand-800 underline">
          {label}
        </Link>
      ) : (
        <span className="font-medium text-slate-900">{label}</span>
      )}
    </p>
  );
}
