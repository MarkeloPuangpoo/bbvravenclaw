import { createSupabasePublicClient } from "@/lib/supabase/public";
export type HomepageSlot = "president" | "vice_president_1" | "vice_president_2" | "stand_head" | "sports_head";
export type Person = {
  id: string;
  name: string;
  role: string;
  group: "leadership" | "cheerleader" | "athlete";
  slot: HomepageSlot;
  portraitUrl: string;
  cutoutUrl?: string;
  quote?: string;
};

export type Sport = { id: string; name: string; description?: string };
export type ScheduleItem = { id: string; date: string; time: string; title: string; location?: string };
export type CheerItem = { id: string; title: string; lyrics: string; order: number };
export type Moment = { id: string; imageUrl: string; caption: string; credit?: string; takenAt?: string };
export type Standing = { id: string; house: string; score: number; rank: number };
export type Announcement = { id: string; title: string; body: string; publishedAt: string };

export type PublicContent = {
  people: Person[];
  sports: Sport[];
  schedule: ScheduleItem[];
  cheers: CheerItem[];
  moments: Moment[];
  standings: Standing[];
  announcements: Announcement[];
};

export async function getPublicContent(): Promise<PublicContent> {
  const empty: PublicContent = {
    people: [],
    sports: [],
    schedule: [],
    cheers: [],
    moments: [],
    standings: [],
    announcements: [],
  };
  const supabase = createSupabasePublicClient();
  if (!supabase) return empty;

  const [people, sports, schedule, cheers, moments, standings, announcements] = await Promise.all([
    supabase.from("people").select("id,name,role,group_name,homepage_slot,portrait_path,cutout_path,quote").eq("status", "published").eq("is_demo", false).not("homepage_slot", "is", null),
    supabase.from("sports").select("id,name,description").eq("status", "published").order("sort_order"),
    supabase.from("schedule_items").select("id,event_date,event_time,title,location").eq("status", "published").order("event_date").order("event_time"),
    supabase.from("cheers").select("id,title,lyrics,sort_order").eq("status", "published").order("sort_order"),
    supabase.from("moments").select("id,image_path,caption,credit,taken_at").eq("status", "published").order("sort_order"),
    supabase.from("standings").select("id,house,score").eq("status", "published").eq("is_official", true).order("score", { ascending: false }),
    supabase.from("announcements").select("id,title,body,published_at").eq("status", "published").order("sort_order"),
  ]);

  const paths = new Set<string>();
  for (const person of people.data ?? []) {
    if (person.portrait_path) paths.add(person.portrait_path);
    if (person.cutout_path) paths.add(person.cutout_path);
  }
  for (const moment of moments.data ?? []) if (moment.image_path) paths.add(moment.image_path);
  const signed = new Map<string, string>();
  await Promise.all([...paths].map(async (path) => {
    const { data } = await supabase.storage.from("event-media").createSignedUrl(path, 60 * 15);
    if (data?.signedUrl) signed.set(path, data.signedUrl);
  }));

  return {
    people: (people.data ?? []).filter((p) => p.portrait_path && signed.has(p.portrait_path)).map((p) => ({
      id: p.id, name: p.name, role: p.role, group: p.group_name as Person["group"], slot: p.homepage_slot as HomepageSlot,
      portraitUrl: signed.get(p.portrait_path!)!,
      cutoutUrl: p.cutout_path ? signed.get(p.cutout_path) : undefined,
      quote: p.quote ?? undefined,
    })),
    sports: (sports.data ?? []).map((s) => ({ id: s.id, name: s.name, description: s.description ?? undefined })),
    schedule: (schedule.data ?? []).filter((s) => s.event_date && s.event_time).map((s) => ({
      id: s.id, date: s.event_date!, time: s.event_time!.slice(0, 5), title: s.title, location: s.location ?? undefined,
    })),
    cheers: (cheers.data ?? []).map((c) => ({ id: c.id, title: c.title, lyrics: c.lyrics, order: c.sort_order })),
    moments: (moments.data ?? []).filter((m) => m.image_path && signed.has(m.image_path)).map((m) => ({
      id: m.id, imageUrl: signed.get(m.image_path!)!, caption: m.caption,
      credit: m.credit ?? undefined, takenAt: m.taken_at ?? undefined,
    })),
    standings: (standings.data ?? []).map((s, i) => ({ id: s.id, house: s.house, score: s.score, rank: i + 1 })),
    announcements: (announcements.data ?? []).map((a) => ({
      id: a.id, title: a.title, body: a.body, publishedAt: a.published_at ?? "",
    })),
  };
}
