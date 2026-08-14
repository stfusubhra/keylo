import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { listProperties } from '../lib/supabaseData';
import { demoProperties } from '../lib/demoCatalog';

/* ───────────────────────────────────
   Property Card (restored from original)
─────────────────────────────────── */
const PropertyCard = ({ property, isFeatured }) => (
  <Link
    to={`/property/${property.id}`}
    className="flex-shrink-0 group cursor-pointer block"
    aria-label={`View ${property.name} — ${property.price}/month near ${property.university}`}
  >
    <div className={`w-[220px] sm:w-[260px] border-2 border-primary bg-surface-container-lowest shadow-[6px_6px_0px_0px_#000000] overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_0px_#000000] ${isFeatured ? 'ring-2 ring-acid-lime ring-offset-2 ring-offset-surface-container-highest' : ''}`}>
      <div className="relative h-[160px] sm:h-[200px] overflow-hidden border-b-2 border-primary">
        <img loading="lazy" src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className={`absolute top-2 left-2 px-2 py-1 border-2 border-primary font-label-caps text-[9px] sm:text-[10px] uppercase shadow-[2px_2px_0px_0px_#000000] ${property.badgeClass}`}>
          {property.badge}
        </div>
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-hot-pink border-2 border-primary px-2 py-1 font-label-caps text-[9px] text-white shadow-[2px_2px_0px_0px_#000000]">
            FEATURED
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-h3 text-h3 text-primary text-[13px] sm:text-[15px] font-bold leading-tight mb-1 line-clamp-1">
          {property.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant text-[11px] sm:text-[12px] mb-2">
          Near {property.university.replace('Near ', '')} · {property.area}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant text-[10px] sm:text-[11px] mb-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">person</span>
          Listed by {property.lister}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-price-display text-price-display text-primary text-[18px] sm:text-[22px] leading-none">{property.price}</p>
            <p className="font-body-md text-[10px] text-on-surface-variant">/ month</p>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0">arrow_forward</span>
        </div>
      </div>
    </div>
  </Link>
);

export default function LandingPage() {
  const [properties, setProperties] = useState(demoProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState('jadavpur');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const navigate = useNavigate();

  // Load properties from backend if Supabase is active
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    listProperties()
      .then((rows) => {
        if (!active || !rows?.length) return;
        setProperties(rows.map((row) => {
          const demo = demoProperties.find((d) => d.id === row.id || d.name === row.name) || {};
          return {
            id: row.id,
            university: row.universities?.name || 'Kolkata University',
            area: row.area || demo.area || 'Kolkata',
            name: row.name,
            type: row.property_type === 'pg' ? 'PG' : 'Flat',
            distance: `${row.distance_to_university_km || 1} km`,
            price: `₹${Number(row.monthly_rent || 8000).toLocaleString('en-IN')}`,
            priceNum: Number(row.monthly_rent) || 0,
            status: 'Verified',
            badge: row.is_ai_inspected ? 'AI Inspected' : '✓ Verified',
            badgeClass: row.is_ai_inspected ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary',
            image: row.cover_image_url || demo.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
            lister: row.ownerName || demo.lister || 'Riya Sen',
            featured: Boolean(row.is_featured || demo.featured),
          };
        }));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Compute live campus hub statistics directly from the database inventory
  const campusHubs = useMemo(() => {
    const hubDefinitions = [
      {
        id: 'jadavpur',
        name: 'Jadavpur University',
        matchKeywords: ['jadavpur'],
        zone: 'South Kolkata',
        fallbackImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'adamas',
        name: 'Adamas University',
        matchKeywords: ['adamas'],
        zone: 'Barasat',
        fallbackImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cu',
        name: 'Calcutta University',
        matchKeywords: ['calcutta', 'cu'],
        zone: 'College Street',
        fallbackImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'iem',
        name: 'IEM & Sector V',
        matchKeywords: ['xavier', 'iem', 'sector v', 'new town', 'salt lake'],
        zone: 'Salt Lake',
        fallbackImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      },
    ];

    return hubDefinitions.map((hub) => {
      const matching = properties.filter((p) =>
        hub.matchKeywords.some((kw) => `${p.university} ${p.area} ${p.name}`.toLowerCase().includes(kw))
      );

      const count = matching.length;
      const countLabel = count === 1 ? '1 verified stay' : `${count} verified stays`;

      const prices = matching
        .map((p) => (p.priceNum ? p.priceNum : parseInt(String(p.price || '').replace(/[^0-9]/g, ''), 10)))
        .filter((n) => !isNaN(n) && n > 0);

      const avgRent = prices.length
        ? `₹${Math.round(prices.reduce((a, b) => a + b, 0) / prices.length).toLocaleString('en-IN')}/mo`
        : '₹7,500/mo';

      const top = matching[0] || null;

      return {
        id: hub.id,
        name: hub.name,
        zone: top?.area || hub.zone,
        pgs: countLabel,
        count: count,
        rent: avgRent,
        image: top?.image || hub.fallbackImage,
        pick: top ? `${top.name} — ${top.distance} from campus` : `${hub.name} Student Residences`,
        propertyId: top?.id,
        universityFilter: hub.name.includes('Calcutta') ? 'University of Calcutta' : (hub.name.includes('IEM') ? "St. Xavier's University Kolkata" : hub.name),
      };
    });
  }, [properties]);

  const selectedCampus = campusHubs.find((c) => c.id === selectedCampusId) || campusHubs[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[90vh] flex items-center pt-16 pb-12 px-margin-mobile md:px-margin-desktop z-10 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-20 order-2 lg:order-1">
            <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-6 uppercase leading-[0.95] tracking-tighter font-bold">
              Your Space.<br />
              Your Rules.<br />
              <span className="bg-acid-lime px-4 py-2 mt-4 inline-block transform -rotate-2 border-2 border-primary shadow-[8px_8px_0px_0px_#000000] brand-bounce">keylo</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 text-balance leading-relaxed" style={{ maxWidth: '520px' }}>
              Find verified student homes near Kolkata universities, rent what you need, and keep your security deposit protected — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link to="/find-a-stay" className="w-full sm:w-auto px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
                FIND MY SPACE <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link to="/rentals" className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center">
                EXPLORE RENTALS
              </Link>
            </div>

            {/* Know our features (Interactive 3D Showcase) */}
            <Link
              to="/3d-world"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#C7F000] transition-all mb-6 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-acid-lime text-lg">explore</span>
              KNOW OUR FEATURES
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-purple text-white border-2 border-primary rounded-full font-label-caps text-[10px]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                AI INSPECTED
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-acid-lime text-primary border-2 border-primary rounded-full font-label-caps text-[10px]">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                DEPOSIT PROTECTED
              </div>
            </div>
          </div>

          {/* Isometric Property Card Columns */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] lg:h-[700px] order-1 lg:order-2 overflow-hidden" style={{ perspective: '1200px' }} aria-label="Featured properties">
            <div className="absolute inset-0 bg-surface-container-highest border-2 border-primary shadow-[12px_12px_0px_0px_#000000] overflow-hidden pointer-events-none transform lg:rotate-1" />
            
            <div className="absolute inset-[-20%] w-[140%] h-[140%] flex gap-4 sm:gap-6 justify-center items-start"
                 style={{ transform: 'rotateX(15deg) rotateZ(-15deg) rotateY(15deg)' }}>
                
                {/* Column 1 - scrolls up */}
                <div className="animate-scroll-up flex flex-col gap-4 sm:gap-6 mt-[50px]">
                  {[...demoProperties, ...demoProperties, ...demoProperties].map((property, idx) => (
                    <PropertyCard key={`col1-${idx}`} property={property} isFeatured={property.featured} />
                  ))}
                </div>

                {/* Column 2 - scrolls down */}
                <div className="animate-scroll-down flex flex-col gap-4 sm:gap-6 mt-[-150px]">
                  {[...demoProperties, ...demoProperties, ...demoProperties].reverse().map((property, idx) => (
                    <PropertyCard key={`col2-${idx}`} property={property} isFeatured={property.featured} />
                  ))}
                </div>

                {/* Column 3 - scrolls up (desktop only) */}
                <div className="hidden md:flex animate-scroll-up flex-col gap-4 sm:gap-6 mt-[100px]">
                  {[...demoProperties, ...demoProperties, ...demoProperties].map((property, idx) => (
                    <PropertyCard key={`col3-${idx}`} property={property} isFeatured={property.featured} />
                  ))}
                </div>
            </div>
            
            {/* Gradient fades */}
            <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-surface-container-highest to-transparent z-10 pointer-events-none transform lg:rotate-1" />
            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-surface-container-highest to-transparent z-10 pointer-events-none transform lg:rotate-1" />

            {/* Floating trust badges — desktop only */}
            <div className="hidden lg:flex absolute top-6 left-[-10px] bg-surface-container-lowest border-2 border-primary p-3 shadow-[4px_4px_0px_0px_#000000] items-center gap-2 z-20 hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-[#7C3AED] text-2xl">verified</span>
              <div>
                <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Trust Score</p>
                <p className="font-h3 text-[13px] text-primary leading-none">85+/100</p>
              </div>
            </div>
            <div className="hidden lg:flex absolute bottom-6 right-[-10px] bg-acid-lime border-2 border-primary px-3 py-2 shadow-[4px_4px_0px_0px_#000000] items-center gap-2 z-20 hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-primary text-xl">shield</span>
              <p className="font-label-caps text-[10px] text-primary uppercase font-bold">Deposit Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH ─── */}
      <section className="w-full bg-primary py-12 lg:py-20 px-margin-mobile md:px-margin-desktop relative z-10 border-y-2 border-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-h2 text-h2 text-on-primary mb-8 text-center uppercase tracking-tight">Where are you studying in Kolkata?</h2>
          <div className="w-full flex flex-col gap-4">
            <form className="relative w-full flex flex-col sm:flex-row bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#C7F000] group focus-within:ring-4 ring-[#C7F000] ring-offset-0 transition-all p-2 sm:p-0 sm:h-[72px] sm:items-center sm:pr-2" onSubmit={handleSearchSubmit}>
              <span className="material-symbols-outlined absolute left-4 top-[22px] sm:top-1/2 sm:-translate-y-1/2 text-primary">search</span>
              <input
                className="w-full h-12 sm:h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-primary placeholder:text-on-surface-variant"
                placeholder="Search Adamas, Jadavpur, Calcutta University..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="w-full sm:w-auto h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors whitespace-nowrap mt-2 sm:mt-0">
                SEARCH
              </button>
            </form>
            {/* Quick filter tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link to="/search?category=stay" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">bed</span> Stay
              </Link>
              <Link to="/search?category=mobility" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">electric_scooter</span> Mobility
              </Link>
              <Link to="/search?category=electronics" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">devices</span> Electronics
              </Link>
              <Link to="/search?category=furniture" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">chair</span> Furniture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="w-full py-12 lg:py-20 px-margin-mobile md:px-margin-desktop bg-surface relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 lg:mb-16 gap-4 sm:gap-6 border-b-2 border-primary pb-6 sm:pb-8">
            <h2 className="font-h2 text-2xl sm:text-3xl lg:text-h2 text-primary uppercase leading-tight tracking-tight md:whitespace-nowrap">Everything students need in one page.</h2>
            <p className="font-body-md text-on-surface-variant text-balance text-xs sm:text-sm lg:text-base max-w-sm">No more dealing with multiple brokers or sketchy listings. Rent your entire lifestyle securely.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Card 1: Find a Home */}
            <Link to="/find-a-stay" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85" alt="Student PG room" />
                <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-acid-lime border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-primary text-[16px] sm:text-[20px]">real_estate_agent</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[16px] sm:text-[20px] text-primary mb-1 sm:mb-2 uppercase">Find a Home</h3>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">PGs, Hostels, &amp; Co-living spaces verified for students.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-[10px] sm:text-label-caps text-primary group-hover:text-electric-purple transition-colors">
                  Explore <span className="material-symbols-outlined text-xs sm:text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 2: Rent Mobility */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer lg:mt-8">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1648204834832-78e68052c04f?auto=format&fit=crop&w=1200&q=85"
                  alt="A sleek electric scooter parked against a brutalist concrete wall"
                />
                <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#FF3366] border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-white text-[16px] sm:text-[20px]">two_wheeler</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[16px] sm:text-[20px] text-primary mb-1 sm:mb-2 uppercase">Rent Mobility</h3>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">Electric scooters &amp; bikes for easy campus commutes.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-[10px] sm:text-label-caps text-primary group-hover:text-[#FF3366] transition-colors">
                  View Rides <span className="material-symbols-outlined text-xs sm:text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 3: Rent Essentials */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85" alt="Laptop on desk" />
                <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#00E5FF] border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-primary text-[16px] sm:text-[20px]">laptop_mac</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[16px] sm:text-[20px] text-primary mb-1 sm:mb-2 uppercase">Rent Essentials</h3>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">Laptops, monitors, and study gear without the heavy price tag.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-[10px] sm:text-label-caps text-primary group-hover:text-[#00E5FF] transition-colors">
                  Browse Tech <span className="material-symbols-outlined text-xs sm:text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 4: Stay Protected */}
            <Link to="/keylo-vault" className="group bg-[#7C3AED] border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer lg:mt-8">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(199,240,0,0.2)_50%,transparent_100%)] animate-[scan_3s_ease-in-out_infinite]"></div>
                <img loading="lazy" className="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85" alt="Digital security" />
                <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-[#7C3AED] text-[16px] sm:text-[20px]">shield_locked</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[16px] sm:text-[20px] text-white mb-1 sm:mb-2 uppercase">Stay Protected</h3>
                <p className="font-body-md text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">AI-inspected properties and secure deposit management.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-[10px] sm:text-label-caps text-[#C7F000]">
                  Learn More <span className="material-symbols-outlined text-xs sm:text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CAMPUS PROXIMITY ─── */}
      <section className="w-full py-12 lg:py-20 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y-2 border-primary relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 lg:mb-14">
            <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight mb-3">Find stays near your campus</h2>
            <p className="font-body-md text-on-surface-variant" style={{ maxWidth: '480px' }}>Select your university to see verified PGs, average rents, and top picks in the area.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Campus selector */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {campusHubs.map((campus) => (
                <button
                  key={campus.id}
                  onClick={() => setSelectedCampusId(campus.id)}
                  className={`w-full p-4 border-2 border-primary text-left cursor-pointer transition-all ${
                    selectedCampus.id === campus.id
                      ? 'bg-acid-lime text-primary shadow-[4px_4px_0px_0px_#000] -translate-y-0.5 font-bold'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-h3 text-[14px] sm:text-[16px] font-bold">{campus.name}</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                  <p className="font-body-md text-xs opacity-70 mt-0.5">{campus.zone} · {campus.pgs}</p>
                </button>
              ))}

              {/* Show more button linking to find-a-stay */}
              <Link
                to="/find-a-stay"
                className="w-full p-3.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-xs font-bold text-primary hover:bg-acid-lime hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_#000] transition-all flex items-center justify-between group mt-1"
              >
                <span>SHOW MORE</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            {/* Campus detail card */}
            <div className="lg:col-span-8 bg-surface-container-lowest border-2 border-primary p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000000]">
              <div className="h-48 sm:h-56 w-full border-2 border-primary overflow-hidden relative mb-5">
                <img src={selectedCampus.image} alt={selectedCampus.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-primary text-on-primary border-2 border-primary px-3 py-1 font-label-caps text-[10px] font-bold shadow-[2px_2px_0px_0px_#C7F000]">
                  {selectedCampus.name}
                </div>
              </div>

              <h3 className="font-h2 text-[20px] sm:text-[24px] text-primary font-bold mb-1">{selectedCampus.pick}</h3>
              <p className="font-body-md text-on-surface-variant text-sm mb-5">{selectedCampus.zone} · {selectedCampus.pgs}</p>
              
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="px-4 py-2 bg-surface-container-low border border-primary/20">
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Avg. Rent</p>
                  <p className="font-price-display text-lg font-bold text-primary">{selectedCampus.rent}</p>
                </div>
                <div className="px-4 py-2 bg-surface-container-low border border-primary/20">
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Available</p>
                  <p className="font-price-display text-lg font-bold text-primary">{selectedCampus.pgs}</p>
                </div>
              </div>

              <Link
                to={`/find-a-stay?university=${encodeURIComponent(selectedCampus.universityFilter)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-acid-lime border-2 border-primary font-label-caps text-primary font-bold hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] transition-all"
              >
                Browse stays near {selectedCampus.name.split(' ')[0]} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROOM VERIFICATION ─── */}
      <section className="w-full py-12 lg:py-20 px-margin-mobile md:px-margin-desktop bg-surface relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 lg:mb-14">
            <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight mb-3">Every room, verified before you move in</h2>
            <p className="font-body-md text-on-surface-variant" style={{ maxWidth: '520px' }}>Click the markers on the room below to see how Keylo verifies every property with AI-powered 360° inspections.</p>
          </div>

          <div className="border-2 border-primary bg-surface-container-lowest p-4 sm:p-8 shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
            <div className="relative h-[280px] sm:h-[400px] w-full border-2 border-primary overflow-hidden mb-5">
              <img
                src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=85"
                alt="Verified student room"
                className="w-full h-full object-cover"
              />

              {/* Hotspot: AI Scan */}
              <button
                onClick={() => setActiveHotspot('ai-scan')}
                className={`absolute top-1/4 left-1/4 w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center font-bold shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all ${activeHotspot === 'ai-scan' ? 'bg-primary text-on-primary scale-110' : 'bg-acid-lime text-primary hover:scale-105'}`}
              >
                <span className="material-symbols-outlined text-lg">camera_enhance</span>
              </button>

              {/* Hotspot: Escrow */}
              <button
                onClick={() => setActiveHotspot('escrow')}
                className={`absolute top-1/3 right-1/4 w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center font-bold shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all ${activeHotspot === 'escrow' ? 'bg-primary text-on-primary scale-110' : 'bg-electric-purple text-white hover:scale-105'}`}
              >
                <span className="material-symbols-outlined text-lg">lock</span>
              </button>

              {/* Hotspot: Amenities */}
              <button
                onClick={() => setActiveHotspot('amenities')}
                className={`absolute bottom-1/4 left-1/3 w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center font-bold shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all ${activeHotspot === 'amenities' ? 'bg-primary text-on-primary scale-110' : 'bg-sky-cyan text-primary hover:scale-105'}`}
              >
                <span className="material-symbols-outlined text-lg">wifi</span>
              </button>
            </div>

            {/* Info panel */}
            <div className="bg-surface-container-low border-2 border-primary p-4 shadow-[3px_3px_0px_0px_#000]">
              {activeHotspot ? (
                <div>
                  <p className="font-label-caps text-[10px] text-electric-purple font-bold uppercase mb-1">
                    {activeHotspot === 'ai-scan' && '360° Condition Report'}
                    {activeHotspot === 'escrow' && 'Deposit Escrow Lock'}
                    {activeHotspot === 'amenities' && 'Verified Amenities'}
                  </p>
                  <p className="font-body-md text-primary text-sm">
                    {activeHotspot === 'ai-scan' && 'Every wall, surface, and appliance is photographed and logged before you move in — so you never get blamed for pre-existing damage.'}
                    {activeHotspot === 'escrow' && 'Your security deposit sits in a regulated bank escrow account. The landlord can\'t touch it without verified evidence.'}
                    {activeHotspot === 'amenities' && 'WiFi speed, power backup, kitchen access, and meal plans are verified by our student audit team before listing.'}
                  </p>
                </div>
              ) : (
                <p className="font-body-md text-on-surface-variant text-sm">Click any marker on the room image to learn how we verify it.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEPOSIT PROTECTION ─── */}
      <section className="w-full py-12 lg:py-20 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y-2 border-primary relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-electric-purple text-white border-2 border-primary rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">shield_locked</span>
            </div>
            <div>
              <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight mb-2">Your deposit is always safe</h2>
              <p className="font-body-md text-on-surface-variant" style={{ maxWidth: '480px' }}>Keylo Vault locks your security deposit in a regulated bank escrow account. Landlords can&apos;t deduct without verified proof.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 bg-surface-container-lowest border-2 border-primary shadow-[4px_4px_0px_0px_#000]">
              <span className="material-symbols-outlined text-electric-purple text-2xl mb-3">camera_enhance</span>
              <h3 className="font-h3 text-[14px] text-primary font-bold uppercase mb-1">Pre-move-in scan</h3>
              <p className="font-body-md text-on-surface-variant text-xs">360° AI condition report documents everything before key handover.</p>
            </div>
            <div className="p-5 bg-surface-container-lowest border-2 border-primary shadow-[4px_4px_0px_0px_#000]">
              <span className="material-symbols-outlined text-acid-lime text-2xl mb-3">account_balance</span>
              <h3 className="font-h3 text-[14px] text-primary font-bold uppercase mb-1">Bank escrow</h3>
              <p className="font-body-md text-on-surface-variant text-xs">Funds held in regulated escrow accounts — not in the landlord&apos;s pocket.</p>
            </div>
            <div className="p-5 bg-surface-container-lowest border-2 border-primary shadow-[4px_4px_0px_0px_#000]">
              <span className="material-symbols-outlined text-hot-pink text-2xl mb-3">verified</span>
              <h3 className="font-h3 text-[14px] text-primary font-bold uppercase mb-1">Full refund</h3>
              <p className="font-body-md text-on-surface-variant text-xs">Automatic deposit return when you move out — zero unfair deductions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="w-full py-16 lg:py-24 px-margin-mobile md:px-margin-desktop bg-surface relative z-10">
        <div className="max-w-4xl mx-auto bg-acid-lime border-2 border-primary p-8 sm:p-14 shadow-[12px_12px_0px_0px_#000000] text-center">
          <h2 className="font-h1 text-[32px] sm:text-[48px] text-primary uppercase font-bold leading-tight mb-4">
            Ready to find your space?
          </h2>
          <p className="font-body-lg text-primary/80 mb-8 max-w-lg mx-auto">
            No broker fees. Verified properties near top Kolkata universities. 100% deposit protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-a-stay" className="px-8 py-4 bg-primary text-on-primary border-2 border-primary font-label-caps hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center justify-center gap-2 font-bold">
              FIND MY SPACE <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link to="/rentals" className="px-8 py-4 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center font-bold">
              EXPLORE RENTALS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
