import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const nationalEmergency999: Guide = {
  slug: "national-emergency-999",
  category: "healthcare",
  updatedAt: "2026-11-04",
  sources: [
    {
      label: "The Daily Star: Toll-free national help desk 999 gets live",
      url: "https://www.thedailystar.net/country/toll-free-national-help-desk-999-gets-live-1312624",
    },
    {
      label: "Dhaka Tribune: National Emergency Service 999",
      url: "https://www.dhakatribune.com/amp/bangladesh/412748/national-emergency-service-999-receives-over-72.36",
    },
  ],
  content: {
    en: {
      title: "999: Bangladesh's national emergency number (police, fire, ambulance)",
      description:
        "999 is Bangladesh's toll-free national emergency number for police, fire service and ambulance. What it is and how to give clear information on a call.",
      summary:
        "In Bangladesh, 999 is the national emergency helpline. One toll-free number connects you to police, fire service and ambulance support. This page explains what it is and how to make your call as clear as possible.",
      body: [
        { type: "h2", text: "What 999 is" },
        {
          type: "p",
          text: "999 is Bangladesh's National Emergency Service: a toll-free national help desk that works as a single, centralised helpline for police, fire service and ambulance support. You do not need to know a separate number for each service. Call 999 and tell the operator what kind of help you need.",
        },
        {
          type: "ul",
          items: [
            "Police",
            "Fire service",
            "Ambulance",
          ],
        },
        { type: "h2", text: "When to call" },
        {
          type: "p",
          text: "Call 999 when there is an emergency and someone needs urgent help from the police, the fire service or an ambulance. Do not wait to search a website, including this one, when a life may be at risk.",
        },
        { type: "h2", text: "How to give clear information" },
        {
          type: "p",
          text: "Emergency operators can help faster when the information is clear. Try to stay as calm as you can and:",
        },
        {
          type: "ol",
          items: [
            "Say which service you need: police, fire service or ambulance.",
            "Say where you are as precisely as you can: district, area, road or house number, and a nearby landmark such as a mosque, school, market or bus stand.",
            "Briefly say what has happened and how many people need help.",
            "Answer the operator's questions as clearly as you can.",
            "Keep your phone switched on and nearby after the call.",
          ],
        },
        { type: "h2", text: "Be ready before an emergency happens" },
        {
          type: "ul",
          items: [
            "Make sure everyone at home, including older children, knows the number 999.",
            "Learn the full address of your home and workplace, with a landmark, so you can say it quickly.",
            "Keep a written list of your family's medicines and any hospital papers in one place, so they are easy to take along.",
            "Know where the nearest hospitals with emergency services are. The emergency page on this site lists facilities whose map data says they offer emergency services, but that information is unverified, so call before you go.",
          ],
        },
        { type: "link", href: routes.emergency(), label: "Emergency hospitals in Bangladesh, by division" },
        { type: "link", href: routes.hospitals(), label: "Browse hospitals & clinics" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "Checklist: preparing for a hospital visit" },
        {
          type: "note",
          text: "This page is general information, not medical advice. In an emergency, call 999. For other questions about your health, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "What is the emergency number in Bangladesh?",
          a: "999. It is the toll-free National Emergency Service number for police, fire service and ambulance.",
        },
        {
          q: "Is 999 free to call?",
          a: "Yes. 999 is a toll-free national help desk.",
        },
        {
          q: "Can I call 999 for an ambulance?",
          a: "Yes. 999 is a centralised helpline for police, fire service and ambulance support.",
        },
        {
          q: "What should I say first when I call 999?",
          a: "Say which service you need and where you are, as precisely as you can, with a nearby landmark. Then answer the operator's questions.",
        },
      ],
    },
    bn: {
      title: "৯৯৯: জাতীয় জরুরি সেবা",
      description:
        "999 বাংলাদেশের টোল-ফ্রি জাতীয় জরুরি নম্বর: পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জন্য। এটি কী এবং ফোনে কীভাবে স্পষ্ট তথ্য দেবেন।",
      summary:
        "বাংলাদেশে 999 হলো জাতীয় জরুরি হেল্পলাইন। একটি টোল-ফ্রি নম্বরেই পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স সহায়তা পাওয়া যায়। এটি কী এবং কীভাবে ফোনে যতটা সম্ভব স্পষ্টভাবে কথা বলবেন, এই পাতায় তা বলা হয়েছে।",
      body: [
        { type: "h2", text: "999 কী" },
        {
          type: "p",
          text: "999 হলো বাংলাদেশের জাতীয় জরুরি সেবা: একটি টোল-ফ্রি জাতীয় হেল্প ডেস্ক, যা পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স সহায়তার জন্য একটিমাত্র কেন্দ্রীয় হেল্পলাইন হিসেবে কাজ করে। প্রতিটি সেবার জন্য আলাদা নম্বর মনে রাখার দরকার নেই। 999-এ ফোন করে অপারেটরকে বলুন কোন ধরনের সাহায্য দরকার।",
        },
        {
          type: "ul",
          items: ["পুলিশ", "ফায়ার সার্ভিস", "অ্যাম্বুলেন্স"],
        },
        { type: "h2", text: "কখন ফোন করবেন" },
        {
          type: "p",
          text: "জরুরি অবস্থায় যখন কারও পুলিশ, ফায়ার সার্ভিস বা অ্যাম্বুলেন্সের জরুরি সাহায্য দরকার, তখন 999-এ ফোন করুন। কারও জীবন ঝুঁকিতে থাকলে কোনো ওয়েবসাইটে (এই সাইটসহ) খোঁজাখুঁজি করে সময় নষ্ট করবেন না।",
        },
        { type: "h2", text: "কীভাবে স্পষ্ট তথ্য দেবেন" },
        {
          type: "p",
          text: "তথ্য স্পষ্ট হলে জরুরি সেবার অপারেটর দ্রুত সাহায্য করতে পারেন। যতটা সম্ভব শান্ত থাকার চেষ্টা করুন এবং:",
        },
        {
          type: "ol",
          items: [
            "বলুন কোন সেবা দরকার: পুলিশ, ফায়ার সার্ভিস নাকি অ্যাম্বুলেন্স।",
            "যতটা সম্ভব নির্দিষ্ট করে বলুন আপনি কোথায় আছেন: জেলা, এলাকা, রাস্তা বা বাড়ির নম্বর, আর কাছের কোনো পরিচিত জায়গা, যেমন মসজিদ, স্কুল, বাজার বা বাসস্ট্যান্ড।",
            "সংক্ষেপে বলুন কী ঘটেছে এবং কতজনের সাহায্য দরকার।",
            "অপারেটরের প্রশ্নের উত্তর যতটা সম্ভব স্পষ্টভাবে দিন।",
            "ফোন শেষ হওয়ার পরও ফোন চালু রাখুন ও কাছে রাখুন।",
          ],
        },
        { type: "h2", text: "জরুরি অবস্থার আগেই প্রস্তুত থাকুন" },
        {
          type: "ul",
          items: [
            "বাড়ির সবাই, বড় শিশুরাও যেন 999 নম্বরটি জানে, তা নিশ্চিত করুন।",
            "বাড়ি ও কর্মস্থলের পুরো ঠিকানা কাছের পরিচিত জায়গাসহ মনে রাখুন, যাতে দ্রুত বলতে পারেন।",
            "পরিবারের ওষুধের একটি লিখিত তালিকা ও হাসপাতালের কাগজপত্র এক জায়গায় রাখুন, যাতে সহজে সঙ্গে নেওয়া যায়।",
            "কাছের কোন হাসপাতালে জরুরি সেবা আছে, তা জেনে রাখুন। এই সাইটের জরুরি পাতায় সেসব প্রতিষ্ঠানের তালিকা আছে, যাদের ম্যাপ-তথ্যে জরুরি সেবার কথা লেখা আছে; তবে এই তথ্য যাচাই করা হয়নি, তাই যাওয়ার আগে ফোন করে নিন।",
          ],
        },
        { type: "link", href: routes.emergency(), label: "বিভাগ অনুযায়ী বাংলাদেশের জরুরি সেবার হাসপাতাল" },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক দেখুন" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "হাসপাতালে যাওয়ার প্রস্তুতি: চেকলিস্ট" },
        {
          type: "note",
          text: "এই পাতা সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। জরুরি অবস্থায় 999-এ ফোন করুন। স্বাস্থ্য নিয়ে অন্য প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "বাংলাদেশের জরুরি নম্বর কত?",
          a: "999। এটি পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জন্য টোল-ফ্রি জাতীয় জরুরি সেবার নম্বর।",
        },
        {
          q: "999-এ ফোন করতে কি টাকা লাগে?",
          a: "না। 999 একটি টোল-ফ্রি জাতীয় হেল্প ডেস্ক।",
        },
        {
          q: "অ্যাম্বুলেন্সের জন্য কি 999-এ ফোন করা যায়?",
          a: "হ্যাঁ। 999 পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স সহায়তার একটি কেন্দ্রীয় হেল্পলাইন।",
        },
        {
          q: "999-এ ফোন করে প্রথমে কী বলব?",
          a: "কোন সেবা দরকার এবং আপনি কোথায় আছেন, কাছের পরিচিত জায়গাসহ যতটা সম্ভব নির্দিষ্ট করে বলুন। তারপর অপারেটরের প্রশ্নের উত্তর দিন।",
        },
      ],
    },
  },
};
