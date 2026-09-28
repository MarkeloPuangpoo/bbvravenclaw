alter table public.people
  add column homepage_slot text
  check (homepage_slot in ('president', 'vice_president_1', 'vice_president_2', 'stand_head', 'sports_head'));

alter table public.people
  add constraint people_homepage_slot_group_check check (
    homepage_slot is null or
    (homepage_slot in ('president', 'vice_president_1', 'vice_president_2') and group_name = 'leadership') or
    (homepage_slot = 'stand_head' and group_name = 'cheerleader') or
    (homepage_slot = 'sports_head' and group_name = 'athlete')
  );

-- Keep the already published president visible after introducing explicit slots.
update public.people
set homepage_slot = 'president'
where id = (
  select id from public.people
  where status = 'published' and not is_demo and group_name = 'leadership'
    and featured and role = 'ประธานสี'
  order by sort_order, created_at
  limit 1
);

create unique index people_published_homepage_slot_unique
  on public.people (homepage_slot)
  where status = 'published' and not is_demo and homepage_slot is not null;

drop policy public_read on public.people;
drop policy admin_read on public.people;
create policy public_read on public.people for select to anon
  using (status = 'published' and not is_demo and homepage_slot is not null);
create policy admin_read on public.people for select to authenticated
  using ((status = 'published' and not is_demo and homepage_slot is not null) or (select private.is_admin()));

drop policy published_media_read on storage.objects;
create policy published_media_read on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'event-media' and (
      exists (
        select 1 from public.people p
        where p.status = 'published' and not p.is_demo and p.homepage_slot is not null
          and (p.portrait_path = storage.objects.name or p.cutout_path = storage.objects.name)
      ) or exists (
        select 1 from public.moments m
        where m.status = 'published' and m.image_path = storage.objects.name
      )
    )
  );
