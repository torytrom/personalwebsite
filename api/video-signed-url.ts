import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Config ────────────────────────────────────────────────────────────────────
const BUCKET = "website-video";
const SIGNED_URL_EXPIRES = 600; // 10 minutes

// ── Lazy Supabase client (created on first request, reused across warm invocations)
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "[signed-url] Missing env vars. SUPABASE_URL:",
      url ? "set" : "MISSING",
      "SUPABASE_SERVICE_ROLE_KEY:",
      key ? "set" : "MISSING"
    );
    return null;
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// ── Rate limiter (in-memory, per serverless instance) ─────────────────────────
const RATE_LIMIT = 30; // max requests per window per IP
const RATE_WINDOW_MS = 60_000; // 1 minute
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Clean stale entries opportunistically
  if (rateMap.size > 500) {
    for (const [k, v] of rateMap) {
      if (v.resetAt < now) rateMap.delete(k);
    }
  }
  const entry = rateMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// ── Path validation ───────────────────────────────────────────────────────────
// Only allow filenames that look like the known video assets:
//   hex/uuid-style names + .mov   (no slashes, no traversal)
const ALLOWED_PATH = /^[a-zA-Z0-9_\-]+\.mov$/;

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = process.env.SITE_ORIGIN || "";

  // — CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  // — Set CORS for all responses ──────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin || "*");

  // — Only GET ────────────────────────────────────────────────────────────────
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // — Check Supabase client ──────────────────────────────────────────────────
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(503).json({ error: "Server configuration error — missing env vars" });
  }

  // — Origin / Referer soft-check (blocks naïve hot-linkers) ─────────────────
  if (allowedOrigin) {
    const origin = req.headers.origin ?? "";
    const referer = req.headers.referer ?? "";
    if (origin && origin !== allowedOrigin) {
      console.warn(`[signed-url] blocked origin: ${origin}`);
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!origin && referer && !referer.startsWith(allowedOrigin)) {
      console.warn(`[signed-url] blocked referer: ${referer}`);
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  // — Rate limit ──────────────────────────────────────────────────────────────
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    console.warn(`[signed-url] rate-limited IP: ${ip}`);
    return res.status(429).json({ error: "Too many requests" });
  }

  // — Validate path param ────────────────────────────────────────────────────
  const filePath =
    typeof req.query.path === "string" ? req.query.path : undefined;

  if (!filePath || !ALLOWED_PATH.test(filePath)) {
    return res.status(400).json({ error: "Invalid path parameter" });
  }

  // — Generate signed URL ────────────────────────────────────────────────────
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRES);

  if (error || !data?.signedUrl) {
    console.error(`[signed-url] Supabase error for "${filePath}":`, error?.message);
    return res.status(502).json({ error: "Failed to generate signed URL" });
  }

  // — Respond ────────────────────────────────────────────────────────────────
  // Let the browser cache the response for 5 min (half the signed-URL lifetime)
  res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=60");
  return res.status(200).json({ signedUrl: data.signedUrl });
}
