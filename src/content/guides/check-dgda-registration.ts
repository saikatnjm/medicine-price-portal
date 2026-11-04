import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const checkDgdaRegistration: Guide = {
  slug: "check-dgda-registration",
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
      title: "How to check if a medicine is DGDA-registered",
      description:
        "Look up a brand name or DAR number in the DGDA registry snapshot, compare it with the pack, and know what a match can and cannot tell you.",
      summary:
        "You can look up a medicine's brand name or DAR number in the DGDA registry snapshot on this site. This guide shows how to do it, how to compare the result with the pack in your hand, and why a match is not proof that a pack is genuine.",
      body: [
        { type: "h2", text: "What \"DGDA-registered\" means" },
        {
          type: "p",
          text: "The Directorate General of Drug Administration (DGDA) keeps the registry of medicine products registered in Bangladesh. The Directorate General of Health Services (DGHS) publishes this registry as a national code system and states that the data is owned by DGDA. Each entry is one registered product, identified by its DAR number together with its brand (trade) name.",
        },
        {
          type: "p",
          text: "Checking registration means finding out whether a product with the same brand name, generic name, strength, dosage form and manufacturer appears in that registry.",
        },
        { type: "h2", text: "Step by step: checking on this site" },
        {
          type: "ol",
          items: [
            "Find the brand name and the DAR number printed on the pack.",
            "Open the verify page and type either the DAR number or the brand name.",
            "Open the matching result and read each field: brand, generic name, strength, dosage form and manufacturer.",
            "Compare every field with what is printed on your pack. All of them should agree, not only the brand name.",
            "If nothing matches, or one field is different, do not assume the worst, but do not ignore it either. Show the pack to a registered pharmacist and check with DGDA.",
          ],
        },
        { type: "link", href: routes.verify(), label: "Search the registry snapshot by brand name or DAR number" },
        { type: "h2", text: "What a match can and cannot tell you" },
        {
          type: "p",
          text: "The data on this site comes from a dated snapshot of the DGDA registry. A match tells you that a product with those details was in the registry on the snapshot date. It cannot tell you more than that.",
        },
        {
          type: "ul",
          items: [
            "A match does not prove that the physical pack in your hand is genuine. A fake pack can copy a real brand name and DAR number.",
            "A match does not show the registration status today. A registration may have changed after the snapshot date.",
            "No match does not prove a product is unregistered. The name may be spelled differently, or the product may have been registered after the snapshot.",
            "Registration says nothing about whether a medicine is right for you.",
          ],
        },
        { type: "h2", text: "Checking with DGDA directly" },
        {
          type: "p",
          text: "For the official, current status, go to DGDA. Its official website is dgda.gov.bd. Type the address into your browser yourself rather than following a link from a message, a social media post or an unknown website.",
        },
        {
          type: "p",
          text: "If you think a pack may be fake, substandard or unregistered, you can tell DGDA about it. Our separate guide explains the complaint form that is linked from the DGDA homepage.",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "How to report a suspected fake or substandard medicine to DGDA" },
        { type: "link", href: routes.guide("what-is-dar-number"), label: "What is the DAR number on a medicine pack?" },
        { type: "h2", text: "Tips for a careful check" },
        {
          type: "ul",
          items: [
            "Type the DAR number exactly as printed, including any dashes.",
            "If the brand name gives many results, add the strength, for example \"500\".",
            "Check the manufacturer's name carefully. Similar brand names can belong to different companies.",
            "Keep the pack and the receipt if you plan to ask a pharmacist or contact DGDA.",
          ],
        },
        {
          type: "note",
          text: "A registry check is not medical advice. If you have any doubt about a medicine, do not use it until you have asked a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "If my medicine appears on this site, is it genuine?",
          a: "Not necessarily. A match shows that a product with those details was in the DGDA registry snapshot. It does not prove that a particular pack is genuine, because a fake pack can copy real details.",
        },
        {
          q: "Can I search by DAR number?",
          a: "Yes. The verify page accepts either a DAR number or a brand name.",
        },
        {
          q: "My medicine is not found. What should I do?",
          a: "Try other spellings or search by DAR number. If it is still not found, show the pack to a registered pharmacist and check with DGDA at dgda.gov.bd.",
        },
        {
          q: "Where can I see the official, current status?",
          a: "Only DGDA can confirm the current status. Type dgda.gov.bd into your browser yourself to reach the official site.",
        },
      ],
    },
    bn: {
      title: "ওষুধ ডিজিডিএ নিবন্ধিত কিনা কীভাবে যাচাই করবেন",
      description:
        "DGDA রেজিস্ট্রি স্ন্যাপশটে ব্র্যান্ড নাম বা DAR নম্বর খুঁজুন, প্যাকেটের সঙ্গে মিলিয়ে দেখুন, আর জেনে নিন মিল পাওয়া গেলে কী বোঝা যায় আর কী যায় না।",
      summary:
        "এই সাইটের DGDA রেজিস্ট্রি স্ন্যাপশটে কোনো ওষুধের ব্র্যান্ড নাম বা DAR নম্বর খুঁজে দেখতে পারেন। কীভাবে খুঁজবেন, হাতের প্যাকেটের সঙ্গে ফলাফল কীভাবে মেলাবেন, আর মিল পাওয়া মানেই কেন প্যাকেটটি আসল নয়, তা এই গাইডে বলা হয়েছে।",
      body: [
        { type: "h2", text: "\"DGDA নিবন্ধিত\" মানে কী" },
        {
          type: "p",
          text: "বাংলাদেশে নিবন্ধিত ওষুধ পণ্যের রেজিস্ট্রি রাখে ঔষধ প্রশাসন অধিদপ্তর (DGDA)। স্বাস্থ্য অধিদপ্তর (DGHS) এই রেজিস্ট্রি একটি জাতীয় কোড সিস্টেম হিসেবে প্রকাশ করে এবং সেখানে বলা আছে, তথ্যের মালিক DGDA। প্রতিটি এন্ট্রি একটি নিবন্ধিত পণ্য, যাকে চেনা যায় তার DAR নম্বর ও ব্র্যান্ড নাম দিয়ে।",
        },
        {
          type: "p",
          text: "নিবন্ধন যাচাই করা মানে দেখা যে একই ব্র্যান্ড নাম, জেনেরিক নাম, শক্তি, ডোজ ফর্ম ও প্রস্তুতকারকসহ কোনো পণ্য ওই রেজিস্ট্রিতে আছে কিনা।",
        },
        { type: "h2", text: "ধাপে ধাপে: এই সাইটে যাচাই" },
        {
          type: "ol",
          items: [
            "প্যাকেটে ছাপা ব্র্যান্ড নাম ও DAR নম্বর খুঁজে নিন।",
            "যাচাই পাতাটি খুলে DAR নম্বর অথবা ব্র্যান্ড নাম লিখুন।",
            "মিলে যাওয়া ফলাফলটি খুলে প্রতিটি তথ্য পড়ুন: ব্র্যান্ড, জেনেরিক নাম, শক্তি, ডোজ ফর্ম ও প্রস্তুতকারক।",
            "প্রতিটি তথ্য আপনার প্যাকেটের লেখার সঙ্গে মিলিয়ে দেখুন। শুধু ব্র্যান্ড নাম নয়, সবকিছু মিলতে হবে।",
            "কিছু না মিললে বা একটি তথ্যও আলাদা হলে আগেই খারাপ কিছু ধরে নেবেন না, আবার উপেক্ষাও করবেন না। প্যাকেটটি একজন নিবন্ধিত ফার্মাসিস্টকে দেখান এবং DGDA-র কাছে যাচাই করুন।",
          ],
        },
        { type: "link", href: routes.verify(), label: "ব্র্যান্ড নাম বা DAR নম্বর দিয়ে রেজিস্ট্রি স্ন্যাপশটে খুঁজুন" },
        { type: "h2", text: "মিল পাওয়া গেলে কী বোঝা যায়, আর কী যায় না" },
        {
          type: "p",
          text: "এই সাইটের তথ্য DGDA রেজিস্ট্রির একটি নির্দিষ্ট তারিখের স্ন্যাপশট থেকে নেওয়া। মিল পাওয়া গেলে শুধু এটুকু বোঝা যায় যে ওই তথ্যসহ একটি পণ্য স্ন্যাপশটের তারিখে রেজিস্ট্রিতে ছিল। এর বেশি কিছু নয়।",
        },
        {
          type: "ul",
          items: [
            "মিল পাওয়া গেলেও প্রমাণ হয় না যে আপনার হাতের প্যাকেটটি আসল। নকল প্যাকেটেও আসল ব্র্যান্ড নাম ও DAR নম্বর নকল করে ছাপা হতে পারে।",
            "মিল পাওয়া মানে আজকের নিবন্ধন অবস্থা জানা নয়। স্ন্যাপশটের তারিখের পরে নিবন্ধনে পরিবর্তন হয়ে থাকতে পারে।",
            "মিল না পাওয়া মানেই পণ্যটি অনিবন্ধিত নয়। নামের বানান আলাদা হতে পারে, অথবা পণ্যটি স্ন্যাপশটের পরে নিবন্ধিত হয়ে থাকতে পারে।",
            "নিবন্ধন থেকে বোঝা যায় না কোনো ওষুধ আপনার জন্য ঠিক কিনা।",
          ],
        },
        { type: "h2", text: "সরাসরি DGDA-র কাছে যাচাই" },
        {
          type: "p",
          text: "অফিসিয়াল ও হালনাগাদ অবস্থা জানতে DGDA-তে যান। এর অফিসিয়াল ওয়েবসাইট dgda.gov.bd। মেসেজ, সোশ্যাল মিডিয়ার পোস্ট বা অচেনা ওয়েবসাইটের লিংকে না গিয়ে ব্রাউজারে ঠিকানাটি নিজে লিখুন।",
        },
        {
          type: "p",
          text: "কোনো প্যাকেট নকল, নিম্নমানের বা অনিবন্ধিত মনে হলে DGDA-কে জানাতে পারেন। DGDA-র হোমপেজ থেকে যে অভিযোগ ফর্মে যাওয়া যায়, তা আমাদের আলাদা গাইডে বোঝানো হয়েছে।",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন" },
        { type: "link", href: routes.guide("what-is-dar-number"), label: "ওষুধের প্যাকেটে DAR নম্বর কী?" },
        { type: "h2", text: "যত্ন করে যাচাইয়ের কিছু পরামর্শ" },
        {
          type: "ul",
          items: [
            "DAR নম্বর ঠিক যেমন ছাপা আছে, ড্যাশসহ তেমনই লিখুন।",
            "ব্র্যান্ড নাম দিয়ে অনেক ফলাফল এলে সঙ্গে শক্তিও লিখুন, যেমন \"500\"।",
            "প্রস্তুতকারকের নাম ভালো করে মিলিয়ে নিন। কাছাকাছি নামের ব্র্যান্ড ভিন্ন কোম্পানির হতে পারে।",
            "ফার্মাসিস্টকে দেখাতে বা DGDA-কে জানাতে চাইলে প্যাকেট ও রসিদ রেখে দিন।",
          ],
        },
        {
          type: "note",
          text: "রেজিস্ট্রি যাচাই চিকিৎসা পরামর্শ নয়। কোনো ওষুধ নিয়ে সন্দেহ থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস না করা পর্যন্ত সেটি ব্যবহার করবেন না।",
        },
      ],
      faq: [
        {
          q: "আমার ওষুধ এই সাইটে পাওয়া গেলে কি সেটি আসল?",
          a: "জরুরি নয়। মিল পাওয়া গেলে বোঝা যায় যে ওই তথ্যসহ একটি পণ্য DGDA রেজিস্ট্রি স্ন্যাপশটে ছিল। এতে কোনো নির্দিষ্ট প্যাকেট আসল কিনা প্রমাণ হয় না, কারণ নকল প্যাকেটেও আসল তথ্য নকল করা যায়।",
        },
        {
          q: "DAR নম্বর দিয়ে কি খোঁজা যায়?",
          a: "হ্যাঁ। যাচাই পাতায় DAR নম্বর বা ব্র্যান্ড নাম, যেকোনোটি দিয়ে খুঁজতে পারেন।",
        },
        {
          q: "আমার ওষুধ খুঁজে পাচ্ছি না। কী করব?",
          a: "অন্য বানানে বা DAR নম্বর দিয়ে খুঁজে দেখুন। তবুও না পেলে প্যাকেটটি একজন নিবন্ধিত ফার্মাসিস্টকে দেখান এবং dgda.gov.bd-তে DGDA-র কাছে যাচাই করুন।",
        },
        {
          q: "অফিসিয়াল ও হালনাগাদ অবস্থা কোথায় দেখব?",
          a: "হালনাগাদ অবস্থা শুধু DGDA-ই নিশ্চিত করতে পারে। অফিসিয়াল সাইটে যেতে ব্রাউজারে নিজে dgda.gov.bd লিখুন।",
        },
      ],
    },
  },
};
