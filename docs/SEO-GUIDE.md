# SEO guide

Already in place: per-language canonical + hreflang, sitemaps (core, medicines, facilities, pharmacies, doctors; both languages with alternates), robots rules for search/filter URLs, noindex for thin / needs-review / filtered pages, JSON-LD (WebSite, BreadcrumbList, Hospital, Pharmacy, Drug, MedicalWebPage, CollectionPage), unique titles and descriptions (trimmed to ~160 chars by `fitDescription`).

Check a running site: `node scripts/seo-audit.mjs http://localhost:3001` (or `npm run seo:audit -- <url> --sample 40 --strict`).

Go-live checklist (owner actions)
1. Vercel env: `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXABLE=true`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console HTML-tag token).
2. Search Console: add the property, verify, submit `https://<domain>/sitemap/core.xml` plus the other sitemap files listed in robots.txt. Bing Webmaster Tools: import from Search Console.
3. Use URL Inspection → Request indexing for the homepage, /bn, a few specialty, location and hospital pages first.
4. Watch Coverage / Pages: "Crawled – currently not indexed" on medicine pages means Google judges them thin; add sourced content (see medicine safety, docs/PHASE-6.md) before expecting them to rank.
5. Check Core Web Vitals (Search Console) after a week of traffic; keep pages light.
6. Earn links: submit the site to Bangladeshi health directories, student/NGO resource lists, and local tech communities; real backlinks matter more than any on-page tweak.
