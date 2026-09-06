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
    address: "HBR Layout, Bengaluru, Karnataka - 560043",
    email: "info@peesteegroup.com",
    phone: "+91 (080) 41289652",
    website: "www.peesteegroup.com"
  }
} as const;

export const COMPANY_SUPPORT_DIRECTORY = BRAND.support;

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
