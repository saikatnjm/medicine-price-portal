export declare function mergeGooglePlaces<T extends { provenance?: { recordId?: string } }>(
  records: T[],
  placeIds: Record<string, { placeId: string | null; lastChecked?: string }> | null | undefined,
): { records: T[]; merged: number };
