BEGIN;

-- Add London universities
INSERT INTO public.universities (name, area, city, latitude, longitude)
VALUES
  ('University of London', 'Bloomsbury', 'London', 51.5246, -0.1340),
  ('Imperial College London', 'South Kensington', 'London', 51.4984, -0.1772),
  ('King''s College London', 'Strand', 'London', 51.5120, -0.1139)
ON CONFLICT (name) DO NOTHING;

-- Add London properties with virtual tours and 3D measurements
-- Uses the admin profile as owner (e8b652f2-2aa0-44a0-a7c1-774e706c7870)
INSERT INTO public.properties (
  owner_id,
  university_id,
  name,
  property_type,
  area,
  city,
  monthly_rent,
  security_deposit,
  distance_to_university_km,
  status,
  trust_score,
  is_ai_inspected,
  is_documents_verified,
  cover_image_url,
  amenities,
  virtual_tour_url,
  room_measurements
)
SELECT
  'e8b652f2-2aa0-44a0-a7c1-774e706c7870'::uuid,
  u.id,
  v.name,
  v.property_type::public.property_type,
  v.area,
  v.city,
  v.monthly_rent,
  v.security_deposit,
  v.distance_to_university_km,
  'published'::public.listing_status,
  v.trust_score,
  v.is_ai_inspected,
  v.is_documents_verified,
  v.cover_image_url,
  v.amenities,
  v.virtual_tour_url,
  v.room_measurements::jsonb
FROM (VALUES
  (
    'University of London',
    'Bloomsbury Student Hub',
    'pg',
    'Bloomsbury',
    'London',
    2200.00,
    3000.00,
    0.50,
    94,
    true,
    true,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Study area', '24/7 Security', 'Laundry'],
    'https://pannol.com/360/london-bloomsbury/',
    '{"living_room": {"length_m": 5.0, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.0, "width_m": 2.5, "height_m": 2.5}}'
  ),
  (
    'Imperial College London',
    'South Kensington Modern Flat',
    'flat',
    'South Kensington',
    'London',
    2800.00,
    4000.00,
    0.30,
    92,
    true,
    true,
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85',
    ARRAY['2 bedrooms', 'Furnished', 'Gym access', 'Wi-Fi'],
    'https://pannol.com/360/london-southkensington/',
    '{"living_room": {"length_m": 6.0, "width_m": 4.5, "height_m": 2.5}, "master_bedroom": {"length_m": 4.0, "width_m": 3.5, "height_m": 2.5}, "second_bedroom": {"length_m": 3.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}}'
  ),
  (
    'King''s College London',
    'Strand Deluxe PG',
    'pg',
    'Strand',
    'London',
    2500.00,
    3500.00,
    0.40,
    96,
    true,
    true,
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Meals included', 'Housekeeping', '24/7 Security'],
    'https://pannol.com/360/london-strand/',
    '{"living_room": {"length_m": 5.5, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}}'
  )
) AS v(university_name, name, property_type, area, city, monthly_rent, security_deposit, distance_to_university_km, trust_score, is_ai_inspected, is_documents_verified, cover_image_url, amenities, virtual_tour_url, room_measurements)
JOIN public.universities u ON u.name = v.university_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p WHERE p.name = v.name
);

COMMIT;