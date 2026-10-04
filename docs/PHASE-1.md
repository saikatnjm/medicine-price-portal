# Phase 1 — Public Pilot

## Objective

Build and deploy a free, production-quality pilot of the Medicine Price Portal.

## Success Criteria

A visitor can:

1. Open the homepage.
2. Search for a medicine.
3. See relevant results.
4. Open a medicine.
5. See medicine information.
6. See sample prices.
7. Compare pharmacy prices.
8. See same-generic alternatives.
9. Open pharmacy information.
10. Navigate back through the site.
11. Use the site comfortably on mobile.
12. Find medicine pages through search engines.

## Pages

### Homepage

Route:

/

Requirements:

- clear product branding
- primary search field
- search CTA
- popular medicine examples
- explanation of product
- demo-data disclaimer
- footer

### Search

Route:

/search?q={query}

Requirements:

- query displayed
- results
- result count
- empty state
- loading state where applicable
- medicine cards/list
- clear navigation

### Medicine

Route:

/medicine/[slug]

Requirements:

- brand
- generic
- strength
- dosage form
- manufacturer
- pack size
- price comparison
- alternatives
- disclaimer
- SEO metadata

### Pharmacy

Route:

/pharmacy/[slug]

Requirements:

- pharmacy name
- location information
- medicine price examples
- disclaimer

## Search Requirements

Search fields:

- brand name
- generic name
- slug

Search must be:

- case insensitive
- partial match capable
- deterministic
- fast for Phase-1 dataset

## Data

Initial dataset target:

100 medicines
10 pharmacies
500 price records

The dataset is sample/demo data.

Do not imply real-time accuracy.

## SEO

Every medicine should have:

- unique title
- description
- canonical URL
- OpenGraph metadata

Generate:

sitemap.xml
robots.txt

## Responsive

Must support:

mobile
tablet
desktop

## Accessibility

Use:

semantic HTML
accessible forms
keyboard navigation
focus states
proper labels
alt text

## Validation

Before completion:

npm/package manager commands should be executed inside Docker.

Required:

lint
typecheck
test
production build
Docker build
Docker Compose startup

## Deployment

Repository:

GitHub

Deployment:

Vercel

No external database.

No API secrets.

No paid services.

## Out of Scope

Everything listed as Phase 2+.
