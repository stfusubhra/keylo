-- ============================================================================
-- KeyLo deposit-dispute demo fixture (repeatable, safe to re-run).
--
-- Seeding an open deposit dispute is deliberately left to the UI walkthrough
-- so the demo exercises the real student -> landlord -> admin flow. This file
-- creates the static demo state (property, room, confirmed booking, paid
-- deposit) and leaves the dispute itself for the student form to open.
--
-- Before running:
--   1. Apply the migrations in order: 20260809000000 .. 20260809006000.
--   2. Create the two demo users in Supabase Auth
--      (Dashboard > Authentication > Users > Add user):
--        student.demo@keylo.in   (role: student)
--        landlord.demo@keylo.in  (role: landlord)
--      Passwords live in the team vault / project secrets -- never in git.
--
-- After running, walk the flow:
--   student  /dashboard/disputes  -> open a dispute (form)
--   landlord /owner/claims        -> respond (status becomes admin_review)
--   admin    /admin/disputes      -> resolve (refund releases deposit;
--                                     partial refunds drop trust_score by 5)
--
-- Note: all plpgsql variables use a v_ prefix so they never collide with
-- column names inside SQL statements (ambiguous references previously raised
-- 55P02 or, worse, silently self-compared).
-- ============================================================================

do $$
declare
  -- Demo identities (non-secret; passwords are never stored here).
  v_student_email  text := 'student.demo@keylo.in';
  v_landlord_email text := 'landlord.demo@keylo.in';

  -- Deterministic fixture ids so re-runs are no-ops.
  v_prop_id     uuid := '59aac4bc-2b47-49c1-a88f-20aec062513b';
  v_room_id     uuid := '7f3a9b21-2b47-49c1-a88f-20aec062513b';
  v_booking_id  uuid := 'd56a45ee-8102-4fd9-aa09-eeaf76a25f69';

  v_student_id  uuid;
  v_landlord_id uuid;
  v_univ_id     uuid;
  v_prop_inserted integer;
  v_booking_inserted integer;
begin
  select id into v_landlord_id from auth.users where email = v_landlord_email;
  if v_landlord_id is null then
    raise exception 'Demo landlord "%" not found. Create it in Auth > Users first.', v_landlord_email;
  end if;
  select id into v_student_id from auth.users where email = v_student_email;
  if v_student_id is null then
    raise exception 'Demo student "%" not found. Create it in Auth > Users first.', v_student_email;
  end if;

  -- Profiles (created by the auth trigger) -- just pin roles + verification.
  insert into public.profiles (id, full_name, role, is_verified)
  values (v_student_id, 'Demo Student', 'student', true)
  on conflict (id) do update set role = 'student', is_verified = true;

  insert into public.profiles (id, full_name, role, is_verified)
  values (v_landlord_id, 'Demo Landlord', 'landlord', true)
  on conflict (id) do update set role = 'landlord', is_verified = true;

  select id into v_univ_id from public.universities where name = 'Jadavpur University';
  if v_univ_id is null then
    raise exception 'Jadavpur University is missing. Apply the foundation migration first.';
  end if;

  -- Property: published, documents verified, AI inspected (full trust score).
  insert into public.properties (
    id, owner_id, university_id, name, property_type, area, city, description,
    monthly_rent, security_deposit, distance_to_university_km, status,
    is_ai_inspected, is_documents_verified, amenities
  ) values (
    v_prop_id, v_landlord_id, v_univ_id, 'KeyLo Dispute Demo Home', 'flat', 'Jadavpur', 'Kolkata',
    'Fixture property for the deposit-dispute demo: verified documents, passed AI inspection, full trust score.',
    9000, 12000, 1.2, 'published',
    true, true, array['WiFi', 'Furnished', 'Water heater']
  ) on conflict (id) do nothing;
  get diagnostics v_prop_inserted = row_count;

  insert into public.rooms (id, property_id, name, monthly_rent, capacity, available)
  values (v_room_id, v_prop_id, 'Dispute Demo Room', 9000, 1, true)
  on conflict (id) do nothing;

  -- Confirmed booking with a protected deposit. The validate_booking_request
  -- trigger checks: published Kolkata listing, price match, available room.
  insert into public.bookings (
    id, student_id, property_id, room_id, status,
    move_in_date, move_out_date, rent_amount, deposit_amount
  ) values (
    v_booking_id, v_student_id, v_prop_id, v_room_id, 'confirmed',
    current_date + 7, current_date + 180, 9000, 12000
  ) on conflict (id) do nothing;
  get diagnostics v_booking_inserted = row_count;

  -- Test-mode payments (one per type; no-op when already present).
  insert into public.payments (booking_id, payer_id, amount, payment_type, provider, provider_reference, status, paid_at)
  select v_booking_id, v_student_id, 9000, 'rent', 'test_mode', 'TEST-' || v_booking_id || '-RENT', 'paid', now()
  where not exists (
    select 1 from public.payments p where p.booking_id = v_booking_id and p.payment_type = 'rent'
  );

  insert into public.payments (booking_id, payer_id, amount, payment_type, provider, provider_reference, status, paid_at)
  select v_booking_id, v_student_id, 12000, 'deposit', 'test_mode', 'TEST-' || v_booking_id || '-DEPOSIT', 'paid', now()
  where not exists (
    select 1 from public.payments p where p.booking_id = v_booking_id and p.payment_type = 'deposit'
  );

  insert into public.payments (booking_id, payer_id, amount, payment_type, provider, provider_reference, status, paid_at)
  select v_booking_id, v_student_id, 997, 'tenant_first_booking_fee', 'test_mode', 'TEST-' || v_booking_id || '-FEE', 'paid', now()
  where not exists (
    select 1 from public.payments p where p.booking_id = v_booking_id and p.payment_type = 'tenant_first_booking_fee'
  );

  insert into public.deposits (booking_id, amount, status, held_at)
  values (v_booking_id, 12000, 'held', now())
  on conflict (booking_id) do nothing;

  -- Recalculate trust only when the property was freshly created, so re-runs
  -- never clobber a trust score already reduced by a partial-refund ruling.
  if v_prop_inserted > 0 then
    perform public.refresh_property_trust_score(v_prop_id);
  end if;

  raise notice 'Fixture ready: property % (inserted=%), booking % (inserted=%). Now open the dispute from the student dashboard.', v_prop_id, v_prop_inserted, v_booking_id, v_booking_inserted;
end $$;

-- ============================================================================
-- Verify the fixture (run separately in the SQL editor):
--
-- select
--   b.id as booking_id,
--   b.status as booking_status,
--   (select count(*) from public.payments p where p.booking_id = b.id) as payment_count,
--   d.status as deposit_status,
--   ds.status as dispute_status,
--   ds.ai_recommendation,
--   ds.ai_confidence,
--   ds.recommended_refund,
--   ds.final_refund,
--   pr.trust_score,
--   pr.trust_score_breakdown->>'calculated_at' as trust_calculated_at
-- from public.bookings b
-- left join public.deposits d on d.booking_id = b.id
-- left join public.disputes ds on ds.booking_id = b.id
-- join public.properties pr on pr.id = b.property_id
-- where b.id = 'd56a45ee-8102-4fd9-aa09-eeaf76a25f69';
--
-- Expected after the full walkthrough: booking confirmed, 3 payments,
-- deposit released (refund) or held (denied), dispute resolved/denied with a
-- final_refund, and trust_score exactly 5 below the calculated breakdown sum
-- when the admin ordered a partial refund.
-- ============================================================================
