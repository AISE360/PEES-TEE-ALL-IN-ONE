// Public website content — mirrors peesteegroup.com (Land, Documentation, Logistics).
// Single source of truth for the portal homepage, services, about, track & contact pages.

export const SITE = {
  name: "PEES Tee Group Pvt. Ltd.",
  short: "PEES Tee Group",
  tagline: "Building Trust. Developing Land.",
  heroTitle: "Land Development, Documentation & Logistics — Done Right.",
  heroSub:
    "Trusted corporate solutions for Land Purchase, Land Improvement, Land Development, Property Documentation, Cargo Handling, Warehousing & Logistics across India.",
  helpline: "+91 89519 37171",
  landline: "080-41289652",
  email: "info@peesteegroup.com",
  website: "www.peesteegroup.com",
  address: "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043",
  hours: "Mon–Sat · 9:30 AM – 6:30 PM IST",
};

export const STATS = [
  { value: "25+", label: "Years Combined Expertise" },
  { value: "1200+", label: "Documents & Titles Cleared" },
  { value: "150+", label: "Acres Developed & Surveyed" },
  { value: "4", label: "Branches & Site Offices" },
];

export const VERTICALS = [
  {
    id: "land-purchase",
    icon: "🤝",
    title: "Land Purchase & Due Diligence",
    desc: "Verified acquisition with 30-year EC audit, advocate title opinion & clean-deed guarantee.",
    points: ["30-Year EC Verification", "Senior Advocate Title Search", "Escrow-Safe Transactions"],
  },
  {
    id: "land-improvement",
    icon: "📐",
    title: "Land Improvement & Survey",
    desc: "DGPS mapping with Mojini integration, fencing, levelling & agri-land preparation.",
    points: ["DGPS + Mojini Survey", "Fencing & Levelling", "11E / Phodi / Durasti"],
  },
  {
    id: "land-development",
    icon: "🏗️",
    title: "Land Development & Layouts",
    desc: "Approved residential, commercial & industrial layouts with roads and drainage.",
    points: ["BDA / BMRDA Approvals", "Roads & Drainage", "Corner-Stone Development"],
  },
  {
    id: "documentation",
    icon: "📜",
    title: "Property Documentation",
    desc: "Khata, EC, mutation, DC conversion, Kaveri registration & RERA — end to end.",
    points: ["E-Khata / A / B-Khata", "DC Conversion Sec-95", "Kaveri Registration"],
  },
  {
    id: "govt-docs",
    icon: "🏛️",
    title: "Government & Essential Docs",
    desc: "Aadhaar, PAN, ration, caste/income, GST, MSME/Udyam, IEC & company registration.",
    points: ["GST / MSME / IEC", "Ration / Caste / Income", "Pvt Ltd / LLP Setup"],
  },
  {
    id: "logistics",
    icon: "🚚",
    title: "Cargo, Warehousing & Logistics",
    desc: "GPS-tracked fleet, heavy lifting, container haulage & warehousing pan-India.",
    points: ["24/7 GPS Tracking", "Heavy Lift & Cranes", "Insured Transit"],
  },
];

export const CATALOG: { vertical: string; items: { name: string; docs: string; time: string }[] }[] = [
  {
    vertical: "Property Documentation",
    items: [
      { name: "E-Khata / New Khata Registration", docs: "Sale deed · Tax receipts · Aadhaar/PAN", time: "7–15 days" },
      { name: "B-Khata → A-Khata Conversion", docs: "B-Khata extract · Tax paid · Betterment proof", time: "15–30 days" },
      { name: "Khata Transfer & Bifurcation", docs: "Registered deed · Old khata · ID proofs", time: "7–15 days" },
      { name: "Encumbrance Certificate (15–30 yr)", docs: "Property schedule · Period · ID proof", time: "3–7 days" },
      { name: "DC Conversion (Agri → Non-Agri, Sec 95)", docs: "RTC · Survey sketch · Layout plan", time: "30–90 days" },
      { name: "Property Registration (Kaveri)", docs: "Buyer/seller KYC · Deed draft · Photos", time: "1–3 days" },
    ],
  },
  {
    vertical: "Land Survey & Development",
    items: [
      { name: "DGPS Boundary Survey + Mojini", docs: "RTC · Survey no. · Owner consent", time: "2–5 days" },
      { name: "Layout Approval (BDA / BMRDA)", docs: "Conversion order · Master-plan zoning · Drawings", time: "45–120 days" },
      { name: "Fencing, Levelling & Site Prep", docs: "Site access · Survey map · Scope note", time: "Per site" },
      { name: "Building Plan Sanction + NOCs", docs: "Ownership docs · Drawings · NOC forms", time: "15–45 days" },
    ],
  },
  {
    vertical: "Government & Business",
    items: [
      { name: "GST Registration & Returns", docs: "PAN · Aadhaar · Address + bank proof", time: "3–7 days" },
      { name: "MSME / Udyam, IEC, Shop Licence", docs: "PAN · Aadhaar · Business proof", time: "2–5 days" },
      { name: "Ration / Caste / Income Certificates", docs: "Aadhaar · Address · Income proof", time: "7–21 days" },
      { name: "Company / LLP Incorporation", docs: "Director KYC · Address · MOA/AOA", time: "7–14 days" },
    ],
  },
  {
    vertical: "Cargo & Logistics",
    items: [
      { name: "Interstate Freight & Container Haulage", docs: "Invoice · Packing list · E-way bill", time: "Same-day pickup" },
      { name: "Heavy Cargo + Crane Loading", docs: "Cargo specs · Site details · Permits", time: "Scheduled" },
      { name: "Warehousing & Distribution", docs: "Inventory list · Storage terms", time: "Flexible" },
      { name: "GPS-Tracked Dedicated Fleet", docs: "Route · Volume · Timeline", time: "On demand" },
    ],
  },
];

export const PROCESS = [
  { stage: "APPLIED", title: "Request / Apply", desc: "Raise a quote online, on call, or at any branch. Get an instant PT reference (e.g. PT48213)." },
  { stage: "CONNECTED", title: "Expert Callback", desc: "A domain expert verifies scope, documents & timeline — land, legal or logistics desk." },
  { stage: "IN_PROCESSING", title: "Execution & Filing", desc: "Survey, filing, registration or dispatch — with milestone updates on SMS, email & tracker." },
  { stage: "COMPLETED", title: "Handover & Receipt", desc: "Verified documents, stamped acknowledgments & GST invoice handed over. Audit-ready." },
];

export const BRANCHES = [
  { name: "Head Office — HBR Layout", addr: "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043", phone: "+91 89519 37171", maps: "HBR Layout, Bengaluru 560043" },
  { name: "KR Puram Branch", addr: "3rd Cross, Haadi Masjid Road, Devasandra, KR Puram, Bengaluru - 560036", phone: "+91 99027 25132", maps: "Devasandra, KR Puram, Bengaluru 560036" },
  { name: "Belagavi Regional Branch", addr: "Belagavi, Karnataka", phone: "+91 89519 37171", maps: "Belagavi, Karnataka" },
  { name: "KGF Site Office", addr: "KGF Project Site, Karnataka", phone: "+91 89519 37171", maps: "KGF, Karnataka" },
];

export const TESTIMONIALS = [
  { name: "Venkatesh Builders LLP", role: "E-Khata + Layout Approval", text: "EC audit caught a 12-year-old charge our broker missed. PEES Tee cleared title, converted khata and closed registration without a single revisit." },
  { name: "Rajeshwari M.", role: "New Khata & Mutation", text: "From application to stamped acknowledgment everything was tracked on the PT reference. I never had to visit the revenue office once." },
  { name: "Karnataka Freight Corp", role: "GST + Dedicated Fleet", text: "GST registration in 4 days and a GPS-tracked truck fleet for our Bengaluru–Mumbai lane. Billing is clean, E-way bills always on time." },
];

export const FAQS = [
  { q: "How do I track my application?", a: "Every request gets a PT + 5-digit reference (e.g. PT48213). Enter it on the Track page, or quote it on call/WhatsApp. Stages move APPLIED → CONNECTED → IN_PROCESSING → COMPLETED." },
  { q: "Which documents do I need for Khata / EC / DC conversion?", a: "Sale deed, latest tax receipts, Aadhaar + PAN and the khata extract (for transfers). The Services page lists exact checklists per service — bring originals + one photocopy set." },
  { q: "Do you handle BDA / BMRDA / BBMP approvals?", a: "Yes — layout approvals, building-plan sanction, betterment, A/B-khata regularization and RERA guidance, all vetted by senior legal experts and government advocates." },
  { q: "Is my cargo insured and tracked?", a: "Yes. All fleet movement is GPS-tracked 24/7 with insured transit, e-way bill support and live dispatch updates to your phone." },
  { q: "Where are you located? Do you serve outside Bengaluru?", a: "Head office at HBR Layout, Bengaluru, with branches in KR Puram, Belagavi and KGF site office. We serve clients across Karnataka and interstate logistics pan-India." },
  { q: "How do payments & receipts work?", a: "UPI, bank transfer and branch-counter payments are accepted. You receive a stamped acknowledgment + GST invoice for every payment — no hidden charges." },
];
