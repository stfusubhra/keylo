BEGIN;

-- Add London universities
INSERT INTO public.universities (name, area, city, latitude, longitude)
VALUES
  ('University of London', 'Bloomsbury', 'London', 51.5246, -0.1340),
  ('Imperial College London', 'South Kensington', 'London', 51.4984, -0.1772),
  ('King''s College London', 'Strand', 'London', 51.5120, -0.1139)
ON CONFLICT (name) DO NOTHING;

-- Add London properties with virtual tours and 3D measurements.
-- Uses the demo landlord (landlord.demo@keylo.in) as owner, same as
-- the existing Kolkata demo properties (see 20260809008100).
do $$
declare
  v_owner_id uuid;
  v_uni_london uuid;
  v_uni_imperial uuid;
  v_uni_kings uuid;
begin
  select id into v_owner_id from auth.users where email = 'landlord.demo@keylo.in';
  if v_owner_id is null then
    raise exception 'Demo landlord "landlord.demo@keylo.in" not found. Create it in Auth > Users first.';
  end if;

  select id into v_uni_london from public.universities where name = 'University of London';
  select id into v_uni_imperial from public.universities where name = 'Imperial College London';
  select id into v_uni_kings from public.universities where name = 'King''s College London';

  -- Bloomsbury Student Hub
  INSERT INTO public.properties (
    owner_id, university_id, name, property_type, area, city,
    monthly_rent, security_deposit, distance_to_university_km,
    status, trust_score, is_ai_inspected, is_documents_verified,
    cover_image_url, amenities, virtual_tour_url, room_measurements
  )
  SELECT v_owner_id, v_uni_london, 'Bloomsbury Student Hub', 'pg'::public.property_type, 'Bloomsbury', 'London',
    2200.00, 3000.00, 0.50,
    'published'::public.listing_status, 94, true, true,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Study area', '24/7 Security', 'Laundry'],
    'https://pannol.com/360/london-bloomsbury/',
    '{"living_room": {"length_m": 5.0, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.0, "width_m": 2.5, "height_m": 2.5}}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.name = 'Bloomsbury Student Hub');

  -- South Kensington Modern Flat
  INSERT INTO public.properties (
    owner_id, university_id, name, property_type, area, city,
    monthly_rent, security_deposit, distance_to_university_km,
    status, trust_score, is_ai_inspected, is_documents_verified,
    cover_image_url, amenities, virtual_tour_url, room_measurements
  )
  SELECT v_owner_id, v_uni_imperial, 'South Kensington Modern Flat', 'flat'::public.property_type, 'South Kensington', 'London',
    2800.00, 4000.00, 0.30,
    'published'::public.listing_status, 92, true, true,
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85',
    ARRAY['2 bedrooms', 'Furnished', 'Gym access', 'Wi-Fi'],
    'https://pannol.com/360/london-southkensington/',
    '{"living_room": {"length_m": 6.0, "width_m": 4.5, "height_m": 2.5}, "master_bedroom": {"length_m": 4.0, "width_m": 3.5, "height_m": 2.5}, "second_bedroom": {"length_m": 3.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.name = 'South Kensington Modern Flat');

  -- Strand Deluxe PG
  INSERT INTO public.properties (
    owner_id, university_id, name, property_type, area, city,
    monthly_rent, security_deposit, distance_to_university_km,
    status, trust_score, is_ai_inspected, is_documents_verified,
    cover_image_url, amenities, virtual_tour_url, room_measurements
  )
  SELECT v_owner_id, v_uni_kings, 'Strand Deluxe PG', 'pg'::public.property_type, 'Strand', 'London',
    2500.00, 3500.00, 0.40,
    'published'::public.listing_status, 96, true, true,
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Meals included', 'Housekeeping', '24/7 Security'],
    'https://pannol.com/360/london-strand/',
    '{"living_room": {"length_m": 5.5, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.name = 'Strand Deluxe PG');

  raise notice 'Inserted London demo properties with owner %', v_owner_id;
end $$;

COMMIT;