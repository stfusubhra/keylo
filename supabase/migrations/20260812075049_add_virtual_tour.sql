BEGIN;

-- Add virtual_tour_url column to properties table
ALTER TABLE properties
  ADD COLUMN virtual_tour_url TEXT NULL;

COMMIT;