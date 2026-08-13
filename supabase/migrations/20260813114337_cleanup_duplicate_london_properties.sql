-- Remove duplicate London properties and the test property.
-- Earlier migrations inserted properties that were invisible due to RLS,
-- so multiple attempts created duplicates. Keep only the first of each.

-- Delete the test property
delete from public.properties where name = 'Test London Property';

-- Delete duplicates: keep the row with the smallest created_at for each name
delete from public.properties
where id in (
  select p.id
  from public.properties p
  join (
    select name, min(created_at) as min_created
    from public.properties
    where city = 'London'
    group by name
    having count(*) > 1
  ) d on p.name = d.name and p.created_at > d.min_created
);