import type { ReactNode } from "react";
import { CATEGORY, type CategoryType } from "@/components/ui/category";

/** Header block for entity pages: a soft mist surface (no heavy border or shadow) holding name, place and actions. */
export function HeroCard({ children }: { children: ReactNode }) {
  return <div className="space-y-5 rounded-2xl bg-mist p-5 sm:p-6">{children}</div>;
}

const SIZES = {
  md: "size-10 rounded-xl [&>svg]:size-5",
  lg: "size-14 rounded-2xl [&>svg]:size-7",
} as const;

/** Category-tinted icon tile (decorative; the entity type is always named in text nearby). */
export function EntityTile({ kind, size = "md" }: { kind: CategoryType; size?: keyof typeof SIZES }) {
  const { Icon, tint } = CATEGORY[kind];
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center ${tint} ${SIZES[size]}`}>
      <Icon />
    </span>
  );
}
