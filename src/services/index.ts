import type { Repositories } from "../repositories";
import { DirectoryService } from "./directory-service";
import { DoctorService } from "./doctor-service";
import { FacilityService } from "./facility-service";
import { LocationService } from "./location-service";
import { MedicineService } from "./medicine-service";
import { PharmacyService } from "./pharmacy-service";
import { SearchService } from "./search-service";
import { SpecialtyService } from "./specialty-service";

export interface Services {
  medicines: MedicineService;
  pharmacies: PharmacyService;
  facilities: FacilityService;
  doctors: DoctorService;
  locations: LocationService;
  specialties: SpecialtyService;
  directory: DirectoryService;
  search: SearchService;
}

export function createServices(repos: Repositories): Services {
  return {
    medicines: new MedicineService(repos),
    pharmacies: new PharmacyService(repos),
    facilities: new FacilityService(repos),
    doctors: new DoctorService(repos),
    locations: new LocationService(repos),
    specialties: new SpecialtyService(repos),
    directory: new DirectoryService(repos),
    search: new SearchService(repos),
  };
}

export {
  DirectoryService,
  DoctorService,
  FacilityService,
  LocationService,
  MedicineService,
  PharmacyService,
  SearchService,
  SpecialtyService,
};
export type { DirectoryListInput, DirectoryListResult, FacilityListInput } from "./facility-service";
export type { DoctorListInput } from "./doctor-service";
