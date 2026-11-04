import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const readMedicineStrength: Guide = {
  slug: "read-medicine-strength",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to read medicine strength: mg, mcg, mg/mL, %",
      description:
        "What mg, mcg, gm, mg/mL, mg/5 mL, % and IU mean on a medicine pack, with simple unit arithmetic. Label reading only, not dosing advice.",
      summary:
        "The strength on a pack tells you how much active ingredient is in each unit or in a set amount of liquid, cream or powder. This guide explains the units you will see, so you can match a pack to the right registry entry.",
      body: [
        { type: "h2", text: "What \"strength\" means" },
        {
          type: "p",
          text: "Strength is the amount of active ingredient in the product. For a tablet or capsule it is usually the amount in one piece. For a liquid, cream or injection it is usually the amount in a given volume or weight. Strength describes the product. It is not an instruction about how much to take.",
        },
        { type: "h2", text: "Units of weight: mg, mcg, gm" },
        {
          type: "ul",
          items: [
            "mg: milligram, one thousandth of a gram. \"500 mg\" means 500 milligrams of active ingredient.",
            "mcg (also written µg): microgram, one thousandth of a milligram. 1 mg = 1,000 mcg.",
            "g or gm: gram. 1 g = 1,000 mg. The DGDA registry often writes grams as \"gm\".",
          ],
        },
        {
          type: "p",
          text: "Because these units differ by a factor of a thousand, the unit matters as much as the number. 250 mcg and 250 mg are very different amounts, so always read the unit as well as the figure.",
        },
        { type: "h2", text: "Liquids: mg/mL and mg/5 mL" },
        {
          type: "p",
          text: "For syrups, suspensions, drops and many injections, strength is written as an amount per volume. mL means millilitre.",
        },
        {
          type: "ul",
          items: [
            "mg/mL: milligrams in each millilitre of liquid. \"80 mg/mL\" means each 1 mL contains 80 mg.",
            "mg/5 mL: milligrams in every 5 mL. \"120 mg/5 mL\" means each 5 mL contains 120 mg; as arithmetic, that is the same concentration as 24 mg/mL.",
            "gm/100 mL or mg/vial: amount in a whole bottle, bag or vial, common for infusions and injections.",
          ],
        },
        {
          type: "p",
          text: "Two liquids of the same generic can have different concentrations, so check whether a label says per mL, per 5 mL or per bottle before comparing them.",
        },
        { type: "h2", text: "Percentages: %" },
        {
          type: "p",
          text: "Creams, ointments, gels, eye drops and some solutions are often labelled with a percentage. A percentage is an amount per 100: 1% in a cream means 1 g of active ingredient in every 100 g of cream, which the registry sometimes writes as \"1 gm/100 gm\". For a solution it usually means grams per 100 mL. For example, the registry lists a 0.9% sodium chloride saline with a strength of 9 mg/mL: 0.9 g per 100 mL is 900 mg per 100 mL, which is 9 mg per mL.",
        },
        { type: "h2", text: "IU: International Units" },
        {
          type: "p",
          text: "Some substances, such as certain vitamins, hormones and vaccines, are measured in IU (International Units) instead of milligrams. An IU is defined separately for each substance, so IU cannot be converted to mg with one general rule. Compare IU only with IU for the same ingredient.",
        },
        { type: "h2", text: "Combination products" },
        {
          type: "p",
          text: "When a product contains more than one ingredient, the strength lists an amount for each, usually in the same order as the ingredients in the generic name. For example, a strength of \"65 mg + 500 mg\" on a product whose generic is Caffeine + Paracetamol would mean 65 mg of the first ingredient and 500 mg of the second.",
        },
        { type: "link", href: routes.guide("combination-medicines-label"), label: "Reading combination medicines" },
        { type: "link", href: routes.generic("paracetamol"), label: "See the strengths registered for Paracetamol" },
        { type: "link", href: routes.search(), label: "Search a brand to check its registered strength" },
        {
          type: "note",
          text: "Reading a strength tells you what is in a pack, not how much to take. For how much to take and how often, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Is mcg the same as mg?",
          a: "No. A microgram (mcg) is one thousandth of a milligram (mg). 1 mg = 1,000 mcg.",
        },
        {
          q: "What does 120 mg/5 mL mean?",
          a: "Every 5 mL of the liquid contains 120 mg of the active ingredient. It describes concentration, not an amount to take.",
        },
        {
          q: "What does 1% mean on a cream?",
          a: "1 g of active ingredient in every 100 g of the cream.",
        },
        {
          q: "Can I convert IU to mg?",
          a: "Not with one general rule. An IU is defined separately for each substance.",
        },
        {
          q: "My pack's strength differs from the one I had before. What should I do?",
          a: "Do not adjust anything yourself. Show both packs to a registered pharmacist or your doctor.",
        },
      ],
    },
    bn: {
      title: "ওষুধের শক্তি (mg, mg/mL, %) কীভাবে পড়বেন",
      description:
        "ওষুধের প্যাকেটে mg, mcg, gm, mg/mL, mg/5 mL, % ও IU মানে কী, সহজ হিসাবসহ। শুধু লেবেল পড়ার নির্দেশিকা, ডোজের পরামর্শ নয়।",
      summary:
        "প্যাকেটে লেখা শক্তি জানায় প্রতিটি ইউনিটে, অথবা নির্দিষ্ট পরিমাণ তরল, ক্রিম বা পাউডারে কতটা সক্রিয় উপাদান আছে। এখানে এককগুলো বোঝানো হয়েছে, যাতে প্যাকেটের সঙ্গে সঠিক রেজিস্ট্রি এন্ট্রি মেলাতে পারেন।",
      body: [
        { type: "h2", text: "\"শক্তি\" মানে কী" },
        {
          type: "p",
          text: "শক্তি (স্ট্রেংথ) হলো পণ্যে থাকা সক্রিয় উপাদানের পরিমাণ। ট্যাবলেট বা ক্যাপসুলের ক্ষেত্রে সাধারণত এটি একটি পিসে থাকা পরিমাণ। তরল, ক্রিম বা ইনজেকশনের ক্ষেত্রে সাধারণত নির্দিষ্ট আয়তন বা ওজনে থাকা পরিমাণ। শক্তি পণ্যের বিবরণ, কতটা খেতে হবে তার নির্দেশ নয়।",
        },
        { type: "h2", text: "ওজনের একক: mg, mcg, gm" },
        {
          type: "ul",
          items: [
            "mg: মিলিগ্রাম, এক গ্রামের হাজার ভাগের এক ভাগ। \"500 mg\" মানে 500 মিলিগ্রাম সক্রিয় উপাদান।",
            "mcg (µg-ও লেখা হয়): মাইক্রোগ্রাম, এক মিলিগ্রামের হাজার ভাগের এক ভাগ। 1 mg = 1,000 mcg।",
            "g বা gm: গ্রাম। 1 g = 1,000 mg। DGDA রেজিস্ট্রিতে গ্রাম প্রায়ই \"gm\" লেখা থাকে।",
          ],
        },
        {
          type: "p",
          text: "এই এককগুলোর মধ্যে হাজার গুণ পার্থক্য, তাই সংখ্যার মতোই একক গুরুত্বপূর্ণ। 250 mcg আর 250 mg একেবারে আলাদা পরিমাণ, তাই সংখ্যার সঙ্গে এককটিও সবসময় পড়ুন।",
        },
        { type: "h2", text: "তরল: mg/mL ও mg/5 mL" },
        {
          type: "p",
          text: "সিরাপ, সাসপেনশন, ড্রপ ও অনেক ইনজেকশনে শক্তি লেখা হয় নির্দিষ্ট আয়তনে কত পরিমাণ, সেভাবে। mL মানে মিলিলিটার।",
        },
        {
          type: "ul",
          items: [
            "mg/mL: প্রতি মিলিলিটার তরলে কত মিলিগ্রাম। \"80 mg/mL\" মানে প্রতি 1 mL-এ 80 mg।",
            "mg/5 mL: প্রতি 5 mL-এ কত মিলিগ্রাম। \"120 mg/5 mL\" মানে প্রতি 5 mL-এ 120 mg; হিসাব করলে এটি 24 mg/mL-এর সমান ঘনত্ব।",
            "gm/100 mL বা mg/vial: পুরো বোতল, ব্যাগ বা ভায়ালে কত পরিমাণ; ইনফিউশন ও ইনজেকশনে এভাবে প্রায়ই লেখা থাকে।",
          ],
        },
        {
          type: "p",
          text: "একই জেনেরিকের দুটি তরলের ঘনত্ব আলাদা হতে পারে, তাই তুলনা করার আগে দেখুন লেবেলে প্রতি mL, প্রতি 5 mL নাকি পুরো বোতলের হিসাব লেখা।",
        },
        { type: "h2", text: "শতাংশ: %" },
        {
          type: "p",
          text: "ক্রিম, মলম, জেল, চোখের ড্রপ ও কিছু দ্রবণে প্রায়ই শতাংশ লেখা থাকে। শতাংশ মানে প্রতি 100-তে কত: ক্রিমে 1% মানে প্রতি 100 g ক্রিমে 1 g সক্রিয় উপাদান, যা রেজিস্ট্রিতে কখনো \"1 gm/100 gm\" লেখা থাকে। দ্রবণের ক্ষেত্রে সাধারণত এর মানে প্রতি 100 mL-এ কত গ্রাম। যেমন, রেজিস্ট্রিতে 0.9% সোডিয়াম ক্লোরাইড স্যালাইনের শক্তি লেখা 9 mg/mL: 100 mL-এ 0.9 g মানে 100 mL-এ 900 mg, অর্থাৎ প্রতি mL-এ 9 mg।",
        },
        { type: "h2", text: "IU: ইন্টারন্যাশনাল ইউনিট" },
        {
          type: "p",
          text: "কিছু উপাদান, যেমন কয়েকটি ভিটামিন, হরমোন ও টিকা, মিলিগ্রামের বদলে IU (International Unit) এককে মাপা হয়। প্রতিটি উপাদানের জন্য IU আলাদাভাবে নির্ধারিত, তাই একটি সাধারণ নিয়মে IU-কে mg-তে রূপান্তর করা যায় না। একই উপাদানের ক্ষেত্রে শুধু IU-র সঙ্গে IU তুলনা করুন।",
        },
        { type: "h2", text: "কম্বিনেশন পণ্য" },
        {
          type: "p",
          text: "কোনো পণ্যে একাধিক উপাদান থাকলে শক্তিতে প্রতিটির পরিমাণ আলাদা লেখা থাকে, সাধারণত জেনেরিক নামের উপাদানের ক্রম অনুযায়ী। যেমন, যে পণ্যের জেনেরিক Caffeine + Paracetamol, তার শক্তি \"65 mg + 500 mg\" লেখা থাকলে বোঝায় প্রথম উপাদান 65 mg আর দ্বিতীয়টি 500 mg।",
        },
        { type: "link", href: routes.guide("combination-medicines-label"), label: "কম্বিনেশন ওষুধের লেবেল কীভাবে পড়বেন" },
        { type: "link", href: routes.generic("paracetamol"), label: "Paracetamol কোন কোন শক্তিতে নিবন্ধিত, দেখুন" },
        { type: "link", href: routes.search(), label: "ব্র্যান্ড খুঁজে তার নিবন্ধিত শক্তি দেখুন" },
        {
          type: "note",
          text: "শক্তি পড়ে জানা যায় প্যাকেটে কী আছে, কতটা খেতে হবে তা নয়। কতটা ও কতবার খাবেন, তা নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "mcg আর mg কি একই?",
          a: "না। এক মাইক্রোগ্রাম (mcg) এক মিলিগ্রামের (mg) হাজার ভাগের এক ভাগ। 1 mg = 1,000 mcg।",
        },
        {
          q: "120 mg/5 mL মানে কী?",
          a: "তরলটির প্রতি 5 mL-এ 120 mg সক্রিয় উপাদান আছে। এটি ঘনত্বের বিবরণ, কতটা খেতে হবে তা নয়।",
        },
        {
          q: "ক্রিমে 1% মানে কী?",
          a: "প্রতি 100 g ক্রিমে 1 g সক্রিয় উপাদান।",
        },
        {
          q: "IU-কে কি mg-তে রূপান্তর করা যায়?",
          a: "একটি সাধারণ নিয়মে যায় না। প্রতিটি উপাদানের জন্য IU আলাদাভাবে নির্ধারিত।",
        },
        {
          q: "আগের প্যাকেটের সঙ্গে নতুন প্যাকেটের শক্তি মিলছে না। কী করব?",
          a: "নিজে থেকে কিছু বদলাবেন না। দুটি প্যাকেটই নিবন্ধিত ফার্মাসিস্ট বা আপনার ডাক্তারকে দেখান।",
        },
      ],
    },
  },
};
