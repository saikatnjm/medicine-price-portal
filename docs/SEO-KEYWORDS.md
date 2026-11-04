# SEO Keyword Research — Bangladesh (EN + BN)

Researched 2026-11-04. Phase 1 planning input; nothing here is implemented yet.

## 1. Method and caveat

We have no paid keyword tool. Volume tiers (High / Medium / Low) are **proxy estimates**, not tool data. The proxies were:

- competitor site structure and traffic (ahrefstop.com estimates);
- the brands that show up on competitor result pages and in market-sales press reports;
- Google results for Bangla and English query patterns;
- how many products each generic has in our own DGDA registry.

Before investing heavily in any cluster, re-check it in Google Search Console once the site is indexed.

**Competitive landscape** (traffic estimates from https://ahrefstop.com/websites/medex.com.bd/competitors):

| Site | Est. monthly organic traffic |
|---|---|
| medex.com.bd | ~3.2M |
| arogga.com | ~800K |
| medeasy.health | ~350K |
| osudpotro.com | ~170K |
| medicinebangla.com | ~153K |
| epharma.com.bd | ~107K |

All of these show **prices and indications/usage**, and we have neither. Head terms such as "napa price" or "নাপা এর কাজ কি" are therefore **not realistic** for us.

Our edge is in four areas:

- **Complete DGDA registry coverage.** We list 36,328 products, including small manufacturers and rare strengths.
- **DAR registration numbers.** No competitor surfaces these prominently.
- **Full per-company and per-generic lists.**
- **Bangla pages and district hospital/pharmacy listings.**

## 2. Keyword clusters → page types

Notes on the table:

- "Fit" means how realistic it is for us to rank: ✅ good, ⚠️ partial or long-tail only, ❌ we lack the data.
- Routes marked † already exist in `src/app/[lang]/`. Unmarked routes are proposals.

| Cluster | Example queries (EN / BN) | Est. volume | Fit | Target page |
|---|---|---|---|---|
| Brand lookup (brand + strength) | "napa 500", "sergel 20 mg" / "নাপা ৫০০", "সারজেল ২০" | High | ⚠️ long tail (rare brands/strengths) | /medicine/[slug] † |
| Brand → generic name | "napa generic name", "fexo 120 generic" / "নাপা এর জেনেরিক নাম" | High | ✅ | /medicine/[slug] (generic shown prominently) |
| Brand → manufacturer | "seclo which company" / "সেকলো কোন কোম্পানির ঔষধ" | Medium | ✅ | /medicine/[slug] |
| Brand price | "napa extend price in bangladesh" / "নাপা এক্সটেন্ড দাম" | High | ❌ no prices | none; do not target, never show invented prices |
| Brand uses/side effects | "fexo 120 er kaj ki" / "ফেক্সো ১২০ এর কাজ কি" | High | ❌ no indications; no medical advice | none |
| Generic → all brands | "paracetamol brands in bangladesh", "esomeprazole brand name" / "প্যারাসিটামল এর ব্র্যান্ড নাম" | Medium-High | ✅ our strongest cluster | /generics/[slug] |
| Generic + form/strength | "cefixime 200 mg capsule brands", "montelukast 10 mg tablet bd" | Medium | ✅ | /generics/[slug] (filtered sections, canonical clean path) |
| Company medicine list | "square pharma medicine list", "incepta product list", "beximco medicine list pdf" / "স্কয়ার কোম্পানির ঔষধের তালিকা" | Medium | ✅ (full DGDA list, 276 companies) | /companies/[slug] |
| Pharma company directory | "pharmaceutical companies in bangladesh list" / "বাংলাদেশের ঔষধ কোম্পানির তালিকা" | Medium | ✅ | /companies index |
| Dosage form browse | "eye drops list bangladesh", "suppository brands bd", "nasal spray bangladesh" | Low-Medium | ✅ (130 form labels) | /dosage-forms/[slug] |
| A–Z medicine index | "medicine list a to z bangladesh", "medicine name starting with s" / "ঔষধের নামের তালিকা" | Low-Medium | ✅ crawl hub | /medicines/[letter] |
| Registration check | "dgda registration check", "dar number check", "medicine verification bangladesh" / "ঔষধ নিবন্ধন যাচাই", "আসল নকল ঔষধ চেনার উপায়" | Medium | ✅ unique to us | /verify + guide |
| DGDA / regulator info | "dgda bangladesh", "dgda complaint" / "ঔষধ প্রশাসন অধিদপ্তর অভিযোগ" | Medium | ⚠️ the official site outranks us; guides only | /guides/... |
| Hospitals by district | "hospitals in sylhet", "hospital list in rajshahi" / "সিলেটের হাসপাতালের তালিকা" | Medium-High | ⚠️ OSM coverage varies; index only if ≥3 records | /hospitals/[location] † |
| Hospital by name | "dhaka medical college hospital address" / "ঢাকা মেডিকেল কলেজ হাসপাতাল ঠিকানা" | High (head) / Low (small clinics) | ⚠️ long tail only | /hospital/[slug] † |
| Pharmacy near me / district | "pharmacy near me", "24 hour pharmacy dhanmondi" / "কাছের ফার্মেসি" | High | ⚠️ "near me" depends on Google Maps; district pages are realistic | /pharmacies/[location] † |
| Specialty + district | "cardiology hospital chittagong" / "চট্টগ্রামে হৃদরোগ হাসপাতাল" | Low-Medium | ⚠️ only if a facility's OSM tags support it | /hospitals/[location]/[specialty] † |
| Doctor search | "best neurologist in dhaka", "doctor list" / "ডাক্তারের তালিকা" | High | ❌ no doctor data; keep noindex | /doctors † (noindex) |
| Emergency numbers | "bangladesh emergency number", "999 ambulance" / "জরুরি সেবা ৯৯৯" | Medium | ✅ | /emergency + guide |
| Explainers (labels, forms, generic vs brand) | "generic vs brand medicine", "what is mg/ml", "xr tablet meaning" / "জেনেরিক ও ব্র্যান্ড ঔষধের পার্থক্য" | Low-Medium each, many queries | ✅ | /guides/[slug] |

**Page-type priorities:**

1. **/generics/[slug]** (1,520 pages). Proposed title: "[Generic] brands in Bangladesh — N DGDA-registered products". Group the list by strength and form.
2. **/companies/[slug]** (276 pages). Proposed title: "[Company] medicine list — N registered products".
3. **/medicine/[slug]** †. Put brand, generic, manufacturer and DAR number in the title and H1. Add `Drug` JSON-LD without price or indication fields.
4. **/verify**. Search by brand or DAR number. State clearly that results come from the registry snapshot dated X, and that this is not proof that a physical pack is genuine.
5. **/medicines/[letter]** and **/dosage-forms/[slug]** as crawl hubs.
6. **/emergency** and **/guides/[slug]**, with Bangla mirrors under /bn.
7. Keep existing location pages under the PHASE-1 rule of indexing only with ≥3 records. Keep doctor pages noindex.

## 3. Guide topics (25)

All guides are informational and label-reading only. They contain no diagnosis, dosing or indications. Every fact must carry its source.

| # | Slug | EN title | BN title | Target query |
|---|---|---|---|---|
| 1 | what-is-dgda | What is DGDA (Directorate General of Drug Administration)? | ঔষধ প্রশাসন অধিদপ্তর (DGDA) কী? | dgda bangladesh / ঔষধ প্রশাসন অধিদপ্তর |
| 2 | check-dgda-registration | How to check if a medicine is DGDA-registered | ওষুধ ডিজিডিএ নিবন্ধিত কিনা কীভাবে যাচাই করবেন | dgda registration check / ঔষধ নিবন্ধন যাচাই |
| 3 | what-is-dar-number | What is the DAR number on a medicine pack? | ওষুধের প্যাকেটে DAR নম্বর কী? | dar number medicine |
| 4 | generic-vs-brand-name | Generic name vs brand name: what's the difference? | জেনেরিক নাম ও ব্র্যান্ড নামের পার্থক্য | generic vs brand medicine |
| 5 | find-generic-name-of-a-brand | How to find the generic name of any medicine brand | যেকোনো ব্র্যান্ডের জেনেরিক নাম কীভাবে খুঁজবেন | [brand] generic name / জেনেরিক নাম |
| 6 | why-one-generic-has-many-brands | Why one generic has hundreds of brands in Bangladesh | একটি জেনেরিকের কেন শত শত ব্র্যান্ড | paracetamol brands in bangladesh |
| 7 | compare-brands-same-generic | How to compare brands of the same generic (strength, form, maker) | একই জেনেরিকের ব্র্যান্ড কীভাবে তুলনা করবেন | same generic different brand |
| 8 | read-medicine-strength | How to read medicine strength: mg, mcg, mg/mL, % | ওষুধের শক্তি (mg, mg/mL, %) কীভাবে পড়বেন | mg/ml meaning |
| 9 | dosage-forms-explained | Tablet, capsule, syrup, suspension: dosage forms explained | ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন: ডোজ ফর্ম পরিচিতি | dosage forms list |
| 10 | tablet-suffixes-xr-sr-er-mups | What XR, SR, ER, DR and MUPS mean in a medicine name | ওষুধের নামে XR, SR, ER, MUPS মানে কী | xr tablet meaning |
| 11 | injection-labels-iv-im | IV, IM, SC and "IV infusion" labels explained | ইনজেকশনের IV, IM, SC লেবেলের অর্থ | iv im injection meaning |
| 12 | combination-medicines-label | Reading combination medicines (e.g. "Paracetamol + Caffeine") | কম্বিনেশন ওষুধের লেবেল কীভাবে পড়বেন | combination medicine meaning |
| 13 | read-a-medicine-pack | How to read a medicine pack: brand, generic, strength, DAR, batch, expiry | ওষুধের প্যাকেট কীভাবে পড়বেন | how to read medicine label |
| 14 | read-expiry-date | How to read manufacturing and expiry dates on medicine packs | ওষুধের উৎপাদন ও মেয়াদোত্তীর্ণের তারিখ কীভাবে দেখবেন | medicine expiry date check / মেয়াদ |
| 15 | report-fake-medicine-dgda | How to report a suspected fake or substandard medicine to DGDA | নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন | fake medicine complaint bangladesh / নকল ঔষধ অভিযোগ |
| 16 | pharmaceutical-companies-in-bangladesh | Pharmaceutical companies in Bangladesh (DGDA registry list) | বাংলাদেশের ঔষধ কোম্পানির তালিকা | pharmaceutical companies in bangladesh |
| 17 | medicine-names-bangla-english | Searching medicine names in Bangla and English | বাংলা ও ইংরেজিতে ওষুধের নাম খোঁজা | ঔষধের নাম বাংলায় |
| 18 | find-hospital-in-your-district | How to find a hospital or clinic in your district | আপনার জেলায় হাসপাতাল বা ক্লিনিক কীভাবে খুঁজবেন | hospital list [district] / জেলার হাসপাতাল |
| 19 | find-pharmacy-near-you | How to find a pharmacy in your area | আপনার এলাকায় ফার্মেসি কীভাবে খুঁজবেন | pharmacy near me / কাছের ফার্মেসি |
| 20 | hospital-clinic-pharmacy-listings | Hospital, clinic or pharmacy: what our listings mean | হাসপাতাল, ক্লিনিক, ফার্মেসি: তালিকার অর্থ | hospital vs clinic |
| 21 | fix-missing-hospital-openstreetmap | Hospital missing or wrong? How OpenStreetMap data works | হাসপাতাল নেই বা ভুল? OpenStreetMap তথ্য কীভাবে কাজ করে | add hospital to map |
| 22 | prepare-for-hospital-visit | Checklist: preparing for a hospital visit (papers, reports, medicine list) | হাসপাতালে যাওয়ার প্রস্তুতি: চেকলিস্ট | hospital visit checklist |
| 23 | keep-family-medicine-list | How to keep your family's medicine list (brand, generic, strength) | পরিবারের ওষুধের তালিকা কীভাবে রাখবেন | medicine list template |
| 24 | national-emergency-999 | 999: Bangladesh's national emergency number (police, fire, ambulance) | ৯৯৯: জাতীয় জরুরি সেবা | bangladesh emergency number / জরুরি সেবা ৯৯৯ |
| 25 | medical-departments-explained | Hospital department names explained (cardiology, neurology...) | হাসপাতালের বিভাগের নাম ও অর্থ | cardiology meaning in bangla |

**Verified facts for guide writers** (checked 2026-11-04; omit anything not listed here):

- **DGDA owns the drug registration data.** DGHS publishes the national DGDA drug-registry code system. That code system says the data "is owned by DGDA". Its concept IDs combine the DAR number and the trade name; the example given is `353-0026-039–marvelous-fe`. Source: https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html (guides 1–3).
  - Do **not** explain what each segment of the DAR number means. No verified source was found for that.
- **DGDA online complaint form.** The form is titled "Online Medical Product Complaint Entry Form" and sits on DGDA's Market Surveillance & Control site.
  - Complaint categories: product quality problem; suspected fake (falsified/counterfeit); unregistered or unlicensed product; other.
  - Required fields: complainant name and mobile number.
  - Attachments: up to 10 products and 4 files (JPG/PNG/PDF up to 5 MB, MP4 up to 20 MB). A paper form also exists.
  - Source: https://mpcas.dgdagov.info/complaint/new (guide 15). The dgda.gov.bd homepage links to this form.
  - No DGDA complaint hotline number could be verified. Do not publish one.
- **DGDA's official domain is dgda.gov.bd.** Its TLS certificate failed automated verification on 2026-11-04, so ask readers to type the address themselves rather than relying on a link.
  - Do **not** link to dgdagov.info or the raw-IP database links. On 2026-11-04 the dgdagov.info homepage contained injected gambling and dating spam.
- **DGDA Drug Verification app.** A DGDA-launched Android app of this name was reported to verify packs by scanning a QR code. Source: https://www.thedailystar.net/backpage/news/just-tap-away-1712506.
  - That report is undated and describes a pilot, so the app's current status is unverified. Mention it only as "reported". Better still, leave it out.
- **999 national emergency number.** 999 is a toll-free national help desk. Source: https://www.thedailystar.net/country/toll-free-national-help-desk-999-gets-live-1312624.
  - It is a centralized helpline for police, fire and ambulance support. Source: https://www.dhakatribune.com/amp/bangladesh/412748/national-emergency-service-999-receives-over-72.36 (15 June 2026) (guide 24 and /emergency).
- **OpenStreetMap.** It is built by a community of mappers. Data is free to use with credit to "OpenStreetMap and its contributors", and derivatives must use the same licence. It has an in-browser editor (iD). Source: https://www.openstreetmap.org/about (guide 21).
- **Shasthya Batayon 16263 (DGHS health helpline).** It exists, but a recent report says the service is at risk of shutting down. **Do not publish this number until it is re-verified.** Source: https://www.jagonews24.com/en/amp/89609.
- **Our own data, citable as "according to the DGDA registry snapshot on this site"** (guides 6, 9 and 16):
  - 36,328 products, 1,520 generics, 276 manufacturers and 130 dosage-form labels.
  - Paracetamol has 436 registered products.
  - The companies with the most registered products are Incepta (1,562), Square (1,413), Opsonin (1,260), Drug International (1,190) and Beximco (1,012).

## 4. Top 60 generics Bangladeshi users search most

How the list was ranked:

- **S**: the generic's leading brands appear in market-sales reporting. Sergel, Maxpro and Pantonix lead acid-suppressants; Seclo, Napa and Cef-3 are among the top sellers; allergy drugs are the fastest-growing category. Sources: https://www.thedailystar.net/node/3787426, https://thefinancialexpress.com.bd/home/anti-ulcerant-drugs-dominate-sales-chart-1610250086, https://online-d11.thedailystar.net/business/economy/news/allergy-drugs-emerge-bangladeshs-fastest-growing-pharma-category-4100501.
- **P**: the generic is featured on competitor pages or in our `popular.json`, which lists Napa, Ace, Seclo, Sergel, Fexo, Monas, Alatrol and Zimax.
- **R**: the generic has 100+ products in our registry.
- **J**: editorial judgement (a common chronic-use class). Not verified; this is the weakest evidence.

This is a demand proxy, not search-volume data. Slugs are the slugs in our `generics.json`.

| # | Generic (slug) | BN | Basis | # | Generic (slug) | BN | Basis |
|---|---|---|---|---|---|---|---|
| 1 | paracetamol | প্যারাসিটামল | S P R | 31 | tolfenamic-acid | টলফেনামিক অ্যাসিড | J |
| 2 | esomeprazole | ইসোমিপ্রাজল | S P R | 32 | caffeine-paracetamol | প্যারাসিটামল + ক্যাফেইন | P R |
| 3 | omeprazole | ওমিপ্রাজল | S P R | 33 | pregabalin | প্রিগাবালিন | R |
| 4 | pantoprazole | প্যান্টোপ্রাজল | S R | 34 | tiemonium-methylsulphate | টিমোনিয়াম মিথাইলসালফেট | R |
| 5 | fexofenadine-hydrochloride | ফেক্সোফেনাডিন | S P R | 35 | hyoscine-butyl-bromide | হায়োসিন বিউটাইলব্রোমাইড | R |
| 6 | montelukast | মন্টিলুকাস্ট | P R | 36 | clonazepam | ক্লোনাজেপাম | R |
| 7 | cetirizine-dihydrochloride | সেটিরিজিন | P R | 37 | metformin-hydrochloride | মেটফরমিন | R |
| 8 | azithromycin | অ্যাজিথ্রোমাইসিন | P R | 38 | gliclazide | গ্লিক্লাজাইড | R |
| 9 | cefixime | সেফিক্সিম | S R | 39 | glimepiride | গ্লিমেপিরাইড | R |
| 10 | ceftriaxone | সেফট্রিয়াক্সোন | R | 40 | linagliptin | লিনাগ্লিপটিন | J |
| 11 | cefuroxime | সেফুরক্সিম | R | 41 | empagliflozin | এমপাগ্লিফ্লোজিন | J |
| 12 | amoxicillin | অ্যামোক্সিসিলিন | R | 42 | amlodipine | অ্যামলোডিপিন | R |
| 13 | amoxicillin-clavulanic-acid | অ্যামোক্সিসিলিন + ক্লাভুলানিক অ্যাসিড | R | 43 | losartan-potassium | লোসার্টান পটাশিয়াম | R |
| 14 | ciprofloxacin | সিপ্রোফ্লক্সাসিন | R | 44 | bisoprolol-hemifumarate | বিসোপ্রোলল | R |
| 15 | levofloxacin | লেভোফ্লক্সাসিন | R | 45 | olmesartan-medoxomil | ওলমিসার্টান | J |
| 16 | metronidazole | মেট্রোনিডাজল | R | 46 | atorvastatin | অ্যাটরভাস্ট্যাটিন | R |
| 17 | flucloxacillin | ফ্লুক্লক্সাসিলিন | R | 47 | rosuvastatin | রসুভাস্ট্যাটিন | R |
| 18 | cephradine | সেফ্রাডিন | R | 48 | levothyroxine-sodium | লেভোথাইরক্সিন | J |
| 19 | doxycycline | ডক্সিসাইক্লিন | R | 49 | desloratadine | ডেসলোরাটাডিন | S |
| 20 | domperidone | ডমপেরিডোন | P R | 50 | rupatadine | রুপাটাডিন | S |
| 21 | ondansetron | অনডানসেট্রন | R | 51 | bilastine | বিলাস্টিন | S P |
| 22 | rabeprazole-sodium | রাবিপ্রাজল | R | 52 | ketotifen | কিটোটিফেন | R |
| 23 | dexlansoprazole | ডেক্সল্যান্সোপ্রাজল | R | 53 | salbutamol | সালবিউটামল | R |
| 24 | famotidine | ফ্যামোটিডিন | J | 54 | doxophylline | ডক্সোফাইলিন | R |
| 25 | diclofenac-sodium | ডাইক্লোফেনাক | R | 55 | ambroxol | অ্যামব্রক্সল | R |
| 26 | ketorolac-tromethamine | কিটোরোলাক | R | 56 | albendazole | অ্যালবেনডাজল | R |
| 27 | naproxen | ন্যাপ্রোক্সেন | R | 57 | fluconazole | ফ্লুকোনাজল | R |
| 28 | aceclofenac | এসিক্লোফেনাক | R | 58 | cholecalciferol-vit-d3 | ভিটামিন ডি৩ (কোলেক্যালসিফেরল) | R |
| 29 | etoricoxib | ইটোরিকক্সিব | P R | 59 | calcium-vitamin-d3 | ক্যালসিয়াম + ভিটামিন ডি৩ | R |
| 30 | ibuprofen | আইবুপ্রোফেন | R | 60 | nicotinamide-pyridoxine-hydrochloride-riboflavin-vitamin-b1 | ভিটামিন বি কমপ্লেক্স | R |

**Alternates if any of the above are thin:** zinc, prednisolone, ivermectin, permethrin, tranexamic-acid, ferrous-sulphate-folic-acid-zinc, nitazoxanide, itopride-hydrochloride, cinnarizine, flupenthixol-melitracen.

**Data-quality notes:**

- Levocetirizine is split across two slugs, `levocetirizine-hydrochloride` and `levocetrizine-dihydrochloride` (the second is misspelled). Merge them, or set a canonical, before building /generics pages.
- The registry contains no ORS or "oral rehydration salts" generic. ORS products are listed under salt-composition generics.

**Bangla transliterations** are the common ones seen in BD pharmacy listings. Have them reviewed before publishing under /bn.
