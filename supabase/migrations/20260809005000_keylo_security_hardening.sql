-- Keep security-definer helpers callable only through authenticated app flows.
revoke all on function public.validate_booking_request() from public;
revoke all on function public.complete_test_booking(uuid, text) from public;
grant execute on function public.complete_test_booking(uuid, text) to authenticated;

-- Inspection evidence is not public by default. Booking parties and admins can
-- read it; unassigned published inspections expose only their existence via
-- the property page, not private evidence URLs.
drop policy if exists "Booking parties read inspections" on public.inspections;
create policy "Booking parties read inspections" on public.inspections
for select using (
  public.is_admin()
  or exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (b.student_id = auth.uid() or exists (select 1 from public.properties p where p.id = b.property_id and p.owner_id = auth.uid()))
  )
  or (booking_id is null and exists (select 1 from public.properties p where p.id = property_id and p.status = 'published'))
);

-- Students may create maintenance requests only for their own booking.
create policy "Booking students create maintenance" on public.maintenance_requests
for insert with check (
  student_id = auth.uid()
  and exists (select 1 from public.bookings b where b.id = booking_id and b.student_id = auth.uid())
);
