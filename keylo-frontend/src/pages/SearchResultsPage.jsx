import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { listProperties } from '../lib/supabaseData';
import { demoProperties } from '../lib/demoCatalog';
import { getMarketplaceItems, marketplaceCategoryImages } from '../lib/rentalMarketplace';
import LoadingScreen from '../components/ui/LoadingScreen';

// ────────────────────────────────────────────────────────────────────────────
// Search results page. Reads `q` (query) and `category` (stay | mobility |
// electronics | furniture | all) from the URL, merges stays (properties) and
// rental marketplace items into one unified, filterable result set.
// ────────────────────────────────────────────────────────────────────────────

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Results' },
  { id: 'stay', label: 'Stay', icon: 'bed' },
  { id: 'mobility', label: 'Mobility', icon: 'electric_scooter' },
  { id: 'electronics', label: 'Electronics', icon: 'devices' },
  { id: 'furniture', label: 'Furniture', icon: 'chair' },
];

// Map marketplace categories into the four top-level buckets advertised on the
// landing page. Anything not listed (sports, events, ...) still shows under
// "All Results".
const CATEGORY_BUCKETS = {
  stay: null, // stays are properties, handled separately
  mobility: ['scooters', 'bikes'],
  electronics: ['laptops', 'tablets', 'electronics', 'gaming', 'projectors', 'phones', 'cameras', 'gadgets', 'appliances'],
  furniture: ['furniture'],
};

const FALLBACK_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85';

const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

const matchesQuery = (haystack, tokens) => {
  if (!tokens.length) return true;
  const text = normalize(haystack);
  return tokens.every((token) => text.includes(token));
};

const isAvailableProperty = (property) => {
  const status = String(property.status || '').toLowerCase();
  return !['unavailable', 'paused', 'hidden', 'archived'].includes(status);
};

// ─────────────────────────── Card components ───────────────────────────

function StayCard({ property }) {
  return (
    <article className="group flex flex-col border-2 border-primary bg-surface-container-lowest hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[8px_8px_0px_0px_#000000] transition-all">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] border-b-2 border-primary overflow-hidden bg-surface-container-highest">
        <div className="absolute top-md left-md z-10">
          <span className={`px-sm py-xs ${property.badgeClass} font-label-caps text-[10px] uppercase border-2 border-primary`}>{property.badge}</span>
        </div>
        <div className="absolute top-md right-md z-10">
          <span className="px-sm py-xs bg-acid-lime text-primary font-label-caps text-[10px] uppercase border-2 border-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">check_circle</span>
            {property.availability}
          </span>
        </div>
        <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={property.image} alt={`${property.name} near ${property.university}`} />
      </div>

      {/* Content */}
      <div className="p-md flex flex-col flex-grow">
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Near {property.university}</p>
        <h3 className="font-h3 text-h3 text-primary line-clamp-2 leading-tight">{property.name}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs flex items-center gap-1 min-w-0">
          <span className="material-symbols-outlined text-[16px] flex-shrink-0">location_on</span>
          <span className="truncate">{property.area}, Kolkata • {property.distance} from campus</span>
        </p>
        <div className="flex flex-wrap gap-xs mt-sm">
          <span className="px-2 py-1 bg-surface-container border-2 border-primary font-label-caps text-label-caps text-on-surface">{property.type}</span>
          <span className="px-2 py-1 bg-acid-lime/20 border border-primary font-label-caps text-[10px] text-primary uppercase">Verified landlord</span>
        </div>
        <div className="flex items-end justify-between border-t-2 border-primary pt-md mt-auto">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">From</span>
            <span className="font-price-display text-price-display text-primary tracking-tight">
              {property.price} <span className="font-body-md text-body-md text-on-surface-variant">/ mo</span>
            </span>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_0px_#000000] transition-all whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function RentalCard({ item, navigate }) {
  const handleCardClick = () => {
    navigate(`/rentals/rent/${item.id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group flex flex-col border-2 border-primary bg-surface-container-lowest shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[12px_12px_0px_0px_#000000] transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] border-b-2 border-primary overflow-hidden bg-surface-container-highest">
        <div className="absolute top-md left-md z-10 flex gap-sm flex-wrap">
          {item.badges.slice(0, 2).map((badge) => (
            <span key={badge.label} className={`px-sm py-xs ${badge.bg} ${badge.textColor} font-label-caps text-[10px] uppercase border-2 border-primary`}>
              {badge.label}
            </span>
          ))}
        </div>
        <div className="absolute top-md right-md z-10">
          <span className={`px-sm py-xs font-label-caps text-[10px] uppercase border-2 border-primary flex items-center gap-1 ${
            item.availability === 'Available' ? 'bg-acid-lime text-primary' : 'bg-hot-pink text-white'
          }`}>
            <span className="material-symbols-outlined text-[12px]">{item.availability === 'Available' ? 'check_circle' : 'block'}</span>
            {item.availability}
          </span>
        </div>
        <img loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          src={item.useImage ? item.image : marketplaceCategoryImages[item.category] || item.image}
          alt={item.name}
        />
      </div>

      {/* Content */}
      <div className="p-md flex flex-col flex-grow">
        <h3 className="font-h3 text-h3 text-primary leading-tight line-clamp-2">{item.name}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{item.categoryLabel}</p>
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 min-w-0 mt-xs">
          <span className="material-symbols-outlined text-[16px] flex-shrink-0">location_on</span>
          <span className="truncate">{item.location}</span>
        </p>
        <div className="flex items-end justify-between border-t-2 border-primary pt-md mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="font-price-display text-price-display text-primary tracking-tight">{item.price}</span>
            <span className="font-body-md text-body-md text-on-surface-variant">{item.period}</span>
          </div>
          <div
            className="px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-acid-lime hover:text-primary transition-colors whitespace-nowrap"
          >
            View Details
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────── Page ───────────────────────────

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const requestedCategory = searchParams.get('category') || 'all';
  const category = CATEGORY_FILTERS.some((f) => f.id === requestedCategory) ? requestedCategory : 'all';

  const [input, setInput] = useState(query);
  const [properties, setProperties] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Keep the header input in sync when navigating between searches.
  useEffect(() => {
    setInput(query);
  }, [query]);

  // Load stays + marketplace items once (async so the Supabase path works).
  useEffect(() => {
    let active = true;
    const loadProperties = () =>
      isSupabaseConfigured
        ? listProperties()
            .then((rows) => {
              if (active && !rows.length) return demoProperties;
              return rows;
            })
            .catch(() => demoProperties)
        : Promise.resolve(demoProperties);
    Promise.all([loadProperties(), getMarketplaceItems()])
      .then(([propertyRows, marketItems]) => {
        if (!active) return;
        setProperties(propertyRows.map((row) => {
          const demo = demoProperties.find((d) => d.id === row.id) || demoProperties.find((d) => d.name === row.name) || {};
          return {
            kind: 'stay',
            id: row.id,
            university: row.universities?.name || row.university || 'Kolkata University',
            area: row.area,
            name: row.name,
            type: row.property_type === 'pg' ? 'PG' : (row.type || 'PG'),
            distance: row.distance_to_university_km != null ? `${row.distance_to_university_km} km` : (row.distance || '0.5 km'),
            rating: row.profiles?.owner_rating != null ? String(row.profiles.owner_rating) : (demo.rating || '4.8'),
            price: row.monthly_rent != null ? `₹${Number(row.monthly_rent).toLocaleString('en-IN')}` : (row.price || '₹8,500'),
            badge: row.is_ai_inspected ? 'AI Inspected' : '✓ Verified',
            badgeClass: row.is_ai_inspected ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary',
            amenities: row.amenities || [],
            image: row.cover_image_url || demo.image || FALLBACK_PROPERTY_IMAGE,
            availability: isAvailableProperty(row) ? 'Available' : 'On hold',
          };
        }));
        setItems(marketItems.map((item) => ({
          kind: 'rental',
          id: item.id,
          name: item.name,
          category: item.category,
          categoryLabel: item.categoryLabel || item.category,
          price: item.price,
          period: item.period,
          location: item.location || (item.category === 'scooters' || item.category === 'bikes' ? 'KeyLo mobility hubs, Kolkata' : 'KeyLo pickup hubs, Kolkata'),
          image: item.image,
          useImage: item.useImage,
          badges: item.badges || [],
          availability: item.listerItemId
            ? (item.availability === 'available' ? 'Available' : 'Rented')
            : 'Available',
        })));
        setLoading(false);
      })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const results = useMemo(() => {
    const tokens = normalize(query).split(' ').filter(Boolean);
    const stayMatches = (p) => matchesQuery(`${p.name} ${p.university} ${p.area} ${p.type} Kolkata`, tokens);
    const itemMatches = (i) => matchesQuery(`${i.name} ${i.categoryLabel} ${i.category} ${i.location} Kolkata`, tokens);

    if (category === 'stay') return properties.filter(stayMatches);
    if (category === 'all') return [...properties.filter(stayMatches), ...items.filter(itemMatches)];
    const bucket = CATEGORY_BUCKETS[category] || [];
    return items.filter((item) => bucket.includes(item.category) && itemMatches(item));
  }, [properties, items, query, category]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const q = input.trim();
    // A fresh search starts from All Results — category filters are re-applied
    // afterwards via the buttons below.
    setSearchParams(q ? { q } : {});
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategory = (categoryId) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryId === 'all') next.delete('category');
      else next.set('category', categoryId);
      return next;
    });
  };

  const categoryLabel = CATEGORY_FILTERS.find((f) => f.id === category)?.label || 'All Results';

  return (
    <div>
      {/* ── Search header ── */}
      <section className="w-full bg-primary py-xl lg:py-2xl px-margin-mobile lg:px-margin-desktop border-b-2 border-primary">
        <div className="max-w-5xl mx-auto flex flex-col gap-lg">
          <div>
            <p className="font-label-caps text-label-caps text-acid-lime uppercase mb-sm">KeyLo Kolkata search</p>
            <h1 className="font-heading text-h1-mobile lg:text-h2 text-on-primary tracking-tight uppercase font-bold">
              {query ? <>Results for “{query}”</> : 'Search Kolkata'}
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 mt-xs max-w-2xl">
              Find verified student stays and rentals near your college or area.
            </p>
          </div>

          {/* Search again */}
          <form
            onSubmit={handleSubmit}
            className="relative w-full flex flex-col sm:flex-row bg-surface-container-lowest border-2 border-primary focus-within:ring-4 ring-acid-lime p-2 sm:p-0 sm:h-[64px] sm:items-center sm:pr-2"
          >
            <span className="material-symbols-outlined absolute left-4 top-[22px] sm:top-1/2 sm:-translate-y-1/2 text-primary">search</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="w-full h-12 sm:h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-primary placeholder:text-on-surface-variant"
              placeholder="Search Adamas, Jadavpur, Calcutta University..."
              type="search"
              aria-label="Search Kolkata"
            />
            <button type="submit" className="w-full sm:w-auto h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-acid-lime hover:text-primary transition-colors whitespace-nowrap mt-2 sm:mt-0">
              SEARCH
            </button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-sm" role="group" aria-label="Filter results by category">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleCategory(filter.id)}
                aria-pressed={category === filter.id}
                className={`flex items-center gap-1.5 px-md py-sm border-2 border-primary font-label-caps text-[10px] sm:text-label-caps transition-colors ${
                  category === filter.id
                    ? 'bg-surface-container-lowest text-primary shadow-[-3px_3px_0px_0px_#000000] hover:bg-acid-lime hover:text-primary'
                    : 'bg-surface-container-lowest text-primary hover:bg-acid-lime hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section ref={resultsRef} className="w-full px-margin-mobile lg:px-margin-desktop py-xl bg-surface min-h-[40vh]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-md pb-lg border-b-2 border-primary mb-xl">
            <span className="font-label-caps text-label-caps text-primary">
              {loading
                ? 'Searching Kolkata...'
                : `Showing ${results.length} ${results.length === 1 ? 'result' : 'results'} in ${categoryLabel}${query ? ` for “${query}”` : ''}`}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Stays & rentals near your college</span>
          </div>

          {loading ? (
            <LoadingScreen label="Searching Kolkata..." />
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
              {results.map((result) =>
                result.kind === 'stay'
                  ? <StayCard key={`stay-${result.id}`} property={result} />
                  : <RentalCard key={`rental-${result.id}`} item={result} navigate={navigate} />
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-xl">
              <div className="bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-lg lg:p-xl flex flex-col items-center text-center gap-md">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary text-acid-lime flex items-center justify-center border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>search_off</span>
                </div>

                {/* Heading + copy */}
                <div>
                  <h2 className="font-h3 text-h3 text-primary">
                    {query && category !== 'all'
                      ? <>No {categoryLabel.toLowerCase()} results for “{query}”</>
                      : query
                        ? <>No results found for “{query}”</>
                        : <>Nothing in {categoryLabel} yet</>}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-[28rem] mx-auto mt-sm">
                    {query && category !== 'all'
                      ? <>Nothing in {categoryLabel.toLowerCase()} matches “{query}”. Try another category, or search across everything in Kolkata.</>
                      : query
                        ? <>We couldn&apos;t find anything matching “{query}” in Kolkata. Check the spelling, try a nearby area, or use one of the popular searches below.</>
                        : <>We don&apos;t have anything listed in {categoryLabel.toLowerCase()} right now. Try another category, or browse everything available in Kolkata.</>}
                  </p>
                </div>

                {/* Popular searches — only meaningful when a query was typed */}
                {query && (
                  <div className="flex flex-col items-center gap-sm w-full">
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Try searching for</p>
                    <div className="flex flex-wrap justify-center gap-sm">
                      {['Adamas University', 'Jadavpur University', 'Calcutta University', 'Scooter', 'Laptop', 'Furniture'].map((suggestion) => (
                        <Link
                          key={suggestion}
                          to={`/search?q=${encodeURIComponent(suggestion)}`}
                          className="px-md py-sm bg-surface-container border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">search</span>
                          {suggestion}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-sm mt-sm w-full">
                  <Link to="/find-a-stay" className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_0px_#000000] transition-all">
                    Browse all stays
                  </Link>
                  <Link to="/rentals" className="px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-acid-lime hover:text-primary transition-colors">
                    Explore rentals
                  </Link>
                  {category !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleCategory('all')}
                      className="px-md py-sm bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
