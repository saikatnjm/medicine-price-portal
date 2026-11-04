import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const injectionLabelsIvIm: Guide = {
  slug: "injection-labels-iv-im",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "IV, IM, SC and \"IV infusion\" labels explained",
      description:
        "What IV, IM, SC, IV/IM, IV infusion, vial, ampoule and mg/vial mean on injection labels and in the DGDA registry. Vocabulary only, not instructions.",
      summary:
        "Injection labels are full of short abbreviations. This guide explains what they stand for, so you can read a label or a registry entry. It does not explain how to give an injection.",
      body: [
        { type: "h2", text: "Route abbreviations" },
        {
          type: "p",
          text: "The \"route\" is the way a medicine enters the body. On injections it is usually written as a short abbreviation, either on the pack or as part of the dosage form in the DGDA registry.",
        },
        {
          type: "ul",
          items: [
            "IV: intravenous, meaning into a vein.",
            "IM: intramuscular, meaning into a muscle.",
            "SC (also SQ or \"subcut\"): subcutaneous, meaning into the layer just under the skin.",
            "IV/IM: the product is labelled for either the intravenous or the intramuscular route.",
          ],
        },
        {
          type: "p",
          text: "In the DGDA registry snapshot used on this site, injectable products appear under dosage forms such as \"Injection\", \"IV Injection\", \"IM Injection\", \"IV/IM Injection\", \"IV Infusion\" and \"Solution for Infusion\".",
        },
        { type: "h2", text: "Injection vs infusion" },
        {
          type: "ul",
          items: [
            "Injection: a dose of sterile liquid delivered through a needle, usually over a short time.",
            "Infusion: a larger volume of sterile liquid delivered slowly over a longer time, usually from a bag or bottle through a drip line. \"IV infusion\" means an infusion into a vein.",
          ],
        },
        { type: "h2", text: "Containers and packaging words" },
        {
          type: "ul",
          items: [
            "Vial: a small glass or plastic bottle sealed with a rubber stopper.",
            "Ampoule: a small sealed glass container, usually holding a single dose.",
            "Prefilled syringe: a syringe supplied already filled with the medicine.",
            "Powder for injection: sterile powder in a vial that is made into a liquid before use.",
            "Water for Injection: sterile water, listed in the registry as a product in its own right.",
          ],
        },
        { type: "h2", text: "How strength is written on injections" },
        {
          type: "ul",
          items: [
            "mg/mL: the amount of active ingredient in each millilitre of liquid.",
            "mg/vial or gm/vial: the amount of active ingredient in the whole vial.",
            "gm/100 mL or gm/50 mL: the amount in the whole bag or bottle, common for infusions.",
            "%: an amount per 100 mL. For example, the registry lists a 0.9% sodium chloride saline as 9 mg/mL.",
          ],
        },
        {
          type: "p",
          text: "These describe what is in the container. They are not an amount to be given.",
        },
        { type: "h2", text: "Matching an injection to the registry" },
        {
          type: "p",
          text: "When you look up an injection, match the brand, the generic, the strength and the full dosage form, including the route. An \"IV Infusion\" and an \"IM Injection\" of the same generic are different registered products.",
        },
        { type: "link", href: routes.dosageForms(), label: "Browse injection and infusion dosage forms in the registry" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "How to read medicine strength: mg, mcg, mg/mL, %" },
        { type: "link", href: routes.verify(), label: "Check a pack's brand name or DAR number" },
        {
          type: "note",
          text: "This guide explains label words only. Whether, how and by which route any injection is given is a decision for a registered doctor; ask a doctor or pharmacist about any injection.",
        },
      ],
      faq: [
        {
          q: "What does IV stand for?",
          a: "Intravenous, meaning into a vein.",
        },
        {
          q: "What does IM stand for?",
          a: "Intramuscular, meaning into a muscle.",
        },
        {
          q: "What does SC mean on an injection?",
          a: "Subcutaneous, meaning into the layer just under the skin. It is also written SQ.",
        },
        {
          q: "What is the difference between an IV injection and an IV infusion?",
          a: "Both go into a vein. An injection is usually a smaller volume given over a short time; an infusion is a larger volume given slowly, usually through a drip.",
        },
      ],
    },
    bn: {
      title: "ইনজেকশনের IV, IM, SC লেবেলের অর্থ",
      description:
        "ইনজেকশনের লেবেল ও DGDA রেজিস্ট্রিতে IV, IM, SC, IV/IM, IV ইনফিউশন, ভায়াল, অ্যাম্পুল ও mg/vial মানে কী। শুধু শব্দার্থ, ব্যবহারের নির্দেশনা নয়।",
      summary:
        "ইনজেকশনের লেবেলে অনেক ছোট সংক্ষিপ্ত রূপ থাকে। লেবেল বা রেজিস্ট্রি এন্ট্রি পড়তে সুবিধার জন্য এই গাইডে সেগুলোর অর্থ দেওয়া হলো। ইনজেকশন কীভাবে দিতে হয়, তা এখানে বলা হয়নি।",
      body: [
        { type: "h2", text: "পথ বোঝানোর সংক্ষিপ্ত রূপ" },
        {
          type: "p",
          text: "\"পথ\" (রুট) মানে ওষুধ কোন পথে শরীরে প্রবেশ করে। ইনজেকশনে এটি সাধারণত ছোট সংক্ষিপ্ত রূপে লেখা থাকে, প্যাকেটে অথবা DGDA রেজিস্ট্রির ডোজ ফর্মের অংশ হিসেবে।",
        },
        {
          type: "ul",
          items: [
            "IV: intravenous (ইন্ট্রাভেনাস), অর্থাৎ শিরার ভেতরে।",
            "IM: intramuscular (ইন্ট্রামাসকুলার), অর্থাৎ মাংসপেশির ভেতরে।",
            "SC (SQ বা \"subcut\"-ও লেখা হয়): subcutaneous (সাবকিউটেনিয়াস), অর্থাৎ ত্বকের ঠিক নিচের স্তরে।",
            "IV/IM: পণ্যটি শিরা বা মাংসপেশি, যেকোনো পথের জন্য লেবেল করা।",
          ],
        },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে ইনজেকশনযোগ্য পণ্যগুলো \"Injection\", \"IV Injection\", \"IM Injection\", \"IV/IM Injection\", \"IV Infusion\" ও \"Solution for Infusion\"-এর মতো ডোজ ফর্মে তালিকাভুক্ত।",
        },
        { type: "h2", text: "ইনজেকশন আর ইনফিউশনের পার্থক্য" },
        {
          type: "ul",
          items: [
            "ইনজেকশন: সুচের মাধ্যমে দেওয়া জীবাণুমুক্ত তরল, সাধারণত অল্প সময়ে।",
            "ইনফিউশন: বেশি পরিমাণ জীবাণুমুক্ত তরল, সাধারণত ব্যাগ বা বোতল থেকে ড্রিপ লাইনের মাধ্যমে দীর্ঘ সময় ধরে ধীরে ধীরে দেওয়া হয়। \"IV ইনফিউশন\" মানে শিরায় দেওয়া ইনফিউশন।",
          ],
        },
        { type: "h2", text: "পাত্র ও প্যাকেজিংয়ের শব্দ" },
        {
          type: "ul",
          items: [
            "ভায়াল: রাবারের ছিপি দিয়ে বন্ধ ছোট কাচ বা প্লাস্টিকের বোতল।",
            "অ্যাম্পুল: ছোট, পুরোপুরি বন্ধ কাচের পাত্র, সাধারণত এক ডোজের জন্য।",
            "প্রিফিল্ড সিরিঞ্জ: আগে থেকেই ওষুধ ভরা সিরিঞ্জ।",
            "পাউডার ফর ইনজেকশন: ভায়ালে জীবাণুমুক্ত পাউডার, যা ব্যবহারের আগে তরল বানানো হয়।",
            "Water for Injection: জীবাণুমুক্ত পানি, রেজিস্ট্রিতে যা নিজেই একটি আলাদা পণ্য হিসেবে তালিকাভুক্ত।",
          ],
        },
        { type: "h2", text: "ইনজেকশনের শক্তি কীভাবে লেখা হয়" },
        {
          type: "ul",
          items: [
            "mg/mL: প্রতি মিলিলিটার তরলে সক্রিয় উপাদানের পরিমাণ।",
            "mg/vial বা gm/vial: পুরো ভায়ালে সক্রিয় উপাদানের পরিমাণ।",
            "gm/100 mL বা gm/50 mL: পুরো ব্যাগ বা বোতলে কত পরিমাণ, ইনফিউশনে এভাবে বেশি লেখা হয়।",
            "%: প্রতি 100 mL-এ কত পরিমাণ। যেমন, রেজিস্ট্রিতে 0.9% সোডিয়াম ক্লোরাইড স্যালাইনের শক্তি লেখা 9 mg/mL।",
          ],
        },
        {
          type: "p",
          text: "এগুলো পাত্রে কী আছে তার বিবরণ, কতটা দিতে হবে তা নয়।",
        },
        { type: "h2", text: "ইনজেকশনের সঙ্গে রেজিস্ট্রি মেলানো" },
        {
          type: "p",
          text: "কোনো ইনজেকশন খোঁজার সময় ব্র্যান্ড, জেনেরিক, শক্তি এবং পথসহ পুরো ডোজ ফর্ম মিলিয়ে নিন। একই জেনেরিকের \"IV Infusion\" আর \"IM Injection\" আলাদা নিবন্ধিত পণ্য।",
        },
        { type: "link", href: routes.dosageForms(), label: "রেজিস্ট্রিতে ইনজেকশন ও ইনফিউশনের ডোজ ফর্ম দেখুন" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "ওষুধের শক্তি (mg, mg/mL, %) কীভাবে পড়বেন" },
        { type: "link", href: routes.verify(), label: "প্যাকেটের ব্র্যান্ড নাম বা DAR নম্বর যাচাই করুন" },
        {
          type: "note",
          text: "এই গাইডে শুধু লেবেলের শব্দ বোঝানো হয়েছে। কোনো ইনজেকশন দেওয়া হবে কিনা, কীভাবে ও কোন পথে, তা নিবন্ধিত ডাক্তারের সিদ্ধান্ত; যেকোনো ইনজেকশন নিয়ে ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "IV মানে কী?",
          a: "Intravenous, অর্থাৎ শিরার ভেতরে।",
        },
        {
          q: "IM মানে কী?",
          a: "Intramuscular, অর্থাৎ মাংসপেশির ভেতরে।",
        },
        {
          q: "ইনজেকশনে SC লেখা থাকলে কী বোঝায়?",
          a: "Subcutaneous, অর্থাৎ ত্বকের ঠিক নিচের স্তরে। একে SQ-ও লেখা হয়।",
        },
        {
          q: "IV ইনজেকশন আর IV ইনফিউশনের পার্থক্য কী?",
          a: "দুটিই শিরায় যায়। ইনজেকশন সাধারণত অল্প পরিমাণ, অল্প সময়ে দেওয়া হয়; ইনফিউশন বেশি পরিমাণ, সাধারণত ড্রিপের মাধ্যমে ধীরে ধীরে।",
        },
      ],
    },
  },
};
