import { supabase } from './supabase';

// Demo listing slugs used by FindStayPage when Supabase is unconfigured.
// These resolve to the matching demo property in the database when it is.
const DEMO_SLUG_NAMES = {
  'jadavpur-pg': 'Lake View Student PG',
  'adamas-pg': 'Adamas Green PG',
  'adamas-flat': 'North Kolkata Student Flat',
  'jadavpur-flat': 'South Kolkata 2BHK Flat',
  'calcutta-pg': 'College Street Co-Living',
  'calcutta-flat': 'Central Kolkata Student Flat',
  'xaviers-pg': 'New Town Scholars PG',
  'xaviers-flat': 'Rajarhat Campus Flat',
};

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

// Resolve a property by UUID or demo slug (e.g. "jadavpur-pg") and return the
// full row with university + owner profile, or null when it does not exist.
export async function getPropertyById(propertyId) {
  const client = requireSupabase();
  let id = propertyId;
  if (!/^[0-9a-f-]{36}$/i.test(propertyId)) {
    const { data: property, error: lookupError } = await client
      .from('properties')
      .select('id')
      .eq('name', DEMO_SLUG_NAMES[propertyId] || propertyId)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!property) return null;
    id = property.id;
  }
  const { data, error } = await client
    .from('properties')
    .select('*, universities(name, city), profiles!properties_owner_id_fkey(full_name, owner_rating)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function createBooking({ propertyId, roomId, moveInDate, rentAmount, depositAmount }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to create a booking.');

  let resolvedPropertyId = propertyId;
  if (!/^[0-9a-f-]{36}$/i.test(propertyId)) {
    const { data: property, error: propertyError } = await client
      .from('properties')
      .select('id')
      .eq('name', DEMO_SLUG_NAMES[propertyId] || propertyId)
      .single();
    if (propertyError) throw propertyError;
    resolvedPropertyId = property.id;
  }

  const tenantFirstBookingFee = 997;
  const landlordCommissionRate = 5;
  // total_due and landlord_commission_amount are GENERATED columns in the
  // schema, so they must not be inserted.

  const { data, error } = await client.from('bookings').insert({
    student_id: userData.user.id,
    property_id: resolvedPropertyId,
    room_id: roomId,
    move_in_date: moveInDate,
    rent_amount: rentAmount,
    deposit_amount: depositAmount,
    tenant_first_booking_fee: tenantFirstBookingFee,
    landlord_commission_rate: landlordCommissionRate,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function createTestPayment({ booking, method = 'upi' }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to make a test payment.');
  const { data, error } = await client.rpc('complete_test_booking', {
    p_booking_id: booking.id,
    p_method: method,
  });
  if (error) throw error;
  return data || { status: 'paid', provider: 'test_mode', method };
}

export async function cancelBooking(bookingId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .eq('status', 'pending')
    .select('id, status')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Only pending bookings can be cancelled.');
  return data;
}

export async function getSavedPropertyIds() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return {};
  const { data, error } = await client
    .from('saved_properties')
    .select('property_id')
    .eq('student_id', userData.user.id);
  if (error) throw error;
  return (data || []).reduce((acc, row) => ({ ...acc, [row.property_id]: true }), {});
}

export async function toggleSavedProperty(propertyId) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to save a property.');

  let resolvedPropertyId = propertyId;
  if (!/^[0-9a-f-]{36}$/i.test(propertyId)) {
    const { data: property, error: propertyError } = await client
      .from('properties')
      .select('id')
      .eq('name', DEMO_SLUG_NAMES[propertyId] || propertyId)
      .single();
    if (propertyError) throw propertyError;
    resolvedPropertyId = property.id;
  }

  const existing = await client
    .from('saved_properties')
    .select('property_id')
    .eq('student_id', userData.user.id)
    .eq('property_id', resolvedPropertyId)
    .maybeSingle();

  if (existing.data) {
    const { error } = await client
      .from('saved_properties')
      .delete()
      .eq('student_id', userData.user.id)
      .eq('property_id', resolvedPropertyId);
    if (error) throw error;
    return { saved: false };
  }

  const { error } = await client.from('saved_properties').insert({ student_id: userData.user.id, property_id: resolvedPropertyId });
  if (error) throw error;
  return { saved: true };
}

export async function getDashboardData() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to view dashboard data.');

  const [bookings, saved, messages] = await Promise.all([
    client.from('bookings').select('*, properties(name, area, city), deposits(*)').eq('student_id', userData.user.id).order('created_at', { ascending: false }),
    client.from('saved_properties').select('property_id, properties(*, profiles!properties_owner_id_fkey(owner_rating))').eq('student_id', userData.user.id),
    client.from('messages').select('*').eq('recipient_id', userData.user.id).order('created_at', { ascending: false }),
  ]);
  const failed = [bookings, saved, messages].find((result) => result.error);
  if (failed) throw failed.error;
  return { user: userData.user, bookings: bookings.data || [], saved: saved.data || [], messages: messages.data || [] };
}

export async function createProperty({ name, universityId, area, propertyType, monthlyRent, securityDeposit, distance, description }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in as a landlord to add a property.');

  const rent = Number(monthlyRent);
  const deposit = Number(securityDeposit);
  const distanceKm = Number(distance);
  if (!name?.trim() || !universityId || !area?.trim()) throw new Error('Property name, university, and area are required.');
  if (!Number.isFinite(rent) || rent <= 0) throw new Error('Monthly rent must be greater than zero.');
  if (!Number.isFinite(deposit) || deposit < 0) throw new Error('Security deposit cannot be negative.');
  if (!Number.isFinite(distanceKm) || distanceKm < 0) throw new Error('Distance must be zero or greater.');

  const { data, error } = await client.from('properties').insert({
    owner_id: userData.user.id,
    university_id: universityId,
    name,
    property_type: propertyType,
    area,
    city: 'Kolkata',
    description,
    monthly_rent: rent,
    security_deposit: deposit,
    distance_to_university_km: distanceKm,
    status: 'draft',
    trust_score: 0,
    amenities: [],
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getOwnerData() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in as a landlord to view this workspace.');

  const [properties, bookings] = await Promise.all([
    client.from('properties').select('id, name, area, property_type, status, monthly_rent, security_deposit, universities(name)').eq('owner_id', userData.user.id).order('created_at', { ascending: false }),
    client.from('bookings').select('id, status, rent_amount, created_at, properties!inner(name, area, owner_id)').eq('properties.owner_id', userData.user.id).order('created_at', { ascending: false }),
  ]);
  const failed = [properties, bookings].find((result) => result.error);
  if (failed) throw failed.error;
  return { user: userData.user, properties: properties.data || [], bookings: bookings.data || [] };
}

export async function getAdminProperties() {
  const client = requireSupabase();
  const { data, error } = await client.from('properties').select('id, name, area, city, property_type, status, trust_score, is_ai_inspected, is_documents_verified, created_at, universities(name), profiles!properties_owner_id_fkey(full_name, is_verified)').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function moderateProperty(propertyId, status) {
  const client = requireSupabase();
  const { data, error } = await client.from('properties').update({ status }).eq('id', propertyId).select().single();
  if (error) throw error;
  if (status === 'published') {
    const { error: scoreError } = await client.rpc('refresh_property_trust_score', { p_property_id: propertyId });
    if (scoreError) throw scoreError;
  }
  return data;
}

const disputeSelect = '*, properties(name, area), student:profiles!disputes_student_id_fkey(full_name), landlord:profiles!disputes_landlord_id_fkey(full_name)';

export async function getStudentDisputes() {
  const client = requireSupabase();
  const { data, error } = await client.from('disputes').select(disputeSelect).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getLandlordDisputes() {
  const client = requireSupabase();
  const { data, error } = await client.from('disputes').select(disputeSelect).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAdminDisputes() {
  const client = requireSupabase();
  const { data, error } = await client.from('disputes').select(disputeSelect).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function openDepositDispute({ bookingId, reason, evidenceUrls = [] }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('open_deposit_dispute', {
    p_booking_id: bookingId,
    p_reason: reason,
    p_evidence_urls: evidenceUrls,
  });
  if (error) throw error;
  return data;
}

export async function respondToDepositDispute({ disputeId, response, recommendedRefund }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('respond_to_deposit_dispute', {
    p_dispute_id: disputeId,
    p_response: response,
    p_recommended_refund: Number(recommendedRefund),
  });
  if (error) throw error;
  return data;
}

export async function resolveDepositDispute({ disputeId, decision, refundAmount, note }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('resolve_deposit_dispute', {
    p_dispute_id: disputeId,
    p_decision: decision,
    p_refund_amount: Number(refundAmount),
    p_note: note,
  });
  if (error) throw error;
  return data;
}
