import { REFERENCE_PREFIX } from "./constants";

// 5-digit PT reference generator (server-side)
export function generateReferenceNumber(existing: Set<string> = new Set()): string {
  let ref: string;
  do {
    const num = Math.floor(10000 + Math.random() * 90000); // 10000-99999
    ref = `${REFERENCE_PREFIX}${num}`;
  } while (existing.has(ref));
  return ref;
}

export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isWithinGeofence(user: { lat: number; lng: number }, site: { lat: number; lng: number; radiusM: number }): boolean {
  return getDistanceMeters(user.lat, user.lng, site.lat, site.lng) <= site.radiusM;
}

export function validateFileSizes(docSizeKb: number, photoSizeKb: number): { docOk: boolean; photoOk: boolean } {
  return { docOk: docSizeKb < 300, photoOk: photoSizeKb < 50 };
}
