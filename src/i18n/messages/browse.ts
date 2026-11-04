import { defineMessages } from "../define";

/** Brand A–Z and DAR check page copy. Keys are prefixed "browse.". */
export const browse = defineMessages({
  en: {
    "browse.crumb.home": "Home",
    "browse.crumb.medicines": "Medicines A–Z",
    "browse.crumb.verify": "DGDA registration check",
    "browse.crumb.page": "Page {page}",

    "browse.digits": "0–9",
    "browse.count.one": "{n} product",
    "browse.count.other": "{n} products",
    "browse.note":
      "Registered means the product is listed in the official DGDA registry. It does not confirm that the product is currently sold, and it is not a recommendation. Information only, not medical advice.",

    // A–Z hub
    "browse.hub.title": "All Medicine Names A–Z — Bangladesh Brand List",
    "browse.hub.description":
      "Browse {n} DGDA-registered medicine products in Bangladesh by brand name, A to Z, with strength, dosage form and generic. {g} generics, {c} companies.",
    "browse.hub.heading": "Medicine list A–Z",
    "browse.hub.intro":
      "{n} registered medicine products from {c} pharmaceutical companies, covering {g} generics, listed by brand name.",
    "browse.hub.source": "The list comes from the {source} snapshot retrieved {date}.",
    "browse.hub.lettersHeading": "Browse by first letter",
    "browse.hub.otherHeading": "Other ways to browse",
    "browse.link.generics": "Medicines by generic name",
    "browse.link.companies": "Pharmaceutical companies",
    "browse.link.dosageForms": "Dosage forms",
    "browse.link.verify": "Check a DAR registration number",
    "browse.link.search": "Search medicines",
    "browse.link.az": "Medicine list A–Z",

    // One initial
    "browse.initial.title": "Medicines Starting with {letter} — Brand List",
    "browse.initial.titlePage": "Medicines Starting with {letter} — Brand List (Page {page})",
    "browse.initial.description":
      "{n} DGDA-registered medicine products in Bangladesh whose brand name starts with {letter}, with strength, dosage form and generic name.",
    "browse.initial.descriptionPage":
      "{n} DGDA-registered medicine products in Bangladesh whose brand name starts with {letter}, with strength, dosage form and generic. Page {page} of {total}.",
    "browse.initial.heading": "Medicines starting with {letter}",
    "browse.initial.showing": "Showing {from}–{to} of {n} registered products, sorted by brand name.",
    "browse.initial.listLabel": "Medicines starting with {letter}",
    "browse.letters.label": "Browse by first letter",
    "browse.pagination.label": "Pages of medicines starting with {letter}",
    "browse.pagination.previous": "Previous",
    "browse.pagination.next": "Next",
    "browse.pagination.page": "Page {page}",
    "browse.pagination.pageOf": "Page {page} of {total}",

    // DGDA registration check
    "browse.verify.title": "DGDA Registered Medicine Check — DAR Number Lookup",
    "browse.verify.titleQuery": "Registration check: {query}",
    "browse.verify.description":
      "Check whether a DAR number or brand name is in the DGDA registry of drug products registered in Bangladesh ({n} products, snapshot of {date}).",
    "browse.verify.heading": "Check if a medicine is DGDA registered",
    "browse.verify.intro":
      "Look up a DAR (registration) number or a brand name in the DGDA registry snapshot we use: {n} products, retrieved {date}.",
    "browse.verify.byDar": "Check a DAR number",
    "browse.verify.byName": "Check a brand name",
    "browse.verify.dar.label": "DAR number",
    "browse.verify.dar.hint": "10 digits, for example {example}. Spaces or dashes are fine.",
    "browse.verify.q.label": "Brand name",
    "browse.verify.q.placeholder": "e.g. Napa",
    "browse.verify.submit": "Check",
    "browse.verify.resultHeading": "Result",
    "browse.verify.found": "Found in the DGDA registry snapshot we use (retrieved {date}).",
    "browse.verify.foundDar": "DAR number {dar}",
    "browse.verify.notFound": "{dar} was not found in our snapshot (retrieved {date}).",
    "browse.verify.notProof":
      "This does not prove a medicine is fake: the registration may be newer than our snapshot, written differently, or its number may be withheld in the source.",
    "browse.verify.invalid":
      "“{input}” is not a DAR number we can check. Every DAR number published in our registry snapshot has 10 digits, written like {example}.",
    "browse.verify.packNote":
      "A match only means the registration is listed in our dated copy of the registry. It does not prove that a particular pack is genuine.",
    "browse.verify.dgda":
      "For an official answer, check with the Directorate General of Drug Administration (DGDA): type {domain} into your browser’s address bar.",
    "browse.verify.nameHeading": "Registered products matching “{query}”",
    "browse.verify.nameCount": "{n} matching products. Showing the first {shown}.",
    "browse.verify.nameFallback": "No product matches every word, so these are results for “{query}”.",
    "browse.verify.nameNone": "No product matching “{query}” was found in our snapshot (retrieved {date}).",
    "browse.verify.nameShort": "Enter at least {n} characters of the brand name.",
    "browse.verify.seeAll": "See all {n} results in search",
    "browse.verify.row.dar": "DAR no.",
    "browse.verify.row.noDar": "DAR number withheld (flagged as incomplete or malformed in the source)",
    "browse.verify.row.status": "Registered: in the DGDA registry snapshot of {date}",
    "browse.verify.row.label": "Matching registered products",

    "browse.verify.about.heading": "What is a DAR number?",
    "browse.verify.about.p1":
      "A DAR number is the registration number of a drug product in the DGDA registry of Bangladesh. In the snapshot we use, published DAR numbers have 10 digits in three groups, for example {example} ({product}).",
    "browse.verify.about.p2":
      "The last group of three digits is a product-category code. A product registered at several plants of one company is listed once here, under one of its DAR numbers, so its other numbers are not found.",
    "browse.verify.about.p3":
      "The source flags some DAR numbers as incomplete or malformed. We do not show those numbers, so those products can only be found by brand name.",

    "browse.faq.count.q": "How many medicines are in the registry snapshot?",
    "browse.faq.count.a":
      "{n} human medicine products from {c} companies, covering {g} generics, retrieved {date}. Veterinary products are not included.",
    "browse.faq.fake.q": "Is a medicine fake if it is not found here?",
    "browse.faq.fake.a":
      "Not necessarily. Our copy of the registry is a snapshot from {date}: newer registrations, different spellings and withheld DAR numbers are not found. Check with DGDA ({domain}).",
    "browse.faq.genuine.q": "Does a match prove that the medicine I bought is genuine?",
    "browse.faq.genuine.a":
      "No. A match shows only that the registration number or brand name is listed in the registry snapshot. It cannot check a physical pack.",
    "browse.faq.source.q": "Where does this data come from?",
    "browse.faq.source.a": "From the {source} published by the {publisher}, retrieved {date}.",
  },
  bn: {
    "browse.crumb.home": "হোম",
    "browse.crumb.medicines": "ওষুধ A–Z",
    "browse.crumb.verify": "ডিজিডিএ নিবন্ধন যাচাই",
    "browse.crumb.page": "পৃষ্ঠা {page}",

    "browse.digits": "0–9",
    "browse.count.one": "{n}টি পণ্য",
    "browse.count.other": "{n}টি পণ্য",
    "browse.note":
      "নিবন্ধিত মানে পণ্যটি ডিজিডিএ-র সরকারি নিবন্ধন তালিকায় আছে। এটি পণ্যটি বর্তমানে বিক্রি হচ্ছে কি না তা নিশ্চিত করে না, এবং এটি কোনো সুপারিশ নয়। শুধু তথ্যের জন্য, চিকিৎসা পরামর্শ নয়।",

    "browse.hub.title": "সব ওষুধের নাম A–Z — বাংলাদেশের ব্র্যান্ড তালিকা",
    "browse.hub.description":
      "বাংলাদেশে ডিজিডিএ-নিবন্ধিত {n}টি ওষুধ পণ্য ব্র্যান্ড নাম অনুযায়ী A থেকে Z, শক্তি, ডোজের ধরন ও জেনেরিকসহ দেখুন। {g}টি জেনেরিক, {c}টি কোম্পানি।",
    "browse.hub.heading": "ওষুধের তালিকা A–Z",
    "browse.hub.intro":
      "{c}টি ওষুধ কোম্পানির {n}টি নিবন্ধিত ওষুধ পণ্য, {g}টি জেনেরিক, ব্র্যান্ড নাম অনুযায়ী সাজানো।",
    "browse.hub.source": "তালিকাটি {source}-এর {date} তারিখে সংগ্রহ করা কপি থেকে নেওয়া।",
    "browse.hub.lettersHeading": "প্রথম অক্ষর অনুযায়ী দেখুন",
    "browse.hub.otherHeading": "অন্যভাবে দেখুন",
    "browse.link.generics": "জেনেরিক নাম অনুযায়ী ওষুধ",
    "browse.link.companies": "ওষুধ কোম্পানি",
    "browse.link.dosageForms": "ডোজের ধরন",
    "browse.link.verify": "ডিএআর নিবন্ধন নম্বর যাচাই করুন",
    "browse.link.search": "ওষুধ অনুসন্ধান",
    "browse.link.az": "ওষুধের তালিকা A–Z",

    "browse.initial.title": "{letter} দিয়ে শুরু ওষুধ — ব্র্যান্ড তালিকা",
    "browse.initial.titlePage": "{letter} দিয়ে শুরু ওষুধ — ব্র্যান্ড তালিকা (পৃষ্ঠা {page})",
    "browse.initial.description":
      "বাংলাদেশে ডিজিডিএ-নিবন্ধিত {n}টি ওষুধ পণ্য, যাদের ব্র্যান্ড নাম {letter} দিয়ে শুরু; শক্তি, ডোজের ধরন ও জেনেরিক নামসহ।",
    "browse.initial.descriptionPage":
      "বাংলাদেশে ডিজিডিএ-নিবন্ধিত {n}টি ওষুধ পণ্য, যাদের ব্র্যান্ড নাম {letter} দিয়ে শুরু; শক্তি, ডোজের ধরন ও জেনেরিকসহ। পৃষ্ঠা {page}/{total}।",
    "browse.initial.heading": "{letter} দিয়ে শুরু ওষুধ",
    "browse.initial.showing": "{n}টি নিবন্ধিত পণ্যের মধ্যে {from}–{to} দেখানো হচ্ছে, ব্র্যান্ড নাম অনুযায়ী সাজানো।",
    "browse.initial.listLabel": "{letter} দিয়ে শুরু ওষুধ",
    "browse.letters.label": "প্রথম অক্ষর অনুযায়ী দেখুন",
    "browse.pagination.label": "{letter} দিয়ে শুরু ওষুধের পৃষ্ঠাসমূহ",
    "browse.pagination.previous": "আগের",
    "browse.pagination.next": "পরের",
    "browse.pagination.page": "পৃষ্ঠা {page}",
    "browse.pagination.pageOf": "পৃষ্ঠা {page}/{total}",

    "browse.verify.title": "ডিজিডিএ নিবন্ধিত ওষুধ যাচাই — ডিএআর নম্বর খুঁজুন",
    "browse.verify.titleQuery": "নিবন্ধন যাচাই: {query}",
    "browse.verify.description":
      "কোনো ডিএআর নম্বর বা ব্র্যান্ড নাম বাংলাদেশে নিবন্ধিত ওষুধের ডিজিডিএ তালিকায় আছে কি না যাচাই করুন ({n}টি পণ্য, {date} তারিখের কপি)।",
    "browse.verify.heading": "ওষুধটি ডিজিডিএ নিবন্ধিত কি না যাচাই করুন",
    "browse.verify.intro":
      "আমাদের ব্যবহৃত ডিজিডিএ নিবন্ধন তালিকার কপিতে ডিএআর (নিবন্ধন) নম্বর বা ব্র্যান্ড নাম খুঁজুন: {n}টি পণ্য, সংগ্রহের তারিখ {date}।",
    "browse.verify.byDar": "ডিএআর নম্বর যাচাই",
    "browse.verify.byName": "ব্র্যান্ড নাম যাচাই",
    "browse.verify.dar.label": "ডিএআর নম্বর",
    "browse.verify.dar.hint": "10টি অঙ্ক, যেমন {example}। স্পেস বা ড্যাশ দিলেও চলবে।",
    "browse.verify.q.label": "ব্র্যান্ড নাম",
    "browse.verify.q.placeholder": "যেমন Napa",
    "browse.verify.submit": "যাচাই করুন",
    "browse.verify.resultHeading": "ফলাফল",
    "browse.verify.found": "আমাদের ব্যবহৃত ডিজিডিএ নিবন্ধন তালিকার কপিতে পাওয়া গেছে (সংগ্রহের তারিখ {date})।",
    "browse.verify.foundDar": "ডিএআর নম্বর {dar}",
    "browse.verify.notFound": "{dar} আমাদের কপিতে পাওয়া যায়নি (সংগ্রহের তারিখ {date})।",
    "browse.verify.notProof":
      "এর মানে এই নয় যে ওষুধটি নকল: নিবন্ধনটি আমাদের কপির চেয়ে নতুন হতে পারে, ভিন্নভাবে লেখা থাকতে পারে, অথবা উৎসে নম্বরটি প্রকাশ করা না-ও থাকতে পারে।",
    "browse.verify.invalid":
      "“{input}” এমন কোনো ডিএআর নম্বর নয় যা আমরা যাচাই করতে পারি। আমাদের কপিতে প্রকাশিত প্রতিটি ডিএআর নম্বরে 10টি অঙ্ক থাকে, যেমন {example}।",
    "browse.verify.packNote":
      "মিল পাওয়া মানে শুধু নিবন্ধনটি আমাদের নির্দিষ্ট তারিখের নিবন্ধন তালিকার কপিতে আছে। এটি কোনো নির্দিষ্ট প্যাক আসল কি না তা প্রমাণ করে না।",
    "browse.verify.dgda":
      "সরকারি উত্তরের জন্য ঔষধ প্রশাসন অধিদপ্তরের (ডিজিডিএ) সঙ্গে যোগাযোগ করুন: ব্রাউজারের ঠিকানা বারে {domain} লিখুন।",
    "browse.verify.nameHeading": "“{query}”-এর সঙ্গে মেলে এমন নিবন্ধিত পণ্য",
    "browse.verify.nameCount": "{n}টি পণ্য মিলেছে। প্রথম {shown}টি দেখানো হচ্ছে।",
    "browse.verify.nameFallback": "সব শব্দের সঙ্গে কোনো পণ্য মেলেনি, তাই “{query}”-এর ফলাফল দেখানো হচ্ছে।",
    "browse.verify.nameNone": "“{query}”-এর সঙ্গে মেলে এমন কোনো পণ্য আমাদের কপিতে পাওয়া যায়নি (সংগ্রহের তারিখ {date})।",
    "browse.verify.nameShort": "ব্র্যান্ড নামের অন্তত {n}টি অক্ষর লিখুন।",
    "browse.verify.seeAll": "অনুসন্ধানে সব {n}টি ফলাফল দেখুন",
    "browse.verify.row.dar": "ডিএআর নম্বর",
    "browse.verify.row.noDar": "ডিএআর নম্বর প্রকাশ করা হয়নি (উৎসে অসম্পূর্ণ বা ত্রুটিপূর্ণ হিসেবে চিহ্নিত)",
    "browse.verify.row.status": "নিবন্ধিত: {date} তারিখের ডিজিডিএ নিবন্ধন তালিকার কপিতে আছে",
    "browse.verify.row.label": "মিলে যাওয়া নিবন্ধিত পণ্য",

    "browse.verify.about.heading": "ডিএআর নম্বর কী?",
    "browse.verify.about.p1":
      "ডিএআর নম্বর হলো বাংলাদেশের ডিজিডিএ নিবন্ধন তালিকায় একটি ওষুধ পণ্যের নিবন্ধন নম্বর। আমাদের ব্যবহৃত কপিতে প্রকাশিত ডিএআর নম্বরে তিন ভাগে 10টি অঙ্ক থাকে, যেমন {example} ({product})।",
    "browse.verify.about.p2":
      "শেষের তিন অঙ্কের ভাগটি পণ্যের শ্রেণির কোড। একই কোম্পানির একাধিক কারখানায় নিবন্ধিত একই পণ্য এখানে একবারই, একটি ডিএআর নম্বরসহ দেখানো হয়; তাই এর অন্য নম্বরগুলো পাওয়া যায় না।",
    "browse.verify.about.p3":
      "উৎসে কিছু ডিএআর নম্বর অসম্পূর্ণ বা ত্রুটিপূর্ণ হিসেবে চিহ্নিত। আমরা সেই নম্বরগুলো দেখাই না, তাই সেই পণ্যগুলো শুধু ব্র্যান্ড নাম দিয়ে খুঁজে পাওয়া যায়।",

    "browse.faq.count.q": "নিবন্ধন তালিকার কপিতে কতগুলো ওষুধ আছে?",
    "browse.faq.count.a":
      "{c}টি কোম্পানির {n}টি মানুষের ওষুধ পণ্য, {g}টি জেনেরিক, সংগ্রহের তারিখ {date}। পশুর ওষুধ অন্তর্ভুক্ত নয়।",
    "browse.faq.fake.q": "এখানে না পাওয়া গেলে কি ওষুধটি নকল?",
    "browse.faq.fake.a":
      "নিশ্চিতভাবে বলা যায় না। আমাদের নিবন্ধন তালিকার কপিটি {date} তারিখের: নতুন নিবন্ধন, ভিন্ন বানান এবং প্রকাশ না করা ডিএআর নম্বর এখানে পাওয়া যায় না। ডিজিডিএ-র সঙ্গে যাচাই করুন ({domain})।",
    "browse.faq.genuine.q": "মিল পাওয়া গেলে কি প্রমাণ হয় যে আমার কেনা ওষুধটি আসল?",
    "browse.faq.genuine.a":
      "না। মিল শুধু দেখায় যে নিবন্ধন নম্বর বা ব্র্যান্ড নামটি নিবন্ধন তালিকার কপিতে আছে। এটি কোনো প্যাক হাতে নিয়ে যাচাই করতে পারে না।",
    "browse.faq.source.q": "এই তথ্য কোথা থেকে নেওয়া?",
    "browse.faq.source.a": "{publisher} প্রকাশিত {source} থেকে, সংগ্রহের তারিখ {date}।",
  },
});
