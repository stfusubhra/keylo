BEGIN;

-- Update existing demo properties with virtual tour URLs
-- (virtual_tour_url column was added in 20260812075049)
UPDATE public.properties
SET virtual_tour_url = 'https://pannol.com/360/jadavpur-pg-tour/'
WHERE name = 'Lake View Student PG';

COMMIT;