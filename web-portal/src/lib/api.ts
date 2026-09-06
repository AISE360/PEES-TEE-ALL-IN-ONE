const BASE = (import.meta as any).env?.VITE_API_URL || "";
export async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { "Content-Type":"application/json", ...(opts.headers||{}) }, ...opts });
  return res.json();
}
