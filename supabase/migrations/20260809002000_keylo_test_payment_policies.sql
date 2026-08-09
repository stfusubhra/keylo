-- Client-side test payment records for the hackathon demo.
-- Replace this flow with a server-side Stripe/Razorpay webhook before launch.

create policy "Students create own payment records" on public.payments
for insert with check (
  payer_id = auth.uid()
  and exists (select 1 from public.bookings b where b.id = booking_id and b.student_id = auth.uid())
);

create policy "Booking parties read payments" on public.payments
for select using (
  payer_id = auth.uid()
  or exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (b.student_id = auth.uid() or exists (select 1 from public.properties p where p.id = b.property_id and p.owner_id = auth.uid()))
  )
  or public.is_admin()
);

create policy "Students create own deposits" on public.deposits
for insert with check (
  exists (select 1 from public.bookings b where b.id = booking_id and b.student_id = auth.uid())
);
