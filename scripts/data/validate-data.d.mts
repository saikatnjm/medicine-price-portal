export interface DatasetFiles {
  medicines: unknown[];
  generics: unknown[];
  manufacturers: unknown[];
  sources: unknown[];
  pharmacies: unknown[];
  prices: unknown[];
  popular: unknown[];
  facilities?: unknown[];
  locations?: unknown[];
  specialties?: unknown[];
  doctors?: unknown[];
  directorySources?: unknown[];
}

export declare function validateDataset(data: DatasetFiles): {
  errors: string[];
  counts: Map<string, number>;
};
