import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoProperties } from '../lib/demoCatalog';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div>
      {/* Demo badge — visible on all pages during hackathon */}
      <div className="fixed top-4 right-4 z-50">
        <a
          href="https://github.com/stfusubhra/keylo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps shadow-[4px_4px_0px_0px_#C7F000] hover:bg-acid-lime hover:text-primary hover:border-acid-lime transition-all text-xs uppercase tracking-wider"
          aria-label="View source code on GitHub"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span className="hidden sm:inline">Hackathon Demo</span>
          <span className="sm:hidden">Demo</span>
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[90vh] flex items-center pt-16 pb-12 px-margin-mobile md:px-margin-desktop z-10 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-20 order-2 lg:order-1">
            <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-6 uppercase leading-[0.95] tracking-tighter font-bold">
              Your Space.<br />
              Your Rules.<br />
              <span className="bg-acid-lime px-4 py-2 mt-4 inline-block transform -rotate-2 border-2 border-primary shadow-[8px_8px_0px_0px_#000000]">keylo</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 text-balance leading-relaxed" style={{ maxWidth: '520px' }}>
              Find verified student homes near Kolkata universities, rent what you need, and keep your security deposit protected — all in one place.
            </p>
            {/* CTAs — full width on mobile, inline on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/find-a-stay" className="w-full sm:w-auto px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
                FIND MY SPACE <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link to="/rentals" className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center">
                EXPLORE RENTALS
              </Link>
            </div>
            {/* Floating Badges */}
            <div className="flex flex-wrap gap-3">
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

          {/* Visual Area — horizontal scrolling property carousel */}
          <div className="lg:col-span-6 relative h-[260px] sm:h-[380px] lg:h-[700px] order-1 lg:order-2 overflow-hidden" aria-label="Featured properties carousel">
            <div className="absolute inset-0 bg-surface-container-highest border-2 border-primary shadow-[12px_12px_0px_0px_#000000] transform lg:rotate-1 overflow-hidden">
              {/* Gradient fade on edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface-container-highest to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-container-highest to-transparent z-10 pointer-events-none" />

              {/* Scrolling track — duplicated for seamless loop */}
              <div className="animate-scroll flex gap-3 h-full items-center py-4" style={{ width: 'max-content' }}>
                {/* Two copies of the same cards for infinite loop */}
                {[...demoProperties, ...demoProperties].map((property, idx) => {
                  const isFeatured = property.featured;
                  return (
                    <Link
                      key={`${property.id}-${idx}`}
                      to={`/property/${property.id}`}
                      className="flex-shrink-0 group cursor-pointer"
                      aria-label={`View ${property.name} — ${property.price}/month near ${property.university}`}
                    >
                      <div className={`w-[220px] sm:w-[260px] border-2 border-primary bg-surface-container-lowest shadow-[6px_6px_0px_0px_#000000] overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_0px_#000000] ${isFeatured ? 'ring-2 ring-acid-lime ring-offset-2 ring-offset-surface-container-highest' : ''}`}>
                        {/* Image */}
                        <div className="relative h-[160px] sm:h-[200px] overflow-hidden border-b-2 border-primary">
                          <img
                            loading="lazy"
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Badge */}
                          <div className={`absolute top-2 left-2 px-2 py-1 border-2 border-primary font-label-caps text-[9px] sm:text-[10px] uppercase shadow-[2px_2px_0px_0px_#000000] ${property.badgeClass}`}>
                            {property.badge}
                          </div>
                          {/* Featured tag */}
                          {isFeatured && (
                            <div className="absolute top-2 right-2 bg-hot-pink border-2 border-primary px-2 py-1 font-label-caps text-[9px] text-white shadow-[2px_2px_0px_0px_#000000]">
                              FEATURED
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-3">
                          <h3 className="font-h3 text-h3 text-primary text-[13px] sm:text-[15px] font-bold leading-tight mb-1 line-clamp-1">
                            {property.name}
                          </h3>
                          <p className="font-body-md text-body-md text-on-surface-variant text-[11px] sm:text-[12px] mb-2">
                            Near {property.university.replace('Near ', '')} · {property.area}
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
                })}
              </div>
            </div>

            {/* Floating trust badges — desktop only */}
            <div className="hidden lg:flex absolute top-6 left-[-10px] bg-surface-container-lowest border-2 border-primary p-3 shadow-[4px_4px_0px_0px_#000000] items-center gap-2 z-20">
              <span className="material-symbols-outlined text-[#7C3AED] text-2xl">verified</span>
              <div>
                <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Trust Score</p>
                <p className="font-h3 text-[13px] text-primary leading-none">85+/100</p>
              </div>
            </div>
            <div className="hidden lg:flex absolute bottom-6 right-[-10px] bg-acid-lime border-2 border-primary px-3 py-2 shadow-[4px_4px_0px_0px_#000000] items-center gap-2 z-20">
              <span className="material-symbols-outlined text-primary text-xl">shield</span>
              <p className="font-label-caps text-[10px] text-primary uppercase font-bold">Deposit Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
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
                onChange={handleSearch}
              />
              <button type="submit" className="w-full sm:w-auto h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors whitespace-nowrap mt-2 sm:mt-0">
                SEARCH
              </button>
            </form>
            {/* Quick filter tags — navigate to a pre-filtered search */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link to="/search?category=stay" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">bed</span>
                Stay
              </Link>
              <Link to="/search?category=mobility" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">electric_scooter</span>
                Mobility
              </Link>
              <Link to="/search?category=electronics" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">devices</span>
                Electronics
              </Link>
              <Link to="/search?category=furniture" className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">chair</span>
                Furniture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 lg:py-20 px-margin-mobile md:px-margin-desktop bg-surface relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 lg:mb-16 gap-6 border-b-2 border-primary pb-8">
            <h2 className="font-h2 text-h2 text-primary uppercase leading-tight tracking-tight" style={{ maxWidth: '480px' }}>Everything students need, in one place.</h2>
            <p className="font-body-md text-on-surface-variant text-balance" style={{ maxWidth: '384px' }}>No more dealing with multiple brokers or sketchy listings. Rent your entire lifestyle securely.</p>
          </div>
          {/* Cards — 2-col grid on mobile, 4-col on lg. No staggered mt on mobile. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Card 1 */}
            <Link to="/find-a-stay" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85"
                  alt="A bright, minimalist student PG room interior"
                />
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

            {/* Card 2 */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer lg:mt-8">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85"
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

            {/* Card 3 */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85"
                  alt="Close up of a premium laptop and tablet on a clean white desk setup"
                />
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

            {/* Card 4 */}
            <Link to="/keylo-vault" className="group bg-[#7C3AED] border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer lg:mt-8">
              <div className="h-32 sm:h-48 w-full border-b-2 border-primary relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(199,240,0,0.2)_50%,transparent_100%)] animate-[scan_3s_ease-in-out_infinite]"></div>
                <img loading="lazy"
                  className="w-full h-full object-cover opacity-60"
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85"
                  alt="Abstract rendering of digital security"
                />
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
    </div>
  );
}
