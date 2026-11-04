import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const keepFamilyMedicineList: Guide = {
  slug: "keep-family-medicine-list",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to keep your family's medicine list (brand, generic, strength)",
      description:
        "A simple way to record each family member's medicines: brand, generic, strength, form, maker and DAR number, with the doctor's instructions as written.",
      summary:
        "A clear, up-to-date list of the medicines each person in your family has been prescribed makes doctor visits, pharmacy trips and emergencies easier. This guide suggests what to write down and how to keep the list useful.",
      body: [
        { type: "h2", text: "Why keep a list" },
        {
          type: "ul",
          items: [
            "Doctors often ask which medicines a person is already taking. A written list is more reliable than memory.",
            "Several brands can share one generic, so writing both names avoids confusion when a pharmacy has a different brand on its shelf.",
            "In a hurry or an emergency, a family member can hand the list over instead of searching for boxes.",
          ],
        },
        { type: "h2", text: "What to write for each medicine" },
        {
          type: "p",
          text: "Keep one section per person, with their name at the top. For every medicine, copy these details from the pack or prescription:",
        },
        {
          type: "ol",
          items: [
            "Brand name, exactly as printed, for example including letters such as XR or SR.",
            "Generic name (the active ingredient or ingredients).",
            "Strength, with its unit, for example \"500 mg\". For combination products, write every part.",
            "Dosage form: tablet, capsule, syrup, drops, injection and so on.",
            "Manufacturer (the company name on the pack).",
            "DAR number, if the pack shows one.",
            "The doctor's instructions, copied word for word from the prescription. Do not rewrite or shorten them.",
            "Who prescribed it, and the date of the prescription.",
            "Start date, and the date it was stopped if a doctor stopped it.",
          ],
        },
        {
          type: "p",
          text: "Copy instructions only from the prescription or from what the doctor or pharmacist told you. Do not fill gaps from the internet or from memory; if something is unclear, ask the prescriber or a pharmacist.",
        },
        { type: "h2", text: "Keeping the list useful" },
        {
          type: "ul",
          items: [
            "Update it after every doctor visit, and cross out stopped medicines rather than deleting them, with the date.",
            "Keep a paper copy with your health papers, and a photo of it on a phone.",
            "Photograph the front and back of each new pack, so the brand, strength, DAR number and batch are on record.",
            "Write allergies or past reactions only as a doctor recorded them.",
            "Take the list, and if possible the packs, to every appointment.",
          ],
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "How to read a medicine pack: brand, generic, strength, DAR, batch, expiry" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "Checklist: preparing for a hospital visit" },
        { type: "h2", text: "Using this site to fill in details" },
        {
          type: "p",
          text: "You can search a brand name or DAR number on this site to see the registry details for that product: generic name, strength, form and manufacturer, from the DGDA registry snapshot used here. If what you see differs from the pack, write down what the pack says and ask a pharmacist.",
        },
        {
          type: "p",
          text: "Medicine pages also have a Save button. Saved items stay only in the browser you saved them in: nothing is sent to a server, there is no account, and clearing your browser data or using another device means they are not there. Treat Saved as a shortcut, not as your family's record.",
        },
        { type: "link", href: routes.search(), label: "Search a medicine by brand name" },
        { type: "link", href: routes.verify(), label: "Look up a DAR number" },
        {
          type: "note",
          text: "A medicine list is a record, not a plan. Do not start, stop or change a medicine based on the list; ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Should I write the brand name or the generic name?",
          a: "Both. The brand name is what is on the pack; the generic name shows what it contains. Add the strength and form too.",
        },
        {
          q: "Where do I find the DAR number?",
          a: "Many packs print it, often labelled \"DAR No.\" or similar. If you cannot find it, leave it blank; the other details still help.",
        },
        {
          q: "Can I keep the list on this website?",
          a: "Only as a browser shortcut. Saved items stay in one browser on one device and are lost if browser data is cleared. Keep your own paper or phone copy.",
        },
        {
          q: "Can a pharmacy give a different brand with the same generic?",
          a: "Ask the pharmacist and the prescribing doctor. This site does not advise on switching brands.",
        },
      ],
    },
    bn: {
      title: "পরিবারের ওষুধের তালিকা কীভাবে রাখবেন",
      description:
        "পরিবারের প্রত্যেকের ওষুধের হিসাব রাখার সহজ উপায়: ব্র্যান্ড, জেনেরিক, শক্তি, ফর্ম, প্রস্তুতকারক, DAR নম্বর এবং ডাক্তারের লেখা নির্দেশনা হুবহু।",
      summary:
        "পরিবারের প্রত্যেকের জন্য যে ওষুধগুলো লেখা হয়েছে, তার একটি পরিষ্কার ও হালনাগাদ তালিকা থাকলে ডাক্তার দেখানো, ফার্মেসিতে যাওয়া বা জরুরি অবস্থা সামলানো সহজ হয়। কী লিখবেন আর তালিকাটি কীভাবে কাজের রাখবেন, এই গাইডে তার পরামর্শ আছে।",
      body: [
        { type: "h2", text: "তালিকা রাখবেন কেন" },
        {
          type: "ul",
          items: [
            "ডাক্তার প্রায়ই জানতে চান রোগী এখন কোন কোন ওষুধ খাচ্ছেন। মনে রাখার চেয়ে লেখা তালিকা অনেক বেশি নির্ভরযোগ্য।",
            "একই জেনেরিকের একাধিক ব্র্যান্ড থাকতে পারে, তাই দুটো নামই লিখে রাখলে ফার্মেসিতে অন্য ব্র্যান্ড থাকলেও বিভ্রান্তি কম হয়।",
            "তাড়াহুড়ো বা জরুরি অবস্থায় পরিবারের কেউ বাক্স খোঁজার বদলে তালিকাটিই দেখিয়ে দিতে পারেন।",
          ],
        },
        { type: "h2", text: "প্রতিটি ওষুধের জন্য কী লিখবেন" },
        {
          type: "p",
          text: "প্রত্যেক সদস্যের জন্য আলাদা অংশ রাখুন, ওপরে তাঁর নাম লিখুন। প্রতিটি ওষুধের জন্য প্যাকেট বা প্রেসক্রিপশন থেকে এই তথ্যগুলো তুলে নিন:",
        },
        {
          type: "ol",
          items: [
            "ব্র্যান্ড নাম, ঠিক যেভাবে ছাপা আছে; XR বা SR-এর মতো অক্ষর থাকলে সেগুলোসহ।",
            "জেনেরিক নাম (সক্রিয় উপাদান বা উপাদানগুলো)।",
            "শক্তি, এককসহ, যেমন \"500 mg\"। কম্বিনেশন পণ্যে প্রতিটি অংশ লিখুন।",
            "ডোজ ফর্ম: ট্যাবলেট, ক্যাপসুল, সিরাপ, ড্রপস, ইনজেকশন ইত্যাদি।",
            "প্রস্তুতকারক (প্যাকেটে লেখা কোম্পানির নাম)।",
            "DAR নম্বর, প্যাকেটে থাকলে।",
            "ডাক্তারের নির্দেশনা, প্রেসক্রিপশন থেকে হুবহু। নিজের মতো করে বদলাবেন বা ছোট করবেন না।",
            "কে প্রেসক্রিপশন দিয়েছেন এবং প্রেসক্রিপশনের তারিখ।",
            "কবে শুরু হয়েছে, আর ডাক্তার বন্ধ করে থাকলে কবে বন্ধ হয়েছে।",
          ],
        },
        {
          type: "p",
          text: "নির্দেশনা শুধু প্রেসক্রিপশন থেকে বা ডাক্তার ও ফার্মাসিস্ট যা বলেছেন সেখান থেকেই লিখুন। ইন্টারনেট বা আন্দাজ থেকে ফাঁকা ঘর পূরণ করবেন না; কিছু অস্পষ্ট হলে যিনি প্রেসক্রিপশন দিয়েছেন তাঁকে বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        { type: "h2", text: "তালিকাটি কাজের রাখতে" },
        {
          type: "ul",
          items: [
            "প্রতিবার ডাক্তার দেখানোর পর হালনাগাদ করুন। বন্ধ হওয়া ওষুধ মুছে না ফেলে তারিখসহ কেটে দিন।",
            "স্বাস্থ্যের কাগজপত্রের সঙ্গে একটি কাগজের কপি রাখুন, আর ফোনে তার একটি ছবি।",
            "প্রতিটি নতুন প্যাকেটের সামনে ও পেছনের ছবি তুলে রাখুন, যাতে ব্র্যান্ড, শক্তি, DAR নম্বর ও ব্যাচ নম্বর সংরক্ষিত থাকে।",
            "অ্যালার্জি বা আগের কোনো প্রতিক্রিয়ার কথা শুধু ডাক্তার যেভাবে লিখেছেন, সেভাবেই লিখুন।",
            "প্রতিবার ডাক্তার দেখাতে গেলে তালিকাটি, আর সম্ভব হলে প্যাকেটগুলোও, সঙ্গে নিন।",
          ],
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "ওষুধের প্যাকেট কীভাবে পড়বেন" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "হাসপাতালে যাওয়ার প্রস্তুতি: চেকলিস্ট" },
        { type: "h2", text: "তথ্য মেলাতে এই সাইট ব্যবহার করা" },
        {
          type: "p",
          text: "এই সাইটে ব্র্যান্ড নাম বা DAR নম্বর দিয়ে খুঁজলে ওই পণ্যের রেজিস্ট্রি তথ্য দেখতে পাবেন: জেনেরিক নাম, শক্তি, ফর্ম ও প্রস্তুতকারক, এখানে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশট থেকে। প্যাকেটের সঙ্গে না মিললে প্যাকেটে যা লেখা আছে সেটিই লিখুন এবং ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        {
          type: "p",
          text: "ওষুধের পাতায় একটি \"সংরক্ষণ করুন\" বোতামও আছে। সংরক্ষিত জিনিস শুধু যে ব্রাউজারে সংরক্ষণ করেছেন সেখানেই থাকে: কোনো সার্ভারে পাঠানো হয় না, কোনো অ্যাকাউন্ট নেই, আর ব্রাউজারের ডেটা মুছলে বা অন্য ডিভাইসে গেলে সেগুলো পাওয়া যাবে না। তাই এটিকে শুধু একটি শর্টকাট ভাবুন, পরিবারের আসল তালিকা নয়।",
        },
        { type: "link", href: routes.search(), label: "ব্র্যান্ড নাম দিয়ে ওষুধ খুঁজুন" },
        { type: "link", href: routes.verify(), label: "DAR নম্বর দিয়ে খুঁজুন" },
        {
          type: "note",
          text: "ওষুধের তালিকা একটি হিসাব, চিকিৎসার পরিকল্পনা নয়। তালিকা দেখে কোনো ওষুধ শুরু, বন্ধ বা পরিবর্তন করবেন না; নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "ব্র্যান্ড নাম লিখব, নাকি জেনেরিক নাম?",
          a: "দুটোই। ব্র্যান্ড নাম প্যাকেটে লেখা থাকে; জেনেরিক নাম জানায় ভেতরে কী আছে। সঙ্গে শক্তি ও ফর্মও লিখুন।",
        },
        {
          q: "DAR নম্বর কোথায় পাব?",
          a: "অনেক প্যাকেটে এটি ছাপা থাকে, প্রায়ই \"DAR No.\" বা এ রকম লেখার পাশে। খুঁজে না পেলে ঘরটি ফাঁকা রাখুন; বাকি তথ্যও কাজে লাগবে।",
        },
        {
          q: "তালিকাটি কি এই ওয়েবসাইটে রাখা যায়?",
          a: "শুধু ব্রাউজারের শর্টকাট হিসেবে। সংরক্ষিত জিনিস একটি ডিভাইসের একটি ব্রাউজারেই থাকে এবং ব্রাউজারের ডেটা মুছলে হারিয়ে যায়। নিজের কাছে কাগজে বা ফোনে একটি কপি রাখুন।",
        },
        {
          q: "ফার্মেসি কি একই জেনেরিকের অন্য ব্র্যান্ড দিতে পারে?",
          a: "ফার্মাসিস্ট ও প্রেসক্রিপশন দেওয়া ডাক্তারকে জিজ্ঞেস করুন। ব্র্যান্ড বদলানো নিয়ে এই সাইট কোনো পরামর্শ দেয় না।",
        },
      ],
    },
  },
};
