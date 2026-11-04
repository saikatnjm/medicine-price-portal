import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const findGenericNameOfABrand: Guide = {
  slug: "find-generic-name-of-a-brand",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to find the generic name of any medicine brand",
      description:
        "Find a brand's generic name (active ingredient) from the pack or by searching the DGDA registry snapshot, and avoid mix-ups between similar products.",
      summary:
        "The generic name tells you the active ingredient behind a brand name. You can usually read it on the pack, and you can always look it up in the DGDA registry snapshot on this site. This guide shows both ways and the common mix-ups to watch for.",
      body: [
        { type: "h2", text: "Method 1: read it on the pack" },
        {
          type: "p",
          text: "Most packs print the generic name close to the brand name, in smaller letters, usually together with the strength. For example, a pack might show a large brand name and, below it, \"Paracetamol 500 mg\". If the pack lists two or more ingredients joined by \"+\" or \"and\", the product is a combination and its generic name includes all of them.",
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "How to read a medicine pack" },
        { type: "h2", text: "Method 2: search this site" },
        {
          type: "ol",
          items: [
            "Type the brand name into the search box. You can add the strength, for example \"Napa 500\", to narrow the results.",
            "Pick the result that matches your pack's strength and dosage form (tablet, syrup, and so on).",
            "Open the medicine page. The generic name is shown as its own field, with a link to the generic's page.",
            "Check the manufacturer too. It should match the company printed on your pack.",
          ],
        },
        { type: "link", href: routes.search(), label: "Search medicines by brand name" },
        {
          type: "p",
          text: "If you are unsure of the spelling, browse brands alphabetically instead. The A–Z index lists every brand in the registry snapshot by its first letter.",
        },
        { type: "link", href: routes.medicines(), label: "Browse medicine brands A–Z" },
        { type: "h2", text: "Watch for these mix-ups" },
        {
          type: "ul",
          items: [
            "One brand name, different generics. In the DGDA registry snapshot used on this site, the brand Ace is listed with the generic Paracetamol, and a 65 mg + 500 mg Ace tablet is listed with Caffeine + Paracetamol. Always match the strength and form.",
            "One brand name, more than one company entry. Some brands are registered under related companies, such as separate units of the same group. Check the manufacturer on the pack.",
            "Similar-looking names. Brands that differ by one letter can be completely different medicines.",
            "Suffixes. Letters such as XR, SR or ER after a brand name usually mean a different, extended or sustained release product with its own entry.",
          ],
        },
        { type: "h2", text: "From the generic to all its brands" },
        {
          type: "p",
          text: "Once you know the generic name, its page shows every product with that generic in the registry snapshot, with their different strengths, forms and companies. Paracetamol, for example, has 436 registered products in the snapshot.",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "Example: all registered Paracetamol products" },
        { type: "h2", text: "When the brand is not found" },
        {
          type: "ul",
          items: [
            "Try another spelling or only the first few letters.",
            "Look up the DAR number printed on the pack on the verify page instead.",
            "The product may have been registered after the snapshot date. Check with DGDA at dgda.gov.bd.",
            "Ask a registered pharmacist to read the pack with you.",
          ],
        },
        {
          type: "note",
          text: "Knowing the generic name is for understanding labels, not for choosing or replacing a medicine. Ask a registered doctor or pharmacist before starting, stopping or changing any medicine.",
        },
      ],
      faq: [
        {
          q: "Where is the generic name on a medicine pack?",
          a: "Usually close to the brand name in smaller letters, often together with the strength, such as \"Paracetamol 500 mg\".",
        },
        {
          q: "Can I search by brand name on this site?",
          a: "Yes. Type the brand name, optionally with the strength, into the search box and open the matching medicine page to see its generic name.",
        },
        {
          q: "Why does one brand name show more than one generic?",
          a: "A company can use the same brand name for different products, for example a single-ingredient product and a combination. Match the strength and dosage form on your pack.",
        },
        {
          q: "Does the site tell me what the medicine is used for?",
          a: "No. We show registry facts only. Ask a registered doctor or pharmacist about what a medicine is for.",
        },
      ],
    },
    bn: {
      title: "যেকোনো ব্র্যান্ডের জেনেরিক নাম কীভাবে খুঁজবেন",
      description:
        "প্যাকেট দেখে বা DGDA রেজিস্ট্রি স্ন্যাপশটে খুঁজে কোনো ব্র্যান্ডের জেনেরিক নাম (সক্রিয় উপাদান) জানুন, আর কাছাকাছি পণ্যের মধ্যে গুলিয়ে ফেলা এড়ান।",
      summary:
        "জেনেরিক নাম জানায় একটি ব্র্যান্ডের পেছনের সক্রিয় উপাদান কী। সাধারণত প্যাকেটেই এটি পড়া যায়, আর এই সাইটের DGDA রেজিস্ট্রি স্ন্যাপশটে সবসময় খুঁজে দেখা যায়। দুটো উপায় এবং সাধারণ ভুলগুলো এই গাইডে বলা হয়েছে।",
      body: [
        { type: "h2", text: "প্রথম উপায়: প্যাকেটে পড়ুন" },
        {
          type: "p",
          text: "বেশিরভাগ প্যাকেটে ব্র্যান্ড নামের কাছেই ছোট অক্ষরে জেনেরিক নাম ছাপা থাকে, সাধারণত শক্তিসহ। যেমন, বড় করে ব্র্যান্ড নাম আর তার নিচে \"Paracetamol 500 mg\"। প্যাকেটে দুই বা তার বেশি উপাদান \"+\" বা \"and\" দিয়ে যুক্ত থাকলে পণ্যটি কম্বিনেশন, আর তার জেনেরিক নামে সবগুলো উপাদানই থাকে।",
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "ওষুধের প্যাকেট কীভাবে পড়বেন" },
        { type: "h2", text: "দ্বিতীয় উপায়: এই সাইটে খুঁজুন" },
        {
          type: "ol",
          items: [
            "সার্চ বক্সে ব্র্যান্ড নাম লিখুন। ফলাফল কমাতে সঙ্গে শক্তিও লিখতে পারেন, যেমন \"Napa 500\"।",
            "যে ফলাফলের শক্তি ও ডোজ ফর্ম (ট্যাবলেট, সিরাপ ইত্যাদি) আপনার প্যাকেটের সঙ্গে মেলে, সেটি বেছে নিন।",
            "ওষুধের পাতাটি খুলুন। সেখানে জেনেরিক নাম আলাদা করে দেখানো আছে, সঙ্গে জেনেরিকের পাতার লিংক।",
            "প্রস্তুতকারকও মিলিয়ে নিন। এটি আপনার প্যাকেটে ছাপা কোম্পানির সঙ্গে মিলতে হবে।",
          ],
        },
        { type: "link", href: routes.search(), label: "ব্র্যান্ড নাম দিয়ে ওষুধ খুঁজুন" },
        {
          type: "p",
          text: "বানান নিয়ে নিশ্চিত না হলে বর্ণানুক্রমিক তালিকা দেখুন। A–Z সূচিতে রেজিস্ট্রি স্ন্যাপশটের সব ব্র্যান্ড প্রথম অক্ষর অনুযায়ী সাজানো আছে।",
        },
        { type: "link", href: routes.medicines(), label: "A–Z অনুযায়ী ওষুধের ব্র্যান্ড দেখুন" },
        { type: "h2", text: "যেসব জায়গায় গুলিয়ে যায়" },
        {
          type: "ul",
          items: [
            "এক ব্র্যান্ড নাম, ভিন্ন জেনেরিক। এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে Ace ব্র্যান্ডটি Paracetamol জেনেরিকের সঙ্গে আছে, আবার 65 mg + 500 mg-এর একটি Ace ট্যাবলেট আছে Caffeine + Paracetamol জেনেরিকের সঙ্গে। তাই শক্তি ও ফর্ম সবসময় মিলিয়ে নিন।",
            "এক ব্র্যান্ড নাম, একাধিক কোম্পানির এন্ট্রি। কিছু ব্র্যান্ড একই গোষ্ঠীর আলাদা ইউনিটের মতো সম্পর্কিত কোম্পানির নামে নিবন্ধিত। প্যাকেটে প্রস্তুতকারক দেখে নিন।",
            "দেখতে কাছাকাছি নাম। এক অক্ষরের পার্থক্যের দুটি ব্র্যান্ড সম্পূর্ণ আলাদা ওষুধ হতে পারে।",
            "নামের শেষে অক্ষর। ব্র্যান্ড নামের পরে XR, SR বা ER থাকলে সাধারণত সেটি আলাদা একটি এক্সটেন্ডেড বা সাসটেইনড রিলিজ পণ্য, যার নিজস্ব এন্ট্রি আছে।",
          ],
        },
        { type: "h2", text: "জেনেরিক থেকে তার সব ব্র্যান্ড" },
        {
          type: "p",
          text: "জেনেরিক নাম জানা হয়ে গেলে তার পাতায় রেজিস্ট্রি স্ন্যাপশটে ওই জেনেরিকের সব পণ্য দেখতে পাবেন, সঙ্গে তাদের বিভিন্ন শক্তি, ফর্ম ও কোম্পানি। যেমন, স্ন্যাপশটে Paracetamol-এর নিবন্ধিত পণ্য 436টি।",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "উদাহরণ: Paracetamol-এর সব নিবন্ধিত পণ্য" },
        { type: "h2", text: "ব্র্যান্ড খুঁজে না পেলে" },
        {
          type: "ul",
          items: [
            "অন্য বানানে বা শুধু প্রথম কয়েকটি অক্ষর দিয়ে খুঁজুন।",
            "যাচাই পাতায় প্যাকেটে ছাপা DAR নম্বর দিয়ে খুঁজুন।",
            "পণ্যটি স্ন্যাপশটের তারিখের পরে নিবন্ধিত হয়ে থাকতে পারে। dgda.gov.bd-তে DGDA-র কাছে যাচাই করুন।",
            "একজন নিবন্ধিত ফার্মাসিস্টকে সঙ্গে নিয়ে প্যাকেটটি পড়ুন।",
          ],
        },
        {
          type: "note",
          text: "জেনেরিক নাম জানা লেবেল বোঝার জন্য, ওষুধ বেছে নেওয়া বা বদলানোর জন্য নয়। কোনো ওষুধ শুরু, বন্ধ বা পরিবর্তনের আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "ওষুধের প্যাকেটে জেনেরিক নাম কোথায় থাকে?",
          a: "সাধারণত ব্র্যান্ড নামের কাছেই ছোট অক্ষরে, অনেক সময় শক্তিসহ, যেমন \"Paracetamol 500 mg\"।",
        },
        {
          q: "এই সাইটে কি ব্র্যান্ড নাম দিয়ে খোঁজা যায়?",
          a: "হ্যাঁ। সার্চ বক্সে ব্র্যান্ড নাম লিখুন, চাইলে সঙ্গে শক্তি, তারপর মিলে যাওয়া ওষুধের পাতা খুলে জেনেরিক নাম দেখুন।",
        },
        {
          q: "একটি ব্র্যান্ড নামে কেন একাধিক জেনেরিক দেখায়?",
          a: "একটি কোম্পানি একই ব্র্যান্ড নাম ভিন্ন পণ্যে ব্যবহার করতে পারে, যেমন একক উপাদানের পণ্য ও কম্বিনেশন পণ্য। আপনার প্যাকেটের শক্তি ও ডোজ ফর্ম মিলিয়ে নিন।",
        },
        {
          q: "এই সাইট কি বলে ওষুধটি কীসের জন্য?",
          a: "না। আমরা শুধু রেজিস্ট্রির তথ্য দেখাই। কোনো ওষুধ কীসের জন্য, তা নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
