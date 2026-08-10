-- Reviews and Rent Essentials bookings.
-- All money-bearing writes are performed by SECURITY DEFINER functions so the
-- browser cannot change prices or create a booking for another user.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  booking_id uuid references public.bookings(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 5 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, property_id)
);

create index if not exists reviews_property_created_idx
  on public.reviews (property_id, created_at desc);

alter table public.reviews enable row level security;

drop policy if exists "Published property reviews are public" on public.reviews;
create policy "Published property reviews are public" on public.reviews
for select using (
  exists (
    select 1 from public.properties p
    where p.id = property_id and p.status = 'published'
  )
);

drop policy if exists "Students update own reviews" on public.reviews;
create policy "Students update own reviews" on public.reviews
for update using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "Students delete own reviews" on public.reviews;
create policy "Students delete own reviews" on public.reviews
for delete using (student_id = auth.uid());

create or replace function public.submit_review(
  p_property_id uuid,
  p_rating integer,
  p_comment text
)
returns public.reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings%rowtype;
  v_review public.reviews;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to review a stay';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  if p_comment is null or char_length(trim(p_comment)) not between 5 and 2000 then
    raise exception 'Review must be between 5 and 2000 characters';
  end if;

  select b.* into v_booking
  from public.bookings b
  where b.student_id = v_user_id
    and b.property_id = p_property_id
    and b.status in ('confirmed', 'active', 'completed')
  order by b.created_at desc
  limit 1;
  if v_booking.id is null then
    raise exception 'Only students with a confirmed stay can review this property';
  end if;

  insert into public.reviews (property_id, student_id, booking_id, rating, comment)
  values (p_property_id, v_user_id, v_booking.id, p_rating, trim(p_comment))
  on conflict (student_id, property_id) do update
    set booking_id = excluded.booking_id,
        rating = excluded.rating,
        comment = excluded.comment,
        updated_at = now()
  returning * into v_review;
  return v_review;
end;
$$;

grant execute on function public.submit_review(uuid, integer, text) to authenticated;

create table if not exists public.rental_items (
  id integer primary key,
  name text not null,
  category text not null,
  category_label text not null,
  price numeric(10,2) not null check (price > 0),
  period text not null check (period in ('day', 'month')),
  active boolean not null default true
);

alter table public.rental_items enable row level security;
drop policy if exists "Active rental items are public" on public.rental_items;
create policy "Active rental items are public" on public.rental_items
for select using (active);

insert into public.rental_items (id, name, category, category_label, price, period)
values
  (1, 'Ather 450X', 'scooters', 'Electric Scooter', 150, 'day'),
  (2, 'MacBook Air M2', 'laptops', 'Laptops', 800, 'month'),
  (3, 'Ergo Study Desk', 'furniture', 'Furniture', 300, 'month'),
  (4, 'Yamaha FZ-S', 'bikes', 'Motorcycle', 200, 'day'),
  (5, 'Dell XPS 15', 'laptops', 'Laptops', 1200, 'month'),
  (6, 'Ergonomic Chair', 'furniture', 'Furniture', 250, 'month'),
  (7, 'Microwave Oven', 'appliances', 'Appliances', 180, 'month'),
  (8, 'PlayStation 5', 'gaming', 'Gaming Console', 500, 'month'),
  (9, 'Samsung 32" Monitor', 'electronics', 'Electronics', 350, 'month'),
  (10, 'Mini Fridge', 'appliances', 'Appliances', 220, 'month'),
  (11, 'Xbox Series X', 'gaming', 'Gaming Console', 450, 'month'),
  (12, 'Washing Machine', 'appliances', 'Appliances', 300, 'month'),
  (13, 'iPad Air', 'tablets', 'Tablet', 650, 'month'),
  (14, 'Epson Study Projector', 'projectors', 'Projector', 400, 'month'),
  (15, 'Single Bed Frame', 'furniture', 'Furniture', 450, 'month'),
  (16, 'Bajaj Air Cooler', 'appliances', 'Appliances', 280, 'month'),
  (17, 'Honda Activa 6G', 'scooters', 'Scooter', 180, 'day'),
  (18, 'Canon Student Camera', 'electronics', 'Electronics', 550, 'month')
on conflict (id) do update set
  name = excluded.name, category = excluded.category,
  category_label = excluded.category_label, price = excluded.price,
  period = excluded.period;

create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  item_id integer not null references public.rental_items(id) on delete restrict,
  item_name text not null,
  unit_price numeric(10,2) not null check (unit_price > 0),
  duration integer not null check (duration between 1 and 30),
  period text not null check (period in ('day', 'month')),
  start_date date not null,
  end_date date not null,
  fulfilment text not null check (fulfilment in ('pickup', 'delivery')),
  delivery_address text,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  platform_fee numeric(12,2) not null check (platform_fee >= 0),
  delivery_fee numeric(12,2) not null check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rentals_student_created_idx
  on public.rentals (student_id, created_at desc);

alter table public.rentals enable row level security;
drop policy if exists "Students read own rentals" on public.rentals;
create policy "Students read own rentals" on public.rentals
for select using (student_id = auth.uid() or public.is_admin());
drop policy if exists "Students cancel own rentals" on public.rentals;
create policy "Students cancel own rentals" on public.rentals
for update using (student_id = auth.uid() and status = 'confirmed')
with check (student_id = auth.uid() and status = 'cancelled');

create or replace function public.create_rental_booking(
  p_item_id integer,
  p_duration integer,
  p_start_date date,
  p_fulfilment text,
  p_address text default null
)
returns public.rentals
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_item public.rental_items;
  v_rental public.rentals;
  v_end_date date;
  v_subtotal numeric(12,2);
  v_platform_fee numeric(12,2);
  v_delivery_fee numeric(12,2);
begin
  if v_user_id is null then raise exception 'You must be signed in to book a rental'; end if;
  select * into v_item from public.rental_items where id = p_item_id and active;
  if v_item.id is null then raise exception 'Rental item not found'; end if;
  if p_duration is null or p_duration < 1 or p_duration > (case when v_item.period = 'day' then 30 else 12 end) then
    raise exception 'Invalid rental duration';
  end if;
  if p_start_date is null or p_start_date < current_date then raise exception 'Choose a valid future start date'; end if;
  if p_fulfilment not in ('pickup', 'delivery') then raise exception 'Unsupported fulfilment option'; end if;
  if p_fulfilment = 'delivery' and char_length(trim(coalesce(p_address, ''))) < 5 then
    raise exception 'A delivery address is required';
  end if;

  v_end_date := case when v_item.period = 'day'
    then p_start_date + p_duration
    else (p_start_date + make_interval(months => p_duration))::date end;
  v_subtotal := v_item.price * p_duration;
  v_platform_fee := round(v_subtotal * 0.05, 2);
  v_delivery_fee := case when p_fulfilment = 'delivery' then 99 else 0 end;

  insert into public.rentals (
    student_id, item_id, item_name, unit_price, duration, period,
    start_date, end_date, fulfilment, delivery_address,
    subtotal, platform_fee, delivery_fee, total
  ) values (
    v_user_id, v_item.id, v_item.name, v_item.price, p_duration, v_item.period,
    p_start_date, v_end_date, p_fulfilment,
    case when p_fulfilment = 'delivery' then trim(p_address) else null end,
    v_subtotal, v_platform_fee, v_delivery_fee,
    v_subtotal + v_platform_fee + v_delivery_fee
  ) returning * into v_rental;
  return v_rental;
end;
$$;

grant execute on function public.create_rental_booking(integer, integer, date, text, text) to authenticated;

-- Seed only a review backed by the deterministic dispute fixture, and only if
-- the demo account exists. This keeps a fresh install valid before accounts
-- are created and makes re-running the migration harmless.
do $$
declare
  v_student uuid;
  v_booking uuid;
  v_property uuid := '59aac4bc-2b47-49c1-a88f-20aec062513b';
begin
  select id into v_student from auth.users where email = 'student.demo@keylo.in';
  select id into v_booking from public.bookings
    where id = 'd56a45ee-8102-4fd9-aa09-eeaf76a25f69'
      and student_id = v_student and property_id = v_property
      and status in ('confirmed', 'active', 'completed');
  if v_student is not null and v_booking is not null then
    insert into public.reviews (property_id, student_id, booking_id, rating, comment)
    values (v_property, v_student, v_booking, 5, 'Clear deposit rules and a smooth move-in process.')
    on conflict (student_id, property_id) do nothing;
  end if;
end;
$$;
