import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const medicineNamesBanglaEnglish: Guide = {
  slug: "medicine-names-bangla-english",
  category: "using-the-site",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Searching medicine names in Bangla and English",
      description:
        "Medicine names in the DGDA registry are in English letters. How search on this site works, why to type names and numbers in English, and tips for Bangla users.",
      summary:
        "This site has an English and a Bangla version, but the medicine names themselves come from the DGDA registry, where they are written in English letters. This guide explains what that means for searching and how to find a medicine quickly.",
      body: [
        { type: "h2", text: "Names stay as they are in the registry" },
        {
          type: "p",
          text: "The Bangla version of this site, under /bn, translates the page text: headings, buttons, labels and explanations. Names come straight from the data and are not translated. Brand names, generic names and manufacturer names are shown as they appear in the DGDA registry snapshot used on this site, which means in English letters. Hospital, pharmacy and place names are shown as they appear in OpenStreetMap.",
        },
        { type: "h2", text: "Search medicines in English letters" },
        {
          type: "p",
          text: "Because medicine names are stored in English letters, medicine search matches English spelling. A name typed in Bangla script, for example the brand name written in Bangla letters, will not find the product. Type the name as it is printed on the pack in English instead.",
        },
        {
          type: "ul",
          items: [
            "Capital letters do not matter: \"PARACETAMOL\" and \"paracetamol\" give the same results.",
            "You can type the beginning of a word. Each word you type is matched against the start of words in the brand name, strength and generic name, so \"para\" finds products whose generic is paracetamol.",
            "Search needs at least two characters.",
            "Spaces inside a brand name, or between a brand and its strength, can usually be left out.",
            "If no product matches every word you typed, search tries again with your first word only.",
          ],
        },
        { type: "h2", text: "Type numbers with English digits" },
        {
          type: "p",
          text: "Strengths in the registry use English digits, such as \"500 mg\". Bangla digits are not converted, so a search with \"৫০০\" will not match \"500\". Use the digits 0 to 9 when you add a strength to your search. This site also shows numbers in English digits on the Bangla pages, so they match what you see on the pack.",
        },
        { type: "h2", text: "Tips if you know a name only by sound" },
        {
          type: "ol",
          items: [
            "Try the first three or four letters of the English spelling; you will see every brand that starts that way.",
            "Try more than one spelling if you are not sure how the name is written in English.",
            "Search the generic name instead of the brand, if you know it.",
            "Browse brands alphabetically and scan the letter the name starts with.",
            "Ask the pharmacist to show you the name printed on the pack.",
          ],
        },
        { type: "link", href: routes.search(), label: "Search medicines" },
        { type: "link", href: routes.medicines(), label: "Browse medicine brands A to Z" },
        { type: "link", href: routes.generics(), label: "Browse generics" },
        { type: "h2", text: "Hospitals, pharmacies and places" },
        {
          type: "p",
          text: "Hospital and pharmacy search works the same way, matching the start of words. Some districts and areas also have a Bangla name recorded in the location data, so a Bangla place name may work; if it does not, try the English spelling. In the site search, common older English spellings of place names, such as Dacca for Dhaka or Chittagong for Chattogram, are recognised as the same place.",
        },
        { type: "link", href: routes.hospitals(), label: "Find hospitals and clinics" },
      ],
      faq: [
        {
          q: "Can I search a medicine in Bangla?",
          a: "Not by Bangla script. Medicine names in the DGDA registry are in English letters, so type the English spelling as printed on the pack.",
        },
        {
          q: "Why are medicine names in English on the Bangla pages?",
          a: "Names come directly from the DGDA registry and are not translated, so they match what is printed on the pack. Only the page text is in Bangla.",
        },
        {
          q: "Can I type the strength in Bangla digits?",
          a: "No. Use English digits, for example 500, because strengths in the registry are written that way.",
        },
        {
          q: "I don't know the exact spelling. What should I do?",
          a: "Type the first few letters, try another spelling, search the generic name, or browse brands alphabetically.",
        },
      ],
    },
    bn: {
      title: "বাংলা ও ইংরেজিতে ওষুধের নাম খোঁজা",
      description:
        "DGDA রেজিস্ট্রিতে ওষুধের নাম ইংরেজি অক্ষরে। এই সাইটে খোঁজা কীভাবে কাজ করে, নাম ও সংখ্যা কেন ইংরেজিতে লিখবেন এবং বাংলাভাষীদের জন্য কিছু টিপস।",
      summary:
        "এই সাইটের ইংরেজি ও বাংলা দুটি সংস্করণ আছে, কিন্তু ওষুধের নামগুলো আসে DGDA রেজিস্ট্রি থেকে, যেখানে সেগুলো ইংরেজি অক্ষরে লেখা। খোঁজার ক্ষেত্রে এর মানে কী এবং কীভাবে দ্রুত ওষুধ খুঁজে পাবেন, এই গাইডে তা বোঝানো হয়েছে।",
      body: [
        { type: "h2", text: "নাম থাকে রেজিস্ট্রিতে যেমন আছে তেমনই" },
        {
          type: "p",
          text: "এই সাইটের বাংলা সংস্করণে (/bn) পাতার লেখা অনুবাদ করা হয়: শিরোনাম, বোতাম, লেবেল ও ব্যাখ্যা। কিন্তু নামগুলো সরাসরি তথ্য থেকে আসে, অনুবাদ করা হয় না। ব্র্যান্ড নাম, জেনেরিক নাম ও প্রস্তুতকারকের নাম এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে যেভাবে আছে সেভাবেই দেখানো হয়, অর্থাৎ ইংরেজি অক্ষরে। হাসপাতাল, ফার্মেসি ও জায়গার নাম দেখানো হয় OpenStreetMap-এ যেভাবে আছে সেভাবে।",
        },
        { type: "h2", text: "ওষুধ খুঁজুন ইংরেজি অক্ষরে" },
        {
          type: "p",
          text: "ওষুধের নাম ইংরেজি অক্ষরে সংরক্ষিত থাকায় ওষুধের সার্চ ইংরেজি বানানের সঙ্গেই মেলে। বাংলা হরফে লেখা নাম, যেমন কোনো ব্র্যান্ডের নাম বাংলা অক্ষরে লিখলে, পণ্যটি খুঁজে পাওয়া যাবে না। এর বদলে প্যাকেটে ইংরেজিতে যেভাবে ছাপা আছে, সেভাবে লিখুন।",
        },
        {
          type: "ul",
          items: [
            "বড় হাতের বা ছোট হাতের অক্ষরে কিছু যায় আসে না: \"PARACETAMOL\" ও \"paracetamol\" একই ফল দেয়।",
            "শব্দের শুরুটুকু লিখলেই চলে। আপনার লেখা প্রতিটি শব্দ ব্র্যান্ড নাম, শক্তি ও জেনেরিক নামের শব্দগুলোর শুরুর সঙ্গে মেলানো হয়, তাই \"para\" লিখলে প্যারাসিটামল জেনেরিকের পণ্যগুলো আসে।",
            "খুঁজতে অন্তত দুটি অক্ষর লাগে।",
            "ব্র্যান্ড নামের ভেতরের ফাঁকা জায়গা, বা ব্র্যান্ড ও শক্তির মাঝের ফাঁকা জায়গা, সাধারণত না দিলেও চলে।",
            "আপনার লেখা সব শব্দের সঙ্গে কোনো পণ্য না মিললে সার্চ শুধু প্রথম শব্দটি দিয়ে আবার খোঁজে।",
          ],
        },
        { type: "h2", text: "সংখ্যা লিখুন ইংরেজি অঙ্কে" },
        {
          type: "p",
          text: "রেজিস্ট্রিতে শক্তি লেখা থাকে ইংরেজি অঙ্কে, যেমন \"500 mg\"। বাংলা অঙ্ক রূপান্তর করা হয় না, তাই \"৫০০\" লিখে খুঁজলে \"500\" মিলবে না। সার্চে শক্তি যোগ করলে 0 থেকে 9 অঙ্ক ব্যবহার করুন। এই সাইটের বাংলা পাতাতেও সংখ্যা ইংরেজি অঙ্কে দেখানো হয়, যাতে প্যাকেটে যা দেখছেন তার সঙ্গে মেলে।",
        },
        { type: "h2", text: "নাম শুধু শুনে জানলে যা করবেন" },
        {
          type: "ol",
          items: [
            "ইংরেজি বানানের প্রথম তিন-চারটি অক্ষর লিখে দেখুন; ওই অক্ষরে শুরু হওয়া সব ব্র্যান্ড দেখতে পাবেন।",
            "ইংরেজিতে নামটি কীভাবে লেখা হয় নিশ্চিত না হলে একাধিক বানানে চেষ্টা করুন।",
            "জেনেরিক নাম জানা থাকলে ব্র্যান্ডের বদলে সেটি দিয়ে খুঁজুন।",
            "বর্ণানুক্রমিক ব্র্যান্ড তালিকায় নামের প্রথম অক্ষরের পাতাটি দেখুন।",
            "প্যাকেটে ছাপা নামটি দেখাতে ফার্মাসিস্টকে অনুরোধ করুন।",
          ],
        },
        { type: "link", href: routes.search(), label: "ওষুধ খুঁজুন" },
        { type: "link", href: routes.medicines(), label: "A থেকে Z: ওষুধের ব্র্যান্ড দেখুন" },
        { type: "link", href: routes.generics(), label: "জেনেরিকগুলো দেখুন" },
        { type: "h2", text: "হাসপাতাল, ফার্মেসি ও জায়গা" },
        {
          type: "p",
          text: "হাসপাতাল ও ফার্মেসির সার্চও একইভাবে শব্দের শুরু মিলিয়ে কাজ করে। কিছু জেলা ও এলাকার বাংলা নামও অবস্থানের তথ্যে রাখা আছে, তাই বাংলায় জায়গার নাম লিখলে কখনো কখনো কাজ করতে পারে; না করলে ইংরেজি বানানে চেষ্টা করুন। সাইটের সার্চে জায়গার নামের প্রচলিত পুরোনো ইংরেজি বানানও চেনা হয়, যেমন Dhaka-র জন্য Dacca বা Chattogram-এর জন্য Chittagong।",
        },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক খুঁজুন" },
      ],
      faq: [
        {
          q: "বাংলায় কি ওষুধ খোঁজা যায়?",
          a: "বাংলা হরফে নয়। DGDA রেজিস্ট্রিতে ওষুধের নাম ইংরেজি অক্ষরে, তাই প্যাকেটে যেভাবে ছাপা আছে সেই ইংরেজি বানানে লিখুন।",
        },
        {
          q: "বাংলা পাতাতেও ওষুধের নাম ইংরেজিতে কেন?",
          a: "নামগুলো সরাসরি DGDA রেজিস্ট্রি থেকে আসে এবং অনুবাদ করা হয় না, যাতে প্যাকেটে ছাপা নামের সঙ্গে মেলে। শুধু পাতার লেখা বাংলায়।",
        },
        {
          q: "শক্তি কি বাংলা অঙ্কে লেখা যায়?",
          a: "না। ইংরেজি অঙ্ক ব্যবহার করুন, যেমন 500, কারণ রেজিস্ট্রিতে শক্তি এভাবেই লেখা।",
        },
        {
          q: "সঠিক বানান জানি না। কী করব?",
          a: "প্রথম কয়েকটি অক্ষর লিখুন, অন্য বানানে চেষ্টা করুন, জেনেরিক নাম দিয়ে খুঁজুন, অথবা বর্ণানুক্রমিক ব্র্যান্ড তালিকা দেখুন।",
        },
      ],
    },
  },
};
