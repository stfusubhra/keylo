import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  createProperty,
  updateProperty,
  togglePropertyStatus,
  deleteProperty,
  getOwnerMessages,
  getOwnerWorkspaceData,
  listUniversities,
  markMessagesRead,
  sendMessage,
} from '../lib/supabaseData';
import { formatDate, formatDateTime } from '../lib/format';
import PropertyLocationMap from '../components/ui/PropertyLocationMap';

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
];

const PRESET_ADDONS = [
  { name: 'High-Speed Wi-Fi (100 Mbps)', price: 499, period: '/month' },
  { name: 'Daily Tiffin / Meal Plan (2 Meals)', price: 3200, period: '/month' },
  { name: 'Weekly Laundry & Ironing', price: 800, period: '/month' },
  { name: 'AC Usage Unlimited Unit', price: 1500, period: '/month' },
  { name: 'Reserved Two-Wheeler Parking', price: 500, period: '/month' },
];

const PRESET_AMENITIES = [
  'Gigabit Wi-Fi', 'Daily Housekeeping', 'In-house Laundry', '24/7 Security',
  'Power Backup', 'Air Conditioned', 'Attached Washroom', 'Study Desk',
  'Refrigerator', 'Water Purifier', 'CCTV Security', 'Elevator'
];

const emptyForm = {
  id: null,
  name: '',
  universityId: '',
  area: '',
  address: '',
  propertyType: 'pg',
  monthlyRent: '',
  securityDeposit: '',
  distance: '',
  description: '',
  latitude: '',
  longitude: '',
  coverImageUrl: '',
  images: [],
  amenities: ['Gigabit Wi-Fi', 'Daily Housekeeping', '24/7 Security'],
  extraServices: [],
  status: 'published',
};

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function Status({ value }) {
  const styles = {
    confirmed: 'bg-acid-lime text-primary',
    active: 'bg-acid-lime text-primary',
    published: 'bg-acid-lime text-primary',
    held: 'bg-acid-lime text-primary',
    paused: 'bg-[#F59E0B] text-primary',
    draft: 'bg-surface-container text-primary',
    disputed: 'bg-hot-pink text-white',
    archived: 'bg-error/20 text-error border-error',
  };
  return (
    <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${styles[value] || 'bg-surface-container text-primary'}`}>
      {value}
    </span>
  );
}

// Distance calculation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function PropertyForm({ universities, initialForm, onSubmit, onClose }) {
  const [form, setForm] = useState(initialForm || emptyForm);
  const [activeTab, setActiveTab] = useState('basic');
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locMsg, setLocMsg] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAddon, setNewAddon] = useState({ name: '', price: '', period: '/month' });

  // Handle University Change & auto-distance calculation
  const handleUniversityChange = (uId) => {
    const selectedUniv = universities.find((u) => u.id === uId);
    let dist = form.distance;
    if (selectedUniv && selectedUniv.latitude && selectedUniv.longitude && form.latitude && form.longitude) {
      const computed = calculateDistance(
        Number(form.latitude), Number(form.longitude),
        Number(selectedUniv.latitude), Number(selectedUniv.longitude)
      );
      if (computed) dist = computed;
    }
    setForm((prev) => ({ ...prev, universityId: uId, distance: dist }));
  };

  // Location Auto Fetching via Browser Geolocation API
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocMsg('Geolocation is not supported by your browser.');
      return;
    }
    setFetchingLocation(true);
    setLocMsg('Requesting GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setLocMsg('Location retrieved! Fetching address...');

        let address = form.address;
        let area = form.area;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          if (res.ok) {
            const data = await res.json();
            if (data.address) {
              area = data.address.suburb || data.address.neighbourhood || data.address.residential || data.address.city_district || area;
              address = data.display_name || address;
            }
          }
        } catch {
          // Fallback gracefully if reverse lookup fails
        }

        // Auto compute distance if university is selected
        let dist = form.distance;
        const selectedUniv = universities.find((u) => u.id === form.universityId);
        if (selectedUniv && selectedUniv.latitude && selectedUniv.longitude) {
          const computed = calculateDistance(Number(lat), Number(lng), Number(selectedUniv.latitude), Number(selectedUniv.longitude));
          if (computed) dist = computed;
        }

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          area: area || prev.area,
          address: address || prev.address,
          distance: dist || prev.distance,
        }));
        setFetchingLocation(false);
        setLocMsg('Location auto-populated successfully!');
      },
      (err) => {
        setFetchingLocation(false);
        setLocMsg(`Unable to retrieve location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Images Handlers
  const handleAddImage = (url) => {
    const targetUrl = url || newImageUrl;
    if (!targetUrl?.trim()) return;
    const cleanUrl = targetUrl.trim();
    setForm((prev) => {
      const updatedImages = prev.images.includes(cleanUrl) ? prev.images : [...prev.images, cleanUrl];
      const cover = prev.coverImageUrl || cleanUrl;
      return { ...prev, images: updatedImages, coverImageUrl: cover };
    });
    if (!url) setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      let cover = prev.coverImageUrl;
      if (cover === prev.images[index]) {
        cover = updated.length ? updated[0] : '';
      }
      return { ...prev, images: updated, coverImageUrl: cover };
    });
  };

  const handleSetCover = (url) => {
    setForm((prev) => ({ ...prev, coverImageUrl: url }));
  };

  // Add-ons Handlers
  const handleAddService = (service) => {
    if (!service.name?.trim() || !service.price) return;
    const item = {
      name: service.name.trim(),
      price: Number(service.price),
      period: service.period || '/month',
    };
    setForm((prev) => ({ ...prev, extraServices: [...prev.extraServices, item] }));
    setNewAddon({ name: '', price: '', period: '/month' });
  };

  const handleRemoveService = (index) => {
    setForm((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((_, i) => i !== index),
    }));
  };

  // Amenity Toggle
  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  const isEdit = Boolean(form.id);

  return (
    <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-md md:p-lg backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#C7F000] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-lg py-md border-b-2 border-primary bg-surface-container">
          <div>
            <p className="font-label-caps text-label-caps text-electric-purple uppercase">
              {isEdit ? 'Update Property' : 'New Property Upload'}
            </p>
            <h2 className="font-h3 text-h3 text-primary">
              {isEdit ? `Edit "${form.name}"` : 'Add a Kolkata Student Property'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-xs hover:bg-surface border-2 border-primary rounded" aria-label="Close modal">
            <span className="material-symbols-outlined text-primary block">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-primary bg-surface-container-lowest overflow-x-auto">
          {[
            ['basic', '1. Basic & Pricing', 'storefront'],
            ['location', '2. Location & Campus', 'location_on'],
            ['images', '3. Photos & Media', 'photo_library'],
            ['amenities', '4. Amenities', 'checklist'],
            ['services', '5. Extra Paid Services', 'add_shopping_cart'],
          ].map(([tabKey, label, icon]) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className={`px-md py-md font-label-caps text-label-caps whitespace-nowrap flex items-center gap-xs border-r-2 border-primary transition-colors ${
                activeTab === tabKey ? 'bg-acid-lime text-primary font-bold' : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex-1 overflow-y-auto p-lg flex flex-col justify-between">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-caps text-label-caps text-primary">Property Title / Name *</span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Lake View Student PG - Jadavpur"
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Property Type</span>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                >
                  <option value="pg">PG (Paying Guest / Co-Living)</option>
                  <option value="flat">Flat (1BHK / 2BHK Apartment)</option>
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Listing Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary font-bold"
                >
                  <option value="published">Published (Active & Visible)</option>
                  <option value="paused">Paused (Hidden from Stays)</option>
                  <option value="draft">Draft (Incomplete)</option>
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Monthly Rent (₹) *</span>
                <input
                  required
                  type="number"
                  min="500"
                  name="monthlyRent"
                  value={form.monthlyRent}
                  onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
                  placeholder="8500"
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Security Deposit (₹) *</span>
                <input
                  required
                  type="number"
                  min="0"
                  name="securityDeposit"
                  value={form.securityDeposit}
                  onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
                  placeholder="10000"
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Property Description</span>
                <textarea
                  required
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your student stay, room furnishings, security, proximity to food markets..."
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
              </label>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="flex flex-col gap-lg">
              {/* GPS Auto Fetch Banner */}
              <div className="bg-primary text-on-primary border-2 border-primary p-md flex flex-col md:flex-row items-start md:items-center justify-between gap-md shadow-[4px_4px_0px_0px_#C7F000]">
                <div>
                  <h3 className="font-h3 text-h3 text-acid-lime flex items-center gap-xs">
                    <span className="material-symbols-outlined">my_location</span>
                    Auto-Fetch Geolocation
                  </h3>
                  <p className="font-body-md text-body-md text-on-primary/80">
                    Use your device GPS to auto-detect precise coordinates, address, and campus distance.
                  </p>
                  {locMsg && <p className="font-label-caps text-xs text-acid-lime mt-xs">{locMsg}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={fetchingLocation}
                  className="px-lg py-md bg-acid-lime border-2 border-on-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 transition-transform disabled:opacity-50 flex items-center gap-xs whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">location_searching</span>
                  {fetchingLocation ? 'Locating...' : 'Use Current Location'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Nearest University Campus *</span>
                  <select
                    required
                    name="universityId"
                    value={form.universityId}
                    onChange={(e) => handleUniversityChange(e.target.value)}
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  >
                    <option value="">Choose university</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.area})</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Distance to Campus (km) *</span>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    name="distance"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="0.8"
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  />
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Area / Locality *</span>
                  <input
                    required
                    name="area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="e.g. Jadavpur, Lake Gardens, New Town"
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  />
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Street Address / Landmark</span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. 42B Raja SC Mullick Road, near Jadavpur Gate 3"
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  />
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Latitude (GPS Coordinate)</span>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    placeholder="22.4988"
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  />
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Longitude (GPS Coordinate)</span>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    placeholder="88.3712"
                    className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                  />
                </label>
              </div>

              {/* Live Map Preview */}
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-xs">Location Map Preview</p>
                <PropertyLocationMap
                  lat={form.latitude ? Number(form.latitude) : 22.4988}
                  lng={form.longitude ? Number(form.longitude) : 88.3712}
                  name={form.name || 'Your Property'}
                  area={form.area || 'Kolkata'}
                  distance={form.distance ? `${form.distance} km` : ''}
                />
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="flex flex-col gap-lg">
              {/* Cover Photo URL */}
              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-primary">Main Cover Photo URL</span>
                <input
                  name="coverImageUrl"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
              </label>

              {/* Add Custom Image URL */}
              <div className="flex gap-sm">
                <input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Add photo URL to gallery..."
                  className="flex-1 border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"
                />
                <button
                  type="button"
                  onClick={() => handleAddImage()}
                  className="px-lg py-md bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary"
                >
                  + Add Photo
                </button>
              </div>

              {/* Preset Gallery Picker */}
              <div>
                <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">
                  Or pick from high-res student housing photo library:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-sm">
                  {PRESET_PHOTOS.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => handleAddImage(url)}
                      className="border-2 border-primary rounded overflow-hidden h-20 relative group hover:opacity-90"
                    >
                      <img loading="lazy" src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-primary/40 text-on-primary font-label-caps text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        + Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Images Thumbnails */}
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-sm">
                  Property Gallery ({form.images.length} photos)
                </p>
                {!form.images.length ? (
                  <p className="text-on-surface-variant text-body-md">No gallery photos added yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                    {form.images.map((url, idx) => {
                      const isCover = form.coverImageUrl === url;
                      return (
                        <div key={`${url}-${idx}`} className={`border-2 border-primary p-xs relative flex flex-col bg-surface-container-lowest ${isCover ? 'ring-4 ring-acid-lime' : ''}`}>
                          <img loading="lazy" src={url} alt={`Property ${idx}`} className="w-full h-28 object-cover border border-primary mb-xs" />
                          {isCover && (
                            <span className="absolute top-2 left-2 bg-acid-lime border border-primary px-xs font-label-caps text-[9px] uppercase">
                              Cover Photo
                            </span>
                          )}
                          <div className="flex gap-xs mt-auto">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(url)}
                                className="flex-1 py-xs bg-surface border border-primary font-label-caps text-[9px] text-primary"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="px-xs py-xs bg-error/10 text-error border border-error font-label-caps text-[9px]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="flex flex-col gap-md">
              <p className="font-label-caps text-label-caps text-electric-purple uppercase">
                Select stay amenities included in rent:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-md">
                {PRESET_AMENITIES.map((amenity) => {
                  const active = form.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-md border-2 border-primary flex items-center justify-between font-label-caps text-label-caps transition-all ${
                        active ? 'bg-acid-lime text-primary shadow-[2px_2px_0px_0px_#000]' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{amenity}</span>
                      <span className="material-symbols-outlined text-sm">{active ? 'check_box' : 'checkbox_outline_blank'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="flex flex-col gap-lg">
              <div className="bg-surface-container border-2 border-primary p-md">
                <h3 className="font-h3 text-h3 text-primary mb-xs">Extra Benefits & Paid Services</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Offer students opt-in paid services (meals, Wi-Fi upgrades, laundry, parking). These can be added during booking.
                </p>
              </div>

              {/* Add Preset Services */}
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-xs">Quick Add Preset Add-Ons:</p>
                <div className="flex flex-wrap gap-xs">
                  {PRESET_ADDONS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddService(preset)}
                      className="px-md py-xs bg-surface-container-lowest border-2 border-primary font-label-caps text-xs text-primary hover:bg-acid-lime transition-colors"
                    >
                      + {preset.name} ({money(preset.price)}{preset.period})
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Service Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm items-end bg-surface-container-lowest border-2 border-primary p-md">
                <label className="flex flex-col gap-xs sm:col-span-1">
                  <span className="font-label-caps text-label-caps text-primary">Service Name</span>
                  <input
                    value={newAddon.name}
                    onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                    placeholder="e.g. AC Room Charges"
                    className="border-2 border-primary px-sm py-sm text-sm text-primary"
                  />
                </label>
                <label className="flex flex-col gap-xs">
                  <span className="font-label-caps text-label-caps text-primary">Price (₹)</span>
                  <input
                    type="number"
                    value={newAddon.price}
                    onChange={(e) => setNewAddon({ ...newAddon, price: e.target.value })}
                    placeholder="1200"
                    className="border-2 border-primary px-sm py-sm text-sm text-primary"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleAddService(newAddon)}
                  className="py-sm px-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary"
                >
                  + Add Custom Service
                </button>
              </div>

              {/* Current Extra Services List */}
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-sm">
                  Configured Services ({form.extraServices.length})
                </p>
                {!form.extraServices.length ? (
                  <p className="text-on-surface-variant text-body-md">No extra paid services added to this listing yet.</p>
                ) : (
                  <div className="flex flex-col gap-sm">
                    {form.extraServices.map((srv, idx) => (
                      <div key={`${srv.name}-${idx}`} className="flex items-center justify-between p-md border-2 border-primary bg-surface-container-lowest">
                        <div>
                          <strong className="font-h3 text-h3 text-primary">{srv.name}</strong>
                          <span className="font-label-caps text-xs text-electric-purple ml-md">
                            {money(srv.price)} {srv.period || '/month'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="px-md py-xs bg-error/10 text-error border-2 border-error font-label-caps text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-md border-t-2 border-primary pt-lg mt-lg">
            <div className="flex gap-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-lg py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary"
              >
                CANCEL
              </button>
            </div>

            <div className="flex gap-sm w-full sm:w-auto">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['basic', 'location', 'images', 'amenities', 'services'];
                    const idx = tabs.indexOf(activeTab);
                    if (idx > 0) setActiveTab(tabs[idx - 1]);
                  }}
                  className="px-lg py-md bg-surface-container border-2 border-primary font-label-caps text-label-caps text-primary"
                >
                  PREVIOUS STEP
                </button>
              )}

              {activeTab !== 'services' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['basic', 'location', 'images', 'amenities', 'services'];
                    const idx = tabs.indexOf(activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                  }}
                  className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000]"
                >
                  NEXT STEP &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-xl py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary font-bold shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 transition-transform"
                >
                  {isEdit ? 'SAVE PROPERTY CHANGES' : 'PUBLISH / SAVE LISTING'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OwnerPortalPage() {
  const location = useLocation();
  const [data, setData] = useState({ properties: [], bookings: [], tenants: [], deposits: [], messages: [] });
  const [universities, setUniversities] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [viewerId, setViewerId] = useState('');
  const [messageRows, setMessageRows] = useState([]);
  const [activeConvKey, setActiveConvKey] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const refresh = () =>
    Promise.all([getOwnerWorkspaceData(), getOwnerMessages()])
      .then(([workspace, messages]) => {
        setData(workspace);
        setMessageRows(messages || []);
      })
      .catch((err) => setError(err.message || 'Unable to load owner data.'));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    listUniversities().then(setUniversities).catch((err) => setError(err.message));
    supabase.auth.getUser().then(({ data: userData }) => {
      if (userData?.user) setViewerId(userData.user.id);
    }).catch(() => {});
    refresh();
    return undefined;
  }, []);

  const handleOpenNewForm = () => {
    setEditingForm(emptyForm);
    setShowForm(true);
  };

  const handleOpenEditForm = (property) => {
    setEditingForm({
      id: property.id,
      name: property.name || '',
      universityId: property.university_id || '',
      area: property.area || '',
      address: property.address || '',
      propertyType: property.property_type || 'pg',
      monthlyRent: property.monthly_rent || '',
      securityDeposit: property.security_deposit || '',
      distance: property.distance_to_university_km || '',
      description: property.description || '',
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      coverImageUrl: property.cover_image_url || '',
      images: property.images || [],
      amenities: property.amenities || ['Gigabit Wi-Fi', 'Daily Housekeeping', '24/7 Security'],
      extraServices: property.extra_services || [],
      status: property.status || 'published',
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (formData) => {
    setError('');
    setMessage('');
    try {
      if (formData.id) {
        await updateProperty(formData.id, formData);
        setMessage(`Property "${formData.name}" updated successfully.`);
      } else {
        await createProperty(formData);
        setMessage(`Property "${formData.name}" added successfully.`);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (property) => {
    setError('');
    const newStatus = property.status === 'published' ? 'paused' : 'published';
    try {
      await togglePropertyStatus(property.id, newStatus);
      setMessage(`Property status changed to ${newStatus.toUpperCase()}`);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Are you sure you want to delete listing "${property.name}"? This action cannot be undone.`)) {
      return;
    }
    setError('');
    try {
      await deleteProperty(property.id);
      setMessage(`Listing "${property.name}" has been deleted.`);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const route = location.pathname.split('/')[2] || 'overview';
  const title = {
    overview: 'Landlord overview',
    properties: 'Properties',
    tenants: 'Tenants',
    rentals: 'Rentals',
    messages: 'Messages',
    deposits: 'Deposits',
  }[route] || 'Landlord overview';

  const published = data.properties.filter((property) => property.status === 'published');
  const totalRent = data.bookings.reduce((sum, booking) => sum + Number(booking.rent_amount || 0), 0);

  const header = (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
      <div>
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo landlord workspace</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface font-bold uppercase">{title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">
          {route === 'properties'
            ? 'Manage your listings, photos, live GPS locations, extra services, and availability status.'
            : route === 'tenants'
            ? 'See every tenant connected to one of your properties.'
            : route === 'rentals'
            ? 'Track stay applications, confirmed bookings, and rent economics.'
            : route === 'messages'
            ? 'Read and reply to tenants messaging you about their bookings.'
            : route === 'deposits'
            ? 'Monitor protected deposits and release or dispute status.'
            : 'Manage Kolkata listings, tenant activity, and KeyLo success fees.'}
        </p>
      </div>
      {(route === 'overview' || route === 'properties') && (
        <button
          onClick={handleOpenNewForm}
          className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-transform"
        >
          + Add property
        </button>
      )}
    </section>
  );

  const overview = (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container border-2 border-primary p-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Published properties</p>
          <p className="font-price-display text-price-display text-primary mt-lg">{published.length}</p>
        </div>
        <div className="bg-surface-container border-2 border-primary p-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Bookings</p>
          <p className="font-price-display text-price-display text-primary mt-lg">{data.bookings.length}</p>
        </div>
        <div className="bg-surface-container border-2 border-primary p-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">5% KeyLo fee</p>
          <p className="font-price-display text-price-display text-primary mt-lg">{money(totalRent * 0.05)}</p>
        </div>
        <div className="bg-surface-container border-2 border-primary p-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tenants</p>
          <p className="font-price-display text-price-display text-primary mt-lg">{data.tenants.length}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]">
          <p className="font-label-caps text-label-caps text-acid-lime uppercase">Revenue model</p>
          <h2 className="font-h3 text-h3 mt-sm">Only pay when rent is collected.</h2>
          <p className="mt-md text-on-primary/80">
            Current booked rent: <strong className="text-acid-lime">{money(totalRent)}</strong>
          </p>
        </div>
        <div className="bg-surface-container-lowest border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-md">Recent bookings</h2>
          {data.bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="border-t-2 border-primary py-md flex justify-between gap-md">
              <div>
                <p className="text-primary font-bold">{booking.property_name}</p>
                <p className="text-on-surface-variant">{booking.tenant_name} · <Status value={booking.status} /></p>
              </div>
              <strong className="text-primary">{money(booking.rent_amount)}</strong>
            </div>
          ))}
          {!data.bookings.length && <p className="text-on-surface-variant">No bookings yet.</p>}
        </div>
      </section>
    </>
  );

  const properties = (
    <section className="bg-surface-container border-2 border-primary p-lg">
      <div className="flex justify-between items-center border-b-2 border-primary pb-md mb-md">
        <div>
          <h2 className="font-h3 text-h3 text-primary">Your Properties</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage listings, edit photos, pause, or delete properties.</p>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant">{data.properties.length} listings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {data.properties.map((property) => (
          <article key={property.id} className="bg-surface-container-lowest border-2 border-primary p-md flex flex-col justify-between shadow-[4px_4px_0px_0px_#000]">
            <div>
              {/* Cover Image & Badges */}
              <div className="h-44 bg-surface border-2 border-primary overflow-hidden relative mb-md">
                <img loading="lazy"
                  src={property.cover_image_url || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-xs">
                  <Status value={property.status} />
                </div>
                <div className="absolute bottom-2 left-2 bg-primary/90 text-on-primary font-label-caps text-[10px] px-xs py-[2px] uppercase">
                  {property.property_type?.toUpperCase()}
                </div>
              </div>

              {/* Main Info */}
              <div className="flex justify-between items-start gap-md mb-xs">
                <div>
                  <h3 className="font-h3 text-h3 text-primary">{property.name}</h3>
                  <p className="text-on-surface-variant font-body-md">
                    {property.area}, Kolkata · {property.distance_to_university_km || '0'} km to {property.university || 'Campus'}
                  </p>
                </div>
              </div>

              <p className="text-primary font-bold text-lg mt-xs">
                {money(property.monthly_rent)} <span className="text-sm text-on-surface-variant font-normal">/ month</span> · Trust {property.trust_score || 50}/100
              </p>

              {/* Extra details */}
              <div className="flex flex-wrap gap-xs mt-sm font-label-caps text-[10px] text-on-surface-variant uppercase">
                {property.extra_services?.length > 0 && (
                  <span className="px-xs py-[2px] bg-acid-lime/20 border border-primary text-primary">
                    +{property.extra_services.length} Extra Add-Ons
                  </span>
                )}
                {property.images?.length > 0 && (
                  <span className="px-xs py-[2px] bg-surface-container border border-primary text-primary">
                    {property.images.length} Photos
                  </span>
                )}
                <span>{property.is_ai_inspected ? '✓ AI Inspected' : '○ AI Pending'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-xs mt-md pt-md border-t-2 border-primary/20">
              <button
                type="button"
                onClick={() => handleOpenEditForm(property)}
                className="flex-1 px-md py-xs bg-surface border-2 border-primary font-label-caps text-xs text-primary hover:bg-surface-container flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleToggleStatus(property)}
                className={`flex-1 px-md py-xs border-2 border-primary font-label-caps text-xs text-primary flex items-center justify-center gap-xs ${
                  property.status === 'published' ? 'bg-[#F59E0B]/20 hover:bg-[#F59E0B]/40' : 'bg-acid-lime hover:bg-acid-lime/80'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {property.status === 'published' ? 'pause_circle' : 'play_circle'}
                </span>
                {property.status === 'published' ? 'Pause' : 'Publish'}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(property)}
                className="px-md py-xs bg-error/10 text-error border-2 border-error font-label-caps text-xs hover:bg-error/20 flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete
              </button>

              <Link
                to={`/property/${property.id}`}
                target="_blank"
                className="px-md py-xs bg-primary text-on-primary border-2 border-primary font-label-caps text-xs flex items-center justify-center"
                title="View Public Stay Page"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!data.properties.length && <p className="text-on-surface-variant">No properties yet. Add your first listing!</p>}
    </section>
  );

  const tenants = (
    <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto">
      <h2 className="font-h3 text-h3 text-primary mb-md">Tenant directory</h2>
      <table className="w-full min-w-[700px] text-left">
        <thead className="bg-primary text-on-primary">
          <tr>
            {['Tenant', 'Email', 'Bookings', 'Active', 'Last booking'].map((item) => (
              <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.tenants.map((tenant) => (
            <tr key={tenant.id} className="border-t-2 border-primary/20">
              <td className="px-md py-md text-primary font-bold">{tenant.full_name}</td>
              <td className="px-md py-md text-on-surface-variant">{tenant.email}</td>
              <td className="px-md py-md text-primary">{tenant.booking_count}</td>
              <td className="px-md py-md text-primary">{tenant.active_bookings}</td>
              <td className="px-md py-md text-on-surface-variant">{formatDateTime(tenant.last_booking_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data.tenants.length && <p className="text-on-surface-variant mt-md">No tenants have booked your properties.</p>}
    </section>
  );

  const rentals = (
    <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto">
      <h2 className="font-h3 text-h3 text-primary mb-md">Stay bookings and rent</h2>
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-primary text-on-primary">
          <tr>
            {['Tenant', 'Property', 'Status', 'Booked', 'Move-in', 'Rent', 'KeyLo fee'].map((item) => (
              <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.bookings.map((booking) => (
            <tr key={booking.id} className="border-t-2 border-primary/20">
              <td className="px-md py-md text-primary font-bold">
                {booking.tenant_name}<br />
                <span className="text-[11px] text-on-surface-variant font-normal">{booking.tenant_email}</span>
              </td>
              <td className="px-md py-md text-primary font-bold">
                {booking.property_name}<br />
                <span className="text-[11px] text-on-surface-variant font-normal">{booking.property_area}</span>
              </td>
              <td className="px-md py-md"><Status value={booking.status} /></td>
              <td className="px-md py-md text-on-surface-variant">{formatDateTime(booking.created_at)}</td>
              <td className="px-md py-md text-on-surface-variant">{formatDate(booking.move_in_date)}</td>
              <td className="px-md py-md text-primary font-bold">{money(booking.rent_amount)}</td>
              <td className="px-md py-md text-electric-purple font-bold">{money(Number(booking.rent_amount) * 0.05)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data.bookings.length && <p className="text-on-surface-variant mt-md">No bookings for your properties.</p>}
    </section>
  );

  const deposits = (
    <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto">
      <h2 className="font-h3 text-h3 text-primary mb-md">Protected deposits</h2>
      <table className="w-full min-w-[800px] text-left">
        <thead className="bg-primary text-on-primary">
          <tr>
            {['Tenant', 'Property', 'Amount', 'Status', 'Held at', 'Release requested'].map((item) => (
              <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.deposits.map((deposit) => (
            <tr key={deposit.id} className="border-t-2 border-primary/20">
              <td className="px-md py-md text-primary font-bold">
                {deposit.tenant_name}<br />
                <span className="text-[11px] text-on-surface-variant font-normal">{deposit.tenant_email}</span>
              </td>
              <td className="px-md py-md text-primary font-bold">{deposit.property_name}</td>
              <td className="px-md py-md text-primary font-bold">{money(deposit.amount)}</td>
              <td className="px-md py-md"><Status value={deposit.status} /></td>
              <td className="px-md py-md text-on-surface-variant">{formatDateTime(deposit.held_at)}</td>
              <td className="px-md py-md text-on-surface-variant">{formatDateTime(deposit.release_requested_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data.deposits.length && <p className="text-on-surface-variant mt-md">No protected deposits linked to your properties.</p>}
    </section>
  );

  const conversations = useMemo(() => {
    if (!viewerId) return [];
    const map = new Map();
    for (const messageRow of messageRows) {
      const otherId = messageRow.sender_id === viewerId ? messageRow.recipient_id : messageRow.sender_id;
      if (!otherId) continue;
      const key = `${messageRow.booking_id || 'x'}::${otherId}`;
      let conv = map.get(key);
      if (!conv) {
        conv = { key, bookingId: messageRow.booking_id, otherId, otherName: '', otherEmail: '', propertyName: messageRow.property_name || '', messages: [], unread: 0, lastAt: messageRow.created_at };
        map.set(key, conv);
      }
      if (messageRow.sender_id === otherId) {
        conv.otherName = messageRow.sender_name || conv.otherName;
        conv.otherEmail = messageRow.sender_email || conv.otherEmail;
        if (!messageRow.read_at) conv.unread += 1;
      } else {
        conv.otherName = messageRow.recipient_name || conv.otherName;
        conv.otherEmail = messageRow.recipient_email || conv.otherEmail;
      }
      if (!conv.propertyName && messageRow.property_name) conv.propertyName = messageRow.property_name;
      if (messageRow.created_at > conv.lastAt) conv.lastAt = messageRow.created_at;
      conv.messages.push(messageRow);
    }
    return [...map.values()]
      .map((conv) => ({ ...conv, messages: [...conv.messages].sort((a, b) => (a.created_at < b.created_at ? -1 : 1)) }))
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  }, [messageRows, viewerId]);

  const activeConversation = conversations.find((conv) => conv.key === activeConvKey) || null;

  const openConversation = async (conv) => {
    setActiveConvKey(conv.key);
    if (conv.unread > 0) {
      try {
        await markMessagesRead({ bookingId: conv.bookingId, fromId: conv.otherId });
        setError('');
        await refresh();
      } catch (err) {
        setError(err.message || 'Unable to update read status.');
      }
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    const conv = activeConversation;
    if (!conv || !replyText.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      await sendMessage({ bookingId: conv.bookingId, recipientId: conv.otherId, body: replyText });
      setReplyText('');
      setError('');
      await refresh();
    } catch (err) {
      setError(err.message || 'Unable to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const messagesSection = (
    <section className="bg-surface-container-lowest border-2 border-primary">
      <div className="border-b-2 border-primary px-lg py-md flex items-center justify-between gap-md">
        <div>
          <h2 className="font-h3 text-h3 text-primary">Conversations</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Messages from tenants on your properties, attached to each booking.</p>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant">{conversations.length} conversations</span>
      </div>

      {!conversations.length ? (
        <div className="p-lg font-body-md text-body-md text-on-surface-variant">No messages yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
          <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-primary max-h-[540px] overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.key}
                type="button"
                onClick={() => openConversation(conv)}
                className={`w-full text-left px-lg py-md border-b-2 border-primary/20 last:border-b-0 flex items-start gap-md transition-colors ${
                  activeConvKey === conv.key ? 'bg-acid-lime' : 'hover:bg-surface-container'
                }`}
              >
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-label-caps flex-shrink-0">
                  {(conv.otherName || '?').slice(0, 1).toUpperCase()}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-sm">
                    <span className="font-label-caps text-label-caps text-primary truncate">{conv.otherName || 'Tenant'}</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant whitespace-nowrap">{formatDateTime(conv.lastAt)}</span>
                  </span>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mt-xs truncate">{conv.propertyName || 'Property'}</span>
                  <span className="block font-body-md text-body-md text-on-surface-variant mt-xs truncate">{(conv.messages[conv.messages.length - 1].body || '').slice(0, 90)}</span>
                </span>
                {conv.unread > 0 && (
                  <span className="flex-shrink-0 min-w-[20px] h-5 px-1 bg-hot-pink text-white rounded-full font-label-caps text-[10px] flex items-center justify-center">{conv.unread}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col min-h-[420px]">
            {activeConversation ? (
              <>
                <div className="px-lg py-md border-b-2 border-primary bg-surface-container">
                  <p className="font-label-caps text-label-caps text-primary">{activeConversation.otherName || 'Tenant'}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">{[activeConversation.otherEmail, activeConversation.propertyName].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex-1 px-lg py-md flex flex-col gap-md max-h-[380px] overflow-y-auto">
                  {activeConversation.messages.map((msg) => {
                    const fromMe = msg.sender_id === viewerId;
                    return (
                      <div key={msg.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[78%] px-md py-sm border-2 border-primary ${fromMe ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}>
                          <p className="font-body-md text-body-md">{msg.body}</p>
                          <p className={`font-label-caps text-[10px] mt-xs ${fromMe ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                            {formatDateTime(msg.created_at)}
                            {!fromMe && !msg.read_at ? ' · NEW' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form className="border-t-2 border-primary p-lg flex flex-col sm:flex-row gap-sm" onSubmit={handleReply}>
                  <label className="sr-only" htmlFor="owner-message-reply">Reply to tenant</label>
                  <input
                    id="owner-message-reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${activeConversation.otherName || 'tenant'}...`}
                    className="flex-1 border-2 border-primary bg-surface px-md py-md text-primary"
                  />
                  <button type="submit" disabled={sendingReply || !replyText.trim()} className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-50">
                    {sendingReply ? 'SENDING...' : 'REPLY'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-lg font-body-md text-body-md text-on-surface-variant">Select a conversation to read and reply.</div>
            )}
          </div>
        </div>
      )}
    </section>
  );

  return (
    <div className="flex flex-col gap-xl">
      {header}
      {message && <div className="border-2 border-primary bg-acid-lime p-md text-primary font-label-caps">{message}</div>}
      {error && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error font-body-md">{error}</div>}

      {route === 'properties'
        ? properties
        : route === 'tenants'
        ? tenants
        : route === 'rentals'
        ? rentals
        : route === 'messages'
        ? messagesSection
        : route === 'deposits'
        ? deposits
        : overview}

      {showForm && (
        <PropertyForm
          universities={universities}
          initialForm={editingForm}
          onSubmit={handleSubmitForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
