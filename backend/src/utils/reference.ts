// PTxxxxx generator - unique 5-digit numeric prefixed PT
export function generateReference(existing: Set<string> = new Set()): string {
  let ref: string;
  do {
    const n = Math.floor(10000 + Math.random() * 90000);
    ref = `PT${n}`;
  } while (existing.has(ref));
  return ref;
}
