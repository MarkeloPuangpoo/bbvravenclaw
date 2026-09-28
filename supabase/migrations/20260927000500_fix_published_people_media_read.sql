-- Qualify the outer storage object name. Unqualified `name` in the people
-- subquery resolves to people.name, so published portraits stayed unreadable.
drop policy if exists published_media_read on storage.objects;

create policy published_media_read on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'event-media' and (
      exists (
        select 1 from public.people p
        where p.status = 'published' and not p.is_demo
          and (p.portrait_path = storage.objects.name or p.cutout_path = storage.objects.name)
      ) or exists (
        select 1 from public.moments m
        where m.status = 'published' and m.image_path = storage.objects.name
      )
    )
  );
