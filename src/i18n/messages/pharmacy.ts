import { defineMessages } from "../define";

/** pharmacy strings. Keys are prefixed "pharmacy.". */
export const pharmacy = defineMessages({
  en: {
    "pharmacy.overview.kind": "Pharmacy",

    "pharmacy.prices.heading_sample": "Sample prices at this pharmacy",
    "pharmacy.prices.heading": "Prices at this pharmacy",
    "pharmacy.prices.desc.one": "{n} medicine, A–Z.",
    "pharmacy.prices.desc.other": "{n} medicines, A–Z.",
    "pharmacy.prices.none": "No prices are listed for this pharmacy.",
    "pharmacy.prices.unavailable": "Medicine prices and stock are not available for this pharmacy.",

    "pharmacy.notfound.heading": "Pharmacy not found",
    "pharmacy.notfound.body": "We could not find that pharmacy. It may have been renamed or removed.",
    "pharmacy.notfound.browse": "Browse pharmacies",
    "pharmacy.notfound.search": "Search",
    "pharmacy.notfound.home": "Go to the homepage",

    "pharmacy.page.not_found_title": "Pharmacy not found",
    "pharmacy.page.faq_directions_q": "How can I get directions to {name}?",
    "pharmacy.page.faq_directions_a":
      "Use the Directions button at the top of this page. It opens Google Maps in a new tab with the listed location as the destination.",
    "pharmacy.page.faq_prices_q": "Does this page show medicine prices or stock?",
    "pharmacy.page.faq_prices_none": "No. Medicine prices and stock are not available for this pharmacy. Call the pharmacy to ask.",
    "pharmacy.page.faq_prices_sample":
      "Only sample price entries are shown. They are demonstration data, not live prices or stock. Call the pharmacy to confirm.",
    "pharmacy.page.faq_verified_q": "Is the information about {name} verified?",
    "pharmacy.page.faq_verified_no":
      "No. This listing comes from community-mapped OpenStreetMap data that we have not independently verified. Opening hours and contact details may be out of date, so call ahead before you visit.",
    "pharmacy.page.faq_verified_other": "This listing is marked \"{label}\". See Source & verification below for where it comes from.",
    "pharmacy.page.next_nearby": "Find nearby pharmacies",
    "pharmacy.page.next_hospital": "Find a hospital nearby",
    "pharmacy.page.next_search": "Search a medicine",

    "pharmacy.trust.registered": "Official registry",
    "pharmacy.trust.unverified": "Community-mapped",
    "pharmacy.trust.needs_review": "Needs review",
    "pharmacy.trust.verified": "Source verified",
    "pharmacy.trust.user_reported": "User reported",

    "pharmacy.list.notice":
      "Medicine prices and stock are not available for these pharmacies yet. This list shows where pharmacies are, not what they sell or charge.",
    "pharmacy.list.name_label": "Pharmacy name",
    "pharmacy.list.name_placeholder": "Search by pharmacy name",
    "pharmacy.list.results": "Results",
    "pharmacy.list.list_label": "Pharmacies",
    "pharmacy.list.noun": "pharmacies",
    "pharmacy.list.noun_one": "pharmacy",

    // SEO and breadcrumbs
    "pharmacy.seo.home": "Home",
    "pharmacy.seo.pharmacies": "Pharmacies",
    "pharmacy.seo.division": "{name} Division",
    "pharmacy.seo.suffix_long": " — Location & Contact",
    "pharmacy.seo.suffix_short": " — Pharmacy",
    "pharmacy.seo.intro": "{name} is a pharmacy.",
    "pharmacy.seo.intro_place": "{name} is a pharmacy in {place}.",
    "pharmacy.seo.item_address": "address",
    "pharmacy.seo.item_phone": "phone number",
    "pharmacy.seo.item_hours": "opening hours",
    "pharmacy.seo.item_directions": "directions",
    "pharmacy.seo.lists": "Lists {items} where published.",
    "pharmacy.seo.price_sample": "Sample price entries are demonstration data, not live prices.",
    "pharmacy.seo.price_none": "Medicine prices and stock are not available yet.",
    "pharmacy.seo.caveat": "Community-mapped information that may be out of date; call ahead before visiting.",
    "pharmacy.seo.list_title": "Pharmacies in {scope}",
    "pharmacy.seo.list_title_national": "Pharmacies in Bangladesh",
    "pharmacy.seo.list_desc_empty": "Pharmacies in {scope}. No listings are available yet.",
    "pharmacy.seo.list_desc_empty_national": "Pharmacies in Bangladesh. No listings are available yet.",
    "pharmacy.seo.list_desc":
      "{count} pharmacies in {scope} with addresses, phone numbers and directions where published. Medicine prices and stock are not available yet. {caveat}",
    "pharmacy.seo.list_desc_national":
      "{count} pharmacies in Bangladesh with addresses, phone numbers and directions where published. Medicine prices and stock are not available yet. {caveat}",
    "pharmacy.seo.list_caveat":
      "Listings come from community-mapped OpenStreetMap data and have not been verified, so call ahead before visiting.",
  },
  bn: {
    "pharmacy.overview.kind": "ফার্মেসি",

    "pharmacy.prices.heading_sample": "এই ফার্মেসির নমুনা মূল্য",
    "pharmacy.prices.heading": "এই ফার্মেসির মূল্য",
    "pharmacy.prices.desc.one": "{n}টি ওষুধ, বর্ণানুক্রমে।",
    "pharmacy.prices.desc.other": "{n}টি ওষুধ, বর্ণানুক্রমে।",
    "pharmacy.prices.none": "এই ফার্মেসির জন্য কোনো মূল্য তালিকাভুক্ত নেই।",
    "pharmacy.prices.unavailable": "এই ফার্মেসির ওষুধের মূল্য ও মজুদের তথ্য পাওয়া যায়নি।",

    "pharmacy.notfound.heading": "ফার্মেসি পাওয়া যায়নি",
    "pharmacy.notfound.body": "আমরা ফার্মেসিটি খুঁজে পাইনি। এর নাম হয়তো বদলে গেছে অথবা এটি সরিয়ে ফেলা হয়েছে।",
    "pharmacy.notfound.browse": "ফার্মেসির তালিকা দেখুন",
    "pharmacy.notfound.search": "অনুসন্ধান",
    "pharmacy.notfound.home": "হোমপেজে যান",

    "pharmacy.page.not_found_title": "ফার্মেসি পাওয়া যায়নি",
    "pharmacy.page.faq_directions_q": "{name}-এ যাওয়ার দিকনির্দেশনা কীভাবে পাব?",
    "pharmacy.page.faq_directions_a":
      "এই পাতার উপরের “দিকনির্দেশনা” বোতামটি ব্যবহার করুন। এটি নতুন ট্যাবে গুগল ম্যাপ খুলে তালিকাভুক্ত অবস্থানটিকে গন্তব্য হিসেবে দেখায়।",
    "pharmacy.page.faq_prices_q": "এই পাতায় কি ওষুধের মূল্য বা মজুদের তথ্য আছে?",
    "pharmacy.page.faq_prices_none": "না। এই ফার্মেসির ওষুধের মূল্য ও মজুদের তথ্য পাওয়া যায়নি। জানতে ফার্মেসিতে ফোন করুন।",
    "pharmacy.page.faq_prices_sample":
      "শুধু নমুনা মূল্য দেখানো হয়েছে। এগুলো প্রদর্শনের জন্য তৈরি তথ্য, বর্তমান মূল্য বা মজুদ নয়। নিশ্চিত হতে ফার্মেসিতে ফোন করুন।",
    "pharmacy.page.faq_verified_q": "{name} সম্পর্কিত তথ্য কি যাচাই করা?",
    "pharmacy.page.faq_verified_no":
      "না। এই তালিকাটি কমিউনিটি-ম্যাপ করা ওপেনস্ট্রিটম্যাপ (OpenStreetMap) তথ্য থেকে নেওয়া, যা আমরা আলাদাভাবে যাচাই করিনি। খোলার সময় ও যোগাযোগের তথ্য পুরোনো হতে পারে, তাই যাওয়ার আগে ফোন করে নিন।",
    "pharmacy.page.faq_verified_other": "এই তালিকাটি “{label}” হিসেবে চিহ্নিত। এটি কোথা থেকে নেওয়া, তা জানতে নিচের উৎস ও যাচাই অংশ দেখুন।",
    "pharmacy.page.next_nearby": "কাছের ফার্মেসি খুঁজুন",
    "pharmacy.page.next_hospital": "কাছের হাসপাতাল খুঁজুন",
    "pharmacy.page.next_search": "ওষুধ খুঁজুন",

    "pharmacy.trust.registered": "সরকারি নিবন্ধন",
    "pharmacy.trust.unverified": "কমিউনিটি-ম্যাপ করা",
    "pharmacy.trust.needs_review": "পর্যালোচনা প্রয়োজন",
    "pharmacy.trust.verified": "উৎস যাচাই করা",
    "pharmacy.trust.user_reported": "ব্যবহারকারীর দেওয়া তথ্য",

    "pharmacy.list.notice":
      "এই ফার্মেসিগুলোর ওষুধের মূল্য ও মজুদের তথ্য এখনো পাওয়া যায়নি। এই তালিকা শুধু ফার্মেসিগুলো কোথায় আছে তা দেখায়, তারা কী বিক্রি করে বা কত দাম নেয় তা নয়।",
    "pharmacy.list.name_label": "ফার্মেসির নাম",
    "pharmacy.list.name_placeholder": "ফার্মেসির নাম দিয়ে খুঁজুন",
    "pharmacy.list.results": "ফলাফল",
    "pharmacy.list.list_label": "ফার্মেসি",
    "pharmacy.list.noun": "ফার্মেসি",
    "pharmacy.list.noun_one": "ফার্মেসি",

    "pharmacy.seo.home": "হোম",
    "pharmacy.seo.pharmacies": "ফার্মেসি",
    "pharmacy.seo.division": "{name} বিভাগ",
    "pharmacy.seo.suffix_long": " — অবস্থান ও যোগাযোগ",
    "pharmacy.seo.suffix_short": " — ফার্মেসি",
    "pharmacy.seo.intro": "{name} একটি ফার্মেসি।",
    "pharmacy.seo.intro_place": "{name} {place}-এ অবস্থিত একটি ফার্মেসি।",
    "pharmacy.seo.item_address": "ঠিকানা",
    "pharmacy.seo.item_phone": "ফোন নম্বর",
    "pharmacy.seo.item_hours": "খোলার সময়",
    "pharmacy.seo.item_directions": "দিকনির্দেশনা",
    "pharmacy.seo.lists": "প্রকাশিত থাকলে {items} দেওয়া আছে।",
    "pharmacy.seo.price_sample": "নমুনা মূল্য প্রদর্শনের জন্য তৈরি তথ্য, বর্তমান মূল্য নয়।",
    "pharmacy.seo.price_none": "ওষুধের মূল্য ও মজুদের তথ্য এখনো পাওয়া যায়নি।",
    "pharmacy.seo.caveat": "কমিউনিটি-ম্যাপ করা তথ্য, যা পুরোনো হতে পারে; যাওয়ার আগে ফোন করে নিন।",
    "pharmacy.seo.list_title": "{scope}-এর ফার্মেসি",
    "pharmacy.seo.list_title_national": "বাংলাদেশের ফার্মেসি",
    "pharmacy.seo.list_desc_empty": "{scope}-এর ফার্মেসি। এখনো কোনো তালিকা পাওয়া যায়নি।",
    "pharmacy.seo.list_desc_empty_national": "বাংলাদেশের ফার্মেসি। এখনো কোনো তালিকা পাওয়া যায়নি।",
    "pharmacy.seo.list_desc":
      "{scope}-এর {count}টি ফার্মেসি, প্রকাশিত থাকলে ঠিকানা, ফোন নম্বর ও দিকনির্দেশনাসহ। ওষুধের মূল্য ও মজুদের তথ্য এখনো পাওয়া যায়নি। {caveat}",
    "pharmacy.seo.list_desc_national":
      "বাংলাদেশের {count}টি ফার্মেসি, প্রকাশিত থাকলে ঠিকানা, ফোন নম্বর ও দিকনির্দেশনাসহ। ওষুধের মূল্য ও মজুদের তথ্য এখনো পাওয়া যায়নি। {caveat}",
    "pharmacy.seo.list_caveat":
      "তালিকাগুলো কমিউনিটি-ম্যাপ করা ওপেনস্ট্রিটম্যাপ (OpenStreetMap) তথ্য থেকে নেওয়া এবং যাচাই করা হয়নি, তাই যাওয়ার আগে ফোন করে নিন।",
  },
});
