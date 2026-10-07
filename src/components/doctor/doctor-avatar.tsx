import { CATEGORY } from "@/components/ui/category";

const TITLE_PREFIX = /^(dr|prof|professor|assoc|asst|md)\.?\s+/i;

/** First letter of the name without a leading "Dr." style title; "?" never appears (falls back to the first character). */
export function doctorInitial(name: string): string {
  let rest = name.trim();
  while (TITLE_PREFIX.test(rest)) rest = rest.replace(TITLE_PREFIX, "");
  const first = Array.from(rest || name.trim())[0] ?? "";
  return first.toLocaleUpperCase("en-US");
}

/** Avatar tile with the doctor's initial. The directory carries no photos, so this is always an initial. */
export function DoctorAvatar({ name, size = "lg" }: { name: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-16 rounded-2xl text-2xl" : "size-10 rounded-xl text-base";
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center font-semibold ${CATEGORY.doctor.tint} ${box}`}
    >
      {doctorInitial(name)}
    </span>
  );
}
