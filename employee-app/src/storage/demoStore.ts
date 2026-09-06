// Offline demo store for Employee App — localStorage backed, zero backend needed.
export type Premium = {
  id: string; referenceNo: string; clientName: string; contact: string;
  paymentMode: string; paymentStatus: string; status: string; createdAt: string;
};

const SEED_PREMIUM: Premium[] = [
  { id: "pa1", referenceNo: "PT48213", clientName: "Amit Verma", contact: "9876543210", paymentMode: "UPI", paymentStatus: "SUCCESSFUL", status: "APPROVED", createdAt: new Date().toISOString() },
];

const SEED_LEAVES = [
  { id: "l1", from: "2026-09-10", to: "2026-09-12", reason: "Family function", status: "PENDING" },
];

const SEED_SLIPS = [
  { id: "s1", month: "2026-08", pdfUrl: "/mock/salary-aug.pdf" },
  { id: "s2", month: "2026-07", pdfUrl: "/mock/salary-jul.pdf" },
];

export const DIRECTIVE = {
  date: new Date().toISOString().slice(0, 10),
  message: "Visit assigned sites as per schedule.\nEnsure complete KYC capture.\nMaintain professionalism with clients.\nSubmit end-of-day report.\nStay within assigned geofence areas.",
};

import AsyncStorage from "@react-native-async-storage/async-storage";

let premiums: Premium[] = [...SEED_PREMIUM];
let loaded = false;

function storage(): any | null {
  try { return AsyncStorage ?? null; } catch { return null; }
}

export function genRef(existing: string[]): string {
  const set = new Set(existing);
  let r = "";
  do { r = "PT" + Math.floor(10000 + Math.random() * 90000); } while (set.has(r));
  return r;
}

export async function loadPremiums(): Promise<Premium[]> {
  if (loaded) return premiums;
  try {
    const s = storage();
    if (s) {
      const raw = await s.getItem("pees_premiums");
      if (raw) { premiums = JSON.parse(raw); loaded = true; return premiums; }
      await s.setItem("pees_premiums", JSON.stringify(premiums));
    }
  } catch {}
  loaded = true;
  return premiums;
}

// Submit gated: payment must be SUCCESSFUL (mirrors backend rule)
export async function submitPremium(input: { clientName: string; contact: string; paymentMode: string; paymentStatus: string }): Promise<Premium> {
  if (input.paymentStatus !== "SUCCESSFUL") throw new Error("Payment must be SUCCESSFUL before submission");
  await loadPremiums();
  const entry: Premium = {
    id: `pa_${Date.now()}`, referenceNo: genRef(premiums.map((p) => p.referenceNo)),
    clientName: input.clientName, contact: input.contact,
    paymentMode: input.paymentMode, paymentStatus: input.paymentStatus,
    status: "PENDING_REVIEW", createdAt: new Date().toISOString(),
  };
  premiums = [entry, ...premiums];
  try { await storage()?.setItem("pees_premiums", JSON.stringify(premiums)); } catch {}
  return entry;
}

export type Leave = { id: string; from: string; to: string; reason: string; status: string };
let leaves: Leave[] = [...SEED_LEAVES];
export async function getLeaves(): Promise<Leave[]> {
  try {
    const raw = await storage()?.getItem("pees_leaves");
    if (raw) leaves = JSON.parse(raw);
  } catch {}
  return leaves;
}
export async function applyLeave(input: { from: string; to: string; reason: string }): Promise<Leave> {
  const entry: Leave = { id: `l_${Date.now()}`, from: input.from, to: input.to, reason: input.reason, status: "PENDING" };
  leaves = [entry, ...leaves];
  try { await storage()?.setItem("pees_leaves", JSON.stringify(leaves)); } catch {}
  return entry;
}
export function leaveBalance(): number { return 12; }

export async function getSalarySlips() { return SEED_SLIPS; }
export async function getDirective() { return DIRECTIVE; }

// ---- Shifts (clock in/out, offline) ----
export type Shift = { id: string; clockInAt: string; clockOutAt?: string; lat?: number; lng?: number; selfieUri?: string; isActive: boolean };
let shifts: Shift[] = [];
export async function getShifts(): Promise<Shift[]> {
  try {
    const raw = await storage()?.getItem("pees_shifts");
    if (raw) shifts = JSON.parse(raw);
  } catch {}
  return shifts;
}
export async function getActiveShift(): Promise<Shift | null> {
  const all = await getShifts();
  return all.find((s) => s.isActive) || null;
}
export async function clockIn(input: { lat?: number; lng?: number; selfieUri?: string }): Promise<Shift> {
  const all = await getShifts();
  const entry: Shift = { id: `sh_${Date.now()}`, clockInAt: new Date().toISOString(), lat: input.lat, lng: input.lng, selfieUri: input.selfieUri, isActive: true };
  shifts = [entry, ...all];
  try { await storage()?.setItem("pees_shifts", JSON.stringify(shifts)); } catch {}
  return entry;
}
export async function clockOut(): Promise<Shift | null> {
  const all = await getShifts();
  const active = all.find((s) => s.isActive);
  if (!active) return null;
  active.isActive = false;
  active.clockOutAt = new Date().toISOString();
  try { await storage()?.setItem("pees_shifts", JSON.stringify(all)); } catch {}
  return active;
}

// ---- End-of-day reports ----
export type EOD = { id: string; date: string; activities: string; collections: string; notes: string };
let eods: EOD[] = [];
export async function getEODs(): Promise<EOD[]> {
  try {
    const raw = await storage()?.getItem("pees_eod");
    if (raw) eods = JSON.parse(raw);
  } catch {}
  return eods;
}
export async function submitEOD(input: { activities: string; collections: string; notes: string }): Promise<EOD> {
  const entry: EOD = { id: `eod_${Date.now()}`, date: new Date().toISOString().slice(0, 10), activities: input.activities, collections: input.collections, notes: input.notes };
  eods = [entry, ...eods];
  try { await storage()?.setItem("pees_eod", JSON.stringify(eods)); } catch {}
  return entry;
}

// ---- Clients (from submitted premiums) ----
export async function getClients() {
  const apps = await loadPremiums();
  return apps.map((p) => ({ name: p.clientName, contact: p.contact, referenceNo: p.referenceNo, status: p.status }));
}
