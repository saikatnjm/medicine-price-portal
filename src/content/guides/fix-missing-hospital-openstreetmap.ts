import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const fixMissingHospitalOpenstreetmap: Guide = {
  slug: "fix-missing-hospital-openstreetmap",
  category: "using-the-site",
  updatedAt: "2026-11-04",
  sources: [{ label: "OpenStreetMap: About", url: "https://www.openstreetmap.org/about" }],
  content: {
    en: {
      title: "Hospital missing or wrong? How OpenStreetMap data works",
      description:
        "Why a hospital, clinic or pharmacy may be missing or wrong here, how OpenStreetMap works, and how a correction on the map reaches this site.",
      summary:
        "The hospitals, clinics and pharmacies on this site come from OpenStreetMap. If one is missing or wrong, the lasting fix is usually on the map itself. Here is how that works.",
      body: [
        { type: "h2", text: "What OpenStreetMap is" },
        {
          type: "p",
          text: "OpenStreetMap is a free map of the world built by a community of volunteer mappers. Anyone can add or correct places on it. Its data is free to use as long as OpenStreetMap and its contributors are credited, which is why you see \"© OpenStreetMap contributors\" on our directory pages. The data is published under the Open Database Licence (ODbL), a share-alike licence: anyone who shares an adapted version of the data must share it under the same licence.",
        },
        { type: "h2", text: "Why a listing can be missing or wrong" },
        {
          type: "ul",
          items: [
            "Nobody has mapped the place yet. Coverage depends on volunteers and differs from area to area.",
            "The place was mapped without a name, or with a name that only says \"Hospital\" or \"Pharmacy\". Places that cannot be identified are left out of this site.",
            "The details changed after they were mapped: a new phone number, a move, a closure or a new name.",
            "The place was tagged as a different kind, so it appears under another type or in another list.",
            "The change was made on OpenStreetMap after this site last imported the map data.",
          ],
        },
        { type: "h2", text: "How a fix reaches this site" },
        {
          type: "p",
          text: "This site does not edit listings by hand. It periodically imports a snapshot of healthcare places from OpenStreetMap and rebuilds the directory from it. A correction made on OpenStreetMap therefore appears here after our next data update, not immediately.",
        },
        { type: "h2", text: "Correcting the map yourself" },
        {
          type: "ol",
          items: [
            "Create a free account on openstreetmap.org.",
            "Find the place on the map. On a listing here, the \"Suggest an edit on OpenStreetMap\" link opens that exact place in the map editor.",
            "Use Edit to open the in-browser editor (called iD) and add or correct the name, location or details.",
            "Save your change with a short description of what you changed.",
          ],
        },
        {
          type: "p",
          text: "Add only what you know to be true, such as a name on a signboard you have seen. The OpenStreetMap website has its own guidance for new mappers.",
        },
        { type: "h2", text: "If you would rather not edit the map" },
        {
          type: "p",
          text: "On a listing page, open \"Source, last checked & report an issue\" to tell us what is wrong, for example a wrong name, location or phone number.",
        },
        { type: "link", href: routes.hospitals(), label: "Browse hospitals & clinics" },
        { type: "link", href: routes.about(), label: "About the data: sources, labels and reporting" },
        { type: "link", href: routes.guide("hospital-clinic-pharmacy-listings"), label: "Hospital, clinic or pharmacy: what our listings mean" },
      ],
      faq: [
        {
          q: "Can I add a hospital to this site directly?",
          a: "No. Hospitals, clinics and pharmacies come from OpenStreetMap. Add the place there and it will appear here after our next data update.",
        },
        {
          q: "How soon will my OpenStreetMap edit show here?",
          a: "After this site's next import of OpenStreetMap data. It does not appear immediately.",
        },
        {
          q: "Is OpenStreetMap free to use?",
          a: "Yes. Its data is free to use with credit to OpenStreetMap and its contributors, under the share-alike Open Database Licence.",
        },
        {
          q: "Do I need to install anything to edit?",
          a: "No. OpenStreetMap has an in-browser editor called iD. You only need a free account.",
        },
      ],
    },
    bn: {
      title: "হাসপাতাল নেই বা ভুল? OpenStreetMap তথ্য কীভাবে কাজ করে",
      description:
        "এখানে কোনো হাসপাতাল, ক্লিনিক বা ফার্মেসি কেন নেই বা ভুল হতে পারে, OpenStreetMap কীভাবে কাজ করে, আর ম্যাপের সংশোধন কীভাবে এই সাইটে আসে।",
      summary:
        "এই সাইটের হাসপাতাল, ক্লিনিক ও ফার্মেসির তথ্য আসে OpenStreetMap থেকে। কোনোটি না থাকলে বা ভুল হলে স্থায়ী সমাধান সাধারণত ম্যাপেই করতে হয়। পুরো ব্যাপারটি কীভাবে কাজ করে, তা এখানে দেওয়া হলো।",
      body: [
        { type: "h2", text: "OpenStreetMap কী" },
        {
          type: "p",
          text: "OpenStreetMap হলো স্বেচ্ছাসেবী ম্যাপারদের একটি কমিউনিটির তৈরি বিশ্বের একটি মুক্ত ম্যাপ। যে কেউ এতে জায়গা যোগ বা সংশোধন করতে পারেন। OpenStreetMap ও এর অবদানকারীদের কৃতিত্ব দিলে এর তথ্য বিনামূল্যে ব্যবহার করা যায়; এ কারণেই আমাদের ডিরেক্টরির পাতায় \"© OpenStreetMap contributors\" লেখা থাকে। তথ্যগুলো Open Database Licence (ODbL)-এর অধীনে প্রকাশিত, যা একটি শেয়ার-অ্যালাইক লাইসেন্স: কেউ তথ্যের পরিবর্তিত সংস্করণ শেয়ার করলে সেটিও একই লাইসেন্সে শেয়ার করতে হয়।",
        },
        { type: "h2", text: "কোনো তালিকা কেন নেই বা ভুল হতে পারে" },
        {
          type: "ul",
          items: [
            "জায়গাটি এখনো কেউ ম্যাপ করেননি। ম্যাপের পূর্ণতা স্বেচ্ছাসেবীদের ওপর নির্ভর করে এবং এলাকাভেদে আলাদা।",
            "জায়গাটি নাম ছাড়া, অথবা শুধু \"Hospital\" বা \"Pharmacy\" নামে ম্যাপ করা হয়েছে। যে জায়গা শনাক্ত করা যায় না, তা এই সাইটে রাখা হয় না।",
            "ম্যাপ করার পর তথ্য বদলে গেছে: নতুন ফোন নম্বর, ঠিকানা বদল, বন্ধ হয়ে যাওয়া বা নতুন নাম।",
            "জায়গাটি অন্য ধরন হিসেবে ট্যাগ করা, তাই এটি অন্য ধরনে বা অন্য তালিকায় দেখা যাচ্ছে।",
            "এই সাইট শেষবার ম্যাপের তথ্য আনার পরে OpenStreetMap-এ পরিবর্তনটি করা হয়েছে।",
          ],
        },
        { type: "h2", text: "সংশোধন কীভাবে এই সাইটে আসে" },
        {
          type: "p",
          text: "এই সাইটে হাতে করে কোনো তালিকা সম্পাদনা করা হয় না। নির্দিষ্ট সময় পরপর OpenStreetMap থেকে স্বাস্থ্যসেবার জায়গাগুলোর একটি স্ন্যাপশট এনে ডিরেক্টরি নতুন করে তৈরি করা হয়। তাই OpenStreetMap-এ করা সংশোধন সঙ্গে সঙ্গে নয়, আমাদের পরবর্তী তথ্য হালনাগাদের পর এখানে দেখা যায়।",
        },
        { type: "h2", text: "নিজেই ম্যাপ সংশোধন করুন" },
        {
          type: "ol",
          items: [
            "openstreetmap.org-এ একটি বিনামূল্যের অ্যাকাউন্ট খুলুন।",
            "ম্যাপে জায়গাটি খুঁজে নিন। এখানকার কোনো তালিকায় \"OpenStreetMap-এ সম্পাদনার প্রস্তাব দিন\" লিংকটি ঠিক সেই জায়গাটিই ম্যাপ এডিটরে খুলে দেয়।",
            "Edit চাপুন; ব্রাউজারেই চলা এডিটর (iD) খুলবে। সেখানে নাম, অবস্থান বা অন্যান্য তথ্য যোগ বা সংশোধন করুন।",
            "কী বদলেছেন তার একটি ছোট বর্ণনা লিখে পরিবর্তন সেভ করুন।",
          ],
        },
        {
          type: "p",
          text: "শুধু সেটুকুই যোগ করুন যা আপনি নিশ্চিতভাবে জানেন, যেমন নিজের চোখে দেখা সাইনবোর্ডের নাম। নতুন ম্যাপারদের জন্য OpenStreetMap ওয়েবসাইটে নিজস্ব নির্দেশনা আছে।",
        },
        { type: "h2", text: "ম্যাপ সম্পাদনা করতে না চাইলে" },
        {
          type: "p",
          text: "কোনো তালিকার পাতায় \"উৎস, সর্বশেষ যাচাই ও সমস্যা জানান\" অংশটি খুলে আমাদের জানান কী ভুল আছে, যেমন ভুল নাম, অবস্থান বা ফোন নম্বর।",
        },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক দেখুন" },
        { type: "link", href: routes.about(), label: "তথ্য সম্পর্কে: উৎস, লেবেল ও ভুল জানানো" },
        { type: "link", href: routes.guide("hospital-clinic-pharmacy-listings"), label: "হাসপাতাল, ক্লিনিক, ফার্মেসি: তালিকার অর্থ" },
      ],
      faq: [
        {
          q: "আমি কি সরাসরি এই সাইটে কোনো হাসপাতাল যোগ করতে পারি?",
          a: "না। হাসপাতাল, ক্লিনিক ও ফার্মেসির তথ্য আসে OpenStreetMap থেকে। সেখানে জায়গাটি যোগ করুন; আমাদের পরবর্তী তথ্য হালনাগাদের পর তা এখানে দেখা যাবে।",
        },
        {
          q: "আমার OpenStreetMap সম্পাদনা কত দিনে এখানে আসবে?",
          a: "এই সাইট পরের বার OpenStreetMap-এর তথ্য আনার পর। সঙ্গে সঙ্গে দেখা যায় না।",
        },
        {
          q: "OpenStreetMap কি বিনামূল্যে ব্যবহার করা যায়?",
          a: "হ্যাঁ। OpenStreetMap ও এর অবদানকারীদের কৃতিত্ব দিয়ে, শেয়ার-অ্যালাইক Open Database Licence মেনে এর তথ্য বিনামূল্যে ব্যবহার করা যায়।",
        },
        {
          q: "সম্পাদনার জন্য কি কিছু ইনস্টল করতে হয়?",
          a: "না। OpenStreetMap-এর iD নামে একটি এডিটর ব্রাউজারেই চলে। শুধু একটি বিনামূল্যের অ্যাকাউন্ট লাগে।",
        },
      ],
    },
  },
};
