# Product Roadmap

## Phase 1 — Public Pilot (Done)

Medicine search and information
- Next.js 16, TypeScript, Tailwind CSS
- 36,328 medicines from DGDA registry
- Medicine search (brand, generic, strength, slug)
- Medicine detail pages (information, alternatives, price placeholder)
- SEO (canonical, OpenGraph, JSON-LD, sitemap, robots.txt)

Healthcare directory (MVP)
- OpenStreetMap facilities (7,866 features → 3,447 facilities + 3,712 pharmacies)
- Facility/pharmacy/doctor list pages (with location and specialty filters)
- Facility/pharmacy/doctor detail pages (contact, location, hours)
- Locations (8 divisions, 64 districts)
- Specialties (22 curated)
- Combination pages (≥3 records indexable)
- Maps (click-to-load OSM, optional Google Embed API, no API calls)

Infrastructure
- Docker Compose (local dev)
- Vercel (production)
- Responsive mobile-first design
- Accessibility basics

## Phase 2 — Backend & Verified Data

Backend infrastructure
- Django + Django REST Framework
- PostgreSQL
- Admin interface (content management)

Verified directory data
- Doctor records from verified sources (consented individuals)
- Facility/pharmacy data validation and curation
- Area boundaries (admin_level 7) assignment

Medicine pricing
- Pharmacy integrations (price import)
- Price management UI
- Verified pharmacy data

## Phase 3 — Advanced Search & Scaling

Search engine
- Meilisearch for full-text search and faceting
- Autocomplete optimization
- Embedding-based doctor/specialty search

Data pipeline automation
- Redis caching
- Celery workers for async imports
- Automated price updates from integrations
- Multi-source deduplication

## Phase 4 — User Features

User accounts and personalization
- Authentication (email, SMS)
- Favorites and wish lists
- Medicine/provider history
- Reminders (medicine, appointments)
- Notifications

## Phase 5 — Advanced Features

Healthcare provider tools
- Doctor profiles and appointments
- Prescription management
- Telemedicine consultation (future)
- Pharmacy inventory dashboard
- Order management and fulfillment

## Phase 6 — Mobile & AI (Future)

Mobile applications (iOS/Android)
Medicine interaction checker
AI-assisted search and recommendations
Multimodal search (image of medicine, voice)
Bangladesh localization (Bangla UI)

## Rule

Do not implement future phases unless explicitly requested.
