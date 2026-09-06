// Offline demo store for Client App — localStorage/AsyncStorage backed, zero backend needed.
// Uses in-memory cache + optional AsyncStorage if installed (no hard native dep so release bundle stays green).
type Req = {
  id: string; reference: string; serviceType: string; description: string;
  preferredContactTime: string; stage: string;
  stageHistory: { stage: string; at: string }[];
  createdAt: string; updatedAt: string;
};

const SEED: Req[] = [
  {
    id: "cr1", reference: "PT24153", serviceType: "Land Documentation",
    description: "Need help with property mutation",
    preferredContactTime: "2026-09-06 10:00", stage: "IN_PROCESSING",
    stageHistory: [
      { stage: "APPLIED", at: "2026-09-05T10:30:00Z" },
      { stage: "CONNECTED", at: "2026-09-05T14:15:00Z" },
      { stage: "IN_PROCESSING", at: "2026-09-06T11:20:00Z" },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "cr2", reference: "PT11021", serviceType: "Premium Quotes",
    description: "Premium quote for plot registration",
    preferredContactTime: "2026-09-07 11:00", stage: "APPLIED",
    stageHistory: [{ stage: "APPLIED", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const SERVICES = [
  { id: "1", title: "Land Documentation", desc: "Get expert assistance", icon: "🏛️" },
  { id: "2", title: "Premium Quotes", desc: "Accurate & transparent", icon: "📥" },
  { id: "3", title: "Legal Assistance", desc: "Professional support", icon: "👤" },
  { id: "4", title: "Property Verification", desc: "Verify with confidence", icon: "🏠" },
];

export const SUPPORT = {
  name: "PEES Tee Group Pvt Ltd",
  address: "HBR Layout, Bengaluru - 560043",
  email: "info@peesteegroup.com",
  phone: "+91 (080) 41289652",
  website: "www.peesteegroup.com",
};

import AsyncStorage from "@react-native-async-storage/async-storage";

let mem: Req[] = [...SEED];
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

export async function loadRequests(): Promise<Req[]> {
  if (loaded) return mem;
  try {
    const s = storage();
    if (s) {
      const raw = await s.getItem("pees_client_requests");
      if (raw) { mem = JSON.parse(raw); loaded = true; return mem; }
      await s.setItem("pees_client_requests", JSON.stringify(mem));
    }
  } catch {}
  loaded = true;
  return mem;
}

export async function saveRequest(input: { serviceType: string; description: string; preferredContactTime: string }): Promise<Req> {
  await loadRequests();
  const entry: Req = {
    id: `cr_${Date.now()}`, reference: genRef(mem.map((m) => m.reference)),
    serviceType: input.serviceType, description: input.description,
    preferredContactTime: input.preferredContactTime, stage: "APPLIED",
    stageHistory: [{ stage: "APPLIED", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  mem = [entry, ...mem];
  try { await storage()?.setItem("pees_client_requests", JSON.stringify(mem)); } catch {}
  return entry;
}

export async function resetDemo(): Promise<void> {
  mem = [...SEED]; loaded = true;
  try { await storage()?.setItem("pees_client_requests", JSON.stringify(mem)); } catch {}
}
