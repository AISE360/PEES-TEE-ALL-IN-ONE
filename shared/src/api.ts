export const API_ROUTES = {
  auth: {
    sendOtp: "/api/auth/send-otp",
    verifyOtp: "/api/auth/verify-otp",
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    biometric: "/api/auth/biometric",
  },
  clientRequests: "/api/client-requests",
  premium: "/api/premium-applications",
  employees: "/api/employees",
  shifts: "/api/shifts",
  leaves: "/api/leaves",
  salarySlips: "/api/salary-slips",
  directives: "/api/directives",
  notifications: "/api/notifications",
  portal: {
    dashboard: "/api/portal/dashboard",
    liveMap: "/api/portal/live-map",
  },
} as const;

export function apiUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}${path}`;
}
