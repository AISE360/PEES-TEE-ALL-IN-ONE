// Backend API client — API-first with graceful offline fallback to demoStore.
// Base URL comes from app.json -> extra.apiUrl (see app.config). Empty = offline demo mode.
import Constants from "expo-constants";

const BASE: string = ((Constants.expoConfig?.extra as any)?.apiUrl as string) || "";

export function isApiConfigured() {
  return BASE.startsWith("http");
}

export function apiBase() {
  return BASE;
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  if (!isApiConfigured()) throw new Error("API not configured");
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 9000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...((opts.headers as any) || {}) },
      ...opts,
      signal: c.signal as any,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
  } finally {
    clearTimeout(t);
  }
}
