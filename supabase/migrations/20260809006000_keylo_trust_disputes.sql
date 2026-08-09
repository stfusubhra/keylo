-- Trust scoring and deposit-dispute workflow.

alter table public.properties
  add column if not exists trust_score_breakdown jsonb not null default '{}'::jsonb;

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete restrict,
  landlord_id uuid not null references public.profiles(id) on delete restrict,
  property_id uuid not null references public.properties(id) on delete restrict,
  reason text not null check (char_length(reason) between 10 and 2000),
  evidence_urls text[] not null default '{}',
  claimed_amount numeric(12,2) not null check (claimed_amount >= 0),
  ai_recommendation text not null default 'review_required',
  ai_confidence numeric(5,2) not null default 0 check (ai_confidence between 0 and 100),
  recommended_refund numeric(12,2) not null default 0 check (recommended_refund >= 0),
  landlord_response text,
  landlord_recommended_refund numeric(12,2) check (landlord_recommended_refund >= 0),
  admin_note text,
  final_refund numeric(12,2) check (final_refund >= 0),
  status text not null default 'open' check (status in ('open', 'landlord_review', 'admin_review', 'resolved', 'denied')),
  resolved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists disputes_status_created_idx on public.disputes (status, created_at desc);
create index if not exists disputes_landlord_status_idx on public.disputes (landlord_id, status);

alter table public.disputes enable row level security;

create or replace function public.calculate_property_trust_score(p_property_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  property_row public.properties%rowtype;
  owner_verified boolean := false;
  inspection_passed boolean := false;
  score integer;
  breakdown jsonb;
begin
  select * into property_row from public.properties where id = p_property_id;
  if property_row.id is null then raise exception 'Property not found'; end if;
  select coalesce(is_verified, false) into owner_verified from public.profiles where id = property_row.owner_id;
  select exists (select 1 from public.inspections where property_id = p_property_id and status = 'passed') into inspection_passed;
  score := 35
    + case when property_row.is_documents_verified then 20 else 0 end
    + case when property_row.is_ai_inspected or inspection_passed then 20 else 0 end
    + case when owner_verified then 15 else 0 end
    + case when property_row.status = 'published' then 10 else 0 end;
  breakdown := jsonb_build_object(
    'documents', case when property_row.is_documents_verified then 20 else 0 end,
    'inspection', case when property_row.is_ai_inspected or inspection_passed then 20 else 0 end,
    'landlord', case when owner_verified then 15 else 0 end,
    'published', case when property_row.status = 'published' then 10 else 0 end,
    'base', 35,
    'calculated_at', now()
  );
  return jsonb_build_object('score', least(score, 100), 'breakdown', breakdown);
end;
$$;

create or replace function public.refresh_property_trust_score(p_property_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare result jsonb;
begin
  result := public.calculate_property_trust_score(p_property_id);
  update public.properties set trust_score = (result->>'score')::integer, trust_score_breakdown = result->'breakdown', updated_at = now() where id = p_property_id;
  return result;
end;
$$;

create or replace function public.open_deposit_dispute(p_booking_id uuid, p_reason text, p_evidence_urls text[] default '{}')
returns public.disputes language plpgsql security definer set search_path = public as $$
declare booking_row public.bookings%rowtype; property_row public.properties%rowtype; deposit_row public.deposits%rowtype; dispute_row public.disputes;
begin
  if auth.uid() is null then raise exception 'You must be signed in'; end if;
  select * into booking_row from public.bookings where id = p_booking_id and student_id = auth.uid();
  if booking_row.id is null then raise exception 'Booking not found'; end if;
  if booking_row.status not in ('confirmed', 'active', 'completed') then raise exception 'Only confirmed stays can open a deposit dispute'; end if;
  select * into property_row from public.properties where id = booking_row.property_id;
  select * into deposit_row from public.deposits where booking_id = p_booking_id;
  if deposit_row.id is null then raise exception 'No protected deposit exists for this booking'; end if;
  if exists (select 1 from public.disputes where booking_id = p_booking_id) then raise exception 'A dispute already exists for this booking'; end if;
  insert into public.disputes (booking_id, student_id, landlord_id, property_id, reason, evidence_urls, claimed_amount, ai_recommendation, ai_confidence, recommended_refund)
  values (
    p_booking_id, auth.uid(), property_row.owner_id, property_row.id, p_reason, coalesce(p_evidence_urls, '{}'), deposit_row.amount,
    case when coalesce(property_row.trust_score, 0) >= 90 then 'recommend_full_refund' when coalesce(property_row.trust_score, 0) >= 75 then 'recommend_partial_refund' else 'review_required' end,
    case when coalesce(property_row.trust_score, 0) >= 90 then 88 else 64 end,
    case when coalesce(property_row.trust_score, 0) >= 90 then deposit_row.amount when coalesce(property_row.trust_score, 0) >= 75 then round(deposit_row.amount * 0.75, 2) else round(deposit_row.amount * 0.5, 2) end
  ) returning * into dispute_row;
  update public.deposits set status = 'disputed', dispute_reason = p_reason where id = deposit_row.id;
  return dispute_row;
end;
$$;

create or replace function public.respond_to_deposit_dispute(p_dispute_id uuid, p_response text, p_recommended_refund numeric)
returns public.disputes language plpgsql security definer set search_path = public as $$
declare dispute_row public.disputes;
begin
  select d.* into dispute_row from public.disputes d where d.id = p_dispute_id and d.landlord_id = auth.uid();
  if dispute_row.id is null then raise exception 'Dispute not found'; end if;
  if dispute_row.status not in ('open', 'landlord_review') then raise exception 'This dispute is no longer awaiting landlord response'; end if;
  if p_recommended_refund < 0 or p_recommended_refund > dispute_row.claimed_amount then raise exception 'Refund must be between zero and the protected deposit'; end if;
  update public.disputes set landlord_response = p_response, landlord_recommended_refund = p_recommended_refund, status = 'admin_review', updated_at = now() where id = p_dispute_id returning * into dispute_row;
  return dispute_row;
end;
$$;

create or replace function public.resolve_deposit_dispute(p_dispute_id uuid, p_decision text, p_refund_amount numeric, p_note text)
returns public.disputes language plpgsql security definer set search_path = public as $$
declare dispute_row public.disputes; final_status text;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into dispute_row from public.disputes where id = p_dispute_id for update;
  if dispute_row.id is null then raise exception 'Dispute not found'; end if;
  if p_decision not in ('refund', 'deny') then raise exception 'Unsupported dispute decision'; end if;
  if p_refund_amount < 0 or p_refund_amount > dispute_row.claimed_amount then raise exception 'Refund must be between zero and the claimed deposit'; end if;
  final_status := case when p_decision = 'refund' then 'resolved' else 'denied' end;
  update public.disputes set status = final_status, final_refund = case when p_decision = 'refund' then p_refund_amount else 0 end, admin_note = p_note, resolved_by = auth.uid(), resolved_at = now(), updated_at = now() where id = p_dispute_id returning * into dispute_row;
  update public.deposits set status = (case when p_decision = 'refund' then 'released' else 'held' end)::public.deposit_status, released_at = case when p_decision = 'refund' then now() else null end where booking_id = dispute_row.booking_id;
  if p_decision = 'refund' and p_refund_amount < dispute_row.claimed_amount then update public.properties set trust_score = greatest(0, coalesce(trust_score, 0) - 5), updated_at = now() where id = dispute_row.property_id; end if;
  return dispute_row;
end;
$$;

grant execute on function public.calculate_property_trust_score(uuid) to authenticated;
grant execute on function public.refresh_property_trust_score(uuid) to authenticated;
grant execute on function public.open_deposit_dispute(uuid, text, text[]) to authenticated;
grant execute on function public.respond_to_deposit_dispute(uuid, text, numeric) to authenticated;
grant execute on function public.resolve_deposit_dispute(uuid, text, numeric, text) to authenticated;

drop policy if exists "Dispute participants read disputes" on public.disputes;
create policy "Dispute participants read disputes" on public.disputes for select using (student_id = auth.uid() or landlord_id = auth.uid() or public.is_admin());
drop policy if exists "Students create disputes" on public.disputes;
create policy "Students create disputes" on public.disputes for insert with check (student_id = auth.uid());
