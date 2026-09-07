// PEES Tee design system — Uber-grade polish on brand navy + gold.
export const theme = {
  // Brand
  navy: "#0F2440",
  navyDeep: "#0B1526",
  navyLight: "#162E50",
  navySoft: "#1D3050",
  gold: "#C6A664",
  goldDark: "#A88A4A",
  goldSoft: "#F5ECDA",
  // Surfaces
  bg: "#F4F6FA",
  card: "#FFFFFF",
  text: "#0F2440",
  body: "#334155",
  muted: "#64748B",
  faint: "#94A3B8",
  line: "#E6EAF0",
  // Status
  success: "#0E9F6E",
  successBg: "#DEF7EC",
  warning: "#C27803",
  warningBg: "#FEF3C7",
  danger: "#E02424",
  dangerBg: "#FEE2E2",
  info: "#1C64F2",
  infoBg: "#E1EFFE",
  // Shape
  radius: 20,
  radiusSm: 12,
  radiusPill: 999,
  // Type scale
  h1: 28,
  h2: 22,
  h3: 17,
  bodySize: 14,
  small: 12,
};

export const stageColors: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: "#F1F5F9", color: "#64748B" },
  CONNECTED: { bg: "#E1EFFE", color: "#1C64F2" },
  IN_PROCESSING: { bg: "#FDF6B2", color: "#C27803" },
  COMPLETED: { bg: "#DEF7EC", color: "#0E9F6E" },
};

export const shadow = {
  card: {
    shadowColor: "#0F2440",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pop: {
    shadowColor: "#0F2440",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;
