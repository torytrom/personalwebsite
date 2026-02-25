import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ── Config ────────────────────────────────────────────────────────────────────
const BUCKET = "website-video";
const SIGNED_URL_EXPIRES = 600; // 10 minutes

// ── Lazy R2 client (created on first request, reused across warm invocations)
let _s3: S3Client | null = null;

function getS3(): S3Client | null {
  if (_s3) return _s3;

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.error(
      "[signed-url] Missing R2 env vars. R2_ENDPOINT:",
      endpoint ? "set" : "MISSING",
      "R2_ACCESS_KEY_ID:",
      accessKeyId ? "set" : "MISSING",
      "R2_SECRET_ACCESS_KEY:",
      secretAccessKey ? "set" : "MISSING"
    );
    return null;
  }

  _s3 = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return _s3;
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
//   simple names + .mp4 only   (no slashes, no traversal)
const ALLOWED_PATH = /^[a-zA-Z0-9_\-]+\.mp4$/;

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

  // — Check R2 client ─────────────────────────────────────────────────────────
  const s3 = getS3();
  if (!s3) {
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

  // — Generate presigned URL via R2 (S3-compatible) ──────────────────────────
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: SIGNED_URL_EXPIRES,
    });

    // — Respond ──────────────────────────────────────────────────────────────
    // Let the browser cache the response for 5 min (half the signed-URL lifetime)
    res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=60");
    return res.status(200).json({ signedUrl });
  } catch (err) {
    console.error(`[signed-url] R2 error for "${filePath}":`, err);
    return res.status(502).json({ error: "Failed to generate signed URL" });
  }
}
