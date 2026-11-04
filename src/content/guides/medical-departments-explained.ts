import { routes } from "@/lib/routes";
import type { Guide } from "./types";

export const medicalDepartmentsExplained: Guide = {
  slug: "medical-departments-explained",
  category: "healthcare",
  updatedAt: "2026-11-04",
  content: {
    en: {
      title: "Hospital department names explained (cardiology, neurology…)",
      description:
        "Plain-language meanings of hospital department names such as cardiology, neurology, ENT, paediatrics and radiology, with links to each specialty page.",
      summary:
        "Hospital signboards and prescriptions often use department names like cardiology, nephrology or ENT. This guide explains in plain words what each name refers to.",
      body: [
        { type: "h2", text: "How the names are built" },
        {
          type: "p",
          text: "Most department names come from Greek or Latin words. A few patterns make them easier to read:",
        },
        {
          type: "ul",
          items: [
            "\"-logy\" means the study or branch of something: cardiology is the branch concerned with the heart.",
            "\"-logist\" or \"-ist\" is the doctor who practises it: a cardiologist, a dermatologist, a dentist.",
            "\"Surgery\" in a name means the department operates, for example general surgery or neurosurgery.",
            "Bangla names are also used, such as হৃদরোগ (heart diseases) for cardiology or শিশুরোগ (children's diseases) for paediatrics.",
          ],
        },
        { type: "h2", text: "Departments named after a part of the body" },
        {
          type: "ul",
          items: [
            "Cardiology: the branch of medicine concerned with the heart and blood vessels.",
            "Dermatology: the branch of medicine concerned with the skin, hair and nails.",
            "Endocrinology: the branch of medicine concerned with hormones and the glands that produce them, including diabetes and thyroid conditions.",
            "ENT (Otolaryngology): the branch of medicine concerned with the ear, nose and throat.",
            "Gastroenterology: the branch of medicine concerned with the digestive system, including the stomach, intestines and liver.",
            "Nephrology: the branch of medicine concerned with the kidneys.",
            "Neurology: the branch of medicine concerned with the brain, spinal cord and nerves.",
            "Ophthalmology: the branch of medicine concerned with the eyes and vision.",
            "Orthopaedics: the branch of medicine concerned with bones, joints, ligaments and muscles.",
            "Pulmonology: the branch of medicine concerned with the lungs and breathing.",
            "Urology: the branch of medicine concerned with the urinary system and male reproductive organs.",
          ],
        },
        { type: "h2", text: "Surgical departments" },
        {
          type: "ul",
          items: [
            "General Surgery: surgery covering a broad range of conditions, commonly of the abdomen.",
            "Cardiothoracic Surgery: surgery of the heart, lungs and other organs in the chest.",
            "Neurosurgery: surgery of the brain, spine and nervous system.",
          ],
        },
        { type: "h2", text: "Departments for a group of people or a kind of care" },
        {
          type: "ul",
          items: [
            "General Practice: primary, general medical care for people of all ages.",
            "Internal Medicine: the diagnosis and non-surgical care of conditions affecting adults' internal organs. A doctor in this field is often called a medicine specialist.",
            "Paediatrics: medical care of babies, children and adolescents.",
            "Gynaecology & Obstetrics: the branches of medicine concerned with women's reproductive health, pregnancy and childbirth.",
            "Oncology: the branch of medicine concerned with cancer.",
            "Psychiatry: the branch of medicine concerned with mental health.",
            "Dentistry: care of the teeth, gums and mouth.",
          ],
        },
        { type: "h2", text: "Imaging" },
        {
          type: "ul",
          items: ["Radiology: medical imaging such as X-ray, ultrasound, CT and MRI."],
        },
        { type: "h2", text: "Finding departments on this site" },
        {
          type: "p",
          text: "Each department below has its own page listing the hospitals and clinics whose OpenStreetMap data records it. Many facilities do not record their departments at all, so a facility missing from a department page may still offer that service. Always confirm with the facility before you go.",
        },
        { type: "specialtyLinks" },
        { type: "link", href: routes.specialties(), label: "All medical specialties" },
        { type: "link", href: routes.hospitals(), label: "Browse hospitals & clinics" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "Checklist: preparing for a hospital visit" },
        {
          type: "note",
          text: "A department name tells you what a field covers, not which one you need. Ask a registered doctor or pharmacist which kind of care is right for you.",
        },
      ],
      faq: [
        {
          q: "What does cardiology mean?",
          a: "Cardiology is the branch of medicine concerned with the heart and blood vessels. A doctor in this field is called a cardiologist.",
        },
        {
          q: "What is ENT?",
          a: "ENT stands for ear, nose and throat. Its formal name is otolaryngology.",
        },
        {
          q: "What is the difference between neurology and neurosurgery?",
          a: "Neurology is the branch of medicine concerned with the brain, spinal cord and nerves. Neurosurgery is surgery of the brain, spine and nervous system.",
        },
        {
          q: "Which department should I go to?",
          a: "This site cannot tell you. Ask a registered doctor, who can refer you to the right department.",
        },
      ],
    },
    bn: {
      title: "হাসপাতালের বিভাগের নাম ও অর্থ",
      description:
        "কার্ডিওলজি, নিউরোলজি, নাক-কান-গলা, শিশুরোগ ও রেডিওলজির মতো হাসপাতালের বিভাগের নামের সহজ অর্থ, সঙ্গে প্রতিটি বিশেষজ্ঞ বিভাগের পাতার লিংক।",
      summary:
        "হাসপাতালের সাইনবোর্ড আর প্রেসক্রিপশনে প্রায়ই কার্ডিওলজি, নেফ্রোলজি বা ইএনটির মতো বিভাগের নাম দেখা যায়। প্রতিটি নাম কী বোঝায়, এই গাইডে তা সহজ ভাষায় বলা হয়েছে।",
      body: [
        { type: "h2", text: "নামগুলো কীভাবে তৈরি" },
        {
          type: "p",
          text: "বেশির ভাগ বিভাগের নাম গ্রিক বা ল্যাটিন শব্দ থেকে এসেছে। কয়েকটি ধরন জানা থাকলে নামগুলো পড়া সহজ হয়:",
        },
        {
          type: "ul",
          items: [
            "\"-logy\" (লজি) মানে কোনো বিষয়ের চর্চা বা শাখা: কার্ডিওলজি হলো হৃৎপিণ্ড সংক্রান্ত শাখা।",
            "\"-logist\" বা \"-ist\" মানে সেই শাখার ডাক্তার: কার্ডিওলজিস্ট, ডার্মাটোলজিস্ট, ডেন্টিস্ট।",
            "নামে \"Surgery\" (সার্জারি) থাকলে বোঝায় বিভাগটি অস্ত্রোপচার করে, যেমন জেনারেল সার্জারি বা নিউরোসার্জারি।",
            "বাংলা নামও ব্যবহার হয়, যেমন কার্ডিওলজিকে হৃদরোগ বা পেডিয়াট্রিকসকে শিশুরোগ বিভাগ।",
          ],
        },
        { type: "h2", text: "শরীরের অঙ্গের নামে বিভাগ" },
        {
          type: "ul",
          items: [
            "হৃদরোগ (Cardiology): হৃৎপিণ্ড ও রক্তনালি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "চর্মরোগ (Dermatology): ত্বক, চুল ও নখ সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "এন্ডোক্রাইনোলজি (Endocrinology): হরমোন এবং হরমোন তৈরি করে এমন গ্রন্থি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা; ডায়াবেটিস ও থাইরয়েডের সমস্যাও এর মধ্যে পড়ে।",
            "নাক-কান-গলা (ENT, Otolaryngology): কান, নাক ও গলা সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "গ্যাস্ট্রোএন্টারোলজি (Gastroenterology): পাকস্থলী, অন্ত্র ও যকৃৎসহ পরিপাকতন্ত্র সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "কিডনি রোগ (Nephrology): কিডনি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "স্নায়ুরোগ (Neurology): মস্তিষ্ক, সুষুম্নাকাণ্ড ও স্নায়ু সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "চক্ষু (Ophthalmology): চোখ ও দৃষ্টি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "অর্থোপেডিকস (Orthopaedics): হাড়, জোড়া, লিগামেন্ট ও পেশি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "বক্ষব্যাধি (Pulmonology): ফুসফুস ও শ্বাসপ্রশ্বাস সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "ইউরোলজি (Urology): মূত্রতন্ত্র ও পুরুষের প্রজনন অঙ্গ সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
          ],
        },
        { type: "h2", text: "সার্জারি বিভাগ" },
        {
          type: "ul",
          items: [
            "জেনারেল সার্জারি (General Surgery): নানা ধরনের সমস্যার অস্ত্রোপচার, সাধারণত পেটের।",
            "কার্ডিওথোরাসিক সার্জারি (Cardiothoracic Surgery): হৃৎপিণ্ড, ফুসফুস ও বুকের অন্যান্য অঙ্গের অস্ত্রোপচার।",
            "নিউরোসার্জারি (Neurosurgery): মস্তিষ্ক, মেরুদণ্ড ও স্নায়ুতন্ত্রের অস্ত্রোপচার।",
          ],
        },
        { type: "h2", text: "নির্দিষ্ট মানুষ বা নির্দিষ্ট ধরনের সেবার বিভাগ" },
        {
          type: "ul",
          items: [
            "সাধারণ চিকিৎসা (General Practice): সব বয়সের মানুষের প্রাথমিক ও সাধারণ চিকিৎসাসেবা।",
            "মেডিসিন (Internal Medicine): প্রাপ্তবয়স্কদের শরীরের ভেতরের অঙ্গের সমস্যার রোগনির্ণয় ও অস্ত্রোপচার ছাড়া চিকিৎসা। এই শাখার ডাক্তারকে সাধারণত মেডিসিন বিশেষজ্ঞ বলা হয়।",
            "শিশুরোগ (Paediatrics): নবজাতক, শিশু ও কিশোর-কিশোরীদের চিকিৎসাসেবা।",
            "স্ত্রীরোগ ও প্রসূতি (Gynaecology & Obstetrics): নারীর প্রজনন স্বাস্থ্য, গর্ভাবস্থা ও সন্তান প্রসব সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "ক্যানসার (Oncology): ক্যানসার সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "মনোরোগ (Psychiatry): মানসিক স্বাস্থ্য সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা।",
            "দন্তচিকিৎসা (Dentistry): দাঁত, মাড়ি ও মুখের যত্ন।",
          ],
        },
        { type: "h2", text: "ইমেজিং" },
        {
          type: "ul",
          items: ["রেডিওলজি (Radiology): এক্স-রে, আলট্রাসাউন্ড, সিটি ও এমআরআই-এর মতো মেডিক্যাল ইমেজিং।"],
        },
        { type: "h2", text: "এই সাইটে বিভাগ খোঁজা" },
        {
          type: "p",
          text: "নিচের প্রতিটি বিভাগের নিজস্ব পাতা আছে, যেখানে সেসব হাসপাতাল ও ক্লিনিকের তালিকা থাকে, যাদের OpenStreetMap তথ্যে বিভাগটি লেখা আছে। অনেক প্রতিষ্ঠান তাদের বিভাগের তথ্য একেবারেই দেয়নি, তাই কোনো বিভাগের পাতায় না থাকলেও প্রতিষ্ঠানটিতে সেই সেবা থাকতে পারে। যাওয়ার আগে সবসময় প্রতিষ্ঠানের সঙ্গে কথা বলে নিশ্চিত হয়ে নিন।",
        },
        { type: "specialtyLinks" },
        { type: "link", href: routes.specialties(), label: "সব বিশেষজ্ঞ বিভাগ" },
        { type: "link", href: routes.hospitals(), label: "হাসপাতাল ও ক্লিনিক দেখুন" },
        { type: "link", href: routes.guide("prepare-for-hospital-visit"), label: "হাসপাতালে যাওয়ার প্রস্তুতি: চেকলিস্ট" },
        {
          type: "note",
          text: "বিভাগের নাম শুধু বলে শাখাটি কী নিয়ে কাজ করে, আপনার কোনটি দরকার তা নয়। আপনার জন্য কোন ধরনের সেবা ঠিক, তা নিবন্ধিত ডাক্তার বা ফার্মাসিস্টকে জিজ্ঞেস করুন।",
        },
      ],
      faq: [
        {
          q: "কার্ডিওলজি মানে কী?",
          a: "কার্ডিওলজি হলো হৃৎপিণ্ড ও রক্তনালি সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা, বাংলায় সাধারণত হৃদরোগ বিভাগ। এই শাখার ডাক্তারকে কার্ডিওলজিস্ট বলে।",
        },
        {
          q: "ইএনটি (ENT) কী?",
          a: "ENT মানে ইংরেজিতে Ear, Nose, Throat, অর্থাৎ নাক-কান-গলা। এর আনুষ্ঠানিক নাম অটোল্যারিঙ্গোলজি (Otolaryngology)।",
        },
        {
          q: "নিউরোলজি আর নিউরোসার্জারির পার্থক্য কী?",
          a: "নিউরোলজি হলো মস্তিষ্ক, সুষুম্নাকাণ্ড ও স্নায়ু সংক্রান্ত চিকিৎসাবিজ্ঞানের শাখা। নিউরোসার্জারি হলো মস্তিষ্ক, মেরুদণ্ড ও স্নায়ুতন্ত্রের অস্ত্রোপচার।",
        },
        {
          q: "আমি কোন বিভাগে যাব?",
          a: "এই সাইট তা বলতে পারে না। একজন নিবন্ধিত ডাক্তারকে জিজ্ঞেস করুন; তিনি সঠিক বিভাগে পাঠাতে পারবেন।",
        },
      ],
    },
  },
};
