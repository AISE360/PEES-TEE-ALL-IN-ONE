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

export async function getLeaves() { return SEED_LEAVES; }
export async function getSalarySlips() { return SEED_SLIPS; }
export async function getDirective() { return DIRECTIVE; }
