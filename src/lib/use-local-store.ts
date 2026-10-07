"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  MAX_SAVED,
  MAX_VIEWS,
  parseEntities,
  parseSearches,
  parseSlugs,
  readRaw,
  STORE_KEYS,
  subscribeStore,
  type StoreKey,
  type StoredEntity,
} from "./local-store";

/** Raw stored string; "" on the server and during hydration so markup always matches. */
function useRaw(key: StoreKey): string {
  return useSyncExternalStore(subscribeStore, () => readRaw(key), () => "");
}

export function useRecentSearches(): string[] {
  const raw = useRaw(STORE_KEYS.searches);
  return useMemo(() => parseSearches(raw), [raw]);
}

export function useRecentViews(): StoredEntity[] {
  const raw = useRaw(STORE_KEYS.views);
  return useMemo(() => parseEntities(raw, MAX_VIEWS), [raw]);
}

export function useSavedItems(): StoredEntity[] {
  const raw = useRaw(STORE_KEYS.saved);
  return useMemo(() => parseEntities(raw, MAX_SAVED), [raw]);
}

export function useCompareList(): string[] {
  const raw = useRaw(STORE_KEYS.compare);
  return useMemo(() => parseSlugs(raw), [raw]);
}
