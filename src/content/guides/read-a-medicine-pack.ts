import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const readAMedicinePack: Guide = {
  slug: "read-a-medicine-pack",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to read a medicine pack: brand, generic, strength, DAR, batch, expiry",
      description:
        "A field-by-field guide to a medicine pack: brand and generic name, strength, form, maker, DAR number, batch number and dates, and what you can check here.",
      summary:
        "A medicine box or strip carries a lot of small print. This guide walks through the details most packs show, what each one means, and which of them you can compare with the DGDA registry snapshot on this site.",
      body: [
        { type: "h2", text: "The main names" },
        {
          type: "ul",
          items: [
            "Brand name (trade name): usually the largest text on the pack. It is the name the company gives its product.",
            "Generic name: the active ingredient or ingredients, often printed under or near the brand name. Combination products list several ingredients joined with \"+\".",
            "Manufacturer: the pharmaceutical company that makes the product, usually shown with its logo and address.",
          ],
        },
        {
          type: "p",
          text: "Different companies can sell the same generic under different brand names, so the generic name is the part that tells you what the product contains.",
        },
        { type: "link", href: routes.guide("generic-vs-brand-name"), label: "Generic name vs brand name: what's the difference?" },
        { type: "h2", text: "Strength and dosage form" },
        {
          type: "ul",
          items: [
            "Strength: how much active ingredient the product contains, for example \"500 mg\" per tablet, or an amount per mL for liquids. Combination products show one amount per ingredient.",
            "Dosage form: the physical form of the product, such as tablet, capsule, syrup, suspension, cream, drops or injection.",
            "Letters after the name or form, such as XR, SR or ER, are part of how the product is described. They do not change the generic name.",
          ],
        },
        { type: "h2", text: "Registration number" },
        {
          type: "p",
          text: "Many packs print a registration number, often labelled \"DAR No.\" or similar. In the national DGDA drug registry, each registered product is identified by its DAR number together with its brand name. This is the number you can look up in the registry snapshot on this site.",
        },
        { type: "link", href: routes.verify(), label: "Look up a DAR number or brand in the registry snapshot" },
        { type: "h2", text: "Batch number and dates" },
        {
          type: "ul",
          items: [
            "Batch or lot number: often labelled \"Batch No.\", \"B. No.\" or \"Lot\". It identifies the production batch the pack came from. Keep it if you ever need to report a problem with the product.",
            "Manufacturing date: often labelled \"Mfg\", \"MFD\" or \"Mfg. Date\".",
            "Expiry date: often labelled \"Exp\" or \"EXP\". Do not use a medicine past its expiry date; ask a pharmacist what to do with it.",
          ],
        },
        {
          type: "p",
          text: "The registry snapshot does not contain batch numbers or dates. Those are printed for each production run, so you can only read them from the pack itself.",
        },
        { type: "h2", text: "A simple check routine" },
        {
          type: "ol",
          items: [
            "Read the brand name, generic name, strength and form on the pack.",
            "Search the brand name or DAR number on this site.",
            "Compare the generic, strength, form and manufacturer with the registry entry.",
            "Read the expiry date and make sure the pack is not damaged or opened.",
            "If anything does not match or looks wrong, ask the pharmacist, and consider reporting it to DGDA.",
          ],
        },
        {
          type: "p",
          text: "A match with the registry snapshot shows that a product with those details was registered. It does not prove that a particular physical pack is genuine.",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "How to report a suspected fake or substandard medicine to DGDA" },
        {
          type: "note",
          text: "Reading a pack is not the same as knowing how to use the medicine. For how to take a medicine, or whether it suits you, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Which name on the pack tells me what the medicine contains?",
          a: "The generic name. The brand name is the company's product name; the generic name lists the active ingredient or ingredients.",
        },
        {
          q: "Where is the DAR number on a pack?",
          a: "It varies by pack. Many packs print it near the manufacturer's details, labelled \"DAR No.\" or similar. If you cannot find it, ask the pharmacist.",
        },
        {
          q: "Can this site check my batch number or expiry date?",
          a: "No. The registry snapshot has no batch numbers or dates; read them from the pack.",
        },
        {
          q: "If the pack matches the registry, is it definitely genuine?",
          a: "No. A match only shows that a product with those details was registered. If you suspect a fake, report it to DGDA and ask a pharmacist.",
        },
      ],
    },
    bn: {
      title: "ওষুধের প্যাকেট কীভাবে পড়বেন",
      description:
        "ওষুধের প্যাকেটের প্রতিটি তথ্যের ব্যাখ্যা: ব্র্যান্ড ও জেনেরিক নাম, শক্তি, ফর্ম, প্রস্তুতকারক, DAR নম্বর, ব্যাচ নম্বর ও তারিখ, এবং এখানে কী যাচাই করা যায়।",
      summary:
        "ওষুধের বাক্স বা পাতায় অনেক ছোট লেখা থাকে। বেশিরভাগ প্যাকেটে কোন কোন তথ্য থাকে, প্রতিটির মানে কী, আর এর কোনগুলো এই সাইটের DGDA রেজিস্ট্রি স্ন্যাপশটের সঙ্গে মিলিয়ে দেখা যায়, এই গাইডে তা ধাপে ধাপে দেখানো হয়েছে।",
      body: [
        { type: "h2", text: "প্রধান নামগুলো" },
        {
          type: "ul",
          items: [
            "ব্র্যান্ড নাম (ট্রেড নাম): সাধারণত প্যাকেটের সবচেয়ে বড় লেখা। কোম্পানি তার পণ্যের যে নাম দেয়, সেটিই ব্র্যান্ড নাম।",
            "জেনেরিক নাম: সক্রিয় উপাদান বা উপাদানগুলোর নাম, প্রায়ই ব্র্যান্ড নামের নিচে বা পাশে ছাপা থাকে। কম্বিনেশন পণ্যে একাধিক উপাদান \"+\" দিয়ে লেখা থাকে।",
            "প্রস্তুতকারক: যে ওষুধ কোম্পানি পণ্যটি তৈরি করে, সাধারণত লোগো ও ঠিকানাসহ দেওয়া থাকে।",
          ],
        },
        {
          type: "p",
          text: "একই জেনেরিক বিভিন্ন কোম্পানি ভিন্ন ভিন্ন ব্র্যান্ড নামে বিক্রি করতে পারে। তাই পণ্যে আসলে কী আছে, তা জানায় জেনেরিক নাম।",
        },
        { type: "link", href: routes.guide("generic-vs-brand-name"), label: "জেনেরিক নাম ও ব্র্যান্ড নামের পার্থক্য" },
        { type: "h2", text: "শক্তি ও ডোজ ফর্ম" },
        {
          type: "ul",
          items: [
            "শক্তি (স্ট্রেংথ): পণ্যে কতটুকু সক্রিয় উপাদান আছে, যেমন প্রতি ট্যাবলেটে \"500 mg\", কিংবা তরল ওষুধে প্রতি mL-এ কত। কম্বিনেশন পণ্যে প্রতিটি উপাদানের আলাদা পরিমাণ থাকে।",
            "ডোজ ফর্ম: পণ্যের বাহ্যিক রূপ, যেমন ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন, ক্রিম, ড্রপস বা ইনজেকশন।",
            "নাম বা ফর্মের পরে XR, SR, ER-এর মতো অক্ষর পণ্যের বর্ণনার অংশ। এতে জেনেরিক নাম বদলায় না।",
          ],
        },
        { type: "h2", text: "নিবন্ধন নম্বর" },
        {
          type: "p",
          text: "অনেক প্যাকেটে একটি নিবন্ধন নম্বর ছাপা থাকে, প্রায়ই \"DAR No.\" বা এ রকম কিছু লেখা থাকে। জাতীয় DGDA ওষুধ রেজিস্ট্রিতে প্রতিটি নিবন্ধিত পণ্যকে তার DAR নম্বর ও ব্র্যান্ড নাম দিয়ে চেনা হয়। এই সাইটের রেজিস্ট্রি স্ন্যাপশটে এই নম্বর দিয়েই খোঁজা যায়।",
        },
        { type: "link", href: routes.verify(), label: "রেজিস্ট্রি স্ন্যাপশটে DAR নম্বর বা ব্র্যান্ড খুঁজুন" },
        { type: "h2", text: "ব্যাচ নম্বর ও তারিখ" },
        {
          type: "ul",
          items: [
            "ব্যাচ বা লট নম্বর: প্রায়ই \"Batch No.\", \"B. No.\" বা \"Lot\" লেখা থাকে। প্যাকেটটি কোন উৎপাদন ব্যাচের, তা এতে বোঝা যায়। পণ্য নিয়ে কখনো অভিযোগ জানাতে হলে এই নম্বরটি কাজে লাগবে, তাই রেখে দিন।",
            "উৎপাদনের তারিখ: প্রায়ই \"Mfg\", \"MFD\" বা \"Mfg. Date\" লেখা থাকে।",
            "মেয়াদোত্তীর্ণের তারিখ: প্রায়ই \"Exp\" বা \"EXP\" লেখা থাকে। মেয়াদ পেরিয়ে যাওয়া ওষুধ ব্যবহার করবেন না; সেটি নিয়ে কী করবেন, ফার্মাসিস্টকে জিজ্ঞেস করুন।",
          ],
        },
        {
          type: "p",
          text: "রেজিস্ট্রি স্ন্যাপশটে ব্যাচ নম্বর বা তারিখ থাকে না। এগুলো প্রতিটি উৎপাদনের জন্য আলাদাভাবে ছাপা হয়, তাই শুধু প্যাকেট দেখেই পড়া যায়।",
        },
        { type: "h2", text: "যাচাইয়ের সহজ ধাপ" },
        {
          type: "ol",
          items: [
            "প্যাকেটের ব্র্যান্ড নাম, জেনেরিক নাম, শক্তি ও ফর্ম পড়ুন।",
            "এই সাইটে ব্র্যান্ড নাম বা DAR নম্বর দিয়ে খুঁজুন।",
            "রেজিস্ট্রি এন্ট্রির সঙ্গে জেনেরিক, শক্তি, ফর্ম ও প্রস্তুতকারক মিলিয়ে দেখুন।",
            "মেয়াদোত্তীর্ণের তারিখ পড়ুন এবং প্যাকেটটি ছেঁড়া বা খোলা কিনা দেখুন।",
            "কিছু না মিললে বা সন্দেহজনক মনে হলে ফার্মাসিস্টকে জিজ্ঞেস করুন, এবং DGDA-তে জানানোর কথা ভাবুন।",
          ],
        },
        {
          type: "p",
          text: "রেজিস্ট্রি স্ন্যাপশটের সঙ্গে মিলে গেলে বোঝা যায়, ওই তথ্যের একটি পণ্য নিবন্ধিত হয়েছিল। এতে আপনার হাতের নির্দিষ্ট প্যাকেটটি আসল কিনা, তা প্রমাণ হয় না।",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন" },
        {
          type: "note",
          text: "প্যাকেট পড়তে পারা আর ওষুধ কীভাবে ব্যবহার করতে হয় তা জানা এক কথা নয়। কোনো ওষুধ কীভাবে খাবেন বা সেটি আপনার জন্য উপযুক্ত কিনা, তা নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "প্যাকেটের কোন নাম দেখে বুঝব ওষুধে কী আছে?",
          a: "জেনেরিক নাম। ব্র্যান্ড নাম হলো কোম্পানির দেওয়া পণ্যের নাম; জেনেরিক নামে সক্রিয় উপাদানগুলোর নাম থাকে।",
        },
        {
          q: "প্যাকেটে DAR নম্বর কোথায় থাকে?",
          a: "প্যাকেটভেদে আলাদা। অনেক প্যাকেটে প্রস্তুতকারকের তথ্যের কাছে \"DAR No.\" বা এ রকম লেখার পাশে থাকে। খুঁজে না পেলে ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        {
          q: "এই সাইট কি আমার ব্যাচ নম্বর বা মেয়াদ যাচাই করতে পারে?",
          a: "না। রেজিস্ট্রি স্ন্যাপশটে ব্যাচ নম্বর বা তারিখ নেই; এগুলো প্যাকেট থেকেই পড়ুন।",
        },
        {
          q: "প্যাকেট রেজিস্ট্রির সঙ্গে মিলে গেলে কি নিশ্চিতভাবে আসল?",
          a: "না। মিলে যাওয়া মানে শুধু ওই তথ্যের একটি পণ্য নিবন্ধিত হয়েছিল। নকল সন্দেহ হলে DGDA-তে জানান এবং ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
    },
  },
};
