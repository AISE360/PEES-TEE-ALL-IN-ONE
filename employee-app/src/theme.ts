// PEES Tee employee design system — colors sampled from the official logo:
// primary blue #0082B6 · deep ink #073A54 · copper #A6603C
export const theme = {
  navy: "#0082B6",
  navyDeep: "#073A54",
  navyLight: "#15678A",
  gold: "#A6603C",
  goldDark: "#8A4E2E",
  goldSoft: "#F6E9DD",
  bg: "#F2F6F9",
  card: "#FFFFFF",
  text: "#0A2E40",
  body: "#334155",
  muted: "#5C7B8D",
  faint: "#93A9B5",
  line: "#DDE8EE",
  success: "#0E9F6E",
  successBg: "#DEF7EC",
  danger: "#E02424",
  dangerBg: "#FEE2E2",
  info: "#1C64F2",
  infoBg: "#E1EFFE",
  radius: 20,
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
