// PEES Tee Group - Brand & Business Constants
export const BRAND = {
  name: "PEES Tee Group Pvt Ltd",
  tagline: "Trusted Services. Brighter Tomorrows.",
  colors: {
    navy: "#0F2440", // deep brand navy for headers/nav
    navyLight: "#162E50",
    gold: "#C6A664", // warm accent for CTAs
    goldDark: "#A88A4A",
    goldLight: "#E8D9B8",
    background: "#F7F8FA",
    card: "#FFFFFF",
    textPrimary: "#0F2440",
    textSecondary: "#64748B",
    success: "#0E9F6E",
    warning: "#C27803",
    error: "#E02424",
    info: "#1C64F2"
  },
  support: {
    name: "PEES Tee Group Pvt Ltd",
    tagline: "Building Trust. Developing Land.",
    address: "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru, Karnataka - 560043",
    regdOffice: "#60, 10th Cross, Masjid Road, Devasandra, Bengaluru - 560036",
    email: "info@peesteegroup.com",
    phone: "+91 89519 37171",
    landline: "080-41289652",
    website: "www.peesteegroup.com",
    hours: "Mon–Sat, 9:30 AM – 6:30 PM IST",
  }
} as const;

export const COMPANY_SUPPORT_DIRECTORY = BRAND.support;

export const CONTACT = {
  helpline: "+91 89519 37171",
  landline: "080-41289652",
  email: "info@peesteegroup.com",
  website: "https://peesteegroup.com",
  headOffice:
    "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru, Karnataka - 560043",
  hours: "Mon–Sat, 9:30 AM – 6:30 PM IST",
} as const;

export const BRANCHES = [
  {
    id: "hbr-ho",
    name: "HBR Layout — Head Office",
    address: "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043",
    phone: "+91 89519 37171",
    mapsQuery: "HBR Layout, Bengaluru, Karnataka 560043",
    isHO: true,
  },
  {
    id: "krpuram",
    name: "KR Puram Branch",
    address: "3rd Cross, Haadi Masjid Road, Devasandra, KR Puram, Bengaluru - 560036",
    phone: "+91 99027 25132",
    mapsQuery: "Devasandra, KR Puram, Bengaluru 560036",
  },
  {
    id: "belagavi",
    name: "Belagavi Regional Branch",
    address: "Belagavi, Karnataka",
    phone: "+91 89519 37171",
    mapsQuery: "Belagavi, Karnataka",
  },
  {
    id: "kgf",
    name: "KGF Site Office",
    address: "KGF Project Site, Karnataka",
    phone: "+91 89519 37171",
    mapsQuery: "KGF, Karnataka",
  },
] as const;

// Full service catalogue mirrored from peesteegroup.com
export const SERVICE_VERTICALS = [
  {
    id: "land-purchase",
    title: "Land Purchase & Due Diligence",
    icon: "🤝",
    blurb:
      "Verified acquisition with 30-year EC audit, title search by senior advocates and clean-deed guarantee.",
    services: [
      "Land Purchase & Legal Title Search",
      "30-Year EC Verification & Legal Opinion",
      "Adjacent Owner Consent & Boundary Confirmation",
      "Corporate Land Survey & Escrow Support",
    ],
    docs: ["Aadhaar & PAN", "Title Deeds / Mother Deed", "EC (15–30 yrs)", "RTC / Mutation Extract"],
  },
  {
    id: "land-improvement",
    title: "Land Improvement & Survey",
    icon: "📐",
    blurb:
      "DGPS mapping, Mojini integration, fencing, levelling and agricultural prep by licensed surveyors.",
    services: [
      "DGPS Land Survey & Boundary Mapping",
      "Agricultural Land Prep, Fencing & Levelling",
      "11E Sketch, Phodi & Durasti Survey",
      "Industrial Park Site Preparation",
    ],
    docs: ["RTC & Survey Number", "Akarbandh / Tippani", "Owner ID Proof", "Site Access Letter"],
  },
  {
    id: "land-development",
    title: "Land Development & Layouts",
    icon: "🏗️",
    blurb:
      "Approved layouts, roads, drainage and corner-stone development — residential, commercial & industrial.",
    services: [
      "Residential / Commercial Layout Development",
      "Layout Roads & Drainage Construction",
      "BMRDA / BDA Layout Approval & Fencing",
      "Master-Planned Industrial Layouts",
    ],
    docs: ["Approved Layout Plan", "Conversion Order", "Owner KYC", "NOCs (Fire / PCB as applicable)"],
  },
  {
    id: "documentation",
    title: "Property Documentation",
    icon: "📜",
    blurb:
      "Khata, EC, mutation, DC conversion, registration and RERA — end-to-end statutory clearance.",
    services: [
      "E-Khata / A-Khata / B-Khata & Transfers",
      "B-Khata → A-Khata Conversion & Mutation",
      "DC Conversion (Sec 95) & RTC Regularization",
      "Registration via Kaveri + EC & Tax Clearance",
    ],
    docs: ["Sale Deed", "Khata Extract / Certificate", "Tax Paid Receipts", "Aadhaar, PAN & Photos"],
  },
  {
    id: "govt-docs",
    title: "Government & Essential Docs",
    icon: "🏛️",
    blurb:
      "Aadhaar, PAN, ration, caste/income, GST, MSME/Udyam, IEC and business registrations.",
    services: [
      "Aadhaar / PAN Services & Linking",
      "Ration (APL/BPL), Caste & Income Certificates",
      "GST Registration & Returns, MSME/Udyam, IEC",
      "Company / LLP Incorporation & Shop Licence",
    ],
    docs: ["Aadhaar + Mobile", "Address Proof", "Business / Firm Details", "Bank / Cancelled Cheque"],
  },
  {
    id: "logistics",
    title: "Cargo, Warehousing & Logistics",
    icon: "🚚",
    blurb:
      "GPS-tracked fleet, heavy lifting, container haulage and warehousing across India.",
    services: [
      "Interstate & Intra-City Freight Transport",
      "Heavy Cargo, Crane Loading & Container Haulage",
      "Warehousing, Packing & E-Way Bill Support",
      "24/7 GPS Fleet Tracking & Insured Transit",
    ],
    docs: ["Consignor / Consignee KYC", "Invoice & Packing List", "GST E-Way Bill", "Delivery Address + Contact"],
  },
] as const;

export const STAGE_META = {
  APPLIED: { label: "Applied", color: "#64748B", bg: "#F1F5F9", icon: "clock" },
  CONNECTED: { label: "Connected with Customer Care", color: "#1C64F2", bg: "#E1EFFE", icon: "phone" },
  IN_PROCESSING: { label: "In Processing", color: "#C27803", bg: "#FDF6B2", icon: "loader" },
  COMPLETED: { label: "Completed", color: "#0E9F6E", bg: "#DEF7EC", icon: "check" }
} as const;

export const COMPRESS_LIMITS = {
  DOCUMENT_PDF_KB: 300,
  PHOTO_JPG_KB: 50
} as const;

export const REFERENCE_PREFIX = "PT" as const;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
