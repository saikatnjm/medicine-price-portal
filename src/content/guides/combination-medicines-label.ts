import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const combinationMedicinesLabel: Guide = {
  slug: "combination-medicines-label",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Reading combination medicines (e.g. \"Paracetamol + Caffeine\")",
      description:
        "What \"A + B\" means in a generic name, how strengths like \"65 mg + 500 mg\" line up with each ingredient, and how to read combination labels.",
      summary:
        "Some medicine products contain more than one active ingredient. Their generic name joins the ingredients with a plus sign, and the strength lists one amount for each. This guide shows how to read both.",
      body: [
        { type: "h2", text: "What a combination medicine is" },
        {
          type: "p",
          text: "A combination medicine is a single product that contains two or more active ingredients. On a pack, and in the DGDA registry, the generic name of such a product lists every ingredient, joined with a plus sign (+). Each ingredient also has its own strength.",
        },
        {
          type: "p",
          text: "For example, the DGDA registry snapshot used on this site contains the generic \"Caffeine + Paracetamol\". A product with that generic is listed with the strength \"65 mg + 500 mg\": one amount for each of the two ingredients.",
        },
        { type: "h2", text: "How the name is written" },
        {
          type: "ul",
          items: [
            "Ingredients are separated by \"+\". \"Caffeine + Paracetamol\" means the product contains both caffeine and paracetamol.",
            "The order of names can differ between a pack and a registry. A pack may say \"Paracetamol + Caffeine\" while the registry says \"Caffeine + Paracetamol\". They describe the same combination.",
            "Some combinations have three or more ingredients, so the name can be long, for example \"Abacavir + Lamivudine + Zidovudine\" in the registry.",
            "Salt names are part of the ingredient name, for example \"Metformin Hydrochloride\" or \"Bisoprolol Hemifumarate\". Read them as one ingredient, not two.",
          ],
        },
        { type: "h2", text: "How the strength lines up" },
        {
          type: "p",
          text: "The strength of a combination product is a list of amounts separated by \"+\". In the DGDA registry snapshot used on this site, a combination product's strength has one part for each ingredient, listed in the same order as the ingredients in the generic name.",
        },
        {
          type: "ol",
          items: [
            "Write the ingredient names in the order shown on this site's medicine page.",
            "Write the strength parts in the order shown, splitting at each \"+\".",
            "Pair them up: the first name with the first amount, the second with the second, and so on.",
            "Check the units of each part. One part may be in mg and another in mcg, or a liquid may show an amount per mL.",
          ],
        },
        {
          type: "p",
          text: "Using the example above: \"Caffeine + Paracetamol\" with \"65 mg + 500 mg\" pairs Caffeine with 65 mg and Paracetamol with 500 mg. If the order on the pack is different, match each amount to its ingredient by name rather than by position, and ask a pharmacist if you are unsure.",
        },
        { type: "h2", text: "Same ingredients, different products" },
        {
          type: "p",
          text: "Two products can share the same ingredients but have different strengths, different dosage forms or different makers. On this site, each generic page lists every registered product with that generic, so you can see the strength, form and manufacturer of each. A combination is a separate generic from each of its single ingredients: \"Caffeine + Paracetamol\" and \"Paracetamol\" have separate pages.",
        },
        { type: "link", href: routes.generic("caffeine-paracetamol"), label: "Caffeine + Paracetamol: registered products" },
        { type: "link", href: routes.generic("paracetamol"), label: "Paracetamol: registered products" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "How to read medicine strength: mg, mcg, mg/mL, %" },
        {
          type: "note",
          text: "This guide explains how labels are written. It does not say what any combination is for or whether one product can replace another. Ask a registered doctor or pharmacist about any medicine.",
        },
      ],
      faq: [
        {
          q: "What does the \"+\" in a generic name mean?",
          a: "It separates the active ingredients. A product called \"Caffeine + Paracetamol\" contains both caffeine and paracetamol.",
        },
        {
          q: "How do I know which strength belongs to which ingredient?",
          a: "On this site the strength parts follow the same order as the ingredient names. On a pack, match amounts to ingredients by name. If it is not clear, ask a pharmacist.",
        },
        {
          q: "Is \"Paracetamol + Caffeine\" the same as \"Caffeine + Paracetamol\"?",
          a: "Yes, the names describe the same combination of ingredients; only the order of writing differs. The amounts of each ingredient can still differ between products, so check the strength.",
        },
        {
          q: "Can I swap a combination product for single-ingredient products?",
          a: "This site does not give that kind of advice. Ask a registered doctor or pharmacist before changing any medicine.",
        },
      ],
    },
    bn: {
      title: "কম্বিনেশন ওষুধের লেবেল কীভাবে পড়বেন",
      description:
        "জেনেরিক নামে \"A + B\" মানে কী, \"65 mg + 500 mg\"-এর মতো শক্তি কোন উপাদানের সঙ্গে মেলে এবং কম্বিনেশন ওষুধের লেবেল কীভাবে পড়বেন।",
      summary:
        "কিছু ওষুধে একাধিক সক্রিয় উপাদান থাকে। এদের জেনেরিক নামে উপাদানগুলো যোগ চিহ্ন (+) দিয়ে লেখা হয়, আর শক্তির ঘরে প্রতিটি উপাদানের আলাদা পরিমাণ থাকে। দুটোই কীভাবে পড়বেন, এই গাইডে দেখানো হয়েছে।",
      body: [
        { type: "h2", text: "কম্বিনেশন ওষুধ কী" },
        {
          type: "p",
          text: "কম্বিনেশন ওষুধ হলো এমন একটি পণ্য, যার মধ্যে দুই বা তার বেশি সক্রিয় উপাদান থাকে। প্যাকেটে এবং DGDA রেজিস্ট্রিতে এ ধরনের পণ্যের জেনেরিক নামে সব উপাদানের নাম যোগ চিহ্ন (+) দিয়ে লেখা থাকে। প্রতিটি উপাদানের শক্তিও আলাদাভাবে দেওয়া থাকে।",
        },
        {
          type: "p",
          text: "যেমন, এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে \"Caffeine + Paracetamol\" নামে একটি জেনেরিক আছে। এই জেনেরিকের একটি পণ্যের শক্তি লেখা আছে \"65 mg + 500 mg\": দুটি উপাদানের প্রতিটির জন্য একটি করে পরিমাণ।",
        },
        { type: "h2", text: "নাম কীভাবে লেখা হয়" },
        {
          type: "ul",
          items: [
            "উপাদানগুলো \"+\" দিয়ে আলাদা করা থাকে। \"Caffeine + Paracetamol\" মানে পণ্যটিতে ক্যাফেইন ও প্যারাসিটামল দুটোই আছে।",
            "প্যাকেট আর রেজিস্ট্রিতে নামের ক্রম ভিন্ন হতে পারে। প্যাকেটে \"Paracetamol + Caffeine\" আর রেজিস্ট্রিতে \"Caffeine + Paracetamol\" লেখা থাকলেও দুটো একই কম্বিনেশন।",
            "কিছু কম্বিনেশনে তিন বা তার বেশি উপাদান থাকে, তাই নাম বেশ লম্বা হতে পারে, যেমন রেজিস্ট্রিতে \"Abacavir + Lamivudine + Zidovudine\"।",
            "লবণের নাম উপাদানের নামেরই অংশ, যেমন \"Metformin Hydrochloride\" বা \"Bisoprolol Hemifumarate\"। এগুলোকে দুটি নয়, একটি উপাদান হিসেবে পড়ুন।",
          ],
        },
        { type: "h2", text: "শক্তি কীভাবে মেলাবেন" },
        {
          type: "p",
          text: "কম্বিনেশন পণ্যের শক্তি হলো \"+\" দিয়ে আলাদা করা কয়েকটি পরিমাণের তালিকা। এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে কম্বিনেশন পণ্যের শক্তিতে প্রতিটি উপাদানের জন্য একটি করে অংশ থাকে, এবং অংশগুলো জেনেরিক নামের উপাদানের ক্রম অনুযায়ীই সাজানো।",
        },
        {
          type: "ol",
          items: [
            "এই সাইটের ওষুধের পাতায় উপাদানের নাম যে ক্রমে আছে, সেভাবে লিখে নিন।",
            "প্রতিটি \"+\" চিহ্নে ভাগ করে শক্তির অংশগুলোও একই ক্রমে লিখুন।",
            "জোড়া মিলান: প্রথম নামের সঙ্গে প্রথম পরিমাণ, দ্বিতীয়টির সঙ্গে দ্বিতীয়টি, এভাবে।",
            "প্রতিটি অংশের একক খেয়াল করুন। একটি অংশ mg-তে আর আরেকটি mcg-তে থাকতে পারে, কিংবা তরল ওষুধে প্রতি mL-এ পরিমাণ লেখা থাকতে পারে।",
          ],
        },
        {
          type: "p",
          text: "ওপরের উদাহরণে \"Caffeine + Paracetamol\" আর \"65 mg + 500 mg\" মেলালে Caffeine-এর সঙ্গে 65 mg এবং Paracetamol-এর সঙ্গে 500 mg মেলে। প্যাকেটে ক্রম আলাদা হলে অবস্থান দেখে নয়, নাম দেখে পরিমাণ মেলান; নিশ্চিত না হলে ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        { type: "h2", text: "একই উপাদান, ভিন্ন পণ্য" },
        {
          type: "p",
          text: "দুটি পণ্যে একই উপাদান থাকলেও তাদের শক্তি, ডোজ ফর্ম বা প্রস্তুতকারক ভিন্ন হতে পারে। এই সাইটে প্রতিটি জেনেরিকের পাতায় ওই জেনেরিকের সব নিবন্ধিত পণ্য দেখা যায়, ফলে প্রত্যেকটির শক্তি, ফর্ম ও প্রস্তুতকারক মিলিয়ে দেখতে পারবেন। কম্বিনেশন তার একক উপাদানগুলো থেকে আলাদা জেনেরিক: \"Caffeine + Paracetamol\" ও \"Paracetamol\"-এর পাতা আলাদা।",
        },
        { type: "link", href: routes.generic("caffeine-paracetamol"), label: "Caffeine + Paracetamol: নিবন্ধিত পণ্যগুলো" },
        { type: "link", href: routes.generic("paracetamol"), label: "Paracetamol: নিবন্ধিত পণ্যগুলো" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "ওষুধের শক্তি (mg, mg/mL, %) কীভাবে পড়বেন" },
        {
          type: "note",
          text: "এই গাইডে শুধু লেবেল কীভাবে লেখা হয় তা বোঝানো হয়েছে। কোনো কম্বিনেশন কীসের জন্য বা একটি পণ্যের বদলে আরেকটি চলবে কিনা, তা এখানে বলা হয়নি। যেকোনো ওষুধ নিয়ে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "জেনেরিক নামে \"+\" চিহ্নের মানে কী?",
          a: "এটি সক্রিয় উপাদানগুলোকে আলাদা করে। \"Caffeine + Paracetamol\" নামের পণ্যে ক্যাফেইন ও প্যারাসিটামল দুটোই আছে।",
        },
        {
          q: "কোন শক্তি কোন উপাদানের, বুঝব কীভাবে?",
          a: "এই সাইটে শক্তির অংশগুলো উপাদানের নামের ক্রম অনুযায়ী সাজানো। প্যাকেটে নাম দেখে পরিমাণ মেলান। পরিষ্কার না হলে ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        {
          q: "\"Paracetamol + Caffeine\" আর \"Caffeine + Paracetamol\" কি একই?",
          a: "হ্যাঁ, দুটো নামেই একই উপাদানের কম্বিনেশন বোঝায়; শুধু লেখার ক্রম আলাদা। তবে পণ্যভেদে প্রতিটি উপাদানের পরিমাণ ভিন্ন হতে পারে, তাই শক্তি মিলিয়ে দেখুন।",
        },
        {
          q: "কম্বিনেশন পণ্যের বদলে কি আলাদা আলাদা একক উপাদানের ওষুধ নেওয়া যায়?",
          a: "এই সাইট এ ধরনের পরামর্শ দেয় না। কোনো ওষুধ বদলানোর আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
