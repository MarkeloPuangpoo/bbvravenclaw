-- Admin writes must stop immediately when a session is revoked. A JWT by
-- itself can remain cryptographically valid until its expiry.
create or replace function private.is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join private.admin_emails a on lower(u.email) = a.email
    join auth.sessions s on s.user_id = u.id
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
      and s.id = nullif((select auth.jwt() ->> 'session_id'), '')::uuid
  );
$$;
