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

export async function getSavedRentalIds() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return {};
  const { data, error } = await client.from('saved_rentals').select('item_id').eq('student_id', userData.user.id);
  if (error?.code === '42P01') return {};
  if (error) throw error;
  return (data || []).reduce((acc, row) => ({ ...acc, [row.item_id]: true }), {});
}

export async function toggleSavedRental(itemId) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to save a rental.');
  const existing = await client.from('saved_rentals').select('item_id').eq('student_id', userData.user.id).eq('item_id', Number(itemId)).maybeSingle();
  if (existing.error?.code === '42P01') throw new Error('Wishlist is not available until the latest database migration is applied.');
  if (existing.error) throw existing.error;
  if (existing.data) {
    const { error } = await client.from('saved_rentals').delete().eq('student_id', userData.user.id).eq('item_id', Number(itemId));
    if (error) throw error;
    return { saved: false };
  }
  const { error } = await client.from('saved_rentals').insert({ student_id: userData.user.id, item_id: Number(itemId) });
  if (error) throw error;
  return { saved: true };
}

export async function getWishlistData() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to view your wishlist.');
  const [properties, rentals] = await Promise.all([
    client.from('saved_properties').select('created_at, properties(id, name, area, city, property_type, monthly_rent, security_deposit, cover_image_url, profiles!properties_owner_id_fkey(full_name, owner_rating), universities(name))').eq('student_id', userData.user.id).order('created_at', { ascending: false }),
    client.from('saved_rentals').select('item_id, created_at').eq('student_id', userData.user.id).order('created_at', { ascending: false }),
  ]);
  if (rentals.error?.code === '42P01') return { properties: properties.data || [], rentals: [] };
  const failed = [properties, rentals].find((result) => result.error);
  if (failed) throw failed.error;
  return { properties: properties.data || [], rentals: rentals.data || [] };
}

export async function getDashboardData() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to view dashboard data.');

  const [bookings, saved, messages, rentals] = await Promise.all([
    client.from('bookings').select('*, properties(name, area, city, owner_id), deposits(*)').eq('student_id', userData.user.id).order('created_at', { ascending: false }),
    client.from('saved_properties').select('property_id, properties(*, profiles!properties_owner_id_fkey(owner_rating))').eq('student_id', userData.user.id),
    // Conversations include both messages we sent and messages we received,
    // enriched with counterpart names/emails via the security-definer RPC.
    client.rpc('get_student_messages'),
    client.from('rentals').select('*').eq('student_id', userData.user.id).order('created_at', { ascending: false }),
  ]);
  const rentalResult = rentals.error?.code === '42P01' ? { data: [], error: null } : rentals;
  const messagesResult = messages.error && ['42883', '42P01'].includes(messages.error.code)
    ? await client.from('messages').select('*').or(`sender_id.eq.${userData.user.id},recipient_id.eq.${userData.user.id}`).order('created_at', { ascending: false })
    : messages;
  const failed = [bookings, saved, messagesResult, rentalResult].find((result) => result.error);
  if (failed) throw failed.error;
  return { user: userData.user, bookings: bookings.data || [], saved: saved.data || [], messages: messagesResult.data || [], rentals: rentalResult.data || [] };
}

// The signed-in user's messages (any role) with counterpart identity attached.
export async function getStudentMessages() {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_student_messages');
  if (error) throw error;
  return data || [];
}

// A landlord's messages, scoped to bookings on their own properties.
export async function getOwnerMessages() {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_owner_messages');
  if (error) throw error;
  return data || [];
}

// Mark all messages from a conversation partner on a booking as read.
export async function markMessagesRead({ bookingId, fromId }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('mark_messages_read', {
    p_booking_id: bookingId,
    p_from: fromId,
  });
  if (error) throw error;
  return data;
}

// Send a real message row. The recipient is the landlord of one of the
// student's bookings; the message stays attached to that booking so it
// survives reloads and appears in both parties' dashboards.
export async function sendMessage({ bookingId, recipientId, body }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to send a message.');
  const text = String(body || '').trim();
  if (!text) throw new Error('Message cannot be empty.');

  const { data, error } = await client.from('messages').insert({
    booking_id: bookingId,
    sender_id: userData.user.id,
    recipient_id: recipientId,
    body: text,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getUnreadMessageCount() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return 0;
  const { count, error } = await client
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', userData.user.id)
    .is('read_at', null);
  if (error) throw error;
  return count || 0;
}

// The student's most recent non-cancelled booking with its property, used by
// the digital handover flow and the message composer.
export async function getHandoverBooking() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in.');
  const { data, error } = await client
    .from('bookings')
    .select('id, status, move_in_date, property_id, properties(name, area, owner_id)')
    .eq('student_id', userData.user.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function completeHandover({ bookingId, checklist }) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to complete a handover.');

  const { data, error } = await client.from('handover_records').upsert({
    booking_id: bookingId,
    student_id: userData.user.id,
    checklist: checklist || { room_condition: true, meter_readings: true, agreement_signed: true },
    signed_at: new Date().toISOString(),
  }, { onConflict: 'booking_id' }).select().single();
  if (error) throw error;
  return data;
}

export async function createProperty({
  name, universityId, area, address = '', propertyType = 'pg', monthlyRent,
  securityDeposit, distance, description = '', latitude = null, longitude = null,
  coverImageUrl = null, images = [], amenities = [], extraServices = [], status = 'draft'
}) {
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

  const latNum = latitude != null && latitude !== '' ? Number(latitude) : null;
  const lngNum = longitude != null && longitude !== '' ? Number(longitude) : null;

  const { data, error } = await client.from('properties').insert({
    owner_id: userData.user.id,
    university_id: universityId,
    name,
    property_type: propertyType,
    area,
    address,
    city: 'Kolkata',
    description,
    monthly_rent: rent,
    security_deposit: deposit,
    distance_to_university_km: distanceKm,
    latitude: latNum,
    longitude: lngNum,
    cover_image_url: coverImageUrl || (images.length > 0 ? images[0] : null),
    images: images || [],
    amenities: amenities || [],
    extra_services: extraServices || [],
    status: status || 'draft',
    trust_score: 50,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function updateProperty(propertyId, updates) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in as a landlord to edit a property.');

  const payload = { ...updates, updated_at: new Date().toISOString() };

  if (payload.monthlyRent !== undefined) {
    payload.monthly_rent = Number(payload.monthlyRent);
    delete payload.monthlyRent;
  }
  if (payload.securityDeposit !== undefined) {
    payload.security_deposit = Number(payload.securityDeposit);
    delete payload.securityDeposit;
  }
  if (payload.distance !== undefined) {
    payload.distance_to_university_km = Number(payload.distance);
    delete payload.distance;
  }
  if (payload.universityId !== undefined) {
    payload.university_id = payload.universityId;
    delete payload.universityId;
  }
  if (payload.propertyType !== undefined) {
    payload.property_type = payload.propertyType;
    delete payload.propertyType;
  }
  if (payload.coverImageUrl !== undefined) {
    payload.cover_image_url = payload.coverImageUrl;
    delete payload.coverImageUrl;
  }
  if (payload.extraServices !== undefined) {
    payload.extra_services = payload.extraServices;
    delete payload.extraServices;
  }
  if (payload.latitude !== undefined) {
    payload.latitude = payload.latitude != null && payload.latitude !== '' ? Number(payload.latitude) : null;
  }
  if (payload.longitude !== undefined) {
    payload.longitude = payload.longitude != null && payload.longitude !== '' ? Number(payload.longitude) : null;
  }

  const { data, error } = await client
    .from('properties')
    .update(payload)
    .eq('id', propertyId)
    .eq('owner_id', userData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function togglePropertyStatus(propertyId, status) {
  return updateProperty(propertyId, { status });
}

export async function deleteProperty(propertyId) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in as a landlord to delete a property.');

  const { error } = await client
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('owner_id', userData.user.id);

  if (error) throw error;
  return { success: true };
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

export async function getOwnerWorkspaceData() {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_owner_workspace');
  if (error) throw error;
  return data || { properties: [], bookings: [], tenants: [], deposits: [], messages: [] };
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

export async function getAdminUsers() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('id, full_name, role, phone, is_verified, owner_rating, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAdminAnalytics() {
  const client = requireSupabase();
  const [profiles, properties, bookings, deposits, payments] = await Promise.all([
    client.from('profiles').select('role, is_verified'),
    client.from('properties').select('status, trust_score'),
    client.from('bookings').select('status, rent_amount, tenant_first_booking_fee, landlord_commission_rate'),
    client.from('deposits').select('status, amount'),
    client.from('payments').select('payment_type, amount, status'),
  ]);
  const failed = [profiles, properties, bookings, deposits, payments].find((result) => result.error);
  if (failed) throw failed.error;
  return {
    users: profiles.data || [],
    properties: properties.data || [],
    bookings: bookings.data || [],
    deposits: deposits.data || [],
    payments: payments.data || [],
  };
}

export async function getAdminOverview() {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_admin_overview');
  if (error) throw error;
  return data || {
    users: [], properties: [], bookings: [], rentals: [], payments: [],
    deposits: [], disputes: [], reviews: [],
  };
}

export async function getPropertyReviews(propertyId) {
  const client = requireSupabase();
  const property = await getPropertyById(propertyId);
  if (!property) return [];
  const { data, error } = await client
    .from('reviews')
    .select('id, property_id, student_id, rating, comment, created_at, updated_at, profiles!reviews_student_id_fkey(full_name)')
    .eq('property_id', property.id)
    .order('created_at', { ascending: false });
  if (error?.code === '42P01') return [];
  if (error) throw error;
  return data || [];
}

export async function getReviewStats() {
  const client = requireSupabase();
  const { data, error } = await client.from('reviews').select('property_id, rating');
  if (error?.code === '42P01') return {};
  if (error) throw error;
  return (data || []).reduce((stats, review) => {
    const current = stats[review.property_id] || { count: 0, total: 0 };
    current.count += 1;
    current.total += Number(review.rating);
    stats[review.property_id] = current;
    return stats;
  }, {});
}

export async function submitReview({ propertyId, rating, comment }) {
  const client = requireSupabase();
  const property = await getPropertyById(propertyId);
  if (!property) throw new Error('Property not found');
  const { data, error } = await client.rpc('submit_review', {
    p_property_id: property.id,
    p_rating: Number(rating),
    p_comment: comment,
  });
  if (error) throw error;
  return data;
}

export async function createRentalBooking({ itemId, duration, startDate, fulfilment, address }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('create_rental_booking', {
    p_item_id: Number(itemId),
    p_duration: Number(duration),
    p_start_date: startDate,
    p_fulfilment: fulfilment,
    p_address: address || null,
  });
  if (error) throw error;
  return data;
}

export async function getMyRentals() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to view rentals.');
  const { data, error } = await client.from('rentals').select('*').eq('student_id', userData.user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Vault / Deposit data ─────────────────────────────────────────────────────
// Fetches the student's active bookings with their held deposits, plus any
// open disputes, so the KeyLo Vault page can show real balances and actions.

export async function getVaultData() {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in to view the vault.');

  // Active bookings (confirmed, active, or completed) with their deposit and property
  const bookings = await client
    .from('bookings')
    .select('*, properties(id, name, area, city, cover_image_url, trust_score), deposits(*)')
    .eq('student_id', userData.user.id)
    .in('status', ['confirmed', 'active', 'completed'])
    .order('created_at', { ascending: false });

  // Open disputes for this student
  const disputes = await client
    .from('disputes')
    .select('*, bookings(id, property_id, deposits(status, amount))')
    .eq('student_id', userData.user.id)
    .in('status', ['open', 'responding'])
    .order('created_at', { ascending: false });

  const bookingsData = bookings.error?.code === '42P01' ? { data: [], error: null } : bookings;
  const disputesData = disputes.error?.code === '42P01' ? { data: [], error: null } : disputes;

  const failed = [bookingsData, disputesData].find((r) => r.error);
  if (failed) throw failed.error;

  return {
    bookings: bookingsData.data || [],
    disputes: disputesData.data || [],
  };
}

// Request release of a held deposit (moves it to release_pending status).
export async function requestDepositRelease(bookingId) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in.');

  const { data, error } = await client
    .from('deposits')
    .update({
      status: 'release_pending',
      release_requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('booking_id', bookingId)
    .select('id, status')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('No deposit found for this booking.');
  return data;
}

// Open a deposit dispute for a booking.
export async function createDepositDispute({ bookingId, reason, evidenceUrls = [] }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('open_deposit_dispute', {
    p_booking_id: bookingId,
    p_reason: reason,
    p_evidence_urls: evidenceUrls,
  });
  if (error) throw error;
  return data;
}

// ── Admin Vault Management ───────────────────────────────────────────────────

export async function getAdminVaultData() {
  const client = requireSupabase();
  if (!client) throw new Error('Supabase not configured');
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in.');

  // Check admin role
  const { data: profile } = await client.from('profiles').select('role').eq('id', userData.user.id).maybeSingle();
  if (!profile || profile.role !== 'admin') throw new Error('Admin access required');

  // Fetch all bookings with tenant and property info
  const bookingsResult = await client
    .from('bookings')
    .select('*, properties(id, name, area, city), tenant:profiles!student_id(full_name)')
    .order('created_at', { ascending: false });

  // Fetch all deposits with tenant and property info
  const depositsResult = await client
    .from('deposits')
    .select('*, booking_id, booking:bookings(id, student_id, property_id, status, move_in_date), tenant:profiles!bookings(student_id)(full_name), property:properties(name, area)')
    .order('created_at', { ascending: false });

  // Fetch open disputes
  const disputesResult = await client
    .from('disputes')
    .select('*, property:properties(name), tenant:profiles!disputes_student_id_fkey(full_name), landlord:profiles!disputes_landlord_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  const bookings = bookingsResult.error?.code === '42P01' ? [] : (bookingsResult.data || []);
  const deposits = depositsResult.error?.code === '42P01' ? [] : (depositsResult.data || []);
  const disputes = disputesResult.error?.code === '42P01' ? [] : (disputesResult.data || []);

  return { bookings, deposits, disputes };
}

// Admin releases a held deposit directly
export async function releaseDeposit(bookingId) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be signed in.');

  // Check admin role
  const { data: profile } = await client.from('profiles').select('role').eq('id', userData.user.id).maybeSingle();
  if (!profile || profile.role !== 'admin') throw new Error('Admin access required');

  const { data, error } = await client
    .from('deposits')
    .update({
      status: 'released',
      released_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('booking_id', bookingId)
    .select('id, status')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Deposit not found for this booking.');
  return data;
}
