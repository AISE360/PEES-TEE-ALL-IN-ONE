// Offline demo store for Client App — localStorage/AsyncStorage backed, zero backend needed.
// Uses in-memory cache + optional AsyncStorage if installed (no hard native dep so release bundle stays green).
export type Attachment = { name: string; uri: string; size?: number; mime?: string };

type Req = {
  id: string; reference: string; serviceType: string; description: string;
  preferredContactTime: string; stage: string;
  stageHistory: { stage: string; at: string }[];
  attachments: Attachment[];
  createdAt: string; updatedAt: string;
};

const SEED: Req[] = [
  {
    id: "cr1", reference: "PT24153", serviceType: "Land Documentation",
    description: "Need help with property mutation",
    preferredContactTime: "2026-09-06 10:00", stage: "IN_PROCESSING", attachments: [],
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
    preferredContactTime: "2026-09-07 11:00", stage: "APPLIED", attachments: [],
    stageHistory: [{ stage: "APPLIED", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const SERVICES = [
  { id: "1", title: "Land Purchase & Due Diligence", desc: "30-yr EC audit + advocate title search", icon: "🤝" },
  { id: "2", title: "Land Survey & DGPS (Mojini)", desc: "Boundary mapping, fencing & levelling", icon: "📐" },
  { id: "3", title: "Layouts & Development", desc: "BDA/BMRDA-approved layouts, roads", icon: "🏗️" },
  { id: "4", title: "Khata, EC, Mutation, DC Conversion", desc: "E-Khata, B→A, Kaveri registration", icon: "📜" },
  { id: "5", title: "GST, MSME & Company Setup", desc: "GST, Udyam, IEC, Pvt Ltd/LLP", icon: "🏛️" },
  { id: "6", title: "Cargo, Warehousing & Fleet", desc: "GPS-tracked freight pan-India", icon: "🚚" },
];

export const SUPPORT = {
  name: "PEES Tee Group Pvt Ltd",
  address: "#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043",
  email: "info@peesteegroup.com",
  phone: "+91 89519 37171",
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

export async function saveRequest(input: { serviceType: string; description: string; preferredContactTime: string; attachments?: Attachment[] }): Promise<Req> {
  await loadRequests();
  const entry: Req = {
    id: `cr_${Date.now()}`, reference: genRef(mem.map((m) => m.reference)),
    serviceType: input.serviceType, description: input.description,
    preferredContactTime: input.preferredContactTime, attachments: input.attachments || [], stage: "APPLIED",
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
