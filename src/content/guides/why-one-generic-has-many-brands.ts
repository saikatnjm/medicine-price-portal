import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const whyOneGenericHasManyBrands: Guide = {
  slug: "why-one-generic-has-many-brands",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Why one generic has hundreds of brands in Bangladesh",
      description:
        "One active ingredient can be sold under hundreds of brand names. Why that happens and how to see every brand of a generic in the DGDA registry snapshot.",
      summary:
        "Search for a common active ingredient and you may find hundreds of products. This guide explains why one generic can appear under so many brand names, and how to read such a long list.",
      body: [
        { type: "h2", text: "One ingredient, many products" },
        {
          type: "p",
          text: "A generic name is the name of the active ingredient, such as paracetamol. A brand name is the name a company gives to its own product. When several companies each register their own product containing the same ingredient, each product gets its own brand name and its own registration. That is why a single generic can sit behind a very long list of brands.",
        },
        {
          type: "p",
          text: "In the DGDA registry snapshot used on this site, Paracetamol alone has 436 products. Each of those is a separate registry entry with its own brand name, manufacturer and DAR number.",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "See all Paracetamol products in the registry snapshot" },
        { type: "h2", text: "Why the list gets so long" },
        { type: "p", text: "A few ordinary reasons add up quickly:" },
        {
          type: "ul",
          items: [
            "Many companies: different pharmaceutical companies can each register their own brand of the same ingredient.",
            "Different strengths: one company may register the same ingredient in more than one strength, for example 500 mg and 665 mg, often as separate entries.",
            "Different dosage forms: the same ingredient can come as a tablet, a syrup, a suspension or a suppository, and each form is registered separately.",
            "Combinations: some products combine the ingredient with another one. These are usually listed under a combined generic name, such as Caffeine + Paracetamol, rather than under the single ingredient.",
          ],
        },
        {
          type: "p",
          text: "So when you see a large number next to a generic, it counts registered products, not companies. One company can account for several of them.",
        },
        { type: "h2", text: "What the number does not tell you" },
        {
          type: "p",
          text: "A long list of brands is a description of the registry, nothing more. It does not mean one brand is better or worse than another, and it does not tell you which product is available at a particular pharmacy today. This site shows registry facts only. It shows no prices, because none have been verified, and no rankings.",
        },
        { type: "h2", text: "How to read a long brand list" },
        { type: "p", text: "When you open a generic page, these details help you find the exact product you are looking for:" },
        {
          type: "ol",
          items: [
            "Check the strength printed on your pack, for example 500 mg, and look for the same strength in the list.",
            "Check the dosage form: tablet, capsule, syrup and so on.",
            "Check the manufacturer named on the pack.",
            "If the pack shows a DAR number, use it to find the exact registry entry.",
          ],
        },
        { type: "link", href: routes.generics(), label: "Browse all generics in the registry snapshot" },
        { type: "link", href: routes.guide("compare-brands-same-generic"), label: "How to compare brands of the same generic" },
        {
          type: "note",
          text: "Products with the same generic name are not automatically interchangeable for you. Before changing from one brand to another, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "How many Paracetamol products are there?",
          a: "In the DGDA registry snapshot used on this site, Paracetamol has 436 products. The number in the live DGDA registry may differ.",
        },
        {
          q: "Does a generic with more brands mean it is more popular?",
          a: "Not necessarily. The count only shows how many products are registered. It says nothing about sales or quality.",
        },
        {
          q: "Why are some strengths listed as separate products?",
          a: "A product with a different strength or dosage form is usually registered as its own entry, so it appears separately in the list.",
        },
        {
          q: "Can I swap one brand for another with the same generic?",
          a: "Do not change a medicine on your own. Ask a registered doctor or pharmacist first.",
        },
      ],
    },
    bn: {
      title: "একটি জেনেরিকের কেন শত শত ব্র্যান্ড",
      description:
        "একই সক্রিয় উপাদান শত শত ব্র্যান্ড নামে বিক্রি হতে পারে। কেন এমন হয় এবং DGDA রেজিস্ট্রি স্ন্যাপশটে একটি জেনেরিকের সব ব্র্যান্ড কীভাবে দেখবেন।",
      summary:
        "পরিচিত কোনো সক্রিয় উপাদান খুঁজলে শত শত পণ্য পেতে পারেন। একটি জেনেরিক কেন এত ব্র্যান্ড নামে দেখা যায় এবং এত লম্বা তালিকা কীভাবে পড়বেন, এই গাইডে তা বলা হয়েছে।",
      body: [
        { type: "h2", text: "একটি উপাদান, অনেক পণ্য" },
        {
          type: "p",
          text: "জেনেরিক নাম হলো সক্রিয় উপাদানের নাম, যেমন প্যারাসিটামল। ব্র্যান্ড নাম হলো কোনো কোম্পানি নিজের পণ্যের যে নাম দেয়। কয়েকটি কোম্পানি যখন একই উপাদানের আলাদা আলাদা পণ্য নিবন্ধন করে, তখন প্রতিটি পণ্যের নিজস্ব ব্র্যান্ড নাম ও নিজস্ব নিবন্ধন থাকে। এ কারণেই একটি জেনেরিকের পেছনে ব্র্যান্ডের অনেক লম্বা তালিকা থাকতে পারে।",
        },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে শুধু Paracetamol-এরই 436টি পণ্য আছে। এদের প্রতিটি আলাদা রেজিস্ট্রি এন্ট্রি, যার নিজস্ব ব্র্যান্ড নাম, প্রস্তুতকারক ও DAR নম্বর আছে।",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "রেজিস্ট্রি স্ন্যাপশটে Paracetamol-এর সব পণ্য দেখুন" },
        { type: "h2", text: "তালিকা এত লম্বা হয় কেন" },
        { type: "p", text: "কয়েকটি সাধারণ কারণ মিলে সংখ্যাটা দ্রুত বেড়ে যায়:" },
        {
          type: "ul",
          items: [
            "অনেক কোম্পানি: বিভিন্ন ওষুধ কোম্পানি একই উপাদানের নিজস্ব ব্র্যান্ড নিবন্ধন করতে পারে।",
            "ভিন্ন শক্তি: একটি কোম্পানি একই উপাদান একাধিক শক্তিতে নিবন্ধন করতে পারে, যেমন 500 mg ও 665 mg, প্রায়ই আলাদা এন্ট্রি হিসেবে।",
            "ভিন্ন ডোজ ফর্ম: একই উপাদান ট্যাবলেট, সিরাপ, সাসপেনশন বা সাপোজিটরি হিসেবে আসতে পারে, আর প্রতিটি ফর্ম আলাদাভাবে নিবন্ধিত হয়।",
            "কম্বিনেশন: কিছু পণ্যে এই উপাদানের সঙ্গে অন্য উপাদানও থাকে। এগুলো সাধারণত একক উপাদানের নামে নয়, যৌথ জেনেরিক নামে তালিকাভুক্ত হয়, যেমন Caffeine + Paracetamol।",
          ],
        },
        {
          type: "p",
          text: "তাই কোনো জেনেরিকের পাশে বড় সংখ্যা দেখলে বুঝবেন, সেটি নিবন্ধিত পণ্যের সংখ্যা, কোম্পানির সংখ্যা নয়। একটি কোম্পানিরই কয়েকটি পণ্য থাকতে পারে।",
        },
        { type: "h2", text: "সংখ্যাটি কী বলে না" },
        {
          type: "p",
          text: "ব্র্যান্ডের লম্বা তালিকা শুধু রেজিস্ট্রির একটি বিবরণ, এর বেশি কিছু নয়। এতে বোঝায় না যে কোনো ব্র্যান্ড অন্যটির চেয়ে ভালো বা খারাপ, আর আজ কোনো নির্দিষ্ট ফার্মেসিতে কোন পণ্য পাওয়া যাবে তাও জানা যায় না। এই সাইট শুধু রেজিস্ট্রির তথ্য দেখায়। কোনো দাম যাচাই করা হয়নি বলে দাম দেখানো হয় না, কোনো র‍্যাংকিংও নেই।",
        },
        { type: "h2", text: "লম্বা ব্র্যান্ড তালিকা কীভাবে পড়বেন" },
        { type: "p", text: "কোনো জেনেরিকের পাতা খুললে এই তথ্যগুলো মিলিয়ে ঠিক পণ্যটি খুঁজে পাবেন:" },
        {
          type: "ol",
          items: [
            "প্যাকেটে ছাপা শক্তি দেখুন, যেমন 500 mg, এবং তালিকায় একই শক্তি খুঁজুন।",
            "ডোজ ফর্ম মিলিয়ে নিন: ট্যাবলেট, ক্যাপসুল, সিরাপ ইত্যাদি।",
            "প্যাকেটে লেখা প্রস্তুতকারকের নাম মিলিয়ে নিন।",
            "প্যাকেটে DAR নম্বর থাকলে সেটি দিয়ে সঠিক রেজিস্ট্রি এন্ট্রি খুঁজুন।",
          ],
        },
        { type: "link", href: routes.generics(), label: "রেজিস্ট্রি স্ন্যাপশটের সব জেনেরিক দেখুন" },
        { type: "link", href: routes.guide("compare-brands-same-generic"), label: "একই জেনেরিকের ব্র্যান্ড কীভাবে তুলনা করবেন" },
        {
          type: "note",
          text: "একই জেনেরিক নামের পণ্য মানেই আপনার জন্য একটির বদলে অন্যটি চলবে, এমন নয়। এক ব্র্যান্ড থেকে অন্য ব্র্যান্ডে যাওয়ার আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "Paracetamol-এর কতগুলো পণ্য আছে?",
          a: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে Paracetamol-এর 436টি পণ্য আছে। DGDA-র বর্তমান রেজিস্ট্রিতে সংখ্যাটি ভিন্ন হতে পারে।",
        },
        {
          q: "যে জেনেরিকের ব্র্যান্ড বেশি, সেটি কি বেশি জনপ্রিয়?",
          a: "তা নয়। সংখ্যাটি শুধু দেখায় কতগুলো পণ্য নিবন্ধিত। বিক্রি বা মান সম্পর্কে এটি কিছু বলে না।",
        },
        {
          q: "কিছু শক্তি আলাদা পণ্য হিসেবে দেখানো হয় কেন?",
          a: "ভিন্ন শক্তি বা ডোজ ফর্মের পণ্য সাধারণত নিজস্ব এন্ট্রি হিসেবে নিবন্ধিত হয়, তাই তালিকায় আলাদাভাবে দেখা যায়।",
        },
        {
          q: "একই জেনেরিকের এক ব্র্যান্ডের বদলে অন্যটি কি নিতে পারি?",
          a: "নিজে থেকে ওষুধ বদলাবেন না। আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
