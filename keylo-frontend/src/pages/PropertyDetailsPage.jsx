import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getPropertyById, getPropertyReviews, submitReview, getSavedPropertyIds, toggleSavedProperty } from '../lib/supabaseData';
import { demoProperties } from '../lib/demoCatalog';
import { colleges } from '../lib/demoCatalog';
import PropertyLocationMap from '../components/ui/PropertyLocationMap';
import LoadingScreen from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import VirtualTourModal from '../components/ui/VirtualTourModal';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
];

const DEFAULT_DESCRIPTION =
  'Experience premium student living in the heart of Kolkata. Designed specifically for students and young professionals near campus, this space offers a perfect balance of privacy for focus and community areas for socializing. High-speed Wi-Fi, daily housekeeping, and 24/7 security come standard.';

const formatMoney = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export default function PropertyDetailsPage() {
  const { id = 'jadavpur-pg' } = useParams();
  const [selectedRoom, setSelectedRoom] = useState('twin');
  const [row, setRow] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [loadError, setLoadError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
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
      toast.success(result.saved ? 'Saved to wishlist!' : 'Removed from wishlist');
    } catch (err) {
      if (err.message?.includes('signed in') || err.message?.toLowerCase().includes('auth session')) {
        navigate('/login', { state: { from: `/property/${id}` } });
        return;
      }
      toast.error(err.message || 'Unable to update wishlist.');
    }
  };

  const handleShare = async (action) => {
    setShareOpen(false);
    const url = `${window.location.origin}/property/${id}`;
    const title = name;
    const text = `Check out "${title}" on KeyLo — ${description?.slice(0, 80)}...`;

    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Failed to copy link');
      }
      return;
    }

    if (action === 'whatsapp') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
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
  const privatePrice = rent + 5500;
  const description = row?.description || demo?.description || DEFAULT_DESCRIPTION;
  const amenities = row?.amenities?.length ? row.amenities : (demo?.amenities || ['Gigabit Wi-Fi', 'Daily Housekeeping', 'In-house Laundry', '24/7 Security']);
  const trustScore = row?.trust_score ?? 92;
  const trustBreakdown = row?.trust_score_breakdown || {};
  const isVerified = row?.is_documents_verified ?? true;
  const coverImage = row?.cover_image_url || demo?.image || FALLBACK_IMAGES[0];
  const ownerName = row?.profiles?.full_name || 'Riya Sen';
  const ownerRating = row?.profiles?.owner_rating != null ? String(row.profiles.owner_rating) : (demo?.rating || '4.8');
  const reviewAverage = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1) : ownerRating;
  const propertyImages = row?.images?.length ? row.images : (demo?.images?.length ? demo.images : [coverImage, ...FALLBACK_IMAGES.slice(1)]);
  const virtualTourUrl = row?.virtual_tour_url || demo?.virtualTourUrl;
  const roomMeasurements = row?.room_measurements || null;
  const virtualTourModal = virtualTourOpen ? <VirtualTourModal isOpen={virtualTourOpen} onClose={() => setVirtualTourOpen(false)} tourUrl={virtualTourUrl} propertyName={name} roomMeasurements={roomMeasurements} /> : null;

  if (isLoading) return <LoadingScreen label="Loading stay details..." className="min-h-screen" />;
  if (isSupabaseConfigured && (loadError || !row)) return <div className="min-h-[60vh] flex items-center justify-center bg-surface-container-low px-lg"><div role="alert" className="max-w-2xl border-2 border-error bg-error/10 p-lg text-center font-body-md text-error"><p>{loadError || 'This property is no longer available.'}</p><Link to="/find-a-stay" className="inline-block mt-md px-lg py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Browse current stays</Link></div></div>;

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      <section className="w-full px-margin-mobile md:px-margin-desktop mb-xl mt-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md md:gap-gutter h-auto md:h-[500px]">
          <div className="col-span-1 md:col-span-2 h-[250px] md:h-full rounded-xl overflow-hidden shadow-md border-2 border-primary">
            <img loading="lazy"
              className="w-full h-full object-cover"
              src={propertyImages[0]}
              alt="Main property view"
            />
          </div>
          <div className="col-span-1 md:col-span-1 h-full rounded-xl overflow-hidden shadow-md border-2 border-primary hidden md:block">
            <img loading="lazy"
              className="w-full h-full object-cover"
              src={propertyImages[1]}
              alt="Study desk detail"
            />
          </div>
          <div className="col-span-1 md:col-span-1 flex-col gap-md md:gap-gutter h-full hidden md:flex">
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary">
              <img loading="lazy"
                className="w-full h-full object-cover"
                src={propertyImages[2]}
                alt="Kitchen area"
              />
            </div>
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary relative cursor-pointer group">
              <img loading="lazy"
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
              <div className="flex items-center gap-sm flex-shrink-0">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShareOpen((v) => !v)}
                    aria-label="Share this property"
                    aria-expanded={shareOpen}
                    className="flex items-center gap-xs px-md py-sm border-2 border-primary font-label-caps text-label-caps bg-surface-container-lowest text-primary hover:bg-acid-lime hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    <span className="hidden sm:inline">SHARE</span>
                  </button>
                  {shareOpen && (
                    <div className="absolute right-0 top-full mt-xs z-50 min-w-[180px] bg-surface border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
                      <button
                        type="button"
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-sm w-full px-md py-sm text-left font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        Copy Link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare('whatsapp')}
                        className="flex items-center gap-sm w-full px-md py-sm text-left font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors border-t-2 border-primary"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>
                {/* Virtual Tour Button */}
                {virtualTourUrl && (
                  <button
                    type="button"
                    onClick={() => setVirtualTourOpen(true)}
                    className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-surface-container-lowest hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
                    aria-label="Open virtual tour for this property"
                  >
                    <span className="material-symbols-outlined text-[20px]">360</span>
                    <span className="hidden sm:inline">Virtual Tour</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleToggleSave}
                  aria-label={isSaved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
                  aria-pressed={isSaved}
                  title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`flex-shrink-0 flex items-center gap-xs px-md py-sm border-2 border-primary font-label-caps text-label-caps transition-colors ${isSaved ? 'bg-hot-pink text-white' : 'bg-surface-container-lowest text-primary hover:bg-hot-pink hover:text-white'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true" style={isSaved ? { fontVariationSettings: 'FILL 1' } : undefined}>favorite</span>
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
                <p className="font-body-md text-on-surface-variant mt-md">
                  Our AI reviews every property listing and the photos you upload. This property has been verified for accurate photos, proper amenities, and pricing transparency.
                </p>
              </div>
              <div className="flex flex-col items-center gap-sm mt-md md:mt-0">
                <div className="flex items-center gap-xs text-on-primary">
                  <span className="font-h3 text-h3 font-bold">{trustScore}</span>
                  <span className="font-label-caps text-label-caps">/100</span>
                </div>
                <div className="text-center">
                  <p className="font-body-xs text-on-surface-variant">Trust Score</p>
                  <div className="flex items-center gap-xs mt-xs justify-center">
                    <div className="w-12 h-1 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-acid-lime w-[92%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md mt-lg">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center mx-auto mb-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                </div>
                <p className="font-label-caps text-label-caps text-on-primary">Documents Verified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center mx-auto mb-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">photo_library</span>
                </div>
                <p className="font-label-caps text-label-caps text-on-primary">Photos Verified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center mx-auto mb-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">reviews</span>
                </div>
                <p className="font-label-caps text-label-caps text-on-primary">Live Reviews</p>
              </div>
              <div className="text-center">
                
              </div>
            </div>
          </section>
        </div>
      {/* Analytics Dashboard */}
      <div className="lg:col-span-4 flex flex-col gap-xl pb-xl">
        {/* Placeholder for analytics dashboard */}
        <div className="bg-surface-container-lowest rounded-xl border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-lg">Virtual Tour Analytics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
              <span className="font-label-caps text-label-caps">Total Views</span>
              <span className="font-h3 text-h3 font-bold">12,430</span>
            </div>
            <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
              <span className="font-label-caps text-label-caps">Unique Visitors</span>
              <span className="font-h3 text-h3 font-bold">8,920</span>
            </div>
            <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
              <span className="font-label-caps text-label-caps">Avg. View Duration</span>
              <span className="font-h3 text-h3 font-bold">2m 34s</span>
            </div>
            <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
              <span className="font-label-caps text-label-caps">Engagement Rate</span>
              <span className="font-h3 text-h3 font-bold">68%</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Virtual Tour Modal */}
      {virtualTourModal}
    </div>
  );
};
