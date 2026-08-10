-- ============================================================================
-- KeyLo Landlord Property Features & Demo Account Migration
--
-- Adds support for:
--   - Full location data (address, latitude, longitude)
--   - Image galleries (images text[])
--   - Extra paid services / add-ons (extra_services jsonb)
--   - Paused listing status (already in listing_status enum)
--   - Updated get_owner_workspace() function returning all property details
--   - Provisioning landlord.ui.demo@keylo.in and assigning properties
-- ============================================================================

-- 1. Alter public.properties table to add missing location, image, and service columns
alter table public.properties
  add column if not exists address text,
  add column if not exists latitude numeric(9,6),
  add column if not exists longitude numeric(9,6),
  add column if not exists images text[] not null default '{}',
  add column if not exists extra_services jsonb not null default '[]'::jsonb;

-- 2. Provision landlord.ui.demo@keylo.in in auth.users and public.profiles if not present
do $$
declare
  v_user_id uuid;
  v_encrypted_pw text;
begin
  select id into v_user_id from auth.users where email = 'landlord.ui.demo@keylo.in';

  if v_user_id is null then
    v_user_id := gen_random_uuid();
    v_encrypted_pw := crypt('KeyLoLandlord2026!', gen_salt('bf'));

    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'landlord.ui.demo@keylo.in',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Landlord UI"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now()
    );
  end if;

  insert into public.profiles (id, full_name, role, is_verified)
  values (v_user_id, 'Demo Landlord UI', 'landlord', true)
  on conflict (id) do update set role = 'landlord', is_verified = true;

  -- Assign any properties without owner to landlord.ui.demo@keylo.in
  update public.properties
     set owner_id = v_user_id
   where owner_id is null;

  raise notice 'Landlord demo account landlord.ui.demo@keylo.in ready with id %', v_user_id;
end $$;

-- 3. Replace public.get_owner_workspace() to include all expanded property fields
create or replace function public.get_owner_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'You must be signed in'; end if;
  if not exists (select 1 from public.profiles where id = v_user_id and role = 'landlord') then
    raise exception 'Landlord access required';
  end if;

  return jsonb_build_object(
    'properties', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select p.id, p.owner_id, p.university_id, p.name, p.property_type, p.area, p.city,
             p.address, p.latitude, p.longitude, p.description, p.monthly_rent,
             p.security_deposit, p.distance_to_university_km, p.status, p.trust_score,
             p.is_ai_inspected, p.is_documents_verified, p.cover_image_url,
             p.images, p.amenities, p.extra_services, p.created_at, p.updated_at,
             u.name as university
      from public.properties p left join public.universities u on u.id=p.university_id
      where p.owner_id=v_user_id
    ) x),'[]'::jsonb),
    'bookings', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select b.id,b.status,b.move_in_date,b.move_out_date,b.rent_amount,
             b.deposit_amount,b.tenant_first_booking_fee,b.total_due,b.created_at,
             b.updated_at,s.id as tenant_id,s.full_name as tenant_name,
             su.email as tenant_email,p.name as property_name,p.area as property_area,
             d.status as deposit_status,d.amount as deposit_amount_held
      from public.bookings b
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id
      join auth.users su on su.id=s.id
      left join public.deposits d on d.booking_id=b.id
    ) x),'[]'::jsonb),
    'tenants', coalesce((select jsonb_agg(to_jsonb(x) order by x.last_booking_at desc) from (
      select s.id,s.full_name,s.phone,su.email,
             count(b.id)::integer as booking_count,
             max(b.created_at) as last_booking_at,
             count(*) filter (where b.status in ('confirmed','active'))::integer as active_bookings
      from public.bookings b
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id
      join auth.users su on su.id=s.id
      group by s.id,s.full_name,s.phone,su.email
    ) x),'[]'::jsonb),
    'deposits', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select d.id,d.booking_id,d.amount,d.status,d.held_at,d.release_requested_at,
             d.released_at,d.dispute_reason,d.created_at,b.status as booking_status,
             s.full_name as tenant_name,su.email as tenant_email,p.name as property_name
      from public.deposits d join public.bookings b on b.id=d.booking_id
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id join auth.users su on su.id=s.id
    ) x),'[]'::jsonb),
    'messages', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select m.id,m.booking_id,m.body,m.read_at,m.created_at,
             s.full_name as sender_name,su.email as sender_email,p.name as property_name
      from public.messages m join public.bookings b on b.id=m.booking_id
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=m.sender_id join auth.users su on su.id=s.id
      where m.recipient_id=v_user_id or m.sender_id=v_user_id
    ) x),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_owner_workspace() from public;
grant execute on function public.get_owner_workspace() to authenticated;
