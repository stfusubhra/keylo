-- Complete the hackathon booking flow atomically in test mode.
-- A browser can request this function, but it cannot change prices, create
-- duplicate payments, or mark another student's booking as paid.

create or replace function public.complete_test_booking(p_booking_id uuid, p_method text default 'upi')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_row public.bookings%rowtype;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to complete a booking';
  end if;

  if p_method not in ('upi', 'card') then
    raise exception 'Unsupported test payment method';
  end if;

  select * into booking_row
  from public.bookings
  where id = p_booking_id
  for update;

  if booking_row.id is null or booking_row.student_id <> auth.uid() then
    raise exception 'Booking not found';
  end if;

  if booking_row.status = 'confirmed' then
    return jsonb_build_object('status', 'paid', 'provider', 'test_mode', 'method', p_method, 'booking_id', booking_row.id);
  end if;

  if booking_row.status <> 'pending' then
    raise exception 'Only pending bookings can be paid';
  end if;

  insert into public.payments (booking_id, payer_id, amount, payment_type, provider, provider_reference, status, paid_at)
  values
    (booking_row.id, booking_row.student_id, booking_row.rent_amount, 'rent', 'test_mode', 'TEST-' || booking_row.id || '-RENT', 'paid', now()),
    (booking_row.id, booking_row.student_id, booking_row.deposit_amount, 'deposit', 'test_mode', 'TEST-' || booking_row.id || '-DEPOSIT', 'paid', now()),
    (booking_row.id, booking_row.student_id, booking_row.tenant_first_booking_fee, 'tenant_first_booking_fee', 'test_mode', 'TEST-' || booking_row.id || '-FEE-' || upper(p_method), 'paid', now());

  insert into public.deposits (booking_id, amount, status, held_at)
  values (booking_row.id, booking_row.deposit_amount, 'held', now());

  update public.bookings
  set status = 'confirmed', updated_at = now()
  where id = booking_row.id;

  return jsonb_build_object('status', 'paid', 'provider', 'test_mode', 'method', p_method, 'booking_id', booking_row.id);
end;
$$;

grant execute on function public.complete_test_booking(uuid, text) to authenticated;

drop policy if exists "Students cancel own pending bookings" on public.bookings;
create policy "Students cancel own pending bookings" on public.bookings
for update using (student_id = auth.uid() and status = 'pending')
with check (student_id = auth.uid() and status = 'cancelled');
