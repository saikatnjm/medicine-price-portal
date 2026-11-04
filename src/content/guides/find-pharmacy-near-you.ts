import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const findPharmacyNearYou: Guide = {
  slug: "find-pharmacy-near-you",
  category: "healthcare",
  updatedAt: "2026-11-04",
  sources: [{ label: "OpenStreetMap: About", url: "https://www.openstreetmap.org/about" }],
  content: {
    en: {
      title: "How to find a pharmacy in your area",
      description:
        "Find pharmacies in your district or near you on this site, what each listing shows, and why you should call ahead. No prices or stock are shown.",
      summary:
        "The pharmacy list on this site shows where pharmacies are, based on OpenStreetMap. It does not show what they sell or charge. Here is how to use it well.",
      body: [
        { type: "h2", text: "What the pharmacy list shows" },
        {
          type: "p",
          text: "Pharmacies on this site come from OpenStreetMap, a community-built map. Each listing can include a name, an address or area, a map position and, where a volunteer added them, a phone number or opening hours. We have not verified these details.",
        },
        {
          type: "ul",
          items: [
            "It shows where a pharmacy is, not what it has in stock.",
            "It does not show medicine prices. No price on this site has been verified, so none are displayed.",
            "It does not say whether a pharmacy is open right now, unless opening hours were mapped, and even then they may be out of date.",
          ],
        },
        { type: "h2", text: "Find pharmacies by area" },
        {
          type: "ol",
          items: [
            "Open the Pharmacies page.",
            "Choose your division or district in the Location filter and apply it.",
            "If you know the name, type part of it in the pharmacy name box.",
            "Open a listing to see its details and a Directions button that opens Google Maps.",
          ],
        },
        { type: "link", href: routes.pharmacies(), label: "Browse pharmacies" },
        { type: "link", href: routes.locations(), label: "Browse by division and district" },
        { type: "h2", text: "Find pharmacies near you" },
        {
          type: "p",
          text: "On the pharmacy list you can press \"Sort by distance from me\". Your browser will ask for permission to share your location. If you allow it, the list is sorted by approximate distance. The position is used only for that list and is not stored. If you prefer not to share your location, search by area instead.",
        },
        { type: "h2", text: "Before you set off" },
        {
          type: "ul",
          items: [
            "Call the pharmacy, if a number is listed, to check that it is open.",
            "Ask the pharmacy directly whether it has the medicine you need. This site cannot tell you.",
            "Bring your prescription, or the exact brand name, generic name and strength written down, so the pharmacist can understand what you are asking for.",
          ],
        },
        {
          type: "p",
          text: "If a pharmacy has closed, moved or is missing from the list, you can suggest a correction on OpenStreetMap or use the report link on the listing.",
        },
        { type: "link", href: routes.guide("keep-family-medicine-list"), label: "How to keep your family's medicine list" },
        {
          type: "note",
          text: "A pharmacy listing is not advice about medicines. For questions about a medicine, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Can I see medicine prices at a pharmacy here?",
          a: "No. Medicine prices and stock are not available on this site. Please ask the pharmacy directly.",
        },
        {
          q: "Is a listed pharmacy open 24 hours?",
          a: "Only if opening hours were added on OpenStreetMap, and those may be out of date. Call the pharmacy to confirm.",
        },
        {
          q: "Why is my local pharmacy missing?",
          a: "It may not have been mapped on OpenStreetMap yet. Anyone can add it there; the change appears here after this site's next data update.",
        },
        {
          q: "Is my location saved when I sort by distance?",
          a: "No. It is only used to sort the list you are looking at.",
        },
      ],
    },
    bn: {
      title: "আপনার এলাকায় ফার্মেসি কীভাবে খুঁজবেন",
      description:
        "এই সাইটে আপনার জেলা বা কাছাকাছি ফার্মেসি খুঁজুন, প্রতিটি তালিকায় কী থাকে জানুন, আর কেন আগে ফোন করবেন। দাম বা মজুদের তথ্য দেখানো হয় না।",
      summary:
        "এই সাইটের ফার্মেসি তালিকা OpenStreetMap-এর ভিত্তিতে দেখায় ফার্মেসিগুলো কোথায়। তারা কী বিক্রি করে বা কত দাম নেয়, তা দেখায় না। তালিকাটি কীভাবে ভালোভাবে ব্যবহার করবেন, তা এখানে দেওয়া হলো।",
      body: [
        { type: "h2", text: "ফার্মেসির তালিকায় কী থাকে" },
        {
          type: "p",
          text: "এই সাইটের ফার্মেসিগুলো এসেছে OpenStreetMap থেকে, যা একটি কমিউনিটি-নির্মিত ম্যাপ। প্রতিটি তালিকায় নাম, ঠিকানা বা এলাকা, ম্যাপে অবস্থান এবং কোনো স্বেচ্ছাসেবী যোগ করে থাকলে ফোন নম্বর বা খোলার সময় থাকতে পারে। এসব তথ্য আমরা যাচাই করিনি।",
        },
        {
          type: "ul",
          items: [
            "তালিকা দেখায় ফার্মেসি কোথায়, তাদের কাছে কী মজুদ আছে তা নয়।",
            "ওষুধের দাম দেখায় না। এই সাইটের কোনো দাম যাচাই করা হয়নি, তাই কোনো দামই দেখানো হয় না।",
            "ফার্মেসি এখন খোলা কিনা তা বলে না; খোলার সময় ম্যাপ করা থাকলেও তা পুরোনো হতে পারে।",
          ],
        },
        { type: "h2", text: "এলাকা অনুযায়ী ফার্মেসি খুঁজুন" },
        {
          type: "ol",
          items: [
            "ফার্মেসির পাতা খুলুন।",
            "এলাকা ফিল্টারে আপনার বিভাগ বা জেলা বেছে নিয়ে প্রয়োগ করুন।",
            "নাম জানা থাকলে ফার্মেসির নামের ঘরে নামের একটি অংশ লিখুন।",
            "কোনো তালিকা খুললে বিস্তারিত তথ্য এবং গুগল ম্যাপে দিকনির্দেশনার বোতাম পাবেন।",
          ],
        },
        { type: "link", href: routes.pharmacies(), label: "ফার্মেসি দেখুন" },
        { type: "link", href: routes.locations(), label: "বিভাগ ও জেলা অনুযায়ী দেখুন" },
        { type: "h2", text: "কাছাকাছি ফার্মেসি খুঁজুন" },
        {
          type: "p",
          text: "ফার্মেসির তালিকায় \"আমার থেকে দূরত্ব অনুযায়ী সাজান\" বোতামে চাপ দিতে পারেন। ব্রাউজার তখন আপনার অবস্থান জানানোর অনুমতি চাইবে। অনুমতি দিলে তালিকাটি আনুমানিক দূরত্ব অনুযায়ী সাজানো হবে। অবস্থান শুধু ওই তালিকার জন্যই ব্যবহার হয়, সংরক্ষণ করা হয় না। অবস্থান জানাতে না চাইলে এলাকা দিয়ে খুঁজুন।",
        },
        { type: "h2", text: "রওনা হওয়ার আগে" },
        {
          type: "ul",
          items: [
            "নম্বর দেওয়া থাকলে ফার্মেসিতে ফোন করে জেনে নিন খোলা আছে কিনা।",
            "আপনার দরকারি ওষুধ আছে কিনা, তা সরাসরি ফার্মেসিকেই জিজ্ঞেস করুন। এই সাইট তা বলতে পারে না।",
            "প্রেসক্রিপশন সঙ্গে নিন, অথবা ব্র্যান্ড নাম, জেনেরিক নাম ও শক্তি ঠিকঠাক লিখে নিন, যাতে ফার্মাসিস্ট বুঝতে পারেন আপনি কী চাইছেন।",
          ],
        },
        {
          type: "p",
          text: "কোনো ফার্মেসি বন্ধ হয়ে গেলে, সরে গেলে বা তালিকায় না থাকলে OpenStreetMap-এ সংশোধনের প্রস্তাব দিতে পারেন, অথবা তালিকার রিপোর্ট লিংক ব্যবহার করতে পারেন।",
        },
        { type: "link", href: routes.guide("keep-family-medicine-list"), label: "পরিবারের ওষুধের তালিকা কীভাবে রাখবেন" },
        {
          type: "note",
          text: "ফার্মেসির তালিকা ওষুধ নিয়ে কোনো পরামর্শ নয়। কোনো ওষুধ নিয়ে প্রশ্ন থাকলে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "এখানে কি কোনো ফার্মেসির ওষুধের দাম দেখা যায়?",
          a: "না। এই সাইটে ওষুধের দাম বা মজুদের তথ্য নেই। অনুগ্রহ করে সরাসরি ফার্মেসিতে জিজ্ঞেস করুন।",
        },
        {
          q: "তালিকার ফার্মেসি কি 24 ঘণ্টা খোলা?",
          a: "শুধু OpenStreetMap-এ খোলার সময় যোগ করা থাকলে তা দেখা যায়, আর সেটিও পুরোনো হতে পারে। ফোন করে নিশ্চিত হয়ে নিন।",
        },
        {
          q: "আমার এলাকার ফার্মেসিটি তালিকায় নেই কেন?",
          a: "হয়তো সেটি এখনো OpenStreetMap-এ ম্যাপ করা হয়নি। যে কেউ সেখানে এটি যোগ করতে পারেন; এই সাইটের পরবর্তী তথ্য হালনাগাদের পর তা এখানে দেখা যাবে।",
        },
        {
          q: "দূরত্ব অনুযায়ী সাজালে কি আমার অবস্থান সংরক্ষণ হয়?",
          a: "না। এটি শুধু আপনি যে তালিকা দেখছেন, সেটি সাজাতে ব্যবহার হয়।",
        },
      ],
    },
  },
};
