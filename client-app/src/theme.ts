export const theme = {
  navy: "#0F2440",
  navyLight: "#162E50",
  gold: "#C6A664",
  goldDark: "#A88A4A",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#0F2440",
  muted: "#64748B",
  success: "#0E9F6E",
  warning: "#C27803",
  radius: 16,
};

export const stageColors: Record<string, {bg:string, color:string}> = {
  APPLIED: {bg:"#F1F5F9", color:"#64748B"},
  CONNECTED: {bg:"#E1EFFE", color:"#1C64F2"},
  IN_PROCESSING: {bg:"#FDF6B2", color:"#C27803"},
  COMPLETED: {bg:"#DEF7EC", color:"#0E9F6E"},
};
