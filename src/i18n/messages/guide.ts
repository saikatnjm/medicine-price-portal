import { defineMessages } from "../define";

/** Guides and emergency page copy. Keys are prefixed "guide.". */
export const guide = defineMessages({
  en: {
    "guide.crumb.home": "Home",
    "guide.crumb.guides": "Guides",
    "guide.index.title": "Guides: medicines, DGDA registration and healthcare",
    "guide.index.h1": "Guides",
    "guide.index.description":
      "Plain-language guides to medicine labels, DGDA registration, hospitals, pharmacies and emergency numbers in Bangladesh. No medical advice.",
    "guide.index.intro":
      "Short, plain-language explainers on reading medicine labels, checking DGDA registration and finding healthcare in Bangladesh. They explain words and records, not treatment: for health questions, ask a registered doctor or pharmacist.",
    "guide.index.count": "{n} guides",
    "guide.category.registration": "DGDA registration",
    "guide.category.registration.desc": "What DGDA is, how registration numbers work and how to report a suspected fake medicine.",
    "guide.category.medicines": "Reading medicine names and labels",
    "guide.category.medicines.desc": "Generic and brand names, strengths, dosage forms and what the words on a pack mean.",
    "guide.category.healthcare": "Finding healthcare",
    "guide.category.healthcare.desc": "Hospitals, pharmacies, departments and the national emergency number.",
    "guide.category.using-the-site": "Using this site",
    "guide.category.using-the-site.desc": "How search works and where our hospital and pharmacy listings come from.",
    "guide.page.lastReviewed": "Last reviewed {date}",
    "guide.page.sources": "Sources",
    "guide.page.related": "Related guides",
    "guide.page.allGuides": "All guides",
    "guide.page.specialtiesLabel": "Department pages on this site",
    "guide.page.disclaimer":
      "This guide is general information only and is not medical advice. It does not tell you what any medicine is for or how to take it. For questions about your health or your medicines, ask a registered doctor or pharmacist.",
    "guide.notFound.title": "Guide not found",
    "guide.emergency.title": "Emergency hospitals in Bangladesh: call 999",
    "guide.emergency.h1": "Emergency hospitals in Bangladesh",
    "guide.emergency.description":
      "Call 999, Bangladesh's toll-free national emergency number. Hospitals whose OpenStreetMap data lists emergency services, grouped by division.",
    "guide.emergency.crumb": "Emergency",
    "guide.emergency.callHeading": "In an emergency, call 999",
    "guide.emergency.callText":
      "999 is Bangladesh's toll-free national emergency helpline for police, fire service and ambulance.",
    "guide.emergency.callButton": "Call 999",
    "guide.emergency.callSource": "Sources:",
    "guide.emergency.sourceDailyStar": "The Daily Star",
    "guide.emergency.sourceDhakaTribune": "Dhaka Tribune",
    "guide.emergency.noticeHeading": "Unverified OpenStreetMap data: call before you go",
    "guide.emergency.notice":
      "The facilities below are listed because their OpenStreetMap data says they offer emergency services. This information is community-mapped and has not been verified by us or by the facility. Services, hours and contact details may be out of date. Call the facility before you travel if you can.",
    "guide.emergency.listHeading": "Facilities listing emergency services",
    "guide.emergency.listIntro": "{n} facilities in OpenStreetMap data state that they provide emergency services.",
    "guide.emergency.divisionCount": "{n} listed",
    "guide.emergency.seeDivision": "Emergency-listed facilities in {name}",
    "guide.emergency.unknownDivision": "Division not recorded",
    "guide.emergency.empty":
      "No facility in the current data states that it offers emergency services. Browse all hospitals and clinics instead.",
    "guide.emergency.browseAll": "Browse all hospitals and clinics",
    "guide.emergency.guideLink": "Read the guide: 999, the national emergency number",
  },
  bn: {
    "guide.crumb.home": "হোম",
    "guide.crumb.guides": "গাইড",
    "guide.index.title": "গাইড: ওষুধ, DGDA নিবন্ধন ও স্বাস্থ্যসেবা",
    "guide.index.h1": "গাইড",
    "guide.index.description":
      "ওষুধের লেবেল, DGDA নিবন্ধন, হাসপাতাল, ফার্মেসি ও জরুরি নম্বর নিয়ে সহজ ভাষার গাইড। এগুলো চিকিৎসা পরামর্শ নয়।",
    "guide.index.intro":
      "ওষুধের লেবেল পড়া, DGDA নিবন্ধন যাচাই এবং বাংলাদেশে স্বাস্থ্যসেবা খোঁজা নিয়ে ছোট ও সহজ ব্যাখ্যা। এখানে শব্দ ও তথ্যের মানে বোঝানো হয়েছে, চিকিৎসা নয়: স্বাস্থ্য নিয়ে প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
    "guide.index.count": "{n}টি গাইড",
    "guide.category.registration": "DGDA নিবন্ধন",
    "guide.category.registration.desc": "DGDA কী, নিবন্ধন নম্বর কীভাবে কাজ করে এবং নকল সন্দেহ হলে কীভাবে জানাবেন।",
    "guide.category.medicines": "ওষুধের নাম ও লেবেল পড়া",
    "guide.category.medicines.desc": "জেনেরিক ও ব্র্যান্ড নাম, শক্তি, ডোজ ফর্ম এবং প্যাকেটের লেখার অর্থ।",
    "guide.category.healthcare": "স্বাস্থ্যসেবা খোঁজা",
    "guide.category.healthcare.desc": "হাসপাতাল, ফার্মেসি, বিশেষজ্ঞ বিভাগ এবং জাতীয় জরুরি নম্বর।",
    "guide.category.using-the-site": "এই সাইট ব্যবহার",
    "guide.category.using-the-site.desc": "অনুসন্ধান কীভাবে কাজ করে এবং হাসপাতাল ও ফার্মেসির তালিকা কোথা থেকে আসে।",
    "guide.page.lastReviewed": "সর্বশেষ পর্যালোচনা: {date}",
    "guide.page.sources": "তথ্যসূত্র",
    "guide.page.related": "সম্পর্কিত গাইড",
    "guide.page.allGuides": "সব গাইড",
    "guide.page.specialtiesLabel": "এই সাইটে বিশেষজ্ঞ বিভাগের পাতা",
    "guide.page.disclaimer":
      "এই গাইড শুধু সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। কোনো ওষুধ কীসের জন্য বা কীভাবে খেতে হয়, তা এখানে বলা হয় না। আপনার স্বাস্থ্য বা ওষুধ নিয়ে প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
    "guide.notFound.title": "গাইড পাওয়া যায়নি",
    "guide.emergency.title": "বাংলাদেশের জরুরি হাসপাতাল: 999-এ কল করুন",
    "guide.emergency.h1": "বাংলাদেশের জরুরি সেবার হাসপাতাল",
    "guide.emergency.description":
      "জরুরি প্রয়োজনে 999-এ কল করুন, এটি টোল-ফ্রি জাতীয় জরুরি নম্বর। OpenStreetMap তথ্যে জরুরি সেবা থাকা হাসপাতাল, বিভাগ অনুযায়ী।",
    "guide.emergency.crumb": "জরুরি",
    "guide.emergency.callHeading": "জরুরি অবস্থায় 999-এ কল করুন",
    "guide.emergency.callText":
      "999 হলো পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জন্য বাংলাদেশের টোল-ফ্রি জাতীয় জরুরি হেল্পলাইন।",
    "guide.emergency.callButton": "999-এ কল করুন",
    "guide.emergency.callSource": "তথ্যসূত্র:",
    "guide.emergency.sourceDailyStar": "The Daily Star",
    "guide.emergency.sourceDhakaTribune": "Dhaka Tribune",
    "guide.emergency.noticeHeading": "OpenStreetMap-এর যাচাই করা হয়নি এমন তথ্য: যাওয়ার আগে ফোন করুন",
    "guide.emergency.notice":
      "নিচের প্রতিষ্ঠানগুলো তালিকায় আছে কারণ OpenStreetMap তথ্যে বলা আছে যে সেগুলোতে জরুরি সেবা আছে। এই তথ্য কমিউনিটি-ম্যাপ করা; আমরা বা প্রতিষ্ঠানটি তা যাচাই করিনি। সেবা, সময় ও যোগাযোগের তথ্য পুরোনো হতে পারে। সম্ভব হলে রওনা দেওয়ার আগে প্রতিষ্ঠানে ফোন করে নিন।",
    "guide.emergency.listHeading": "জরুরি সেবা তালিকাভুক্ত প্রতিষ্ঠান",
    "guide.emergency.listIntro": "OpenStreetMap তথ্যে {n}টি প্রতিষ্ঠান জরুরি সেবা দেয় বলে উল্লেখ আছে।",
    "guide.emergency.divisionCount": "{n}টি তালিকাভুক্ত",
    "guide.emergency.seeDivision": "{name}-এ জরুরি সেবা তালিকাভুক্ত প্রতিষ্ঠান",
    "guide.emergency.unknownDivision": "বিভাগ উল্লেখ নেই",
    "guide.emergency.empty":
      "বর্তমান তথ্যে কোনো প্রতিষ্ঠান জরুরি সেবা দেয় বলে উল্লেখ নেই। এর বদলে সব হাসপাতাল ও ক্লিনিক দেখুন।",
    "guide.emergency.browseAll": "সব হাসপাতাল ও ক্লিনিক দেখুন",
    "guide.emergency.guideLink": "গাইড পড়ুন: 999, জাতীয় জরুরি নম্বর",
  },
});
