# Bangladesh Healthcare Search

## Vision

Build a trustworthy medicine information and healthcare directory platform.

The platform should help users discover medicines, compare prices, find healthcare providers (hospitals, clinics, doctors), understand generic/brand relationships, and access verified provider information.

## Initial Goal

Validate the product concept with a completely free public pilot combining:
- Medicine search and information (DGDA registry, 36,328 products)
- Healthcare directory (hospitals, clinics, diagnostic centres, dental clinics, doctors' practices, blood banks, pharmacies from OpenStreetMap)
- No paid APIs or external data; data sourced from open registries

## Phase 1 User Journey

User visits homepage and searches for a medicine ("Napa") or healthcare provider ("cardiology in Dhaka").

**Medicine flow:**
- System shows matching medicines
- User selects "Napa 500mg"
- System shows brand name, generic name, strength, dosage form, manufacturer, pack information, same-generic alternatives, and pharmacy availability (when prices are sourced)

**Healthcare provider flow:**
- System shows hospitals, clinics, doctors, or pharmacies
- User refines by location and/or specialty
- User opens a provider page to see contact info, address and directions

## Product Principles

1. Search must be extremely easy (medicines and providers).
2. Information must be easy to scan.
3. Provider contact and location information must be obvious.
4. The interface must feel trustworthy and professional.
5. Mobile usability is critical.
6. SEO is a major acquisition channel.
7. All data sources must be disclosed; unverified data must be labelled.
8. The architecture must support future backend integration.

## Data Sources & Transparency

- **Medicines:** DGDA Registered Drug Products (official government registry, public access, no license published)
- **Healthcare providers & pharmacies:** OpenStreetMap (ODbL license, © OpenStreetMap contributors)
- **Doctor records:** Intentionally empty—only verified, consented individual data will be added
- **Specialties:** Curated taxonomy (22 specialties, mapped to OSM values)
- **Locations:** Administrative boundaries from OSM (8 divisions, 64 districts)

## Target Market

Initial target: Bangladesh.

The system is designed for future localization and multi-language support.

## Business Model

Not implemented in Phase 1.

Potential future models: healthcare provider subscriptions, pharmacy integrations, medicine ordering, API access, healthcare partnerships.
