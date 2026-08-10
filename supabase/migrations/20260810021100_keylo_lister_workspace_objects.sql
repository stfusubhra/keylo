-- Lister workspace objects. This migration runs after the enum value has
-- committed, so lister role casts are safe on every supported Postgres version.

create table public.lister_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lister_items (
  id uuid primary key default gen_random_uuid(),
  lister_id uuid not null references public.lister_profiles(id) on delete cascade,
  name text not null,
  category text not null,
  description text not null,
  photos text[] not null default '{}',
  price_per_day numeric(12,2) not null check (price_per_day > 0),
  price_per_week numeric(12,2) not null default 0 check (price_per_week >= 0),
  deposit numeric(12,2) not null default 0 check (deposit >= 0),
  condition text not null,
  location text not null,
  availability text not null default 'available' check (availability in ('available', 'unavailable')),
  status text not null default 'available' check (status in ('available', 'rented')),
  times_rented integer not null default 0 check (times_rented >= 0),
  rules text not null default '',
  fulfilment text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lister_requests (
  id uuid primary key default gen_random_uuid(),
  lister_id uuid not null references public.lister_profiles(id) on delete cascade,
  item_id uuid not null references public.lister_items(id) on delete restrict,
  renter_id uuid not null references public.profiles(id) on delete restrict,
  renter_name text not null,
  renter_email text not null,
  start_date date not null,
  end_date date not null,
  days integer generated always as ((end_date - start_date) + 1) stored check (days > 0),
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  message text not null default '',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (end_date >= start_date)
);

create table public.lister_earnings (
  id uuid primary key default gen_random_uuid(),
  lister_id uuid not null references public.lister_profiles(id) on delete cascade,
  request_id uuid not null unique references public.lister_requests(id) on delete restrict,
  item_id uuid not null references public.lister_items(id) on delete restrict,
  item_name text not null,
  amount numeric(12,2) not null check (amount > 0),
  label text not null,
  created_at timestamptz not null default now()
);

create table public.lister_settings (
  lister_id uuid primary key references public.lister_profiles(id) on delete cascade,
  public_profile boolean not null default true,
  email_alerts boolean not null default true,
  sms_alerts boolean not null default false,
  payout_mode text not null default 'upi' check (payout_mode in ('upi', 'bank')),
  payout_detail text not null default '',
  updated_at timestamptz not null default now()
);

create index lister_items_public_idx on public.lister_items (availability, created_at desc);
create index lister_requests_lister_idx on public.lister_requests (lister_id, created_at desc);
create index lister_earnings_lister_idx on public.lister_earnings (lister_id, created_at desc);

create or replace function public.protect_lister_item_counters()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and auth.uid() = old.lister_id
     and current_setting('keylo.lister_request_workflow', true) <> 'true'
     and (new.times_rented <> old.times_rented or new.status <> old.status) then
    raise exception 'Rental counters are updated only by the request workflow';
  end if;
  return new;
end;
$$;

create trigger protect_lister_item_counters
before update on public.lister_items
for each row execute function public.protect_lister_item_counters();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role public.user_role := case
    when new.raw_user_meta_data->>'role' = 'landlord' then 'landlord'::public.user_role
    when new.raw_user_meta_data->>'role' = 'lister' then 'lister'::public.user_role
    when new.raw_user_meta_data->>'role' = 'admin' then 'student'::public.user_role
    else 'student'::public.user_role
  end;
begin
  insert into public.profiles (id, full_name, role, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'KeyLo user'), v_role, new.raw_user_meta_data->>'phone')
  on conflict (id) do update set full_name = excluded.full_name, phone = coalesce(excluded.phone, public.profiles.phone), role = case when public.profiles.role = 'admin' then public.profiles.role else excluded.role end, updated_at = now();
  if v_role = 'lister'::public.user_role then
    insert into public.lister_profiles (id, display_name, phone, avatar_url) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'KeyLo lister'), new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'avatar_url') on conflict (id) do nothing;
    insert into public.lister_settings (lister_id) values (new.id) on conflict (lister_id) do nothing;
  end if;
  return new;
end;
$$;

alter table public.lister_profiles enable row level security;
alter table public.lister_items enable row level security;
alter table public.lister_requests enable row level security;
alter table public.lister_earnings enable row level security;
alter table public.lister_settings enable row level security;

create policy "Listers read own profile" on public.lister_profiles for select using (id = auth.uid());
create policy "Listers update own profile" on public.lister_profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Public lister items are readable" on public.lister_items for select using (availability = 'available' or lister_id = auth.uid());
create policy "Listers manage own items" on public.lister_items for insert with check (lister_id = auth.uid() and status = 'available' and times_rented = 0);
create policy "Listers update own items" on public.lister_items for update using (lister_id = auth.uid()) with check (lister_id = auth.uid());
create policy "Listers delete own items" on public.lister_items for delete using (lister_id = auth.uid());
create policy "Listers read own requests" on public.lister_requests for select using (lister_id = auth.uid() or renter_id = auth.uid());
create policy "Listers read own earnings" on public.lister_earnings for select using (lister_id = auth.uid());
create policy "Listers read own settings" on public.lister_settings for select using (lister_id = auth.uid());
create policy "Listers update own settings" on public.lister_settings for update using (lister_id = auth.uid()) with check (lister_id = auth.uid());

create or replace function public.create_lister_request(p_item_id uuid, p_start_date date, p_end_date date, p_message text default '')
returns public.lister_requests language plpgsql security definer set search_path = public as $$
declare v_item public.lister_items; v_request public.lister_requests; v_user public.profiles;
begin
  select * into v_user from public.profiles where id = auth.uid() and role = 'student'::public.user_role;
  if v_user.id is null then raise exception 'You must be signed in as a student to request an item'; end if;
  select * into v_item from public.lister_items where id = p_item_id and availability = 'available' for update;
  if v_item.id is null then raise exception 'This item is no longer listed'; end if;
  if p_end_date < p_start_date then raise exception 'End date must be on or after start date'; end if;
  insert into public.lister_requests (lister_id, item_id, renter_id, renter_name, renter_email, start_date, end_date, amount, message)
  values (v_item.lister_id, v_item.id, auth.uid(), v_user.full_name, coalesce((select email from auth.users where id = auth.uid()), ''), p_start_date, p_end_date, v_item.price_per_day * ((p_end_date - p_start_date) + 1), coalesce(p_message, '')) returning * into v_request;
  return v_request;
end;
$$;

create or replace function public.respond_to_lister_request(p_request_id uuid, p_decision text)
returns public.lister_requests language plpgsql security definer set search_path = public as $$
declare v_request public.lister_requests; v_item public.lister_items;
begin
  if p_decision not in ('accepted', 'declined') then raise exception 'Invalid request decision'; end if;
  select * into v_request from public.lister_requests where id = p_request_id and lister_id = auth.uid() for update;
  if v_request.id is null then raise exception 'Request not found'; end if;
  if v_request.status <> 'pending' then raise exception 'This request was already handled'; end if;
  perform set_config('keylo.lister_request_workflow', 'true', true);
  update public.lister_requests set status = p_decision, responded_at = now() where id = p_request_id returning * into v_request;
  if p_decision = 'accepted' then
    update public.lister_items set times_rented = times_rented + 1, status = 'rented', availability = 'unavailable', updated_at = now() where id = v_request.item_id returning * into v_item;
    insert into public.lister_earnings (lister_id, request_id, item_id, item_name, amount, label) values (v_request.lister_id, v_request.id, v_request.item_id, v_item.name, v_request.amount, 'Rental payout · ' || v_request.renter_name);
  end if;
  return v_request;
end;
$$;

create or replace function public.delete_lister_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'lister'::public.user_role) then
    raise exception 'Lister account not found';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.create_lister_request(uuid, date, date, text) from public;
revoke all on function public.respond_to_lister_request(uuid, text) from public;
revoke all on function public.delete_lister_account() from public;
grant execute on function public.create_lister_request(uuid, date, date, text) to authenticated;
grant execute on function public.respond_to_lister_request(uuid, text) to authenticated;
grant execute on function public.delete_lister_account() to authenticated;
