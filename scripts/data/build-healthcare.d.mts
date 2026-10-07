export declare function mergeGooglePlaces<T extends { provenance?: { recordId?: string } }>(
  records: T[],
  placeIds: Record<string, { placeId: string; lastChecked?: string }> | null | undefined,
): { records: T[]; merged: number };
