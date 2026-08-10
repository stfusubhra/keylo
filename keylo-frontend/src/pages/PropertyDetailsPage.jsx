import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getPropertyById, getPropertyReviews, submitReview, getSavedPropertyIds, toggleSavedProperty } from '../lib/supabaseData';
import { demoProperties } from '../lib/demoCatalog';
import { colleges } from '../lib/demoCatalog';
import PropertyLocationMap from '../components/ui/PropertyLocationMap';

const FALLBACK_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBpdL7vWvL_O-xc18tzYWi629aE-h1jY9yzcqbWYnBWZXmo2dubOK745kuei6KLvKmt4UWczT6j7qH3faU51oLf-wdjNQB77a_E7iy6CWe24-GmeGrTBVoi1cK9Ef-LyNt0MceHlYWt3PwVdZR9beaj_URGIxwt1pKGwc32Jm-TZv8-IfW6xw6sr7aJf6VioF8sZD8hLJOUwcWaPPtJsnorw_wz8AtvVCMgEkmmi0UYnlUr-zw-eUQ-',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_iq_Bjm8FH6Y-N9Bc0Md_KBoSognydvBlRNK5GRcQjayQzaD6jVsO2j7IFbshKul1dDzcirEgznYkGY2_BYrIxwqXxm7C9unXpPWBgJ6D8mpKw8XwVmau156lOuwQ_9X6VTS8w_L_6iQe8BIq5Etfj1gM4AcHEQhsgrmIbSOdoIQIlLdCtSol2gnvEdVPD_1P9sPcTahVmDlYqdGBWTi0vXVpn9FF1FJWEJsblAVc7kxKrK68rnL',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC8GKTWhZscKHX2BQ9jwIFAZmQMk-l_30pDz4ZlKLdBtainDSghHKdmTf3Xkc5l96TvsXFgAgoEmYIYgxdnekCMnc7lAfDGLbFJRY7d3r5n9KHIoTjljUM8kkzIJbvLLWwvvKDJC690ZhctzIaNnrj_GCHjpuaipNpKddV5mu6TZOraZoS7gvR5LHsALn6N6rq2SEThFuBqXKFH60VzeLz9k-8oeWsPfd1Gdsn_5X0WwFUyu9oedEow',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRIjlP8T0GOAZXoU4LP9mQ_lHjkhrWMEtgbjXjuXue61jA5JHEBae0zcfzNN5O_bmpLNykvvtULzsQv-WV6jpl4Y8qQdHj71q_uOgC_PoxrvT8zIyAvM6PSeVizkZ4fFsJbIysQARQIA3fOyXYb7AZaO6C3Hl_mBVZnxwGryxC_ZC6iNhQNznN9_PY8EPIfMvibkdbGaijKYQcvVTfKi_UwBUakUL3S43i-PdA_quSRVdrvsxowC3T',
];

const DEFAULT_DESCRIPTION =
  'Experience premium student living in the heart of Kolkata. Designed specifically for students and young professionals near campus, this space offers a perfect balance of privacy for focus and community areas for socializing. High-speed Wi-Fi, daily housekeeping, and 24/7 security come standard.';

const formatMoney = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export default function PropertyDetailsPage() {
  const { id = 'jadavpur-pg' } = useParams();
  const [selectedRoom, setSelectedRoom] = useState('twin');
  const [row, setRow] = useState(null); // Supabase row when configured, else null
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [loadError, setLoadError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getPropertyById(id)
      .then((property) => {
        if (!active) return;
        setRow(property);
        if (!property) setLoadError('This property is no longer available. Return to Find a Stay to browse current listings.');
      })
      .catch((error) => { if (active) setLoadError(error.message || 'We could not load this property. Please try again.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  // Load saved/wishlist state for this property
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getSavedPropertyIds()
      .then((saved) => { if (active) setIsSaved(Boolean(saved[id])); })
      .catch(() => {});
    return () => { active = false; };
  }, [id]);

  const handleToggleSave = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const result = await toggleSavedProperty(id);
      setIsSaved(result.saved);
      setSaveError('');
    } catch (err) {
      if (err.message?.includes('signed in') || err.message?.toLowerCase().includes('auth session')) {
        navigate('/login', { state: { from: `/property/${id}` } });
        return;
      }
      setSaveError(err.message || 'Unable to update wishlist.');
    }
  };

  const loadReviews = useCallback(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    Promise.all([
      getPropertyReviews(id),
      supabase.auth.getUser(),
    ]).then(([items, authResult]) => {
      if (!active) return;
      setReviews(items);
      setCurrentUser(authResult.data?.user || null);
    }).catch(() => { if (active) setReviews([]); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => loadReviews(), [loadReviews]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError('');
    setReviewSaved(false);
    try {
      await submitReview({ propertyId: id, rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewSaved(true);
      loadReviews();
    } catch (error) {
      setReviewError(error.message || 'Unable to submit your review.');
    }
  };

  const demo = demoProperties.find((p) => p.id === id) || demoProperties.find((p) => p.name === row?.name) || demoProperties.find((p) => p.id === 'jadavpur-pg');

  const name = row?.name || demo?.name || 'Lake View Student PG';
  const area = row?.area || demo?.area || 'Jadavpur';
  const universityName = row?.universities?.name || demo?.university || 'Jadavpur University';
  const distance = row?.distance_to_university_km != null
    ? `${row.distance_to_university_km} km`
    : (demo?.distance || '0.6 km');
  const rating = row?.profiles?.owner_rating != null
    ? String(row.profiles.owner_rating)
    : (demo?.rating || '4.8');
  const rent = row?.monthly_rent != null
    ? Number(row.monthly_rent)
    : (demo ? Number(String(demo.price).replace(/[^\d]/g, '')) || 8500 : 8500);
  const deposit = row?.security_deposit != null
    ? Number(row.security_deposit)
    : (demo ? Number(String(demo.deposit).replace(/[^\d]/g, '')) || 10000 : 10000);
  const fee = 997;
  const total = rent + deposit + fee;
  const privatePrice = rent + 5500; // premium single-occupancy demo price
  const description = row?.description || DEFAULT_DESCRIPTION;
  const amenities = row?.amenities?.length ? row.amenities : (demo?.amenities || ['Gigabit Wi-Fi', 'Daily Housekeeping', 'In-house Laundry', '24/7 Security']);
  const trustScore = row?.trust_score ?? 92;
  const trustBreakdown = row?.trust_score_breakdown || {};
  const isVerified = row?.is_documents_verified ?? true;
  const coverImage = row?.cover_image_url || demo?.image || FALLBACK_IMAGES[0];
  const ownerName = row?.profiles?.full_name || 'Riya Sen';
  const ownerRating = row?.profiles?.owner_rating != null ? String(row.profiles.owner_rating) : (demo?.rating || '4.8');
  const reviewAverage = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1) : ownerRating;
  const propertyImages = row?.images?.length ? row.images : [coverImage, ...FALLBACK_IMAGES.slice(1)];

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center bg-surface-container-low font-label-caps text-label-caps text-primary">Loading property...</div>;
  if (isSupabaseConfigured && (loadError || !row)) return <div className="min-h-[60vh] flex items-center justify-center bg-surface-container-low px-lg"><div role="alert" className="max-w-2xl border-2 border-error bg-error/10 p-lg text-center font-body-md text-error"><p>{loadError || 'This property is no longer available.'}</p><Link to="/find-a-stay" className="inline-block mt-md px-lg py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Browse current stays</Link></div></div>;

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      <section className="w-full px-margin-mobile md:px-margin-desktop mb-xl mt-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md md:gap-gutter h-auto md:h-[500px]">
          <div className="col-span-1 md:col-span-2 h-[250px] md:h-full rounded-xl overflow-hidden shadow-md border-2 border-primary">
            <img
              className="w-full h-full object-cover"
              src={propertyImages[0]}
              alt="Main property view"
            />
          </div>
          <div className="col-span-1 md:col-span-1 h-full rounded-xl overflow-hidden shadow-md border-2 border-primary hidden md:block">
            <img
              className="w-full h-full object-cover"
              src={propertyImages[1]}
              alt="Study desk detail"
            />
          </div>
          <div className="col-span-1 md:col-span-1 flex-col gap-md md:gap-gutter h-full hidden md:flex">
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary">
              <img
                className="w-full h-full object-cover"
                src={propertyImages[2]}
                alt="Kitchen area"
              />
            </div>
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary relative cursor-pointer group">
              <img
                className="w-full h-full object-cover"
                src={propertyImages[3]}
                alt="Lounge area"
              />
              <div className="absolute inset-0 bg-primary/60 flex items-center justify-center transition-all group-hover:bg-primary/80">
                <span className="font-h3 text-h3 text-on-primary">+8 Photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-xl relative">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-xl pb-xl">
          {/* Header Info */}
          <div className="flex flex-col gap-md border-b-2 border-primary pb-lg relative">
            {saveError && <div role="alert" className="border-2 border-error bg-error/10 p-sm font-body-md text-error">{saveError}</div>}
            <div className="flex items-baseline gap-sm">
              <span className="px-sm py-xs bg-hot-pink text-on-primary border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000]">
                FAST FILLING
              </span>
              <span className={`px-sm py-xs border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000] ${isVerified ? 'bg-verified text-primary' : 'bg-outline text-on-primary'}`}>
                {isVerified ? 'VERIFIED' : 'VERIFICATION PENDING'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-md">
              <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold">{name}</h1>
              <button
                type="button"
                onClick={handleToggleSave}
                aria-label={isSaved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
                aria-pressed={isSaved}
                title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`flex-shrink-0 flex items-center gap-xs px-md py-sm border-2 border-primary font-label-caps text-label-caps transition-colors ${isSaved ? 'bg-hot-pink text-white' : 'bg-surface-container-lowest text-primary hover:bg-hot-pink hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-[20px]" style={isSaved ? { fontVariationSettings: 'FILL 1' } : undefined}>favorite</span>
                <span className="hidden sm:inline">{isSaved ? 'SAVED' : 'SAVE'}</span>
              </button>
            </div>
            </div>
            <div className="flex flex-wrap items-center gap-md font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center gap-xs text-primary font-bold">
                <span className="material-symbols-outlined text-[#F59E0B]">star</span>
                <span>{reviews.length ? reviewAverage : rating}</span>
                <span className="text-on-surface-variant font-normal">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">location_on</span>
                <span>{area}, Kolkata</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">directions_walk</span>
                <span>{distance} to {universityName}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary">About this Space</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {description}
            </p>
          </section>

          {/* Trust & Verification */}
          <section className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#7C3AED]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-md mb-lg">
              <div>
                <p className="font-label-caps text-label-caps text-acid-lime uppercase mb-xs">KeyLo Trust Check</p>
                <h2 className="font-h3 text-h3 text-on-primary">Verified before you book.</h2>
              </div>
              <span className="px-sm py-xs bg-acid-lime text-primary border-2 border-on-primary font-label-caps text-label-caps">{trustScore} / 100 TRUST SCORE</span>
            </div>
            {Object.keys(trustBreakdown).length > 0 && <div className="grid grid-cols-2 md:grid-cols-5 gap-sm mb-lg">{[['base', 'Base'], ['documents', 'Documents'], ['inspection', 'Inspection'], ['landlord', 'Landlord'], ['published', 'Published']].map(([key, label]) => <div key={key} className="border border-on-primary/40 p-sm"><p className="font-label-caps text-[10px] text-on-primary/70 uppercase">{label}</p><p className="font-h3 text-h3 text-acid-lime">+{Number(trustBreakdown[key] || 0)}</p></div>)}</div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              {[
                ['verified_user', 'Landlord identity', 'Verified'],
                ['document_scanner', 'Property documents', isVerified ? 'Checked' : 'Pending'],
                ['camera', 'Room inspection', '12 Oct 2026'],
                ['payments', 'Deposit rules', 'Transparent'],
              ].map(([icon, title, value]) => (
                <div key={title} className="border-2 border-on-primary/40 p-sm bg-primary-container">
                  <span className="material-symbols-outlined text-acid-lime">{icon}</span>
                  <p className="font-label-caps text-[10px] text-on-primary/70 uppercase mt-sm">{title}</p>
                  <p className="font-label-caps text-label-caps text-on-primary mt-xs">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Inspection Evidence */}
          <section className="flex flex-col gap-md">
            <div className="flex items-end justify-between border-b-2 border-primary pb-sm gap-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Evidence, not promises</p><h2 className="font-h3 text-h3 text-primary">AI inspection report</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">Last checked 12 Oct 2026</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {['Walls & paint', 'Furniture condition', 'Safety & utilities'].map((item) => <div key={item} className="bg-surface-container-lowest border-2 border-primary p-md"><div className="flex items-center justify-between mb-md"><span className="material-symbols-outlined text-electric-purple">fact_check</span><span className="font-label-caps text-[10px] bg-acid-lime border border-primary px-xs py-[2px] text-primary">PASS</span></div><h3 className="font-label-caps text-label-caps text-primary uppercase">{item}</h3><p className="font-body-md text-body-md text-on-surface-variant mt-xs">No major issues detected during move-in scan.</p></div>)}
            </div>
          </section>

          {/* Amenities Bento Grid */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {amenities.slice(0, 4).map((amenity) => (
                <div key={amenity} className="flex flex-col items-center justify-center p-md bg-surface-container border-2 border-primary rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-h2 mb-xs">check_circle</span>
                  <span className="font-label-caps text-label-caps text-center">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Extra Paid Benefits & Add-On Services */}
          {row?.extra_services?.length > 0 && (
            <section className="flex flex-col gap-md bg-surface-container border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000] rounded-xl">
              <div>
                <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Landlord Add-Ons</p>
                <h2 className="font-h3 text-h3 text-primary">Extra Services & Paid Benefits</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {row.extra_services.map((srv, idx) => (
                  <div key={`${srv.name}-${idx}`} className="bg-surface-container-lowest border-2 border-primary p-md flex items-center justify-between">
                    <div>
                      <h3 className="font-h3 text-h3 text-primary">{srv.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Optional service provided by landlord</p>
                    </div>
                    <span className="font-h3 text-h3 text-electric-purple bg-acid-lime border-2 border-primary px-md py-xs shadow-[2px_2px_0px_0px_#000]">
                      ₹{srv.price} {srv.period || '/month'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Room Options */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary flex items-center justify-between border-b-2 border-primary pb-sm">
              <span>Room Configuration</span>
            </h2>
            <div className="flex flex-col gap-md">
              {/* Option 1 */}
              <div
                className={`p-lg bg-surface border-2 border-primary rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all ${
                  selectedRoom === 'twin'
                    ? 'border-acid-lime ring-4 ring-acid-lime/20'
                    : 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'
                }`}
                onClick={() => setSelectedRoom('twin')}
              >
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-xs">Twin Sharing</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Spacious room with individual wardrobes and study desks. Attached washroom.</p>
                </div>
                <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                  <span className="font-price-display text-price-display text-primary">{formatMoney(rent)}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">per month</span>
                </div>
              </div>
              {/* Option 2 */}
              <div
                className={`p-lg bg-surface-container-low border-2 border-primary rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all opacity-70 ${
                  selectedRoom === 'private'
                    ? 'border-acid-lime ring-4 ring-acid-lime/20 opacity-100'
                    : 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'
                }`}
                onClick={() => setSelectedRoom('private')}
              >
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    <h3 className="font-h3 text-h3 text-primary">Private Room</h3>
                    <span className="px-sm py-xs bg-outline text-on-primary border-2 border-primary font-label-caps text-label-caps">
                      SOLD OUT
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">Premium single occupancy with en-suite bathroom and mini-fridge.</p>
                </div>
                <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                  <span className="font-price-display text-price-display text-primary line-through decoration-2">{formatMoney(privatePrice)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Rules & Distance */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md border-t-2 border-primary pt-lg mt-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-sm">House Rules</h3>
              <ul className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-sm">
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  Curfew: 11:30 PM
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">group_off</span>
                  No overnight guests
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">smoking_rooms</span>
                  No smoking indoors
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-sm">Location Map</h3>
              <PropertyLocationMap
                lat={row?.latitude != null && row?.latitude !== '' ? Number(row.latitude) : (demo?.lat || 22.4988)}
                lng={row?.longitude != null && row?.longitude !== '' ? Number(row.longitude) : (demo?.lng || 88.3712)}
                name={name}
                area={area}
                distance={distance}
                campus={colleges.find((c) => c.name === universityName)}
              />
            </div>
          </section>

          <section className="border-t-2 border-primary pt-lg" aria-labelledby="reviews-heading">
            <div className="flex items-start justify-between gap-md mb-md">
              <div><p className="font-label-caps text-label-caps text-electric-purple uppercase">Real tenant feedback</p><h2 id="reviews-heading" className="font-h3 text-h3 text-primary">Student reviews</h2></div>
              <div className="font-label-caps text-label-caps text-primary">{reviews.length} total</div>
            </div>
            <div className="flex flex-col gap-md">
              {reviews.length ? reviews.map((review) => (
                <article key={review.id} className="border-2 border-primary bg-surface-container-lowest p-md">
                  <div className="flex items-center justify-between gap-md"><strong className="font-label-caps text-label-caps text-primary">{review.profiles?.full_name || 'KeyLo tenant'}</strong><span className="text-[#F59E0B]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-sm">{review.comment}</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant mt-sm">{new Date(review.created_at).toLocaleDateString('en-IN')}</p>
                </article>
              )) : <p className="font-body-md text-body-md text-on-surface-variant">No reviews yet. Be the first tenant to share feedback.</p>}
            </div>
            <div className="mt-lg border-2 border-primary p-md bg-surface">
              {!currentUser ? <button type="button" onClick={() => navigate('/login', { state: { from: `/property/${id}` } })} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">SIGN IN TO REVIEW</button> : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-sm">
                  <label className="font-label-caps text-label-caps text-primary uppercase" htmlFor="review-comment">Share your stay feedback</label>
                  <div className="flex gap-xs" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} stars`} onClick={() => setReviewRating(value)} className={`text-2xl ${value <= reviewRating ? 'text-[#F59E0B]' : 'text-on-surface-variant'}`}>★</button>)}
                  </div>
                  <textarea id="review-comment" required minLength={5} maxLength={2000} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="What was your stay like?" className="border-2 border-primary bg-surface-container-lowest p-md font-body-md text-body-md text-primary" rows={4} />
                  {reviewError && <div role="alert" className="border-2 border-error bg-error/10 p-sm text-error font-body-md">{reviewError}</div>}
                  {reviewSaved && <p role="status" className="font-label-caps text-label-caps text-electric-purple">Review saved.</p>}
                  <button type="submit" className="self-start px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps">PUBLISH REVIEW</button>
                </form>
              )}
            </div>
          </section>

          {/* Handover & Deposit Timeline */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-lg border-t-2 border-primary pt-lg">
            <div>
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Digital handover</p>
              <h3 className="font-h3 text-h3 text-primary mb-md">Move in with proof.</h3>
              <div className="flex flex-col gap-sm">
                {['Confirm room condition', 'Upload meter readings', 'Sign digital handover', 'Get your move-in record'].map((step, index) => <div key={step} className="flex items-center gap-sm"><span className="w-7 h-7 flex items-center justify-center bg-acid-lime border-2 border-primary font-label-caps text-label-caps">{index + 1}</span><span className="font-body-md text-body-md text-on-surface-variant">{step}</span></div>)}
              </div>
            </div>
            <div className="bg-surface-container border-2 border-primary p-md">
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Deposit release plan</p>
              <h3 className="font-h3 text-h3 text-primary mb-md">{formatMoney(deposit)} protected</h3>
              <div className="flex flex-col gap-md">{[['today', 'Deposit held in KeyLo Vault'], ['move-out', 'AI condition check'], ['within 7 days', 'Refund released or dispute opened']].map(([label, text], index) => <div key={label} className="flex gap-sm"><div className="flex flex-col items-center"><span className={`w-3 h-3 rounded-full border-2 border-primary ${index === 0 ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}></span>{index < 2 && <span className="w-px h-7 bg-primary"></span>}</div><div><p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{label}</p><p className="font-body-md text-body-md text-primary">{text}</p></div></div>)}</div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Card & KeyLo Protection */}
        <div className="lg:col-span-4 flex flex-col gap-xl">
          {/* Sticky Booking Widget */}
          <div className="lg:sticky lg:top-[100px] bg-surface border-2 border-primary rounded-xl p-lg flex flex-col gap-lg shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex justify-between items-end border-b-2 border-primary pb-sm">
              <div className="flex flex-col">
                <span className="font-price-display text-price-display text-primary">{formatMoney(rent)}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">/ month</span>
              </div>
              <div className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000]">
                AVAILABLE NOW
              </div>
            </div>
            <div className="flex flex-col gap-sm font-body-md text-body-md text-primary">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Monthly Rent</span>
                <span className="font-bold">{formatMoney(rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Security Deposit (Refundable)</span>
                <span className="font-bold">{formatMoney(deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">First-booking KeyLo fee</span>
                <span className="font-bold">{formatMoney(fee)}</span>
              </div>
              <div className="w-full h-px bg-primary my-xs"></div>
              <div className="flex justify-between font-h3 text-h3">
                <span>Total Move-in</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <Link
              to={`/secure-your-stay/${id}`}
              className="w-full py-md bg-acid-lime border-2 border-primary font-h3 text-h3 text-primary uppercase flex items-center justify-center gap-sm hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-all group"
            >
              RESERVE THIS SPACE
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Featured Section: KeyLo Deposit Protection */}
          <div className="bg-primary text-on-primary border-2 border-primary rounded-xl p-lg flex flex-col gap-md shadow-[8px_8px_0px_0px_#7C3AED] relative overflow-hidden">
            {/* Decorative bg accent */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-electric-purple blur-3xl opacity-30 rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="flex items-center gap-sm relative z-10">
              <span
                className="material-symbols-outlined text-acid-lime text-h2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_locked
              </span>
              <h3 className="font-h3 text-h3 text-acid-lime">KEYLO DEPOSIT PROTECTION</h3>
            </div>
            <p className="font-price-display text-price-display text-on-primary tracking-tight relative z-10">
              {formatMoney(deposit)} Secured
            </p>
            <p className="font-body-md text-body-md text-on-primary/80 relative z-10 border-b border-on-primary/20 pb-sm">
              Your security deposit is held safely by KeyLo, not the owner.
            </p>
            <ul className="flex flex-col gap-sm font-label-caps text-label-caps text-on-primary/90 mt-xs relative z-10">
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>100% Refund guarantee on term completion</span>
              </li>
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>No arbitrary deductions by landlords</span>
              </li>
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>Dispute resolution support</span>
              </li>
            </ul>
            <div className="border-t border-on-primary/30 pt-md mt-xs flex items-center gap-sm relative z-10"><span className="material-symbols-outlined text-acid-lime">verified_user</span><div><p className="font-label-caps text-label-caps text-acid-lime">Landlord verified</p><p className="font-body-md text-body-md text-on-primary/70">{ownerName} · {ownerRating} owner rating</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
