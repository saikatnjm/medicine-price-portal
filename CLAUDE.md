# Medicine Price Portal — Engineering Rules

Read these documents before making architectural changes:

- docs/PROJECT.md
- docs/ARCHITECTURE.md
- docs/PHASE-1.md
- docs/DATA-MODEL.md
- docs/UI-UX.md
- docs/ROADMAP.md
- docs/DEVELOPMENT.md
- docs/DECISIONS.md

## Current Phase

Phase 1 — Public Pilot.

Do not implement future phases unless explicitly requested.

## Stack

Next.js
TypeScript
Tailwind CSS
shadcn/ui
local seed data
Docker Compose
GitHub
Vercel

## Architecture

UI
→ Services
→ Repository interfaces
→ Data provider

UI must not directly import raw data.

## Future Compatibility

The data provider must eventually be replaceable by a Django REST API without major frontend rewrites.

## Docker

Local development must work through Docker Compose.

Do not require Node/npm/pnpm/yarn on the host.

## Quality

Before completion:

- lint
- typecheck
- test
- production build
- Docker build

## Product Safety

Sample data must not be presented as live medical/pharmacy data.

Do not provide diagnosis or medical treatment recommendations.

## Engineering

Prefer simple maintainable solutions.

Do not over-engineer.

Do not add dependencies without justification.

Do not rewrite working code unnecessarily.
