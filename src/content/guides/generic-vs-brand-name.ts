import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const genericVsBrandName: Guide = {
  slug: "generic-vs-brand-name",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Generic name vs brand name: what's the difference?",
      description:
        "A generic name is the active ingredient; a brand name is what a company calls its product. How to tell them apart on a pack and in the DGDA registry.",
      summary:
        "Every medicine pack carries two kinds of name: the brand name a company chose and the generic name of the active ingredient. Knowing which is which makes packs, prescriptions and registry entries much easier to read.",
      body: [
        { type: "h2", text: "Two names, two jobs" },
        {
          type: "ul",
          items: [
            "The generic name is the name of the active ingredient (or ingredients) in the medicine, for example Paracetamol. It is the same whichever company makes the product.",
            "The brand name, also called the trade name, is the name a company gives to its own product, for example Napa or Ace. Different companies use different brand names.",
          ],
        },
        {
          type: "p",
          text: "In the DGDA registry snapshot used on this site, Napa is registered by Beximco Pharmaceuticals Ltd. and Ace by Square Pharmaceuticals PLC, and both are listed with the generic Paracetamol. Altogether, Paracetamol has 436 registered products in that snapshot.",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "See all registered Paracetamol products" },
        { type: "h2", text: "How to spot each name on a pack" },
        {
          type: "p",
          text: "Pack designs vary, but these patterns are common:",
        },
        {
          type: "ul",
          items: [
            "The brand name is usually the largest word on the box, often with a logo.",
            "The generic name is usually printed nearby in smaller type, sometimes after words like \"contains\" or followed by the strength, for example \"Paracetamol 500 mg\".",
            "The company name appears separately, often with \"manufactured by\".",
          ],
        },
        {
          type: "p",
          text: "If you are not sure which word is the brand, search for it on this site. A medicine page always shows the brand name, the generic name and the manufacturer as separate fields.",
        },
        { type: "h2", text: "Same generic is not the same as same product" },
        {
          type: "p",
          text: "Two products can share a generic name and still differ in ways that matter on the label. When you compare them, check each of these:",
        },
        {
          type: "ul",
          items: [
            "Strength: 500 mg is not the same as 665 mg.",
            "Dosage form: a tablet, a syrup, a suspension and a suppository are different forms.",
            "Release type: names with XR, SR or ER describe extended or sustained release products, which are different products from standard ones.",
            "Combination: \"Caffeine + Paracetamol\" is a different generic from \"Paracetamol\" alone.",
            "Manufacturer: each company's product is a separate registration with its own DAR number.",
          ],
        },
        { type: "link", href: routes.guide("compare-brands-same-generic"), label: "How to compare brands of the same generic" },
        { type: "h2", text: "Why the generic name is useful" },
        {
          type: "ul",
          items: [
            "It helps you recognise that two differently named packs contain the same active ingredient, so you can mention both to your doctor or pharmacist.",
            "It is a stable name to write in a family medicine list, alongside the brand and strength.",
            "On this site, each generic page lists every registered product with that active ingredient.",
          ],
        },
        { type: "link", href: routes.generics(), label: "Browse all generics in the registry" },
        { type: "link", href: routes.guide("find-generic-name-of-a-brand"), label: "How to find the generic name of any medicine brand" },
        {
          type: "note",
          text: "Do not switch from one brand to another, or combine products, on your own. Ask a registered doctor or pharmacist first.",
        },
      ],
      faq: [
        {
          q: "What is a generic name?",
          a: "The name of the active ingredient in a medicine, such as Paracetamol. It does not depend on which company makes the product.",
        },
        {
          q: "What is a brand name?",
          a: "The name a company gives its own product, also called the trade name. Napa and Ace are two brand names registered with the generic Paracetamol.",
        },
        {
          q: "Are two brands with the same generic name interchangeable?",
          a: "Not automatically. Strength, dosage form and release type can differ. Only a registered doctor or pharmacist can advise whether one can replace another for you.",
        },
        {
          q: "Where can I see all brands of one generic?",
          a: "Open the generic's page on this site. It lists every product with that generic in the DGDA registry snapshot.",
        },
      ],
    },
    bn: {
      title: "জেনেরিক নাম ও ব্র্যান্ড নামের পার্থক্য",
      description:
        "জেনেরিক নাম হলো সক্রিয় উপাদানের নাম; ব্র্যান্ড নাম হলো কোম্পানির দেওয়া পণ্যের নাম। প্যাকেটে ও DGDA রেজিস্ট্রিতে দুটো কীভাবে আলাদা করবেন।",
      summary:
        "প্রতিটি ওষুধের প্যাকেটে দুই ধরনের নাম থাকে: কোম্পানির দেওয়া ব্র্যান্ড নাম এবং সক্রিয় উপাদানের জেনেরিক নাম। কোনটি কী তা জানলে প্যাকেট, প্রেসক্রিপশন ও রেজিস্ট্রির তথ্য পড়া অনেক সহজ হয়।",
      body: [
        { type: "h2", text: "দুটি নাম, দুটি কাজ" },
        {
          type: "ul",
          items: [
            "জেনেরিক নাম হলো ওষুধের সক্রিয় উপাদান (বা উপাদানগুলোর) নাম, যেমন Paracetamol (প্যারাসিটামল)। যে কোম্পানিই পণ্যটি তৈরি করুক, জেনেরিক নাম একই থাকে।",
            "ব্র্যান্ড নাম, যাকে ট্রেড নামও বলে, হলো কোনো কোম্পানির নিজের পণ্যের নাম, যেমন Napa বা Ace। ভিন্ন ভিন্ন কোম্পানি ভিন্ন ব্র্যান্ড নাম ব্যবহার করে।",
          ],
        },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে Napa নিবন্ধিত Beximco Pharmaceuticals Ltd.-এর নামে আর Ace নিবন্ধিত Square Pharmaceuticals PLC-এর নামে, এবং দুটিরই জেনেরিক Paracetamol। ওই স্ন্যাপশটে Paracetamol-এর মোট নিবন্ধিত পণ্য 436টি।",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "Paracetamol-এর সব নিবন্ধিত পণ্য দেখুন" },
        { type: "h2", text: "প্যাকেটে কোন নাম কোনটি, কীভাবে চিনবেন" },
        { type: "p", text: "প্যাকেটের নকশা ভিন্ন হয়, তবে সাধারণত এমন দেখা যায়:" },
        {
          type: "ul",
          items: [
            "ব্র্যান্ড নাম সাধারণত বাক্সের সবচেয়ে বড় লেখা, অনেক সময় লোগোসহ।",
            "জেনেরিক নাম সাধারণত কাছেই ছোট অক্ষরে ছাপা থাকে, কখনো \"contains\" জাতীয় শব্দের পরে বা শক্তিসহ, যেমন \"Paracetamol 500 mg\"।",
            "কোম্পানির নাম আলাদা জায়গায় থাকে, অনেক সময় \"manufactured by\" লেখার পাশে।",
          ],
        },
        {
          type: "p",
          text: "কোন শব্দটি ব্র্যান্ড, নিশ্চিত না হলে এই সাইটে সেটি খুঁজে দেখুন। ওষুধের পাতায় ব্র্যান্ড নাম, জেনেরিক নাম ও প্রস্তুতকারক সবসময় আলাদা আলাদা দেখানো হয়।",
        },
        { type: "h2", text: "একই জেনেরিক মানেই একই পণ্য নয়" },
        {
          type: "p",
          text: "দুটি পণ্যের জেনেরিক নাম এক হলেও লেবেলে গুরুত্বপূর্ণ পার্থক্য থাকতে পারে। তুলনা করার সময় এগুলো দেখে নিন:",
        },
        {
          type: "ul",
          items: [
            "শক্তি: 500 mg আর 665 mg এক নয়।",
            "ডোজ ফর্ম: ট্যাবলেট, সিরাপ, সাসপেনশন ও সাপোজিটরি আলাদা আলাদা ফর্ম।",
            "রিলিজের ধরন: নামে XR, SR বা ER থাকলে বোঝায় এক্সটেন্ডেড বা সাসটেইনড রিলিজ পণ্য, যা সাধারণ পণ্য থেকে আলাদা।",
            "কম্বিনেশন: \"Caffeine + Paracetamol\" শুধু \"Paracetamol\" থেকে ভিন্ন একটি জেনেরিক।",
            "প্রস্তুতকারক: প্রতিটি কোম্পানির পণ্য আলাদা নিবন্ধন, যার নিজস্ব DAR নম্বর আছে।",
          ],
        },
        { type: "link", href: routes.guide("compare-brands-same-generic"), label: "একই জেনেরিকের ব্র্যান্ড কীভাবে তুলনা করবেন" },
        { type: "h2", text: "জেনেরিক নাম কেন কাজে লাগে" },
        {
          type: "ul",
          items: [
            "ভিন্ন নামের দুটি প্যাকেটে যে একই সক্রিয় উপাদান আছে, তা বুঝতে সাহায্য করে, ফলে দুটোর কথাই ডাক্তার বা ফার্মাসিস্টকে জানাতে পারেন।",
            "পরিবারের ওষুধের তালিকায় ব্র্যান্ড ও শক্তির পাশাপাশি লিখে রাখার জন্য এটি একটি স্থির নাম।",
            "এই সাইটে প্রতিটি জেনেরিকের পাতায় ওই সক্রিয় উপাদানের সব নিবন্ধিত পণ্যের তালিকা থাকে।",
          ],
        },
        { type: "link", href: routes.generics(), label: "রেজিস্ট্রির সব জেনেরিক দেখুন" },
        { type: "link", href: routes.guide("find-generic-name-of-a-brand"), label: "যেকোনো ব্র্যান্ডের জেনেরিক নাম কীভাবে খুঁজবেন" },
        {
          type: "note",
          text: "নিজে থেকে এক ব্র্যান্ড বদলে অন্য ব্র্যান্ড নেবেন না, বা একাধিক পণ্য একসঙ্গে ব্যবহার করবেন না। আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "জেনেরিক নাম কী?",
          a: "ওষুধের সক্রিয় উপাদানের নাম, যেমন Paracetamol। কোন কোম্পানি পণ্যটি তৈরি করছে, তার ওপর এটি নির্ভর করে না।",
        },
        {
          q: "ব্র্যান্ড নাম কী?",
          a: "কোনো কোম্পানির নিজের পণ্যের নাম, যাকে ট্রেড নামও বলে। Napa ও Ace হলো Paracetamol জেনেরিকের দুটি নিবন্ধিত ব্র্যান্ড নাম।",
        },
        {
          q: "একই জেনেরিকের দুটি ব্র্যান্ড কি একটির বদলে আরেকটি নেওয়া যায়?",
          a: "আপনা-আপনি নয়। শক্তি, ডোজ ফর্ম ও রিলিজের ধরন আলাদা হতে পারে। আপনার ক্ষেত্রে একটির বদলে আরেকটি চলবে কিনা, তা শুধু নিবন্ধিত ডাক্তার বা ফার্মাসিস্ট বলতে পারেন।",
        },
        {
          q: "একটি জেনেরিকের সব ব্র্যান্ড কোথায় দেখব?",
          a: "এই সাইটে জেনেরিকটির পাতা খুলুন। সেখানে DGDA রেজিস্ট্রি স্ন্যাপশটে ওই জেনেরিকের সব পণ্যের তালিকা আছে।",
        },
      ],
    },
  },
};
