-- App-level throttling for admin login and password-reset requests.
-- Keys are SHA-256 hashes of the client address; raw addresses are never stored.
create table if not exists private.auth_throttle (
  bucket text not null check (char_length(bucket) <= 40),
  key text not null check (char_length(key) <= 64),
  failures integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  primary key (bucket, key)
);
revoke all on private.auth_throttle from public, anon, authenticated;

-- Seconds the caller must still wait (0 = allowed).
create or replace function public.auth_throttle_wait(p_bucket text, p_key text)
returns integer language sql stable security definer
set search_path = ''
as $$
  select coalesce((
    select ceil(extract(epoch from blocked_until - now()))::integer
    from private.auth_throttle
    where bucket = p_bucket and key = p_key and blocked_until > now()
  ), 0);
$$;

-- Records one attempt. Once p_max attempts land inside p_window the key is
-- blocked for p_block. Returns the remaining block in seconds (0 = not blocked).
create or replace function public.auth_throttle_hit(
  p_bucket text, p_key text, p_max integer, p_window interval, p_block interval
)
returns integer language plpgsql security definer
set search_path = ''
as $$
declare
  r private.auth_throttle;
begin
  if p_max < 1 or char_length(p_bucket) > 40 or char_length(p_key) > 64 then
    raise exception 'invalid throttle arguments';
  end if;
  delete from private.auth_throttle
  where window_started_at < now() - interval '1 day'
    and (blocked_until is null or blocked_until < now());
  insert into private.auth_throttle as t (bucket, key, failures, window_started_at)
  values (p_bucket, p_key, 1, now())
  on conflict (bucket, key) do update set
    failures = case when t.window_started_at + p_window < now() then 1 else t.failures + 1 end,
    window_started_at = case when t.window_started_at + p_window < now() then now() else t.window_started_at end,
    blocked_until = case
      when (case when t.window_started_at + p_window < now() then 1 else t.failures + 1 end) >= p_max
        then now() + p_block
      else t.blocked_until
    end
  returning * into r;
  return case when r.blocked_until > now() then ceil(extract(epoch from r.blocked_until - now()))::integer else 0 end;
end;
$$;

create or replace function public.auth_throttle_clear(p_bucket text, p_key text)
returns void language sql security definer
set search_path = ''
as $$ delete from private.auth_throttle where bucket = p_bucket and key = p_key; $$;

revoke all on function public.auth_throttle_wait(text, text) from public;
revoke all on function public.auth_throttle_hit(text, text, integer, interval, interval) from public;
revoke all on function public.auth_throttle_clear(text, text) from public;
grant execute on function public.auth_throttle_wait(text, text) to anon, authenticated;
grant execute on function public.auth_throttle_hit(text, text, integer, interval, interval) to anon, authenticated;
grant execute on function public.auth_throttle_clear(text, text) to anon, authenticated;
