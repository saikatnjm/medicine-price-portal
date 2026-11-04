import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const reportFakeMedicineDgda: Guide = {
  slug: "report-fake-medicine-dgda",
  category: "registration",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "How to report a suspected fake or substandard medicine to DGDA",
      description:
        "DGDA has an online complaint form for suspected fake, substandard or unregistered medicines. How to reach it safely and what to prepare first.",
      summary:
        "If you suspect a medicine is fake, of poor quality or unregistered, you can tell the Directorate General of Drug Administration (DGDA). This guide explains how to reach DGDA's complaint form safely and what information to have ready.",
      body: [
        { type: "h2", text: "DGDA's complaint form" },
        {
          type: "p",
          text: "DGDA runs an \"Online Medical Product Complaint Entry Form\" as part of its Market Surveillance & Control work. The form is linked from the DGDA homepage. A paper complaint form also exists if you prefer not to use the online one.",
        },
        { type: "p", text: "The online form lets you choose one of these complaint categories:" },
        {
          type: "ul",
          items: [
            "Product quality problem",
            "Suspected fake (falsified or counterfeit) product",
            "Unregistered or unlicensed product",
            "Other",
          ],
        },
        { type: "h2", text: "How to reach the form safely" },
        {
          type: "ol",
          items: [
            "Open your browser and type dgda.gov.bd into the address bar yourself.",
            "On the DGDA homepage, find the link to the medical product complaint form.",
            "Do not use complaint links that arrive by SMS, messaging apps or social media, and do not search for the form through unknown websites. Starting from the address you typed is the safest way to be sure you are on DGDA's own site.",
          ],
        },
        { type: "h2", text: "What to prepare before you start" },
        {
          type: "p",
          text: "The form asks for your name and mobile number; both are required. It also lets you list up to 10 products in one complaint and attach up to 4 files. Having everything ready makes the complaint clearer:",
        },
        {
          type: "ul",
          items: [
            "The pack itself. Keep it, do not throw it away.",
            "The brand name, generic name, strength and dosage form exactly as printed.",
            "The manufacturer's name and the DAR number printed on the pack.",
            "The batch number and the manufacturing and expiry dates.",
            "Where and when you bought it, and the receipt if you have one.",
            "Clear photos of the front, back and sides of the pack, including the printed codes and dates.",
            "A short, factual description of what made you suspicious.",
          ],
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "How to read a medicine pack: brand, generic, strength, DAR, batch, expiry" },
        { type: "h2", text: "Checking the registry first" },
        {
          type: "p",
          text: "Before you file a complaint, it can help to look the product up in the DGDA registry snapshot on this site by DAR number or brand name. If the details do not match the pack, mention that in your complaint. Remember that a match does not prove a pack is genuine, and no match does not prove it is fake: the snapshot is dated, and only DGDA can confirm the current status.",
        },
        { type: "link", href: routes.verify(), label: "Search the registry snapshot by DAR number or brand name" },
        { type: "h2", text: "What this site can and cannot do" },
        {
          type: "ul",
          items: [
            "This site is not run by DGDA and cannot receive complaints on DGDA's behalf.",
            "We do not publish a DGDA hotline number, because we could not verify one.",
            "Telling us about a mistake on one of our pages is separate from a complaint to DGDA and does not reach DGDA.",
          ],
        },
        { type: "link", href: routes.guide("what-is-dgda"), label: "What is DGDA?" },
        {
          type: "note",
          text: "Do not use a medicine you think may be fake or substandard. Ask a registered doctor or pharmacist what to do about your treatment.",
        },
      ],
      faq: [
        {
          q: "Where do I find DGDA's complaint form?",
          a: "Type dgda.gov.bd into your browser yourself and follow the link to the medical product complaint form from the DGDA homepage.",
        },
        {
          q: "What information is required?",
          a: "Your name and mobile number are required. You can list up to 10 products and attach up to 4 files, such as photos of the pack.",
        },
        {
          q: "Can I complain without using the internet?",
          a: "A paper complaint form also exists. Check the DGDA website for how to obtain and submit it.",
        },
        {
          q: "Is there a phone number for complaints?",
          a: "We could not verify a DGDA complaint hotline, so we do not publish one. Use the form linked from dgda.gov.bd.",
        },
        {
          q: "Can I report a medicine through this website?",
          a: "No. This site is independent and cannot pass complaints to DGDA. Please use DGDA's own form.",
        },
      ],
    },
    bn: {
      title: "নকল বা নিম্নমানের ওষুধ DGDA-তে কীভাবে জানাবেন",
      description:
        "নকল, নিম্নমানের বা অনিবন্ধিত ওষুধ নিয়ে অভিযোগ জানাতে DGDA-র একটি অনলাইন ফর্ম আছে। নিরাপদে কীভাবে সেখানে যাবেন এবং আগে কী প্রস্তুত রাখবেন।",
      summary:
        "কোনো ওষুধ নকল, নিম্নমানের বা অনিবন্ধিত বলে সন্দেহ হলে ঔষধ প্রশাসন অধিদপ্তরকে (DGDA) জানাতে পারেন। DGDA-র অভিযোগ ফর্মে নিরাপদে কীভাবে যাবেন এবং কী কী তথ্য হাতে রাখবেন, তা এই গাইডে বলা হয়েছে।",
      body: [
        { type: "h2", text: "DGDA-র অভিযোগ ফর্ম" },
        {
          type: "p",
          text: "DGDA তাদের মার্কেট সার্ভেইল্যান্স ও কন্ট্রোল (Market Surveillance & Control) কার্যক্রমের অংশ হিসেবে \"Online Medical Product Complaint Entry Form\" নামে একটি অনলাইন অভিযোগ ফর্ম চালায়। DGDA-র হোমপেজে এই ফর্মের লিংক আছে। অনলাইন ফর্ম ব্যবহার করতে না চাইলে কাগজের অভিযোগ ফর্মও আছে।",
        },
        { type: "p", text: "অনলাইন ফর্মে এই অভিযোগ বিভাগগুলোর একটি বেছে নেওয়া যায়:" },
        {
          type: "ul",
          items: [
            "পণ্যের মান নিয়ে সমস্যা",
            "সন্দেহজনক নকল (ভেজাল বা জাল) পণ্য",
            "অনিবন্ধিত বা লাইসেন্সবিহীন পণ্য",
            "অন্যান্য",
          ],
        },
        { type: "h2", text: "নিরাপদে ফর্মে যাবেন কীভাবে" },
        {
          type: "ol",
          items: [
            "ব্রাউজার খুলে ঠিকানার ঘরে নিজে dgda.gov.bd লিখুন।",
            "DGDA-র হোমপেজে ওষুধ পণ্যের অভিযোগ ফর্মের লিংকটি খুঁজে নিন।",
            "এসএমএস, মেসেজিং অ্যাপ বা সোশ্যাল মিডিয়ায় আসা অভিযোগের লিংক ব্যবহার করবেন না, আর অচেনা ওয়েবসাইটের মাধ্যমেও ফর্মটি খুঁজবেন না। নিজের লেখা ঠিকানা থেকে শুরু করাই নিশ্চিত হওয়ার সবচেয়ে নিরাপদ উপায় যে আপনি DGDA-র নিজস্ব সাইটে আছেন।",
          ],
        },
        { type: "h2", text: "শুরুর আগে যা প্রস্তুত রাখবেন" },
        {
          type: "p",
          text: "ফর্মে আপনার নাম ও মোবাইল নম্বর চাওয়া হয়; দুটোই বাধ্যতামূলক। একটি অভিযোগে সর্বোচ্চ 10টি পণ্যের তথ্য দেওয়া যায় এবং সর্বোচ্চ 4টি ফাইল সংযুক্ত করা যায়। সবকিছু হাতের কাছে থাকলে অভিযোগ পরিষ্কার হয়:",
        },
        {
          type: "ul",
          items: [
            "ওষুধের প্যাকেটটি। এটি রেখে দিন, ফেলে দেবেন না।",
            "ব্র্যান্ড নাম, জেনেরিক নাম, শক্তি ও ডোজ ফর্ম, ঠিক যেমন ছাপা আছে।",
            "প্যাকেটে ছাপা প্রস্তুতকারকের নাম ও DAR নম্বর।",
            "ব্যাচ নম্বর এবং উৎপাদন ও মেয়াদোত্তীর্ণের তারিখ।",
            "কোথায় ও কবে কিনেছেন, আর রসিদ থাকলে সেটি।",
            "প্যাকেটের সামনে, পেছনে ও পাশের স্পষ্ট ছবি, যেখানে ছাপা কোড ও তারিখ পড়া যায়।",
            "কী দেখে সন্দেহ হলো, তার সংক্ষিপ্ত ও তথ্যভিত্তিক বিবরণ।",
          ],
        },
        { type: "link", href: routes.guide("read-a-medicine-pack"), label: "ওষুধের প্যাকেট কীভাবে পড়বেন" },
        { type: "h2", text: "আগে রেজিস্ট্রি মিলিয়ে দেখুন" },
        {
          type: "p",
          text: "অভিযোগ করার আগে এই সাইটের DGDA রেজিস্ট্রি স্ন্যাপশটে DAR নম্বর বা ব্র্যান্ড নাম দিয়ে পণ্যটি খুঁজে দেখা কাজে লাগতে পারে। তথ্য প্যাকেটের সঙ্গে না মিললে সেটি অভিযোগে উল্লেখ করুন। মনে রাখবেন, মিল পাওয়া মানেই প্যাকেট আসল নয়, আর মিল না পাওয়া মানেই নকল নয়: স্ন্যাপশটটি একটি নির্দিষ্ট তারিখের, আর হালনাগাদ অবস্থা শুধু DGDA-ই নিশ্চিত করতে পারে।",
        },
        { type: "link", href: routes.verify(), label: "DAR নম্বর বা ব্র্যান্ড নাম দিয়ে রেজিস্ট্রি স্ন্যাপশটে খুঁজুন" },
        { type: "h2", text: "এই সাইট কী পারে আর কী পারে না" },
        {
          type: "ul",
          items: [
            "এই সাইট DGDA চালায় না, এবং DGDA-র পক্ষে কোনো অভিযোগ গ্রহণ করতে পারে না।",
            "আমরা DGDA-র কোনো হটলাইন নম্বর প্রকাশ করি না, কারণ যাচাই করা কোনো নম্বর পাইনি।",
            "আমাদের কোনো পাতার ভুল আমাদের জানানো আর DGDA-তে অভিযোগ করা আলাদা বিষয়; আমাদের জানালে তা DGDA-র কাছে পৌঁছায় না।",
          ],
        },
        { type: "link", href: routes.guide("what-is-dgda"), label: "ঔষধ প্রশাসন অধিদপ্তর (DGDA) কী?" },
        {
          type: "note",
          text: "যে ওষুধ নকল বা নিম্নমানের মনে হচ্ছে, তা ব্যবহার করবেন না। আপনার চিকিৎসা নিয়ে কী করবেন, তা নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "DGDA-র অভিযোগ ফর্ম কোথায় পাব?",
          a: "ব্রাউজারে নিজে dgda.gov.bd লিখুন এবং DGDA-র হোমপেজ থেকে ওষুধ পণ্যের অভিযোগ ফর্মের লিংকে যান।",
        },
        {
          q: "কোন কোন তথ্য দেওয়া বাধ্যতামূলক?",
          a: "আপনার নাম ও মোবাইল নম্বর বাধ্যতামূলক। সর্বোচ্চ 10টি পণ্যের তথ্য দেওয়া যায় এবং প্যাকেটের ছবির মতো সর্বোচ্চ 4টি ফাইল সংযুক্ত করা যায়।",
        },
        {
          q: "ইন্টারনেট ছাড়া কি অভিযোগ করা যায়?",
          a: "কাগজের অভিযোগ ফর্মও আছে। কীভাবে সেটি পাবেন ও জমা দেবেন, তা DGDA-র ওয়েবসাইটে দেখে নিন।",
        },
        {
          q: "অভিযোগের জন্য কোনো ফোন নম্বর আছে?",
          a: "DGDA-র কোনো অভিযোগ হটলাইন আমরা যাচাই করতে পারিনি, তাই কোনো নম্বর প্রকাশ করছি না। dgda.gov.bd থেকে লিংক করা ফর্মটি ব্যবহার করুন।",
        },
        {
          q: "এই ওয়েবসাইটের মাধ্যমে কি অভিযোগ করা যায়?",
          a: "না। এটি একটি স্বতন্ত্র সাইট এবং DGDA-র কাছে অভিযোগ পৌঁছে দিতে পারে না। দয়া করে DGDA-র নিজস্ব ফর্ম ব্যবহার করুন।",
        },
      ],
    },
  },
};
