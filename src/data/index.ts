/**
 * Composition root: the only place that chooses the data source.
 *
 * Phase 1 uses the local seed data (read once per process). A future API-backed provider
 * (Django REST API) is wired in here; pages and components do not change.
 */
import "server-only";
import { createServices, type Services } from "../services";
import { getSeedDataset } from "./local/dataset";
import { createLocalRepositories } from "./local/repositories";

export const services: Services = createServices(createLocalRepositories(getSeedDataset()));
