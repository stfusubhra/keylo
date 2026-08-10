-- Owner workspace data. Sensitive tenant/auth details are returned only to
-- the authenticated landlord who owns the related properties.

create or replace function public.get_owner_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'You must be signed in'; end if;
  if not exists (select 1 from public.profiles where id = v_user_id and role = 'landlord') then
    raise exception 'Landlord access required';
  end if;

  return jsonb_build_object(
    'properties', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select p.id,p.name,p.area,p.city,p.property_type,p.status,p.monthly_rent,
             p.security_deposit,p.distance_to_university_km,p.trust_score,
             p.is_ai_inspected,p.is_documents_verified,p.created_at,u.name as university
      from public.properties p left join public.universities u on u.id=p.university_id
      where p.owner_id=v_user_id
    ) x),'[]'::jsonb),
    'bookings', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select b.id,b.status,b.move_in_date,b.move_out_date,b.rent_amount,
             b.deposit_amount,b.tenant_first_booking_fee,b.total_due,b.created_at,
             b.updated_at,s.id as tenant_id,s.full_name as tenant_name,
             su.email as tenant_email,p.name as property_name,p.area as property_area,
             d.status as deposit_status,d.amount as deposit_amount_held
      from public.bookings b
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id
      join auth.users su on su.id=s.id
      left join public.deposits d on d.booking_id=b.id
    ) x),'[]'::jsonb),
    'tenants', coalesce((select jsonb_agg(to_jsonb(x) order by x.last_booking_at desc) from (
      select s.id,s.full_name,s.phone,su.email,
             count(b.id)::integer as booking_count,
             max(b.created_at) as last_booking_at,
             count(*) filter (where b.status in ('confirmed','active'))::integer as active_bookings
      from public.bookings b
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id
      join auth.users su on su.id=s.id
      group by s.id,s.full_name,s.phone,su.email
    ) x),'[]'::jsonb),
    'deposits', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select d.id,d.booking_id,d.amount,d.status,d.held_at,d.release_requested_at,
             d.released_at,d.dispute_reason,d.created_at,b.status as booking_status,
             s.full_name as tenant_name,su.email as tenant_email,p.name as property_name
      from public.deposits d join public.bookings b on b.id=d.booking_id
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=b.student_id join auth.users su on su.id=s.id
    ) x),'[]'::jsonb),
    'messages', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select m.id,m.booking_id,m.body,m.read_at,m.created_at,
             s.full_name as sender_name,su.email as sender_email,p.name as property_name
      from public.messages m join public.bookings b on b.id=m.booking_id
      join public.properties p on p.id=b.property_id and p.owner_id=v_user_id
      join public.profiles s on s.id=m.sender_id join auth.users su on su.id=s.id
      where m.recipient_id=v_user_id or m.sender_id=v_user_id
    ) x),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_owner_workspace() from public;
grant execute on function public.get_owner_workspace() to authenticated;
