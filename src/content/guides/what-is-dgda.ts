import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const whatIsDgda: Guide = {
  slug: "what-is-dgda",
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
      title: "What is DGDA (Directorate General of Drug Administration)?",
      description:
        "DGDA is Bangladesh's drug regulator and owner of the national medicine registry. What it is, what the registry holds and how this site uses it.",
      summary:
        "The Directorate General of Drug Administration (DGDA) is the government body behind Bangladesh's medicine registry. This guide explains what that registry is and how the medicine pages on this site relate to it.",
      body: [
        { type: "h2", text: "DGDA in one paragraph" },
        {
          type: "p",
          text: "DGDA stands for the Directorate General of Drug Administration, the drug regulator of Bangladesh. In Bangla it is called ঔষধ প্রশাসন অধিদপ্তর. DGDA keeps the registry of medicine products registered in Bangladesh, and each registered product has its own registration number, usually called the DAR number. The official DGDA website is dgda.gov.bd.",
        },
        { type: "h2", text: "The national drug registry" },
        {
          type: "p",
          text: "The Directorate General of Health Services (DGHS) publishes a national code system called the DGDA drug registry. It states that the data is owned by DGDA. Every entry in it is one registered product, and its identifier combines the DAR number with the trade (brand) name. The example given in the published code system is \"353-0026-039--marvelous-fe\".",
        },
        {
          type: "p",
          text: "For each product, a registry entry typically records information such as:",
        },
        {
          type: "ul",
          items: [
            "the brand (trade) name printed on the pack",
            "the generic name, meaning the active ingredient or ingredients",
            "the strength, for example 500 mg",
            "the dosage form, for example tablet, capsule or syrup",
            "the manufacturer (the pharmaceutical company)",
            "the DAR registration number",
          ],
        },
        { type: "h2", text: "How this site uses the DGDA registry" },
        {
          type: "p",
          text: "The medicine pages on this site are built from a dated snapshot of that registry. In the DGDA registry snapshot used on this site there are 36,328 products, 1,520 generics and 276 manufacturers. We do not add, invent or edit medicines: if a product is not in the snapshot, it does not appear here.",
        },
        {
          type: "ul",
          items: [
            "We show registry facts only: brand, generic, strength, form, manufacturer and DAR number.",
            "We do not show prices, because none have been verified.",
            "We do not say what a medicine is used for or how to take it. That is for a registered doctor or pharmacist.",
            "A snapshot has a date. A product registered, changed or cancelled after that date may not be reflected yet.",
          ],
        },
        { type: "link", href: routes.verify(), label: "Check a brand name or DAR number in the registry snapshot" },
        { type: "link", href: routes.generics(), label: "Browse all generics in the registry" },
        { type: "link", href: routes.companies(), label: "Browse pharmaceutical companies" },
        { type: "h2", text: "Going to the official source" },
        {
          type: "p",
          text: "For anything official, such as registration status today, notices or complaints, go to DGDA directly. Type dgda.gov.bd into your browser's address bar yourself instead of following links from messages or unknown websites, so you can be sure you are on the government site.",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "How to report a suspected fake or substandard medicine to DGDA" },
        {
          type: "note",
          text: "This guide explains a registry, not medicines. For any question about your health or a medicine, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "What does DGDA stand for?",
          a: "Directorate General of Drug Administration. In Bangla: ঔষধ প্রশাসন অধিদপ্তর.",
        },
        {
          q: "What is DGDA's official website?",
          a: "dgda.gov.bd. Type the address yourself rather than following a link from a message.",
        },
        {
          q: "Is this website run by DGDA?",
          a: "No. This is an independent site that shows a dated snapshot of the DGDA registry. For official information, go to DGDA.",
        },
        {
          q: "Does a medicine being on this site mean it is safe or right for me?",
          a: "No. A registry entry only records that a product was registered. Whether a medicine is right for you is a question for a registered doctor or pharmacist.",
        },
      ],
    },
    bn: {
      title: "ঔষধ প্রশাসন অধিদপ্তর (DGDA) কী?",
      description:
        "DGDA বাংলাদেশের ওষুধ নিয়ন্ত্রক সংস্থা এবং জাতীয় ওষুধ রেজিস্ট্রির মালিক। সংস্থাটি কী, রেজিস্ট্রিতে কী থাকে এবং এই সাইট তা কীভাবে ব্যবহার করে।",
      summary:
        "ঔষধ প্রশাসন অধিদপ্তর (DGDA) হলো বাংলাদেশের ওষুধ রেজিস্ট্রির পেছনের সরকারি সংস্থা। এই গাইডে সেই রেজিস্ট্রি কী এবং এই সাইটের ওষুধের পাতাগুলোর সঙ্গে এর সম্পর্ক কী, তা বোঝানো হয়েছে।",
      body: [
        { type: "h2", text: "এক কথায় DGDA" },
        {
          type: "p",
          text: "DGDA-র পুরো নাম Directorate General of Drug Administration, বাংলায় ঔষধ প্রশাসন অধিদপ্তর। এটি বাংলাদেশের ওষুধ নিয়ন্ত্রক সংস্থা। বাংলাদেশে নিবন্ধিত ওষুধ পণ্যের রেজিস্ট্রি DGDA রাখে, এবং প্রতিটি নিবন্ধিত পণ্যের একটি আলাদা নিবন্ধন নম্বর থাকে, যাকে সাধারণত DAR নম্বর বলা হয়। DGDA-র অফিসিয়াল ওয়েবসাইট dgda.gov.bd।",
        },
        { type: "h2", text: "জাতীয় ওষুধ রেজিস্ট্রি" },
        {
          type: "p",
          text: "স্বাস্থ্য অধিদপ্তর (DGHS) \"DGDA drug registry\" নামে একটি জাতীয় কোড সিস্টেম প্রকাশ করে। সেখানে বলা আছে, এই তথ্যের মালিক DGDA। এর প্রতিটি এন্ট্রি একটি নিবন্ধিত পণ্য, আর এন্ট্রির পরিচয় নম্বরে DAR নম্বর ও ব্র্যান্ড নাম একসঙ্গে থাকে। প্রকাশিত কোড সিস্টেমে উদাহরণ হিসেবে দেওয়া আছে \"353-0026-039--marvelous-fe\"।",
        },
        { type: "p", text: "প্রতিটি পণ্যের জন্য রেজিস্ট্রি এন্ট্রিতে সাধারণত এ ধরনের তথ্য থাকে:" },
        {
          type: "ul",
          items: [
            "প্যাকেটে ছাপা ব্র্যান্ড নাম",
            "জেনেরিক নাম, অর্থাৎ সক্রিয় উপাদান বা উপাদানগুলো",
            "শক্তি (স্ট্রেংথ), যেমন 500 mg",
            "ডোজ ফর্ম, যেমন ট্যাবলেট, ক্যাপসুল বা সিরাপ",
            "প্রস্তুতকারক ওষুধ কোম্পানি",
            "DAR নিবন্ধন নম্বর",
          ],
        },
        { type: "h2", text: "এই সাইট DGDA রেজিস্ট্রি কীভাবে ব্যবহার করে" },
        {
          type: "p",
          text: "এই সাইটের ওষুধের পাতাগুলো ওই রেজিস্ট্রির একটি নির্দিষ্ট তারিখের কপি (স্ন্যাপশট) থেকে তৈরি। এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে 36,328টি পণ্য, 1,520টি জেনেরিক এবং 276টি প্রস্তুতকারক আছে। আমরা নিজেরা কোনো ওষুধ যোগ, তৈরি বা সম্পাদনা করি না: স্ন্যাপশটে যে পণ্য নেই, তা এখানেও দেখা যাবে না।",
        },
        {
          type: "ul",
          items: [
            "আমরা শুধু রেজিস্ট্রির তথ্য দেখাই: ব্র্যান্ড, জেনেরিক, শক্তি, ফর্ম, প্রস্তুতকারক ও DAR নম্বর।",
            "দাম দেখাই না, কারণ কোনো দাম যাচাই করা হয়নি।",
            "কোনো ওষুধ কীসের জন্য বা কীভাবে খেতে হয়, তা বলি না। সেটি নিবন্ধিত ডাক্তার বা ফার্মাসিস্টের কাজ।",
            "স্ন্যাপশটের একটি তারিখ আছে। ওই তারিখের পরে নিবন্ধিত, পরিবর্তিত বা বাতিল হওয়া পণ্যের তথ্য এখনো এখানে নাও থাকতে পারে।",
          ],
        },
        { type: "link", href: routes.verify(), label: "রেজিস্ট্রি স্ন্যাপশটে ব্র্যান্ড নাম বা DAR নম্বর যাচাই করুন" },
        { type: "link", href: routes.generics(), label: "রেজিস্ট্রির সব জেনেরিক দেখুন" },
        { type: "link", href: routes.companies(), label: "ওষুধ কোম্পানিগুলো দেখুন" },
        { type: "h2", text: "অফিসিয়াল উৎসে যাওয়া" },
        {
          type: "p",
          text: "আজকের নিবন্ধন অবস্থা, নোটিশ বা অভিযোগের মতো যেকোনো অফিসিয়াল বিষয়ে সরাসরি DGDA-র কাছে যান। মেসেজ বা অচেনা ওয়েবসাইটের লিংকে ক্লিক না করে ব্রাউজারের ঠিকানার ঘরে নিজে dgda.gov.bd লিখুন, যাতে নিশ্চিত হতে পারেন যে আপনি সরকারি সাইটেই আছেন।",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন" },
        {
          type: "note",
          text: "এই গাইডে একটি রেজিস্ট্রির কথা বলা হয়েছে, ওষুধ নিয়ে পরামর্শ নয়। আপনার স্বাস্থ্য বা কোনো ওষুধ নিয়ে প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "DGDA-র পুরো নাম কী?",
          a: "Directorate General of Drug Administration, বাংলায় ঔষধ প্রশাসন অধিদপ্তর।",
        },
        {
          q: "DGDA-র অফিসিয়াল ওয়েবসাইট কোনটি?",
          a: "dgda.gov.bd। মেসেজের লিংকে না গিয়ে ঠিকানাটি নিজে লিখে খুলুন।",
        },
        {
          q: "এই ওয়েবসাইট কি DGDA চালায়?",
          a: "না। এটি একটি স্বতন্ত্র সাইট, যেখানে DGDA রেজিস্ট্রির একটি নির্দিষ্ট তারিখের স্ন্যাপশট দেখানো হয়। অফিসিয়াল তথ্যের জন্য DGDA-তে যান।",
        },
        {
          q: "এই সাইটে কোনো ওষুধ থাকলে কি তা নিরাপদ বা আমার জন্য উপযুক্ত?",
          a: "না। রেজিস্ট্রি এন্ট্রি শুধু জানায় যে পণ্যটি নিবন্ধিত হয়েছিল। কোনো ওষুধ আপনার জন্য ঠিক কিনা, সেটি নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
