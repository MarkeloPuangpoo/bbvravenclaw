import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type ThrottleRule = { max: number; windowSeconds: number; blockSeconds: number };

export const loginRule: ThrottleRule = { max: 5, windowSeconds: 15 * 60, blockSeconds: 15 * 60 };
export const resetRules = {
  burst: { max: 1, windowSeconds: 60, blockSeconds: 60 },
  hourly: { max: 3, windowSeconds: 60 * 60, blockSeconds: 60 * 60 },
  global: { max: 6, windowSeconds: 60 * 60, blockSeconds: 60 * 60 },
} satisfies Record<string, ThrottleRule>;

type Entry = { failures: number; windowStart: number; blockedUntil: number };
const memory = new Map<string, Entry>();
let warned = false;

function warnOnce(reason: string) {
  if (warned) return;
  warned = true;
  console.warn(`[auth-throttle] database throttle unavailable (${reason}); using per-instance memory fallback. Apply supabase/migrations/20261007000100_auth_throttle.sql.`);
}

// Throttle keys are hashes; the raw address is never stored or logged.
export async function clientKey() {
  const list = await headers();
  const address = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip")?.trim() || "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 32);
}

function memoryWait(bucket: string, key: string) {
  const entry = memory.get(`${bucket}:${key}`);
  return entry && entry.blockedUntil > Date.now() ? Math.ceil((entry.blockedUntil - Date.now()) / 1000) : 0;
}

function memoryHit(bucket: string, key: string, rule: ThrottleRule) {
  const now = Date.now();
  if (memory.size > 5000) {
    for (const [id, entry] of memory) if (entry.blockedUntil < now && entry.windowStart + 86_400_000 < now) memory.delete(id);
  }
  const id = `${bucket}:${key}`;
  const previous = memory.get(id);
  const expired = !previous || previous.windowStart + rule.windowSeconds * 1000 < now;
  const failures = expired ? 1 : previous.failures + 1;
  const blockedUntil = failures >= rule.max ? now + rule.blockSeconds * 1000 : previous?.blockedUntil ?? 0;
  memory.set(id, { failures, windowStart: expired ? now : previous.windowStart, blockedUntil });
  return blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0;
}

/** Seconds the caller must wait before trying again; 0 means allowed. */
export async function throttleWait(bucket: string, key: string) {
  const supabase = createSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase.rpc("auth_throttle_wait", { p_bucket: bucket, p_key: key });
    if (!error && typeof data === "number") return Math.max(data, memoryWait(bucket, key));
    warnOnce(error?.message ?? "no client");
  }
  return memoryWait(bucket, key);
}

/** Counts one attempt against the rule; returns the resulting block in seconds. */
export async function throttleHit(bucket: string, key: string, rule: ThrottleRule) {
  const local = memoryHit(bucket, key, rule);
  const supabase = createSupabasePublicClient();
  if (supabase) {
    const { data, error } = await supabase.rpc("auth_throttle_hit", {
      p_bucket: bucket,
      p_key: key,
      p_max: rule.max,
      p_window: `${rule.windowSeconds} seconds`,
      p_block: `${rule.blockSeconds} seconds`,
    });
    if (!error && typeof data === "number") return Math.max(data, local);
    warnOnce(error?.message ?? "no client");
  }
  return local;
}

export async function throttleClear(bucket: string, key: string) {
  memory.delete(`${bucket}:${key}`);
  const supabase = createSupabasePublicClient();
  if (supabase) await supabase.rpc("auth_throttle_clear", { p_bucket: bucket, p_key: key });
}
