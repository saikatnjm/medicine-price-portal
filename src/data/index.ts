/**
 * Composition root: the only place that chooses the data source.
 *
 * Phase 1 uses bundled seed data. A future API-backed provider
 * (Django REST API) is wired in here; pages and components do not change.
 */
import "server-only";
import { createServices, type Services } from "../services";
import { seedDataset } from "./local/dataset";
import { createLocalRepositories } from "./local/repositories";

export const services: Services = createServices(createLocalRepositories(seedDataset));
