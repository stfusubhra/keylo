-- Demo inventory for the public hackathon experience.
-- These records intentionally have no owner until a landlord account is linked.
alter table public.properties alter column owner_id drop not null;

insert into public.properties (university_id, name, property_type, area, monthly_rent, security_deposit, distance_to_university_km, status, trust_score, is_ai_inspected, is_documents_verified, cover_image_url, amenities)
select u.id, v.name, v.property_type::public.property_type, v.area, v.monthly_rent, v.security_deposit, v.distance_km, 'published', v.trust_score, v.ai_inspected, true, v.cover_image_url, v.amenities
from (values
  ('Adamas University', 'Adamas Green PG', 'pg', 'Barasat', 8500, 10000, 0.8, 92, true, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85', array['Wi-Fi', 'Meals available', '24/7 Security']),
  ('Adamas University', 'North Kolkata Student Flat', 'flat', 'Madhyamgram', 14000, 20000, 1.4, 88, true, 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85', array['2 bedrooms', 'Study-ready', 'Gated community']),
  ('Jadavpur University', 'Lake View Student PG', 'pg', 'Jadavpur', 9500, 12000, 0.6, 96, true, 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85', array['High-speed Wi-Fi', 'Laundry', 'Power backup']),
  ('Jadavpur University', 'South Kolkata 2BHK Flat', 'flat', 'Gariahat', 18000, 25000, 1.1, 90, true, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', array['2 bedrooms', 'Furnished', 'Metro nearby']),
  ('University of Calcutta', 'College Street Co-Living', 'pg', 'Ballygunge', 7800, 8000, 1.3, 91, true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85', array['Wi-Fi', 'Housekeeping', 'Common kitchen']),
  ('University of Calcutta', 'Central Kolkata Student Flat', 'flat', 'Bhowanipore', 16500, 22000, 1.8, 87, false, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85', array['1 bedroom', 'Fully furnished', 'Bus access']),
  ('St. Xavier''s University Kolkata', 'New Town Scholars PG', 'pg', 'New Town', 10500, 12000, 0.9, 94, true, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=85', array['Wi-Fi', 'Gym', '24/7 Security']),
  ('St. Xavier''s University Kolkata', 'Rajarhat Campus Flat', 'flat', 'Rajarhat', 19500, 28000, 1.6, 89, true, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85', array['2 bedrooms', 'Balcony', 'Parking'])
) as v(university_name, name, property_type, area, monthly_rent, security_deposit, distance_km, trust_score, ai_inspected, cover_image_url, amenities)
join public.universities u on u.name = v.university_name
where not exists (select 1 from public.properties p where p.name = v.name);
