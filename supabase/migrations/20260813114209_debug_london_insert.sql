-- Minimal test: insert just one London property to see if it works.
INSERT INTO public.properties (
  owner_id, university_id, name, property_type, area, city,
  monthly_rent, security_deposit, distance_to_university_km, status
)
VALUES (
  '978894b3-0590-46da-b4d9-7eac222e6d62'::uuid,
  'a4851989-1906-4ea7-b76c-0e1590a83c79'::uuid,
  'Test London Property',
  'pg'::public.property_type,
  'Bloomsbury',
  'London',
  2200.00, 3000.00, 0.50,
  'published'::public.listing_status
);