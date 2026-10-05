export declare function cleanText(value: unknown): string;
export declare function keyOf(value: unknown): string;
export declare function slugify(value: unknown): string;
export declare function normalizeStrength(value: unknown): string;
export declare function splitGenericContent(
  raw: unknown,
): { ingredients: string[]; strength: string; malformedStrength?: string } | null;
export declare function genericNameOf(ingredients: readonly string[]): string;
export declare function formatDosageFormLabel(raw: unknown): string;
export declare const DOSAGE_FORM_CATEGORIES: string[];
export declare function classifyDosageForm(
  raw: unknown,
): { category: string; label: string } | { excluded: string };
export declare function isVeterinary(record: {
  darNumber?: string;
  tradeName: string;
  company: string;
}): boolean;
export declare function manufacturerDisplayName(company: unknown): string;
export declare function manufacturerKey(company: unknown): string;
export declare function brandNameOf(tradeName: unknown, strength: string): string;
export declare function looksMalformed(value: unknown): boolean;
