/** Soft pill link styles (44px target). Chips sit on white; use WHITE_CHIP_CLASS on a mist background. */
const BASE =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors";

export const CHIP_CLASS = `${BASE} bg-mist text-pine hover:bg-brand-100`;
export const WHITE_CHIP_CLASS = `${BASE} bg-white text-ink shadow-sm hover:bg-brand-100`;
/** "See everything" chip at the end of a chip list. */
export const INDEX_CHIP_CLASS = `${BASE} text-brand-800 ring-1 ring-brand-600/30 hover:bg-mist`;
