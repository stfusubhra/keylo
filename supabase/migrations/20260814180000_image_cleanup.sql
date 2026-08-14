-- ============================================================================
-- Image cleanup: every listing photo must actually match what it represents.
--
-- Replaces photos that were wrong for their slot:
--   - 1600585154340  (Rajarhat cover)        = exterior house shot on a flat listing
--   - 1600585152220  (4 galleries)           = construction / construction-supplies
--   - 1600607688969  (North Kolkata cover + Rajarhat gallery) = construction-related
--   - 1560185008     (Lake View cover + Adamas gallery)        = restaurant/cafe interior
--   - 1628744448840  (3 galleries)           = outdoor heat-pump unit imagery
--   - 1519389950473  (Lake View gallery)     = workspace/team photo, not an interior
--   - 1517248135467  (New Town gallery)      = restaurant interior
--   - 1556909114     (Central gallery)       = food/orange-juice photo
--   - 1552321554     (Central gallery)       = second bathroom (kept one bathroom)
--
-- Replacements are real Unsplash interiors verified by alt-text at selection
-- time. Only the 8 affected Kolkata listings are touched (by name, idempotent).
-- ============================================================================

-- ── 1. Adamas Green PG ──────────────────────────────────────────────────────
-- pos2: restaurant/cafe shot -> white bed linen on bed
-- pos6: construction shot    -> white bed comforter
update public.properties
   set cover_image_url = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'Adamas Green PG';

-- ── 2. North Kolkata Student Flat ──────────────────────────────────────────
-- cover: construction shot  -> gray sofa near white wall (living room)
-- pos5:  construction shot  -> gray bed in bedroom
update public.properties
   set cover_image_url = 'https://images.unsplash.com/photo-1629042306558-7d1e15cc02fa?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1629042306558-7d1e15cc02fa?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'North Kolkata Student Flat';

-- ── 3. Lake View Student PG ────────────────────────────────────────────────
-- cover: restaurant/cafe shot -> white bed with gray and white bed linen
-- pos5:  workspace/team photo -> white sofa chair near fireplace (lounge)
-- pos6:  heat-pump imagery     -> black and white bed linen
update public.properties
   set cover_image_url = 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'Lake View Student PG';

-- ── 4. South Kolkata 2BHK Flat ─────────────────────────────────────────────
-- pos6: heat-pump imagery -> a room with a couch and a table
update public.properties
   set images = ARRAY[
         'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1664711942326-2c3351e215e6?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'South Kolkata 2BHK Flat';

-- ── 5. College Street Co-Living ────────────────────────────────────────────
-- pos6: construction shot -> living room with a mirror (communal lounge feel)
update public.properties
   set images = ARRAY[
         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'College Street Co-Living';

-- ── 6. Central Kolkata Student Flat ────────────────────────────────────────
-- pos4: second bathroom      -> white bed pillow on bed
-- pos5: food/orange-juice    -> living room with a large window
update public.properties
   set images = ARRAY[
         'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1633505899118-4ca6bd143043?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'Central Kolkata Student Flat';

-- ── 7. New Town Scholars PG ────────────────────────────────────────────────
-- pos5: construction shot -> black laptop on white bed (study theme)
-- pos6: restaurant shot   -> modern living room with a large window
update public.properties
   set images = ARRAY[
         'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1724582586529-62622e50c0b3?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'New Town Scholars PG';

-- ── 8. Rajarhat Campus Flat ────────────────────────────────────────────────
-- cover: exterior house shot -> living room with a large window (floor-to-ceiling)
-- pos2:  construction shot   -> white wooden coffee table near white sofa
-- pos6:  heat-pump imagery   -> white bed frame
update public.properties
   set cover_image_url = 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
       images = ARRAY[
         'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
         'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1200&q=85'
       ],
       updated_at = now()
 where name = 'Rajarhat Campus Flat';
