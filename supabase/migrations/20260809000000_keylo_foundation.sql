-- KeyLo backend foundation: Kolkata student rentals, protected deposits,
-- digital handover, and the landlord success-fee revenue model.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'landlord', 'admin');
create type public.property_type as enum ('pg', 'flat');
create type public.listing_status as enum ('draft', 'published', 'paused', 'archived');
create type public.booking_status as enum ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.deposit_status as enum ('held', 'release_pending', 'released', 'disputed');
create type public.inspection_status as enum ('pending', 'passed', 'flagged', 'reviewed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  phone text,
  avatar_url text,
  owner_rating numeric(2,1) check (owner_rating between 0 and 5),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text not null default 'Kolkata',
  area text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  university_id uuid not null references public.universities(id) on delete restrict,
  name text not null,
  property_type public.property_type not null,
  area text not null,
  city text not null default 'Kolkata',
  description text,
  monthly_rent numeric(12,2) not null check (monthly_rent > 0),
  security_deposit numeric(12,2) not null check (security_deposit >= 0),
  distance_to_university_km numeric(5,2) not null check (distance_to_university_km >= 0),
  status public.listing_status not null default 'draft',
  trust_score integer check (trust_score between 0 and 100),
  is_ai_inspected boolean not null default false,
  is_documents_verified boolean not null default false,
  cover_image_url text,
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  monthly_rent numeric(12,2) not null check (monthly_rent > 0),
  capacity integer not null default 1 check (capacity > 0),
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  property_id uuid not null references public.properties(id) on delete restrict,
  room_id uuid references public.rooms(id) on delete restrict,
  status public.booking_status not null default 'pending',
  move_in_date date not null,
  move_out_date date,
  rent_amount numeric(12,2) not null check (rent_amount > 0),
  deposit_amount numeric(12,2) not null check (deposit_amount >= 0),
  tenant_first_booking_fee numeric(12,2) not null default 997 check (tenant_first_booking_fee >= 0),
  landlord_commission_rate numeric(5,2) not null default 5.00 check (landlord_commission_rate >= 0 and landlord_commission_rate <= 100),
  landlord_commission_amount numeric(12,2) generated always as (rent_amount * landlord_commission_rate / 100) stored,
  total_due numeric(12,2) generated always as (rent_amount + deposit_amount + tenant_first_booking_fee) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  payer_id uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  payment_type text not null check (payment_type in ('rent', 'deposit', 'tenant_first_booking_fee', 'landlord_commission')),
  provider text,
  provider_reference text,
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  status public.deposit_status not null default 'held',
  held_at timestamptz,
  release_requested_at timestamptz,
  released_at timestamptz,
  dispute_reason text,
  created_at timestamptz not null default now()
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  inspector_id uuid references public.profiles(id) on delete set null,
  status public.inspection_status not null default 'pending',
  trust_score integer check (trust_score between 0 and 100),
  findings jsonb not null default '[]'::jsonb,
  evidence_urls text[] not null default '{}',
  inspected_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.handover_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  condition_notes text,
  meter_readings jsonb not null default '{}'::jsonb,
  checklist jsonb not null default '{"room_condition": false, "meter_readings": false, "agreement_signed": false}'::jsonb,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  recipient_id uuid not null references public.profiles(id) on delete restrict,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.saved_properties (
  student_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, property_id)
);

insert into public.universities (name, area) values
  ('Adamas University', 'Barasat'),
  ('Jadavpur University', 'Jadavpur'),
  ('University of Calcutta', 'College Street'),
  ('St. Xavier''s University Kolkata', 'New Town')
on conflict (name) do nothing;

create index properties_university_distance_idx on public.properties (university_id, distance_to_university_km);
create index bookings_student_status_idx on public.bookings (student_id, status);
create index messages_recipient_created_idx on public.messages (recipient_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'KeyLo user'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.properties enable row level security;
alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.deposits enable row level security;
alter table public.inspections enable row level security;
alter table public.handover_records enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.messages enable row level security;
alter table public.saved_properties enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Published Kolkata listings are public" on public.properties for select using (status = 'published' and city = 'Kolkata');
create policy "Published listing rooms are public" on public.rooms for select using (exists (select 1 from public.properties p where p.id = property_id and p.status = 'published'));
create policy "Universities are public" on public.universities for select using (true);
create policy "Users can read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid());
create policy "Landlords manage own properties" on public.properties for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "Students manage own saved properties" on public.saved_properties for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "Students read own bookings" on public.bookings for select using (student_id = auth.uid() or public.is_admin() or exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "Students create own bookings" on public.bookings for insert with check (student_id = auth.uid());
create policy "Booking parties manage deposits" on public.deposits for select using (exists (select 1 from public.bookings b where b.id = booking_id and (b.student_id = auth.uid() or exists (select 1 from public.properties p where p.id = b.property_id and p.owner_id = auth.uid()))) or public.is_admin());
create policy "Booking parties read inspections" on public.inspections for select using (true);
create policy "Booking students manage handover" on public.handover_records for all using (student_id = auth.uid() or public.is_admin()) with check (student_id = auth.uid() or public.is_admin());
create policy "Booking students manage maintenance" on public.maintenance_requests for all using (student_id = auth.uid() or public.is_admin()) with check (student_id = auth.uid() or public.is_admin());
create policy "Conversation participants read messages" on public.messages for select using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());
create policy "Users send messages as themselves" on public.messages for insert with check (sender_id = auth.uid());
