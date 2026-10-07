import { defineMessages } from "../define";

/** doctor strings. Keys are prefixed "doctor.". */
export const doctor = defineMessages({
  en: {
    "doctor.crumb.home": "Home",
    "doctor.crumb.doctors": "Doctors",
    "doctor.dot": ".",

    "doctor.notFound.title": "Doctor not found",
    "doctor.notFound.list": "Doctors not found",
    "doctor.notFound.text":
      "We could not find that doctor profile. Doctor profiles are only listed from verified or consented sources.",
    "doctor.notFound.doctors": "Doctors",
    "doctor.notFound.specialties": "Browse specialties",
    "doctor.notFound.hospitals": "Hospitals & clinics",

    "doctor.count.one": "{n} doctor",
    "doctor.count.other": "{n} doctors",

    "doctor.scope.place": "{place}",
    "doctor.scope.bangladesh": "Bangladesh",
    "doctor.who.any": "Doctors",
    "doctor.who.anyLower": "doctors",
    "doctor.list.heading": "{who} in {where}",
    "doctor.desc.empty":
      "Doctor profiles are only listed from verified or consented sources. Browse hospitals and clinics in {where} instead.",
    "doctor.desc.found":
      "Find {who} in {where}: {profiles} with chamber addresses, consultation times and appointment contacts.",
    "doctor.desc.profiles.one": "{n} listed profile",
    "doctor.desc.profiles.other": "{n} listed profiles",
    "doctor.title.titleInPlace": "{title} in {place}",
    "doctor.title.inPlace": "in {place}",
    "doctor.desc.intro": "{head}.",
    "doctor.desc.introPlace": "{head} in {place}.",
    "doctor.desc.sentence": "{text}.",
    "doctor.desc.qualifications": "Qualifications: {text}.",
    "doctor.desc.chambers": "Chamber addresses, consultation times and appointment contacts.",

    "doctor.actions.contact": "Contact {name}",
    "doctor.actions.call": "Call",
    "doctor.actions.directions": "Directions",
    "doctor.actions.directionsSr": "to {name} (opens Google Maps)",
    "doctor.actions.appointment": "Appointment",
    "doctor.actions.appointmentSr": "with {name} (opens the booking page)",

    "doctor.chamber.facility": "Facility",
    "doctor.chamber.days": "Consultation days",
    "doctor.chamber.hours": "Consultation hours",
    "doctor.chamber.appointmentPhone": "Appointment phone",
    "doctor.chamber.phone": "Phone",
    "doctor.chamber.appointments": "Appointments",
    "doctor.chamber.bookOnline": "Book or enquire online",
    "doctor.chamber.headingNumbered": "Chamber {index}: {name}",
    "doctor.chamber.heading": "Chamber: {name}",

    "doctor.filters.aria": "Find doctors",
    "doctor.filters.name": "Doctor name",
    "doctor.filters.location": "Location",
    "doctor.filters.allBangladesh": "All of Bangladesh",
    "doctor.filters.allDivision": "All of {name} Division",
    "doctor.filters.specialty": "Specialty",
    "doctor.filters.allSpecialties": "All specialties",
    "doctor.filters.hospital": "Hospital",
    "doctor.filters.anyHospital": "Any hospital",
    "doctor.filters.submit": "Search doctors",
    "doctor.filters.clear": "Clear filters",

    "doctor.listPage.label": "Doctors",
    "doctor.listPage.pagination": "Doctors pagination",
    "doctor.listPage.noMatchPre":
      "No doctors match these filters. Try a wider location or fewer filters, or",
    "doctor.listPage.browseSpecialties": "browse specialties",

    "doctor.source.heading": "Source & verification",
    "doctor.source.sourceLabel": "Source:",
    "doctor.source.verifiedOn": "Verified on {date}",
    "doctor.source.verificationLabel": "Verification: ",
    "doctor.source.method.official_profile":
      "checked against the official profile page of the doctor's hospital or organisation",
    "doctor.source.method.doctor_provided": "provided by the doctor, with their consent",
    "doctor.source.method.registry": "checked against a professional registry",
    "doctor.source.note":
      "Details can change. Please confirm chamber times and fees with the doctor's office before you visit.",

    "doctor.empty.title": "Doctor profiles are not listed yet",
    "doctor.empty.text1":
      "We will only list doctor profiles from verified sources or with the doctor's consent. We have not added any yet, and we do not copy profiles from other websites.",
    "doctor.empty.text2":
      "In the meantime you can browse hospitals and clinics by specialty to see where a field of medicine is offered, then call the facility to ask about its doctors.",
    "doctor.empty.specialties": "Browse specialties",
    "doctor.empty.hospitals": "Browse hospitals & clinics",

    "doctor.page.specialties": "Specialties:",
    "doctor.page.qualifications": "Qualifications:",
    "doctor.page.chambers": "Chambers",
    "doctor.page.noChambers": "No chamber details are published for this doctor.",
    "doctor.page.otherProfiles": "Other {title} profiles",
    "doctor.page.relatedDoctors": "Related doctors",
    "doctor.page.relatedPages": "Related pages",
    "doctor.page.about": "About {name}",
    "doctor.page.healthcareIn": "Healthcare in {place}",
    "doctor.page.specialtyIn": "{specialty} in {place}",
  },
  bn: {
    "doctor.crumb.home": "হোম",
    "doctor.crumb.doctors": "ডাক্তার",
    "doctor.dot": "।",

    "doctor.notFound.title": "ডাক্তারের প্রোফাইল পাওয়া যায়নি",
    "doctor.notFound.list": "ডাক্তারের তালিকা পাওয়া যায়নি",
    "doctor.notFound.text":
      "আমরা ওই ডাক্তারের প্রোফাইল খুঁজে পাইনি। ডাক্তারের প্রোফাইল শুধু যাচাই করা বা সম্মতিপ্রাপ্ত উৎস থেকে তালিকাভুক্ত করা হয়।",
    "doctor.notFound.doctors": "ডাক্তার",
    "doctor.notFound.specialties": "বিশেষজ্ঞ বিভাগ দেখুন",
    "doctor.notFound.hospitals": "হাসপাতাল ও ক্লিনিক",

    "doctor.count.one": "{n}জন ডাক্তার",
    "doctor.count.other": "{n}জন ডাক্তার",

    "doctor.scope.place": "{place}-এর",
    "doctor.scope.bangladesh": "বাংলাদেশের",
    "doctor.who.any": "ডাক্তার",
    "doctor.who.anyLower": "ডাক্তার",
    "doctor.list.heading": "{where} {who}",
    "doctor.desc.empty":
      "ডাক্তারের প্রোফাইল শুধু যাচাই করা বা সম্মতিপ্রাপ্ত উৎস থেকে তালিকাভুক্ত করা হয়। এর বদলে {where} হাসপাতাল ও ক্লিনিক দেখুন।",
    "doctor.desc.found":
      "{where} {who} খুঁজুন: চেম্বারের ঠিকানা, রোগী দেখার সময় ও অ্যাপয়েন্টমেন্টের যোগাযোগসহ {profiles}।",
    "doctor.desc.profiles.one": "{n}টি তালিকাভুক্ত প্রোফাইল",
    "doctor.desc.profiles.other": "{n}টি তালিকাভুক্ত প্রোফাইল",
    "doctor.title.titleInPlace": "{place}-এর {title}",
    "doctor.title.inPlace": "{place}-এ",
    "doctor.desc.intro": "{head}।",
    "doctor.desc.introPlace": "{head}, {place}।",
    "doctor.desc.sentence": "{text}।",
    "doctor.desc.qualifications": "যোগ্যতা: {text}।",
    "doctor.desc.chambers": "চেম্বারের ঠিকানা, রোগী দেখার সময় ও অ্যাপয়েন্টমেন্টের যোগাযোগ।",

    "doctor.actions.contact": "{name}-এর সাথে যোগাযোগ",
    "doctor.actions.call": "কল করুন",
    "doctor.actions.directions": "দিকনির্দেশনা",
    "doctor.actions.directionsSr": "{name}-এ যাওয়ার পথ (Google Maps-এ খুলবে)",
    "doctor.actions.appointment": "অ্যাপয়েন্টমেন্ট",
    "doctor.actions.appointmentSr": "{name}-এর সাথে (বুকিং পেজ খুলবে)",

    "doctor.chamber.facility": "প্রতিষ্ঠান",
    "doctor.chamber.days": "রোগী দেখার দিন",
    "doctor.chamber.hours": "রোগী দেখার সময়",
    "doctor.chamber.appointmentPhone": "অ্যাপয়েন্টমেন্টের ফোন",
    "doctor.chamber.phone": "ফোন",
    "doctor.chamber.appointments": "অ্যাপয়েন্টমেন্ট",
    "doctor.chamber.bookOnline": "অনলাইনে বুক করুন বা জানতে চান",
    "doctor.chamber.headingNumbered": "চেম্বার {index}: {name}",
    "doctor.chamber.heading": "চেম্বার: {name}",

    "doctor.filters.aria": "ডাক্তার খুঁজুন",
    "doctor.filters.name": "ডাক্তারের নাম",
    "doctor.filters.location": "অবস্থান",
    "doctor.filters.allBangladesh": "সারা বাংলাদেশ",
    "doctor.filters.allDivision": "পুরো {name} বিভাগ",
    "doctor.filters.specialty": "বিশেষজ্ঞ বিভাগ",
    "doctor.filters.allSpecialties": "সব বিশেষজ্ঞ বিভাগ",
    "doctor.filters.hospital": "হাসপাতাল",
    "doctor.filters.anyHospital": "যেকোনো হাসপাতাল",
    "doctor.filters.submit": "ডাক্তার খুঁজুন",
    "doctor.filters.clear": "ফিল্টার মুছুন",

    "doctor.listPage.label": "ডাক্তার",
    "doctor.listPage.pagination": "ডাক্তারের তালিকার পৃষ্ঠা",
    "doctor.listPage.noMatchPre":
      "এই ফিল্টারের সাথে মেলে এমন কোনো ডাক্তার নেই। আরও বিস্তৃত অবস্থান বা কম ফিল্টার দিয়ে চেষ্টা করুন, অথবা",
    "doctor.listPage.browseSpecialties": "বিশেষজ্ঞ বিভাগ দেখুন",

    "doctor.source.heading": "উৎস ও যাচাই",
    "doctor.source.sourceLabel": "উৎস:",
    "doctor.source.verifiedOn": "যাচাইয়ের তারিখ: {date}",
    "doctor.source.verificationLabel": "যাচাই: ",
    "doctor.source.method.official_profile":
      "ডাক্তারের হাসপাতাল বা প্রতিষ্ঠানের অফিসিয়াল প্রোফাইল পেজের সাথে মিলিয়ে দেখা হয়েছে",
    "doctor.source.method.doctor_provided": "ডাক্তারের সম্মতিতে তাঁর কাছ থেকে পাওয়া",
    "doctor.source.method.registry": "পেশাদার নিবন্ধন তালিকার সাথে মিলিয়ে দেখা হয়েছে",
    "doctor.source.note":
      "তথ্য বদলাতে পারে। যাওয়ার আগে ডাক্তারের অফিস থেকে চেম্বারের সময় ও ফি নিশ্চিত করে নিন।",

    "doctor.empty.title": "ডাক্তারের প্রোফাইল এখনো তালিকাভুক্ত করা হয়নি",
    "doctor.empty.text1":
      "আমরা শুধু যাচাই করা উৎস থেকে বা ডাক্তারের সম্মতিতে প্রোফাইল তালিকাভুক্ত করব। এখনো কোনো প্রোফাইল যোগ করা হয়নি, এবং আমরা অন্য ওয়েবসাইট থেকে প্রোফাইল কপি করি না।",
    "doctor.empty.text2":
      "এর মধ্যে আপনি বিশেষজ্ঞ বিভাগ অনুযায়ী হাসপাতাল ও ক্লিনিক দেখে জানতে পারেন কোথায় কোন চিকিৎসা বিভাগ আছে, তারপর প্রতিষ্ঠানে ফোন করে সেখানকার ডাক্তারদের সম্পর্কে জিজ্ঞাসা করতে পারেন।",
    "doctor.empty.specialties": "বিশেষজ্ঞ বিভাগ দেখুন",
    "doctor.empty.hospitals": "হাসপাতাল ও ক্লিনিক দেখুন",

    "doctor.page.specialties": "বিশেষজ্ঞ বিভাগ:",
    "doctor.page.qualifications": "যোগ্যতা:",
    "doctor.page.chambers": "চেম্বার",
    "doctor.page.noChambers": "এই ডাক্তারের চেম্বারের কোনো তথ্য প্রকাশ করা হয়নি।",
    "doctor.page.otherProfiles": "অন্যান্য {title} প্রোফাইল",
    "doctor.page.relatedDoctors": "সংশ্লিষ্ট ডাক্তার",
    "doctor.page.relatedPages": "সংশ্লিষ্ট পেজ",
    "doctor.page.about": "{name} সম্পর্কে",
    "doctor.page.healthcareIn": "{place}-এর স্বাস্থ্যসেবা",
    "doctor.page.specialtyIn": "{place}-এর {specialty}",
  },
});
