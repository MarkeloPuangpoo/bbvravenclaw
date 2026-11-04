import type { createSupabaseServerClient } from "@/lib/supabase/server";
import { sections, type SectionKey } from "@/lib/admin/sections";

export type AdminClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
export type Counts = Record<SectionKey, { published: number; draft: number }>;

export const sectionKeys = Object.keys(sections) as SectionKey[];

export async function getSectionCounts(supabase: AdminClient): Promise<Counts> {
  const entries = await Promise.all(sectionKeys.map(async (key) => {
    const { data } = await supabase.from(sections[key].table).select("status");
    const rows = data ?? [];
    const published = rows.filter((row) => row.status === "published").length;
    return [key, { published, draft: rows.length - published }] as const;
  }));
  return Object.fromEntries(entries) as Counts;
}

const dateTime = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
const dateOnly = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", year: "numeric" });

export function formatUpdated(value: unknown) {
  if (typeof value !== "string") return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateTime.format(date);
}

/** Row metadata: dates and times read as dates, everything else as plain text. */
export function formatMeta(key: string, value: unknown) {
  if (value == null || value === "") return "";
  if (key === "event_date" && typeof value === "string") return dateOnly.format(new Date(`${value}T00:00:00+07:00`));
  if (key === "event_time" && typeof value === "string") return `${value.slice(0, 5)} น.`;
  if (key === "score") return `${value} คะแนน`;
  return String(value);
}

/** Signed URLs for a set of storage paths, keyed by path. */
export async function signImages(supabase: AdminClient, paths: string[]) {
  const signed = new Map<string, string>();
  await Promise.all([...new Set(paths)].map(async (path) => {
    const { data } = await supabase.storage.from("event-media").createSignedUrl(path, 60 * 15);
    if (data?.signedUrl) signed.set(path, data.signedUrl);
  }));
  return signed;
}

/** Datetime values are stored in UTC and edited in Bangkok time. */
export function toBangkokInput(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(new Date(value).getTime() + 7 * 60 * 60 * 1000);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}
