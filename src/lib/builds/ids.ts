/** Short ids for share links, e.g. /b/k3jd9slm2q. No look-alike characters. */
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

export function newBuildId(length = 10): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

export const SAMPLE_BUILD_ID = "sample";

export function isValidBuildId(id: string): boolean {
  return id === SAMPLE_BUILD_ID || /^[23456789abcdefghjkmnpqrstuvwxyz]{10}$/.test(id);
}
