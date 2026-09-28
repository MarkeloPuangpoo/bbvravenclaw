create table if not exists private.admin_emails (email text primary key);
revoke all on private.admin_emails from public, anon, authenticated;
insert into private.admin_emails (email) values ('drvvdre@gmail.com') on conflict do nothing;

create or replace function private.is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    join private.admin_emails a on lower(u.email) = a.email
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;
