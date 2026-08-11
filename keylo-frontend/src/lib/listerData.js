import { supabase } from './supabase';

export const listerCategories = [
  { id: 'electronics', label: 'Electronics' }, { id: 'cameras', label: 'Cameras' }, { id: 'gaming', label: 'Gaming' },
  { id: 'laptops', label: 'Laptops' }, { id: 'phones', label: 'Phones' }, { id: 'gadgets', label: 'Gadgets' },
  { id: 'bikes', label: 'Bikes' }, { id: 'sports', label: 'Sports Equipment' }, { id: 'furniture', label: 'Furniture' },
  { id: 'events', label: 'Event Equipment' }, { id: 'other', label: 'Other' },
];
export const listerCategoryLabel = (id) => listerCategories.find((category) => category.id === id)?.label || 'Other';
export const itemConditions = ['New', 'Like New', 'Good', 'Fair'];
export const listerCategoryImages = {
  electronics: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85',
  cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
  gaming: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=85',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85',
  gadgets: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
  bikes: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=1000&q=85',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=85',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
  events: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=85',
  other: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=85',
};

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase;
};
const user = async () => {
  const { data, error } = await requireClient().auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('You are not signed in.');
  return data.user;
};
const mapProfile = (row, authUser) => row && ({ id: row.id, name: row.display_name, email: authUser?.email || '', phone: row.phone || '', photo: row.avatar_url || '' });
const mapItem = (row) => ({ ...row, listerId: row.lister_id, pricePerDay: Number(row.price_per_day), pricePerWeek: Number(row.price_per_week), timesRented: row.times_rented, createdAt: row.created_at, updatedAt: row.updated_at });
const mapRequest = (row) => ({ ...row, listerId: row.lister_id, itemId: row.item_id, renterName: row.renter_name, renterEmail: row.renter_email, startDate: row.start_date, endDate: row.end_date, createdAt: row.created_at, respondedAt: row.responded_at });
const mapSetting = (row) => ({ publicProfile: row?.public_profile ?? true, emailAlerts: row?.email_alerts ?? true, smsAlerts: row?.sms_alerts ?? false, payoutMode: row?.payout_mode || 'upi', payoutDetail: row?.payout_detail || '' });

export function fileToDataUrl(file, maxDim = 800, quality = 0.72) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { const img = new Image(); img.onload = () => { const scale = Math.min(1, maxDim / Math.max(img.width, img.height)); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale)); canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL('image/jpeg', quality)); }; img.onerror = () => reject(new Error('Could not read that image. Try another file.')); img.src = reader.result; }; reader.onerror = () => reject(new Error('Could not read that file.')); reader.readAsDataURL(file); });
}

export async function getListerSession() { const { data } = await requireClient().auth.getSession(); return data.session?.user || null; }
export async function getListerProfile() { const authUser = await user(); const { data, error } = await requireClient().from('lister_profiles').select('*').eq('id', authUser.id).maybeSingle(); if (error) throw error; return mapProfile(data, authUser); }
export async function listerSignup({ name, email, phone, password, photo }) { const client = requireClient(); const { data, error } = await client.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { role: 'lister', full_name: name.trim(), phone: String(phone || '').trim(), avatar_url: photo || null } } }); if (error) throw error; if (!data.session) throw new Error('Account created. Check your email to confirm your account, then sign in.'); return mapProfile({ id: data.user.id, display_name: name, phone, avatar_url: photo }, data.user); }
export async function listerLogin({ email, password }) { const { error } = await requireClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password }); if (error) throw error; return getListerProfile(); }
export async function listerLogout() { const { error } = await requireClient().auth.signOut(); if (error) throw error; }
export async function updateListerProfile({ name, phone, photo }) { const authUser = await user(); const { data, error } = await requireClient().from('lister_profiles').update({ display_name: String(name).trim(), phone: String(phone || '').trim(), avatar_url: photo || null, updated_at: new Date().toISOString() }).eq('id', authUser.id).select().single(); if (error) throw error; await requireClient().from('profiles').update({ full_name: String(name).trim(), phone: String(phone || '').trim() }).eq('id', authUser.id); return mapProfile(data, authUser); }
export async function getListerSettings() { const authUser = await user(); const { data, error } = await requireClient().from('lister_settings').select('*').eq('lister_id', authUser.id).maybeSingle(); if (error) throw error; return mapSetting(data); }
export async function updateListerSettings(patch) { const authUser = await user(); const values = { lister_id: authUser.id, public_profile: patch.publicProfile, email_alerts: patch.emailAlerts, sms_alerts: patch.smsAlerts, payout_mode: patch.payoutMode, payout_detail: patch.payoutDetail, updated_at: new Date().toISOString() }; Object.keys(values).forEach((key) => values[key] === undefined && delete values[key]); const { data, error } = await requireClient().from('lister_settings').upsert(values).select().single(); if (error) throw error; return mapSetting(data); }

export async function getListerItems(listerId) { const { data, error } = await requireClient().from('lister_items').select('*').eq('lister_id', listerId).order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapItem); }
export async function getListerItemById(itemId) { const { data, error } = await requireClient().from('lister_items').select('*').eq('id', itemId).maybeSingle(); if (error) throw error; return data ? mapItem(data) : null; }
const itemPayload = (data, listerId) => ({ lister_id: listerId, name: data.name.trim(), category: data.category, description: data.description.trim(), photos: data.photos || [], price_per_day: Number(data.pricePerDay) || 0, price_per_week: Number(data.pricePerWeek) || 0, deposit: Number(data.deposit) || 0, condition: data.condition, location: data.location.trim(), availability: data.availability === 'unavailable' ? 'unavailable' : 'available', status: data.status || 'available', rules: data.rules?.trim() || '', fulfilment: data.fulfilment?.trim() || '', updated_at: new Date().toISOString() });
export async function createListerItem(lister, data) { const { data: row, error } = await requireClient().from('lister_items').insert(itemPayload(data, lister.id)).select().single(); if (error) throw error; return mapItem(row); }
export async function updateListerItem(itemId, lister, data) { const { data: row, error } = await requireClient().from('lister_items').update(itemPayload(data, lister.id)).eq('id', itemId).eq('lister_id', lister.id).select().single(); if (error) throw error; return mapItem(row); }
export async function deleteListerItem(itemId, lister) { const { error } = await requireClient().from('lister_items').delete().eq('id', itemId).eq('lister_id', lister.id); if (error) throw error; }
export async function getPublishedListerItems() { if (!supabase) return []; const { data, error } = await supabase.from('lister_items').select('*').eq('availability', 'available').order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapItem); }

// Public contact details for the person who listed an item, exposed through a
// guarded RPC (lister_profiles is RLS-private). Returns { name, phone } or
// null when unavailable; phone is omitted unless the lister opted into a
// public profile. Errors degrade to null so the page renders gracefully.
export async function getPublicLister(itemId) {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_public_lister', { p_item_id: itemId });
  if (error) return null;
  return data || null;
}

export async function getListerRequests(listerId) { const { data, error } = await requireClient().from('lister_requests').select('*').eq('lister_id', listerId).order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapRequest); }
export async function createRentalRequest({ itemId, startDate, endDate, message = '' }) { const { data, error } = await requireClient().rpc('create_lister_request', { p_item_id: itemId, p_start_date: startDate, p_end_date: endDate, p_message: message }); if (error) throw error; return mapRequest(data); }
export async function respondToRentalRequest(requestId, decision) { const { data, error } = await requireClient().rpc('respond_to_lister_request', { p_request_id: requestId, p_decision: decision }); if (error) throw error; return mapRequest(data); }
export async function getListerEarnings(listerId) { const client = requireClient(); const [{ data: ledger, error: ledgerError }, { data: items, error: itemError }] = await Promise.all([client.from('lister_earnings').select('*').eq('lister_id', listerId).order('created_at', { ascending: false }), client.from('lister_items').select('*').eq('lister_id', listerId)]); if (ledgerError || itemError) throw ledgerError || itemError; const mappedLedger = (ledger || []).map((entry) => ({ ...entry, itemId: entry.item_id, itemName: entry.item_name, date: entry.created_at })); const mappedItems = (items || []).map(mapItem); return { total: mappedLedger.reduce((sum, entry) => sum + Number(entry.amount), 0), ledger: mappedLedger, byItem: mappedItems.map((item) => ({ item, earned: mappedLedger.filter((entry) => entry.itemId === item.id).reduce((sum, entry) => sum + Number(entry.amount), 0), rentals: item.timesRented })).filter((row) => row.earned > 0 || row.rentals > 0) }; }
export async function changeListerPassword({ current, next }) { if (!current || !next || next.length < 8) throw new Error('New password must be at least 8 characters.'); const authUser = await user(); const client = requireClient(); const { error: signInError } = await client.auth.signInWithPassword({ email: authUser.email, password: current }); if (signInError) throw new Error('Current password is incorrect.'); const { error } = await client.auth.updateUser({ password: next }); if (error) throw error; return true; }
export async function deleteListerAccount() { await user(); const { error } = await requireClient().rpc('delete_lister_account'); if (error) throw error; await requireClient().auth.signOut(); return true; }
export const listerMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
