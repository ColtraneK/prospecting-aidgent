// url.mjs — LinkedIn URL canonicalization and dedup key construction.
// Pure functions, no I/O. Used by dedupe/merge and tests.

/**
 * Canonicalize a LinkedIn profile URL to a stable comparison form:
 *   https://www.linkedin.com/in/<vanity>
 * - forces https + www host
 * - keeps only the /in/<slug> path (drops trailing segments, query, hash)
 * - lowercases host and the /in/ slug
 * - strips a trailing slash
 * Returns "" when the input is not a recognizable LinkedIn profile URL.
 */
export function canonicalizeLinkedInUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  let s = raw.trim();
  if (!s) return "";
  // Add scheme if the user pasted a bare host.
  if (!/^https?:\/\//i.test(s)) s = "https://" + s.replace(/^\/+/, "");
  let u;
  try {
    u = new URL(s);
  } catch {
    return "";
  }
  const host = u.hostname.toLowerCase();
  if (!/(^|\.)linkedin\.com$/.test(host)) return "";
  // Match /in/<slug> (public profile) case-insensitively.
  const m = u.pathname.match(/\/in\/([^/]+)/i);
  if (!m) return "";
  let slug;
  try { slug = decodeURIComponent(m[1]).toLowerCase().replace(/\/+$/, ""); }
  catch { return ""; }
  if (!slug) return "";
  return `https://www.linkedin.com/in/${slug}`;
}

// Combining diacritical marks block (U+0300..U+036F). Built from char codes so
// the source stays pure ASCII with no ambiguous escape sequence.
const DIACRITICS_RE = new RegExp("[" + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + "]", "g");

/** Lowercase, collapse whitespace, strip punctuation for name/company fallback keys. */
export function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(DIACRITICS_RE, "") // strip diacritics
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Build the canonical dedup key for a lead.
 * Prefers the canonical LinkedIn URL; falls back to "name|company" when no URL.
 * Returns { key, basis } where basis is "url" or "name+company".
 */
export function canonicalKey({ url, name, company } = {}) {
  const canon = canonicalizeLinkedInUrl(url);
  if (canon) return { key: canon, basis: "url" };
  const n = normalizeText(name);
  const c = normalizeText(company);
  if (n) return { key: `name:${n}|company:${c}`, basis: "name+company" };
  return { key: "", basis: "none" };
}
