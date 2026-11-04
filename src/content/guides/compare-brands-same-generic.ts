import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const compareBrandsSameGeneric: Guide = {
  slug: "compare-brands-same-generic",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to compare brands of the same generic (strength, form, maker)",
      description:
        "Two brands share a generic name. How to compare their strength, dosage form, manufacturer and DAR number using registry facts, and why to ask before switching.",
      summary:
        "Many brands contain the same active ingredient. This guide shows which registry facts you can line up side by side, what they tell you, and where comparing should stop and a professional should take over.",
      body: [
        { type: "h2", text: "What \"same generic\" means" },
        {
          type: "p",
          text: "Two products have the same generic when the registry lists the same active ingredient (or the same combination of ingredients) for both. They can still differ in strength, dosage form and manufacturer, so the generic name alone is never enough to say two packs are the same product.",
        },
        { type: "h2", text: "The four facts to compare" },
        { type: "p", text: "Every medicine page on this site shows these registry facts. Compare them one by one:" },
        {
          type: "ol",
          items: [
            "Generic name: check that the full generic name matches, including every ingredient of a combination. \"Paracetamol\" and \"Caffeine + Paracetamol\" are different generics.",
            "Strength: the amount of active ingredient, for example 500 mg per tablet or 120 mg/5 mL for a liquid. The same generic is often registered in several strengths.",
            "Dosage form: tablet, capsule, syrup, suspension, injection and so on. Forms such as XR, SR or ER tablets are different forms from a plain tablet.",
            "Manufacturer: the company that holds the registration. Each brand is registered by its own manufacturer.",
          ],
        },
        {
          type: "p",
          text: "The DAR number identifies one exact registry entry. If two packs show different DAR numbers, they are different registered products, even if the brand name looks similar.",
        },
        { type: "link", href: routes.compare(), label: "Put up to four medicines side by side on the compare page" },
        { type: "h2", text: "A worked example" },
        {
          type: "p",
          text: "Suppose you have two packs whose generic is Paracetamol. Pack A says 500 mg tablet; pack B says 665 mg tablet. They share a generic but not a strength. If pack B instead said 120 mg/5 mL suspension, the dosage form would differ too. Only when generic, strength and dosage form all match are you looking at directly comparable registry entries, and even then they come from different manufacturers under different DAR numbers.",
        },
        { type: "h2", text: "What a comparison here cannot tell you" },
        {
          type: "ul",
          items: [
            "Prices: this site shows no prices, because none have been verified.",
            "Quality or effectiveness: the registry does not rank brands, and neither do we.",
            "Availability: whether a product is in stock at a particular pharmacy.",
            "Whether a product is right for you: that depends on your health, which only a doctor or pharmacist can assess.",
          ],
        },
        { type: "h2", text: "Before you switch brands" },
        {
          type: "p",
          text: "Matching registry facts are a starting point for a conversation, not a decision. Take both packs, or their brand names and strengths, to a registered pharmacist or the doctor who prescribed the medicine, and ask whether a change is appropriate for you.",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "Example: all Paracetamol products in the registry snapshot" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "How to read medicine strength: mg, mcg, mg/mL, %" },
        {
          type: "note",
          text: "Never switch, combine or stop medicines based on a comparison alone. Ask a registered doctor or pharmacist first.",
        },
      ],
      faq: [
        {
          q: "If two brands have the same generic and strength, are they identical?",
          a: "They list the same active ingredient and amount, but they are separate registered products from different manufacturers. Ask a registered doctor or pharmacist before replacing one with the other.",
        },
        {
          q: "Can I compare prices of brands here?",
          a: "No. This site shows no prices, because none have been verified.",
        },
        {
          q: "Why does the dosage form matter when comparing?",
          a: "A tablet, a syrup and an extended-release tablet of the same generic are registered as different products. A comparison only lines up like with like when the form matches.",
        },
        {
          q: "Where do the facts on the compare page come from?",
          a: "From the DGDA registry snapshot used on this site: generic, strength, dosage form, manufacturer and DAR number.",
        },
      ],
    },
    bn: {
      title: "একই জেনেরিকের ব্র্যান্ড কীভাবে তুলনা করবেন",
      description:
        "দুটি ব্র্যান্ডের জেনেরিক নাম এক। রেজিস্ট্রির তথ্য দিয়ে শক্তি, ডোজ ফর্ম, প্রস্তুতকারক ও DAR নম্বর কীভাবে মেলাবেন, আর বদলানোর আগে কেন জিজ্ঞেস করবেন।",
      summary:
        "অনেক ব্র্যান্ডে একই সক্রিয় উপাদান থাকে। রেজিস্ট্রির কোন তথ্যগুলো পাশাপাশি মেলানো যায়, সেগুলো কী জানায়, আর কোথায় তুলনা থামিয়ে পেশাজীবীর পরামর্শ নিতে হবে, এই গাইডে তা দেখানো হয়েছে।",
      body: [
        { type: "h2", text: "\"একই জেনেরিক\" মানে কী" },
        {
          type: "p",
          text: "রেজিস্ট্রিতে দুটি পণ্যের জন্য একই সক্রিয় উপাদান (বা উপাদানের একই কম্বিনেশন) লেখা থাকলে বলা হয় তাদের জেনেরিক এক। তবুও তাদের শক্তি, ডোজ ফর্ম ও প্রস্তুতকারক আলাদা হতে পারে। তাই শুধু জেনেরিক নাম দেখে দুটি প্যাকেটকে একই পণ্য বলা যায় না।",
        },
        { type: "h2", text: "যে চারটি তথ্য মেলাবেন" },
        { type: "p", text: "এই সাইটের প্রতিটি ওষুধের পাতায় রেজিস্ট্রির এই তথ্যগুলো থাকে। একটি একটি করে মিলিয়ে দেখুন:" },
        {
          type: "ol",
          items: [
            "জেনেরিক নাম: পুরো জেনেরিক নাম মিলছে কিনা দেখুন, কম্বিনেশন হলে প্রতিটি উপাদানসহ। \"Paracetamol\" আর \"Caffeine + Paracetamol\" দুটি আলাদা জেনেরিক।",
            "শক্তি: সক্রিয় উপাদানের পরিমাণ, যেমন প্রতি ট্যাবলেটে 500 mg, বা তরলের ক্ষেত্রে 120 mg/5 mL। একই জেনেরিক প্রায়ই কয়েকটি শক্তিতে নিবন্ধিত থাকে।",
            "ডোজ ফর্ম: ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন, ইনজেকশন ইত্যাদি। XR, SR বা ER ট্যাবলেট সাধারণ ট্যাবলেট থেকে আলাদা ফর্ম।",
            "প্রস্তুতকারক: যে কোম্পানির নামে নিবন্ধন। প্রতিটি ব্র্যান্ড তার নিজের প্রস্তুতকারকের নামে নিবন্ধিত।",
          ],
        },
        {
          type: "p",
          text: "DAR নম্বর দিয়ে রেজিস্ট্রির একটি নির্দিষ্ট এন্ট্রি চেনা যায়। দুটি প্যাকেটে আলাদা DAR নম্বর থাকলে সেগুলো আলাদা নিবন্ধিত পণ্য, ব্র্যান্ড নাম দেখতে কাছাকাছি হলেও।",
        },
        { type: "link", href: routes.compare(), label: "তুলনা পাতায় সর্বোচ্চ চারটি ওষুধ পাশাপাশি দেখুন" },
        { type: "h2", text: "একটি উদাহরণ" },
        {
          type: "p",
          text: "ধরুন আপনার কাছে দুটি প্যাকেট আছে, দুটির জেনেরিকই Paracetamol। প্যাকেট A-তে লেখা 500 mg ট্যাবলেট, প্যাকেট B-তে 665 mg ট্যাবলেট। জেনেরিক এক, কিন্তু শক্তি আলাদা। প্যাকেট B-তে যদি 120 mg/5 mL সাসপেনশন লেখা থাকত, তাহলে ডোজ ফর্মও আলাদা হতো। জেনেরিক, শক্তি ও ডোজ ফর্ম তিনটিই মিললে তবেই রেজিস্ট্রির এন্ট্রিগুলো সরাসরি তুলনীয়, তবু সেগুলো আলাদা প্রস্তুতকারকের এবং আলাদা DAR নম্বরের পণ্য।",
        },
        { type: "h2", text: "এখানকার তুলনা যা জানাতে পারে না" },
        {
          type: "ul",
          items: [
            "দাম: কোনো দাম যাচাই করা হয়নি বলে এই সাইটে দাম দেখানো হয় না।",
            "মান বা কার্যকারিতা: রেজিস্ট্রি ব্র্যান্ডের র‍্যাংকিং করে না, আমরাও করি না।",
            "পাওয়া যায় কিনা: কোনো নির্দিষ্ট ফার্মেসিতে পণ্যটি আছে কিনা।",
            "পণ্যটি আপনার জন্য ঠিক কিনা: এটি আপনার স্বাস্থ্যের ওপর নির্ভর করে, যা শুধু ডাক্তার বা ফার্মাসিস্ট বিচার করতে পারেন।",
          ],
        },
        { type: "h2", text: "ব্র্যান্ড বদলানোর আগে" },
        {
          type: "p",
          text: "রেজিস্ট্রির তথ্য মিলে গেলে সেটি আলোচনার শুরু, সিদ্ধান্ত নয়। দুটি প্যাকেট, অথবা তাদের ব্র্যান্ড নাম ও শক্তি লিখে নিয়ে নিবন্ধিত ফার্মাসিস্ট বা যে ডাক্তার ওষুধটি লিখেছেন তাঁর কাছে যান, এবং জিজ্ঞেস করুন বদলানো আপনার জন্য ঠিক হবে কিনা।",
        },
        { type: "link", href: routes.generic("paracetamol"), label: "উদাহরণ: রেজিস্ট্রি স্ন্যাপশটে Paracetamol-এর সব পণ্য" },
        { type: "link", href: routes.guide("read-medicine-strength"), label: "ওষুধের শক্তি (mg, mg/mL, %) কীভাবে পড়বেন" },
        {
          type: "note",
          text: "শুধু তুলনা দেখে কখনো ওষুধ বদলাবেন না, একসঙ্গে খাবেন না বা বন্ধ করবেন না। আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "দুটি ব্র্যান্ডের জেনেরিক ও শক্তি এক হলে কি সেগুলো হুবহু এক?",
          a: "এদের সক্রিয় উপাদান ও পরিমাণ এক লেখা থাকে, কিন্তু এগুলো আলাদা প্রস্তুতকারকের আলাদা নিবন্ধিত পণ্য। একটির বদলে অন্যটি নেওয়ার আগে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        {
          q: "এখানে কি ব্র্যান্ডের দাম তুলনা করা যায়?",
          a: "না। কোনো দাম যাচাই করা হয়নি বলে এই সাইটে দাম দেখানো হয় না।",
        },
        {
          q: "তুলনার সময় ডোজ ফর্ম কেন গুরুত্বপূর্ণ?",
          a: "একই জেনেরিকের ট্যাবলেট, সিরাপ আর এক্সটেন্ডেড-রিলিজ ট্যাবলেট আলাদা পণ্য হিসেবে নিবন্ধিত। ফর্ম মিললে তবেই একই রকম জিনিসের তুলনা হয়।",
        },
        {
          q: "তুলনা পাতার তথ্য কোথা থেকে আসে?",
          a: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশট থেকে: জেনেরিক, শক্তি, ডোজ ফর্ম, প্রস্তুতকারক ও DAR নম্বর।",
        },
      ],
    },
  },
};
