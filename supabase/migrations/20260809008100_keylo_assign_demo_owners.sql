-- ============================================================================
-- KeyLo: assign the demo landlord to the ownerless demo catalog properties.
--
-- The demo catalog (migration 20260809001000) seeded 8 properties without an
-- owner (owner_id had NOT NULL dropped). That left two user-facing gaps:
--   1. Tenant -> landlord messaging could not be sent for those bookings
--      (sendMessage requires recipient_id = the landlord's profile id).
--   2. The landlord workspace (/owner) showed no listings for the demo owner.
--
-- The dispute fixture (20260809007000) already established
-- landlord.demo@keylo.in as the demo landlord, so this migration points the
-- ownerless catalog properties at that same profile. Safe to re-run: it only
-- touches properties whose owner_id is still null.
-- ============================================================================

do $$
declare
  v_landlord_id uuid;
begin
  select id into v_landlord_id from auth.users where email = 'landlord.demo@keylo.in';
  if v_landlord_id is null then
    raise exception 'Demo landlord "landlord.demo@keylo.in" not found. Create it in Auth > Users first.';
  end if;

  update public.properties
     set owner_id = v_landlord_id
   where owner_id is null;

  raise notice 'Assigned demo landlord % as owner of all ownerless properties.', v_landlord_id;
end $$;
