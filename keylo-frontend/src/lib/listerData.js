// ============================================================================
// KeyLo Lister data layer.
//
// Frontend-first store backed by localStorage so the full lister flow works
// today. Every function mirrors the async style of src/lib/supabaseData.js so
// the layer can later be swapped for Supabase tables (lister_profiles,
// lister_items, lister_requests, lister_earnings) without touching the UI.
//
// Storage keys are namespaced keylo_lister_* and never contain secrets.
// ============================================================================

const USERS_KEY = 'keylo_lister_users';
const SESSION_KEY = 'keylo_lister_session';
const ITEMS_KEY = 'keylo_lister_items';
const REQUESTS_KEY = 'keylo_lister_requests';
const LEDGER_KEY = 'keylo_lister_earnings';
const SETTINGS_KEY = 'keylo_lister_settings';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const listerCategories = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'phones', label: 'Phones' },
  { id: 'gadgets', label: 'Gadgets' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'sports', label: 'Sports Equipment' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'events', label: 'Event Equipment' },
  { id: 'other', label: 'Other' },
];

export const listerCategoryLabel = (categoryId) =>
  listerCategories.find((c) => c.id === categoryId)?.label || 'Other';

export const itemConditions = ['New', 'Like New', 'Good', 'Fair'];

// Category artwork used as photo fallbacks so every listing card looks rich.
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

// ─────────────────────────── Storage helpers ───────────────────────────

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// ─────────────────────────── Photo helper ───────────────────────────

// Reads an image file, downscales it to a compact JPEG data URL so photos
// stay inside localStorage limits. Swap with Supabase Storage later.
export function fileToDataUrl(file, maxDim = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Could not read that image. Try another file.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────── Auth ───────────────────────────

export function getListerSession() {
  return read(SESSION_KEY, null);
}

export function getListerProfile() {
  const session = getListerSession();
  if (!session) return null;
  const users = read(USERS_KEY, []);
  return users.find((u) => u.id === session.userId) || null;
}

export async function listerSignup({ name, email, phone, password, photo }) {
  await delay();
  const users = read(USERS_KEY, []);
  const existing = users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (existing) throw new Error('An account with this email already exists. Try signing in.');
  const user = {
    id: uid('lister'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: String(phone || '').trim(),
    password,
    photo: photo || null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  write(USERS_KEY, users);
  write(SESSION_KEY, { userId: user.id, createdAt: new Date().toISOString() });
  seedDemoData(user.id);
  return user;
}

export async function listerLogin({ email, password }) {
  await delay();
  const users = read(USERS_KEY, []);
  const user = users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || user.password !== password) throw new Error('Invalid email or password.');
  write(SESSION_KEY, { userId: user.id, createdAt: new Date().toISOString() });
  return user;
}

export async function listerLogout() {
  await delay(120);
  localStorage.removeItem(SESSION_KEY);
}

export async function updateListerProfile({ name, phone, photo }) {
  await delay();
  const session = getListerSession();
  if (!session) throw new Error('You are not signed in.');
  const users = read(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) throw new Error('Account not found.');
  if (name !== undefined) users[idx].name = String(name).trim();
  if (phone !== undefined) users[idx].phone = String(phone).trim();
  if (photo !== undefined) users[idx].photo = photo;
  write(USERS_KEY, users);
  return users[idx];
}

export function getListerSettings() {
  const session = getListerSession();
  if (!session) return null;
  const all = read(SETTINGS_KEY, {});
  return all[session.userId] || { publicProfile: true, emailAlerts: true, smsAlerts: false, payoutMode: 'upi', payoutDetail: '' };
}

export async function updateListerSettings(patch) {
  await delay(120);
  const session = getListerSession();
  if (!session) throw new Error('You are not signed in.');
  const all = read(SETTINGS_KEY, {});
  all[session.userId] = { ...getListerSettings(), ...patch };
  write(SETTINGS_KEY, all);
  return all[session.userId];
}

// ─────────────────────────── Items ───────────────────────────

export function getListerItems(listerId) {
  return read(ITEMS_KEY, []).filter((i) => i.listerId === listerId);
}

export function getListerItemById(itemId) {
  return read(ITEMS_KEY, []).find((i) => i.id === itemId) || null;
}

export async function createListerItem(lister, data) {
  await delay();
  const items = read(ITEMS_KEY, []);
  const item = {
    id: uid('item'),
    listerId: lister.id,
    name: data.name.trim(),
    category: data.category,
    description: data.description.trim(),
    photos: data.photos || [],
    pricePerDay: Number(data.pricePerDay) || 0,
    pricePerWeek: Number(data.pricePerWeek) || 0,
    deposit: Number(data.deposit) || 0,
    condition: data.condition,
    location: data.location.trim(),
    availability: data.availability === 'unavailable' ? 'unavailable' : 'available',
    rules: data.rules.trim(),
    fulfilment: data.fulfilment.trim(),
    timesRented: 0,
    status: 'available',
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  write(ITEMS_KEY, items);
  return item;
}

export async function updateListerItem(itemId, lister, data) {
  await delay();
  const items = read(ITEMS_KEY, []);
  const idx = items.findIndex((i) => i.id === itemId && i.listerId === lister.id);
  if (idx === -1) throw new Error('Listing not found.');
  const current = items[idx];
  items[idx] = {
    ...current,
    name: data.name.trim(),
    category: data.category,
    description: data.description.trim(),
    photos: data.photos || current.photos,
    pricePerDay: Number(data.pricePerDay) || 0,
    pricePerWeek: Number(data.pricePerWeek) || 0,
    deposit: Number(data.deposit) || 0,
    condition: data.condition,
    location: data.location.trim(),
    availability: data.availability === 'unavailable' ? 'unavailable' : 'available',
    rules: data.rules.trim(),
    fulfilment: data.fulfilment.trim(),
  };
  write(ITEMS_KEY, items);
  return items[idx];
}

export async function deleteListerItem(itemId, lister) {
  await delay();
  write(ITEMS_KEY, read(ITEMS_KEY, []).filter((i) => !(i.id === itemId && i.listerId === lister.id)));
}

// Items that are live on the public marketplace (available to rent).
export function getPublishedListerItems() {
  return read(ITEMS_KEY, []).filter((i) => i.availability === 'available');
}

// ─────────────────────────── Rental requests ───────────────────────────

export function getListerRequests(listerId) {
  return read(REQUESTS_KEY, [])
    .filter((r) => r.listerId === listerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getListerRequestById(requestId) {
  return read(REQUESTS_KEY, []).find((r) => r.id === requestId) || null;
}

export async function createRentalRequest({ itemId, renterName, renterEmail, startDate, endDate, message = '' }) {
  await delay();
  const item = getListerItemById(itemId);
  if (!item) throw new Error('This item is no longer listed.');
  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1);
  const amount = Math.round(item.pricePerDay * days);
  const renter = String(renterName || '').trim() || 'Student renter';
  const renterMail = String(renterEmail || '').trim() || 'renter@keylo.in';
  const requests = read(REQUESTS_KEY, []);
  const request = {
    id: uid('req'),
    listerId: item.listerId,
    itemId: item.id,
    itemName: item.name,
    renterName: renter,
    renterEmail: renterMail,
    startDate,
    endDate,
    days,
    amount,
    status: 'pending',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  write(REQUESTS_KEY, requests);
  return request;
}

export async function respondToRentalRequest(requestId, decision) {
  await delay();
  const requests = read(REQUESTS_KEY, []);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) throw new Error('Request not found.');
  if (requests[idx].status !== 'pending') throw new Error('This request was already handled.');
  requests[idx].status = decision; // 'accepted' | 'declined'
  requests[idx].respondedAt = new Date().toISOString();
  write(REQUESTS_KEY, requests);

  if (decision === 'accepted') {
    // Simulated payout + availability bookkeeping. Swap for a real transaction later.
    const items = read(ITEMS_KEY, []);
    const itemIdx = items.findIndex((i) => i.id === requests[idx].itemId);
    if (itemIdx !== -1) {
      items[itemIdx].timesRented += 1;
      items[itemIdx].status = 'rented';
      items[itemIdx].availability = 'unavailable';
      write(ITEMS_KEY, items);
    }
    const ledger = read(LEDGER_KEY, []);
    ledger.unshift({
      id: uid('earn'),
      listerId: requests[idx].listerId,
      itemId: requests[idx].itemId,
      itemName: requests[idx].itemName,
      amount: requests[idx].amount,
      label: `Rental payout · ${requests[idx].renterName}`,
      date: new Date().toISOString(),
    });
    write(LEDGER_KEY, ledger);
  }
  return requests[idx];
}

// ─────────────────────────── Earnings ───────────────────────────

export function getListerEarnings(listerId) {
  const ledger = read(LEDGER_KEY, []).filter((e) => e.listerId === listerId);
  const items = getListerItems(listerId);
  const byItem = items.map((item) => {
    const earned = ledger.filter((e) => e.itemId === item.id).reduce((sum, e) => sum + e.amount, 0);
    return { item, earned, rentals: item.timesRented };
  });
  return {
    total: ledger.reduce((sum, e) => sum + e.amount, 0),
    ledger,
    byItem: byItem.filter((row) => row.earned > 0 || row.rentals > 0),
  };
}

// ─────────────────────────── Demo seed ───────────────────────────

function seedDemoData(listerId) {
  const items = read(ITEMS_KEY, []);
  if (items.some((i) => i.listerId === listerId)) return;

  const mkItem = (overrides) => ({
    id: uid('item'),
    listerId,
    name: '',
    category: 'other',
    description: '',
    photos: [],
    pricePerDay: 0,
    pricePerWeek: 0,
    deposit: 0,
    condition: 'Good',
    location: 'Kolkata',
    availability: 'available',
    rules: '',
    fulfilment: 'Pickup preferred',
    timesRented: 0,
    status: 'available',
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  const camera = mkItem({
    name: 'Sony Alpha Camera Kit',
    category: 'cameras',
    description: 'Mirrorless kit with two lenses, spare battery and a carry case. Great for vlogs, shoots and events.',
    photos: [listerCategoryImages.cameras],
    pricePerDay: 550,
    pricePerWeek: 3000,
    deposit: 3000,
    condition: 'Like New',
    location: 'Jadavpur, Kolkata',
    fulfilment: 'Pickup from Jadavpur or paid delivery within Kolkata (₹99).',
    timesRented: 1,
  });
  const switchItem = mkItem({
    name: 'Nintendo Switch + Games',
    category: 'gaming',
    description: 'OLED model with two joy-con sets and Mario Kart / Smash cartridges. Perfect for hostel weekends.',
    photos: [listerCategoryImages.gaming],
    pricePerDay: 400,
    pricePerWeek: 2200,
    deposit: 2500,
    condition: 'Good',
    location: 'Salt Lake, Kolkata',
    fulfilment: 'Pickup from Salt Lake.',
  });

  items.push(camera, switchItem);
  write(ITEMS_KEY, items);

  const requests = read(REQUESTS_KEY, []);
  const now = Date.now();
  const iso = (offsetDays) => new Date(now + offsetDays * 86400000).toISOString().slice(0, 10);

  requests.push(
    {
      id: uid('req'),
      listerId,
      itemId: camera.id,
      itemName: camera.name,
      renterName: 'Riya Sen',
      renterEmail: 'riya.sen@demo.keylo.in',
      startDate: iso(3),
      endDate: iso(6),
      days: 4,
      amount: 2200,
      status: 'pending',
      message: 'Hi! Need it for a college fest shoot from the 14th. Happy to pick it up.',
      createdAt: new Date(now - 2 * 86400000).toISOString(),
    },
    {
      id: uid('req'),
      listerId,
      itemId: switchItem.id,
      itemName: switchItem.name,
      renterName: 'Arjun Mehta',
      renterEmail: 'arjun.mehta@demo.keylo.in',
      startDate: iso(9),
      endDate: iso(15),
      days: 7,
      amount: 2800,
      status: 'pending',
      message: 'Need it for a week while my friends visit. Can pick up on Friday evening.',
      createdAt: new Date(now - 1 * 86400000).toISOString(),
    },
    {
      id: uid('req'),
      listerId,
      itemId: camera.id,
      itemName: camera.name,
      renterName: 'Sneha Roy',
      renterEmail: 'sneha.roy@demo.keylo.in',
      startDate: iso(-12),
      endDate: iso(-10),
      days: 3,
      amount: 1650,
      status: 'accepted',
      message: 'For a documentary assignment. Thanks!',
      createdAt: new Date(now - 15 * 86400000).toISOString(),
    }
  );
  write(REQUESTS_KEY, requests);

  const ledger = read(LEDGER_KEY, []);
  ledger.unshift({
    id: uid('earn'),
    listerId,
    itemId: camera.id,
    itemName: camera.name,
    amount: 1650,
    label: 'Rental payout · Sneha Roy',
    date: new Date(now - 9 * 86400000).toISOString(),
  });
  write(LEDGER_KEY, ledger);
}

export const listerMoney = inr;

// ─────────────────────────── Password & account ───────────────────────────

export async function changeListerPassword({ current, next }) {
  await delay();
  const session = getListerSession();
  if (!session) throw new Error('You are not signed in.');
  const users = read(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) throw new Error('Account not found.');
  if (users[idx].password !== current) throw new Error('Current password is incorrect.');
  if (!next || String(next).length < 8) throw new Error('New password must be at least 8 characters.');
  users[idx].password = String(next);
  write(USERS_KEY, users);
  return true;
}

export async function deleteListerAccount() {
  await delay();
  const session = getListerSession();
  if (!session) throw new Error('You are not signed in.');
  const userId = session.userId;
  write(USERS_KEY, read(USERS_KEY, []).filter((u) => u.id !== userId));
  write(ITEMS_KEY, read(ITEMS_KEY, []).filter((i) => i.listerId !== userId));
  write(REQUESTS_KEY, read(REQUESTS_KEY, []).filter((r) => r.listerId !== userId));
  write(LEDGER_KEY, read(LEDGER_KEY, []).filter((e) => e.listerId !== userId));
  const allSettings = read(SETTINGS_KEY, {});
  delete allSettings[userId];
  write(SETTINGS_KEY, allSettings);
  localStorage.removeItem(SESSION_KEY);
  return true;
}
