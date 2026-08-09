-- Protect the booking demo from client-side price/property tampering.
-- The browser may create a test booking, but it cannot book an unpublished
-- property, mismatch the listed price, or attach a room from another property.

create or replace function public.validate_booking_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  property_row public.properties%rowtype;
  room_property_id uuid;
begin
  select * into property_row
  from public.properties
  where id = new.property_id;

  if property_row.id is null or property_row.status <> 'published' or property_row.city <> 'Kolkata' then
    raise exception 'This property is not available for booking';
  end if;

  if new.rent_amount <> property_row.monthly_rent or new.deposit_amount <> property_row.security_deposit then
    raise exception 'Booking amounts do not match the property listing';
  end if;

  if new.room_id is not null then
    select property_id into room_property_id from public.rooms where id = new.room_id and available = true;
    if room_property_id is null or room_property_id <> new.property_id then
      raise exception 'The selected room is not available for this property';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_booking_request on public.bookings;
create trigger validate_booking_request
before insert on public.bookings
for each row execute function public.validate_booking_request();

drop policy if exists "Students create own bookings" on public.bookings;
create policy "Students create own published bookings" on public.bookings
for insert with check (
  student_id = auth.uid()
  and tenant_first_booking_fee = 997
  and landlord_commission_rate = 5
);
