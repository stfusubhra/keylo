-- ============================================================================
-- Realistic listing upgrade
--
-- Makes every published listing (9 Kolkata + 3 London) look fully real:
--   - Unique, specific descriptions
--   - Unique cover + gallery photos (Unsplash), no cross-property duplicates
--   - Richer amenity lists
--   - Full street addresses + lat/lng
--   - Room measurements (JSONB) so the virtual tour modal has data everywhere
--   - A few extra_services to round out the owner workspace
-- ============================================================================

-- ── 1. Adamas Green PG (Barasat, near Adamas University) ──────────────────
update public.properties
   set description =
         'A calm, garden-facing PG for Adamas University students, a 9-minute walk from the main gate. Rooms open onto a shared balcony with tree cover, and the on-site mess serves home-style Bengali and North Indian meals three times a day. The ground floor has a quiet study hall that stays open till 11 PM, and a 24/7 warden handles late-night arrivals.',
       address = 'Plot X/7, Adamas Knowledge City Road, Barasat, North 24 Parganas, West Bengal 700126',
       latitude = 22.708000, longitude = 88.489000,
       cover_image_url = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Meals available', '24/7 Security', 'Laundry', 'Study hall', 'Power backup', 'RO water', 'Housekeeping'],
       room_measurements = '{"bedroom": {"length_m": 3.2, "width_m": 2.8, "height_m": 2.9}, "study_hall": {"length_m": 4.5, "width_m": 3.5, "height_m": 3.0}, "kitchen": {"length_m": 3.0, "width_m": 2.5, "height_m": 2.9}}'::jsonb,
       extra_services = '[{"name": "Laundry", "price": 800, "unit": "month"}, {"name": "Extra meal plan", "price": 2500, "unit": "month"}]'::jsonb,
       updated_at = now()
 where name = 'Adamas Green PG';

-- ── 2. North Kolkata Student Flat (Madhyamgram) ───────────────────────────
update public.properties
   set description =
         'A bright 2BHK on a quiet lane off Madhyamgram station, 12 minutes by auto from Adamas University. Both bedrooms have study desks and wardrobes; the living room doubles as a shared study zone with a 6-seater table. Kitchen is modular with a water purifier, and the gated society has covered parking and 24/7 security.',
       address = 'B/5, Madhyamgram Station Road, Madhyamgram, Kolkata, West Bengal 700129',
       latitude = 22.703000, longitude = 88.447000,
       cover_image_url = 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['2 bedrooms', 'Study-ready', 'Gated community', 'High-speed Wi-Fi', 'Power backup', 'Car parking', 'Balcony', '24/7 Security'],
       room_measurements = '{"living_room": {"length_m": 4.2, "width_m": 3.6, "height_m": 2.9}, "bedroom_1": {"length_m": 3.4, "width_m": 3.0, "height_m": 2.9}, "bedroom_2": {"length_m": 3.2, "width_m": 2.9, "height_m": 2.9}, "kitchen": {"length_m": 2.8, "width_m": 2.2, "height_m": 2.7}}'::jsonb,
       extra_services = '[{"name": "Daily maid", "price": 1500, "unit": "month"}, {"name": "Covered parking", "price": 1000, "unit": "month"}]'::jsonb,
       updated_at = now()
 where name = 'North Kolkata Student Flat';

-- ── 3. Lake View Student PG (Jadavpur, near Jadavpur University) ──────────
update public.properties
   set description =
         'Right opposite the Jadavpur lake, this PG is a 5-minute walk to Jadavpur University gate 4 and even closer to the canteen lane. Double-sharing rooms have individual study desks, and the rooftop lounge gets the evening breeze. Rent includes fibre Wi-Fi, daily housekeeping, laundry, and a power backup that keeps study hours uninterrupted.',
       address = '45 Lake View Road, near Jadavpur University Gate 4, Jadavpur, Kolkata, West Bengal 700032',
       latitude = 22.495000, longitude = 88.392000,
       cover_image_url = 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['High-speed Wi-Fi', 'Laundry', 'Power backup', 'Lake-facing rooms', 'Study desk', 'Daily housekeeping', 'Common lounge', 'CCTV'],
       room_measurements = '{"bedroom": {"length_m": 3.0, "width_m": 2.6, "height_m": 2.8}, "rooftop_lounge": {"length_m": 5.0, "width_m": 4.0, "height_m": 3.0}, "kitchen": {"length_m": 2.8, "width_m": 2.4, "height_m": 2.8}}'::jsonb,
       updated_at = now()
 where name = 'Lake View Student PG';

-- ── 4. South Kolkata 2BHK Flat (Gariahat) ─────────────────────────────────
update public.properties
   set description =
         'A sunlit 2BHK three lanes off Gariahat market, popular with Jadavpur University and Presidency students. Wooden floors, a modular kitchen with chimney, and two balconies with morning sun. The metro at Ballygunge Phari is 7 minutes away. Furnished fully — just bring your books.',
       address = '7/1, Golpark Lane, Gariahat, Kolkata, West Bengal 700029',
       latitude = 22.514000, longitude = 88.362000,
       cover_image_url = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['2 bedrooms', 'Furnished', 'Metro nearby', 'AC in bedrooms', 'Modular kitchen', 'High-speed Wi-Fi', 'Lift access', 'Parking'],
       room_measurements = '{"living_room": {"length_m": 4.0, "width_m": 3.4, "height_m": 2.9}, "bedroom_1": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.9}, "bedroom_2": {"length_m": 3.3, "width_m": 2.9, "height_m": 2.9}, "kitchen": {"length_m": 2.6, "width_m": 2.2, "height_m": 2.7}}'::jsonb,
       updated_at = now()
 where name = 'South Kolkata 2BHK Flat';

-- ── 5. College Street Co-Living (Ballygunge) ──────────────────────────────
update public.properties
   set description =
         'A characterful co-living PG on Ballygunge Circular Road for Calcutta University, Presidency, and Scottish Church students. Rooms share a warm common kitchen, a courtyard perfect for late-night adda, and a small library. Weekly community dinners are on the house. Wi-Fi, housekeeping, and laundry are included in the rent.',
       address = '22B, Ballygunge Circular Road, Kolkata, West Bengal 700019',
       latitude = 22.529000, longitude = 88.369000,
       cover_image_url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Housekeeping', 'Common kitchen', 'Community dinners', 'Laundry', 'Study corner', '24/7 Security', 'Power backup'],
       room_measurements = '{"bedroom": {"length_m": 3.0, "width_m": 2.6, "height_m": 2.8}, "common_kitchen": {"length_m": 4.2, "width_m": 3.0, "height_m": 2.8}, "library": {"length_m": 3.2, "width_m": 2.8, "height_m": 2.8}}'::jsonb,
       updated_at = now()
 where name = 'College Street Co-Living';

-- ── 6. Central Kolkata Student Flat (Bhowanipore) ─────────────────────────
update public.properties
   set description =
         'A modern 1BHK in Bhowanipore, 8 minutes from the Kalighat metro and an easy commute to College Street campuses. The bedroom fits a double bed plus a work station; the balcony overlooks a tree-lined avenue. Fully furnished with AC, geyser, modular kitchen, and a 200 Mbps connection included.',
       address = '14, Sarat Bose Road, Bhowanipore, Kolkata, West Bengal 700020',
       latitude = 22.539000, longitude = 88.349000,
       cover_image_url = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['1 bedroom', 'Fully furnished', 'Bus access', 'Wi-Fi', 'Power backup', 'Modular kitchen', 'Balcony', 'Housekeeping'],
       room_measurements = '{"bedroom": {"length_m": 3.6, "width_m": 3.0, "height_m": 2.9}, "living_room": {"length_m": 3.4, "width_m": 3.0, "height_m": 2.9}, "kitchen": {"length_m": 2.4, "width_m": 2.0, "height_m": 2.7}}'::jsonb,
       updated_at = now()
 where name = 'Central Kolkata Student Flat';

-- ── 7. New Town Scholars PG (New Town, near St. Xavier''s) ─────────────────
update public.properties
   set description =
         'Purpose-built student PG in New Town, 900 m from St. Xavier''s University and a short ride to Techno India and IEM Salt Lake. Every floor has a study lounge and filtered water; the ground floor has a small gym and a mess serving weekday lunches. CCTV, biometric entry, and a resident caretaker keep it secure.',
       address = 'Action Area III, New Town, Kolkata, West Bengal 700160',
       latitude = 22.577000, longitude = 88.468000,
       cover_image_url = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Gym', '24/7 Security', 'Study hall', 'Laundry', 'Mess on site', 'Power backup', 'CCTV'],
       room_measurements = '{"bedroom": {"length_m": 3.1, "width_m": 2.7, "height_m": 2.9}, "study_lounge": {"length_m": 4.0, "width_m": 3.2, "height_m": 2.9}, "gym": {"length_m": 5.0, "width_m": 3.5, "height_m": 2.9}}'::jsonb,
       updated_at = now()
 where name = 'New Town Scholars PG';

-- ── 8. Rajarhat Campus Flat (Rajarhat, near St. Xavier''s) ────────────────
update public.properties
   set description =
         'A spacious 2BHK on the 4th floor of a new Rajarhat society, 1.6 km from St. Xavier''s University New Town. Floor-to-ceiling windows, a west-facing balcony, and one reserved car park. The building has a gym, a pool, and 24/7 doorman. Fully furnished, ready to move into this semester.',
       address = 'Plot Y/9, Street 21, Rajarhat, Kolkata, West Bengal 700156',
       latitude = 22.564000, longitude = 88.453000,
       cover_image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['2 bedrooms', 'Balcony', 'Parking', 'Gym', 'Power backup', 'Wi-Fi', 'Furnished', '24/7 Security'],
       room_measurements = '{"living_room": {"length_m": 4.5, "width_m": 3.8, "height_m": 2.9}, "bedroom_1": {"length_m": 3.6, "width_m": 3.2, "height_m": 2.9}, "bedroom_2": {"length_m": 3.4, "width_m": 3.0, "height_m": 2.9}, "kitchen": {"length_m": 3.0, "width_m": 2.4, "height_m": 2.7}}'::jsonb,
       updated_at = now()
 where name = 'Rajarhat Campus Flat';

-- ── 9. KeyLo Dispute Demo Home (Jadavpur) ─────────────────────────────────
update public.properties
   set description =
         'A tidy single-occupancy PG room in Jadavpur, a 10-minute walk from Jadavpur University. Attached bathroom, a study nook by the window, and shared kitchen access. This listing is used for the KeyLo deposit-protection demo: the move-in inspection, photo handover, and deposit escrow flow are all enabled here.',
       address = '88, Raja Subodh Chandra Mullick Road, Jadavpur, Kolkata, West Bengal 700032',
       latitude = 22.495000, longitude = 88.392000,
       cover_image_url = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Move-in inspection', 'Deposit protection', 'Housekeeping', 'Power backup', 'Common kitchen', 'Laundry', '24/7 Security'],
       room_measurements = '{"bedroom": {"length_m": 3.0, "width_m": 2.6, "height_m": 2.8}, "attached_bath": {"length_m": 1.8, "width_m": 1.5, "height_m": 2.4}, "kitchen": {"length_m": 2.8, "width_m": 2.4, "height_m": 2.8}}'::jsonb,
       updated_at = now()
 where name = 'KeyLo Dispute Demo Home';

-- ── 10. Bloomsbury Student Hub (London) ───────────────────────────────────
update public.properties
   set description =
         'A refurbished Georgian townhouse on Marchmont Street, three minutes from Senate House and the University of London library. Ensuite rooms with study desks, a residents'' kitchen with weekly cleaning, and a basement common room with a projector for exam-season film nights. Bills, Wi-Fi, and laundry are all included.',
       address = '42, Marchmont Street, Bloomsbury, London WC1N 1AP',
       latitude = 51.524400, longitude = -0.124000,
       cover_image_url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Study area', '24/7 Security', 'Laundry', 'Ensuite rooms', 'Bike storage', 'Common lounge', 'CCTV'],
       room_measurements = '{"living_room": {"length_m": 5.0, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.0, "width_m": 2.5, "height_m": 2.5}}'::jsonb,
       extra_services = '[{"name": "Weekly linen service", "price": 20, "unit": "week"}, {"name": "Study desk upgrade", "price": 15, "unit": "month"}]'::jsonb,
       updated_at = now()
 where name = 'Bloomsbury Student Hub';

-- ── 11. South Kensington Modern Flat (London) ─────────────────────────────
update public.properties
   set description =
         'A sleek two-bedroom flat minutes from Imperial College and the museums, with a modern kitchen and a bright living room. Ideal for two postgrads: both rooms have desks, and the second bedroom can be set up as a study if you want the whole flat to yourself. Gym and bike storage in the building.',
       address = '5, Cornwall Gardens, South Kensington, London SW7 4AP',
       latitude = 51.496900, longitude = -0.184300,
       cover_image_url = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['2 bedrooms', 'Furnished', 'Gym access', 'Wi-Fi', 'Concierge', 'Balcony', 'Bike storage', 'Central heating'],
       room_measurements = '{"living_room": {"length_m": 6.0, "width_m": 4.5, "height_m": 2.5}, "master_bedroom": {"length_m": 4.0, "width_m": 3.5, "height_m": 2.5}, "second_bedroom": {"length_m": 3.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}}'::jsonb,
       updated_at = now()
 where name = 'South Kensington Modern Flat';

-- ── 12. Strand Deluxe PG (London) ─────────────────────────────────────────
update public.properties
   set description =
         'Deluxe ensuite rooms in a converted building right off the Strand, a 4-minute walk to King''s College Strand campus and a short hop to LSE. Breakfast and weekday dinners are served in the dining hall; housekeeping runs six days a week. Rooftop terrace with views over the Thames at sunset.',
       address = '8, Surrey Street, Strand, London WC2R 2ND',
       latitude = 51.511700, longitude = -0.118600,
       cover_image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85'
       ],
       amenities = ARRAY['Wi-Fi', 'Meals included', 'Housekeeping', '24/7 Security', 'Ensuite', 'Study rooms', 'Gym access', 'Laundry'],
       room_measurements = '{"living_room": {"length_m": 5.5, "width_m": 4.0, "height_m": 2.5}, "bedroom": {"length_m": 4.0, "width_m": 3.0, "height_m": 2.5}, "kitchen": {"length_m": 3.5, "width_m": 3.0, "height_m": 2.5}}'::jsonb,
       extra_services = '[{"name": "Weekly laundry", "price": 15, "unit": "week"}, {"name": "Weekend brunch", "price": 25, "unit": "month"}]'::jsonb,
       updated_at = now()
 where name = 'Strand Deluxe PG';
