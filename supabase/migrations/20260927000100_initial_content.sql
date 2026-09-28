-- Ravenclaw event content. Apply this to the dedicated bbv-ravenclaw project.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table private.admin_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on private.admin_members from public, anon, authenticated;

create function private.is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admin_members
    where user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create function public.is_house_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$ select private.is_admin(); $$;
revoke all on function public.is_house_admin() from public, anon;
grant execute on function public.is_house_admin() to authenticated;

create function private.set_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null default '' check (char_length(name) <= 120),
  role text not null default '' check (char_length(role) <= 120),
  group_name text not null check (group_name in ('leadership', 'cheerleader', 'athlete')),
  sport_id uuid,
  portrait_path text,
  cutout_path text,
  quote text check (char_length(quote) <= 500),
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_person_complete check (
    status <> 'published' or
    (not is_demo and name <> '' and role <> '' and portrait_path is not null)
  )
);

create table public.sports (
  id uuid primary key default gen_random_uuid(),
  name text not null default '' check (char_length(name) <= 120),
  description text check (char_length(description) <= 500),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_sport_complete check (status <> 'published' or name <> '')
);
alter table public.people add constraint people_sport_id_fkey
  foreign key (sport_id) references public.sports (id) on delete set null;

create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  event_date date,
  event_time time,
  title text not null default '' check (char_length(title) <= 200),
  location text check (char_length(location) <= 200),
  sport_id uuid references public.sports (id) on delete set null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_schedule_complete check (
    status <> 'published' or (event_date is not null and event_time is not null and title <> '')
  )
);

create table public.cheers (
  id uuid primary key default gen_random_uuid(),
  title text not null default '' check (char_length(title) <= 160),
  lyrics text not null default '' check (char_length(lyrics) <= 10000),
  cue_notes text check (char_length(cue_notes) <= 2000),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_cheer_complete check (status <> 'published' or (title <> '' and lyrics <> ''))
);

create table public.moments (
  id uuid primary key default gen_random_uuid(),
  image_path text,
  caption text not null default '' check (char_length(caption) <= 500),
  credit text check (char_length(credit) <= 200),
  taken_at timestamptz,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_moment_complete check (status <> 'published' or (image_path is not null and caption <> ''))
);

create table public.standings (
  id uuid primary key default gen_random_uuid(),
  house text not null default '' unique check (char_length(house) <= 120),
  score integer not null default 0 check (score >= 0),
  is_official boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_standing_complete check (status <> 'published' or (house <> '' and is_official))
);

create table public.score_audit (
  id bigint generated always as identity primary key,
  standing_id uuid not null,
  house text not null,
  old_score integer,
  new_score integer,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_by uuid,
  changed_at timestamptz not null default now()
);

create function private.audit_standing()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.score_audit (standing_id, house, new_score, action, changed_by)
    values (new.id, new.house, new.score, tg_op, (select auth.uid()));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.score_audit (standing_id, house, old_score, new_score, action, changed_by)
    values (new.id, new.house, old.score, new.score, tg_op, (select auth.uid()));
    return new;
  else
    insert into public.score_audit (standing_id, house, old_score, action, changed_by)
    values (old.id, old.house, old.score, tg_op, (select auth.uid()));
    return old;
  end if;
end;
$$;
create trigger standing_score_audit
after insert or update or delete on public.standings
for each row execute function private.audit_standing();

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null default '' check (char_length(title) <= 200),
  body text not null default '' check (char_length(body) <= 5000),
  published_at timestamptz,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_announcement_complete check (status <> 'published' or (title <> '' and body <> ''))
);

do $$
declare table_name text;
declare public_condition text;
begin
  foreach table_name in array array['people', 'sports', 'schedule_items', 'cheers', 'moments', 'standings', 'announcements']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
    execute format('create index %I on public.%I (status)', table_name || '_status_idx', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function private.set_updated_at()', table_name);
    public_condition := case table_name
      when 'people' then 'status = ''published'' and not is_demo'
      when 'standings' then 'status = ''published'' and is_official'
      else 'status = ''published'''
    end;
    execute format('create policy public_read on public.%I for select to anon, authenticated using (%s)', table_name, public_condition);
    execute format('create policy admin_read on public.%I for select to authenticated using ((select private.is_admin()))', table_name);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select private.is_admin()))', table_name);
    execute format('create policy admin_update on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', table_name);
    execute format('create policy admin_delete on public.%I for delete to authenticated using ((select private.is_admin()))', table_name);
  end loop;
end;
$$;

alter table public.score_audit enable row level security;
revoke all on public.score_audit from anon, authenticated;
grant select on public.score_audit to authenticated;
create policy admin_read on public.score_audit
  for select to authenticated using ((select private.is_admin()));

create index people_group_status_idx on public.people (group_name, status, sort_order);
create index schedule_date_time_idx on public.schedule_items (event_date, event_time);
create index moments_status_sort_idx on public.moments (status, sort_order);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-media', 'event-media', false, 12582912, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy admin_media_read on storage.objects
  for select to authenticated
  using (bucket_id = 'event-media' and (select private.is_admin()));
create policy published_media_read on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'event-media' and (
      exists (
        select 1 from public.people p
        where p.status = 'published' and not p.is_demo
          and (p.portrait_path = name or p.cutout_path = name)
      ) or exists (
        select 1 from public.moments m
        where m.status = 'published' and m.image_path = name
      )
    )
  );
create policy admin_media_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-media' and (select private.is_admin()));
create policy admin_media_update on storage.objects
  for update to authenticated
  using (bucket_id = 'event-media' and (select private.is_admin()))
  with check (bucket_id = 'event-media' and (select private.is_admin()));
create policy admin_media_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-media' and (select private.is_admin()));
