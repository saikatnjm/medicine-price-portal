import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const pharmaceuticalCompaniesInBangladesh: Guide = {
  slug: "pharmaceutical-companies-in-bangladesh",
  category: "registration",
  updatedAt: "2026-11-04",
  sources: [
    {
      label: "DGHS: DGDA drug registry code system",
      url: "https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html",
    },
  ],
  content: {
    en: {
      title: "Pharmaceutical companies in Bangladesh (DGDA registry list)",
      description:
        "The DGDA registry snapshot on this site lists 276 manufacturers. See which have the most registered products and how to view each company's full list.",
      summary:
        "Every medicine in the DGDA registry is linked to the company that makes it. This guide explains what the registry says about manufacturers, which companies have the most registered products in our snapshot, and how to browse each company's full product list.",
      body: [
        { type: "h2", text: "Where the company list comes from" },
        {
          type: "p",
          text: "The Directorate General of Health Services (DGHS) publishes the national DGDA drug registry and states that the data is owned by the Directorate General of Drug Administration (DGDA). Each registered product in it is linked to a manufacturer. The company pages on this site are built by grouping the products in a dated snapshot of that registry by manufacturer.",
        },
        {
          type: "p",
          text: "In the DGDA registry snapshot used on this site there are 276 manufacturers, together making 36,328 registered products across 1,520 generics.",
        },
        { type: "h2", text: "Companies with the most registered products" },
        {
          type: "p",
          text: "In the DGDA registry snapshot used on this site, these five companies have the most registered products:",
        },
        {
          type: "ol",
          items: [
            "Incepta Pharmaceuticals Ltd.: 1,562 products",
            "Square Pharmaceuticals PLC: 1,413 products",
            "Opsonin Pharma Limited: 1,260 products",
            "Drug International Ltd.: 1,190 products",
            "Beximco Pharmaceuticals Ltd.: 1,012 products",
          ],
        },
        {
          type: "p",
          text: "These figures count registry entries, not sales, market share or quality. One brand can have several entries, for example one for each strength and dosage form, so a company with many entries does not necessarily sell more medicine. The ranking is a description of the registry, not a recommendation.",
        },
        { type: "link", href: routes.companies(), label: "Browse all pharmaceutical companies in the registry" },
        { type: "h2", text: "What a company page shows" },
        {
          type: "ul",
          items: [
            "The company's name as recorded in the registry.",
            "Every product registered under that name in our snapshot, with brand name, generic, strength and dosage form.",
            "Links to each product's page, where you can see its DAR number.",
          ],
        },
        {
          type: "p",
          text: "Some companies appear in the registry under more than one name, for example separate units or subsidiaries. Each registered name has its own entry, so a group of related companies can appear as several separate rows.",
        },
        { type: "link", href: routes.company("square-pharmaceuticals-plc"), label: "Example: Square Pharmaceuticals PLC product list" },
        { type: "h2", text: "What the list does not include" },
        {
          type: "ul",
          items: [
            "Prices: none have been verified, so none are shown.",
            "Contact details, factory addresses or ratings of companies.",
            "Any judgement about which company's products are better.",
            "Products registered, changed or cancelled after the snapshot date.",
          ],
        },
        {
          type: "p",
          text: "Many companies make brands of the same generic. If you want to understand why one active ingredient can have hundreds of brands, see our separate guide.",
        },
        { type: "link", href: routes.guide("why-one-generic-has-many-brands"), label: "Why one generic has hundreds of brands in Bangladesh" },
        {
          type: "note",
          text: "A company's name on a pack does not tell you whether a medicine is right for you. Ask a registered doctor or pharmacist before starting, stopping or changing any medicine.",
        },
      ],
      faq: [
        {
          q: "How many pharmaceutical companies are in the DGDA registry?",
          a: "In the DGDA registry snapshot used on this site there are 276 manufacturers.",
        },
        {
          q: "Which company has the most registered products?",
          a: "In our snapshot, Incepta Pharmaceuticals Ltd. has the most, with 1,562 registered products, followed by Square Pharmaceuticals PLC with 1,413.",
        },
        {
          q: "Does more registered products mean a bigger or better company?",
          a: "No. The count is the number of registry entries. It does not measure sales, size or quality.",
        },
        {
          q: "Can I see a full list of one company's medicines?",
          a: "Yes. Open the companies page and choose a company to see every product registered under its name in our snapshot.",
        },
      ],
    },
    bn: {
      title: "বাংলাদেশের ঔষধ কোম্পানির তালিকা",
      description:
        "এই সাইটের DGDA রেজিস্ট্রি স্ন্যাপশটে 276টি প্রস্তুতকারক আছে। কোন কোম্পানির নিবন্ধিত পণ্য সবচেয়ে বেশি এবং প্রতিটির পূর্ণ তালিকা কোথায় দেখবেন।",
      summary:
        "DGDA রেজিস্ট্রির প্রতিটি ওষুধ তার প্রস্তুতকারক কোম্পানির সঙ্গে যুক্ত। রেজিস্ট্রিতে প্রস্তুতকারক সম্পর্কে কী থাকে, আমাদের স্ন্যাপশটে কোন কোম্পানির নিবন্ধিত পণ্য সবচেয়ে বেশি এবং প্রতিটি কোম্পানির পূর্ণ পণ্য তালিকা কীভাবে দেখবেন, তা এই গাইডে বলা হয়েছে।",
      body: [
        { type: "h2", text: "কোম্পানির তালিকা কোথা থেকে আসে" },
        {
          type: "p",
          text: "স্বাস্থ্য অধিদপ্তর (DGHS) জাতীয় DGDA ওষুধ রেজিস্ট্রি প্রকাশ করে এবং সেখানে বলা আছে, তথ্যের মালিক ঔষধ প্রশাসন অধিদপ্তর (DGDA)। এর প্রতিটি নিবন্ধিত পণ্য একটি প্রস্তুতকারকের সঙ্গে যুক্ত। ওই রেজিস্ট্রির একটি নির্দিষ্ট তারিখের স্ন্যাপশটের পণ্যগুলোকে প্রস্তুতকারক অনুযায়ী সাজিয়ে এই সাইটের কোম্পানির পাতাগুলো তৈরি।",
        },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে 276টি প্রস্তুতকারক আছে, যাদের মোট নিবন্ধিত পণ্য 36,328টি এবং জেনেরিক 1,520টি।",
        },
        { type: "h2", text: "সবচেয়ে বেশি নিবন্ধিত পণ্য যাদের" },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে এই পাঁচটি কোম্পানির নিবন্ধিত পণ্য সবচেয়ে বেশি:",
        },
        {
          type: "ol",
          items: [
            "Incepta Pharmaceuticals Ltd.: 1,562টি পণ্য",
            "Square Pharmaceuticals PLC: 1,413টি পণ্য",
            "Opsonin Pharma Limited: 1,260টি পণ্য",
            "Drug International Ltd.: 1,190টি পণ্য",
            "Beximco Pharmaceuticals Ltd.: 1,012টি পণ্য",
          ],
        },
        {
          type: "p",
          text: "এই সংখ্যাগুলো রেজিস্ট্রির এন্ট্রির হিসাব, বিক্রি, বাজারের অংশ বা মানের নয়। একটি ব্র্যান্ডের একাধিক এন্ট্রি থাকতে পারে, যেমন প্রতিটি শক্তি ও ডোজ ফর্মের জন্য আলাদা একটি। তাই বেশি এন্ট্রি মানেই বেশি বিক্রি নয়। এই ক্রম শুধু রেজিস্ট্রির বর্ণনা, কোনো সুপারিশ নয়।",
        },
        { type: "link", href: routes.companies(), label: "রেজিস্ট্রির সব ওষুধ কোম্পানি দেখুন" },
        { type: "h2", text: "কোম্পানির পাতায় যা থাকে" },
        {
          type: "ul",
          items: [
            "রেজিস্ট্রিতে যেভাবে লেখা আছে, সেভাবে কোম্পানির নাম।",
            "আমাদের স্ন্যাপশটে ওই নামে নিবন্ধিত সব পণ্য, ব্র্যান্ড নাম, জেনেরিক, শক্তি ও ডোজ ফর্মসহ।",
            "প্রতিটি পণ্যের পাতার লিংক, যেখানে তার DAR নম্বর দেখা যায়।",
          ],
        },
        {
          type: "p",
          text: "কিছু কোম্পানি রেজিস্ট্রিতে একাধিক নামে থাকে, যেমন আলাদা ইউনিট বা সহযোগী প্রতিষ্ঠান। প্রতিটি নিবন্ধিত নামের আলাদা এন্ট্রি থাকে, তাই একই গোষ্ঠীর কোম্পানিগুলো তালিকায় কয়েকটি আলাদা সারিতে দেখা যেতে পারে।",
        },
        { type: "link", href: routes.company("square-pharmaceuticals-plc"), label: "উদাহরণ: Square Pharmaceuticals PLC-এর পণ্য তালিকা" },
        { type: "h2", text: "তালিকায় যা নেই" },
        {
          type: "ul",
          items: [
            "দাম: কোনো দাম যাচাই করা হয়নি, তাই দেখানো হয় না।",
            "কোম্পানির যোগাযোগের তথ্য, কারখানার ঠিকানা বা রেটিং।",
            "কোন কোম্পানির পণ্য ভালো, এমন কোনো মূল্যায়ন।",
            "স্ন্যাপশটের তারিখের পরে নিবন্ধিত, পরিবর্তিত বা বাতিল হওয়া পণ্য।",
          ],
        },
        {
          type: "p",
          text: "অনেক কোম্পানি একই জেনেরিকের ব্র্যান্ড তৈরি করে। একটি সক্রিয় উপাদানের কেন শত শত ব্র্যান্ড থাকতে পারে, তা জানতে আমাদের আলাদা গাইডটি দেখুন।",
        },
        { type: "link", href: routes.guide("why-one-generic-has-many-brands"), label: "একটি জেনেরিকের কেন শত শত ব্র্যান্ড" },
        {
          type: "note",
          text: "প্যাকেটে কোম্পানির নাম দেখে বোঝা যায় না কোনো ওষুধ আপনার জন্য ঠিক কিনা। কোনো ওষুধ শুরু, বন্ধ বা পরিবর্তনের আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "DGDA রেজিস্ট্রিতে কতগুলো ওষুধ কোম্পানি আছে?",
          a: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে 276টি প্রস্তুতকারক আছে।",
        },
        {
          q: "কোন কোম্পানির নিবন্ধিত পণ্য সবচেয়ে বেশি?",
          a: "আমাদের স্ন্যাপশটে সবচেয়ে বেশি Incepta Pharmaceuticals Ltd.-এর, 1,562টি নিবন্ধিত পণ্য। এরপর Square Pharmaceuticals PLC, 1,413টি।",
        },
        {
          q: "বেশি নিবন্ধিত পণ্য মানে কি বড় বা ভালো কোম্পানি?",
          a: "না। সংখ্যাটি রেজিস্ট্রির এন্ট্রির হিসাব। এটি বিক্রি, আকার বা মান পরিমাপ করে না।",
        },
        {
          q: "একটি কোম্পানির সব ওষুধের তালিকা কি দেখা যায়?",
          a: "হ্যাঁ। কোম্পানির পাতা খুলে একটি কোম্পানি বেছে নিন; আমাদের স্ন্যাপশটে ওই নামে নিবন্ধিত সব পণ্য দেখতে পাবেন।",
        },
      ],
    },
  },
};
