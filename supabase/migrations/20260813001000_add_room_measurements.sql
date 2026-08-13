BEGIN;
ALTER TABLE properties ADD COLUMN room_measurements JSONB NULL;
COMMIT;