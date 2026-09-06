import bcrypt from "bcryptjs";

export interface MockUser { id: string; phone: string; name: string; role: string; isActive: boolean; employeeId?: string; passwordHash?: string; assignedSite?: any; email?: string }
export const mockDB = {
  otps: new Map<string, { code: string; expiresAt: number }>(),
  users: [] as MockUser[],
  clientRequests: [] as any[],
  premiumApps: [] as any[],
  shifts: [] as any[],
  leaves: [] as any[],
  directives: [] as any[],
  salarySlips: [] as any[],
  notifications: [] as any[],
};

async function init() {
  mockDB.users.push(
    { id: "u_admin", phone: "9999999999", name: "Admin", role: "ADMIN", isActive: true, employeeId: "EMP00001", email: "admin@peesteegroup.com", passwordHash: await bcrypt.hash("password123", 10), assignedSite: { lat: 13.035, lng: 77.620, radiusM: 500, name: "HBR Layout HO" } },
    { id: "u_hr", phone: "8888888888", name: "Rajesh Kumar", role: "HR", isActive: true, employeeId: "EMP00125", passwordHash: await bcrypt.hash("password123", 10), assignedSite: { lat: 13.035, lng: 77.620, radiusM: 500, name: "HBR Layout HO" } },
    { id: "u_supervisor", phone: "7777777777", name: "Priya Nair", role: "SUPERVISOR", isActive: true, employeeId: "EMP00126", passwordHash: await bcrypt.hash("password123", 10) },
    { id: "u_client", phone: "9876543210", name: "Sufiyan Sajan", role: "CLIENT", isActive: true, email: "sufiyan@example.com" },
  );
  mockDB.clientRequests.push(
    { id: "cr1", clientId: "u_client", serviceType: "Land Documentation", description: "Need help with property mutation", preferredContactTime: "2026-09-06 10:00", attachments: [], stage: "IN_PROCESSING", stageHistory: [{ stage: "APPLIED", at: "2026-09-05T10:30:00Z" }, { stage: "CONNECTED", at: "2026-09-05T14:15:00Z" }, { stage: "IN_PROCESSING", at: "2026-09-06T11:20:00Z" }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), reference: "PT24153" },
  );
  mockDB.premiumApps.push(
    { id: "pa1", referenceNo: "PT48213", employeeId: "u_hr", clientName: "Amit Verma", dob: "1990-05-12", address: "MG Road, Bengaluru", contact: "9876543210", paymentMode: "UPI", paymentStatus: "SUCCESSFUL", status: "APPROVED", createdAt: new Date().toISOString(), kycDocs: [] },
  );
  mockDB.directives.push({ id: "d1", message: "Visit assigned sites as per schedule.\nEnsure complete KYC capture.\nMaintain professionalism with clients.\nSubmit end-of-day report.\nStay within assigned geofence areas.", date: new Date().toISOString().slice(0,10), createdBy: "u_admin" });
  mockDB.leaves.push({ id:"l1", employeeId:"u_hr", from:"2026-09-10", to:"2026-09-12", reason:"Family function", status:"PENDING" });
  mockDB.salarySlips.push({ id:"s1", employeeId:"u_hr", month:"2026-08", pdfUrl:"/mock/salary-aug.pdf" }, { id:"s2", employeeId:"u_hr", month:"2026-07", pdfUrl:"/mock/salary-jul.pdf" });
  mockDB.shifts.push({ id:"sh_active1", employeeId:"u_hr", isActive: true, clockInAt: new Date().toISOString(), clockInLocation:{lat:13.035,lng:77.62} });
}
init();
