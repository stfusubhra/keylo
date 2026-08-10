-- Admin-only operational overview.
-- Auth emails and sign-in timestamps live in auth.users, so they are exposed
-- through this guarded RPC rather than copied into public.profiles.

create or replace function public.get_admin_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'users', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select p.id, p.full_name, p.role, p.phone, p.owner_rating,
               p.is_verified, p.created_at, u.email,
               u.last_sign_in_at, u.confirmed_at
        from public.profiles p
        join auth.users u on u.id = p.id
      ) x
    ), '[]'::jsonb),
    'properties', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select p.id, p.name, p.area, p.city, p.property_type, p.status,
               p.monthly_rent, p.security_deposit, p.trust_score,
               p.is_ai_inspected, p.is_documents_verified, p.created_at,
               u.name as university, o.full_name as landlord_name,
               o.id as landlord_id
        from public.properties p
        left join public.universities u on u.id = p.university_id
        left join public.profiles o on o.id = p.owner_id
      ) x
    ), '[]'::jsonb),
    'bookings', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select b.id, b.status, b.move_in_date, b.move_out_date,
               b.rent_amount, b.deposit_amount, b.tenant_first_booking_fee,
               b.total_due, b.created_at, b.updated_at,
               s.id as tenant_id, s.full_name as tenant_name,
               su.email as tenant_email, p.name as property_name,
               p.area as property_area, o.full_name as landlord_name,
               ou.email as landlord_email
        from public.bookings b
        join public.profiles s on s.id = b.student_id
        join auth.users su on su.id = s.id
        join public.properties p on p.id = b.property_id
        join public.profiles o on o.id = p.owner_id
        join auth.users ou on ou.id = o.id
      ) x
    ), '[]'::jsonb),
    'rentals', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select r.id, r.item_id, r.item_name, r.status, r.unit_price,
               r.duration, r.period, r.start_date, r.end_date,
               r.fulfilment, r.delivery_address, r.subtotal,
               r.platform_fee, r.delivery_fee, r.total, r.created_at,
               p.full_name as tenant_name, u.email as tenant_email
        from public.rentals r
        join public.profiles p on p.id = r.student_id
        join auth.users u on u.id = p.id
      ) x
    ), '[]'::jsonb),
    'payments', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select pay.id, pay.booking_id, pay.payer_id, pay.amount,
               pay.payment_type, pay.provider, pay.status, pay.paid_at,
               pay.created_at, p.full_name as payer_name, u.email as payer_email
        from public.payments pay
        left join public.profiles p on p.id = pay.payer_id
        left join auth.users u on u.id = pay.payer_id
      ) x
    ), '[]'::jsonb),
    'deposits', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select d.id, d.booking_id, d.amount, d.status, d.held_at,
               d.release_requested_at, d.released_at, d.created_at,
               p.full_name as tenant_name, u.email as tenant_email,
               prop.name as property_name
        from public.deposits d
        join public.bookings b on b.id = d.booking_id
        join public.profiles p on p.id = b.student_id
        join auth.users u on u.id = p.id
        join public.properties prop on prop.id = b.property_id
      ) x
    ), '[]'::jsonb),
    'disputes', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select d.id, d.booking_id, d.status, d.reason, d.claimed_amount,
               d.recommended_refund, d.final_refund, d.created_at,
               d.resolved_at, d.property_id, prop.name as property_name,
               s.full_name as tenant_name, su.email as tenant_email,
               l.full_name as landlord_name, lu.email as landlord_email
        from public.disputes d
        left join public.properties prop on prop.id = d.property_id
        left join public.profiles s on s.id = d.student_id
        left join auth.users su on su.id = d.student_id
        left join public.profiles l on l.id = d.landlord_id
        left join auth.users lu on lu.id = d.landlord_id
      ) x
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
      from (
        select r.id, r.property_id, r.rating, r.comment, r.created_at,
               prop.name as property_name, p.full_name as tenant_name,
               u.email as tenant_email
        from public.reviews r
        join public.properties prop on prop.id = r.property_id
        join public.profiles p on p.id = r.student_id
        join auth.users u on u.id = p.id
      ) x
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_admin_overview() from public;
grant execute on function public.get_admin_overview() to authenticated;
