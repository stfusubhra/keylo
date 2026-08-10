-- Wishlist support for Rent Essentials items.

create table if not exists public.saved_rentals (
  student_id uuid not null references public.profiles(id) on delete cascade,
  item_id integer not null references public.rental_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, item_id)
);

create index if not exists saved_rentals_student_created_idx
  on public.saved_rentals (student_id, created_at desc);

alter table public.saved_rentals enable row level security;

drop policy if exists "Students manage own saved rentals" on public.saved_rentals;
create policy "Students manage own saved rentals" on public.saved_rentals
for all using (student_id = auth.uid()) with check (student_id = auth.uid());
