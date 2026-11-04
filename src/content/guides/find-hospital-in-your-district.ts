import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const findHospitalInYourDistrict: Guide = {
  slug: "find-hospital-in-your-district",
  category: "healthcare",
  updatedAt: "2026-11-04",
  sources: [{ label: "OpenStreetMap: About", url: "https://www.openstreetmap.org/about" }],
  content: {
    en: {
      title: "How to find a hospital or clinic in your district",
      description:
        "Step by step: find hospitals and clinics in your district or division on this site, filter by type or specialty, and check details before you go.",
      summary:
        "This site lists hospitals, clinics and other healthcare places across Bangladesh, mapped on OpenStreetMap. Here is how to narrow the list down to your district and what to check before you travel.",
      body: [
        { type: "h2", text: "Where the listings come from" },
        {
          type: "p",
          text: "Hospitals, clinics and other facilities on this site come from OpenStreetMap, a map built by a community of volunteers. We have not checked these listings ourselves. Names, phone numbers, opening hours and services can be incomplete or out of date, so always treat a listing as a starting point and call before you go.",
        },
        { type: "h2", text: "Start with your location" },
        {
          type: "ol",
          items: [
            "Open the Hospitals & clinics page.",
            "In the Location filter, choose your division, or a district inside it. Choosing a division shows every listed facility in that division.",
            "Apply the filters. The page shows how many facilities match and lists them, with a map on larger screens.",
            "Open a listing to see its address, any published phone number or website, and a Directions button that opens Google Maps.",
          ],
        },
        {
          type: "p",
          text: "You can also start from the Locations page, which lists divisions and districts. Each location page shows the hospitals, clinics and pharmacies listed there.",
        },
        { type: "link", href: routes.hospitals(), label: "Browse hospitals & clinics" },
        { type: "link", href: routes.locations(), label: "Browse by division and district" },
        { type: "h2", text: "Narrow the list further" },
        {
          type: "ul",
          items: [
            "Name or keyword: type part of a facility's name, for example a well-known hospital name.",
            "Type: limit the list to hospitals, clinics, diagnostic centres, dental clinics, health centres and other kinds, as recorded on the map.",
            "Specialty: show facilities whose map data lists a department such as cardiology or paediatrics. Many facilities do not record departments at all, so a missing specialty does not mean the service is unavailable.",
            "Emergency: show only facilities whose map data says they offer emergency services.",
            "Sort by distance from me: if you allow it, your browser shares your approximate position so the list is sorted by distance. Your location is not stored.",
          ],
        },
        { type: "h2", text: "Before you go" },
        {
          type: "ul",
          items: [
            "Call the facility, if a number is listed, to confirm it is open and offers what you need.",
            "Check the address on the map. Map positions are placed by volunteers and may be slightly off.",
            "If a listing is wrong or missing, you can suggest a correction on OpenStreetMap or use the report link on the listing.",
          ],
        },
        {
          type: "p",
          text: "In an emergency, do not rely on a website search. Call 999, Bangladesh's national emergency number, or go to the nearest hospital.",
        },
        { type: "link", href: routes.emergency(), label: "Emergency hospitals by division" },
        {
          type: "note",
          text: "This site helps you find places, not decide on care. For questions about your health, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Is every hospital in my district listed?",
          a: "Not necessarily. Listings come from OpenStreetMap, and coverage differs from place to place. A facility that has not been mapped will not appear here.",
        },
        {
          q: "Are the phone numbers and opening hours checked?",
          a: "No. They are published as mapped on OpenStreetMap and have not been verified by us. Confirm details with the facility before you visit.",
        },
        {
          q: "Why does a hospital not show up under a specialty?",
          a: "The specialty filter only uses departments recorded in the map data. Many facilities have no departments recorded, so they appear only in the general list.",
        },
        {
          q: "Does the site use my location?",
          a: "Only if you press the distance button and allow it in your browser. The position is used to sort the list and is not stored.",
        },
      ],
    },
    bn: {
      title: "আপনার জেলায় হাসপাতাল বা ক্লিনিক কীভাবে খুঁজবেন",
      description:
        "ধাপে ধাপে: এই সাইটে আপনার জেলা বা বিভাগের হাসপাতাল ও ক্লিনিক খুঁজুন, ধরন বা বিশেষজ্ঞ বিভাগ দিয়ে ছাঁকুন, আর যাওয়ার আগে তথ্য মিলিয়ে নিন।",
      summary:
        "এই সাইটে OpenStreetMap-এ ম্যাপ করা সারা বাংলাদেশের হাসপাতাল, ক্লিনিক ও অন্যান্য স্বাস্থ্যসেবা প্রতিষ্ঠানের তালিকা আছে। কীভাবে তালিকাটি আপনার জেলায় সীমিত করবেন এবং রওনা হওয়ার আগে কী কী দেখে নেবেন, তা এখানে দেওয়া হলো।",
      body: [
        { type: "h2", text: "তালিকাগুলো কোথা থেকে আসে" },
        {
          type: "p",
          text: "এই সাইটের হাসপাতাল, ক্লিনিক ও অন্যান্য প্রতিষ্ঠানের তথ্য এসেছে OpenStreetMap থেকে, যা স্বেচ্ছাসেবীদের একটি কমিউনিটি মিলে তৈরি করে। আমরা নিজেরা এই তালিকাগুলো যাচাই করিনি। নাম, ফোন নম্বর, খোলার সময় বা সেবার তথ্য অসম্পূর্ণ বা পুরোনো হতে পারে। তাই তালিকাকে শুধু শুরুর একটি সূত্র হিসেবে নিন, আর যাওয়ার আগে ফোন করে নিন।",
        },
        { type: "h2", text: "প্রথমে এলাকা বেছে নিন" },
        {
          type: "ol",
          items: [
            "হাসপাতাল ও ক্লিনিকের পাতা খুলুন।",
            "এলাকা ফিল্টারে আপনার বিভাগ, অথবা তার ভেতরের কোনো জেলা বেছে নিন। বিভাগ বাছলে সেই বিভাগের সব তালিকাভুক্ত প্রতিষ্ঠান দেখা যাবে।",
            "ফিল্টার প্রয়োগ করুন। কয়টি প্রতিষ্ঠান মিলেছে তা দেখাবে এবং তালিকা আসবে; বড় স্ক্রিনে পাশে একটি ম্যাপও থাকে।",
            "কোনো তালিকা খুললে ঠিকানা, প্রকাশিত ফোন নম্বর বা ওয়েবসাইট (যদি থাকে) এবং গুগল ম্যাপে দিকনির্দেশনার বোতাম পাবেন।",
          ],
        },
        {
          type: "p",
          text: "চাইলে অবস্থান পাতা থেকেও শুরু করতে পারেন, যেখানে বিভাগ ও জেলার তালিকা আছে। প্রতিটি অবস্থান পাতায় সেখানকার তালিকাভুক্ত হাসপাতাল, ক্লিনিক ও ফার্মেসি দেখা যায়।",
        },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক দেখুন" },
        { type: "link", href: routes.locations(), label: "বিভাগ ও জেলা অনুযায়ী দেখুন" },
        { type: "h2", text: "তালিকা আরও ছোট করুন" },
        {
          type: "ul",
          items: [
            "নাম বা শব্দ: প্রতিষ্ঠানের নামের একটি অংশ লিখুন, যেমন কোনো পরিচিত হাসপাতালের নাম।",
            "ধরন: ম্যাপে যেভাবে লেখা আছে সেই অনুযায়ী শুধু হাসপাতাল, ক্লিনিক, ডায়াগনস্টিক সেন্টার, ডেন্টাল ক্লিনিক, স্বাস্থ্যকেন্দ্র বা অন্য ধরন দেখুন।",
            "বিশেষজ্ঞ বিভাগ: যেসব প্রতিষ্ঠানের ম্যাপ-তথ্যে কার্ডিওলজি বা শিশুরোগের মতো বিভাগ লেখা আছে, শুধু সেগুলো দেখুন। অনেক প্রতিষ্ঠানের তথ্যে কোনো বিভাগই লেখা নেই, তাই বিভাগ না থাকলেই যে সেবাটি নেই, তা নয়।",
            "জরুরি: শুধু সেই প্রতিষ্ঠানগুলো দেখুন, যাদের ম্যাপ-তথ্যে জরুরি সেবার কথা লেখা আছে।",
            "আমার থেকে দূরত্ব অনুযায়ী সাজান: আপনি অনুমতি দিলে ব্রাউজার আপনার আনুমানিক অবস্থান জানায় এবং তালিকা দূরত্ব অনুযায়ী সাজানো হয়। আপনার অবস্থান সংরক্ষণ করা হয় না।",
          ],
        },
        { type: "h2", text: "যাওয়ার আগে" },
        {
          type: "ul",
          items: [
            "নম্বর দেওয়া থাকলে প্রতিষ্ঠানে ফোন করে জেনে নিন সেটি খোলা আছে কিনা এবং আপনার প্রয়োজনীয় সেবা দেয় কিনা।",
            "ম্যাপে ঠিকানাটি দেখে নিন। স্বেচ্ছাসেবীরা অবস্থান বসান, তাই সামান্য এদিক-ওদিক হতে পারে।",
            "কোনো তালিকা ভুল বা অনুপস্থিত হলে OpenStreetMap-এ সংশোধনের প্রস্তাব দিতে পারেন, অথবা তালিকার রিপোর্ট লিংক ব্যবহার করতে পারেন।",
          ],
        },
        {
          type: "p",
          text: "জরুরি অবস্থায় ওয়েবসাইটে খোঁজার ওপর ভরসা করবেন না। বাংলাদেশের জাতীয় জরুরি নম্বর 999-এ ফোন করুন, অথবা সবচেয়ে কাছের হাসপাতালে যান।",
        },
        { type: "link", href: routes.emergency(), label: "বিভাগ অনুযায়ী জরুরি সেবার হাসপাতাল" },
        {
          type: "note",
          text: "এই সাইট জায়গা খুঁজে পেতে সাহায্য করে, চিকিৎসার সিদ্ধান্ত নিতে নয়। নিজের স্বাস্থ্য নিয়ে প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "আমার জেলার সব হাসপাতাল কি তালিকায় আছে?",
          a: "সবগুলো না-ও থাকতে পারে। তালিকা আসে OpenStreetMap থেকে, আর এলাকাভেদে ম্যাপের পূর্ণতা আলাদা। যে প্রতিষ্ঠান ম্যাপে ওঠেনি, সেটি এখানে দেখা যাবে না।",
        },
        {
          q: "ফোন নম্বর ও খোলার সময় কি যাচাই করা?",
          a: "না। OpenStreetMap-এ যেভাবে ম্যাপ করা আছে সেভাবেই দেখানো হয়, আমরা যাচাই করিনি। যাওয়ার আগে প্রতিষ্ঠানের সঙ্গে কথা বলে নিশ্চিত হয়ে নিন।",
        },
        {
          q: "কোনো হাসপাতাল বিশেষজ্ঞ বিভাগের ফিল্টারে আসছে না কেন?",
          a: "এই ফিল্টার শুধু ম্যাপ-তথ্যে লেখা বিভাগগুলো ব্যবহার করে। অনেক প্রতিষ্ঠানের কোনো বিভাগ লেখা নেই, তাই সেগুলো শুধু সাধারণ তালিকায় দেখা যায়।",
        },
        {
          q: "সাইটটি কি আমার অবস্থান ব্যবহার করে?",
          a: "শুধু তখনই, যখন আপনি দূরত্বের বোতামে চাপ দিয়ে ব্রাউজারে অনুমতি দেন। অবস্থান কেবল তালিকা সাজাতে ব্যবহার হয়, সংরক্ষণ করা হয় না।",
        },
      ],
    },
  },
};
