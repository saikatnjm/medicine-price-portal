import type { Repositories } from "../repositories";
import { MedicineService } from "./medicine-service";
import { PharmacyService } from "./pharmacy-service";
import { SearchService } from "./search-service";

export interface Services {
  medicines: MedicineService;
  pharmacies: PharmacyService;
  search: SearchService;
}

export function createServices(repos: Repositories): Services {
  return {
    medicines: new MedicineService(repos),
    pharmacies: new PharmacyService(repos),
    search: new SearchService(repos),
  };
}

export { MedicineService, PharmacyService, SearchService };
