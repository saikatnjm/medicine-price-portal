import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const tabletSuffixesXrSrErMups: Guide = {
  slug: "tablet-suffixes-xr-sr-er-mups",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "What XR, SR, ER, DR and MUPS mean in a medicine name",
      description:
        "XR, ER, SR, CR, DR, MR, MUPS and ODT on a medicine name or dosage form: what each abbreviation stands for. Label vocabulary only, not instructions.",
      summary:
        "Letters such as XR, SR or MUPS after a brand name or before \"Tablet\" tell you how the product is designed to release its medicine. This guide spells out what each abbreviation stands for.",
      body: [
        { type: "h2", text: "Why the letters are there" },
        {
          type: "p",
          text: "A standard tablet or capsule is usually designed to release its medicine soon after it is taken. Some products are designed differently, and the label says so with a short abbreviation. In the DGDA registry these appear as separate dosage forms, such as \"XR Tablet\", \"SR Capsule\" or \"MUPS Tablet\", and they can also appear in the brand name itself.",
        },
        {
          type: "p",
          text: "Because of this, a plain tablet and an XR tablet of the same generic are different registered products, often with different strengths.",
        },
        { type: "h2", text: "What each abbreviation stands for" },
        {
          type: "ul",
          items: [
            "XR: extended release. Designed to release the medicine over a longer period than a standard tablet.",
            "ER: extended release. The same meaning as XR; companies choose one or the other.",
            "SR: sustained release. Also designed to release the medicine over a longer period.",
            "CR: controlled release. Designed to release the medicine at a controlled rate.",
            "MR: modified release. A general term for any release pattern different from a standard tablet. It sometimes appears as \"M R\".",
            "PR: prolonged release. Another term for release over a longer period.",
            "DR: delayed release. Designed so that release starts later rather than straight away, often using a special coating.",
            "MUPS: multiple-unit pellet system. A tablet made of many tiny coated pellets pressed together.",
            "ODT: orally disintegrating (or orodispersible) tablet. Designed to break up in the mouth.",
          ],
        },
        {
          type: "p",
          text: "Different companies may use different abbreviations for similar designs, and the exact design of any one product is set by its manufacturer. The abbreviation tells you the type of product; it does not tell you how that particular product should be taken.",
        },
        { type: "h2", text: "Where you will see them" },
        {
          type: "ol",
          items: [
            "In the brand name on the pack, for example a brand name followed by \"XR\" or \"MUPS\".",
            "In the dosage form shown on the pack and in the registry, for example \"ER Tablet\" or \"DR Tablet\".",
            "On the medicine pages of this site, which show the registry's dosage form for each product.",
          ],
        },
        { type: "h2", text: "Matching a pack to the registry" },
        {
          type: "p",
          text: "When you look a product up, match the abbreviation as well as the generic and strength. If your pack says \"SR Tablet\", the matching registry entry should also say SR, not a plain tablet.",
        },
        { type: "link", href: routes.dosageForms(), label: "Browse dosage forms, including XR, SR and MUPS tablets" },
        { type: "link", href: routes.guide("dosage-forms-explained"), label: "Tablet, capsule, syrup, suspension: dosage forms explained" },
        { type: "link", href: routes.search(), label: "Search a brand to see its registered dosage form" },
        {
          type: "note",
          text: "How to take any medicine, including whether a tablet may be split, chewed or crushed, depends on the product. Ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Is XR the same as ER?",
          a: "Both stand for extended release. Companies use one or the other for products designed to release medicine over a longer period.",
        },
        {
          q: "What does MUPS stand for?",
          a: "Multiple-unit pellet system: a tablet made of many tiny coated pellets pressed together.",
        },
        {
          q: "What does DR mean?",
          a: "Delayed release: the product is designed so that release starts later rather than immediately.",
        },
        {
          q: "Can I replace an SR tablet with a plain tablet of the same generic?",
          a: "Do not decide this yourself. They are different products; ask a registered doctor or pharmacist.",
        },
      ],
    },
    bn: {
      title: "ওষুধের নামে XR, SR, ER, MUPS মানে কী",
      description:
        "ওষুধের নাম বা ডোজ ফর্মে XR, ER, SR, CR, DR, MR, MUPS ও ODT: প্রতিটি সংক্ষিপ্ত রূপের পূর্ণ অর্থ। শুধু লেবেলের শব্দার্থ, ব্যবহারের নির্দেশনা নয়।",
      summary:
        "ব্র্যান্ড নামের পরে বা \"Tablet\" শব্দের আগে XR, SR বা MUPS-এর মতো অক্ষর থাকলে বোঝা যায় পণ্যটি কীভাবে ওষুধ ছাড়ার জন্য তৈরি। এই গাইডে প্রতিটি সংক্ষিপ্ত রূপের পূর্ণ অর্থ দেওয়া হলো।",
      body: [
        { type: "h2", text: "অক্ষরগুলো কেন থাকে" },
        {
          type: "p",
          text: "সাধারণ ট্যাবলেট বা ক্যাপসুল সাধারণত খাওয়ার কিছুক্ষণের মধ্যেই ওষুধ ছাড়ার জন্য তৈরি। কিছু পণ্য ভিন্নভাবে তৈরি, আর লেবেলে একটি ছোট সংক্ষিপ্ত রূপ দিয়ে তা বোঝানো হয়। DGDA রেজিস্ট্রিতে এগুলো আলাদা ডোজ ফর্ম হিসেবে থাকে, যেমন \"XR Tablet\", \"SR Capsule\" বা \"MUPS Tablet\", আবার ব্র্যান্ড নামের মধ্যেও থাকতে পারে।",
        },
        {
          type: "p",
          text: "এ কারণে একই জেনেরিকের সাধারণ ট্যাবলেট আর XR ট্যাবলেট আলাদা নিবন্ধিত পণ্য, প্রায়ই এদের শক্তিও আলাদা।",
        },
        { type: "h2", text: "কোন সংক্ষিপ্ত রূপের কী অর্থ" },
        {
          type: "ul",
          items: [
            "XR: extended release (এক্সটেন্ডেড রিলিজ)। সাধারণ ট্যাবলেটের চেয়ে দীর্ঘ সময় ধরে ওষুধ ছাড়ার জন্য তৈরি।",
            "ER: extended release। XR-এর মতোই অর্থ; কোম্পানিগুলো যেকোনো একটি ব্যবহার করে।",
            "SR: sustained release (সাসটেইনড রিলিজ)। এটিও দীর্ঘ সময় ধরে ওষুধ ছাড়ার জন্য তৈরি।",
            "CR: controlled release (কন্ট্রোলড রিলিজ)। নিয়ন্ত্রিত হারে ওষুধ ছাড়ার জন্য তৈরি।",
            "MR: modified release (মডিফায়েড রিলিজ)। সাধারণ ট্যাবলেট থেকে আলাদা যেকোনো ধরনের ওষুধ ছাড়ার পদ্ধতির সাধারণ নাম। কখনো \"M R\" লেখা থাকে।",
            "PR: prolonged release (প্রলংড রিলিজ)। দীর্ঘ সময় ধরে ওষুধ ছাড়ার আরেকটি নাম।",
            "DR: delayed release (ডিলেইড রিলিজ)। তখনই নয়, কিছু পরে ওষুধ ছাড়া শুরু করার জন্য তৈরি, প্রায়ই বিশেষ আবরণ ব্যবহার করে।",
            "MUPS: multiple-unit pellet system। অনেকগুলো ক্ষুদ্র আবরণযুক্ত পেলেট একসঙ্গে চেপে তৈরি ট্যাবলেট।",
            "ODT: orally disintegrating বা orodispersible tablet। মুখের ভেতরে ভেঙে যাওয়ার জন্য তৈরি ট্যাবলেট।",
          ],
        },
        {
          type: "p",
          text: "একই ধরনের নকশার জন্য ভিন্ন কোম্পানি ভিন্ন সংক্ষিপ্ত রূপ ব্যবহার করতে পারে, আর কোনো পণ্যের নির্দিষ্ট নকশা ঠিক করে তার প্রস্তুতকারক। সংক্ষিপ্ত রূপ দেখে পণ্যের ধরন বোঝা যায়; ওই পণ্যটি কীভাবে খেতে হবে তা বোঝা যায় না।",
        },
        { type: "h2", text: "কোথায় দেখতে পাবেন" },
        {
          type: "ol",
          items: [
            "প্যাকেটের ব্র্যান্ড নামে, যেমন কোনো ব্র্যান্ড নামের পরে \"XR\" বা \"MUPS\"।",
            "প্যাকেট ও রেজিস্ট্রিতে লেখা ডোজ ফর্মে, যেমন \"ER Tablet\" বা \"DR Tablet\"।",
            "এই সাইটের ওষুধের পাতায়, যেখানে প্রতিটি পণ্যের রেজিস্ট্রিতে লেখা ডোজ ফর্ম দেখানো হয়।",
          ],
        },
        { type: "h2", text: "প্যাকেটের সঙ্গে রেজিস্ট্রি মেলানো" },
        {
          type: "p",
          text: "কোনো পণ্য খোঁজার সময় জেনেরিক ও শক্তির সঙ্গে সংক্ষিপ্ত রূপটিও মিলিয়ে নিন। প্যাকেটে \"SR Tablet\" লেখা থাকলে মিলে যাওয়া রেজিস্ট্রি এন্ট্রিতেও SR থাকা উচিত, সাধারণ ট্যাবলেট নয়।",
        },
        { type: "link", href: routes.dosageForms(), label: "XR, SR ও MUPS ট্যাবলেটসহ সব ডোজ ফর্ম দেখুন" },
        { type: "link", href: routes.guide("dosage-forms-explained"), label: "ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন: ডোজ ফর্ম পরিচিতি" },
        { type: "link", href: routes.search(), label: "ব্র্যান্ড খুঁজে তার নিবন্ধিত ডোজ ফর্ম দেখুন" },
        {
          type: "note",
          text: "যেকোনো ওষুধ কীভাবে খাবেন, ট্যাবলেট ভাঙা, চিবানো বা গুঁড়া করা যাবে কিনা, তা পণ্যভেদে আলাদা। নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "XR আর ER কি একই?",
          a: "দুটিরই অর্থ extended release। দীর্ঘ সময় ধরে ওষুধ ছাড়ার জন্য তৈরি পণ্যে কোম্পানিগুলো যেকোনো একটি ব্যবহার করে।",
        },
        {
          q: "MUPS-এর পূর্ণ রূপ কী?",
          a: "Multiple-unit pellet system: অনেকগুলো ক্ষুদ্র আবরণযুক্ত পেলেট একসঙ্গে চেপে তৈরি ট্যাবলেট।",
        },
        {
          q: "DR মানে কী?",
          a: "Delayed release: পণ্যটি এমনভাবে তৈরি যাতে ওষুধ ছাড়া তখনই নয়, কিছু পরে শুরু হয়।",
        },
        {
          q: "একই জেনেরিকের SR ট্যাবলেটের বদলে কি সাধারণ ট্যাবলেট নেওয়া যায়?",
          a: "এ সিদ্ধান্ত নিজে নেবেন না। এগুলো আলাদা পণ্য; নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
