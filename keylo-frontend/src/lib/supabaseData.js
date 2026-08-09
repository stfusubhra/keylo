import { supabase } from './supabase';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Copy .env.example to .env.local and add project credentials.');
  }
  return supabase;
}

export async function listUniversities() {
  const { data, error } = await requireSupabase()
    .from('universities')
    .select('*')
    .eq('city', 'Kolkata')
    .order('name');
  if (error) throw error;
  return data;
}

export async function listProperties({ universityId, type } = {}) {
  let query = requireSupabase()
    .from('properties')
    .select('*, universities(name, city), profiles!properties_owner_id_fkey(full_name, owner_rating)')
    .eq('city', 'Kolkata')
    .eq('status', 'published')
    .order('distance_to_university_km');

  if (universityId) query = query.eq('university_id', universityId);
  if (type) query = query.eq('property_type', type);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createBooking({ propertyId, roomId, moveInDate, rentAmount, depositAmount }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to create a booking.');

  const tenantFirstBookingFee = 997;
  const landlordCommissionRate = 5;
  const totalDue = Number(rentAmount) + Number(depositAmount) + tenantFirstBookingFee;

  const { data, error } = await client.from('bookings').insert({
    student_id: userData.user.id,
    property_id: propertyId,
    room_id: roomId,
    move_in_date: moveInDate,
    rent_amount: rentAmount,
    deposit_amount: depositAmount,
    tenant_first_booking_fee: tenantFirstBookingFee,
    landlord_commission_rate: landlordCommissionRate,
    total_due: totalDue,
  }).select().single();
  if (error) throw error;
  return data;
}
