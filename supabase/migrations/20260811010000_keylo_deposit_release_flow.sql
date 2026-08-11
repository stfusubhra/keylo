-- Deposit release request + admin approval flow.
-- Fixes three gaps found during manual vault testing on production:
--   1. deposits had no updated_at column (the app's release-request update
--      payload references it -> PGRST204 schema error).
--   2. deposits had no UPDATE policy at all (RLS silently dropped the
--      student's release request -> 'No deposit found for this booking').
--   3. no admin path to complete a booking or approve a release, so the
--      release loop could never close (deposits dead-ended at release_pending).

-- 1. deposits.updated_at (matches bookings/properties/etc.)
alter table public.deposits
  add column if not exists updated_at timestamptz not null default now();

-- 2. UPDATE policies ----------------------------------------------------------
-- Students: request release on their own deposits (held -> release_pending).
-- Restricted to the release-flow states so a student cannot invent amounts
-- or arbitrary statuses (amount tampering is additionally blocked by the
-- guard trigger below).
drop policy if exists "Students request release on own deposits" on public.deposits;
create policy "Students request release on own deposits" on public.deposits
for update using (
  exists (select 1 from public.bookings b where b.id = booking_id and b.student_id = auth.uid())
)
with check (
  exists (select 1 from public.bookings b where b.id = booking_id and b.student_id = auth.uid())
  and status in ('held', 'release_pending')
);

-- Admins: full deposit management (approve releases, correct records).
drop policy if exists "Admins manage deposits" on public.deposits;
create policy "Admins manage deposits" on public.deposits
for update using (public.is_admin());

-- 3. Guard trigger: non-admins can never change the amount or move a deposit
-- to another booking, even through a security-definer helper.
create or replace function public.guard_deposit_integrity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.booking_id is distinct from old.booking_id then
    raise exception 'Deposit booking cannot be changed';
  end if;
  if new.amount is distinct from old.amount and not public.is_admin() then
    raise exception 'Deposit amount cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_deposit_integrity on public.deposits;
create trigger trg_guard_deposit_integrity
before update on public.deposits
for each row execute function public.guard_deposit_integrity();

-- 4. Admin RPCs ------------------------------------------------------------------

-- Mark a booking completed (the vault only shows "Request Refund" for
-- completed stays). Admin-only until real move-out logic exists.
create or replace function public.complete_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_row public.bookings%rowtype;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into booking_row from public.bookings where id = p_booking_id for update;
  if booking_row.id is null then raise exception 'Booking not found'; end if;
  if booking_row.status not in ('confirmed', 'active') then
    raise exception 'Only confirmed or active bookings can be completed';
  end if;
  update public.bookings
  set status = 'completed', updated_at = now()
  where id = p_booking_id;
  return jsonb_build_object('booking_id', p_booking_id, 'status', 'completed');
end;
$$;

-- Approve a pending release request (release_pending -> released).
create or replace function public.approve_deposit_release(p_deposit_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  deposit_row public.deposits%rowtype;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into deposit_row from public.deposits where id = p_deposit_id for update;
  if deposit_row.id is null then raise exception 'Deposit not found'; end if;
  if deposit_row.status <> 'release_pending' then
    raise exception 'Only pending release requests can be approved';
  end if;
  update public.deposits
  set status = 'released', released_at = now(), updated_at = now()
  where id = p_deposit_id;
  return jsonb_build_object('deposit_id', p_deposit_id, 'status', 'released');
end;
$$;

grant execute on function public.complete_booking(uuid) to authenticated;
grant execute on function public.approve_deposit_release(uuid) to authenticated;
