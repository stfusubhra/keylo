-- Insert London demo properties using the known demo landlord UUID.
-- Previous attempt (20260813113852) used a DO block that may have failed
-- silently if the auth user lookup didn't match.

INSERT INTO public.properties (
  owner_id, university_id, name, property_type, area, city,
  monthly_rent, security_deposit, distance_to_university_km,
  status, trust_score, is_ai_inspected, is_documents_verified,
  cover_image_url, amenities, virtual_tour_url, room_measurements
)
SELECT
  '978894b3-0590-46da-b4d9-7eac222e6d62'::uuid,
  u.id,
  v.name,
  v.property_type::public.property_type,
  v.area,
  'London',
  v.monthly_rent,
  v.security_deposit,
  v.distance_to_university_km,
  'published'::public.listing_status,
  v.trust_score,
  true,
  true,
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
    2200.00, 3000.00, 0.50, 94,
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
    2800.00, 4000.00, 0.30, 92,
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
    2500.00, 3500.00, 0.40, 96,
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Meals included', 'Housekeeping', '24/7 Security'],
    'https://pannol.com/360/london-strand/',
    '{"living_room": {"length_m": 5.5, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}}'
  )
) AS v(university_name, name, property_type, area, monthly_rent, security_deposit, distance_to_university_km, trust_score, cover_image_url, amenities, virtual_tour_url, room_measurements)
JOIN public.universities u ON u.name = v.university_name
WHERE NOT EXISTS (SELECT 1 FROM public.properties p WHERE p.name = v.name);