/**
 * Browser-only personalisation (recent searches, recently viewed, saved items, compare list).
 * Everything stays in this browser's localStorage: nothing is sent to a server and no account is needed.
 * All access is wrapped so private mode / blocked storage simply behaves like "no history".
 */
const PREFIX = "bhs:v1:";
export const STORE_KEYS = {
  searches: `${PREFIX}searches`,
  views: `${PREFIX}views`,
  saved: `${PREFIX}saved`,
  compare: `${PREFIX}compare`,
} as const;
export type StoreKey = (typeof STORE_KEYS)[keyof typeof STORE_KEYS];

const CHANGE_EVENT = "bhs:storage";
export const MAX_SEARCHES = 8;
export const MAX_VIEWS = 10;
export const MAX_SAVED = 100;
export const MAX_COMPARE = 4;
const MAX_QUERY_LENGTH = 80;

export const ENTITY_TYPES = ["medicine", "hospital", "pharmacy", "doctor"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export interface StoredEntity {
  type: EntityType;
  slug: string;
  name: string;
  /** Short context line, e.g. generic name or place. */
  subtitle?: string;
  /** Epoch milliseconds when it was viewed or saved. */
  at: number;
}

// ---------------------------------------------------------------- raw access

export function readRaw(key: StoreKey): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeRaw(key: StoreKey, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage full or blocked: personalisation is optional.
  }
}

function removeRaw(key: StoreKey): void {
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Subscribes to changes made in this tab or any other tab. */
export function subscribeStore(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// ------------------------------------------------------------------- parsing

function parseJson(raw: string): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseSearches(raw: string): string[] {
  const data = parseJson(raw);
  if (!Array.isArray(data)) return [];
  return data.filter((q): q is string => typeof q === "string" && q.trim().length > 0).slice(0, MAX_SEARCHES);
}

function isEntity(value: unknown): value is StoredEntity {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    ENTITY_TYPES.includes(v.type as EntityType) &&
    typeof v.slug === "string" &&
    /^[A-Za-z0-9._~-]+$/.test(v.slug) &&
    typeof v.name === "string" &&
    typeof v.at === "number"
  );
}

export function parseEntities(raw: string, max: number): StoredEntity[] {
  const data = parseJson(raw);
  return Array.isArray(data) ? data.filter(isEntity).slice(0, max) : [];
}

export function parseSlugs(raw: string): string[] {
  const data = parseJson(raw);
  return Array.isArray(data)
    ? data.filter((s): s is string => typeof s === "string" && /^[A-Za-z0-9._~-]+$/.test(s)).slice(0, MAX_COMPARE)
    : [];
}

// ------------------------------------------------------------------ searches

export function addSearch(query: string): void {
  const q = query.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
  if (q.length < 2) return;
  const rest = parseSearches(readRaw(STORE_KEYS.searches)).filter((s) => s.toLowerCase() !== q.toLowerCase());
  writeRaw(STORE_KEYS.searches, [q, ...rest].slice(0, MAX_SEARCHES));
}

export const clearSearches = () => removeRaw(STORE_KEYS.searches);

// -------------------------------------------------------------------- views

const sameEntity = (a: Pick<StoredEntity, "type" | "slug">, b: Pick<StoredEntity, "type" | "slug">) =>
  a.type === b.type && a.slug === b.slug;

export function addView(entity: Omit<StoredEntity, "at">): void {
  const rest = parseEntities(readRaw(STORE_KEYS.views), MAX_VIEWS).filter((e) => !sameEntity(e, entity));
  writeRaw(STORE_KEYS.views, [{ ...entity, at: Date.now() }, ...rest].slice(0, MAX_VIEWS));
}

export const clearViews = () => removeRaw(STORE_KEYS.views);

// -------------------------------------------------------------------- saved

export function isSaved(raw: string, type: EntityType, slug: string): boolean {
  return parseEntities(raw, MAX_SAVED).some((e) => sameEntity(e, { type, slug }));
}

/** Saves or un-saves; returns true when the item is saved afterwards. */
export function toggleSaved(entity: Omit<StoredEntity, "at">): boolean {
  const current = parseEntities(readRaw(STORE_KEYS.saved), MAX_SAVED);
  if (current.some((e) => sameEntity(e, entity))) {
    writeRaw(STORE_KEYS.saved, current.filter((e) => !sameEntity(e, entity)));
    return false;
  }
  writeRaw(STORE_KEYS.saved, [{ ...entity, at: Date.now() }, ...current].slice(0, MAX_SAVED));
  return true;
}

export const clearSaved = () => removeRaw(STORE_KEYS.saved);

// ------------------------------------------------------------------ compare

/** Adds or removes a medicine from the compare list (at most MAX_COMPARE). Returns the new list. */
export function toggleCompare(slug: string): string[] {
  const current = parseSlugs(readRaw(STORE_KEYS.compare));
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug].slice(-MAX_COMPARE);
  writeRaw(STORE_KEYS.compare, next);
  return next;
}

export const clearCompare = () => removeRaw(STORE_KEYS.compare);
