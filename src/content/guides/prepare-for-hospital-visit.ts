import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const prepareForHospitalVisit: Guide = {
  slug: "prepare-for-hospital-visit",
  category: "healthcare",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Checklist: preparing for a hospital visit (papers, reports, medicine list)",
      description:
        "A practical checklist for a planned hospital or clinic visit: what to confirm before you go, and which papers, reports and medicine details to bring.",
      summary:
        "A little preparation can make a planned hospital or clinic visit smoother. This checklist covers the practical side only: confirming details before you leave, and the papers and information worth carrying.",
      body: [
        {
          type: "note",
          text: "In an emergency, do not wait to prepare. Call 999, Bangladesh's national emergency number, or go to the nearest hospital with emergency services.",
        },
        { type: "link", href: routes.emergency(), label: "Emergency hospitals and the 999 helpline" },
        { type: "h2", text: "Before you go" },
        {
          type: "p",
          text: "Hospital and clinic listings on this site come from OpenStreetMap, a community-built map. They are not verified, so details such as opening hours, departments or phone numbers may be missing or out of date.",
        },
        {
          type: "ol",
          items: [
            "Confirm with the hospital or clinic directly that it is open, and that the department or doctor you need is available that day.",
            "Ask whether you need an appointment or a serial number in advance, and what time to arrive.",
            "Ask what you should bring, such as earlier reports or a referral letter.",
            "Check the address and plan your route and transport, including the way back.",
            "If possible, arrange for a family member or friend to come with you.",
          ],
        },
        { type: "link", href: routes.hospitals(), label: "Find hospitals and clinics" },
        { type: "h2", text: "Papers to bring" },
        {
          type: "ul",
          items: [
            "An identity document, such as a national ID card, and a copy if the hospital asks for one.",
            "Appointment slip, serial number or booking message, if you have one.",
            "Referral letter, if a doctor referred you.",
            "Previous prescriptions, in date order.",
            "Earlier test reports, X-ray films, scan reports and discharge papers.",
            "Any hospital or patient card from earlier visits to the same hospital.",
          ],
        },
        {
          type: "p",
          text: "Keep the papers together in one folder or envelope, newest on top. A photo of each document on your phone is a useful backup, but bring the originals too.",
        },
        { type: "h2", text: "Medicine details" },
        {
          type: "ul",
          items: [
            "A written list of the medicines the patient is currently taking, with brand name, generic name, strength and form.",
            "The packs or strips themselves, if the list is not up to date.",
            "Any allergies or reactions exactly as a doctor recorded them.",
          ],
        },
        { type: "link", href: routes.guide("keep-family-medicine-list"), label: "How to keep your family's medicine list" },
        { type: "h2", text: "Practical things" },
        {
          type: "ul",
          items: [
            "Money or a payment method for registration, consultation and tests; ask in advance what is accepted.",
            "A charged phone, and phone numbers of family members written on paper too.",
            "A pen and notebook to write down what the doctor says, and the questions you want to ask, written before the visit.",
            "Water, and for a long wait, something to keep children occupied.",
            "For a child or an older relative, their own papers, and an adult who knows their history.",
          ],
        },
        { type: "h2", text: "After the visit" },
        {
          type: "ol",
          items: [
            "Make sure you have every new prescription and report before leaving.",
            "Read back what the doctor wrote, and ask if anything is unclear.",
            "Add new medicines to the family medicine list, copying the instructions from the prescription.",
            "Note the date of any follow-up visit.",
          ],
        },
        {
          type: "note",
          text: "This checklist is about logistics only. For any question about symptoms, tests or medicines, ask a registered doctor or pharmacist.",
        },
      ],
      faq: [
        {
          q: "Are the hospital opening hours on this site correct?",
          a: "They may not be. Listings come from OpenStreetMap and are unverified. Contact the hospital before you go.",
        },
        {
          q: "Should I bring old reports even if they are years old?",
          a: "Ask the hospital what they need. If in doubt, bring them in a folder; the doctor can decide what is relevant.",
        },
        {
          q: "What if I don't know the generic names of my medicines?",
          a: "Bring the packs. You can also look up a brand on this site to see its generic name and strength from the DGDA registry snapshot.",
        },
        {
          q: "What should I do in an emergency?",
          a: "Call 999, the national emergency number, or go to the nearest hospital with emergency services. Don't delay to collect papers.",
        },
      ],
    },
    bn: {
      title: "হাসপাতালে যাওয়ার প্রস্তুতি: চেকলিস্ট",
      description:
        "বাংলাদেশে পূর্বনির্ধারিত হাসপাতাল বা ক্লিনিক ভিজিটের ব্যবহারিক চেকলিস্ট: যাওয়ার আগে কী নিশ্চিত করবেন এবং কোন কাগজপত্র, রিপোর্ট ও ওষুধের তথ্য নেবেন।",
      summary:
        "একটু প্রস্তুতি নিলে আগে থেকে ঠিক করা হাসপাতাল বা ক্লিনিক ভিজিট অনেক সহজ হয়। এই চেকলিস্টে শুধু ব্যবহারিক দিকগুলো আছে: বের হওয়ার আগে কী নিশ্চিত করবেন, আর কোন কাগজপত্র ও তথ্য সঙ্গে রাখা ভালো।",
      body: [
        {
          type: "note",
          text: "জরুরি অবস্থায় প্রস্তুতির জন্য অপেক্ষা করবেন না। বাংলাদেশের জাতীয় জরুরি নম্বর 999-এ কল করুন, অথবা জরুরি সেবা আছে এমন নিকটতম হাসপাতালে যান।",
        },
        { type: "link", href: routes.emergency(), label: "জরুরি সেবার হাসপাতাল ও 999 হেল্পলাইন" },
        { type: "h2", text: "যাওয়ার আগে" },
        {
          type: "p",
          text: "এই সাইটের হাসপাতাল ও ক্লিনিকের তালিকা আসে OpenStreetMap থেকে, যা কমিউনিটির তৈরি একটি মানচিত্র। এই তথ্য যাচাই করা হয়নি, তাই খোলার সময়, বিভাগ বা ফোন নম্বরের মতো তথ্য না থাকতে পারে বা পুরোনো হতে পারে।",
        },
        {
          type: "ol",
          items: [
            "হাসপাতাল বা ক্লিনিক খোলা আছে কিনা, আর যে বিভাগ বা ডাক্তার দরকার তিনি সেদিন আছেন কিনা, সরাসরি তাদের কাছ থেকে নিশ্চিত হয়ে নিন।",
            "আগে থেকে অ্যাপয়েন্টমেন্ট বা সিরিয়াল নিতে হবে কিনা, আর কখন পৌঁছাতে হবে, জিজ্ঞেস করুন।",
            "আগের রিপোর্ট বা রেফারেল চিঠির মতো কী কী নিতে হবে, জেনে নিন।",
            "ঠিকানা মিলিয়ে নিন এবং যাওয়া-আসার পথ ও যানবাহন আগে থেকে ঠিক করে রাখুন।",
            "সম্ভব হলে পরিবারের কোনো সদস্য বা বন্ধুকে সঙ্গে নিন।",
          ],
        },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক খুঁজুন" },
        { type: "h2", text: "যে কাগজপত্র নেবেন" },
        {
          type: "ul",
          items: [
            "পরিচয়পত্র, যেমন জাতীয় পরিচয়পত্র, আর হাসপাতাল চাইলে তার একটি ফটোকপি।",
            "অ্যাপয়েন্টমেন্ট স্লিপ, সিরিয়াল নম্বর বা বুকিংয়ের মেসেজ, যদি থাকে।",
            "রেফারেল চিঠি, যদি কোনো ডাক্তার পাঠিয়ে থাকেন।",
            "আগের প্রেসক্রিপশনগুলো, তারিখ অনুযায়ী সাজিয়ে।",
            "আগের পরীক্ষার রিপোর্ট, এক্স-রে ফিল্ম, স্ক্যান রিপোর্ট ও ছাড়পত্র (ডিসচার্জ পেপার)।",
            "একই হাসপাতালে আগে গিয়ে থাকলে সেখানকার হাসপাতাল বা রোগীর কার্ড।",
          ],
        },
        {
          type: "p",
          text: "সব কাগজ একটি ফাইল বা খামে একসঙ্গে রাখুন, সবচেয়ে নতুনটি ওপরে। প্রতিটি কাগজের ছবি ফোনে রাখলে ভালো ব্যাকআপ হয়, তবে মূল কাগজগুলোও সঙ্গে নিন।",
        },
        { type: "h2", text: "ওষুধের তথ্য" },
        {
          type: "ul",
          items: [
            "রোগী বর্তমানে যেসব ওষুধ খাচ্ছেন তার লিখিত তালিকা: ব্র্যান্ড নাম, জেনেরিক নাম, শক্তি ও ফর্মসহ।",
            "তালিকা হালনাগাদ না থাকলে ওষুধের প্যাকেট বা পাতাগুলোই সঙ্গে নিন।",
            "অ্যালার্জি বা কোনো প্রতিক্রিয়ার কথা, ঠিক যেভাবে ডাক্তার লিখেছেন।",
          ],
        },
        { type: "link", href: routes.guide("keep-family-medicine-list"), label: "পরিবারের ওষুধের তালিকা কীভাবে রাখবেন" },
        { type: "h2", text: "ব্যবহারিক জিনিসপত্র" },
        {
          type: "ul",
          items: [
            "রেজিস্ট্রেশন, পরামর্শ ফি ও পরীক্ষার জন্য টাকা বা পেমেন্টের ব্যবস্থা; কোন মাধ্যমে টাকা নেওয়া হয়, আগে জেনে নিন।",
            "চার্জ দেওয়া ফোন, আর পরিবারের সদস্যদের ফোন নম্বর কাগজেও লিখে রাখুন।",
            "ডাক্তার যা বলেন তা লিখে রাখার জন্য কলম ও খাতা, আর যে প্রশ্নগুলো করতে চান সেগুলো আগেই লিখে নিন।",
            "পানি, আর লম্বা অপেক্ষা হলে শিশুদের ব্যস্ত রাখার মতো কিছু।",
            "শিশু বা বয়স্ক আত্মীয়ের জন্য তাঁদের নিজের কাগজপত্র, এবং তাঁদের আগের অসুখের ইতিহাস জানেন এমন একজন প্রাপ্তবয়স্ক সঙ্গী।",
          ],
        },
        { type: "h2", text: "ভিজিটের পরে" },
        {
          type: "ol",
          items: [
            "বের হওয়ার আগে নতুন সব প্রেসক্রিপশন ও রিপোর্ট হাতে পেয়েছেন কিনা নিশ্চিত হোন।",
            "ডাক্তার যা লিখেছেন তা পড়ে দেখুন, কিছু অস্পষ্ট হলে জিজ্ঞেস করুন।",
            "নতুন ওষুধগুলো পরিবারের ওষুধের তালিকায় যোগ করুন, নির্দেশনা প্রেসক্রিপশন থেকে হুবহু লিখুন।",
            "পরের ভিজিটের তারিখ থাকলে লিখে রাখুন।",
          ],
        },
        {
          type: "note",
          text: "এই চেকলিস্ট শুধু প্রস্তুতি ও ব্যবস্থাপনা নিয়ে। উপসর্গ, পরীক্ষা বা ওষুধ নিয়ে যেকোনো প্রশ্নে নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "এই সাইটে হাসপাতালের খোলার সময় কি সঠিক?",
          a: "নাও হতে পারে। তালিকা আসে OpenStreetMap থেকে এবং যাচাই করা হয়নি। যাওয়ার আগে হাসপাতালের সঙ্গে যোগাযোগ করুন।",
        },
        {
          q: "কয়েক বছরের পুরোনো রিপোর্টও কি নেব?",
          a: "হাসপাতালের কাছে জেনে নিন তাদের কী লাগবে। সন্দেহ থাকলে একটি ফাইলে করে নিয়ে যান; কোনটি দরকারি, ডাক্তার ঠিক করবেন।",
        },
        {
          q: "আমার ওষুধের জেনেরিক নাম না জানলে কী করব?",
          a: "প্যাকেটগুলো সঙ্গে নিন। এই সাইটে ব্র্যান্ড দিয়ে খুঁজেও DGDA রেজিস্ট্রি স্ন্যাপশট থেকে জেনেরিক নাম ও শক্তি দেখতে পারেন।",
        },
        {
          q: "জরুরি অবস্থায় কী করব?",
          a: "জাতীয় জরুরি নম্বর 999-এ কল করুন, অথবা জরুরি সেবা আছে এমন নিকটতম হাসপাতালে যান। কাগজপত্র গোছাতে গিয়ে দেরি করবেন না।",
        },
      ],
    },
  },
};
