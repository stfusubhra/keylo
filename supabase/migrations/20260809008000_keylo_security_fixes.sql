-- KeyLo security fixes: close the privilege-escalation and tamper paths found
-- in review. Apply after 20260809007000.
--
-- No sanctioned app flow is changed:
--   * profiles: users can still update full_name/phone; role and is_verified
--     are frozen for non-admins (admin promotion stays admin-only).
--   * properties: landlord creation still works exactly as the app sends it
--     (status='draft', trust_score=0); the owner publish/unpublish toggle
--     (updatePropertyStatus) still works; owner reads of drafts are preserved.
--   * payments/deposits: every real write happens inside SECURITY DEFINER RPCs
--     (complete_test_booking, open_deposit_dispute) or migrations, so removing
--     the client-side insert policies does not affect booking completion or
--     dispute resolution.

-- 1) Privilege escalation: self-promotion to admin/landlord and self-verification.
--    The old policy had no WITH CHECK, which defaults to the USING expression,
--    so any user could UPDATE profiles SET role='admin' / is_verified=true.
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile" on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and is_verified = (select p.is_verified from public.profiles p where p.id = auth.uid())
  )
);

-- 2) Properties: landlords may only create draft listings with no trust
--    signals, and may not tamper with trust fields on update. The old FOR ALL
--    policy let an owner insert status='published' (skipping moderation) or
--    set trust_score/is_ai_inspected/is_documents_verified directly.
drop policy if exists "Landlords manage own properties" on public.properties;

create policy "Landlords create own draft properties" on public.properties
for insert with check (
  owner_id = auth.uid()
  and status = 'draft'
  and trust_score = 0
  and is_ai_inspected = false
  and is_documents_verified = false
);

create policy "Landlords update own properties" on public.properties
for update using (owner_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (
    owner_id = auth.uid()
    and trust_score = (select p.trust_score from public.properties p where p.id = properties.id)
    and is_ai_inspected = (select p.is_ai_inspected from public.properties p where p.id = properties.id)
    and is_documents_verified = (select p.is_documents_verified from public.properties p where p.id = properties.id)
  )
);

create policy "Owners read own properties" on public.properties
for select using (owner_id = auth.uid() or public.is_admin());

create policy "Owners delete own properties" on public.properties
for delete using (owner_id = auth.uid() or public.is_admin());

-- 3) Payments/deposits: no client-side inserts. All writes go through the
--    SECURITY DEFINER RPCs or migrations; the old policies let a student forge
--    'paid' payment records and deposits of any amount for their own bookings.
drop policy if exists "Students create own payment records" on public.payments;
drop policy if exists "Students create own deposits" on public.deposits;
