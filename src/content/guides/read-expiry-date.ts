import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const readExpiryDate: Guide = {
  slug: "read-expiry-date",
  category: "medicines",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to read manufacturing and expiry dates on medicine packs",
      description:
        "Where to find Mfg and Exp dates on a medicine pack, how common date formats are written, and what to do if a medicine has expired or the date is unclear.",
      summary:
        "Medicine packs print a manufacturing date and an expiry date, often in small, abbreviated text. This guide explains the common labels and date formats so you can find and read them.",
      body: [
        { type: "h2", text: "Where the dates are" },
        {
          type: "p",
          text: "Dates are usually printed together with the batch number, often on the end flap or back of the box, or along the edge of a blister strip. They may be stamped or embossed rather than printed in ink, which can make them hard to see. Tilting the pack under a light often helps.",
        },
        {
          type: "p",
          text: "If a strip has been cut, the dates may be missing from the piece you have. Keep the outer box until the medicine is finished so you always have the dates and batch number.",
        },
        { type: "h2", text: "Common labels" },
        {
          type: "ul",
          items: [
            "Mfg, MFD, Mfg. Date or Mfd.: the manufacturing date, when the batch was made.",
            "Exp, EXP or Exp. Date: the expiry date.",
            "Batch No., B. No. or Lot: the batch the pack belongs to. It is usually printed next to the dates.",
          ],
        },
        {
          type: "p",
          text: "The manufacturing date is always the earlier of the two. If you are not sure which date is which, the later one is the expiry date, but check the label beside it.",
        },
        { type: "h2", text: "Common date formats" },
        {
          type: "p",
          text: "Packs use different formats. A few common patterns are:",
        },
        {
          type: "ul",
          items: [
            "Month and year in numbers, such as \"08/2027\" or \"08-27\".",
            "Month as letters and year, such as \"AUG 2027\" or \"AUG 27\".",
            "Day, month and year, such as \"15/08/2027\".",
          ],
        },
        {
          type: "p",
          text: "When a year has only two digits, \"27\" stands for 2027. In a date with a day, read the order carefully, because packs do not all put the day and month in the same order. If the format is unclear, ask the pharmacist to read it with you.",
        },
        { type: "h2", text: "What to do with an expired medicine" },
        {
          type: "ol",
          items: [
            "Do not use a medicine after its expiry date.",
            "Keep it apart from your current medicines so it is not used by mistake.",
            "Ask a pharmacist what to do with it.",
          ],
        },
        {
          type: "p",
          text: "If the date has been scratched off, overprinted or looks altered, or the pack has no date at all, do not use it. Show it to a pharmacist. You can also report a suspicious product to DGDA.",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "How to report a suspected fake or substandard medicine to DGDA" },
        { type: "h2", text: "What this site can and cannot tell you" },
        {
          type: "p",
          text: "The DGDA registry snapshot used on this site records each registered product's brand, generic, strength, form, manufacturer and DAR number. It does not contain batch numbers, manufacturing dates or expiry dates, so these can only be read from the pack.",
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "How to read a medicine pack: brand, generic, strength, DAR, batch, expiry" },
        { type: "link", href: routes.verify(), label: "Check a brand or DAR number in the registry snapshot" },
        {
          type: "note",
          text: "If you have any doubt about whether a medicine is still fit to use, do not use it. Ask a registered pharmacist or doctor.",
        },
      ],
      faq: [
        {
          q: "What does \"Exp\" mean on a medicine pack?",
          a: "It marks the expiry date. Do not use the medicine after that date.",
        },
        {
          q: "What does \"Mfg\" or \"MFD\" mean?",
          a: "The manufacturing date: when that batch was made. It is earlier than the expiry date.",
        },
        {
          q: "The expiry date shows only a month and year. What does that mean?",
          a: "Packs differ in how they write dates. If you are unsure what the date means for your pack, ask a pharmacist.",
        },
        {
          q: "Can I check an expiry date on this site?",
          a: "No. The registry snapshot has no batch or date information; read the dates on the pack.",
        },
      ],
    },
    bn: {
      title: "ওষুধের উৎপাদন ও মেয়াদোত্তীর্ণের তারিখ কীভাবে দেখবেন",
      description:
        "ওষুধের প্যাকেটে Mfg ও Exp তারিখ কোথায় থাকে, তারিখ সাধারণত কীভাবে লেখা হয়, আর মেয়াদ পেরোলে বা তারিখ অস্পষ্ট হলে কী করবেন।",
      summary:
        "ওষুধের প্যাকেটে উৎপাদনের তারিখ ও মেয়াদোত্তীর্ণের তারিখ ছাপা থাকে, প্রায়ই ছোট ও সংক্ষিপ্ত আকারে। সাধারণ লেবেল আর তারিখের ধরনগুলো এই গাইডে বোঝানো হয়েছে, যাতে আপনি সহজে খুঁজে পড়তে পারেন।",
      body: [
        { type: "h2", text: "তারিখ কোথায় থাকে" },
        {
          type: "p",
          text: "তারিখ সাধারণত ব্যাচ নম্বরের সঙ্গে ছাপা থাকে, প্রায়ই বাক্সের এক পাশের ঢাকনায় বা পেছনে, কিংবা ব্লিস্টার পাতার কিনারায়। অনেক সময় কালি দিয়ে না ছেপে উঁচু করে বা চাপ দিয়ে লেখা হয়, তাই দেখতে কষ্ট হতে পারে। আলোর নিচে প্যাকেটটি একটু কাত করে ধরলে সাধারণত পড়া যায়।",
        },
        {
          type: "p",
          text: "পাতা কেটে নিলে আপনার হাতের টুকরোয় তারিখ নাও থাকতে পারে। ওষুধ শেষ না হওয়া পর্যন্ত বাইরের বাক্সটি রেখে দিন, তাহলে তারিখ ও ব্যাচ নম্বর সবসময় হাতের কাছে থাকবে।",
        },
        { type: "h2", text: "সাধারণ লেবেল" },
        {
          type: "ul",
          items: [
            "Mfg, MFD, Mfg. Date বা Mfd.: উৎপাদনের তারিখ, অর্থাৎ ব্যাচটি কবে তৈরি হয়েছে।",
            "Exp, EXP বা Exp. Date: মেয়াদোত্তীর্ণের তারিখ।",
            "Batch No., B. No. বা Lot: প্যাকেটটি কোন ব্যাচের। সাধারণত তারিখের পাশেই ছাপা থাকে।",
          ],
        },
        {
          type: "p",
          text: "উৎপাদনের তারিখ সবসময় দুটির মধ্যে আগের তারিখ। কোনটি কোন তারিখ বুঝতে না পারলে পরের তারিখটিই মেয়াদোত্তীর্ণের তারিখ, তবে পাশে লেখা লেবেলটিও মিলিয়ে নিন।",
        },
        { type: "h2", text: "তারিখ লেখার সাধারণ ধরন" },
        { type: "p", text: "প্যাকেটভেদে তারিখ লেখার ধরন আলাদা। কয়েকটি প্রচলিত ধরন হলো:" },
        {
          type: "ul",
          items: [
            "সংখ্যায় মাস ও বছর, যেমন \"08/2027\" বা \"08-27\"।",
            "ইংরেজি অক্ষরে মাস ও বছর, যেমন \"AUG 2027\" বা \"AUG 27\"।",
            "দিন, মাস ও বছর, যেমন \"15/08/2027\"।",
          ],
        },
        {
          type: "p",
          text: "বছরের শুধু দুটি অঙ্ক থাকলে \"27\" মানে 2027। দিনসহ তারিখে ক্রমটি সাবধানে পড়ুন, কারণ সব প্যাকেটে দিন ও মাস একই ক্রমে লেখা থাকে না। ধরনটি বুঝতে না পারলে ফার্মাসিস্টকে সঙ্গে নিয়ে পড়ুন।",
        },
        { type: "h2", text: "মেয়াদ পেরিয়ে যাওয়া ওষুধ নিয়ে কী করবেন" },
        {
          type: "ol",
          items: [
            "মেয়াদোত্তীর্ণের তারিখের পরে কোনো ওষুধ ব্যবহার করবেন না।",
            "ভুল করে যেন ব্যবহার না হয়, সে জন্য বর্তমান ওষুধগুলো থেকে আলাদা করে রাখুন।",
            "এটি নিয়ে কী করবেন, ফার্মাসিস্টকে জিজ্ঞেস করুন।",
          ],
        },
        {
          type: "p",
          text: "তারিখ ঘষে তোলা, ওপরে নতুন করে ছাপা বা বদলানো মনে হলে, কিংবা প্যাকেটে কোনো তারিখই না থাকলে, ওষুধটি ব্যবহার করবেন না। ফার্মাসিস্টকে দেখান। সন্দেহজনক পণ্যের কথা DGDA-তেও জানাতে পারেন।",
        },
        { type: "link", href: routes.guide("report-fake-medicine-dgda"), label: "নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন" },
        { type: "h2", text: "এই সাইট কী জানাতে পারে, কী পারে না" },
        {
          type: "p",
          text: "এই সাইটে ব্যবহৃত DGDA রেজিস্ট্রি স্ন্যাপশটে প্রতিটি নিবন্ধিত পণ্যের ব্র্যান্ড, জেনেরিক, শক্তি, ফর্ম, প্রস্তুতকারক ও DAR নম্বর থাকে। এতে ব্যাচ নম্বর, উৎপাদনের তারিখ বা মেয়াদোত্তীর্ণের তারিখ নেই, তাই এগুলো শুধু প্যাকেট থেকেই পড়তে হবে।",
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "ওষুধের প্যাকেট কীভাবে পড়বেন" },
        { type: "link", href: routes.verify(), label: "রেজিস্ট্রি স্ন্যাপশটে ব্র্যান্ড বা DAR নম্বর যাচাই করুন" },
        {
          type: "note",
          text: "কোনো ওষুধ এখনো ব্যবহারযোগ্য কিনা, তা নিয়ে সামান্য সন্দেহ থাকলেও ব্যবহার করবেন না। নিবন্ধিত ফার্মাসিস্ট বা ডাক্তারকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "ওষুধের প্যাকেটে \"Exp\" মানে কী?",
          a: "এটি মেয়াদোত্তীর্ণের তারিখ বোঝায়। ওই তারিখের পরে ওষুধটি ব্যবহার করবেন না।",
        },
        {
          q: "\"Mfg\" বা \"MFD\" মানে কী?",
          a: "উৎপাদনের তারিখ, অর্থাৎ ব্যাচটি কবে তৈরি হয়েছে। এটি মেয়াদোত্তীর্ণের তারিখের আগের তারিখ।",
        },
        {
          q: "মেয়াদের ঘরে শুধু মাস আর বছর লেখা। এর মানে কী?",
          a: "প্যাকেটভেদে তারিখ লেখার নিয়ম আলাদা হয়। আপনার প্যাকেটের তারিখের মানে নিয়ে নিশ্চিত না হলে ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
        {
          q: "এই সাইটে কি মেয়াদোত্তীর্ণের তারিখ যাচাই করা যায়?",
          a: "না। রেজিস্ট্রি স্ন্যাপশটে ব্যাচ বা তারিখের কোনো তথ্য নেই; প্যাকেটে ছাপা তারিখ দেখুন।",
        },
      ],
    },
  },
};
