/**
 * Access to the stage screens. The repository is public, so the screens'
 * address alone keeps no one out; they sit behind a passcode instead. Only
 * its SHA-256 is in the code. Signing in stores the passcode itself in an
 * httpOnly cookie scoped to the stage pages, and each request checks that it
 * hashes to the value below. To change the passcode, replace the hash.
 */
export const STAGE_BASE = "/stage-76803f8f95";
export const STAGE_COOKIE = "c26_stage";
const PASS_SHA256 =
  "177b112b6f48728785181ac38e3fc8de1e7922c774331982043724447f9824b3";

const hex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export const passOk = async (value: string | undefined | null) => {
  if (!value) return false;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  const got = hex(digest);
  // Constant-time compare of two equal-length hex strings.
  let diff = 0;
  for (let i = 0; i < PASS_SHA256.length; i++)
    diff |= (got.charCodeAt(i) || 0) ^ PASS_SHA256.charCodeAt(i);
  return diff === 0 && got.length === PASS_SHA256.length;
};
