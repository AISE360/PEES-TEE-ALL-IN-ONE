export type Role = "CLIENT" | "FIELD_EMPLOYEE" | "SUPERVISOR" | "HR" | "MANAGER" | "ADMIN";

export type RequestStage = "APPLIED" | "CONNECTED" | "IN_PROCESSING" | "COMPLETED";

export type PaymentMode = "CASH" | "UPI" | "DIGITAL_LINK";
export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ClientRequest {
  id: string;
  clientId: string;
  serviceType: string;
  description: string;
  preferredContactTime?: string;
  attachments: string[];
  stage: RequestStage;
  stageHistory: { stage: RequestStage; at: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PremiumApplication {
  id: string;
  referenceNo: string; // PTxxxxx
  employeeId: string;
  clientName: string;
  dob: string;
  address: string;
  contact: string;
  kycDocs: { type: string; url: string }[];
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "FLAGGED";
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  assignedSite?: { lat: number; lng: number; radiusM: number; name: string };
  isActive: boolean;
}

export interface Shift {
  id: string;
  employeeId: string;
  clockInAt?: string;
  clockOutAt?: string;
  clockInSelfie?: string;
  clockInLocation?: { lat: number; lng: number };
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  balanceAfter?: number;
}

export const ROLE_PERMISSIONS: Record<Role, { canClockIn: boolean; portalAccess: "none" | "limited" | "hr" | "full" }> = {
  CLIENT: { canClockIn: false, portalAccess: "none" },
  FIELD_EMPLOYEE: { canClockIn: false, portalAccess: "none" },
  SUPERVISOR: { canClockIn: true, portalAccess: "limited" },
  HR: { canClockIn: true, portalAccess: "hr" },
  MANAGER: { canClockIn: true, portalAccess: "full" },
  ADMIN: { canClockIn: false, portalAccess: "full" }
};
