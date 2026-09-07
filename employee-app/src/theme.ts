// PEES Tee employee design system — matches client app.
export const theme = {
  navy: "#0F2440",
  navyDeep: "#0B1526",
  navyLight: "#162E50",
  gold: "#C6A664",
  goldDark: "#A88A4A",
  goldSoft: "#F5ECDA",
  bg: "#F4F6FA",
  card: "#FFFFFF",
  text: "#0F2440",
  body: "#334155",
  muted: "#64748B",
  faint: "#94A3B8",
  line: "#E6EAF0",
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
