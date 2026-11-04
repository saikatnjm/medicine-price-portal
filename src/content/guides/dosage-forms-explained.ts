import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const dosageFormsExplained: Guide = {
  slug: "dosage-forms-explained",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Tablet, capsule, syrup, suspension: dosage forms explained",
      description:
        "What tablet, capsule, syrup, suspension, drops, cream, ointment, injection, inhaler and suppository mean as dosage forms, in plain words.",
      summary:
        "The dosage form is the physical shape a medicine comes in. This guide describes the common forms you will see in the DGDA registry and on packs, so you can recognise what a label is describing.",
      body: [
        { type: "h2", text: "What a dosage form is" },
        {
          type: "p",
          text: "The same active ingredient can be made into a solid, a liquid, a semi-solid or a spray. That physical form is called the dosage form. In the DGDA registry snapshot used on this site there are 130 different dosage-form labels, from \"Tablet\" to \"Nebuliser Solution\". Each brand is registered in a specific form, and a different form of the same generic is a different registered product.",
        },
        { type: "h2", text: "Solid forms" },
        {
          type: "ul",
          items: [
            "Tablet: a solid piece made by pressing powder into shape. Variants in the registry include chewable, dispersible and orodispersible (ODT) tablets, which differ in how the tablet is made.",
            "Capsule: a shell, usually of gelatin, that holds the medicine inside as powder, granules or pellets. A \"soft gelatin capsule\" has a soft, sealed shell, often holding a liquid.",
            "Sachet, powder or granules: medicine supplied loose in a packet or bottle rather than pressed into a tablet.",
            "Suppository: a small solid shaped for insertion into the rectum, designed to soften or melt at body temperature.",
          ],
        },
        { type: "h2", text: "Liquid forms" },
        {
          type: "ul",
          items: [
            "Syrup: a sweetened liquid in which the medicine is dissolved.",
            "Oral solution: a liquid with the medicine fully dissolved, not necessarily sweetened.",
            "Suspension: a liquid in which fine solid particles are spread through the liquid but not dissolved.",
            "Powder for suspension: dry powder in a bottle that is made into a suspension before use. A pharmacist can explain how it is prepared.",
            "Drops: small-volume liquids with a dropper, labelled by where they are used, such as eye drops, ear drops, nasal drops or paediatric (oral) drops.",
          ],
        },
        { type: "h2", text: "Forms for the skin" },
        {
          type: "ul",
          items: [
            "Cream: a soft, smooth mixture of oil and water that spreads easily.",
            "Ointment: a greasier, oil-based semi-solid.",
            "Gel: a clear or translucent jelly-like base.",
            "Lotion: a thin liquid for spreading on the skin or scalp.",
          ],
        },
        { type: "h2", text: "Injections, inhalers and sprays" },
        {
          type: "ul",
          items: [
            "Injection: a sterile liquid, or a sterile powder to be made into a liquid, in a vial, ampoule or prefilled syringe. Labels often add the route, such as IV or IM.",
            "IV infusion: a larger volume of sterile liquid, usually in a bag or bottle, for slow delivery into a vein.",
            "Inhaler: a device that delivers medicine as a measured spray (aerosol) or as a dry powder to be breathed in.",
            "Nebuliser solution: a liquid used in a nebuliser machine, which turns it into a fine mist.",
            "Nasal spray: a liquid sprayed into the nose from a pump bottle.",
          ],
        },
        { type: "h2", text: "Letters before the form" },
        {
          type: "p",
          text: "Labels such as \"XR Tablet\", \"SR Capsule\" or \"MUPS Tablet\" describe how the tablet or capsule is designed to release the medicine. These are separate forms in the registry.",
        },
        { type: "link", href: routes.dosageForms(), label: "Browse every dosage form in the registry snapshot" },
        { type: "link", href: routes.guide("tablet-suffixes-xr-sr-er-mups"), label: "What XR, SR, ER, DR and MUPS mean" },
        { type: "link", href: routes.guide("injection-labels-iv-im"), label: "IV, IM, SC and \"IV infusion\" labels explained" },
        {
          type: "note",
          text: "Which form is suitable for a person, and how to use it, is a medical question. Ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "What is the difference between a tablet and a capsule?",
          a: "A tablet is pressed powder formed into a solid piece. A capsule is a shell, usually gelatin, with the medicine inside.",
        },
        {
          q: "What is the difference between a syrup and a suspension?",
          a: "In a syrup the medicine is dissolved in a sweetened liquid. In a suspension fine particles are spread through the liquid without dissolving.",
        },
        {
          q: "Is a cream the same as an ointment?",
          a: "No. A cream is a lighter mix of oil and water; an ointment is greasier and oil-based.",
        },
        {
          q: "How many dosage forms are in the registry?",
          a: "The DGDA registry snapshot used on this site contains 130 different dosage-form labels.",
        },
      ],
    },
    bn: {
      title: "ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন: ডোজ ফর্ম পরিচিতি",
      description:
        "ডোজ ফর্ম হিসেবে ট্যাবলেট, ক্যাপসুল, সিরাপ, সাসপেনশন, ড্রপ, ক্রিম, মলম, ইনজেকশন, ইনহেলার ও সাপোজিটরি মানে কী, সহজ ভাষায়।",
      summary:
        "ডোজ ফর্ম হলো ওষুধের বাহ্যিক রূপ। DGDA রেজিস্ট্রি ও প্যাকেটে যেসব সাধারণ ফর্ম দেখা যায়, এই গাইডে সেগুলোর বর্ণনা আছে, যাতে লেবেল কী বোঝাচ্ছে তা চিনতে পারেন।",
      body: [
        { type: "h2", text: "ডোজ ফর্ম কী" },
        {
          type: "p",
          text: "একই সক্রিয় উপাদান দিয়ে কঠিন, তরল, আধা-কঠিন বা স্প্রে আকারের ওষুধ তৈরি করা যায়। এই বাহ্যিক রূপকেই ডোজ ফর্ম বলে। এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে 130টি আলাদা ডোজ ফর্মের লেবেল আছে, \"Tablet\" থেকে \"Nebuliser Solution\" পর্যন্ত। প্রতিটি ব্র্যান্ড একটি নির্দিষ্ট ফর্মে নিবন্ধিত, আর একই জেনেরিকের ভিন্ন ফর্ম মানে ভিন্ন নিবন্ধিত পণ্য।",
        },
        { type: "h2", text: "কঠিন ফর্ম" },
        {
          type: "ul",
          items: [
            "ট্যাবলেট: পাউডার চেপে তৈরি করা কঠিন টুকরা। রেজিস্ট্রিতে চিবিয়ে খাওয়ার (chewable), পানিতে গোলানোর (dispersible) ও মুখে গলে যাওয়ার (orodispersible, ODT) ট্যাবলেটও আছে; এগুলোর পার্থক্য ট্যাবলেট তৈরির ধরনে।",
            "ক্যাপসুল: সাধারণত জেলাটিনের একটি খোল, যার ভেতরে পাউডার, দানা বা পেলেট আকারে ওষুধ থাকে। \"সফট জেলাটিন ক্যাপসুল\"-এর খোল নরম ও বন্ধ, ভেতরে প্রায়ই তরল থাকে।",
            "স্যাশে, পাউডার বা গ্রানিউলস: ট্যাবলেট আকারে না চেপে প্যাকেট বা বোতলে খোলা অবস্থায় দেওয়া ওষুধ।",
            "সাপোজিটরি: মলদ্বারে প্রবেশ করানোর উপযোগী আকারের ছোট কঠিন ওষুধ, যা শরীরের তাপমাত্রায় নরম হয় বা গলে যায়।",
          ],
        },
        { type: "h2", text: "তরল ফর্ম" },
        {
          type: "ul",
          items: [
            "সিরাপ: মিষ্টি তরল, যাতে ওষুধ দ্রবীভূত থাকে।",
            "ওরাল সলিউশন: ওষুধ পুরোপুরি দ্রবীভূত থাকা তরল, যা মিষ্টি নাও হতে পারে।",
            "সাসপেনশন: এমন তরল, যাতে ওষুধের সূক্ষ্ম কঠিন কণা গলে না গিয়ে ছড়িয়ে থাকে।",
            "পাউডার ফর সাসপেনশন: বোতলে শুকনো পাউডার, যা ব্যবহারের আগে সাসপেনশন বানানো হয়। কীভাবে তৈরি করতে হয়, ফার্মাসিস্ট বুঝিয়ে দিতে পারেন।",
            "ড্রপ: ড্রপারসহ অল্প পরিমাণ তরল, ব্যবহারের জায়গা অনুযায়ী নাম, যেমন চোখের ড্রপ, কানের ড্রপ, নাকের ড্রপ বা শিশুদের (মুখে খাওয়ার) ড্রপ।",
          ],
        },
        { type: "h2", text: "ত্বকে ব্যবহারের ফর্ম" },
        {
          type: "ul",
          items: [
            "ক্রিম: তেল ও পানির নরম, মসৃণ মিশ্রণ, যা সহজে ছড়ায়।",
            "মলম (অয়েন্টমেন্ট): বেশি তৈলাক্ত, তেলভিত্তিক আধা-কঠিন ওষুধ।",
            "জেল: স্বচ্ছ বা আধা-স্বচ্ছ জেলির মতো বেস।",
            "লোশন: ত্বক বা মাথার তালুতে লাগানোর পাতলা তরল।",
          ],
        },
        { type: "h2", text: "ইনজেকশন, ইনহেলার ও স্প্রে" },
        {
          type: "ul",
          items: [
            "ইনজেকশন: জীবাণুমুক্ত তরল, অথবা তরল বানানোর জন্য জীবাণুমুক্ত পাউডার, যা ভায়াল, অ্যাম্পুল বা আগে থেকে ভরা সিরিঞ্জে থাকে। লেবেলে প্রায়ই IV বা IM-এর মতো পথের নামও থাকে।",
            "IV ইনফিউশন: সাধারণত ব্যাগ বা বোতলে থাকা বেশি পরিমাণ জীবাণুমুক্ত তরল, যা ধীরে ধীরে শিরায় দেওয়ার জন্য।",
            "ইনহেলার: এমন যন্ত্র, যা মাপা স্প্রে (অ্যারোসল) বা শুকনো পাউডার আকারে শ্বাসের সঙ্গে নেওয়ার জন্য ওষুধ দেয়।",
            "নেবুলাইজার সলিউশন: নেবুলাইজার যন্ত্রে ব্যবহৃত তরল, যন্ত্রটি একে সূক্ষ্ম কুয়াশায় পরিণত করে।",
            "নেজাল স্প্রে: পাম্প বোতল থেকে নাকে স্প্রে করার তরল।",
          ],
        },
        { type: "h2", text: "ফর্মের আগে থাকা অক্ষর" },
        {
          type: "p",
          text: "\"XR Tablet\", \"SR Capsule\" বা \"MUPS Tablet\"-এর মতো লেবেল বোঝায় ট্যাবলেট বা ক্যাপসুলটি কীভাবে ওষুধ ছাড়ার জন্য তৈরি। রেজিস্ট্রিতে এগুলো আলাদা ফর্ম।",
        },
        { type: "link", href: routes.dosageForms(), label: "রেজিস্ট্রি স্ন্যাপশটের সব ডোজ ফর্ম দেখুন" },
        { type: "link", href: routes.guide("tablet-suffixes-xr-sr-er-mups"), label: "ওষুধের নামে XR, SR, ER, MUPS মানে কী" },
        { type: "link", href: routes.guide("injection-labels-iv-im"), label: "ইনজেকশনের IV, IM, SC লেবেলের অর্থ" },
        {
          type: "note",
          text: "কার জন্য কোন ফর্ম উপযুক্ত এবং কীভাবে ব্যবহার করতে হয়, তা চিকিৎসার প্রশ্ন। নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "ট্যাবলেট আর ক্যাপসুলের পার্থক্য কী?",
          a: "ট্যাবলেট হলো পাউডার চেপে বানানো কঠিন টুকরা। ক্যাপসুল হলো সাধারণত জেলাটিনের খোল, যার ভেতরে ওষুধ থাকে।",
        },
        {
          q: "সিরাপ আর সাসপেনশনের পার্থক্য কী?",
          a: "সিরাপে ওষুধ মিষ্টি তরলে দ্রবীভূত থাকে। সাসপেনশনে সূক্ষ্ম কণা না গলে তরলে ছড়িয়ে থাকে।",
        },
        {
          q: "ক্রিম আর মলম কি একই?",
          a: "না। ক্রিম তেল ও পানির হালকা মিশ্রণ; মলম বেশি তৈলাক্ত ও তেলভিত্তিক।",
        },
        {
          q: "রেজিস্ট্রিতে কতগুলো ডোজ ফর্ম আছে?",
          a: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে 130টি আলাদা ডোজ ফর্মের লেবেল আছে।",
        },
      ],
    },
  },
};
