export declare const MAX_DISTANCE_M: number;
export declare const MIN_NAME_SIMILARITY: number;
export declare function nameTokens(name: string): string[];
export declare function nameSimilarity(a: string, b: string): number;
export declare function distanceMetres(
  a: { lat: number; lon: number } | null | undefined,
  b: { lat: number; lon: number } | null | undefined,
): number;
export declare function pickMatch(
  record: { name: string; coordinates?: { lat: number; lon: number } | null },
  candidates: { id?: string; displayName?: { text?: string }; location?: { latitude: number; longitude: number } }[] | null | undefined,
): string | null;
