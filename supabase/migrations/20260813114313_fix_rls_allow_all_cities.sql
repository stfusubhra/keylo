-- Update RLS policy to allow all published properties (not just Kolkata).
-- The original policy restricted SELECT to city = 'Kolkata', which made
-- London properties invisible via the REST API.

drop policy "Published Kolkata listings are public" on public.properties;
create policy "Published listings are public" on public.properties for select using (status = 'published');