-- Tenant <-> landlord messaging.
--
-- The messages table already holds conversation rows keyed by booking, but
-- profiles RLS hides counterpart identity (name/email) from direct joins, so
-- both parties read their conversations through security-definer RPCs that
-- attach sender/recipient names, emails, and the property name.

-- Messages for the signed-in user (any role). Includes every row where the
-- user is sender or recipient so tenants and landlords see the same thread.
create or replace function public.get_student_messages()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'You must be signed in'; end if;

  return coalesce((
    select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select m.id, m.booking_id, m.sender_id, m.recipient_id, m.body,
             m.read_at, m.created_at,
             p.name as property_name,
             sender.full_name as sender_name, sender_a.email as sender_email,
             recipient.full_name as recipient_name, recipient_a.email as recipient_email
      from public.messages m
      left join public.bookings b on b.id = m.booking_id
      left join public.properties p on p.id = b.property_id
      join public.profiles sender on sender.id = m.sender_id
      join auth.users sender_a on sender_a.id = m.sender_id
      join public.profiles recipient on recipient.id = m.recipient_id
      join auth.users recipient_a on recipient_a.id = m.recipient_id
      where m.sender_id = v_user_id or m.recipient_id = v_user_id
    ) x
  ), '[]'::jsonb);
end;
$$;

-- Messages for a landlord, restricted to conversations attached to bookings on
-- properties they own, so tenants never leak into another landlord's inbox.
create or replace function public.get_owner_messages()
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

  return coalesce((
    select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
      select m.id, m.booking_id, m.sender_id, m.recipient_id, m.body,
             m.read_at, m.created_at,
             p.name as property_name,
             sender.full_name as sender_name, sender_a.email as sender_email,
             recipient.full_name as recipient_name, recipient_a.email as recipient_email
      from public.messages m
      join public.bookings b on b.id = m.booking_id
      join public.properties p on p.id = b.property_id and p.owner_id = v_user_id
      join public.profiles sender on sender.id = m.sender_id
      join auth.users sender_a on sender_a.id = m.sender_id
      join public.profiles recipient on recipient.id = m.recipient_id
      join auth.users recipient_a on recipient_a.id = m.recipient_id
      where m.sender_id = v_user_id or m.recipient_id = v_user_id
    ) x
  ), '[]'::jsonb);
end;
$$;

-- Mark every message from p_from on a booking as read by the caller. Only the
-- caller's own incoming rows are touched (recipient_id = auth.uid()).
create or replace function public.mark_messages_read(p_booking_id uuid, p_from uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'You must be signed in'; end if;

  update public.messages m
     set read_at = now()
   where m.booking_id = p_booking_id
     and m.sender_id = p_from
     and m.recipient_id = v_user_id
     and m.read_at is null;

  return 1;
end;
$$;

revoke all on function public.get_student_messages() from public;
grant execute on function public.get_student_messages() to authenticated;

revoke all on function public.get_owner_messages() from public;
grant execute on function public.get_owner_messages() to authenticated;

revoke all on function public.mark_messages_read(uuid, uuid) from public;
grant execute on function public.mark_messages_read(uuid, uuid) to authenticated;
