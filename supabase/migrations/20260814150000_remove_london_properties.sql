-- ============================================================================
-- Remove London properties (and their universities)
--
-- Deletes the 3 London demo properties and the 3 London universities added in
-- 20260814000000_add_london_properties_demo.sql. Verified before running:
--   - No rooms, bookings, reviews, saved_properties, or inspections reference
--     the London property ids
--   - London universities have no remaining property references
-- Order matters: properties first, then universities (FK restrict).
-- ============================================================================

-- 1. Remove the London properties (rooms/inspections cascade; nothing else refs them)
delete from public.properties
 where city = 'London';

-- 2. Remove the London universities (no properties remain referencing them)
delete from public.universities
 where city = 'London';
