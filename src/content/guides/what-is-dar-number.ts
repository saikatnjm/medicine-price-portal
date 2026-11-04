import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const whatIsDarNumber: Guide = {
  slug: "what-is-dar-number",
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
      title: "What is the DAR number on a medicine pack?",
      description:
        "The DAR number is a medicine product's DGDA registration number. Where it appears in the registry, how to use it to search, and what it does not prove.",
      summary:
        "The DAR number is the registration number a medicine product has in the DGDA registry. This guide explains what it identifies, how to use it to look a product up, and the limits of what it can tell you.",
      body: [
        { type: "h2", text: "The short answer" },
        {
          type: "p",
          text: "A DAR number is the registration number of a medicine product in the registry kept by the Directorate General of Drug Administration (DGDA). Each registered product has its own DAR number. It is printed on the pack, which lets you match the product with its registry entry.",
        },
        { type: "h2", text: "How the registry uses DAR numbers" },
        {
          type: "p",
          text: "The Directorate General of Health Services (DGHS) publishes the national DGDA drug registry as a code system and states that the data is owned by DGDA. In that code system, the identifier of each entry combines the DAR number with the trade (brand) name. The example given is:",
        },
        { type: "ul", items: ["353-0026-039--marvelous-fe"] },
        {
          type: "p",
          text: "The first part of that identifier is the DAR number and the last part is the brand name. Putting the two together gives every registered product a unique identifier.",
        },
        { type: "h2", text: "What about the parts of the number?" },
        {
          type: "p",
          text: "In the registry example above, the DAR number appears as groups of digits separated by dashes. We have not found an official public source that explains what each group means, so we do not guess. Treat the DAR number as one complete code and always copy it in full, exactly as printed.",
        },
        { type: "h2", text: "Using the DAR number to look up a product" },
        {
          type: "ol",
          items: [
            "Find the DAR number printed on the pack and write it down, including the dashes.",
            "Open the verify page on this site and enter the number.",
            "Compare the result with the pack: brand name, generic name, strength, dosage form and manufacturer should all agree.",
          ],
        },
        { type: "link", href: routes.verify(), label: "Look up a DAR number in the registry snapshot" },
        {
          type: "p",
          text: "Searching by DAR number is often more precise than searching by brand name, because many brands have similar names and one brand can come in several strengths and forms, each with its own entry.",
        },
        { type: "h2", text: "What a DAR number does not tell you" },
        {
          type: "ul",
          items: [
            "It does not prove that a particular pack is genuine. A fake pack can copy a real DAR number.",
            "A match on this site reflects a dated snapshot of the registry, not the registration status today.",
            "It says nothing about what a medicine is for or whether it is right for you.",
          ],
        },
        {
          type: "p",
          text: "For the official, current status of a registration, go to DGDA's website, dgda.gov.bd. Type the address into your browser yourself.",
        },
        { type: "link", href: routes.guide("check-dgda-registration"), label: "How to check if a medicine is DGDA-registered" },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "How to read a medicine pack" },
        {
          type: "note",
          text: "If a DAR number is missing, unreadable or does not match, show the pack to a registered pharmacist before using the medicine, and ask a registered doctor or pharmacist about any health question.",
        },
      ],
      faq: [
        {
          q: "Is the DAR number the same as the batch number?",
          a: "No. The DAR number identifies the registered product. A batch number is a separate code that identifies one production lot of a product.",
        },
        {
          q: "What do the different parts of a DAR number mean?",
          a: "We have not found an official public source that explains them, so we do not describe them. Use the whole number, exactly as printed.",
        },
        {
          q: "Can two products share the same DAR number?",
          a: "In the DGDA registry code system, each entry's identifier combines the DAR number with the brand name, so always check the brand name as well as the number.",
        },
        {
          q: "Does a valid DAR number mean the medicine is genuine?",
          a: "No. It shows a product with that number was registered. A fake pack can copy a real number. If in doubt, ask a registered pharmacist and check with DGDA.",
        },
      ],
    },
    bn: {
      title: "ওষুধের প্যাকেটে DAR নম্বর কী?",
      description:
        "DAR নম্বর হলো DGDA রেজিস্ট্রিতে একটি ওষুধ পণ্যের নিবন্ধন নম্বর। রেজিস্ট্রিতে এটি কোথায় থাকে, এটি দিয়ে কীভাবে খুঁজবেন এবং এটি কী প্রমাণ করে না।",
      summary:
        "DAR নম্বর হলো DGDA রেজিস্ট্রিতে একটি ওষুধ পণ্যের নিবন্ধন নম্বর। এটি কী নির্দেশ করে, এটি দিয়ে কীভাবে পণ্য খুঁজবেন এবং এটি থেকে কতটুকু জানা যায়, তা এই গাইডে বলা হয়েছে।",
      body: [
        { type: "h2", text: "সংক্ষেপে উত্তর" },
        {
          type: "p",
          text: "DAR নম্বর হলো ঔষধ প্রশাসন অধিদপ্তরের (DGDA) রেজিস্ট্রিতে একটি ওষুধ পণ্যের নিবন্ধন নম্বর। প্রতিটি নিবন্ধিত পণ্যের নিজস্ব DAR নম্বর থাকে। প্যাকেটে এটি ছাপা থাকে, তাই এটি দিয়ে পণ্যটিকে রেজিস্ট্রির এন্ট্রির সঙ্গে মেলানো যায়।",
        },
        { type: "h2", text: "রেজিস্ট্রিতে DAR নম্বর কীভাবে ব্যবহৃত হয়" },
        {
          type: "p",
          text: "স্বাস্থ্য অধিদপ্তর (DGHS) জাতীয় DGDA ওষুধ রেজিস্ট্রি একটি কোড সিস্টেম হিসেবে প্রকাশ করে এবং সেখানে বলা আছে, তথ্যের মালিক DGDA। ওই কোড সিস্টেমে প্রতিটি এন্ট্রির পরিচয় নম্বরে DAR নম্বর ও ব্র্যান্ড নাম একসঙ্গে থাকে। সেখানে দেওয়া উদাহরণটি হলো:",
        },
        { type: "ul", items: ["353-0026-039--marvelous-fe"] },
        {
          type: "p",
          text: "এই পরিচয় নম্বরের প্রথম অংশটি DAR নম্বর আর শেষ অংশটি ব্র্যান্ড নাম। দুটো মিলিয়ে প্রতিটি নিবন্ধিত পণ্য একটি অনন্য পরিচয় পায়।",
        },
        { type: "h2", text: "নম্বরের আলাদা অংশগুলোর মানে কী?" },
        {
          type: "p",
          text: "ওপরের রেজিস্ট্রি উদাহরণে DAR নম্বরটি ড্যাশ দিয়ে আলাদা করা কয়েকটি সংখ্যার গুচ্ছ হিসেবে দেখা যায়। প্রতিটি গুচ্ছের অর্থ ব্যাখ্যা করে এমন কোনো অফিসিয়াল প্রকাশ্য উৎস আমরা পাইনি, তাই অনুমান করে কিছু বলছি না। DAR নম্বরকে একটি পূর্ণ কোড হিসেবে ধরুন এবং সবসময় যেমন ছাপা আছে, পুরোটা তেমনই লিখুন।",
        },
        { type: "h2", text: "DAR নম্বর দিয়ে পণ্য খোঁজা" },
        {
          type: "ol",
          items: [
            "প্যাকেটে ছাপা DAR নম্বরটি খুঁজে ড্যাশসহ লিখে রাখুন।",
            "এই সাইটের যাচাই পাতা খুলে নম্বরটি লিখুন।",
            "ফলাফলের সঙ্গে প্যাকেট মিলিয়ে দেখুন: ব্র্যান্ড নাম, জেনেরিক নাম, শক্তি, ডোজ ফর্ম ও প্রস্তুতকারক সবই মিলতে হবে।",
          ],
        },
        { type: "link", href: routes.verify(), label: "রেজিস্ট্রি স্ন্যাপশটে DAR নম্বর খুঁজুন" },
        {
          type: "p",
          text: "ব্র্যান্ড নামের চেয়ে DAR নম্বর দিয়ে খোঁজা প্রায়ই বেশি নির্ভুল হয়। কারণ অনেক ব্র্যান্ডের নাম কাছাকাছি, আর একটি ব্র্যান্ড বিভিন্ন শক্তি ও ফর্মে থাকতে পারে, যার প্রতিটির আলাদা এন্ট্রি আছে।",
        },
        { type: "h2", text: "DAR নম্বর থেকে যা জানা যায় না" },
        {
          type: "ul",
          items: [
            "এটি প্রমাণ করে না যে কোনো নির্দিষ্ট প্যাকেট আসল। নকল প্যাকেটেও আসল DAR নম্বর নকল করা যায়।",
            "এই সাইটে মিল পাওয়া মানে রেজিস্ট্রির একটি নির্দিষ্ট তারিখের স্ন্যাপশটের তথ্য, আজকের নিবন্ধন অবস্থা নয়।",
            "কোনো ওষুধ কীসের জন্য, বা আপনার জন্য ঠিক কিনা, তা এ থেকে জানা যায় না।",
          ],
        },
        {
          type: "p",
          text: "কোনো নিবন্ধনের অফিসিয়াল ও হালনাগাদ অবস্থা জানতে DGDA-র ওয়েবসাইট dgda.gov.bd-তে যান। ব্রাউজারে ঠিকানাটি নিজে লিখুন।",
        },
        { type: "link", href: routes.guide("check-dgda-registration"), label: "ওষুধ ডিজিডিএ নিবন্ধিত কিনা কীভাবে যাচাই করবেন" },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "ওষুধের প্যাকেট কীভাবে পড়বেন" },
        {
          type: "note",
          text: "DAR নম্বর না থাকলে, পড়া না গেলে বা না মিললে ওষুধটি ব্যবহারের আগে প্যাকেটটি একজন নিবন্ধিত ফার্মাসিস্টকে দেখান। স্বাস্থ্য নিয়ে যেকোনো প্রশ্ন নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "DAR নম্বর আর ব্যাচ নম্বর কি একই?",
          a: "না। DAR নম্বর নিবন্ধিত পণ্যটিকে চিহ্নিত করে। ব্যাচ নম্বর আলাদা একটি কোড, যা পণ্যটির একটি নির্দিষ্ট উৎপাদন লটকে চিহ্নিত করে।",
        },
        {
          q: "DAR নম্বরের আলাদা অংশগুলোর মানে কী?",
          a: "এগুলো ব্যাখ্যা করে এমন কোনো অফিসিয়াল প্রকাশ্য উৎস আমরা পাইনি, তাই আমরা তা বর্ণনা করি না। পুরো নম্বরটি ঠিক যেমন ছাপা আছে, তেমনই ব্যবহার করুন।",
        },
        {
          q: "দুটি পণ্যের কি একই DAR নম্বর থাকতে পারে?",
          a: "DGDA রেজিস্ট্রি কোড সিস্টেমে প্রতিটি এন্ট্রির পরিচয় নম্বরে DAR নম্বর ও ব্র্যান্ড নাম একসঙ্গে থাকে, তাই নম্বরের পাশাপাশি ব্র্যান্ড নামও সবসময় মিলিয়ে দেখুন।",
        },
        {
          q: "সঠিক DAR নম্বর থাকলেই কি ওষুধটি আসল?",
          a: "না। এতে শুধু বোঝা যায় ওই নম্বরের একটি পণ্য নিবন্ধিত হয়েছিল। নকল প্যাকেটেও আসল নম্বর থাকতে পারে। সন্দেহ হলে নিবন্ধিত ফার্মাসিস্টকে জিজ্ঞেস করুন এবং DGDA-র কাছে যাচাই করুন।",
        },
      ],
    },
  },
};
