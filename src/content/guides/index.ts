import type { Guide } from "./types";

export type { Guide, GuideBlock, GuideContent } from "./types";

/** Editorial guides, in display order. Content only: no medical advice, no invented data. */
export const GUIDES: readonly Guide[] = [];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
