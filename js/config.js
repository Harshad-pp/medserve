/*
 * Central site configuration. Edit values here only; nothing else in the code
 * hardcodes contact details.
 *
 * status: "verified"  -> read from clinic signage / logo supplied by the owner
 *         "confirm"   -> NOT yet confirmed; hidden from the live page until set to "verified"
 */
window.SITE = {
  clinic: {
    name: "Med Serve Health Care Clinic",
    shortName: "Med Serve",
    tagline: "Doctors Clinic · Pharmacy · ECG · Lab · Nebulisation · Observation",
    // Full postal address: fill in and set status to "verified" to show it on the Contact section.
    // Taken from the clinic's Google Maps listing.
    fullAddress: { value: "Med Serve Health Care Clinic, Ozhur Road, opposite Govt Arts College, Puthantheru, Thanalur, Kerala 676307", status: "verified" },
    mapsLink: "https://maps.app.goo.gl/ssnbtCxKLiAepXdj8?g_st=ac",
    // Search text used for the embedded map and the turn-by-turn directions link.
    mapsQuery: "Medserve Health Care Clinic, Ozhur Road, opposite Govt Arts College, Puthantheru, Thanalur, Kerala 676307"
  },

  phones: [
    { display: "8086 8000 57", tel: "+918086800057" },
    { display: "8086 8000 58", tel: "+918086800058" }
  ],

  // The clinic logo shows the WhatsApp icon beside these numbers; the owner asked for the
  // chat link on 8086 8000 57. Change the number here if a different one should receive chats.
  whatsapp: { number: "918086800057", status: "verified" },

  // Hero banners (full-width sliding). Images are original illustrations in assets/.
  slides: [
    { img: "assets/banner-1.svg", quote: "Your health, our promise.", sub: "Doctors, laboratory, pharmacy and ECG, all under one roof." },
    { img: "assets/banner-2.svg", quote: "Care that listens, treatment that heals.", sub: "Consult our specialist doctors with confidence." },
    { img: "assets/banner-3.svg", quote: "Early tests, healthier tomorrows.", sub: "Laboratory and ECG services for you and your family." },
    { img: "assets/banner-4.svg", quote: "Caring for every family, every day.", sub: "Nebulisation and observation support when you need it." }
  ],

  // Appears partly on the opening-day banner; owner must confirm.
  email: { value: "", status: "confirm" },

  // The small Malayalam signage text appears to give 7 AM - 9 PM; confirm.
  hours: {
    summary: { value: "7:00 AM – 9:00 PM", status: "confirm" },
    note: "Timings can change. Please confirm today's availability by phone or WhatsApp."
  },

  services: [
    { id: "doctors", title: "Doctors Clinic", text: "Consultation with our general and specialist doctors across ten departments." },
    { id: "pharmacy", title: "Pharmacy", text: "Medicines available at the clinic." },
    { id: "ecg", title: "ECG", text: "Electrocardiogram testing at the clinic." },
    { id: "lab", title: "Laboratory", text: "Diagnostic laboratory for blood and other tests." },
    { id: "nebulisation", title: "Nebulisation", text: "Nebulisation for breathing difficulties." },
    { id: "observation", title: "Observation", text: "Short-stay observation facility." }
  ],

  // Specialities are listed on the clinic's wall boards. Doctor names/timings were NOT
  // legible, so none are published. Add doctors here once confirmed.
  // icon = key into ICONS in js/app.js
  specialities: [
    { name: "General Physician", icon: "stethoscope" },
    { name: "General Medicine", icon: "kit" },
    { name: "General Surgery", icon: "scalpel" },
    { name: "Respiratory Medicine (Pulmonology)", icon: "lungs" },
    { name: "Psychology", icon: "mind" },
    { name: "Orthopaedics & Trauma Surgery", icon: "bone" },
    { name: "Diabetology", icon: "drop" },
    { name: "Oncology", icon: "ribbon" },
    { name: "Dermatology", icon: "skin" },
    { name: "Paediatrics", icon: "child" }
  ],

  doctors: [

    { name: "Dr. Harikrishnan C. Satheesh", speciality: "Consultant Orthopaedic & Trauma Surgeon", qualification: "MBBS, MS (Ortho)", photo: "assets/doctors/Dr Harikrishnan c Satheesh.png", days: "", timings: "", status: "verified" },
    { name: "Dr. K Nabeela", speciality: "Department of Paediatrics", qualification: "MBBS, DCH Consultant Paediatrician", photo: "assets/doctors/nabeela.jpeg", days: "", timings: "", status: "verified" },
    { name: "Dr. Farsana M", speciality: "Department of Dermatology", qualification: "MBBS, MD, DNB DVL Dermatologist", photo: "assets/doctors/farsana.jpeg", days: "", timings: "", status: "verified" },
    { name: "Dr. Shabana C.V.", speciality: "Dermatologist", qualification: "MBBS, MD, DVL", photo: "assets/doctors/doctor2.jpg", days: "", timings: "", status: "verified" },
    { name: "Dr. Irfana K", speciality: "General Physician", qualification: "MBBS, Bachelor of Medicine and Bachelor of Surgery", photo: "assets/doctors/Dr Irfana.png", days: "", timings: "", status: "verified" },
    { name: "Dr. Salahudheen M", speciality: "General Surgeon", qualification: "MBBS, MS, DNB, FMAS", photo: "assets/doctors/doctor1.jpg", days: "", timings: "", status: "verified" },
    { name: "Dr. Reshma M", speciality: "Consultant Pulmonologist (Respiratory Medicine)", qualification: "MBBS, DTCD, DNB", photo: "assets/doctors/Dr Reshma M.png", days: "", timings: "", status: "verified" },
    { name: "Dr. Shafeeq P.", speciality: "Consultant Orthopaedic Surgeon", qualification: "MBBS, DNB (Orthopaedics)", photo: "assets/doctors/Dr Shafeeq P.png", days: "", timings: "", status: "verified" },
    { name: "Dr. Nesmi Rahman K.", speciality: "Consultant Psychologist", qualification: "MSc, PhD, DLM, Hypnotherapy", photo: "assets/doctors/Dr Nesmi Rahman K.png", days: "", timings: "", status: "verified" },
    { name: "Dr. Muhammed Shafi K", speciality: "General Medicine, Diabetology & Oncology", qualification: "MBBS, MD, ECMO, FCPM, C-Diab", photo: "assets/doctors/Dr Shafi.png", days: "", timings: "", status: "verified" }
  ],

  // Lab tests: no test list was provided. Leave empty until confirmed.
  labTests: [
    // { category: "Blood tests", name: "", prep: "", turnaround: "", processing: "onsite|partner" }
  ],

  faq: [
    { q: "Is this form a confirmed booking?", a: "No. It is an appointment request. The clinic will contact you to confirm availability." },
    { q: "How can I check doctor availability?", a: "Doctor timings can change, so please call or message us on WhatsApp to confirm before visiting." },
    { q: "Which services are available?", a: "Doctors clinic, pharmacy, ECG, laboratory, nebulisation and observation. Contact us for details on specific tests." }
  ],

  form: {
    // Web3Forms public access key (safe to expose; it is restricted to the email you register).
    // Get one free at https://web3forms.com and paste it here.
    provider: "web3forms",
    endpoint: "https://api.web3forms.com/submit",
    accessKey: ""
  }
};
