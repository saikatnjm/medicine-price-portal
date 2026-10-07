import { CATEGORY, type CategoryType } from "./category";

const SIZES = {
  sm: "size-9 rounded-xl [&>svg]:size-5",
  md: "size-11 rounded-xl [&>svg]:size-6",
} as const;

/** Decorative category-tinted icon tile. Always pair it with a visible text label. */
export function CategoryTile({ type, size = "md" }: { type: CategoryType; size?: keyof typeof SIZES }) {
  const { Icon, tint } = CATEGORY[type];
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center ${tint} ${SIZES[size]}`}>
      <Icon />
    </span>
  );
}
