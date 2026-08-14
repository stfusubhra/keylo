import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { listProperties, toggleSavedProperty, getSavedPropertyIds, getReviewStats } from '../lib/supabaseData';
import { demoProperties, universities, colleges } from '../lib/demoCatalog';
import KolkataUniversityMap from '../components/ui/KolkataUniversityMap';
import { EmptyState } from '../components/ui/EmptyState';
import LoadingKey from '../components/ui/LoadingKey';
import toast from 'react-hot-toast';

function PropertyCard({ property, saved, onToggleSave }) {
  return (
    <article className="group flex flex-col md:flex-row border-2 border-primary bg-surface-container-lowest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_0px_#000000] transition-all" data-id={property.id}>
      {/* Image block — fixed height on mobile, square on md+ */}
      <div className="w-full h-48 md:w-[240px] md:h-auto md:aspect-square relative flex-shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-primary">
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 border-2 border-primary font-label-caps text-label-caps ${property.badgeClass}`}>{property.badge}</span>
        </div>
        <img loading="lazy" className="w-full h-full object-cover" src={property.image} alt={`${property.name} near ${property.university}`} />
        <button
          onClick={onToggleSave}
          aria-label={`Save ${property.name}`}
          aria-pressed={saved}
          title={saved ? 'Remove from saved' : 'Save for later'}
          className={`absolute top-2 right-2 p-1.5 border-2 border-primary transition-colors ${saved ? 'bg-hot-pink text-white' : 'bg-surface-container-lowest text-primary hover:bg-hot-pink hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[20px]" style={saved ? { fontVariationSettings: 'FILL 1' } : undefined}>favorite</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-md flex flex-col justify-between flex-1 min-w-0">
        <div className="flex flex-col gap-xs">
          {/* Title row */}
          <div className="flex justify-between items-start gap-sm">
            <div className="min-w-0 flex-1">
              <p className="font-label-caps text-label-caps text-electric-purple uppercase truncate">Near {property.university}</p>
              <Link to={`/property/${property.id}`}>
                <h3 className="font-h3 text-h3 text-primary line-clamp-2 group-hover:underline decoration-2 underline-offset-4">{property.name}</h3>
              </Link>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1 bg-surface border-2 border-primary px-2 py-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: 'FILL 1' }}>star</span>
              <span className="font-label-caps text-label-caps text-primary">{property.rating}</span>
            </div>
          </div>

          {/* Location */}
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 min-w-0">
            <span className="material-symbols-outlined text-[16px] flex-shrink-0">location_on</span>
            <span className="truncate">{property.area}, Kolkata • {property.distance} from campus</span>
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-xs mt-xs">
            <span className="px-2 py-1 bg-[#E7F7D1] border border-primary font-label-caps text-[10px] text-primary uppercase">Verified landlord</span>
            <span className="px-2 py-1 bg-[#EDE9FE] border border-primary font-label-caps text-[10px] text-primary uppercase">AI inspected</span>
          </div>
        </div>

        {/* Amenity chips */}
        <div className="mt-sm mb-sm flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-surface-container border-2 border-primary font-label-caps text-label-caps text-on-surface">{property.type}</span>
          {property.amenities.slice(0, 2).map((amenity) => (
            <span key={amenity} className="px-2 py-1 bg-cyan-300 border-2 border-primary font-label-caps text-label-caps text-primary">{amenity}</span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between border-t-2 border-primary pt-md mt-auto">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="font-price-display text-price-display text-primary tracking-tight">{property.price}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">/ mo</span>
            </div>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_0px_#000000] transition-all whitespace-nowrap"
          >
            View stay
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FindStayPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Kolkata');
  const [selectedType, setSelectedType] = useState('All types');
  const [catalog, setCatalog] = useState(demoProperties);
  const [savedIds, setSavedIds] = useState({});
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(isSupabaseConfigured);
  const [catalogError, setCatalogError] = useState('');
  const navigate = useNavigate();

  // Sync initial university from URL query parameter if present
  useEffect(() => {
    const uniParam = (searchParams.get('university') || searchParams.get('uni') || '').trim().toLowerCase();
    if (!uniParam) return;
    const found = universities.find((u) => u.toLowerCase().includes(uniParam) || uniParam.includes(u.toLowerCase()));
    if (found) {
      setSelectedUniversity(found);
    }
  }, [searchParams]);

  const handleToggleSave = async (propertyId) => {
    if (!isSupabaseConfigured) {
      toast.error('Sign in to save properties. Supabase is not configured for this deployment.');
      return;
    }
    try {
      const result = await toggleSavedProperty(propertyId);
      setSavedIds((current) => ({ ...current, [propertyId]: result.saved }));
      toast.success(result.saved ? 'Saved to wishlist!' : 'Removed from wishlist');
    } catch (err) {
      if (err.message?.includes('signed in') || err.message?.toLowerCase().includes('auth session')) {
        navigate('/login', { state: { from: '/find-a-stay' } });
        return;
      }
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getSavedPropertyIds()
      .then((saved) => { if (active) setSavedIds(saved); })
      .catch(() => {});
    Promise.all([listProperties(), getReviewStats()])
      .then(([rows, stats]) => {
        if (!active) return;
        if (!rows.length) { setCatalog([]); return; }
        setCatalog(rows.map((row) => {
          const demo = demoProperties.find((d) => d.id === row.id) || demoProperties.find((d) => d.name === row.name) || {};
          return {
            id: row.id,
            university: row.universities?.name || 'Kolkata University',
            area: row.area,
            name: row.name,
            type: row.property_type === 'pg' ? 'PG' : 'Flat',
            distance: `${row.distance_to_university_km} km`,
            rating: stats[row.id]?.count ? (stats[row.id].total / stats[row.id].count).toFixed(1) : (row.profiles?.owner_rating != null ? String(row.profiles.owner_rating) : (demoProperties.find((d) => d.name === row.name)?.rating || '4.8')),
            price: `₹${Number(row.monthly_rent).toLocaleString('en-IN')}`,
            deposit: `₹${Number(row.security_deposit).toLocaleString('en-IN')}`,
            badge: row.is_ai_inspected ? 'AI Inspected' : '✓ Verified',
            badgeClass: row.is_ai_inspected ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary',
            amenities: row.amenities || [],
            image: row.cover_image_url || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
            lat: demo.lat,
            lng: demo.lng,
          };
        }));
      })
      .catch((err) => {
        if (!active) return;
        setCatalog([]);
        setCatalogError(err.message || 'We could not load live Kolkata listings. Please try again.');
      })
      .finally(() => { if (active) setIsLoadingCatalog(false); });
    return () => { active = false; };
  }, []);

  const filteredProperties = useMemo(() => catalog.filter((property) => {
    const query = searchQuery.toLowerCase();
    return (selectedUniversity === 'All Kolkata' || property.university === selectedUniversity)
      && (selectedType === 'All types' || property.type === selectedType)
      && (!query || `${property.name} ${property.area} ${property.university} ${property.type}`.toLowerCase().includes(query));
  }), [catalog, searchQuery, selectedUniversity, selectedType]);

  const handleSelectUniversity = (universityName) => {
    setSelectedUniversity(universityName);
    document.getElementById('property-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
       {/* ── Filter / Search header ── */}
       <section className="w-full px-margin-mobile lg:px-margin-desktop py-lg lg:py-xl border-b-2 border-primary bg-surface flex flex-col gap-md lg:gap-lg">
         <div>
          <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo Kolkata rental guide</p>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary tracking-tight uppercase font-bold">Find your next place.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-xs">Browse verified flats and PGs grouped by the university you are studying near in Kolkata.</p>
        </div>

        {/* Search + type filters */}
        <div className="flex flex-col gap-sm">
          <form
            className="relative w-full lg:w-[520px] flex flex-col sm:flex-row bg-surface-container-lowest border-2 border-primary focus-within:ring-4 ring-acid-lime p-2 sm:p-0 sm:h-[64px] sm:items-center sm:pr-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <span className="material-symbols-outlined absolute left-4 top-[22px] sm:top-1/2 sm:-translate-y-1/2 text-primary">search</span>
            <input
              id="rental-search"
              name="rentalSearch"
              className="w-full h-12 sm:h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant"
              placeholder="Search university, area, PG, or flat..."
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit" className="w-full sm:w-auto h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary whitespace-nowrap mt-2 sm:mt-0">
              Search
            </button>
          </form>

          {/* Type filter pills */}
          <div className="flex gap-sm">
            {['All types', 'PG', 'Flat'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 sm:flex-none px-md py-sm border-2 border-primary font-label-caps text-primary transition-colors ${selectedType === type ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* University filter — horizontally scrollable with fade hint */}
        <div className="relative">
          <div className="flex flex-nowrap gap-sm overflow-x-auto pb-xs hide-scrollbar" aria-label="Filter rentals by university">
            {universities.map((university) => (
              <button
                key={university}
                onClick={() => setSelectedUniversity(university)}
                className={`shrink-0 px-md py-sm border-2 border-primary font-label-caps text-primary transition-colors ${
                  selectedUniversity === university
                    ? 'bg-acid-lime text-primary shadow-[-3px_3px_0px_0px_#000000]'
                    : 'bg-surface-container-lowest hover:bg-acid-lime'
                }`}
              >
                {university === 'All Kolkata' ? university : `Near ${university}`}
              </button>
            ))}
          </div>
          {/* Right-edge fade hint on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-surface to-transparent lg:hidden" aria-hidden="true" />
        </div>
      </section>

      {/* ── Property list ── */}
      <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl border-b-2 border-primary bg-surface flex flex-col gap-xl" id="property-list">
        {catalogError && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{catalogError}</div>}
        <div className="flex flex-wrap items-center justify-between gap-md pb-sm border-b-2 border-primary">
          <span className="font-label-caps text-label-caps text-primary">
            {isLoadingCatalog
              ? <span className="inline-flex items-center gap-sm"><LoadingKey className="w-4 h-4" /> Loading live Kolkata stays...</span>
              : `Showing ${filteredProperties.length} ${filteredProperties.length === 1 ? 'stay' : 'stays'} near ${selectedUniversity === 'All Kolkata' ? 'Kolkata universities' : selectedUniversity}`}
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Sorted by university distance</span>
        </div>

        {filteredProperties.length
          ? filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={Boolean(savedIds[property.id])}
                onToggleSave={() => handleToggleSave(property.id)}
              />
            ))
          : (
            <EmptyState icon="🗺️" title="No stays found" description="Try another Kolkata university, area, or rental type." />
          )}
      </section>

      {/* ── Map section ── */}
      <section className="w-full py-xl border-b-2 border-primary bg-surface flex flex-col gap-lg" aria-label="Kolkata university rental map">
        <div className="px-margin-mobile lg:px-margin-desktop flex flex-col gap-md">
          <div>
            <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Campus map</p>
            <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight">Kolkata University Rental Map</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs max-w-2xl">Campuses are highlighted on the map — tap a pin to jump to stays near that college, or tap a stay to open it.</p>
          </div>
          {/* Map filter buttons — 2-col grid on mobile to prevent overflow */}
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-sm">
            {['Adamas University', 'Jadavpur University', 'University of Calcutta', "St. Xavier's University Kolkata"].map((university) => (
              <button
                key={university}
                onClick={() => handleSelectUniversity(university)}
                className={`px-md py-sm border-2 border-primary font-label-caps text-[10px] sm:text-label-caps text-primary transition-colors text-center ${
                  selectedUniversity === university
                    ? 'bg-acid-lime shadow-[-3px_3px_0px_0px_#000000]'
                    : 'bg-surface-container-lowest hover:bg-acid-lime'
                }`}
              >
                Near {university}
              </button>
            ))}
          </div>
        </div>
        <div className="px-margin-mobile lg:px-margin-desktop">
          <KolkataUniversityMap
            properties={catalog}
            colleges={colleges}
            selectedUniversity={selectedUniversity}
            onSelectUniversity={handleSelectUniversity}
          />
        </div>
      </section>
    </div>
  );
}
