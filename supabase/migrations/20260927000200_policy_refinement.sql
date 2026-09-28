alter function public.is_house_admin() security invoker;

do $$
declare table_name text;
declare public_condition text;
begin
  foreach table_name in array array['people', 'sports', 'schedule_items', 'cheers', 'moments', 'standings', 'announcements']
  loop
    public_condition := case table_name
      when 'people' then 'status = ''published'' and not is_demo'
      when 'standings' then 'status = ''published'' and is_official'
      else 'status = ''published'''
    end;
    execute format('drop policy public_read on public.%I', table_name);
    execute format('drop policy admin_read on public.%I', table_name);
    execute format('create policy public_read on public.%I for select to anon using (%s)', table_name, public_condition);
    execute format('create policy admin_read on public.%I for select to authenticated using ((%s) or (select private.is_admin()))', table_name, public_condition);
  end loop;
end;
$$;

create index if not exists people_sport_id_idx on public.people (sport_id);
create index if not exists schedule_sport_id_idx on public.schedule_items (sport_id);
