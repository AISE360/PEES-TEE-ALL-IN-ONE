// PEES Tee design system — colors sampled from the official logo:
// primary blue #0082B6 · deep ink #073A54 · copper #A6603C
export const theme = {
  // Brand (logo colors)
  navy: "#0082B6",
  navyDeep: "#073A54",
  navyLight: "#15678A",
  navySoft: "#0E6E97",
  gold: "#A6603C",
  goldDark: "#8A4E2E",
  goldSoft: "#F6E9DD",
  // Surfaces
  bg: "#F2F6F9",
  card: "#FFFFFF",
  text: "#0A2E40",
  body: "#334155",
  muted: "#5C7B8D",
  faint: "#93A9B5",
  line: "#DDE8EE",
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
  APPLIED: { bg: "#E8EEF2", color: "#5C7B8D" },
  CONNECTED: { bg: "#E1EFFE", color: "#1C64F2" },
  IN_PROCESSING: { bg: "#F6E9DD", color: "#A6603C" },
  COMPLETED: { bg: "#DEF7EC", color: "#0E9F6E" },
};

export const shadow = {
  card: {
    shadowColor: "#073A54",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pop: {
    shadowColor: "#073A54",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;
