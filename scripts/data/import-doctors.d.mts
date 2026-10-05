export interface DoctorImportInput {
  csvText: string;
  sources: unknown;
  specialties: { id: string; slug: string }[];
  facilities: { id: string; slug: string; kind?: string; districtId?: string }[];
  locations: { id: string; slug: string; level: string; parentId?: string }[];
  allowExamples?: boolean;
  now?: string;
}
export interface DoctorImportResult {
  doctors: Record<string, any>[];
  sources: Record<string, any>[];
  errors: string[];
  warnings: string[];
  report: { rows: number; doctors: number; chambers: number; now: string };
}
export declare const COLUMNS: string[];
export declare function parseCsv(text: string): { line: number; cells: string[] }[];
export declare function isValidPhone(value: string): boolean;
export declare function buildDoctors(input: DoctorImportInput): DoctorImportResult;
export declare function mergeSources(existing: Record<string, any>[], imported: Record<string, any>[]): Record<string, any>[];
export declare function renderReport(result: DoctorImportResult, opts?: { allowExamples?: boolean }): string;
