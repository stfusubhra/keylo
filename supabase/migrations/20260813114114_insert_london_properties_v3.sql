-- Insert London demo properties with hardcoded UUIDs (no JOINs).
-- Previous attempts used a JOIN or DO block that failed silently.

INSERT INTO public.properties (
  owner_id, university_id, name, property_type, area, city,
  monthly_rent, security_deposit, distance_to_university_km,
  status, trust_score, is_ai_inspected, is_documents_verified,
  cover_image_url, amenities, virtual_tour_url, room_measurements
)
VALUES
  (
    '978894b3-0590-46da-b4d9-7eac222e6d62'::uuid,
    'a4851989-1906-4ea7-b76c-0e1590a83c79'::uuid,
    'Bloomsbury Student Hub',
    'pg'::public.property_type,
    'Bloomsbury',
    'London',
    2200.00, 3000.00, 0.50,
    'published'::public.listing_status, 94, true, true,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Study area', '24/7 Security', 'Laundry'],
    'https://pannol.com/360/london-bloomsbury/',
    '{"living_room": {"length_m": 5.0, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.0, "width_m": 2.5, "height_m": 2.5}}'::jsonb
  ),
  (
    '978894b3-0590-46da-b4d9-7eac222e6d62'::uuid,
    'f1a29119-cabe-4448-9231-4d015794b4a9'::uuid,
    'South Kensington Modern Flat',
    'flat'::public.property_type,
    'South Kensington',
    'London',
    2800.00, 4000.00, 0.30,
    'published'::public.listing_status, 92, true, true,
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85',
    ARRAY['2 bedrooms', 'Furnished', 'Gym access', 'Wi-Fi'],
    'https://pannol.com/360/london-southkensington/',
    '{"living_room": {"length_m": 6.0, "width_m": 4.5, "height_m": 2.5}, "master_bedroom": {"length_m": 4.0, "width_m": 3.5, "height_m": 2.5}, "second_bedroom": {"length_m": 3.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}}'::jsonb
  ),
  (
    '978894b3-0590-46da-b4d9-7eac222e6d62'::uuid,
    '906fa234-9717-4fff-b12e-61576e0a88aa'::uuid,
    'Strand Deluxe PG',
    'pg'::public.property_type,
    'Strand',
    'London',
    2500.00, 3500.00, 0.40,
    'published'::public.listing_status, 96, true, true,
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85',
    ARRAY['Wi-Fi', 'Meals included', 'Housekeeping', '24/7 Security'],
    'https://pannol.com/360/london-strand/',
    '{"living_room": {"length_m": 5.5, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}}'::jsonb
  )
ON CONFLICT DO NOTHING;