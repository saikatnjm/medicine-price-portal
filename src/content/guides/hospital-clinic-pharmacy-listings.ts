import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const hospitalClinicPharmacyListings: Guide = {
  slug: "hospital-clinic-pharmacy-listings",
  category: "using-the-site",
  updatedAt: "2026-11-04",
  sources: [{ label: "OpenStreetMap: About", url: "https://www.openstreetmap.org/about" }],
  content: {
    en: {
      title: "Hospital, clinic or pharmacy: what our listings mean",
      description:
        "What the facility types (hospital, clinic, diagnostic centre and more) and labels such as Community-mapped and Needs review mean on this site.",
      summary:
        "Every healthcare place on this site has a type and a label. This guide explains where those come from and how much weight to give them.",
      body: [
        { type: "h2", text: "Where the type comes from" },
        {
          type: "p",
          text: "Hospitals, clinics and pharmacies on this site come from OpenStreetMap, where volunteers tag each place, for example as a hospital, clinic or pharmacy. We use those tags, and in a few clear cases the place's own name (a name containing \"Diagnostic\", for example), to choose a type. The type describes how a place was mapped. It is not an official classification, a licence or a statement about the services offered.",
        },
        { type: "h2", text: "Facility types used on this site" },
        {
          type: "ul",
          items: [
            "Hospital: mapped as a hospital.",
            "Clinic: mapped as a clinic.",
            "Diagnostic centre: a place mapped as a laboratory or named as a diagnostic centre.",
            "Dental clinic: a place mapped for dental care.",
            "Doctor's practice: a doctor's chamber or practice, as mapped.",
            "Health centre: a place whose name shows it is, for example, a community clinic, family welfare centre or union health centre.",
            "Blood bank: a place mapped for blood donation.",
            "Other healthcare facility: a healthcare place that does not fit the types above.",
            "Pharmacy: a place mapped as a pharmacy. Pharmacies have their own list, separate from hospitals and clinics.",
          ],
        },
        {
          type: "p",
          text: "Where the map data says so, a listing may also show ownership (government, private, non-profit or military), departments, and whether emergency services are listed. These details are only shown when a volunteer recorded them, and many listings have none.",
        },
        { type: "link", href: routes.hospitals(), label: "Browse hospitals & clinics" },
        { type: "link", href: routes.pharmacies(), label: "Browse pharmacies" },
        { type: "h2", text: "What the labels mean" },
        {
          type: "ul",
          items: [
            "Community-mapped: mapped by volunteers on OpenStreetMap. We have not checked it ourselves, so it may be incomplete or out of date. Almost every hospital, clinic and pharmacy listing carries this label.",
            "Needs review: something about the listing looks unusual, for example an unclear name or category, so it is kept out of search-engine indexing until checked. The page still opens.",
            "Source verified: confirmed against an identified, verifiable source or by the facility itself. No listing carries this label yet.",
            "Official registry: taken from an official registry, such as the DGDA list of registered medicines. This label is used for medicines, not for healthcare places.",
          ],
        },
        { type: "h2", text: "What the listings do not tell you" },
        {
          type: "ul",
          items: [
            "They do not rate or rank facilities, and the order of a list is not a recommendation.",
            "They do not show doctors yet. Doctor profiles will only be added from identified, verifiable sources.",
            "They do not show medicine prices or stock for any pharmacy.",
            "They do not confirm that a place is open or that a service is available today. Call ahead before you visit.",
          ],
        },
        { type: "link", href: routes.about(), label: "About the data: sources and labels" },
        { type: "link", href: routes.guide("fix-missing-hospital-openstreetmap"), label: "Hospital missing or wrong? How OpenStreetMap data works" },
        {
          type: "note",
          text: "Listings help you find a place; they do not say which care is right for you. Ask a registered doctor or pharmacist about your health.",
        },
      ],
      faq: [
        {
          q: "Is a \"hospital\" here officially registered as a hospital?",
          a: "Not necessarily. The type shows how the place was mapped on OpenStreetMap. It is not an official classification.",
        },
        {
          q: "What does \"Community-mapped\" mean?",
          a: "The listing was added by OpenStreetMap volunteers and has not been checked by us. Details may be incomplete or out of date.",
        },
        {
          q: "Why is a listing marked \"Needs review\"?",
          a: "Its name, category or details look unusual, so it is kept out of search engines until it is checked. You can still open it.",
        },
        {
          q: "Does the order of the list mean anything?",
          a: "No. Lists are not rankings or recommendations.",
        },
      ],
    },
    bn: {
      title: "হাসপাতাল, ক্লিনিক, ফার্মেসি: তালিকার অর্থ",
      description:
        "এই সাইটে প্রতিষ্ঠানের ধরন (হাসপাতাল, ক্লিনিক, ডায়াগনস্টিক সেন্টার ইত্যাদি) এবং কমিউনিটি-ম্যাপ করা বা পর্যালোচনা প্রয়োজনের মতো লেবেলের অর্থ।",
      summary:
        "এই সাইটের প্রতিটি স্বাস্থ্যসেবা প্রতিষ্ঠানের একটি ধরন ও একটি লেবেল থাকে। এগুলো কোথা থেকে আসে এবং এগুলোকে কতটা গুরুত্ব দেবেন, এই গাইডে তা বোঝানো হয়েছে।",
      body: [
        { type: "h2", text: "ধরন কোথা থেকে আসে" },
        {
          type: "p",
          text: "এই সাইটের হাসপাতাল, ক্লিনিক ও ফার্মেসির তথ্য আসে OpenStreetMap থেকে, যেখানে স্বেচ্ছাসেবীরা প্রতিটি জায়গাকে হাসপাতাল, ক্লিনিক বা ফার্মেসি ইত্যাদি হিসেবে চিহ্নিত (ট্যাগ) করেন। আমরা সেই ট্যাগ এবং কিছু স্পষ্ট ক্ষেত্রে জায়গার নিজের নাম (যেমন নামে \"Diagnostic\" থাকলে) দেখে ধরন ঠিক করি। ধরন বোঝায় জায়গাটি কীভাবে ম্যাপ করা হয়েছে। এটি কোনো সরকারি শ্রেণিবিভাগ, লাইসেন্স বা সেবার নিশ্চয়তা নয়।",
        },
        { type: "h2", text: "এই সাইটে ব্যবহৃত প্রতিষ্ঠানের ধরন" },
        {
          type: "ul",
          items: [
            "হাসপাতাল: হাসপাতাল হিসেবে ম্যাপ করা।",
            "ক্লিনিক: ক্লিনিক হিসেবে ম্যাপ করা।",
            "ডায়াগনস্টিক সেন্টার: ল্যাবরেটরি হিসেবে ম্যাপ করা বা নামে ডায়াগনস্টিক সেন্টার লেখা জায়গা।",
            "ডেন্টাল ক্লিনিক: দাঁতের চিকিৎসার জায়গা হিসেবে ম্যাপ করা।",
            "ডাক্তারের চেম্বার: ম্যাপে যেভাবে আছে, কোনো ডাক্তারের চেম্বার বা প্র্যাকটিস।",
            "স্বাস্থ্যকেন্দ্র: যে জায়গার নাম থেকে বোঝা যায় এটি, যেমন, কমিউনিটি ক্লিনিক, পরিবার কল্যাণ কেন্দ্র বা ইউনিয়ন স্বাস্থ্যকেন্দ্র।",
            "ব্লাড ব্যাংক: রক্তদানের জায়গা হিসেবে ম্যাপ করা।",
            "অন্যান্য স্বাস্থ্যসেবা প্রতিষ্ঠান: ওপরের কোনো ধরনে পড়ে না এমন স্বাস্থ্যসেবার জায়গা।",
            "ফার্মেসি: ফার্মেসি হিসেবে ম্যাপ করা। ফার্মেসির তালিকা হাসপাতাল ও ক্লিনিকের তালিকা থেকে আলাদা।",
          ],
        },
        {
          type: "p",
          text: "ম্যাপ-তথ্যে লেখা থাকলে তালিকায় মালিকানা (সরকারি, বেসরকারি, অলাভজনক বা সামরিক), বিভাগ এবং জরুরি সেবা তালিকাভুক্ত কিনা, তাও দেখা যেতে পারে। কোনো স্বেচ্ছাসেবী এসব যোগ করলে তবেই দেখানো হয়, আর অনেক তালিকায় এগুলো নেই।",
        },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক দেখুন" },
        { type: "link", href: routes.pharmacies(), label: "ফার্মেসি দেখুন" },
        { type: "h2", text: "লেবেলগুলোর অর্থ" },
        {
          type: "ul",
          items: [
            "কমিউনিটি-ম্যাপ করা: OpenStreetMap-এ স্বেচ্ছাসেবীরা ম্যাপ করেছেন। আমরা নিজেরা যাচাই করিনি, তাই তথ্য অসম্পূর্ণ বা পুরোনো হতে পারে। প্রায় সব হাসপাতাল, ক্লিনিক ও ফার্মেসির তালিকায় এই লেবেল থাকে।",
            "পর্যালোচনা প্রয়োজন: তালিকার কিছু বিষয় অস্বাভাবিক মনে হয়েছে, যেমন অস্পষ্ট নাম বা বিভাগ, তাই যাচাই না হওয়া পর্যন্ত এটি সার্চ ইঞ্জিনের সূচির বাইরে রাখা হয়েছে। পাতাটি তবুও খোলা যায়।",
            "উৎস যাচাই করা: শনাক্তযোগ্য ও যাচাইযোগ্য উৎসের সঙ্গে মিলিয়ে বা প্রতিষ্ঠান নিজে নিশ্চিত করেছে। এখনো কোনো তালিকায় এই লেবেল নেই।",
            "অফিসিয়াল রেজিস্ট্রি: অফিসিয়াল রেজিস্ট্রি থেকে নেওয়া, যেমন DGDA-র নিবন্ধিত ওষুধের তালিকা। এই লেবেল ওষুধের জন্য ব্যবহার হয়, স্বাস্থ্যসেবা প্রতিষ্ঠানের জন্য নয়।",
          ],
        },
        { type: "h2", text: "তালিকা যা বলে না" },
        {
          type: "ul",
          items: [
            "কোনো প্রতিষ্ঠানকে রেটিং বা র‍্যাংক দেয় না; তালিকার ক্রম কোনো সুপারিশ নয়।",
            "এখনো ডাক্তারদের তথ্য দেখায় না। ডাক্তারের প্রোফাইল শুধু শনাক্তযোগ্য ও যাচাইযোগ্য উৎস থেকে যোগ করা হবে।",
            "কোনো ফার্মেসির ওষুধের দাম বা মজুদ দেখায় না।",
            "জায়গাটি আজ খোলা কিনা বা কোনো সেবা পাওয়া যাবে কিনা, তা নিশ্চিত করে না। যাওয়ার আগে ফোন করে নিন।",
          ],
        },
        { type: "link", href: routes.about(), label: "তথ্য সম্পর্কে: উৎস ও লেবেল" },
        { type: "link", href: routes.guide("fix-missing-hospital-openstreetmap"), label: "হাসপাতাল নেই বা ভুল? OpenStreetMap তথ্য কীভাবে কাজ করে" },
        {
          type: "note",
          text: "তালিকা জায়গা খুঁজে পেতে সাহায্য করে; কোন চিকিৎসা আপনার জন্য ঠিক, তা বলে না। নিজের স্বাস্থ্য নিয়ে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "এখানে \"হাসপাতাল\" লেখা থাকলে কি সেটি সরকারিভাবে হাসপাতাল হিসেবে নিবন্ধিত?",
          a: "তা নাও হতে পারে। ধরন দেখায় জায়গাটি OpenStreetMap-এ কীভাবে ম্যাপ করা হয়েছে। এটি কোনো সরকারি শ্রেণিবিভাগ নয়।",
        },
        {
          q: "\"কমিউনিটি-ম্যাপ করা\" মানে কী?",
          a: "তালিকাটি OpenStreetMap-এর স্বেচ্ছাসেবীরা যোগ করেছেন এবং আমরা যাচাই করিনি। তথ্য অসম্পূর্ণ বা পুরোনো হতে পারে।",
        },
        {
          q: "কোনো তালিকায় \"পর্যালোচনা প্রয়োজন\" লেখা কেন?",
          a: "এর নাম, বিভাগ বা বিবরণ অস্বাভাবিক মনে হয়েছে, তাই যাচাই না হওয়া পর্যন্ত সার্চ ইঞ্জিন থেকে দূরে রাখা হয়েছে। পাতাটি আপনি তবুও খুলতে পারবেন।",
        },
        {
          q: "তালিকার ক্রমের কি কোনো অর্থ আছে?",
          a: "না। তালিকা কোনো র‍্যাংকিং বা সুপারিশ নয়।",
        },
      ],
    },
  },
};
